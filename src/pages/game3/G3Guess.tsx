import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Lock, CheckCircle2 } from 'lucide-react'
import { useGameStore } from '../../store/useGameStore'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { BlobMascot } from '../../components/ui/BlobMascot'
import { PassDeviceModal } from '../../components/PassDeviceModal'
import { HostUtilityBar } from '../../components/HostUtilityBar'
import { sfx } from '../../utils/sound'

export default function G3Guess() {
  const navigate = useNavigate()
  const { g3GirlPlayers, g3BoyPlayers, g3Slots, g3CurrentSlotIndex, g3UpdateSlot } = useGameStore()

  const slot = g3Slots[g3CurrentSlotIndex]
  const boy = g3BoyPlayers.find((p) => p.id === slot?.playerId)

  const [currentGirlIdx, setCurrentGirlIdx] = useState(0)
  const [guesses, setGuesses] = useState<{ girlId: string; guess: string }[]>([])
  const [inputVal, setInputVal] = useState('')
  const [locked, setLocked] = useState(false)
  const [phase, setPhase] = useState<'pass' | 'guess' | 'guessed'>('pass')

  if (!slot || !boy) { navigate('/game3/setup'); return null }

  const girls = g3GirlPlayers
  const currentGirl = girls[currentGirlIdx]
  const isLastGirl = currentGirlIdx === girls.length - 1

  const handleLock = () => {
    if (!inputVal.trim()) return
    sfx.playPop(700)
    setLocked(true)
    setPhase('guessed')
  }

  const handleNext = () => {
    sfx.playPop()
    const updatedGuesses = [...guesses, { girlId: currentGirl.id, guess: inputVal.trim() }]
    if (isLastGirl) {
      g3UpdateSlot(g3CurrentSlotIndex, {
        ...slot,
        girlGuesses: updatedGuesses.map((g) => ({
          girlId: g.girlId,
          guess: g.guess,
          correct: g.guess.toLowerCase().trim() === slot.secretWord.toLowerCase().trim(),
        })),
      })
      navigate('/game3/reveal')
    } else {
      setGuesses(updatedGuesses)
      setCurrentGirlIdx((i) => i + 1)
      setInputVal('')
      setLocked(false)
      setPhase('pass')
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E24] px-4 py-8 md:py-12 flex flex-col justify-between">
      <div className="max-w-lg mx-auto w-full flex-1 flex flex-col">
        {/* Top Header with Back Navigation */}
        <div className="flex items-center justify-between mb-5">
          <button
            type="button"
            className="text-xs font-bold text-[#64616C] hover:text-[#1E1E24] flex items-center gap-1 cursor-pointer"
            onClick={() => {
              sfx.playPop()
              navigate('/game3/qna')
            }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Sesi Tanya</span>
          </button>

          <span className="font-display text-xs px-3.5 py-1.5 rounded-full bg-[#2568EF] text-white font-bold tracking-wide">
            Tebak Kata {boy.name} ({slot.category})
          </span>
        </div>

        {/* QnA Recap */}
        {slot.qna.length > 0 && (
          <Card className="mb-4 p-4 bg-white shadow-xs border border-[#1E1E24]/10 max-h-40 overflow-y-auto">
            <p className="text-xs font-bold uppercase text-[#64616C] tracking-wider mb-2">
              Rangkuman Tanya-Jawab:
            </p>
            <div className="space-y-2">
              {slot.qna.map((pair, i) => (
                <div key={i} className="text-xs">
                  <p className="font-bold text-[#D8317E]">❓ {pair.question}</p>
                  <p className="text-[#1E1E24] font-medium ml-3.5 mt-0.5">💬 "{pair.answer}"</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        <AnimatePresence mode="wait">
          {phase === 'pass' && (
            <PassDeviceModal
              playerName={currentGirl.name}
              teamName={currentGirl.kubu}
              subtitle={`Saatnya kamu menebak kata ${slot.category} milik ${boy.name}!`}
              accentColor="#D8317E"
              onReady={() => {
                sfx.playPop()
                setPhase('guess')
              }}
              onBack={() => {
                sfx.playPop()
                navigate('/game3/qna')
              }}
            />
          )}

          {(phase === 'guess' || phase === 'guessed') && (
            <motion.div key={`guess-${currentGirlIdx}`} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col justify-between">
              <Card className="p-6 bg-white shadow-md border-2 border-[#D8317E]/20 mb-4">
                <div className="flex items-center gap-3 mb-4">
                  <BlobMascot shape="scallop" mood="curious" color="#FF8AC2" size={54} floating={false} />
                  <div>
                    <span className="font-display text-sm font-bold text-[#D8317E]">
                      Giliran Tebak: {currentGirl.name}
                    </span>
                    <p className="text-xs text-[#64616C] font-semibold">Tebak kata rahasia kategori {slot.category}!</p>
                  </div>
                </div>

                <input
                  className="input-field text-xl font-bold py-3.5"
                  placeholder="Contoh: Busi, Offside, Kopling..."
                  value={inputVal}
                  onChange={(e) => !locked && setInputVal(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !locked && handleLock()}
                  readOnly={locked}
                  autoFocus
                  style={{ backgroundColor: locked ? '#F2ECE1' : '#FFFFFF' }}
                />
              </Card>

              {phase === 'guess' ? (
                <Button
                  variant="berry"
                  size="lg"
                  fullWidth
                  disabled={!inputVal.trim()}
                  onClick={handleLock}
                >
                  <Lock className="w-4 h-4" />
                  <span>Kunci Tebakan</span>
                </Button>
              ) : (
                <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="space-y-3">
                  <div className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#D6F5EC] border-2 border-[#12B76A] text-[#158467] font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-[#12B76A]" />
                    <span>Tebakan Terkunci Rapi!</span>
                  </div>

                  <Button
                    variant="ink"
                    size="lg"
                    fullWidth
                    onClick={handleNext}
                  >
                    {isLastGirl ? '✨ Buka Hasil Tebakan! ✨' : `Giliran ${girls[currentGirlIdx + 1]?.name} →`}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <HostUtilityBar />
    </div>
  )
}
