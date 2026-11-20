import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, Trash2, ArrowRight, Sparkles, Smile, X } from 'lucide-react';
import { useGameStore, type Player, type Gender, DEFAULT_ROOM_PLAYERS } from '../store/useGameStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { GameMascotBot } from '../components/characters/GameMascotBot';
import { PlayerProfileAvatar } from '../components/characters/PlayerProfileAvatar';
import { ConcentricRoomTransition } from '../components/motion/ConcentricRoomTransition';
import { CHARACTER_PACK, getCharacterById } from '../assets-library/characters';
import { HostUtilityBar } from '../components/HostUtilityBar';
import { sfx } from '../assets-library/soundEngine';

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
  const [avatarPickerPlayerId, setAvatarPickerPlayerId] = useState<string | null>(null);
  const [transitionActive, setTransitionActive] = useState(false);

  const cewekCount = roster.filter((p) => p.gender === 'cewek').length;
  const cowokCount = roster.filter((p) => p.gender === 'cowok').length;

  const handleAddPlayer = () => {
    if (roster.length >= 20) return;
    sfx.playPop(650);
    const nextGender: Gender = cowokCount < cewekCount ? 'cowok' : 'cewek';
    const nextAvatar = CHARACTER_PACK[roster.length % CHARACTER_PACK.length].id;
    setRoster((prev) => [
      ...prev,
      {
        id: genId(),
        name: '',
        gender: nextGender,
        kubu: nextGender === 'cewek' ? 'Tim Cewek' : 'Tim Cowok',
        score: 0,
        avatarId: nextAvatar,
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

  const selectAvatarForPlayer = (playerId: string, avatarId: string) => {
    sfx.playPop(720);
    handleUpdateField(playerId, 'avatarId', avatarId);
    setAvatarPickerPlayerId(null);
  };

  // Quick Presets with avatar IDs
  const applyPreset10 = () => {
    sfx.playSuccess();
    setRoster(DEFAULT_ROOM_PLAYERS);
  };

  const applyPreset8 = () => {
    sfx.playSuccess();
    setRoster([
      { id: genId(), name: 'Alya', gender: 'cewek', kubu: 'Tim Cewek', score: 0, avatarId: 'c01' },
      { id: genId(), name: 'Bella', gender: 'cewek', kubu: 'Tim Cewek', score: 0, avatarId: 'c07' },
      { id: genId(), name: 'Caca', gender: 'cewek', kubu: 'Tim Cewek', score: 0, avatarId: 'c04' },
      { id: genId(), name: 'Dara', gender: 'cewek', kubu: 'Tim Cewek', score: 0, avatarId: 'c09' },
      { id: genId(), name: 'Budi', gender: 'cowok', kubu: 'Tim Cowok', score: 0, avatarId: 'c03' },
      { id: genId(), name: 'Dimas', gender: 'cowok', kubu: 'Tim Cowok', score: 0, avatarId: 'c05' },
      { id: genId(), name: 'Fajar', gender: 'cowok', kubu: 'Tim Cowok', score: 0, avatarId: 'c02' },
      { id: genId(), name: 'Kevin', gender: 'cowok', kubu: 'Tim Cowok', score: 0, avatarId: 'c08' },
    ]);
  };

  const applyPreset6 = () => {
    sfx.playSuccess();
    setRoster([
      { id: genId(), name: 'Nisa', gender: 'cewek', kubu: 'Tim Cewek', score: 0, avatarId: 'c01' },
      { id: genId(), name: 'Tiara', gender: 'cewek', kubu: 'Tim Cewek', score: 0, avatarId: 'c04' },
      { id: genId(), name: 'Maya', gender: 'cewek', kubu: 'Tim Cewek', score: 0, avatarId: 'c07' },
      { id: genId(), name: 'Bagas', gender: 'cowok', kubu: 'Tim Cowok', score: 0, avatarId: 'c02' },
      { id: genId(), name: 'Diki', gender: 'cowok', kubu: 'Tim Cowok', score: 0, avatarId: 'c05' },
      { id: genId(), name: 'Fikri', gender: 'cowok', kubu: 'Tim Cowok', score: 0, avatarId: 'c08' },
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
      avatarId: p.avatarId || CHARACTER_PACK[i % CHARACTER_PACK.length].id,
    }));

    setPlayers(cleanPlayers);
    setRoomName(currentRoomName.trim() || 'Party Games Room');
    setRoomCreated(true);
    setTransitionActive(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E24] px-3 sm:px-6 py-4 md:py-8 flex flex-col justify-between relative overflow-x-hidden">
      {/* Concentric Circles Transition to Home */}
      <ConcentricRoomTransition
        active={transitionActive}
        roomTitle={currentRoomName.trim() || 'PARTY ROOM'}
        subtitle="MEMULAI ROOM PERMAINAN..."
        onComplete={() => {
          setTransitionActive(false);
          navigate('/hub');
        }}
      />

      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col justify-start">
        {/* Header Mascot & Title */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={() => {
                sfx.playPop();
                navigate('/');
              }}
              className="text-xs font-bold text-[#64616C] hover:text-[#1E1E24] flex items-center gap-1.5 cursor-pointer py-1 px-2.5 rounded-full hover:bg-black/5 transition-colors"
            >
              <span>← Onboarding Intro</span>
            </button>
            <span className="text-[11px] font-semibold text-[#64616C]">Langkah 1 dari 2</span>
          </div>

          <div className="flex justify-center mb-2">
            <GameMascotBot character={CHARACTER_PACK[4]} mood="happy" size={68} />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-0.5 rounded-full bg-[#1E1E24] text-[#FAF7F2] text-xs font-bold tracking-wide mb-1.5 shadow-xs">
            <Users className="w-3.5 h-3.5 text-[#FCD34D]" />
            <span>SINGLE-HOST ROOM REGISTRATION</span>
          </div>

          <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-[#1E1E24]">
            Masuk Room & Daftar Pemain
          </h1>
          <p className="text-[#64616C] text-xs sm:text-sm font-medium mt-1 max-w-lg mx-auto">
            1 Host memegang layar. Pilih avatar unik untuk tiap pemain. Semua mini-game akan diacak otomatis!
          </p>
        </div>

        {/* Room Name & Preset Bar */}
        <Card className="mb-4 p-4 md:p-5 bg-white shadow-xs border-2 border-[#1E1E24]/10 rounded-[28px]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div className="w-full sm:w-auto flex-1 min-w-0">
              <label className="block text-[11px] font-bold text-[#64616C] uppercase tracking-wider mb-1">
                Nama Room Party:
              </label>
              <input
                type="text"
                className="input-field text-xs sm:text-sm font-bold py-2 w-full rounded-2xl"
                value={currentRoomName}
                onChange={(e) => setCurrentRoomName(e.target.value)}
                placeholder="Contoh: Party Kost Sabtu Malam"
                maxLength={30}
              />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap self-start sm:self-end shrink-0 pt-1 sm:pt-0">
              <span className="text-[11px] font-bold text-[#64616C]">Preset Cepat:</span>
              <button
                type="button"
                onClick={applyPreset10}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#FCE4F0] text-[#D8317E] hover:bg-[#F9CFE3] cursor-pointer transition active:scale-95"
                title="7 Cewek + 3 Cowok (Ideal Game 02 & 03)"
              >
                10 (7C+3L)
              </button>
              <button
                type="button"
                onClick={applyPreset8}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#E0EBFF] text-[#2568EF] hover:bg-[#CCE0FF] cursor-pointer transition active:scale-95"
                title="4 Cewek + 4 Cowok"
              >
                8 (4C+4L)
              </button>
              <button
                type="button"
                onClick={applyPreset6}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#D6F5EC] text-[#158467] hover:bg-[#C2EFE1] cursor-pointer transition active:scale-95"
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

          {/* Players Rows (Responsive: 1-col on mobile, 2-cols on desktop with zero overflow/collisions) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[350px] lg:max-h-[390px] overflow-y-auto overflow-x-hidden pr-1.5 custom-scroll">
            {roster.map((player, index) => {
              const char = getCharacterById(player.avatarId || CHARACTER_PACK[index % CHARACTER_PACK.length].id);
              const isPickingAvatar = avatarPickerPlayerId === player.id;

              return (
                <div key={player.id} className="space-y-2">
                  <div className="p-2.5 sm:p-3 rounded-2xl bg-[#FAF7F2] border-2 border-[#1E1E24]/8 hover:border-[#1E1E24]/20 transition-all shadow-xs flex flex-col gap-2 relative">
                    {/* Top Row: # Index + Interactive Avatar + Full-width Name Input + Delete Button */}
                    <div className="flex items-center gap-2 w-full min-w-0">
                      <span className="w-5 text-center font-display text-xs font-black text-[#64616C] shrink-0">
                        #{index + 1}
                      </span>

                      {/* Interactive Avatar Button with edit hint */}
                      <button
                        type="button"
                        onClick={() => {
                          sfx.playPop();
                          setAvatarPickerPlayerId(isPickingAvatar ? null : player.id);
                        }}
                        className="shrink-0 p-0.5 rounded-full hover:scale-105 active:scale-95 transition cursor-pointer relative group"
                        title="Klik untuk ganti avatar karakter"
                      >
                        <PlayerProfileAvatar character={char} size={36} />
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-white rounded-full border border-[#1E1E24]/20 flex items-center justify-center text-[8px] shadow-xs">
                          ✏️
                        </span>
                      </button>

                      {/* Name Input (Takes all remaining width, never clipped) */}
                      <div className="flex-1 min-w-0">
                        <input
                          type="text"
                          className="w-full px-3 py-1.5 text-xs sm:text-sm font-bold bg-white rounded-xl border border-[#1E1E24]/15 focus:border-[#1E1E24] focus:ring-2 focus:ring-[#1E1E24]/10 outline-none text-[#1E1E24] placeholder-[#A09CA8] transition"
                          placeholder={`Nama pemain ${index + 1}`}
                          value={player.name}
                          onChange={(e) => handleUpdateField(player.id, 'name', e.target.value)}
                          maxLength={20}
                        />
                      </div>

                      {/* Remove button */}
                      {roster.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePlayer(player.id)}
                          className="w-7 h-7 rounded-xl flex items-center justify-center text-[#64616C] hover:text-[#DC2626] hover:bg-[#FEE2E2] transition cursor-pointer shrink-0"
                          title="Hapus pemain"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Bottom Row: Gender Segmented Switch + Kubu/Team Input */}
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#1E1E24]/8 pl-7">
                      {/* Gender Segmented Switch */}
                      <div className="inline-flex p-0.5 rounded-xl bg-white border border-[#1E1E24]/12 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleUpdateField(player.id, 'gender', 'cewek')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
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
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
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
                      <div className="flex items-center gap-1.5 flex-1 max-w-[160px] min-w-0">
                        <span className="text-[10px] font-bold text-[#64616C] uppercase tracking-wider shrink-0">
                          Kubu:
                        </span>
                        <input
                          type="text"
                          className="w-full px-2 py-1 text-xs font-bold bg-white rounded-lg border border-[#1E1E24]/15 focus:border-[#1E1E24] outline-none text-[#1E1E24] min-w-0"
                          placeholder="Nama Tim"
                          value={player.kubu}
                          onChange={(e) => handleUpdateField(player.id, 'kubu', e.target.value)}
                          maxLength={15}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quick Avatar Tray Popover */}
                  {isPickingAvatar && (
                    <div className="p-3 bg-white rounded-2xl border-2 border-[#1E1E24] shadow-md">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-extrabold uppercase text-[#64616C] flex items-center gap-1">
                          <Smile className="w-3.5 h-3.5 text-[#2568EF]" />
                          <span>Pilih Avatar untuk {player.name || `Pemain ${index + 1}`}:</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setAvatarPickerPlayerId(null)}
                          className="w-6 h-6 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center cursor-pointer text-xs"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 max-h-40 overflow-y-auto p-1">
                        {CHARACTER_PACK.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => selectAvatarForPlayer(player.id, c.id)}
                            className={`p-1 rounded-xl flex flex-col items-center gap-0.5 hover:bg-[#FAF7F2] transition cursor-pointer ${
                              player.avatarId === c.id ? 'ring-2 ring-[#EC5A29] bg-[#FFE8DF]' : ''
                            }`}
                            title={`${c.name} - ${c.tagline}`}
                          >
                            <PlayerProfileAvatar character={c} size={34} animated={false} />
                            <span className="text-[9px] font-bold text-[#1E1E24] truncate w-full text-center">
                              {c.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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
