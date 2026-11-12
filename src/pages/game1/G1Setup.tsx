import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, UserPlus, Trash2 } from 'lucide-react'
import { useGameStore, type Player } from '../../store/useGameStore'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { BlobMascot } from '../../components/ui/BlobMascot'
import { HostUtilityBar } from '../../components/HostUtilityBar'
import { sfx } from '../../utils/sound'

function genId() {
  return Math.random().toString(36).slice(2)
}

export default function G1Setup() {
  const navigate = useNavigate()
  const { setPlayers, g1Reset } = useGameStore()

  const [rows, setRows] = useState<{ id: string; name: string; kubu: string }[]>([
    { id: genId(), name: 'Dina', kubu: 'Tim Hijau' },
    { id: genId(), name: 'Bimo', kubu: 'Tim Kuning' },
    { id: genId(), name: 'Sari', kubu: 'Tim Hijau' },
    { id: genId(), name: 'Rian', kubu: 'Tim Kuning' },
  ])

  const addRow = () => {
    if (rows.length >= 15) return
    sfx.playPop(620)
    setRows((r) => [...r, { id: genId(), name: '', kubu: 'Tim A' }])
  }

  const removeRow = (id: string) => {
    if (rows.length <= 3) return
    sfx.playPop(420)
    setRows((r) => r.filter((x) => x.id !== id))
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
    setPlayers(players)
    g1Reset()
    navigate('/game1/round')
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E24] px-4 py-8 md:py-12 flex flex-col">
      <motion.div
        className="max-w-lg mx-auto w-full flex-1 flex flex-col"
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

        {/* Mascot & Title */}
        <div className="text-center mb-6">
          <BlobMascot
            shape="flower"
            mood="dizzy"
            color="#5CE6C0"
            accentColor="#0F5E49"
            accessory="headband"
            size={100}
          />
          <span className="inline-block px-3 py-1 rounded-full bg-[#D6F5EC] text-[#158467] text-xs font-black uppercase tracking-wider mb-2">
            HOST MODE • LIVE PARTY
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-[#158467]">
            Same Brain? NO!
          </h1>
          <p className="text-sm font-semibold text-[#64616C] mt-1 max-w-sm mx-auto">
            Host memegang timer 30 detik & menilai skor. Semua pemain menulis 1 jawaban di HP masing-masing!
          </p>
        </div>

        {/* Players Card */}
        <Card className="mb-5 p-5">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#1E1E24]/10">
            <span className="font-display text-sm font-bold text-[#1E1E24]">
              Daftar Pemain ({rows.length})
            </span>
            <span className="text-xs font-semibold text-[#64616C]">
              Minimal 3 • Maksimal 15
            </span>
          </div>

          <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
            {rows.map((row, i) => (
              <div key={row.id} className="flex gap-2 items-center">
                <span className="font-display text-xs w-6 text-center text-[#64616C]">
                  {i + 1}
                </span>
                <input
                  className="input-field flex-1 text-sm py-2"
                  placeholder="Nama Pemain"
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
                {rows.length > 3 && (
                  <button
                    type="button"
                    onClick={() => removeRow(row.id)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-50 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {rows.length < 15 && (
            <button
              type="button"
              className="mt-4 w-full py-2.5 rounded-2xl text-xs font-bold border-2 border-dashed border-[#158467]/30 text-[#158467] hover:bg-[#D6F5EC]/50 flex items-center justify-center gap-1.5 transition cursor-pointer"
              onClick={addRow}
            >
              <UserPlus className="w-4 h-4" />
              <span>Tambah Pemain ({rows.length}/15)</span>
            </button>
          )}
        </Card>

        {/* Start Button */}
        <div className="mt-auto">
          <Button
            variant="emerald"
            fullWidth
            size="lg"
            disabled={!isValid}
            onClick={handleStart}
          >
            Mulai Ronde 1 (Mode Host 30s) →
          </Button>
        </div>
      </motion.div>

      <HostUtilityBar />
    </div>
  )
}
