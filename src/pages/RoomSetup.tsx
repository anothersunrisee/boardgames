import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { useGameStore, type Player, type Gender, DEFAULT_ROOM_PLAYERS } from '../store/useGameStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { BlobMascot } from '../components/ui/BlobMascot';
import { HostUtilityBar } from '../components/HostUtilityBar';
import { sfx } from '../utils/sound';

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

export const RoomSetup: React.FC = () => {
  const navigate = useNavigate();
  const { players, setPlayers, setRoomCreated, roomName, setRoomName } = useGameStore();

  const [roster, setRoster] = useState<Player[]>(
    players.length > 0 ? players : DEFAULT_ROOM_PLAYERS
  );
  const [currentRoomName, setCurrentRoomName] = useState(roomName || 'Party Malam Ini');

  const cewekCount = roster.filter((p) => p.gender === 'cewek').length;
  const cowokCount = roster.filter((p) => p.gender === 'cowok').length;

  const handleAddPlayer = () => {
    if (roster.length >= 20) return;
    sfx.playPop(650);
    // Auto-balance default gender recommendation
    const nextGender: Gender = cowokCount < cewekCount ? 'cowok' : 'cewek';
    setRoster((prev) => [
      ...prev,
      {
        id: genId(),
        name: '',
        gender: nextGender,
        kubu: nextGender === 'cewek' ? 'Tim Cewek' : 'Tim Cowok',
        score: 0,
      },
    ]);
  };

  const handleRemovePlayer = (id: string) => {
    if (roster.length <= 2) return;
    sfx.playPop(420);
    setRoster((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpdateField = (id: string, field: keyof Player, val: any) => {
    setRoster((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        if (field === 'gender') {
          sfx.playPop(750);
          return {
            ...p,
            gender: val,
            kubu: p.kubu.includes('Tim') ? (val === 'cewek' ? 'Tim Cewek' : 'Tim Cowok') : p.kubu,
          };
        }
        return { ...p, [field]: val };
      })
    );
  };

  // Quick Presets
  const applyPreset10 = () => {
    sfx.playSuccess();
    setRoster(DEFAULT_ROOM_PLAYERS);
  };

  const applyPreset8 = () => {
    sfx.playSuccess();
    setRoster([
      { id: genId(), name: 'Alya', gender: 'cewek', kubu: 'Tim Cewek', score: 0 },
      { id: genId(), name: 'Bella', gender: 'cewek', kubu: 'Tim Cewek', score: 0 },
      { id: genId(), name: 'Caca', gender: 'cewek', kubu: 'Tim Cewek', score: 0 },
      { id: genId(), name: 'Dara', gender: 'cewek', kubu: 'Tim Cewek', score: 0 },
      { id: genId(), name: 'Budi', gender: 'cowok', kubu: 'Tim Cowok', score: 0 },
      { id: genId(), name: 'Dimas', gender: 'cowok', kubu: 'Tim Cowok', score: 0 },
      { id: genId(), name: 'Fajar', gender: 'cowok', kubu: 'Tim Cowok', score: 0 },
      { id: genId(), name: 'Kevin', gender: 'cowok', kubu: 'Tim Cowok', score: 0 },
    ]);
  };

  const applyPreset6 = () => {
    sfx.playSuccess();
    setRoster([
      { id: genId(), name: 'Nisa', gender: 'cewek', kubu: 'Tim Cewek', score: 0 },
      { id: genId(), name: 'Tiara', gender: 'cewek', kubu: 'Tim Cewek', score: 0 },
      { id: genId(), name: 'Maya', gender: 'cewek', kubu: 'Tim Cewek', score: 0 },
      { id: genId(), name: 'Bagas', gender: 'cowok', kubu: 'Tim Cowok', score: 0 },
      { id: genId(), name: 'Diki', gender: 'cowok', kubu: 'Tim Cowok', score: 0 },
      { id: genId(), name: 'Fikri', gender: 'cowok', kubu: 'Tim Cowok', score: 0 },
    ]);
  };

  const isValid = roster.length >= 2 && roster.every((p) => p.name.trim().length > 0);

  const handleSaveAndEnter = () => {
    if (!isValid) return;
    sfx.playFanfare();

    const cleanPlayers: Player[] = roster.map((p, i) => ({
      ...p,
      name: p.name.trim() || `Pemain ${i + 1}`,
      kubu: p.kubu.trim() || (p.gender === 'cewek' ? 'Tim Cewek' : 'Tim Cowok'),
    }));

    setPlayers(cleanPlayers);
    setRoomName(currentRoomName.trim() || 'Party Games Room');
    setRoomCreated(true);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E24] px-4 py-8 md:py-12 flex flex-col justify-between">
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
        {/* Header Mascot & Title */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <BlobMascot shape="circle" mood="excited" color="#FCD34D" accentColor="#D97706" size={88} />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1E1E24] text-[#FAF7F2] text-xs font-bold tracking-wide mb-2 shadow-xs">
            <Users className="w-3.5 h-3.5 text-[#FCD34D]" />
            <span>SINGLE-HOST ROOM REGISTRATION</span>
          </div>

          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-[#1E1E24]">
            Masuk Room & Daftar Pemain
          </h1>
          <p className="text-[#64616C] text-sm md:text-base font-medium mt-1.5 max-w-lg mx-auto">
            1 Host memegang layar. Masukkan nama & gender pemain. Setelah ini, setiap game yang dipilih akan diacak otomatis!
          </p>
        </div>

        {/* Room Name & Preset Bar */}
        <Card className="mb-4 p-4 md:p-5 bg-white shadow-xs border-2 border-[#1E1E24]/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
            <div className="w-full sm:w-auto flex-1">
              <label className="block text-xs font-bold text-[#64616C] uppercase tracking-wider mb-1">
                Nama Room Party:
              </label>
              <input
                type="text"
                className="input-field text-sm font-bold py-2 w-full"
                value={currentRoomName}
                onChange={(e) => setCurrentRoomName(e.target.value)}
                placeholder="Contoh: Party Kost Sabtu Malam"
                maxLength={30}
              />
            </div>

            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <span className="text-[11px] font-bold text-[#64616C]">Preset Cepat:</span>
              <button
                type="button"
                onClick={applyPreset10}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#FCE4F0] text-[#D8317E] hover:bg-[#F9CFE3] cursor-pointer"
                title="7 Cewek + 3 Cowok (Ideal Game 02 & 03)"
              >
                10 (7C+3L)
              </button>
              <button
                type="button"
                onClick={applyPreset8}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#E0EBFF] text-[#2568EF] hover:bg-[#CCE0FF] cursor-pointer"
                title="4 Cewek + 4 Cowok"
              >
                8 (4C+4L)
              </button>
              <button
                type="button"
                onClick={applyPreset6}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#D6F5EC] text-[#158467] hover:bg-[#C2EFE1] cursor-pointer"
                title="3 Cewek + 3 Cowok"
              >
                6 (3C+3L)
              </button>
            </div>
          </div>

          {/* Roster Header */}
          <div className="flex items-center justify-between pb-2 border-b border-[#1E1E24]/10 mb-3">
            <span className="font-display text-sm font-bold text-[#1E1E24] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#F59E0B]" />
              <span>Daftar Pemain ({roster.length} Orang)</span>
            </span>
            <div className="flex items-center gap-2 text-xs font-extrabold">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FCE4F0] text-[#D8317E]">
                👧 {cewekCount} Cewek
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#E0EBFF] text-[#2568EF]">
                👦 {cowokCount} Cowok
              </span>
            </div>
          </div>

          {/* Players Rows */}
          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {roster.map((player, index) => (
              <div
                key={player.id}
                className="flex flex-wrap sm:flex-nowrap items-center gap-2 p-2.5 rounded-2xl bg-[#FAF7F2] border border-[#1E1E24]/8"
              >
                <span className="w-6 text-center font-display text-xs font-bold text-[#64616C]">
                  {index + 1}
                </span>

                {/* Name Input */}
                <input
                  type="text"
                  className="input-field text-sm font-bold py-1.5 flex-1 min-w-[130px]"
                  placeholder={`Nama pemain ${index + 1}`}
                  value={player.name}
                  onChange={(e) => handleUpdateField(player.id, 'name', e.target.value)}
                  maxLength={20}
                />

                {/* Gender Toggle Pill */}
                <div className="inline-flex p-0.5 rounded-xl bg-white border border-[#1E1E24]/10 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleUpdateField(player.id, 'gender', 'cewek')}
                    className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
                      player.gender === 'cewek'
                        ? 'bg-[#D8317E] text-white shadow-xs'
                        : 'text-[#64616C] hover:text-[#1E1E24]'
                    }`}
                  >
                    <span>👧</span>
                    <span>Cewek</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateField(player.id, 'gender', 'cowok')}
                    className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
                      player.gender === 'cowok'
                        ? 'bg-[#2568EF] text-white shadow-xs'
                        : 'text-[#64616C] hover:text-[#1E1E24]'
                    }`}
                  >
                    <span>👦</span>
                    <span>Cowok</span>
                  </button>
                </div>

                {/* Team / Kubu Input */}
                <input
                  type="text"
                  className="input-field text-xs font-semibold py-1.5 w-24 sm:w-28 shrink-0"
                  placeholder="Kubu / Tim"
                  value={player.kubu}
                  onChange={(e) => handleUpdateField(player.id, 'kubu', e.target.value)}
                  maxLength={15}
                />

                {/* Remove button */}
                {roster.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePlayer(player.id)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-50 transition cursor-pointer shrink-0"
                    title="Hapus pemain"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add Player Button */}
          {roster.length < 20 && (
            <button
              type="button"
              onClick={handleAddPlayer}
              className="mt-3.5 w-full py-2.5 rounded-2xl text-xs font-bold border-2 border-dashed border-[#1E1E24]/20 text-[#1E1E24] hover:bg-[#FAF7F2] flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Tambah Pemain ({roster.length}/20)</span>
            </button>
          )}
        </Card>

        {/* Action Button */}
        <div className="mt-auto space-y-2">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            disabled={!isValid}
            onClick={handleSaveAndEnter}
          >
            <span>Buka Room & Lanjut Pilih Game</span>
            <ArrowRight className="w-5 h-5" />
          </Button>

          <p className="text-center text-[11px] text-[#64616C] font-semibold">
            ✨ Setelah masuk, game yang kamu pilih akan mengacak role & kartu secara otomatis!
          </p>
        </div>
      </div>

      <HostUtilityBar />
    </div>
  );
};

export default RoomSetup;
