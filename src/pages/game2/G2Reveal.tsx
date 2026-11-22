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

export default function G2Reveal() {
  const navigate = useNavigate()
  const {
    g2BoyPlayers,
    g2GirlPlayers,
    g2Slots,
    g2CurrentSlotIndex,
    g2NextSlot,
    addScore,
    incrementG2BoyWins,
    incrementG2GirlWins,
    g2OverrideGuess,
    players,
  } = useGameStore()
  const scored = useRef(false)

  const slot = g2Slots[g2CurrentSlotIndex]
  const girl = g2GirlPlayers.find((p) => p.id === slot?.playerId)

  useEffect(() => {
    if (!slot || scored.current) return
    scored.current = true
    sfx.playSuccess()

    const hasAnyBoyCorrect = slot.boyGuesses.some((bg) => bg.correct)
    if (hasAnyBoyCorrect) {
      incrementG2BoyWins()
      slot.boyGuesses.forEach((bg) => {
        if (bg.correct) addScore(bg.boyId, 3)
      })
    } else {
      // Cewek berhasil menjaga rahasia!
      incrementG2GirlWins()
      addScore(slot.playerId, 4)
    }
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
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E24] px-4 py-6 md:py-8 pb-20 md:pb-16 flex flex-col justify-between">
      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">
        {/* Top Header with Back Navigation */}
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

          <span className="font-display text-xs px-3.5 py-1.5 rounded-full bg-[#D8317E] text-white font-bold tracking-wide">
            Cewek {g2CurrentSlotIndex + 1} / {g2Slots.length}
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
                <BlobMascot shape="scallop" mood="cheeky" color="#FF8AC2" size={82} />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#64616C] mb-1.5">
                Benda Rahasia Milik {girl.name}:
              </p>
              <div className="rounded-[24px] bg-[#D8317E] text-white py-4 px-5 shadow-md border-2 border-[#1E1E24]/10 max-w-xs mx-auto">
                <p className="font-display text-2xl md:text-3xl font-bold">{slot.secretItem}</p>
              </div>

              {/* Keeper Outcome Banner */}
              <div className="mt-4">
                {slot.boyGuesses.some((bg) => bg.correct) ? (
                  <div className="p-3 rounded-2xl bg-[#FFE8DF] border border-[#F04438]/30 text-center">
                    <span className="text-xs font-black text-[#D92D20]">
                      💥 RAHASIA TERBONGKAR! Cowok yang berhasil menebak dapat +3 Poin masing-masing.
                    </span>
                  </div>
                ) : (
                  <div className="p-3 rounded-2xl bg-[#D6F5EC] border border-[#12B76A]/40 text-center">
                    <span className="text-xs font-black text-[#0F5E49]">
                      🛡️ RAHASIA AMAN TERJAGA! Tidak ada yang bisa menebak, +4 Poin untuk {girl.name}!
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

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

          {/* RIGHT COLUMN: Boy Guesses Breakdown & Live Leaderboard */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <Card className="p-4 bg-white shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <p className="font-display text-base font-bold text-[#1E1E24]">Hasil Tebakan Para Cowok</p>
                <span className="text-xs font-bold text-[#64616C] bg-[#FAF7F2] px-2.5 py-0.5 rounded-md border border-black/5">
                  Host bisa koreksi tombol jika typo
                </span>
              </div>
              <div className="space-y-2">
                {slot.boyGuesses.map((bg, i) => {
                  const boy = g2BoyPlayers.find((b) => b.id === bg.boyId)
                  return (
                    <motion.div
                      key={bg.boyId}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className={`flex items-center gap-3 p-2.5 rounded-2xl border-2 transition-all ${
                        bg.correct
                          ? 'bg-[#D6F5EC] border-[#12B76A]'
                          : 'bg-[#FFE8DF] border-[#F04438]/40'
                      }`}
                    >
                      <PlayerProfileAvatar characterId={boy?.avatarId} size={32} name={boy?.name} />

                      <div className="flex-1 min-w-0">
                        <p className="font-display text-sm font-bold text-[#1E1E24] truncate">{boy?.name}</p>
                        <p className="text-xs text-[#64616C] font-semibold truncate">Tebak: "{bg.guess}"</p>
                      </div>

                      {/* Interactive Host Override Button */}
                      <button
                        type="button"
                        onClick={() => {
                          sfx.playPop(720)
                          g2OverrideGuess(g2CurrentSlotIndex, bg.boyId, !bg.correct)
                        }}
                        title="Klik untuk mengubah status tebakan pemain ini"
                        className={`font-display text-xs font-extrabold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition active:scale-95 cursor-pointer shrink-0 ${
                          bg.correct
                            ? 'bg-[#12B76A] text-white border-[#0E9355] shadow-xs'
                            : 'bg-white text-[#D92D20] border-[#F04438]/40 hover:bg-[#FFE8DF]'
                        }`}
                      >
                        {bg.correct ? (
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
