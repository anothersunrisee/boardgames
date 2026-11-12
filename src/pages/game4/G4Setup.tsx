import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Flame, Users, Sparkles } from 'lucide-react'
import { useGameStore, type Player, type DebateMatch } from '../../store/useGameStore'
import { getRandomTopic, getRandomChaosCard } from '../../data/game4-topics'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { BlobMascot } from '../../components/ui/BlobMascot'
import { HostUtilityBar } from '../../components/HostUtilityBar'
import { sfx } from '../../utils/sound'

function genId() {
  return Math.random().toString(36).slice(2)
}

type PlayerRow = { id: string; name: string; kubu: string }

export default function G4Setup() {
  const navigate = useNavigate()
  const { setPlayers, g4SetSetup, g4Reset } = useGameStore()

  // Default 10 players (5 match pairs)
  const [rows, setRows] = useState<PlayerRow[]>([
    { id: genId(), name: 'Alex', kubu: 'Tim Merah' },
    { id: genId(), name: 'Budi', kubu: 'Tim Biru' },
    { id: genId(), name: 'Citra', kubu: 'Tim Merah' },
    { id: genId(), name: 'Dian', kubu: 'Tim Biru' },
    { id: genId(), name: 'Eka', kubu: 'Tim Merah' },
    { id: genId(), name: 'Fajar', kubu: 'Tim Biru' },
    { id: genId(), name: 'Gita', kubu: 'Tim Merah' },
    { id: genId(), name: 'Hadi', kubu: 'Tim Biru' },
    { id: genId(), name: 'Indah', kubu: 'Tim Merah' },
    { id: genId(), name: 'Joko', kubu: 'Tim Biru' },
  ])

  const [enableChaos, setEnableChaos] = useState(true)

  const addPlayerPair = () => {
    if (rows.length >= 16) return
    sfx.playPop()
    setRows((r) => [
      ...r,
      { id: genId(), name: '', kubu: 'Tim A' },
      { id: genId(), name: '', kubu: 'Tim B' },
    ])
  }

  const removePlayerPair = () => {
    if (rows.length <= 4) return
    sfx.playPop()
    setRows((r) => r.slice(0, r.length - 2))
  }

  const updateRow = (id: string, field: 'name' | 'kubu', val: string) => {
    setRows((r) => r.map((x) => (x.id === id ? { ...x, [field]: val } : x)))
  }

  const isValid = rows.every((r) => r.name.trim() && r.kubu.trim())

  const handleStart = () => {
    if (!isValid) return
    sfx.playSuccess()

    const players: Player[] = rows.map((r) => ({
      id: r.id,
      name: r.name.trim(),
      kubu: r.kubu.trim(),
      score: 0,
    }))

    // Shuffle players to form random pairings
    const shuffled = [...players].sort(() => Math.random() - 0.5)
    const matches: DebateMatch[] = []
    const usedTopicIds: number[] = []

    for (let i = 0; i < shuffled.length; i += 2) {
      const pA = shuffled[i]
      const pB = shuffled[i + 1]
      const topic = getRandomTopic(usedTopicIds)
      usedTopicIds.push(topic.id)

      matches.push({
        matchNumber: matches.length + 1,
        playerAId: pA.id,
        playerBId: pB.id,
        topic,
        chaosCardA: enableChaos ? getRandomChaosCard() : undefined,
        chaosCardB: enableChaos ? getRandomChaosCard() : undefined,
        votesA: 0,
        votesB: 0,
        isCompleted: false,
      })
    }

    setPlayers(players)
    g4Reset()
    g4SetSetup(players, matches, enableChaos)
    navigate('/game4/match')
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E24] px-4 py-8 md:py-12 flex flex-col justify-between">
      <motion.div
        className="max-w-xl mx-auto w-full flex-1 flex flex-col"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Navigation */}
        <button
          type="button"
          className="text-sm font-bold text-[#64616C] hover:text-[#1E1E24] mb-6 flex items-center gap-1.5 cursor-pointer w-fit"
          onClick={() => {
            sfx.playPop()
            navigate('/')
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Menu</span>
        </button>

        {/* Mascot & Header */}
        <div className="text-center mb-6">
          <BlobMascot
            shape="triangle"
            mood="spicy"
            color="#FFB03A"
            accentColor="#B53B10"
            accessory="horns"
            size={100}
          />
          <h1 className="font-display text-3xl md:text-4xl font-bold text-[#EC5A29] mt-2">
            The Devil's Advocate
          </h1>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE8DF] text-[#EC5A29] text-xs font-black uppercase tracking-wider mt-2">
            <Flame className="w-3.5 h-3.5" />
            <span>1 VS 1 HOT TAKES DEBATE BATTLE</span>
          </div>
          <p className="text-sm font-semibold text-[#64616C] mt-2 max-w-md mx-auto">
            Dua orang berdebat membela opini absurd, sisa pemain menjadi audiens dan juri pemberi nilai!
          </p>
        </div>

        {/* Chaos Card Toggle */}
        <Card className="mb-4 p-4 bg-white shadow-xs flex items-center justify-between border-2 border-[#EC5A29]/20">
          <div>
            <p className="font-display text-base font-bold text-[#1E1E24] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#EC5A29]" />
              <span>Fitur CHAOS CARD</span>
            </p>
            <p className="text-xs text-[#64616C] font-medium mt-0.5">
              Tantangan & gangguan kocak acak saat debat (misal: dilarang kata "aku")
            </p>
          </div>
          <button
            type="button"
            className={`px-4 py-2 rounded-2xl font-display text-xs font-bold transition-all cursor-pointer ${
              enableChaos
                ? 'bg-[#EC5A29] text-white shadow-[0_4px_0_#B53B10]'
                : 'bg-black/10 text-[#64616C]'
            }`}
            onClick={() => {
              sfx.playPop()
              setEnableChaos(!enableChaos)
            }}
          >
            {enableChaos ? '🔥 AKTIF' : 'NONAKTIF'}
          </button>
        </Card>

        {/* Player Roster */}
        <Card className="mb-6 p-5 bg-white shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <p className="font-display text-base font-bold text-[#1E1E24] flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#EC5A29]" />
              <span>Daftar Peserta ({rows.length} Pemain = {rows.length / 2} Match)</span>
            </p>
            <div className="flex gap-2">
              {rows.length > 4 && (
                <button
                  type="button"
                  className="px-2.5 py-1 text-xs font-bold rounded-xl border-2 border-red-200 text-red-600 bg-red-50 hover:bg-red-100 cursor-pointer"
                  onClick={removePlayerPair}
                >
                  - 2 Orang
                </button>
              )}
              {rows.length < 16 && (
                <button
                  type="button"
                  className="px-2.5 py-1 text-xs font-bold rounded-xl border-2 border-orange-200 text-orange-700 bg-orange-50 hover:bg-orange-100 cursor-pointer"
                  onClick={addPlayerPair}
                >
                  + 2 Orang
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {rows.map((row, i) => (
              <div key={row.id} className="flex gap-2 items-center">
                <span className="font-display text-xs w-6 text-center text-[#64616C]">
                  {i + 1}
                </span>
                <input
                  className="input-field flex-1 text-sm py-2"
                  placeholder={`Nama pemain ${i + 1}`}
                  value={row.name}
                  onChange={(e) => updateRow(row.id, 'name', e.target.value)}
                  maxLength={20}
                />
                <input
                  className="input-field text-sm py-2"
                  style={{ width: '7.5rem' }}
                  placeholder="Kubu/Tim"
                  value={row.kubu}
                  onChange={(e) => updateRow(row.id, 'kubu', e.target.value)}
                  maxLength={15}
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Start Button */}
        <div className="mt-auto">
          <Button
            variant="tangerine"
            fullWidth
            size="lg"
            disabled={!isValid}
            onClick={handleStart}
          >
            ⚔️ Undi Pasangan & Mulai Debat!
          </Button>
        </div>
      </motion.div>

      <HostUtilityBar />
    </div>
  )
}
