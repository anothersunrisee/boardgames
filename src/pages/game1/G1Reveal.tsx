import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, X, ArrowRight, Trophy, ArrowLeft } from 'lucide-react'
import { useGameStore, type G1Round } from '../../store/useGameStore'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { BlobMascot } from '../../components/ui/BlobMascot'
import { PlayerProfileAvatar } from '../../components/characters/PlayerProfileAvatar'
import { HostUtilityBar } from '../../components/HostUtilityBar'
import { sfx } from '../../utils/sound'

export default function G1Reveal() {
  const navigate = useNavigate()
  const location = useLocation()
  const { players, addScore, g1NextRound, g1CurrentRound } = useGameStore()

  const round = location.state?.round as G1Round | undefined

  useEffect(() => {
    if (!round) return
    sfx.playSuccess()
    round.answers.forEach((a) => {
      if (a.isUnique) addScore(a.playerId, 1)
    })
  }, [])

  if (!round) {
    navigate('/game1/round')
    return null
  }

  const getPlayer = (id: string) => players.find((p) => p.id === id)
  const uniqueCount = round.answers.filter((a) => a.isUnique).length
  const duplicateCount = round.answers.filter((a) => !a.isUnique).length

  const handleNext = () => {
    sfx.playPop()
    g1NextRound()
    if (g1CurrentRound >= 10) {
      navigate('/game1/results')
    } else {
      navigate('/game1/round')
    }
  }

  const handleUndo = () => {
    sfx.playPop()
    round.answers.forEach((a) => {
      if (a.isUnique) addScore(a.playerId, -1)
    })
    navigate('/game1/round')
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E24] px-4 py-6 md:py-8 pb-20 md:pb-16 flex flex-col">
      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            className="text-xs font-bold text-[#64616C] hover:text-[#1E1E24] flex items-center gap-1 cursor-pointer"
            onClick={() => {
              sfx.playPop()
              navigate('/hub')
            }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Menu Utama</span>
          </button>

          <button
            type="button"
            onClick={handleUndo}
            className="text-xs font-bold text-[#DC2626] hover:bg-[#FEE2E2] px-2.5 py-1 rounded-full border border-[#DC2626]/20 transition cursor-pointer"
            title="Undo penilaian ronde ini"
          >
            ↩️ Undo Ronde Ini
          </button>
          <span className="font-display text-xs px-3 py-1 rounded-full bg-[#158467] text-white font-bold tracking-wide uppercase">
            Ronde {round.roundNumber} Selesai
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch flex-1">
          {/* LEFT COLUMN: Prompt, Round Summary & Anchored CTA */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <Card className="p-5 bg-white shadow-xs border-2 border-[#1E1E24]/10 text-center">
              <span className="inline-block text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#D6F5EC] text-[#158467] mb-2">
                Pertanyaan Ronde {round.roundNumber}
              </span>
              <h2 className="font-display text-xl md:text-2xl text-[#1E1E24] leading-snug">
                "{round.category.prompt}"
              </h2>
            </Card>

            {/* Round Summary Card */}
            <Card className="text-center p-5 bg-white shadow-xs">
              <div className="flex items-center justify-center gap-4">
                <BlobMascot
                  shape="circle"
                  mood={uniqueCount > 0 ? 'excited' : 'dizzy'}
                  color="#5CE6C0"
                  size={54}
                  floating={false}
                />
                <div className="text-left">
                  <p className="font-display text-base font-bold text-[#1E1E24]">
                    {uniqueCount} Unik • {duplicateCount} Kembar
                  </p>
                  <p className="text-xs text-[#64616C] font-semibold">
                    {uniqueCount > 0
                      ? 'Bagus! Ada yang punya otak out of the box.'
                      : 'Waduh, sepemikiran semua! 0 poin!'}
                  </p>
                </div>
              </div>
            </Card>

            {/* Next Button */}
            <div className="mt-auto">
              <Button
                variant={g1CurrentRound >= 10 ? 'primary' : 'emerald'}
                size="lg"
                fullWidth
                onClick={handleNext}
              >
                {g1CurrentRound >= 10 ? (
                  <>
                    <Trophy className="w-5 h-5" />
                    <span>Lihat Leaderboard Akhir 🏆</span>
                  </>
                ) : (
                  <>
                    <span>Lanjut Ronde {g1CurrentRound + 1}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* RIGHT COLUMN: Answer Cards Grid */}
          <div className="lg:col-span-7">
            <Card className="p-4 bg-white shadow-xs h-full">
              <p className="font-display text-sm font-bold text-[#1E1E24] mb-3">
                Hasil Jawaban ({round.answers.length} Pemain)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {round.answers.map((a, i) => {
                  const player = getPlayer(a.playerId)
                  return (
                    <motion.div
                      key={a.playerId}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div
                        className={`flex items-center gap-2.5 p-3 rounded-2xl border-2 transition-all ${
                          a.isUnique
                            ? 'bg-[#D6F5EC] border-[#12B76A] shadow-xs'
                            : 'bg-[#FFE8DF] border-[#F04438]/40'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${
                            a.isUnique ? 'bg-[#12B76A]' : 'bg-[#F04438]'
                          }`}
                        >
                          {a.isUnique ? (
                            <Check className="w-4 h-4 stroke-[3]" />
                          ) : (
                            <X className="w-4 h-4 stroke-[3]" />
                          )}
                        </div>

                        <PlayerProfileAvatar characterId={player?.avatarId} size={32} name={player?.name} />

                        <div className="flex-1 min-w-0">
                          <p className="font-display text-sm font-bold text-[#1E1E24] truncate">
                            "{a.answer}"
                          </p>
                          <p className="text-xs font-semibold text-[#64616C] truncate">
                            {player?.name} • {player?.kubu}
                          </p>
                        </div>

                        <span
                          className={`font-display text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${
                            a.isUnique
                              ? 'bg-[#12B76A] text-white'
                              : 'bg-black/10 text-[#64616C]'
                          }`}
                        >
                          {a.isUnique ? '+1 pt' : '0 pt'}
                        </span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <HostUtilityBar onUndo={handleUndo} />
    </div>
  )
}
