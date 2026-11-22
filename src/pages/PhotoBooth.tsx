import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Upload,
  Download,
  Share2,
  Volume2,
  VolumeX,
  Shuffle,
  RefreshCw,
  Plus,
  Trash2,
  X,
  CheckCircle2,
  Copy,
  Check,
  Tv,
  Monitor,
  Gamepad2,
  Users,
  Palette,
  FlipHorizontal,
  ZoomIn,
  Move,
  RotateCcw,
  Crown,
  ExternalLink,
  Database,
  Timer,
  Eye,
  EyeOff,
  Smartphone,
  SlidersHorizontal,
  Film,
  Smile,
  ArrowLeft,
  AtSign,
} from 'lucide-react';
import { useGameStore } from '../store/useGameStore';

const Instagram: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

// ============================================================================
// 1. CONSTANTS, TYPES & NEO-RETRO ARCADE / POP POSTER THEMES
// ============================================================================
const TARGET_WEBSITE_URL = 'https://play-partygameshub.vercel.app/';
const DISPLAY_WEBSITE_LINK = 'play-partygameshub.vercel.app';
const ROOM_CACHE_KEY = 'party_games_hub_room_cache_v1';

type PosterThemeId = 'pop-cobalt' | 'playverse-arcade' | 'partyhub-cream' | 'berry-night';
type FrameStyleId = 'retro-monitor' | 'playverse-arcade' | 'classic-tv';
type ControlTabId = 'content' | 'visual';
type MascotShape = 'squircle' | 'cloud' | 'circle' | 'triangle' | 'blob';
type MascotMood = 'happy' | 'laugh' | 'cool' | 'shocked' | 'dizzy';
type MascotMoodPreset = 'playful' | 'mocking' | 'cool';

interface LoserLabelItem {
  id: string;
  name: string;
  rotation: number; // degrees (-8 to +8)
  color: string;
  textColor: string;
  frontSpot: boolean; // cheeky star/crown tag for the one standing right in front
}

interface TeamTagItem {
  id: string;
  name: string;
  handle: string;
}

interface PosterThemeConfig {
  id: PosterThemeId;
  name: string;
  badge: string;
  skyTop: string;
  skyBottom: string;
  patternColor: string;
  logoTopFill: string;
  logoBottomFill: string;
  logoGlow: string;
  logoUnderline: string;
  dialogBg: string;
  dialogText: string;
  dialogAccent: string;
  losersHeadingFill: string;
  losersHeadingShadow: string;
  groundStyle: 'angled-wave' | 'perspective-grid' | 'scalloped' | 'synth-grid';
  groundPrimary: string;
  groundSecondary: string;
  groundLine: string;
  footerHookColor: string;
  footerLinkBg: string;
  footerLinkText: string;
  footerSubColor: string;
  arrowColor: string;
  qrTabBg: string;
  qrBadgeBg: string;
  qrBadgeText: string;
  previewSwatch: [string, string, string];
}

const POSTER_THEMES: Record<PosterThemeId, PosterThemeConfig> = {
  'pop-cobalt': {
    id: 'pop-cobalt',
    name: 'Pop Cobalt',
    badge: 'WW Poster Vibe',
    skyTop: '#0F88CE',
    skyBottom: '#1477B8',
    patternColor: 'rgba(255, 255, 255, 0.14)',
    logoTopFill: '#FAF3E3',
    logoBottomFill: '#FBBF24',
    logoGlow: 'rgba(255, 214, 70, 0.35)',
    logoUnderline: '#FF3E8A',
    dialogBg: '#1E1E24',
    dialogText: '#FBBF24',
    dialogAccent: '#FF5AA5',
    losersHeadingFill: '#FFFFFF',
    losersHeadingShadow: '#1E1E24',
    groundStyle: 'angled-wave',
    groundPrimary: '#FF7A2F',
    groundSecondary: '#FF9B42',
    groundLine: '#1E1E24',
    footerHookColor: '#1E1E24',
    footerLinkBg: '#FAF7F2',
    footerLinkText: '#1E1E24',
    footerSubColor: '#FFFDF8',
    arrowColor: '#1E1E24',
    qrTabBg: '#FFFDF7',
    qrBadgeBg: '#FBBF24',
    qrBadgeText: '#1E1E24',
    previewSwatch: ['#0F88CE', '#FBBF24', '#FF7A2F'],
  },
  'playverse-arcade': {
    id: 'playverse-arcade',
    name: 'Playverse Arcade',
    badge: 'Sky & Lime Grid',
    skyTop: '#168FEF',
    skyBottom: '#2FA6FF',
    patternColor: 'rgba(255, 255, 255, 0.18)',
    logoTopFill: '#FFFFFF',
    logoBottomFill: '#D4FF2A',
    logoGlow: 'rgba(190, 242, 100, 0.45)',
    logoUnderline: '#7C3AED',
    dialogBg: '#181433',
    dialogText: '#D4FF2A',
    dialogAccent: '#FF66C4',
    losersHeadingFill: '#D4FF2A',
    losersHeadingShadow: '#181433',
    groundStyle: 'perspective-grid',
    groundPrimary: '#A3E635',
    groundSecondary: '#D9F99D',
    groundLine: '#3F6212',
    footerHookColor: '#181433',
    footerLinkBg: '#181433',
    footerLinkText: '#D4FF2A',
    footerSubColor: '#1E1E24',
    arrowColor: '#6D28D9',
    qrTabBg: '#FFFFFF',
    qrBadgeBg: '#7C3AED',
    qrBadgeText: '#FFFFFF',
    previewSwatch: ['#1D9BF0', '#7C3AED', '#A3E635'],
  },
  'partyhub-cream': {
    id: 'partyhub-cream',
    name: 'PartyHub Cream',
    badge: 'Signature Warm',
    skyTop: '#FAF7F2',
    skyBottom: '#F5EFE4',
    patternColor: 'rgba(30, 30, 36, 0.085)',
    logoTopFill: '#EC5A29',
    logoBottomFill: '#FBBF24',
    logoGlow: 'rgba(251, 191, 36, 0.25)',
    logoUnderline: '#158467',
    dialogBg: '#1E1E24',
    dialogText: '#FAF7F2',
    dialogAccent: '#4AE3B5',
    losersHeadingFill: '#1E1E24',
    losersHeadingShadow: '#FBBF24',
    groundStyle: 'scalloped',
    groundPrimary: '#1E1E24',
    groundSecondary: '#FBBF24',
    groundLine: '#FBBF24',
    footerHookColor: '#FBBF24',
    footerLinkBg: '#4AE3B5',
    footerLinkText: '#1E1E24',
    footerSubColor: '#FAF7F2',
    arrowColor: '#FBBF24',
    qrTabBg: '#FAF7F2',
    qrBadgeBg: '#EC5A29',
    qrBadgeText: '#FFFFFF',
    previewSwatch: ['#FAF7F2', '#158467', '#1E1E24'],
  },
  'berry-night': {
    id: 'berry-night',
    name: 'Berry Night',
    badge: 'Retro Synth',
    skyTop: '#4C1D95',
    skyBottom: '#9D174D',
    patternColor: 'rgba(255, 255, 255, 0.12)',
    logoTopFill: '#FFFFFF',
    logoBottomFill: '#BEF264',
    logoGlow: 'rgba(190, 242, 100, 0.4)',
    logoUnderline: '#38BDF8',
    dialogBg: '#130F26',
    dialogText: '#38BDF8',
    dialogAccent: '#FBBF24',
    losersHeadingFill: '#FBBF24',
    losersHeadingShadow: '#130F26',
    groundStyle: 'synth-grid',
    groundPrimary: '#1A1133',
    groundSecondary: '#C82373',
    groundLine: '#FF4DA6',
    footerHookColor: '#BEF264',
    footerLinkBg: '#FBBF24',
    footerLinkText: '#130F26',
    footerSubColor: '#FAF7F2',
    arrowColor: '#38BDF8',
    qrTabBg: '#FAF7F2',
    qrBadgeBg: '#D8317E',
    qrBadgeText: '#FFFFFF',
    previewSwatch: ['#5B21B6', '#C82373', '#BEF264'],
  },
};

const SUBDIALOG_PRESETS = [
  { id: 's1', tag: 'Klasik', template: 'Kami kalah main boardgame bareng {team} 😭' },
  { id: 's2', tag: 'Telak', template: 'Kalah telak main PartyGamesHub bareng {team} 💀' },
  { id: 's3', tag: 'Ronde Akhir', template: 'Korban kalah ronde terakhir bareng {team} 📸' },
  { id: 's4', tag: 'Anti Hoki', template: 'Tim paling hoki (kebalikannya) bareng {team} 😂' },
];

const LOSER_HEADING_PRESETS = [
  "PARTY'S LOSERS!",
  'CERTIFIED LOSERS 💀',
  'SQUAD KALAH HARI INI',
  'HALL OF SHAME 😭',
];

const FOOTER_HOOK_PRESETS = [
  'Cobain bareng gengmu!',
  'Berani adu seru bareng timmu?',
  'Main rame-rame biar makin chaos!',
];

const STICKER_LABEL_PALETTE: { bg: string; text: string }[] = [
  { bg: '#FBBF24', text: '#1E1E24' },
  { bg: '#FF75B5', text: '#1E1E24' },
  { bg: '#4AE3B5', text: '#1E1E24' },
  { bg: '#FF8A4C', text: '#1E1E24' },
  { bg: '#7DD3FC', text: '#1E1E24' },
  { bg: '#D9F99D', text: '#1E1E24' },
  { bg: '#C4B5FD', text: '#1E1E24' },
  { bg: '#FFFDF7', text: '#1E1E24' },
];

const DEFAULT_LOSERS: LoserLabelItem[] = [
  { id: 'l1', name: 'Fajar', rotation: -5.5, color: '#FBBF24', textColor: '#1E1E24', frontSpot: true },
  { id: 'l2', name: 'Dimas', rotation: 3.8, color: '#FF75B5', textColor: '#1E1E24', frontSpot: false },
  { id: 'l3', name: 'Rizky', rotation: -4.2, color: '#4AE3B5', textColor: '#1E1E24', frontSpot: false },
];

// ============================================================================
// 2. ZERO-DEPENDENCY WEB AUDIO API SOUND ENGINE
// ============================================================================
class StudioSFX {
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

  playPop(pitch = 560) {
    if (this.muted) return;
    try {
      const ctx = this.ensureCtx();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, now);
      osc.frequency.exponentialRampToValueAtTime(pitch * 1.48, now + 0.075);
      g.gain.setValueAtTime(0.14, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.095);
    } catch {}
  }

  playCountdown(isFinal = false) {
    if (this.muted) return;
    try {
      const ctx = this.ensureCtx();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle';
      const freq = isFinal ? 1046.5 : 659.25;
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.07, now + 0.12);
      g.gain.setValueAtTime(0.17, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.17);
    } catch {}
  }

  playShutter() {
    if (this.muted) return;
    try {
      const ctx = this.ensureCtx();
      if (!ctx) return;
      const now = ctx.currentTime;
      const len = Math.floor(ctx.sampleRate * 0.085);
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const ch = buf.getChannelData(0);
      for (let i = 0; i < len; i++) {
        const env = i < len * 0.2 ? 1 : Math.pow(1 - i / len, 2.3);
        ch[i] = (Math.random() * 2 - 1) * env;
      }
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2200, now);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.28, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      src.connect(filter);
      filter.connect(g);
      g.connect(ctx.destination);
      src.start(now);

      const thump = ctx.createOscillator();
      const tg = ctx.createGain();
      thump.type = 'sine';
      thump.frequency.setValueAtTime(210, now + 0.025);
      thump.frequency.exponentialRampToValueAtTime(60, now + 0.11);
      tg.gain.setValueAtTime(0.18, now + 0.025);
      tg.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      thump.connect(tg);
      tg.connect(ctx.destination);
      thump.start(now + 0.025);
      thump.stop(now + 0.13);
    } catch {}
  }

  playShuffle() {
    if (this.muted) return;
    try {
      const ctx = this.ensureCtx();
      if (!ctx) return;
      [440, 554, 659, 880].forEach((f, idx) => {
        const t = ctx.currentTime + idx * 0.038;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, t);
        g.gain.setValueAtTime(0.1, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.065);
      });
    } catch {}
  }

  playFanfare() {
    if (this.muted) return;
    try {
      const ctx = this.ensureCtx();
      if (!ctx) return;
      [
        { f: 523.25, t: 0, d: 0.11 },
        { f: 659.25, t: 0.09, d: 0.11 },
        { f: 783.99, t: 0.18, d: 0.12 },
        { f: 1046.5, t: 0.28, d: 0.34 },
      ].forEach(({ f, t, d }) => {
        const start = ctx.currentTime + t;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, start);
        g.gain.setValueAtTime(0.14, start);
        g.gain.exponentialRampToValueAtTime(0.001, start + d);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + d + 0.02);
      });
    } catch {}
  }
}

const sfx = new StudioSFX();

// ============================================================================
// 3. SPEC-COMPLIANT ISO/IEC 18004 QR CODE GENERATOR IN PURE TYPESCRIPT
// ============================================================================
const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x;
    GF_LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) GF_EXP[i] = GF_EXP[i - 255];
})();

function gfMul(a: number, b: number): number {
  return a === 0 || b === 0 ? 0 : GF_EXP[GF_LOG[a] + GF_LOG[b]];
}

function rsGeneratorPoly(degree: number): Uint8Array {
  let poly = new Uint8Array([1]);
  for (let i = 0; i < degree; i++) {
    const next = new Uint8Array(poly.length + 1);
    const root = GF_EXP[i];
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= poly[j];
      next[j + 1] ^= gfMul(poly[j], root);
    }
    poly = next;
  }
  return poly;
}

function rsComputeEcc(data: Uint8Array, eccLen: number): Uint8Array {
  const gen = rsGeneratorPoly(eccLen);
  const rem = new Uint8Array(eccLen);
  for (let i = 0; i < data.length; i++) {
    const factor = data[i] ^ rem[0];
    for (let j = 0; j < eccLen - 1; j++) {
      rem[j] = rem[j + 1] ^ gfMul(gen[j + 1], factor);
    }
    rem[eccLen - 1] = gfMul(gen[eccLen], factor);
  }
  return rem;
}

function computeFormatBits(eccIndicatorBits: number, maskPattern: number): number {
  const data = (eccIndicatorBits << 3) | maskPattern;
  let rem = data << 10;
  for (let i = 14; i >= 10; i--) {
    if ((rem >> i) & 1) rem ^= 0x537 << (i - 10);
  }
  return ((data << 10) | rem) ^ 0x5412;
}

function generateScannableQrMatrix(text: string): boolean[][] {
  const bytes = new TextEncoder().encode(text);
  const useV3M = bytes.length <= 42;
  const version = useV3M ? 3 : 4;
  const size = 21 + (version - 1) * 4;
  const dataCodewords = useV3M ? 44 : 80;
  const eccCodewords = useV3M ? 26 : 20;
  const eccIndicator = useV3M ? 0b00 : 0b01;
  const alignCenter = useV3M ? 22 : 26;

  const bits: number[] = [];
  const pushBits = (val: number, count: number) => {
    for (let i = count - 1; i >= 0; i--) bits.push((val >> i) & 1);
  };
  pushBits(0b0100, 4);
  pushBits(bytes.length, 8);
  for (let i = 0; i < bytes.length; i++) pushBits(bytes[i], 8);

  const maxBits = dataCodewords * 8;
  for (let i = 0; i < Math.min(4, maxBits - bits.length); i++) bits.push(0);
  while (bits.length % 8 !== 0) bits.push(0);

  const dataArr = new Uint8Array(dataCodewords);
  for (let i = 0; i < bits.length / 8; i++) {
    let b = 0;
    for (let j = 0; j < 8; j++) b = (b << 1) | bits[i * 8 + j];
    dataArr[i] = b;
  }
  const padBytes = [0xec, 0x11];
  for (let i = bits.length / 8, p = 0; i < dataCodewords; i++, p = 1 - p) {
    dataArr[i] = padBytes[p];
  }

  const eccArr = rsComputeEcc(dataArr, eccCodewords);
  const fullCodewords = new Uint8Array(dataCodewords + eccCodewords);
  fullCodewords.set(dataArr, 0);
  fullCodewords.set(eccArr, dataCodewords);

  const baseModules: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
  const isFunction: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  const setFunc = (r: number, c: number, val: boolean) => {
    if (r >= 0 && r < size && c >= 0 && c < size) {
      baseModules[r][c] = val;
      isFunction[r][c] = true;
    }
  };

  const drawFinder = (topR: number, topC: number) => {
    for (let dr = -1; dr <= 7; dr++) {
      for (let dc = -1; dc <= 7; dc++) {
        const r = topR + dr;
        const c = topC + dc;
        if (r < 0 || r >= size || c < 0 || c >= size) continue;
        const inOuter = dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6;
        const onBorder = dr === 0 || dr === 6 || dc === 0 || dc === 6;
        const inInner = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
        setFunc(r, c, inOuter && (onBorder || inInner));
      }
    }
  };
  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  for (let dr = -2; dr <= 2; dr++) {
    for (let dc = -2; dc <= 2; dc++) {
      setFunc(alignCenter + dr, alignCenter + dc, Math.max(Math.abs(dr), Math.abs(dc)) !== 1);
    }
  }

  for (let i = 8; i < size - 8; i++) {
    if (!isFunction[6][i]) setFunc(6, i, i % 2 === 0);
    if (!isFunction[i][6]) setFunc(i, 6, i % 2 === 0);
  }

  setFunc(size - 8, 8, true);
  for (let i = 0; i <= 8; i++) {
    if (i !== 6) {
      isFunction[8][i] = true;
      isFunction[i][8] = true;
    }
  }
  for (let i = size - 8; i < size; i++) isFunction[8][i] = true;
  for (let i = size - 7; i < size; i++) isFunction[i][8] = true;

  let bitIdx = 0;
  const totalBits = fullCodewords.length * 8;
  let upward = true;
  for (let col = size - 1; col >= 1; col -= 2) {
    if (col === 6) col = 5;
    for (let step = 0; step < size; step++) {
      const row = upward ? size - 1 - step : step;
      for (let dx = 0; dx < 2; dx++) {
        const c = col - dx;
        if (!isFunction[row][c]) {
          let bit = false;
          if (bitIdx < totalBits) {
            bit = ((fullCodewords[bitIdx >> 3] >> (7 - (bitIdx & 7))) & 1) === 1;
            bitIdx++;
          }
          baseModules[row][c] = bit;
        }
      }
    }
    upward = !upward;
  }

  const maskFns: ((r: number, c: number) => boolean)[] = [
    (r, c) => (r + c) % 2 === 0,
    (r) => r % 2 === 0,
    (_, c) => c % 3 === 0,
    (r, c) => (r + c) % 3 === 0,
    (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
    (r, c) => ((r * c) % 2) + ((r * c) % 3) === 0,
    (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0,
    (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0,
  ];

  const applyFormat = (mat: boolean[][], maskId: number) => {
    const fmt = computeFormatBits(eccIndicator, maskId);
    const getBit = (idx: number) => ((fmt >> idx) & 1) === 1;
    const coords1: [number, number][] = [
      [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 7], [8, 8],
      [7, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8],
    ];
    for (let i = 0; i < 15; i++) mat[coords1[i][0]][coords1[i][1]] = getBit(14 - i);
    for (let i = 0; i < 7; i++) mat[size - 1 - i][8] = getBit(14 - i);
    for (let i = 0; i < 8; i++) mat[8][size - 8 + i] = getBit(7 - i);
  };

  const computePenalty = (mat: boolean[][]): number => {
    let penalty = 0;
    for (let r = 0; r < size; r++) {
      let run = 1;
      for (let c = 1; c < size; c++) {
        if (mat[r][c] === mat[r][c - 1]) {
          run++;
          if (run === 5) penalty += 3;
          else if (run > 5) penalty += 1;
        } else run = 1;
      }
    }
    for (let c = 0; c < size; c++) {
      let run = 1;
      for (let r = 1; r < size; r++) {
        if (mat[r][c] === mat[r - 1][c]) {
          run++;
          if (run === 5) penalty += 3;
          else if (run > 5) penalty += 1;
        } else run = 1;
      }
    }
    for (let r = 0; r < size - 1; r++) {
      for (let c = 0; c < size - 1; c++) {
        const v = mat[r][c];
        if (v === mat[r][c + 1] && v === mat[r + 1][c] && v === mat[r + 1][c + 1]) penalty += 3;
      }
    }
    return penalty;
  };

  let best = baseModules;
  let bestP = Infinity;
  for (let m = 0; m < 8; m++) {
    const cand = baseModules.map((row, r) =>
      row.map((val, c) => (!isFunction[r][c] && maskFns[m](r, c) ? !val : val))
    );
    applyFormat(cand, m);
    const p = computePenalty(cand);
    if (p < bestP) {
      bestP = p;
      best = cand;
    }
  }
  return best;
}

// ============================================================================
// 4. HTML5 CANVAS 2D POSTER RENDERING ENGINE (1080×1920 — 100% WYSIWYG PARITY)
// ============================================================================
interface PosterCanvasState {
  themeId: PosterThemeId;
  frameStyle: FrameStyleId;
  subDialog: string;
  losersHeading: string;
  losers: LoserLabelItem[];
  footerHook: string;
  footerSubCta: string;
  frameTiltDeg: number;
  zoom: number;
  panX: number;
  panY: number;
  mirrorPhoto: boolean;
  crtFilter: boolean;
  showMascots: boolean;
  mascotMoodPreset: MascotMoodPreset;
  countdown: number | null;
  qrMatrix: boolean[][];
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function topRoundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const rr = Math.min(r, w / 2, h);
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.lineTo(x, y + rr);
  ctx.arcTo(x, y, x + rr, y, rr);
  ctx.lineTo(x + w - rr, y);
  ctx.arcTo(x + w, y, x + w, y + rr, rr);
  ctx.lineTo(x + w, y + h);
  ctx.closePath();
}

function drawFourPointStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  outerR: number,
  fill: string,
  stroke = '#1E1E24',
  lineWidth = 4
) {
  const innerR = outerR * 0.36;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    const rad = i % 2 === 0 ? outerR : innerR;
    const px = Math.cos(a) * rad;
    const py = Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (lineWidth > 0) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.lineJoin = 'round';
    ctx.stroke();
  }
  ctx.restore();
}

function drawPixelPlus(ctx: CanvasRenderingContext2D, cx: number, cy: number, unit: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(cx - unit * 1.5, cy - unit * 0.5, unit * 3, unit);
  ctx.fillRect(cx - unit * 0.5, cy - unit * 1.5, unit, unit * 3);
}

function drawSquiggle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  len: number,
  amp: number,
  rot: number,
  color: string
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.beginPath();
  const waves = 3;
  const step = len / (waves * 2);
  ctx.moveTo(-len / 2, 0);
  for (let i = 0; i < waves * 2; i++) {
    const sx = -len / 2 + i * step;
    const ctrlY = i % 2 === 0 ? -amp : amp;
    ctx.quadraticCurveTo(sx + step / 2, ctrlY, sx + step, 0);
  }
  ctx.strokeStyle = '#1E1E24';
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.strokeStyle = color;
  ctx.lineWidth = 7;
  ctx.stroke();
  ctx.restore();
}

function drawComicBurst(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rOuter: number,
  spikes: number,
  fill: string
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const a = (i * Math.PI) / spikes;
    const r = i % 2 === 0 ? rOuter : rOuter * 0.54;
    const px = Math.cos(a) * r;
    const py = Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#1E1E24';
  ctx.lineJoin = 'round';
  ctx.stroke();
  ctx.restore();
}

function drawPixelCloud(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = '#CBD5E1';
  ctx.fillRect(-3.5 * s, 0.5 * s, 7 * s, 1.5 * s);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(-3.5 * s, 0, 7 * s, 1.4 * s);
  ctx.fillRect(-2.5 * s, -1.1 * s, 5.2 * s, 1.4 * s);
  ctx.fillRect(-1.2 * s, -2.1 * s, 2.8 * s, 1.3 * s);
  ctx.restore();
}

function drawHeartSticker(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number, fill: string) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.beginPath();
  ctx.moveTo(0, s * 0.75);
  ctx.bezierCurveTo(-s * 1.15, s * 0.1, -s * 1.05, -s * 0.9, 0, -s * 0.35);
  ctx.bezierCurveTo(s * 1.05, -s * 0.9, s * 1.15, s * 0.1, 0, s * 0.75);
  ctx.closePath();
  ctx.lineWidth = 10;
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineJoin = 'round';
  ctx.stroke();
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#1E1E24';
  ctx.stroke();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.restore();
}

function drawRainbowSticker(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, rot = 0) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);
  const bands = [
    { rad: r, color: '#FF4D8D' },
    { rad: r * 0.76, color: '#FBBF24' },
    { rad: r * 0.52, color: '#38BDF8' },
  ];
  ctx.beginPath();
  ctx.arc(0, 0, r + 9, Math.PI, 0, false);
  ctx.closePath();
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#1E1E24';
  ctx.stroke();

  bands.forEach((b) => {
    ctx.beginPath();
    ctx.arc(0, 0, b.rad, Math.PI, 0, false);
    ctx.lineWidth = r * 0.24;
    ctx.strokeStyle = b.color;
    ctx.stroke();
  });
  ctx.beginPath();
  ctx.moveTo(-r - 9, 0);
  ctx.lineTo(r + 9, 0);
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#1E1E24';
  ctx.stroke();
  ctx.restore();
}

function drawCanvasMascot(
  ctx: CanvasRenderingContext2D,
  opts: {
    x: number;
    y: number;
    radius: number;
    shape: MascotShape;
    color: string;
    mood: MascotMood;
    rotation?: number;
  }
) {
  const { x, y, radius: r, shape, color, mood, rotation = 0 } = opts;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  const trace = () => {
    switch (shape) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.92, 0, Math.PI * 2);
        ctx.closePath();
        break;
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(0, -r * 0.96);
        ctx.quadraticCurveTo(r * 0.26, -r * 0.96, r * 0.92, r * 0.56);
        ctx.quadraticCurveTo(r * 1.02, r * 0.84, r * 0.68, r * 0.84);
        ctx.lineTo(-r * 0.68, r * 0.84);
        ctx.quadraticCurveTo(-r * 1.02, r * 0.84, -r * 0.92, r * 0.56);
        ctx.quadraticCurveTo(-r * 0.26, -r * 0.96, 0, -r * 0.96);
        ctx.closePath();
        break;
      case 'cloud':
        ctx.beginPath();
        ctx.moveTo(-r * 0.62, r * 0.64);
        ctx.bezierCurveTo(-r * 1.05, r * 0.64, -r * 1.12, r * 0.12, -r * 0.78, -r * 0.06);
        ctx.bezierCurveTo(-r * 0.84, -r * 0.54, -r * 0.36, -r * 0.72, -r * 0.16, -r * 0.48);
        ctx.bezierCurveTo(-r * 0.02, -r * 0.96, r * 0.66, -r * 0.92, r * 0.68, -r * 0.32);
        ctx.bezierCurveTo(r * 1.08, -r * 0.26, r * 1.12, r * 0.48, r * 0.64, r * 0.64);
        ctx.closePath();
        break;
      case 'blob':
        ctx.beginPath();
        for (let i = 0; i <= 72; i++) {
          const th = (i / 72) * Math.PI * 2;
          const rad = r * (0.78 + 0.22 * Math.cos(4 * th));
          const px = Math.cos(th) * rad;
          const py = Math.sin(th) * rad;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        break;
      case 'squircle':
      default:
        roundRectPath(ctx, -r * 0.88, -r * 0.84, r * 1.76, r * 1.68, r * 0.54);
        break;
    }
  };

  ctx.save();
  ctx.translate(7, 9);
  trace();
  ctx.lineJoin = 'round';
  ctx.lineWidth = r * 0.44;
  ctx.strokeStyle = 'rgba(24, 24, 30, 0.45)';
  ctx.stroke();
  ctx.restore();

  trace();
  ctx.lineJoin = 'round';
  ctx.lineWidth = r * 0.44;
  ctx.strokeStyle = '#1E1E24';
  ctx.stroke();

  trace();
  ctx.lineJoin = 'round';
  ctx.lineWidth = r * 0.24;
  ctx.strokeStyle = '#FFFFFF';
  ctx.stroke();

  trace();
  ctx.fillStyle = color;
  ctx.fill();

  ctx.save();
  ctx.globalAlpha = 0.24;
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.ellipse(-r * 0.26, -r * 0.36, r * 0.24, r * 0.11, -0.45, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const eyeY = shape === 'triangle' ? r * 0.16 : 0;
  const eyeGap = r * 0.28;

  if (mood === 'cool') {
    ctx.fillStyle = '#1E1E24';
    roundRectPath(ctx, -eyeGap - r * 0.29, eyeY - r * 0.2, r * 0.5, r * 0.34, r * 0.1);
    ctx.fill();
    roundRectPath(ctx, eyeGap - r * 0.21, eyeY - r * 0.2, r * 0.5, r * 0.34, r * 0.1);
    ctx.fill();
    ctx.fillRect(-r * 0.14, eyeY - r * 0.08, r * 0.28, r * 0.08);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = Math.max(3, r * 0.075);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-eyeGap - r * 0.12, eyeY - r * 0.08);
    ctx.lineTo(-eyeGap + r * 0.04, eyeY + r * 0.06);
    ctx.moveTo(eyeGap - r * 0.04, eyeY - r * 0.08);
    ctx.lineTo(eyeGap + r * 0.12, eyeY + r * 0.06);
    ctx.stroke();
  } else if (mood === 'laugh' || mood === 'happy') {
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = Math.max(4.5, r * 0.125);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-eyeGap - r * 0.14, eyeY + r * 0.07);
    ctx.quadraticCurveTo(-eyeGap, eyeY - r * 0.16, -eyeGap + r * 0.14, eyeY + r * 0.07);
    ctx.moveTo(eyeGap - r * 0.14, eyeY + r * 0.07);
    ctx.quadraticCurveTo(eyeGap, eyeY - r * 0.16, eyeGap + r * 0.14, eyeY + r * 0.07);
    ctx.stroke();
  } else if (mood === 'dizzy') {
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = Math.max(4.5, r * 0.11);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-eyeGap - r * 0.12, eyeY - r * 0.12);
    ctx.lineTo(-eyeGap + r * 0.12, eyeY + r * 0.12);
    ctx.moveTo(-eyeGap + r * 0.12, eyeY - r * 0.12);
    ctx.lineTo(-eyeGap - r * 0.12, eyeY + r * 0.12);
    ctx.moveTo(eyeGap - r * 0.12, eyeY - r * 0.12);
    ctx.lineTo(eyeGap + r * 0.12, eyeY + r * 0.12);
    ctx.moveTo(eyeGap + r * 0.12, eyeY - r * 0.12);
    ctx.lineTo(eyeGap - r * 0.12, eyeY + r * 0.12);
    ctx.stroke();
  } else {
    ctx.fillStyle = '#FFFFFF';
    const h = mood === 'shocked' ? r * 0.56 : r * 0.46;
    roundRectPath(ctx, -eyeGap - r * 0.1, eyeY - h / 2, r * 0.21, h, r * 0.1);
    ctx.fill();
    roundRectPath(ctx, eyeGap - r * 0.1, eyeY - h / 2, r * 0.21, h, r * 0.1);
    ctx.fill();
  }

  ctx.restore();
}

function drawPosterToCanvas(
  ctx: CanvasRenderingContext2D,
  state: PosterCanvasState,
  mediaSource: HTMLImageElement | HTMLVideoElement | null
) {
  const W = 1080;
  const H = 1920;
  const theme = POSTER_THEMES[state.themeId];

  // A. FULL-BLEED NEO-RETRO POSTER SKY / UPPER FIELD
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H * 0.8);
  bgGrad.addColorStop(0, theme.skyTop);
  bgGrad.addColorStop(1, theme.skyBottom);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  if (theme.id === 'berry-night') {
    ctx.strokeStyle = theme.patternColor;
    ctx.lineWidth = 2;
    for (let x = 0; x < W; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y < H; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
  } else {
    ctx.fillStyle = theme.patternColor;
    const step = 42;
    for (let y = 24; y < H; y += step) {
      for (let x = 24; x < W; x += step) {
        ctx.beginPath();
        ctx.arc(x, y, 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  if (theme.id === 'playverse-arcade') {
    ctx.save();
    ctx.translate(W / 2, 230);
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    for (let i = 0; i < 12; i++) {
      ctx.rotate(Math.PI / 6);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-42, -900);
      ctx.lineTo(42, -900);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    drawPixelCloud(ctx, 130, 170, 26);
    drawPixelCloud(ctx, 965, 250, 28);
    drawPixelCloud(ctx, 90, 445, 22);
    drawPixelCloud(ctx, 985, 510, 22);

    ctx.strokeStyle = '#181433';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    [
      [190, 275],
      [230, 298],
      [885, 118],
    ].forEach(([bx, by]) => {
      ctx.beginPath();
      ctx.moveTo(bx - 16, by + 6);
      ctx.quadraticCurveTo(bx - 8, by - 8, bx, by + 4);
      ctx.quadraticCurveTo(bx + 8, by - 8, bx + 16, by + 6);
      ctx.stroke();
    });
  } else {
    drawComicBurst(ctx, 78, 138, 44, 9, '#FBBF24');
    drawComicBurst(ctx, 1005, 152, 42, 8, '#FF5AA5');
    drawSquiggle(ctx, 145, 345, 92, 16, -0.35, '#4AE3B5');
    drawSquiggle(ctx, 945, 375, 96, 16, 0.4, '#FBBF24');
    drawSquiggle(ctx, 92, 1165, 84, 15, 0.55, '#FF5AA5');
    drawSquiggle(ctx, 985, 1185, 86, 15, -0.45, '#38BDF8');

    [
      { x: 250, y: 78, w: 28, h: 14, r: 0.4, c: '#4AE3B5' },
      { x: 845, y: 84, w: 28, h: 14, r: -0.5, c: '#FF8A4C' },
      { x: 74, y: 545, w: 22, h: 22, r: 0.35, c: '#FBBF24' },
      { x: 1004, y: 570, w: 24, h: 24, r: -0.3, c: '#4AE3B5' },
    ].forEach((b) => {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.r);
      ctx.fillStyle = b.c;
      ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#1E1E24';
      ctx.strokeRect(-b.w / 2, -b.h / 2, b.w, b.h);
      ctx.restore();
    });
  }

  // B. FLUID ILLUSTRATED GROUND HORIZON / RETRO FLOOR
  const groundTopY = 1525;
  ctx.save();
  if (theme.groundStyle === 'perspective-grid') {
    ctx.fillStyle = theme.groundPrimary;
    ctx.fillRect(0, groundTopY, W, H - groundTopY);

    ctx.fillStyle = '#181433';
    ctx.fillRect(0, groundTopY - 8, W, 10);

    ctx.strokeStyle = theme.groundLine;
    ctx.lineWidth = 4;
    const vanishX = W / 2;
    for (let i = -8; i <= 8; i++) {
      const botX = W / 2 + i * 165;
      ctx.beginPath();
      ctx.moveTo(vanishX + (botX - vanishX) * 0.42, groundTopY);
      ctx.lineTo(botX, H + 40);
      ctx.stroke();
    }
    [0, 56, 125, 210, 315].forEach((dy) => {
      ctx.beginPath();
      ctx.moveTo(0, groundTopY + dy);
      ctx.lineTo(W, groundTopY + dy);
      ctx.stroke();
    });

    [
      [115, 1615, '#FF5AA5'],
      [345, 1695, '#FFFFFF'],
      [540, 1605, '#2568EF'],
      [180, 1825, '#FFFFFF'],
      [480, 1850, '#FF5AA5'],
      [685, 1765, '#38BDF8'],
    ].forEach(([px, py, col]) => {
      drawPixelPlus(ctx, px as number, py as number, 9, col as string);
    });
  } else if (theme.groundStyle === 'synth-grid') {
    const fgGrad = ctx.createLinearGradient(0, groundTopY, 0, H);
    fgGrad.addColorStop(0, '#2A114B');
    fgGrad.addColorStop(1, '#120826');
    ctx.fillStyle = fgGrad;
    ctx.fillRect(0, groundTopY, W, H - groundTopY);

    ctx.fillStyle = '#FF4DA6';
    ctx.fillRect(0, groundTopY - 6, W, 8);

    ctx.strokeStyle = 'rgba(255, 77, 166, 0.52)';
    ctx.lineWidth = 3.5;
    for (let i = -7; i <= 7; i++) {
      const botX = W / 2 + i * 170;
      ctx.beginPath();
      ctx.moveTo(W / 2 + (botX - W / 2) * 0.4, groundTopY);
      ctx.lineTo(botX, H + 20);
      ctx.stroke();
    }
    [45, 108, 190, 290].forEach((dy) => {
      ctx.beginPath();
      ctx.moveTo(0, groundTopY + dy);
      ctx.lineTo(W, groundTopY + dy);
      ctx.stroke();
    });
  } else if (theme.groundStyle === 'scalloped') {
    ctx.beginPath();
    ctx.moveTo(0, groundTopY + 24);
    const waveW = 135;
    for (let x = 0; x < W; x += waveW) {
      ctx.quadraticCurveTo(x + waveW / 2, groundTopY - 26, x + waveW, groundTopY + 24);
    }
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fillStyle = theme.groundPrimary;
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, groundTopY + 24);
    for (let x = 0; x < W; x += waveW) {
      ctx.quadraticCurveTo(x + waveW / 2, groundTopY - 26, x + waveW, groundTopY + 24);
    }
    ctx.strokeStyle = '#FBBF24';
    ctx.lineWidth = 7;
    ctx.setLineDash([18, 18]);
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.restore();
  } else {
    ctx.beginPath();
    ctx.moveTo(0, groundTopY + 18);
    ctx.bezierCurveTo(280, groundTopY - 42, 680, groundTopY + 55, W, groundTopY - 14);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fillStyle = theme.groundPrimary;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, groundTopY + 18);
    ctx.bezierCurveTo(280, groundTopY - 42, 680, groundTopY + 55, W, groundTopY - 14);
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#1E1E24';
    ctx.stroke();

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, groundTopY + 40);
    ctx.bezierCurveTo(280, groundTopY - 20, 680, groundTopY + 77, W, groundTopY + 8);
    ctx.lineWidth = 14;
    ctx.strokeStyle = 'rgba(255, 232, 130, 0.35)';
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();

  // 1. TOP BIG CENTERED BRAND HEADER
  ctx.save();
  ctx.translate(W / 2, 164);

  const logoGlowGrad = ctx.createRadialGradient(0, 10, 20, 0, 10, 320);
  logoGlowGrad.addColorStop(0, theme.logoGlow);
  logoGlowGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = logoGlowGrad;
  ctx.beginPath();
  ctx.arc(0, 10, 320, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.rotate(-0.045);
  roundRectPath(ctx, -355, 58, 710, 26, 13);
  ctx.fillStyle = '#1E1E24';
  ctx.fill();
  roundRectPath(ctx, -360, 52, 710, 24, 12);
  ctx.fillStyle = theme.logoUnderline;
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#1E1E24';
  ctx.stroke();
  ctx.restore();

  const drawArcadeWord = (
    text: string,
    y: number,
    fontSize: number,
    rot: number,
    fill: string,
    extrude = 11
  ) => {
    ctx.save();
    ctx.translate(0, y);
    ctx.rotate(rot);
    ctx.font = `700 ${fontSize}px "Bungee", "Fredoka", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';

    for (let step = extrude; step >= 2; step -= 2) {
      ctx.lineWidth = 18;
      ctx.strokeStyle = '#1E1E24';
      ctx.strokeText(text, step * 0.75, step);
      ctx.fillStyle = '#1E1E24';
      ctx.fillText(text, step * 0.75, step);
    }

    ctx.lineWidth = 18;
    ctx.strokeStyle = '#1E1E24';
    ctx.strokeText(text, 0, 0);
    ctx.fillStyle = fill;
    ctx.fillText(text, 0, 0);
    ctx.restore();
  };

  drawArcadeWord('PARTY', -48, 106, -0.045, theme.logoTopFill, 12);
  drawArcadeWord('GAMES HUB!', 38, 92, -0.04, theme.logoBottomFill, 12);

  drawFourPointStar(ctx, -372, -32, 34, '#FF5AA5', '#1E1E24', 5);
  drawFourPointStar(ctx, 378, -6, 38, '#38BDF8', '#1E1E24', 5);
  drawFourPointStar(ctx, 295, -82, 22, '#FBBF24', '#1E1E24', 4);
  ctx.restore();

  // 2. COMPACT RETRO ARCADE SUB-DIALOG BAR
  const dialogText = (state.subDialog || 'Kami kalah main boardgame bareng Tim Hore 😭').trim();
  ctx.save();
  let dialogFontSize = 27;
  ctx.font = `700 ${dialogFontSize}px "Fredoka", "Plus Jakarta Sans", sans-serif`;
  if (ctx.measureText(dialogText).width > 790) {
    dialogFontSize = 23;
    ctx.font = `700 ${dialogFontSize}px "Fredoka", "Plus Jakarta Sans", sans-serif`;
  }
  const textW = Math.min(820, ctx.measureText(dialogText).width);
  const pillW = Math.max(460, textW + 132);
  const pillH = 66;
  const pillX = (W - pillW) / 2;
  const pillY = 276;

  roundRectPath(ctx, pillX + 7, pillY + 8, pillW, pillH, 24);
  ctx.fillStyle = 'rgba(20, 20, 28, 0.45)';
  ctx.fill();

  roundRectPath(ctx, pillX, pillY, pillW, pillH, 24);
  ctx.fillStyle = theme.dialogBg;
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = theme.id === 'partyhub-cream' ? '#1E1E24' : '#FFFFFF';
  ctx.stroke();

  drawPixelPlus(ctx, pillX + 36, pillY + pillH / 2, 7, theme.dialogAccent);
  drawPixelPlus(ctx, pillX + pillW - 36, pillY + pillH / 2, 7, theme.dialogAccent);

  ctx.fillStyle = theme.dialogText;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(dialogText, W / 2, pillY + pillH / 2 + 1, pillW - 110);
  ctx.restore();

  // 3. MIDDLE: SLIGHTLY TILTED RETRO FRAME + PHOTO + MASCOTS
  const frameCenterX = W / 2;
  const frameCenterY = 745;
  const tiltRad = (state.frameTiltDeg * Math.PI) / 180;

  const drawScreenMedia = (sx: number, sy: number, sw: number, sh: number, sr: number) => {
    ctx.save();
    roundRectPath(ctx, sx, sy, sw, sh, sr);
    ctx.clip();

    const hasVideo =
      mediaSource &&
      mediaSource instanceof HTMLVideoElement &&
      mediaSource.readyState >= 2 &&
      mediaSource.videoWidth > 0;
    const hasImg =
      mediaSource &&
      mediaSource instanceof HTMLImageElement &&
      mediaSource.complete &&
      mediaSource.naturalWidth > 0;

    if (hasVideo || hasImg) {
      const srcW = hasVideo
        ? (mediaSource as HTMLVideoElement).videoWidth
        : (mediaSource as HTMLImageElement).naturalWidth;
      const srcH = hasVideo
        ? (mediaSource as HTMLVideoElement).videoHeight
        : (mediaSource as HTMLImageElement).naturalHeight;

      ctx.fillStyle = '#15151C';
      ctx.fillRect(sx, sy, sw, sh);

      const mediaRatio = srcW / srcH;
      const boxRatio = sw / sh;
      let drawW = sw;
      let drawH = sh;
      if (mediaRatio > boxRatio) {
        drawH = sh * state.zoom;
        drawW = drawH * mediaRatio;
      } else {
        drawW = sw * state.zoom;
        drawH = drawW / mediaRatio;
      }

      const cx = sx + sw / 2 + (state.panX / 100) * (sw * 0.55);
      const cy = sy + sh / 2 + (state.panY / 100) * (sh * 0.55);

      ctx.save();
      ctx.translate(cx, cy);
      if (state.mirrorPhoto) ctx.scale(-1, 1);
      ctx.drawImage(mediaSource as CanvasImageSource, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      if (state.crtFilter) {
        ctx.fillStyle = 'rgba(18, 16, 28, 0.14)';
        for (let scan = sy; scan < sy + sh; scan += 8) {
          ctx.fillRect(sx, scan, sw, 3);
        }
        const vig = ctx.createRadialGradient(
          sx + sw / 2,
          sy + sh / 2,
          sw * 0.25,
          sx + sw / 2,
          sy + sh / 2,
          sw * 0.72
        );
        vig.addColorStop(0, 'rgba(255, 220, 150, 0.04)');
        vig.addColorStop(1, 'rgba(15, 12, 26, 0.34)');
        ctx.fillStyle = vig;
        ctx.fillRect(sx, sy, sw, sh);
      }
    } else {
      const pGrad = ctx.createLinearGradient(sx, sy, sx, sy + sh);
      pGrad.addColorStop(0, '#1B9CE5');
      pGrad.addColorStop(0.75, '#4CC9F0');
      pGrad.addColorStop(0.75, '#52B788');
      pGrad.addColorStop(1, '#2D6A4F');
      ctx.fillStyle = pGrad;
      ctx.fillRect(sx, sy, sw, sh);

      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      for (let scan = sy; scan < sy + sh; scan += 10) ctx.fillRect(sx, scan, sw, 3);

      drawPixelCloud(ctx, sx + 125, sy + 95, 17);
      drawPixelCloud(ctx, sx + sw - 130, sy + 130, 19);

      drawCanvasMascot(ctx, {
        x: sx + sw / 2 - 110,
        y: sy + sh * 0.53,
        radius: 56,
        shape: 'squircle',
        color: '#EC5A29',
        mood: 'dizzy',
        rotation: -0.1,
      });
      drawCanvasMascot(ctx, {
        x: sx + sw / 2,
        y: sy + sh * 0.47,
        radius: 62,
        shape: 'circle',
        color: '#FBBF24',
        mood: 'shocked',
        rotation: 0.04,
      });
      drawCanvasMascot(ctx, {
        x: sx + sw / 2 + 112,
        y: sy + sh * 0.54,
        radius: 54,
        shape: 'cloud',
        color: '#D8317E',
        mood: 'laugh',
        rotation: 0.1,
      });

      roundRectPath(ctx, sx + sw / 2 - 275, sy + sh - 118, 550, 82, 24);
      ctx.fillStyle = 'rgba(30, 30, 36, 0.9)';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#FBBF24';
      ctx.stroke();

      ctx.font = '700 28px "Fredoka", sans-serif';
      ctx.fillStyle = '#FBBF24';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('YANG KALAH WAJIB DI DEPAN! 📸', sx + sw / 2, sy + sh - 90);
      ctx.font = '700 21px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('Klik Buka Kamera / Upload Foto Tim', sx + sw / 2, sy + sh - 56);
    }

    if (state.countdown !== null && state.countdown > 0) {
      ctx.fillStyle = 'rgba(18, 18, 24, 0.48)';
      ctx.fillRect(sx, sy, sw, sh);
      ctx.font = '700 210px "Bungee", "Fredoka", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineWidth = 22;
      ctx.strokeStyle = '#1E1E24';
      ctx.strokeText(String(state.countdown), sx + sw / 2, sy + sh / 2);
      ctx.fillStyle = '#FBBF24';
      ctx.fillText(String(state.countdown), sx + sw / 2, sy + sh / 2);
    }

    const sheen = ctx.createLinearGradient(sx, sy, sx + sw * 0.42, sy + sh * 0.42);
    sheen.addColorStop(0, 'rgba(255,255,255,0.14)');
    sheen.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = sheen;
    ctx.fillRect(sx, sy, sw, sh);

    ctx.restore();

    roundRectPath(ctx, sx, sy, sw, sh, sr);
    ctx.lineWidth = 7;
    ctx.strokeStyle = '#1E1E24';
    ctx.stroke();
  };

  ctx.save();
  ctx.translate(frameCenterX, frameCenterY);
  ctx.rotate(tiltRad);

  if (state.frameStyle === 'retro-monitor') {
    const mW = 910;
    const mH = 665;
    const mx = -mW / 2;
    const my = -mH / 2 - 6;

    roundRectPath(ctx, mx + 18, my + 22, mW, mH, 52);
    ctx.fillStyle = '#1E1E24';
    ctx.fill();

    roundRectPath(ctx, mx, my, mW, mH, 52);
    ctx.fillStyle = '#EAE0D0';
    ctx.fill();
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#1E1E24';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(mx + 26, my + mH - 58);
    ctx.lineTo(mx + mW - 26, my + mH - 58);
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(30, 30, 36, 0.22)';
    ctx.stroke();

    const drawSpeakerGrille = (gx: number) => {
      roundRectPath(ctx, gx, my + 165, 52, 265, 24);
      ctx.fillStyle = '#52C46E';
      ctx.fill();
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#1E1E24';
      ctx.stroke();

      ctx.fillStyle = '#1E1E24';
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 2; c++) {
          ctx.beginPath();
          ctx.arc(gx + 16 + c * 20, my + 194 + r * 26, 4.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };
    drawSpeakerGrille(mx + 22);
    drawSpeakerGrille(mx + mW - 74);

    ctx.beginPath();
    ctx.arc(mx + 565, my + 32, 11, 0, Math.PI * 2);
    ctx.fillStyle = '#FF75B5';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#1E1E24';
    ctx.stroke();

    [
      [mx + mW - 175, '#F04438'],
      [mx + mW - 135, '#FBBF24'],
      [mx + mW - 95, '#4AE3B5'],
    ].forEach(([lx, lc]) => {
      ctx.beginPath();
      ctx.arc(lx as number, my + mH - 29, 9.5, 0, Math.PI * 2);
      ctx.fillStyle = lc as string;
      ctx.fill();
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = '#1E1E24';
      ctx.stroke();
    });

    ctx.font = '800 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = 'rgba(30, 30, 36, 0.55)';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('PARTYCAM-96 • STEREO', mx + 92, my + mH - 28);

    const sx = mx + 94;
    const sy = my + 60;
    const sw = mW - 188;
    const sh = mH - 138;
    drawScreenMedia(sx, sy, sw, sh, 20);

    drawFourPointStar(ctx, sx + 12, sy + 14, 42, '#FFFFFF', '#1E1E24', 5);
    drawHeartSticker(ctx, mx + mW - 46, my + 112, 24, '#FF8A4C');
    drawRainbowSticker(ctx, mx + mW - 58, my + mH - 96, 46, -0.15);
    drawFourPointStar(ctx, mx + 64, my + mH - 122, 32, '#FF5AA5', '#1E1E24', 5);
    drawFourPointStar(ctx, sx + 56, sy + sh + 4, 28, '#FBBF24', '#1E1E24', 4.5);
  } else if (state.frameStyle === 'playverse-arcade') {
    const aW = 875;
    const aH = 695;
    const ax = -aW / 2;
    const ay = -aH / 2 - 4;
    const deckH = 122;
    const upperH = aH - deckH + 14;

    roundRectPath(ctx, ax + 18, ay + 22, aW, aH, 42);
    ctx.fillStyle = '#130F26';
    ctx.fill();

    roundRectPath(ctx, ax, ay, aW, upperH, 40);
    ctx.fillStyle = '#6D28D9';
    ctx.fill();
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#181433';
    ctx.stroke();

    roundRectPath(ctx, ax + 24, ay + 24, aW - 48, upperH - 48, 28);
    ctx.fillStyle = '#4C1D95';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#181433';
    ctx.stroke();

    const sx = ax + 46;
    const sy = ay + 44;
    const sw = aW - 92;
    const sh = upperH - 88;
    drawScreenMedia(sx, sy, sw, sh, 20);

    ctx.strokeStyle = '#D4FF2A';
    ctx.lineWidth = 8;
    ctx.lineCap = 'square';
    const bLen = 40;
    const pad = 18;
    [
      [sx + pad, sy + pad, 1, 1],
      [sx + sw - pad, sy + pad, -1, 1],
      [sx + pad, sy + sh - pad, 1, -1],
      [sx + sw - pad, sy + sh - pad, -1, -1],
    ].forEach(([bx, by, dx, dy]) => {
      ctx.beginPath();
      ctx.moveTo(bx + dx * bLen, by);
      ctx.lineTo(bx, by);
      ctx.lineTo(bx, by + dy * bLen);
      ctx.stroke();
    });

    const dy = ay + upperH - 18;
    roundRectPath(ctx, ax - 14, dy, aW + 28, deckH, 26);
    ctx.fillStyle = '#7C3AED';
    ctx.fill();
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#181433';
    ctx.stroke();

    roundRectPath(ctx, ax + 8, dy + 12, aW - 16, 48, 14);
    ctx.fillStyle = '#9333EA';
    ctx.fill();

    const jx = ax + 145;
    const jy = dy + 42;
    ctx.fillStyle = '#181433';
    ctx.beginPath();
    ctx.ellipse(jx, jy + 18, 46, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 11;
    ctx.beginPath();
    ctx.moveTo(jx, jy + 14);
    ctx.lineTo(jx, jy - 44);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(jx, jy - 54, 28, 0, Math.PI * 2);
    ctx.fillStyle = '#F04438';
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#181433';
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(jx - 8, jy - 62, 7, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.65)';
    ctx.fill();

    roundRectPath(ctx, -110, dy + 24, 220, 62, 14);
    ctx.fillStyle = '#181433';
    ctx.fill();
    ctx.font = '700 22px "Bungee", "Fredoka", sans-serif';
    ctx.fillStyle = '#D4FF2A';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PLAY HUB', 0, dy + 56);

    [
      [ax + aW - 295, '#FBBF24'],
      [ax + aW - 195, '#FBBF24'],
      [ax + aW - 95, '#F04438'],
    ].forEach(([bx, col]) => {
      ctx.beginPath();
      ctx.ellipse(bx as number, dy + 60, 38, 22, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#181433';
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(bx as number, dy + 46, 36, 20, 0, 0, Math.PI * 2);
      ctx.fillStyle = col as string;
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#181433';
      ctx.stroke();
    });
  } else {
    const tW = 885;
    const tH = 635;
    const tx = -tW / 2;
    const ty = -tH / 2 + 22;

    ctx.strokeStyle = '#1E1E24';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-44, ty);
    ctx.lineTo(-162, ty - 95);
    ctx.moveTo(44, ty);
    ctx.lineTo(162, ty - 95);
    ctx.stroke();

    [
      [-162, ty - 95, '#FBBF24'],
      [162, ty - 95, '#4AE3B5'],
    ].forEach(([ax, ay, col]) => {
      ctx.beginPath();
      ctx.arc(ax as number, ay as number, 19, 0, Math.PI * 2);
      ctx.fillStyle = col as string;
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#1E1E24';
      ctx.stroke();
    });

    roundRectPath(ctx, -84, ty - 24, 168, 36, 18);
    ctx.fillStyle = '#1E1E24';
    ctx.fill();

    roundRectPath(ctx, tx + 86, ty + tH - 12, 78, 34, 14);
    ctx.fillStyle = '#1E1E24';
    ctx.fill();
    roundRectPath(ctx, tx + tW - 164, ty + tH - 12, 78, 34, 14);
    ctx.fillStyle = '#1E1E24';
    ctx.fill();

    roundRectPath(ctx, tx + 18, ty + 20, tW, tH, 54);
    ctx.fillStyle = '#1E1E24';
    ctx.fill();

    roundRectPath(ctx, tx, ty, tW, tH, 54);
    ctx.fillStyle = '#EC5A29';
    ctx.fill();
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#1E1E24';
    ctx.stroke();

    roundRectPath(ctx, tx + 24, ty + 24, tW - 48, tH - 48, 38);
    ctx.fillStyle = '#FAF7F2';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#1E1E24';
    ctx.stroke();

    const sx = tx + 44;
    const sy = ty + 44;
    const sw = 648;
    const sh = tH - 88;
    drawScreenMedia(sx, sy, sw, sh, 26);

    const ctrlX = sx + sw + 22;
    const ctrlW = tW - 44 - (ctrlX - tx);

    roundRectPath(ctx, ctrlX, sy, ctrlW, 56, 16);
    ctx.fillStyle = '#1E1E24';
    ctx.fill();
    ctx.font = '700 22px "Fredoka", sans-serif';
    ctx.fillStyle = '#FBBF24';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('CH-01', ctrlX + ctrlW / 2, sy + 29);

    [sy + 132, sy + 246].forEach((dy, idx) => {
      ctx.beginPath();
      ctx.arc(ctrlX + ctrlW / 2, dy, 40, 0, Math.PI * 2);
      ctx.fillStyle = idx === 0 ? '#FBBF24' : '#4AE3B5';
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#1E1E24';
      ctx.stroke();
      ctx.save();
      ctx.translate(ctrlX + ctrlW / 2, dy);
      ctx.rotate(idx === 0 ? -0.6 : 0.75);
      roundRectPath(ctx, -6, -30, 12, 34, 6);
      ctx.fillStyle = '#1E1E24';
      ctx.fill();
      ctx.restore();
    });

    for (let i = 0; i < 6; i++) {
      roundRectPath(ctx, ctrlX + 6, sy + 344 + i * 28, ctrlW - 12, 13, 6.5);
      ctx.fillStyle = '#1E1E24';
      ctx.fill();
    }
  }

  ctx.restore();

  // 3B. PLAYFUL PARTYGAMESHUB MASCOTS PLAYING AROUND THE FRAME
  if (state.showMascots) {
    const moodMap: Record<MascotMoodPreset, [MascotMood, MascotMood, MascotMood, MascotMood]> = {
      playful: ['laugh', 'cool', 'happy', 'shocked'],
      mocking: ['laugh', 'laugh', 'dizzy', 'shocked'],
      cool: ['cool', 'cool', 'happy', 'cool'],
    };
    const [m1, m2, m3, m4] = moodMap[state.mascotMoodPreset];

    drawCanvasMascot(ctx, {
      x: 912,
      y: 410,
      radius: 64,
      shape: 'squircle',
      color: '#2568EF',
      mood: m2,
      rotation: 0.14,
    });

    drawCanvasMascot(ctx, {
      x: 118,
      y: 422,
      radius: 56,
      shape: 'circle',
      color: '#D8317E',
      mood: m1,
      rotation: -0.18,
    });

    drawCanvasMascot(ctx, {
      x: 108,
      y: 1035,
      radius: 56,
      shape: 'cloud',
      color: '#158467',
      mood: m3,
      rotation: -0.1,
    });

    drawCanvasMascot(ctx, {
      x: 966,
      y: 1020,
      radius: 54,
      shape: 'triangle',
      color: '#FBBF24',
      mood: m4,
      rotation: 0.16,
    });
  }

  // 4. LOSERS SECTION (ORGANIC ROTATED STICKER LABELS)
  const loserSectionTopY = 1178;

  const headingText = (state.losersHeading || "PARTY'S LOSERS!").trim().toUpperCase();
  ctx.save();
  ctx.font = '700 48px "Fredoka", "Bungee", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';
  const headingW = ctx.measureText(headingText).width;

  ctx.lineWidth = 14;
  ctx.strokeStyle = theme.losersHeadingShadow;
  ctx.strokeText(headingText, W / 2 + 5, loserSectionTopY + 6);
  ctx.fillStyle = theme.losersHeadingShadow;
  ctx.fillText(headingText, W / 2 + 5, loserSectionTopY + 6);

  ctx.lineWidth = 14;
  ctx.strokeStyle = '#1E1E24';
  ctx.strokeText(headingText, W / 2, loserSectionTopY);
  ctx.fillStyle = theme.losersHeadingFill;
  ctx.fillText(headingText, W / 2, loserSectionTopY);

  drawFourPointStar(ctx, W / 2 - headingW / 2 - 42, loserSectionTopY - 2, 22, '#FBBF24', '#1E1E24', 4);
  drawFourPointStar(ctx, W / 2 + headingW / 2 + 42, loserSectionTopY - 2, 22, '#FF5AA5', '#1E1E24', 4);
  ctx.restore();

  const items = state.losers.length > 0 ? state.losers : DEFAULT_LOSERS;
  const rows: LoserLabelItem[][] = [];
  for (let i = 0; i < items.length; i += 3) {
    rows.push(items.slice(i, i + 3));
  }

  const maxRows = rows.slice(0, 2);
  const baseRowY = maxRows.length === 1 ? 1318 : 1280;
  const rowGap = 112;

  maxRows.forEach((row, rIdx) => {
    const labelFontSize = row.length >= 3 ? 40 : 44;
    ctx.font = `700 ${labelFontSize}px "Fredoka", sans-serif`;

    const measured = row.map((item) => {
      const displayLabel = item.frontSpot ? `★ ${item.name}` : item.name;
      const w = Math.max(175, Math.min(295, ctx.measureText(displayLabel).width + 72));
      return { item, displayLabel, w, h: 82 };
    });

    const gapX = 28;
    const totalRowW = measured.reduce((sum, m) => sum + m.w, 0) + gapX * Math.max(0, measured.length - 1);
    let curX = (W - totalRowW) / 2;

    measured.forEach((m, colIdx) => {
      const verticalWave = measured.length === 3 ? (colIdx === 1 ? -14 : 12) : colIdx % 2 === 0 ? -6 : 6;
      const cx = curX + m.w / 2;
      const cy = baseRowY + rIdx * rowGap + verticalWave;
      const rad = (m.item.rotation * Math.PI) / 180;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rad);

      roundRectPath(ctx, -m.w / 2 + 8, -m.h / 2 + 10, m.w, m.h, 30);
      ctx.fillStyle = '#1E1E24';
      ctx.fill();

      roundRectPath(ctx, -m.w / 2 - 4, -m.h / 2 - 4, m.w + 8, m.h + 8, 34);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#1E1E24';
      ctx.stroke();

      roundRectPath(ctx, -m.w / 2 + 3, -m.h / 2 + 3, m.w - 6, m.h - 6, 26);
      ctx.fillStyle = m.item.color;
      ctx.fill();
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#1E1E24';
      ctx.stroke();

      if (m.item.frontSpot) {
        roundRectPath(ctx, -64, -m.h / 2 - 22, 128, 30, 15);
        ctx.fillStyle = '#EC5A29';
        ctx.fill();
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = '#1E1E24';
        ctx.stroke();
        ctx.font = '800 15px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('DI DEPAN! 👇', 0, -m.h / 2 - 6);
      }

      ctx.font = `700 ${labelFontSize}px "Fredoka", sans-serif`;
      ctx.fillStyle = m.item.textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(m.displayLabel, 0, 2, m.w - 32);

      ctx.restore();
      curX += m.w + gapX;
    });
  });

  // 5. FLUID BOTTOM FOOTER COPY + RISING BOTTOM-RIGHT QR TAB
  const leftX = 68;
  const hookY = 1612;

  ctx.save();
  ctx.font = '700 44px "Fredoka", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  if (theme.id === 'partyhub-cream' || theme.id === 'berry-night') {
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#120C1E';
    ctx.strokeText(state.footerHook || 'Cobain bareng gengmu!', leftX, hookY);
  }
  ctx.fillStyle = theme.footerHookColor;
  ctx.fillText(state.footerHook || 'Cobain bareng gengmu!', leftX, hookY, 645);

  const linkY = 1676;
  ctx.font = '800 28px "Plus Jakarta Sans", sans-serif';
  const linkMetrics = ctx.measureText(DISPLAY_WEBSITE_LINK);
  const linkPillW = Math.min(620, linkMetrics.width + 82);
  const linkPillH = 66;

  roundRectPath(ctx, leftX + 7, linkY + 8, linkPillW, linkPillH, 24);
  ctx.fillStyle = '#1E1E24';
  ctx.fill();

  roundRectPath(ctx, leftX, linkY, linkPillW, linkPillH, 24);
  ctx.fillStyle = theme.footerLinkBg;
  ctx.fill();
  ctx.lineWidth = 5.5;
  ctx.strokeStyle = '#1E1E24';
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(leftX + 32, linkY + linkPillH / 2, 11, 0, Math.PI * 2);
  ctx.fillStyle = '#4AE3B5';
  ctx.fill();
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = '#1E1E24';
  ctx.stroke();

  ctx.fillStyle = theme.footerLinkText;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(DISPLAY_WEBSITE_LINK, leftX + 56, linkY + linkPillH / 2 + 1);

  const subCtaY = 1784;
  const subText = state.footerSubCta || 'Coba gratis sekarang!';
  ctx.font = '700 35px "Fredoka", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  if (theme.id === 'pop-cobalt') {
    ctx.lineWidth = 9;
    ctx.strokeStyle = '#1E1E24';
    ctx.lineJoin = 'round';
    ctx.strokeText(subText, leftX, subCtaY);
  }
  ctx.fillStyle = theme.footerSubColor;
  ctx.fillText(subText, leftX, subCtaY);

  const subTextW = ctx.measureText(subText).width;
  const arrowStartX = Math.min(leftX + subTextW + 24, 520);
  const arrowEndX = 720;

  ctx.strokeStyle = theme.arrowColor;
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(arrowStartX, subCtaY + 4);
  ctx.quadraticCurveTo((arrowStartX + arrowEndX) / 2, subCtaY + 46, arrowEndX, subCtaY - 6);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(arrowEndX - 24, subCtaY - 18);
  ctx.lineTo(arrowEndX + 2, subCtaY - 7);
  ctx.lineTo(arrowEndX - 16, subCtaY + 18);
  ctx.stroke();

  drawFourPointStar(ctx, leftX + 22, 1858, 17, '#FBBF24', '#1E1E24', 3.5);
  ctx.font = '800 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = theme.id === 'playverse-arcade' ? '#181433' : 'rgba(255,255,255,0.88)';
  ctx.fillText('GRATIS • 1 LAYAR RAME-RAME • WAJIB TAG TIM!', leftX + 52, 1859);
  ctx.restore();

  // 6. BOTTOM-RIGHT RISING QR CODE FRAME TAB
  const tabW = 282;
  const tabX = W - tabW - 46;
  const tabY = 1564;
  const tabH = H - tabY + 24;

  ctx.save();
  topRoundedRectPath(ctx, tabX - 12, tabY + 10, tabW, tabH, 34);
  ctx.fillStyle = 'rgba(20, 20, 28, 0.45)';
  ctx.fill();

  topRoundedRectPath(ctx, tabX, tabY, tabW, tabH, 34);
  ctx.fillStyle = theme.qrTabBg;
  ctx.fill();
  ctx.lineWidth = 9;
  ctx.strokeStyle = '#1E1E24';
  ctx.stroke();

  roundRectPath(ctx, tabX + 26, tabY + 20, tabW - 52, 42, 21);
  ctx.fillStyle = theme.qrBadgeBg;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#1E1E24';
  ctx.stroke();

  ctx.font = '700 22px "Fredoka", sans-serif';
  ctx.fillStyle = theme.qrBadgeText;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SCAN ME! 📱', tabX + tabW / 2, tabY + 42);

  const qrOuterSize = 232;
  const qrOuterX = tabX + (tabW - qrOuterSize) / 2;
  const qrOuterY = tabY + 78;

  roundRectPath(ctx, qrOuterX, qrOuterY, qrOuterSize, qrOuterSize, 18);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#1E1E24';
  ctx.stroke();

  const qMat = state.qrMatrix;
  const qN = qMat.length;
  const quietPx = 14;
  const drawArea = qrOuterSize - quietPx * 2;
  const cell = drawArea / qN;
  const qStartX = qrOuterX + quietPx;
  const qStartY = qrOuterY + quietPx;

  ctx.fillStyle = '#1E1E24';
  for (let r = 0; r < qN; r++) {
    for (let c = 0; c < qN; c++) {
      if (qMat[r][c]) {
        ctx.fillRect(
          Math.floor(qStartX + c * cell),
          Math.floor(qStartY + r * cell),
          Math.ceil(cell),
          Math.ceil(cell)
        );
      }
    }
  }

  ctx.font = '800 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#64616C';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('PARTYGAMESHUB', tabX + tabW / 2, qrOuterY + qrOuterSize + 24);
  ctx.restore();
}

// ============================================================================
// 5. PLAYFUL GROK-BOT MASCOT SVG
// ============================================================================
const GrokMascotSvg: React.FC<{
  shape?: MascotShape;
  color?: string;
  size?: number;
  mood?: 'idle' | 'happy';
  lookX?: number;
}> = ({ shape = 'cloud', color = '#158467', size = 76, mood = 'idle', lookX = 0 }) => {
  const renderPath = (isOutline = false) => {
    const props = isOutline
      ? {
          fill: '#FFFFFF',
          stroke: '#FFFFFF',
          strokeWidth: 15,
          strokeLinejoin: 'round' as const,
          strokeLinecap: 'round' as const,
        }
      : { fill: color };
    if (shape === 'squircle') return <rect x="20" y="22" width="80" height="76" rx="28" {...props} />;
    return (
      <path
        d="M28,88 C14,88 9,74 16,61 C16,45 30,39 39,44 C44,25 74,21 83,42 C99,42 109,56 103,73 C100,84 90,88 77,88 Z"
        {...props}
      />
    );
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className="block overflow-visible select-none"
      style={{ filter: 'drop-shadow(0 5px 7px rgba(30,30,36,0.2))' }}
    >
      {renderPath(true)}
      {renderPath(false)}
      <motion.g
        animate={{ scaleY: [1, 1, 1, 0.1, 1, 1], x: lookX }}
        transition={{
          scaleY: { duration: 3.6, times: [0, 0.44, 0.47, 0.5, 0.54, 1], repeat: Infinity },
          x: { type: 'spring', stiffness: 200, damping: 18 },
        }}
        style={{ transformOrigin: '60px 58px' }}
      >
        {mood === 'happy' ? (
          <g stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" fill="none">
            <path d="M40,61 Q47,50 54,61" />
            <path d="M66,61 Q73,50 80,61" />
          </g>
        ) : (
          <g fill="#FFFFFF">
            <rect x="43" y="47" width="9.5" height="22" rx="4.75" />
            <rect x="67.5" y="47" width="9.5" height="22" rx="4.75" />
          </g>
        )}
      </motion.g>
    </svg>
  );
};

// ============================================================================
// 6. COMPACT SIGNATURE SCALLOPED PAGE FOOTER WITH CLICKABLE PEEKING MASCOT
// ============================================================================
const PartyHubScallopedFooter: React.FC = () => {
  const [ducking, setDucking] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);
  const [lookX, setLookX] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setLookX((p) => (p === 0 ? 4 : p === 4 ? -4 : 0));
    }, 2600);
    return () => clearInterval(id);
  }, []);

  const handlePeek = () => {
    sfx.playPop(640);
    const lines = ['Post ke IG Story! 📸', 'Yang kalah di depan! 💀', 'Wajib tag semua tim!', 'Boop! 😆'];
    setBubble(lines[Math.floor(Math.random() * lines.length)]);
    setDucking(true);
    setTimeout(() => setDucking(false), 360);
    setTimeout(() => setBubble(null), 1850);
  };

  return (
    <footer className="relative mt-16 pt-10">
      <div className="max-w-6xl mx-auto px-6 relative h-0">
        <div className="absolute right-8 sm:right-20 -top-[56px] z-10 flex flex-col items-center">
          <AnimatePresence>
            {bubble && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.7 }}
                animate={{ opacity: 1, y: -12, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 420, damping: 20 }}
                className="mb-1 px-3.5 py-1.5 rounded-2xl bg-[#FBBF24] text-[#1E1E24] font-display font-bold text-xs border-2 border-[#1E1E24] shadow-[0_3px_0_#1E1E24] whitespace-nowrap"
              >
                {bubble}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="button"
            onClick={handlePeek}
            animate={{
              y: ducking ? 24 : [0, -5, 0],
              scaleY: ducking ? 0.82 : 1,
              scaleX: ducking ? 1.14 : 1,
            }}
            transition={
              ducking
                ? { type: 'spring', stiffness: 420, damping: 16 }
                : { y: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' } }
            }
            aria-label="Mascot mengintip di footer"
            className="cursor-pointer focus:outline-none"
          >
            <GrokMascotSvg shape="cloud" color="#158467" size={82} mood={ducking ? 'happy' : 'idle'} lookX={lookX} />
          </motion.button>
        </div>
      </div>

      <div className="relative z-20 w-full overflow-hidden leading-none -mb-[2px]">
        <svg viewBox="0 0 1200 58" preserveAspectRatio="none" className="w-full h-9 sm:h-11 block">
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
            opacity="0.72"
          />
        </svg>
      </div>

      <div className="relative z-20 bg-[#1E1E24] text-[#FAF7F2] py-7 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-[#FBBF24] text-[#1E1E24] flex items-center justify-center shadow-[0_4px_0_#C49B10]">
              <Gamepad2 className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-display text-xl font-bold leading-none">PartyGamesHub!</h3>
              <p className="text-xs text-white/70 font-semibold mt-0.5">
                Hukuman Terakhir End-Game • Yang Kalah Di Depan • Wajib IG Story &amp; Tag Semua Tim!
              </p>
            </div>
          </div>

          <a
            href={TARGET_WEBSITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sfx.playPop(620)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs sm:text-sm font-bold text-[#4AE3B5] transition"
          >
            <span>{DISPLAY_WEBSITE_LINK}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

// ============================================================================
// 7. INSTAGRAM STORY HELPER MODAL (MANDATORY SHARE + TAG ALL TEAM MEMBERS)
// ============================================================================
const IgStoryShareModal: React.FC<{
  open: boolean;
  captionText: string;
  teamTagString: string;
  onClose: () => void;
  onDownloadAgain: () => void;
  onCopyCaption: () => void;
  onCopyTagsOnly: () => void;
}> = ({ open, captionText, teamTagString, onClose, onDownloadAgain, onCopyCaption, onCopyTagsOnly }) => {
  const [copied, setCopied] = useState(false);
  const [copiedTags, setCopiedTags] = useState(false);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-[#1E1E24]/70 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 16 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#FAF7F2] rounded-[32px] border-[3.5px] border-[#1E1E24] shadow-[0_10px_0_#1E1E24] overflow-hidden"
          >
            <div className="bg-[#D8317E] text-white px-5 py-4 flex items-center justify-between border-b-[3px] border-[#1E1E24]">
              <div className="flex items-center gap-2.5">
                <Instagram className="w-5 h-5" />
                <div>
                  <span className="block text-xs font-extrabold uppercase tracking-wider text-white/90">
                    HUKUMAN WAJIB END-GAME • 1080×1920 PNG
                  </span>
                  <h3 className="font-display text-lg font-bold leading-none">
                    Wajib Share IG Story &amp; Tag Tim!
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/35 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="rounded-2xl bg-[#D6F5EC] border-2 border-[#158467]/30 p-3.5 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#158467] shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm font-bold text-[#1E1E24] leading-snug">
                  Poster 9:16 sudah terunduh &amp; caption + tag seluruh tim otomatis tersalin!
                </p>
              </div>

              <ol className="space-y-2.5 text-xs sm:text-sm font-semibold text-[#1E1E24]">
                <li className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#1E1E24] text-[#FBBF24] font-display font-bold text-xs flex items-center justify-center shrink-0">
                    1
                  </span>
                  <span>
                    Buka <strong>Instagram</strong> → kamera <strong>Story</strong> → pilih file PNG 9:16 ini!
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#1E1E24] text-[#FBBF24] font-display font-bold text-xs flex items-center justify-center shrink-0">
                    2
                  </span>
                  <span>
                    <strong>WAJIB TAG SEMUA TIM (@mention):</strong> Tempel daftar tag anggota tim di Story kalian!
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#1E1E24] text-[#FBBF24] font-display font-bold text-xs flex items-center justify-center shrink-0">
                    3
                  </span>
                  <span>
                    Tambahkan Stiker Link ke <code>{TARGET_WEBSITE_URL}</code> biar geng lain ikutan!
                  </span>
                </li>
              </ol>

              {/* Team Tags Box */}
              <div className="rounded-2xl bg-[#FCE4F0] border-2 border-[#D8317E]/30 p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-[#D8317E] tracking-wider">
                    TAG SEMUA ANGGOTA TIM (WAJIB):
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onCopyTagsOnly();
                      setCopiedTags(true);
                      setTimeout(() => setCopiedTags(false), 1800);
                    }}
                    className="px-2.5 py-1 min-h-[32px] rounded-lg bg-[#D8317E] text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedTags ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedTags ? 'Tag Disalin!' : 'Salin Tag Saja'}</span>
                  </button>
                </div>
                <p className="text-xs font-extrabold text-[#1E1E24] break-words">
                  {teamTagString}
                </p>
              </div>

              <div className="rounded-2xl bg-white border-2 border-[#1E1E24]/15 p-3 text-xs font-medium text-[#64616C]">
                {captionText}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    onCopyCaption();
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1800);
                  }}
                  className="py-3 px-4 rounded-2xl bg-[#FBBF24] text-[#1E1E24] border-2 border-[#1E1E24] shadow-[0_4px_0_#1E1E24] active:translate-y-[3px] transition font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Tersalin!' : 'Copy Caption + Tag'}</span>
                </button>

                <a
                  href="instagram://story-camera"
                  onClick={() => sfx.playPop(640)}
                  className="py-3 px-4 rounded-2xl bg-[#D8317E] text-white border-2 border-[#1E1E24] shadow-[0_4px_0_#1E1E24] active:translate-y-[3px] transition font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Buka IG Story</span>
                </a>
              </div>

              <button
                type="button"
                onClick={onDownloadAgain}
                className="w-full py-2 text-xs font-bold text-[#64616C] hover:text-[#1E1E24] inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh ulang PNG 1080×1920</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// 8. MAIN APPLICATION — PARTYGAMESHUB 9:16 PHOTOBOOTH STUDIO
// ============================================================================
export default function PhotoBooth() {
  const navigate = useNavigate();
  const { players: storePlayers, roomName: storeRoomName } = useGameStore();

  // UI & Audio state
  const [muted, setMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<ControlTabId>('content');
  const [toast, setToast] = useState<string | null>(null);
  const [fontsLoadedTick, setFontsLoadedTick] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [igModalOpen, setIgModalOpen] = useState(false);

  // Poster Visual State
  const [themeId, setThemeId] = useState<PosterThemeId>('pop-cobalt');
  const [frameStyle, setFrameStyle] = useState<FrameStyleId>('retro-monitor');
  const [frameTiltDeg, setFrameTiltDeg] = useState(-2.2);
  const [crtFilter, setCrtFilter] = useState(false);
  const [showMascots, setShowMascots] = useState(true);
  const [mascotMoodPreset, setMascotMoodPreset] = useState<MascotMoodPreset>('playful');

  // Poster Copy & Losers Labels State
  const [teamName, setTeamName] = useState(() => storeRoomName || 'Tim Hore');
  const [subDialogIdx, setSubDialogIdx] = useState(0);
  const [customSubDialog, setCustomSubDialog] = useState<string | null>(null);
  const [losersHeading, setLosersHeading] = useState("PARTY'S LOSERS!");
  const [losers, setLosers] = useState<LoserLabelItem[]>(DEFAULT_LOSERS);
  const [newLoserName, setNewLoserName] = useState('');
  const [footerHook, setFooterHook] = useState('Cobain bareng gengmu!');
  const [footerSubCta, setFooterSubCta] = useState('Coba gratis sekarang!');

  // Team Tags State (Wajib Tag Semua Tim di IG Story!)
  const [teamTags, setTeamTags] = useState<TeamTagItem[]>(() => {
    if (storePlayers.length > 0) {
      return storePlayers.map((p) => ({
        id: p.id,
        name: p.name,
        handle: `@${p.name.toLowerCase().replace(/[^a-z0-9_]/g, '')}`,
      }));
    }
    return DEFAULT_LOSERS.map((l) => ({
      id: l.id,
      name: l.name,
      handle: `@${l.name.toLowerCase().replace(/[^a-z0-9_]/g, '')}`,
    }));
  });

  // Camera, Photo & Pan/Zoom State
  const [photoImg, setPhotoImg] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1.0);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [mirrorPhoto, setMirrorPhoto] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flashActive, setFlashActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dragRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    initPanX: number;
    initPanY: number;
  }>({ active: false, startX: 0, startY: 0, initPanX: 0, initPanY: 0 });

  const qrMatrix = useMemo(() => generateScannableQrMatrix(TARGET_WEBSITE_URL), []);

  const effectiveSubDialog = useMemo(() => {
    if (customSubDialog !== null) return customSubDialog;
    return SUBDIALOG_PRESETS[subDialogIdx].template.replace('{team}', teamName.trim() || 'Tim Hore');
  }, [customSubDialog, subDialogIdx, teamName]);

  const showToast = useCallback((msg: string) => setToast(msg), []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  // Trigger crisp canvas redraw once Google Fonts finish loading
  useEffect(() => {
    let mounted = true;
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (mounted) setFontsLoadedTick((t) => t + 1);
      });
    }
    const fallbackTick = window.setTimeout(() => {
      if (mounted) setFontsLoadedTick((t) => t + 1);
    }, 650);
    return () => {
      mounted = false;
      clearTimeout(fallbackTick);
    };
  }, []);

  // Auto-import lowest-scoring players from Zustand Store OR Room Cache
  const importRoomCache = useCallback(
    (silent = false) => {
      // 1. Prioritas dari Zustand Active Store!
      if (storePlayers.length > 0) {
        const sortedLowest = [...storePlayers]
          .sort((a, b) => (a.score ?? 0) - (b.score ?? 0))
          .slice(0, 3);

        const defaultRots = [-5.5, 3.8, -4.2];
        const imported: LoserLabelItem[] = sortedLowest.map((p, idx) => {
          const pal = STICKER_LABEL_PALETTE[idx % STICKER_LABEL_PALETTE.length];
          return {
            id: p.id || `store-${idx}`,
            name: p.name,
            rotation: defaultRots[idx % defaultRots.length],
            color: pal.bg,
            textColor: pal.text,
            frontSpot: idx === 0, // Peringkat paling bawah wajib di depan!
          };
        });
        setLosers(imported);
        if (storeRoomName) setTeamName(storeRoomName);
        setTeamTags(
          storePlayers.map((p) => ({
            id: p.id,
            name: p.name,
            handle: `@${p.name.toLowerCase().replace(/[^a-z0-9_]/g, '')}`,
          }))
        );
        if (!silent) {
          sfx.playFanfare();
          showToast(`Import ${imported.length} pemain terbawah & ${storePlayers.length} tag anggota tim! 💀`);
        }
        return;
      }

      // 2. Fallback dari ROOM_CACHE_KEY localStorage
      try {
        const raw = window.localStorage.getItem(ROOM_CACHE_KEY);
        if (!raw) {
          if (!silent) showToast('Belum ada data room, menggunakan skuad contoh 3 orang!');
          return;
        }
        const parsed = JSON.parse(raw) as {
          roomName?: string;
          players?: { id: string; name: string; roomScore?: number }[];
        };
        if (!parsed.players || parsed.players.length === 0) return;

        const sortedLowest = [...parsed.players]
          .sort((a, b) => (a.roomScore ?? 0) - (b.roomScore ?? 0))
          .slice(0, 3);

        const defaultRots = [-5.5, 3.8, -4.2];
        const imported: LoserLabelItem[] = sortedLowest.map((p, idx) => {
          const pal = STICKER_LABEL_PALETTE[idx % STICKER_LABEL_PALETTE.length];
          return {
            id: p.id || `cache-${idx}`,
            name: p.name,
            rotation: defaultRots[idx % defaultRots.length],
            color: pal.bg,
            textColor: pal.text,
            frontSpot: idx === 0,
          };
        });
        setLosers(imported);
        if (parsed.roomName) setTeamName(parsed.roomName);
        if (!silent) {
          sfx.playFanfare();
          showToast(`Import ${imported.length} pemain terbawah dari Room Cache! 💀`);
        }
      } catch {
        if (!silent) showToast('Gagal membaca data Room.');
      }
    },
    [storePlayers, storeRoomName, showToast]
  );

  useEffect(() => {
    importRoomCache(true);
  }, [importRoomCache]);

  const canvasState = useMemo<PosterCanvasState>(
    () => ({
      themeId,
      frameStyle,
      subDialog: effectiveSubDialog,
      losersHeading,
      losers,
      footerHook,
      footerSubCta,
      frameTiltDeg,
      zoom,
      panX,
      panY,
      mirrorPhoto,
      crtFilter,
      showMascots,
      mascotMoodPreset,
      countdown,
      qrMatrix,
    }),
    [
      themeId,
      frameStyle,
      effectiveSubDialog,
      losersHeading,
      losers,
      footerHook,
      footerSubCta,
      frameTiltDeg,
      zoom,
      panX,
      panY,
      mirrorPhoto,
      crtFilter,
      showMascots,
      mascotMoodPreset,
      countdown,
      qrMatrix,
    ]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!cameraActive) {
      drawPosterToCanvas(ctx, canvasState, photoImg);
      return;
    }

    let rafId = 0;
    const renderLoop = () => {
      drawPosterToCanvas(ctx, canvasState, videoRef.current);
      rafId = requestAnimationFrame(renderLoop);
    };
    rafId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(rafId);
  }, [canvasState, photoImg, cameraActive, fontsLoadedTick]);

  // Camera lifecycle
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraActive(false);
    setCountdown(null);
  }, []);

  const startCamera = useCallback(
    async (mode: 'user' | 'environment' = facingMode) => {
      setCameraError(null);
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Browser tidak mendukung kamera langsung. Silakan pakai Upload Foto!');
        return;
      }
      try {
        if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 960 } },
          audio: false,
        });
        streamRef.current = stream;
        setFacingMode(mode);
        setMirrorPhoto(mode === 'user');
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setCameraActive(true);
        sfx.playPop(620);
      } catch {
        setCameraError('Izin kamera belum aktif/tidak tersedia. Kamu tetap bisa Upload Foto dari galeri!');
        setCameraActive(false);
      }
    },
    [facingMode]
  );

  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const captureFromCamera = useCallback(() => {
    const vid = videoRef.current;
    if (!vid || vid.videoWidth === 0) return;

    sfx.playShutter();
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 250);

    const snap = document.createElement('canvas');
    snap.width = vid.videoWidth;
    snap.height = vid.videoHeight;
    const sCtx = snap.getContext('2d');
    if (sCtx) {
      if (mirrorPhoto) {
        sCtx.translate(snap.width, 0);
        sCtx.scale(-1, 1);
      }
      sCtx.drawImage(vid, 0, 0);
      const url = snap.toDataURL('image/jpeg', 0.94);
      const img = new Image();
      img.onload = () => {
        setPhotoImg(img);
        setMirrorPhoto(false);
        setZoom(1.0);
        setPanX(0);
        setPanY(0);
      };
      img.src = url;
    }

    stopCamera();
    showToast('Cekrek! Foto hukuman terpasang di bingkai 📸');
  }, [mirrorPhoto, stopCamera, showToast]);

  const startCountdownShot = () => {
    if (!cameraActive || countdown !== null) return;
    setCountdown(3);
    sfx.playCountdown(false);
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      captureFromCamera();
      setCountdown(null);
      return;
    }
    const timer = window.setTimeout(() => {
      const next = countdown - 1;
      sfx.playCountdown(next === 0);
      setCountdown(next);
    }, 900);
    return () => clearTimeout(timer);
  }, [countdown, captureFromCamera]);

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    stopCamera();
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') return;
      const img = new Image();
      img.onload = () => {
        setPhotoImg(img);
        setZoom(1.0);
        setPanX(0);
        setPanY(0);
        setMirrorPhoto(false);
        sfx.playFanfare();
        showToast('Foto bersama siap di bingkai retro! ✨');
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!photoImg && !cameraActive) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      initPanX: panX,
      initPanY: panY,
    };
  };

  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setPanX(Math.max(-55, Math.min(55, Math.round(dragRef.current.initPanX + dx * 0.5))));
    setPanY(Math.max(-55, Math.min(55, Math.round(dragRef.current.initPanY + dy * 0.5))));
  };

  const handleCanvasPointerUp = () => {
    dragRef.current.active = false;
  };

  const addLoserLabel = () => {
    const trimmed = newLoserName.trim();
    if (!trimmed) return;
    if (losers.length >= 6) {
      showToast('Maksimal 6 label nama biar poster tetap rapi!');
      return;
    }
    sfx.playPop(620);
    const pal = STICKER_LABEL_PALETTE[losers.length % STICKER_LABEL_PALETTE.length];
    const randRot = Number(((Math.random() > 0.5 ? 1 : -1) * (2.5 + Math.random() * 4.5)).toFixed(1));
    setLosers((prev) => [
      ...prev,
      {
        id: `l-${Date.now()}`,
        name: trimmed,
        rotation: randRot,
        color: pal.bg,
        textColor: pal.text,
        frontSpot: false,
      },
    ]);
    setNewLoserName('');
  };

  const updateLoserName = (id: string, name: string) => {
    setLosers((prev) => prev.map((item) => (item.id === id ? { ...item, name } : item)));
  };

  const toggleFrontSpot = (id: string) => {
    sfx.playPop(600);
    setLosers((prev) =>
      prev.map((item) => (item.id === id ? { ...item, frontSpot: !item.frontSpot } : item))
    );
  };

  const removeLoserLabel = (id: string) => {
    if (losers.length <= 1) {
      showToast('Minimal 1 nama tetap tampil ya!');
      return;
    }
    sfx.playPop(440);
    setLosers((prev) => prev.filter((item) => item.id !== id));
  };

  const randomizeRotationsAndColors = () => {
    sfx.playShuffle();
    const shuffledPalette = [...STICKER_LABEL_PALETTE].sort(() => Math.random() - 0.5);
    setLosers((prev) =>
      prev.map((item, idx) => {
        const sign = idx % 2 === 0 ? -1 : 1;
        const mag = 2.6 + Math.random() * 4.8;
        const pal = shuffledPalette[idx % shuffledPalette.length];
        return {
          ...item,
          rotation: Number((sign * mag * (Math.random() > 0.25 ? 1 : -1)).toFixed(1)),
          color: pal.bg,
          textColor: pal.text,
        };
      })
    );
    showToast('Rotasi & warna label diacak! 🎲');
  };

  const updateTeamTagHandle = (id: string, val: string) => {
    const clean = val.startsWith('@') ? val : `@${val}`;
    setTeamTags((prev) => prev.map((t) => (t.id === id ? { ...t, handle: clean } : t)));
  };

  const teamTagString = useMemo(
    () => teamTags.map((t) => t.handle.trim() || `@${t.name}`).join(' '),
    [teamTags]
  );

  const buildPngBlob = useCallback(async (): Promise<Blob | null> => {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
    const offscreen = document.createElement('canvas');
    offscreen.width = 1080;
    offscreen.height = 1920;
    const oCtx = offscreen.getContext('2d');
    if (!oCtx) return null;

    drawPosterToCanvas(
      oCtx,
      { ...canvasState, countdown: null },
      cameraActive ? videoRef.current : photoImg
    );

    return new Promise<Blob | null>((resolve) => {
      offscreen.toBlob((blob) => resolve(blob), 'image/png', 1.0);
    });
  }, [canvasState, cameraActive, photoImg]);

  const downloadBlob = (blob: Blob) => {
    const slug = (teamName || 'tim-hore').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `partygameshub-story-${slug}-1080x1920.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  };

  const handleDownloadPng = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const blob = await buildPngBlob();
      if (!blob) throw new Error('Blob failed');
      downloadBlob(blob);
      sfx.playFanfare();
      showToast('PNG 1080×1920 tajam berhasil diunduh! 🎉');
    } catch {
      showToast('Gagal menyimpan PNG. Coba ulangi sebentar lagi!');
    } finally {
      setIsExporting(false);
    }
  };

  const igCaptionText = `${effectiveSubDialog} (${losersHeading}: ${losers
    .map((l) => l.name)
    .join(', ')} wajib di depan). ${footerHook} Main gratis di ${TARGET_WEBSITE_URL}\n\nTag semua tim: ${teamTagString}`;

  const handleShareIgStory = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const blob = await buildPngBlob();
      if (!blob) throw new Error('Blob failed');
      const slug = (teamName || 'tim-hore').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const pngFile = new File([blob], `partygameshub-story-${slug}.png`, { type: 'image/png' });

      const nav = navigator as Navigator & { canShare?: (data?: ShareData) => boolean };
      if (typeof nav.share === 'function' && (!nav.canShare || nav.canShare({ files: [pngFile] }))) {
        try {
          await nav.share({
            files: [pngFile],
            title: 'PartyGamesHub: Hukuman Photo Booth 9:16',
            text: igCaptionText,
          });
          sfx.playFanfare();
          showToast('Siap di-post ke IG Story & Tag Semua Tim! 🚀');
          return;
        } catch (err) {
          if ((err as { name?: string })?.name === 'AbortError') return;
        }
      }

      downloadBlob(blob);
      navigator.clipboard?.writeText(igCaptionText).catch(() => {});
      sfx.playFanfare();
      setIgModalOpen(true);
    } catch {
      showToast('Gagal menyiapkan share IG Story. Gunakan tombol Download PNG ya!');
    } finally {
      setIsExporting(false);
    }
  };

  const toggleMute = () => {
    sfx.muted = !muted;
    setMuted(sfx.muted);
    if (!sfx.muted) sfx.playPop(660);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E24] font-sans selection:bg-[#FBBF24] flex flex-col justify-between overflow-x-hidden">
      <style>{`
        .font-display { font-family: 'Fredoka', sans-serif; letter-spacing: -0.015em; }
        .font-arcade { font-family: 'Bungee', 'Fredoka', sans-serif; }
        .dot-canvas {
          background-image: radial-gradient(rgba(30, 30, 36, 0.08) 1.5px, transparent 1.5px);
          background-size: 24px 24px;
        }
      `}</style>

      <video ref={videoRef} autoPlay playsInline muted className="hidden" />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleUploadFile}
        className="hidden"
      />

      <IgStoryShareModal
        open={igModalOpen}
        captionText={igCaptionText}
        teamTagString={teamTagString}
        onClose={() => setIgModalOpen(false)}
        onDownloadAgain={handleDownloadPng}
        onCopyCaption={() => {
          navigator.clipboard?.writeText(igCaptionText).catch(() => {});
          sfx.playPop(700);
          showToast('Caption + Semua Tag Tim disalin!');
        }}
        onCopyTagsOnly={() => {
          navigator.clipboard?.writeText(teamTagString).catch(() => {});
          sfx.playPop(720);
          showToast('Semua tag @anggota disalin!');
        }}
      />

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.94 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[80] px-5 py-2.5 rounded-full bg-[#1E1E24] text-[#FAF7F2] font-bold text-xs sm:text-sm shadow-xl flex items-center gap-2 border border-white/15 max-w-[92vw]"
          >
            <CheckCircle2 className="w-4 h-4 text-[#4AE3B5] shrink-0" />
            <span className="truncate">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================================================================== */}
      {/* TOP WORKSPACE HEADER                                                 */}
      {/* ==================================================================== */}
      <div className="dot-canvas flex-1">
        <header className="sticky top-0 z-30 bg-[#FAF7F2]/92 backdrop-blur-md border-b-[3px] border-[#1E1E24]/10">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  sfx.playPop();
                  navigate('/room/podium');
                }}
                className="px-3 py-2 rounded-2xl bg-white hover:bg-[#F2ECE1] border-2 border-[#1E1E24] shadow-[0_3px_0_#1E1E24] active:translate-y-[2px] transition font-display font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Podium</span>
              </button>

              <div className="w-11 h-11 rounded-2xl bg-[#1E1E24] border-2 border-[#1E1E24] shadow-[0_4px_0_#0A0A0D] flex items-center justify-center shrink-0">
                <GrokMascotSvg shape="squircle" color="#FBBF24" size={34} mood="happy" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-lg sm:text-2xl font-bold leading-none text-[#1E1E24]">
                    Hukuman Terakhir Photo Booth
                  </h1>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFE4E2] text-[#B42318] border border-[#DC2626]/30 text-xs font-extrabold uppercase">
                    YANG KALAH DI DEPAN • WAJIB IG STORY
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#64616C] mt-0.5">
                  Foto bersama tim (yang kalah berdiri paling depan!) + Wajib Share IG Story &amp; Tag Semua Tim
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => importRoomCache(false)}
                className="px-3.5 py-2 rounded-[16px] bg-white hover:bg-[#F2ECE1] text-[#1E1E24] border-2 border-[#1E1E24] shadow-[0_4px_0_#1E1E24] active:translate-y-[3px] transition font-display font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Database className="w-3.5 h-3.5 text-[#158467]" />
                <span className="hidden sm:inline">Sinkron Skor Room</span>
                <span className="sm:hidden">Sync</span>
              </button>

              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? 'Nyalakan SFX' : 'Matikan SFX'}
                className="w-10 h-10 rounded-full bg-[#1E1E24] text-[#FAF7F2] flex items-center justify-center shadow-[0_4px_0_#0A0A0D] active:translate-y-[3px] transition cursor-pointer"
              >
                {muted ? (
                  <VolumeX className="w-4 h-4 text-[#F04438]" />
                ) : (
                  <Volume2 className="w-4 h-4 text-[#4AE3B5]" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* ==================================================================== */}
        {/* MAIN 2-COLUMN STUDIO                                                 */}
        {/* ==================================================================== */}
        <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
            {/* LEFT SHOWCASE COLUMN: LIVE 1080x1920 WYSIWYG CANVAS */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 flex flex-col items-center space-y-4">
              <div className="w-full max-w-[396px] flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E1E24] text-[#FBBF24] text-xs font-extrabold uppercase tracking-wider shadow-[0_3px_0_rgba(30,30,36,0.16)]">
                  <span>WYSIWYG 1080×1920 CANVAS</span>
                </span>
                {(photoImg || cameraActive) && (
                  <span className="text-xs font-bold text-[#64616C] inline-flex items-center gap-1">
                    <Move className="w-3.5 h-3.5" />
                    <span>Drag foto untuk geser</span>
                  </span>
                )}
              </div>

              <div className="relative w-full max-w-[396px] aspect-[9/16] rounded-[30px] border-[4px] border-[#1E1E24] shadow-[0_12px_0_#1E1E24,0_24px_42px_rgba(30,30,36,0.18)] overflow-hidden bg-[#1E1E24] select-none">
                <AnimatePresence>
                  {flashActive && (
                    <motion.div
                      initial={{ opacity: 0.95 }}
                      animate={{ opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="absolute inset-0 z-40 bg-white pointer-events-none"
                    />
                  )}
                </AnimatePresence>

                <canvas
                  ref={canvasRef}
                  width={1080}
                  height={1920}
                  onPointerDown={handleCanvasPointerDown}
                  onPointerMove={handleCanvasPointerMove}
                  onPointerUp={handleCanvasPointerUp}
                  onPointerCancel={handleCanvasPointerUp}
                  style={{ touchAction: photoImg ? 'none' : 'auto' }}
                  className={`w-full h-full block ${
                    photoImg ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
                  }`}
                />

                <AnimatePresence>
                  {cameraActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="absolute inset-x-3 bottom-3 z-30 rounded-[22px] bg-[#1E1E24]/92 backdrop-blur-md border-2 border-[#FBBF24] p-2.5 space-y-2 shadow-xl"
                    >
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          disabled={countdown !== null}
                          onClick={startCountdownShot}
                          className="py-2.5 px-3 rounded-xl bg-[#EC5A29] text-white font-display font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                        >
                          <Timer className="w-3.5 h-3.5" />
                          <span>{countdown !== null ? `Siap... ${countdown}` : 'Jepret 3-2-1'}</span>
                        </button>
                        <button
                          type="button"
                          disabled={countdown !== null}
                          onClick={captureFromCamera}
                          className="py-2.5 px-3 rounded-xl bg-[#158467] text-white font-display font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Jepret!</span>
                        </button>
                      </div>
                      <div className="flex items-center justify-between gap-1.5">
                        <button
                          type="button"
                          onClick={() => startCamera(facingMode === 'user' ? 'environment' : 'user')}
                          className="flex-1 py-1.5 px-2 rounded-lg bg-white/12 hover:bg-white/20 text-white text-[11px] font-bold inline-flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>{facingMode === 'user' ? 'Kamera Depan' : 'Kamera Belakang'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            sfx.playPop();
                            setMirrorPhoto((m) => !m);
                          }}
                          className={`py-1.5 px-2.5 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer ${
                            mirrorPhoto ? 'bg-[#FBBF24] text-[#1E1E24]' : 'bg-white/12 text-white'
                          }`}
                        >
                          <FlipHorizontal className="w-3 h-3" />
                          <span>Mirror</span>
                        </button>
                        <button
                          type="button"
                          onClick={stopCamera}
                          className="py-1.5 px-2.5 rounded-lg bg-[#F04438] text-white text-[11px] font-bold cursor-pointer"
                        >
                          Tutup
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {cameraError && (
                <div className="w-full max-w-[396px] rounded-2xl bg-[#FFE4E2] border-2 border-[#F04438]/40 px-4 py-2.5 text-xs font-bold text-[#B42318]">
                  {cameraError}
                </div>
              )}

              <div className="w-full max-w-[396px] space-y-2.5">
                <div className="grid grid-cols-2 gap-2.5">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98, y: 3 }}
                    onClick={() => (cameraActive ? stopCamera() : startCamera(facingMode))}
                    className={`py-3 px-3.5 rounded-[18px] border-[3px] border-[#1E1E24] shadow-[0_5px_0_#1E1E24] font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                      cameraActive
                        ? 'bg-[#F04438] text-white'
                        : 'bg-[#2568EF] hover:bg-[#3576F8] text-white'
                    }`}
                  >
                    <Camera className="w-4 h-4" />
                    <span>{cameraActive ? 'Tutup Kamera' : photoImg ? 'Foto Ulang' : 'Buka Kamera'}</span>
                  </motion.button>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98, y: 3 }}
                    onClick={() => {
                      sfx.playPop();
                      fileInputRef.current?.click();
                    }}
                    className="py-3 px-3.5 rounded-[18px] bg-[#FBBF24] hover:bg-[#FCD34D] text-[#1E1E24] border-[3px] border-[#1E1E24] shadow-[0_5px_0_#1E1E24] font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{photoImg ? 'Ganti Foto' : 'Upload Foto'}</span>
                  </motion.button>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98, y: 3 }}
                    disabled={isExporting}
                    onClick={handleDownloadPng}
                    className="py-3.5 px-3.5 rounded-[20px] bg-[#158467] hover:bg-[#199978] text-white border-[3px] border-[#1E1E24] shadow-[0_6px_0_#1E1E24] font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 transition-colors"
                  >
                    <Download className="w-4 h-4 text-[#FBBF24]" />
                    <span>{isExporting ? 'Export...' : 'Download PNG'}</span>
                  </motion.button>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98, y: 3 }}
                    disabled={isExporting}
                    onClick={handleShareIgStory}
                    className="py-3.5 px-3.5 rounded-[20px] bg-[#D8317E] hover:bg-[#E53E8C] text-white border-[3px] border-[#1E1E24] shadow-[0_6px_0_#1E1E24] font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 transition-colors"
                  >
                    <Share2 className="w-4 h-4 text-[#FBBF24]" />
                    <span>{isExporting ? 'Siapkan...' : 'Wajib IG Story!'}</span>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* RIGHT CONTROL PANEL */}
            <div className="lg:col-span-7 space-y-5">
              {/* 🏆 MANDATORY END-GAME PUNISHMENT CHECKLIST CARD */}
              <div className="rounded-[26px] bg-[#FFE8DF] border-[3px] border-[#EC5A29] shadow-[0_6px_0_#EC5A29] p-4 sm:p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EC5A29] text-white text-xs font-black uppercase tracking-wider">
                    <Instagram className="w-3.5 h-3.5" />
                    <span>ATURAN HUKUMAN TERAKHIR END-GAME (WAJIB!)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(teamTagString).catch(() => {});
                      sfx.playFanfare();
                      showToast('Semua tag @anggota tim disalin! Siap paste di IG Story 📸');
                    }}
                    className="px-3 py-1.5 min-h-[38px] rounded-xl bg-white border-2 border-[#1E1E24] text-xs font-extrabold text-[#1E1E24] hover:bg-[#FBBF24] transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Copy className="w-3.5 h-3.5 text-[#D8317E]" />
                    <span>Copy Tag Semua Tim</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-bold text-[#1E1E24]">
                  <div className="p-2.5 rounded-xl bg-white border border-[#EC5A29]/30 flex items-center gap-2">
                    <span className="text-base">👇</span>
                    <span>1. Yang kalah wajib berdiri paling depan saat foto!</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#EC5A29]/30 flex items-center gap-2">
                    <span className="text-base">📸</span>
                    <span>2. Foto bareng pakai bingkai 9:16 di samping.</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#EC5A29]/30 flex items-center gap-2">
                    <span className="text-base">🏷️</span>
                    <span>3. Wajib Share IG Story &amp; Tag Semua Tim!</span>
                  </div>
                </div>

                {/* Editable Team Members Instagram Tags */}
                <div className="pt-2 border-t border-[#EC5A29]/20">
                  <p className="text-xs font-extrabold text-[#B42318] mb-1.5 flex items-center gap-1">
                    <AtSign className="w-3.5 h-3.5" />
                    <span>Daftar Tag Instagram Anggota Tim ({teamTags.length} Orang):</span>
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {teamTags.map((t) => (
                      <div
                        key={t.id}
                        className="inline-flex items-center bg-white border border-[#1E1E24]/20 rounded-xl px-2.5 py-1.5 gap-1 shadow-2xs"
                      >
                        <span className="text-xs font-bold text-[#64616C]">{t.name}:</span>
                        <input
                          type="text"
                          value={t.handle}
                          onChange={(e) => updateTeamTagHandle(t.id, e.target.value)}
                          className="w-24 text-xs font-extrabold text-[#D8317E] bg-transparent outline-none"
                          placeholder="@ig_kamu"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Compact 2-Tab Switcher */}
              <div className="grid grid-cols-2 gap-2 p-2 rounded-[26px] bg-white border-[3px] border-[#1E1E24] shadow-[0_6px_0_rgba(30,30,36,0.1)]">
                <button
                  type="button"
                  onClick={() => {
                    sfx.playPop(580);
                    setActiveTab('content');
                  }}
                  className={`py-3 px-4 rounded-[18px] font-display font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition cursor-pointer ${
                    activeTab === 'content'
                      ? 'bg-[#1E1E24] text-[#FBBF24] shadow-[0_4px_0_#0A0A0D]'
                      : 'bg-[#FAF7F2] text-[#64616C] hover:text-[#1E1E24] hover:bg-[#F2ECE1]'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Teks &amp; Yang Kalah</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sfx.playPop(620);
                    setActiveTab('visual');
                  }}
                  className={`py-3 px-4 rounded-[18px] font-display font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition cursor-pointer ${
                    activeTab === 'visual'
                      ? 'bg-[#1E1E24] text-[#4AE3B5] shadow-[0_4px_0_#0A0A0D]'
                      : 'bg-[#FAF7F2] text-[#64616C] hover:text-[#1E1E24] hover:bg-[#F2ECE1]'
                  }`}
                >
                  <Palette className="w-4 h-4" />
                  <span>Visual &amp; Frame</span>
                </button>
              </div>

              {/* Active Control Card */}
              <div className="rounded-[32px] bg-white border-[3px] border-[#1E1E24] shadow-[0_8px_0_rgba(30,30,36,0.12)] p-5 sm:p-6">
                <AnimatePresence mode="wait">
                  {activeTab === 'content' && (
                    <motion.div
                      key="tab-content"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="space-y-6"
                    >
                      {/* Section A: Team Name & Sub-Dialog */}
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <span className="inline-block px-3 py-0.5 rounded-full bg-[#E0EBFF] text-[#1084C8] text-xs font-extrabold uppercase">
                              SUB-DIALOG HEADER
                            </span>
                            <h3 className="font-display text-xl font-bold mt-1">
                              Teks di Bawah Logo PartyGamesHub
                            </h3>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              sfx.playShuffle();
                              setCustomSubDialog(null);
                              setSubDialogIdx((i) => (i + 1) % SUBDIALOG_PRESETS.length);
                            }}
                            className="px-3.5 py-2 rounded-[14px] bg-[#FBBF24] text-[#1E1E24] border-2 border-[#1E1E24] shadow-[0_3px_0_#1E1E24] active:translate-y-[2px] font-display font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <Shuffle className="w-3.5 h-3.5" />
                            <span>Acak Kalimat</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                          <div className="sm:col-span-5">
                            <label className="block text-[11px] font-extrabold uppercase text-[#64616C] mb-1">
                              Nama Tim / Geng
                            </label>
                            <input
                              value={teamName}
                              onChange={(e) => setTeamName(e.target.value)}
                              maxLength={24}
                              placeholder="Tim Hore"
                              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F2ECE1] border-2 border-transparent focus:border-[#1E1E24] focus:bg-white font-display font-bold text-sm outline-none transition"
                            />
                          </div>
                          <div className="sm:col-span-7">
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-[11px] font-extrabold uppercase text-[#64616C]">
                                Sub-Dialog Arcade
                              </label>
                              {customSubDialog !== null && (
                                <button
                                  type="button"
                                  onClick={() => setCustomSubDialog(null)}
                                  className="text-[11px] font-bold text-[#1084C8] hover:underline cursor-pointer"
                                >
                                  Reset Preset
                                </button>
                              )}
                            </div>
                            <input
                              value={effectiveSubDialog}
                              onChange={(e) => setCustomSubDialog(e.target.value)}
                              maxLength={64}
                              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F2ECE1] border-2 border-transparent focus:border-[#1E1E24] focus:bg-white font-bold text-sm outline-none transition"
                            />
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {SUBDIALOG_PRESETS.map((p, idx) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => {
                                sfx.playPop(580);
                                setCustomSubDialog(null);
                                setSubDialogIdx(idx);
                              }}
                              className={`px-3 py-1 rounded-full text-[11px] font-bold border-2 transition cursor-pointer ${
                                customSubDialog === null && subDialogIdx === idx
                                  ? 'bg-[#1E1E24] text-[#FBBF24] border-[#1E1E24]'
                                  : 'bg-[#FAF7F2] text-[#64616C] border-[#1E1E24]/15 hover:border-[#1E1E24]'
                              }`}
                            >
                              {p.tag}
                            </button>
                          ))}
                        </div>
                      </div>

                      <hr className="border-dashed border-[#1E1E24]/15" />

                      {/* Section B: Losers Heading & Sticker Labels */}
                      <div className="space-y-3.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <span className="inline-block px-3 py-0.5 rounded-full bg-[#FFE8DF] text-[#EC5A29] text-xs font-extrabold uppercase">
                              YANG KALAH WAJIB DI DEPAN
                            </span>
                            <h3 className="font-display text-xl font-bold mt-1">
                              Judul &amp; Nama Yang Kalah
                            </h3>
                          </div>

                          <button
                            type="button"
                            onClick={randomizeRotationsAndColors}
                            className="px-3.5 py-2 rounded-[14px] bg-[#D8317E] text-white border-2 border-[#1E1E24] shadow-[0_3px_0_#1E1E24] active:translate-y-[2px] font-display font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <Shuffle className="w-3.5 h-3.5 text-[#FBBF24]" />
                            <span>Acak Rotasi &amp; Warna</span>
                          </button>
                        </div>

                        <div className="space-y-2">
                          <input
                            value={losersHeading}
                            onChange={(e) => setLosersHeading(e.target.value)}
                            maxLength={32}
                            className="w-full px-4 py-2.5 rounded-2xl bg-[#F2ECE1] border-2 border-transparent focus:border-[#1E1E24] focus:bg-white font-display font-bold text-base outline-none transition"
                          />
                          <div className="flex flex-wrap gap-1.5">
                            {LOSER_HEADING_PRESETS.map((preset) => (
                              <button
                                key={preset}
                                type="button"
                                onClick={() => {
                                  sfx.playPop(600);
                                  setLosersHeading(preset);
                                }}
                                className={`px-3 py-1 rounded-full text-[11px] font-display font-bold border-2 transition cursor-pointer ${
                                  losersHeading === preset
                                    ? 'bg-[#1E1E24] text-[#4AE3B5] border-[#1E1E24]'
                                    : 'bg-[#FAF7F2] text-[#64616C] border-[#1E1E24]/15 hover:border-[#1E1E24]'
                                }`}
                              >
                                {preset}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <input
                            value={newLoserName}
                            onChange={(e) => setNewLoserName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addLoserLabel()}
                            placeholder="Tambah nama yang kalah (maks 6)..."
                            maxLength={16}
                            className="flex-1 px-4 py-2.5 rounded-2xl bg-[#F2ECE1] border-2 border-transparent focus:border-[#1E1E24] focus:bg-white font-bold text-sm outline-none transition"
                          />
                          <button
                            type="button"
                            onClick={addLoserLabel}
                            className="px-4 py-2.5 rounded-2xl bg-[#158467] hover:bg-[#199978] text-white border-2 border-[#1E1E24] shadow-[0_4px_0_#1E1E24] active:translate-y-[2px] font-display font-bold text-sm inline-flex items-center gap-1.5 cursor-pointer shrink-0"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Tambah</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {losers.map((item) => (
                            <div
                              key={item.id}
                              style={{ backgroundColor: item.color }}
                              className="rounded-2xl border-[2.5px] border-[#1E1E24] shadow-[0_4px_0_#1E1E24] p-2.5 space-y-2"
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-xs font-extrabold bg-white/85 text-[#1E1E24] px-2 py-0.5 rounded-full">
                                  {item.rotation > 0 ? `+${item.rotation}°` : `${item.rotation}°`}
                                </span>
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => toggleFrontSpot(item.id)}
                                    title="Tandai paling depan"
                                    className={`px-2 py-1 rounded-full text-xs font-extrabold border border-[#1E1E24] inline-flex items-center gap-1 cursor-pointer transition ${
                                      item.frontSpot
                                        ? 'bg-[#EC5A29] text-white'
                                        : 'bg-white/90 text-[#1E1E24] hover:bg-white'
                                    }`}
                                  >
                                    <Crown className="w-3 h-3" />
                                    <span>Depan</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => removeLoserLabel(item.id)}
                                    aria-label={`Hapus ${item.name}`}
                                    className="w-8 h-8 rounded-full bg-white/85 hover:bg-[#FFE4E2] text-[#1E1E24] hover:text-[#B42318] flex items-center justify-center cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              <input
                                value={item.name}
                                onChange={(e) => updateLoserName(item.id, e.target.value)}
                                maxLength={16}
                                className="w-full px-2.5 py-1.5 rounded-xl bg-white/90 border border-[#1E1E24]/25 focus:border-[#1E1E24] font-display font-bold text-sm text-[#1E1E24] outline-none"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <hr className="border-dashed border-[#1E1E24]/15" />

                      {/* Section C: Bottom Footer CTA */}
                      <div className="space-y-3">
                        <div>
                          <span className="inline-block px-3 py-0.5 rounded-full bg-[#D6F5EC] text-[#158467] text-xs font-extrabold uppercase">
                            FOOTER AJAKAN &amp; QR POJOK KANAN
                          </span>
                          <h3 className="font-display text-lg font-bold mt-1">
                            Teks Ajakan Main (Link Langsung di Bawahnya!)
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[11px] font-extrabold uppercase text-[#64616C] mb-1">
                              Baris 1 (Atas Link)
                            </label>
                            <input
                              value={footerHook}
                              onChange={(e) => setFooterHook(e.target.value)}
                              maxLength={32}
                              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F2ECE1] border-2 border-transparent focus:border-[#1E1E24] focus:bg-white font-display font-bold text-sm outline-none transition"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-extrabold uppercase text-[#64616C] mb-1">
                              Baris 3 (Bawah Link)
                            </label>
                            <input
                              value={footerSubCta}
                              onChange={(e) => setFooterSubCta(e.target.value)}
                              maxLength={30}
                              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F2ECE1] border-2 border-transparent focus:border-[#1E1E24] focus:bg-white font-display font-bold text-sm outline-none transition"
                            />
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {FOOTER_HOOK_PRESETS.map((h) => (
                            <button
                              key={h}
                              type="button"
                              onClick={() => {
                                sfx.playPop();
                                setFooterHook(h);
                              }}
                              className="px-2.5 py-1 rounded-full bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#1E1E24]/15 text-[11px] font-bold text-[#64616C] hover:text-[#1E1E24] cursor-pointer"
                            >
                              {h}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'visual' && (
                    <motion.div
                      key="tab-visual"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="space-y-6"
                    >
                      <div className="space-y-2.5">
                        <div>
                          <span className="inline-block px-3 py-0.5 rounded-full bg-[#FCE4F0] text-[#C82373] text-xs font-extrabold uppercase">
                            4 VISUAL KEY POSTER
                          </span>
                          <h3 className="font-display text-xl font-bold mt-1">
                            Pilih Tema Poster 9:16
                          </h3>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {(Object.values(POSTER_THEMES) as PosterThemeConfig[]).map((t) => {
                            const active = themeId === t.id;
                            return (
                              <button
                                key={t.id}
                                type="button"
                                onClick={() => {
                                  sfx.playPop(600);
                                  setThemeId(t.id);
                                }}
                                className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer flex flex-col gap-2 ${
                                  active
                                    ? 'bg-[#1E1E24] text-[#FAF7F2] border-[#1E1E24] shadow-[0_4px_0_#0A0A0D]'
                                    : 'bg-[#FAF7F2] text-[#1E1E24] border-[#1E1E24]/15 hover:border-[#1E1E24]/45'
                                }`}
                              >
                                <div className="flex items-center -space-x-1.5">
                                  {t.previewSwatch.map((hex, i) => (
                                    <span
                                      key={i}
                                      style={{ backgroundColor: hex }}
                                      className="w-6 h-6 rounded-full border-2 border-[#1E1E24] block"
                                    />
                                  ))}
                                </div>
                                <div>
                                  <p className="font-display font-bold text-xs sm:text-sm leading-tight">
                                    {t.name}
                                  </p>
                                  <p className={`text-xs font-bold mt-0.5 ${active ? 'text-[#FBBF24]' : 'text-[#64616C]'}`}>
                                    {t.badge}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        <p className="text-xs font-extrabold uppercase text-[#64616C]">
                          Model Bingkai Retro (Tengah):
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {(
                            [
                              {
                                id: 'retro-monitor',
                                title: 'Retro Monitor',
                                desc: 'WW Poster • Stiker & speaker',
                                icon: <Monitor className="w-5 h-5" />,
                                accent: '#158467',
                              },
                              {
                                id: 'playverse-arcade',
                                title: 'Playverse Arcade',
                                desc: 'Ungu • Joystick & tombol',
                                icon: <Gamepad2 className="w-5 h-5" />,
                                accent: '#7C3AED',
                              },
                              {
                                id: 'classic-tv',
                                title: 'Classic CRT TV',
                                desc: 'Antena kelinci & knob putar',
                                icon: <Tv className="w-5 h-5" />,
                                accent: '#EC5A29',
                              },
                            ] as const
                          ).map((f) => {
                            const active = frameStyle === f.id;
                            return (
                              <button
                                key={f.id}
                                type="button"
                                onClick={() => {
                                  sfx.playPop(620);
                                  setFrameStyle(f.id);
                                }}
                                className={`p-3.5 rounded-2xl border-2 text-left transition cursor-pointer ${
                                  active
                                    ? 'bg-[#1E1E24] text-[#FAF7F2] border-[#1E1E24] shadow-[0_4px_0_#0A0A0D]'
                                    : 'bg-[#FAF7F2] text-[#1E1E24] border-[#1E1E24]/15 hover:border-[#1E1E24]/45'
                                }`}
                              >
                                <span
                                  style={{ backgroundColor: f.accent }}
                                  className="w-9 h-9 rounded-xl text-white flex items-center justify-center mb-2 border-2 border-[#1E1E24]"
                                >
                                  {f.icon}
                                </span>
                                <p className="font-display font-bold text-sm leading-tight">{f.title}</p>
                                <p className={`text-[11px] font-semibold mt-0.5 ${active ? 'text-white/75' : 'text-[#64616C]'}`}>
                                  {f.desc}
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="rounded-[24px] bg-[#FAF7F2] border-2 border-[#1E1E24]/15 p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold uppercase text-[#64616C] flex items-center gap-1.5">
                            <SlidersHorizontal className="w-4 h-4 text-[#2568EF]" />
                            <span>Kemiringan Bingkai &amp; Framing Foto</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              sfx.playPop();
                              setFrameTiltDeg(-2.2);
                              setZoom(1.0);
                              setPanX(0);
                              setPanY(0);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-white border border-[#1E1E24]/15 text-[11px] font-bold hover:border-[#1E1E24] inline-flex items-center gap-1 cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Reset</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <label className="block space-y-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span>Kemiringan Bingkai</span>
                              <span className="text-[#EC5A29] tabular-nums">
                                {frameTiltDeg > 0 ? `+${frameTiltDeg.toFixed(1)}°` : `${frameTiltDeg.toFixed(1)}°`}
                              </span>
                            </div>
                            <input
                              type="range"
                              min={-4}
                              max={4}
                              step={0.2}
                              value={frameTiltDeg}
                              onChange={(e) => setFrameTiltDeg(parseFloat(e.target.value))}
                              className="w-full accent-[#EC5A29] cursor-pointer"
                            />
                          </label>

                          <label className="block space-y-1">
                            <div className="flex justify-between text-xs font-bold">
                              <span className="inline-flex items-center gap-1">
                                <ZoomIn className="w-3.5 h-3.5 text-[#158467]" />
                                <span>Zoom Foto</span>
                              </span>
                              <span className="text-[#158467] tabular-nums">{zoom.toFixed(2)}x</span>
                            </div>
                            <input
                              type="range"
                              min={1}
                              max={2.4}
                              step={0.05}
                              value={zoom}
                              onChange={(e) => setZoom(parseFloat(e.target.value))}
                              className="w-full accent-[#158467] cursor-pointer"
                            />
                          </label>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#1E1E24]/10">
                          <button
                            type="button"
                            onClick={() => {
                              sfx.playPop();
                              setCrtFilter((v) => !v);
                            }}
                            className={`px-3.5 py-2 rounded-full border-2 border-[#1E1E24] font-display font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer transition ${
                              crtFilter ? 'bg-[#FBBF24] text-[#1E1E24]' : 'bg-white text-[#64616C]'
                            }`}
                          >
                            <Film className="w-3.5 h-3.5" />
                            <span>Filter CRT Scanlines: {crtFilter ? 'ON' : 'OFF'}</span>
                          </button>

                          {photoImg && (
                            <button
                              type="button"
                              onClick={() => {
                                sfx.playPop(420);
                                setPhotoImg(null);
                              }}
                              className="px-3 py-2 rounded-full bg-[#FFE4E2] text-[#B42318] font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Hapus Foto</span>
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="rounded-[24px] bg-[#FAF7F2] border-2 border-[#1E1E24]/15 p-4 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className="w-9 h-9 rounded-xl bg-[#D8317E] text-white border-2 border-[#1E1E24] flex items-center justify-center">
                              <Smile className="w-5 h-5" />
                            </span>
                            <div>
                              <p className="font-display font-bold text-sm">Mascot Bermain di Sekeliling</p>
                              <p className="text-[11px] font-semibold text-[#64616C]">
                                4 stiker Grok-bot ikonik di sudut bingkai
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              sfx.playPop();
                              setShowMascots((v) => !v);
                            }}
                            className={`px-3.5 py-1.5 rounded-full border-2 border-[#1E1E24] font-display font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer transition ${
                              showMascots ? 'bg-[#4AE3B5] text-[#1E1E24]' : 'bg-white text-[#64616C]'
                            }`}
                          >
                            {showMascots ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            <span>{showMascots ? 'Aktif' : 'Sembunyi'}</span>
                          </button>
                        </div>

                        {showMascots && (
                          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#1E1E24]/10">
                            <span className="text-[11px] font-extrabold uppercase text-[#64616C]">
                              Ekspresi Mascot:
                            </span>
                            {(
                              [
                                { id: 'playful', label: '😄 Ceria Campur' },
                                { id: 'mocking', label: '🤣 Ngeledek Kalah' },
                                { id: 'cool', label: '😎 Kacamata Cool' },
                              ] as { id: MascotMoodPreset; label: string }[]
                            ).map((m) => (
                              <button
                                key={m.id}
                                type="button"
                                onClick={() => {
                                  sfx.playPop(640);
                                  setMascotMoodPreset(m.id);
                                }}
                                className={`px-3 py-1 rounded-full text-xs font-display font-bold border-2 transition cursor-pointer ${
                                  mascotMoodPreset === m.id
                                    ? 'bg-[#FBBF24] text-[#1E1E24] border-[#1E1E24]'
                                    : 'bg-white text-[#64616C] border-[#1E1E24]/15 hover:border-[#1E1E24]'
                                }`}
                              >
                                {m.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="rounded-[26px] bg-gradient-to-r from-[#FFF6D6] to-[#D6F5EC] border-[3px] border-[#1E1E24] shadow-[0_6px_0_rgba(30,30,36,0.12)] p-4 flex items-center gap-4">
                <div className="shrink-0">
                  <GrokMascotSvg shape="squircle" color="#2568EF" size={50} mood="happy" />
                </div>
                <div className="space-y-0.5">
                  <p className="font-display font-bold text-sm sm:text-base text-[#1E1E24]">
                    QR Code Tab Pojok Kanan 100% Asli &amp; Bisa Langsung Di-Scan! 📱
                  </p>
                  <p className="text-xs font-semibold text-[#3A5E54] leading-snug">
                    Menggunakan generator QR ISO/IEC 18004 murni langsung ke{' '}
                    <strong>{TARGET_WEBSITE_URL}</strong>, tajam di 1080×1920px saat di-upload ke Instagram Story!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <PartyHubScallopedFooter />
    </div>
  );
}
