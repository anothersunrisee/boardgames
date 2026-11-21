import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, CheckCircle2, Tv, Smartphone } from 'lucide-react'
import { useGameStore } from '../../store/useGameStore'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { PlayerProfileAvatar } from '../../components/characters/PlayerProfileAvatar'
import { PassDeviceModal } from '../../components/PassDeviceModal'
import { HostUtilityBar } from '../../components/HostUtilityBar'
import { GameDesktopLayout } from '../../components/layout/GameDesktopLayout'
import { isFuzzyAnswerMatch } from '../../utils/fuzzyMatch'
import { sfx } from '../../utils/sound'

export default function G2Guess() {
  const navigate = useNavigate()
  const { g2BoyPlayers, g2GirlPlayers, g2Slots, g2CurrentSlotIndex, g2UpdateSlot } = useGameStore()

  const slot = g2Slots[g2CurrentSlotIndex]
  const girl = g2GirlPlayers.find((p) => p.id === slot?.playerId)

  const [currentBoyIdx, setCurrentBoyIdx] = useState(0)
  const [guesses, setGuesses] = useState<{ boyId: string; guess: string }[]>([])
  const [inputVal, setInputVal] = useState('')
  const [locked, setLocked] = useState(false)
  const [phase, setPhase] = useState<'pass' | 'guess' | 'guessed'>('pass')
  const [isTvMode, setIsTvMode] = useState(false)
  const [tvGuesses, setTvGuesses] = useState<Record<string, string>>({})

  if (!slot || !girl) { navigate('/game2/setup'); return null }

  const boys = g2BoyPlayers
  const currentBoy = boys[currentBoyIdx]
  const isLastBoy = currentBoyIdx === boys.length - 1

  const handlePassConfirm = () => {
    sfx.playPop()
    setPhase('guess')
  }

  const handleLock = () => {
    if (!inputVal.trim()) return
    sfx.playPop(700)
    setLocked(true)
    setPhase('guessed')
  }

  const handleNext = () => {
    sfx.playPop()
    const updatedGuesses = [...guesses, { boyId: currentBoy.id, guess: inputVal.trim() }]

    if (isLastBoy) {
      g2UpdateSlot(g2CurrentSlotIndex, {
        ...slot,
        boyGuesses: updatedGuesses.map((g) => ({
          boyId: g.boyId,
          guess: g.guess,
          correct: isFuzzyAnswerMatch(g.guess, slot.secretItem),
        })),
      })
      navigate('/game2/reveal')
    } else {
      setGuesses(updatedGuesses)
      setCurrentBoyIdx((i) => i + 1)
      setInputVal('')
      setLocked(false)
      setPhase('pass')
    }
  }

  const handleTvSubmitAll = () => {
    sfx.playSuccess()
    g2UpdateSlot(g2CurrentSlotIndex, {
      ...slot,
      boyGuesses: boys.map((b) => {
        const val = (tvGuesses[b.id] || '').trim()
        return {
          boyId: b.id,
          guess: val || '(Tebak Lisan)',
          correct: val ? isFuzzyAnswerMatch(val, slot.secretItem) : false,
        }
      }),
    })
    navigate('/game2/reveal')
  }

  const qnaSummary = slot.qna

  return (
    <GameDesktopLayout
      gameId="game2"
      gameTitle="Beauty Expert"
      badge="GAME 02 • BEAUTY"
      badgeColor="#D8317E"
      activeRoundLabel={`Tebak Benda: ${girl.name}`}
      onBack={() => {
        sfx.playPop();
        navigate('/game2/qna');
      }}
      backLabel="Sesi Tanya"
    >
      <div className="max-w-3xl lg:max-w-4xl mx-auto w-full flex-1 flex flex-col">
        {/* TV Mode vs Pass Device Switcher */}
        <div className="flex items-center justify-between gap-2 mb-3 bg-white p-2 rounded-2xl border border-[#1E1E24]/10 shadow-2xs">
          <span className="text-xs font-bold text-[#64616C] ml-2">Mode Permainan:</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                sfx.playPop()
                setIsTvMode(false)
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition ${
                !isTvMode ? 'bg-[#2568EF] text-white shadow-xs' : 'text-[#64616C] hover:bg-black/5'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Oper HP (Rahasia)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sfx.playPop()
                setIsTvMode(true)
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition ${
                isTvMode ? 'bg-[#D8317E] text-white shadow-xs' : 'text-[#64616C] hover:bg-black/5'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Layar TV / Kertas</span>
            </button>
          </div>
        </div>

        {/* QnA Recap */}
        {qnaSummary.length > 0 && (
          <Card className="mb-4 p-4 bg-white shadow-xs border border-[#1E1E24]/10 max-h-40 overflow-y-auto">
            <p className="text-xs font-bold uppercase text-[#64616C] tracking-wider mb-2">
              Rangkuman Tanya-Jawab:
            </p>
            <div className="space-y-2">
              {qnaSummary.map((pair, i) => (
                <div key={i} className="text-xs">
                  <p className="font-bold text-[#2568EF]">❓ {pair.question}</p>
                  <p className="text-[#1E1E24] font-medium ml-3.5 mt-0.5">💬 "{pair.answer}"</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {isTvMode ? (
          /* ========================================================================= */
          /* MODE TV / KERTAS: TAMPILKAN SEMUA PENEBAK SEKALIGUS                       */
          /* ========================================================================= */
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col justify-between">
            <Card className="p-5 bg-white border-2 border-[#D8317E]/20 mb-4 shadow-sm">
              <div className="mb-4 pb-3 border-b border-[#1E1E24]/10">
                <h3 className="font-display text-base font-bold text-[#1E1E24]">
                  Tebakan Bersama (TV Mode)
                </h3>
                <p className="text-xs text-[#64616C] font-semibold mt-0.5">
                  Para penebak boleh menulis di kertas masing-masing atau menyebutkan langsung ke Host.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                {boys.map((boy) => (
                  <div key={boy.id} className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#1E1E24]/10 flex items-center gap-3">
                    <PlayerProfileAvatar characterId={boy.avatarId} size={38} name={boy.name} />
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-xs font-bold text-[#1E1E24] truncate">{boy.name}</p>
                      <input
                        type="text"
                        value={tvGuesses[boy.id] || ''}
                        onChange={(e) => setTvGuesses({ ...tvGuesses, [boy.id]: e.target.value })}
                        placeholder="Ketik tebakan..."
                        className="w-full mt-1 px-2.5 py-1 text-xs font-semibold rounded-lg border border-[#1E1E24]/15 bg-white focus:outline-none focus:border-[#2568EF]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Button
              variant="berry"
              size="lg"
              fullWidth
              onClick={handleTvSubmitAll}
            >
              <span>Kunci Semua Tebakan & Buka Hasil Reveal ✨</span>
            </Button>
          </motion.div>
        ) : (

        <AnimatePresence mode="wait">
          {phase === 'pass' && (
            <PassDeviceModal
              playerName={currentBoy.name}
              avatarId={currentBoy.avatarId}
              teamName={currentBoy.kubu}
              subtitle={`Saatnya kamu menebak benda skincare/makeup milik ${girl.name}!`}
              accentColor="#2568EF"
              onReady={handlePassConfirm}
              onBack={() => {
                sfx.playPop()
                navigate('/game2/qna')
              }}
            />
          )}

          {(phase === 'guess' || phase === 'guessed') && (
            <motion.div key={`guess-${currentBoyIdx}`} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col justify-between">
              <Card className="p-6 bg-white shadow-md border-2 border-[#2568EF]/20 mb-4">
                <div className="flex items-center gap-3 mb-4">
                  <PlayerProfileAvatar characterId={currentBoy.avatarId} size={50} name={currentBoy.name} />
                  <div>
                    <span className="font-display text-sm font-bold text-[#2568EF]">
                      Giliran Tebak: {currentBoy.name}
                    </span>
                    <p className="text-xs text-[#64616C] font-semibold">Tulis nama benda skincare/makeup tebakanmu!</p>
                  </div>
                </div>

                <input
                  className="input-field text-xl font-bold py-3.5"
                  placeholder="Contoh: Moisturizer, Lip balm..."
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
                  variant="cobalt"
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
                    {isLastBoy ? '✨ Buka Hasil Tebakan! ✨' : `Giliran ${boys[currentBoyIdx + 1]?.name} →`}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        )}
      </div>

      <div className="block lg:hidden">
        <HostUtilityBar />
      </div>
    </GameDesktopLayout>
  )
}
