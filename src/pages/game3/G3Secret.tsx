import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, ArrowLeft, Check, X, ArrowRight, Trophy, HelpCircle } from 'lucide-react'
import { useGameStore } from '../../store/useGameStore'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { BlobMascot } from '../../components/ui/BlobMascot'
import { HostUtilityBar } from '../../components/HostUtilityBar'
import { sfx } from '../../utils/sound'

export default function G3Secret() {
  const navigate = useNavigate()
  const {
    g3BoyPlayers,
    g3GirlPlayers,
    g3Slots,
    g3CurrentSlotIndex,
    g3NextSlot,
    addScore,
  } = useGameStore()

  const [isSecretRevealed, setIsSecretRevealed] = useState(false)
  const [q1Done, setQ1Done] = useState(false)
  const [q2Done, setQ2Done] = useState(false)
  const [roundResult, setRoundResult] = useState<'guessed' | 'failed' | null>(null)
  const [creditedGirlId, setCreditedGirlId] = useState<string>('')

  const slot = g3Slots[g3CurrentSlotIndex]
  const boy = g3BoyPlayers.find((p) => p.id === slot?.playerId)

  if (!slot || !boy) {
    navigate('/game3/setup')
    return null
  }

  const isLastSlot = g3CurrentSlotIndex >= g3Slots.length - 1

  const handleMarkGuessed = (girlId?: string) => {
    sfx.playSuccess()
    const targetGirlId = girlId || g3GirlPlayers[0]?.id
    setCreditedGirlId(targetGirlId)
    setRoundResult('guessed')
    if (targetGirlId) {
      addScore(targetGirlId, 1)
    }
  }

  const handleMarkFailed = () => {
    sfx.playBuzzer()
    setRoundResult('failed')
    addScore(boy.id, 1)
  }

  const handleNext = () => {
    sfx.playPop()
    if (isLastSlot) {
      navigate('/game3/results')
    } else {
      g3NextSlot()
      setIsSecretRevealed(false)
      setQ1Done(false)
      setQ2Done(false)
      setRoundResult(null)
      setCreditedGirlId('')
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E24] px-4 py-8 md:py-12 flex flex-col justify-between">
      <div className="max-w-lg mx-auto w-full flex-1 flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-5">
          <button
            type="button"
            className="text-xs font-bold text-[#64616C] hover:text-[#1E1E24] flex items-center gap-1.5 cursor-pointer py-1 px-2.5 rounded-full hover:bg-black/5 transition-colors"
            onClick={() => {
              sfx.playPop()
              navigate('/game3/setup')
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Setup Ulang</span>
          </button>

          <span className="font-display text-xs px-3.5 py-1.5 rounded-full bg-[#2568EF] text-white font-bold tracking-wide">
            Cowok {g3CurrentSlotIndex + 1} / {g3Slots.length}
          </span>
        </div>

        {/* Mascot & Target Boy Banner */}
        <div className="text-center mb-5">
          <div className="mb-2">
            <BlobMascot
              shape="hexagon"
              mood={roundResult === 'guessed' ? 'dizzy' : roundResult === 'failed' ? 'confident' : 'curious'}
              color="#7CC0FF"
              accentColor="#1545A8"
              accessory="glasses"
              size={85}
            />
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-[#E0EBFF] text-[#2568EF] text-xs font-extrabold uppercase tracking-wider mb-1">
            Kategori: {slot.category}
          </span>
          <h1 className="font-display text-3xl font-bold text-[#1E1E24]">
            {boy.name} ({boy.kubu})
          </h1>
          <p className="text-xs text-[#64616C] font-semibold mt-1">
            Hanya perlihatkan layar ini ke {boy.name}!
          </p>
        </div>

        {/* Secret Word Reveal Box */}
        <div className="rounded-[28px] bg-white p-6 mb-5 border-2 border-[#2568EF]/30 shadow-xs text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-[#64616C] mb-2">
            Kata Rahasia ({slot.category}):
          </p>

          <AnimatePresence mode="wait">
            {isSecretRevealed ? (
              <motion.div
                key="revealed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="py-4"
              >
                <div className="rounded-2xl bg-[#2568EF] text-white py-4 px-6 shadow-sm mb-3">
                  <p className="font-display text-2xl md:text-3xl font-bold tracking-wide">
                    {slot.secretWord}
                  </p>
                </div>
                <button
                  type="button"
                  className="text-xs font-bold text-[#64616C] hover:text-[#1E1E24] inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-black/5 hover:bg-black/10 cursor-pointer"
                  onClick={() => {
                    sfx.playPop()
                    setIsSecretRevealed(false)
                  }}
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Sembunyikan Kata Rahasia</span>
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-4"
              >
                <div className="rounded-2xl bg-[#F2ECE1] border-2 border-dashed border-[#1E1E24]/20 py-5 px-6 mb-3">
                  <p className="font-display text-xl text-[#64616C] font-bold tracking-widest blur-xs select-none">
                    ••••••••••••••
                  </p>
                </div>
                <Button
                  variant="cobalt"
                  size="md"
                  onClick={() => {
                    sfx.playPop()
                    setIsSecretRevealed(true)
                  }}
                >
                  <Eye className="w-4 h-4" />
                  <span>Intip Kata Rahasia ({boy.name})</span>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Live Q&A Verbal Tracker */}
        <Card className="mb-5 p-4 bg-white shadow-xs border border-[#1E1E24]/10">
          <div className="flex items-center justify-between mb-2">
            <span className="font-display text-xs font-bold text-[#1E1E24] flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-[#D8317E]" />
              <span>Sesi Tanya-Jawab Live (Verbal)</span>
            </span>
            <span className="text-[11px] text-[#64616C] font-semibold">
              Maks 2 Pertanyaan
            </span>
          </div>
          <p className="text-xs text-[#64616C] mb-3">
            Cewek boleh mengajukan maksimal 2 pertanyaan petunjuk langsung ke {boy.name} (tanpa menyebut kata aslinya).
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              className={`p-2.5 rounded-xl text-xs font-bold border-2 transition cursor-pointer flex items-center justify-center gap-1.5 ${
                q1Done
                  ? 'bg-[#D6F5EC] border-[#12B76A] text-[#12B76A]'
                  : 'bg-[#FAF7F2] border-[#1E1E24]/10 text-[#64616C]'
              }`}
              onClick={() => {
                sfx.playPop()
                setQ1Done(!q1Done)
              }}
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Pertanyaan 1 {q1Done ? 'Selesai' : ''}</span>
            </button>

            <button
              type="button"
              className={`p-2.5 rounded-xl text-xs font-bold border-2 transition cursor-pointer flex items-center justify-center gap-1.5 ${
                q2Done
                  ? 'bg-[#D6F5EC] border-[#12B76A] text-[#12B76A]'
                  : 'bg-[#FAF7F2] border-[#1E1E24]/10 text-[#64616C]'
              }`}
              onClick={() => {
                sfx.playPop()
                setQ2Done(!q2Done)
              }}
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Pertanyaan 2 {q2Done ? 'Selesai' : ''}</span>
            </button>
          </div>
        </Card>

        {/* Live Guess Verdict Buttons */}
        {roundResult === null ? (
          <div className="space-y-3 mt-auto">
            <p className="text-center text-xs font-bold uppercase tracking-wider text-[#64616C]">
              Hasil Tebakan Para Cewek di Ruangan:
            </p>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => handleMarkGuessed()}
              >
                <Check className="w-5 h-5 stroke-[3]" />
                <span>KETEBAK! (+1 Cewek)</span>
              </Button>

              <Button
                variant="cobalt"
                size="lg"
                fullWidth
                onClick={handleMarkFailed}
              >
                <X className="w-5 h-5 stroke-[3]" />
                <span>GAGAL! (+1 {boy.name})</span>
              </Button>
            </div>

            {/* Quick Girl selector if host wants to award specific girl */}
            <div className="text-center pt-2">
              <span className="text-[11px] text-[#64616C] font-semibold">
                Atau pilih cewek yang berhasil nebak:{' '}
              </span>
              <div className="flex flex-wrap justify-center gap-1.5 mt-1.5 max-h-24 overflow-y-auto">
                {g3GirlPlayers.map((girl) => (
                  <button
                    key={girl.id}
                    type="button"
                    className="px-2.5 py-1 text-xs font-bold rounded-full bg-white border border-[#D8317E]/30 text-[#D8317E] hover:bg-[#FCE4F0] cursor-pointer"
                    onClick={() => handleMarkGuessed(girl.id)}
                  >
                    +1 {girl.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4 mt-auto"
          >
            <div
              className={`p-4 rounded-2xl border-2 text-center ${
                roundResult === 'guessed'
                  ? 'bg-[#D6F5EC] border-[#12B76A] text-[#158467]'
                  : 'bg-[#E0EBFF] border-[#2568EF] text-[#2568EF]'
              }`}
            >
              <p className="font-display text-lg font-bold">
                {roundResult === 'guessed'
                  ? `🎉 Berhasil Ditebak! (+1 Poin untuk ${g3GirlPlayers.find((g) => g.id === creditedGirlId)?.name || 'Cewek'})`
                  : `❌ Gagal Ditebak! (+1 Poin Bertahan untuk ${boy.name})`}
              </p>
              <p className="text-xs font-semibold mt-0.5">
                Kata rahasia tadi: <strong>"{slot.secretWord}"</strong> ({slot.category})
              </p>
            </div>

            <Button
              variant="ink"
              size="lg"
              fullWidth
              onClick={handleNext}
            >
              {isLastSlot ? (
                <>
                  <Trophy className="w-5 h-5" />
                  <span>Lihat Juara Boys Stuff 👑</span>
                </>
              ) : (
                <>
                  <span>Lanjut ke Cowok Berikutnya ({g3CurrentSlotIndex + 2}/{g3Slots.length})</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </motion.div>
        )}
      </div>

      <HostUtilityBar />
    </div>
  )
}
