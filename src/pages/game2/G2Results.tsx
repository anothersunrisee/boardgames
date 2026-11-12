import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RotateCcw, Home } from 'lucide-react'
import { useGameStore } from '../../store/useGameStore'
import { Button } from '../../components/ui/Button'
import { ScoreBoard } from '../../components/ScoreBoard'
import { BlobMascot } from '../../components/ui/BlobMascot'
import { HostUtilityBar } from '../../components/HostUtilityBar'
import { sfx } from '../../utils/sound'

export default function G2Results() {
  const navigate = useNavigate()
  const { players, fullReset } = useGameStore()
  const winner = [...players].sort((a, b) => b.score - a.score)[0]

  useEffect(() => {
    sfx.playFanfare()
  }, [])

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E24] px-4 py-8 md:py-12 flex flex-col justify-between">
      <div className="max-w-lg mx-auto w-full flex-1 flex flex-col">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
        >
          <div className="mb-3">
            <BlobMascot
              shape="scallop"
              mood="excited"
              color="#FF8AC2"
              accentColor="#9A1454"
              accessory="crown"
              size={130}
            />
          </div>

          <span className="inline-block px-4 py-1.5 rounded-full bg-[#D8317E] text-white text-xs font-black uppercase tracking-wider mb-2">
            BEAUTY EXPERT SELESAI
          </span>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-[#1E1E24]">
            Pemenang: {winner?.name}! 💄
          </h1>
          <p className="text-sm font-semibold text-[#64616C] mt-1">
            Kubu {winner?.kubu} • Total Skor: {winner?.score} Poin Tebakan
          </p>
        </motion.div>

        <div className="mb-8">
          <ScoreBoard players={players} highlightId={winner?.id} />
        </div>

        <div className="space-y-3 mt-auto">
          <Button
            variant="berry"
            fullWidth
            size="lg"
            onClick={() => {
              sfx.playPop()
              navigate('/game2/setup')
            }}
          >
            <RotateCcw className="w-5 h-5" />
            <span>Main Lagi (Reset)</span>
          </Button>

          <Button
            variant="ink"
            fullWidth
            size="lg"
            onClick={() => {
              sfx.playPop()
              fullReset()
              navigate('/')
            }}
          >
            <Home className="w-5 h-5" />
            <span>Kembali ke Menu Utama</span>
          </Button>
        </div>
      </div>

      <HostUtilityBar />
    </div>
  )
}
