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

type Turn = { boyIdx: number; questionNum: 1 | 2 }

function buildTurns(numBoys: number): Turn[] {
  const turns: Turn[] = []
  for (let q = 1; q <= 2; q++) {
    for (let b = 0; b < numBoys; b++) {
      turns.push({ boyIdx: b, questionNum: q as 1 | 2 })
    }
  }
  return turns
}

export default function G2QnA() {
  const navigate = useNavigate()
  const { g2BoyPlayers, g2GirlPlayers, g2Slots, g2CurrentSlotIndex, g2UpdateSlot } = useGameStore()

  const slot = g2Slots[g2CurrentSlotIndex]
  const girl = g2GirlPlayers.find((p) => p.id === slot?.playerId)
  const boys = g2BoyPlayers

  const turns = buildTurns(boys.length)
  const [turnIdx, setTurnIdx] = useState(0)
  const [question, setQuestion] = useState('')
  const [clue, setClue] = useState('')
  const [phase, setPhase] = useState<'pass' | 'question' | 'clue' | 'clue-locked'>('pass')
  const [collectedQnA, setCollectedQnA] = useState<QnAPair[]>([])

  if (!slot || !girl) { navigate('/game2/setup'); return null }

  const turn = turns[turnIdx]
  const currentBoy = boys[turn.boyIdx]
  const isLastTurn = turnIdx === turns.length - 1

  const handlePassConfirm = () => {
    sfx.playPop()
    setPhase('question')
  }

  const handleQuestionLock = () => {
    if (!question.trim()) return
    sfx.playPop(620)
    setPhase('clue')
  }

  const handleClueLock = () => {
    if (!clue.trim()) return
    sfx.playPop(700)
    setPhase('clue-locked')
  }

  const handleNext = () => {
    sfx.playPop()
    const pair: QnAPair = { question: question.trim(), answer: clue.trim() }
    const updated = [...collectedQnA, pair]
    setCollectedQnA(updated)

    if (isLastTurn) {
      g2UpdateSlot(g2CurrentSlotIndex, { ...slot, qna: updated })
      navigate('/game2/guess')
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
              navigate('/game2/secret')
            }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali</span>
          </button>

          <span className="font-display text-xs px-3.5 py-1.5 rounded-full bg-[#D8317E] text-white font-bold tracking-wide">
            Benda {girl.name} • Tanya {turnIdx + 1} / {turns.length}
          </span>
        </div>

        <AnimatePresence mode="wait">
          {/* Pass to boy */}
          {phase === 'pass' && (
            <PassDeviceModal
              playerName={currentBoy.name}
              teamName={currentBoy.kubu}
              subtitle={`Pertanyaan ke-${turn.questionNum} dari 2 untuk ${girl.name}!`}
              accentColor="#2568EF"
              onReady={handlePassConfirm}
              onBack={() => {
                sfx.playPop()
                navigate('/game2/secret')
              }}
            />
          )}

          {/* Boy asks question */}
          {phase === 'question' && (
            <motion.div key={`q-${turnIdx}`} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col justify-between">
              <Card className="p-6 bg-white shadow-md border-2 border-[#2568EF]/20 mb-4">
                <div className="flex items-center gap-3 mb-4">
                  <BlobMascot shape="hexagon" mood="curious" color="#7CC0FF" size={54} floating={false} />
                  <div>
                    <span className="font-display text-sm font-bold text-[#2568EF]">
                      Giliran {currentBoy.name} (Tanya ke-{turn.questionNum})
                    </span>
                    <p className="text-xs text-[#64616C] font-semibold">Tanya apa saja seputar fungsi/tekstur/tempat pakai!</p>
                  </div>
                </div>

                <textarea
                  className="input-field resize-none text-base font-semibold"
                  style={{ minHeight: '100px' }}
                  placeholder="Contoh: Apakah ini dipakai di bagian mata atau bibir?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  maxLength={120}
                  autoFocus
                />
              </Card>

              <Button
                variant="cobalt"
                size="lg"
                fullWidth
                disabled={!question.trim()}
                onClick={handleQuestionLock}
              >
                <Lock className="w-4 h-4" />
                <span>Kunci Pertanyaan → Oper ke {girl.name}</span>
              </Button>
            </motion.div>
          )}

          {/* Girl gives clue */}
          {(phase === 'clue' || phase === 'clue-locked') && (
            <motion.div key={`clue-${turnIdx}`} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col justify-between">
              <div className="space-y-3 mb-4">
                <Card className="p-4 bg-[#E0EBFF] border border-[#2568EF]/30">
                  <p className="text-xs font-bold text-[#2568EF] uppercase tracking-wider mb-1">
                    Pertanyaan dari {currentBoy.name}:
                  </p>
                  <p className="font-display text-base font-bold text-[#1E1E24]">
                    "{question}"
                  </p>
                </Card>

                <Card className="p-6 bg-white shadow-md border-2 border-[#D8317E]/20">
                  <div className="flex items-center gap-3 mb-4">
                    <BlobMascot shape="scallop" mood="cheeky" color="#FF8AC2" size={54} floating={false} />
                    <div>
                      <span className="font-display text-sm font-bold text-[#D8317E]">
                        Jawaban {girl.name} (Beri Clue)
                      </span>
                      <p className="text-xs text-[#64616C] font-semibold">Jangan sebut nama bendanya langsung!</p>
                    </div>
                  </div>

                  <textarea
                    className="input-field resize-none text-base font-semibold"
                    style={{ minHeight: '100px' }}
                    placeholder="Contoh: Iya, biasanya dipakai sebelum bedak supaya nempel..."
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
                  variant="berry"
                  size="lg"
                  fullWidth
                  disabled={!clue.trim()}
                  onClick={handleClueLock}
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
