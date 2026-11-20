import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { sfx } from '../../assets-library/soundEngine';
import { GameMascotBot } from '../characters/GameMascotBot';
import { CHARACTER_PACK } from '../../assets-library/characters';

// ============================================================================
// FULLSCREEN CONCENTRIC CIRCLES ROOM START TRANSITION OVERLAY
// ============================================================================
export const RING_PALETTE = ['#1E1E24', '#158467', '#C82373', '#2568EF', '#FBBF24', '#FAF7F2'];

export const ConcentricRoomTransition: React.FC<{
  active: boolean;
  roomTitle: string;
  subtitle?: string;
  onComplete: () => void;
}> = ({ active, roomTitle, subtitle = 'MEMULAI ROOM PERMAINAN...', onComplete }) => {
  useEffect(() => {
    if (!active) return;
    sfx.playWhoosh();
    const timer = setTimeout(() => {
      onComplete();
    }, 3200);
    return () => clearTimeout(timer);
  }, [active, onComplete]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center overflow-hidden"
        >
          {/* Overlapping Concentric Circles Expanding Gently Outward from Center */}
          {RING_PALETTE.map((hex, i) => (
            <motion.div
              key={hex}
              initial={{ scale: 0, opacity: 0.95 }}
              animate={{
                scale: [0, 3.2, 3.2, 0],
                opacity: [0.95, 1, 1, 0.9],
              }}
              transition={{
                duration: 3.1,
                times: [0, 0.45, 0.82, 1],
                delay: i * 0.09,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                backgroundColor: hex,
                width: '85vmax',
                height: '85vmax',
              }}
              className="absolute rounded-full shadow-2xl"
            />
          ))}

          {/* Center Room Title Reveal */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0, y: 15 }}
            animate={{
              scale: [0.6, 1.03, 1, 0.88],
              opacity: [0, 1, 1, 0],
              y: [15, 0, 0, -10],
            }}
            transition={{
              duration: 2.6,
              delay: 0.45,
              times: [0, 0.3, 0.82, 1],
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative z-10 text-center px-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1E1E24] text-[#FBBF24] text-xs font-extrabold uppercase tracking-widest mb-3 shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{subtitle}</span>
            </div>
            <h2 className="font-display text-4xl sm:text-6xl font-bold text-[#1E1E24] tracking-tight drop-shadow-xs">
              {roomTitle}
            </h2>
            <div className="flex items-center justify-center gap-3 mt-4">
              <GameMascotBot character={CHARACTER_PACK[0]} size={54} mood="happy" />
              <GameMascotBot character={CHARACTER_PACK[4]} size={54} mood="winner" />
              <GameMascotBot character={CHARACTER_PACK[1]} size={54} mood="happy" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
