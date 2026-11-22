import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Trophy,
  RotateCcw,
  Users,
  Crown,
  Home,
  UserPlus,
  Camera,
  Download,
  Sparkles,
  X,
} from 'lucide-react';

const Instagram: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);
import { useGameStore } from '../store/useGameStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { GameMascotBot } from '../components/characters/GameMascotBot';
import { PlayerProfileAvatar } from '../components/characters/PlayerProfileAvatar';
import { ConfettiShower } from '../components/motion/ConfettiShower';
import { HostUtilityBar } from '../components/HostUtilityBar';
import { PunishmentModal } from '../components/PunishmentModal';
import { CHARACTER_PACK, getCharacterById } from '../assets-library/characters';
import { FluentEmoji } from '../components/ui/FluentEmoji';
import { sfx } from '../assets-library/soundEngine';
import { generatePartyWrappedAwards } from '../utils/partyWrapped';
import { generateStoryCardPng } from '../utils/storyCardGenerator';
import { syncHostRoomState } from '../services/firebase';

export default function RoomPodium() {
  const navigate = useNavigate();
  const { roomName, roomCode, roomVibe, players, resetRoomScores } = useGameStore();
  const [showPunishment, setShowPunishment] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showTvBackdrop, setShowTvBackdrop] = useState(false);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [podiumRevealKey, setPodiumRevealKey] = useState(1);

  useEffect(() => {
    sfx.playFanfare();
    if (roomCode) {
      syncHostRoomState(roomCode, {
        status: 'podium',
        activeGame: null,
        gamePhase: 'podium',
      });
    }
  }, [roomCode]);

  const sortedPlayers = useMemo(
    () => [...players].sort((a, b) => b.score - a.score),
    [players]
  );
  const winner = sortedPlayers[0];
  const second = sortedPlayers[1];
  const third = sortedPlayers[2];
  const bottom3 = sortedPlayers.length <= 3 ? sortedPlayers : sortedPlayers.slice(-3);
  const awards = useMemo(() => generatePartyWrappedAwards(players), [players]);

  const handleResetScores = () => {
    sfx.playPop();
    resetRoomScores();
    setShowResetConfirm(false);
  };

  const handleDownloadStory = async () => {
    sfx.playPop(750);
    setIsGeneratingStory(true);
    try {
      const dataUrl = await generateStoryCardPng({
        roomName,
        roomVibe: roomVibe || 'tongkrongan',
        players,
        awards,
      });
      const link = document.createElement('a');
      link.download = `partyhub_${roomName.toLowerCase().replace(/\s+/g, '_')}_story.png`;
      link.href = dataUrl;
      link.click();
      sfx.playSuccess();
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingStory(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E24] px-4 py-8 md:py-12 flex flex-col justify-between relative overflow-hidden">
      {/* 60fps Confetti Shower */}
      <ConfettiShower active />

      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col relative z-20">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            className="text-xs font-bold text-[#64616C] hover:text-[#1E1E24] flex items-center gap-1.5 cursor-pointer py-1 px-3 rounded-full hover:bg-black/5 transition-colors"
            onClick={() => {
              sfx.playPop();
              navigate('/hub');
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Menu Game</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                sfx.playFanfare();
                setPodiumRevealKey((k) => k + 1);
              }}
              className="text-xs font-bold px-3 py-1.5 rounded-full bg-white border border-[#1E1E24]/10 hover:bg-[#FAF7F2] flex items-center gap-1.5 shadow-xs cursor-pointer transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay Podium</span>
            </button>

            <span className="font-display text-xs px-3.5 py-1.5 rounded-full bg-[#F59E0B] text-white font-bold tracking-wide flex items-center gap-1.5 shadow-xs">
              <Trophy className="w-3.5 h-3.5" />
              <span>PODIUM JUARA ROOM</span>
            </span>
          </div>
        </div>

        {/* Room Title */}
        <div className="text-center mb-6">
          <span className="text-xs font-black uppercase tracking-wider text-[#64616C]">
            HASIL AKHIR TOURNAMENT • {roomName}
          </span>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-[#1E1E24] mt-1 flex items-center justify-center gap-2">
            <span>Siapa Juara Party Malam Ini?</span>
            <FluentEmoji name="crown" variant="3d" size={40} />
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-[#64616C] mt-1">
            Skor kumulatif perorangan dari seluruh mini-game yang telah dimainkan
          </p>
        </div>

        {/* Staggered 1-2-3 Podium Pedestals Card */}
        <div
          key={podiumRevealKey}
          className="rounded-[36px] bg-[#1E1E24] text-white p-6 sm:p-8 mb-6 relative overflow-hidden shadow-[0_12px_0_rgba(30,30,36,0.16)]"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBBF24] text-[#1E1E24] text-[11px] font-extrabold uppercase">
              <Crown className="w-3.5 h-3.5" />
              <span>TOP 3 PODIUM JUARA</span>
            </span>
          </div>

          <div className="grid grid-cols-3 items-end gap-2 sm:gap-4 max-w-2xl mx-auto pt-6 pb-2">
            {/* RANK 2 (Left) - reveals 2nd */}
            {second ? (
              (() => {
                const char2 = getCharacterById(second.avatarId || 'c01');
                return (
                  <div className="flex flex-col items-center">
                    <motion.div
                      initial={{ opacity: 0, y: 30, scale: 0.7 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.75, type: 'spring', stiffness: 220, damping: 16 }}
                      className="flex flex-col items-center mb-2 text-center"
                    >
                      <GameMascotBot character={char2} size={78} mood="happy" />
                      <p className="font-display font-bold text-sm sm:text-lg mt-1 leading-tight truncate w-full">
                        {second.name}
                      </p>
                      <span className="text-[10px] text-white/70 font-semibold truncate w-full">
                        {second.kubu}
                      </span>
                      <span className="mt-1 px-2.5 py-0.5 rounded-full bg-white text-[#1E1E24] font-display font-bold text-xs sm:text-sm">
                        {second.score} pts
                      </span>
                    </motion.div>

                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 120 }}
                      transition={{ delay: 0.55, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      className="w-full rounded-t-[24px] bg-[#FAF7F2] text-[#1E1E24] flex flex-col items-center justify-start pt-3.5 shadow-inner overflow-hidden"
                    >
                      <span className="w-9 h-9 rounded-full bg-[#1E1E24] text-white font-display text-lg font-bold flex items-center justify-center">
                        2
                      </span>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider mt-1.5 text-[#64616C]">
                        RUNNER UP
                      </span>
                    </motion.div>
                  </div>
                );
              })()
            ) : <div />}

            {/* RANK 1 (Center) - reveals LAST for dramatic hype */}
            {winner ? (
              (() => {
                const char1 = getCharacterById(winner.avatarId || 'c17');
                return (
                  <div className="flex flex-col items-center">
                    <motion.div
                      initial={{ opacity: 0, y: 40, scale: 0.5 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 1.35, type: 'spring', stiffness: 240, damping: 15 }}
                      className="flex flex-col items-center mb-2 text-center"
                    >
                      <GameMascotBot character={char1} size={98} mood="winner" showCrown />
                      <p className="font-display font-bold text-base sm:text-xl mt-1 text-[#FBBF24] leading-tight truncate w-full flex items-center justify-center gap-1.5">
                        <span>{winner.name}</span>
                        <FluentEmoji name="crown" variant="3d" size={24} />
                      </p>
                      <span className="text-[11px] text-white/75 font-semibold truncate w-full">
                        {winner.kubu}
                      </span>
                      <span className="mt-1 px-3.5 py-0.5 rounded-full bg-[#FBBF24] text-[#1E1E24] font-display font-bold text-xs sm:text-base shadow-md">
                        {winner.score} pts
                      </span>
                    </motion.div>

                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 168 }}
                      transition={{ delay: 1.15, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                      className="w-full rounded-t-[28px] bg-[#FBBF24] text-[#1E1E24] flex flex-col items-center justify-start pt-4 shadow-lg overflow-hidden"
                    >
                      <span className="w-11 h-11 rounded-full bg-[#1E1E24] text-[#FBBF24] font-display text-xl font-bold flex items-center justify-center shadow-md">
                        1
                      </span>
                      <span className="text-xs font-extrabold uppercase tracking-wider mt-1.5">
                        CHAMPION
                      </span>
                      <Trophy className="w-5 h-5 mt-1.5 opacity-60" />
                    </motion.div>
                  </div>
                );
              })()
            ) : <div />}

            {/* RANK 3 (Right) - reveals 1st */}
            {third ? (
              (() => {
                const char3 = getCharacterById(third.avatarId || 'c04');
                return (
                  <div className="flex flex-col items-center">
                    <motion.div
                      initial={{ opacity: 0, y: 24, scale: 0.7 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.25, type: 'spring', stiffness: 220, damping: 16 }}
                      className="flex flex-col items-center mb-2 text-center"
                    >
                      <GameMascotBot character={char3} size={72} mood="idle" />
                      <p className="font-display font-bold text-sm sm:text-lg mt-1 leading-tight truncate w-full">
                        {third.name}
                      </p>
                      <span className="text-[10px] text-white/70 font-semibold truncate w-full">
                        {third.kubu}
                      </span>
                      <span className="mt-1 px-2.5 py-0.5 rounded-full bg-[#FFE8DF] text-[#1E1E24] font-display font-bold text-xs sm:text-sm">
                        {third.score} pts
                      </span>
                    </motion.div>

                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 88 }}
                      transition={{ delay: 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="w-full rounded-t-[24px] bg-[#EC5A29] text-white flex flex-col items-center justify-start pt-3 overflow-hidden"
                    >
                      <span className="w-8 h-8 rounded-full bg-[#1E1E24] text-white font-display text-base font-bold flex items-center justify-center">
                        3
                      </span>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider mt-1 opacity-90">
                        3RD
                      </span>
                    </motion.div>
                  </div>
                );
              })()
            ) : <div />}
          </div>
        </div>

        {/* Viral Loop: Photo Booth, TV Backdrop & Story Download Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <button
            type="button"
            onClick={() => {
              sfx.playFanfare();
              navigate('/photobooth');
            }}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-[#D8317E] to-[#EC5A29] text-white font-display text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition cursor-pointer active:scale-98 border-2 border-[#1E1E24]"
          >
            <Instagram className="w-4 h-4 text-[#FBBF24]" />
            <span>📸 Photo Booth IG Story!</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sfx.playFanfare();
              setShowTvBackdrop(true);
            }}
            className="p-3.5 rounded-2xl bg-[#7C3AED] text-white font-display text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition cursor-pointer active:scale-98"
          >
            <Camera className="w-4 h-4" />
            <span>📺 TV Backdrop</span>
          </button>

          <button
            type="button"
            disabled={isGeneratingStory}
            onClick={handleDownloadStory}
            className="p-3.5 rounded-2xl bg-[#1E1E24] text-[#FBBF24] border-2 border-[#FBBF24]/40 font-display text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:bg-black transition cursor-pointer active:scale-98 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isGeneratingStory ? 'Memproses...' : '📲 Unduh Kartu Podium'}</span>
          </button>
        </div>

        {/* Superlative Awards (Party Wrapped) */}
        {awards.length > 0 && (
          <Card className="mb-6 p-5 bg-white shadow-xs rounded-[28px] border-2 border-[#1E1E24]/10">
            <div className="flex items-center justify-between pb-2 border-b border-[#1E1E24]/10 mb-3">
              <span className="font-display text-sm font-bold text-[#1E1E24] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                <span>Penghargaan Spesial Party (Party Wrapped)</span>
              </span>
              <span className="text-[11px] font-extrabold text-[#9333EA] bg-[#F3E8FF] px-2.5 py-0.5 rounded-full">
                Gelar Kehormatan
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {awards.map((award, i) => (
                <div
                  key={`award-${i}`}
                  className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#1E1E24]/10 flex items-start gap-3"
                >
                  <span className="text-2xl p-1.5 rounded-xl bg-white border border-[#1E1E24]/10 shadow-2xs shrink-0">
                    {award.icon}
                  </span>
                  <div className="min-w-0">
                    <span className="text-[10px] font-black uppercase text-[#9333EA] tracking-wider block">
                      {award.badge}
                    </span>
                    <p className="font-display text-xs font-bold text-[#1E1E24] truncate">
                      {award.playerName} — {award.title}
                    </p>
                    <p className="text-[11px] text-[#64616C] font-semibold mt-0.5 leading-tight">
                      {award.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Full Room Standings Table with Player Avatars */}
        <Card className="mb-6 p-5 bg-white shadow-xs rounded-[28px] border-2 border-[#1E1E24]/10">
          <p className="font-display text-base font-bold text-[#1E1E24] mb-3.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#F59E0B]" />
              <span>Papan Klasemen Seluruh Pemain:</span>
            </span>
            <span className="text-xs font-semibold text-[#64616C]">
              {players.length} Pemain
            </span>
          </p>

          <div className="space-y-2">
            {sortedPlayers.map((player, idx) => {
              const isFirst = idx === 0;
              const isLast = players.length > 1 && idx === sortedPlayers.length - 1;
              const isNegative = player.score < 0;
              const char = getCharacterById(player.avatarId || CHARACTER_PACK[idx % CHARACTER_PACK.length].id);

              return (
                <div
                  key={player.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between transition ${
                    isFirst
                      ? 'bg-[#FEF3C7] border-[#F59E0B]'
                      : isLast
                      ? 'bg-[#FFE8DF] border-[#EC5A29]/60'
                      : 'bg-[#FAF7F2] border-[#1E1E24]/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-display text-sm font-bold w-6 text-center text-[#64616C]">
                      #{idx + 1}
                    </span>
                    <PlayerProfileAvatar
                      character={char}
                      size={36}
                      mood={isFirst ? 'winner' : isLast ? 'shocked' : 'idle'}
                    />
                    <div>
                      <p className="font-display text-sm font-bold text-[#1E1E24] flex flex-wrap items-center gap-1.5">
                        <span>{player.name}</span>
                        {isFirst && <FluentEmoji name="crown" variant="3d" size={16} />}
                        {isLast && (
                          <span className="px-2 py-0.5 rounded-full bg-[#EC5A29] text-white text-[9px] font-black uppercase tracking-wider">
                            👇 WAJIB DI DEPAN FOTO
                          </span>
                        )}
                      </p>
                      <p className="text-[11px] text-[#64616C] font-semibold">
                        {player.gender === 'cewek' ? '👧 Cewek' : '👦 Cowok'} • {player.kubu}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`font-display text-xs font-black px-3 py-1 rounded-full ${
                      isNegative
                        ? 'bg-[#F04438] text-white'
                        : isFirst
                        ? 'bg-[#F59E0B] text-white'
                        : 'bg-white border border-[#1E1E24]/10 text-[#1E1E24]'
                    }`}
                  >
                    {player.score > 0 ? `+${player.score}` : player.score} pts
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* 📸 ZONA HUKUMAN TERAKHIR END-GAME: PHOTO BOOTH + WAJIB IG STORY */}
        {bottom3.length > 0 && players.length > 1 && (
          <div className="mb-6">
            <div className="p-5 rounded-[30px] bg-gradient-to-br from-[#FFE8DF] to-[#FCE4F0] border-[3px] border-[#EC5A29] shadow-[0_6px_0_#EC5A29] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-black uppercase text-white px-3 py-1 rounded-full bg-[#EC5A29] inline-flex items-center gap-1.5 shadow-xs">
                  <FluentEmoji name="fire" variant="3d" size={14} />
                  <span>HUKUMAN TERAKHIR END-GAME • PHOTO BOOTH</span>
                </span>
                <span className="text-[11px] font-black uppercase text-[#D8317E] bg-white px-3 py-1 rounded-full border border-[#D8317E]/30">
                  📸 WAJIB SHARE IG STORY &amp; TAG SEMUA TIM!
                </span>
              </div>

              <div>
                <h3 className="font-display text-xl sm:text-2xl font-black text-[#1E1E24]">
                  Foto Bersama — Yang Kalah Wajib Di Depan! 👇
                </h3>
                <p className="text-xs sm:text-sm text-[#4A4752] font-semibold mt-1">
                  Pemain di posisi terbawah wajib berdiri paling depan saat sesi foto studio 9:16, lalu <strong>WAJIB di-upload ke Instagram Story &amp; tag seluruh anggota tim!</strong>
                </p>
              </div>

              {/* Bottom Players Chips (Ranked Lowest First) */}
              <div className="flex flex-wrap gap-2">
                {[...bottom3].reverse().map((p, idx) => {
                  const rank = sortedPlayers.indexOf(p) + 1;
                  const isAbsoluteLast = idx === 0;
                  return (
                    <div
                      key={p.id}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-2xl border-2 shadow-2xs ${
                        isAbsoluteLast
                          ? 'bg-[#1E1E24] text-white border-[#FBBF24]'
                          : 'bg-white text-[#1E1E24] border-[#EC5A29]/30'
                      }`}
                    >
                      <span
                        className={`font-display font-black text-xs ${
                          isAbsoluteLast ? 'text-[#FBBF24]' : 'text-[#DC2626]'
                        }`}
                      >
                        #{rank}
                      </span>
                      <PlayerProfileAvatar characterId={p.avatarId} size={30} name={p.name} />
                      <div>
                        <p className="font-display font-bold text-xs leading-tight flex items-center gap-1">
                          <span>{p.name}</span>
                          {isAbsoluteLast && (
                            <span className="text-[9px] font-black bg-[#EC5A29] text-white px-1.5 py-0.5 rounded-md">
                              DI DEPAN!
                            </span>
                          )}
                        </p>
                        <span
                          className={`text-[10px] font-bold ${
                            isAbsoluteLast ? 'text-white/75' : 'text-[#64616C]'
                          }`}
                        >
                          {p.score} pts
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Primary CTA: Launch End-Game Photo Booth Studio + Secondary Card Shuffle */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    sfx.playFanfare();
                    navigate('/photobooth');
                  }}
                  className="sm:col-span-8 py-3.5 px-5 rounded-2xl bg-[#D8317E] hover:bg-[#C82373] text-white font-display text-sm sm:text-base font-black border-2 border-[#1E1E24] shadow-[0_4px_0_#1E1E24] active:translate-y-[2px] cursor-pointer transition flex items-center justify-center gap-2"
                >
                  <Instagram className="w-5 h-5 text-[#FBBF24]" />
                  <span>📸 Buka Photo Booth 9:16 (Wajib IG Story!)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPunishment(true)}
                  className="sm:col-span-4 py-3.5 px-4 rounded-2xl bg-white hover:bg-[#FAF7F2] text-[#EC5A29] font-display text-xs sm:text-sm font-bold border-2 border-[#EC5A29] cursor-pointer transition flex items-center justify-center gap-1.5 active:scale-98"
                >
                  <FluentEmoji name="joker" variant="3d" size={18} />
                  <span>Acak Hukuman Ekstra</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 mt-auto">
          <Button
            variant="primary"
            fullWidth
            size="lg"
            onClick={() => setShowResetConfirm(true)}
          >
            <RotateCcw className="w-5 h-5" />
            <span>Mulai Musim Baru (Reset Semua Poin Room)</span>
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="cream"
              fullWidth
              size="md"
              onClick={() => {
                sfx.playPop();
                navigate('/room');
              }}
            >
              <UserPlus className="w-4 h-4" />
              <span>Edit Pemain</span>
            </Button>

            <Button
              variant="cream"
              fullWidth
              size="md"
              onClick={() => {
                sfx.playPop();
                navigate('/hub');
              }}
            >
              <Home className="w-4 h-4" />
              <span>Menu Game</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Interactive 3D Flip Punishment Modal */}
      <PunishmentModal
        open={showPunishment}
        onClose={() => setShowPunishment(false)}
        targetType="bottom3"
        targetPlayers={bottom3}
      />

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-[32px] bg-white p-6 border-3 border-[#1E1E24] shadow-xl text-center">
            <div className="w-12 h-12 rounded-full bg-[#FFE4E2] text-[#F04438] flex items-center justify-center mx-auto mb-3">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl font-bold mb-1">Reset Semua Poin Room?</h3>
            <p className="text-xs text-[#64616C] font-semibold mb-5">
              Poin seluruh pemain akan kembali ke 0. Nama & kubu pemain tetap tersimpan.
            </p>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border-2 border-[#1E1E24]/15 font-bold text-xs text-[#64616C] hover:bg-black/5"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleResetScores}
                className="flex-1 py-2.5 rounded-xl bg-[#F04438] text-white font-bold text-xs shadow-xs hover:bg-[#D92D20]"
              >
                Ya, Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📸 FULL-SCREEN TV BACKDROP FOR GROUP PHOTO */}
      <AnimatePresence>
        {showTvBackdrop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#121217] text-white flex flex-col justify-between p-6 sm:p-12 overflow-hidden"
          >
            {/* Confetti in backdrop */}
            <ConfettiShower active particleCount={80} />

            {/* Top Bar with Close Button */}
            <div className="flex items-center justify-between z-10">
              <span className="font-display text-sm tracking-widest text-[#FBBF24] font-black uppercase">
                PARTYHUB INDONESIA 🇮🇩 • TV PHOTO BACKDROP
              </span>
              <button
                type="button"
                onClick={() => setShowTvBackdrop(false)}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition active:scale-90"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Giant Centerpiece for Room Photo */}
            <div className="text-center my-auto z-10">
              <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FBBF24] via-[#F43F5E] to-[#A855F7] tracking-tight mb-2">
                {roomName}
              </h1>
              <p className="font-display text-lg sm:text-2xl font-bold text-white/90">
                🎉 TOURNAMENT CHAMPIONS 🎉
              </p>

              {/* Big Podium Displays */}
              <div className="grid grid-cols-3 items-end gap-4 max-w-4xl mx-auto mt-8">
                {second && (
                  <div className="flex flex-col items-center">
                    <PlayerProfileAvatar characterId={second.avatarId} size={72} name={second.name} />
                    <p className="font-display text-xl sm:text-2xl font-bold mt-2">{second.name}</p>
                    <span className="text-sm font-bold text-white/70">{second.score} pts</span>
                    <div className="w-full h-32 rounded-t-3xl bg-white/10 border-2 border-white/20 flex flex-col items-center justify-center mt-3">
                      <span className="font-display text-3xl font-black text-white">#2</span>
                    </div>
                  </div>
                )}

                {winner && (
                  <div className="flex flex-col items-center">
                    <FluentEmoji name="crown" variant="3d" size={48} />
                    <PlayerProfileAvatar characterId={winner.avatarId} size={96} name={winner.name} />
                    <p className="font-display text-2xl sm:text-4xl font-black text-[#FBBF24] mt-2">
                      {winner.name}
                    </p>
                    <span className="text-base font-extrabold text-[#FBBF24]">{winner.score} pts</span>
                    <div className="w-full h-44 rounded-t-3xl bg-gradient-to-t from-[#F59E0B] to-[#FBBF24] text-[#1E1E24] flex flex-col items-center justify-center mt-3 shadow-2xl">
                      <span className="font-display text-5xl font-black">#1</span>
                    </div>
                  </div>
                )}

                {third && (
                  <div className="flex flex-col items-center">
                    <PlayerProfileAvatar characterId={third.avatarId} size={64} name={third.name} />
                    <p className="font-display text-lg sm:text-xl font-bold mt-2">{third.name}</p>
                    <span className="text-sm font-bold text-white/70">{third.score} pts</span>
                    <div className="w-full h-24 rounded-t-3xl bg-white/10 border-2 border-white/20 flex flex-col items-center justify-center mt-3">
                      <span className="font-display text-2xl font-black text-white">#3</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Photo Callout */}
            <div className="text-center z-10">
              <p className="font-display text-xs sm:text-sm font-bold text-white/60 tracking-wider">
                Ayo foto bareng di depan layar TV sekarang! 📸✨ (Tekan tombol X untuk kembali)
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <HostUtilityBar />
    </div>
  );
}
