import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RotateCcw, Home, ArrowLeft, Flame } from 'lucide-react'
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
  const { players, g4Matches, g4ReplaySameTeams, g4ReshuffleTeams } = useGameStore()
  const [showPunishment, setShowPunishment] = useState(false)
  const [activeTab, setActiveTab] = useState<'scores' | 'history'>('scores')

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score)
  const supremeAdvocate = sortedPlayers[0]
  const bottom3 = sortedPlayers.length <= 3 ? sortedPlayers : sortedPlayers.slice(-3)

  useEffect(() => {
    sfx.playFanfare()
  }, [])

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E24] px-4 py-6 md:py-8 pb-20 md:pb-16 flex flex-col justify-between relative overflow-hidden">
      <ConfettiShower particleCount={55} />
      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">
        {/* Top Header Back Navigation */}
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
            <span>Pilih Game Lain</span>
          </button>
          <span className="font-display text-xs px-3.5 py-1.5 rounded-full bg-[#EC5A29] text-white font-bold tracking-wide">
            Turnamen Selesai
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch flex-1">
          {/* LEFT COLUMN: Supreme Champion + CTAs */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <motion.div
              className="text-center p-5 rounded-[28px] bg-white border-2 border-[#1E1E24]/10 shadow-xs flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 15 }}
            >
              <div className="mb-2">
                <BlobMascot
                  shape="triangle"
                  mood="excited"
                  color="#FFB03A"
                  accentColor="#B53B10"
                  accessory="crown"
                  size={100}
                />
              </div>

              <span className="inline-block px-3.5 py-1 rounded-full bg-[#EC5A29] text-white text-xs font-black uppercase tracking-wider mb-2">
                DEVIL'S ADVOCATE SELESAI
              </span>

              <h1 className="font-display text-2xl md:text-3xl font-bold text-[#1E1E24]">
                Supreme Devil's Advocate:
              </h1>

              <div className="flex items-center justify-center gap-2.5 mt-2 bg-[#FAF7F2] px-4 py-2 rounded-2xl border border-[#1E1E24]/10">
                <PlayerProfileAvatar characterId={supremeAdvocate?.avatarId} size={40} name={supremeAdvocate?.name} />
                <p className="font-display text-2xl md:text-3xl font-bold text-[#EC5A29]">
                  {supremeAdvocate?.name} 👑
                </p>
              </div>

              <p className="text-xs font-semibold text-[#64616C] mt-2">
                Kubu {supremeAdvocate?.kubu} • Total Skor: {supremeAdvocate?.score} Poin Kemenangan
              </p>
            </motion.div>

            {/* Action Buttons: Opsi Kelompok Sama atau Shuffle Tim */}
            <div className="space-y-2.5 mt-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <Button
                  variant="tangerine"
                  fullWidth
                  size="md"
                  onClick={() => {
                    sfx.playPop()
                    g4ReplaySameTeams()
                    navigate('/game4/match')
                  }}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Kelompok Sama</span>
                </Button>

                <Button
                  variant="cream"
                  fullWidth
                  size="md"
                  onClick={() => {
                    sfx.playPop()
                    g4ReshuffleTeams()
                    navigate('/game4/match')
                  }}
                  className="border-2 border-[#EC5A29] text-[#EC5A29]"
                >
                  <RotateCcw className="w-4 h-4 text-[#EC5A29]" />
                  <span>Acak Ulang Tim</span>
                </Button>
              </div>

              <Button
                variant="ink"
                fullWidth
                size="md"
                onClick={() => {
                  sfx.playPop()
                  navigate('/hub')
                }}
              >
                <Home className="w-4 h-4" />
                <span>Pilih Game Lain</span>
              </Button>
            </div>
          </div>

          {/* RIGHT COLUMN: Tabbed Scoreboard / Match History + Bottom 3 Punishment */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Switcher Tabs */}
            <div className="bg-white p-1.5 rounded-2xl border border-[#1E1E24]/10 inline-flex gap-1.5 self-start shadow-2xs">
              <button
                type="button"
                onClick={() => {
                  sfx.playPop(700)
                  setActiveTab('scores')
                }}
                className={`font-display text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer ${
                  activeTab === 'scores'
                    ? 'bg-[#EC5A29] text-white shadow-xs'
                    : 'text-[#64616C] hover:text-[#1E1E24]'
                }`}
              >
                🏆 Klasemen Skor ({players.length})
              </button>
              <button
                type="button"
                onClick={() => {
                  sfx.playPop(700)
                  setActiveTab('history')
                }}
                className={`font-display text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer ${
                  activeTab === 'history'
                    ? 'bg-[#EC5A29] text-white shadow-xs'
                    : 'text-[#64616C] hover:text-[#1E1E24]'
                }`}
              >
                ⚔️ Riwayat Debat ({g4Matches.length})
              </button>
            </div>

            {activeTab === 'scores' ? (
              <ScoreBoard players={players} highlightId={supremeAdvocate?.id} />
            ) : (
              <Card className="p-4 bg-white shadow-xs border border-[#1E1E24]/10">
                <h3 className="font-display text-base font-bold text-[#1E1E24] mb-3">
                  Riwayat Pertandingan Debat
                </h3>
                <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                  {g4Matches.map((m) => {
                    const teamA = (m.teamAIds && m.teamAIds.length > 0)
                      ? players.filter((p) => m.teamAIds.includes(p.id))
                      : [players.find((p) => p.id === m.playerAId)!]
                    const teamB = (m.teamBIds && m.teamBIds.length > 0)
                      ? players.filter((p) => m.teamBIds.includes(p.id))
                      : [players.find((p) => p.id === m.playerBId)!]

                    const nameA = teamA.map((p) => p?.name).filter(Boolean).join(' & ')
                    const nameB = teamB.map((p) => p?.name).filter(Boolean).join(' & ')

                    const isTie = m.winnerTeam === 'tie' || m.votesA === m.votesB
                    const winnerLabel = isTie
                      ? 'Seri (Draw)'
                      : (m.winnerTeam === 'A' || m.votesA > m.votesB)
                      ? `Tim PRO (${nameA})`
                      : `Tim KONTRA (${nameB})`

                    return (
                      <div
                        key={m.matchNumber}
                        className="p-3 rounded-2xl border-2 border-[#1E1E24]/10 bg-[#FAF7F2] text-xs"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-extrabold text-[#EC5A29]">
                            {m.isFinal ? '🔥 GRAND FINAL' : `Match #${m.matchNumber}`}
                          </span>
                          <span className="font-semibold text-[#64616C]">
                            Pemenang: <strong className="text-[#12B76A]">{winnerLabel}</strong>
                          </span>
                        </div>

                        <p className="font-bold text-[#1E1E24] text-sm mb-1.5">
                          "{m.topic.topic}"
                        </p>

                        <div className="flex items-center justify-between text-xs text-[#64616C] font-semibold">
                          <span>
                            🟢 Tim PRO ({nameA}): {m.votesA} suara
                          </span>
                          <span>
                            🔴 Tim KONTRA ({nameB}): {m.votesB} suara
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            )}

            {/* Zona Hukuman: 3 Pemain Terbawah */}
            {bottom3.length > 0 && players.length > 1 && (
              <div className="p-4 rounded-[26px] bg-[#FFE8DF] border-2 border-[#EC5A29] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs mt-auto">
                <div>
                  <span className="text-xs font-black uppercase text-[#B93815] px-2.5 py-0.5 rounded-full bg-[#EC5A29]/15 inline-flex items-center gap-1 mb-1.5">
                    <Flame className="w-3.5 h-3.5 text-[#EC5A29]" />
                    <span>3 PEMAIN TERBAWAH KENA HUKUMAN</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {bottom3.map((p) => {
                      const rank = sortedPlayers.indexOf(p) + 1;
                      return (
                        <div key={p.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-[#EC5A29]/20 shadow-2xs">
                          <span className="font-display font-black text-xs text-[#DC2626]">#{rank}</span>
                          <PlayerProfileAvatar characterId={p.avatarId} size={20} name={p.name} />
                          <span className="font-display font-bold text-xs text-[#1E1E24]">{p.name}</span>
                          <span className="text-xs font-extrabold text-[#64616C]">({p.score} pt)</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPunishment(true)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#EC5A29] text-white font-display text-xs font-bold hover:bg-[#D44A1D] cursor-pointer shadow-xs transition flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Shuffle Hukuman 3 Terbawah</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <PunishmentModal
        open={showPunishment}
        onClose={() => setShowPunishment(false)}
        targetType="bottom3"
        targetPlayers={bottom3}
      />

      <HostUtilityBar />
    </div>
  )
}
