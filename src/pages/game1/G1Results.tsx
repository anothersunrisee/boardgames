import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RotateCcw, Home, ArrowLeft, Flame } from 'lucide-react'
import { useGameStore } from '../../store/useGameStore'
import { Button } from '../../components/ui/Button'
import { ScoreBoard } from '../../components/ScoreBoard'
import { GameMascotBot } from '../../components/characters/GameMascotBot'
import { PlayerProfileAvatar } from '../../components/characters/PlayerProfileAvatar'
import { ConfettiShower } from '../../components/motion/ConfettiShower'
import { PunishmentModal } from '../../components/PunishmentModal'
import { HostUtilityBar } from '../../components/HostUtilityBar'
import { CHARACTER_PACK, getCharacterById } from '../../assets-library/characters'
import { sfx } from '../../assets-library/soundEngine'

export default function G1Results() {
  const navigate = useNavigate()
  const { players, autoStartGame1 } = useGameStore()
  const [showPunishment, setShowPunishment] = useState(false)

  const sorted = [...players].sort((a, b) => b.score - a.score)
  const winner = sorted[0]
  const loser = sorted[sorted.length - 1]

  useEffect(() => {
    sfx.playFanfare()
  }, [])

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E24] px-4 py-8 md:py-12 flex flex-col justify-between relative overflow-hidden">
      {/* 60fps SVG Confetti Shower */}
      <ConfettiShower active />

      <div className="max-w-lg mx-auto w-full flex-1 flex flex-col relative z-20">
        {/* Top Header Back Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            className="text-xs font-bold text-[#64616C] hover:text-[#1E1E24] flex items-center gap-1.5 cursor-pointer py-1 px-3 rounded-full hover:bg-black/5 transition-colors"
            onClick={() => {
              sfx.playPop()
              navigate('/hub')
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Pilih Game</span>
          </button>
          <span className="font-display text-xs px-3.5 py-1.5 rounded-full bg-[#158467] text-white font-bold tracking-wide">
            Hasil Akhir Ronde
          </span>
        </div>

        {/* Trophy Winner Mascot Card */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
        >
          <div className="relative inline-block mb-3">
            <GameMascotBot
              character={CHARACTER_PACK[1]} // Kiko
              mood="winner"
              showCrown
              size={120}
            />
          </div>

          <span className="inline-block px-4 py-1.5 rounded-full bg-[#158467] text-white text-xs font-black uppercase tracking-wider mb-2">
            GAME 01 SELESAI
          </span>

          <div className="flex items-center justify-center gap-2 mb-1">
            {winner && (
              <PlayerProfileAvatar
                character={getCharacterById(winner.avatarId || 'c01')}
                size={40}
                mood="winner"
              />
            )}
            <h1 className="font-display text-3xl md:text-4xl font-bold text-[#1E1E24]">
              Pemenang: {winner?.name}! 👑
            </h1>
          </div>
          <p className="text-sm font-semibold text-[#64616C]">
            Kubu {winner?.kubu} • Total Skor: {winner?.score} Poin Unik
          </p>
        </motion.div>

        {/* Stacked Leaderboard with Player Avatars */}
        <div className="mb-6">
          <ScoreBoard players={players} highlightId={winner?.id} />
        </div>

        {/* Bottom Loser Punishment Card Trigger */}
        {loser && players.length > 1 && (
          <div className="mb-6">
            <div className="p-4 rounded-[26px] bg-[#FFE8DF] border-2 border-[#EC5A29] flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <PlayerProfileAvatar
                  character={getCharacterById(loser.avatarId || 'c11')}
                  size={42}
                  mood="dizzy"
                />
                <div>
                  <span className="text-[10px] font-black uppercase text-[#EC5A29] px-2 py-0.5 rounded-full bg-[#EC5A29]/15">
                    💀 KENA HUKUMAN
                  </span>
                  <p className="font-display text-sm font-bold text-[#1E1E24]">
                    {loser.name} ({loser.score} pts)
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPunishment(true)}
                className="px-3.5 py-2 rounded-xl bg-[#EC5A29] text-white font-display text-xs font-bold hover:bg-[#D44A1D] cursor-pointer shadow-xs transition flex items-center gap-1.5"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Shuffle Hukuman</span>
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 mt-auto">
          <Button
            variant="emerald"
            fullWidth
            size="lg"
            onClick={() => {
              sfx.playPop()
              autoStartGame1()
              navigate('/game1/round')
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
              navigate('/hub')
            }}
          >
            <Home className="w-5 h-5" />
            <span>Pilih Game Lain</span>
          </Button>
        </div>
      </div>

      {/* 3D Flip Punishment Modal */}
      <PunishmentModal
        open={showPunishment}
        onClose={() => setShowPunishment(false)}
        loserName={loser?.name}
      />

      <HostUtilityBar />
    </div>
  )
}
