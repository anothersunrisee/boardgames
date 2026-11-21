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
      <div className="max-w-4xl lg:max-w-5xl mx-auto w-full flex-1 flex flex-col">
        {/* Category Card */}
        <div className="rounded-[28px] bg-[#158467] text-white p-5 md:p-7 mb-4 shadow-[0_8px_0_#0F5E49] border-2 border-[#1E1E24]/10 text-center relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
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
          <h2 className="font-display text-2xl md:text-3xl font-black leading-snug">
            "{category.prompt}"
          </h2>
          <p className="text-xs md:text-sm text-white/80 font-medium mt-1.5">
            {playMode === 'multi_device'
              ? 'Ketik 1 jawaban paling unik di HP masing-masing! Jawaban kembar = penalti -1 poin.'
              : 'Tulis/sebutkan 1 jawaban unik. Jawaban kembar = penalti -1 poin.'}
          </p>
        </div>

        {/* Phase 1: 30-Second Countdown + Live Submission Ticker */}
        <AnimatePresence mode="wait">
          {phase === 'timer' && (
            <motion.div
              key="timer-phase"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 flex flex-col items-center justify-center text-center"
            >
              <div className="mb-3">
                <GameMascotBot
                  character={CHARACTER_PACK[1]}
                  mood={timeLeft <= 5 ? 'shocked' : timeLeft <= 15 ? 'thinking' : 'happy'}
                  size={90}
                />
              </div>

              {/* Big Circular Tactile Timer */}
              <div
                className={`w-36 h-36 md:w-44 md:h-44 rounded-full flex flex-col items-center justify-center border-4 shadow-lg transition-all ${
                  timeLeft <= 5
                    ? 'bg-[#FFE8DF] border-[#F04438] text-[#F04438] animate-pulse'
                    : 'bg-white border-[#158467] text-[#158467]'
                }`}
              >
                <span className="font-display text-5xl md:text-6xl font-black tracking-tight">
                  {timeLeft}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#64616C]">
                  Detik Tersisa
                </span>
              </div>

              {/* Timer Controls */}
              <div className="flex items-center gap-2.5 mt-5">
                <button
                  type="button"
                  className="px-3.5 py-1.5 rounded-2xl bg-white border-2 border-[#1E1E24]/10 text-xs font-bold text-[#1E1E24] hover:bg-black/5 flex items-center gap-1.5 cursor-pointer shadow-xs"
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
                  className="px-3.5 py-1.5 rounded-2xl bg-white border-2 border-[#1E1E24]/10 text-xs font-bold text-[#1E1E24] hover:bg-black/5 flex items-center gap-1.5 cursor-pointer shadow-xs"
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
                  className="px-3.5 py-1.5 rounded-2xl bg-white border-2 border-[#1E1E24]/10 text-xs font-bold text-[#1E1E24] hover:bg-black/5 flex items-center gap-1.5 cursor-pointer shadow-xs"
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

              {/* Ticker Roster / Mode Instruction */}
              {playMode === 'multi_device' ? (
                <div className="w-full mt-6 p-4 rounded-[26px] bg-white border-2 border-[#1E1E24]/10 shadow-xs">
                  <div className="flex items-center justify-between mb-3 text-xs font-bold">
                    <span className="text-[#158467] flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      <span>Status Masuk Jawaban dari HP Pemain:</span>
                    </span>
                    <span className="bg-[#D6F5EC] text-[#158467] px-2.5 py-0.5 rounded-full">
                      {submittedCount} / {players.length} Terkunci
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {players.map((p) => {
                      const isSubmitted = !!phoneAnswers[p.id]
                      return (
                        <div
                          key={p.id}
                          className={`p-2 rounded-xl border flex items-center gap-2 transition-all ${
                            isSubmitted
                              ? 'bg-[#D6F5EC]/60 border-[#12B76A]/40 text-[#0F5E49]'
                              : 'bg-[#FAF7F2] border-[#1E1E24]/10 text-[#64616C]'
                          }`}
                        >
                          <PlayerProfileAvatar
                            character={getCharacterById(p.avatarId || 'c01')}
                            size={28}
                          />
                          <div className="min-w-0 flex-1 text-left">
                            <p className="text-xs font-bold truncate leading-tight">{p.name}</p>
                            <span className="text-[10px] font-semibold block">
                              {isSubmitted ? '✅ Terkunci' : '⏳ Mengetik...'}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="w-full mt-6 p-4 rounded-[26px] bg-white border-2 border-[#1E1E24]/10 shadow-xs text-center">
                  <p className="font-display text-sm font-black text-[#1E1E24] flex items-center justify-center gap-1.5">
                    <span>📝 Mode 1 Layar Offline</span>
                  </p>
                  <p className="text-xs text-[#64616C] font-semibold mt-1">
                    Semua pemain menulis 1 jawaban unik di kertas / catatan HP masing-masing sebelum timer 30 detik habis!
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mt-3">
                    {players.map((p) => (
                      <div
                        key={p.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#1E1E24]/10 text-xs font-bold text-[#1E1E24]"
                      >
                        <PlayerProfileAvatar
                          character={getCharacterById(p.avatarId || 'c01')}
                          size={22}
                          animated={false}
                        />
                        <span>{p.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="w-full mt-6">
                <Button
                  variant="emerald"
                  size="lg"
                  fullWidth
                  onClick={triggerRevealPhase}
                >
                  <span>
                    {playMode === 'multi_device'
                      ? 'Waktu Habis → Buka Kartu Jawaban HP Semua Pemain!'
                      : 'Waktu Habis → Giliran Bacakan Jawaban & Skoring!'}
                  </span>
                </Button>
              </div>
            </motion.div>
          )}

          {/* Phase 2: Live Reveal & Host Override Answer Cards */}
          {phase === 'scoring' && (
            <motion.div
              key="scoring-phase"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              {/* Header Tally & Host Controls */}
              <div className="mb-4 p-4 rounded-[26px] bg-white border-2 border-[#1E1E24]/10 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <div>
                  <h3 className="font-display text-base font-black text-[#1E1E24] flex items-center justify-center sm:justify-start gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#158467]" />
                    <span>
                      {playMode === 'multi_device'
                        ? 'Hasil Jawaban Asli Seluruh Pemain (HP)'
                        : '🎤 Bacakan Jawaban & Skoring Host'}
                    </span>
                  </h3>
                  <p className="text-xs text-[#64616C] font-semibold mt-0.5">
                    {playMode === 'multi_device'
                      ? 'Sistem mendeteksi kembar otomatis dari HP. Klik tombol di kartu untuk ubah status jika ada kesamaan makna.'
                      : 'Pemain membacakan jawaban kertas/lisan satu per satu. Host cukup klik tombol pada pemain yang jawabannya KEMBAR (-1)!'}
                  </p>
                </div>

                {/* Score Tally Badges */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-[#D6F5EC] text-[#12B76A] border border-[#12B76A]/30">
                    ✅ {uniqueCount} Unik (+2)
                  </span>
                  <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-[#FFE8DF] text-[#F04438] border border-[#F04438]/30">
                    ❌ {failedCount} Kembar (-1)
                  </span>
                </div>
              </div>

              {/* Merge Tools Bar (jika ada kartu terpilih untuk digabungkan) */}
              {selectedForMerge.length > 0 && (
                <div className="mb-3 p-3 rounded-2xl bg-[#FEF3C7] border-2 border-[#F59E0B] flex items-center justify-between gap-3">
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

              {/* 🃏 Visual Grid of Player Answer Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5 max-h-[460px] overflow-y-auto pr-1">
                {players.map((player) => {
                  const isFailed = failedPlayerIds.includes(player.id)
                  const rawAnswer = phoneAnswers[player.id]?.trim() || ''
                  const isSelected = selectedForMerge.includes(player.id)
                  const isEditing = editingPlayerId === player.id

                  // Temukan grup kembar jika ada
                  const matchedGroup = duplicateGroups.find((g) =>
                    g.playerIds.includes(player.id)
                  )

                  return (
                    <motion.div
                      key={player.id}
                      className={`p-4 rounded-[26px] border-2 transition-all flex flex-col justify-between shadow-xs ${
                        isFailed
                          ? 'bg-[#FFE8DF] border-[#F04438]/60 text-[#1E1E24]'
                          : 'bg-[#D6F5EC]/70 border-[#12B76A]/60 text-[#1E1E24]'
                      } ${isSelected ? 'ring-3 ring-[#F59E0B]' : ''}`}
                    >
                      {/* Top Card: Avatar + Name + Merge Checkbox */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <PlayerProfileAvatar
                            character={getCharacterById(player.avatarId || 'c01')}
                            size={34}
                            mood={isFailed ? 'shocked' : 'happy'}
                          />
                          <div className="min-w-0">
                            <p className="font-display text-sm font-bold truncate leading-tight">
                              {player.name}
                            </p>
                            <span className="text-[10px] font-semibold text-[#64616C]">
                              {player.kubu}
                            </span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`text-[11px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 ${
                            isFailed
                              ? 'bg-[#F04438] text-white'
                              : 'bg-[#12B76A] text-white'
                          }`}
                        >
                          {isFailed ? <X className="w-3 h-3 stroke-[3]" /> : <Check className="w-3 h-3 stroke-[3]" />}
                          <span>{isFailed ? 'KEMBAR (-1)' : 'UNIK (+2)'}</span>
                        </span>
                      </div>

                      {/* Middle Card: Answer Display */}
                      <div className="my-2 p-3 rounded-2xl bg-white border border-[#1E1E24]/10 min-h-[64px] flex flex-col justify-center text-center relative group">
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
                        ) : playMode === 'single_screen' ? (
                          <div className="py-1">
                            {rawAnswer ? (
                              <p className="font-display text-base font-black text-[#1E1E24] break-words">
                                "{rawAnswer}"
                              </p>
                            ) : (
                              <p className="text-xs font-bold text-[#64616C] flex items-center justify-center gap-1">
                                <span>📝</span>
                                <span>Jawaban Kertas / Lisan</span>
                              </p>
                            )}
                            <p className="text-[10px] text-[#A09CA8] font-semibold mt-0.5">
                              {isFailed ? '⚠️ Dinyatakan Kembar oleh Host (-1)' : '✨ Belum ada yang kembar (+2)'}
                            </p>
                          </div>
                        ) : (
                          <>
                            <p className="font-display text-lg font-black text-[#1E1E24] break-words">
                              {rawAnswer ? `"${rawAnswer}"` : <span className="italic text-[#F04438] text-xs font-bold">Tidak submit via HP</span>}
                            </p>
                            {matchedGroup && (
                              <span className="text-[10px] font-bold text-[#F04438] block mt-0.5">
                                🔗 Sama dengan: "{matchedGroup.canonicalAnswer}"
                              </span>
                            )}
                          </>
                        )}
                      </div>

                      {/* Bottom Card Controls: Host Override & Action Tools */}
                      <div className="pt-2 border-t border-black/5 flex items-center justify-between gap-1.5">
                        <button
                          type="button"
                          onClick={() => togglePlayerStatus(player.id)}
                          className={`flex-1 py-2 px-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs ${
                            isFailed
                              ? 'bg-white hover:bg-[#12B76A] hover:text-white text-[#12B76A] border-2 border-[#12B76A]/40'
                              : 'bg-white hover:bg-[#F04438] hover:text-white text-[#F04438] border-2 border-[#F04438]/40'
                          }`}
                          title="Klik untuk ubah status Unik / Kembar"
                        >
                          {isFailed ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Ubah ke Unik (+2)</span>
                            </>
                          ) : (
                            <>
                              <X className="w-3.5 h-3.5" />
                              <span>Tandai Kembar (-1)</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingPlayerId(player.id)
                            setEditAnswerText(rawAnswer)
                          }}
                          className="p-2 rounded-xl bg-white border border-[#1E1E24]/10 text-[#64616C] hover:text-[#1E1E24] hover:bg-black/5"
                          title="Catat jawaban pemain ini"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {playMode === 'multi_device' && (
                          <button
                            type="button"
                            onClick={() => toggleMergeSelect(player.id)}
                            className={`p-2 rounded-xl border transition ${
                              isSelected
                                ? 'bg-[#F59E0B] text-white border-[#F59E0B]'
                                : 'bg-white border-[#1E1E24]/10 text-[#64616C] hover:text-[#F59E0B]'
                            }`}
                            title="Pilih untuk digabungkan dengan jawaban lain"
                          >
                            <Layers className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Action Buttons */}
              <div className="mt-auto space-y-2.5">
                <Button
                  variant="emerald"
                  size="lg"
                  fullWidth
                  onClick={handleFinishScoring}
                >
                  {isLastRound ? (
                    <>
                      <Trophy className="w-5 h-5" />
                      <span>Selesai & Lihat Juara Game 01 👑</span>
                    </>
                  ) : (
                    <>
                      <span>Simpan Skor & Lanjut Ronde {g1CurrentRound + 1}</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>

                <button
                  type="button"
                  className="w-full text-xs font-bold text-[#64616C] hover:text-[#1E1E24] py-1 cursor-pointer"
                  onClick={handleUndoScoring}
                >
                  ← Ulangi Timer 30 Detik Ronde Ini
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="block lg:hidden">
        <HostUtilityBar />
      </div>
    </GameDesktopLayout>
  )
}
