import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Trophy,
  Flame,
  X,
  Play,
  Shuffle,
  Users,
  Timer,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { GameMascotBot } from '../characters/GameMascotBot';
import { CHARACTER_PACK, getCharacterById } from '../../assets-library/characters';
import { PUNISHMENT_CARDS } from '../../assets-library/punishments';
import type { PunishmentCardDef } from '../../assets-library/types';
import { FluentEmoji } from '../ui/FluentEmoji';
import { sfx } from '../../assets-library/soundEngine';
import { GAME_ONBOARDING_DATA } from '../../assets-library/gameOnboardingData';

export type GameId = 'game1' | 'game2' | 'game3' | 'game4' | 'game5' | 'game6';

interface GameOnboardingModalProps {
  open: boolean;
  gameId: GameId | null;
  onClose: () => void;
  onStartGame: (gameId: GameId) => void;
}

export const GameOnboardingModal: React.FC<GameOnboardingModalProps> = ({
  open,
  gameId,
  onClose,
  onStartGame,
}) => {
  const [activeTab, setActiveTab] = useState<'cara-main' | 'skor' | 'hukuman'>('cara-main');
  const [previewPunishment, setPreviewPunishment] = useState<PunishmentCardDef>(PUNISHMENT_CARDS[0]);
  const [isShufflingPunishment, setIsShufflingPunishment] = useState(false);

  const detail = gameId ? GAME_ONBOARDING_DATA[gameId] : null;

  useEffect(() => {
    if (open && detail) {
      setActiveTab('cara-main');
      const rec = detail.recommendedPunishments[0];
      const match = PUNISHMENT_CARDS.find((p) => p.id === rec) || PUNISHMENT_CARDS[0];
      setPreviewPunishment(match);
    }
  }, [open, detail]);

  const handleShufflePreview = () => {
    if (isShufflingPunishment || !detail) return;
    setIsShufflingPunishment(true);
    sfx.playPop(480);

    setTimeout(() => {
      const otherCards = PUNISHMENT_CARDS.filter((c) => c.id !== previewPunishment.id);
      const picked = otherCards[Math.floor(Math.random() * otherCards.length)] || PUNISHMENT_CARDS[0];
      setPreviewPunishment(picked);
      setIsShufflingPunishment(false);
      sfx.playFanfare();
    }, 450);
  };

  const handleStart = () => {
    if (!gameId) return;
    sfx.playSuccess();
    onStartGame(gameId);
  };

  if (!open || !detail) return null;

  const char = getCharacterById(detail.characterId) || CHARACTER_PACK[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 24, stiffness: 280 }}
          className="w-full max-w-lg md:max-w-3xl bg-[#FAF7F2] rounded-[36px] border-[3px] border-[#1E1E24] p-5 sm:p-7 text-[#1E1E24] shadow-[0_16px_40px_rgba(30,30,36,0.22)] relative max-h-[92vh] flex flex-col justify-between overflow-hidden"
        >
          {/* Top Decorative Floating Accents */}
          <div
            style={{ backgroundColor: detail.themeColor }}
            className="absolute -top-12 -right-12 w-36 h-36 rounded-full opacity-15 blur-2xl pointer-events-none"
          />

          {/* Close Button */}
          <button
            type="button"
            onClick={() => {
              sfx.playPop(420);
              onClose();
            }}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center cursor-pointer text-[#1E1E24] transition z-20"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* ========================================================================= */}
          {/* HEADER: Mascot + Badges + Game Title                                      */}
          {/* ========================================================================= */}
          <div className="flex items-start gap-4 mb-4 pr-8">
            {/* Animated Game Mascot */}
            <div className="shrink-0 p-1 rounded-2xl bg-white border-2 border-[#1E1E24]/10 shadow-xs">
              <GameMascotBot character={char} mood="happy" size={56} />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span
                  style={{ backgroundColor: detail.themeColor }}
                  className="px-2.5 py-0.5 rounded-full text-white text-xs font-black uppercase tracking-wider"
                >
                  {detail.numberBadge}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#1E1E24]/8 text-[#475467] text-xs font-extrabold uppercase">
                  {detail.categoryPill}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                  {detail.difficulty}
                </span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1E1E24] leading-tight truncate">
                {detail.title}
              </h2>

              <p className="text-xs text-[#64616C] font-semibold mt-0.5 line-clamp-2">
                {detail.tagline}
              </p>
            </div>
          </div>

          {/* Quick Meta Pills (Player Role & Duration) */}
          <div className="flex flex-wrap items-center gap-2 mb-4 p-2.5 rounded-2xl bg-white border border-[#1E1E24]/10 text-xs font-bold text-[#1E1E24]">
            <div className="flex items-center gap-1.5 text-[#158467]">
              <Users className="w-3.5 h-3.5" />
              <span>{detail.targetPlayers}</span>
            </div>
            <span className="text-[#1E1E24]/20">•</span>
            <div className="flex items-center gap-1.5 text-[#2568EF]">
              <Timer className="w-3.5 h-3.5" />
              <span>{detail.duration}</span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 3-TAB SEGMENTED NAVIGATION                                                */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-[#EBE7DF] border border-[#1E1E24]/10 mb-4">
            <button
              type="button"
              onClick={() => {
                sfx.playPop();
                setActiveTab('cara-main');
              }}
              className={`py-2 px-3 rounded-xl font-display text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'cara-main'
                  ? 'bg-white text-[#1E1E24] shadow-xs scale-[1.02]'
                  : 'text-[#64616C] hover:text-[#1E1E24]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#2568EF]" />
              <span>Cara Main</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sfx.playPop();
                setActiveTab('skor');
              }}
              className={`py-2 px-3 rounded-xl font-display text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'skor'
                  ? 'bg-white text-[#1E1E24] shadow-xs scale-[1.02]'
                  : 'text-[#64616C] hover:text-[#1E1E24]'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Sistem Skor</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sfx.playPop();
                setActiveTab('hukuman');
              }}
              className={`py-2 px-3 rounded-xl font-display text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'hukuman'
                  ? 'bg-white text-[#1E1E24] shadow-xs scale-[1.02]'
                  : 'text-[#64616C] hover:text-[#1E1E24]'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-[#EC5A29]" />
              <span>Kartu Hukuman</span>
            </button>
          </div>

          {/* ========================================================================= */}
          {/* TAB CONTENTS (Scrollable, Responsive 2-Col on Desktop)                     */}
          {/* ========================================================================= */}
          <div className="flex-1 overflow-y-auto pr-1 custom-scroll max-h-[46vh] mb-4">
            {/* ----------------------------------------------------------------------- */}
            {/* TAB 1: CARA MAIN LENGKAP                                                */}
            {/* ----------------------------------------------------------------------- */}
            {activeTab === 'cara-main' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {detail.steps.map((st) => (
                    <div
                      key={st.number}
                      className="p-3.5 rounded-2xl bg-white border border-[#1E1E24]/10 shadow-xs flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] border border-[#1E1E24]/10 font-display font-black text-xs text-[#1E1E24] flex items-center justify-center shrink-0">
                        {st.number}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <FluentEmoji name={st.emoji} emoji={st.unicode} variant="3d" size={18} />
                          <h4 className="font-display text-sm font-bold text-[#1E1E24]">
                            {st.title}
                          </h4>
                        </div>
                        <p className="text-xs text-[#64616C] font-semibold leading-relaxed">
                          {st.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Important Rule Banner */}
                <div className="p-3.5 rounded-2xl bg-[#FFF7ED] border border-[#F97316]/30 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#EA580C] text-white flex items-center justify-center shrink-0 font-bold">
                    💡
                  </div>
                  <p className="text-xs text-[#9A3412] font-semibold leading-snug">
                    <strong>Tips Main:</strong> Buka speaker HP atau sambungkan ke speaker ruangan agar efek suara & countdown timer terdengar heboh oleh semua pemain!
                  </p>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------------- */}
            {/* TAB 2: SISTEM SKOR & POIN ROOM                                          */}
            {/* ----------------------------------------------------------------------- */}
            {activeTab === 'skor' && (
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-[#F0FDF4] border border-[#12B76A]/30 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#12B76A] text-white flex items-center justify-center shrink-0 font-bold">
                    <Trophy className="w-4 h-4 text-[#FBBF24]" />
                  </div>
                  <div>
                    <h4 className="font-display text-xs font-bold text-[#065F46] uppercase tracking-wider">
                      Aturan Akumulasi Skor Room
                    </h4>
                    <p className="text-xs text-[#047857] font-semibold mt-0.5">
                      {detail.scoringNote}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {detail.scoring.map((sc, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-white border border-[#1E1E24]/10 shadow-xs flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-display text-xs font-bold text-[#1E1E24]">
                          {sc.label}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-display text-xs font-black shrink-0 ${
                            sc.type === 'positive'
                              ? 'bg-[#D1FADF] text-[#027A48]'
                              : sc.type === 'negative'
                              ? 'bg-[#FEE4E2] text-[#B42318]'
                              : sc.type === 'bonus'
                              ? 'bg-[#FEF08A] text-[#854D0E]'
                              : 'bg-black/5 text-[#64616C]'
                          }`}
                        >
                          {sc.points}
                        </span>
                      </div>
                      <p className="text-xs text-[#64616C] font-semibold leading-relaxed">
                        {sc.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------------- */}
            {/* TAB 3: ATURAN HUKUMAN & SHUFFLE PREVIEW                                 */}
            {/* ----------------------------------------------------------------------- */}
            {activeTab === 'hukuman' && (
              <div className="space-y-3.5">
                <div className="p-3.5 rounded-2xl bg-[#FFF1F2] border border-[#F43F5E]/30 flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-[#E11D48] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-[#9F1239]">
                      <strong>Siapa yang Kena Hukuman:</strong> {detail.punishmentWho}
                    </p>
                    <p className="text-xs text-[#BE123C] font-semibold mt-0.5">
                      {detail.punishmentRule}
                    </p>
                  </div>
                </div>

                {/* Interactive Shuffle Punishment Card Preview */}
                <div className="rounded-[28px] bg-white border-2 border-[#1E1E24]/15 p-4 shadow-xs text-center relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-[#64616C]">
                      Contoh Kartu Hukuman
                    </span>

                    <button
                      type="button"
                      onClick={handleShufflePreview}
                      disabled={isShufflingPunishment}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-full bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#1E1E24]/10 text-xs font-bold text-[#1E1E24] cursor-pointer transition active:scale-95"
                    >
                      <Shuffle
                        className={`w-3.5 h-3.5 text-[#EC5A29] ${
                          isShufflingPunishment ? 'animate-spin' : ''
                        }`}
                      />
                      <span>Acak Contoh Lain</span>
                    </button>
                  </div>

                  {/* The Card */}
                  <div
                    style={{ borderColor: previewPunishment.color }}
                    className="p-4 rounded-2xl bg-[#FAF7F2] border-2 shadow-xs transition-all"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-2xl">{previewPunishment.emoji}</span>
                      <span
                        style={{ backgroundColor: previewPunishment.color }}
                        className="px-2.5 py-0.5 rounded-full text-white text-xs font-black uppercase"
                      >
                        {previewPunishment.intensity} • {previewPunishment.duration}
                      </span>
                    </div>

                    <h4 className="font-display text-base font-bold text-[#1E1E24] mb-1.5">
                      {previewPunishment.title}
                    </h4>

                    <p className="text-xs text-[#475467] font-semibold leading-relaxed">
                      "{previewPunishment.text}"
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* FOOTER ACTIONS                                                            */}
          {/* ========================================================================= */}
          <div className="pt-3 border-t border-[#1E1E24]/10 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                sfx.playPop();
                onClose();
              }}
              className="py-2.5 px-4 rounded-2xl bg-transparent hover:bg-black/5 text-[#64616C] hover:text-[#1E1E24] text-xs font-bold cursor-pointer transition"
            >
              Kembali
            </button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98, y: 2 }}
              onClick={handleStart}
              style={{ backgroundColor: detail.themeColor }}
              className="py-3 px-6 rounded-[22px] text-white border-[3px] border-[#1E1E24] shadow-[0_5px_0_#1E1E24] font-display text-sm font-bold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Mulai Main Game!</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
