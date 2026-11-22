import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
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
  const { players, setPlayers, g3SetPlayers, g3SetSlots, g3Reset } = useGameStore()

  const initialBoys = players.filter((p) => p.gender === 'cowok')
  const initialGirls = players.filter((p) => p.gender === 'cewek')

  const [boyRows, setBoyRows] = useState<PlayerRow[]>(() => {
    if (initialBoys.length > 0) {
      return initialBoys.map((p) => ({ id: p.id, name: p.name, kubu: p.kubu || 'Tim Cowok' }))
    }
    return [
      { id: genId(), name: 'Dimas', kubu: 'Tim Cowok' },
      { id: genId(), name: 'Kevin', kubu: 'Tim Cowok' },
      { id: genId(), name: 'Reno', kubu: 'Tim Cowok' },
      { id: genId(), name: 'Farhan', kubu: 'Tim Cowok' },
    ]
  })
  const [girlRows, setGirlRows] = useState<PlayerRow[]>(() => {
    if (initialGirls.length > 0) {
      return initialGirls.map((p) => ({ id: p.id, name: p.name, kubu: p.kubu || 'Tim Cewek' }))
    }
    return [
      { id: genId(), name: 'Alya', kubu: 'Tim Cewek' },
      { id: genId(), name: 'Bella', kubu: 'Tim Cewek' },
      { id: genId(), name: 'Caca', kubu: 'Tim Cewek' },
      { id: genId(), name: 'Dara', kubu: 'Tim Cewek' },
    ]
  })
  const [selectedCategory, setSelectedCategory] = useState(WORD_CATEGORIES[0].label)

  const updateBoy = (id: string, field: 'name' | 'kubu', val: string) =>
    setBoyRows((r) => r.map((x) => (x.id === id ? { ...x, [field]: val } : x)))
  const updateGirl = (id: string, field: 'name' | 'kubu', val: string) =>
    setGirlRows((r) => r.map((x) => (x.id === id ? { ...x, [field]: val } : x)))

  const isValid = boyRows.every((r) => r.name.trim()) && girlRows.every((r) => r.name.trim())

  const handleStart = () => {
    if (!isValid) return
    sfx.playSuccess()
    const boys: Player[] = boyRows.map((r) => {
      const existing = players.find((p) => p.id === r.id || p.name.toLowerCase() === r.name.trim().toLowerCase())
      return {
        id: existing?.id || r.id,
        name: r.name.trim(),
        gender: 'cowok' as const,
        kubu: r.kubu.trim() || 'Tim Cowok',
        score: existing?.score ?? 0,
        avatarId: existing?.avatarId || 'c05',
        status: existing?.status || 'active',
      }
    })
    const girls: Player[] = girlRows.map((r) => {
      const existing = players.find((p) => p.id === r.id || p.name.toLowerCase() === r.name.trim().toLowerCase())
      return {
        id: existing?.id || r.id,
        name: r.name.trim(),
        gender: 'cewek' as const,
        kubu: r.kubu.trim() || 'Tim Cewek',
        score: existing?.score ?? 0,
        avatarId: existing?.avatarId || 'c01',
        status: existing?.status || 'active',
      }
    })

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
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E24] px-4 py-6 md:py-8 pb-20 md:pb-16 flex flex-col justify-between">
      <motion.div className="max-w-5xl mx-auto w-full flex-1 flex flex-col" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        {/* Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            className="text-sm font-bold text-[#64616C] hover:text-[#1E1E24] flex items-center gap-1.5 cursor-pointer w-fit"
            onClick={() => {
              sfx.playPop()
              navigate('/hub')
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Menu</span>
          </button>

          <span className="inline-block px-3.5 py-1 rounded-full bg-[#E0EBFF] text-[#2568EF] text-xs font-black uppercase tracking-wider">
            LIVE INTEROGASI • COWOK VS CEWEK
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch flex-1">
          {/* LEFT COLUMN: Mascot, Category Picker & Start CTA */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <Card className="p-5 bg-white shadow-xs text-center flex flex-col items-center">
              <BlobMascot
                shape="hexagon"
                mood="confident"
                color="#7CC0FF"
                accentColor="#1545A8"
                accessory="glasses"
                size={84}
              />
              <h1 className="font-display text-2xl md:text-3xl font-bold text-[#2568EF] mt-2">
                Boys Stuff, Girls Guess!
              </h1>
              <p className="text-xs font-semibold text-[#64616C] mt-1">
                Host memegang kata rahasia dunia pria. {girlRows.length} cewek bertanya 2 pertanyaan live lalu menebak!
              </p>
            </Card>

            {/* Category picker */}
            <Card className="p-4 bg-white shadow-xs">
              <p className="font-display text-sm font-bold mb-2.5 text-[#2568EF]">Pilih Kategori Kata Rahasia:</p>
              <div className="flex flex-wrap gap-2">
                {WORD_CATEGORIES.map((cat) => (
                  <button
                    key={cat.label}
                    type="button"
                    className={`px-3.5 py-2 min-h-[38px] rounded-full text-xs font-bold transition-all cursor-pointer ${
                      selectedCategory === cat.label
                        ? 'bg-[#2568EF] text-white shadow-xs'
                        : 'bg-[#E0EBFF] text-[#1545A8] hover:bg-[#2568EF]/15'
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

            <div className="mt-auto">
              <Button
                variant="cobalt"
                size="lg"
                fullWidth
                disabled={!isValid}
                onClick={handleStart}
              >
                Mulai Interogasi Live
              </Button>
            </div>
          </div>

          {/* RIGHT COLUMN: Boys & Girls Team Lists */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {/* Boys */}
            <Card className="p-4 bg-white shadow-xs flex flex-col">
              <p className="font-display text-base font-bold mb-2.5 text-[#2568EF]">
                Tim Cowok Pembawa Kata ({boyRows.length})
              </p>
              <div className="space-y-2 max-h-[185px] overflow-y-auto pr-1 overflow-x-hidden">
                {boyRows.map((row, i) => (
                  <div key={row.id} className="flex gap-2 items-center min-w-0">
                    <span className="font-display text-xs w-6 text-center text-[#64616C] shrink-0">{i + 1}</span>
                    <input className="input-field flex-1 text-sm py-2 min-w-0" placeholder={`Nama Cowok ${i + 1}`} value={row.name}
                      onChange={(e) => updateBoy(row.id, 'name', e.target.value)} maxLength={20} />
                    <input className="input-field text-sm py-2 shrink-0" style={{ width: '6.5rem' }} placeholder="Kubu" value={row.kubu}
                      onChange={(e) => updateBoy(row.id, 'kubu', e.target.value)} maxLength={12} />
                  </div>
                ))}
              </div>
            </Card>

            {/* Girls */}
            <Card className="p-4 bg-white shadow-xs flex flex-col">
              <p className="font-display text-base font-bold mb-2.5 text-[#D8317E]">
                Tim Cewek Penebak ({girlRows.length})
              </p>
              <div className="space-y-2 max-h-[185px] overflow-y-auto pr-1 overflow-x-hidden">
                {girlRows.map((row, i) => (
                  <div key={row.id} className="flex gap-2 items-center min-w-0">
                    <span className="font-display text-xs w-6 text-center text-[#64616C] shrink-0">{i + 1}</span>
                    <input className="input-field flex-1 text-sm py-2 min-w-0" placeholder={`Nama Cewek ${i + 1}`} value={row.name}
                      onChange={(e) => updateGirl(row.id, 'name', e.target.value)} maxLength={20} />
                    <input className="input-field text-sm py-2 shrink-0" style={{ width: '6.5rem' }} placeholder="Kubu" value={row.kubu}
                      onChange={(e) => updateGirl(row.id, 'kubu', e.target.value)} maxLength={12} />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </motion.div>

      <HostUtilityBar />
    </div>
  )
}
