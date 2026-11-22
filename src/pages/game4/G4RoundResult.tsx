import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Trophy, ArrowRight, Flame, AlertTriangle } from 'lucide-react'
import { useGameStore, type DebateMatch } from '../../store/useGameStore'
import { getRandomTopic, getRandomChaosCard } from '../../data/game4-topics'
import { Button } from '../../components/ui/Button'
import { ScoreBoard } from '../../components/ScoreBoard'
import { BlobMascot } from '../../components/ui/BlobMascot'
import { PlayerProfileAvatar } from '../../components/characters/PlayerProfileAvatar'
import { PunishmentModal } from '../../components/PunishmentModal'
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
    g4UndoMatch,
  } = useGameStore()

  const [showPunishment, setShowPunishment] = useState(false)
  const [loserName, setLoserName] = useState('')

  const match: DebateMatch | undefined = g4Matches[g4CurrentMatchIndex]

  const handleUndo = () => {
    const success = g4UndoMatch()
    if (success) {
      sfx.playPop()
      navigate('/game4/match')
    }
  }

  useEffect(() => {
    sfx.playSuccess()
  }, [])

  if (!match) {
    navigate('/hub')
    return null
  }

  const playerA = players.find((p) => p.id === match.playerAId) || players[0]
  const playerB = players.find((p) => p.id === match.playerBId) || players[1]

  const teamAPlayers = (match.teamAIds && match.teamAIds.length > 0)
    ? players.filter((p) => match.teamAIds.includes(p.id))
    : [playerA]

  const teamBPlayers = (match.teamBIds && match.teamBIds.length > 0)
    ? players.filter((p) => match.teamBIds.includes(p.id))
    : [playerB]

  const isTie = match.winnerTeam === 'tie' || match.votesA === match.votesB
  const isAWinner = match.winnerTeam === 'A' || match.votesA > match.votesB
  const winningTeam = isTie ? null : isAWinner ? teamAPlayers : teamBPlayers
  const losingTeam = isTie ? null : isAWinner ? teamBPlayers : teamAPlayers
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
    // Sort players by score, take top 4 for 2v2 Grand Final
    const sorted = [...players].sort((a, b) => b.score - a.score)
    const p1 = sorted[0] || players[0]
    const p2 = sorted[1] || players[1]
    const p3 = sorted[2] || players[2]
    const p4 = sorted[3] || players[3]

    const finalTopic = getRandomTopic(g4UsedTopicIds)

    const finalMatch: DebateMatch = {
      matchNumber: g4Matches.length + 1,
      teamAIds: [p1.id, p2.id],
      teamBIds: [p3.id, p4.id],
      playerAId: p1.id,
      playerBId: p3.id,
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
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E24] px-4 py-6 md:py-8 pb-20 md:pb-16 flex flex-col justify-between">
      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">
        {/* Top Header with Back Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            className="text-xs font-bold text-[#64616C] hover:text-[#1E1E24] flex items-center gap-1.5 cursor-pointer py-1 px-2.5 rounded-full hover:bg-black/5 transition-colors"
            onClick={() => {
              sfx.playPop()
              navigate('/hub')
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Menu Utama</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleUndo}
              className="text-xs font-bold text-[#DC2626] hover:bg-[#FEE2E2] px-2.5 py-1 rounded-full border border-[#DC2626]/20 transition cursor-pointer"
              title="Undo hasil duel ini dan kembali ke panggung debat"
            >
              ↩️ Undo Duel
            </button>
            <span className="font-display text-xs px-3.5 py-1.5 rounded-full bg-[#EC5A29] text-white font-bold tracking-wide">
              {isFinalMatch ? 'Grand Final' : `Match ${match.matchNumber} / ${g4Matches.length}`}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch flex-1">
          {/* LEFT COLUMN: Winner Banner + Vote Breakdown + Anchored CTA */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <motion.div
              className="text-center p-5 rounded-[28px] bg-white border-2 border-[#1E1E24]/10 shadow-xs"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 15 }}
            >
              <div className="mb-2">
                <BlobMascot
                  shape="triangle"
                  mood={isTie ? 'curious' : 'excited'}
                  color="#FFB03A"
                  accentColor="#B53B10"
                  size={82}
                />
              </div>

              <span className="inline-block px-3 py-1 rounded-full bg-[#FFE8DF] text-[#EC5A29] text-xs font-black uppercase tracking-wider mb-1.5">
                {isFinalMatch
                  ? '👑 HASIL GRAND FINAL DEBAT'
                  : `HASIL PERTANDINGAN #${match.matchNumber}`}
              </span>

              <h1 className="font-display text-2xl md:text-3xl font-bold text-[#1E1E24]">
                {isTie
                  ? 'HASIL SERI! 🤝'
                  : `${winningTeam?.map((p) => p.name).join(' & ')} MENANG! 🏆`}
              </h1>
              <p className="text-xs font-semibold text-[#64616C] mt-1 italic">
                "{match.topic.topic}"
              </p>

              {/* Voting & Point Breakdown Grid */}
              <div className="grid grid-cols-2 gap-2.5 text-center mt-4 pt-4 border-t border-[#1E1E24]/10">
                {/* Tim PRO */}
                <div
                  className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center ${
                    isAWinner && !isTie
                      ? 'bg-[#D6F5EC] border-[#12B76A]'
                      : 'bg-[#FAF7F2] border-[#1E1E24]/10'
                  }`}
                >
                  <div className="flex -space-x-2 mb-1">
                    {teamAPlayers.map((p) => (
                      <PlayerProfileAvatar key={p.id} characterId={p.avatarId} size={28} name={p.name} />
                    ))}
                  </div>
                  <p className="font-display text-xs font-bold text-[#1E1E24] mt-0.5 truncate max-w-full">
                    {teamAPlayers.map((p) => p.name).join(' & ')}
                  </p>
                  <span className="text-xs font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#12B76A] text-white inline-block mt-1">
                    PRO
                  </span>
                  <p className="font-display text-xl font-bold text-[#1E1E24] mt-1">{match.votesA} suara</p>
                  <p className="text-xs font-semibold text-[#64616C]">
                    {isAWinner && !isTie ? '+8 Pts' : isTie ? '+4 Pts' : '+2 Pts'}
                  </p>
                </div>

                {/* Tim KONTRA */}
                <div
                  className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center ${
                    !isAWinner && !isTie
                      ? 'bg-[#D6F5EC] border-[#12B76A]'
                      : 'bg-[#FAF7F2] border-[#1E1E24]/10'
                  }`}
                >
                  <div className="flex -space-x-2 mb-1">
                    {teamBPlayers.map((p) => (
                      <PlayerProfileAvatar key={p.id} characterId={p.avatarId} size={28} name={p.name} />
                    ))}
                  </div>
                  <p className="font-display text-xs font-bold text-[#1E1E24] mt-0.5 truncate max-w-full">
                    {teamBPlayers.map((p) => p.name).join(' & ')}
                  </p>
                  <span className="text-xs font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#F04438] text-white inline-block mt-1">
                    KONTRA
                  </span>
                  <p className="font-display text-xl font-bold text-[#1E1E24] mt-1">{match.votesB} suara</p>
                  <p className="text-xs font-semibold text-[#64616C]">
                    {!isAWinner && !isTie ? '+8 Pts' : isTie ? '+4 Pts' : '+2 Pts'}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <div className="space-y-2.5 mt-auto">
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
                    size="md"
                    onClick={() => {
                      sfx.playPop()
                      navigate('/game4/results')
                    }}
                  >
                    <span>Lihat Hasil Turnamen Langsung</span>
                    <ArrowRight className="w-4 h-4" />
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

          {/* RIGHT COLUMN: Live Scoreboard & Loser Punishment */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <ScoreBoard players={players} title="Klasemen Skor Sementara" />

            {losingTeam && losingTeam.length > 0 && (
              <div className="mt-auto">
                <button
                  type="button"
                  onClick={() => {
                    setLoserName(losingTeam.map((p) => p.name).join(' & '))
                    setShowPunishment(true)
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#FFE8DF] border-2 border-[#EC5A29] text-[#EC5A29] hover:bg-[#FFD9CA] font-display text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer transition"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>🃏 Ambil Kartu Hukuman untuk Tim Kalah ({losingTeam.map((p) => p.name).join(' & ')})!</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <PunishmentModal
        open={showPunishment}
        onClose={() => setShowPunishment(false)}
        loserName={loserName}
        targetType={losingTeam && losingTeam.length > 1 ? 'team' : 'individual'}
        targetTeamName={losingTeam && losingTeam.length > 1 ? loserName : undefined}
        targetPlayers={losingTeam || undefined}
      />

      <HostUtilityBar onUndo={handleUndo} />
    </div>
  )
}
