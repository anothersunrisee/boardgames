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

export default function G2Results() {
  const navigate = useNavigate()
  const { players, autoStartGame2, g2GirlWins, g2BoyWins } = useGameStore()
  const winner = [...players].sort((a, b) => b.score - a.score)[0]

  useEffect(() => {
    sfx.playFanfare()
  }, [])

  const winningTeam =
    g2GirlWins > g2BoyWins
      ? 'Tim Cewek Menang Kelompok!'
      : g2BoyWins > g2GirlWins
      ? 'Tim Cowok Menang Kelompok!'
      : 'Hasil Kelompok Seri!'

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
              navigate('/')
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Pilih Game Lain</span>
          </button>
          <span className="font-display text-xs px-3.5 py-1.5 rounded-full bg-[#D8317E] text-white font-bold tracking-wide">
            Hasil Akhir
          </span>
        </div>

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

        {/* Skor Kelompok Game 2 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#64616C]">
              📊 Nilai Kelompok Game Ini:
            </span>
            <span className="text-xs font-bold text-[#D8317E]">{winningTeam}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div
              className={`p-4 rounded-2xl border-2 text-center ${
                g2GirlWins >= g2BoyWins
                  ? 'bg-[#FCE4F0] border-[#D8317E] ring-2 ring-[#D8317E]'
                  : 'bg-white border-[#1E1E24]/10'
              }`}
            >
              <span className="text-[10px] font-black uppercase text-[#D8317E] px-2.5 py-0.5 rounded-full bg-[#D8317E]/10">
                Tim Cewek (Bertahan)
              </span>
              <p className="font-display text-3xl font-bold text-[#D8317E] mt-1">{g2GirlWins}</p>
              <span className="text-xs font-bold text-[#64616C]">Ronde Menang</span>
            </div>

            <div
              className={`p-4 rounded-2xl border-2 text-center ${
                g2BoyWins >= g2GirlWins
                  ? 'bg-[#E0EBFF] border-[#2568EF] ring-2 ring-[#2568EF]'
                  : 'bg-white border-[#1E1E24]/10'
              }`}
            >
              <span className="text-[10px] font-black uppercase text-[#2568EF] px-2.5 py-0.5 rounded-full bg-[#2568EF]/10">
                Tim Cowok (Menebak)
              </span>
              <p className="font-display text-3xl font-bold text-[#2568EF] mt-1">{g2BoyWins}</p>
              <span className="text-xs font-bold text-[#64616C]">Ronde Menang</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <ScoreBoard players={players} title="Papan Skor Perorangan Room" highlightId={winner?.id} />
        </div>

        <div className="space-y-3 mt-auto">
          <Button
            variant="berry"
            fullWidth
            size="lg"
            onClick={() => {
              sfx.playPop()
              autoStartGame2()
              navigate('/game2/secret')
            }}
          >
            <RotateCcw className="w-5 h-5" />
            <span>Main Game Ini Lagi (Acak Ulang)</span>
          </Button>

          <Button
            variant="ink"
            fullWidth
            size="lg"
            onClick={() => {
              sfx.playPop()
              navigate('/')
            }}
          >
            <Home className="w-5 h-5" />
            <span>Pilih Game Lain</span>
          </Button>
        </div>
      </div>

      <HostUtilityBar />
    </div>
  )
}
