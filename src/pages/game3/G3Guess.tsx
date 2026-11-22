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
  const [isTvMode, setIsTvMode] = useState(false)
  const [tvGuesses, setTvGuesses] = useState<Record<string, string>>({})

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
          correct: isFuzzyAnswerMatch(g.guess, slot.secretWord),
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

  const handleTvSubmitAll = () => {
    sfx.playSuccess()
    g3UpdateSlot(g3CurrentSlotIndex, {
      ...slot,
      girlGuesses: girls.map((g) => {
        const val = (tvGuesses[g.id] || '').trim()
        return {
          girlId: g.id,
          guess: val || '(Tebak Lisan)',
          correct: val ? isFuzzyAnswerMatch(val, slot.secretWord) : false,
        }
      }),
    })
    navigate('/game3/reveal')
  }

  return (
    <GameDesktopLayout
      gameId="game3"
      gameTitle="Boys Stuff"
      badge="GAME 03 • BOYS STUFF"
      badgeColor="#2568EF"
      activeRoundLabel={`Tebak: ${boy.name} (${slot.category})`}
      onBack={() => {
        sfx.playPop();
        navigate('/game3/qna');
      }}
      backLabel="Sesi Tanya"
    >
      <div className="w-full flex-1 flex flex-col">
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
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer ${
                !isTvMode ? 'bg-[#D8317E] text-white shadow-xs' : 'text-[#64616C] hover:bg-black/5'
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
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer ${
                isTvMode ? 'bg-[#2568EF] text-white shadow-xs' : 'text-[#64616C] hover:bg-black/5'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Layar TV / Kertas</span>
            </button>
          </div>
        </div>

        {isTvMode ? (
          /* ========================================================================= */
          /* MODE TV / KERTAS: SPLIT 2 KOLOM (QnA RECAP + SEMUA PENEBAK)               */
          /* ========================================================================= */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch"
          >
            {slot.qna.length > 0 && (
              <Card className="lg:col-span-4 p-4 bg-white shadow-xs border border-[#1E1E24]/10 flex flex-col">
                <p className="text-xs font-bold uppercase text-[#64616C] tracking-wider mb-2">
                  Rangkuman Tanya-Jawab:
                </p>
                <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                  {slot.qna.map((pair, i) => (
                    <div key={i} className="text-xs p-2 rounded-xl bg-[#FAF7F2] border border-[#1E1E24]/5">
                      <p className="font-bold text-[#D8317E]">❓ {pair.question}</p>
                      <p className="text-[#1E1E24] font-medium ml-3.5 mt-0.5">💬 "{pair.answer}"</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <div className={`${slot.qna.length > 0 ? 'lg:col-span-8' : 'lg:col-span-12'} flex flex-col justify-between`}>
              <Card className="p-4 bg-white border-2 border-[#2568EF]/20 mb-4 shadow-sm flex-1 flex flex-col">
                <div className="mb-3 pb-2.5 border-b border-[#1E1E24]/10 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="font-display text-base font-bold text-[#1E1E24]">
                      Tebakan Bersama (TV Mode)
                    </h3>
                    <p className="text-xs text-[#64616C] font-semibold mt-0.5">
                      Para cewek boleh menulis di kertas masing-masing atau menyebutkan langsung ke Host.
                    </p>
                  </div>
                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-[#FCE4F0] text-[#D8317E]">
                    {girls.length} Penebak
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[320px] overflow-y-auto pr-1">
                  {girls.map((girl) => (
                    <div key={girl.id} className="p-2.5 rounded-2xl bg-[#FAF7F2] border border-[#1E1E24]/10 flex items-center gap-2.5">
                      <PlayerProfileAvatar characterId={girl.avatarId} size={34} name={girl.name} />
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-xs font-bold text-[#1E1E24] truncate">{girl.name}</p>
                        <input
                          type="text"
                          value={tvGuesses[girl.id] || ''}
                          onChange={(e) => setTvGuesses({ ...tvGuesses, [girl.id]: e.target.value })}
                          placeholder="Ketik tebakan..."
                          className="w-full mt-1 px-2.5 py-1 text-xs font-semibold rounded-lg border border-[#1E1E24]/15 bg-white focus:outline-none focus:border-[#D8317E]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Button
                variant="cobalt"
                size="lg"
                fullWidth
                onClick={handleTvSubmitAll}
              >
                <span>Kunci Semua Tebakan &amp; Buka Hasil Reveal ✨</span>
              </Button>
            </div>
          </motion.div>
        ) : (
        <div className="max-w-xl mx-auto w-full flex-1 flex flex-col">
          {/* QnA Recap (1-col centered Oper HP) */}
          {slot.qna.length > 0 && (
            <Card className="mb-4 p-4 bg-white shadow-xs border border-[#1E1E24]/10 max-h-36 overflow-y-auto">
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
              avatarId={currentGirl.avatarId}
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
                  <PlayerProfileAvatar characterId={currentGirl.avatarId} size={50} name={currentGirl.name} />
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
        )}
      </div>

      <div className="block lg:hidden">
        <HostUtilityBar />
      </div>
    </GameDesktopLayout>
  )
}
