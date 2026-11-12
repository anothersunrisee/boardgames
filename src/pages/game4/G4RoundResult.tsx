import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Trophy, ArrowRight, Flame, Award } from 'lucide-react'
import { useGameStore, type DebateMatch } from '../../store/useGameStore'
import { getRandomTopic, getRandomChaosCard } from '../../data/game4-topics'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { ScoreBoard } from '../../components/ScoreBoard'
import { BlobMascot } from '../../components/ui/BlobMascot'
import { HostUtilityBar } from '../../components/HostUtilityBar'
import { sfx } from '../../utils/sound'

export default function G4RoundResult() {
  const navigate = useNavigate()
  const {
    players,
    g4Matches,
    g4CurrentMatchIndex,
    g4NextMatch,
    g4AddFinalMatch,
    g4EnableChaos,
    g4UsedTopicIds,
  } = useGameStore()

  const match: DebateMatch | undefined = g4Matches[g4CurrentMatchIndex]

  useEffect(() => {
    sfx.playSuccess()
  }, [])

  if (!match) {
    navigate('/game4/setup')
    return null
  }

  const playerA = players.find((p) => p.id === match.playerAId)
  const playerB = players.find((p) => p.id === match.playerBId)

  const isTie = match.winnerId === 'tie'
  const winner = isTie ? null : players.find((p) => p.id === match.winnerId)
  const isFinalMatch = match.isFinal

  const isAllStandardMatchesCompleted =
    g4Matches.filter((m) => !m.isFinal).every((m) => m.isCompleted) &&
    g4CurrentMatchIndex >= g4Matches.filter((m) => !m.isFinal).length - 1

  const handleNextMatch = () => {
    sfx.playPop()
    g4NextMatch()
    navigate('/game4/match')
  }

  const handleStartGrandFinal = () => {
    sfx.playPop()
    // Sort players by score, take top 2
    const sorted = [...players].sort((a, b) => b.score - a.score)
    const top1 = sorted[0]
    const top2 = sorted[1]

    const finalTopic = getRandomTopic(g4UsedTopicIds)

    const finalMatch: DebateMatch = {
      matchNumber: g4Matches.length + 1,
      playerAId: top1.id,
      playerBId: top2.id,
      topic: finalTopic,
      chaosCardA: g4EnableChaos ? getRandomChaosCard() : undefined,
      chaosCardB: g4EnableChaos ? getRandomChaosCard() : undefined,
      votesA: 0,
      votesB: 0,
      isCompleted: false,
      isFinal: true,
    }

    g4AddFinalMatch(finalMatch)
    navigate('/game4/match')
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E24] px-4 py-8 md:py-12 flex flex-col justify-between">
      <div className="max-w-xl mx-auto w-full flex-1 flex flex-col">
        {/* Top Header with Back Navigation */}
        <div className="flex items-center justify-between mb-5">
          <button
            type="button"
            className="text-xs font-bold text-[#64616C] hover:text-[#1E1E24] flex items-center gap-1.5 cursor-pointer py-1 px-2.5 rounded-full hover:bg-black/5 transition-colors"
            onClick={() => {
              sfx.playPop()
              navigate('/')
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Menu Utama</span>
          </button>

          <span className="font-display text-xs px-3.5 py-1.5 rounded-full bg-[#EC5A29] text-white font-bold tracking-wide">
            {isFinalMatch ? 'Grand Final' : `Match ${match.matchNumber} / ${g4Matches.length}`}
          </span>
        </div>

        {/* Match Result Banner */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
        >
          <div className="mb-2">
            <BlobMascot
              shape="triangle"
              mood={isTie ? 'curious' : 'excited'}
              color="#FFB03A"
              accentColor="#B53B10"
              size={90}
            />
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-[#FFE8DF] text-[#EC5A29] text-xs font-black uppercase tracking-wider mb-2">
            {isFinalMatch
              ? '👑 HASIL GRAND FINAL DEBAT'
              : `HASIL PERTANDINGAN #${match.matchNumber}`}
          </span>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-[#1E1E24]">
            {isTie ? 'HASIL SERI! 🤝' : `${winner?.name} MENANG! 🏆`}
          </h1>
          <p className="text-xs font-semibold text-[#64616C] mt-1 italic max-w-md mx-auto">
            "{match.topic.topic}"
          </p>
        </motion.div>

        {/* Voting & Point Breakdown Card */}
        <Card className="mb-5 p-5 bg-white shadow-xs">
          <p className="font-display text-base font-bold text-[#1E1E24] mb-3 text-center">
            Perolehan Suara & Poin Juri
          </p>
          <div className="grid grid-cols-2 gap-3 text-center">
            {/* Player A */}
            <div
              className={`p-3.5 rounded-2xl border-2 transition-all ${
                match.winnerId === playerA?.id
                  ? 'bg-[#D6F5EC] border-[#12B76A]'
                  : 'bg-[#FAF7F2] border-[#1E1E24]/10'
              }`}
            >
              <p className="font-display text-base font-bold text-[#1E1E24]">{playerA?.name}</p>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#12B76A] text-white inline-block mt-0.5 mb-1.5">
                PRO
              </span>
              <p className="font-display text-2xl font-bold text-[#1E1E24]">{match.votesA} suara</p>
              <p className="text-xs font-semibold text-[#64616C] mt-1">
                {match.winnerId === playerA?.id
                  ? '+3 Poin Menang'
                  : isTie
                  ? '+2 Poin Seri'
                  : '+1 Partisipasi'}
              </p>
              {match.bestPerformanceId === playerA?.id && (
                <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-extrabold text-[#EC5A29] bg-[#FFE8DF] px-2 py-0.5 rounded-full">
                  <Award className="w-3 h-3" />
                  <span>Best Performance +1</span>
                </div>
              )}
            </div>

            {/* Player B */}
            <div
              className={`p-3.5 rounded-2xl border-2 transition-all ${
                match.winnerId === playerB?.id
                  ? 'bg-[#D6F5EC] border-[#12B76A]'
                  : 'bg-[#FAF7F2] border-[#1E1E24]/10'
              }`}
            >
              <p className="font-display text-base font-bold text-[#1E1E24]">{playerB?.name}</p>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#F04438] text-white inline-block mt-0.5 mb-1.5">
                KONTRA
              </span>
              <p className="font-display text-2xl font-bold text-[#1E1E24]">{match.votesB} suara</p>
              <p className="text-xs font-semibold text-[#64616C] mt-1">
                {match.winnerId === playerB?.id
                  ? '+3 Poin Menang'
                  : isTie
                  ? '+2 Poin Seri'
                  : '+1 Partisipasi'}
              </p>
              {match.bestPerformanceId === playerB?.id && (
                <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-extrabold text-[#EC5A29] bg-[#FFE8DF] px-2 py-0.5 rounded-full">
                  <Award className="w-3 h-3" />
                  <span>Best Performance +1</span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Live Scoreboard */}
        <div className="mb-6">
          <ScoreBoard players={players} title="Klasemen Skor Sementara" />
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mt-auto">
          {isFinalMatch ? (
            <Button
              variant="primary"
              fullWidth
              size="lg"
              onClick={() => {
                sfx.playPop()
                navigate('/game4/results')
              }}
            >
              <Trophy className="w-5 h-5" />
              <span>Penobatan Supreme Devil's Advocate →</span>
            </Button>
          ) : isAllStandardMatchesCompleted ? (
            <>
              <Button
                variant="tangerine"
                fullWidth
                size="lg"
                onClick={handleStartGrandFinal}
              >
                <Flame className="w-5 h-5" />
                <span>Tandingkan Grand Final Debat! (Top 2 Pemain)</span>
              </Button>
              <Button
                variant="ink"
                fullWidth
                size="lg"
                onClick={() => {
                  sfx.playPop()
                  navigate('/game4/results')
                }}
              >
                <span>Lihat Hasil Turnamen Langsung</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </>
          ) : (
            <Button
              variant="tangerine"
              fullWidth
              size="lg"
              onClick={handleNextMatch}
            >
              <span>Lanjut ke Pertandingan #{match.matchNumber + 1} ⚔️</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      <HostUtilityBar />
    </div>
  )
}
