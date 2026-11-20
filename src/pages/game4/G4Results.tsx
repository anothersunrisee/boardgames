import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RotateCcw, Home, ArrowLeft, AlertTriangle } from 'lucide-react'
import { useGameStore } from '../../store/useGameStore'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { ScoreBoard } from '../../components/ScoreBoard'
import { BlobMascot } from '../../components/ui/BlobMascot'
import { ConfettiShower } from '../../components/motion/ConfettiShower'
import { PlayerProfileAvatar } from '../../components/characters/PlayerProfileAvatar'
import { PunishmentModal } from '../../components/PunishmentModal'
import { HostUtilityBar } from '../../components/HostUtilityBar'
import { sfx } from '../../utils/sound'

export default function G4Results() {
  const navigate = useNavigate()
  const { players, g4Matches, autoStartGame4 } = useGameStore()
  const [showPunishment, setShowPunishment] = useState(false)
  const [selectedLoser, setSelectedLoser] = useState('')

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score)
  const supremeAdvocate = sortedPlayers[0]
  const lowestScorer = sortedPlayers[sortedPlayers.length - 1]

  useEffect(() => {
    sfx.playFanfare()
  }, [])

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E24] px-4 py-8 md:py-12 flex flex-col justify-between relative overflow-hidden">
      <ConfettiShower particleCount={55} />
      <div className="max-w-xl mx-auto w-full flex-1 flex flex-col">
        {/* Top Header Back Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            className="text-xs font-bold text-[#64616C] hover:text-[#1E1E24] flex items-center gap-1.5 cursor-pointer py-1 px-2.5 rounded-full hover:bg-black/5 transition-colors"
            onClick={() => {
              sfx.playPop()
              navigate('/hub')
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Pilih Game Lain</span>
          </button>
          <span className="font-display text-xs px-3.5 py-1.5 rounded-full bg-[#EC5A29] text-white font-bold tracking-wide">
            Turnamen Selesai
          </span>
        </div>

        {/* Supreme Champion Mascot Banner */}
        <motion.div
          className="text-center mb-8 flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
        >
          <div className="mb-3">
            <BlobMascot
              shape="triangle"
              mood="excited"
              color="#FFB03A"
              accentColor="#B53B10"
              accessory="crown"
              size={130}
            />
          </div>

          <span className="inline-block px-4 py-1.5 rounded-full bg-[#EC5A29] text-white text-xs font-black uppercase tracking-wider mb-2">
            DEVIL'S ADVOCATE SELESAI
          </span>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-[#1E1E24]">
            Supreme Devil's Advocate:
          </h1>

          <div className="flex items-center justify-center gap-3 mt-2">
            <PlayerProfileAvatar characterId={supremeAdvocate?.avatarId} size={50} name={supremeAdvocate?.name} />
            <p className="font-display text-2xl md:text-3xl font-bold text-[#EC5A29]">
              {supremeAdvocate?.name} 👑
            </p>
          </div>

          <p className="text-sm font-semibold text-[#64616C] mt-1">
            Kubu {supremeAdvocate?.kubu} • Total Skor: {supremeAdvocate?.score} Poin Kemenangan
          </p>
        </motion.div>

        {/* Scoreboard */}
        <div className="mb-6">
          <ScoreBoard players={players} highlightId={supremeAdvocate?.id} />
        </div>

        {/* Punishment Card Button */}
        {lowestScorer && lowestScorer.id !== supremeAdvocate?.id && (
          <div className="mb-6">
            <button
              type="button"
              onClick={() => {
                setSelectedLoser(lowestScorer.name)
                setShowPunishment(true)
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#FFE8DF] border-2 border-[#EC5A29] text-[#EC5A29] hover:bg-[#FFD9CA] font-display text-sm font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer transition"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>🃏 Acak Kartu Hukuman untuk Debater Terbawah ({lowestScorer.name})!</span>
            </button>
          </div>
        )}

        {/* Match History */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="p-5 bg-white shadow-xs">
            <h3 className="font-display text-base font-bold text-[#1E1E24] mb-3">
              Riwayat Pertandingan Debat
            </h3>
            <div className="space-y-2.5">
              {g4Matches.map((m) => {
                const pA = players.find((p) => p.id === m.playerAId)
                const pB = players.find((p) => p.id === m.playerBId)
                const winner =
                  m.winnerId === 'tie'
                    ? 'Seri'
                    : players.find((p) => p.id === m.winnerId)?.name

                return (
                  <div
                    key={m.matchNumber}
                    className="p-3.5 rounded-2xl border-2 border-[#1E1E24]/10 bg-[#FAF7F2] text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-[#EC5A29]">
                        {m.isFinal ? '🔥 GRAND FINAL' : `Match #${m.matchNumber}`}
                      </span>
                      <span className="font-semibold text-[#64616C]">
                        Pemenang: <strong className="text-[#12B76A]">{winner}</strong>
                      </span>
                    </div>

                    <p className="font-bold text-[#1E1E24] text-sm mb-1.5">
                      "{m.topic.topic}"
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-[#64616C] font-semibold">
                      <span>
                        🟢 {pA?.name} (PRO): {m.votesA} suara
                      </span>
                      <span>
                        🔴 {pB?.name} (KONTRA): {m.votesB} suara
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <div className="space-y-3 mt-auto">
          <Button
            variant="tangerine"
            fullWidth
            size="lg"
            onClick={() => {
              sfx.playPop()
              autoStartGame4()
              navigate('/game4/match')
            }}
          >
            <RotateCcw className="w-5 h-5" />
            <span>Tanding Debat Lagi (Acak Ulang)</span>
          </Button>

          <Button
            variant="ink"
            fullWidth
            size="lg"
            onClick={() => {
              sfx.playPop()
              navigate('/hub')
            }}
          >
            <Home className="w-5 h-5" />
            <span>Pilih Game Lain</span>
          </Button>
        </div>
      </div>

      <PunishmentModal
        open={showPunishment}
        onClose={() => setShowPunishment(false)}
        loserName={selectedLoser || lowestScorer?.name}
      />

      <HostUtilityBar />
    </div>
  )
}
