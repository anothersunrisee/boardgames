import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, X, Flame } from 'lucide-react';
import { PUNISHMENT_CARDS } from '../assets-library/punishments';
import type { PunishmentCardDef } from '../assets-library/types';
import { GameMascotBot } from './characters/GameMascotBot';
import { CHARACTER_PACK } from '../assets-library/characters';
import { TactileButton } from './ui/TactileElements';
import { sfx } from '../assets-library/soundEngine';

interface PunishmentModalProps {
  open: boolean;
  onClose: () => void;
  loserName?: string;
}

export const PunishmentModal: React.FC<PunishmentModalProps> = ({
  open,
  onClose,
  loserName,
}) => {
  const [activeCard, setActiveCard] = useState<PunishmentCardDef>(PUNISHMENT_CARDS[0]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [cardFlipped, setCardFlipped] = useState(true);
  const [intensityFilter, setIntensityFilter] = useState<'Semua' | 'Santai' | 'Kocak' | 'Chaos'>('Semua');

  useEffect(() => {
    if (open) {
      sfx.playPenalty();
      const initial = PUNISHMENT_CARDS[Math.floor(Math.random() * PUNISHMENT_CARDS.length)];
      setActiveCard(initial);
      setCardFlipped(true);
    }
  }, [open]);

  const handleShuffle = () => {
    if (isShuffling) return;
    setIsShuffling(true);
    setCardFlipped(false);

    // Audio shuffle ticks
    [0, 1, 2, 3, 4].forEach((i) => {
      setTimeout(() => sfx.playShuffleTick(i), i * 110);
    });

    const pool =
      intensityFilter === 'Semua'
        ? PUNISHMENT_CARDS
        : PUNISHMENT_CARDS.filter((c) => c.intensity === intensityFilter);

    const candidates = pool.length > 1 ? pool.filter((c) => c.id !== activeCard.id) : pool;
    const picked = candidates[Math.floor(Math.random() * candidates.length)] || PUNISHMENT_CARDS[0];

    setTimeout(() => {
      setActiveCard(picked);
      setIsShuffling(false);
      setCardFlipped(true);
      sfx.playFanfare();
    }, 750);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 20 }}
            transition={{ type: 'spring', damping: 22 }}
            className="w-full max-w-md rounded-[36px] bg-[#FAF7F2] border-[3px] border-[#1E1E24] p-6 text-center text-[#1E1E24] shadow-2xl relative overflow-hidden"
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
            <div className="flex justify-center mb-2">
              <GameMascotBot character={CHARACTER_PACK[14]} size={76} mood="shocked" />
            </div>

            {/* Title & Target */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFE4E2] text-[#B42318] text-xs font-black uppercase tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5" />
              <span>SHUFFLE KARTU HUKUMAN</span>
            </div>

            {loserName && (
              <p className="text-xs font-bold text-[#64616C] mb-2">
                Hukuman khusus untuk:{' '}
                <span className="text-[#EC5A29] font-black underline">{loserName}</span>
              </p>
            )}

            {/* Filter Pills */}
            <div className="flex items-center justify-center gap-1.5 mb-3">
              {(['Semua', 'Santai', 'Kocak', 'Chaos'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => {
                    sfx.playPop(580);
                    setIntensityFilter(lvl);
                  }}
                  className={`px-3 py-1 rounded-full text-[11px] font-extrabold cursor-pointer transition ${
                    intensityFilter === lvl
                      ? 'bg-[#1E1E24] text-white shadow-xs'
                      : 'bg-[#F2ECE1] text-[#64616C] hover:text-[#1E1E24]'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* 3D Flip Card Shuffle Stage */}
            <div className="relative min-h-[220px] flex items-center justify-center my-2 [perspective:1000px]">
              {/* Flying Stack Background Cards during shuffle */}
              {[0, 1, 2].map((idx) => (
                <motion.div
                  key={idx}
                  animate={
                    isShuffling
                      ? {
                          x: [0, (idx % 2 === 0 ? -1 : 1) * (50 + idx * 16), 0],
                          y: [0, (idx - 1) * 20, 0],
                          rotate: [0, (idx % 2 === 0 ? -16 : 16), (idx - 1) * 3],
                          scale: [0.94, 1.02, 0.94],
                        }
                      : {
                          x: (idx - 1) * 4,
                          y: idx * 2.5,
                          rotate: (idx - 1) * 2,
                          scale: 0.96,
                        }
                  }
                  transition={{
                    duration: isShuffling ? 0.35 : 0.3,
                    repeat: isShuffling ? 2 : 0,
                    ease: 'easeInOut',
                  }}
                  style={{
                    backgroundColor: ['#1E1E24', '#EC5A29', '#C82373'][idx],
                  }}
                  className="absolute inset-0 rounded-[28px] border-[3px] border-[#1E1E24] opacity-80 shadow-md"
                />
              ))}

              {/* Front Active Punishment Card (3D Flip) */}
              <motion.div
                key={activeCard.id + String(isShuffling)}
                initial={{ rotateY: 180, scale: 0.9 }}
                animate={{
                  rotateY: cardFlipped && !isShuffling ? 0 : 180,
                  scale: isShuffling ? 0.9 : 1,
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                style={{ backgroundColor: activeCard.color }}
                className="relative z-10 w-full min-h-[220px] rounded-[28px] border-[3.5px] border-[#1E1E24] shadow-[0_8px_0_#1E1E24] p-5 text-white flex flex-col justify-between [transform-style:preserve-3d]"
              >
                <div className="flex items-center justify-between">
                  <span className="px-3 py-0.5 rounded-full bg-[#1E1E24] text-[#FBBF24] text-[10px] font-extrabold uppercase">
                    {activeCard.intensity} • {activeCard.duration}
                  </span>
                  <span className="text-2xl">{activeCard.emoji}</span>
                </div>

                <div className="my-2">
                  <h4 className="font-display text-xl sm:text-2xl font-bold leading-tight mb-2">
                    {activeCard.title}
                  </h4>
                  <p className="text-xs sm:text-sm font-bold leading-relaxed bg-black/25 rounded-2xl p-3 border border-white/15">
                    “{activeCard.text}”
                  </p>
                </div>

                <div className="text-[10px] font-bold opacity-85 text-right">
                  #{activeCard.id.toUpperCase()}
                </div>
              </motion.div>
            </div>

            {/* Buttons */}
            <div className="space-y-2 mt-4">
              <TactileButton
                variant="sunny"
                size="md"
                fullWidth
                disabled={isShuffling}
                onClick={handleShuffle}
              >
                <Shuffle className={`w-4 h-4 text-[#1E1E24] ${isShuffling ? 'animate-spin' : ''}`} />
                <span>{isShuffling ? 'Mengocok Kartu...' : 'Acak Hukuman Lain!'}</span>
              </TactileButton>

              <TactileButton
                variant="ink"
                size="md"
                fullWidth
                onClick={onClose}
              >
                <span>Siap Jalani Hukuman! 🔥</span>
              </TactileButton>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PunishmentModal;
