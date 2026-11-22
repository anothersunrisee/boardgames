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

export default function G2Secret() {
  const navigate = useNavigate()
  const {
    roomCode,
    g2GirlPlayers,
    g2BoyPlayers,
    g2Slots,
    g2CurrentSlotIndex,
    g2NextSlot,
    g2GirlWins,
    g2BoyWins,
    incrementG2GirlWins,
    incrementG2BoyWins,
    addScore,
    g2ShuffleItem,
  } = useGameStore()

  const [isSecretRevealed, setIsSecretRevealed] = useState(false)
  const [q1Done, setQ1Done] = useState(false)
  const [q2Done, setQ2Done] = useState(false)
  const [roundResult, setRoundResult] = useState<'guessed' | 'failed' | null>(null)
  const [creditedBoyId, setCreditedBoyId] = useState<string>('')
  const [phoneGuesses, setPhoneGuesses] = useState<Array<{ playerId: string; playerName: string; guess: string }>>([])

  const handleShuffleItem = () => {
    const newItem = g2ShuffleItem()
    if (newItem) {
      sfx.playPop()
      setIsSecretRevealed(true)
    }
  }

  const handleUndoDecision = () => {
    sfx.playPop()
    if (roundResult) {
      if (roundResult === 'guessed') {
        if (creditedBoyId) addScore(creditedBoyId, -5)
        g2BoyPlayers.forEach((b) => {
          if (b.id !== creditedBoyId) addScore(b.id, -2)
        })
        incrementG2GirlWins() // revert boy win
      } else {
        if (girl) addScore(girl.id, -4)
        g2GirlPlayers.forEach((g) => {
          if (g.id !== girl?.id) addScore(g.id, -2)
        })
      }
      setRoundResult(null)
      setCreditedBoyId('')
    }
  }

  const slot = g2Slots[g2CurrentSlotIndex]
  const girl = g2GirlPlayers.find((p) => p.id === slot?.playerId)

  // Sync state ke Firebase Realtime untuk HP Controller
  useEffect(() => {
    if (!roomCode || !slot) return
    syncHostRoomState(roomCode, {
      activeGame: 'game2',
      gamePhase: 'secret',
      gameState: {
        g2SecretHolders: { [slot.playerId]: slot.secretItem },
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
        if (action.type === 'submit_g2_guess' && action.payload?.guess) {
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

  if (!slot || !girl) {
    navigate('/game2/setup')
    return null
  }

  const isLastSlot = g2CurrentSlotIndex >= g2Slots.length - 1

  const handleMarkGuessed = (boyId?: string) => {
    sfx.playSuccess()
    const targetBoyId = boyId || g2BoyPlayers[0]?.id
    setCreditedBoyId(targetBoyId)
    setRoundResult('guessed')

    // Cowok berhasil menebak barang skincare (Tingkat Kesulitan Tinggi):
    // 1. Penebak dapat +5 poin di room
    if (targetBoyId) {
      addScore(targetBoyId, 5)
    }
    // 2. Anggota tim cowok lainnya dapat +2 poin bonus tim di room
    g2BoyPlayers.forEach((b) => {
      if (b.id !== targetBoyId) {
        addScore(b.id, 2)
      }
    })
    // 3. Cewek pemegang rahasia yang ketebak kena penalti -1 poin di room
    addScore(girl.id, -1)

    // 4. Update skor kelompok Game 2
    incrementG2BoyWins()
  }

  const handleMarkFailed = () => {
    sfx.playBuzzer()
    setRoundResult('failed')

    // Cowok gagal menebak (Cewek berhasil mempertahankan rahasia):
    // 1. Cewek pemegang rahasia dapat +3 poin di room
    addScore(girl.id, 3)
    // 2. Seluruh cewek lainnya dapat +1 poin bonus tim di room
    g2GirlPlayers.forEach((g) => {
      if (g.id !== girl.id) {
        addScore(g.id, 1)
      }
    })
    // 3. Seluruh cowok kena penalti -1 poin di room
    g2BoyPlayers.forEach((b) => {
      addScore(b.id, -1)
    })

    // 4. Update skor kelompok Game 2
    incrementG2GirlWins()
  }

  const handleNext = () => {
    sfx.playPop()
    if (isLastSlot) {
      navigate('/game2/results')
    } else {
      g2NextSlot()
      setIsSecretRevealed(false)
      setQ1Done(false)
      setQ2Done(false)
      setRoundResult(null)
      setCreditedBoyId('')
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
              👧 {g2GirlWins} vs 👦 {g2BoyWins}
            </span>
            <span className="font-display text-xs px-3.5 py-1 rounded-full bg-[#D8317E] text-white font-bold tracking-wide">
              Cewek {g2CurrentSlotIndex + 1} / {g2Slots.length}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch flex-1">
          {/* LEFT COLUMN: Target Girl & Secret Item Reveal */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <Card className="p-5 bg-white shadow-xs text-center flex flex-col items-center">
              <div className="mb-2">
                <BlobMascot
                  shape="scallop"
                  mood={roundResult === 'guessed' ? 'dizzy' : roundResult === 'failed' ? 'cheeky' : 'curious'}
                  color="#FF8AC2"
                  accentColor="#9A1454"
                  size={76}
                />
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#FCE4F0] text-[#D8317E] text-xs font-extrabold uppercase tracking-wider mb-1">
                Giliran Benda Rahasia
              </span>
              <div className="flex items-center justify-center gap-2 mt-1">
                <PlayerProfileAvatar characterId={girl.avatarId} size={34} name={girl.name} />
                <h1 className="font-display text-2xl font-bold text-[#1E1E24]">
                  {girl.name} ({girl.kubu})
                </h1>
              </div>
              <p className="text-xs text-[#64616C] font-semibold mt-1">
                Hanya perlihatkan layar ini ke {girl.name}!
              </p>
            </Card>

            {/* Secret Item Reveal Box */}
            <div className="rounded-[28px] bg-white p-5 border-2 border-[#D8317E]/30 shadow-xs text-center flex-1 flex flex-col justify-center">
              <p className="text-xs font-bold uppercase tracking-wider text-[#64616C] mb-2">
                Benda Skincare / Makeup Rahasia:
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
                    <div className="rounded-2xl bg-[#D8317E] text-white py-4 px-5 shadow-sm mb-3">
                      <p className="font-display text-2xl font-bold tracking-wide">
                        {slot.secretItem}
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
                        className="text-xs font-bold text-[#D8317E] hover:bg-[#FCE4F0] inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-[#FCE4F0]/60 border border-[#D8317E]/20 cursor-pointer transition"
                        title="Ganti benda skincare rahasia"
                      >
                        <Shuffle className="w-3.5 h-3.5" />
                        <span>Ganti Benda</span>
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
                      variant="berry"
                      size="md"
                      onClick={() => {
                        sfx.playPop()
                        setIsSecretRevealed(true)
                      }}
                    >
                      <Eye className="w-4 h-4" />
                      <span>Intip Benda Rahasia ({girl.name})</span>
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
                  <HelpCircle className="w-4 h-4 text-[#2568EF]" />
                  <span>Sesi Tanya-Jawab Live (Verbal)</span>
                </span>
                <span className="text-xs text-[#64616C] font-semibold">
                  Maks 2 Pertanyaan
                </span>
              </div>
              <p className="text-xs text-[#64616C] mb-3">
                Cowok boleh mengajukan maksimal 2 pertanyaan clue langsung ke {girl.name} (tanpa menyebut nama barang).
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
                      Quick Award Penebak Cowok:
                    </p>
                    <div className="flex justify-center gap-1.5 flex-wrap">
                      {g2BoyPlayers.map((boy) => (
                        <button
                          key={boy.id}
                          type="button"
                          className="px-3 py-1.5 text-xs font-bold rounded-full bg-[#FAF7F2] border border-[#2568EF]/30 text-[#2568EF] hover:bg-[#E0EBFF] cursor-pointer"
                          onClick={() => handleMarkGuessed(boy.id)}
                        >
                          🎯 {boy.name} (+5)
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 mt-auto">
                    <p className="text-center text-xs font-bold uppercase tracking-wider text-[#64616C] mb-2">
                      Hasil Tebakan Para Cowok di Ruangan:
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="primary"
                        size="lg"
                        fullWidth
                        onClick={() => handleMarkGuessed()}
                      >
                        <Check className="w-5 h-5 stroke-[3]" />
                        <span>KETEBAK! (+5 Cowok)</span>
                      </Button>

                      <Button
                        variant="berry"
                        size="lg"
                        fullWidth
                        onClick={handleMarkFailed}
                      >
                        <X className="w-5 h-5 stroke-[3]" />
                        <span>GAGAL! (+3 {girl.name})</span>
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
                        : 'bg-[#FCE4F0] border-[#D8317E] text-[#D8317E]'
                    }`}
                  >
                    <p className="font-display text-lg font-bold">
                      {roundResult === 'guessed'
                        ? `🎉 Berhasil Ditebak ${creditedBoyId ? `oleh ${g2BoyPlayers.find((b) => b.id === creditedBoyId)?.name || 'Cowok'}` : ''}! (+5 Penebak, +2 Tim Cowok, -1 ${girl.name})`
                        : `❌ Gagal Ditebak! (+3 ${girl.name}, +1 Tim Cewek, -1 Tim Cowok)`}
                    </p>
                    <p className="text-xs font-semibold mt-1">
                      Benda rahasia tadi: <strong>"{slot.secretItem}"</strong>
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
                        <span>Lihat Juara Beauty Expert 👑</span>
                      </>
                    ) : (
                      <>
                        <span>Lanjut ke Cewek Berikutnya ({g2CurrentSlotIndex + 2}/{g2Slots.length})</span>
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
