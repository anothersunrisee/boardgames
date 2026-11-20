import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, Plus, Sparkles, Check, X, Trophy, ArrowRight } from 'lucide-react'
import { useGameStore } from '../../store/useGameStore'
import { pickRandomCategories, type Category } from '../../data/game1-categories'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { GameMascotBot } from '../../components/characters/GameMascotBot'
import { PlayerProfileAvatar } from '../../components/characters/PlayerProfileAvatar'
import { CHARACTER_PACK, getCharacterById } from '../../assets-library/characters'
import { HostUtilityBar } from '../../components/HostUtilityBar'
import { GameDesktopLayout } from '../../components/layout/GameDesktopLayout'
import { sfx } from '../../utils/sound'

type RoundPhase = 'timer' | 'scoring'

export default function G1Round() {
  const navigate = useNavigate()
  const { players, g1CurrentRound, g1UsedCategoryIds, g1NextRound, addScore } = useGameStore()

  const [category, setCategory] = useState<Category | null>(null)
  const [phase, setPhase] = useState<RoundPhase>('timer')
  const [timeLeft, setTimeLeft] = useState(30)
  const [isTimerRunning, setIsTimerRunning] = useState(true)
  const [failedPlayerIds, setFailedPlayerIds] = useState<string[]>([])
  const timerRef = useRef<number | null>(null)

  // Pick category on mount or when round changes
  useEffect(() => {
    const [cat] = pickRandomCategories(1, g1UsedCategoryIds)
    setCategory(cat ?? null)
    setTimeLeft(30)
    setIsTimerRunning(true)
    setPhase('timer')
    setFailedPlayerIds([])
  }, [g1CurrentRound])

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
            setPhase('scoring')
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

  if (!category || players.length === 0) {
    navigate('/game1/setup')
    return null
  }

  const isLastRound = g1CurrentRound >= 10

  const togglePlayerFailed = (playerId: string) => {
    sfx.playPop()
    setFailedPlayerIds((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId]
    )
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
    >
      <div className="max-w-3xl lg:max-w-4xl mx-auto w-full flex-1 flex flex-col">
        {/* Category Card */}
        <div className="rounded-[28px] bg-[#158467] text-white p-6 md:p-8 mb-5 shadow-[0_8px_0_#0F5E49] border-2 border-[#1E1E24]/10 text-center relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-extrabold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#5CE6C0]" />
            <span>Kategori Pertanyaan</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold leading-snug">
            "{category.prompt}"
          </h2>
          <p className="text-xs md:text-sm text-white/80 font-medium mt-2">
            Semua pemain tulis 1 jawaban di HP masing-masing! Jawaban kembar = 0 poin.
          </p>
        </div>

        {/* Phase: 30-Second Countdown */}
        <AnimatePresence mode="wait">
          {phase === 'timer' && (
            <motion.div
              key="timer-phase"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 flex flex-col items-center justify-center text-center"
            >
              <div className="mb-4">
                <GameMascotBot
                  character={CHARACTER_PACK[1]}
                  mood={timeLeft <= 5 ? 'shocked' : timeLeft <= 15 ? 'thinking' : 'happy'}
                  size={96}
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
                <span className="font-display text-5xl md:text-6xl font-bold tracking-tight">
                  {timeLeft}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#64616C]">
                  Detik Tersisa
                </span>
              </div>

              {/* Timer Controls */}
              <div className="flex items-center gap-3 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 rounded-2xl bg-white border-2 border-[#1E1E24]/10 text-xs font-bold text-[#1E1E24] hover:bg-black/5 flex items-center gap-1.5 cursor-pointer shadow-xs"
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
                  className="px-4 py-2 rounded-2xl bg-white border-2 border-[#1E1E24]/10 text-xs font-bold text-[#1E1E24] hover:bg-black/5 flex items-center gap-1.5 cursor-pointer shadow-xs"
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
                  className="px-4 py-2 rounded-2xl bg-white border-2 border-[#1E1E24]/10 text-xs font-bold text-[#1E1E24] hover:bg-black/5 flex items-center gap-1.5 cursor-pointer shadow-xs"
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

              <div className="w-full mt-8">
                <Button
                  variant="emerald"
                  size="lg"
                  fullWidth
                  onClick={() => {
                    sfx.playBuzzer()
                    setPhase('scoring')
                  }}
                >
                  <span>Waktu Habis → Buka Jawaban & Nilai!</span>
                </Button>
              </div>
            </motion.div>
          )}

          {/* Phase: Fast Host Live Scoring */}
          {phase === 'scoring' && (
            <motion.div
              key="scoring-phase"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              <Card className="mb-4 p-4 bg-[#D6F5EC] border-2 border-[#158467]/30 text-center">
                <p className="font-display text-sm font-bold text-[#158467]">
                  🗣️ Pemain membacakan jawaban di HP mereka masing-masing!
                </p>
                <p className="text-xs text-[#64616C] font-semibold mt-0.5">
                  Klik pemain yang jawabannya <span className="text-[#F04438] font-bold">KEMBAR / SALAH</span> untuk menghanguskan poinnya:
                </p>
              </Card>

              {/* Player Roster Toggle Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5 max-h-[360px] overflow-y-auto pr-1">
                {players.map((player) => {
                  const isFailed = failedPlayerIds.includes(player.id)
                  return (
                    <motion.div
                      key={player.id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => togglePlayerFailed(player.id)}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                        isFailed
                          ? 'bg-[#FFE8DF] border-[#F04438]/50 text-[#1E1E24]'
                          : 'bg-white border-[#12B76A]/40 hover:border-[#12B76A] shadow-xs'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <PlayerProfileAvatar
                          character={getCharacterById(player.avatarId || 'c01')}
                          size={36}
                          mood={isFailed ? 'shocked' : 'idle'}
                        />
                        <div className="min-w-0">
                          <p className={`font-display text-base font-bold truncate ${isFailed ? 'line-through text-[#64616C]' : 'text-[#1E1E24]'}`}>
                            {player.name}
                          </p>
                          <p className="text-[11px] text-[#64616C] font-semibold">
                            Kubu: {player.kubu} • Skor: {player.score} pt
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-xs font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1 shrink-0 ${
                          isFailed
                            ? 'bg-[#F04438] text-white'
                            : 'bg-[#D6F5EC] text-[#12B76A]'
                        }`}
                      >
                        {isFailed ? (
                          <>
                            <X className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Kembar (-1)</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Unik (+2)</span>
                          </>
                        )}
                      </span>
                    </motion.div>
                  )
                })}
              </div>

              {/* Status tally bar */}
              <div className="p-3 rounded-2xl bg-white border border-[#1E1E24]/10 flex items-center justify-around text-center mb-5 text-xs font-bold">
                <span className="text-[#12B76A]">
                  ✅ {uniqueCount} Pemain Unik (+2 pt)
                </span>
                <span className="text-[#64616C]">|</span>
                <span className="text-[#F04438]">
                  ❌ {failedCount} Pemain Kembar (-1 pt)
                </span>
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
                  onClick={() => {
                    sfx.playPop()
                    setTimeLeft(30)
                    setIsTimerRunning(true)
                    setPhase('timer')
                  }}
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
