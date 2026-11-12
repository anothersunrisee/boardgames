import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Lock, CheckCircle2 } from 'lucide-react'
import { useGameStore, type QnAPair } from '../../store/useGameStore'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { BlobMascot } from '../../components/ui/BlobMascot'
import { PassDeviceModal } from '../../components/PassDeviceModal'
import { HostUtilityBar } from '../../components/HostUtilityBar'
import { sfx } from '../../utils/sound'

type Turn = { girlIdx: number; questionNum: 1 | 2 }

function buildTurns(numGirls: number): Turn[] {
  const turns: Turn[] = []
  for (let q = 1; q <= 2; q++) {
    for (let g = 0; g < numGirls; g++) {
      turns.push({ girlIdx: g, questionNum: q as 1 | 2 })
    }
  }
  return turns
}

export default function G3QnA() {
  const navigate = useNavigate()
  const { g3BoyPlayers, g3GirlPlayers, g3Slots, g3CurrentSlotIndex, g3UpdateSlot } = useGameStore()

  const slot = g3Slots[g3CurrentSlotIndex]
  const boy = g3BoyPlayers.find((p) => p.id === slot?.playerId)

  const turns = buildTurns(g3GirlPlayers.length)
  const [turnIdx, setTurnIdx] = useState(0)
  const [question, setQuestion] = useState('')
  const [clue, setClue] = useState('')
  const [phase, setPhase] = useState<'pass' | 'question' | 'clue' | 'clue-locked'>('pass')
  const [collectedQnA, setCollectedQnA] = useState<QnAPair[]>([])

  if (!slot || !boy) { navigate('/game3/setup'); return null }

  const turn = turns[turnIdx]
  const currentGirl = g3GirlPlayers[turn.girlIdx]
  const isLastTurn = turnIdx === turns.length - 1

  const handleNext = () => {
    sfx.playPop()
    const pair: QnAPair = { question: question.trim(), answer: clue.trim() }
    const updated = [...collectedQnA, pair]
    setCollectedQnA(updated)

    if (isLastTurn) {
      g3UpdateSlot(g3CurrentSlotIndex, { ...slot, qna: updated })
      navigate('/game3/guess')
    } else {
      setTurnIdx((i) => i + 1)
      setQuestion('')
      setClue('')
      setPhase('pass')
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E24] px-4 py-8 md:py-12 flex flex-col justify-between">
      <div className="max-w-lg mx-auto w-full flex-1 flex flex-col">
        {/* Top Header with Back Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            className="text-xs font-bold text-[#64616C] hover:text-[#1E1E24] flex items-center gap-1 cursor-pointer"
            onClick={() => {
              sfx.playPop()
              navigate('/game3/secret')
            }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali</span>
          </button>

          <span className="font-display text-xs px-3.5 py-1.5 rounded-full bg-[#2568EF] text-white font-bold tracking-wide">
            Kata {boy.name} ({slot.category}) • Tanya {turnIdx + 1} / {turns.length}
          </span>
        </div>

        <AnimatePresence mode="wait">
          {phase === 'pass' && (
            <PassDeviceModal
              playerName={currentGirl.name}
              teamName={currentGirl.kubu}
              subtitle={`Pertanyaan ke-${turn.questionNum} dari 2 untuk ${boy.name}!`}
              accentColor="#D8317E"
              onReady={() => {
                sfx.playPop()
                setPhase('question')
              }}
              onBack={() => {
                sfx.playPop()
                navigate('/game3/secret')
              }}
            />
          )}

          {phase === 'question' && (
            <motion.div key={`q-${turnIdx}`} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col justify-between">
              <Card className="p-6 bg-white shadow-md border-2 border-[#D8317E]/20 mb-4">
                <div className="flex items-center gap-3 mb-4">
                  <BlobMascot shape="scallop" mood="curious" color="#FF8AC2" size={54} floating={false} />
                  <div>
                    <span className="font-display text-sm font-bold text-[#D8317E]">
                      Giliran {currentGirl.name} (Tanya ke-{turn.questionNum})
                    </span>
                    <p className="text-xs text-[#64616C] font-semibold">Tanya seputar kata {slot.category} milik {boy.name}!</p>
                  </div>
                </div>

                <textarea
                  className="input-field resize-none text-base font-semibold"
                  style={{ minHeight: '100px' }}
                  placeholder="Contoh: Apakah benda ini sering diganti saat servis?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  maxLength={120}
                  autoFocus
                />
              </Card>

              <Button
                variant="berry"
                size="lg"
                fullWidth
                disabled={!question.trim()}
                onClick={() => {
                  sfx.playPop(620)
                  setPhase('clue')
                }}
              >
                <Lock className="w-4 h-4" />
                <span>Kunci Pertanyaan → Oper ke {boy.name}</span>
              </Button>
            </motion.div>
          )}

          {(phase === 'clue' || phase === 'clue-locked') && (
            <motion.div key={`clue-${turnIdx}`} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col justify-between">
              <div className="space-y-3 mb-4">
                <Card className="p-4 bg-[#FCE4F0] border border-[#D8317E]/30">
                  <p className="text-xs font-bold text-[#D8317E] uppercase tracking-wider mb-1">
                    Pertanyaan dari {currentGirl.name}:
                  </p>
                  <p className="font-display text-base font-bold text-[#1E1E24]">
                    "{question}"
                  </p>
                </Card>

                <Card className="p-6 bg-white shadow-md border-2 border-[#2568EF]/20">
                  <div className="flex items-center gap-3 mb-4">
                    <BlobMascot shape="hexagon" mood="confident" color="#7CC0FF" size={54} floating={false} />
                    <div>
                      <span className="font-display text-sm font-bold text-[#2568EF]">
                        Jawaban {boy.name} (Beri Clue)
                      </span>
                      <p className="text-xs text-[#64616C] font-semibold">Jangan sebut kata rahasianya langsung!</p>
                    </div>
                  </div>

                  <textarea
                    className="input-field resize-none text-base font-semibold"
                    style={{ minHeight: '100px' }}
                    placeholder="Contoh: Iya, kalau bagian ini basah atau kotor mesin susah nyala..."
                    value={clue}
                    onChange={(e) => phase === 'clue' && setClue(e.target.value)}
                    maxLength={200}
                    readOnly={phase === 'clue-locked'}
                    autoFocus={phase === 'clue'}
                  />
                </Card>
              </div>

              {phase === 'clue' ? (
                <Button
                  variant="cobalt"
                  size="lg"
                  fullWidth
                  disabled={!clue.trim()}
                  onClick={() => {
                    sfx.playPop(700)
                    setPhase('clue-locked')
                  }}
                >
                  <Lock className="w-4 h-4" />
                  <span>Kunci Clue</span>
                </Button>
              ) : (
                <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="space-y-3">
                  <div className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#D6F5EC] border-2 border-[#12B76A] text-[#158467] font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-[#12B76A]" />
                    <span>Clue Terkunci!</span>
                  </div>

                  <Button
                    variant="ink"
                    size="lg"
                    fullWidth
                    onClick={handleNext}
                  >
                    {isLastTurn ? 'Semua Sudah Tanya → Waktu Tebak!' : 'Giliran Berikutnya →'}
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
