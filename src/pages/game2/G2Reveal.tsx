import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, X, ArrowRight, Trophy } from 'lucide-react'
import { useGameStore } from '../../store/useGameStore'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { ScoreBoard } from '../../components/ScoreBoard'
import { BlobMascot } from '../../components/ui/BlobMascot'
import { HostUtilityBar } from '../../components/HostUtilityBar'
import { sfx } from '../../utils/sound'

export default function G2Reveal() {
  const navigate = useNavigate()
  const { g2BoyPlayers, g2GirlPlayers, g2Slots, g2CurrentSlotIndex, g2NextSlot, addScore, players } = useGameStore()
  const scored = useRef(false)

  const slot = g2Slots[g2CurrentSlotIndex]
  const girl = g2GirlPlayers.find((p) => p.id === slot?.playerId)

  useEffect(() => {
    if (!slot || scored.current) return
    scored.current = true
    sfx.playSuccess()
    slot.boyGuesses.forEach((bg) => {
      if (bg.correct) addScore(bg.boyId, 1)
    })
  }, [])

  if (!slot || !girl) { navigate('/game2/setup'); return null }

  const isLastSlot = g2CurrentSlotIndex >= g2Slots.length - 1

  const handleNext = () => {
    sfx.playPop()
    if (isLastSlot) {
      navigate('/game2/results')
    } else {
      g2NextSlot()
      navigate('/game2/secret')
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E24] px-4 py-8 md:py-12 flex flex-col justify-between">
      <div className="max-w-lg mx-auto w-full flex-1 flex flex-col">
        {/* Top Header with Back Navigation */}
        <div className="flex items-center justify-between mb-5">
          <button
            type="button"
            className="text-xs font-bold text-[#64616C] hover:text-[#1E1E24] flex items-center gap-1 cursor-pointer"
            onClick={() => {
              sfx.playPop()
              navigate('/')
            }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Menu Utama</span>
          </button>

          <span className="font-display text-xs px-3.5 py-1.5 rounded-full bg-[#D8317E] text-white font-bold tracking-wide">
            Cewek {g2CurrentSlotIndex + 1} / {g2Slots.length}
          </span>
        </div>

        {/* Revealed Secret Item Card */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
        >
          <div className="mb-2">
            <BlobMascot shape="scallop" mood="cheeky" color="#FF8AC2" size={90} />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#64616C] mb-1">
            Benda Rahasia Milik {girl.name}:
          </p>
          <div className="rounded-[28px] bg-[#D8317E] text-white py-5 px-6 shadow-md border-2 border-[#1E1E24]/10 max-w-xs mx-auto">
            <p className="font-display text-3xl font-bold">{slot.secretItem}</p>
          </div>
        </motion.div>

        {/* Boy Guesses Breakdown */}
        <Card className="mb-5 p-5 bg-white shadow-xs">
          <p className="font-display text-base font-bold text-[#1E1E24] mb-3">Hasil Tebakan Para Cowok</p>
          <div className="space-y-2.5">
            {slot.boyGuesses.map((bg, i) => {
              const boy = g2BoyPlayers.find((b) => b.id === bg.boyId)
              return (
                <motion.div
                  key={bg.boyId}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 ${
                    bg.correct
                      ? 'bg-[#D6F5EC] border-[#12B76A]'
                      : 'bg-[#FFE8DF] border-[#F04438]/40'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${
                      bg.correct ? 'bg-[#12B76A]' : 'bg-[#F04438]'
                    }`}
                  >
                    {bg.correct ? <Check className="w-4 h-4 stroke-[3]" /> : <X className="w-4 h-4 stroke-[3]" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-display text-base font-bold text-[#1E1E24]">{boy?.name}</p>
                    <p className="text-xs text-[#64616C] font-semibold">Tebak: "{bg.guess}"</p>
                  </div>

                  <span
                    className={`font-display text-sm font-bold px-3 py-1 rounded-full ${
                      bg.correct ? 'bg-[#12B76A] text-white' : 'bg-black/10 text-[#64616C]'
                    }`}
                  >
                    {bg.correct ? '+1 pt' : '0 pt'}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </Card>

        {/* Live Leaderboard */}
        <div className="mb-6">
          <ScoreBoard players={players} title="Skor Sementara" />
        </div>

        <div className="mt-auto">
          <Button
            variant={isLastSlot ? 'primary' : 'berry'}
            size="lg"
            fullWidth
            onClick={handleNext}
          >
            {isLastSlot ? (
              <>
                <Trophy className="w-5 h-5" />
                <span>Lihat Hasil Akhir Beauty Expert 👑</span>
              </>
            ) : (
              <>
                <span>Lanjut ke Cewek Berikutnya</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>
        </div>
      </div>

      <HostUtilityBar />
    </div>
  )
}
