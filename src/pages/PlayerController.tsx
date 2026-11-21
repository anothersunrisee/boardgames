import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  CheckCircle2,
  Trophy,
  LogOut,
  Send,
  RotateCcw,
  AlertCircle,
  Tv,
} from 'lucide-react';
import { PlayerProfileAvatar } from '../components/characters/PlayerProfileAvatar';
import { BlobMascot } from '../components/ui/BlobMascot';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ConfettiShower } from '../components/motion/ConfettiShower';
import {
  listenToRoom,
  submitPlayerAction,
  leaveOnlineRoom,
} from '../services/firebase';
import { sfx } from '../assets-library/soundEngine';
import type { OnlineRoomData, OnlinePlayer } from '../types/multiplayer';

export default function PlayerController() {
  const navigate = useNavigate();

  // Load session from sessionStorage
  const [session] = useState<{
    roomCode: string;
    player: OnlinePlayer;
  } | null>(() => {
    const raw = sessionStorage.getItem('partyhub_player_session');
    return raw ? JSON.parse(raw) : null;
  });

  const [room, setRoom] = useState<OnlineRoomData | null>(null);
  const [g1Input, setG1Input] = useState('');
  const [g1Submitted, setG1Submitted] = useState(false);
  const [g2Input, setG2Input] = useState('');
  const [g2Submitted, setG2Submitted] = useState(false);
  const [g3Input, setG3Input] = useState('');
  const [g3Submitted, setG3Submitted] = useState(false);
  const [votedTeam, setVotedTeam] = useState<'A' | 'B' | null>(null);

  // Double-Confirmation Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    previewText: string;
    warningText?: string;
    confirmLabel: string;
    onConfirm: () => void;
  } | null>(null);

  // Spectator Cheer State (Game 5)
  const [cheerCount, setCheerCount] = useState(0);
  const [activeCheer, setActiveCheer] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      navigate('/join');
      return;
    }

    // Subscribe to realtime room updates
    const unsubscribe = listenToRoom(session.roomCode, (data) => {
      if (data) {
        setRoom(data);
      }
    });

    return () => unsubscribe();
  }, [session, navigate]);

  // Reset inputs when game phase changes
  useEffect(() => {
    setG1Submitted(false);
    setG2Submitted(false);
    setG3Submitted(false);
    setVotedTeam(null);
    setConfirmDialog(null);
  }, [room?.activeGame, room?.gamePhase]);

  if (!session) return null;

  const player = session.player;
  const isOnline = !!room;
  const activeGame = room?.activeGame || null;
  const gameState = room?.gameState || {};

  // Actions
  const handleExitRoom = async () => {
    sfx.playPop();
    await leaveOnlineRoom(session.roomCode, player.id);
    sessionStorage.removeItem('partyhub_player_session');
    navigate('/join');
  };

  // 1. Submit Game 1 dengan Konfirmasi Dialog
  const handleTriggerG1Confirm = () => {
    if (!g1Input.trim() || g1Submitted) return;
    sfx.playPop(700);
    setConfirmDialog({
      isOpen: true,
      title: 'Kunci Jawaban Unik?',
      previewText: g1Input.trim(),
      warningText: 'Jawaban yang sudah dikunci tidak bisa diubah lagi sampai kartu dibuka Host di layar TV!',
      confirmLabel: 'Ya, Kunci Sekarang!',
      onConfirm: async () => {
        sfx.playSuccess();
        setG1Submitted(true);
        setConfirmDialog(null);
        await submitPlayerAction(session.roomCode, {
          id: `act_${Date.now()}`,
          playerId: player.id,
          playerName: player.name,
          type: 'submit_g1_answer',
          payload: { answer: g1Input.trim() },
          timestamp: Date.now(),
        });
      },
    });
  };

  // 2. Submit Game 2 dengan Konfirmasi Dialog
  const handleTriggerG2Confirm = () => {
    if (!g2Input.trim() || g2Submitted) return;
    sfx.playPop(700);
    setConfirmDialog({
      isOpen: true,
      title: 'Kirim Tebakan Skincare?',
      previewText: g2Input.trim(),
      warningText: 'Tebakan ini akan langsung dikirim ke layar TV utama!',
      confirmLabel: 'Ya, Kirim Tebakan!',
      onConfirm: async () => {
        sfx.playSuccess();
        setG2Submitted(true);
        setConfirmDialog(null);
        await submitPlayerAction(session.roomCode, {
          id: `act_${Date.now()}`,
          playerId: player.id,
          playerName: player.name,
          type: 'submit_g2_guess',
          payload: { guess: g2Input.trim() },
          timestamp: Date.now(),
        });
      },
    });
  };

  // 3. Submit Game 3 dengan Konfirmasi Dialog
  const handleTriggerG3Confirm = () => {
    if (!g3Input.trim() || g3Submitted) return;
    sfx.playPop(700);
    setConfirmDialog({
      isOpen: true,
      title: 'Kirim Tebakan Barang Cowok?',
      previewText: g3Input.trim(),
      warningText: 'Tebakan ini akan langsung dikirim ke layar TV utama!',
      confirmLabel: 'Ya, Kirim Tebakan!',
      onConfirm: async () => {
        sfx.playSuccess();
        setG3Submitted(true);
        setConfirmDialog(null);
        await submitPlayerAction(session.roomCode, {
          id: `act_${Date.now()}`,
          playerId: player.id,
          playerName: player.name,
          type: 'submit_g3_guess',
          payload: { guess: g3Input.trim() },
          timestamp: Date.now(),
        });
      },
    });
  };

  // 4. Vote Game 4 & Game 6 dengan Konfirmasi Dialog
  const handleTriggerVoteConfirm = (team: 'A' | 'B') => {
    if (votedTeam) return;
    sfx.playPop(750);
    const teamName = team === 'A' ? 'Tim A (PRO)' : 'Tim B (KONTRA)';
    setConfirmDialog({
      isOpen: true,
      title: 'Konfirmasi Vote Tim',
      previewText: teamName,
      warningText: 'Pilihan voting tidak bisa diulang setelah dikunci ke layar TV!',
      confirmLabel: `Ya, Vote ${team === 'A' ? 'Tim A' : 'Tim B'}`,
      onConfirm: async () => {
        sfx.playPop(850);
        setVotedTeam(team);
        setConfirmDialog(null);
        await submitPlayerAction(session.roomCode, {
          id: `act_${Date.now()}`,
          playerId: player.id,
          playerName: player.name,
          type: activeGame === 'game4' ? 'cast_g4_vote' : 'cast_g6_vote',
          payload: { team },
          timestamp: Date.now(),
        });
      },
    });
  };

  // 5. Game 5 Cheer Clicker (Spectator Hype)
  const handleSendCheer = (emoji: string) => {
    sfx.playPop(800 + Math.random() * 300);
    setCheerCount((c) => c + 1);
    setActiveCheer(emoji);
    setTimeout(() => setActiveCheer(null), 800);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E24] px-4 py-4 flex flex-col justify-between max-w-md mx-auto select-none relative">
      {/* ─── Top Status Bar (Minimalist Navigation) ─────────────────────────── */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-white border-2 border-[#1E1E24]/10 shadow-xs mb-3">
        <div className="flex items-center gap-2.5">
          <PlayerProfileAvatar characterId={player.avatarId} size={38} name={player.name} />
          <div>
            <p className="font-display text-sm font-bold text-[#1E1E24] leading-tight truncate max-w-[120px]">
              {player.name}
            </p>
            <span className="text-[10px] font-extrabold text-[#64616C]">
              Room: <strong className="text-[#1E1E24] tracking-wider">{session.roomCode}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isOnline ? 'bg-[#12B76A] animate-pulse' : 'bg-[#F04438]'
            }`}
          />
          <span className="text-[10px] font-extrabold text-[#64616C]">
            {isOnline ? 'LIVE TV' : 'OFFLINE'}
          </span>
          <button
            type="button"
            onClick={handleExitRoom}
            className="ml-2 p-1.5 rounded-xl text-[#64616C] hover:text-[#DC2626] hover:bg-black/5 transition cursor-pointer"
            title="Keluar dari room"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ─── Dynamic Game Screen Content (Focused in Middle) ─────────────────── */}
      <div className="flex-1 flex flex-col justify-center my-auto py-2">
        {/* =================================================================== */}
        {/* 1. LOBBY STATE (MENUNGGU HOST MEMILIH GAME)                         */}
        {/* =================================================================== */}
        {(!activeGame || room?.status === 'lobby') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6"
          >
            <div className="mb-3 inline-block">
              <BlobMascot shape="circle" mood="happy" color="#FCD34D" size={90} />
            </div>
            <span className="inline-block px-3 py-1 rounded-full bg-[#D6F5EC] text-[#158467] text-[10px] font-black uppercase tracking-wider mb-2">
              TERHUBUNG KE LAYAR TV
            </span>
            <h2 className="font-display text-2xl font-black text-[#1E1E24]">
              Siap Bermain, {player.name}!
            </h2>
            <p className="text-xs text-[#64616C] font-semibold mt-1.5 max-w-xs mx-auto">
              Perhatikan layar TV utama. Saat Host memulai mini-game, controller di HP ini akan aktif otomatis.
            </p>
          </motion.div>
        )}

        {/* =================================================================== */}
        {/* 2. GAME 1: SAME BRAIN? NO! (FOCUSED CENTER FORM)                     */}
        {/* =================================================================== */}
        {activeGame === 'game1' && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="text-center">
              <span className="px-3 py-1 rounded-full bg-[#D6F5EC] text-[#158467] text-[10px] font-black uppercase tracking-wider">
                GAME 01 • SAME BRAIN? NO!
              </span>
              <h2 className="font-display text-lg font-black text-[#1E1E24] mt-2">
                "{gameState.g1Prompt || 'Tulis 1 jawaban unikmu!'}"
              </h2>
            </div>

            {g1Submitted ? (
              <Card className="p-6 text-center bg-[#D6F5EC] border-2 border-[#12B76A] rounded-[28px] shadow-sm">
                <CheckCircle2 className="w-12 h-12 text-[#12B76A] mx-auto mb-2 animate-bounce" />
                <h3 className="font-display text-lg font-black text-[#0F5E49]">Jawabanmu Terkunci!</h3>
                <p className="font-display text-2xl font-black text-[#1E1E24] my-3 bg-white py-3 px-4 rounded-2xl border border-[#158467]/20 shadow-xs">
                  "{g1Input}"
                </p>
                <p className="text-xs text-[#0F5E49] font-bold">
                  👀 Perhatikan layar TV! Host akan segera membuka jawaban semua orang.
                </p>
              </Card>
            ) : (
              <Card className="p-5 sm:p-6 bg-white border-2 border-[#158467]/25 rounded-[30px] shadow-sm space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-black text-[#158467] uppercase tracking-wider">
                      Jawaban Unikmu:
                    </label>
                    <span className="text-[11px] font-bold text-[#64616C]">
                      {g1Input.length}/30
                    </span>
                  </div>
                  <input
                    type="text"
                    maxLength={30}
                    value={g1Input}
                    onChange={(e) => setG1Input(e.target.value)}
                    placeholder="Ketik 1 kata/frasa unik..."
                    className="input-field text-xl font-bold py-3.5 px-4 rounded-2xl w-full text-center border-2 border-[#1E1E24]/20 focus:border-[#158467]"
                    autoFocus
                  />
                  <p className="text-[11px] text-[#64616C] font-semibold mt-1.5 text-center">
                    💡 Jawaban sama dengan orang lain = <strong className="text-[#F04438]">0 Poin</strong>!
                  </p>
                </div>

                {/* Tombol Aksi: Batal/Hapus & Kunci Jawaban */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      sfx.playPop(450);
                      setG1Input('');
                    }}
                    disabled={!g1Input}
                    className="py-3 px-2 rounded-2xl border-2 border-[#1E1E24]/15 bg-white text-xs font-bold text-[#64616C] hover:text-[#F04438] hover:border-[#F04438]/30 transition cursor-pointer flex items-center justify-center gap-1 disabled:opacity-40"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>

                  <div className="col-span-2">
                    <Button
                      variant="emerald"
                      size="lg"
                      fullWidth
                      disabled={!g1Input.trim()}
                      onClick={handleTriggerG1Confirm}
                    >
                      <Lock className="w-4 h-4" />
                      <span>Kunci Jawaban</span>
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </motion.div>
        )}

        {/* =================================================================== */}
        {/* 3. GAME 2: BEAUTY EXPERT                                            */}
        {/* =================================================================== */}
        {activeGame === 'game2' && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="text-center">
              <span className="px-3 py-1 rounded-full bg-[#FCE4F0] text-[#D8317E] text-[10px] font-black uppercase tracking-wider">
                GAME 02 • BEAUTY EXPERT
              </span>
            </div>

            {/* Pemegang Rahasia Cewek */}
            {gameState.activeSlotPlayerId === player.id ? (
              <Card className="p-6 bg-gradient-to-b from-[#D8317E] to-[#BE185D] text-white rounded-[28px] text-center shadow-lg border-2 border-white/20">
                <span className="text-xs font-black uppercase bg-white/20 px-3 py-1 rounded-full">
                  🤫 KARTU RAHASIA PRIBADI
                </span>
                <p className="text-xs mt-3 opacity-90 font-medium">Benda milikmu yang harus ditebak cowok:</p>
                <h2 className="font-display text-2xl font-black my-3 bg-white text-[#D8317E] py-3 px-4 rounded-2xl shadow-md">
                  {gameState.g2SecretHolders?.[player.id] || 'Benda Skincare'}
                </h2>
                <p className="text-xs opacity-90 font-semibold leading-relaxed">
                  ⚠️ Jangan sebutkan nama benda ini! Jawab pertanyaan para cowok dengan jujur.
                </p>
              </Card>
            ) : player.gender === 'cowok' ? (
              /* Cowok Menebak */
              g2Submitted ? (
                <Card className="p-6 text-center bg-[#D6F5EC] border-2 border-[#12B76A] rounded-[28px] shadow-sm">
                  <CheckCircle2 className="w-12 h-12 text-[#12B76A] mx-auto mb-2 animate-bounce" />
                  <h3 className="font-display text-lg font-black text-[#0F5E49]">Tebakan Terkirim!</h3>
                  <p className="font-display text-xl font-black text-[#1E1E24] my-3 bg-white py-2.5 px-4 rounded-2xl border border-[#158467]/20 shadow-xs">
                    "{g2Input}"
                  </p>
                  <p className="text-xs text-[#0F5E49] font-bold">
                    Tebakanmu sudah masuk ke layar TV!
                  </p>
                </Card>
              ) : (
                <Card className="p-5 sm:p-6 bg-white border-2 border-[#D8317E]/25 rounded-[30px] shadow-sm space-y-4">
                  <div>
                    <label className="block text-xs font-black text-[#D8317E] uppercase tracking-wider mb-1.5">
                      Tebak Benda Skincare/Makeup Cewek:
                    </label>
                    <input
                      type="text"
                      maxLength={30}
                      value={g2Input}
                      onChange={(e) => setG2Input(e.target.value)}
                      placeholder="Contoh: Micellar water, Pensil alis..."
                      className="input-field text-lg font-bold py-3.5 px-4 rounded-2xl w-full text-center border-2 border-[#1E1E24]/20 focus:border-[#D8317E]"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setG2Input('')}
                      disabled={!g2Input}
                      className="py-3 px-2 rounded-2xl border-2 border-[#1E1E24]/15 bg-white text-xs font-bold text-[#64616C] hover:text-[#F04438] transition cursor-pointer flex items-center justify-center gap-1 disabled:opacity-40"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                    <div className="col-span-2">
                      <Button
                        variant="berry"
                        size="lg"
                        fullWidth
                        disabled={!g2Input.trim()}
                        onClick={handleTriggerG2Confirm}
                      >
                        <Send className="w-4 h-4" />
                        <span>Kirim Tebakan</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            ) : (
              <Card className="p-6 text-center bg-white rounded-[26px] border border-[#1E1E24]/10 shadow-xs">
                <p className="text-xs text-[#64616C] font-bold">
                  Sesi tebak sedang berlangsung di layar TV. Tunggu giliranmu!
                </p>
              </Card>
            )}
          </motion.div>
        )}

        {/* =================================================================== */}
        {/* 4. GAME 3: BOYS STUFF, GIRLS GUESS                                  */}
        {/* =================================================================== */}
        {activeGame === 'game3' && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="text-center">
              <span className="px-3 py-1 rounded-full bg-[#E0EBFF] text-[#2568EF] text-[10px] font-black uppercase tracking-wider">
                GAME 03 • BOYS STUFF
              </span>
            </div>

            {/* Pemegang Rahasia Cowok */}
            {gameState.activeSlotPlayerId === player.id ? (
              <Card className="p-6 bg-gradient-to-b from-[#2568EF] to-[#1D4ED8] text-white rounded-[28px] text-center shadow-lg border-2 border-white/20">
                <span className="text-xs font-black uppercase bg-white/20 px-3 py-1 rounded-full">
                  🤫 KATA RAHASIA MILIKMU
                </span>
                <p className="text-xs mt-3 opacity-90 font-medium">Kategori: {gameState.activeCategory || 'Umum'}</p>
                <h2 className="font-display text-2xl font-black my-3 bg-white text-[#2568EF] py-3 px-4 rounded-2xl shadow-md">
                  {gameState.g3SecretHolders?.[player.id] || 'Kata Rahasia'}
                </h2>
                <p className="text-xs opacity-90 font-semibold leading-relaxed">
                  ⚠️ Jangan sebutkan kata ini! Jawab pertanyaan para cewek dengan santai.
                </p>
              </Card>
            ) : player.gender === 'cewek' ? (
              /* Cewek Menebak */
              g3Submitted ? (
                <Card className="p-6 text-center bg-[#D6F5EC] border-2 border-[#12B76A] rounded-[28px] shadow-sm">
                  <CheckCircle2 className="w-12 h-12 text-[#12B76A] mx-auto mb-2 animate-bounce" />
                  <h3 className="font-display text-lg font-black text-[#0F5E49]">Tebakan Terkirim!</h3>
                  <p className="font-display text-xl font-black text-[#1E1E24] my-3 bg-white py-2.5 px-4 rounded-2xl border border-[#158467]/20 shadow-xs">
                    "{g3Input}"
                  </p>
                  <p className="text-xs text-[#0F5E49] font-bold">
                    Tebakanmu sudah terkirim ke layar TV!
                  </p>
                </Card>
              ) : (
                <Card className="p-5 sm:p-6 bg-white border-2 border-[#2568EF]/25 rounded-[30px] shadow-sm space-y-4">
                  <div>
                    <label className="block text-xs font-black text-[#2568EF] uppercase tracking-wider mb-1.5">
                      Tebak Kata Rahasia Cowok:
                    </label>
                    <input
                      type="text"
                      maxLength={30}
                      value={g3Input}
                      onChange={(e) => setG3Input(e.target.value)}
                      placeholder="Contoh: Karburator, Offside..."
                      className="input-field text-lg font-bold py-3.5 px-4 rounded-2xl w-full text-center border-2 border-[#1E1E24]/20 focus:border-[#2568EF]"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setG3Input('')}
                      disabled={!g3Input}
                      className="py-3 px-2 rounded-2xl border-2 border-[#1E1E24]/15 bg-white text-xs font-bold text-[#64616C] hover:text-[#F04438] transition cursor-pointer flex items-center justify-center gap-1 disabled:opacity-40"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                    <div className="col-span-2">
                      <Button
                        variant="cobalt"
                        size="lg"
                        fullWidth
                        disabled={!g3Input.trim()}
                        onClick={handleTriggerG3Confirm}
                      >
                        <Send className="w-4 h-4" />
                        <span>Kirim Tebakan</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            ) : (
              <Card className="p-6 text-center bg-white rounded-[26px] border border-[#1E1E24]/10 shadow-xs">
                <p className="text-xs text-[#64616C] font-bold">
                  Sesi tebak sedang berlangsung di layar TV. Tunggu giliranmu!
                </p>
              </Card>
            )}
          </motion.div>
        )}

        {/* =================================================================== */}
        {/* 5. GAME 4: THE DEVIL'S ADVOCATE (VOTING DEBAT DENGAN CONFIRMATION)  */}
        {/* =================================================================== */}
        {activeGame === 'game4' && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="text-center">
              <span className="px-3 py-1 rounded-full bg-[#FFE8DF] text-[#EC5A29] text-[10px] font-black uppercase tracking-wider">
                GAME 04 • DEBAT 2v2
              </span>
              <h2 className="font-display text-base font-bold text-[#1E1E24] mt-2">
                "{gameState.g4Topic || 'Topik Debat Aktif'}"
              </h2>
            </div>

            {/* Voting Buttons untuk Juri / Penonton */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-center text-[#64616C]">
                {votedTeam ? '✅ Suaramu sudah terkunci di TV!' : '🗳️ Vote tim dengan argumen paling meyakinkan:'}
              </p>

              <button
                type="button"
                disabled={!!votedTeam}
                onClick={() => handleTriggerVoteConfirm('A')}
                className={`w-full p-4 rounded-[24px] border-2 font-display text-base font-black transition flex items-center justify-between cursor-pointer ${
                  votedTeam === 'A'
                    ? 'bg-[#158467] text-white border-[#0F5E49] shadow-md'
                    : 'bg-white border-[#158467]/30 text-[#158467] hover:bg-[#D6F5EC]'
                }`}
              >
                <span>🔥 Tim A (PRO)</span>
                {votedTeam === 'A' && <CheckCircle2 className="w-5 h-5 text-white" />}
              </button>

              <button
                type="button"
                disabled={!!votedTeam}
                onClick={() => handleTriggerVoteConfirm('B')}
                className={`w-full p-4 rounded-[24px] border-2 font-display text-base font-black transition flex items-center justify-between cursor-pointer ${
                  votedTeam === 'B'
                    ? 'bg-[#2568EF] text-white border-[#1545A8] shadow-md'
                    : 'bg-white border-[#2568EF]/30 text-[#2568EF] hover:bg-[#E0EBFF]'
                }`}
              >
                <span>❄️ Tim B (KONTRA)</span>
                {votedTeam === 'B' && <CheckCircle2 className="w-5 h-5 text-white" />}
              </button>
            </div>
          </motion.div>
        )}

        {/* =================================================================== */}
        {/* 6. GAME 5: CHAIN QUIZ RELAY (SPECTATOR & HYPE CHEER MODE)           */}
        {/* =================================================================== */}
        {activeGame === 'game5' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4">
            <span className="px-3 py-1 rounded-full bg-[#F3E8FF] text-[#7928CA] text-[10px] font-black uppercase tracking-wider">
              GAME 05 • KUIS BERANTAI 16 SOAL
            </span>

            <Card className="p-6 bg-gradient-to-b from-[#1E1E24] to-[#2D2A3E] text-white rounded-[28px] border-2 border-[#1E1E24] shadow-lg">
              <Tv className="w-12 h-12 text-[#FBBF24] mx-auto mb-2 animate-pulse" />
              <h2 className="font-display text-xl font-black text-white">
                Fokus ke Layar TV Utama!
              </h2>
              <p className="text-xs text-white/80 font-medium mt-1 leading-relaxed">
                Kuis ini dimainkan langsung oleh tim yang maju berkelompok di depan TV. Tidak perlu ketik di HP.
              </p>

              {/* Cheer Hype Buttons */}
              <div className="mt-5 pt-4 border-t border-white/10">
                <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider block mb-2">
                  Beri Semangat Tim Temanmu:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSendCheer('👏')}
                    className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition active:scale-95 flex flex-col items-center gap-1 cursor-pointer"
                  >
                    <span className="text-2xl">👏</span>
                    <span className="text-[10px]">Tepuk Tangan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendCheer('🔥')}
                    className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition active:scale-95 flex flex-col items-center gap-1 cursor-pointer"
                  >
                    <span className="text-2xl">🔥</span>
                    <span className="text-[10px]">Semangat</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendCheer('🎉')}
                    className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition active:scale-95 flex flex-col items-center gap-1 cursor-pointer"
                  >
                    <span className="text-2xl">🎉</span>
                    <span className="text-[10px]">Hore</span>
                  </button>
                </div>
                {cheerCount > 0 && (
                  <p className="text-[11px] font-bold text-[#FBBF24] mt-2">
                    {activeCheer || '✨'} Kamu sudah bersorak {cheerCount} kali!
                  </p>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {/* =================================================================== */}
        {/* 7. GAME 6: SELL ME THIS TRASH (DUEL SALES VOTING)                   */}
        {/* =================================================================== */}
        {activeGame === 'game6' && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="text-center">
              <span className="px-3 py-1 rounded-full bg-[#FEF3C7] text-[#D97706] text-[10px] font-black uppercase tracking-wider">
                GAME 06 • SELL ME THIS TRASH
              </span>
              <h2 className="font-display text-base font-bold text-[#1E1E24] mt-2">
                Vote Sales Pitching Paling Ngakak & Gokil:
              </h2>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                disabled={!!votedTeam}
                onClick={() => handleTriggerVoteConfirm('A')}
                className={`w-full p-4 rounded-[24px] border-2 font-display text-base font-black transition flex items-center justify-between cursor-pointer ${
                  votedTeam === 'A'
                    ? 'bg-[#158467] text-white border-[#0F5E49] shadow-md'
                    : 'bg-white border-[#158467]/30 text-[#158467] hover:bg-[#D6F5EC]'
                }`}
              >
                <span>🛒 Tim Sales A</span>
                {votedTeam === 'A' && <CheckCircle2 className="w-5 h-5 text-white" />}
              </button>

              <button
                type="button"
                disabled={!!votedTeam}
                onClick={() => handleTriggerVoteConfirm('B')}
                className={`w-full p-4 rounded-[24px] border-2 font-display text-base font-black transition flex items-center justify-between cursor-pointer ${
                  votedTeam === 'B'
                    ? 'bg-[#2568EF] text-white border-[#1545A8] shadow-md'
                    : 'bg-white border-[#2568EF]/30 text-[#2568EF] hover:bg-[#E0EBFF]'
                }`}
              >
                <span>🛒 Tim Sales B</span>
                {votedTeam === 'B' && <CheckCircle2 className="w-5 h-5 text-white" />}
              </button>
            </div>
          </motion.div>
        )}

        {/* =================================================================== */}
        {/* 8. PODIUM TOURNAMENT SUMMARY                                        */}
        {/* =================================================================== */}
        {room?.status === 'podium' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
            <ConfettiShower active particleCount={40} />
            <Trophy className="w-14 h-14 text-[#F59E0B] mx-auto mb-2 animate-bounce" />
            <span className="text-[10px] font-black uppercase text-[#F59E0B] tracking-wider">
              TOURNAMENT SELESAI
            </span>
            <h2 className="font-display text-2xl font-bold text-[#1E1E24] mt-1">
              Party Malam Ini Selesai!
            </h2>
            <p className="text-xs text-[#64616C] font-semibold mt-1">
              Lihat foto bareng dan podium juara di layar TV!
            </p>
          </motion.div>
        )}
      </div>

      {/* ─── Bottom Footer ─────────────────────────────────────────────────── */}
      <div className="text-center py-2 border-t border-[#1E1E24]/10">
        <span className="text-[10px] font-bold text-[#64616C]">
          PartyHub Indonesia • Controller Terhubung Realtime 🚀
        </span>
      </div>

      {/* ─── Double Confirmation Dialog Modal ───────────────────────────────── */}
      <AnimatePresence>
        {confirmDialog?.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="bg-white rounded-[28px] border-2 border-[#1E1E24] p-5 sm:p-6 w-full max-w-sm shadow-xl text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-[#D6F5EC] text-[#158467] flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6 stroke-[2.5]" />
              </div>

              <div>
                <h3 className="font-display text-lg font-black text-[#1E1E24]">
                  {confirmDialog.title}
                </h3>
                <div className="my-2.5 p-3 rounded-2xl bg-[#FAF7F2] border border-[#1E1E24]/10">
                  <span className="text-[11px] font-bold text-[#64616C] block uppercase">Pilihanmu:</span>
                  <span className="font-display text-xl font-black text-[#158467]">
                    "{confirmDialog.previewText}"
                  </span>
                </div>
                {confirmDialog.warningText && (
                  <p className="text-xs text-[#64616C] font-medium leading-relaxed">
                    {confirmDialog.warningText}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    sfx.playPop(450);
                    setConfirmDialog(null);
                  }}
                  className="py-3 px-3 rounded-2xl border-2 border-[#1E1E24]/20 text-xs font-bold text-[#64616C] hover:bg-black/5 transition cursor-pointer"
                >
                  Batal Edit
                </button>
                <Button
                  variant="emerald"
                  size="md"
                  onClick={confirmDialog.onConfirm}
                >
                  <span>{confirmDialog.confirmLabel}</span>
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
