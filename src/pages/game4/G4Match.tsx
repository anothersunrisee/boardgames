import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, Plus, SkipForward, Flame, Trophy, ThumbsUp, Shuffle } from 'lucide-react'
import { useGameStore, type DebateMatch } from '../../store/useGameStore'
import { Button } from '../../components/ui/Button'
import { BlobMascot } from '../../components/ui/BlobMascot'
import { PlayerProfileAvatar } from '../../components/characters/PlayerProfileAvatar'
import { HostUtilityBar } from '../../components/HostUtilityBar'
import { GameDesktopLayout } from '../../components/layout/GameDesktopLayout'
import { sfx } from '../../utils/sound'
import { syncHostRoomState, listenToPlayerActions } from '../../services/firebase'

type Stage =
  | 'prep'
  | 'openingA'
  | 'openingB'
  | 'rebuttalA'
  | 'rebuttalB'
  | 'finalA'
  | 'finalB'
  | 'voting'

const STAGE_CONFIG: Record<
  Exclude<Stage, 'voting'>,
  { label: string; speaker: 'A' | 'B' | 'both'; duration: number; tip: string }
> = {
  prep: {
    label: 'Preparation Time',
    speaker: 'both',
    duration: 15,
    tip: 'Kedua pemain menyusun poin argumen & membaca Chaos Card masing-masing!',
  },
  openingA: {
    label: 'Opening Argument: PRO',
    speaker: 'A',
    duration: 30,
    tip: 'Pemain PRO menyampaikan argumen pembuka paling meyakinkan!',
  },
  openingB: {
    label: 'Opening Argument: KONTRA',
    speaker: 'B',
    duration: 30,
    tip: 'Pemain KONTRA menyampaikan argumen pembuka untuk membela posisinya!',
  },
  rebuttalA: {
    label: 'Rebuttal Battle: PRO',
    speaker: 'A',
    duration: 20,
    tip: 'Pemain PRO membalas & mematahkan argumen dari Pemain KONTRA!',
  },
  rebuttalB: {
    label: 'Rebuttal Battle: KONTRA',
    speaker: 'B',
    duration: 20,
    tip: 'Pemain KONTRA membalas & menyerang balik poin dari Pemain PRO!',
  },
  finalA: {
    label: 'Final Statement: PRO',
    speaker: 'A',
    duration: 10,
    tip: 'Pernyataan penutup pamungkas dari Pemain PRO!',
  },
  finalB: {
    label: 'Final Statement: KONTRA',
    speaker: 'B',
    duration: 10,
    tip: 'Pernyataan penutup pamungkas dari Pemain KONTRA!',
  },
}

const STAGE_ORDER: Stage[] = [
  'prep',
  'openingA',
  'openingB',
  'rebuttalA',
  'rebuttalB',
  'finalA',
  'finalB',
  'voting',
]

export default function G4Match() {
  const navigate = useNavigate()
  const {
    roomCode,
    g4Players,
    g4Matches,
    g4CurrentMatchIndex,
    g4UpdateMatch,
    addScore,
    g4ShuffleTopic,
    g4ShuffleChaos,
  } = useGameStore()

  const match: DebateMatch | undefined = g4Matches[g4CurrentMatchIndex]

  const playerA = g4Players.find((p) => p.id === match?.playerAId) || g4Players[0]
  const playerB = g4Players.find((p) => p.id === match?.playerBId) || g4Players[1]

  const teamAPlayers = (match?.teamAIds && match.teamAIds.length > 0)
    ? g4Players.filter((p) => match.teamAIds.includes(p.id))
    : [playerA]

  const teamBPlayers = (match?.teamBIds && match.teamBIds.length > 0)
    ? g4Players.filter((p) => match.teamBIds.includes(p.id))
    : [playerB]

  const [stageIndex, setStageIndex] = useState(0)
  const currentStage = STAGE_ORDER[stageIndex]

  // Sync state ke Firebase Realtime untuk HP Controller
  useEffect(() => {
    if (!roomCode || !match) return
    syncHostRoomState(roomCode, {
      activeGame: 'game4',
      gamePhase: currentStage === 'voting' ? 'voting' : 'debate',
      gameState: {
        g4Topic: match.topic?.topic,
        g4ProTeamIds: teamAPlayers.map((p) => p.id),
        g4ContraTeamIds: teamBPlayers.map((p) => p.id),
        g4ChaosCardPro: match.chaosCardA,
        g4ChaosCardContra: match.chaosCardB,
      },
    })
  }, [roomCode, match, currentStage, teamAPlayers, teamBPlayers])

  // Dengarkan live voting dari HP penonton
  useEffect(() => {
    if (!roomCode) return
    const unsubscribe = listenToPlayerActions(roomCode, (actionsMap) => {
      if (!actionsMap) return
      let countA = 0
      let countB = 0
      Object.values(actionsMap).forEach((action) => {
        if (action.type === 'cast_g4_vote') {
          if (action.payload?.team === 'A') countA++
          if (action.payload?.team === 'B') countB++
        }
      })
      if (countA > 0 || countB > 0) {
        setVotesA(countA)
        setVotesB(countB)
      }
    })
    return () => unsubscribe()
  }, [roomCode])

  const handleShuffleTopic = () => {
    const newTopic = g4ShuffleTopic()
    if (newTopic) {
      sfx.playPop()
    }
  }

  const handleShuffleChaos = () => {
    const newChaos = g4ShuffleChaos()
    if (newChaos) {
      sfx.playPop()
    }
  }

  const handleUndoStage = () => {
    sfx.playPop()
    setStageIndex((s) => Math.max(0, s - 1))
  }

  const [timeLeft, setTimeLeft] = useState(15)
  const [isRunning, setIsRunning] = useState(false)
  const timerRef = useRef<number | null>(null)

  const [votesA, setVotesA] = useState(0)
  const [votesB, setVotesB] = useState(0)
  const [bestPerf, setBestPerf] = useState<'A' | 'B' | null>(null)

  const isUrgent = timeLeft <= 5 && timeLeft > 0

  useEffect(() => {
    if (currentStage !== 'voting') {
      const duration = STAGE_CONFIG[currentStage].duration
      setTimeLeft(duration)
      setIsRunning(false)
    }
  }, [stageIndex, currentStage])

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            sfx.playBuzzer()
            setIsRunning(false)
            return 0
          }
          sfx.playTick(prev <= 6)
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isRunning, timeLeft])

  if (!match) {
    navigate('/game4/setup')
    return null
  }

  const totalMatches = g4Matches.length
  const audienceCount = Math.max(0, g4Players.length - 4)

  const handleNextStage = () => {
    sfx.playPop()
    if (stageIndex < STAGE_ORDER.length - 1) {
      setStageIndex((i) => i + 1)
    }
  }

  const handleFinalizeVotes = () => {
    sfx.playSuccess()
    let winnerTeam: 'A' | 'B' | 'tie' = 'tie'

    // Aturan 2v2: Menang +8 pt per anggota, Kalah +2 pt per anggota, Seri +4 pt
    if (votesA > votesB) {
      winnerTeam = 'A'
      teamAPlayers.forEach((p) => addScore(p.id, 8))
      teamBPlayers.forEach((p) => addScore(p.id, 2))
    } else if (votesB > votesA) {
      winnerTeam = 'B'
      teamBPlayers.forEach((p) => addScore(p.id, 8))
      teamAPlayers.forEach((p) => addScore(p.id, 2))
    } else {
      winnerTeam = 'tie'
      ;[...teamAPlayers, ...teamBPlayers].forEach((p) => addScore(p.id, 4))
    }

    if (bestPerf === 'A') teamAPlayers.forEach((p) => addScore(p.id, 1))
    if (bestPerf === 'B') teamBPlayers.forEach((p) => addScore(p.id, 1))

    const updatedMatch: DebateMatch = {
      ...match,
      votesA,
      votesB,
      winnerTeam,
      winnerId: winnerTeam === 'A' ? teamAPlayers[0]?.id : winnerTeam === 'B' ? teamBPlayers[0]?.id : undefined,
      isCompleted: true,
    }

    g4UpdateMatch(g4CurrentMatchIndex, updatedMatch)
    navigate('/game4/round-result')
  }

  return (
    <GameDesktopLayout
      gameId="game4"
      gameTitle="The Devil's Advocate"
      badge="GAME 04 • DEBAT"
      badgeColor="#EC5A29"
      activeRoundLabel={match.isFinal ? 'Grand Final' : `Match ${match.matchNumber}/${totalMatches}`}
      onShuffle={handleShuffleTopic}
      shuffleLabel="Ganti Topik"
      onUndo={stageIndex > 0 ? handleUndoStage : undefined}
      undoLabel="Stage Lalu"
    >
      <div className="max-w-3xl lg:max-w-4xl mx-auto w-full flex-1 flex flex-col">
        {/* Motion Debate Topic Card */}
        <div className="rounded-[28px] bg-[#EC5A29] text-white p-6 mb-5 shadow-[0_8px_0_rgba(30,30,36,0.1)] border-2 border-[#1E1E24]/10">
          <div className="flex items-center justify-between mb-2">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-extrabold uppercase tracking-wider">
              TOPIK DEBAT ABSURD
            </span>
            <button
              type="button"
              onClick={handleShuffleTopic}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white font-display text-xs font-bold transition cursor-pointer"
              title="Ganti topik perdebatan"
            >
              <Shuffle className="w-3 h-3 text-[#FBBF24]" />
              <span>Ganti Topik</span>
            </button>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold leading-snug">
            "{match.topic.topic}"
          </h2>

          {/* Combatants Dual Cards (2v2 Tim) */}
          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="rounded-2xl bg-white/15 p-3.5 flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider bg-[#12B76A] text-white px-2.5 py-0.5 rounded-full inline-block">
                  TIM PRO (Duo)
                </span>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {teamAPlayers.map((p) => (
                    <div key={p.id} className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-xl">
                      <PlayerProfileAvatar characterId={p.avatarId} size={28} name={p.name} />
                      <span className="font-display text-sm font-bold text-white truncate max-w-[90px]">
                        {p.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-white/85 italic mt-2 leading-snug">
                "{match.topic.proStance}"
              </p>
            </div>

            <div className="rounded-2xl bg-white/15 p-3.5 flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider bg-[#F04438] text-white px-2.5 py-0.5 rounded-full inline-block">
                  TIM KONTRA (Duo)
                </span>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {teamBPlayers.map((p) => (
                    <div key={p.id} className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-xl">
                      <PlayerProfileAvatar characterId={p.avatarId} size={28} name={p.name} />
                      <span className="font-display text-sm font-bold text-white truncate max-w-[90px]">
                        {p.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-white/80 italic mt-2 leading-snug">
                "{match.topic.contraStance}"
              </p>
            </div>
          </div>
        </div>

        {/* Optional Chaos Cards */}
        {(match.chaosCardA || match.chaosCardB) && (
          <div className="rounded-[24px] bg-[#E9D5FF] text-[#1E1E24] p-4 mb-5 border-2 border-[#1E1E24]/10 space-y-2">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase text-[#7E22CE]">
                <Flame className="w-4 h-4 text-[#EC5A29]" />
                <span>Gangguan Chaos Card Tim Aktif!</span>
              </div>
              <button
                type="button"
                onClick={handleShuffleChaos}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/70 hover:bg-white text-[#7E22CE] text-xs font-bold transition cursor-pointer"
                title="Ganti Chaos Card baru"
              >
                <Shuffle className="w-3 h-3 text-[#7E22CE]" />
                <span>Ganti Chaos</span>
              </button>
            </div>

            {match.chaosCardA && (
              <p className="text-xs font-semibold text-purple-950">
                🟢 <strong>Tim PRO ({teamAPlayers.map((p) => p.name).join(' & ')}):</strong> {match.chaosCardA}
              </p>
            )}
            {match.chaosCardB && (
              <p className="text-xs font-semibold text-purple-950">
                🔴 <strong>Tim KONTRA ({teamBPlayers.map((p) => p.name).join(' & ')}):</strong> {match.chaosCardB}
              </p>
            )}
          </div>
        )}

        {/* Debate Stage & Timer OR Voting */}
        <AnimatePresence mode="wait">
          {currentStage !== 'voting' ? (
            <motion.div
              key={currentStage}
              initial={{ opacity: 0, y: 15 }}
              animate={isUrgent ? { scale: [1, 1.02, 1] } : { opacity: 1, y: 0 }}
              transition={isUrgent ? { duration: 0.45, repeat: Infinity } : undefined}
              className={`tactile-card p-6 text-center mb-6 border-[3px] transition-colors ${
                isUrgent
                  ? 'bg-[#FFE4E2] border-[#F04438] text-[#B42318]'
                  : 'bg-white border-[#1E1E24]/10 text-[#1E1E24]'
              }`}
            >
              <BlobMascot
                shape={isUrgent ? 'flame' : 'triangle'}
                mood={isUrgent ? 'dizzy' : isRunning ? 'excited' : 'spicy'}
                color={isUrgent ? '#F04438' : '#FFB03A'}
                accentColor="#B53B10"
                size={85}
              />

              <div className="mt-2 mb-1">
                <span className="font-display text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#1E1E24]/10 text-[#1E1E24]">
                  Tahap {stageIndex + 1} / 7: {STAGE_CONFIG[currentStage].label}
                </span>
              </div>

              <div className="font-display text-6xl md:text-7xl font-bold my-2 tabular-nums">
                00:{String(timeLeft).padStart(2, '0')}
              </div>

              <p className="text-xs text-[#64616C] font-semibold max-w-sm mx-auto mb-4">
                💡 {STAGE_CONFIG[currentStage].tip}
              </p>

              {/* Host Controls */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2 border-t border-[#1E1E24]/10">
                <Button
                  variant={isRunning ? 'tangerine' : 'ink'}
                  size="md"
                  onClick={() => setIsRunning(!isRunning)}
                >
                  {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  <span>{isRunning ? 'Pause' : 'Mulai Timer'}</span>
                </Button>

                <Button
                  variant="cream"
                  size="md"
                  onClick={() => {
                    sfx.playPop()
                    setTimeLeft((t) => t + 5)
                  }}
                >
                  <Plus className="w-4 h-4" />
                  <span>5s</span>
                </Button>

                <Button
                  variant="cream"
                  size="icon"
                  onClick={() => {
                    sfx.playPop()
                    setIsRunning(false)
                    setTimeLeft(STAGE_CONFIG[currentStage].duration)
                  }}
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>

                <Button
                  variant="emerald"
                  size="md"
                  onClick={handleNextStage}
                >
                  <span>Lanjut</span>
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ) : (
            /* Voting Phase */
            <motion.div
              key="voting"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="tactile-card p-6 bg-white mb-6 border-[3px] border-[#F5C842]"
            >
              <div className="text-center mb-5">
                <span className="font-display text-xs uppercase tracking-widest text-[#92400E] bg-[#FEF3C7] px-3.5 py-1 rounded-full font-bold">
                  🗳️ AUDIENCE & JURY VOTING
                </span>
                <h3 className="font-display text-2xl font-bold text-[#1E1E24] mt-2">
                  Siapa yang Paling Meyakinkan?
                </h3>
                <p className="text-xs text-[#64616C] font-semibold">
                  Total {audienceCount} orang juri memberikan suara mereka!
                </p>
              </div>

              {/* Counters (2v2 Tim PRO vs Tim KONTRA) */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                {/* Tim PRO */}
                <div className="p-4 rounded-2xl border-2 border-[#12B76A] bg-[#D6F5EC]/50 text-center flex flex-col items-center">
                  <div className="flex -space-x-2 mb-1">
                    {teamAPlayers.map((p) => (
                      <PlayerProfileAvatar key={p.id} characterId={p.avatarId} size={40} name={p.name} />
                    ))}
                  </div>
                  <p className="font-display text-sm font-bold text-[#158467] truncate mt-1">
                    TIM PRO ({teamAPlayers.map((p) => p.name).join(' & ')})
                  </p>
                  <div className="flex items-center justify-center gap-3 my-2.5">
                    <button
                      type="button"
                      className="w-9 h-9 rounded-full font-bold text-lg bg-[#4AE3B5] text-[#0F5E49] flex items-center justify-center cursor-pointer active:scale-95 transition"
                      onClick={() => {
                        sfx.playPop(480)
                        setVotesA(Math.max(0, votesA - 1))
                      }}
                    >
                      -
                    </button>
                    <span className="font-display text-3xl text-[#1E1E24] w-10 text-center">
                      {votesA}
                    </span>
                    <button
                      type="button"
                      className="w-9 h-9 rounded-full font-bold text-lg bg-[#12B76A] text-white flex items-center justify-center cursor-pointer active:scale-95 transition"
                      onClick={() => {
                        sfx.playPop(580)
                        setVotesA(votesA + 1)
                      }}
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[11px] font-bold text-[#158467]">Suara Tim PRO</span>
                </div>

                {/* Tim KONTRA */}
                <div className="p-4 rounded-2xl border-2 border-[#F04438] bg-[#FFE8DF]/50 text-center flex flex-col items-center">
                  <div className="flex -space-x-2 mb-1">
                    {teamBPlayers.map((p) => (
                      <PlayerProfileAvatar key={p.id} characterId={p.avatarId} size={40} name={p.name} />
                    ))}
                  </div>
                  <p className="font-display text-sm font-bold text-[#B42318] truncate mt-1">
                    TIM KONTRA ({teamBPlayers.map((p) => p.name).join(' & ')})
                  </p>
                  <div className="flex items-center justify-center gap-3 my-2.5">
                    <button
                      type="button"
                      className="w-9 h-9 rounded-full font-bold text-lg bg-[#FCA5A5] text-[#7F1D1D] flex items-center justify-center cursor-pointer active:scale-95 transition"
                      onClick={() => {
                        sfx.playPop(480)
                        setVotesB(Math.max(0, votesB - 1))
                      }}
                    >
                      -
                    </button>
                    <span className="font-display text-3xl text-[#1E1E24] w-10 text-center">
                      {votesB}
                    </span>
                    <button
                      type="button"
                      className="w-9 h-9 rounded-full font-bold text-lg bg-[#F04438] text-white flex items-center justify-center cursor-pointer active:scale-95 transition"
                      onClick={() => {
                        sfx.playPop(580)
                        setVotesB(votesB + 1)
                      }}
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[11px] font-bold text-[#B42318]">Suara Tim KONTRA</span>
                </div>
              </div>

              {/* Best Performance Bonus */}
              <div className="p-3.5 rounded-2xl bg-[#FEF3C7] border border-[#F59E0B]/30 mb-5">
                <p className="text-xs font-bold text-[#92400E] mb-2 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-[#F59E0B]" />
                  <span>Best Performance Bonus (+1 Poin Pilihan Juri):</span>
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all truncate cursor-pointer ${
                      bestPerf === 'A'
                        ? 'bg-[#158467] text-white border-[#158467] shadow-sm'
                        : 'bg-white border-[#1E1E24]/10 text-[#1E1E24]'
                    }`}
                    onClick={() => {
                      sfx.playPop()
                      setBestPerf(bestPerf === 'A' ? null : 'A')
                    }}
                  >
                    {playerA.name} (+1)
                  </button>
                  <button
                    type="button"
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all truncate cursor-pointer ${
                      bestPerf === 'B'
                        ? 'bg-[#EC5A29] text-white border-[#EC5A29] shadow-sm'
                        : 'bg-white border-[#1E1E24]/10 text-[#1E1E24]'
                    }`}
                    onClick={() => {
                      sfx.playPop()
                      setBestPerf(bestPerf === 'B' ? null : 'B')
                    }}
                  >
                    {playerB.name} (+1)
                  </button>
                  <button
                    type="button"
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      bestPerf === null
                        ? 'bg-[#1E1E24] text-white border-[#1E1E24]'
                        : 'bg-white border-[#1E1E24]/10 text-[#64616C]'
                    }`}
                    onClick={() => {
                      sfx.playPop()
                      setBestPerf(null)
                    }}
                  >
                    Tidak Ada
                  </button>
                </div>
              </div>

              <Button
                variant="tangerine"
                size="lg"
                fullWidth
                onClick={handleFinalizeVotes}
              >
                <ThumbsUp className="w-5 h-5" />
                <span>Kunci Hasil & Tampilkan Pemenang →</span>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Skip to Voting */}
        {currentStage !== 'voting' && (
          <div className="text-center mt-auto">
            <button
              type="button"
              className="text-xs font-bold text-[#EC5A29] hover:underline cursor-pointer"
              onClick={() => {
                sfx.playPop()
                setStageIndex(STAGE_ORDER.length - 1)
              }}
            >
              Langsung ke Sesi Voting 🗳️ →
            </button>
          </div>
        )}
      </div>

      <div className="block lg:hidden">
        <HostUtilityBar
          onShuffle={handleShuffleTopic}
          onUndo={stageIndex > 0 ? handleUndoStage : undefined}
        />
      </div>
    </GameDesktopLayout>
  )
}
