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
  const { players: storePlayers, playMode, setPlayers, g1Reset } = useGameStore()

  const [rows, setRows] = useState<{ id: string; name: string; kubu: string }[]>(() => {
    if (storePlayers && storePlayers.length >= 2) {
      return storePlayers.map((p) => ({ id: p.id, name: p.name, kubu: p.kubu || 'Tim A' }))
    }
    return [
      { id: genId(), name: 'Dina', kubu: 'Tim Hijau' },
      { id: genId(), name: 'Bimo', kubu: 'Tim Kuning' },
      { id: genId(), name: 'Sari', kubu: 'Tim Hijau' },
      { id: genId(), name: 'Rian', kubu: 'Tim Kuning' },
    ]
  })

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
    const updatedPlayers: Player[] = rows.map((r, i) => {
      const existing = storePlayers.find((p) => p.id === r.id)
      return {
        id: r.id,
        name: r.name.trim(),
        gender: existing?.gender || (i % 2 === 0 ? 'cewek' : 'cowok'),
        kubu: r.kubu.trim(),
        score: existing?.score ?? 0,
        avatarId: existing?.avatarId,
        status: existing?.status || 'active',
      }
    })
    setPlayers(updatedPlayers)
    g1Reset()
    navigate('/game1/round')
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E24] px-4 py-6 md:py-8 pb-20 md:pb-16 flex flex-col">
      <motion.div
        className="max-w-5xl mx-auto w-full flex-1 flex flex-col"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Navigation */}
        <button
          type="button"
          className="text-sm font-bold text-[#64616C] hover:text-[#1E1E24] mb-4 flex items-center gap-1.5 cursor-pointer w-fit"
          onClick={() => {
            sfx.playPop()
            navigate('/hub')
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Menu</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch flex-1">
          {/* LEFT COLUMN: Mascot, Rules & Start Button */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <Card className="p-6 bg-white shadow-xs text-center flex flex-col items-center">
              <BlobMascot
                shape="flower"
                mood="dizzy"
                color="#5CE6C0"
                accentColor="#0F5E49"
                accessory="headband"
                size={92}
              />
              <span className="inline-block px-3 py-1 rounded-full bg-[#D6F5EC] text-[#158467] text-xs font-black uppercase tracking-wider mt-3 mb-2">
                {playMode === 'multi_device'
                  ? 'MULTI-DEVICE • HP CONTROLLER'
                  : 'MODE MODERATOR • 1 LAYAR'}
              </span>
              <h1 className="font-display text-3xl font-bold text-[#158467]">
                Same Brain? NO!
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-[#64616C] mt-2">
                {playMode === 'multi_device'
                  ? 'Host memegang timer 30 detik & menilai skor. Semua pemain menulis 1 jawaban di HP masing-masing!'
                  : 'Host memegang timer 30 detik & menilai skor. Pemain menulis jawaban di kertas atau HP catatan pribadi!'}
              </p>
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
                Mulai Ronde 1 (Timer 30 Detik)
              </Button>
            </div>
          </div>

          {/* RIGHT COLUMN: Players Card */}
          <div className="lg:col-span-7">
            <Card className="p-5 h-full flex flex-col">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#1E1E24]/10">
                <span className="font-display text-sm font-bold text-[#1E1E24]">
                  Daftar Pemain ({rows.length})
                </span>
                <span className="text-xs font-semibold text-[#64616C]">
                  Minimal 3 • Maksimal 15
                </span>
              </div>

              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 overflow-x-hidden flex-1">
                {rows.map((row, i) => (
                  <div key={row.id} className="flex gap-2 items-center min-w-0">
                    <span className="font-display text-xs w-6 text-center text-[#64616C] shrink-0">
                      {i + 1}
                    </span>
                    <input
                      className="input-field flex-1 text-sm py-2 min-w-0"
                      placeholder="Nama Pemain"
                      value={row.name}
                      onChange={(e) => updateRow(row.id, 'name', e.target.value)}
                      maxLength={20}
                    />
                    <input
                      className="input-field text-sm py-2 shrink-0"
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
                        aria-label={`Hapus ${row.name || 'pemain'}`}
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-red-600 hover:bg-red-50 transition cursor-pointer shrink-0"
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
          </div>
        </div>
      </motion.div>

      <HostUtilityBar />
    </div>
  )
}
