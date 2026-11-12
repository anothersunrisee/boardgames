import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { useGameStore, type Player, type G3BoySlot } from '../../store/useGameStore'
import { WORD_CATEGORIES } from '../../data/game3-words'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { BlobMascot } from '../../components/ui/BlobMascot'
import { HostUtilityBar } from '../../components/HostUtilityBar'
import { sfx } from '../../utils/sound'

function genId() { return Math.random().toString(36).slice(2) }
type PlayerRow = { id: string; name: string; kubu: string }

export default function G3Setup() {
  const navigate = useNavigate()
  const { setPlayers, g3SetPlayers, g3SetSlots, g3Reset } = useGameStore()

  const [boyRows, setBoyRows] = useState<PlayerRow[]>([
    { id: genId(), name: 'Bagas', kubu: 'Cowok' },
    { id: genId(), name: 'Diki', kubu: 'Cowok' },
    { id: genId(), name: 'Fikri', kubu: 'Cowok' },
  ])
  const [girlRows, setGirlRows] = useState<PlayerRow[]>([
    { id: genId(), name: 'Nisa', kubu: 'Cewek' },
    { id: genId(), name: 'Tiara', kubu: 'Cewek' },
    { id: genId(), name: 'Maya', kubu: 'Cewek' },
    { id: genId(), name: 'Vina', kubu: 'Cewek' },
    { id: genId(), name: 'Kania', kubu: 'Cewek' },
    { id: genId(), name: 'Laras', kubu: 'Cewek' },
    { id: genId(), name: 'Sofi', kubu: 'Cewek' },
  ])
  const [selectedCategory, setSelectedCategory] = useState(WORD_CATEGORIES[0].label)

  const updateBoy = (id: string, field: 'name' | 'kubu', val: string) =>
    setBoyRows((r) => r.map((x) => (x.id === id ? { ...x, [field]: val } : x)))
  const updateGirl = (id: string, field: 'name' | 'kubu', val: string) =>
    setGirlRows((r) => r.map((x) => (x.id === id ? { ...x, [field]: val } : x)))

  const isValid = boyRows.every((r) => r.name.trim()) && girlRows.every((r) => r.name.trim())

  const handleStart = () => {
    if (!isValid) return
    sfx.playSuccess()
    const boys: Player[] = boyRows.map((r) => ({ ...r, name: r.name.trim(), kubu: r.kubu.trim() || 'Cowok', score: 0 }))
    const girls: Player[] = girlRows.map((r) => ({ ...r, name: r.name.trim(), kubu: r.kubu.trim() || 'Cewek', score: 0 }))

    const cat = WORD_CATEGORIES.find((c) => c.label === selectedCategory)!
    const shuffledWords = [...cat.words].sort(() => Math.random() - 0.5)

    const slots: G3BoySlot[] = boys.map((b, i) => ({
      playerId: b.id,
      secretWord: shuffledWords[i % shuffledWords.length],
      category: selectedCategory,
      qna: [],
      girlGuesses: [],
    }))

    setPlayers([...boys, ...girls])
    g3Reset()
    g3SetPlayers(boys, girls)
    g3SetSlots(slots)
    navigate('/game3/secret')
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E24] px-4 py-8 md:py-12 flex flex-col justify-between">
      <motion.div className="max-w-lg mx-auto w-full flex-1 flex flex-col" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
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

        <div className="text-center mb-6">
          <BlobMascot
            shape="hexagon"
            mood="confident"
            color="#7CC0FF"
            accentColor="#1545A8"
            accessory="glasses"
            size={100}
          />
          <span className="inline-block px-3 py-1 rounded-full bg-[#E0EBFF] text-[#2568EF] text-xs font-black uppercase tracking-wider mb-2">
            HOST MODE • LIVE INTEROGASI
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-[#2568EF]">
            Boys Stuff, Girls Guess!
          </h1>
          <p className="text-sm font-semibold text-[#64616C] mt-1 max-w-sm mx-auto">
            Host memegang kata rahasia dunia pria. 7 cewek bertanya 2 pertanyaan live lalu menebak!
          </p>
        </div>

        {/* Category picker */}
        <Card className="mb-4 p-5 bg-white shadow-xs">
          <p className="font-display text-sm font-bold mb-2 text-[#2568EF]">Pilih Kategori Kata Rahasia:</p>
          <div className="flex flex-wrap gap-2">
            {WORD_CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                type="button"
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.label
                    ? 'bg-[#2568EF] text-white shadow-xs'
                    : 'bg-[#E0EBFF] text-[#2568EF] hover:bg-[#2568EF]/15'
                }`}
                onClick={() => {
                  sfx.playPop()
                  setSelectedCategory(cat.label)
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </Card>

        {/* Boys */}
        <Card className="mb-4 p-5 bg-white shadow-xs">
          <p className="font-display text-base font-bold mb-3 text-[#2568EF] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Tim Cowok Pembawa Kata (3)</span>
          </p>
          <div className="space-y-2">
            {boyRows.map((row, i) => (
              <div key={row.id} className="flex gap-2 items-center">
                <span className="font-display text-xs w-6 text-center text-[#64616C]">{i + 1}</span>
                <input className="input-field flex-1 text-sm py-2" placeholder={`Nama Cowok ${i + 1}`} value={row.name}
                  onChange={(e) => updateBoy(row.id, 'name', e.target.value)} maxLength={20} />
                <input className="input-field text-sm py-2" style={{ width: '7rem' }} placeholder="Kubu" value={row.kubu}
                  onChange={(e) => updateBoy(row.id, 'kubu', e.target.value)} maxLength={12} />
              </div>
            ))}
          </div>
        </Card>

        {/* Girls */}
        <Card className="mb-5 p-5 bg-white shadow-xs">
          <p className="font-display text-base font-bold mb-3 text-[#D8317E] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Tim Cewek Penebak (7)</span>
          </p>
          <div className="space-y-2">
            {girlRows.map((row, i) => (
              <div key={row.id} className="flex gap-2 items-center">
                <span className="font-display text-xs w-6 text-center text-[#64616C]">{i + 1}</span>
                <input className="input-field flex-1 text-sm py-2" placeholder={`Nama Cewek ${i + 1}`} value={row.name}
                  onChange={(e) => updateGirl(row.id, 'name', e.target.value)} maxLength={20} />
                <input className="input-field text-sm py-2" style={{ width: '7rem' }} placeholder="Kubu" value={row.kubu}
                  onChange={(e) => updateGirl(row.id, 'kubu', e.target.value)} maxLength={12} />
              </div>
            ))}
          </div>
        </Card>

        <div className="mt-auto">
          <Button
            variant="cobalt"
            size="lg"
            fullWidth
            disabled={!isValid}
            onClick={handleStart}
          >
            Mulai Interogasi Live (Mode Host) →
          </Button>
        </div>
      </motion.div>

      <HostUtilityBar />
    </div>
  )
}
