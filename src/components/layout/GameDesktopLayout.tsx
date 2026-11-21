import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Home,
  Volume2,
  VolumeX,
  Trophy,
  BookOpen,
  Crown,
  Shuffle,
  Undo2,
  Flame,
  X,
  Sparkles,
} from 'lucide-react';
import { useGameStore, type Player } from '../../store/useGameStore';
import { PlayerProfileAvatar } from '../characters/PlayerProfileAvatar';
import { FluentEmoji } from '../ui/FluentEmoji';
import { GameOnboardingModal, type GameId } from '../modals/GameOnboardingModal';
import { PUNISHMENT_CARDS } from '../../assets-library/punishments';
import type { PunishmentCardDef } from '../../assets-library/types';
import { sfx } from '../../assets-library/soundEngine';
import { useSessionGuard } from '../../hooks/useSessionGuard';

export interface GameDesktopLayoutProps {
  children: React.ReactNode;
  gameId?: GameId;
  gameTitle?: string;
  badge?: string;
  badgeColor?: string;
  onExit?: () => void;
  onBack?: () => void;
  backLabel?: string;
  sidebarActions?: React.ReactNode;
  activeRoundLabel?: string;
  onUndo?: () => void;
  undoLabel?: string;
  onShuffle?: () => void;
  shuffleLabel?: string;
}

// ============================================================================
// FULL CELEBRATORY PODIUM 1-2-3 & KARTU HUKUMAN MODAL
// ============================================================================
const FullPodiumAndPunishmentModal: React.FC<{
  open: boolean;
  players: Player[];
  gameId?: GameId;
  onClose: () => void;
}> = ({ open, players, gameId, onClose }) => {
  const [activePunishment, setActivePunishment] = useState<PunishmentCardDef>(PUNISHMENT_CARDS[0]);
  const [isShuffling, setIsShuffling] = useState(false);

  const sorted = useMemo(
    () => [...players].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name)),
    [players]
  );

  const isTeamGame = gameId === 'game2' || gameId === 'game3' || gameId === 'game5';

  // Compute team standings for team games
  const teamScores = useMemo(() => {
    const map: Record<string, { name: string; score: number; count: number }> = {};
    players.forEach((p) => {
      const k = p.kubu?.trim() || 'Tim Santai';
      if (!map[k]) map[k] = { name: k, score: 0, count: 0 };
      map[k].score += p.score;
      map[k].count += 1;
    });
    return Object.values(map).sort((a, b) => b.score - a.score);
  }, [players]);

  const losingTeam = teamScores[teamScores.length - 1];
  const losingTeamMembers = losingTeam
    ? players.filter((p) => (p.kubu?.trim() || 'Tim Santai') === losingTeam.name)
    : [];

  // Bottom 3 players for individual games & final standings
  const bottom3Players = useMemo(() => {
    if (sorted.length <= 3) return sorted;
    return sorted.slice(-3);
  }, [sorted]);

  const shuffleCard = () => {
    if (isShuffling) return;
    setIsShuffling(true);
    sfx.playPop(460);
    setTimeout(() => sfx.playPop(560), 120);
    setTimeout(() => sfx.playPop(680), 240);

    setTimeout(() => {
      const pool = PUNISHMENT_CARDS.filter((c) => c.id !== activePunishment.id);
      const next = pool[Math.floor(Math.random() * pool.length)] || PUNISHMENT_CARDS[0];
      setActivePunishment(next);
      setIsShuffling(false);
      sfx.playFanfare();
    }, 450);
  };

  const confettiPieces = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, i) => ({
        id: i,
        left: `${(i * 4.2 + (i % 3) * 2) % 96}%`,
        color: ['#FBBF24', '#158467', '#C82373', '#2568EF', '#E85D2A', '#7C3AED'][i % 6],
        delay: (i % 7) * 0.18,
        dur: 2 + (i % 4) * 0.35,
      })),
    []
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-[#1E1E24]/75 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.92, y: 18 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 18 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl sm:max-w-3xl rounded-[28px] bg-[#FAF7F2] border-[3px] border-[#1E1E24] shadow-[0_10px_0_#1E1E24] overflow-hidden max-h-[92vh] flex flex-col"
          >
            {/* Header */}
            <div className="bg-[#1E1E24] text-[#FAF7F2] px-5 sm:px-6 py-4 flex items-center justify-between border-b-2 border-[#1E1E24]">
              <div className="flex items-center gap-2.5">
                <FluentEmoji name="trophy" variant="3d" size={24} />
                <h3 className="font-display text-lg sm:text-2xl font-bold">
                  Panggung Podium 1-2-3 & Kartu Hukuman
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-6 overflow-y-auto">
              {/* FULL CELEBRATORY PODIUM 1-2-3 */}
              <div className="relative rounded-[24px] bg-[#1E1E24] text-white pt-8 px-4 sm:px-8 pb-0 overflow-hidden border-2 border-[#1E1E24]">
                {/* Confetti Overlay */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {confettiPieces.map((p) => (
                    <motion.div
                      key={p.id}
                      initial={{ y: -12, opacity: 0, rotate: 0 }}
                      animate={{ y: 340, opacity: [0, 1, 1, 0], rotate: 360 }}
                      transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'linear' }}
                      style={{ left: p.left, backgroundColor: p.color }}
                      className="absolute top-0 w-2.5 h-2.5 rounded-xs"
                    />
                  ))}
                </div>

                <div className="relative z-10 grid grid-cols-3 items-end gap-2 sm:gap-4 max-w-xl mx-auto">
                  {/* #2 Runner Up */}
                  {sorted[1] ? (
                    <div className="flex flex-col items-center">
                      <PlayerProfileAvatar characterId={sorted[1].avatarId} size={48} name={sorted[1].name} />
                      <p className="font-display font-bold text-xs sm:text-sm mt-1.5 truncate max-w-full text-center">
                        {sorted[1].name}
                      </p>
                      <span className="text-[11px] text-white/70 font-bold mb-2">
                        {sorted[1].score > 0 ? `+${sorted[1].score}` : sorted[1].score} pt
                      </span>
                      <div className="w-full h-22 sm:h-24 rounded-t-2xl bg-[#FAF7F2] text-[#1E1E24] border-2 border-b-0 border-[#1E1E24] flex flex-col items-center justify-center">
                        <span className="font-display text-xl sm:text-2xl font-black">#2</span>
                        <span className="text-[9px] font-extrabold uppercase text-[#64616C]">Runner Up</span>
                      </div>
                    </div>
                  ) : <div />}

                  {/* #1 Champion */}
                  {sorted[0] ? (
                    <div className="flex flex-col items-center">
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity }}
                        className="mb-1"
                      >
                        <Crown className="w-6 h-6 text-[#FBBF24] fill-[#FBBF24]" />
                      </motion.div>
                      <div className="p-1 rounded-full ring-2 ring-[#FBBF24] shadow-md">
                        <PlayerProfileAvatar characterId={sorted[0].avatarId} size={60} name={sorted[0].name} />
                      </div>
                      <p className="font-display font-bold text-sm sm:text-base text-[#FBBF24] mt-1.5 truncate max-w-full text-center">
                        {sorted[0].name}
                      </p>
                      <span className="text-xs font-black text-white/90 mb-2">
                        {sorted[0].score > 0 ? `+${sorted[0].score}` : sorted[0].score} pt
                      </span>
                      <div className="w-full h-30 sm:h-32 rounded-t-2xl bg-[#FDE68A] text-[#1E1E24] border-2 border-b-0 border-[#1E1E24] flex flex-col items-center justify-center shadow-xs">
                        <span className="font-display text-2xl sm:text-3xl font-black">#1</span>
                        <span className="text-[10px] font-black uppercase text-[#92400E]">Champion</span>
                      </div>
                    </div>
                  ) : <div />}

                  {/* #3 3rd Place */}
                  {sorted[2] ? (
                    <div className="flex flex-col items-center">
                      <PlayerProfileAvatar characterId={sorted[2].avatarId} size={44} name={sorted[2].name} />
                      <p className="font-display font-bold text-xs sm:text-sm mt-1.5 truncate max-w-full text-center">
                        {sorted[2].name}
                      </p>
                      <span className="text-[11px] text-white/70 font-bold mb-2">
                        {sorted[2].score > 0 ? `+${sorted[2].score}` : sorted[2].score} pt
                      </span>
                      <div className="w-full h-18 sm:h-20 rounded-t-2xl bg-[#FED7AA] text-[#1E1E24] border-2 border-b-0 border-[#1E1E24] flex flex-col items-center justify-center">
                        <span className="font-display text-lg sm:text-xl font-black">#3</span>
                        <span className="text-[9px] font-extrabold uppercase text-[#9A3412]">3rd Place</span>
                      </div>
                    </div>
                  ) : <div />}
                </div>
              </div>

              {/* PUNISHMENT CARD SECTION (1 Tim Kalah untuk game tim, 3 Terbawah untuk game individu & skor akhir) */}
              <div className="rounded-[24px] bg-white border-2 border-[#1E1E24] shadow-[0_4px_0_rgba(30,30,36,0.1)] p-4 sm:p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEE2E2] text-[#B42318] text-[11px] font-black uppercase">
                      <Flame className="w-3.5 h-3.5 text-[#DC2626]" />
                      {isTeamGame ? (
                        <span>Target Hukuman: 1 Tim Kalah ({losingTeam?.name || 'Tim Kalah'})</span>
                      ) : (
                        <span>Target Hukuman: 3 Pemain Terbawah ({bottom3Players.length} Orang)</span>
                      )}
                    </span>
                    <h4 className="font-display text-lg sm:text-xl font-bold text-[#1E1E24] mt-1">
                      Acak Kartu Hukuman Game Berikutnya
                    </h4>
                  </div>

                  <button
                    type="button"
                    onClick={shuffleCard}
                    disabled={isShuffling}
                    className="px-4 py-2 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-white font-display font-bold text-xs sm:text-sm border-2 border-[#1E1E24] shadow-[0_3px_0_#1E1E24] active:translate-y-[2px] transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Shuffle className={`w-4 h-4 ${isShuffling ? 'animate-spin' : ''}`} />
                    <span>{isShuffling ? 'Mengocok...' : 'Acak Kartu Hukuman'}</span>
                  </button>
                </div>

                {/* Chips of Target Players */}
                {isTeamGame ? (
                  <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#1E1E24]/10 space-y-1.5">
                    <p className="text-[11px] font-bold text-[#64616C]">
                      Seluruh {losingTeamMembers.length} anggota <strong>{losingTeam?.name}</strong> wajib menjalani hukuman:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {losingTeamMembers.map((p) => (
                        <div
                          key={p.id}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-[#1E1E24]/15 shadow-2xs"
                        >
                          <PlayerProfileAvatar characterId={p.avatarId} size={22} name={p.name} />
                          <span className="font-display font-bold text-xs text-[#1E1E24]">{p.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#1E1E24]/10 space-y-1.5">
                    <p className="text-[11px] font-bold text-[#64616C]">
                      3 pemain di posisi klasemen terbawah wajib menjalani kartu hukuman:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {bottom3Players.map((p) => {
                        const rank = sorted.indexOf(p) + 1;
                        return (
                          <div
                            key={p.id}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#FEE2E2] border border-[#DC2626]/20 shadow-2xs"
                          >
                            <span className="font-display font-black text-[10px] text-[#DC2626]">#{rank}</span>
                            <PlayerProfileAvatar characterId={p.avatarId} size={22} name={p.name} />
                            <span className="font-display font-bold text-xs text-[#1E1E24]">{p.name}</span>
                            <span className="text-[10px] font-extrabold text-[#64616C]">({p.score} pt)</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Animated Active Punishment Card */}
                <motion.div
                  key={activePunishment.id}
                  initial={{ opacity: 0, rotateX: -20, scale: 0.96 }}
                  animate={{ opacity: 1, rotateX: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                  style={{ backgroundColor: activePunishment.color }}
                  className="rounded-2xl p-4 sm:p-5 text-white border-2 border-[#1E1E24] shadow-[0_4px_0_#1E1E24]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-3 py-0.5 rounded-full bg-[#1E1E24] text-[#FBBF24] text-[10px] font-black uppercase tracking-wider">
                      Level: {activePunishment.intensity}
                    </span>
                    <span className="text-xs font-bold text-white/85">
                      Durasi: {activePunishment.duration}
                    </span>
                  </div>
                  <h5 className="font-display text-xl sm:text-2xl font-bold mb-2">
                    {activePunishment.title}
                  </h5>
                  <p className="text-sm sm:text-base font-semibold bg-black/20 rounded-xl p-3 sm:p-3.5 border border-white/15 leading-relaxed">
                    “{activePunishment.text}”
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// MAIN UNIFIED <GameDesktopLayout />
// ============================================================================
export const GameDesktopLayout: React.FC<GameDesktopLayoutProps> = ({
  children,
  gameId,
  gameTitle,
  badge,
  badgeColor = '#7C3AED',
  onExit,
  onBack,
  backLabel = 'Kembali',
  sidebarActions,
  activeRoundLabel,
  onUndo,
  undoLabel = 'Undo (Batal)',
  onShuffle,
  shuffleLabel = 'Ganti Soal',
}) => {
  const navigate = useNavigate();
  useSessionGuard(true);
  const { players } = useGameStore();
  const [muted, setMuted] = useState(sfx.muted);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showPodiumModal, setShowPodiumModal] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'individu' | 'kubu'>('individu');

  const sortedPlayers = useMemo(
    () => [...players].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name)),
    [players]
  );

  const top1 = sortedPlayers[0];
  const top2 = sortedPlayers[1];
  const top3 = sortedPlayers[2];

  // Team / Kubu aggregate score
  const teamScores = useMemo(() => {
    const map: Record<string, { name: string; score: number; count: number }> = {};
    players.forEach((p) => {
      const k = p.kubu?.trim() || 'Tim Santai';
      if (!map[k]) {
        map[k] = { name: k, score: 0, count: 0 };
      }
      map[k].score += p.score;
      map[k].count += 1;
    });
    return Object.values(map).sort((a, b) => b.score - a.score);
  }, [players]);

  const toggleMute = () => {
    sfx.muted = !muted;
    setMuted(sfx.muted);
    if (!sfx.muted) sfx.playPop();
  };

  const handleBack = () => {
    sfx.playPop();
    if (onBack) {
      onBack();
    } else if (onExit) {
      onExit();
    } else {
      navigate(-1);
    }
  };

  const handleBackToMenu = () => {
    sfx.playPop();
    navigate('/hub');
  };

  // Helper for Stepped Mini Podium Slot
  const renderMiniPodiumSlot = (
    player: Player | undefined,
    rank: number,
    heightClass: string,
    bgClass: string
  ) => {
    if (!player) return <div className="flex-1" />;

    return (
      <div className="flex-1 flex flex-col items-center">
        {/* Floating Crown for #1 */}
        {rank === 1 && (
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="mb-1"
          >
            <Crown className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
          </motion.div>
        )}

        <div
          className={`rounded-full p-0.5 ${
            rank === 1 ? 'ring-2 ring-[#FBBF24] shadow-xs' : 'ring-1 ring-[#1E1E24]/15'
          }`}
        >
          <PlayerProfileAvatar characterId={player.avatarId} size={rank === 1 ? 38 : 30} name={player.name} />
        </div>

        <p className="font-display font-bold text-[11px] text-[#1E1E24] truncate max-w-[80px] mt-1 text-center">
          {player.name}
        </p>

        {/* Stepped Tactile Bar */}
        <div
          className={`w-full ${heightClass} ${bgClass} rounded-t-xl border-2 border-b-0 border-[#1E1E24] flex flex-col items-center justify-center px-1 text-center shadow-xs mt-1`}
        >
          <span className="font-display font-black text-xs leading-none text-[#1E1E24]">
            #{rank}
          </span>
          <span className="font-display font-extrabold text-[10px] text-[#1E1E24]/80 mt-0.5">
            {player.score > 0 ? `+${player.score}` : player.score}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E24] px-3 sm:px-6 py-4 md:py-6 flex flex-col justify-between">
      <div className="max-w-[1440px] mx-auto w-full flex-1 flex flex-col space-y-6">

        {/* ========================================================================= */}
        {/* UNIFIED TOP NAVIGATION HEADER BAR ACROSS ALL DEVICES                      */}
        {/* ========================================================================= */}
        <header className="rounded-[24px] bg-white border-2 border-[#1E1E24] shadow-[0_4px_0_#1E1E24] px-3 sm:px-5 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* LEFT: Contextual Back & Menu Utama */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBack}
              className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F2ECE1] border-2 border-[#1E1E24] shadow-[0_3px_0_#1E1E24] font-display font-bold text-xs flex items-center gap-1.5 cursor-pointer active:translate-y-[2px] transition text-[#1E1E24]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{backLabel}</span>
            </button>

            <button
              type="button"
              onClick={handleBackToMenu}
              className="px-3 py-1.5 rounded-xl bg-[#1E1E24] text-white hover:bg-[#2C2C35] border-2 border-[#1E1E24] shadow-[0_3px_0_#1E1E24] font-display font-bold text-xs flex items-center gap-1.5 cursor-pointer active:translate-y-[2px] transition"
            >
              <Home className="w-3.5 h-3.5 text-[#FBBF24]" />
              <span className="hidden sm:inline">Menu Utama</span>
            </button>

            {/* UNDO BUTTON (Jika Tersedia) */}
            {onUndo && (
              <button
                type="button"
                onClick={() => {
                  sfx.playPop();
                  onUndo();
                }}
                className="px-3 py-1.5 rounded-xl bg-[#FEE2E2] hover:bg-[#FECACA] border-2 border-[#DC2626]/40 text-[#DC2626] shadow-[0_3px_0_#DC2626] font-display font-bold text-xs flex items-center gap-1.5 cursor-pointer active:translate-y-[2px] transition"
                title="Batalkan aksi / hasil sebelumnya (Undo)"
              >
                <Undo2 className="w-3.5 h-3.5 text-[#DC2626]" />
                <span className="hidden sm:inline">{undoLabel}</span>
              </button>
            )}

            {/* SHUFFLE BUTTON (Jika Tersedia) */}
            {onShuffle && (
              <button
                type="button"
                onClick={() => {
                  sfx.playPop();
                  onShuffle();
                }}
                className="px-3 py-1.5 rounded-xl bg-[#EDE9FE] hover:bg-[#DDD6FE] border-2 border-[#7C3AED]/40 text-[#7C3AED] shadow-[0_3px_0_#7C3AED] font-display font-bold text-xs flex items-center gap-1.5 cursor-pointer active:translate-y-[2px] transition"
                title="Ganti / acak pertanyaan atau topik baru"
              >
                <Shuffle className="w-3.5 h-3.5 text-[#7C3AED]" />
                <span className="hidden sm:inline">{shuffleLabel}</span>
              </button>
            )}
          </div>

          {/* CENTER: Game Identity Badge + Stage/Round Pill */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              style={{ backgroundColor: badgeColor }}
              className="px-3.5 py-1.5 rounded-full text-white font-display font-bold text-xs sm:text-sm border-2 border-[#1E1E24] shadow-[0_2px_0_#1E1E24]"
            >
              {badge || gameTitle || 'Party Game'}
            </span>
            {activeRoundLabel && (
              <span className="px-3 py-1.5 rounded-full bg-[#FAF7F2] border-2 border-[#1E1E24]/20 font-display font-bold text-xs text-[#1E1E24] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#F59E0B]" />
                <span>{activeRoundLabel}</span>
              </span>
            )}
          </div>

          {/* RIGHT: Cara Main + Podium Modal + Sound Toggle */}
          <div className="flex items-center gap-2">
            {gameId && (
              <button
                type="button"
                onClick={() => {
                  sfx.playPop();
                  setShowOnboarding(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F2ECE1] border-2 border-[#1E1E24] shadow-[0_3px_0_#1E1E24] font-display font-bold text-xs flex items-center gap-1.5 cursor-pointer active:translate-y-[2px] transition text-[#2568EF]"
                title="Buka panduan cara main & hukuman"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cara Main</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                sfx.playPop();
                setShowPodiumModal(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-[#FDE68A] hover:bg-[#FCD34D] text-[#1E1E24] border-2 border-[#1E1E24] shadow-[0_3px_0_#1E1E24] font-display font-bold text-xs flex items-center gap-1.5 cursor-pointer active:translate-y-[2px] transition"
              title="Buka Panggung Juara 1-2-3"
            >
              <Trophy className="w-3.5 h-3.5 text-[#D97706]" />
              <span className="hidden sm:inline">Podium</span>
            </button>

            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? 'Nyalakan suara' : 'Matikan suara'}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#FAF7F2] hover:bg-[#F2ECE1] border-2 border-[#1E1E24] shadow-[0_3px_0_#1E1E24] flex items-center justify-center cursor-pointer active:translate-y-[2px] transition"
            >
              {muted ? (
                <VolumeX className="w-4 h-4 text-[#F04438]" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#158467]" />
              )}
            </button>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* 2-COLUMN RESPONSIVE WORKSPACE (Main Game Stage + LiveScoreSidebar)        */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_380px] gap-6 items-start">
          
          {/* Main Game Stage */}
          <main className="min-w-0 space-y-5 flex-1">
            {children}
          </main>

          {/* Right Live Score Sidebar */}
          <aside className="w-full lg:w-[360px] xl:w-[380px] lg:sticky lg:top-6 shrink-0 space-y-4">
            <div className="rounded-[24px] bg-white border-2 border-[#1E1E24] shadow-[0_5px_0_#1E1E24] overflow-hidden flex flex-col">
              
              {/* Header */}
              <div className="px-5 pt-4 pb-3 border-b-2 border-[#1E1E24]/10 flex items-center justify-between gap-2 bg-[#FAF7F2]">
                <div className="flex items-center gap-2">
                  <FluentEmoji name="trophy" variant="3d" size={20} />
                  <h3 className="font-display font-bold text-xs uppercase tracking-wide text-[#1E1E24]">
                    Live Podium & Skor
                  </h3>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E6F7F1] border border-[#158467]/30 text-[10px] font-extrabold text-[#158467]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#158467] animate-pulse" />
                  Realtime
                </span>
              </div>

              {/* MINI LIVE STEPPED PODIUM 1-2-3 (#2 Left — #1 Center — #3 Right) */}
              <div className="px-4 pt-4 pb-0 bg-[#FAF7F2]/60 border-b-2 border-[#1E1E24]">
                <div className="flex items-end gap-2 justify-center">
                  {renderMiniPodiumSlot(top2, 2, 'h-[52px]', 'bg-[#F2ECE1]')}
                  {renderMiniPodiumSlot(top1, 1, 'h-[72px]', 'bg-[#FDE68A]')}
                  {renderMiniPodiumSlot(top3, 3, 'h-[42px]', 'bg-[#FED7AA]')}
                </div>
              </div>

              {/* Tabs: Individu | Skor Kubu */}
              <div className="px-4 pt-3.5 pb-2">
                <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-[#F2ECE1] border border-[#1E1E24]/10">
                  <button
                    type="button"
                    onClick={() => {
                      sfx.playPop(580);
                      setSidebarTab('individu');
                    }}
                    className={`py-1.5 rounded-lg font-display font-bold text-xs transition cursor-pointer ${
                      sidebarTab === 'individu'
                        ? 'bg-[#1E1E24] text-[#FAF7F2] shadow-xs'
                        : 'text-[#64616C] hover:text-[#1E1E24]'
                    }`}
                  >
                    Individu ({players.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sfx.playPop(580);
                      setSidebarTab('kubu');
                    }}
                    className={`py-1.5 rounded-lg font-display font-bold text-xs transition cursor-pointer ${
                      sidebarTab === 'kubu'
                        ? 'bg-[#1E1E24] text-[#FAF7F2] shadow-xs'
                        : 'text-[#64616C] hover:text-[#1E1E24]'
                    }`}
                  >
                    Skor Kubu ({teamScores.length})
                  </button>
                </div>
              </div>

              {/* Scrollable Ranking Rows */}
              <div className="px-4 py-2 space-y-2 max-h-[320px] overflow-y-auto custom-scroll">
                {sidebarTab === 'individu' ? (
                  sortedPlayers.map((player, idx) => {
                    const rank = idx + 1;
                    const isTop1 = rank === 1;
                    const isTop2 = rank === 2;
                    const isTop3 = rank === 3;

                    return (
                      <div
                        key={player.id}
                        className={`flex items-center justify-between px-3 py-2 rounded-2xl border-2 transition ${
                          isTop1
                            ? 'bg-[#FFFBEB] border-[#FBBF24] shadow-xs'
                            : isTop2
                            ? 'bg-[#FAF7F2] border-[#1E1E24]/20'
                            : isTop3
                            ? 'bg-[#FFF7ED] border-[#FB923C]/50'
                            : 'bg-white border-[#1E1E24]/10'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="font-display font-bold text-xs w-5 text-center shrink-0 text-[#64616C]">
                            {isTop1 ? '👑' : `#${rank}`}
                          </span>
                          <PlayerProfileAvatar characterId={player.avatarId} size={30} name={player.name} />
                          <div className="min-w-0 truncate">
                            <p className="font-display font-bold text-xs text-[#1E1E24] truncate leading-tight">
                              {player.name}
                            </p>
                            <span className="text-[10px] text-[#64616C] font-semibold block truncate">
                              {player.kubu}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`font-display text-xs font-black px-2.5 py-0.5 rounded-full shrink-0 border ${
                            isTop1
                              ? 'bg-[#FBBF24] text-[#1E1E24] border-[#1E1E24]'
                              : player.score < 0
                              ? 'bg-[#FEE2E2] text-[#DC2626] border-[#F87171]'
                              : 'bg-[#FAF7F2] text-[#1E1E24] border-[#1E1E24]/15'
                          }`}
                        >
                          {player.score > 0 ? `+${player.score}` : player.score} pt
                        </span>
                      </div>
                    );
                  })
                ) : (
                  teamScores.map((t, idx) => (
                    <div
                      key={t.name}
                      className={`p-3 rounded-2xl border-2 flex items-center justify-between ${
                        idx === 0
                          ? 'bg-[#FFFBEB] border-[#FBBF24] shadow-xs'
                          : 'bg-[#FAF7F2] border-[#1E1E24]/15'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-7 h-7 rounded-xl bg-[#1E1E24] text-[#FBBF24] font-display font-bold text-xs flex items-center justify-center shrink-0">
                          #{idx + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="font-display font-bold text-xs text-[#1E1E24] truncate">
                            {t.name}
                          </p>
                          <p className="text-[10px] font-semibold text-[#64616C]">
                            {t.count} Anggota
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-white border-2 border-[#1E1E24] font-display font-bold text-xs shrink-0">
                        {t.score > 0 ? `+${t.score}` : t.score} pt
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Sidebar Action Deck (Custom actions or Full Podium) */}
              {sidebarActions && (
                <div className="px-4 py-2 border-t-2 border-[#1E1E24]/10 bg-[#FAF7F2]/50">
                  {sidebarActions}
                </div>
              )}

              {/* Sidebar Footer Action */}
              <div className="p-4 border-t-2 border-[#1E1E24]/10 bg-[#FAF7F2]">
                <button
                  type="button"
                  onClick={() => {
                    sfx.playPop();
                    setShowPodiumModal(true);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#FDE68A] hover:bg-[#FCD34D] text-[#1E1E24] border-2 border-[#1E1E24] shadow-[0_3px_0_#1E1E24] font-display font-bold text-xs flex items-center justify-center gap-2 active:translate-y-[2px] transition cursor-pointer"
                >
                  <Trophy className="w-4 h-4 text-[#D97706]" />
                  <span>Panggung Podium & Hukuman 🏆</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Game Onboarding Rules & Punishment Modal */}
      {gameId && (
        <GameOnboardingModal
          open={showOnboarding}
          gameId={gameId}
          onClose={() => setShowOnboarding(false)}
          onStartGame={() => setShowOnboarding(false)}
        />
      )}

      {/* Full Celebratory Podium & Punishment Shuffle Modal */}
      <FullPodiumAndPunishmentModal
        open={showPodiumModal}
        players={players}
        gameId={gameId}
        onClose={() => setShowPodiumModal(false)}
      />
    </div>
  );
};
