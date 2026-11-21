import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { CHARACTER_PACK, getCharacterById } from '../assets-library/characters';
import { PlayerProfileAvatar } from '../components/characters/PlayerProfileAvatar';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { joinOnlineRoom, isFirebaseConfigured } from '../services/firebase';
import { formatRoomCode } from '../utils/roomCode';
import { sfx } from '../assets-library/soundEngine';
import type { OnlinePlayer } from '../types/multiplayer';

export default function PlayerJoin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const codeFromUrl = searchParams.get('code') || '';
  const [roomCode, setRoomCode] = useState(formatRoomCode(codeFromUrl));
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'cewek' | 'cowok'>('cewek');
  const [avatarId, setAvatarId] = useState(CHARACTER_PACK[0].id);
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (codeFromUrl) {
      setRoomCode(formatRoomCode(codeFromUrl));
    }
  }, [codeFromUrl]);

  const isValid = roomCode.trim().length === 4 && name.trim().length > 0;

  const handleJoin = async () => {
    if (!isValid || isLoading) return;
    sfx.playPop(750);
    setIsLoading(true);
    setErrorMessage(null);

    const playerId = `player_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const player: OnlinePlayer = {
      id: playerId,
      name: name.trim(),
      avatarId,
      gender,
      kubu: gender === 'cewek' ? 'Tim Cewek' : 'Tim Cowok',
      score: 0,
      isOnline: true,
      lastActive: Date.now(),
    };

    // Simpan identitas pemain di sessionStorage lokal
    sessionStorage.setItem(
      'partyhub_player_session',
      JSON.stringify({
        roomCode: roomCode.toUpperCase(),
        player,
      })
    );

    const res = await joinOnlineRoom(roomCode.toUpperCase(), player);

    if (res.success) {
      sfx.playSuccess();
      navigate('/play');
    } else {
      sfx.playPop(300);
      // Jika Firebase belum disetup atau room tidak ditemukan
      setErrorMessage(
        res.error ||
          'Gagal masuk room. Pastikan kode room 4-huruf sama persis dengan yang ada di layar TV!'
      );
      setIsLoading(false);
    }
  };

  const selectedChar = getCharacterById(avatarId);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E24] px-4 py-6 sm:py-10 flex flex-col justify-between max-w-md mx-auto">
      <div>
        {/* Header App Branding */}
        <div className="text-center mb-6">
          <span className="inline-block px-3 py-1 rounded-full bg-[#1E1E24] text-[#FAF7F2] text-[10px] font-black uppercase tracking-wider mb-2">
            PLAYER MOBILE CONTROLLER
          </span>
          <h1 className="font-display text-3xl font-bold text-[#1E1E24]">
            Masuk Room Pesta
          </h1>
          <p className="text-xs text-[#64616C] font-semibold mt-1">
            Gunakan HP kamu sebagai controller untuk menjawab tebakan & voting!
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3.5 rounded-2xl bg-[#FEE2E2] border-2 border-[#DC2626] text-[#991B1B] text-xs font-bold flex items-start gap-2 shadow-xs"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p>{errorMessage}</p>
              {!isFirebaseConfigured() && (
                <p className="text-[10px] text-[#B91C1C] mt-1 font-semibold">
                  (Tips: Host dapat mengonfigurasi Firebase Realtime di file .env)
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Join Form Card */}
        <Card className="p-5 bg-white shadow-xs rounded-[28px] border-2 border-[#1E1E24]/10 space-y-4">
          {/* Room Code Input */}
          <div>
            <label className="block text-[11px] font-bold text-[#64616C] uppercase tracking-wider mb-1.5">
              Kode Room (4 Huruf di Layar TV):
            </label>
            <input
              type="text"
              maxLength={4}
              value={roomCode}
              onChange={(e) => setRoomCode(formatRoomCode(e.target.value))}
              placeholder="Contoh: ASIK"
              className="input-field text-center font-display text-2xl font-black uppercase tracking-widest py-2.5 rounded-2xl"
            />
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-[11px] font-bold text-[#64616C] uppercase tracking-wider mb-1.5">
              Nama Panggilanmu:
            </label>
            <input
              type="text"
              maxLength={15}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama kamu..."
              className="input-field text-sm font-bold py-2.5 rounded-2xl"
            />
          </div>

          {/* Gender Selector */}
          <div>
            <label className="block text-[11px] font-bold text-[#64616C] uppercase tracking-wider mb-1.5">
              Gender (Untuk Game Adu Cewek vs Cowok):
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  sfx.playPop(700);
                  setGender('cewek');
                }}
                className={`py-2 px-3 rounded-xl font-display text-xs font-bold border-2 transition ${
                  gender === 'cewek'
                    ? 'bg-[#FCE4F0] border-[#D8317E] text-[#D8317E] shadow-2xs'
                    : 'bg-[#FAF7F2] border-[#1E1E24]/10 text-[#64616C]'
                }`}
              >
                👧 Cewek
              </button>
              <button
                type="button"
                onClick={() => {
                  sfx.playPop(700);
                  setGender('cowok');
                }}
                className={`py-2 px-3 rounded-xl font-display text-xs font-bold border-2 transition ${
                  gender === 'cowok'
                    ? 'bg-[#E0EBFF] border-[#2568EF] text-[#2568EF] shadow-2xs'
                    : 'bg-[#FAF7F2] border-[#1E1E24]/10 text-[#64616C]'
                }`}
              >
                👦 Cowok
              </button>
            </div>
          </div>

          {/* Avatar Selector */}
          <div>
            <label className="block text-[11px] font-bold text-[#64616C] uppercase tracking-wider mb-1.5">
              Pilih Avatar Karakter:
            </label>
            <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#FAF7F2] border border-[#1E1E24]/10">
              <PlayerProfileAvatar characterId={avatarId} size={48} name={name || 'Kamu'} />
              <div className="flex-1 min-w-0">
                <p className="font-display text-xs font-bold text-[#1E1E24] truncate">
                  {selectedChar?.name || 'Mascot'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    sfx.playPop();
                    setAvatarPickerOpen(!avatarPickerOpen);
                  }}
                  className="text-[11px] font-extrabold text-[#7C3AED] hover:underline"
                >
                  {avatarPickerOpen ? 'Tutup Pilihan Avatar' : 'Ganti Karakter Lain →'}
                </button>
              </div>
            </div>

            {/* Avatar Grid Drawer */}
            {avatarPickerOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-2 p-2 rounded-2xl bg-[#FAF7F2] border border-[#1E1E24]/10 max-h-48 overflow-y-auto"
              >
                {CHARACTER_PACK.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      sfx.playPop(720);
                      setAvatarId(c.id);
                      setAvatarPickerOpen(false);
                    }}
                    className={`p-1.5 rounded-xl flex flex-col items-center border transition ${
                      avatarId === c.id
                        ? 'border-[#7C3AED] bg-white shadow-2xs'
                        : 'border-transparent hover:bg-white/60'
                    }`}
                  >
                    <PlayerProfileAvatar characterId={c.id} size={32} name={c.name} />
                    <span className="text-[9px] font-bold text-[#1E1E24] mt-1 truncate w-full text-center">
                      {c.name}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </Card>
      </div>

      {/* Submit Button */}
      <div className="mt-6 space-y-2">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={!isValid || isLoading}
          onClick={handleJoin}
        >
          <span>{isLoading ? 'Menghubungkan ke TV...' : 'Masuk ke Room Party 🚀'}</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
        <p className="text-center text-[10px] text-[#64616C] font-semibold">
          🔒 Pastikan HP kamu tetap menyala selama permainan berlangsung.
        </p>
      </div>
    </div>
  );
}
