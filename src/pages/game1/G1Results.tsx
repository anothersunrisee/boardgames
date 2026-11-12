import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RotateCcw, Home, ArrowLeft } from 'lucide-react'
import { useGameStore } from '../../store/useGameStore'
import { Button } from '../../components/ui/Button'
import { ScoreBoard } from '../../components/ScoreBoard'
import { BlobMascot } from '../../components/ui/BlobMascot'
import { HostUtilityBar } from '../../components/HostUtilityBar'
import { sfx } from '../../utils/sound'

export default function G1Results() {
  const navigate = useNavigate()
  const { players, fullReset } = useGameStore()

  const winner = [...players].sort((a, b) => b.score - a.score)[0]

  useEffect(() => {
    sfx.playFanfare()
  }, [])

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E24] px-4 py-8 md:py-12 flex flex-col justify-between">
      <div className="max-w-lg mx-auto w-full flex-1 flex flex-col">
        {/* Top Header Back Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            className="text-xs font-bold text-[#64616C] hover:text-[#1E1E24] flex items-center gap-1.5 cursor-pointer py-1 px-2.5 rounded-full hover:bg-black/5 transition-colors"
            onClick={() => {
              sfx.playPop()
              fullReset()
              navigate('/')
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Menu</span>
          </button>
          <span className="font-display text-xs px-3.5 py-1.5 rounded-full bg-[#158467] text-white font-bold tracking-wide">
            Hasil Akhir
          </span>
        </div>

        {/* Trophy Winner Mascot */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
        >
          <div className="relative inline-block mb-3">
            <BlobMascot
              shape="flower"
              mood="excited"
              color="#FBBF24"
              accentColor="#D97706"
              accessory="crown"
              size={130}
            />
          </div>

          <span className="inline-block px-4 py-1.5 rounded-full bg-[#158467] text-white text-xs font-black uppercase tracking-wider mb-2">
            GAME 01 SELESAI
          </span>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-[#1E1E24]">
            Pemenang: {winner?.name}! 👑
          </h1>
          <p className="text-sm font-semibold text-[#64616C] mt-1">
            Kubu {winner?.kubu} • Total Skor: {winner?.score} Poin Unik
          </p>
        </motion.div>

        {/* Stacked Leaderboard */}
        <div className="mb-8">
          <ScoreBoard players={players} highlightId={winner?.id} />
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mt-auto">
          <Button
            variant="emerald"
            fullWidth
            size="lg"
            onClick={() => {
              sfx.playPop()
              navigate('/game1/setup')
            }}
          >
            <RotateCcw className="w-5 h-5" />
            <span>Main Ronde Baru (Reset)</span>
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
