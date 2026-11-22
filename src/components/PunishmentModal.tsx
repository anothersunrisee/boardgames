import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, X, Flame, Users, Swords } from 'lucide-react';
import { PUNISHMENT_CARDS } from '../assets-library/punishments';
import type { PunishmentCardDef } from '../assets-library/types';
import { GameMascotBot } from './characters/GameMascotBot';
import { CHARACTER_PACK } from '../assets-library/characters';
import { PlayerProfileAvatar } from './characters/PlayerProfileAvatar';
import { TactileButton } from './ui/TactileElements';
import { sfx } from '../assets-library/soundEngine';
import type { Player } from '../store/useGameStore';

export interface PunishmentModalProps {
  open: boolean;
  onClose: () => void;
  loserName?: string;
  targetType?: 'team' | 'bottom3' | 'individual';
  targetTeamName?: string;
  targetPlayers?: Player[];
}

export const PunishmentModal: React.FC<PunishmentModalProps> = ({
  open,
  onClose,
  loserName,
  targetType = 'individual',
  targetTeamName,
  targetPlayers,
}) => {
  const isTeam = targetType === 'team' || Boolean(targetTeamName);
  const isBottom3 = targetType === 'bottom3' || (targetPlayers && targetPlayers.length > 1 && !isTeam);

  const [modeFilter, setModeFilter] = useState<'auto' | '1v1' | 'team'>('auto');
  const [intensityFilter, setIntensityFilter] = useState<'Semua' | 'Santai' | 'Kocak' | 'Chaos'>('Semua');
  const [isShuffling, setIsShuffling] = useState(false);
  const [cardFlipped, setCardFlipped] = useState(true);

  const modeFilteredPool = useMemo(() => {
    const desiredMode =
      modeFilter !== 'auto'
        ? modeFilter
        : isTeam
        ? 'team'
        : isBottom3
        ? 'both'
        : '1v1';

    if (desiredMode === 'both') return PUNISHMENT_CARDS;
    return PUNISHMENT_CARDS.filter(
      (c) => c.targetMode === desiredMode || c.targetMode === 'both'
    );
  }, [isTeam, isBottom3, modeFilter]);

  const [activeCard, setActiveCard] = useState<PunishmentCardDef>(
    () => modeFilteredPool[0] || PUNISHMENT_CARDS[0]
  );

  useEffect(() => {
    if (open) {
      sfx.playPenalty();
      setModeFilter('auto');
      const desiredMode = isTeam ? 'team' : isBottom3 ? 'both' : '1v1';
      const initialPool =
        desiredMode === 'both'
          ? PUNISHMENT_CARDS
          : PUNISHMENT_CARDS.filter((c) => c.targetMode === desiredMode || c.targetMode === 'both');
      const initial = initialPool[Math.floor(Math.random() * initialPool.length)] || PUNISHMENT_CARDS[0];
      setActiveCard(initial);
      setCardFlipped(true);
    }
  }, [open, isTeam, isBottom3]);

  const handleShuffle = (overrideMode?: 'auto' | '1v1' | 'team', overrideIntensity?: 'Semua' | 'Santai' | 'Kocak' | 'Chaos') => {
    if (isShuffling) return;
    setIsShuffling(true);
    setCardFlipped(false);

    // Audio shuffle ticks
    [0, 1, 2, 3, 4].forEach((i) => {
      setTimeout(() => sfx.playShuffleTick(i), i * 110);
    });

    const effectiveMode = overrideMode ?? modeFilter;
    const effectiveIntensity = overrideIntensity ?? intensityFilter;

    const desiredMode =
      effectiveMode !== 'auto'
        ? effectiveMode
        : isTeam
        ? 'team'
        : isBottom3
        ? 'both'
        : '1v1';

    const byMode =
      desiredMode === 'both'
        ? PUNISHMENT_CARDS
        : PUNISHMENT_CARDS.filter((c) => c.targetMode === desiredMode || c.targetMode === 'both');

    const pool =
      effectiveIntensity === 'Semua'
        ? byMode
        : byMode.filter((c) => c.intensity === effectiveIntensity);

    const safePool = pool.length > 0 ? pool : byMode;
    const candidates = safePool.length > 1 ? safePool.filter((c) => c.id !== activeCard.id) : safePool;
    const picked = candidates[Math.floor(Math.random() * candidates.length)] || PUNISHMENT_CARDS[0];

    setTimeout(() => {
      setActiveCard(picked);
      setIsShuffling(false);
      setCardFlipped(true);
      sfx.playFanfare();
    }, 650);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 20 }}
            transition={{ type: 'spring', damping: 22 }}
            className="w-full max-w-lg rounded-[36px] bg-[#FAF7F2] border-[3px] border-[#1E1E24] p-5 sm:p-6 text-center text-[#1E1E24] shadow-2xl relative overflow-hidden max-h-[92vh] flex flex-col justify-between"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center cursor-pointer text-[#1E1E24] transition z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Mascot Bot */}
            <div className="flex justify-center mb-1">
              <GameMascotBot character={CHARACTER_PACK[14]} size={64} mood="shocked" />
            </div>

            {/* Distinct Deck Type Indicator Pill */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 mb-2">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFE4E2] text-[#B42318] text-xs font-black uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 text-[#DC2626]" />
                <span>
                  {isTeam
                    ? `HUKUMAN KELOMPOK (${targetTeamName || loserName || 'Tim Kalah'})`
                    : isBottom3
                    ? 'HUKUMAN: 3 PEMAIN TERBAWAH'
                    : `HUKUMAN DUEL 1V1: ${loserName || 'Pemain Kalah'}`}
                </span>
              </div>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1E1E24] text-[#FBBF24] text-[10px] font-black uppercase">
                {activeCard.targetMode === 'team' ? (
                  <>
                    <Users className="w-3 h-3" />
                    <span>Dek Kelompok</span>
                  </>
                ) : (
                  <>
                    <Swords className="w-3 h-3" />
                    <span>Dek 1v1 / Solo</span>
                  </>
                )}
              </span>
            </div>

            {/* Target Description & Member Chips */}
            {isTeam && (
              <div className="mb-3">
                <p className="text-xs font-semibold text-[#64616C] mb-2">
                  Seluruh anggota tim kalah wajib menjalankan hukuman kelompok ini bersama:
                </p>
                {targetPlayers && targetPlayers.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center gap-2 max-h-24 overflow-y-auto">
                    {targetPlayers.map((p) => (
                      <div
                        key={p.id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-[#1E1E24]/15 shadow-2xs"
                      >
                        <PlayerProfileAvatar characterId={p.avatarId} size={22} name={p.name} />
                        <span className="font-display font-bold text-xs text-[#1E1E24]">{p.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {isBottom3 && (
              <div className="mb-3">
                <p className="text-xs font-semibold text-[#64616C] mb-2">
                  Pemain di posisi terbawah wajib menerima hukuman tantangan berikut:
                </p>
                {targetPlayers && targetPlayers.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center gap-2 max-h-24 overflow-y-auto">
                    {targetPlayers.map((p, idx) => (
                      <div
                        key={p.id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#FEE2E2] border border-[#DC2626]/20 shadow-2xs"
                      >
                        <span className="font-display font-black text-[10px] text-[#DC2626]">#{idx + 1}</span>
                        <PlayerProfileAvatar characterId={p.avatarId} size={22} name={p.name} />
                        <span className="font-display font-bold text-xs text-[#1E1E24]">{p.name}</span>
                        <span className="text-[10px] font-extrabold text-[#64616C]">({p.score} pt)</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {!isTeam && !isBottom3 && loserName && (
              <p className="text-xs font-bold text-[#64616C] mb-2">
                Tantangan khusus kekalahan 1v1 / individu untuk:{' '}
                <span className="text-[#EC5A29] font-black underline">{loserName}</span>
              </p>
            )}

            {/* Mode Switcher (Allow toggling between 1v1 vs Team deck if bottom3, or switching intensity) */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 mb-3">
              {isBottom3 && (
                <>
                  {(
                    [
                      { id: 'auto', label: 'Campur' },
                      { id: '1v1', label: '⚔️ 1v1/Solo' },
                      { id: 'team', label: '👥 Kelompok' },
                    ] as const
                  ).map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        sfx.playPop(620);
                        setModeFilter(m.id);
                        handleShuffle(m.id, intensityFilter);
                      }}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black cursor-pointer transition border ${
                        modeFilter === m.id
                          ? 'bg-[#EC5A29] text-white border-[#EC5A29]'
                          : 'bg-white text-[#64616C] border-[#1E1E24]/15 hover:border-[#1E1E24]'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                  <span className="text-[#1E1E24]/20">|</span>
                </>
              )}

              {(['Semua', 'Santai', 'Kocak', 'Chaos'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => {
                    sfx.playPop(580);
                    setIntensityFilter(lvl);
                    handleShuffle(modeFilter, lvl);
                  }}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold cursor-pointer transition ${
                    intensityFilter === lvl
                      ? 'bg-[#1E1E24] text-white shadow-xs'
                      : 'bg-[#F2ECE1] text-[#64616C] hover:text-[#1E1E24]'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Flippable 3D Punishment Card */}
            <div className="perspective-1000 mb-4">
              <motion.div
                animate={{ rotateY: cardFlipped ? 0 : 180 }}
                transition={{ duration: 0.4 }}
                style={{ backgroundColor: activeCard.color }}
                className="w-full rounded-2xl p-4 sm:p-5 text-white border-2 border-[#1E1E24] shadow-[0_6px_0_#1E1E24] text-left relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#1E1E24] text-[#FBBF24] text-[10px] font-black uppercase tracking-wider">
                    {activeCard.targetMode === 'team' ? '👥 KELOMPOK' : '⚔️ DUEL 1V1'} • {activeCard.intensity}
                  </span>
                  <span className="text-xs font-bold text-white/85">
                    Durasi: {activeCard.duration}
                  </span>
                </div>

                <h3 className="font-display text-xl sm:text-2xl font-bold mb-2 flex items-center gap-2">
                  <span>{activeCard.emoji}</span>
                  <span>{activeCard.title}</span>
                </h3>
                <p className="text-xs sm:text-sm font-semibold bg-black/20 rounded-xl p-3 border border-white/15 leading-relaxed">
                  “{activeCard.text}”
                </p>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <TactileButton
                variant="sunny"
                fullWidth
                size="md"
                onClick={() => handleShuffle()}
                disabled={isShuffling}
              >
                <Shuffle className={`w-4 h-4 ${isShuffling ? 'animate-spin' : ''}`} />
                <span>{isShuffling ? 'Mengocok...' : 'Acak Hukuman Lain'}</span>
              </TactileButton>

              <TactileButton
                variant="ink"
                size="md"
                onClick={onClose}
              >
                <span>Siap Jalankan!</span>
              </TactileButton>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PunishmentModal;
