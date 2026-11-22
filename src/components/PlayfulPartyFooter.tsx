import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coffee,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  ArrowLeft,
  ExternalLink,
  Gamepad2,
  ShieldCheck,
  AlertCircle,
  Heart,
  Upload,
  RotateCcw,
  CheckCircle2,
  Code2,
  WifiOff,
  HardDrive,
  Lock,
  PartyPopper,
  Star,
  Info,
  Zap,
} from 'lucide-react';
import { FluentEmoji } from './ui/FluentEmoji';

// ============================================================================
// 1. ZERO-DEPENDENCY WEB AUDIO API SOUND EFFECTS HELPER
// ============================================================================
class SoundEffects {
  private ctx: AudioContext | null = null;
  public muted = false;

  private ensureCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /** Crisp bubbly tactile pop for buttons and playful mascots */
  playPop(pitch = 540) {
    if (this.muted) return;
    try {
      const ctx = this.ensureCtx();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, now);
      osc.frequency.exponentialRampToValueAtTime(pitch * 1.55, now + 0.08);

      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.095);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch {}
  }

  /** Uplifting 3-note triad for positive confirmations */
  playSuccess() {
    if (this.muted) return;
    try {
      const ctx = this.ensureCtx();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99];
      notes.forEach((freq, idx) => {
        const start = ctx.currentTime + idx * 0.055;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.14, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.19);
      });
    } catch {}
  }

  /** Warm café-bell chime when selecting coffee tiers or opening QRIS */
  playCoffeeChime() {
    if (this.muted) return;
    try {
      const ctx = this.ensureCtx();
      if (!ctx) return;
      const bellNotes = [880, 1174.66, 1318.51];
      bellNotes.forEach((freq, idx) => {
        const start = ctx.currentTime + idx * 0.07;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.12, start);
        gain.gain.exponentialRampToValueAtTime(0.0008, start + 0.34);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.36);
      });
    } catch {}
  }

  /** Joyful party fanfare after confirming Traktir Kopi */
  playFanfare() {
    if (this.muted) return;
    try {
      const ctx = this.ensureCtx();
      if (!ctx) return;
      const melody = [
        { f: 523.25, t: 0, d: 0.12 },
        { f: 659.25, t: 0.1, d: 0.12 },
        { f: 783.99, t: 0.2, d: 0.12 },
        { f: 1046.5, t: 0.32, d: 0.28 },
        { f: 783.99, t: 0.46, d: 0.12 },
        { f: 1046.5, t: 0.58, d: 0.45 },
      ];
      melody.forEach(({ f, t, d }) => {
        const start = ctx.currentTime + t;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, start);
        gain.gain.setValueAtTime(0.16, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + d + 0.02);
      });
    } catch {}
  }

  /** Springy boing sound when lifting or dropping a mascot */
  playBoing(startFreq = 220, endFreq = 580) {
    if (this.muted) return;
    try {
      const ctx = this.ensureCtx();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.18);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.21);
    } catch {}
  }

  /** Grumpy comic buzz when the headphone mascot gets annoyed */
  playAngryBuzz() {
    if (this.muted) return;
    try {
      const ctx = this.ensureCtx();
      if (!ctx) return;
      [0, 0.09].forEach((offset) => {
        const start = ctx.currentTime + offset;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(145, start);
        osc.frequency.linearRampToValueAtTime(115, start + 0.07);
        gain.gain.setValueAtTime(0.11, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.085);
      });
    } catch {}
  }
}

export const sfx = new SoundEffects();

// ============================================================================
// 2. TYPES & DATA CONSTANTS
// ============================================================================
export type MascotShape = 'squircle' | 'cloud' | 'circle' | 'triangle' | 'blob';
export type MascotMood =
  | 'idle'
  | 'happy'
  | 'excited'
  | 'chill'
  | 'love'
  | 'angry'
  | 'dizzy'
  | 'surprised';

export interface CoffeeTier {
  id: string;
  label: string;
  price: string;
  emoji: string;
  color: string;
  mascotColor: string;
  mascotMood: MascotMood;
  note: string;
}

export const COFFEE_TIERS: CoffeeTier[] = [
  {
    id: 'kopi-susu',
    label: 'Es Kopi Susu',
    price: 'Rp15.000',
    emoji: '☕',
    color: '#EC5A29',
    mascotColor: '#2568EF',
    mascotMood: 'happy',
    note: 'Segelas es kopi susu bikin semangat nambah fitur & animasi baru!',
  },
  {
    id: 'matcha',
    label: 'Matcha Nongkrong',
    price: 'Rp25.000',
    emoji: '🍵',
    color: '#158467',
    mascotColor: '#158467',
    mascotMood: 'excited',
    note: 'Matcha creamy buat nemenin begadang nge-polish game baru!',
  },
  {
    id: 'bensin-coding',
    label: 'Bensin Coding',
    price: 'Rp50.000',
    emoji: '🚀',
    color: '#9D71E8',
    mascotColor: '#D8317E',
    mascotMood: 'love',
    note: 'Auto turbo mode! Siap gas bikin mini-game & mode online kedepannya!',
  },
  {
    id: 'seikhlasnya',
    label: 'Seikhlasnya!',
    price: 'Bebas 💛',
    emoji: '💛',
    color: '#FBBF24',
    mascotColor: '#EC5A29',
    mascotMood: 'happy',
    note: 'Berapapun nominalnya super berarti banget buat support indie dev!',
  },
];

export const EWALLET_BADGES = [
  { name: 'GoPay', bg: '#E0F2FE', text: '#0369A1' },
  { name: 'OVO', bg: '#F3E8FF', text: '#6D28D9' },
  { name: 'DANA', bg: '#DBEAFE', text: '#1D4ED8' },
  { name: 'ShopeePay', bg: '#FFEDD5', text: '#C2410C' },
  { name: 'LinkAja', bg: '#FEE2E2', text: '#B91C1C' },
  { name: 'SeaBank / m-Banking', bg: '#D1FAE5', text: '#047857' },
];

export const FOOTER_GAMES_LIST = [
  { id: 'game1', name: 'Same Brain? NO!', color: '#158467', tag: 'Mind Sync' },
  { id: 'game2', name: 'Beauty Expert?!', color: '#D8317E', tag: 'Q&A' },
  { id: 'game3', name: 'Boys Stuff', color: '#2568EF', tag: 'Trivia' },
  { id: 'game4', name: "The Devil's Advocate", color: '#EC5A29', tag: 'Debat 1v1' },
  { id: 'game5', name: 'Cerdas Cermat Berantai', color: '#7C3AED', tag: 'Estafet Quiz' },
  { id: 'game6', name: 'Sell Me This Trash!', color: '#65A30D', tag: 'Pitch Duel' },
];

export const SOCIAL_LINKS = [
  {
    id: 'linkedin',
    label: 'linkedin /fajarahnf',
    short: '/fajarahnf',
    platform: 'LinkedIn',
    href: 'https://linkedin.com/in/fajarahnf',
    bg: '#E0EBFF',
    border: '#2568EF',
    text: '#1E40AF',
  },
  {
    id: 'instagram',
    label: 'instagram /fajarahnf',
    short: '/fajarahnf',
    platform: 'Instagram',
    href: 'https://instagram.com/fajarahnf',
    bg: '#FCE4F0',
    border: '#D8317E',
    text: '#9D174D',
  },
  {
    id: 'website',
    label: 'fajarahnf.vercel.app',
    short: 'fajarahnf.vercel.app',
    platform: 'Website',
    href: 'https://fajarahnf.vercel.app',
    bg: '#D6F5EC',
    border: '#158467',
    text: '#065F46',
  },
];

// ============================================================================
// 3. GROK-BOT / DOTS GEOMETRIC MASCOT COMPONENT (ANIMATED BLINKING PILL EYES)
// ============================================================================
export const GrokMascot: React.FC<{
  shape?: MascotShape;
  color?: string;
  size?: number;
  mood?: MascotMood;
  glasses?: boolean;
  headphones?: boolean;
  coffeeCup?: boolean;
  stickerBorder?: boolean;
  foreheadAngry?: boolean;
  blinkDelay?: number;
  lookX?: number;
  className?: string;
}> = ({
  shape = 'squircle',
  color = '#2568EF',
  size = 76,
  mood = 'idle',
  glasses = false,
  headphones = false,
  coffeeCup = false,
  stickerBorder = true,
  foreheadAngry = false,
  lookX = 0,
  className = '',
}) => {
  const gradId = React.useId();
  const isAngry = mood === 'angry' || foreheadAngry;

  const renderBody = (isOutline = false, customFill?: string) => {
    const props = isOutline
      ? {
          fill: '#FFFFFF',
          stroke: '#FFFFFF',
          strokeWidth: 14,
          strokeLinejoin: 'round' as const,
          strokeLinecap: 'round' as const,
        }
      : { fill: customFill || color };

    switch (shape) {
      case 'cloud':
        return (
          <path
            d="M28,88 C14,88 9,74 16,61 C16,45 30,39 39,44 C44,25 74,21 83,42 C99,42 109,56 103,73 C100,84 90,88 77,88 Z"
            {...props}
          />
        );
      case 'triangle':
        return (
          <path
            d="M52,20 C56,12 64,12 68,20 L102,84 C106,92 100,100 90,100 L30,100 C20,100 14,92 18,84 Z"
            {...props}
          />
        );
      case 'circle':
        return <circle cx="60" cy="60" r="41" {...props} />;
      case 'blob':
        return (
          <path
            d="M44,22 C56,14 70,20 72,32 C87,30 99,42 93,57 C101,70 91,88 76,86 C70,98 52,102 44,90 C27,92 17,76 25,63 C15,51 25,32 40,34 Z"
            {...props}
          />
        );
      case 'squircle':
      default:
        return <rect x="20" y="22" width="80" height="76" rx="28" {...props} />;
    }
  };

  const eyeY = shape === 'triangle' ? 66 : 58;

  const renderEyes = () => {
    if (mood === 'angry') {
      return (
        <g>
          {/* Fierce slanted angry eyes + eyebrows */}
          <path
            d={`M37,${eyeY - 10} L54,${eyeY - 3}`}
            stroke="#FFFFFF"
            strokeWidth="5.5"
            strokeLinecap="round"
          />
          <path
            d={`M83,${eyeY - 10} L66,${eyeY - 3}`}
            stroke="#FFFFFF"
            strokeWidth="5.5"
            strokeLinecap="round"
          />
          <rect x="42" y={eyeY - 3} width="9" height="12" rx="4.5" fill="#FFFFFF" />
          <rect x="69" y={eyeY - 3} width="9" height="12" rx="4.5" fill="#FFFFFF" />
          {/* Grumpy mouth */}
          <path
            d={`M52,${eyeY + 17} Q60,${eyeY + 11} 68,${eyeY + 17}`}
            stroke="#FFFFFF"
            strokeWidth="4.5"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      );
    }

    if (mood === 'dizzy') {
      return (
        <g stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round">
          <line x1="39" y1={eyeY - 8} x2="51" y2={eyeY + 4} />
          <line x1="51" y1={eyeY - 8} x2="39" y2={eyeY + 4} />
          <line x1="69" y1={eyeY - 8} x2="81" y2={eyeY + 4} />
          <line x1="81" y1={eyeY - 8} x2="69" y2={eyeY + 4} />
          <circle cx="60" cy={eyeY + 15} r="5" fill="none" strokeWidth="4" />
        </g>
      );
    }

    if (mood === 'surprised') {
      return (
        <g fill="#FFFFFF">
          <circle cx="46" cy={eyeY - 2} r="7" />
          <circle cx="74" cy={eyeY - 2} r="7" />
          <ellipse cx="60" cy={eyeY + 14} rx="5.5" ry="7" />
        </g>
      );
    }

    if (mood === 'chill') {
      return (
        <g stroke="#FFFFFF" strokeWidth="5.5" strokeLinecap="round" fill="none">
          <path d={`M40,${eyeY} Q46,${eyeY + 6} 52,${eyeY}`} />
          <path d={`M68,${eyeY} Q74,${eyeY + 6} 80,${eyeY}`} />
        </g>
      );
    }

    if (mood === 'happy' || mood === 'excited') {
      return (
        <g stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d={`M41,${eyeY + 3} L49,${eyeY - 4} L41,${eyeY - 10}`} />
          <path d={`M79,${eyeY + 3} L71,${eyeY - 4} L79,${eyeY - 10}`} />
        </g>
      );
    }

    if (mood === 'love') {
      return (
        <g fill="#FFFFFF">
          <path d={`M47,${eyeY + 6} C47,${eyeY + 6} 37,${eyeY - 1} 37,${eyeY - 7} C37,${eyeY - 11} 42,${eyeY - 13} 47,${eyeY - 8} C52,${eyeY - 13} 57,${eyeY - 11} 57,${eyeY - 7} C57,${eyeY - 1} 47,${eyeY + 6} 47,${eyeY + 6} Z`} />
          <path d={`M73,${eyeY + 6} C73,${eyeY + 6} 63,${eyeY - 1} 63,${eyeY - 7} C63,${eyeY - 11} 68,${eyeY - 13} 73,${eyeY - 8} C78,${eyeY - 13} 83,${eyeY - 11} 83,${eyeY - 7} C83,${eyeY - 1} 73,${eyeY + 6} 73,${eyeY + 6} Z`} />
        </g>
      );
    }

    // Default signature Grok-bot smooth white vertical pill eyes
    return (
      <g fill="#FFFFFF">
        <rect x="43" y={eyeY - 11} width="9.5" height="22" rx="4.75" />
        <rect x="67.5" y={eyeY - 11} width="9.5" height="22" rx="4.75" />
      </g>
    );
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={`block overflow-visible select-none ${className}`}
    >
      <defs>
        <linearGradient id={`angry-grad-${gradId}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#DC2626" stopOpacity="0.95" />
          <stop offset="48%" stopColor="#EF4444" stopOpacity="0.65" />
          <stop offset="82%" stopColor="#EF4444" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Headphones Back Band */}
      {headphones && (
        <path
          d="M17,58 C17,22 103,22 103,58"
          fill="none"
          stroke="#1E1E24"
          strokeWidth="7"
          strokeLinecap="round"
        />
      )}

      {/* White Die-Cut Sticker Outline */}
      {stickerBorder && renderBody(true)}

      {/* Solid Vibrant Mascot Body */}
      {renderBody(false)}

      {/* Red Forehead Gradient Overlay when Angry / Disturbed */}
      {isAngry && renderBody(false, `url(#angry-grad-${gradId})`)}

      {/* Subtle Top Highlight */}
      {!isAngry && (
        <ellipse cx="44" cy="37" rx="11" ry="5" fill="#FFFFFF" opacity="0.22" transform="rotate(-18 44 37)" />
      )}

      {/* Anime Anger Vein Mark on Forehead */}
      {isAngry && (
        <g transform="translate(68, 25)" stroke="#FEF08A" strokeWidth="2.8" strokeLinecap="round" fill="none">
          <path d="M2,8 Q8,8 8,2" />
          <path d="M14,8 Q8,8 8,2" />
          <path d="M2,11 Q8,11 8,17" />
          <path d="M14,11 Q8,11 8,17" />
        </g>
      )}

      {/* Crisp Eyes */}
      <g
        style={{ transform: `translateX(${lookX}px)` }}
      >
        {renderEyes()}
      </g>

      {/* Developer Round Glasses */}
      {glasses && (
        <g stroke="#1E1E24" strokeWidth="4" fill="rgba(255,255,255,0.18)">
          <rect x="31" y={eyeY - 14} width="26" height="24" rx="8" />
          <rect x="63" y={eyeY - 14} width="26" height="24" rx="8" />
          <line x1="57" y1={eyeY - 2} x2="63" y2={eyeY - 2} strokeWidth="4" />
        </g>
      )}

      {/* Headphones Ear Cups */}
      {headphones && (
        <g>
          <rect x="10" y="48" width="14" height="28" rx="7" fill="#1E1E24" stroke="#FBBF24" strokeWidth="2.5" />
          <rect x="96" y="48" width="14" height="28" rx="7" fill="#1E1E24" stroke="#FBBF24" strokeWidth="2.5" />
        </g>
      )}

      {/* Cute Mini Coffee Mug */}
      {coffeeCup && (
        <g transform="translate(76, 68)">
          <path
            d="M8,-4 Q11,-10 8,-16"
            stroke="#FAF7F2"
            strokeWidth="2.6"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
          />
          <path
            d="M16,-3 Q19,-9 16,-15"
            stroke="#FBBF24"
            strokeWidth="2.6"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
          />
          {/* Mug handle */}
          <path d="M22,6 C29,6 29,18 22,18" stroke="#1E1E24" strokeWidth="3.5" fill="none" />
          {/* Mug body */}
          <rect x="2" y="2" width="21" height="22" rx="5" fill="#FAF7F2" stroke="#1E1E24" strokeWidth="3.5" />
          <rect x="6" y="9" width="13" height="8" rx="2.5" fill="#EC5A29" />
        </g>
      )}
    </svg>
  );
};

// ============================================================================
// 4. SPARKLE BURST & CONFETTI HELPERS
// ============================================================================
export const MiniSparkleBurst: React.FC<{ burstKey: number; color: string }> = ({ burstKey, color }) => {
  if (burstKey === 0) return null;
  const angles = [0, 45, 90, 135, 180, 225, 270, 315];
  const palette = [color, '#FBBF24', '#FFFFFF', '#4AE3B5', '#FF8AC2'];

  return (
    <div key={burstKey} className="pointer-events-none absolute inset-0 flex items-center justify-center z-30">
      {angles.map((deg, idx) => {
        const rad = (deg * Math.PI) / 180;
        const dist = 36 + (idx % 2) * 14;
        return (
          <motion.span
            key={deg}
            initial={{ x: 0, y: 0, scale: 1.1, opacity: 1 }}
            animate={{
              x: Math.cos(rad) * dist,
              y: Math.sin(rad) * dist,
              scale: 0,
              opacity: 0,
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ backgroundColor: palette[idx % palette.length] }}
            className="absolute w-2.5 h-2.5 rounded-full shadow-xs"
          />
        );
      })}
    </div>
  );
};

export const CelebrationConfetti: React.FC<{ active: boolean }> = ({ active }) => {
  if (!active) return null;
  const pieces = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    left: `${(i * 3.4 + (i % 4) * 2) % 98}%`,
    color: ['#FBBF24', '#EC5A29', '#158467', '#D8317E', '#2568EF', '#9D71E8', '#4AE3B5'][i % 7],
    size: 7 + (i % 4) * 2.5,
    delay: (i % 8) * 0.14,
    duration: 1.8 + (i % 5) * 0.35,
    drift: (i % 2 === 0 ? 1 : -1) * (14 + (i % 3) * 12),
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-20">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -16, x: 0, rotate: 0, opacity: 0 }}
          animate={{
            y: ['0%', '460%'],
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
            height: p.id % 2 === 0 ? p.size * 0.55 : p.size,
            backgroundColor: p.color,
            borderRadius: p.id % 3 === 0 ? '9999px' : '2px',
          }}
          className="absolute top-0"
        />
      ))}
    </div>
  );
};

// ============================================================================
// 5. STYLIZED HIGH-CONTRAST VECTOR QRIS CODE (WITH CENTER COFFEE EMBLEM)
// ============================================================================
export const StylizedQrisSvg: React.FC = () => {
  const matrixSize = 21;
  const cells: { x: number; y: number }[] = [];

  const isFinderZone = (x: number, y: number) =>
    (x < 7 && y < 7) || (x >= matrixSize - 7 && y < 7) || (x < 7 && y >= matrixSize - 7);
  const isCenterLogoZone = (x: number, y: number) => x >= 8 && x <= 12 && y >= 8 && y <= 12;

  for (let y = 0; y < matrixSize; y++) {
    for (let x = 0; x < matrixSize; x++) {
      if (isFinderZone(x, y) || isCenterLogoZone(x, y)) continue;
      const hash = ((x * 37 + y * 53 + x * y * 13) ^ (x * 7 + y * 11)) % 17;
      if (hash < 8 || (x === 6 && y % 2 === 0) || (y === 6 && x % 2 === 0)) {
        cells.push({ x, y });
      }
    }
  }

  const renderFinder = (ox: number, oy: number) => (
    <g transform={`translate(${ox * 10}, ${oy * 10})`}>
      <rect x="0" y="0" width="70" height="70" rx="12" fill="#1E1E24" />
      <rect x="10" y="10" width="50" height="50" rx="7" fill="#FFFFFF" />
      <rect x="20" y="20" width="30" height="30" rx="5" fill="#1E1E24" />
    </g>
  );

  return (
    <svg viewBox="0 0 210 210" className="w-full h-full block">
      <rect width="210" height="210" fill="#FFFFFF" />
      {renderFinder(0, 0)}
      {renderFinder(14, 0)}
      {renderFinder(0, 14)}

      {cells.map((c) => (
        <rect
          key={`${c.x}-${c.y}`}
          x={c.x * 10 + 1}
          y={c.y * 10 + 1}
          width="8"
          height="8"
          rx="2.2"
          fill="#1E1E24"
        />
      ))}

      {/* Center Mascot/Coffee Emblem */}
      <rect x="76" y="76" width="58" height="58" rx="14" fill="#FAF7F2" stroke="#1E1E24" strokeWidth="4" />
      <rect x="85" y="85" width="40" height="40" rx="10" fill="#FBBF24" />
      <rect x="96" y="97" width="5" height="12" rx="2.5" fill="#1E1E24" />
      <rect x="109" y="97" width="5" height="12" rx="2.5" fill="#1E1E24" />
      <path d="M98,115 Q105,120 112,115" stroke="#1E1E24" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
};

// ============================================================================
// 6. <PlayfulPartyFooter /> — SENSIBLE FOOTER + INTERACTIVE MASCOT PLAYGROUND
// ============================================================================
interface PlaygroundMascotState {
  bubble: string | null;
  burstKey: number;
  squishKey: number;
}

interface MascotVariant {
  shape: MascotShape;
  color: string;
  name: string;
  glasses?: boolean;
  coffeeCup?: boolean;
}

const BOUNCER_VARIANTS: MascotVariant[] = [
  { shape: 'circle', color: '#D8317E', name: 'Boba' },
  { shape: 'cloud', color: '#158467', name: 'Kiko' },
  { shape: 'blob', color: '#65A30D', name: 'Juno' },
];

const CHASER_VARIANTS: MascotVariant[] = [
  { shape: 'squircle', color: '#2568EF', name: 'Zuzu' },
  { shape: 'circle', color: '#EA580C', name: 'Bimi', glasses: true },
  { shape: 'triangle', color: '#D8317E', name: 'Riri' },
];

const JUGGLER_VARIANTS: MascotVariant[] = [
  { shape: 'triangle', color: '#EC5A29', name: 'Piko' },
  { shape: 'squircle', color: '#7C3AED', name: 'Nori', coffeeCup: true },
  { shape: 'circle', color: '#0284C7', name: 'Toto' },
];

const CHILLER_VARIANTS: MascotVariant[] = [
  { shape: 'blob', color: '#9D71E8', name: 'Momo' },
  { shape: 'cloud', color: '#2568EF', name: 'Lilo' },
  { shape: 'squircle', color: '#B45309', name: 'Kopi' },
];

interface RoamingBotState {
  walkX: number;
  dir: 1 | -1;
  hopping: boolean;
  variantIdx: number;
  swapping: boolean;
}

export const PlayfulPartyFooter: React.FC<{
  muted: boolean;
  onToggleMute: () => void;
  onOpenGuideModal: () => void;
  onOpenDevModal: () => void;
  onOpenQrisModal: () => void;
  onSelectGame: (gameId: string) => void;
}> = ({
  muted,
  onToggleMute,
  onOpenGuideModal,
  onOpenDevModal,
  onOpenQrisModal,
  onSelectGame,
}) => {
  const [peekDucking, setPeekDucking] = useState(false);
  const [peekBubble, setPeekBubble] = useState<string | null>(null);
  const [peekLook, setPeekLook] = useState(0);
  const [peekBurst, setPeekBurst] = useState(0);

  // Autonomous Hallway Roaming & Self-Swapping State
  const [roam, setRoam] = useState<{
    bouncer: RoamingBotState;
    chaser: RoamingBotState;
    juggler: RoamingBotState;
    chiller: RoamingBotState;
  }>({
    bouncer: { walkX: 0, dir: 1, hopping: false, variantIdx: 0, swapping: false },
    chaser: { walkX: 0, dir: 1, hopping: false, variantIdx: 0, swapping: false },
    juggler: { walkX: 0, dir: -1, hopping: false, variantIdx: 0, swapping: false },
    chiller: { walkX: 0, dir: -1, hopping: false, variantIdx: 0, swapping: false },
  });

  // Interactive Physics & Prank States
  const [isLifted, setIsLifted] = useState(false);
  const [justDropped, setJustDropped] = useState(false);

  const [ballX, setBallX] = useState(28);
  const [chaserX, setChaserX] = useState(0);
  const [isChasingBall, setIsChasingBall] = useState(false);

  const [isPranked, setIsPranked] = useState(false);
  const [prankRotation, setPrankRotation] = useState(0);
  const [starStolen, setStarStolen] = useState(false);

  const [chillerAngry, setChillerAngry] = useState(false);
  const [chillerShakeKey, setChillerShakeKey] = useState(0);

  const [botStates, setBotStates] = useState<Record<string, PlaygroundMascotState>>({
    bouncer: { bubble: null, burstKey: 0, squishKey: 0 },
    chaser: { bubble: null, burstKey: 0, squishKey: 0 },
    juggler: { bubble: null, burstKey: 0, squishKey: 0 },
    chiller: { bubble: null, burstKey: 0, squishKey: 0 },
  });

  const activeBouncer = BOUNCER_VARIANTS[roam.bouncer.variantIdx];
  const activeChaser = CHASER_VARIANTS[roam.chaser.variantIdx];
  const activeJuggler = JUGGLER_VARIANTS[roam.juggler.variantIdx];
  const activeChiller = CHILLER_VARIANTS[roam.chiller.variantIdx];

  useEffect(() => {
    const id = window.setInterval(() => {
      setPeekLook((prev) => (prev === 0 ? 4 : prev === 4 ? -4 : 0));
    }, 2600);
    return () => clearInterval(id);
  }, []);

  // Autonomous Hallway Walking, Hopping & Character Cycling Loop
  useEffect(() => {
    let stepCount = 0;
    const slots: Array<'bouncer' | 'chaser' | 'juggler' | 'chiller'> = [
      'bouncer',
      'chaser',
      'juggler',
      'chiller',
    ];

    const intervalId = window.setInterval(() => {
      stepCount += 1;

      setRoam((prev) => {
        const next = { ...prev };

        slots.forEach((slot, idx) => {
          // Skip autonomous step if user is actively interacting with this mascot
          if (slot === 'bouncer' && (isLifted || justDropped)) return;
          if (slot === 'chaser' && isChasingBall) return;
          if (slot === 'juggler' && isPranked) return;
          if (slot === 'chiller' && chillerAngry) return;

          const cur = prev[slot];
          if (cur.swapping) return;

          // Every few ticks, one slot walks into the hallway door and swaps to a new mascot!
          const shouldSwap = stepCount % 7 === idx + 1;
          if (shouldSwap) {
            next[slot] = {
              ...cur,
              swapping: true,
              hopping: true,
              walkX: cur.dir * 52,
            };

            setTimeout(() => {
              setRoam((latest) => ({
                ...latest,
                [slot]: {
                  walkX: 0,
                  dir: (latest[slot].dir * -1) as 1 | -1,
                  hopping: false,
                  variantIdx: (latest[slot].variantIdx + 1) % 3,
                  swapping: false,
                },
              }));
            }, 420);
            return;
          }

          // Normal autonomous walk & hop along the hallway
          const stepDelta = (14 + ((stepCount + idx * 5) % 16)) * cur.dir;
          let nextX = cur.walkX + stepDelta;
          let nextDir = cur.dir;
          const limit = slot === 'chiller' ? 24 : 36;

          if (nextX > limit) {
            nextX = limit;
            nextDir = -1;
          } else if (nextX < -limit) {
            nextX = -limit;
            nextDir = 1;
          }

          next[slot] = {
            ...cur,
            walkX: nextX,
            dir: nextDir,
            hopping: true,
          };

          // Reset hop state after bounce finishes
          setTimeout(() => {
            setRoam((latest) => ({
              ...latest,
              [slot]: { ...latest[slot], hopping: false },
            }));
          }, 360);
        });

        return next;
      });
    }, 1500);

    return () => clearInterval(intervalId);
  }, [isLifted, justDropped, isChasingBall, isPranked, chillerAngry]);

  const showBotBubble = (id: string, text: string, duration = 2200, burst = true) => {
    setBotStates((prev) => ({
      ...prev,
      [id]: {
        bubble: text,
        burstKey: burst ? prev[id].burstKey + 1 : prev[id].burstKey,
        squishKey: prev[id].squishKey + 1,
      },
    }));
    setTimeout(() => {
      setBotStates((prev) => ({
        ...prev,
        [id]: { ...prev[id], bubble: null },
      }));
    }, duration);
  };

  // 1. Lift & Drop Mechanic (Mascot 1)
  const handleLiftStart = () => {
    sfx.playBoing(220, 620);
    setIsLifted(true);
    setJustDropped(false);
    const panicPhrases = [
      'WAAAH TURUNIN GUA!! 😱',
      'Tinggi banget tolonggg! 🛸',
      'Jangan dilepas woi!! 😭',
    ];
    showBotBubble(
      'bouncer',
      panicPhrases[Math.floor(Math.random() * panicPhrases.length)],
      2400,
      false
    );
  };

  const handleLiftEnd = () => {
    sfx.playBoing(560, 175);
    setIsLifted(false);
    setJustDropped(true);
    const dropPhrases = [
      'Aduh bokong gua! 😵‍💫',
      'Buset puyeng mendarat! 🌀',
      'Untung empuk! 🫧',
    ];
    showBotBubble(
      'bouncer',
      dropPhrases[Math.floor(Math.random() * dropPhrases.length)],
      2200,
      true
    );
    setTimeout(() => setJustDropped(false), 1800);
  };

  // 2. Throw Ball & Bot Chases Mechanic (Mascot 2)
  const triggerBallThrow = (newBallX: number) => {
    const clampedX = Math.max(-135, Math.min(165, newBallX));
    sfx.playPop(680);
    setBallX(clampedX);
    setIsChasingBall(true);
    const chasePhrases = [
      'BOLA!! KEJARRR! 🏃💨',
      'Oper sini woi! ⚡',
      'Gua kejar sampe dapet! ⚽',
    ];
    showBotBubble(
      'chaser',
      chasePhrases[Math.floor(Math.random() * chasePhrases.length)],
      2000,
      false
    );

    // Bot chases the ball slightly after it lands
    setTimeout(() => {
      const targetBotX = clampedX >= 0 ? Math.max(0, clampedX - 30) : Math.min(0, clampedX + 30);
      setChaserX(targetBotX);
      sfx.playPop(520);
    }, 180);

    setTimeout(() => {
      setIsChasingBall(false);
      showBotBubble('chaser', 'Dapet bolanya! Lempar lagi! ⚽✨', 1900, true);
    }, 750);
  };

  // 3. Prank / Steal Star / Spin Upside Down Mechanic (Mascot 3)
  const triggerPrankJuggler = (reason: 'star' | 'spin') => {
    sfx.playBoing(480, 240);
    setIsPranked(true);
    setPrankRotation((prev) => prev + (reason === 'star' ? 180 : 360));
    if (reason === 'star') setStarStolen(true);

    const prankPhrases =
      reason === 'star'
        ? ['WOI BINTANG GUA DICOLONG!! 😭', 'Balikin bintang gua!! ⭐💢']
        : ['PUYENG WOI DIPUTER-PUTER!! 🌀', 'Jangan dijahili napa!! 😵‍💫'];

    showBotBubble(
      'juggler',
      prankPhrases[Math.floor(Math.random() * prankPhrases.length)],
      2500,
      true
    );

    setTimeout(() => {
      setIsPranked(false);
      setStarStolen(false);
      setPrankRotation(0);
    }, 2300);
  };

  // 4. Disturb Headphone Bot -> Red Forehead Gradient & Rage (Mascot 4)
  const triggerDisturbChiller = () => {
    sfx.playAngryBuzz();
    setChillerAngry(true);
    setChillerShakeKey((k) => k + 1);
    const angryPhrases = [
      'WOI LAGI VIBING JANGAN DIGANGGU!! 💢🔥',
      'HEADSET GUA JANGAN DITARIK!! 😡',
      'LAGI ENAK DENGER LAGU!! 💢',
      'BERISIK AMAT SIH LU!! 🔥',
    ];
    showBotBubble(
      'chiller',
      angryPhrases[Math.floor(Math.random() * angryPhrases.length)],
      3200,
      true
    );
    setTimeout(() => {
      setChillerAngry(false);
    }, 3200);
  };

  const handlePeekInteract = () => {
    sfx.playPop(640);
    const phrases = ['Hai! 👋', 'Ayo main!', 'Boop! 😆', 'Ngopi yuk ☕', 'Cilukba!'];
    const nextPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    setPeekBubble(nextPhrase);
    setPeekDucking(true);
    setPeekBurst((k) => k + 1);
    setTimeout(() => setPeekDucking(false), 380);
    setTimeout(() => setPeekBubble(null), 1900);
  };

  return (
    <footer id="playful-party-footer" className="relative mt-20 sm:mt-24 pt-10">
      {/* PEEKING MASCOT POPPING UP FROM BEHIND THE SCALLOPED TOP BORDER */}
      <div className="max-w-5xl mx-auto px-6 relative h-0">
        <div className="absolute right-8 sm:right-20 -top-[58px] z-10 flex flex-col items-center">
          <AnimatePresence>
            {peekBubble && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.7 }}
                animate={{ opacity: 1, y: -12, scale: 1 }}
                exit={{ opacity: 0, y: -18, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 420, damping: 20 }}
                className="mb-1 px-3.5 py-1.5 rounded-2xl bg-[#FBBF24] text-[#1E1E24] font-display font-bold text-xs sm:text-sm border-2 border-[#1E1E24] shadow-[0_3px_0_#1E1E24] whitespace-nowrap"
              >
                {peekBubble}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="button"
            onClick={handlePeekInteract}
            onMouseEnter={() => {
              if (!peekBubble) setPeekBubble('Hai! Klik aku!');
            }}
            onMouseLeave={() => {
              if (peekBubble === 'Hai! Klik aku!') setPeekBubble(null);
            }}
            animate={{
              y: peekDucking ? 26 : 0,
              scaleY: peekDucking ? 0.82 : 1,
              scaleX: peekDucking ? 1.14 : 1,
            }}
            transition={{ type: 'spring', stiffness: 420, damping: 16 }}
            aria-label="Mascot mengintip"
            className="relative cursor-pointer focus:outline-none hover:-translate-y-1 transition-transform"
          >
            <MiniSparkleBurst burstKey={peekBurst} color="#4AE3B5" />
            <GrokMascot
              shape="cloud"
              color="#158467"
              size={84}
              mood={peekDucking ? 'happy' : 'idle'}
              lookX={peekLook}
              stickerBorder
            />
          </motion.button>
        </div>
      </div>

      {/* PLAYFUL SCALLOPED / WAVED TOP EDGE WITH TACTILE DEEP INK BORDER */}
      <div className="relative z-20 w-full overflow-hidden leading-none -mb-[2px]">
        <svg
          viewBox="0 0 1200 58"
          preserveAspectRatio="none"
          className="w-full h-9 sm:h-12 block"
        >
          <path
            d="M0,34 C50,6 100,6 150,34 C200,6 250,6 300,34 C350,6 400,6 450,34 C500,6 550,6 600,34 C650,6 700,6 750,34 C800,6 850,6 900,34 C950,6 1000,6 1050,34 C1100,6 1150,6 1200,34 L1200,58 L0,58 Z"
            fill="#1E1E24"
          />
          <path
            d="M0,34 C50,6 100,6 150,34 C200,6 250,6 300,34 C350,6 400,6 450,34 C500,6 550,6 600,34 C650,6 700,6 750,34 C800,6 850,6 900,34 C950,6 1000,6 1050,34 C1100,6 1150,6 1200,34"
            fill="none"
            stroke="#FBBF24"
            strokeWidth="4"
            strokeDasharray="10 14"
            strokeLinecap="round"
            opacity="0.7"
          />
        </svg>
      </div>

      {/* MAIN DEEP INK FOOTER BODY */}
      <div className="relative z-20 bg-[#1E1E24] text-[#FAF7F2] pt-6 pb-24 sm:pb-14 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* ============================================================== */}
          {/* INTERACTIVE MASCOT PLAYGROUND TRACK (LORONG OTOMATIS)          */}
          {/* ============================================================== */}
          <div className="rounded-[28px] bg-[#FAF7F2] text-[#1E1E24] border-[3px] border-[#FBBF24]/80 p-4 sm:p-5 shadow-[0_7px_0_#0D0D11] relative overflow-hidden">
            {/* Top Bar: Badge & Interactive Hints (No manual buttons) */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E1E24] text-[#FAF7F2] text-xs font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" />
                <span>Mascot Playground</span>
              </div>

              <span className="text-xs font-bold text-[#64616C]">
                ✋ Angkat mascot • ⚽ Lempar bola • ⭐ Jahili bintang • 🎧 Ganggu yang headset!
              </span>
            </div>

            {/* Autonomous Long Hallway Stage */}
            <div className="relative h-36 sm:h-40 rounded-[22px] bg-[#F2ECE1] border-2 border-dashed border-[#1E1E24]/15 overflow-hidden flex items-end justify-around px-3 sm:px-8 pb-3.5 select-none">
              {/* HallwayFloor Strip */}
              <div className="absolute inset-x-0 bottom-0 h-5 bg-[#E6DDD0] border-t border-[#1E1E24]/10 flex items-center justify-around px-6">
                <div className="w-8 h-1 rounded-full bg-[#1E1E24]/8" />
                <div className="w-8 h-1 rounded-full bg-[#1E1E24]/8" />
                <div className="w-8 h-1 rounded-full bg-[#1E1E24]/8" />
                <div className="w-8 h-1 rounded-full bg-[#1E1E24]/8" />
              </div>

              <div className="w-full flex items-end justify-around z-10">
                {/* ========================================================== */}
                {/* MASCOT 1: LIFTABLE & DROPPABLE (JALAN & LOMPAT SENDIRI)    */}
                {/* ========================================================== */}
                <div className="relative flex flex-col items-center z-20">
                  <AnimatePresence>
                    {botStates.bouncer.bubble && (
                      <motion.span
                        initial={{ opacity: 0, y: 6, scale: 0.7 }}
                        animate={{ opacity: 1, y: -10, scale: 1 }}
                        exit={{ opacity: 0, y: -16 }}
                        style={{ backgroundColor: activeBouncer.color }}
                        className="absolute -top-11 px-2.5 py-1 rounded-xl text-white font-display font-bold text-xs whitespace-nowrap shadow-sm border-2 border-[#1E1E24] z-30 pointer-events-none"
                      >
                        {botStates.bouncer.bubble}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  <motion.div
                    animate={{
                      x: isLifted ? 0 : roam.bouncer.walkX,
                      y: isLifted ? 0 : roam.bouncer.hopping ? -14 : 0,
                      opacity: roam.bouncer.swapping ? 0 : 1,
                      scale: roam.bouncer.swapping ? 0.7 : 1,
                    }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                    className="flex flex-col items-center"
                  >
                    <motion.div
                      drag
                      dragSnapToOrigin
                      dragElastic={0.85}
                      dragConstraints={{ top: -85, bottom: 10, left: -60, right: 60 }}
                      onDragStart={handleLiftStart}
                      onDragEnd={handleLiftEnd}
                      onClick={() => {
                        if (!isLifted) {
                          sfx.playBoing(300, 620);
                          showBotBubble('bouncer', 'Tarik & angkat aku ke atas! ✋🫧', 1900, true);
                        }
                      }}
                      animate={
                        isLifted
                          ? { rotate: [-8, 8, -8, 8, 0], scale: 1.1 }
                          : justDropped
                          ? { scaleX: [1.32, 0.88, 1], scaleY: [0.68, 1.14, 1] }
                          : { rotate: roam.bouncer.hopping ? roam.bouncer.dir * 6 : 0, scale: 1 }
                      }
                      transition={{ duration: 0.35 }}
                      whileHover={{ y: -5, scale: 1.05 }}
                      className="relative cursor-grab active:cursor-grabbing focus:outline-none"
                      title="Drag angkat mascot ini ke atas lalu lepaskan!"
                    >
                      <MiniSparkleBurst burstKey={botStates.bouncer.burstKey} color={activeBouncer.color} />
                      <GrokMascot
                        shape={activeBouncer.shape}
                        color={activeBouncer.color}
                        size={62}
                        mood={isLifted ? 'surprised' : justDropped ? 'dizzy' : 'happy'}
                        lookX={roam.bouncer.dir * 3}
                      />
                    </motion.div>

                    {/* Dynamic Floor Shadow */}
                    <motion.div
                      animate={{
                        scale: isLifted ? 0.45 : roam.bouncer.hopping ? 0.7 : 1,
                        opacity: isLifted ? 0.2 : 0.4,
                      }}
                      className="w-10 h-1.5 rounded-full bg-[#1E1E24] -mt-1 pointer-events-none"
                    />
                  </motion.div>
                </div>

                {/* ========================================================== */}
                {/* MASCOT 2: BALL CHASER + THROWABLE BALL (LEMPAR BOLA)       */}
                {/* ========================================================== */}
                <div className="relative flex flex-col items-center z-20">
                  <AnimatePresence>
                    {botStates.chaser.bubble && (
                      <motion.span
                        initial={{ opacity: 0, y: 6, scale: 0.7 }}
                        animate={{ opacity: 1, y: -10, scale: 1 }}
                        exit={{ opacity: 0, y: -16 }}
                        style={{ backgroundColor: activeChaser.color }}
                        className="absolute -top-11 px-2.5 py-1 rounded-xl text-white font-display font-bold text-xs whitespace-nowrap shadow-sm border-2 border-[#1E1E24] z-30 pointer-events-none"
                      >
                        {botStates.chaser.bubble}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  <div className="relative flex items-end">
                    {/* Chaser Bot walks & hops autonomously OR sprints to chase thrown ball */}
                    <motion.div
                      animate={{
                        x: isChasingBall ? chaserX : chaserX + roam.chaser.walkX * 0.6,
                        y: isChasingBall ? [0, -12, 0] : roam.chaser.hopping ? -11 : 0,
                        rotate: isChasingBall
                          ? ballX >= chaserX
                            ? 8
                            : -8
                          : roam.chaser.hopping
                          ? roam.chaser.dir * 5
                          : 0,
                        opacity: roam.chaser.swapping ? 0 : 1,
                        scale: roam.chaser.swapping ? 0.7 : 1,
                      }}
                      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                      onClick={() => {
                        const nextSpot = ballX > 40 ? -95 : 110;
                        triggerBallThrow(nextSpot);
                      }}
                      className="relative cursor-pointer"
                      title="Klik atau lempar bolanya biar dikejar!"
                    >
                      <MiniSparkleBurst burstKey={botStates.chaser.burstKey} color={activeChaser.color} />
                      <GrokMascot
                        shape={activeChaser.shape}
                        color={activeChaser.color}
                        size={64}
                        mood={isChasingBall ? 'excited' : 'idle'}
                        glasses={activeChaser.glasses}
                        lookX={ballX > chaserX ? 4 : ballX < chaserX ? -4 : roam.chaser.dir * 3}
                      />
                    </motion.div>

                    {/* Draggable / Throwable Ball */}
                    <motion.div
                      drag="x"
                      dragMomentum={false}
                      dragElastic={0.2}
                      dragConstraints={{ left: -140, right: 170 }}
                      animate={{
                        x: isChasingBall ? ballX : ballX + roam.chaser.walkX * 0.45,
                        rotate: (isChasingBall ? ballX : ballX + roam.chaser.walkX) * 4,
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                      onDragEnd={(_, info) => {
                        const thrownX = ballX + info.offset.x + info.velocity.x * 0.12;
                        triggerBallThrow(thrownX);
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        const kickX = ballX >= 30 ? -110 : 125;
                        triggerBallThrow(kickX);
                      }}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      title="Drag & lempar bola ini ke kiri/kanan!"
                      className="w-6 h-6 rounded-full bg-[#FBBF24] border-2 border-[#1E1E24] mb-1.5 shadow-[0_2px_0_#1E1E24] cursor-grab active:cursor-grabbing flex items-center justify-center text-xs z-30"
                    />
                  </div>
                </div>

                {/* ========================================================== */}
                {/* MASCOT 3: PRANKABLE / JAHILI (JALAN & LOMPAT + BINTANG)    */}
                {/* ========================================================== */}
                <div className="relative flex flex-col items-center z-20">
                  <AnimatePresence>
                    {botStates.juggler.bubble && (
                      <motion.span
                        initial={{ opacity: 0, y: 6, scale: 0.7 }}
                        animate={{ opacity: 1, y: -10, scale: 1 }}
                        exit={{ opacity: 0, y: -16 }}
                        style={{ backgroundColor: activeJuggler.color }}
                        className="absolute -top-11 px-2.5 py-1 rounded-xl text-white font-display font-bold text-xs whitespace-nowrap shadow-sm border-2 border-[#1E1E24] z-30 pointer-events-none"
                      >
                        {botStates.juggler.bubble}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  <motion.div
                    animate={{
                      x: isPranked ? 0 : roam.juggler.walkX,
                      y: isPranked ? -8 : roam.juggler.hopping ? -13 : 0,
                      opacity: roam.juggler.swapping ? 0 : 1,
                      scale: roam.juggler.swapping ? 0.7 : 1,
                    }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                    className="flex flex-col items-center"
                  >
                    {/* Draggable Floating Star */}
                    <motion.div
                      drag
                      dragSnapToOrigin
                      dragElastic={0.9}
                      onDragStart={() => triggerPrankJuggler('star')}
                      onClick={() => triggerPrankJuggler('star')}
                      animate={
                        starStolen
                          ? { scale: 1.3, rotate: 145 }
                          : { y: roam.juggler.hopping ? -5 : 0, rotate: 0, scale: 1 }
                      }
                      className="mb-1 text-[#FBBF24] cursor-grab active:cursor-grabbing z-30"
                      title="Drag / curi bintangnya buat jahilin mascot ini!"
                    >
                      <Star className="w-5 h-5 fill-[#FBBF24] stroke-[#1E1E24]" strokeWidth={2.5} />
                    </motion.div>

                    <motion.div
                      drag
                      dragSnapToOrigin
                      dragElastic={0.6}
                      onDragStart={() => triggerPrankJuggler('spin')}
                      onClick={() => triggerPrankJuggler('spin')}
                      animate={{
                        rotate: isPranked ? prankRotation : roam.juggler.hopping ? roam.juggler.dir * 5 : 0,
                      }}
                      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                      whileHover={{ y: -5, rotate: -6 }}
                      className="relative cursor-grab active:cursor-grabbing focus:outline-none"
                      title="Klik atau drag buat puter-puter & jahilin mascot ini!"
                    >
                      <MiniSparkleBurst burstKey={botStates.juggler.burstKey} color={activeJuggler.color} />
                      <GrokMascot
                        shape={activeJuggler.shape}
                        color={activeJuggler.color}
                        size={62}
                        mood={isPranked ? 'dizzy' : 'excited'}
                        coffeeCup={activeJuggler.coffeeCup}
                        lookX={roam.juggler.dir * 3}
                      />
                    </motion.div>
                  </motion.div>
                </div>

                {/* ========================================================== */}
                {/* MASCOT 4: HEADSET BOT (MARAH & DAHI GRADIENT MERAH)        */}
                {/* ========================================================== */}
                <div className="relative flex flex-col items-center z-20">
                  <AnimatePresence>
                    {botStates.chiller.bubble && (
                      <motion.span
                        initial={{ opacity: 0, y: 6, scale: 0.7 }}
                        animate={{ opacity: 1, y: -10, scale: 1 }}
                        exit={{ opacity: 0, y: -16 }}
                        className={`absolute -top-11 right-0 sm:right-auto px-2.5 py-1 rounded-xl text-white font-display font-bold text-xs whitespace-nowrap shadow-sm border-2 border-[#1E1E24] z-30 pointer-events-none ${
                          chillerAngry ? 'bg-[#DC2626]' : 'bg-[#9D71E8]'
                        }`}
                      >
                        {botStates.chiller.bubble}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  <motion.div
                    animate={{
                      x: chillerAngry ? 0 : roam.chiller.walkX,
                      y: chillerAngry ? 0 : roam.chiller.hopping ? -8 : 0,
                      opacity: roam.chiller.swapping ? 0 : 1,
                      scale: roam.chiller.swapping ? 0.7 : 1,
                    }}
                    transition={{ type: 'spring', stiffness: 240, damping: 20 }}
                    className="relative flex flex-col items-center"
                  >
                    <span
                      className={`absolute -top-5 right-0 font-display font-bold text-xs pointer-events-none ${
                        chillerAngry ? 'text-[#DC2626] animate-bounce' : 'text-[#9D71E8]'
                      }`}
                    >
                      {chillerAngry ? '💢🔥' : 'zZz'}
                    </span>

                    <motion.div
                      key={`chiller-${chillerShakeKey}`}
                      drag
                      dragSnapToOrigin
                      dragElastic={0.5}
                      onDragStart={triggerDisturbChiller}
                      onClick={triggerDisturbChiller}
                      animate={
                        chillerAngry
                          ? { x: [-6, 6, -6, 6, -4, 4, 0], y: [0, -8, 0], scale: 1.08 }
                          : { x: 0, y: 0, scale: 1 }
                      }
                      transition={{ duration: 0.45 }}
                      whileHover={{ y: -4, scale: 1.05 }}
                      className="relative cursor-pointer focus:outline-none"
                      title="Klik atau tarik headsetnya buat gangguin dia!"
                    >
                      <MiniSparkleBurst
                        burstKey={botStates.chiller.burstKey}
                        color={chillerAngry ? '#DC2626' : activeChiller.color}
                      />
                      <GrokMascot
                        shape={activeChiller.shape}
                        color={activeChiller.color}
                        size={64}
                        mood={chillerAngry ? 'angry' : 'chill'}
                        foreheadAngry={chillerAngry}
                        headphones
                        lookX={roam.chiller.dir * 2}
                      />
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* SENSIBLE, WELL-STRUCTURED 3-COLUMN FOOTER CONTENT              */}
          {/* ============================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-2">
            {/* Column 1: Brand & Offline Status Pills */}
            <div className="md:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2.5">
                <span className="w-10 h-10 rounded-2xl bg-[#FBBF24] text-[#1E1E24] flex items-center justify-center shadow-[0_4px_0_#C49B10] font-display font-bold">
                  <Gamepad2 className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="font-display text-2xl font-bold leading-none text-[#FAF7F2]">
                    Party Games Hub!
                  </h2>
                  <span className="text-xs font-bold text-[#4AE3B5] tracking-wide">
                    PARTY GAMES EDITION
                  </span>
                </div>
              </div>

              <p className="text-sm text-[#FAF7F2]/80 font-medium leading-relaxed max-w-sm">
                Satu layar untuk rame-rame. Bikin tongkrongan, jeda kuliah, dan kumpul bareng makin pecah!
              </p>

              {/* Status Pills */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-[#4AE3B5]">
                  <WifiOff className="w-3.5 h-3.5" />
                  <span>Main Offline / HP</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-[#FBBF24]">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Tanpa Login</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-[#FF8AC2]">
                  <HardDrive className="w-3.5 h-3.5" />
                  <span>Langsung Main</span>
                </span>
              </div>
            </div>

            {/* Column 2: Daftar Game */}
            <div className="md:col-span-4 space-y-3.5">
              <h3 className="font-display text-base font-bold text-[#FBBF24] uppercase tracking-wider">
                Daftar Game
              </h3>
              <ul className="space-y-2">
                {FOOTER_GAMES_LIST.map((game) => (
                  <li key={game.id}>
                    <button
                      type="button"
                      onClick={() => {
                        sfx.playPop(580);
                        onSelectGame(game.id);
                      }}
                      className="group w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 hover:bg-white/12 transition text-left cursor-pointer"
                    >
                      <span className="flex items-center gap-2.5 text-sm font-bold text-[#FAF7F2] group-hover:translate-x-0.5 transition-transform">
                        <span
                          style={{ backgroundColor: game.color }}
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                        />
                        <span>{game.name}</span>
                      </span>
                      <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-white/15 text-white/85">
                        {game.tag}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Navigasi & Bantuan */}
            <div className="md:col-span-3 space-y-3.5">
              <h3 className="font-display text-base font-bold text-[#4AE3B5] uppercase tracking-wider">
                Navigasi &amp; Bantuan
              </h3>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sfx.playPop();
                    onOpenGuideModal();
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-white/8 hover:bg-white/15 text-sm font-bold text-left flex items-center gap-2.5 transition cursor-pointer"
                >
                  <Info className="w-4 h-4 text-[#60A5FA]" />
                  <span>Cara Main Singkat</span>
                </button>

                <button
                  type="button"
                  onClick={onToggleMute}
                  className="px-3.5 py-2.5 rounded-xl bg-white/8 hover:bg-white/15 text-sm font-bold text-left flex items-center justify-between transition cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    {muted ? (
                      <VolumeX className="w-4 h-4 text-[#F43F5E]" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-[#4AE3B5]" />
                    )}
                    <span>Sound FX</span>
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase ${
                      muted ? 'bg-[#F43F5E]/20 text-[#FDA4AF]' : 'bg-[#158467]/40 text-[#4AE3B5]'
                    }`}
                  >
                    {muted ? 'OFF' : 'ON'}
                  </span>
                </button>

                {/* Soft-selling compact buttons for Developer Info & Coffee */}
                <div className="grid grid-cols-2 gap-2 pt-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      sfx.playPop();
                      onOpenDevModal();
                    }}
                    className="px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/12 border border-white/10 text-xs font-bold text-white/75 hover:text-white flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Code2 className="w-3.5 h-3.5 text-[#C4B5FD]" />
                    <span>Info Dev</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sfx.playCoffeeChime();
                      onOpenQrisModal();
                    }}
                    className="px-2.5 py-2 rounded-xl bg-[#FBBF24]/12 hover:bg-[#FBBF24]/22 border border-[#FBBF24]/30 text-xs font-bold text-[#FBBF24] flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Coffee className="w-3.5 h-3.5" />
                    <span>Traktir Kopi</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* BOTTOM CENTERED COPYRIGHT & CREDITS (NO EXTERNAL LINKS)        */}
          {/* ============================================================== */}
          <div className="pt-6 border-t border-white/12 flex flex-col items-center justify-center text-center gap-2">
            <div className="inline-flex items-center justify-center gap-2 text-xs text-white/80 font-bold">
              <span>© 2026 Party Games Hub</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#158467] text-white font-display font-bold text-xs">
                v2.0
              </span>
            </div>
            <p className="text-xs text-white/65 font-medium max-w-2xl leading-relaxed">
              Dibuat dengan kopi tengah malam, pecut AI, serta 8 matkul UAS yang ditelantarkan oleh{' '}
              <span className="text-[#FBBF24] font-bold">Fajarahnf.dev</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ============================================================================
// 7. <DeveloperCornerButton /> — FIXED BOTTOM-RIGHT FLOATING PILL BUTTON
// ============================================================================
export const DeveloperCornerButton: React.FC<{
  onClick: () => void;
}> = ({ onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end">
      {/* Hover Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 420, damping: 22 }}
            className="mb-2 px-3.5 py-1.5 rounded-2xl bg-[#FBBF24] text-[#1E1E24] font-display font-bold text-xs border-2 border-[#1E1E24] shadow-[0_4px_0_#1E1E24] whitespace-nowrap pointer-events-none"
          >
            Kenalan sama Developer! 👋
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tactile 3D Floating Pill Button */}
      <motion.button
        type="button"
        onClick={() => {
          sfx.playPop(620);
          onClick();
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3.0, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96, y: 3 }}
        className="group flex items-center gap-2.5 pl-2 pr-4 py-1.5 rounded-full bg-[#FAF7F2] text-[#1E1E24] border-[3px] border-[#1E1E24] shadow-[0_6px_0_#1E1E24,0_12px_24px_rgba(30,30,36,0.2)] hover:bg-white cursor-pointer"
        aria-label="Buka Info Developer Fajarahnf"
      >
        <div className="w-10 h-10 rounded-full bg-[#2568EF]/15 flex items-center justify-center shrink-0">
          <GrokMascot
            shape="squircle"
            color="#2568EF"
            size={36}
            mood={hovered ? 'happy' : 'idle'}
            glasses
            coffeeCup
            stickerBorder={false}
          />
        </div>
        <div className="text-left leading-tight">
          <span className="block text-xs font-extrabold uppercase tracking-wider text-[#158467]">
            Info Dev
          </span>
          <span className="font-display font-bold text-sm text-[#1E1E24] flex items-center gap-1">
            <span>Fajarahnf</span>
            <span className="w-2 h-2 rounded-full bg-[#158467] animate-pulse" />
          </span>
        </div>
      </motion.button>
    </div>
  );
};

// ============================================================================
// 8A. <PartyGuideModal /> — GENERAL PARTY GAMES HUB GUIDE & GAMEPLAY CARD
// ============================================================================
export const PartyGuideModal: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const [activeTab, setActiveTab] = useState<'features' | 'limits'>('features');

  useEffect(() => {
    if (open) setActiveTab('features');
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-[#1E1E24]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 18 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-[#FAF7F2] rounded-[34px] border-[3.5px] border-[#1E1E24] shadow-[0_12px_0_#1E1E24] overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* MODAL HEADER: GENERAL PARTY GAMES HUB */}
            <div className="relative bg-[#158467] text-[#FAF7F2] px-5 sm:px-6 pt-6 pb-5">
              <button
                type="button"
                onClick={() => {
                  sfx.playPop(460);
                  onClose();
                }}
                aria-label="Tutup panduan Party Games Hub"
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/20 hover:bg-black/35 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 pr-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[24px] bg-[#FAF7F2] border-[3px] border-[#FBBF24] flex items-center justify-center shrink-0 shadow-md">
                  <GrokMascot
                    shape="cloud"
                    color="#158467"
                    size={64}
                    mood="happy"
                    stickerBorder={false}
                  />
                </div>

                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#1E1E24] text-[#FBBF24] text-xs font-extrabold uppercase tracking-wider mb-1.5">
                    <span>Party Games Hub • Panduan Umum</span>
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold leading-tight">
                    Cara Main &amp; Fitur
                  </h2>
                </div>
              </div>
            </div>

            {/* SCROLLABLE BODY */}
            <div className="p-5 sm:p-6 space-y-5 overflow-y-auto custom-scroll">
              <div className="rounded-[22px] bg-white border-2 border-[#1E1E24]/10 p-4 shadow-[0_4px_0_rgba(30,30,36,0.06)]">
                <p className="text-xs sm:text-sm text-[#1E1E24] font-semibold leading-relaxed">
                  Selamat datang di <strong className="text-[#158467]">Party Games Hub!</strong> Platform party game seru untuk bikin momen nongkrong, jeda kuliah, dan kumpul bareng makin pecah cukup bermodal <strong>1 layar rame-rame</strong> atau gabung lewat HP!
                </p>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 p-1.5 rounded-[20px] bg-[#F2ECE1] border border-[#1E1E24]/10">
                  <button
                    type="button"
                    onClick={() => {
                      sfx.playPop(580);
                      setActiveTab('features');
                    }}
                    className={`py-2.5 px-3 rounded-[15px] font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      activeTab === 'features'
                        ? 'bg-[#1E1E24] text-[#FBBF24] shadow-xs'
                        : 'text-[#64616C] hover:text-[#1E1E24]'
                    }`}
                  >
                    <Gamepad2 className="w-4 h-4" />
                    <span>Cara Main &amp; Fitur</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sfx.playPop(520);
                      setActiveTab('limits');
                    }}
                    className={`py-2.5 px-3 rounded-[15px] font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      activeTab === 'limits'
                        ? 'bg-[#1E1E24] text-[#FF8AC2] shadow-xs'
                        : 'text-[#64616C] hover:text-[#1E1E24]'
                    }`}
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>Catatan &amp; Tips</span>
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {activeTab === 'features' ? (
                    <motion.div
                      key="guide-features"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                      className="space-y-3"
                    >
                      <div className="rounded-[22px] bg-[#E0EBFF]/70 border-2 border-[#2568EF]/25 p-4 space-y-2">
                        <h3 className="font-display font-bold text-sm text-[#2568EF] flex items-center gap-1.5">
                          <Zap className="w-4 h-4" />
                          <span>Alur Bermain Singkat</span>
                        </h3>
                        <p className="text-xs sm:text-[13px] text-[#1E1E24] font-semibold leading-relaxed">
                          Daftarkan pemain &amp; kubu di Room (bisa 3 sampai 16 pemain) → pilih salah satu dari 6 mini-game → sistem mengacak role, soal, topik debat, atau item rahasia otomatis → kumpulkan poin individu &amp; kubu hingga penobatan Juara + Photo Booth Hukuman di Podium!
                        </p>
                      </div>

                      <div className="rounded-[22px] bg-[#D6F5EC]/65 border-2 border-[#158467]/25 p-4 space-y-2">
                        <h3 className="font-display font-bold text-sm text-[#158467] flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4" />
                          <span>Fitur Utama Party Games Hub</span>
                        </h3>
                        <ul className="space-y-1.5 text-xs sm:text-[13px] text-[#1E1E24] font-semibold">
                          <li className="flex items-start gap-2">
                            <span className="text-[#158467] mt-0.5">✦</span>
                            <span>
                              <strong>6 Mini Party Games Lengkap:</strong> Same Brain? NO!, Beauty Expert?!, Boys Stuff, The Devil&apos;s Advocate, Cerdas Cermat Berantai, dan Sell Me This Trash!
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#158467] mt-0.5">✦</span>
                            <span>
                              <strong>Privacy Lock Oper HP &amp; Mode TV:</strong> Layar otomatis terkunci saat bergantian HP, atau langsung pakai mode Layar TV / HP Controller bersama Host.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#158467] mt-0.5">✦</span>
                            <span>
                              <strong>Leaderboard Kumulatif &amp; Photo Booth:</strong> Skor terus terakumulasi antar-game hingga Podium Akhir, dilengkapi Kartu Hukuman &amp; bingkai foto untuk yang kalah!
                            </span>
                          </li>
                        </ul>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="guide-limits"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                      className="rounded-[22px] bg-[#FFE8DF]/75 border-2 border-[#EC5A29]/30 p-4 space-y-2.5"
                    >
                      <h3 className="font-display font-bold text-sm text-[#C2410C] flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4" />
                        <span>Tips &amp; Catatan Teknis Room</span>
                      </h3>
                      <ol className="space-y-2 text-xs sm:text-[13px] text-[#1E1E24] font-semibold">
                        <li className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-[#EC5A29] text-white font-display font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                            1
                          </span>
                          <span>
                            <strong>Main Bareng di Tempat:</strong> Dirancang untuk dimainkan bersama di satu ruangan menggunakan 1 layar utama (laptop/TV/HP Host) atau QR Room Code untuk controller HP.
                          </span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-[#EC5A29] text-white font-display font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                            2
                          </span>
                          <span>
                            <strong>Penyimpanan Browser Lokal:</strong> Data pemain dan skor room tersimpan di <code>localStorage</code> perangkat Host selama cache browser tidak dihapus.
                          </span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-[#EC5A29] text-white font-display font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                            3
                          </span>
                          <span>
                            <strong>Efek Suara &amp; Timer:</strong> Pastikan volume perangkat aktif agar countdown, buzzer, dan musik latar terdengar seru!
                          </span>
                        </li>
                      </ol>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// 8B. <DeveloperInfoModal /> — DEVELOPER PROFILE & COFFEE SUPPORT CARD
// ============================================================================
export const DeveloperInfoModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onOpenQris: () => void;
}> = ({ open, onClose, onOpenQris }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-[#1E1E24]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 18 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#FAF7F2] rounded-[34px] border-[3.5px] border-[#1E1E24] shadow-[0_12px_0_#1E1E24] overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* MODAL HEADER WITH ANIMATED DEV MASCOT */}
            <div className="relative bg-[#1E1E24] text-[#FAF7F2] px-5 sm:px-6 pt-6 pb-5">
              <button
                type="button"
                onClick={() => {
                  sfx.playPop(460);
                  onClose();
                }}
                aria-label="Tutup modal info developer"
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/12 hover:bg-white/25 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 pr-8">
                <motion.div
                  animate={{ y: [0, -4, 0], rotate: [-2, 2, -2] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-18 h-18 sm:w-20 sm:h-20 rounded-[24px] bg-[#FAF7F2] border-[3px] border-[#FBBF24] flex items-center justify-center shrink-0 shadow-md"
                >
                  <GrokMascot
                    shape="squircle"
                    color="#2568EF"
                    size={64}
                    mood="happy"
                    glasses
                    coffeeCup
                    stickerBorder={false}
                  />
                </motion.div>

                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#158467] text-white text-xs font-extrabold uppercase tracking-wider mb-1.5">
                    <span>Creator &amp; Indie Developer</span>
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold leading-tight flex items-center gap-2">
                    <span>Hi, I&apos;m Fajarahnf</span>
                    <motion.span
                      animate={{ rotate: [0, 18, -8, 18, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.8 }}
                      style={{ transformOrigin: '70% 70%' }}
                      className="inline-block"
                    >
                      👋
                    </motion.span>
                  </h2>
                </div>
              </div>
            </div>

            {/* SCROLLABLE BODY */}
            <div className="p-5 sm:p-6 space-y-5 overflow-y-auto custom-scroll">
              {/* Developer Story */}
              <div className="rounded-[22px] bg-white border-2 border-[#1E1E24]/10 p-4 shadow-[0_4px_0_rgba(30,30,36,0.06)] space-y-2">
                <p className="text-xs sm:text-sm text-[#1E1E24] font-semibold leading-relaxed">
                  <strong className="text-[#2568EF]">Fajarahnf.dev</strong> • Proyek iseng tengah malam yang lahir demi menyelamatkan tongkrongan dari canggungnya main HP sendiri-sendiri.
                </p>
                <p className="text-xs text-[#64616C] font-medium leading-relaxed">
                  Dirakit bermodal kopi hitam jam 2 pagi, pecut AI tanpa henti, dan 8 mata kuliah UAS yang sempat terabaikan 😂.
                </p>
              </div>

              {/* Social & Personal Website Tactile Pills */}
              <div className="space-y-2">
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#64616C]">
                  Terhubung dengan Developer:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {SOCIAL_LINKS.map((item) => (
                    <a
                      key={item.id}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => sfx.playPop(640)}
                      style={{
                        backgroundColor: item.bg,
                        borderColor: item.border,
                        color: item.text,
                      }}
                      className="px-3 py-2.5 rounded-2xl border-2 font-bold text-xs flex items-center justify-between gap-1.5 hover:-translate-y-0.5 active:translate-y-0 transition shadow-[0_3px_0_rgba(30,30,36,0.1)]"
                    >
                      <span className="truncate">{item.label}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Soft Support & Traktir Kopi */}
              <div className="rounded-[24px] bg-gradient-to-r from-[#FFF6D6] to-[#FFE8DF] border-2 border-[#1E1E24]/15 p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FBBF24] border-2 border-[#1E1E24] flex items-center justify-center shrink-0">
                    <Heart className="w-5 h-5 text-[#D8317E] fill-[#D8317E]" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-[#1E1E24]">
                      Suka sama Party Games Hub?
                    </h4>
                    <p className="text-xs text-[#64616C] font-semibold leading-snug">
                      Boleh banget traktir segelas kopi biar semangat nambah mini-game baru!
                    </p>
                  </div>
                </div>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98, y: 2 }}
                  onClick={() => {
                    sfx.playCoffeeChime();
                    onOpenQris();
                  }}
                  className="w-full py-3 px-5 rounded-2xl bg-[#FBBF24] hover:bg-[#FCD34D] text-[#1E1E24] border-2 border-[#1E1E24] shadow-[0_4px_0_#1E1E24] font-display font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Coffee className="w-4 h-4 text-[#EC5A29]" />
                  <span>Traktir Kopi Developer ☕</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// 9. <QrisCoffeeModal /> — AUTHENTIC INDONESIAN QRIS PAYMENT & CELEBRATION
// ============================================================================
export const QrisCoffeeModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onBackToDev: () => void;
}> = ({ open, onClose, onBackToDev }) => {
  const [selectedTier, setSelectedTier] = useState<CoffeeTier>(COFFEE_TIERS[0]);
  const [customQrisUrl, setCustomQrisUrl] = useState<string | null>(null);
  const [thanked, setThanked] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) {
      setThanked(false);
    }
  }, [open]);

  const handleUploadQris = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (customQrisUrl) URL.revokeObjectURL(customQrisUrl);
    setCustomQrisUrl(URL.createObjectURL(file));
    sfx.playSuccess();
  };

  const handleConfirmTraktir = () => {
    sfx.playFanfare();
    setThanked(true);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-[#1E1E24]/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 18 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-[#FAF7F2] rounded-[34px] border-[3.5px] border-[#1E1E24] shadow-[0_12px_0_#1E1E24] overflow-hidden flex flex-col max-h-[92vh]"
          >
            {/* Confetti burst when thanked */}
            <CelebrationConfetti active={thanked} />

            {/* Top Bar */}
            <div className="bg-[#1E1E24] text-[#FAF7F2] px-5 py-4 flex items-center justify-between relative z-30">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-[#FBBF24] text-[#1E1E24] flex items-center justify-center">
                  <Coffee className="w-4 h-4" />
                </span>
                <div>
                  <span className="block text-xs font-extrabold uppercase tracking-widest text-[#FBBF24]">
                    SAWER &amp; TRAKTIR KOPI
                  </span>
                  <h3 className="font-display text-lg font-bold leading-none">QRIS Fajarahnf</h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  sfx.playPop(460);
                  onClose();
                }}
                aria-label="Tutup modal QRIS"
                className="w-8 h-8 rounded-full bg-white/12 hover:bg-white/25 flex items-center justify-center cursor-pointer transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 overflow-y-auto custom-scroll relative z-30">
              <AnimatePresence mode="wait">
                {thanked ? (
                  /* JOYFUL THANK-YOU STATE AFTER CLICKING "SUDAH TRAKTIR!" */
                  <motion.div
                    key="thank-you-state"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="py-6 text-center space-y-4"
                  >
                    <motion.div
                      animate={{ y: [0, -14, 0], rotate: [-4, 4, -4] }}
                      transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
                      className="flex justify-center"
                    >
                      <GrokMascot
                        shape="squircle"
                        color={selectedTier.mascotColor}
                        size={112}
                        mood="love"
                        glasses
                        coffeeCup
                        stickerBorder
                      />
                    </motion.div>

                    <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#D6F5EC] text-[#158467] font-display font-bold text-xs border border-[#158467]/30">
                      <PartyPopper className="w-4 h-4" />
                      <span>TERIMA KASIH BANYAK!</span>
                    </div>

                    <h4 className="font-display text-3xl font-bold text-[#1E1E24] leading-tight">
                      Makasih Kopinya, Orang Baik! {selectedTier.emoji}
                    </h4>
                    <p className="text-sm text-[#64616C] font-semibold max-w-xs mx-auto leading-relaxed">
                      Dukungan <strong>{selectedTier.label}</strong> kamu bikin Fajarahnf makin semangat bikin mini-game baru buat tongkronganmu!
                    </p>

                    <div className="pt-2 flex flex-col gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          sfx.playPop();
                          setThanked(false);
                        }}
                        className="w-full py-3 rounded-2xl bg-[#F2ECE1] hover:bg-[#E7DFD1] text-[#1E1E24] font-display font-bold text-sm cursor-pointer transition"
                      >
                        Lihat Kode QRIS Lagi
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          sfx.playPop();
                          onClose();
                        }}
                        className="w-full py-3.5 rounded-2xl bg-[#1E1E24] text-[#FAF7F2] shadow-[0_5px_0_#0A0A0D] active:translate-y-[3px] font-display font-bold text-sm cursor-pointer transition"
                      >
                        Kembali Main Game 🎮
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  /* AUTHENTIC INDONESIAN QRIS CARD UI */
                  <motion.div
                    key="qris-payment-state"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="space-y-4"
                  >
                    {/* Playful Coffee Tier Selector Chips */}
                    <div className="space-y-2">
                      <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#64616C]">
                        Pilih Menu Traktiran:
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {COFFEE_TIERS.map((tier) => {
                          const active = selectedTier.id === tier.id;
                          return (
                            <button
                              key={tier.id}
                              type="button"
                              onClick={() => {
                                sfx.playCoffeeChime();
                                setSelectedTier(tier);
                              }}
                              className={`p-2.5 rounded-2xl border-2 text-left transition cursor-pointer ${
                                active
                                  ? 'bg-[#1E1E24] text-[#FAF7F2] border-[#1E1E24] shadow-[0_4px_0_#0A0A0D]'
                                  : 'bg-white text-[#1E1E24] border-[#1E1E24]/15 hover:border-[#1E1E24]/40'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-1">
                                <FluentEmoji emoji={tier.emoji} size={20} />
                                <span
                                  className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                                    active ? 'bg-[#FBBF24] text-[#1E1E24]' : 'bg-[#F2ECE1] text-[#64616C]'
                                  }`}
                                >
                                  {tier.price}
                                </span>
                              </div>
                              <p className="font-display font-bold text-xs sm:text-[13px] mt-1 leading-tight">
                                {tier.label}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Dynamic Mascot Reaction Strip */}
                    <div className="rounded-2xl bg-white border-2 border-[#1E1E24]/12 px-3.5 py-2.5 flex items-center gap-3">
                      <motion.div
                        key={selectedTier.id}
                        initial={{ scale: 0.7, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 360, damping: 16 }}
                        className="shrink-0"
                      >
                        <GrokMascot
                          shape="squircle"
                          color={selectedTier.mascotColor}
                          size={46}
                          mood={selectedTier.mascotMood}
                          glasses
                          stickerBorder={false}
                        />
                      </motion.div>
                      <p className="text-xs font-bold text-[#1E1E24] leading-snug">
                        “{selectedTier.note}”
                      </p>
                    </div>

                    {/* Authentic White QRIS Card */}
                    <div className="rounded-[26px] bg-white border-[3px] border-[#1E1E24] shadow-[0_6px_0_rgba(30,30,36,0.14)] overflow-hidden">
                      {/* Authentic Red & Navy QRIS Top Accent Strip */}
                      <div className="h-2.5 w-full flex">
                        <div className="w-2/3 bg-[#E11D48]" />
                        <div className="w-1/3 bg-[#1E3A8A]" />
                      </div>

                      {/* QRIS Header */}
                      <div className="px-4 pt-3.5 pb-2 border-b border-dashed border-[#1E1E24]/15 flex items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-display font-bold text-xl tracking-tight text-[#1E1E24]">
                              QRIS
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-[#E11D48] text-white text-xs font-extrabold uppercase tracking-wider">
                              QR Indonesia
                            </span>
                          </div>
                          <p className="text-xs font-mono font-bold text-[#64616C] mt-0.5">
                            NMID: ID1026FAJARAHNF
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-display font-bold text-xs text-[#1E1E24]">
                            FAJARAHNF DEV
                          </p>
                          <p className="text-xs font-extrabold text-[#158467]">
                            KOPI STUDIO
                          </p>
                        </div>
                      </div>

                      {/* QR Image Container */}
                      <div className="p-4 flex flex-col items-center">
                        <div className="w-48 h-48 sm:w-52 sm:h-52 p-2.5 rounded-2xl bg-white border-2 border-[#1E1E24]/15 shadow-inner flex items-center justify-center overflow-hidden">
                          {customQrisUrl ? (
                            <img
                              src={customQrisUrl}
                              alt="QRIS Asli Fajarahnf"
                              className="w-full h-full object-contain rounded-lg"
                            />
                          ) : (
                            <StylizedQrisSvg />
                          )}
                        </div>

                        {/* Optional Upload Real QRIS Preview Button */}
                        <div className="mt-3 flex items-center gap-2">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={handleUploadQris}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F2ECE1] hover:bg-[#E7DFD1] text-[11px] font-bold text-[#1E1E24] transition cursor-pointer"
                          >
                            <Upload className="w-3 h-3" />
                            <span>
                              {customQrisUrl ? 'Ganti Gambar QRIS' : 'Upload QRIS Asli (Preview)'}
                            </span>
                          </button>
                          {customQrisUrl && (
                            <button
                              type="button"
                              onClick={() => {
                                sfx.playPop();
                                setCustomQrisUrl(null);
                              }}
                              title="Reset ke QRIS Vektor"
                              className="p-1.5 rounded-full bg-[#FFE4E2] text-[#B42318] hover:bg-[#FECACA] cursor-pointer"
                            >
                              <RotateCcw className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Supported E-Wallet Badges Strip */}
                      <div className="px-4 py-3 bg-[#FAF7F2] border-t border-[#1E1E24]/10">
                        <p className="text-xs font-extrabold uppercase tracking-wider text-[#64616C] text-center mb-2">
                          Scan pakai aplikasi pembayaran favoritmu:
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-1.5">
                          {EWALLET_BADGES.map((ew) => (
                            <span
                              key={ew.name}
                              style={{ backgroundColor: ew.bg, color: ew.text }}
                              className="px-2.5 py-0.5 rounded-full text-xs font-extrabold"
                            >
                              {ew.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2.5 pt-1">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.015 }}
                        whileTap={{ scale: 0.98, y: 3 }}
                        onClick={handleConfirmTraktir}
                        className="w-full py-3.5 px-5 rounded-[22px] bg-[#158467] hover:bg-[#199978] text-white border-[3px] border-[#1E1E24] shadow-[0_5px_0_#1E1E24] font-display font-bold text-base flex items-center justify-center gap-2 cursor-pointer transition-colors"
                      >
                        <CheckCircle2 className="w-5 h-5 text-[#FBBF24]" />
                        <span>Sudah Traktir! 🎉</span>
                      </motion.button>

                      <button
                        type="button"
                        onClick={() => {
                          sfx.playPop(500);
                          onBackToDev();
                        }}
                        className="w-full py-2.5 px-4 rounded-2xl bg-transparent hover:bg-[#F2ECE1] text-[#64616C] hover:text-[#1E1E24] font-display font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 cursor-pointer transition"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Kembali ke Info Dev</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
