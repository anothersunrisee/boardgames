import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { useGameStore, type Player, type G2GirlSlot } from '../../store/useGameStore'
import { getRandomItems } from '../../data/game2-items'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { BlobMascot } from '../../components/ui/BlobMascot'
import { HostUtilityBar } from '../../components/HostUtilityBar'
import { sfx } from '../../utils/sound'

function genId() { return Math.random().toString(36).slice(2) }

type PlayerRow = { id: string; name: string; kubu: string }

export default function G2Setup() {
  const navigate = useNavigate()
  const { setPlayers, g2SetPlayers, g2SetSlots, g2Reset } = useGameStore()

  const [girlRows, setGirlRows] = useState<PlayerRow[]>([
    { id: genId(), name: 'Alya', kubu: 'Cewek' },
    { id: genId(), name: 'Bella', kubu: 'Cewek' },
    { id: genId(), name: 'Caca', kubu: 'Cewek' },
    { id: genId(), name: 'Dara', kubu: 'Cewek' },
    { id: genId(), name: 'Elsa', kubu: 'Cewek' },
    { id: genId(), name: 'Fani', kubu: 'Cewek' },
    { id: genId(), name: 'Gaby', kubu: 'Cewek' },
  ])
  const [boyRows, setBoyRows] = useState<PlayerRow[]>([
    { id: genId(), name: 'Dimas', kubu: 'Cowok' },
    { id: genId(), name: 'Kevin', kubu: 'Cowok' },
    { id: genId(), name: 'Reno', kubu: 'Cowok' },
  ])

  const updateGirl = (id: string, field: 'name' | 'kubu', val: string) =>
    setGirlRows((r) => r.map((x) => (x.id === id ? { ...x, [field]: val } : x)))

  const updateBoy = (id: string, field: 'name' | 'kubu', val: string) =>
    setBoyRows((r) => r.map((x) => (x.id === id ? { ...x, [field]: val } : x)))

  const isValid =
    girlRows.every((r) => r.name.trim()) &&
    boyRows.every((r) => r.name.trim())

  const handleStart = () => {
    if (!isValid) return
    sfx.playSuccess()
    const girls: Player[] = girlRows.map((r) => ({ ...r, name: r.name.trim(), kubu: r.kubu.trim() || 'Cewek', score: 0 }))
    const boys: Player[] = boyRows.map((r) => ({ ...r, name: r.name.trim(), kubu: r.kubu.trim() || 'Cowok', score: 0 }))
    const allPlayers = [...girls, ...boys]

    const items = getRandomItems(girls.length)
    const slots: G2GirlSlot[] = girls.map((g, i) => ({
      playerId: g.id,
      secretItem: items[i],
      qna: [],
      boyGuesses: [],
    }))

    setPlayers(allPlayers)
    g2Reset()
    g2SetPlayers(girls, boys)
    g2SetSlots(slots)
    navigate('/game2/secret')
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E24] px-4 py-8 md:py-12 flex flex-col">
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
            shape="scallop"
            mood="cheeky"
            color="#FF8AC2"
            accentColor="#9A1454"
            accessory="crown"
            size={100}
          />
          <span className="inline-block px-3 py-1 rounded-full bg-[#FCE4F0] text-[#D8317E] text-xs font-black uppercase tracking-wider mb-2">
            HOST MODE • LIVE INTEROGASI
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-[#D8317E]">
            Beauty Expert?!
          </h1>
          <p className="text-sm font-semibold text-[#64616C] mt-1 max-w-sm mx-auto">
            Host memegang benda rahasia. 3 cowok bertanya 2 pertanyaan live lalu menebak!
          </p>
        </div>

        {/* Girls */}
        <Card className="mb-4 p-5 bg-white shadow-xs">
          <p className="font-display text-base font-bold mb-3 text-[#D8317E] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Tim Cewek (7 Pemain)</span>
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

        {/* Boys */}
        <Card className="mb-5 p-5 bg-white shadow-xs">
          <p className="font-display text-base font-bold mb-3 text-[#2568EF] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Tim Cowok Penebak (3 Pemain)</span>
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

        <div className="mt-auto">
          <Button
            variant="berry"
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
