import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, X, AlertTriangle } from 'lucide-react';
import { getRandomPunishment, type PunishmentCard } from '../data/punishments';
import { BlobMascot } from './ui/BlobMascot';
import { Button } from './ui/Button';
import { sfx } from '../utils/sound';

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
  const [card, setCard] = useState<PunishmentCard>(getRandomPunishment());
  const [isShuffling, setIsShuffling] = useState(false);

  useEffect(() => {
    if (open) {
      sfx.playBuzzer();
      setCard(getRandomPunishment());
    }
  }, [open]);

  const handleShuffle = () => {
    sfx.playPop(850);
    setIsShuffling(true);
    setTimeout(() => {
      setCard(getRandomPunishment([card.id]));
      setIsShuffling(false);
    }, 250);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', damping: 20 }}
            className="w-full max-w-sm rounded-[32px] bg-[#FAF7F2] border-4 border-[#EC5A29] p-6 text-center text-[#1E1E24] shadow-2xl relative overflow-hidden"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center cursor-pointer text-[#1E1E24]"
            >
              <X className="w-4 h-4 stroke-[3]" />
            </button>

            {/* Mascot */}
            <div className="mb-2 flex justify-center">
              <BlobMascot shape="triangle" mood="spicy" color="#EC5A29" size={80} />
            </div>

            {/* Header Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFE8DF] text-[#EC5A29] text-xs font-black uppercase tracking-wider mb-2">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>KARTU HUKUMAN KOCAK</span>
            </div>

            {loserName && (
              <p className="text-xs font-bold text-[#64616C] mb-1">
                Khusus untuk:{' '}
                <span className="text-[#EC5A29] font-black underline">{loserName}</span>
              </p>
            )}

            {/* Animated Punishment Card Box */}
            <AnimatePresence mode="wait">
              <motion.div
                key={card.id}
                initial={{ opacity: 0, rotateY: 90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: -90 }}
                transition={{ duration: 0.2 }}
                className="my-3 p-5 rounded-[24px] bg-white border-2 border-[#1E1E24]/10 shadow-xs relative"
              >
                <div className="text-4xl mb-2">{card.emoji}</div>
                <h3 className="font-display text-xl font-bold text-[#EC5A29] mb-1.5">
                  "{card.title}"
                </h3>

                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#F2ECE1] text-[#64616C] uppercase tracking-wider mb-2">
                  Tingkat: {card.difficulty}
                </span>

                <p className="text-sm font-bold text-[#1E1E24] leading-relaxed">
                  {card.punishment}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Buttons */}
            <div className="space-y-2 mt-4">
              <button
                type="button"
                onClick={handleShuffle}
                disabled={isShuffling}
                className="w-full py-2.5 px-4 rounded-2xl bg-[#FFE8DF] text-[#EC5A29] hover:bg-[#FFD9CA] font-display text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition shadow-xs"
              >
                <Shuffle className="w-4 h-4" />
                <span>Acak Hukuman Lain</span>
              </button>

              <Button
                variant="ink"
                size="md"
                fullWidth
                onClick={onClose}
              >
                <span>Siap Jalani Hukuman! 🔥</span>
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PunishmentModal;
