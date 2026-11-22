import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  RefreshCw,
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

  private ensureCtx(onlyIfRunning = false): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      if (onlyIfRunning) return null;
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      if (onlyIfRunning) return null;
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /** Crisp bubbly tactile pop for buttons and playful mascots */
  playPop(pitch = 540, vol = 0.16) {
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

      gain.gain.setValueAtTime(vol, now);
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

  /** Soft bouncy arcade soccer kick / ball toss thump */
  playKick(volume = 0.16) {
    if (this.muted) return;
    try {
      const ctx = this.ensureCtx();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(210, now);
      osc.frequency.exponentialRampToValueAtTime(68, now + 0.11);

      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.13);
    } catch {}
  }

  /** Smooth airy chime for mascot relay swap */
  playWhoosh() {
    if (this.muted) return;
    try {
      const ctx = this.ensureCtx();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(760, now + 0.14);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.11, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.17);
    } catch {}
  }

  /** Soft bubble thump for ball bounce / stage tap toss */
  playBounce(vol = 0.14, subtle = false) {
    if (this.muted) return;
    try {
      const ctx = this.ensureCtx(subtle);
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(115, now + 0.09);
      gain.gain.setValueAtTime(subtle ? vol * 0.45 : vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch {}
  }

  /** Sci-fi Kamehameha / laser beam sweep */
  playLaser(subtle = false) {
    if (this.muted) return;
    try {
      const ctx = this.ensureCtx(subtle);
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      const peak = subtle ? 0.045 : 0.11;
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(980, now);
      osc.frequency.exponentialRampToValueAtTime(210, now + 0.34);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1480, now);
      osc2.frequency.exponentialRampToValueAtTime(340, now + 0.34);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(peak, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.36);
      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc2.start(now);
      osc.stop(now + 0.37);
      osc2.stop(now + 0.37);
    } catch {}
  }

  /** Classic Mario-style golden coin ding */
  playCoin(subtle = false) {
    if (this.muted) return;
    try {
      const ctx = this.ensureCtx(subtle);
      if (!ctx) return;
      const now = ctx.currentTime;
      const vol = subtle ? 0.055 : 0.13;
      [
        { f: 987.77, t: 0, d: 0.085 },
        { f: 1318.51, t: 0.075, d: 0.24 },
      ].forEach(({ f, t, d }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + t);
        gain.gain.setValueAtTime(vol, now + t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + t + d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + t);
        osc.stop(now + t + d + 0.01);
      });
    } catch {}
  }

  /** Rising energetic synth for Super Saiyan power-up */
  playPowerUp(subtle = false) {
    if (this.muted) return;
    try {
      const ctx = this.ensureCtx(subtle);
      if (!ctx) return;
      const now = ctx.currentTime;
      const vol = subtle ? 0.045 : 0.11;
      [330, 440, 554.37, 659.25, 880].forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.045;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, start);
        osc.frequency.exponentialRampToValueAtTime(f * 1.15, start + 0.12);
        gain.gain.setValueAtTime(vol, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.16);
      });
    } catch {}
  }

  /** Smooth sci-fi warble for Portal teleport */
  playPortal(subtle = false) {
    if (this.muted) return;
    try {
      const ctx = this.ensureCtx(subtle);
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(340, now);
      osc.frequency.exponentialRampToValueAtTime(760, now + 0.24);
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(22, now);
      lfoGain.gain.setValueAtTime(55, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(subtle ? 0.05 : 0.12, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      lfo.start(now);
      osc.stop(now + 0.29);
      lfo.stop(now + 0.29);
    } catch {}
  }

  /** Revving Sonic Spin-Dash pitch zip */
  playSpinDash(subtle = false) {
    if (this.muted) return;
    try {
      const ctx = this.ensureCtx(subtle);
      if (!ctx) return;
      const now = ctx.currentTime;
      const vol = subtle ? 0.045 : 0.11;
      for (let i = 0; i < 3; i++) {
        const start = now + i * 0.055;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(280 + i * 150, start);
        osc.frequency.exponentialRampToValueAtTime(560 + i * 240, start + 0.055);
        gain.gain.setValueAtTime(vol, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.065);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.07);
      }
    } catch {}
  }

  /** Playful metallic hatch clunk for Among Us floor vent */
  playVent(subtle = false) {
    if (this.muted) return;
    try {
      const ctx = this.ensureCtx(subtle);
      if (!ctx) return;
      const now = ctx.currentTime;
      const vol = subtle ? 0.05 : 0.12;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(190, now);
      osc.frequency.exponentialRampToValueAtTime(95, now + 0.07);
      gain.gain.setValueAtTime(vol * 0.65, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
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
// 2. TYPES & DATA CONSTANTS (INCLUDING 10-MASCOT ROTATING CAST)
// ============================================================================
export type MascotShape =
  | 'squircle'
  | 'cloud'
  | 'circle'
  | 'triangle'
  | 'blob'
  | 'pentagon'
  | 'flower'
  | 'flame'
  | 'hexagon'
  | 'scallop';
export type MascotMood =
  | 'idle'
  | 'happy'
  | 'excited'
  | 'chill'
  | 'love'
  | 'angry'
  | 'dizzy'
  | 'surprised';

type PlaygroundMode = 'auto' | 'ball' | 'parkour';

interface MascotProfile {
  id: string;
  name: string;
  shape: MascotShape;
  color: string;
  mood: MascotMood;
  glasses?: boolean;
  headphones?: boolean;
  crown?: boolean;
  detective?: boolean;
  horns?: boolean;
  headband?: boolean;
  pitch: number;
}

const MASCOT_CAST: MascotProfile[] = [
  { id: 'berry', name: 'Beri', shape: 'circle', color: '#D8317E', mood: 'happy', pitch: 640 },
  { id: 'cobalt', name: 'Kobi', shape: 'squircle', color: '#2568EF', mood: 'idle', pitch: 520 },
  { id: 'tangerine', name: 'Tangi', shape: 'triangle', color: '#EC5A29', mood: 'excited', pitch: 680 },
  { id: 'lavender', name: 'Lavi', shape: 'blob', color: '#9D71E8', mood: 'chill', headphones: true, pitch: 440 },
  { id: 'emerald', name: 'Emi', shape: 'cloud', color: '#158467', mood: 'happy', pitch: 580 },
  { id: 'sunny', name: 'Suni', shape: 'pentagon', color: '#EAB308', mood: 'idle', detective: true, pitch: 610 },
  { id: 'mint', name: 'Minti', shape: 'flower', color: '#10B981', mood: 'excited', headband: true, pitch: 700 },
  { id: 'coral', name: 'Kori', shape: 'flame', color: '#F43F5E', mood: 'excited', horns: true, pitch: 560 },
  { id: 'sky', name: 'Skai', shape: 'hexagon', color: '#0284C7', mood: 'idle', glasses: true, pitch: 500 },
  { id: 'rose', name: 'Rosi', shape: 'scallop', color: '#EC4899', mood: 'happy', crown: true, pitch: 740 },
];

const EXIT_PHRASES = [
  'Gantian ya! 👋',
  'Dadah~ ✨',
  'Giliran temenku!',
  'Minum dulu~ ☕',
  'Cabut bentar! 💨',
];

const ENTER_PHRASES = [
  'Hadir! ✨',
  'Oper bola! ⚽',
  'Gas lari! 🏃',
  'Ikut main! 🎉',
  'Siap tempur! ⚡',
];

const LIFT_PHRASES = [
  'WAAAH TURUNIN GUA!! 😱',
  'Tinggi banget tolonggg! 🛸',
  'Jangan dilepas woi!! 😭',
];

const DROP_PHRASES = [
  'Aduh bokong gua! 😵‍💫',
  'Buset puyeng mendarat! 🌀',
  'Untung empuk! 🫧',
];

const ANGRY_HEADSET_PHRASES = [
  'WOI LAGI VIBING JANGAN DIGANGGU!! 💢🔥',
  'HEADSET GUA JANGAN DITARIK!! 😡',
  'LAGI ENAK DENGER LAGU!! 💢',
];

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
  crown?: boolean;
  detective?: boolean;
  horns?: boolean;
  headband?: boolean;
  stickerBorder?: boolean;
  foreheadAngry?: boolean;
  blinkDelay?: number;
  lookX?: number;
  eyeTrackRef?: React.RefObject<SVGGElement | null>;
  className?: string;
}> = ({
  shape = 'squircle',
  color = '#2568EF',
  size = 76,
  mood = 'idle',
  glasses = false,
  headphones = false,
  coffeeCup = false,
  crown = false,
  detective = false,
  horns = false,
  headband = false,
  stickerBorder = true,
  foreheadAngry = false,
  lookX = 0,
  eyeTrackRef,
  className = '',
}) => {
  const gradId = React.useId();
  const isAngry = mood === 'angry' || foreheadAngry;

  const renderBody = (isOutline = false, customFill?: string) => {
    const props = isOutline
      ? {
          fill: '#FFFFFF',
          stroke: '#FFFFFF',
          strokeWidth: 13,
          strokeLinejoin: 'round' as const,
          strokeLinecap: 'round' as const,
        }
      : { fill: customFill || color };

    switch (shape) {
      case 'cloud':
        return (
          <path
            d="M28,90 C14,90 9,76 16,63 C16,47 30,41 39,46 C44,27 74,23 83,44 C99,44 109,58 103,75 C100,86 90,90 77,90 Z"
            {...props}
          />
        );
      case 'triangle':
        return (
          <path
            d="M52,20 C56,12 64,12 68,20 L102,86 C106,94 100,102 90,102 L30,102 C20,102 14,94 18,86 Z"
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
      case 'pentagon':
        return (
          <path
            d="M65,18 L101,44 C105,47 107,52 105,58 L91,95 C89,100 84,103 79,103 L41,103 C36,103 31,100 29,95 L15,58 C13,52 15,47 19,44 L55,18 C58,15 62,15 65,18 Z"
            {...props}
          />
        );
      case 'flower':
        return (
          <path
            d="M60,16 C72,16 81,24 83,35 C94,37 102,47 102,60 C102,73 94,83 83,85 C81,96 72,104 60,104 C48,104 39,96 37,85 C26,83 18,73 18,60 C18,47 26,37 37,35 C39,24 48,16 60,16 Z"
            {...props}
          />
        );
      case 'flame':
        return (
          <path
            d="M62,14 C62,14 96,37 96,68 C96,90 80,104 59,104 C38,104 22,90 22,68 C22,53 31,40 38,34 C38,34 36,46 45,47 C43,31 62,14 62,14 Z"
            {...props}
          />
        );
      case 'hexagon':
        return (
          <path
            d="M38,20 H82 C87,20 91,23 93,27 L106,55 C108,58 108,62 106,65 L93,93 C91,97 87,100 82,100 H38 C33,100 29,97 27,93 L14,65 C12,62 12,58 14,55 L27,27 C29,23 33,20 38,20 Z"
            {...props}
          />
        );
      case 'scallop':
        return (
          <path
            d="M22,36 C22,24 34,20 42,29 C48,19 56,19 60,29 C64,19 72,19 78,29 C86,20 98,24 98,36 V74 C98,92 82,104 60,104 C38,104 22,92 22,74 Z"
            {...props}
          />
        );
      case 'squircle':
      default:
        return <rect x="20" y="22" width="80" height="78" rx="28" {...props} />;
    }
  };

  const eyeY = shape === 'triangle' ? 68 : shape === 'flame' ? 66 : 58;

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

      {/* Horns Accessory */}
      {horns && (
        <g fill="#1E1E24">
          <path d="M31,32 C22,20 26,11 36,18 C40,20 42,26 40,32 Z" />
          <path d="M89,32 C98,20 94,11 84,18 C80,20 78,26 80,32 Z" />
        </g>
      )}

      {/* Headband Accessory */}
      {headband && (
        <path
          d="M27,37 C43,29 77,29 93,37"
          stroke="#FBBF24"
          strokeWidth="7.5"
          strokeLinecap="round"
          fill="none"
        />
      )}

      {/* Crown Accessory */}
      {crown && (
        <path
          d="M40,22 L45,9 L60,18 L75,9 L80,22 Z"
          fill="#FBBF24"
          stroke="#1E1E24"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
      )}

      {/* Detective Cap Accessory */}
      {detective && (
        <g>
          <path d="M30,27 Q60,8 90,27 Z" fill="#5C4428" stroke="#1E1E24" strokeWidth="3.5" />
          <path d="M20,27 H100" stroke="#1E1E24" strokeWidth="4.5" strokeLinecap="round" />
        </g>
      )}

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

      {/* Eye Tracking Group (driven at 60fps by eyeTrackRef OR static lookX) */}
      <g
        ref={eyeTrackRef}
        style={{
          transform: eyeTrackRef ? undefined : `translate3d(${lookX}px, 0, 0)`,
        }}
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
// 5B. BUTTERY-SMOOTH 60FPS PHYSICS + POP-CULTURE SKILLS MASCOT PLAYGROUND
//     - Zero per-frame React setState (direct DOM transform updates via refs)
//     - 11 Pop-Culture Skills & VFX:
//       1) Kamehameha / Laser Beam + stage micro-shake + dodge reactions
//       2) Super Mario "?" Coin Block bonk + spinning golden coin
//       3) Sonic Spin-Dash + cyan speed ring + speed lines
//       4) Portal Teleport (Glowing Blue & Orange Portals)
//       5) Among Us Sus Floor Vent (peek & swap)
//       6) Matrix Neo Bullet-Time Dodge (-38deg lean + green digital motes)
//       7) Naruto Run (dynamic forward lean + anime speed lines)
//       8) Super Saiyan Power-Up (levitation + spiky golden energy aura)
//       9) Moonwalk (smooth backward glide + floating musical notes)
//      10) Kirby Puff Float (inflated buoyant air float)
//      11) 360° Parkour Backflip Salto & 2D Bouncing Soccer Ball Play
//     - Drag & lift any mascot into the air + angry red forehead on headphone bot
// ============================================================================
type AgentAction =
  | 'walk'
  | 'run'
  | 'jump_crouch'
  | 'play_ball'
  | 'laser_charge'
  | 'laser_fire'
  | 'coin_seek'
  | 'spin_charge'
  | 'spin_dash'
  | 'portal_enter'
  | 'portal_exit'
  | 'vent_peek'
  | 'vent_exit'
  | 'vent_enter'
  | 'matrix_dodge'
  | 'naruto_run'
  | 'saiyan_power'
  | 'moonwalk'
  | 'kirby_float'
  | 'exit_swap'
  | 'enter_swap';

interface MascotAgent {
  slot: number;
  castIdx: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  facing: -1 | 1;
  targetX: number;
  action: AgentAction;
  actionTimer: number;
  subTimer: number;
  crouchTimer: number;
  pendingJumpVy: number;
  pendingJumpVx: number;
  pendingBackflip: boolean;
  kickCooldown: number;
  vfxTimer: number;
  stageAge: number;
  isDragged: boolean;
  angryTimer: number;
  // Smooth animation springs & continuous angles
  sx: number;
  sy: number;
  vsx: number;
  vsy: number;
  tilt: number;
  spinAngle: number;
  spinSpeed: number;
  visibilityScale: number;
  stridePhase: number;
  bobAmp: number;
  eyeX: number;
  eyeY: number;
  exitDir: -1 | 1;
  portalTargetX: number;
  portalSwap: boolean;
  triggeredByUser: boolean;
}

interface BallState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  sx: number;
  sy: number;
  vsx: number;
  vsy: number;
  userBoosted: boolean;
}

interface LaserState {
  active: boolean;
  slot: number;
  phase: 'charge' | 'fire';
  dir: -1 | 1;
  originX: number;
  originY: number;
  color: string;
  progress: number;
  timer: number;
}

interface CoinBlockState {
  active: boolean;
  slot: number;
  x: number;
  y: number;
  scale: number;
  hit: boolean;
  bumpOffset: number;
  bumpVel: number;
  coinActive: boolean;
  coinY: number;
  coinVy: number;
  coinRot: number;
  coinAlpha: number;
  timer: number;
  triggeredByUser: boolean;
}

interface PortalPairState {
  active: boolean;
  inX: number;
  outX: number;
  scale: number;
  timer: number;
  spin: number;
}

interface VentState {
  active: boolean;
  x: number;
  openAmt: number;
  opacity: number;
  timer: number;
}

type ParticleKind = 'dust' | 'sparkle' | 'matrix' | 'aura' | 'note';

interface Particle {
  active: boolean;
  kind: ParticleKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  rot: number;
}

interface Ripple {
  active: boolean;
  x: number;
  y: number;
  life: number;
  maxLife: number;
}

interface BubbleState {
  text: string;
  color: string;
  key: number;
}

const PARTICLE_POOL_SIZE = 38; // 0..15 dust, 16..31 sparkles/matrix/aura, 32..37 music notes
const RIPPLE_POOL_SIZE = 4;
const MASCOT_SIZE = 62;
const BALL_SIZE = 28;
const GROUND_OFFSET_PX = 20;

const InteractiveMascotPlayground: React.FC = () => {
  const [mode, setMode] = useState<PlaygroundMode>('auto');
  const [slotCast, setSlotCast] = useState<number[]>([0, 1, 2, 3]);
  const [bubbles, setBubbles] = useState<(BubbleState | null)[]>([null, null, null, null]);
  const [draggedSlot, setDraggedSlot] = useState<number | null>(null);
  const [angrySlots, setAngrySlots] = useState<boolean[]>([false, false, false, false]);

  // Refs synced for zero-stale-closure RAF loop
  const modeRef = useRef<PlaygroundMode>('auto');
  const stageRef = useRef<HTMLDivElement | null>(null);
  const stageShakeRef = useRef<HTMLDivElement | null>(null);
  const stageSizeRef = useRef({ width: 760, height: 210 });
  const nextCastPointerRef = useRef(4);
  const swapTimerRef = useRef(7.2);
  const specialEventTimerRef = useRef(3.2);
  const shakeIntensityRef = useRef(0);
  const bubbleTimersRef = useRef<(number | null)[]>([null, null, null, null]);
  const angryTimersRef = useRef<(number | null)[]>([null, null, null, null]);
  const dragInfoRef = useRef<{
    slot: number;
    startX: number;
    startY: number;
    lastX: number;
    lastY: number;
    lastTime: number;
    vx: number;
    vy: number;
    moved: boolean;
  } | null>(null);

  // Direct DOM refs for 60fps transforms
  const mascotPosRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);
  const mascotBodyRefs = useRef<(HTMLButtonElement | null)[]>([null, null, null, null]);
  const mascotShadowRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);
  const auraRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);
  const spinRingRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);
  const speedLineRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);
  const eyeRefs = useRef<React.RefObject<SVGGElement | null>[]>([
    React.createRef<SVGGElement | null>(),
    React.createRef<SVGGElement | null>(),
    React.createRef<SVGGElement | null>(),
    React.createRef<SVGGElement | null>(),
  ]);

  const ballPosRef = useRef<HTMLDivElement | null>(null);
  const ballSpinRef = useRef<HTMLDivElement | null>(null);
  const ballShadowRef = useRef<HTMLDivElement | null>(null);

  // Dedicated Pop-Culture VFX DOM Refs
  const laserOrbRef = useRef<HTMLDivElement | null>(null);
  const laserBeamRef = useRef<HTMLDivElement | null>(null);
  const laserCoreRef = useRef<HTMLDivElement | null>(null);
  const coinBlockElRef = useRef<HTMLDivElement | null>(null);
  const coinBlockBoxRef = useRef<HTMLDivElement | null>(null);
  const coinElRef = useRef<HTMLDivElement | null>(null);
  const bluePortalRef = useRef<HTMLDivElement | null>(null);
  const orangePortalRef = useRef<HTMLDivElement | null>(null);
  const ventWrapRef = useRef<HTMLDivElement | null>(null);
  const ventLidRef = useRef<HTMLDivElement | null>(null);
  const particleElsRef = useRef<(HTMLDivElement | null)[]>([]);
  const rippleElsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Physics & VFX Simulation Refs (ZERO per-frame React re-renders)
  const agentsRef = useRef<MascotAgent[]>([]);
  const ballRef = useRef<BallState>({
    x: 340,
    y: 64,
    vx: 135,
    vy: 210,
    angle: 0,
    sx: 1,
    sy: 1,
    vsx: 0,
    vsy: 0,
    userBoosted: false,
  });
  const laserRef = useRef<LaserState>({
    active: false,
    slot: -1,
    phase: 'charge',
    dir: 1,
    originX: 0,
    originY: 0,
    color: '#38BDF8',
    progress: 0,
    timer: 0,
  });
  const coinBlockRef = useRef<CoinBlockState>({
    active: false,
    slot: -1,
    x: 320,
    y: 94,
    scale: 0,
    hit: false,
    bumpOffset: 0,
    bumpVel: 0,
    coinActive: false,
    coinY: 0,
    coinVy: 0,
    coinRot: 0,
    coinAlpha: 0,
    timer: 0,
    triggeredByUser: false,
  });
  const portalRef = useRef<PortalPairState>({
    active: false,
    inX: 160,
    outX: 580,
    scale: 0,
    timer: 0,
    spin: 0,
  });
  const ventRef = useRef<VentState>({
    active: false,
    x: 300,
    openAmt: 0,
    opacity: 0,
    timer: 0,
  });
  const particlesRef = useRef<Particle[]>(
    Array.from({ length: PARTICLE_POOL_SIZE }).map((_, i) => ({
      active: false,
      kind: i < 16 ? 'dust' : i < 32 ? 'sparkle' : 'note',
      x: -100,
      y: -100,
      vx: 0,
      vy: 0,
      life: 0,
      maxLife: 0.5,
      size: 8,
      color: '#FFFFFF',
      rot: 0,
    }))
  );
  const ripplesRef = useRef<Ripple[]>(
    Array.from({ length: RIPPLE_POOL_SIZE }).map(() => ({
      active: false,
      x: 0,
      y: 0,
      life: 0,
      maxLife: 0.48,
    }))
  );

  // Sync mode ref
  useEffect(() => {
    modeRef.current = mode;
    const width = stageSizeRef.current.width;
    const busyActions: AgentAction[] = [
      'exit_swap',
      'enter_swap',
      'laser_charge',
      'laser_fire',
      'coin_seek',
      'portal_enter',
      'portal_exit',
      'vent_peek',
      'vent_exit',
      'vent_enter',
    ];
    agentsRef.current.forEach((a, idx) => {
      if (busyActions.includes(a.action) || a.isDragged) return;
      if (mode === 'ball') {
        a.action = 'play_ball';
        a.actionTimer = 4 + idx * 0.8;
      } else if (mode === 'parkour') {
        a.action = 'run';
        a.targetX = 60 + Math.random() * Math.max(120, width - 120);
        a.actionTimer = 1.4 + Math.random() * 1.6;
      } else {
        a.action = idx < 2 ? 'play_ball' : idx === 2 ? 'run' : 'walk';
        a.actionTimer = 2 + Math.random() * 2.5;
      }
    });
  }, [mode]);

  const showBubble = useCallback((slot: number, text: string, color: string, duration = 1800) => {
    const existing = bubbleTimersRef.current[slot];
    if (existing) window.clearTimeout(existing);

    setBubbles((prev) => {
      const next = [...prev];
      next[slot] = { text, color, key: Date.now() + Math.random() };
      return next;
    });

    bubbleTimersRef.current[slot] = window.setTimeout(() => {
      setBubbles((prev) => {
        const next = [...prev];
        next[slot] = null;
        return next;
      });
    }, duration);
  }, []);

  const triggerAngryHeadset = useCallback(
    (slot: number) => {
      const a = agentsRef.current[slot];
      if (!a) return;
      a.angryTimer = 2.6;
      a.vsx += 4.5;
      a.vsy -= 4.5;
      sfx.playAngryBuzz();

      setAngrySlots((prev) => {
        const next = [...prev];
        next[slot] = true;
        return next;
      });

      const phrase = ANGRY_HEADSET_PHRASES[Math.floor(Math.random() * ANGRY_HEADSET_PHRASES.length)];
      showBubble(slot, phrase, '#EF4444', 2400);

      const existing = angryTimersRef.current[slot];
      if (existing) window.clearTimeout(existing);
      angryTimersRef.current[slot] = window.setTimeout(() => {
        setAngrySlots((prev) => {
          const next = [...prev];
          next[slot] = false;
          return next;
        });
      }, 2600);
    },
    [showBubble]
  );

  const spawnParticle = useCallback(
    (
      kind: ParticleKind,
      x: number,
      y: number,
      vx: number,
      vy: number,
      color: string,
      size: number,
      maxLife = 0.5
    ) => {
      const pool = particlesRef.current;
      const start = kind === 'dust' ? 0 : kind === 'note' ? 32 : 16;
      const end = kind === 'dust' ? 16 : kind === 'note' ? PARTICLE_POOL_SIZE : 32;
      for (let i = start; i < end; i++) {
        if (!pool[i].active) {
          const p = pool[i];
          p.active = true;
          p.kind = kind;
          p.x = x;
          p.y = y;
          p.vx = vx;
          p.vy = vy;
          p.life = maxLife;
          p.maxLife = maxLife;
          p.size = size;
          p.color = color;
          p.rot = Math.random() * 360;
          return;
        }
      }
    },
    []
  );

  const spawnSparkleRing = useCallback(
    (x: number, y: number, color: string, count = 7) => {
      const palette = [color, '#FBBF24', '#FFFFFF', '#4AE3B5', '#FF8AC2'];
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.35;
        const speed = 75 + Math.random() * 85;
        spawnParticle(
          'sparkle',
          x,
          y,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed + 45,
          palette[i % palette.length],
          6 + Math.random() * 3.5,
          0.46 + Math.random() * 0.2
        );
      }
    },
    [spawnParticle]
  );

  const spawnRipple = useCallback((x: number, y: number) => {
    const list = ripplesRef.current;
    const target = list.find((r) => !r.active) || list[0];
    target.active = true;
    target.x = x;
    target.y = y;
    target.life = 0.48;
    target.maxLife = 0.48;
  }, []);

  const pickNextCastIndex = useCallback(() => {
    const activeIds = new Set(agentsRef.current.map((ag) => ag.castIdx));
    let candidate = nextCastPointerRef.current % MASCOT_CAST.length;
    let tries = 0;
    while (activeIds.has(candidate) && tries < MASCOT_CAST.length) {
      candidate = (candidate + 1) % MASCOT_CAST.length;
      tries++;
    }
    nextCastPointerRef.current = (candidate + 1) % MASCOT_CAST.length;
    return candidate;
  }, []);

  const swapMascotCharacter = useCallback(
    (agent: MascotAgent) => {
      const nextIdx = pickNextCastIndex();
      agent.castIdx = nextIdx;
      agent.stageAge = 0;
      agent.angryTimer = 0;
      setAngrySlots((prev) => {
        const copy = [...prev];
        copy[agent.slot] = false;
        return copy;
      });
      setSlotCast((prev) => {
        const copy = [...prev];
        copy[agent.slot] = nextIdx;
        return copy;
      });
      return MASCOT_CAST[nextIdx];
    },
    [pickNextCastIndex]
  );

  // Trigger a specific skill or famous pop-culture Easter Egg on a mascot!
  const triggerSpecialSkill = useCallback(
    (a: MascotAgent, fromUser: boolean) => {
      const width = stageSizeRef.current.width;
      const profile = MASCOT_CAST[a.castIdx];
      a.triggeredByUser = fromUser;
      a.crouchTimer = 0;
      a.spinSpeed = 0;
      a.spinAngle = 0;

      const options: string[] = [
        'spin_dash',
        'saiyan',
        'naruto',
        'moonwalk',
        'kirby',
        'backflip',
        'matrix',
      ];
      if (!laserRef.current.active) options.push('laser', 'laser');
      if (!coinBlockRef.current.active) options.push('coin', 'coin');
      if (!portalRef.current.active) options.push('portal');
      if (!ventRef.current.active) options.push('vent_peek');

      const choice = options[Math.floor(Math.random() * options.length)];

      switch (choice) {
        case 'laser': {
          const dir: -1 | 1 = a.x < width * 0.5 ? 1 : -1;
          a.facing = dir;
          a.action = 'laser_charge';
          a.actionTimer = 0.58;
          a.vx *= 0.15;
          laserRef.current = {
            active: true,
            slot: a.slot,
            phase: 'charge',
            dir,
            originX: a.x + dir * 26,
            originY: a.y + 26,
            color: profile.color,
            progress: 0,
            timer: 0.58,
          };
          showBubble(
            a.slot,
            Math.random() < 0.55 ? 'KAMEHAME...!' : 'CHARGE ⚡',
            '#0284C7',
            1350
          );
          if (fromUser) sfx.playPop(720, 0.12);
          break;
        }

        case 'coin': {
          const bx = Math.max(70, Math.min(width - 70, a.x + (Math.random() < 0.5 ? -36 : 36)));
          a.action = 'coin_seek';
          a.targetX = bx;
          a.actionTimer = 2.6;
          coinBlockRef.current = {
            active: true,
            slot: a.slot,
            x: bx,
            y: 94,
            scale: 0.05,
            hit: false,
            bumpOffset: 0,
            bumpVel: 0,
            coinActive: false,
            coinY: 94,
            coinVy: 0,
            coinRot: 0,
            coinAlpha: 0,
            timer: 3.1,
            triggeredByUser: fromUser,
          };
          showBubble(a.slot, 'BLOK ? 🪙', '#D97706', 1100);
          if (fromUser) sfx.playPop(640, 0.12);
          break;
        }

        case 'spin_dash': {
          const dir: -1 | 1 = a.x < width * 0.5 ? 1 : -1;
          a.facing = dir;
          a.action = 'spin_charge';
          a.actionTimer = 0.52;
          a.vx = 0;
          a.spinSpeed = 1480 * dir;
          showBubble(a.slot, 'GOTTA GO FAST! 💨', '#0284C7', 1650);
          sfx.playSpinDash(!fromUser);
          break;
        }

        case 'portal': {
          const inX = Math.max(66, Math.min(width - 66, a.x + (a.x < width * 0.5 ? 62 : -62)));
          const outX = inX < width * 0.5 ? Math.max(84, width - 78) : 78;
          a.action = 'portal_enter';
          a.targetX = inX;
          a.portalTargetX = outX;
          a.portalSwap = false;
          a.actionTimer = 2.4;
          portalRef.current = {
            active: true,
            inX,
            outX,
            scale: 0.05,
            timer: 2.8,
            spin: 0,
          };
          showBubble(a.slot, 'NOW WITH PORTALS! 🌀', '#2568EF', 1800);
          sfx.playPortal(!fromUser);
          break;
        }

        case 'vent_peek': {
          const vx = Math.max(70, Math.min(width - 70, a.x));
          a.action = 'vent_peek';
          a.targetX = vx;
          a.subTimer = 0;
          a.actionTimer = 2.2;
          ventRef.current = {
            active: true,
            x: vx,
            openAmt: 0,
            opacity: 1,
            timer: 2.5,
          };
          showBubble(a.slot, 'SUS?! 👀', '#F43F5E', 1750);
          sfx.playVent(!fromUser);
          break;
        }

        case 'saiyan': {
          a.action = 'saiyan_power';
          a.actionTimer = 1.85;
          a.vx *= 0.2;
          a.vy = 135;
          showBubble(a.slot, 'OVER 9000! 🔥', '#D97706', 1800);
          sfx.playPowerUp(!fromUser);
          break;
        }

        case 'naruto': {
          const dir: -1 | 1 = a.x < width * 0.5 ? 1 : -1;
          a.facing = dir;
          a.action = 'naruto_run';
          a.targetX = dir === 1 ? width - 54 : 54;
          a.actionTimer = 1.9;
          showBubble(a.slot, 'DATTEBAYO! 🍥', '#EC5A29', 1650);
          if (fromUser) sfx.playPop(700, 0.13);
          break;
        }

        case 'moonwalk': {
          const moveDir: -1 | 1 = a.x < width * 0.5 ? 1 : -1;
          a.facing = (moveDir * -1) as -1 | 1;
          a.action = 'moonwalk';
          a.targetX = moveDir === 1 ? Math.min(width - 54, a.x + 175) : Math.max(54, a.x - 175);
          a.actionTimer = 2.1;
          showBubble(a.slot, 'HEE-HEE! 🕺', '#9D71E8', 1750);
          if (fromUser) sfx.playPop(620, 0.13);
          break;
        }

        case 'kirby': {
          const dir: -1 | 1 = a.x < width * 0.5 ? 1 : -1;
          a.facing = dir;
          a.action = 'kirby_float';
          a.targetX = dir === 1 ? Math.min(width - 58, a.x + 190) : Math.max(58, a.x - 190);
          a.vy = 140;
          a.actionTimer = 2.3;
          showBubble(a.slot, 'POYO! 🌸', '#EC4899', 1800);
          if (fromUser) sfx.playPop(780, 0.14);
          break;
        }

        case 'matrix': {
          a.action = 'matrix_dodge';
          a.actionTimer = 1.25;
          a.vx *= 0.2;
          showBubble(a.slot, 'WHOA 🕶️', '#158467', 1450);
          if (fromUser) sfx.playPop(460, 0.13);
          break;
        }

        case 'backflip':
        default: {
          const dir: -1 | 1 = a.x < width * 0.5 ? 1 : -1;
          a.facing = dir;
          a.action = 'jump_crouch';
          a.crouchTimer = 0.11;
          a.pendingJumpVy = 415;
          a.pendingJumpVx = dir * 135;
          a.pendingBackflip = true;
          a.actionTimer = 1.1;
          showBubble(a.slot, 'PARKOUR! 🤸', profile.color, 1500);
          if (fromUser) sfx.playPop(680, 0.14);
          break;
        }
      }
    },
    [showBubble]
  );

  // Trigger smooth mascot swap (via Edge Sprint, Glowing Portal Dive, or Among Us Floor Vent!)
  const triggerSwapOnSlot = useCallback(
    (preferredSlot?: number, withSound = false) => {
      const agents = agentsRef.current;
      const width = stageSizeRef.current.width;
      const busyActions: AgentAction[] = [
        'exit_swap',
        'enter_swap',
        'laser_charge',
        'laser_fire',
        'coin_seek',
        'portal_enter',
        'portal_exit',
        'vent_peek',
        'vent_exit',
        'vent_enter',
      ];
      let chosen: MascotAgent | undefined;
      if (preferredSlot !== undefined) {
        chosen = agents[preferredSlot];
      } else {
        const eligible = agents.filter((a) => !busyActions.includes(a.action) && !a.isDragged);
        if (!eligible.length) return;
        eligible.sort((a, b) => b.stageAge - a.stageAge);
        chosen = eligible[0];
      }
      if (!chosen || busyActions.includes(chosen.action) || chosen.isDragged) return;

      const profile = MASCOT_CAST[chosen.castIdx];
      const roll = Math.random();
      if (roll < 0.34 && !ventRef.current.active) {
        const vx = Math.max(68, Math.min(width - 68, chosen.x));
        chosen.action = 'vent_exit';
        chosen.targetX = vx;
        chosen.subTimer = 0;
        ventRef.current = { active: true, x: vx, openAmt: 0, opacity: 1, timer: 2.8 };
        showBubble(chosen.slot, 'VENTING 📮', '#F43F5E', 1350);
        sfx.playVent(!withSound);
      } else if (roll < 0.66 && !portalRef.current.active) {
        const inX = Math.max(66, Math.min(width - 66, chosen.x + (chosen.x < width * 0.5 ? 55 : -55)));
        const outX = inX < width * 0.5 ? Math.max(84, width - 78) : 78;
        chosen.action = 'portal_enter';
        chosen.targetX = inX;
        chosen.portalTargetX = outX;
        chosen.portalSwap = true;
        portalRef.current = { active: true, inX, outX, scale: 0.05, timer: 3.0, spin: 0 };
        showBubble(chosen.slot, 'PORTAL SWAP! 🌀', '#2568EF', 1400);
        sfx.playPortal(!withSound);
      } else {
        chosen.action = 'exit_swap';
        chosen.exitDir = chosen.x < width * 0.5 ? -1 : 1;
        chosen.facing = chosen.exitDir;
        const phrase = EXIT_PHRASES[Math.floor(Math.random() * EXIT_PHRASES.length)];
        showBubble(chosen.slot, phrase, profile.color, 1300);
        if (withSound) sfx.playWhoosh();
      }
    },
    [showBubble]
  );

  // Main 60fps ResizeObserver + Physics & Pop-Culture RAF Loop
  useEffect(() => {
    const stageEl = stageRef.current;
    if (!stageEl) return;

    const updateSize = () => {
      const rect = stageEl.getBoundingClientRect();
      if (rect.width > 0) {
        stageSizeRef.current = { width: rect.width, height: rect.height };
      }
    };
    updateSize();

    const ro = new ResizeObserver(updateSize);
    ro.observe(stageEl);

    const w0 = stageSizeRef.current.width;
    if (agentsRef.current.length === 0) {
      agentsRef.current = [0, 1, 2, 3].map((slot) => ({
        slot,
        castIdx: slot,
        x: (w0 / 5) * (slot + 1),
        y: 0,
        vx: (slot % 2 === 0 ? 1 : -1) * 60,
        vy: 0,
        facing: slot % 2 === 0 ? 1 : -1,
        targetX: (w0 / 5) * (slot + 1),
        action: slot < 2 ? 'play_ball' : slot === 2 ? 'run' : 'walk',
        actionTimer: 2.0 + slot * 0.9,
        subTimer: 0,
        crouchTimer: 0,
        pendingJumpVy: 0,
        pendingJumpVx: 0,
        pendingBackflip: false,
        kickCooldown: 0.4,
        vfxTimer: 0,
        stageAge: slot * 2.2,
        isDragged: false,
        angryTimer: 0,
        sx: 1,
        sy: 1,
        vsx: 0,
        vsy: 0,
        tilt: 0,
        spinAngle: 0,
        spinSpeed: 0,
        visibilityScale: 1,
        stridePhase: slot * 1.4,
        bobAmp: 0,
        eyeX: 0,
        eyeY: 0,
        exitDir: 1,
        portalTargetX: w0 * 0.5,
        portalSwap: false,
        triggeredByUser: false,
      }));
      ballRef.current.x = w0 * 0.48;
      ballRef.current.y = 64;
    }

    let rafId = 0;
    let lastTime = performance.now();

    const pickRoutineAction = (a: MascotAgent, width: number) => {
      const curMode = modeRef.current;
      const pad = 44;
      const span = Math.max(80, width - pad * 2);

      if (curMode === 'ball') {
        a.action = 'play_ball';
        a.actionTimer = 3.2 + Math.random() * 2.5;
        return;
      }

      if (curMode === 'parkour') {
        const roll = Math.random();
        if (roll < 0.42) {
          a.action = 'run';
          a.targetX = pad + Math.random() * span;
          a.actionTimer = 1.4 + Math.random() * 1.6;
        } else if (roll < 0.76 && a.y <= 1) {
          a.action = 'jump_crouch';
          a.crouchTimer = 0.11;
          a.pendingJumpVy = 355 + Math.random() * 75;
          const dir = a.x < width * 0.3 ? 1 : a.x > width * 0.7 ? -1 : Math.random() < 0.5 ? -1 : 1;
          a.pendingJumpVx = dir * (95 + Math.random() * 90);
          a.pendingBackflip = Math.random() < 0.65;
          a.actionTimer = 1.1;
        } else {
          triggerSpecialSkill(a, false);
        }
        return;
      }

      const ballPlayers = agentsRef.current.filter(
        (other) => other.slot !== a.slot && other.action === 'play_ball'
      ).length;

      const roll = Math.random();
      if (ballPlayers < 2 && roll < 0.36) {
        a.action = 'play_ball';
        a.actionTimer = 3.0 + Math.random() * 2.6;
      } else if (roll < 0.58) {
        a.action = 'run';
        a.targetX = pad + Math.random() * span;
        a.actionTimer = 1.6 + Math.random() * 1.9;
      } else if (roll < 0.78) {
        a.action = 'walk';
        a.targetX = pad + Math.random() * span;
        a.actionTimer = 2.0 + Math.random() * 2.4;
      } else if (roll < 0.9 && a.y <= 1) {
        a.action = 'jump_crouch';
        a.crouchTimer = 0.12;
        a.pendingJumpVy = 345 + Math.random() * 75;
        const dir = a.x < width * 0.3 ? 1 : a.x > width * 0.7 ? -1 : Math.random() < 0.5 ? -1 : 1;
        a.pendingJumpVx = dir * (80 + Math.random() * 90);
        a.pendingBackflip = Math.random() < 0.45;
        a.actionTimer = 1.1;
      } else {
        triggerSpecialSkill(a, false);
      }
    };

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const { width, height } = stageSizeRef.current;
      const agents = agentsRef.current;
      const ball = ballRef.current;
      const laser = laserRef.current;
      const coinBlock = coinBlockRef.current;
      const portal = portalRef.current;
      const vent = ventRef.current;

      // ------------------------------------------------------------------
      // 1. AUTOMATIC CHARACTER ROTATION & SPECIAL POP-CULTURE SCHEDULER
      // ------------------------------------------------------------------
      swapTimerRef.current -= dt;
      if (swapTimerRef.current <= 0) {
        swapTimerRef.current = 7.4 + Math.random() * 3.2;
        triggerSwapOnSlot(undefined, false);
      }

      if (modeRef.current !== 'ball') {
        specialEventTimerRef.current -= dt;
        if (specialEventTimerRef.current <= 0) {
          specialEventTimerRef.current = modeRef.current === 'parkour' ? 2.6 + Math.random() * 1.8 : 3.4 + Math.random() * 2.4;
          const free = agents.filter(
            (a) =>
              !a.isDragged &&
              (a.action === 'walk' || a.action === 'run' || a.action === 'play_ball')
          );
          if (free.length > 0) {
            const picked = free[Math.floor(Math.random() * free.length)];
            triggerSpecialSkill(picked, false);
          }
        }
      }

      // Stage micro-shake decay
      if (shakeIntensityRef.current > 0.05) {
        shakeIntensityRef.current *= Math.pow(0.015, dt);
        const sx = (Math.random() - 0.5) * 2 * shakeIntensityRef.current;
        const sy = (Math.random() - 0.5) * 2 * shakeIntensityRef.current;
        if (stageShakeRef.current) {
          stageShakeRef.current.style.transform = `translate3d(${sx}px, ${sy}px, 0)`;
        }
      } else if (stageShakeRef.current) {
        shakeIntensityRef.current = 0;
        stageShakeRef.current.style.transform = 'translate3d(0, 0, 0)';
      }

      // ------------------------------------------------------------------
      // 2. SOCCER BALL 2D PHYSICS
      // ------------------------------------------------------------------
      const ballRadius = BALL_SIZE * 0.5;
      ball.vy -= 940 * dt;
      ball.x += ball.vx * dt;
      ball.y += ball.vy * dt;

      if (ball.y <= 0) {
        ball.y = 0;
        if (ball.vy < -50) {
          const impact = Math.min(0.28, Math.abs(ball.vy) / 1450);
          ball.vy = -ball.vy * 0.74;
          ball.vsx += impact * 15;
          ball.vsy -= impact * 15;
          spawnParticle('dust', ball.x, 2, (Math.random() - 0.5) * 40, 16, '#D8CFC2', 6, 0.3);
        } else {
          ball.vy = 0;
          ball.userBoosted = false;
        }
        ball.vx *= Math.pow(0.42, dt);
        if (Math.abs(ball.vx) < 4) ball.vx = 0;
      } else {
        ball.vx *= Math.pow(0.9, dt);
      }

      const maxBallY = Math.max(84, height - GROUND_OFFSET_PX - BALL_SIZE - 8);
      if (ball.y > maxBallY) {
        ball.y = maxBallY;
        ball.vy = -Math.abs(ball.vy) * 0.55;
      }

      const leftWall = ballRadius + 8;
      const rightWall = Math.max(leftWall + 40, width - ballRadius - 8);
      if (ball.x < leftWall) {
        ball.x = leftWall;
        ball.vx = Math.abs(ball.vx) * 0.82 + 24;
        ball.vsx -= 3;
        ball.vsy += 3;
      } else if (ball.x > rightWall) {
        ball.x = rightWall;
        ball.vx = -Math.abs(ball.vx) * 0.82 - 24;
        ball.vsx -= 3;
        ball.vsy += 3;
      }

      ball.angle += (ball.vx / ballRadius) * dt * (180 / Math.PI);
      ball.vsx += ((1 - ball.sx) * 320 - ball.vsx * 20) * dt;
      ball.vsy += ((1 - ball.sy) * 320 - ball.vsy * 20) * dt;
      ball.sx = Math.max(0.72, Math.min(1.32, ball.sx + ball.vsx * dt));
      ball.sy = Math.max(0.72, Math.min(1.32, ball.sy + ball.vsy * dt));

      if (ball.y === 0 && Math.abs(ball.vx) < 2) {
        ball.vx = (ball.x < width * 0.5 ? 1 : -1) * 42;
      }

      // ------------------------------------------------------------------
      // 3. GLOBAL POP-CULTURE VFX UPDATES (LASER, MARIO BLOCK, PORTAL, VENT)
      // ------------------------------------------------------------------
      // A) Laser Beam VFX
      if (laser.active) {
        laser.timer -= dt;
        const shooter = agents[laser.slot];
        if (shooter) {
          laser.originX = shooter.x + laser.dir * 28;
          laser.originY = shooter.y + 26;
        }
        if (laser.phase === 'charge') {
          laser.progress = Math.min(1, laser.progress + dt * 2.2);
          if (Math.random() < dt * 16) {
            const ang = Math.random() * Math.PI * 2;
            spawnParticle(
              'sparkle',
              laser.originX + Math.cos(ang) * 24,
              laser.originY + Math.sin(ang) * 24,
              -Math.cos(ang) * 75,
              -Math.sin(ang) * 75,
              '#38BDF8',
              5,
              0.28
            );
          }
          if (laser.timer <= 0) {
            laser.phase = 'fire';
            laser.timer = 0.72;
            laser.progress = 0;
            shakeIntensityRef.current = 4.2;
            if (shooter && !shooter.isDragged) {
              shooter.action = 'laser_fire';
              shooter.actionTimer = 0.72;
              shooter.vx = -laser.dir * 85;
              shooter.vsx -= 3.8;
              shooter.vsy += 3.8;
              sfx.playLaser(!shooter.triggeredByUser);
              showBubble(shooter.slot, 'HAAAA!! 💥', '#0284C7', 1100);
            }
            agents.forEach((other) => {
              if (other.slot === laser.slot || other.isDragged) return;
              const inPath =
                laser.dir === 1 ? other.x > laser.originX - 10 : other.x < laser.originX + 10;
              if (
                inPath &&
                (other.action === 'walk' || other.action === 'run' || other.action === 'play_ball')
              ) {
                if (Math.random() < 0.55) {
                  other.action = 'matrix_dodge';
                  other.actionTimer = 1.05;
                  other.vx *= 0.15;
                  showBubble(other.slot, 'WHOA 🕶️', '#158467', 1200);
                } else if (other.y <= 2) {
                  other.vy = 395;
                  other.vsx -= 3.5;
                  other.vsy += 4.0;
                  showBubble(other.slot, 'HAP! 🦘', '#FBBF24', 1000);
                }
              }
            });
          }
        } else {
          laser.progress = Math.min(1, laser.progress + dt * 9);
          if (laser.timer <= 0) {
            laser.active = false;
          }
        }
      }

      if (laserOrbRef.current && laserBeamRef.current && laserCoreRef.current) {
        if (!laser.active) {
          laserOrbRef.current.style.opacity = '0';
          laserBeamRef.current.style.opacity = '0';
        } else if (laser.phase === 'charge') {
          const pulse = 0.45 + laser.progress * 0.75 + Math.sin(now * 0.04) * 0.16;
          laserOrbRef.current.style.opacity = '1';
          laserOrbRef.current.style.transform = `translate3d(${laser.originX - 16}px, ${-laser.originY - 4}px, 0) scale(${pulse})`;
          laserBeamRef.current.style.opacity = '0';
        } else {
          const fade = Math.min(1, laser.timer * 4.5);
          const beamW =
            laser.dir === 1 ? Math.max(40, width - laser.originX) : Math.max(40, laser.originX);
          const beamLeft = laser.dir === 1 ? laser.originX : 0;
          const beamScaleY = 0.72 + Math.sin(now * 0.06) * 0.22;

          laserOrbRef.current.style.opacity = `${fade}`;
          laserOrbRef.current.style.transform = `translate3d(${laser.originX - 16}px, ${-laser.originY - 4}px, 0) scale(${1.15 * fade})`;

          laserBeamRef.current.style.opacity = `${fade}`;
          laserBeamRef.current.style.left = `${beamLeft}px`;
          laserBeamRef.current.style.width = `${beamW}px`;
          laserBeamRef.current.style.transformOrigin = laser.dir === 1 ? '0% 50%' : '100% 50%';
          laserBeamRef.current.style.transform = `translate3d(0, ${-laser.originY - 1}px, 0) scaleX(${laser.progress}) scaleY(${beamScaleY * fade})`;
        }
      }

      // B) Mario "?" Coin Block VFX
      if (coinBlock.active) {
        coinBlock.timer -= dt;
        const targetScale = coinBlock.timer > 0.3 ? 1 : 0;
        coinBlock.scale += (targetScale - coinBlock.scale) * Math.min(1, dt * 13);

        if (coinBlock.bumpOffset > 0 || coinBlock.bumpVel !== 0) {
          coinBlock.bumpVel -= 1400 * dt;
          coinBlock.bumpOffset += coinBlock.bumpVel * dt;
          if (coinBlock.bumpOffset <= 0) {
            coinBlock.bumpOffset = 0;
            coinBlock.bumpVel = 0;
          }
        }

        if (coinBlock.coinActive) {
          coinBlock.coinVy -= 760 * dt;
          coinBlock.coinY += coinBlock.coinVy * dt;
          coinBlock.coinRot += 780 * dt;
          if (coinBlock.coinVy < -110) {
            coinBlock.coinAlpha = Math.max(0, coinBlock.coinAlpha - dt * 5);
            if (coinBlock.coinAlpha <= 0) coinBlock.coinActive = false;
          }
        }

        if (coinBlock.timer <= 0) {
          coinBlock.active = false;
        }
      }

      if (coinBlockElRef.current && coinBlockBoxRef.current && coinElRef.current) {
        if (!coinBlock.active) {
          coinBlockElRef.current.style.opacity = '0';
          coinElRef.current.style.opacity = '0';
        } else {
          coinBlockElRef.current.style.opacity = `${Math.min(1, coinBlock.scale * 1.4)}`;
          coinBlockElRef.current.style.transform = `translate3d(${coinBlock.x - 15}px, ${-(coinBlock.y + coinBlock.bumpOffset)}px, 0) scale(${coinBlock.scale})`;
          coinBlockBoxRef.current.style.backgroundColor = coinBlock.hit ? '#B47B48' : '#FBBF24';

          if (coinBlock.coinActive) {
            coinElRef.current.style.opacity = `${coinBlock.coinAlpha}`;
            const spinScaleX = Math.max(0.22, Math.abs(Math.cos((coinBlock.coinRot * Math.PI) / 180)));
            coinElRef.current.style.transform = `translate3d(${coinBlock.x - 10}px, ${-coinBlock.coinY}px, 0) scaleX(${spinScaleX})`;
          } else {
            coinElRef.current.style.opacity = '0';
          }
        }
      }

      // C) Blue & Orange Portals VFX
      if (portal.active) {
        portal.timer -= dt;
        portal.spin += dt * 260;
        const tScale = portal.timer > 0.32 ? 1 : 0;
        portal.scale += (tScale - portal.scale) * Math.min(1, dt * 11);
        if (portal.timer <= 0) portal.active = false;
      }

      if (bluePortalRef.current && orangePortalRef.current) {
        if (!portal.active) {
          bluePortalRef.current.style.opacity = '0';
          orangePortalRef.current.style.opacity = '0';
        } else {
          const pulse = 1 + Math.sin(now * 0.014) * 0.06;
          bluePortalRef.current.style.opacity = `${Math.min(1, portal.scale * 1.3)}`;
          bluePortalRef.current.style.transform = `translate3d(${portal.inX - 15}px, -16px, 0) scale(${portal.scale * pulse})`;
          orangePortalRef.current.style.opacity = `${Math.min(1, portal.scale * 1.3)}`;
          orangePortalRef.current.style.transform = `translate3d(${portal.outX - 15}px, -16px, 0) scale(${portal.scale * pulse})`;
        }
      }

      // D) Among Us Floor Vent VFX
      if (vent.active) {
        vent.timer -= dt;
        const targetOpen = vent.timer > 0.45 ? 1 : 0;
        vent.openAmt += (targetOpen - vent.openAmt) * Math.min(1, dt * 12);
        vent.opacity = vent.timer < 0.25 ? Math.max(0, vent.timer / 0.25) : 1;
        if (vent.timer <= 0) vent.active = false;
      }

      if (ventWrapRef.current && ventLidRef.current) {
        if (!vent.active) {
          ventWrapRef.current.style.opacity = '0';
        } else {
          ventWrapRef.current.style.opacity = `${vent.opacity}`;
          ventWrapRef.current.style.transform = `translate3d(${vent.x - 24}px, 0, 0)`;
          ventLidRef.current.style.transform = `rotate(${-vent.openAmt * 62}deg)`;
        }
      }

      // ------------------------------------------------------------------
      // 4. MASCOT AGENTS AI, PHYSICS, DRAG-LIFT, ANGRY HEADSET & SKILLS
      // ------------------------------------------------------------------
      const pad = 40;
      for (let i = 0; i < agents.length; i++) {
        const a = agents[i];
        a.stageAge += dt;
        if (a.kickCooldown > 0) a.kickCooldown -= dt;
        if (a.vfxTimer > 0) a.vfxTimer -= dt;
        if (a.angryTimer > 0) a.angryTimer -= dt;

        let targetVx = 0;
        let customGravity = 1140;
        let customTilt: number | null = null;
        let targetSx = 1;
        let targetSy = 1;
        let showAura = false;
        let showSpinRing = false;
        let showSpeedLines = false;
        let targetVisScale = 1;

        if (a.isDragged) {
          a.vx = 0;
          a.vy = 0;
          a.spinSpeed = 0;
          a.spinAngle = 0;
          targetSx = 1.08;
          targetSy = 0.94;
          customTilt = Math.sin(now * 0.025) * 14;
        } else {
          switch (a.action) {
            case 'exit_swap': {
              targetVx = a.exitDir * 240;
              a.facing = a.exitDir;
              const offLeft = a.exitDir === -1 && a.x < -64;
              const offRight = a.exitDir === 1 && a.x > width + 64;
              if (offLeft || offRight) {
                const newProfile = swapMascotCharacter(a);
                const fromLeft = Math.random() < 0.5;
                a.x = fromLeft ? -56 : width + 56;
                a.y = 0;
                a.vx = fromLeft ? 175 : -175;
                a.vy = 250;
                a.facing = fromLeft ? 1 : -1;
                a.targetX = fromLeft
                  ? 76 + Math.random() * Math.max(60, width * 0.25)
                  : width - 76 - Math.random() * Math.max(60, width * 0.25);
                a.action = 'enter_swap';
                const hi = ENTER_PHRASES[Math.floor(Math.random() * ENTER_PHRASES.length)];
                showBubble(a.slot, hi, newProfile.color, 1600);
              }
              break;
            }

            case 'enter_swap': {
              const dx = a.targetX - a.x;
              if (Math.abs(dx) < 22) {
                pickRoutineAction(a, width);
              } else {
                targetVx = Math.sign(dx) * 195;
                a.facing = Math.sign(dx) >= 0 ? 1 : -1;
              }
              break;
            }

            case 'jump_crouch': {
              targetVx = a.vx * 0.3;
              targetSx = 1.25;
              targetSy = 0.75;
              a.crouchTimer -= dt;
              if (a.crouchTimer <= 0) {
                a.vy = a.pendingJumpVy;
                a.vx = a.pendingJumpVx;
                a.vsx -= 3.6;
                a.vsy += 4.2;
                if (a.pendingBackflip) {
                  a.spinSpeed = (a.facing === 1 ? -1 : 1) * 760;
                  a.pendingBackflip = false;
                }
                spawnParticle('dust', a.x - 10, 3, -38, 22, '#D8CFC2', 8, 0.35);
                spawnParticle('dust', a.x + 10, 3, 38, 22, '#D8CFC2', 8, 0.35);
                a.action = 'run';
                a.targetX = pad + Math.random() * Math.max(80, width - pad * 2);
                a.actionTimer = 1.6;
              }
              break;
            }

            case 'laser_charge': {
              targetVx = 0;
              targetSx = 1.12 + Math.sin(now * 0.05) * 0.06;
              targetSy = 0.88 - Math.sin(now * 0.05) * 0.06;
              customTilt = -a.facing * 8 + Math.sin(now * 0.07) * 4;
              break;
            }

            case 'laser_fire': {
              targetVx = 0;
              a.actionTimer -= dt;
              customTilt = -a.facing * 12;
              targetSx = 1.06;
              targetSy = 0.94;
              if (a.actionTimer <= 0) {
                pickRoutineAction(a, width);
              }
              break;
            }

            case 'coin_seek': {
              a.actionTimer -= dt;
              const dx = coinBlock.x - a.x;
              if (!coinBlock.active || coinBlock.hit || a.actionTimer <= 0) {
                pickRoutineAction(a, width);
              } else if (Math.abs(dx) > 16) {
                targetVx = Math.sign(dx) * 210;
                a.facing = Math.sign(dx) >= 0 ? 1 : -1;
              } else if (a.y <= 1) {
                a.vx = dx * 2;
                a.vy = 405;
                a.vsx -= 4.0;
                a.vsy += 4.5;
              }
              if (
                coinBlock.active &&
                !coinBlock.hit &&
                Math.abs(a.x - coinBlock.x) < 30 &&
                a.y > 46 &&
                a.vy > 0
              ) {
                coinBlock.hit = true;
                coinBlock.bumpVel = 220;
                coinBlock.coinActive = true;
                coinBlock.coinY = coinBlock.y + 24;
                coinBlock.coinVy = 285;
                coinBlock.coinRot = 0;
                coinBlock.coinAlpha = 1;
                coinBlock.timer = Math.min(coinBlock.timer, 1.35);
                a.vy = -80;
                a.vsx += 4.2;
                a.vsy -= 4.2;
                sfx.playCoin(!coinBlock.triggeredByUser);
                spawnSparkleRing(coinBlock.x, coinBlock.y + 18, '#FBBF24', 7);
                showBubble(a.slot, 'DING! 🪙', '#D97706', 1500);
                pickRoutineAction(a, width);
              }
              break;
            }

            case 'spin_charge': {
              targetVx = 0;
              targetSx = 0.88;
              targetSy = 0.88;
              showSpinRing = true;
              a.actionTimer -= dt;
              if (a.vfxTimer <= 0) {
                a.vfxTimer = 0.08;
                spawnParticle('dust', a.x - a.facing * 14, 3, -a.facing * 65, 22, '#BAE6FD', 7, 0.28);
              }
              if (a.actionTimer <= 0) {
                a.action = 'spin_dash';
                a.actionTimer = 1.15;
                a.vx = a.facing * 430;
              }
              break;
            }

            case 'spin_dash': {
              targetVx = a.facing * 410;
              targetSx = 0.92;
              targetSy = 0.92;
              showSpinRing = true;
              showSpeedLines = true;
              a.spinSpeed = 1620 * a.facing;
              a.actionTimer -= dt;
              if (a.x <= 40 && a.facing === -1) {
                a.facing = 1;
                a.vx = 380;
              } else if (a.x >= width - 40 && a.facing === 1) {
                a.facing = -1;
                a.vx = -380;
              }
              if (a.vfxTimer <= 0) {
                a.vfxTimer = 0.06;
                spawnParticle('sparkle', a.x - a.facing * 18, 12, -a.facing * 50, 24, '#38BDF8', 6, 0.28);
              }
              if (a.actionTimer <= 0) {
                a.spinSpeed = 0;
                a.spinAngle = 0;
                pickRoutineAction(a, width);
              }
              break;
            }

            case 'portal_enter': {
              const dx = a.targetX - a.x;
              if (Math.abs(dx) > 18) {
                targetVx = Math.sign(dx) * 225;
                a.facing = Math.sign(dx) >= 0 ? 1 : -1;
              } else {
                targetVisScale = 0.08;
                targetVx = 0;
                if (a.visibilityScale < 0.22) {
                  if (a.portalSwap) {
                    const newProfile = swapMascotCharacter(a);
                    const hi = ENTER_PHRASES[Math.floor(Math.random() * ENTER_PHRASES.length)];
                    showBubble(a.slot, hi, newProfile.color, 1600);
                  }
                  a.x = a.portalTargetX;
                  a.y = 22;
                  const shootDir: -1 | 1 = a.x < width * 0.5 ? 1 : -1;
                  a.facing = shootDir;
                  a.vx = shootDir * 215;
                  a.vy = 250;
                  a.action = 'portal_exit';
                  a.actionTimer = 0.45;
                  spawnSparkleRing(a.x, 30, '#EC5A29', 7);
                }
              }
              break;
            }

            case 'portal_exit': {
              a.actionTimer -= dt;
              targetVx = a.facing * 150;
              if (a.actionTimer <= 0) {
                pickRoutineAction(a, width);
              }
              break;
            }

            case 'vent_peek': {
              a.subTimer += dt;
              targetVx = (a.targetX - a.x) * 4;
              if (a.subTimer < 0.45) {
                targetVisScale = 0.55;
                a.y = 0;
              } else if (a.subTimer < 1.35) {
                targetVisScale = 0.85;
                a.facing = Math.sin(a.subTimer * 9) > 0 ? 1 : -1;
              } else {
                a.vy = 270;
                a.vx = (Math.random() < 0.5 ? -1 : 1) * 115;
                pickRoutineAction(a, width);
              }
              break;
            }

            case 'vent_exit': {
              const dx = a.targetX - a.x;
              if (Math.abs(dx) > 12) {
                targetVx = Math.sign(dx) * 190;
              } else {
                targetVx = 0;
                targetVisScale = 0.04;
                if (a.visibilityScale < 0.16) {
                  const newProfile = swapMascotCharacter(a);
                  a.action = 'vent_enter';
                  a.subTimer = 0;
                  showBubble(a.slot, 'NOT SUS! 👀', newProfile.color, 1600);
                }
              }
              break;
            }

            case 'vent_enter': {
              a.subTimer += dt;
              targetVx = 0;
              if (a.subTimer > 0.25) {
                a.vy = 320;
                a.vx = (Math.random() < 0.5 ? -1 : 1) * 125;
                spawnSparkleRing(a.x, 18, '#FBBF24', 6);
                pickRoutineAction(a, width);
              }
              break;
            }

            case 'matrix_dodge': {
              a.actionTimer -= dt;
              targetVx = 0;
              customTilt = -38 * a.facing;
              targetSx = 1.06;
              targetSy = 0.92;
              if (a.vfxTimer <= 0) {
                a.vfxTimer = 0.1;
                spawnParticle(
                  'matrix',
                  a.x + (Math.random() - 0.5) * 44,
                  10 + Math.random() * 44,
                  (Math.random() - 0.5) * 18,
                  35 + Math.random() * 35,
                  '#10B981',
                  5,
                  0.55
                );
              }
              if (a.actionTimer <= 0) {
                pickRoutineAction(a, width);
              }
              break;
            }

            case 'naruto_run': {
              a.actionTimer -= dt;
              const dx = a.targetX - a.x;
              targetVx = a.facing * 295;
              customTilt = a.facing * 24;
              showSpeedLines = true;
              if (a.vfxTimer <= 0) {
                a.vfxTimer = 0.08;
                spawnParticle('dust', a.x - a.facing * 18, 3, -a.facing * 55, 18, '#DDD4C7', 7, 0.3);
              }
              if (Math.abs(dx) < 26 || a.actionTimer <= 0) {
                pickRoutineAction(a, width);
              }
              break;
            }

            case 'saiyan_power': {
              a.actionTimer -= dt;
              targetVx = 0;
              customGravity = 0;
              showAura = true;
              const targetHoverY = 28 + Math.sin(now * 0.015) * 6;
              a.y += (targetHoverY - a.y) * Math.min(1, dt * 8);
              a.vy = 0;
              targetSx = 1.04 + Math.sin(now * 0.05) * 0.04;
              targetSy = 1.04 - Math.sin(now * 0.05) * 0.04;
              if (a.vfxTimer <= 0) {
                a.vfxTimer = 0.07;
                spawnParticle(
                  'aura',
                  a.x + (Math.random() - 0.5) * 44,
                  a.y + 6,
                  (Math.random() - 0.5) * 24,
                  75 + Math.random() * 55,
                  Math.random() < 0.5 ? '#FBBF24' : '#FEF08A',
                  6,
                  0.42
                );
              }
              if (a.actionTimer <= 0) {
                pickRoutineAction(a, width);
              }
              break;
            }

            case 'moonwalk': {
              a.actionTimer -= dt;
              const moveDir = -a.facing;
              targetVx = moveDir * 92;
              customTilt = a.facing * 7;
              if (a.vfxTimer <= 0) {
                a.vfxTimer = 0.32;
                spawnParticle(
                  'note',
                  a.x + (Math.random() - 0.5) * 20,
                  a.y + 44,
                  (Math.random() - 0.5) * 22,
                  42,
                  '#9D71E8',
                  13,
                  0.78
                );
              }
              if (a.x <= 44 || a.x >= width - 44 || a.actionTimer <= 0) {
                pickRoutineAction(a, width);
              }
              break;
            }

            case 'kirby_float': {
              a.actionTimer -= dt;
              customGravity = 0;
              const dx = a.targetX - a.x;
              targetVx = a.facing * 95;
              targetSx = 1.28;
              targetSy = 1.22;
              const floatTargetY = 62 + Math.sin(now * 0.008 + a.slot) * 12;
              a.y += (floatTargetY - a.y) * Math.min(1, dt * 4.5);
              a.vy = 0;
              if (Math.abs(dx) < 22 || a.actionTimer <= 0) {
                pickRoutineAction(a, width);
              }
              break;
            }

            case 'play_ball': {
              a.actionTimer -= dt;
              const dxBall = ball.x - a.x;
              const absDx = Math.abs(dxBall);

              if (absDx > 20) {
                targetVx = Math.sign(dxBall) * (absDx > 100 ? 205 : 135);
                a.facing = Math.sign(dxBall) >= 0 ? 1 : -1;
              } else {
                targetVx = Math.sign(dxBall || 1) * 55;
              }

              if (a.y <= 1 && a.kickCooldown <= 0 && absDx < 44 && ball.y > 42 && ball.y < 96 && ball.vy < 120) {
                a.vy = 355;
                a.vsx -= 3.0;
                a.vsy += 3.5;
              }

              if (absDx < 48 && Math.abs(ball.vx) > 310 && ball.y > 18 && a.kickCooldown <= 0 && Math.random() < 0.08) {
                a.action = 'matrix_dodge';
                a.actionTimer = 0.95;
                showBubble(a.slot, 'WHOA 🕶️', '#158467', 1100);
                break;
              }

              const distToBall = Math.hypot(ball.x - a.x, ball.y + ballRadius - (a.y + 24));
              if (distToBall < 36 && a.kickCooldown <= 0) {
                a.kickCooldown = 0.6;
                const mates = agents.filter(
                  (t) =>
                    t.slot !== a.slot &&
                    !t.isDragged &&
                    t.action !== 'exit_swap' &&
                    t.action !== 'enter_swap' &&
                    Math.abs(t.x - a.x) > 80
                );

                let kickVx = (a.x < width * 0.5 ? 1 : -1) * (185 + Math.random() * 115);
                let kickVy = 240 + Math.random() * 155;

                if (mates.length > 0 && Math.random() < 0.78) {
                  const mate = mates[Math.floor(Math.random() * mates.length)];
                  const passDist = mate.x - ball.x;
                  kickVy = 270 + Math.random() * 125;
                  const flightTime = (2 * kickVy) / 940;
                  kickVx = Math.max(-330, Math.min(330, passDist / Math.max(0.55, flightTime)));
                }

                ball.vx = kickVx;
                ball.vy = kickVy;
                ball.vsx -= 5.0;
                ball.vsy += 5.0;
                a.vsx += 3.2;
                a.vsy -= 2.8;
                spawnSparkleRing(ball.x, ball.y + 10, MASCOT_CAST[a.castIdx].color, 5);
                if (ball.userBoosted) {
                  sfx.playBounce(0.11, false);
                  ball.userBoosted = false;
                }
              }

              if (a.actionTimer <= 0) pickRoutineAction(a, width);
              break;
            }

            case 'walk':
            case 'run':
            default: {
              a.actionTimer -= dt;
              const dx = a.targetX - a.x;
              const cruise = a.action === 'run' ? 185 : 74;

              if (Math.abs(dx) < 18) {
                if (a.actionTimer <= 0.4) {
                  pickRoutineAction(a, width);
                } else {
                  a.targetX = pad + Math.random() * Math.max(80, width - pad * 2);
                }
              } else {
                const arrival = Math.min(1, Math.abs(dx) / 55);
                targetVx = Math.sign(dx) * cruise * Math.max(0.35, arrival);
                a.facing = Math.sign(dx) >= 0 ? 1 : -1;
              }

              if (a.action === 'run' && a.y <= 1 && Math.abs(a.vx) > 130 && Math.random() < dt * 0.35) {
                a.vy = 325 + Math.random() * 75;
                a.vsx -= 3.0;
                a.vsy += 3.4;
                spawnParticle('dust', a.x, 3, -Math.sign(a.vx) * 42, 20, '#D8CFC2', 7, 0.34);
              }

              if (a.actionTimer <= 0) pickRoutineAction(a, width);
              break;
            }
          }

          // Soft separation so mascots don't stack on top of each other
          const ignoreSep =
            a.action === 'exit_swap' ||
            a.action === 'enter_swap' ||
            a.action === 'portal_enter' ||
            a.action === 'vent_exit' ||
            a.action === 'vent_peek';
          if (!ignoreSep) {
            for (let j = 0; j < agents.length; j++) {
              if (i === j) continue;
              const other = agents[j];
              if (other.isDragged || other.action === 'exit_swap' || other.action === 'enter_swap') continue;
              const sepDx = a.x - other.x;
              const minGap = 48;
              if (Math.abs(sepDx) < minGap && Math.abs(a.y - other.y) < 34) {
                const pushDir = sepDx === 0 ? (i < j ? -1 : 1) : Math.sign(sepDx);
                targetVx += pushDir * ((minGap - Math.abs(sepDx)) / minGap) * 90;
              }
            }
          }

          // Smooth velocity easing
          const accel = a.y > 2 && customGravity > 0 ? 2.4 : 7.0;
          a.vx += (targetVx - a.vx) * Math.min(1, dt * accel);
          a.x += a.vx * dt;

          // Soft stage bounds (except edge swap)
          if (a.action !== 'exit_swap' && a.action !== 'enter_swap') {
            const minX = 34;
            const maxX = Math.max(minX + 40, width - 34);
            if (a.x < minX) {
              a.x = minX;
              a.vx = Math.abs(a.vx) * 0.5;
              a.targetX = Math.max(a.targetX, width * 0.45);
            } else if (a.x > maxX) {
              a.x = maxX;
              a.vx = -Math.abs(a.vx) * 0.5;
              a.targetX = Math.min(a.targetX, width * 0.55);
            }
          }

          // Vertical gravity & landing squash
          if (customGravity > 0 && (a.y > 0 || a.vy > 0)) {
            a.vy -= customGravity * dt;
            a.y += a.vy * dt;
            if (a.y <= 0) {
              a.y = 0;
              if (a.vy < -115) {
                const landImpact = Math.min(0.28, Math.abs(a.vy) / 1650);
                a.vsx += landImpact * 18;
                a.vsy -= landImpact * 18;
                spawnParticle('dust', a.x - 9, 2, -38, 16, '#DDD4C7', 7, 0.34);
                spawnParticle('dust', a.x + 9, 2, 38, 16, '#DDD4C7', 7, 0.34);
              }
              a.vy = 0;
              if (a.action !== 'spin_dash' && a.action !== 'spin_charge') {
                a.spinSpeed = 0;
                a.spinAngle = 0;
              }
            }
          }
        }

        // Running dust puffs
        const absVx = Math.abs(a.vx);
        if (!a.isDragged && a.y <= 1 && absVx > 140 && a.vfxTimer <= 0 && a.action === 'run') {
          a.vfxTimer = 0.17 + Math.random() * 0.08;
          spawnParticle(
            'dust',
            a.x - Math.sign(a.vx) * 13,
            3,
            -Math.sign(a.vx) * (24 + Math.random() * 24),
            14 + Math.random() * 14,
            '#DDD4C7',
            6 + Math.random() * 3,
            0.34
          );
        }

        // Spin angle (backflips & Sonic Spin-Dash)
        if (Math.abs(a.spinSpeed) > 1) {
          a.spinAngle += a.spinSpeed * dt;
        } else {
          a.spinAngle += (0 - a.spinAngle) * Math.min(1, dt * 12);
        }

        // Visibility scale (for smooth Portal dive & Among Us Vent slip)
        a.visibilityScale += (targetVisScale - a.visibilityScale) * Math.min(1, dt * 13);

        // Continuous stride bob
        a.stridePhase += dt * (2.6 + absVx * 0.06);
        const bobTarget =
          !a.isDragged &&
          a.y <= 1 &&
          a.crouchTimer <= 0 &&
          a.action !== 'spin_charge' &&
          a.action !== 'matrix_dodge'
            ? Math.min(6.5, absVx * 0.036)
            : 0;
        a.bobAmp += (bobTarget - a.bobAmp) * Math.min(1, dt * 10);
        const bobY = -Math.abs(Math.sin(a.stridePhase)) * a.bobAmp;

        // Smooth body tilt + angry grumpy vibration
        const angryShake = a.angryTimer > 0 ? Math.sin(now * 0.065) * 6.5 : 0;
        const waddle = !a.isDragged && a.y <= 1 ? Math.sin(a.stridePhase) * Math.min(3.8, absVx * 0.022) : 0;
        const desiredTilt = (customTilt !== null ? customTilt : (a.vx / 220) * 10 + waddle) + angryShake;
        a.tilt += (desiredTilt - a.tilt) * Math.min(1, dt * 10);

        // Squash-and-stretch spring
        if (!a.isDragged && a.y > 4 && customGravity > 0 && a.action !== 'kirby_float') {
          const stretch = Math.min(0.18, Math.abs(a.vy) / 2000);
          targetSx *= 1 - stretch * 0.6;
          targetSy *= 1 + stretch;
        }
        a.vsx += ((targetSx - a.sx) * 260 - a.vsx * 18) * dt;
        a.vsy += ((targetSy - a.sy) * 260 - a.vsy * 18) * dt;
        a.sx = Math.max(0.66, Math.min(1.42, a.sx + a.vsx * dt));
        a.sy = Math.max(0.66, Math.min(1.42, a.sy + a.vsy * dt));

        // Smooth eye tracking
        let targetEyeX = a.facing * 3.8;
        let targetEyeY = a.y > 10 ? Math.max(-3.5, Math.min(3.5, -a.vy / 150)) : 0;
        if (a.action === 'play_ball' || Math.abs(ball.x - a.x) < 145) {
          const dxEye = ball.x - a.x;
          const dyEye = a.y + 24 - (ball.y + ballRadius);
          const distEye = Math.max(1, Math.hypot(dxEye, dyEye));
          targetEyeX = (dxEye / distEye) * 5.2;
          targetEyeY = (dyEye / distEye) * 3.2;
        }
        a.eyeX += (targetEyeX - a.eyeX) * Math.min(1, dt * 11);
        a.eyeY += (targetEyeY - a.eyeY) * Math.min(1, dt * 11);

        // Apply direct GPU-composited transforms
        const posEl = mascotPosRefs.current[i];
        const bodyEl = mascotBodyRefs.current[i];
        const shadowEl = mascotShadowRefs.current[i];
        const eyeEl = eyeRefs.current[i]?.current;
        const auraEl = auraRefs.current[i];
        const spinRingEl = spinRingRefs.current[i];
        const speedLineEl = speedLineRefs.current[i];

        if (posEl) {
          posEl.style.transform = `translate3d(${a.x - MASCOT_SIZE / 2}px, ${-a.y}px, 0)`;
        }
        if (bodyEl) {
          const totalRot = a.tilt + a.spinAngle;
          const vs = a.visibilityScale;
          bodyEl.style.transform = `translate3d(0, ${bobY}px, 0) rotate(${totalRot}deg) scale(${a.sx * vs}, ${a.sy * vs})`;
        }
        if (shadowEl) {
          const hFactor = Math.max(0.28, 1 - a.y / 165) * a.visibilityScale;
          shadowEl.style.transform = `translate3d(${a.x - 22}px, 0, 0) scale(${hFactor * a.sx}, ${hFactor})`;
          shadowEl.style.opacity = `${0.25 * hFactor}`;
        }
        if (eyeEl) {
          eyeEl.style.transform = `translate3d(${a.eyeX}px, ${a.eyeY}px, 0)`;
        }
        if (auraEl) {
          auraEl.style.opacity = showAura ? '1' : '0';
          if (showAura) {
            const ap = 1.05 + Math.sin(now * 0.03) * 0.1;
            auraEl.style.transform = `scale(${ap}) rotate(${Math.sin(now * 0.02) * 8}deg)`;
          }
        }
        if (spinRingEl) {
          spinRingEl.style.opacity = showSpinRing ? '1' : '0';
          if (showSpinRing) {
            spinRingEl.style.transform = `rotate(${(now * 0.9) % 360}deg) scale(${1.05 + Math.sin(now * 0.04) * 0.08})`;
          }
        }
        if (speedLineEl) {
          speedLineEl.style.opacity = showSpeedLines ? '0.9' : '0';
          if (showSpeedLines) {
            speedLineEl.style.transform = `scaleX(${a.facing}) translate3d(-24px, 0, 0)`;
          }
        }
      }

      // ------------------------------------------------------------------
      // 5. APPLY BALL DOM TRANSFORMS
      // ------------------------------------------------------------------
      if (ballPosRef.current) {
        ballPosRef.current.style.transform = `translate3d(${ball.x - ballRadius}px, ${-ball.y}px, 0)`;
      }
      if (ballSpinRef.current) {
        ballSpinRef.current.style.transform = `scale(${ball.sx}, ${ball.sy}) rotate(${ball.angle}deg)`;
      }
      if (ballShadowRef.current) {
        const bFactor = Math.max(0.28, 1 - ball.y / 170);
        ballShadowRef.current.style.transform = `translate3d(${ball.x - 12}px, 0, 0) scale(${bFactor}, ${bFactor})`;
        ballShadowRef.current.style.opacity = `${0.26 * bFactor}`;
      }

      // ------------------------------------------------------------------
      // 6. UPDATE POOLED PARTICLES & CLICK RIPPLES
      // ------------------------------------------------------------------
      const pool = particlesRef.current;
      for (let i = 0; i < PARTICLE_POOL_SIZE; i++) {
        const p = pool[i];
        const el = particleElsRef.current[i];
        if (!el) continue;

        if (!p.active) {
          el.style.opacity = '0';
          continue;
        }

        p.life -= dt;
        if (p.life <= 0) {
          p.active = false;
          el.style.opacity = '0';
          continue;
        }

        if (p.kind === 'sparkle') {
          p.vy -= 250 * dt;
          p.rot += 240 * dt;
        } else if (p.kind === 'matrix' || p.kind === 'aura' || p.kind === 'note') {
          p.vx *= Math.pow(0.55, dt);
        } else {
          p.vx *= Math.pow(0.25, dt);
          p.vy *= Math.pow(0.4, dt);
        }

        p.x += p.vx * dt;
        p.y += p.vy * dt;

        const progress = p.life / p.maxLife;
        const scale = p.kind === 'dust' ? 0.55 + (1 - progress) * 0.9 : progress * 1.15;
        el.style.opacity = `${Math.min(1, progress * 1.3)}`;
        if (p.kind !== 'note') {
          el.style.width = `${p.size}px`;
          el.style.height = `${p.size}px`;
          el.style.backgroundColor = p.color;
        } else {
          el.style.color = p.color;
        }
        el.style.transform = `translate3d(${p.x - p.size / 2}px, ${-p.y}px, 0) rotate(${p.kind === 'note' ? Math.sin(now * 0.01 + i) * 14 : p.rot}deg) scale(${scale})`;
      }

      const ripples = ripplesRef.current;
      for (let i = 0; i < RIPPLE_POOL_SIZE; i++) {
        const r = ripples[i];
        const el = rippleElsRef.current[i];
        if (!el) continue;
        if (!r.active) {
          el.style.opacity = '0';
          continue;
        }
        r.life -= dt;
        if (r.life <= 0) {
          r.active = false;
          el.style.opacity = '0';
          continue;
        }
        const prog = 1 - r.life / r.maxLife;
        el.style.opacity = `${(1 - prog) * 0.85}`;
        el.style.transform = `translate3d(${r.x - 22}px, ${-r.y - 22}px, 0) scale(${0.25 + prog * 1.75})`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      bubbleTimersRef.current.forEach((t) => t && window.clearTimeout(t));
      angryTimersRef.current.forEach((t) => t && window.clearTimeout(t));
    };
  }, [spawnParticle, spawnSparkleRing, showBubble, triggerSpecialSkill, triggerSwapOnSlot, swapMascotCharacter]);

  // Global Pointer Move & Up for Dragging & Lifting Mascots smoothly + Tap-to-Skill!
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const info = dragInfoRef.current;
      const stageEl = stageRef.current;
      if (!info || !stageEl) return;

      const dxFromStart = e.clientX - info.startX;
      const dyFromStart = e.clientY - info.startY;
      if (!info.moved && Math.hypot(dxFromStart, dyFromStart) > 6) {
        info.moved = true;
        const a = agentsRef.current[info.slot];
        if (a) {
          a.isDragged = true;
          a.action = 'walk';
          setDraggedSlot(info.slot);
          const profile = MASCOT_CAST[a.castIdx];
          if (profile.headphones) {
            triggerAngryHeadset(info.slot);
          } else {
            sfx.playBoing(240, 620);
            const phrase = LIFT_PHRASES[Math.floor(Math.random() * LIFT_PHRASES.length)];
            showBubble(info.slot, phrase, profile.color, 2000);
          }
        }
      }

      if (info.moved) {
        const rect = stageEl.getBoundingClientRect();
        const a = agentsRef.current[info.slot];
        if (!a) return;

        const now = performance.now();
        const dtMove = Math.max(0.008, (now - info.lastTime) / 1000);
        const newX = Math.max(30, Math.min(rect.width - 30, e.clientX - rect.left));
        const newY = Math.max(
          0,
          Math.min(rect.height - GROUND_OFFSET_PX - 30, rect.height - (e.clientY - rect.top) - GROUND_OFFSET_PX)
        );

        info.vx = (newX - info.lastX) / dtMove;
        info.vy = (newY - info.lastY) / dtMove;
        info.lastX = newX;
        info.lastY = newY;
        info.lastTime = now;

        a.x = newX;
        a.y = newY;
      }
    };

    const handlePointerUp = () => {
      const info = dragInfoRef.current;
      if (!info) return;
      dragInfoRef.current = null;

      const a = agentsRef.current[info.slot];
      if (!a) return;
      const profile = MASCOT_CAST[a.castIdx];

      if (info.moved) {
        a.isDragged = false;
        setDraggedSlot(null);
        a.vx = Math.max(-360, Math.min(360, info.vx * 0.55));
        a.vy = Math.max(-200, Math.min(380, info.vy * 0.55));
        a.vsx += 3.5;
        a.vsy -= 3.5;
        if (!profile.headphones) {
          sfx.playBoing(520, 190);
          const phrase = DROP_PHRASES[Math.floor(Math.random() * DROP_PHRASES.length)];
          showBubble(info.slot, phrase, profile.color, 1800);
        }
      } else {
        // Quick click / tap -> headphone bot gets angry; others unleash a random pop-culture skill!
        if (profile.headphones) {
          triggerAngryHeadset(info.slot);
          a.vy = 210;
        } else {
          a.vsx += 5.4;
          a.vsy -= 5.0;
          spawnSparkleRing(a.x, a.y + 32, profile.color, 9);
          triggerSpecialSkill(a, true);
        }
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [showBubble, spawnSparkleRing, triggerAngryHeadset, triggerSpecialSkill]);

  // Stage Click/Tap: Ripple + Toss & bounce the soccer ball toward clicked location!
  const handleStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const stageEl = stageRef.current;
    if (!stageEl) return;
    const rect = stageEl.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickYFromGround = Math.max(10, rect.height - (e.clientY - rect.top) - GROUND_OFFSET_PX);

    spawnRipple(clickX, clickYFromGround);
    spawnSparkleRing(clickX, Math.max(14, clickYFromGround), '#FBBF24', 6);
    sfx.playBounce(0.16, false);

    const ball = ballRef.current;
    const dx = clickX - ball.x;
    const dist = Math.abs(dx);

    ball.vx = dist < 24 ? (Math.random() < 0.5 ? -180 : 180) : Math.max(-390, Math.min(390, dx * 2.15));
    ball.vy = Math.max(250, Math.min(460, 240 + clickYFromGround * 1.35));
    ball.vsx -= 5.2;
    ball.vsy += 5.2;
    ball.userBoosted = true;

    const freeAgents = agentsRef.current
      .filter((a) => !a.isDragged && (a.action === 'walk' || a.action === 'run' || a.action === 'play_ball'))
      .sort((a, b) => Math.abs(a.x - clickX) - Math.abs(b.x - clickX));

    freeAgents.slice(0, 2).forEach((a) => {
      a.action = 'play_ball';
      a.actionTimer = 4.2;
    });
  };

  const handleMascotPointerDown = (e: React.PointerEvent, slot: number) => {
    e.stopPropagation();
    const a = agentsRef.current[slot];
    if (!a) return;
    dragInfoRef.current = {
      slot,
      startX: e.clientX,
      startY: e.clientY,
      lastX: a.x,
      lastY: a.y,
      lastTime: performance.now(),
      vx: 0,
      vy: 0,
      moved: false,
    };
  };

  return (
    <div className="rounded-[28px] bg-[#FAF7F2] text-[#1E1E24] border-[3px] border-[#FBBF24]/85 p-4 sm:p-5 shadow-[0_7px_0_#0D0D11] relative overflow-hidden">
      {/* Header & Compact Mode Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E1E24] text-[#FAF7F2] text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" />
            <span>Mascot Playground</span>
          </div>

          <div className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F2ECE1] border border-[#1E1E24]/10 text-xs font-bold text-[#64616C]">
            <span>Di Arena:</span>
            {slotCast.map((idx, s) => (
              <span
                key={`${s}-${idx}`}
                style={{ backgroundColor: MASCOT_CAST[idx].color }}
                title={MASCOT_CAST[idx].name}
                className="w-2.5 h-2.5 rounded-full inline-block ring-1 ring-white"
              />
            ))}
          </div>
        </div>

        {/* Interactive Activity Mode Pills + Swap */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'auto' as PlaygroundMode, label: 'Auto Mix ✨' },
            { id: 'ball' as PlaygroundMode, label: 'Main Bola ⚽' },
            { id: 'parkour' as PlaygroundMode, label: 'Lari & Lompat 🏃' },
          ].map((item) => {
            const active = mode === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  sfx.playPop(active ? 500 : 640);
                  setMode(item.id);
                }}
                className={`px-3 py-1.5 rounded-full font-display font-bold text-xs transition cursor-pointer border-2 ${
                  active
                    ? 'bg-[#1E1E24] text-[#FBBF24] border-[#1E1E24] shadow-[0_2px_0_#0A0A0D]'
                    : 'bg-white text-[#1E1E24] border-[#1E1E24]/15 hover:border-[#1E1E24]/40'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => triggerSwapOnSlot(undefined, true)}
            className="px-3 py-1.5 rounded-full bg-[#FBBF24] hover:bg-[#FCD34D] text-[#1E1E24] border-2 border-[#1E1E24] shadow-[0_2px_0_#1E1E24] active:translate-y-[2px] font-display font-bold text-xs inline-flex items-center gap-1 transition cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Ganti Mascot</span>
          </button>
        </div>
      </div>

      {/* 60FPS PHYSICS PLAYGROUND ARENA STAGE */}
      <div
        ref={stageRef}
        onClick={handleStageClick}
        className="relative h-48 sm:h-52 rounded-[22px] bg-gradient-to-b from-[#F7F1E7] via-[#F4ECE0] to-[#EFE5D6] border-2 border-dashed border-[#1E1E24]/18 overflow-hidden select-none cursor-crosshair touch-none"
      >
        {/* Micro-Shake Inner Wrapper (for Kamehameha laser impact!) */}
        <div ref={stageShakeRef} className="absolute inset-0 will-change-transform">
          {/* Playful Mini-Scenery */}
          <svg
            viewBox="0 0 800 180"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            <path
              d="M0,152 Q160,112 340,144 T720,136 L800,145 L800,180 L0,180 Z"
              fill="#E7DDD0"
              opacity="0.7"
            />
            <path
              d="M0,162 Q220,126 470,154 T800,148 L800,180 L0,180 Z"
              fill="#DFD3C2"
              opacity="0.6"
            />
            <g fill="#FFFFFF" opacity="0.75">
              <rect x="70" y="22" width="54" height="16" rx="8" />
              <circle cx="90" cy="22" r="10" />
              <rect x="360" y="16" width="66" height="18" rx="9" />
              <circle cx="388" cy="16" r="11" />
              <rect x="640" y="26" width="52" height="15" rx="7.5" />
              <circle cx="662" cy="26" r="9" />
            </g>
          </svg>

          {/* Mini Corner Flags */}
          <div className="pointer-events-none absolute left-3 bottom-5 flex flex-col items-start opacity-75">
            <div className="w-3.5 h-2.5 bg-[#EC5A29] rounded-r-xs ml-[2px]" />
            <div className="w-[2.5px] h-7 bg-[#1E1E24]/50 rounded-full" />
          </div>
          <div className="pointer-events-none absolute right-3 bottom-5 flex flex-col items-end opacity-75">
            <div className="w-3.5 h-2.5 bg-[#2568EF] rounded-l-xs mr-[2px]" />
            <div className="w-[2.5px] h-7 bg-[#1E1E24]/50 rounded-full" />
          </div>

          {/* Dashed Playground Turf Track Ground */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-[#E6DDD0] border-t-2 border-[#1E1E24]/10 flex items-center justify-center">
            <div className="w-[92%] border-t-2 border-dashed border-[#1E1E24]/12" />
          </div>

          {/* Among Us Floor Vent Hatch VFX */}
          <div
            ref={ventWrapRef}
            style={{ bottom: `${GROUND_OFFSET_PX - 10}px`, opacity: 0 }}
            className="pointer-events-none absolute left-0 w-12 h-3.5 z-10 will-change-transform"
          >
            <div className="absolute inset-x-1 bottom-0 h-2.5 rounded-full bg-[#1E1E24]" />
            <div
              ref={ventLidRef}
              style={{ transformOrigin: '8% 80%' }}
              className="absolute inset-x-0 bottom-0.5 h-3 rounded-md bg-[#94A3B8] border-2 border-[#1E1E24] flex items-center justify-evenly px-1 will-change-transform"
            >
              <span className="w-1 h-1.5 bg-[#334155] rounded-xs" />
              <span className="w-1 h-1.5 bg-[#334155] rounded-xs" />
              <span className="w-1 h-1.5 bg-[#334155] rounded-xs" />
            </div>
          </div>

          {/* Glowing Blue & Orange Portal Pair VFX */}
          <div
            ref={bluePortalRef}
            style={{ bottom: `${GROUND_OFFSET_PX - 4}px`, opacity: 0 }}
            className="pointer-events-none absolute left-0 w-8 h-14 rounded-full bg-[#38BDF8]/25 border-[3.5px] border-[#0EA5E9] shadow-[0_0_16px_rgba(14,165,233,0.85)] z-10 will-change-transform"
          >
            <div className="w-full h-full rounded-full border-2 border-dashed border-white/80 animate-spin" />
          </div>
          <div
            ref={orangePortalRef}
            style={{ bottom: `${GROUND_OFFSET_PX - 4}px`, opacity: 0 }}
            className="pointer-events-none absolute left-0 w-8 h-14 rounded-full bg-[#FB923C]/25 border-[3.5px] border-[#F97316] shadow-[0_0_16px_rgba(249,115,22,0.85)] z-10 will-change-transform"
          >
            <div className="w-full h-full rounded-full border-2 border-dashed border-white/80 animate-spin" />
          </div>

          {/* Super Mario "?" Coin Block + Spinning Golden Coin VFX */}
          <div
            ref={coinBlockElRef}
            style={{ bottom: `${GROUND_OFFSET_PX}px`, opacity: 0 }}
            className="pointer-events-none absolute left-0 w-[30px] h-[30px] z-30 will-change-transform"
          >
            <div
              ref={coinBlockBoxRef}
              className="w-full h-full rounded-lg bg-[#FBBF24] border-[2.5px] border-[#1E1E24] shadow-[0_3px_0_#1E1E24] flex items-center justify-center relative"
            >
              <span className="w-1 h-1 rounded-full bg-[#1E1E24]/45 absolute top-0.5 left-0.5" />
              <span className="w-1 h-1 rounded-full bg-[#1E1E24]/45 absolute top-0.5 right-0.5" />
              <span className="w-1 h-1 rounded-full bg-[#1E1E24]/45 absolute bottom-0.5 left-0.5" />
              <span className="w-1 h-1 rounded-full bg-[#1E1E24]/45 absolute bottom-0.5 right-0.5" />
              <span className="font-display font-bold text-sm text-[#1E1E24] leading-none">?</span>
            </div>
          </div>
          <div
            ref={coinElRef}
            style={{ bottom: `${GROUND_OFFSET_PX}px`, opacity: 0 }}
            className="pointer-events-none absolute left-0 w-5 h-5 rounded-full bg-[#FDE047] border-2 border-[#B45309] shadow-[0_0_10px_rgba(250,204,21,0.85)] flex items-center justify-center z-20 will-change-transform"
          >
            <div className="w-1.5 h-3 rounded-full bg-[#F59E0B]" />
          </div>

          {/* Expanding Tactile Click Ripples */}
          {Array.from({ length: RIPPLE_POOL_SIZE }).map((_, idx) => (
            <div
              key={`rip-${idx}`}
              ref={(el) => {
                rippleElsRef.current[idx] = el;
              }}
              style={{ bottom: `${GROUND_OFFSET_PX}px`, opacity: 0 }}
              className="pointer-events-none absolute left-0 w-11 h-11 rounded-full border-[3px] border-[#FBBF24] z-20 will-change-transform"
            />
          ))}

          {/* Pooled Particles (Dust, Sparkles, Matrix Motes, Saiyan Sparks, Moonwalk Notes) */}
          {Array.from({ length: PARTICLE_POOL_SIZE }).map((_, idx) => {
            const isNote = idx >= 32;
            return (
              <div
                key={`pt-${idx}`}
                ref={(el) => {
                  particleElsRef.current[idx] = el;
                }}
                style={{
                  bottom: `${GROUND_OFFSET_PX}px`,
                  opacity: 0,
                  borderRadius: idx < 16 ? '9999px' : '2.5px',
                }}
                className={`pointer-events-none absolute left-0 will-change-transform z-30 ${
                  isNote ? 'font-display font-bold text-sm leading-none' : ''
                }`}
              >
                {isNote ? (idx % 2 === 0 ? '♪' : '♫') : null}
              </div>
            );
          })}

          {/* Dynamic Ground Shadows for 4 Mascots */}
          {[0, 1, 2, 3].map((slot) => (
            <div
              key={`shadow-${slot}`}
              ref={(el) => {
                mascotShadowRefs.current[slot] = el;
              }}
              style={{ bottom: `${GROUND_OFFSET_PX - 4}px` }}
              className="pointer-events-none absolute left-0 w-11 h-2.5 rounded-full bg-[#1E1E24] will-change-transform z-10"
            />
          ))}

          {/* Dynamic Ground Shadow for Soccer Ball */}
          <div
            ref={ballShadowRef}
            style={{ bottom: `${GROUND_OFFSET_PX - 3}px` }}
            className="pointer-events-none absolute left-0 w-6 h-2 rounded-full bg-[#1E1E24] will-change-transform z-10"
          />

          {/* 4 Active 60fps Mascot Slots */}
          {[0, 1, 2, 3].map((slot) => {
            const profile = MASCOT_CAST[slotCast[slot]];
            const bubble = bubbles[slot];
            const isAngry = angrySlots[slot];
            const isLifted = draggedSlot === slot;
            const activeMood: MascotMood = isAngry
              ? 'angry'
              : isLifted
              ? 'surprised'
              : profile.mood;

            return (
              <div
                key={`slot-${slot}`}
                ref={(el) => {
                  mascotPosRefs.current[slot] = el;
                }}
                style={{
                  bottom: `${GROUND_OFFSET_PX - 5}px`,
                  width: `${MASCOT_SIZE}px`,
                  height: `${MASCOT_SIZE}px`,
                }}
                className="absolute left-0 will-change-transform z-20 pointer-events-none"
              >
                {/* Speech Bubble */}
                <div className="absolute -top-9 left-1/2 -translate-x-1/2 pointer-events-none z-40">
                  <AnimatePresence mode="wait">
                    {bubble && (
                      <motion.span
                        key={bubble.key}
                        initial={{ opacity: 0, y: 8, scale: 0.72 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.8 }}
                        transition={{ type: 'spring', stiffness: 460, damping: 22 }}
                        style={{ backgroundColor: bubble.color }}
                        className="inline-block px-2.5 py-0.5 rounded-xl text-white font-display font-bold text-xs whitespace-nowrap shadow-[0_2px_0_#1E1E24] border border-[#1E1E24]"
                      >
                        {bubble.text}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                {/* Super Saiyan Spiky Golden Aura (behind mascot) */}
                <div
                  ref={(el) => {
                    auraRefs.current[slot] = el;
                  }}
                  style={{ opacity: 0 }}
                  className="pointer-events-none absolute -inset-3 flex items-center justify-center will-change-transform"
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_12px_rgba(251,191,36,0.95)]">
                    <path
                      d="M50,4 L60,24 L82,14 L74,36 L96,46 L76,60 L88,82 L64,78 L54,96 L42,78 L18,86 L26,62 L6,50 L26,38 L16,16 L38,24 Z"
                      fill="#FDE047"
                      opacity="0.72"
                    />
                    <path
                      d="M50,15 L58,31 L74,24 L68,42 L84,50 L68,60 L75,76 L58,72 L50,86 L42,72 L25,76 L32,60 L16,50 L32,42 L26,24 L42,31 Z"
                      fill="#FEF9C3"
                      opacity="0.9"
                    />
                  </svg>
                </div>

                {/* Anime Speed Lines (Naruto Run / Spin-Dash) */}
                <div
                  ref={(el) => {
                    speedLineRefs.current[slot] = el;
                  }}
                  style={{ opacity: 0 }}
                  className="pointer-events-none absolute inset-y-2 left-0 w-12 flex flex-col justify-evenly will-change-transform"
                >
                  <span className="h-[2.5px] w-10 rounded-full bg-white/90 shadow-xs" />
                  <span className="h-[2.5px] w-7 rounded-full bg-[#38BDF8]/90 ml-2" />
                  <span className="h-[2.5px] w-9 rounded-full bg-[#FBBF24]/90" />
                </div>

                {/* Sonic Spin-Dash Energy Ring */}
                <div
                  ref={(el) => {
                    spinRingRefs.current[slot] = el;
                  }}
                  style={{ opacity: 0 }}
                  className="pointer-events-none absolute -inset-1.5 rounded-full border-[3.5px] border-dashed border-[#38BDF8] shadow-[0_0_12px_rgba(56,189,248,0.8)] will-change-transform z-30"
                />

                <button
                  ref={(el) => {
                    mascotBodyRefs.current[slot] = el;
                  }}
                  type="button"
                  onPointerDown={(e) => handleMascotPointerDown(e, slot)}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Mascot ${profile.name} — tap skill atau drag angkat`}
                  style={{ transformOrigin: '50% 92%' }}
                  className="pointer-events-auto cursor-grab active:cursor-grabbing focus:outline-none will-change-transform block w-full h-full relative z-20"
                >
                  <GrokMascot
                    shape={profile.shape}
                    color={profile.color}
                    size={MASCOT_SIZE}
                    mood={activeMood}
                    foreheadAngry={isAngry}
                    glasses={profile.glasses}
                    headphones={profile.headphones}
                    crown={profile.crown}
                    detective={profile.detective}
                    horns={profile.horns}
                    headband={profile.headband}
                    blinkDelay={slot * 0.85}
                    eyeTrackRef={eyeRefs.current[slot]}
                    stickerBorder
                  />
                </button>
              </div>
            );
          })}

          {/* Kamehameha / Laser Beam Multi-Layered Glowing VFX */}
          <div
            ref={laserOrbRef}
            style={{ bottom: `${GROUND_OFFSET_PX}px`, opacity: 0 }}
            className="pointer-events-none absolute left-0 w-8 h-8 rounded-full bg-white border-[3px] border-[#38BDF8] shadow-[0_0_20px_#0EA5E9,0_0_10px_#FFFFFF] z-30 will-change-transform"
          />
          <div
            ref={laserBeamRef}
            style={{ bottom: `${GROUND_OFFSET_PX}px`, opacity: 0 }}
            className="pointer-events-none absolute h-6 rounded-full bg-gradient-to-b from-[#0EA5E9] via-[#7DD3FC] to-[#0EA5E9] shadow-[0_0_20px_#0EA5E9,0_0_32px_rgba(56,189,248,0.85)] flex items-center z-30 will-change-transform"
          >
            <div ref={laserCoreRef} className="w-full h-2.5 rounded-full bg-white/95 shadow-[0_0_8px_#FFFFFF]" />
          </div>

          {/* Glossy Arcade Soccer Ball (2D Physics) */}
          <div
            ref={ballPosRef}
            style={{
              bottom: `${GROUND_OFFSET_PX - 1}px`,
              width: `${BALL_SIZE}px`,
              height: `${BALL_SIZE}px`,
            }}
            className="pointer-events-none absolute left-0 will-change-transform z-30"
          >
            <div ref={ballSpinRef} className="w-full h-full will-change-transform">
              <svg viewBox="0 0 36 36" className="w-full h-full drop-shadow-xs">
                <circle cx="18" cy="18" r="16" fill="#FFFFFF" stroke="#1E1E24" strokeWidth="2.6" />
                <polygon points="18,11 24,15.5 21.8,22.5 14.2,22.5 12,15.5" fill="#1E1E24" />
                <path d="M18,2 L18,11" stroke="#1E1E24" strokeWidth="2" />
                <path d="M24,15.5 L33,12" stroke="#1E1E24" strokeWidth="2" />
                <path d="M12,15.5 L3,12" stroke="#1E1E24" strokeWidth="2" />
                <path d="M21.8,22.5 L28,31" stroke="#1E1E24" strokeWidth="2" />
                <path d="M14.2,22.5 L8,31" stroke="#1E1E24" strokeWidth="2" />
                <circle cx="18" cy="17.5" r="2.2" fill="#FBBF24" />
                <ellipse
                  cx="12.5"
                  cy="9.5"
                  rx="4.2"
                  ry="2.2"
                  fill="#FFFFFF"
                  opacity="0.7"
                  transform="rotate(-28 12.5 9.5)"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Live Interactive Hint Strip */}
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-[#64616C]">
        <span>
          Klik arena lempar bola ⚽ • Tap mascot keluarin skill ⚡ • Drag angkat ✋ • Ganggu headset 💢
        </span>
        <span className="inline-flex items-center gap-1 text-[#158467]">
          <span className="w-2 h-2 rounded-full bg-[#158467] animate-pulse" />
          <span>10 karakter rotasi otomatis</span>
        </span>
      </div>
    </div>
  );
};

// ============================================================================
// 6. <PlayfulPartyFooter /> — SENSIBLE FOOTER + 60FPS MASCOT PLAYGROUND
// ============================================================================
interface PeekingBotConfig {
  id: string;
  shape: MascotShape;
  color: string;
  accent: string;
  size: number;
  glasses?: boolean;
  crown?: boolean;
  pitch: number;
  phrases: string[];
}

const PEEKING_BOTS: PeekingBotConfig[] = [
  {
    id: 'peek-cloud',
    shape: 'cloud',
    color: '#158467',
    accent: '#4AE3B5',
    size: 82,
    pitch: 640,
    phrases: ['Cilukba! 👀', 'Hai! 👋', 'Ngintip dikit~', 'Boop! 😆'],
  },
  {
    id: 'peek-berry',
    shape: 'circle',
    color: '#D8317E',
    accent: '#FF8AC2',
    size: 74,
    crown: true,
    pitch: 720,
    phrases: ['Ketahuan! 🙈', 'Ayo main! 🎉', 'Hehe halo~', 'Pindah ah! 💨'],
  },
  {
    id: 'peek-cobalt',
    shape: 'squircle',
    color: '#2568EF',
    accent: '#60A5FA',
    size: 76,
    glasses: true,
    pitch: 540,
    phrases: ['Lagi pantau~ 🕵️', 'Ngopi yuk ☕', 'Woi liat sini!', 'Kabur dulu! 🏃'],
  },
];

const PEEK_SPOTS_PERCENT = [8, 23, 38, 53, 68, 83];

interface PeekingBotState {
  spotIdx: number;
  visible: boolean;
  lookX: number;
  bubble: string | null;
  burstKey: number;
  booped: boolean;
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
  const [peekStates, setPeekStates] = useState<PeekingBotState[]>([
    { spotIdx: 5, visible: true, lookX: 0, bubble: null, burstKey: 0, booped: false },
    { spotIdx: 1, visible: false, lookX: 0, bubble: null, burstKey: 0, booped: false },
    { spotIdx: 3, visible: true, lookX: 0, bubble: null, burstKey: 0, booped: false },
  ]);

  // Autonomous pop-up, look-around, hide & teleport to new spot loop for all 3 peeking mascots
  useEffect(() => {
    const timers: number[] = [];

    // Gentle eye-look loop
    const lookId = window.setInterval(() => {
      setPeekStates((prev) =>
        prev.map((st, idx) => ({
          ...st,
          lookX:
            st.lookX === 0
              ? idx % 2 === 0
                ? 4
                : -4
              : st.lookX > 0
              ? -4
              : 0,
        }))
      );
    }, 2200);
    timers.push(lookId);

    // Staggered hide & move cycles per mascot so they pop up and relocate organically
    const cycleDurations = [4300, 5200, 6100];
    cycleDurations.forEach((ms, botIdx) => {
      const cycleId = window.setInterval(() => {
        // Step 1: Duck down behind the scalloped border
        setPeekStates((prev) =>
          prev.map((st, idx) => (idx === botIdx ? { ...st, visible: false, booped: false } : st))
        );

        // Step 2: While hidden, teleport to a random unoccupied spot and pop back up!
        const popTimeout = window.setTimeout(() => {
          setPeekStates((prev) => {
            const occupied = new Set(
              prev.filter((_, i) => i !== botIdx).map((st) => st.spotIdx)
            );
            const candidates = PEEK_SPOTS_PERCENT.map((_, i) => i).filter(
              (i) => !occupied.has(i) && i !== prev[botIdx].spotIdx
            );
            const nextSpot =
              candidates.length > 0
                ? candidates[Math.floor(Math.random() * candidates.length)]
                : (prev[botIdx].spotIdx + 2) % PEEK_SPOTS_PERCENT.length;

            return prev.map((st, idx) =>
              idx === botIdx
                ? { ...st, spotIdx: nextSpot, visible: true, booped: false }
                : st
            );
          });
        }, 720);
        timers.push(popTimeout);
      }, ms);
      timers.push(cycleId);
    });

    return () => {
      timers.forEach((id) => {
        window.clearInterval(id);
        window.clearTimeout(id);
      });
    };
  }, []);

  const handlePeekInteract = (botIdx: number) => {
    const cfg = PEEKING_BOTS[botIdx];
    sfx.playPop(cfg.pitch);
    const nextPhrase = cfg.phrases[Math.floor(Math.random() * cfg.phrases.length)];

    setPeekStates((prev) =>
      prev.map((st, idx) =>
        idx === botIdx
          ? {
              ...st,
              bubble: nextPhrase,
              burstKey: st.burstKey + 1,
              booped: true,
            }
          : st
      )
    );

    // Briefly duck & relocate right after being booped!
    window.setTimeout(() => {
      setPeekStates((prev) =>
        prev.map((st, idx) => (idx === botIdx ? { ...st, visible: false, booped: false } : st))
      );
    }, 520);

    window.setTimeout(() => {
      setPeekStates((prev) => {
        const occupied = new Set(
          prev.filter((_, i) => i !== botIdx).map((st) => st.spotIdx)
        );
        const candidates = PEEK_SPOTS_PERCENT.map((_, i) => i).filter(
          (i) => !occupied.has(i) && i !== prev[botIdx].spotIdx
        );
        const nextSpot =
          candidates.length > 0
            ? candidates[Math.floor(Math.random() * candidates.length)]
            : (prev[botIdx].spotIdx + 1) % PEEK_SPOTS_PERCENT.length;

        return prev.map((st, idx) =>
          idx === botIdx ? { ...st, spotIdx: nextSpot, visible: true, bubble: null } : st
        );
      });
    }, 1350);
  };

  return (
    <footer id="playful-party-footer" className="relative mt-20 sm:mt-24 pt-10">
      {/* 3 PEEKING MASCOTS POPPING UP & MOVING RANDOMLY BEHIND THE SCALLOPED BORDER */}
      <div className="max-w-5xl mx-auto px-6 relative h-0">
        {PEEKING_BOTS.map((bot, botIdx) => {
          const st = peekStates[botIdx];
          const leftPercent = PEEK_SPOTS_PERCENT[st.spotIdx];

          return (
            <div
              key={bot.id}
              style={{ left: `${leftPercent}%` }}
              className="absolute -top-[58px] z-10 flex flex-col items-center -translate-x-1/2"
            >
              <AnimatePresence>
                {st.bubble && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.7 }}
                    animate={{ opacity: 1, y: -12, scale: 1 }}
                    exit={{ opacity: 0, y: -18, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 20 }}
                    className="mb-1 px-3 py-1 rounded-2xl bg-[#FBBF24] text-[#1E1E24] font-display font-bold text-xs border-2 border-[#1E1E24] shadow-[0_3px_0_#1E1E24] whitespace-nowrap pointer-events-none"
                  >
                    {st.bubble}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="button"
                onClick={() => handlePeekInteract(botIdx)}
                animate={{
                  y: st.visible ? (st.booped ? 22 : 0) : 68,
                  scaleY: st.booped ? 0.8 : 1,
                  scaleX: st.booped ? 1.15 : 1,
                  opacity: st.visible ? 1 : 0,
                }}
                transition={{ type: 'spring', stiffness: 360, damping: 20 }}
                aria-label={`Mascot mengintip ${bot.id}`}
                className={`relative focus:outline-none ${
                  st.visible ? 'cursor-pointer pointer-events-auto' : 'pointer-events-none'
                }`}
              >
                <MiniSparkleBurst burstKey={st.burstKey} color={bot.accent} />
                <GrokMascot
                  shape={bot.shape}
                  color={bot.color}
                  size={bot.size}
                  mood={st.booped ? 'happy' : 'idle'}
                  glasses={bot.glasses}
                  crown={bot.crown}
                  lookX={st.lookX}
                  stickerBorder
                />
              </motion.button>
            </div>
          );
        })}
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
          {/* 60FPS PHYSICS MASCOT PLAYGROUND CARD                           */}
          {/* ============================================================== */}
          <InteractiveMascotPlayground />

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
