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

export default function G3Results() {
  const navigate = useNavigate()
  const { players, autoStartGame3, g3BoyWins, g3GirlWins } = useGameStore()
  const [showPunishment, setShowPunishment] = useState(false)
  const winner = [...players].sort((a, b) => b.score - a.score)[0]

  useEffect(() => {
    sfx.playFanfare()
  }, [])

  const winningTeam =
    g3BoyWins > g3GirlWins
      ? 'Tim Cowok Menang Kelompok!'
      : g3GirlWins > g3BoyWins
      ? 'Tim Cewek Menang Kelompok!'
      : 'Hasil Kelompok Seri!'

  const losingTeamName =
    g3BoyWins > g3GirlWins ? 'Tim Cewek' : g3GirlWins > g3BoyWins ? 'Tim Cowok' : 'Tim yang Kalah Poin';

  const losingTeamGender = g3BoyWins > g3GirlWins ? 'cewek' : 'cowok';
  const losingMembers = players.filter((p) => p.gender === losingTeamGender);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E24] px-4 py-8 md:py-12 flex flex-col justify-between relative overflow-hidden">
      {/* 60fps Confetti Shower */}
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
            <span>Pilih Game Lain</span>
          </button>
          <span className="font-display text-xs px-3.5 py-1.5 rounded-full bg-[#2568EF] text-white font-bold tracking-wide">
            Hasil Akhir
          </span>
        </div>

        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
        >
          <div className="mb-3">
            <GameMascotBot
              character={CHARACTER_PACK[4]} // Zuzu (Cobalt Blue)
              mood="winner"
              showCrown
              size={120}
            />
          </div>

          <span className="inline-block px-4 py-1.5 rounded-full bg-[#2568EF] text-white text-xs font-black uppercase tracking-wider mb-2">
            BOYS STUFF SELESAI
          </span>

          <div className="flex items-center justify-center gap-2 mb-1">
            {winner && (
              <PlayerProfileAvatar
                character={getCharacterById(winner.avatarId || 'c05')}
                size={40}
                mood="winner"
              />
            )}
            <h1 className="font-display text-3xl md:text-4xl font-bold text-[#1E1E24]">
              Pemenang: {winner?.name}! 🔧
            </h1>
          </div>
          <p className="text-sm font-semibold text-[#64616C]">
            Kubu {winner?.kubu} • Total Skor: {winner?.score} Poin Tebakan
          </p>
        </motion.div>

        {/* Skor Kelompok Game 3 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#64616C]">
              📊 Nilai Kelompok Game Ini:
            </span>
            <span className="text-xs font-bold text-[#2568EF]">{winningTeam}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div
              className={`p-4 rounded-2xl border-2 text-center ${
                g3BoyWins >= g3GirlWins
                  ? 'bg-[#E0EBFF] border-[#2568EF] ring-2 ring-[#2568EF]'
                  : 'bg-white border-[#1E1E24]/10'
              }`}
            >
              <span className="text-[10px] font-black uppercase text-[#2568EF] px-2.5 py-0.5 rounded-full bg-[#2568EF]/10">
                Tim Cowok (Bertahan)
              </span>
              <p className="font-display text-3xl font-bold text-[#2568EF] mt-1">{g3BoyWins}</p>
              <span className="text-xs font-bold text-[#64616C]">Ronde Menang</span>
            </div>

            <div
              className={`p-4 rounded-2xl border-2 text-center ${
                g3GirlWins >= g3BoyWins
                  ? 'bg-[#FCE4F0] border-[#D8317E] ring-2 ring-[#D8317E]'
                  : 'bg-white border-[#1E1E24]/10'
              }`}
            >
              <span className="text-[10px] font-black uppercase text-[#D8317E] px-2.5 py-0.5 rounded-full bg-[#D8317E]/10">
                Tim Cewek (Menebak)
              </span>
              <p className="font-display text-3xl font-bold text-[#D8317E] mt-1">{g3GirlWins}</p>
              <span className="text-xs font-bold text-[#64616C]">Ronde Menang</span>
            </div>
          </div>
        </div>

        {/* Losing Team Punishment Box */}
        <div className="mb-6">
          <div className="p-4 rounded-[26px] bg-[#FFE8DF] border-2 border-[#EC5A29] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div>
              <span className="text-[10px] font-black uppercase text-[#EC5A29] px-2.5 py-0.5 rounded-full bg-[#EC5A29]/15 inline-flex items-center gap-1 mb-1.5">
                <Flame className="w-3 h-3 text-[#EC5A29]" />
                <span>HUKUMAN: 1 TIM KALAH ({losingTeamName})</span>
              </span>
              <p className="text-xs text-[#64616C] font-semibold mb-2">
                Seluruh anggota {losingTeamName} ({losingMembers.length} orang) wajib jalani hukuman bersama:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {losingMembers.map((p) => (
                  <div key={p.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-[#EC5A29]/20 shadow-2xs">
                    <PlayerProfileAvatar characterId={p.avatarId} size={20} name={p.name} />
                    <span className="font-display font-bold text-xs text-[#1E1E24]">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowPunishment(true)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#EC5A29] text-white font-display text-xs font-bold hover:bg-[#D44A1D] cursor-pointer shadow-xs transition flex items-center justify-center gap-1.5 shrink-0"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Shuffle Hukuman Tim</span>
            </button>
          </div>
        </div>

        <div className="mb-8">
          <ScoreBoard players={players} title="Papan Skor Perorangan Room" highlightId={winner?.id} />
        </div>

        <div className="space-y-3 mt-auto">
          <Button
            variant="cobalt"
            fullWidth
            size="lg"
            onClick={() => {
              sfx.playPop()
              autoStartGame3()
              navigate('/game3/secret')
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
        targetType="team"
        targetTeamName={losingTeamName}
        targetPlayers={losingMembers}
      />

      <HostUtilityBar />
    </div>
  )
}
