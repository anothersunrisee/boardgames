import React from 'react';

// ============================================================================
// CONFETTI BURST COMPONENT (LIGHTWEIGHT GPU CSS-ONLY PARTICLES)
// ============================================================================
export const CONFETTI_PIECES = Array.from({ length: 16 }).map((_, idx) => ({
  id: idx,
  left: `${(idx * 6.1 + (idx % 3) * 2) % 96}%`,
  color: ['#FBBF24', '#C82373', '#158467', '#2568EF', '#EC5A29', '#4AE3B5', '#A855F7'][idx % 7],
  size: 8 + (idx % 3) * 3,
  delay: `${((idx % 8) * 0.28).toFixed(2)}s`,
  duration: `${(2.6 + (idx % 4) * 0.45).toFixed(2)}s`,
  drift: `${(idx % 2 === 0 ? 1 : -1) * (14 + (idx % 4) * 8)}px`,
  shape: idx % 3, // 0: rect, 1: circle, 2: diamond
}));

export const ConfettiShower: React.FC<{ active?: boolean; particleCount?: number }> = ({ active = true }) => {
  if (!active) return null;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {CONFETTI_PIECES.map((p) => (
        <div
          key={p.id}
          style={{
            left: p.left,
            width: p.size,
            height: p.shape === 0 ? p.size * 0.55 : p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === 1 ? '9999px' : p.shape === 2 ? '2px' : '3px',
            animationDuration: p.duration,
            animationDelay: p.delay,
            ['--confetti-drift' as string]: p.drift,
          }}
          className="absolute top-0 animate-confetti-fall"
        />
      ))}
    </div>
  );
};
