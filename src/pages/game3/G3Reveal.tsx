import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, X, ArrowRight, Trophy } from 'lucide-react'
import { useGameStore } from '../../store/useGameStore'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { ScoreBoard } from '../../components/ScoreBoard'
import { BlobMascot } from '../../components/ui/BlobMascot'
import { PlayerProfileAvatar } from '../../components/characters/PlayerProfileAvatar'
import { HostUtilityBar } from '../../components/HostUtilityBar'
import { sfx } from '../../utils/sound'

export default function G3Reveal() {
  const navigate = useNavigate()
  const {
    g3BoyPlayers,
    g3GirlPlayers,
    g3Slots,
    g3CurrentSlotIndex,
    g3NextSlot,
    addScore,
    incrementG3BoyWins,
    incrementG3GirlWins,
    g3OverrideGuess,
    players,
  } = useGameStore()
  const scored = useRef(false)

  const slot = g3Slots[g3CurrentSlotIndex]
  const boy = g3BoyPlayers.find((p) => p.id === slot?.playerId)

  useEffect(() => {
    if (!slot || scored.current) return
    scored.current = true
    sfx.playSuccess()

    const hasAnyGirlCorrect = slot.girlGuesses.some((gg) => gg.correct)
    if (hasAnyGirlCorrect) {
      incrementG3GirlWins()
      slot.girlGuesses.forEach((gg) => {
        if (gg.correct) addScore(gg.girlId, 3)
      })
    } else {
      // Cowok berhasil menjaga rahasia!
      incrementG3BoyWins()
      addScore(slot.playerId, 4)
    }
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
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E24] px-4 py-6 md:py-8 pb-20 md:pb-16 flex flex-col justify-between">
      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">
        {/* Top Header with Back Navigation */}
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
            <span>Menu Utama</span>
          </button>

          <span className="font-display text-xs px-3.5 py-1.5 rounded-full bg-[#2568EF] text-white font-bold tracking-wide">
            Cowok {g3CurrentSlotIndex + 1} / {g3Slots.length}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch flex-1">
          {/* LEFT COLUMN: Revealed Secret + Outcome + Next CTA */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <motion.div
              className="text-center p-5 rounded-[28px] bg-white border-2 border-[#1E1E24]/10 shadow-xs"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 15 }}
            >
              <div className="mb-2">
                <BlobMascot shape="hexagon" mood="confident" color="#7CC0FF" accentColor="#1545A8" accessory="glasses" size={82} />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#64616C] mb-1.5">
                Kata Rahasia ({slot.category}) Milik {boy.name}:
              </p>
              <div className="rounded-[24px] bg-[#2568EF] text-white py-4 px-5 shadow-md border-2 border-[#1E1E24]/10 max-w-xs mx-auto">
                <p className="font-display text-2xl md:text-3xl font-bold">{slot.secretWord}</p>
              </div>

              {/* Keeper Outcome Banner */}
              <div className="mt-4">
                {slot.girlGuesses.some((gg) => gg.correct) ? (
                  <div className="p-3 rounded-2xl bg-[#FFE8DF] border border-[#F04438]/30 text-center">
                    <span className="text-xs font-black text-[#D92D20]">
                      💥 RAHASIA TERBONGKAR! Cewek yang berhasil menebak dapat +3 Poin masing-masing.
                    </span>
                  </div>
                ) : (
                  <div className="p-3 rounded-2xl bg-[#D6F5EC] border border-[#12B76A]/40 text-center">
                    <span className="text-xs font-black text-[#0F5E49]">
                      🛡️ RAHASIA AMAN TERJAGA! Tidak ada yang bisa menebak, +4 Poin untuk {boy.name}!
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

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

          {/* RIGHT COLUMN: Girl Guesses Breakdown & Live Leaderboard */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <Card className="p-4 bg-white shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <p className="font-display text-base font-bold text-[#1E1E24]">Hasil Tebakan Para Cewek</p>
                <span className="text-xs font-bold text-[#64616C] bg-[#FAF7F2] px-2.5 py-0.5 rounded-md border border-black/5">
                  Host bisa koreksi tombol jika typo
                </span>
              </div>
              <div className="space-y-2">
                {slot.girlGuesses.map((gg, i) => {
                  const girl = g3GirlPlayers.find((g) => g.id === gg.girlId)
                  return (
                    <motion.div
                      key={gg.girlId}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className={`flex items-center gap-3 p-2.5 rounded-2xl border-2 transition-all ${
                        gg.correct
                          ? 'bg-[#D6F5EC] border-[#12B76A]'
                          : 'bg-[#FFE8DF] border-[#F04438]/40'
                      }`}
                    >
                      <PlayerProfileAvatar characterId={girl?.avatarId} size={32} name={girl?.name} />

                      <div className="flex-1 min-w-0">
                        <p className="font-display text-sm font-bold text-[#1E1E24] truncate">{girl?.name}</p>
                        <p className="text-xs text-[#64616C] font-semibold truncate">Tebak: "{gg.guess}"</p>
                      </div>

                      {/* Interactive Host Override Button */}
                      <button
                        type="button"
                        onClick={() => {
                          sfx.playPop(720)
                          g3OverrideGuess(g3CurrentSlotIndex, gg.girlId, !gg.correct)
                        }}
                        title="Klik untuk mengubah status tebakan pemain ini"
                        className={`font-display text-xs font-extrabold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition active:scale-95 cursor-pointer shrink-0 ${
                          gg.correct
                            ? 'bg-[#12B76A] text-white border-[#0E9355] shadow-xs'
                            : 'bg-white text-[#D92D20] border-[#F04438]/40 hover:bg-[#FFE8DF]'
                        }`}
                      >
                        {gg.correct ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>+3 Pts (Benar)</span>
                          </>
                        ) : (
                          <>
                            <X className="w-3.5 h-3.5 stroke-[3]" />
                            <span>0 Pt (Salah)</span>
                          </>
                        )}
                      </button>
                    </motion.div>
                  )
                })}
              </div>
            </Card>

            <ScoreBoard players={players} title="Skor Sementara" />
          </div>
        </div>
      </div>

      <HostUtilityBar />
    </div>
  )
}
