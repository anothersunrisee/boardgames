import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  Sparkles,
  Check,
  X,
  Trophy,
  ArrowRight,
  Shuffle,
  Users,
  Edit2,
  Layers,
} from 'lucide-react'
import { useGameStore } from '../../store/useGameStore'
import { pickRandomCategories, type Category } from '../../data/game1-categories'
import { Button } from '../../components/ui/Button'
import { GameMascotBot } from '../../components/characters/GameMascotBot'
import { PlayerProfileAvatar } from '../../components/characters/PlayerProfileAvatar'
import { CHARACTER_PACK, getCharacterById } from '../../assets-library/characters'
import { HostUtilityBar } from '../../components/HostUtilityBar'
import { GameDesktopLayout } from '../../components/layout/GameDesktopLayout'
import { sfx } from '../../utils/sound'
import { syncHostRoomState, listenToPlayerActions } from '../../services/firebase'
import { detectDuplicateAnswers, type DuplicateGroup } from '../../utils/fuzzyMatch'

type RoundPhase = 'timer' | 'scoring'

export default function G1Round() {
  const navigate = useNavigate()
  const {
    players,
    roomCode,
    playMode,
    g1CurrentRound,
    g1UsedCategoryIds,
    g1NextRound,
    addScore,
    g1ShuffleCategory,
  } = useGameStore()

  const [category, setCategory] = useState<Category | null>(null)
  const [phase, setPhase] = useState<RoundPhase>('timer')
  const [timeLeft, setTimeLeft] = useState(30)
  const [isTimerRunning, setIsTimerRunning] = useState(true)
  const [failedPlayerIds, setFailedPlayerIds] = useState<string[]>([])
  const [phoneAnswers, setPhoneAnswers] = useState<Record<string, string>>({})
  const [duplicateGroups, setDuplicateGroups] = useState<DuplicateGroup[]>([])
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null)
  const [editAnswerText, setEditAnswerText] = useState('')
  const [selectedForMerge, setSelectedForMerge] = useState<string[]>([])
  const timerRef = useRef<number | null>(null)

  const handleShuffleCategory = () => {
    const newCat = g1ShuffleCategory()
    if (newCat) {
      sfx.playPop()
      setCategory(newCat)
    }
  }

  const handleUndoScoring = () => {
    sfx.playPop()
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    setPhase('timer')
    setTimeLeft(30)
    setIsTimerRunning(false)
    setFailedPlayerIds([])
    setSelectedForMerge([])
  }

  // Pick category on mount or when round changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    const [cat] = pickRandomCategories(1, g1UsedCategoryIds)
    setCategory(cat ?? null)
    setTimeLeft(30)
    setIsTimerRunning(true)
    setPhase('timer')
    setFailedPlayerIds([])
    setPhoneAnswers({})
    setDuplicateGroups([])
    setSelectedForMerge([])
  }, [g1CurrentRound])

  // Sync state ke Firebase Realtime untuk HP Controller
  useEffect(() => {
    if (!roomCode || !category) return
    syncHostRoomState(roomCode, {
      activeGame: 'game1',
      gamePhase: phase,
      gameState: {
        g1Prompt: category.prompt,
        g1RoundNum: g1CurrentRound,
        g1TimerSeconds: timeLeft,
      },
    })
  }, [roomCode, category, phase, g1CurrentRound, timeLeft])

  // Dengarkan jawaban yang masuk dari HP Controller
  useEffect(() => {
    if (!roomCode) return
    const unsubscribe = listenToPlayerActions(roomCode, (actionsMap) => {
      if (!actionsMap) return
      const nextAnswers: Record<string, string> = {}
      Object.values(actionsMap).forEach((action) => {
        if (action.type === 'submit_g1_answer' && action.payload?.answer) {
          nextAnswers[action.playerId] = action.payload.answer
        }
      })
      setPhoneAnswers(nextAnswers)
    })
    return () => unsubscribe()
  }, [roomCode])

  // Countdown timer logic
  useEffect(() => {
    if (phase !== 'timer') return

    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!)
            setIsTimerRunning(false)
            sfx.playBuzzer()
            triggerRevealPhase()
            return 0
          }
          if (prev <= 6) {
            sfx.playTick()
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isTimerRunning, timeLeft, phase])

  // Transition to Scoring / Reveal
  const triggerRevealPhase = () => {
    sfx.playBuzzer()
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    setPhase('scoring')

    if (playMode === 'multi_device') {
      // MODE MULTI-DEVICE (HP CONTROLLER):
      // Kumpulkan jawaban yang diketik pemain dari HP
      const items = players.map((p) => ({
        playerId: p.id,
        answer: phoneAnswers[p.id] || '',
      }))

      // Jalankan deteksi duplikasi otomatis (toleran typo & huruf berulang)
      const { duplicatePlayerIds, groups } = detectDuplicateAnswers(items)

      // Pemain tanpa jawaban di HP dianggap gagal
      players.forEach((p) => {
        if (!phoneAnswers[p.id]?.trim()) {
          duplicatePlayerIds.add(p.id)
        }
      })

      setFailedPlayerIds(Array.from(duplicatePlayerIds))
      setDuplicateGroups(groups)
    } else {
      // MODE 1 LAPTOP (OFFLINE 1 HOST):
      // Pemain menulis di kertas / catatan HP masing-masing di tongkrongan!
      // Semua pemain mulai dengan status UNIK (+2).
      // Host mendengarkan saat pemain membacakan jawaban, lalu klik pemain yang KEMBAR (-1).
      setFailedPlayerIds([])
      setDuplicateGroups([])
    }
  }

  if (!category || players.length === 0) {
    navigate('/game1/setup')
    return null
  }

  const isLastRound = g1CurrentRound >= 10
  const submittedCount = Object.keys(phoneAnswers).length

  // Host Override: Ganti status UNIK <-> KEMBAR manual
  const togglePlayerStatus = (playerId: string) => {
    sfx.playPop(650)
    setFailedPlayerIds((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId]
    )
  }

  // Host Override: Gabungkan 2 atau lebih jawaban menjadi Kembar (Merge)
  const handleMergeSelected = () => {
    if (selectedForMerge.length < 2) return
    sfx.playPop(750)
    setFailedPlayerIds((prev) => Array.from(new Set([...prev, ...selectedForMerge])))
    setSelectedForMerge([])
  }

  const toggleMergeSelect = (playerId: string) => {
    sfx.playPop(500)
    setSelectedForMerge((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId]
    )
  }

  // Edit Jawaban Manual (jika pemain typo parah atau kirim via suara)
  const handleSaveEditedAnswer = (playerId: string) => {
    if (!editAnswerText.trim()) return
    sfx.playSuccess()
    setPhoneAnswers((prev) => ({
      ...prev,
      [playerId]: editAnswerText.trim(),
    }))
    setEditingPlayerId(null)
    setEditAnswerText('')
  }

  const handleFinishScoring = () => {
    sfx.playSuccess()

    // Poin Kesulitan Sedang: Unik +2 poin, Kembar -1 poin (penalti)
    players.forEach((p) => {
      if (!failedPlayerIds.includes(p.id)) {
        addScore(p.id, 2)
      } else {
        addScore(p.id, -1)
      }
    })

    if (isLastRound) {
      navigate('/game1/results')
    } else {
      g1NextRound()
    }
  }

  const uniqueCount = players.length - failedPlayerIds.length
  const failedCount = failedPlayerIds.length

  return (
    <GameDesktopLayout
      gameId="game1"
      gameTitle="Same Brain? No!"
      badge="GAME 01 • SAME BRAIN"
      badgeColor="#158467"
      activeRoundLabel={`Ronde ${g1CurrentRound} / 10`}
      onShuffle={phase === 'timer' ? handleShuffleCategory : undefined}
      shuffleLabel="Ganti Kategori"
      onUndo={phase === 'scoring' ? handleUndoScoring : undefined}
      undoLabel="Undo ke Timer"
    >
      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col justify-between gap-3">
        {/* Category Card (Compact, always visible at top) */}
        <div className="rounded-[22px] bg-[#158467] text-white p-3.5 md:p-4 shadow-[0_6px_0_#0F5E49] border-2 border-[#1E1E24]/10 text-center relative overflow-hidden shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#5CE6C0]" />
              <span>Kategori Pertanyaan Ronde {g1CurrentRound}</span>
            </div>
            {phase === 'timer' && (
              <button
                type="button"
                onClick={handleShuffleCategory}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white font-display text-xs font-bold transition cursor-pointer"
                title="Ganti topik kategori baru"
              >
                <Shuffle className="w-3 h-3 text-[#FBBF24]" />
                <span>Ganti Kategori</span>
              </button>
            )}
          </div>
          <h2 className="font-display text-xl md:text-2xl lg:text-[28px] font-black leading-snug">
            "{category.prompt}"
          </h2>
          <p className="text-xs md:text-sm text-white/85 font-medium mt-1">
            {playMode === 'multi_device'
              ? 'Ketik 1 jawaban paling unik di HP masing-masing! Jawaban kembar = penalti -1 poin.'
              : 'Tulis/sebutkan 1 jawaban unik. Jawaban kembar = penalti -1 poin.'}
          </p>
        </div>

        {/* Middle Stage (stretches cleanly to fill down to anchored Main Button) */}
        <div className="flex-1 flex flex-col min-h-0">
          <AnimatePresence mode="wait">
            {phase === 'timer' && (
              <motion.div
                key="timer-phase"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-3.5 items-stretch"
              >
                {/* LEFT COLUMN: Mascot + Timer Ring + Timer Controls */}
                <div className="md:col-span-5 rounded-[24px] bg-white border-2 border-[#1E1E24]/10 shadow-xs p-5 flex flex-col items-center justify-center text-center gap-3.5">
                  <GameMascotBot
                    character={CHARACTER_PACK[1]}
                    mood={timeLeft <= 5 ? 'shocked' : timeLeft <= 15 ? 'thinking' : 'happy'}
                    size={70}
                  />

                  <div
                    className={`w-34 h-34 lg:w-38 lg:h-38 rounded-full flex flex-col items-center justify-center border-4 shadow-md transition-all ${
                      timeLeft <= 5
                        ? 'bg-[#FFE8DF] border-[#F04438] text-[#F04438] animate-pulse'
                        : 'bg-[#FAF7F2] border-[#158467] text-[#158467]'
                    }`}
                  >
                    <span className="font-display text-4xl lg:text-5xl font-black tracking-tight tabular-nums">
                      {timeLeft}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#64616C]">
                      Detik Tersisa
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    <button
                      type="button"
                      className="px-3 py-1.5 min-h-[36px] rounded-xl bg-[#FAF7F2] border-2 border-[#1E1E24]/15 text-xs font-bold text-[#1E1E24] hover:bg-black/5 flex items-center gap-1.5 cursor-pointer"
                      onClick={() => {
                        sfx.playPop()
                        setIsTimerRunning(!isTimerRunning)
                      }}
                    >
                      {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isTimerRunning ? 'Jeda' : 'Lanjut'}</span>
                    </button>

                    <button
                      type="button"
                      className="px-3 py-1.5 min-h-[36px] rounded-xl bg-[#FAF7F2] border-2 border-[#1E1E24]/15 text-xs font-bold text-[#1E1E24] hover:bg-black/5 flex items-center gap-1.5 cursor-pointer"
                      onClick={() => {
                        sfx.playPop()
                        setTimeLeft((t) => t + 10)
                      }}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+10 Detik</span>
                    </button>

                    <button
                      type="button"
                      className="px-3 py-1.5 min-h-[36px] rounded-xl bg-[#FAF7F2] border-2 border-[#1E1E24]/15 text-xs font-bold text-[#1E1E24] hover:bg-black/5 flex items-center gap-1.5 cursor-pointer"
                      onClick={() => {
                        sfx.playPop()
                        setTimeLeft(30)
                        setIsTimerRunning(true)
                      }}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset 30s</span>
                    </button>
                  </div>
                </div>

                {/* RIGHT COLUMN: Mode Status / Player Roster */}
                <div className="md:col-span-7 rounded-[24px] bg-white border-2 border-[#1E1E24]/10 shadow-xs p-4 sm:p-5 flex flex-col justify-between gap-3">
                  {playMode === 'multi_device' ? (
                    <div className="flex-1 flex flex-col min-h-0">
                      <div className="flex items-center justify-between mb-3 text-xs font-bold">
                        <span className="text-[#158467] flex items-center gap-1.5">
                          <Users className="w-4 h-4" />
                          <span>Status Masuk Jawaban HP:</span>
                        </span>
                        <span className="bg-[#D6F5EC] text-[#0F5E49] px-2.5 py-0.5 rounded-full font-extrabold">
                          {submittedCount} / {players.length} Terkunci
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[250px] overflow-y-auto pr-1">
                        {players.map((p) => {
                          const isSubmitted = !!phoneAnswers[p.id]
                          return (
                            <div
                              key={p.id}
                              className={`p-2.5 rounded-2xl border-2 flex items-center gap-2.5 transition-all ${
                                isSubmitted
                                  ? 'bg-[#D6F5EC]/60 border-[#12B76A]/40 text-[#0F5E49]'
                                  : 'bg-[#FAF7F2] border-[#1E1E24]/10 text-[#64616C]'
                              }`}
                            >
                              <PlayerProfileAvatar
                                character={getCharacterById(p.avatarId || 'c01')}
                                size={32}
                              />
                              <div className="min-w-0 flex-1 text-left">
                                <p className="font-display text-sm font-black truncate leading-tight text-[#1E1E24]">
                                  {p.name}
                                </p>
                                <span className="text-xs font-bold block">
                                  {isSubmitted ? 'Terkunci' : 'Mengetik...'}
                                </span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-display text-base font-black text-[#1E1E24] flex items-center gap-1.5">
                            <span>📝 Mode 1 Layar Offline</span>
                          </p>
                          <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#D6F5EC] text-[#0F5E49] border border-[#158467]/20">
                            {players.length} Pemain Siap
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#64616C] font-semibold leading-snug">
                          Semua pemain menulis 1 jawaban unik di kertas atau catatan HP masing-masing sebelum waktu habis.
                        </p>
                      </div>

                      <div
                        className={`grid gap-2.5 max-h-[240px] overflow-y-auto pr-1 my-auto ${
                          players.length > 8 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2'
                        }`}
                      >
                        {players.map((p) => (
                          <div
                            key={p.id}
                            className="px-3 py-2.5 rounded-2xl bg-[#FAF7F2] border-2 border-[#1E1E24]/10 flex items-center gap-2.5 shadow-2xs"
                          >
                            <PlayerProfileAvatar
                              character={getCharacterById(p.avatarId || 'c01')}
                              size={34}
                              animated={false}
                            />
                            <div className="min-w-0 flex-1">
                              <p className="font-display text-sm sm:text-base font-black text-[#1E1E24] truncate leading-tight">
                                {p.name}
                              </p>
                              <span className="text-xs font-bold text-[#64616C] block truncate">
                                {p.kubu}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {/* Phase 2: Scoring Cards (Compact Header + Cards Filling Middle Space) */}
            {phase === 'scoring' && (
              <motion.div
                key="scoring-phase"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col min-h-0"
              >
                {/* Header Tally + Compact Undo */}
                <div className="mb-3 p-3.5 rounded-[22px] bg-white border-2 border-[#1E1E24]/10 shadow-xs flex flex-wrap items-center justify-between gap-2.5 shrink-0">
                  <div>
                    <h3 className="font-display text-sm sm:text-base font-black text-[#1E1E24] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#158467]" />
                      <span>
                        {playMode === 'multi_device'
                          ? 'Hasil Jawaban Pemain (HP)'
                          : '🎤 Bacakan Jawaban & Skoring Host'}
                      </span>
                    </h3>
                    <p className="text-xs text-[#64616C] font-semibold mt-0.5">
                      {playMode === 'multi_device'
                        ? 'Klik tombol status di kartu jika ingin ubah Unik / Kembar.'
                        : 'Klik "Tandai Kembar (-1)" pada pemain yang jawabannya sama.'}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-[#D6F5EC] text-[#0F5E49] border border-[#12B76A]/30">
                      ✅ {uniqueCount} Unik (+2)
                    </span>
                    <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-[#FFE8DF] text-[#B42318] border border-[#F04438]/30">
                      ❌ {failedCount} Kembar (-1)
                    </span>
                    <button
                      type="button"
                      className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] hover:bg-black/5 border border-[#1E1E24]/15 text-xs font-bold text-[#1E1E24] cursor-pointer"
                      onClick={handleUndoScoring}
                    >
                      ← Ulangi 30s
                    </button>
                  </div>
                </div>

                {/* Merge Tools Bar */}
                {selectedForMerge.length > 0 && (
                  <div className="mb-3 p-3 rounded-2xl bg-[#FEF3C7] border-2 border-[#F59E0B] flex items-center justify-between gap-3 shrink-0">
                    <span className="text-xs font-bold text-[#B45309] flex items-center gap-1.5">
                      <Layers className="w-4 h-4" />
                      <span>{selectedForMerge.length} kartu dipilih untuk digabungkan</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedForMerge([])}
                        className="px-2.5 py-1 rounded-xl bg-white text-xs font-bold text-[#64616C] hover:bg-black/5"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={handleMergeSelected}
                        className="px-3 py-1 rounded-xl bg-[#F59E0B] text-white text-xs font-black shadow-xs hover:bg-[#D97706]"
                      >
                        Tandai Keduanya Kembar!
                      </button>
                    </div>
                  </div>
                )}

                {/* Visual Grid of Player Cards */}
                <div
                  className={`flex-1 content-start grid gap-2.5 max-h-[380px] overflow-y-auto pr-1 ${
                    playMode === 'single_screen'
                      ? 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-4'
                      : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                  }`}
                >
                  {players.map((player) => {
                  const isFailed = failedPlayerIds.includes(player.id)
                  const rawAnswer = phoneAnswers[player.id]?.trim() || ''
                  const isSelected = selectedForMerge.includes(player.id)
                  const isEditing = editingPlayerId === player.id

                  const matchedGroup = duplicateGroups.find((g) =>
                    g.playerIds.includes(player.id)
                  )

                  return (
                    <motion.div
                      key={player.id}
                      className={`p-2.5 rounded-[20px] border-2 transition-all flex flex-col justify-between gap-2 shadow-xs ${
                        isFailed
                          ? 'bg-[#FFE8DF] border-[#F04438]/60 text-[#1E1E24]'
                          : 'bg-[#D6F5EC]/70 border-[#12B76A]/60 text-[#1E1E24]'
                      } ${isSelected ? 'ring-3 ring-[#F59E0B]' : ''}`}
                    >
                      {/* Top Card: Avatar + Name + Status */}
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <PlayerProfileAvatar
                            character={getCharacterById(player.avatarId || 'c01')}
                            size={28}
                            mood={isFailed ? 'shocked' : 'happy'}
                          />
                          <div className="min-w-0">
                            <p className="font-display text-sm font-bold truncate leading-tight">
                              {player.name}
                            </p>
                            <span className="text-xs font-semibold text-[#64616C] block truncate">
                              {player.kubu}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`text-xs font-black px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ${
                            isFailed
                              ? 'bg-[#F04438] text-white'
                              : 'bg-[#12B76A] text-white'
                          }`}
                        >
                          {isFailed ? <X className="w-3 h-3 stroke-[3]" /> : <Check className="w-3 h-3 stroke-[3]" />}
                          <span>{isFailed ? '-1' : '+2'}</span>
                        </span>
                      </div>

                      {/* Middle Card: Only shown in multi_device mode (Host mode stays pure Name + Button) */}
                      {playMode === 'multi_device' && (
                        <div className="p-2.5 rounded-xl bg-white border border-[#1E1E24]/10 min-h-[54px] flex flex-col justify-center text-center relative group">
                          {isEditing ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={editAnswerText}
                                onChange={(e) => setEditAnswerText(e.target.value)}
                                placeholder="Ketik catatan jawaban..."
                                className="input-field text-xs font-bold py-1 px-2 rounded-xl flex-1"
                                autoFocus
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveEditedAnswer(player.id)}
                                className="p-1 rounded-lg bg-[#158467] text-white hover:bg-[#0F5E49]"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingPlayerId(null)}
                                className="p-1 rounded-lg bg-black/10 text-[#64616C]"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <p className="font-display text-base font-black text-[#1E1E24] break-words">
                                {rawAnswer ? `"${rawAnswer}"` : <span className="italic text-[#DC2626] text-xs font-bold">Tidak submit via HP</span>}
                              </p>
                              {matchedGroup && (
                                <span className="text-xs font-bold text-[#DC2626] block mt-0.5">
                                  Sama: "{matchedGroup.canonicalAnswer}"
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      )}

                      {/* Bottom Card Controls */}
                      <div className="pt-1 border-t border-black/5 flex items-center justify-between gap-1.5">
                        <button
                          type="button"
                          onClick={() => togglePlayerStatus(player.id)}
                          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-1 shadow-2xs ${
                            isFailed
                              ? 'bg-white hover:bg-[#12B76A] hover:text-white text-[#0F5E49] border-2 border-[#12B76A]/40'
                              : 'bg-white hover:bg-[#F04438] hover:text-white text-[#B42318] border-2 border-[#F04438]/40'
                          }`}
                          title="Klik untuk ubah status Unik / Kembar"
                        >
                          {isFailed ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Ubah Unik (+2)</span>
                            </>
                          ) : (
                            <>
                              <X className="w-3.5 h-3.5" />
                              <span>Tandai Kembar (-1)</span>
                            </>
                          )}
                        </button>

                        {playMode === 'multi_device' && (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingPlayerId(player.id)
                                setEditAnswerText(rawAnswer)
                              }}
                              className="p-2 rounded-xl bg-white border border-[#1E1E24]/10 text-[#64616C] hover:text-[#1E1E24] hover:bg-black/5 cursor-pointer"
                              title="Catat jawaban pemain ini"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => toggleMergeSelect(player.id)}
                              className={`p-2 rounded-xl border transition cursor-pointer ${
                                isSelected
                                  ? 'bg-[#F59E0B] text-white border-[#F59E0B]'
                                  : 'bg-white border-[#1E1E24]/10 text-[#64616C] hover:text-[#F59E0B]'
                              }`}
                              title="Pilih untuk digabungkan dengan jawaban lain"
                            >
                              <Layers className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Fixed Anchored Main Action Button (Never changes vertical/horizontal spot across phases) */}
        <div className="shrink-0">
          <Button
            variant="emerald"
            size="lg"
            fullWidth
            onClick={phase === 'timer' ? triggerRevealPhase : handleFinishScoring}
          >
            {phase === 'timer' ? (
              <>
                <span>
                  {playMode === 'multi_device'
                    ? 'Waktu Habis • Buka Kartu Jawaban HP'
                    : 'Lanjut Input & Skoring Jawaban'}
                </span>
                <ArrowRight className="w-5 h-5" />
              </>
            ) : isLastRound ? (
              <>
                <Trophy className="w-5 h-5" />
                <span>Selesai &amp; Lihat Juara Game 01</span>
              </>
            ) : (
              <>
                <span>Simpan Skor &amp; Lanjut Ronde {g1CurrentRound + 1}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="block lg:hidden">
        <HostUtilityBar />
      </div>
    </GameDesktopLayout>
  )
}
