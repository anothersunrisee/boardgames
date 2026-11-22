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
}

export const sfx = new SoundEffects();

// ============================================================================
// 2. TYPES & DATA CONSTANTS
// ============================================================================
export type MascotShape = 'squircle' | 'cloud' | 'circle' | 'triangle' | 'blob';
export type MascotMood = 'idle' | 'happy' | 'excited' | 'chill' | 'love';

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
  lookX = 0,
  className = '',
}) => {
  const renderBody = (isOutline = false) => {
    const props = isOutline
      ? {
          fill: '#FFFFFF',
          stroke: '#FFFFFF',
          strokeWidth: 14,
          strokeLinejoin: 'round' as const,
          strokeLinecap: 'round' as const,
        }
      : { fill: color };

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

      {/* Subtle Top Highlight */}
      <ellipse cx="44" cy="37" rx="11" ry="5" fill="#FFFFFF" opacity="0.22" transform="rotate(-18 44 37)" />

      {/* Crisp Eyes (zero idle infinite animation) */}
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

export const PlayfulPartyFooter: React.FC<{
  muted: boolean;
  onToggleMute: () => void;
  onOpenDevModal: (initialTab?: 'features' | 'limits') => void;
  onOpenQrisModal: () => void;
  onSelectGame: (gameId: string) => void;
}> = ({ muted, onToggleMute, onOpenDevModal, onOpenQrisModal, onSelectGame }) => {
  const [peekDucking, setPeekDucking] = useState(false);
  const [peekBubble, setPeekBubble] = useState<string | null>(null);
  const [peekLook, setPeekLook] = useState(0);
  const [peekBurst, setPeekBurst] = useState(0);

  const [botStates, setBotStates] = useState<Record<string, PlaygroundMascotState>>({
    bouncer: { bubble: null, burstKey: 0, squishKey: 0 },
    chaser: { bubble: null, burstKey: 0, squishKey: 0 },
    juggler: { bubble: null, burstKey: 0, squishKey: 0 },
    chiller: { bubble: null, burstKey: 0, squishKey: 0 },
  });

  useEffect(() => {
    const id = window.setInterval(() => {
      setPeekLook((prev) => (prev === 0 ? 4 : prev === 4 ? -4 : 0));
    }, 2600);
    return () => clearInterval(id);
  }, []);

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

  const triggerPlaygroundBot = (id: string, phrases: string[], pitch: number) => {
    sfx.playPop(pitch);
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    setBotStates((prev) => ({
      ...prev,
      [id]: {
        bubble: phrase,
        burstKey: prev[id].burstKey + 1,
        squishKey: prev[id].squishKey + 1,
      },
    }));
    setTimeout(() => {
      setBotStates((prev) => ({
        ...prev,
        [id]: { ...prev[id], bubble: null },
      }));
    }, 1800);
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
          {/* INTERACTIVE MASCOT PLAYGROUND TRACK                            */}
          {/* ============================================================== */}
          <div className="rounded-[28px] bg-[#FAF7F2] text-[#1E1E24] border-[3px] border-[#FBBF24]/80 p-4 sm:p-5 shadow-[0_7px_0_#0D0D11] relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E1E24] text-[#FAF7F2] text-[11px] font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" />
                <span>Mascot Playground</span>
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-[#64616C]">
                Klik mascot mana saja buat bikin mereka loncat! ✨
              </span>
            </div>

            {/* Interactive Track Stage */}
            <div className="relative h-32 sm:h-36 rounded-[22px] bg-[#F2ECE1] border-2 border-dashed border-[#1E1E24]/15 overflow-hidden flex items-end justify-around px-2 sm:px-6 pb-3">
              <div className="absolute inset-x-0 bottom-0 h-5 bg-[#E6DDD0] border-t border-[#1E1E24]/10" />

              {/* MASCOT 1: Bouncer */}
              <div className="relative flex flex-col items-center z-10">
                <AnimatePresence>
                  {botStates.bouncer.bubble && (
                    <motion.span
                      initial={{ opacity: 0, y: 6, scale: 0.7 }}
                      animate={{ opacity: 1, y: -6, scale: 1 }}
                      exit={{ opacity: 0, y: -14 }}
                      className="absolute -top-9 px-2.5 py-1 rounded-xl bg-[#D8317E] text-white font-display font-bold text-[11px] whitespace-nowrap shadow-sm border border-[#1E1E24]"
                    >
                      {botStates.bouncer.bubble}
                    </motion.span>
                  )}
                </AnimatePresence>

                <motion.button
                  type="button"
                  key={`bouncer-${botStates.bouncer.squishKey}`}
                  onClick={() =>
                    triggerPlaygroundBot('bouncer', ['Boop! 🫧', 'Hehe geli!', 'Lompat lagi!'], 620)
                  }
                  whileHover={{ y: -8, scale: 1.06 }}
                  whileTap={{ scaleX: 1.28, scaleY: 0.72 }}
                  className="relative cursor-pointer focus:outline-none"
                  aria-label="Mascot Berry Melompat"
                >
                  <MiniSparkleBurst burstKey={botStates.bouncer.burstKey} color="#D8317E" />
                  <GrokMascot shape="circle" color="#D8317E" size={62} mood="happy" blinkDelay={0.2} />
                </motion.button>
              </div>

              {/* MASCOT 2: Chaser */}
              <div className="relative flex flex-col items-center z-10">
                <AnimatePresence>
                  {botStates.chaser.bubble && (
                    <motion.span
                      initial={{ opacity: 0, y: 6, scale: 0.7 }}
                      animate={{ opacity: 1, y: -6, scale: 1 }}
                      exit={{ opacity: 0, y: -14 }}
                      className="absolute -top-9 px-2.5 py-1 rounded-xl bg-[#2568EF] text-white font-display font-bold text-xs whitespace-nowrap shadow-sm border border-[#1E1E24]"
                    >
                      {botStates.chaser.bubble}
                    </motion.span>
                  )}
                </AnimatePresence>

                <div className="relative flex items-end gap-1">
                  <motion.button
                    type="button"
                    onClick={() =>
                      triggerPlaygroundBot('chaser', ['Tunggu aku! 🏃', 'Wuss~ ⚡', 'Ayo main!'], 540)
                    }
                    whileHover={{ y: -6, rotate: 4 }}
                    whileTap={{ scaleX: 1.26, scaleY: 0.74 }}
                    className="relative cursor-pointer focus:outline-none"
                    aria-label="Mascot Cobalt Berlari"
                  >
                    <MiniSparkleBurst burstKey={botStates.chaser.burstKey} color="#2568EF" />
                    <GrokMascot shape="squircle" color="#2568EF" size={64} mood="idle" blinkDelay={0.8} />
                  </motion.button>

                  <div className="w-5 h-5 rounded-full bg-[#FBBF24] border-2 border-[#1E1E24] mb-1.5 shadow-xs" />
                </div>
              </div>

              {/* MASCOT 3: Juggler */}
              <div className="relative flex flex-col items-center z-10">
                <AnimatePresence>
                  {botStates.juggler.bubble && (
                    <motion.span
                      initial={{ opacity: 0, y: 6, scale: 0.7 }}
                      animate={{ opacity: 1, y: -6, scale: 1 }}
                      exit={{ opacity: 0, y: -14 }}
                      className="absolute -top-9 px-2.5 py-1 rounded-xl bg-[#EC5A29] text-white font-display font-bold text-xs whitespace-nowrap shadow-sm border border-[#1E1E24]"
                    >
                      {botStates.juggler.bubble}
                    </motion.span>
                  )}
                </AnimatePresence>

                <div className="mb-1 text-[#FBBF24]">
                  <Star className="w-5 h-5 fill-[#FBBF24] stroke-[#1E1E24]" strokeWidth={2.5} />
                </div>

                <motion.button
                  type="button"
                  onClick={() =>
                    triggerPlaygroundBot('juggler', ['Hap! Kena! ⭐', 'Jago kan?', 'Gas ronde 1!'], 700)
                  }
                  whileHover={{ y: -6, rotate: -4 }}
                  whileTap={{ scaleX: 1.25, scaleY: 0.75 }}
                  className="relative cursor-pointer focus:outline-none"
                  aria-label="Mascot Tangerine Bermain Bintang"
                >
                  <MiniSparkleBurst burstKey={botStates.juggler.burstKey} color="#EC5A29" />
                  <GrokMascot shape="triangle" color="#EC5A29" size={62} mood="excited" blinkDelay={1.4} />
                </motion.button>
              </div>

              {/* MASCOT 4: Chiller */}
              <div className="relative hidden sm:flex flex-col items-center z-10">
                <AnimatePresence>
                  {botStates.chiller.bubble && (
                    <motion.span
                      initial={{ opacity: 0, y: 6, scale: 0.7 }}
                      animate={{ opacity: 1, y: -6, scale: 1 }}
                      exit={{ opacity: 0, y: -14 }}
                      className="absolute -top-9 px-2.5 py-1 rounded-xl bg-[#9D71E8] text-white font-display font-bold text-xs whitespace-nowrap shadow-sm border border-[#1E1E24]"
                    >
                      {botStates.chiller.bubble}
                    </motion.span>
                  )}
                </AnimatePresence>

                <span className="absolute -top-5 right-0 font-display font-bold text-xs text-[#9D71E8] pointer-events-none">
                  zZz
                </span>

                <motion.button
                  type="button"
                  onClick={() =>
                    triggerPlaygroundBot('chiller', ['Lagi vibing 🎧', 'Santuy dulu~', 'Ngantuk zZz'], 430)
                  }
                  whileHover={{ y: -5, scale: 1.05 }}
                  whileTap={{ scaleX: 1.24, scaleY: 0.78 }}
                  className="relative cursor-pointer focus:outline-none"
                  aria-label="Mascot Lavender Santai"
                >
                  <MiniSparkleBurst burstKey={botStates.chiller.burstKey} color="#9D71E8" />
                  <GrokMascot
                    shape="blob"
                    color="#9D71E8"
                    size={64}
                    mood="chill"
                    headphones
                    blinkDelay={2.0}
                  />
                </motion.button>
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
                    onOpenDevModal('features');
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/12 text-sm font-bold text-left flex items-center gap-2.5 transition cursor-pointer"
                >
                  <Info className="w-4 h-4 text-[#60A5FA]" />
                  <span>Cara Main Singkat</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sfx.playPop();
                    onOpenDevModal('features');
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/12 text-sm font-bold text-left flex items-center gap-2.5 transition cursor-pointer"
                >
                  <Code2 className="w-4 h-4 text-[#C4B5FD]" />
                  <span>Info Developer</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sfx.playCoffeeChime();
                    onOpenQrisModal();
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-[#FBBF24] hover:bg-[#FCD34D] text-[#1E1E24] font-display font-bold text-sm text-left flex items-center gap-2.5 shadow-[0_4px_0_#C49B10] active:translate-y-[3px] transition cursor-pointer"
                >
                  <Coffee className="w-4 h-4" />
                  <span>Traktir Kopi ☕</span>
                </button>

                <button
                  type="button"
                  onClick={onToggleMute}
                  className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/12 text-sm font-bold text-left flex items-center justify-between transition cursor-pointer"
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
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* BOTTOM COPYRIGHT, VERSION PILL & COMPACT SOCIAL LINKS          */}
          {/* ============================================================== */}
          <div className="pt-6 border-t border-white/12 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-xs text-white/75 font-semibold text-center sm:text-left">
              <span>© 2026 Party Games Hub • Dibuat dengan ☕ &amp; Chaos oleh Fajarahnf</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#158467] text-white font-display font-bold text-[11px]">
                v2.0
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sfx.playPop(600)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition"
                >
                  <span className="opacity-70">{link.platform}:</span>
                  <span className="text-[#FBBF24]">{link.short}</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              ))}
            </div>
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
// 8. <DeveloperInfoModal /> — DEVELOPER CARD MODAL ("Hi, I'm Fajarahnf")
// ============================================================================
export const DeveloperInfoModal: React.FC<{
  open: boolean;
  initialTab?: 'features' | 'limits';
  onClose: () => void;
  onOpenQris: () => void;
}> = ({ open, initialTab = 'features', onClose, onOpenQris }) => {
  const [activeTab, setActiveTab] = useState<'features' | 'limits'>(initialTab);

  useEffect(() => {
    if (open) setActiveTab(initialTab);
  }, [open, initialTab]);

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
                  className="w-20 h-20 rounded-[24px] bg-[#FAF7F2] border-[3px] border-[#FBBF24] flex items-center justify-center shrink-0 shadow-md"
                >
                  <GrokMascot
                    shape="squircle"
                    color="#2568EF"
                    size={70}
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
              {/* Sambutan Game */}
              <div className="rounded-[22px] bg-white border-2 border-[#1E1E24]/10 p-4 shadow-[0_4px_0_rgba(30,30,36,0.06)]">
                <p className="text-xs sm:text-sm text-[#1E1E24] font-semibold leading-relaxed">
                  Selamat datang di <strong className="text-[#158467]">Party Games Hub!</strong> Game ini aku buat biar momen nongkrong, jeda kuliah, atau kumpul bareng teman gak cuma sibuk scroll HP masing-masing. Cukup pakai{' '}
                  <strong>1 layar rame-rame</strong> buat seru-seruan, debat receh, sampai bagi hukuman kocak!
                </p>
              </div>

              {/* Clean Pill Tabs: Fitur & Gameplay vs Keterbatasan Game */}
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
                    <span>Fitur &amp; Gameplay</span>
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
                    <span>Keterbatasan Game</span>
                  </button>
                </div>

                {/* Tab Panel Content */}
                <AnimatePresence mode="wait">
                  {activeTab === 'features' ? (
                    <motion.div
                      key="tab-features"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                      className="space-y-3"
                    >
                      <div className="rounded-[22px] bg-[#D6F5EC]/65 border-2 border-[#158467]/25 p-4 space-y-2">
                        <h3 className="font-display font-bold text-sm text-[#158467] flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4" />
                          <span>Fitur Utama</span>
                        </h3>
                        <ul className="space-y-1.5 text-xs sm:text-[13px] text-[#1E1E24] font-semibold">
                          <li className="flex items-start gap-2">
                            <span className="text-[#158467] mt-0.5">✦</span>
                            <span>
                              <strong>6 Mini Party Games Seru:</strong> Same Brain? NO!, Beauty Expert?!, Boys Stuff, The Devil&apos;s Advocate, Cerdas Cermat Berantai, dan Sell Me This Trash!
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#158467] mt-0.5">✦</span>
                            <span>
                              <strong>Privacy Lock Oper HP:</strong> Layar otomatis terkunci saat berganti giliran agar rahasia aman dari intipan.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#158467] mt-0.5">✦</span>
                            <span>
                              <strong>Leaderboard Kumulatif Room:</strong> Otomatis tersimpan di browser cache (<code>localStorage</code>), lengkap dengan Podium Juara 1-2-3, Shuffle Kartu Hukuman, dan Web Audio SFX.
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="rounded-[22px] bg-[#E0EBFF]/70 border-2 border-[#2568EF]/25 p-4 space-y-2">
                        <h3 className="font-display font-bold text-sm text-[#2568EF] flex items-center gap-1.5">
                          <Zap className="w-4 h-4" />
                          <span>Cara Main (Gameplay)</span>
                        </h3>
                        <p className="text-xs sm:text-[13px] text-[#1E1E24] font-semibold leading-relaxed">
                          Cukup <strong>1 HP / laptop untuk 2–20 pemain</strong> → pilih game favorit → atur nama pemain &amp; kubu → ikuti ronde jawaban unik, sesi Q&amp;A, estafet cerdas cermat, atau duel pitching → kumpulkan poin individu &amp; kubu sampai penentuan juara di akhir room!
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="tab-limits"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                      className="rounded-[22px] bg-[#FFE8DF]/75 border-2 border-[#EC5A29]/30 p-4 space-y-2.5"
                    >
                      <h3 className="font-display font-bold text-sm text-[#C2410C] flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4" />
                        <span>Catatan Keterbatasan Saat Ini</span>
                      </h3>
                      <ol className="space-y-2 text-xs sm:text-[13px] text-[#1E1E24] font-semibold">
                        <li className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-[#EC5A29] text-white font-display font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                            1
                          </span>
                          <span>
                            <strong>Mode Offline 1 Layar (Pass-the-Device):</strong> Belum mendukung multiplayer online lintas perangkat jarak jauh.
                          </span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-[#EC5A29] text-white font-display font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                            2
                          </span>
                          <span>
                            <strong>Penyimpanan Lokal Browser (localStorage):</strong> Skor dan room hanya tersimpan di perangkat &amp; browser saat ini (akan hilang jika cache dibersihkan atau pindah HP).
                          </span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-[#EC5A29] text-white font-display font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                            3
                          </span>
                          <span>
                            <strong>Optimalisasi Audio:</strong> Membutuhkan interaksi klik pertama &amp; volume HP aktif agar efek suara timer dan buzzer terdengar maksimal.
                          </span>
                        </li>
                      </ol>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sawer Developer Warm Callout Banner */}
              <div className="rounded-[24px] bg-gradient-to-r from-[#FFF6D6] to-[#FFE8DF] border-2 border-[#1E1E24] p-4 flex items-center gap-3.5 shadow-[0_4px_0_rgba(30,30,36,0.12)]">
                <div className="w-12 h-12 rounded-2xl bg-[#FBBF24] border-2 border-[#1E1E24] flex items-center justify-center shrink-0">
                  <Heart className="w-6 h-6 text-[#D8317E] fill-[#D8317E]" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm sm:text-base text-[#1E1E24]">
                    Bantu Sawer Developer Biar Makin Gacor! 🚀
                  </h4>
                  <p className="text-xs text-[#64616C] font-semibold leading-snug mt-0.5">
                    Dukungan kopimu bakal dipakai buat nambah game baru, animasi Lottie makin mulus, dan riset fitur <strong>multiplayer online</strong> kedepannya!
                  </p>
                </div>
              </div>

              {/* Social & Personal Website Tactile Pills */}
              <div className="space-y-2">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#64616C]">
                  Temukan Fajarahnf di:
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

              {/* Prominent Tactile 3D Traktir Kopi CTA Button */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.98, y: 3 }}
                onClick={() => {
                  sfx.playCoffeeChime();
                  onOpenQris();
                }}
                className="w-full py-4 px-6 rounded-[24px] bg-[#FBBF24] hover:bg-[#FCD34D] text-[#1E1E24] border-[3px] border-[#1E1E24] shadow-[0_6px_0_#1E1E24] font-display font-bold text-base sm:text-lg flex items-center justify-center gap-2.5 cursor-pointer transition-colors"
              >
                <motion.span
                  animate={{ rotate: [-6, 8, -6] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                  className="inline-flex"
                >
                  <Coffee className="w-5 h-5 text-[#EC5A29]" />
                </motion.span>
                <span>Traktir Kopi Developer ☕</span>
              </motion.button>
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
