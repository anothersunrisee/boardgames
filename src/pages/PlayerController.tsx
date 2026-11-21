import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Lock,
  CheckCircle2,
  Trophy,
  LogOut,
  Send,
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

  const handleSubmitG1 = async () => {
    if (!g1Input.trim() || g1Submitted) return;
    sfx.playSuccess();
    setG1Submitted(true);
    await submitPlayerAction(session.roomCode, {
      id: `act_${Date.now()}`,
      playerId: player.id,
      playerName: player.name,
      type: 'submit_g1_answer',
      payload: { answer: g1Input.trim() },
      timestamp: Date.now(),
    });
  };

  const handleSubmitG2 = async () => {
    if (!g2Input.trim() || g2Submitted) return;
    sfx.playSuccess();
    setG2Submitted(true);
    await submitPlayerAction(session.roomCode, {
      id: `act_${Date.now()}`,
      playerId: player.id,
      playerName: player.name,
      type: 'submit_g2_guess',
      payload: { guess: g2Input.trim() },
      timestamp: Date.now(),
    });
  };

  const handleSubmitG3 = async () => {
    if (!g3Input.trim() || g3Submitted) return;
    sfx.playSuccess();
    setG3Submitted(true);
    await submitPlayerAction(session.roomCode, {
      id: `act_${Date.now()}`,
      playerId: player.id,
      playerName: player.name,
      type: 'submit_g3_guess',
      payload: { guess: g3Input.trim() },
      timestamp: Date.now(),
    });
  };

  const handleCastVote = async (team: 'A' | 'B') => {
    sfx.playPop(750);
    setVotedTeam(team);
    await submitPlayerAction(session.roomCode, {
      id: `act_${Date.now()}`,
      playerId: player.id,
      playerName: player.name,
      type: activeGame === 'game4' ? 'cast_g4_vote' : 'cast_g6_vote',
      payload: { team },
      timestamp: Date.now(),
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E24] px-4 py-4 flex flex-col justify-between max-w-md mx-auto select-none">
      {/* ─── Top Status Bar ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#1E1E24]/10 shadow-2xs mb-4">
        <div className="flex items-center gap-2">
          <PlayerProfileAvatar characterId={player.avatarId} size={36} name={player.name} />
          <div>
            <p className="font-display text-xs font-bold text-[#1E1E24] leading-tight truncate max-w-[110px]">
              {player.name}
            </p>
            <span className="text-[10px] font-extrabold text-[#64616C]">
              Room: <strong className="text-[#1E1E24]">{session.roomCode}</strong>
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
            className="ml-2 p-1.5 rounded-lg text-[#64616C] hover:text-[#DC2626] hover:bg-black/5"
            title="Keluar dari room"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ─── Dynamic Game Screen Content ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center my-auto">
        {/* =================================================================== */}
        {/* 1. LOBBY STATE (MENUNGGU HOST DI TV MEMILIH GAME)                   */}
        {/* =================================================================== */}
        {(!activeGame || room?.status === 'lobby') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6"
          >
            <div className="mb-3 inline-block">
              <BlobMascot shape="circle" mood="happy" color="#FCD34D" size={100} />
            </div>
            <span className="inline-block px-3 py-1 rounded-full bg-[#D6F5EC] text-[#158467] text-[11px] font-black uppercase tracking-wider mb-2">
              TERHUBUNG KE LAYAR TV
            </span>
            <h2 className="font-display text-2xl font-bold text-[#1E1E24]">
              Siap Bermain, {player.name}!
            </h2>
            <p className="text-xs text-[#64616C] font-semibold mt-1.5 max-w-xs mx-auto">
              Perhatikan layar TV utama. Saat Host memulai mini-game, controller di HP ini akan aktif otomatis.
            </p>
          </motion.div>
        )}

        {/* =================================================================== */}
        {/* 2. GAME 1: SAME BRAIN? NO!                                          */}
        {/* =================================================================== */}
        {activeGame === 'game1' && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="text-center">
              <span className="px-3 py-1 rounded-full bg-[#D6F5EC] text-[#158467] text-[10px] font-black uppercase tracking-wider">
                GAME 01 • SAME BRAIN? NO!
              </span>
              <h2 className="font-display text-lg font-bold text-[#1E1E24] mt-2">
                "{gameState.g1Prompt || 'Tulis 1 jawaban unikmu!'}"
              </h2>
            </div>

            {g1Submitted ? (
              <Card className="p-5 text-center bg-[#D6F5EC] border-2 border-[#12B76A] rounded-[24px]">
                <CheckCircle2 className="w-10 h-10 text-[#12B76A] mx-auto mb-2" />
                <h3 className="font-display text-base font-bold text-[#0F5E49]">Jawabanmu Terkunci!</h3>
                <p className="font-display text-lg font-black text-[#1E1E24] my-2 bg-white/70 py-2 rounded-xl">
                  "{g1Input}"
                </p>
                <p className="text-xs text-[#0F5E49] font-semibold">
                  Tunggu aba-aba Host untuk melihat siapa yang kembar di layar TV!
                </p>
              </Card>
            ) : (
              <Card className="p-5 bg-white border-2 border-[#158467]/20 rounded-[28px] space-y-3">
                <label className="block text-xs font-bold text-[#64616C]">
                  Ketik 1 jawaban paling unik (jangan sama dengan orang lain):
                </label>
                <input
                  type="text"
                  maxLength={30}
                  value={g1Input}
                  onChange={(e) => setG1Input(e.target.value)}
                  placeholder="Jawaban unikmu..."
                  className="input-field text-lg font-bold py-3 rounded-2xl"
                  autoFocus
                />
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={!g1Input.trim()}
                  onClick={handleSubmitG1}
                >
                  <Lock className="w-4 h-4" />
                  <span>Kunci Jawaban Unik</span>
                </Button>
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

            {/* Jika pemain ini yang memegang rahasia */}
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
              /* Jika pemain adalah cowok yang menebak */
              g2Submitted ? (
                <Card className="p-5 text-center bg-[#D6F5EC] border-2 border-[#12B76A] rounded-[24px]">
                  <CheckCircle2 className="w-10 h-10 text-[#12B76A] mx-auto mb-2" />
                  <h3 className="font-display text-base font-bold text-[#0F5E49]">Tebakan Terkirim!</h3>
                  <p className="font-display text-lg font-black text-[#1E1E24] my-2 bg-white/70 py-2 rounded-xl">
                    "{g2Input}"
                  </p>
                  <p className="text-xs text-[#0F5E49] font-semibold">
                    Tebakanmu sudah masuk ke layar TV!
                  </p>
                </Card>
              ) : (
                <Card className="p-5 bg-white border-2 border-[#D8317E]/20 rounded-[28px] space-y-3">
                  <label className="block text-xs font-bold text-[#64616C]">
                    Tebak benda skincare/makeup cewek:
                  </label>
                  <input
                    type="text"
                    maxLength={30}
                    value={g2Input}
                    onChange={(e) => setG2Input(e.target.value)}
                    placeholder="Contoh: Micellar water, Pensil alis..."
                    className="input-field text-base font-bold py-3 rounded-2xl"
                  />
                  <Button
                    variant="berry"
                    size="lg"
                    fullWidth
                    disabled={!g2Input.trim()}
                    onClick={handleSubmitG2}
                  >
                    <Send className="w-4 h-4" />
                    <span>Kirim Tebakan Rahasia</span>
                  </Button>
                </Card>
              )
            ) : (
              <Card className="p-5 text-center bg-[#FAF7F2] rounded-[24px] border border-[#1E1E24]/10">
                <p className="text-xs text-[#64616C] font-semibold">
                  Sesi tebak sedang berlangsung di layar TV. Tunggu giliranmu!
                </p>
              </Card>
            )}
          </motion.div>
        )}

        {/* =================================================================== */}
        {/* 3. GAME 3: BOYS STUFF, GIRLS GUESS                                  */}
        {/* =================================================================== */}
        {activeGame === 'game3' && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="text-center">
              <span className="px-3 py-1 rounded-full bg-[#E0EBFF] text-[#2568EF] text-[10px] font-black uppercase tracking-wider">
                GAME 03 • BOYS STUFF
              </span>
            </div>

            {/* Jika pemain ini cowok pemegang rahasia */}
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
              g3Submitted ? (
                <Card className="p-5 text-center bg-[#D6F5EC] border-2 border-[#12B76A] rounded-[24px]">
                  <CheckCircle2 className="w-10 h-10 text-[#12B76A] mx-auto mb-2" />
                  <h3 className="font-display text-base font-bold text-[#0F5E49]">Tebakan Terkirim!</h3>
                  <p className="font-display text-lg font-black text-[#1E1E24] my-2 bg-white/70 py-2 rounded-xl">
                    "{g3Input}"
                  </p>
                  <p className="text-xs text-[#0F5E49] font-semibold">
                    Tebakanmu sudah terkirim ke layar TV!
                  </p>
                </Card>
              ) : (
                <Card className="p-5 bg-white border-2 border-[#2568EF]/20 rounded-[28px] space-y-3">
                  <label className="block text-xs font-bold text-[#64616C]">
                    Tebak kata rahasia cowok:
                  </label>
                  <input
                    type="text"
                    maxLength={30}
                    value={g3Input}
                    onChange={(e) => setG3Input(e.target.value)}
                    placeholder="Contoh: Karburator, Offside..."
                    className="input-field text-base font-bold py-3 rounded-2xl"
                  />
                  <Button
                    variant="cobalt"
                    size="lg"
                    fullWidth
                    disabled={!g3Input.trim()}
                    onClick={handleSubmitG3}
                  >
                    <Send className="w-4 h-4" />
                    <span>Kirim Tebakan Rahasia</span>
                  </Button>
                </Card>
              )
            ) : (
              <Card className="p-5 text-center bg-[#FAF7F2] rounded-[24px] border border-[#1E1E24]/10">
                <p className="text-xs text-[#64616C] font-semibold">
                  Sesi tebak sedang berlangsung di layar TV. Tunggu giliranmu!
                </p>
              </Card>
            )}
          </motion.div>
        )}

        {/* =================================================================== */}
        {/* 4. GAME 4: THE DEVIL'S ADVOCATE (VOTING DEBAT)                      */}
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
            <div className="space-y-2.5">
              <p className="text-xs font-bold text-center text-[#64616C]">
                {votedTeam ? '✅ Suaramu sudah masuk!' : '🗳️ Vote tim yang argumennya paling meyakinkan:'}
              </p>

              <button
                type="button"
                disabled={!!votedTeam}
                onClick={() => handleCastVote('A')}
                className={`w-full p-4 rounded-2xl border-2 font-display text-base font-bold transition flex items-center justify-between ${
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
                onClick={() => handleCastVote('B')}
                className={`w-full p-4 rounded-2xl border-2 font-display text-base font-bold transition flex items-center justify-between ${
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
        {/* 5. PODIUM TOURNAMENT SUMMARY                                        */}
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
    </div>
  );
}
