import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Zap,
  Users,
  Smartphone,
  RotateCcw,
} from 'lucide-react';
import { CHARACTER_PACK, getCharacterById } from '../assets-library/characters';
import { PlayerProfileAvatar } from '../components/characters/PlayerProfileAvatar';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import {
  joinOnlineRoom,
  listenToRoom,
  isFirebaseConfigured,
} from '../services/firebase';
import { formatRoomCode } from '../utils/roomCode';
import { sfx } from '../assets-library/soundEngine';
import type { OnlinePlayer, OnlineRoomData } from '../types/multiplayer';

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

  // Slot matching state
  const [selectedRosterPlayerId, setSelectedRosterPlayerId] = useState<string | null>(null);
  const [isCustomNameMode, setIsCustomNameMode] = useState(false);
  const [onlineRoom, setOnlineRoom] = useState<OnlineRoomData | null>(null);

  // Check cached session
  const [savedSession, setSavedSession] = useState<{
    roomCode: string;
    player: OnlinePlayer;
  } | null>(() => {
    try {
      const rawSession =
        sessionStorage.getItem('partyhub_player_session') ||
        localStorage.getItem('partyhub_player_session');
      return rawSession ? JSON.parse(rawSession) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (codeFromUrl) {
      setRoomCode(formatRoomCode(codeFromUrl));
    }
  }, [codeFromUrl]);

  // Listen to room realtime updates when roomCode is 4 chars
  useEffect(() => {
    const formatted = formatRoomCode(roomCode);
    if (formatted.length !== 4) {
      setOnlineRoom(null);
      return;
    }

    const unsubscribe = listenToRoom(formatted, (roomData) => {
      setOnlineRoom(roomData);
    });

    return () => unsubscribe();
  }, [roomCode]);

  // Available roster slots from Host
  const rosterSlots = useMemo(() => {
    if (!onlineRoom || !onlineRoom.players) return [];
    return Object.values(onlineRoom.players);
  }, [onlineRoom]);

  // Auto-detect if saved session matches this room
  const matchingSavedPlayer = useMemo(() => {
    if (!savedSession || !onlineRoom || !onlineRoom.players) return null;
    if (savedSession.roomCode !== formatRoomCode(roomCode)) return null;
    return onlineRoom.players[savedSession.player.id] || null;
  }, [savedSession, onlineRoom, roomCode]);

  const handleSelectRosterSlot = (slot: OnlinePlayer) => {
    sfx.playPop(750);
    setSelectedRosterPlayerId(slot.id);
    setName(slot.name);
    setGender(slot.gender);
    setAvatarId(slot.avatarId);
    setIsCustomNameMode(false);
    setErrorMessage(null);
  };

  const handleResumeSession = async () => {
    if (!matchingSavedPlayer && !savedSession) return;
    sfx.playSuccess();
    setIsLoading(true);

    const playerToResume = matchingSavedPlayer || savedSession!.player;
    const res = await joinOnlineRoom(formatRoomCode(roomCode), {
      ...playerToResume,
      isOnline: true,
      connectedFromHp: true,
      lastActive: Date.now(),
    });

    if (res.success) {
      sessionStorage.setItem(
        'partyhub_player_session',
        JSON.stringify({
          roomCode: formatRoomCode(roomCode),
          player: playerToResume,
        })
      );
      localStorage.setItem(
        'partyhub_player_session',
        JSON.stringify({
          roomCode: formatRoomCode(roomCode),
          player: playerToResume,
        })
      );
      navigate('/play');
    } else {
      setIsLoading(false);
      setErrorMessage(res.error || 'Gagal menyambung kembali.');
    }
  };

  const handleClearSession = () => {
    sfx.playPop();
    sessionStorage.removeItem('partyhub_player_session');
    localStorage.removeItem('partyhub_player_session');
    setSavedSession(null);
    setSelectedRosterPlayerId(null);
    setName('');
  };

  const isValid = formatRoomCode(roomCode).length === 4 && name.trim().length > 0;

  const handleJoin = async () => {
    if (!isValid || isLoading) return;
    sfx.playPop(750);
    setIsLoading(true);
    setErrorMessage(null);

    const formattedCode = formatRoomCode(roomCode);
    const playerId =
      selectedRosterPlayerId ||
      `player_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    const player: OnlinePlayer = {
      id: playerId,
      name: name.trim(),
      avatarId,
      gender,
      kubu: gender === 'cewek' ? 'Tim Cewek' : 'Tim Cowok',
      score: 0,
      isOnline: true,
      connectedFromHp: true,
      lastActive: Date.now(),
    };

    // Simpan identitas pemain di sessionStorage & localStorage
    const sessionData = JSON.stringify({
      roomCode: formattedCode,
      player,
    });
    sessionStorage.setItem('partyhub_player_session', sessionData);
    localStorage.setItem('partyhub_player_session', sessionData);

    const res = await joinOnlineRoom(formattedCode, player);

    if (res.success) {
      sfx.playSuccess();
      navigate('/play');
    } else {
      sfx.playPop(300);
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
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E1E24] text-[#FAF7F2] text-xs font-black uppercase tracking-wider mb-2">
            <Smartphone className="w-3.5 h-3.5 text-[#FBBF24]" />
            <span>PLAYER MOBILE CONTROLLER</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-[#1E1E24]">
            Masuk Room Pesta
          </h1>
          <p className="text-xs text-[#64616C] font-semibold mt-1">
            Gunakan HP kamu sebagai controller untuk menjawab tebakan &amp; voting rahasia!
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
                <p className="text-xs text-[#B91C1C] mt-1 font-semibold">
                  (Tips: Host dapat mengonfigurasi Firebase Realtime di file .env)
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* 🚀 QUICK RECONNECT CARD (JIKA SUDAH PERNAH TERDAFTAR DI CACHE) */}
        {savedSession && savedSession.roomCode === formatRoomCode(roomCode) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 p-4 rounded-[24px] bg-[#D6F5EC] border-2 border-[#158467] text-[#0F5E49] shadow-xs"
          >
            <div className="flex items-center gap-3">
              <PlayerProfileAvatar
                characterId={savedSession.player.avatarId}
                size={44}
                name={savedSession.player.name}
              />
              <div className="flex-1 min-w-0">
                <span className="text-xs font-black uppercase tracking-wider bg-[#158467] text-white px-2.5 py-0.5 rounded-full inline-block">
                  Sesi Kamu Ditemukan
                </span>
                <h4 className="font-display text-base font-black text-[#1E1E24] truncate mt-0.5">
                  {savedSession.player.name}
                </h4>
                <p className="text-xs font-semibold text-[#158467]">
                  Tersambung ke Room <strong>{savedSession.roomCode}</strong>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-[#158467]/20">
              <button
                type="button"
                onClick={handleResumeSession}
                disabled={isLoading}
                className="flex-1 py-2.5 px-3 min-h-[42px] bg-[#158467] hover:bg-[#0F5E49] text-white text-xs font-extrabold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs active:scale-95"
              >
                <Zap className="w-3.5 h-3.5 text-[#FBBF24]" />
                <span>Lanjut Sebagai {savedSession.player.name}</span>
              </button>
              <button
                type="button"
                onClick={handleClearSession}
                className="py-2.5 px-3 min-h-[42px] bg-white hover:bg-[#FEE2E2] text-[#DC2626] text-xs font-bold rounded-xl transition cursor-pointer border border-[#DC2626]/20 flex items-center gap-1"
                title="Ganti nama atau daftar ulang"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ganti</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Join Form Card */}
        <Card className="p-4 sm:p-5 bg-white shadow-xs rounded-[28px] border-2 border-[#1E1E24]/10 space-y-4">
          {/* Room Code Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#64616C] uppercase tracking-wider">
                Kode Room (4 Huruf di Layar TV):
              </label>
              {onlineRoom && (
                <span className="text-xs font-extrabold text-[#158467] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#158467] animate-pulse" />
                  Room Aktif
                </span>
              )}
            </div>
            <input
              type="text"
              maxLength={4}
              value={roomCode}
              onChange={(e) => {
                const nextCode = formatRoomCode(e.target.value);
                setRoomCode(nextCode);
                setSelectedRosterPlayerId(null);
              }}
              placeholder="Contoh: ASIK"
              className="input-field text-center font-display text-2xl font-black uppercase tracking-widest py-2 rounded-2xl"
            />
          </div>

          {/* 👥 PILIH NAMA DARI DAFTAR ROSTER TV JIKA SUDAH ADA */}
          {rosterSlots.length > 0 && !isCustomNameMode && (
            <div className="pt-2 border-t border-[#1E1E24]/10">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-black text-[#1E1E24] uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#2568EF]" />
                  <span>Pilih Namamu di Layar TV:</span>
                </label>
                <span className="text-xs font-bold text-[#64616C]">
                  {rosterSlots.filter((s) => s.connectedFromHp).length}/{rosterSlots.length} HP Connect
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1 custom-scroll">
                {rosterSlots.map((slot) => {
                  const isSelected = selectedRosterPlayerId === slot.id;
                  const isClaimedByOther =
                    slot.connectedFromHp &&
                    slot.id !== savedSession?.player.id &&
                    !isSelected;

                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={isClaimedByOther}
                      onClick={() => handleSelectRosterSlot(slot)}
                      className={`p-2.5 min-h-[54px] rounded-2xl border-2 text-left transition flex items-center gap-2 cursor-pointer relative ${
                        isSelected
                          ? 'bg-[#D6F5EC] border-[#158467] shadow-xs'
                          : isClaimedByOther
                          ? 'bg-gray-100/80 border-gray-200 opacity-65 cursor-not-allowed'
                          : 'bg-[#FAF7F2] hover:bg-white border-[#1E1E24]/10 hover:border-[#1E1E24]/30'
                      }`}
                    >
                      <PlayerProfileAvatar
                        characterId={slot.avatarId}
                        size={34}
                        name={slot.name}
                        animated={false}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-xs font-black text-[#1E1E24] truncate">
                          {slot.name}
                        </p>
                        <p className="text-xs font-semibold text-[#64616C]">
                          {slot.gender === 'cewek' ? 'Cewek' : 'Cowok'}
                        </p>
                      </div>

                      {isClaimedByOther ? (
                        <span className="text-xs font-bold text-[#475467] bg-gray-200 px-1.5 py-0.5 rounded">
                          HP Lain
                        </span>
                      ) : isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-[#158467] shrink-0" />
                      ) : (
                        <span className="text-xs text-[#158467] font-bold">Pilih</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Toggle ke input manual */}
              <div className="mt-2.5 text-center">
                <button
                  type="button"
                  onClick={() => {
                    sfx.playPop();
                    setIsCustomNameMode(true);
                    setSelectedRosterPlayerId(null);
                    setName('');
                  }}
                  className="text-xs font-bold text-[#2568EF] hover:underline cursor-pointer py-2 px-3 min-h-[40px]"
                >
                  + Nama saya belum ada di TV (Daftar Baru)
                </button>
              </div>
            </div>
          )}

          {/* ✍️ FORM INPUT MANUAL (JIKA DAFTAR BARU ATAU BELUM ADA ROSTER) */}
          {(isCustomNameMode || rosterSlots.length === 0) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-3 pt-2 border-t border-[#1E1E24]/10"
            >
              {rosterSlots.length > 0 && (
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-[#1E1E24]">Daftar Nama Baru:</span>
                  <button
                    type="button"
                    onClick={() => {
                      sfx.playPop();
                      setIsCustomNameMode(false);
                    }}
                    className="text-xs font-bold text-[#475467] hover:text-[#1E1E24] underline cursor-pointer py-1.5 px-2 min-h-[36px]"
                  >
                    Kembali Pilih dari TV
                  </button>
                </div>
              )}

              {/* Name Input */}
              <div>
                <label className="block text-xs font-bold text-[#64616C] uppercase tracking-wider mb-1">
                  Nama Panggilanmu:
                </label>
                <input
                  type="text"
                  maxLength={15}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setSelectedRosterPlayerId(null);
                  }}
                  placeholder="Ketik nama kamu..."
                  className="input-field text-sm font-bold py-2.5 rounded-2xl w-full"
                />
              </div>

              {/* Gender Selector */}
              <div>
                <label className="block text-xs font-bold text-[#64616C] uppercase tracking-wider mb-1">
                  Gender (Untuk Adu Cewek vs Cowok):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      sfx.playPop(700);
                      setGender('cewek');
                    }}
                    className={`py-2.5 px-3 min-h-[44px] rounded-xl font-display text-xs font-bold border-2 transition cursor-pointer ${
                      gender === 'cewek'
                        ? 'bg-[#FCE4F0] border-[#D8317E] text-[#D8317E] shadow-2xs'
                        : 'bg-[#FAF7F2] border-[#1E1E24]/10 text-[#64616C]'
                    }`}
                  >
                    Cewek
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sfx.playPop(700);
                      setGender('cowok');
                    }}
                    className={`py-2.5 px-3 min-h-[44px] rounded-xl font-display text-xs font-bold border-2 transition cursor-pointer ${
                      gender === 'cowok'
                        ? 'bg-[#E0EBFF] border-[#2568EF] text-[#2568EF] shadow-2xs'
                        : 'bg-[#FAF7F2] border-[#1E1E24]/10 text-[#64616C]'
                    }`}
                  >
                    Cowok
                  </button>
                </div>
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-bold text-[#64616C] uppercase tracking-wider mb-1">
                  Avatar Karakter:
                </label>
                <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#FAF7F2] border border-[#1E1E24]/10">
                  <PlayerProfileAvatar characterId={avatarId} size={42} name={name || 'Kamu'} />
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
                      className="text-xs font-extrabold text-[#7C3AED] hover:underline cursor-pointer py-1"
                    >
                      {avatarPickerOpen ? 'Tutup Pilihan Avatar' : 'Ganti Karakter Lain'}
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
                        <PlayerProfileAvatar characterId={c.id} size={30} name={c.name} />
                        <span className="text-xs font-bold text-[#1E1E24] mt-1 truncate w-full text-center">
                          {c.name}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
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
          <span>
            {isLoading
              ? 'Menyambungkan ke TV...'
              : selectedRosterPlayerId
              ? `Masuk Sebagai ${name} & Connect ke TV`
              : 'Masuk ke Room Party'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </Button>
        <p className="text-center text-xs text-[#64616C] font-semibold">
          Layar TV utama di depan akan langsung mendeteksi koneksi HP kamu secara otomatis.
        </p>
      </div>
    </div>
  );
}
