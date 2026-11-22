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
  const bottom3 = sorted.length <= 3 ? sorted : sorted.slice(-3)

  useEffect(() => {
    sfx.playFanfare()
  }, [])

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E24] px-4 sm:px-6 py-4 md:py-6 pb-20 md:pb-16 flex flex-col justify-between relative overflow-hidden">
      {/* 60fps SVG Confetti Shower */}
      <ConfettiShower active />

      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col relative z-20">
        {/* Top Header Back Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            className="text-xs font-bold text-[#64616C] hover:text-[#1E1E24] inline-flex items-center gap-1.5 cursor-pointer py-1.5 px-3.5 rounded-full bg-white border-2 border-[#1E1E24]/15 hover:border-[#1E1E24]/40 shadow-2xs transition-colors"
            onClick={() => {
              sfx.playPop()
              navigate('/hub')
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Pilih Game</span>
          </button>
          <span className="font-display text-xs px-3.5 py-1.5 rounded-full bg-[#158467] text-white font-bold tracking-wide shadow-2xs">
            Hasil Akhir Ronde • Game 01
          </span>
        </div>

        {/* 2-Column Championship Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch flex-1">
          {/* LEFT COLUMN: Trophy Winner Spotlight + Action Buttons */}
          <motion.div
            className="lg:col-span-5 rounded-[28px] bg-white border-[2.5px] border-[#1E1E24] shadow-[0_6px_0_#1E1E24] p-5 sm:p-6 flex flex-col justify-between text-center gap-4"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 16 }}
          >
            <div className="flex flex-col items-center justify-center flex-1 py-2">
              <div className="relative inline-block mb-3">
                <GameMascotBot
                  character={CHARACTER_PACK[1]} // Kiko
                  mood="winner"
                  showCrown
                  size={100}
                />
              </div>

              <span className="inline-block px-3.5 py-1 rounded-full bg-[#158467] text-white text-xs font-black uppercase tracking-wider mb-3">
                GAME 01 SELESAI
              </span>

              <div className="flex flex-col items-center gap-2 mb-1.5">
                {winner && (
                  <PlayerProfileAvatar
                    character={getCharacterById(winner.avatarId || 'c01')}
                    size={48}
                    mood="winner"
                  />
                )}
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1E1E24] leading-tight">
                  Pemenang: {winner?.name}! 👑
                </h1>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#64616C]">
                Kubu {winner?.kubu} • Total Skor: {winner?.score} Poin Unik
              </p>
            </div>

            {/* Action Buttons Anchored Cleanly */}
            <div className="space-y-2.5 pt-2 border-t border-[#1E1E24]/10">
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
          </motion.div>

          {/* RIGHT COLUMN: Full Leaderboard + Bottom-3 Punishment Card */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-4">
            <div className="flex-1">
              <ScoreBoard players={players} highlightId={winner?.id} />
            </div>

            {/* Bottom Loser Punishment Card Trigger: 3 Pemain Terbawah */}
            {bottom3.length > 0 && players.length > 1 && (
              <div className="p-4 rounded-[24px] bg-[#FFE8DF] border-2 border-[#EC5A29] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-black uppercase text-[#B93815] px-2.5 py-0.5 rounded-full bg-[#EC5A29]/15 inline-flex items-center gap-1 mb-2">
                    <Flame className="w-3.5 h-3.5 text-[#EC5A29]" />
                    <span>3 PEMAIN TERBAWAH KENA HUKUMAN</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {bottom3.map((p) => {
                      const rank = sorted.indexOf(p) + 1;
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
                  <span>Shuffle Hukuman</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3D Flip Punishment Modal */}
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
