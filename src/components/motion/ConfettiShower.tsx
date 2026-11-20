import React from 'react';
import { motion } from 'framer-motion';

// ============================================================================
// CONFETTI BURST COMPONENT (SMOOTH 60FPS SVG PARTICLES)
// ============================================================================
export const CONFETTI_PIECES = Array.from({ length: 28 }).map((_, idx) => ({
  id: idx,
  left: `${(idx * 3.6 + (idx % 3) * 2) % 98}%`,
  color: ['#FBBF24', '#C82373', '#158467', '#2568EF', '#EC5A29', '#4AE3B5', '#A855F7'][idx % 7],
  size: 8 + (idx % 4) * 3,
  delay: (idx % 9) * 0.24,
  duration: 2.2 + (idx % 5) * 0.45,
  drift: (idx % 2 === 0 ? 1 : -1) * (16 + (idx % 4) * 10),
  shape: idx % 3, // 0: rect, 1: circle, 2: diamond
}));

export const ConfettiShower: React.FC<{ active?: boolean }> = ({ active = true }) => {
  if (!active) return null;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {CONFETTI_PIECES.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -24, x: 0, rotate: 0, opacity: 0 }}
          animate={{
            y: ['0%', '480%'],
            x: [0, p.drift, -p.drift * 0.5],
            rotate: [0, 360],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            left: p.left,
            width: p.size,
            height: p.shape === 0 ? p.size * 0.55 : p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === 1 ? '9999px' : p.shape === 2 ? '2px' : '3px',
          }}
          className="absolute top-0"
        />
      ))}
    </div>
  );
};
