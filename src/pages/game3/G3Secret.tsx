import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, ArrowLeft, Check, X, ArrowRight, Trophy, HelpCircle, Shuffle } from 'lucide-react'
import { useGameStore } from '../../store/useGameStore'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { BlobMascot } from '../../components/ui/BlobMascot'
import { PlayerProfileAvatar } from '../../components/characters/PlayerProfileAvatar'
import { HostUtilityBar } from '../../components/HostUtilityBar'
import { sfx } from '../../utils/sound'
import { syncHostRoomState, listenToPlayerActions } from '../../services/firebase'

export default function G3Secret() {
  const navigate = useNavigate()
  const {
    roomCode,
    g3BoyPlayers,
    g3GirlPlayers,
    g3Slots,
    g3CurrentSlotIndex,
    g3NextSlot,
    g3BoyWins,
    g3GirlWins,
    incrementG3BoyWins,
    incrementG3GirlWins,
    addScore,
    g3ShuffleItem,
  } = useGameStore()

  const [isSecretRevealed, setIsSecretRevealed] = useState(false)
  const [q1Done, setQ1Done] = useState(false)
  const [q2Done, setQ2Done] = useState(false)
  const [roundResult, setRoundResult] = useState<'guessed' | 'failed' | null>(null)
  const [creditedGirlId, setCreditedGirlId] = useState<string>('')
  const [phoneGuesses, setPhoneGuesses] = useState<Array<{ playerId: string; playerName: string; guess: string }>>([])

  const handleShuffleItem = () => {
    const newItem = g3ShuffleItem()
    if (newItem) {
      sfx.playPop()
      setIsSecretRevealed(true)
    }
  }

  const handleUndoDecision = () => {
    sfx.playPop()
    if (roundResult) {
      if (roundResult === 'guessed') {
        if (creditedGirlId) addScore(creditedGirlId, -5)
        g3GirlPlayers.forEach((g) => {
          if (g.id !== creditedGirlId) addScore(g.id, -2)
        })
        incrementG3BoyWins()
      } else {
        if (boy) addScore(boy.id, -4)
        g3BoyPlayers.forEach((b) => {
          if (b.id !== boy?.id) addScore(b.id, -2)
        })
      }
      setRoundResult(null)
      setCreditedGirlId('')
    }
  }

  const slot = g3Slots[g3CurrentSlotIndex]
  const boy = g3BoyPlayers.find((p) => p.id === slot?.playerId)

  // Sync state ke Firebase Realtime untuk HP Controller
  useEffect(() => {
    if (!roomCode || !slot) return
    syncHostRoomState(roomCode, {
      activeGame: 'game3',
      gamePhase: 'secret',
      gameState: {
        g3SecretHolders: { [slot.playerId]: slot.secretWord },
        activeSlotPlayerId: slot.playerId,
      },
    })
    setPhoneGuesses([])
  }, [roomCode, slot])

  // Dengarkan tebakan dari HP Controller pemain
  useEffect(() => {
    if (!roomCode) return
    const unsubscribe = listenToPlayerActions(roomCode, (actionsMap) => {
      if (!actionsMap) return
      const guessesMap = new Map<string, { playerId: string; playerName: string; guess: string }>()
      Object.values(actionsMap).forEach((action) => {
        if (action.type === 'submit_g3_guess' && action.payload?.guess) {
          guessesMap.set(action.playerId, {
            playerId: action.playerId,
            playerName: action.playerName,
            guess: action.payload.guess,
          })
        }
      })
      setPhoneGuesses(Array.from(guessesMap.values()))
    })
    return () => unsubscribe()
  }, [roomCode])

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

    // Cewek berhasil menebak istilah cowok (Tingkat Kesulitan Tinggi):
    // 1. Penebak dapat +5 poin di room
    if (targetGirlId) {
      addScore(targetGirlId, 5)
    }
    // 2. Anggota tim cewek lainnya dapat +2 poin bonus tim di room
    g3GirlPlayers.forEach((g) => {
      if (g.id !== targetGirlId) {
        addScore(g.id, 2)
      }
    })
    // 3. Cowok pemegang kata yang ketebak kena penalti -1 poin di room
    addScore(boy.id, -1)

    // 4. Update skor kelompok Game 3
    incrementG3GirlWins()
  }

  const handleMarkFailed = () => {
    sfx.playBuzzer()
    setRoundResult('failed')

    // Cewek gagal menebak (Cowok berhasil mempertahankan kata):
    // 1. Cowok pemegang kata dapat +3 poin di room
    addScore(boy.id, 3)
    // 2. Seluruh cowok lainnya dapat +1 poin bonus tim di room
    g3BoyPlayers.forEach((b) => {
      if (b.id !== boy.id) {
        addScore(b.id, 1)
      }
    })
    // 3. Seluruh cewek kena penalti -1 poin di room
    g3GirlPlayers.forEach((g) => {
      addScore(g.id, -1)
    })

    // 4. Update skor kelompok Game 3
    incrementG3BoyWins()
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
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E24] px-4 py-6 md:py-8 pb-20 md:pb-16 flex flex-col justify-between">
      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">
        {/* Top Header */}
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
            <span>Pilih Game</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="font-display text-xs px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#1E1E24]/10 text-[#1E1E24] font-bold">
              👦 {g3BoyWins} vs 👧 {g3GirlWins}
            </span>
            <span className="font-display text-xs px-3.5 py-1.5 rounded-full bg-[#2568EF] text-white font-bold tracking-wide">
              Cowok {g3CurrentSlotIndex + 1} / {g3Slots.length}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch flex-1">
          {/* LEFT COLUMN: Target Boy & Secret Word Reveal */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <Card className="p-5 bg-white shadow-xs text-center flex flex-col items-center">
              <div className="mb-2">
                <BlobMascot
                  shape="hexagon"
                  mood={roundResult === 'guessed' ? 'dizzy' : roundResult === 'failed' ? 'confident' : 'curious'}
                  color="#7CC0FF"
                  accentColor="#1545A8"
                  accessory="glasses"
                  size={76}
                />
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#E0EBFF] text-[#2568EF] text-xs font-extrabold uppercase tracking-wider mb-1">
                Kategori: {slot.category}
              </span>
              <div className="flex items-center justify-center gap-2 mt-1">
                <PlayerProfileAvatar characterId={boy.avatarId} size={34} name={boy.name} />
                <h1 className="font-display text-2xl font-bold text-[#1E1E24]">
                  {boy.name} ({boy.kubu})
                </h1>
              </div>
              <p className="text-xs text-[#64616C] font-semibold mt-1">
                Hanya perlihatkan layar ini ke {boy.name}!
              </p>
            </Card>

            {/* Secret Word Reveal Box */}
            <div className="rounded-[28px] bg-white p-5 border-2 border-[#2568EF]/30 shadow-xs text-center flex-1 flex flex-col justify-center">
              <p className="text-xs font-bold uppercase tracking-wider text-[#64616C] mb-2">
                Kata Rahasia ({slot.category}):
              </p>

              <AnimatePresence mode="wait">
                {isSecretRevealed ? (
                  <motion.div
                    key="revealed"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    className="py-2"
                  >
                    <div className="rounded-2xl bg-[#2568EF] text-white py-4 px-5 shadow-sm mb-3">
                      <p className="font-display text-2xl font-bold tracking-wide">
                        {slot.secretWord}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <button
                        type="button"
                        className="text-xs font-bold text-[#64616C] hover:text-[#1E1E24] inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-black/5 hover:bg-black/10 cursor-pointer"
                        onClick={() => {
                          sfx.playPop()
                          setIsSecretRevealed(false)
                        }}
                      >
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Sembunyikan</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleShuffleItem}
                        className="text-xs font-bold text-[#2568EF] hover:bg-[#EFF6FF] inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-[#EFF6FF]/70 border border-[#2568EF]/20 cursor-pointer transition"
                        title="Ganti istilah cowok rahasia"
                      >
                        <Shuffle className="w-3.5 h-3.5" />
                        <span>Ganti Kata</span>
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-2"
                  >
                    <div className="rounded-2xl bg-[#F2ECE1] border-2 border-dashed border-[#1E1E24]/20 py-4 px-6 mb-3">
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
          </div>

          {/* RIGHT COLUMN: Live Q&A Verbal Tracker & Guess Verdict */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Live Q&A Verbal Tracker */}
            <Card className="p-4 bg-white shadow-xs border border-[#1E1E24]/10">
              <div className="flex items-center justify-between mb-2">
                <span className="font-display text-xs font-bold text-[#1E1E24] flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-[#D8317E]" />
                  <span>Sesi Tanya-Jawab Live (Verbal)</span>
                </span>
                <span className="text-xs text-[#64616C] font-semibold">
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
            <Card className="p-5 bg-white shadow-xs flex-1 flex flex-col justify-between">
              {roundResult === null ? (
                <div className="space-y-3 flex-1 flex flex-col justify-between">
                  {phoneGuesses.length > 0 && (
                    <div className="p-3 bg-[#E0EBFF] border border-[#2568EF]/30 rounded-2xl text-left">
                      <p className="text-xs font-bold text-[#2568EF] mb-1.5 flex items-center gap-1">
                        <span>📱 Tebakan Masuk dari HP ({phoneGuesses.length}):</span>
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {phoneGuesses.map((pg) => (
                          <span
                            key={pg.playerId}
                            className="px-2.5 py-1 bg-white rounded-lg text-xs font-bold text-[#1E1E24] shadow-xs border border-[#2568EF]/20"
                          >
                            <strong>{pg.playerName}:</strong> "{pg.guess}"
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-center text-xs font-bold uppercase tracking-wider text-[#64616C] mb-2">
                      Quick Award Penebak Cewek:
                    </p>
                    <div className="flex flex-wrap justify-center gap-1.5 max-h-24 overflow-y-auto">
                      {g3GirlPlayers.map((girl) => (
                        <button
                          key={girl.id}
                          type="button"
                          className="px-3 py-1.5 text-xs font-bold rounded-full bg-[#FAF7F2] border border-[#D8317E]/30 text-[#D8317E] hover:bg-[#FCE4F0] cursor-pointer"
                          onClick={() => handleMarkGuessed(girl.id)}
                        >
                          🎯 {girl.name} (+5)
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 mt-auto">
                    <p className="text-center text-xs font-bold uppercase tracking-wider text-[#64616C] mb-2">
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
                        <span>KETEBAK! (+5 Cewek)</span>
                      </Button>

                      <Button
                        variant="cobalt"
                        size="lg"
                        fullWidth
                        onClick={handleMarkFailed}
                      >
                        <X className="w-5 h-5 stroke-[3]" />
                        <span>GAGAL! (+3 {boy.name})</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4 flex-1 flex flex-col justify-between"
                >
                  <div
                    className={`p-4 rounded-2xl border-2 text-center my-auto ${
                      roundResult === 'guessed'
                        ? 'bg-[#D6F5EC] border-[#12B76A] text-[#158467]'
                        : 'bg-[#E0EBFF] border-[#2568EF] text-[#2568EF]'
                    }`}
                  >
                    <p className="font-display text-lg font-bold">
                      {roundResult === 'guessed'
                        ? `🎉 Berhasil Ditebak ${creditedGirlId ? `oleh ${g3GirlPlayers.find((g) => g.id === creditedGirlId)?.name || 'Cewek'}` : ''}! (+5 Penebak, +2 Tim Cewek, -1 ${boy.name})`
                        : `❌ Gagal Ditebak! (+3 ${boy.name}, +1 Tim Cowok, -1 Tim Cewek)`}
                    </p>
                    <p className="text-xs font-semibold mt-1">
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
            </Card>
          </div>
        </div>
      </div>

      <HostUtilityBar
        onShuffle={handleShuffleItem}
        onUndo={roundResult ? handleUndoDecision : undefined}
      />
    </div>
  )
}
