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

export default function G3Reveal() {
  const navigate = useNavigate()
  const { g3BoyPlayers, g3GirlPlayers, g3Slots, g3CurrentSlotIndex, g3NextSlot, addScore, players } = useGameStore()
  const scored = useRef(false)

  const slot = g3Slots[g3CurrentSlotIndex]
  const boy = g3BoyPlayers.find((p) => p.id === slot?.playerId)

  useEffect(() => {
    if (!slot || scored.current) return
    scored.current = true
    sfx.playSuccess()
    slot.girlGuesses.forEach((gg) => {
      if (gg.correct) addScore(gg.girlId, 1)
    })
  }, [])

  if (!slot || !boy) {
    navigate('/game3/setup')
    return null
  }

  const isLastSlot = g3CurrentSlotIndex >= g3Slots.length - 1

  const handleNext = () => {
    sfx.playPop()
    if (isLastSlot) {
      navigate('/game3/results')
    } else {
      g3NextSlot()
      navigate('/game3/secret')
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E24] px-4 py-8 md:py-12 flex flex-col justify-between">
      <div className="max-w-lg mx-auto w-full flex-1 flex flex-col">
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

          <span className="font-display text-xs px-3.5 py-1.5 rounded-full bg-[#2568EF] text-white font-bold tracking-wide">
            Cowok {g3CurrentSlotIndex + 1} / {g3Slots.length}
          </span>
        </div>

        {/* Revealed Secret Word Card */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
        >
          <div className="mb-2">
            <BlobMascot shape="hexagon" mood="confident" color="#7CC0FF" accentColor="#1545A8" accessory="glasses" size={90} />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#64616C] mb-1">
            Kata Rahasia ({slot.category}) Milik {boy.name}:
          </p>
          <div className="rounded-[28px] bg-[#2568EF] text-white py-5 px-6 shadow-md border-2 border-[#1E1E24]/10 max-w-xs mx-auto">
            <p className="font-display text-3xl font-bold">{slot.secretWord}</p>
          </div>
        </motion.div>

        {/* Girl Guesses Breakdown */}
        <Card className="mb-5 p-5 bg-white shadow-xs">
          <p className="font-display text-base font-bold text-[#1E1E24] mb-3">Hasil Tebakan Para Cewek</p>
          <div className="space-y-2.5">
            {slot.girlGuesses.map((gg, i) => {
              const girl = g3GirlPlayers.find((g) => g.id === gg.girlId)
              return (
                <motion.div
                  key={gg.girlId}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 ${
                    gg.correct
                      ? 'bg-[#D6F5EC] border-[#12B76A]'
                      : 'bg-[#FFE8DF] border-[#F04438]/40'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${
                      gg.correct ? 'bg-[#12B76A]' : 'bg-[#F04438]'
                    }`}
                  >
                    {gg.correct ? <Check className="w-4 h-4 stroke-[3]" /> : <X className="w-4 h-4 stroke-[3]" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-display text-base font-bold text-[#1E1E24]">{girl?.name}</p>
                    <p className="text-xs text-[#64616C] font-semibold">Tebak: "{gg.guess}"</p>
                  </div>

                  <span
                    className={`font-display text-sm font-bold px-3 py-1 rounded-full ${
                      gg.correct ? 'bg-[#12B76A] text-white' : 'bg-black/10 text-[#64616C]'
                    }`}
                  >
                    {gg.correct ? '+1 pt' : '0 pt'}
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
            variant={isLastSlot ? 'primary' : 'cobalt'}
            size="lg"
            fullWidth
            onClick={handleNext}
          >
            {isLastSlot ? (
              <>
                <Trophy className="w-5 h-5" />
                <span>Lihat Hasil Akhir Boys Stuff 👑</span>
              </>
            ) : (
              <>
                <span>Lanjut ke Cowok Berikutnya</span>
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
