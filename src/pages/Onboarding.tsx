import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  ArrowRight,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Download,
  X,
  Pencil,
  RotateCcw,
  CheckCircle2,
  Flame,
  DoorOpen,
} from 'lucide-react';
import { useGameStore } from '../store/useGameStore';

// ============================================================================
// 1. STRICT TYPES & DESIGN SYSTEM CONSTANTS
// ============================================================================
type MascotShape =
  | 'roundedSquare'
  | 'cloud'
  | 'circle'
  | 'triangle'
  | 'teardrop'
  | 'hexagon'
  | 'clover'
  | 'dome'
  | 'pill'
  | 'starburst';

type MascotAccessory = 'sunglasses' | 'sparkles' | 'cheeks';

interface MascotTemplate {
  shape: MascotShape;
  color: string;
  accent: string;
  accessory: MascotAccessory;
  name: string;
}

interface ActiveMascot {
  id: number;
  template: MascotTemplate;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  angle: number;
  angularVelocity: number;
  scaleX: number;
  scaleY: number;
  blinkPhase: number;
  blinkInterval: number;
}

interface FlashBurst {
  x: number;
  y: number;
  age: number;
  duration: number;
  maxRadius: number;
  color: string;
  rotation: number;
}

interface ShockwaveRing {
  x: number;
  y: number;
  age: number;
  duration: number;
  startRadius: number;
  maxRadius: number;
  color: string;
  lineWidth: number;
}

interface GeoShard {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  sides: number;
  color: string;
  angle: number;
  va: number;
  age: number;
  life: number;
}

interface JellyDroplet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  age: number;
  life: number;
}

interface SparkleConfetti {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  kind: 'star' | 'rect';
  angle: number;
  va: number;
  age: number;
  life: number;
}

interface ComicPopText {
  x: number;
  y: number;
  vy: number;
  text: string;
  color: string;
  age: number;
  life: number;
  isCombo: boolean;
}

interface ClickRipple {
  x: number;
  y: number;
  age: number;
  duration: number;
  maxRadius: number;
}

interface BladePoint {
  x: number;
  y: number;
  age: number;
}

// 10 Unique Vibrant Mascot Bot Variations (Grok Bot / Cue / Dots Sticker Style)
const MASCOT_TEMPLATES: MascotTemplate[] = [
  { shape: 'roundedSquare', color: '#2568EF', accent: '#93C5FD', accessory: 'sunglasses', name: 'Cobalt Cube' },
  { shape: 'cloud', color: '#158467', accent: '#6EE7B7', accessory: 'sparkles', name: 'Emerald Puff' },
  { shape: 'circle', color: '#D8317E', accent: '#F9A8D4', accessory: 'cheeks', name: 'Berry Orb' },
  { shape: 'triangle', color: '#8B5CF6', accent: '#C4B5FD', accessory: 'sparkles', name: 'Violet Tri' },
  { shape: 'teardrop', color: '#0EA5E9', accent: '#7DD3FC', accessory: 'cheeks', name: 'Sky Drop' },
  { shape: 'hexagon', color: '#EC5A29', accent: '#FDBA74', accessory: 'sunglasses', name: 'Tangerine Hex' },
  { shape: 'clover', color: '#10B981', accent: '#A7F3D0', accessory: 'cheeks', name: 'Mint Clover' },
  { shape: 'dome', color: '#FBBF24', accent: '#FEF08A', accessory: 'sparkles', name: 'Sunny Dome' },
  { shape: 'pill', color: '#F43F5E', accent: '#FDA4AF', accessory: 'cheeks', name: 'Coral Pill' },
  { shape: 'starburst', color: '#8C6D46', accent: '#E6CCB2', accessory: 'sparkles', name: 'Ochre Star' },
];

// 6 Concentric Stacked-Circle Colors for the Page Transition
const TRANSITION_CIRCLE_COLORS = [
  '#158467', // Emerald
  '#C82373', // Berry
  '#2568EF', // Cobalt
  '#E85D2A', // Tangerine
  '#FBBF24', // Sunny Gold
  '#1E1E24', // Deep Ink
];

const IMPACT_WORDS = ['BOOM!', 'POP!', 'POW!', 'BAM!', 'ZAP!'];

// ============================================================================
// 2. WEB AUDIO API SOUND SYNTHESIZER (ZERO EXTERNAL ASSETS)
// ============================================================================
class PartyAudioSynth {
  private ctx: AudioContext | null = null;
  public muted = false;

  private ensureContext(): AudioContext | null {
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

  /** Layered juicy bubble-pop + soft punchy cartoon boom + bright sparkle chime */
  playExplosion(combo = 1) {
    if (this.muted) return;
    try {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Pentatonic combo pitch scaling (1.0x up to ~2.1x)
      const semitones = [0, 2, 4, 7, 9, 12, 14, 16, 19];
      const semi = semitones[Math.min(Math.max(0, combo - 1), semitones.length - 1)];
      const mult = Math.pow(2, semi / 12);

      // Layer 1: Soft punchy cartoon boom (low sine thump)
      const boomOsc = ctx.createOscillator();
      const boomGain = ctx.createGain();
      boomOsc.type = 'sine';
      boomOsc.frequency.setValueAtTime(165 * Math.min(1.25, 0.92 + combo * 0.05), now);
      boomOsc.frequency.exponentialRampToValueAtTime(48, now + 0.14);
      boomGain.gain.setValueAtTime(0.24, now);
      boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      boomOsc.connect(boomGain);
      boomGain.connect(ctx.destination);
      boomOsc.start(now);
      boomOsc.stop(now + 0.17);

      // Layer 2: Crisp bubble-pop sweep
      const popOsc = ctx.createOscillator();
      const popGain = ctx.createGain();
      popOsc.type = 'triangle';
      popOsc.frequency.setValueAtTime(340 * mult, now);
      popOsc.frequency.exponentialRampToValueAtTime(860 * mult, now + 0.075);
      popGain.gain.setValueAtTime(0.18, now);
      popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.095);
      popOsc.connect(popGain);
      popGain.connect(ctx.destination);
      popOsc.start(now);
      popOsc.stop(now + 0.1);

      // Layer 3: Bright sparkle chime overtone
      const chimeOsc = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chimeOsc.type = 'sine';
      chimeOsc.frequency.setValueAtTime(1046.5 * mult, now + 0.02);
      chimeOsc.frequency.exponentialRampToValueAtTime(1318.5 * mult, now + 0.13);
      chimeGain.gain.setValueAtTime(0.09, now + 0.02);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      chimeOsc.connect(chimeGain);
      chimeGain.connect(ctx.destination);
      chimeOsc.start(now + 0.02);
      chimeOsc.stop(now + 0.17);

      // Layer 4: Short filtered white-noise burst for tactile "burst" snap
      const bufferSize = Math.floor(ctx.sampleRate * 0.07);
      const noiseBuf = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuf.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuf;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400 * Math.min(1.5, mult), now);
      filter.Q.setValueAtTime(1.1, now);
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.14, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);
    } catch {}
  }

  /** Subtle clean click ripple sound on empty canvas tap */
  playRippleTap() {
    if (this.muted) return;
    try {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.06);
      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.075);
    } catch {}
  }

  /** Celebratory whoosh + chime on START / room transition */
  playTransitionWhoosh() {
    if (this.muted) return;
    try {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const notes = [392.0, 493.88, 587.33, 783.99, 1046.5];
      notes.forEach((f, idx) => {
        const start = ctx.currentTime + idx * 0.048;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, start);
        osc.frequency.exponentialRampToValueAtTime(f * 1.12, start + 0.16);
        gain.gain.setValueAtTime(0.12, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.23);
      });
    } catch {}
  }

  /** Crisp UI button pop */
  playUiTap(pitch = 560) {
    if (this.muted) return;
    try {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, now);
      osc.frequency.exponentialRampToValueAtTime(pitch * 1.4, now + 0.065);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch {}
  }
}

const audio = new PartyAudioSynth();

// ============================================================================
// 3. BODYMOVIN v5.7.4 LOTTIE JSON GENERATORS
// ============================================================================
function hexToLottieRgba(hex: string): [number, number, number, number] {
  const c = hex.replace('#', '');
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  return [Number(r.toFixed(3)), Number(g.toFixed(3)), Number(b.toFixed(3)), 1];
}

function generateCircleTransitionLottieJSON() {
  const op = 74; // ~1.23s at 60fps
  return {
    v: '5.7.4',
    fr: 60,
    ip: 0,
    op,
    w: 1080,
    h: 1080,
    nm: 'circle-transition',
    ddd: 0,
    assets: [],
    layers: TRANSITION_CIRCLE_COLORS.map((hex, i) => {
      const inStart = i * 3;
      const inEnd = inStart + 22;
      const outStart = 38 + (TRANSITION_CIRCLE_COLORS.length - 1 - i) * 3;
      const outEnd = Math.min(op, outStart + 20);
      return {
        ddd: 0,
        ind: i + 1,
        ty: 4,
        nm: `Concentric_Circle_0${i + 1}_${hex.replace('#', '')}`,
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [540, 540, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: {
            a: 1,
            k: [
              {
                t: inStart,
                s: [0, 0, 100],
                e: [260, 260, 100],
                o: { x: [0.22], y: [1] },
                i: { x: [0.36], y: [1] },
              },
              { t: inEnd, s: [260, 260, 100], e: [260, 260, 100] },
              {
                t: outStart,
                s: [260, 260, 100],
                e: [0, 0, 100],
                o: { x: [0.65], y: [0] },
                i: { x: [0.35], y: [1] },
              },
              { t: outEnd, s: [0, 0, 100] },
            ],
          },
        },
        shapes: [
          { ty: 'el', p: { a: 0, k: [0, 0] }, s: { a: 0, k: [760, 760] }, nm: 'CirclePath' },
          { ty: 'fl', c: { a: 0, k: hexToLottieRgba(hex) }, o: { a: 0, k: 100 }, nm: 'CircleFill' },
        ],
        ip: 0,
        op,
        st: 0,
      };
    }),
  };
}

function generateMascotExplodeLottieJSON() {
  const op = 48; // 0.8s @ 60fps
  const burstPalette = ['#EC5A29', '#FBBF24', '#2568EF', '#D8317E', '#158467', '#8B5CF6', '#0EA5E9', '#F43F5E'];

  const layers: Record<string, unknown>[] = [
    // Core Flash Burst
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'Core_Flash_Burst',
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { t: 0, s: [100], e: [0], o: { x: [0.22], y: [1] }, i: { x: [0.36], y: [1] } },
            { t: 10, s: [0] },
          ],
        },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [250, 250, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [20, 20, 100], e: [160, 160, 100], o: { x: [0.16], y: [1] }, i: { x: [0.3], y: [1] } },
            { t: 10, s: [160, 160, 100] },
          ],
        },
      },
      shapes: [
        {
          ty: 'sr',
          sy: 1,
          pt: { a: 0, k: 8 },
          p: { a: 0, k: [0, 0] },
          r: { a: 0, k: 0 },
          ir: { a: 0, k: 34 },
          is: { a: 0, k: 0 },
          or: { a: 0, k: 84 },
          os: { a: 0, k: 0 },
          nm: 'FlashStar',
        },
        { ty: 'fl', c: { a: 0, k: [1, 0.96, 0.72, 1] }, o: { a: 0, k: 100 }, nm: 'FlashFill' },
      ],
      ip: 0,
      op,
      st: 0,
    },
    // Shockwave Outer Ring
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: 'Shockwave_Outer_Ring',
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { t: 0, s: [100], e: [0], o: { x: [0.22], y: [1] }, i: { x: [0.36], y: [1] } },
            { t: 24, s: [0] },
          ],
        },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [250, 250, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [25, 25, 100], e: [220, 220, 100], o: { x: [0.16], y: [1] }, i: { x: [0.3], y: [1] } },
            { t: 24, s: [220, 220, 100] },
          ],
        },
      },
      shapes: [
        { ty: 'el', p: { a: 0, k: [0, 0] }, s: { a: 0, k: [140, 140] }, nm: 'OuterRing' },
        { ty: 'st', c: { a: 0, k: hexToLottieRgba('#EC5A29') }, o: { a: 0, k: 100 }, w: { a: 0, k: 12 }, nm: 'Stroke' },
      ],
      ip: 0,
      op,
      st: 0,
    },
  ];

  burstPalette.forEach((hex, idx) => {
    const angle = (idx * Math.PI * 2) / burstPalette.length;
    const endX = Math.round(250 + Math.cos(angle) * 185);
    const endY = Math.round(250 + Math.sin(angle) * 185);

    layers.push({
      ddd: 0,
      ind: 3 + idx,
      ty: 4,
      nm: `Explode_Shard_0${idx + 1}`,
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { t: 0, s: [100], e: [100] },
            { t: 22, s: [100], e: [0] },
            { t: 40, s: [0] },
          ],
        },
        r: {
          a: 1,
          k: [
            { t: 0, s: [idx * 30], e: [idx * 30 + 180] },
            { t: 40, s: [idx * 30 + 180] },
          ],
        },
        p: {
          a: 1,
          k: [
            { t: 0, s: [250, 250, 0], e: [endX, endY, 0], o: { x: 0.16, y: 1 }, i: { x: 0.3, y: 1 } },
            { t: 36, s: [endX, endY + 42, 0] },
          ],
        },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [115, 115, 100], e: [20, 20, 100] },
            { t: 40, s: [20, 20, 100] },
          ],
        },
      },
      shapes: [
        { ty: 'rc', p: { a: 0, k: [0, 0] }, s: { a: 0, k: [26, 26] }, r: { a: 0, k: 8 }, nm: 'ShardRect' },
        { ty: 'st', c: { a: 0, k: [1, 1, 1, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 5 }, nm: 'StickerStroke' },
        { ty: 'fl', c: { a: 0, k: hexToLottieRgba(hex) }, o: { a: 0, k: 100 }, nm: 'ShardFill' },
      ],
      ip: 0,
      op,
      st: 0,
    });
  });

  return {
    v: '5.7.4',
    fr: 60,
    ip: 0,
    op,
    w: 500,
    h: 500,
    nm: 'mascot-explode-burst',
    ddd: 0,
    assets: [],
    layers,
  };
}

// ============================================================================
// 4. CANVAS 2D MASCOT DRAWING HELPERS
// ============================================================================
function drawRoundedRectPath(
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

function drawRoundedPolyPath(
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[],
  cornerRadius: number
) {
  const n = points.length;
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const prev = points[(i - 1 + n) % n];
    const curr = points[i];
    const next = points[(i + 1) % n];

    const v1x = prev.x - curr.x;
    const v1y = prev.y - curr.y;
    const v2x = next.x - curr.x;
    const v2y = next.y - curr.y;
    const len1 = Math.hypot(v1x, v1y) || 1;
    const len2 = Math.hypot(v2x, v2y) || 1;
    const r = Math.min(cornerRadius, len1 * 0.42, len2 * 0.42);

    const p1x = curr.x + (v1x / len1) * r;
    const p1y = curr.y + (v1y / len1) * r;
    const p2x = curr.x + (v2x / len2) * r;
    const p2y = curr.y + (v2y / len2) * r;

    if (i === 0) ctx.moveTo(p1x, p1y);
    else ctx.lineTo(p1x, p1y);
    ctx.quadraticCurveTo(curr.x, curr.y, p2x, p2y);
  }
  ctx.closePath();
}

function buildMascotShapePath(ctx: CanvasRenderingContext2D, shape: MascotShape, r: number) {
  switch (shape) {
    case 'roundedSquare':
      drawRoundedRectPath(ctx, -r * 0.88, -r * 0.84, r * 1.76, r * 1.68, r * 0.56);
      break;

    case 'circle':
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.92, 0, Math.PI * 2);
      ctx.closePath();
      break;

    case 'pill':
      drawRoundedRectPath(ctx, -r * 1.04, -r * 0.68, r * 2.08, r * 1.36, r * 0.68);
      break;

    case 'triangle': {
      const pts = [
        { x: 0, y: -r * 1.02 },
        { x: r * 0.98, y: r * 0.78 },
        { x: -r * 0.98, y: r * 0.78 },
      ];
      drawRoundedPolyPath(ctx, pts, r * 0.34);
      break;
    }

    case 'hexagon': {
      const pts: { x: number; y: number }[] = [];
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        pts.push({ x: Math.cos(a) * r * 0.96, y: Math.sin(a) * r * 0.96 });
      }
      drawRoundedPolyPath(ctx, pts, r * 0.28);
      break;
    }

    case 'teardrop':
      ctx.beginPath();
      ctx.moveTo(0, -r * 1.06);
      ctx.bezierCurveTo(r * 0.65, -r * 0.42, r * 0.94, r * 0.14, r * 0.94, r * 0.34);
      ctx.bezierCurveTo(r * 0.94, r * 0.86, r * 0.52, r * 0.96, 0, r * 0.96);
      ctx.bezierCurveTo(-r * 0.52, r * 0.96, -r * 0.94, r * 0.86, -r * 0.94, r * 0.34);
      ctx.bezierCurveTo(-r * 0.94, r * 0.14, -r * 0.65, -r * 0.42, 0, -r * 1.06);
      ctx.closePath();
      break;

    case 'dome':
      ctx.beginPath();
      ctx.moveTo(-r * 0.86, r * 0.12);
      ctx.arc(0, r * 0.04, r * 0.86, Math.PI, 0, false);
      ctx.lineTo(r * 0.86, r * 0.52);
      ctx.quadraticCurveTo(r * 0.86, r * 0.84, r * 0.52, r * 0.84);
      ctx.lineTo(-r * 0.52, r * 0.84);
      ctx.quadraticCurveTo(-r * 0.86, r * 0.84, -r * 0.86, r * 0.52);
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

    case 'clover': {
      const lobes = 4;
      ctx.beginPath();
      for (let i = 0; i <= 72; i++) {
        const theta = (i / 72) * Math.PI * 2;
        const rad = r * (0.78 + 0.22 * Math.cos(lobes * theta));
        const px = Math.cos(theta) * rad;
        const py = Math.sin(theta) * rad;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      break;
    }

    case 'starburst':
    default: {
      const spikes = 7;
      ctx.beginPath();
      for (let i = 0; i <= 84; i++) {
        const theta = (i / 84) * Math.PI * 2;
        const rad = r * (0.8 + 0.2 * Math.cos(spikes * theta));
        const px = Math.cos(theta) * rad;
        const py = Math.sin(theta) * rad;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      break;
    }
  }
}

function drawFourPointStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, outerR: number, color: string) {
  const innerR = outerR * 0.36;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    const rr = i % 2 === 0 ? outerR : innerR;
    const px = Math.cos(a) * rr;
    const py = Math.sin(a) * rr;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function drawMascotOnCanvas(ctx: CanvasRenderingContext2D, bot: ActiveMascot, elapsedSec: number) {
  const { template, radius: r, vy } = bot;
  ctx.save();
  ctx.translate(bot.x, bot.y);
  ctx.rotate(bot.angle);
  ctx.scale(bot.scaleX, bot.scaleY);

  // Sticker Drop Shadow & Thick White Border
  ctx.save();
  ctx.shadowColor = 'rgba(30, 30, 36, 0.14)';
  ctx.shadowBlur = 16;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 7;
  buildMascotShapePath(ctx, template.shape, r);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.lineWidth = 14;
  ctx.strokeStyle = '#FFFFFF';
  ctx.stroke();
  ctx.restore();

  // Solid Mascot Fill
  buildMascotShapePath(ctx, template.shape, r);
  ctx.fillStyle = template.color;
  ctx.fill();

  // Glossy highlight
  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.ellipse(-r * 0.26, -r * 0.36, r * 0.24, r * 0.12, -0.45, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Rosy cheeks
  const eyeCenterY = template.shape === 'triangle' || template.shape === 'teardrop' ? r * 0.18 : 0;
  const eyeSpacing = r * 0.28;

  if (template.accessory === 'cheeks') {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.32)';
    ctx.beginPath();
    ctx.ellipse(-eyeSpacing * 1.48, eyeCenterY + r * 0.22, r * 0.13, r * 0.08, 0, 0, Math.PI * 2);
    ctx.ellipse(eyeSpacing * 1.48, eyeCenterY + r * 0.22, r * 0.13, r * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Signature White Pill Eyes with 60fps Blinks and Velocity Reactivity
  const blinkCycle = (elapsedSec + bot.blinkPhase) % bot.blinkInterval;
  const isBlinking = blinkCycle > bot.blinkInterval - 0.14;

  if (template.accessory === 'sunglasses') {
    ctx.save();
    ctx.fillStyle = '#1E1E24';
    const glassW = r * 0.44;
    const glassH = r * 0.34;
    drawRoundedRectPath(ctx, -eyeSpacing - glassW * 0.55, eyeCenterY - glassH * 0.5, glassW, glassH, r * 0.1);
    ctx.fill();
    drawRoundedRectPath(ctx, eyeSpacing - glassW * 0.45, eyeCenterY - glassH * 0.5, glassW, glassH, r * 0.1);
    ctx.fill();
    ctx.fillRect(-r * 0.14, eyeCenterY - r * 0.09, r * 0.28, r * 0.08);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = Math.max(2.5, r * 0.07);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-eyeSpacing - r * 0.12, eyeCenterY - r * 0.06);
    ctx.lineTo(-eyeSpacing + r * 0.04, eyeCenterY + r * 0.08);
    ctx.moveTo(eyeSpacing - r * 0.08, eyeCenterY - r * 0.06);
    ctx.lineTo(eyeSpacing + r * 0.08, eyeCenterY + r * 0.08);
    ctx.stroke();
    ctx.restore();
  } else if (isBlinking) {
    ctx.fillStyle = '#FFFFFF';
    drawRoundedRectPath(ctx, -eyeSpacing - r * 0.14, eyeCenterY - r * 0.045, r * 0.28, r * 0.09, r * 0.045);
    ctx.fill();
    drawRoundedRectPath(ctx, eyeSpacing - r * 0.14, eyeCenterY - r * 0.045, r * 0.28, r * 0.09, r * 0.045);
    ctx.fill();
  } else if (Math.abs(vy) <= 140) {
    // Hang-time happy eyes (^ ^)
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = Math.max(3.5, r * 0.11);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(-eyeSpacing - r * 0.12, eyeCenterY + r * 0.06);
    ctx.quadraticCurveTo(-eyeSpacing, eyeCenterY - r * 0.14, -eyeSpacing + r * 0.12, eyeCenterY + r * 0.06);
    ctx.moveTo(eyeSpacing - r * 0.12, eyeCenterY + r * 0.06);
    ctx.quadraticCurveTo(eyeSpacing, eyeCenterY - r * 0.14, eyeSpacing + r * 0.12, eyeCenterY + r * 0.06);
    ctx.stroke();
  } else if (vy > 140) {
    // Falling down: tilted surprise eyes
    ctx.fillStyle = '#FFFFFF';
    ctx.save();
    ctx.translate(-eyeSpacing, eyeCenterY + r * 0.04);
    ctx.rotate(-0.22);
    drawRoundedRectPath(ctx, -r * 0.11, -r * 0.22, r * 0.22, r * 0.44, r * 0.11);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(eyeSpacing, eyeCenterY + r * 0.04);
    ctx.rotate(0.22);
    drawRoundedRectPath(ctx, -r * 0.11, -r * 0.22, r * 0.22, r * 0.44, r * 0.11);
    ctx.fill();
    ctx.restore();
  } else {
    // Rising upward: wide pill eyes looking up
    ctx.fillStyle = '#FFFFFF';
    const lookUpY = eyeCenterY - r * 0.07;
    drawRoundedRectPath(ctx, -eyeSpacing - r * 0.11, lookUpY - r * 0.24, r * 0.22, r * 0.48, r * 0.11);
    ctx.fill();
    drawRoundedRectPath(ctx, eyeSpacing - r * 0.11, lookUpY - r * 0.24, r * 0.22, r * 0.48, r * 0.11);
    ctx.fill();
  }

  if (template.accessory === 'sparkles') {
    drawFourPointStar(ctx, r * 0.72, -r * 0.72, r * 0.22, '#FBBF24');
  }

  ctx.restore();
}

function distSqPointToSegment(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return (px - x1) * (px - x1) + (py - y1) * (py - y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  const projX = x1 + t * dx;
  const projY = y1 + t * dy;
  return (px - projX) * (px - projX) + (py - projY) * (py - projY);
}

// ============================================================================
// 5. HIGH-FPS CANVAS FRUIT NINJA MASCOT ENGINE
// ============================================================================
const FruitNinjaMascotCanvas: React.FC<{
  active: boolean;
  onExplode: (totalExplosions: number, currentCombo: number) => void;
}> = ({ active, onExplode }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const onExplodeRef = useRef(onExplode);
  onExplodeRef.current = onExplode;

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const mascots: ActiveMascot[] = [];
    const flashes: FlashBurst[] = [];
    const rings: ShockwaveRing[] = [];
    const shards: GeoShard[] = [];
    const droplets: JellyDroplet[] = [];
    const sparkles: SparkleConfetti[] = [];
    const popTexts: ComicPopText[] = [];
    const ripples: ClickRipple[] = [];
    const bladeTrail: BladePoint[] = [];

    let nextId = 1;
    let totalExplosions = 0;
    let combo = 0;
    let lastExplodeMs = 0;
    let shakeTime = 0;
    const SHAKE_DURATION = 0.16;
    const GRAVITY = 1150;

    let isPointerDown = false;
    let lastPointerX = 0;
    let lastPointerY = 0;
    let mouseX = -100;
    let mouseY = -100;
    let isMouseInside = false;
    let isTouchDevice = false;

    const spawnMascot = (xOverride?: number) => {
      if (mascots.length >= 9) return;
      const template = MASCOT_TEMPLATES[Math.floor(Math.random() * MASCOT_TEMPLATES.length)];
      const baseR = width < 640 ? 34 : 42;
      const radius = baseR + Math.random() * 10;

      const margin = Math.max(radius + 28, width * 0.09);
      const x =
        xOverride !== undefined
          ? Math.max(margin, Math.min(width - margin, xOverride))
          : margin + Math.random() * Math.max(60, width - margin * 2);
      const y = height + radius + 20;

      const apexPercentFromBottom = 0.62 + Math.random() * 0.26;
      const targetApexY = height * (1 - apexPercentFromBottom);
      const travelDistance = Math.max(220, y - targetApexY);
      const vy = -Math.sqrt(2 * GRAVITY * travelDistance);

      const towardCenter = width * 0.5 - x;
      const vx = towardCenter * (0.38 + Math.random() * 0.34) + (Math.random() - 0.5) * 145;

      const spinDir = Math.random() < 0.5 ? -1 : 1;
      const angularVelocity = spinDir * (1.2 + Math.random() * 2.2);

      mascots.push({
        id: nextId++,
        template,
        x,
        y,
        vx,
        vy,
        radius,
        angle: (Math.random() - 0.5) * 0.6,
        angularVelocity,
        scaleX: 0.78,
        scaleY: 1.26,
        blinkPhase: Math.random() * 4,
        blinkInterval: 2.9 + Math.random() * 2.0,
      });
    };

    const explodeMascot = (index: number) => {
      const bot = mascots[index];
      if (!bot) return;
      mascots.splice(index, 1);

      const nowMs = performance.now();
      if (nowMs - lastExplodeMs <= 1200) {
        combo += 1;
      } else {
        combo = 1;
      }
      lastExplodeMs = nowMs;
      totalExplosions += 1;
      shakeTime = SHAKE_DURATION;

      audio.playExplosion(combo);
      onExplodeRef.current(totalExplosions, combo);

      const { x, y, radius, template } = bot;

      // 1. Core Flash Burst
      flashes.push({
        x,
        y,
        age: 0,
        duration: 0.16,
        maxRadius: radius * 1.95,
        color: '#FFFBEB',
        rotation: Math.random() * Math.PI,
      });

      // 2. Double Shockwave Rings
      rings.push({
        x,
        y,
        age: 0,
        duration: 0.38,
        startRadius: radius * 0.4,
        maxRadius: radius * 2.5,
        color: template.color,
        lineWidth: 9,
      });
      rings.push({
        x,
        y,
        age: 0,
        duration: 0.28,
        startRadius: radius * 0.2,
        maxRadius: radius * 1.85,
        color: '#FFFFFF',
        lineWidth: 6,
      });

      // 3. Exploding Geometric Shards
      const shardCount = 9;
      for (let i = 0; i < shardCount; i++) {
        const a = (Math.PI * 2 * i) / shardCount + (Math.random() - 0.5) * 0.35;
        const speed = 220 + Math.random() * 290;
        shards.push({
          x,
          y,
          vx: Math.cos(a) * speed,
          vy: Math.sin(a) * speed - 130,
          size: 11 + Math.random() * 8,
          sides: i % 2 === 0 ? 4 : 5,
          color: i % 3 === 0 ? template.accent : template.color,
          angle: Math.random() * Math.PI * 2,
          va: (Math.random() - 0.5) * 14,
          age: 0,
          life: 0.65 + Math.random() * 0.28,
        });
      }

      // 4. Glossy Jelly Droplets
      const dropCount = 16;
      for (let i = 0; i < dropCount; i++) {
        const a = Math.random() * Math.PI * 2;
        const speed = 130 + Math.random() * 340;
        droplets.push({
          x,
          y,
          vx: Math.cos(a) * speed,
          vy: Math.sin(a) * speed - 90,
          radius: 4.5 + Math.random() * 6.5,
          color: i % 4 === 0 ? '#FFFFFF' : i % 2 === 0 ? template.color : template.accent,
          age: 0,
          life: 0.55 + Math.random() * 0.35,
        });
      }

      // 5. Sparkle Stars & Mini Confetti
      const confettiPalette = ['#FBBF24', '#FFFFFF', template.color, '#4AE3B5', '#FF8AC2'];
      for (let i = 0; i < 9; i++) {
        const a = (Math.PI * 2 * i) / 9 + Math.random() * 0.4;
        const speed = 170 + Math.random() * 240;
        sparkles.push({
          x,
          y,
          vx: Math.cos(a) * speed,
          vy: Math.sin(a) * speed - 120,
          size: 7 + Math.random() * 6,
          color: confettiPalette[i % confettiPalette.length],
          kind: i % 2 === 0 ? 'star' : 'rect',
          angle: Math.random() * Math.PI * 2,
          va: (Math.random() - 0.5) * 11,
          age: 0,
          life: 0.72 + Math.random() * 0.32,
        });
      }

      // 6. Comic Pop Text
      const word = IMPACT_WORDS[Math.floor(Math.random() * IMPACT_WORDS.length)];
      const isCombo = combo >= 2;
      popTexts.push({
        x: Math.max(76, Math.min(width - 76, x)),
        y: Math.max(70, y - 14),
        vy: -115,
        text: isCombo ? `BOOM! x${combo}` : word,
        color: isCombo ? '#EC5A29' : template.color,
        age: 0,
        life: 0.72,
        isCombo,
      });
    };

    const hitTestPoint = (px: number, py: number): boolean => {
      for (let i = mascots.length - 1; i >= 0; i--) {
        const b = mascots[i];
        const dx = px - b.x;
        const dy = py - b.y;
        const hitR = b.radius * 1.35;
        if (dx * dx + dy * dy <= hitR * hitR) {
          explodeMascot(i);
          return true;
        }
      }
      return false;
    };

    const hitTestSegment = (x1: number, y1: number, x2: number, y2: number) => {
      for (let i = mascots.length - 1; i >= 0; i--) {
        const b = mascots[i];
        const hitR = b.radius * 1.28;
        if (distSqPointToSegment(b.x, b.y, x1, y1, x2, y2) <= hitR * hitR) {
          explodeMascot(i);
        }
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest('[data-ui-interactive="true"]')) return;

      isPointerDown = true;
      if (e.pointerType === 'touch') isTouchDevice = true;
      mouseX = e.clientX;
      mouseY = e.clientY;
      isMouseInside = true;
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
      bladeTrail.push({ x: e.clientX, y: e.clientY, age: 0 });

      if (canvas) {
        canvas.classList.remove('cursor-ninja');
        canvas.classList.add('cursor-ninja-slash');
      }

      const hit = hitTestPoint(e.clientX, e.clientY);
      if (!hit) {
        audio.playRippleTap();
        ripples.push({
          x: e.clientX,
          y: e.clientY,
          age: 0,
          duration: 0.34,
          maxRadius: 34,
        });
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isMouseInside = true;
      if (e.pointerType === 'touch') isTouchDevice = true;

      if (!isPointerDown) return;
      const cx = e.clientX;
      const cy = e.clientY;
      hitTestSegment(lastPointerX, lastPointerY, cx, cy);
      bladeTrail.push({ x: cx, y: cy, age: 0 });
      if (bladeTrail.length > 26) bladeTrail.shift();
      lastPointerX = cx;
      lastPointerY = cy;
    };

    const onPointerUp = () => {
      isPointerDown = false;
      if (canvas) {
        canvas.classList.remove('cursor-ninja-slash');
        canvas.classList.add('cursor-ninja');
      }
    };

    const onPointerLeave = () => {
      isMouseInside = false;
      isPointerDown = false;
      if (canvas) {
        canvas.classList.remove('cursor-ninja-slash');
        canvas.classList.add('cursor-ninja');
      }
    };

    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    window.addEventListener('pointerleave', onPointerLeave);

    // Initial launch wave
    spawnMascot(width * 0.22);
    const t1 = window.setTimeout(() => spawnMascot(width * 0.78), 220);
    const t2 = window.setTimeout(() => spawnMascot(width * 0.5), 520);

    let rafId = 0;
    let lastTs = performance.now();
    let elapsedSec = 0;
    let spawnTimer = 0;
    let nextWaveDelay = 0.95;

    const frame = (ts: number) => {
      const dt = Math.min((ts - lastTs) / 1000, 0.033);
      lastTs = ts;
      elapsedSec += dt;

      if (combo > 0 && ts - lastExplodeMs > 1250) {
        combo = 0;
        onExplodeRef.current(totalExplosions, 0);
      }

      spawnTimer += dt;
      if (spawnTimer >= nextWaveDelay) {
        spawnTimer = 0;
        nextWaveDelay = 0.85 + Math.random() * 0.5;
        const roll = Math.random();
        const waveSize = roll > 0.72 ? 3 : roll > 0.36 ? 2 : 1;
        for (let k = 0; k < waveSize; k++) {
          if (mascots.length < 9) {
            spawnMascot();
          }
        }
      }

      for (let i = mascots.length - 1; i >= 0; i--) {
        const b = mascots[i];
        b.vy += GRAVITY * dt;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.angle += b.angularVelocity * dt;

        const settle = Math.min(1, dt * 10);
        b.scaleX += (1 - b.scaleX) * settle;
        b.scaleY += (1 - b.scaleY) * settle;

        if (b.x < b.radius + 14 && b.vx < 0) {
          b.x = b.radius + 14;
          b.vx *= -0.72;
        } else if (b.x > width - b.radius - 14 && b.vx > 0) {
          b.x = width - b.radius - 14;
          b.vx *= -0.72;
        }

        if (b.y > height + b.radius + 95 && b.vy > 0) {
          mascots.splice(i, 1);
        }
      }

      ctx.save();
      ctx.clearRect(0, 0, width, height);

      if (shakeTime > 0) {
        shakeTime = Math.max(0, shakeTime - dt);
        const ratio = shakeTime / SHAKE_DURATION;
        const mag = 4.5 * ratio * ratio;
        ctx.translate((Math.random() - 0.5) * 2 * mag, (Math.random() - 0.5) * 2 * mag);
      }

      // Draw click ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.age += dt;
        if (rp.age >= rp.duration) {
          ripples.splice(i, 1);
          continue;
        }
        const p = rp.age / rp.duration;
        const ease = 1 - Math.pow(1 - p, 3);
        ctx.save();
        ctx.globalAlpha = (1 - p) * 0.35;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, 6 + rp.maxRadius * ease, 0, Math.PI * 2);
        ctx.strokeStyle = '#1E1E24';
        ctx.lineWidth = 2.5 * (1 - p);
        ctx.stroke();
        ctx.restore();
      }

      // Draw mascots
      for (let i = 0; i < mascots.length; i++) {
        drawMascotOnCanvas(ctx, mascots[i], elapsedSec);
      }

      // Draw flash bursts
      for (let i = flashes.length - 1; i >= 0; i--) {
        const fl = flashes[i];
        fl.age += dt;
        if (fl.age >= fl.duration) {
          flashes.splice(i, 1);
          continue;
        }
        const p = fl.age / fl.duration;
        const ease = 1 - Math.pow(1 - p, 3);
        const curR = fl.maxRadius * (0.25 + 0.75 * ease);
        ctx.save();
        ctx.translate(fl.x, fl.y);
        ctx.rotate(fl.rotation + p * 0.4);
        ctx.globalAlpha = 1 - p;
        ctx.beginPath();
        const spikes = 8;
        for (let s = 0; s < spikes * 2; s++) {
          const a = (s * Math.PI) / spikes;
          const rad = s % 2 === 0 ? curR : curR * 0.42;
          const px = Math.cos(a) * rad;
          const py = Math.sin(a) * rad;
          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fillStyle = fl.color;
        ctx.fill();
        ctx.restore();
      }

      // Draw shockwave rings
      for (let i = rings.length - 1; i >= 0; i--) {
        const rg = rings[i];
        rg.age += dt;
        if (rg.age >= rg.duration) {
          rings.splice(i, 1);
          continue;
        }
        const p = rg.age / rg.duration;
        const ease = 1 - Math.pow(1 - p, 3);
        const r = rg.startRadius + (rg.maxRadius - rg.startRadius) * ease;
        ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - p);
        ctx.beginPath();
        ctx.arc(rg.x, rg.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = rg.color;
        ctx.lineWidth = Math.max(1, rg.lineWidth * (1 - p));
        ctx.stroke();
        ctx.restore();
      }

      // Draw shards
      for (let i = shards.length - 1; i >= 0; i--) {
        const sh = shards[i];
        sh.age += dt;
        if (sh.age >= sh.life) {
          shards.splice(i, 1);
          continue;
        }
        sh.vy += 880 * dt;
        sh.vx *= 1 - Math.min(0.4, dt * 1.4);
        sh.x += sh.vx * dt;
        sh.y += sh.vy * dt;
        sh.angle += sh.va * dt;

        const p = sh.age / sh.life;
        const scale = Math.max(0.05, 1 - p * 0.72);
        ctx.save();
        ctx.globalAlpha = p > 0.65 ? Math.max(0, (1 - p) / 0.35) : 1;
        ctx.translate(sh.x, sh.y);
        ctx.rotate(sh.angle);
        ctx.scale(scale, scale);

        const pts: { x: number; y: number }[] = [];
        for (let k = 0; k < sh.sides; k++) {
          const a = (Math.PI * 2 * k) / sh.sides;
          pts.push({ x: Math.cos(a) * sh.size, y: Math.sin(a) * sh.size });
        }
        drawRoundedPolyPath(ctx, pts, sh.size * 0.32);
        ctx.lineWidth = 4.5;
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#FFFFFF';
        ctx.stroke();
        ctx.fillStyle = sh.color;
        ctx.fill();
        ctx.restore();
      }

      // Draw jelly droplets
      for (let i = droplets.length - 1; i >= 0; i--) {
        const dr = droplets[i];
        dr.age += dt;
        if (dr.age >= dr.life) {
          droplets.splice(i, 1);
          continue;
        }
        dr.vy += 680 * dt;
        const drag = Math.pow(0.92, dt * 60);
        dr.vx *= drag;
        dr.x += dr.vx * dt;
        dr.y += dr.vy * dt;

        const p = dr.age / dr.life;
        const rad = Math.max(0.8, dr.radius * (1 - p * 0.85));
        ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - p);
        ctx.beginPath();
        ctx.arc(dr.x, dr.y, rad, 0, Math.PI * 2);
        ctx.fillStyle = dr.color;
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.75)';
        ctx.beginPath();
        ctx.arc(dr.x - rad * 0.3, dr.y - rad * 0.3, rad * 0.28, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Draw sparkle stars
      for (let i = sparkles.length - 1; i >= 0; i--) {
        const sp = sparkles[i];
        sp.age += dt;
        if (sp.age >= sp.life) {
          sparkles.splice(i, 1);
          continue;
        }
        sp.vy += 420 * dt;
        sp.vx *= Math.pow(0.95, dt * 60);
        sp.x += sp.vx * dt;
        sp.y += sp.vy * dt;
        sp.angle += sp.va * dt;

        const p = sp.age / sp.life;
        ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - p);
        ctx.translate(sp.x, sp.y);
        ctx.rotate(sp.angle);
        if (sp.kind === 'star') {
          drawFourPointStar(ctx, 0, 0, sp.size * (1 - p * 0.4), sp.color);
        } else {
          ctx.fillStyle = sp.color;
          ctx.fillRect(-sp.size * 0.6, -sp.size * 0.3, sp.size * 1.2, sp.size * 0.6);
        }
        ctx.restore();
      }

      // Draw fruit ninja blade trail
      for (let i = bladeTrail.length - 1; i >= 0; i--) {
        bladeTrail[i].age += dt;
        if (bladeTrail[i].age > 0.19) {
          bladeTrail.splice(i, 1);
        }
      }
      if (bladeTrail.length > 1) {
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        for (let i = 1; i < bladeTrail.length; i++) {
          const p0 = bladeTrail[i - 1];
          const p1 = bladeTrail[i];
          const lifeRatio = Math.max(0, 1 - p1.age / 0.19);
          const taper = (i / bladeTrail.length) * lifeRatio;

          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.strokeStyle = `rgba(251, 191, 36, ${taper * 0.72})`;
          ctx.lineWidth = Math.max(2, taper * 15);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${taper * 0.96})`;
          ctx.lineWidth = Math.max(1, taper * 7);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Draw comic pop text
      for (let i = popTexts.length - 1; i >= 0; i--) {
        const pt = popTexts[i];
        pt.age += dt;
        if (pt.age >= pt.life) {
          popTexts.splice(i, 1);
          continue;
        }
        pt.y += pt.vy * dt;
        pt.vy *= Math.pow(0.93, dt * 60);

        const p = pt.age / pt.life;
        const scale =
          p < 0.18
            ? 0.3 + (p / 0.18) * 1.0
            : p < 0.34
            ? 1.3 - ((p - 0.18) / 0.16) * 0.25
            : 1.05;
        const alpha = p > 0.65 ? Math.max(0, (1 - p) / 0.35) : 1;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(pt.x, pt.y);
        ctx.scale(scale, scale);
        ctx.font = `700 ${pt.isCombo ? 34 : 28}px "Fredoka", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.lineWidth = 7;
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#FFFFFF';
        ctx.strokeText(pt.text, 0, 0);
        ctx.fillStyle = pt.color;
        ctx.fillText(pt.text, 0, 0);
        ctx.restore();
      }

      // Draw high-visibility Fruit Ninja interactive slicing reticle at cursor position
      if (isMouseInside && mouseX > 0 && mouseY > 0 && !isTouchDevice) {
        ctx.save();
        ctx.translate(mouseX, mouseY);

        const pulse = Math.sin(elapsedSec * 6) * 1.5;
        const baseR = isPointerDown ? 20 : 15;
        const curR = baseR + pulse;

        // 1. Soft Ambient Luminous Halo (Visible over both light cream and dark elements)
        const haloGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, curR + 14);
        if (isPointerDown) {
          haloGrad.addColorStop(0, 'rgba(255, 90, 38, 0.45)');
          haloGrad.addColorStop(0.5, 'rgba(251, 191, 36, 0.25)');
          haloGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
        } else {
          haloGrad.addColorStop(0, 'rgba(251, 191, 36, 0.35)');
          haloGrad.addColorStop(0.6, 'rgba(236, 90, 41, 0.15)');
          haloGrad.addColorStop(1, 'rgba(236, 90, 41, 0)');
        }
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(0, 0, curR + 14, 0, Math.PI * 2);
        ctx.fill();

        // 2. High-Contrast Outer Reticle Ring (White Halo + Dark Ink Outline)
        ctx.beginPath();
        ctx.arc(0, 0, curR, 0, Math.PI * 2);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 4.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, curR, 0, Math.PI * 2);
        ctx.strokeStyle = isPointerDown ? '#FF5A26' : '#F59E0B';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, curR - 1.5, 0, Math.PI * 2);
        ctx.strokeStyle = '#1E1E24';
        ctx.lineWidth = 1;
        ctx.stroke();

        // 3. Slicing Crosshair Ticks with White Backing
        const rot = elapsedSec * (isPointerDown ? 3.5 : 1.2);
        for (let k = 0; k < 4; k++) {
          const angle = rot + (k * Math.PI) / 2;
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);
          const rInner = curR - 5;
          const rOuter = curR + 7;

          ctx.beginPath();
          ctx.moveTo(cos * rInner, sin * rInner);
          ctx.lineTo(cos * rOuter, sin * rOuter);
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 4;
          ctx.lineCap = 'round';
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(cos * rInner, sin * rInner);
          ctx.lineTo(cos * rOuter, sin * rOuter);
          ctx.strokeStyle = isPointerDown ? '#FF5A26' : '#1E1E24';
          ctx.lineWidth = 2;
          ctx.lineCap = 'round';
          ctx.stroke();
        }

        // 4. Center Glowing Pip
        ctx.beginPath();
        ctx.arc(0, 0, isPointerDown ? 4.5 : 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.strokeStyle = '#1E1E24';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // 5. Mini Orbiting Sparkle Star
        const orbitR = curR + 10;
        const starAngle = -elapsedSec * 4;
        const sx = Math.cos(starAngle) * orbitR;
        const sy = Math.sin(starAngle) * orbitR;
        drawFourPointStar(ctx, sx, sy, isPointerDown ? 6 : 4.5, isPointerDown ? '#FF5A26' : '#F59E0B');

        ctx.restore();
      }

      ctx.restore();
      rafId = requestAnimationFrame(frame);
    };

    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      window.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      style={{ touchAction: 'none' }}
      className="fixed inset-0 z-10 cursor-ninja select-none"
    />
  );
};

// ============================================================================
// 6. INLINE SVG MASCOT STICKER
// ============================================================================
const StaticMascotSticker: React.FC<{
  shape: MascotShape;
  color: string;
  size?: number;
  stickerOutline?: boolean;
}> = ({ shape, color, size = 96, stickerOutline = false }) => {
  const renderShape = (isOutline = false) => {
    const props = isOutline
      ? {
          fill: '#FFFFFF',
          stroke: '#FFFFFF',
          strokeWidth: 16,
          strokeLinejoin: 'round' as const,
          strokeLinecap: 'round' as const,
        }
      : { fill: color };

    switch (shape) {
      case 'clover':
        return (
          <path
            d="M44,23 C56,15 70,21 72,33 C87,31 99,43 93,58 C101,71 91,89 76,87 C70,99 52,103 44,91 C27,93 17,77 25,64 C15,52 25,33 40,35 Z"
            {...props}
          />
        );
      case 'circle':
        return <circle cx="60" cy="60" r="42" {...props} />;
      case 'hexagon':
        return (
          <path
            d="M54,16 C58,13 62,13 66,16 L97,34 C101,37 103,41 103,45 L103,75 C103,79 101,83 97,86 L66,104 C62,107 58,107 54,104 L23,86 C19,83 17,79 17,75 L17,45 C17,41 19,37 23,34 Z"
            {...props}
          />
        );
      case 'triangle':
        return (
          <path
            d="M52,20 C56,12 64,12 68,20 L103,85 C107,93 101,102 91,102 L29,102 C19,102 13,93 17,85 Z"
            {...props}
          />
        );
      case 'roundedSquare':
      default:
        return <rect x="20" y="22" width="80" height="76" rx="28" transform="rotate(-6 60 60)" {...props} />;
    }
  };

  const eyeY = shape === 'triangle' ? 67 : 59;

  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className="block overflow-visible select-none">
      {stickerOutline && renderShape(true)}
      {renderShape(false)}
      <g fill="#FFFFFF">
        <rect x="43" y={eyeY - 12} width="10" height="24" rx="5" />
        <rect x="67" y={eyeY - 12} width="10" height="24" rx="5" />
      </g>
    </svg>
  );
};

// ============================================================================
// 7. 2-PHASE LOTTIE CONCENTRIC STACKED-CIRCLE TRANSITION
// ============================================================================
const LottieCircleTransition: React.FC<{
  active: boolean;
  label: string;
  onMidpointSwap: () => void;
  onComplete: () => void;
}> = ({ active, label, onMidpointSwap, onComplete }) => {
  const swappedRef = useRef(false);

  useEffect(() => {
    if (!active) {
      swappedRef.current = false;
      return;
    }

    audio.playTransitionWhoosh();

    const midTimer = window.setTimeout(() => {
      if (!swappedRef.current) {
        swappedRef.current = true;
        onMidpointSwap();
      }
    }, 950);

    const doneTimer = window.setTimeout(() => {
      onComplete();
    }, 2400);

    return () => {
      clearTimeout(midTimer);
      clearTimeout(doneTimer);
    };
  }, [active, onMidpointSwap, onComplete]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="lottie-stacked-circles"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[120] pointer-events-auto flex items-center justify-center overflow-hidden"
        >
          {TRANSITION_CIRCLE_COLORS.map((hex, i) => (
            <motion.div
              key={hex}
              initial={{ scale: 0 }}
              animate={{ scale: [0, 2.95, 2.95, 0] }}
              transition={{
                duration: 2.35,
                delay: i * 0.08,
                times: [0, 0.45, 0.82, 1],
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                backgroundColor: hex,
                width: '85vmax',
                height: '85vmax',
                zIndex: i + 1,
              }}
              className="absolute rounded-full shadow-[0_0_50px_rgba(0,0,0,0.22)]"
            />
          ))}

          <motion.div
            initial={{ scale: 0.55, opacity: 0 }}
            animate={{ scale: [0.55, 1.04, 1, 0.7], opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 1.85,
              delay: 0.35,
              times: [0, 0.3, 0.82, 1],
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative z-20 flex flex-col items-center gap-2.5"
          >
            <StaticMascotSticker shape="roundedSquare" color="#FBBF24" size={76} stickerOutline />
            <span className="px-6 py-2 rounded-full bg-[#FAF7F2] text-[#1E1E24] font-display text-xl sm:text-2xl font-bold shadow-2xl">
              {label}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// 8. LOTTIE JSON EXPORT MODAL
// ============================================================================
const LottieExportModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onNotify: (msg: string) => void;
}> = ({ open, onClose, onNotify }) => {
  const [selectedFile, setSelectedFile] = useState<'circle-transition' | 'mascot-explode'>('circle-transition');
  const [copied, setCopied] = useState(false);
  const [previewKey, setPreviewKey] = useState(1);

  const circleJson = useMemo(() => generateCircleTransitionLottieJSON(), []);
  const explodeJson = useMemo(() => generateMascotExplodeLottieJSON(), []);

  const currentJson = selectedFile === 'circle-transition' ? circleJson : explodeJson;
  const filename =
    selectedFile === 'circle-transition' ? 'circle-transition.json' : 'mascot-explode-burst.json';
  const formatted = useMemo(() => JSON.stringify(currentJson, null, 2), [currentJson]);
  const kbSize = useMemo(() => (new Blob([formatted]).size / 1024).toFixed(2), [formatted]);

  const handleCopy = () => {
    navigator.clipboard?.writeText(formatted).catch(() => {});
    setCopied(true);
    audio.playUiTap(720);
    onNotify(`${filename} berhasil disalin ke clipboard!`);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDownload = () => {
    const blob = new Blob([formatted], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    audio.playUiTap(780);
    onNotify(`Berhasil mengunduh ${filename}!`);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] bg-[#1E1E24]/65 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.92, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 16 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-[#FAF7F2] rounded-[32px] border-[3px] border-[#1E1E24] shadow-2xl overflow-hidden flex flex-col max-h-[88vh]"
          >
            {/* Header */}
            <div className="bg-[#1E1E24] text-[#FAF7F2] px-6 py-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#4AE3B5]">
                  BODYMOVIN v5.7.4 • 60 FPS • LOTTIE-REACT READY
                </span>
                <h3 className="font-display text-xl font-bold">Export Lottie JSON</h3>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* File Switcher + Live Visual Preview */}
            <div className="p-5 border-b border-[#1E1E24]/10 bg-white space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex p-1 rounded-2xl bg-[#F2ECE1]">
                  <button
                    onClick={() => {
                      audio.playUiTap();
                      setSelectedFile('circle-transition');
                      setPreviewKey((k) => k + 1);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-display font-bold cursor-pointer transition ${
                      selectedFile === 'circle-transition'
                        ? 'bg-[#1E1E24] text-[#FBBF24]'
                        : 'text-[#64616C] hover:text-[#1E1E24]'
                    }`}
                  >
                    circle-transition.json
                  </button>
                  <button
                    onClick={() => {
                      audio.playUiTap();
                      setSelectedFile('mascot-explode');
                      setPreviewKey((k) => k + 1);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-display font-bold cursor-pointer transition ${
                      selectedFile === 'mascot-explode'
                        ? 'bg-[#1E1E24] text-[#FBBF24]'
                        : 'text-[#64616C] hover:text-[#1E1E24]'
                    }`}
                  >
                    mascot-explode-burst.json
                  </button>
                </div>

                <button
                  onClick={() => {
                    if (selectedFile === 'mascot-explode') audio.playExplosion(3);
                    else audio.playTransitionWhoosh();
                    setPreviewKey((k) => k + 1);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#FAF7F2] border-2 border-[#1E1E24]/15 hover:border-[#1E1E24] text-xs font-display font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Replay Preview</span>
                </button>
              </div>

              {/* Mini Preview Box */}
              <div
                key={`${selectedFile}-${previewKey}`}
                className="relative h-40 rounded-2xl bg-[#FAF7F2] border-2 border-[#1E1E24]/12 overflow-hidden flex items-center justify-center"
              >
                {selectedFile === 'circle-transition' ? (
                  <>
                    {TRANSITION_CIRCLE_COLORS.map((hex, i) => (
                      <motion.div
                        key={hex}
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.55, 1.55, 0] }}
                        transition={{
                          duration: 1.25,
                          delay: i * 0.045,
                          times: [0, 0.42, 0.56, 1],
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        style={{ backgroundColor: hex, width: 250, height: 250 }}
                        className="absolute rounded-full"
                      />
                    ))}
                    <span className="relative z-10 px-3.5 py-1 rounded-full bg-[#FAF7F2] text-[#1E1E24] font-display text-xs font-bold shadow-md">
                      6-Layer Concentric Transition
                    </span>
                  </>
                ) : (
                  <>
                    <motion.div
                      initial={{ scale: 0.2, opacity: 1 }}
                      animate={{ scale: 2.3, opacity: 0 }}
                      transition={{ duration: 0.42, ease: 'easeOut' }}
                      className="absolute w-16 h-16 rounded-full border-4 border-[#EC5A29]"
                    />
                    <motion.div
                      initial={{ scale: 0.15, opacity: 1 }}
                      animate={{ scale: 1.75, opacity: 0 }}
                      transition={{ duration: 0.32, delay: 0.04, ease: 'easeOut' }}
                      className="absolute w-14 h-14 rounded-full border-[3px] border-white"
                    />
                    {Array.from({ length: 8 }).map((_, i) => {
                      const angle = (i * Math.PI * 2) / 8;
                      return (
                        <motion.div
                          key={i}
                          initial={{ x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 }}
                          animate={{
                            x: Math.cos(angle) * 68,
                            y: Math.sin(angle) * 68 + 14,
                            scale: 0,
                            rotate: 160,
                            opacity: 0,
                          }}
                          transition={{ duration: 0.55, ease: 'easeOut' }}
                          style={{ backgroundColor: TRANSITION_CIRCLE_COLORS[i % 5] }}
                          className="absolute w-4 h-4 rounded-md border-2 border-white shadow-xs"
                        />
                      );
                    })}
                    <motion.span
                      initial={{ scale: 0.3, opacity: 0, y: 6 }}
                      animate={{ scale: [0.3, 1.3, 1], opacity: [0, 1, 0], y: -22 }}
                      transition={{ duration: 0.65 }}
                      className="relative z-10 font-display text-2xl font-bold text-[#EC5A29]"
                    >
                      BOOM!
                    </motion.span>
                  </>
                )}
              </div>

              {/* Copy / Download Actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-[#64616C]">
                <span>
                  {filename} • {kbSize} KB
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 rounded-xl bg-[#158467] text-white font-display font-bold text-xs shadow-[0_4px_0_#0D5945] active:translate-y-[3px] transition inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Tersalin!' : 'Copy JSON'}</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 rounded-xl bg-[#2568EF] text-white font-display font-bold text-xs shadow-[0_4px_0_#1644A8] active:translate-y-[3px] transition inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .json</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Formatted JSON Preview */}
            <pre className="p-4 bg-[#18181D] text-[#A7F3D0] text-[11px] font-mono overflow-auto flex-1 leading-relaxed">
              {formatted}
            </pre>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// 9. ONBOARDING PAGE COMPONENT
// ============================================================================
export default function Onboarding() {
  const navigate = useNavigate();
  const { roomCreated, roomName, players } = useGameStore();

  const [siteTitle, setSiteTitle] = useState('Party Games Hub!');
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  // Transition State
  const [transitionOpen, setTransitionOpen] = useState(false);
  const [transitionLabel, setTransitionLabel] = useState("MASUK ROOM...");
  const pendingSwapRef = useRef<() => void>(() => {});

  // HUD state
  const [explodeCount, setExplodeCount] = useState(0);
  const [combo, setCombo] = useState(0);
  const [counterBumpKey, setCounterBumpKey] = useState(0);

  // Audio & Modals
  const [muted, setMuted] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const toggleMute = () => {
    audio.muted = !muted;
    setMuted(audio.muted);
    if (!audio.muted) audio.playUiTap(640);
  };

  const handleCanvasExplode = useCallback((total: number, curCombo: number) => {
    setExplodeCount((prev) => {
      if (total !== prev) setCounterBumpKey((k) => k + 1);
      return total;
    });
    setCombo(curCombo);
  }, []);

  const runTransition = useCallback(
    (label: string, swapFn: () => void) => {
      if (transitionOpen) return;
      pendingSwapRef.current = swapFn;
      setTransitionLabel(label);
      setTransitionOpen(true);
    },
    [transitionOpen]
  );

  const handleMidpointSwap = useCallback(() => {
    pendingSwapRef.current();
  }, []);

  const handleTransitionComplete = useCallback(() => {
    setTransitionOpen(false);
  }, []);

  // START Button -> Navigates to Room Setup & Player Registration
  const handleStart = useCallback(() => {
    runTransition("MASUK ROOM...", () => {
      navigate('/room');
    });
  }, [runTransition, navigate]);

  // Direct shortcut to existing active room if already created
  const handleJumpToActiveRoom = useCallback(() => {
    runTransition(roomName || "PILIH GAME", () => {
      navigate('/hub');
    });
  }, [runTransition, roomName, navigate]);

  // Keyboard Enter / Space launches START
  useEffect(() => {
    if (isEditingTitle || transitionOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'BUTTON') return;
        e.preventDefault();
        handleStart();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isEditingTitle, transitionOpen, handleStart]);

  return (
    <div className="relative w-screen h-screen bg-[#FAF7F2] text-[#1E1E24] font-sans selection:bg-[#FBBF24] overflow-hidden select-none dot-bg">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
        .font-display { font-family: 'Fredoka', sans-serif; letter-spacing: -0.015em; }
        .font-sans { font-family: 'Plus Jakarta Sans', sans-serif; }
        .dot-bg {
          background-image: radial-gradient(rgba(30, 30, 36, 0.075) 1.5px, transparent 1.5px);
          background-size: 26px 26px;
        }
      `}</style>

      {/* 2-Phase Concentric Stacked-Circle Transition */}
      <LottieCircleTransition
        active={transitionOpen}
        label={transitionLabel}
        onMidpointSwap={handleMidpointSwap}
        onComplete={handleTransitionComplete}
      />

      {/* Lottie JSON Export Modal */}
      <LottieExportModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        onNotify={showToast}
      />

      {/* Confirmation Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.94 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[140] px-5 py-2.5 rounded-full bg-[#1E1E24] text-[#FAF7F2] font-bold text-xs sm:text-sm shadow-xl flex items-center gap-2 border border-white/15"
          >
            <CheckCircle2 className="w-4 h-4 text-[#4AE3B5] shrink-0" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Retina Canvas Physics & Multi-Layer Explosion Engine */}
      <FruitNinjaMascotCanvas active={true} onExplode={handleCanvasExplode} />

      {/* Top Bar HUD */}
      <div
        data-ui-interactive="true"
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-30 flex items-center gap-2 pointer-events-auto"
      >
        {/* Dynamic Combo Badge */}
        <AnimatePresence>
          {combo >= 2 && (
            <motion.div
              key={`combo-${combo}`}
              initial={{ scale: 0.5, opacity: 0, x: 10 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 420, damping: 20 }}
              className="px-3.5 py-1.5 rounded-full bg-[#EC5A29] text-white font-display font-bold text-xs sm:text-sm shadow-[0_4px_0_#AD3912] flex items-center gap-1"
            >
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>x{combo} COMBO!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bouncy Explosion Counter Pill */}
        <motion.div
          key={counterBumpKey}
          animate={{ scale: explodeCount > 0 ? [1.24, 0.94, 1] : 1 }}
          transition={{ duration: 0.24 }}
          title="Mascot yang berhasil diledakkan"
          className="px-3.5 py-2 rounded-full bg-white/95 backdrop-blur-xs border-2 border-[#1E1E24]/12 shadow-[0_4px_0_rgba(30,30,36,0.08)] font-display font-bold text-sm text-[#1E1E24] flex items-center gap-1.5"
        >
          <span className="text-base leading-none">💥</span>
          <span className="tabular-nums">{explodeCount}</span>
        </motion.div>

        {/* Sound Mute / Unmute Button */}
        <button
          onClick={toggleMute}
          aria-label={muted ? 'Nyalakan suara' : 'Matikan suara'}
          className="w-10 h-10 rounded-full bg-[#1E1E24] text-[#FAF7F2] flex items-center justify-center shadow-[0_4px_0_#0B0B0E] active:translate-y-[3px] transition cursor-pointer hover:bg-[#2C2C35]"
        >
          {muted ? (
            <VolumeX className="w-4 h-4 text-[#F43F5E]" />
          ) : (
            <Volume2 className="w-4 h-4 text-[#4AE3B5]" />
          )}
        </button>
      </div>

      {/* Centered Title & START Button */}
      <main className="relative z-20 w-full h-full flex flex-col items-center justify-center px-6 text-center pointer-events-none">
        {/* Title */}
        <div className="group relative inline-flex items-center justify-center mb-6">
          {isEditingTitle ? (
            <input
              data-ui-interactive="true"
              autoFocus
              value={siteTitle}
              onChange={(e) => setSiteTitle(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === 'Escape') setIsEditingTitle(false);
              }}
              maxLength={30}
              className="pointer-events-auto font-display text-4xl sm:text-6xl md:text-7xl font-bold text-center text-[#1E1E24] bg-white/95 rounded-[24px] px-5 py-2 border-[3px] border-[#1E1E24] outline-none shadow-xl max-w-[92vw]"
            />
          ) : (
            <motion.h1
              data-ui-interactive="true"
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              onDoubleClick={() => {
                audio.playUiTap();
                setIsEditingTitle(true);
              }}
              title="Klik dua kali untuk mengganti judul"
              style={{ textShadow: '0 4px 0 rgba(250, 247, 242, 0.96)' }}
              className="pointer-events-auto font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#1E1E24] leading-none cursor-text"
            >
              {siteTitle || 'Party Games Hub!'}
            </motion.h1>
          )}

          {!isEditingTitle && (
            <button
              data-ui-interactive="true"
              onClick={() => {
                audio.playUiTap();
                setIsEditingTitle(true);
              }}
              aria-label="Edit judul website"
              className="pointer-events-auto opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity ml-2.5 w-8 h-8 rounded-full bg-white/95 border border-[#1E1E24]/15 text-[#64616C] hover:text-[#1E1E24] flex items-center justify-center cursor-pointer shadow-xs"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 3D Tactile START Button */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 280, damping: 18 }}
          className="flex flex-col items-center gap-3.5"
        >
          <button
            data-ui-interactive="true"
            onClick={handleStart}
            className="pointer-events-auto group inline-flex items-center justify-center gap-3.5 px-10 sm:px-12 py-4 sm:py-5 rounded-[28px] bg-[#1E1E24] text-[#FAF7F2] font-display font-bold text-xl sm:text-2xl shadow-[0_6px_0_#0B0B0E,0_16px_32px_rgba(30,30,36,0.2)] hover:bg-[#2B2B34] hover:scale-[1.03] active:translate-y-[4px] transition-all cursor-pointer"
          >
            <span className="w-8 h-8 rounded-full bg-[#FBBF24] text-[#1E1E24] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </span>
            <span className="tracking-wide">START GAME</span>
            <ArrowRight className="w-6 h-6 text-[#4AE3B5] group-hover:translate-x-1 transition-transform" />
          </button>

          {/* If room already has players & created, provide shortcut directly to game hub */}
          {roomCreated && players.length >= 2 && (
            <motion.button
              data-ui-interactive="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleJumpToActiveRoom}
              className="pointer-events-auto px-4 py-2 rounded-full bg-white/95 border border-[#1E1E24]/15 shadow-xs text-xs font-display font-bold text-[#1E1E24] hover:bg-[#FAF7F2] active:translate-y-[1px] transition inline-flex items-center gap-1.5 cursor-pointer"
            >
              <DoorOpen className="w-3.5 h-3.5 text-[#158467]" />
              <span>Lanjut ke Room Aktif: <strong>{roomName}</strong> ({players.length} Pemain) →</span>
            </motion.button>
          )}
        </motion.div>

        {/* Small hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-5 text-xs sm:text-sm font-semibold text-[#64616C] bg-[#FAF7F2]/75 px-3.5 py-1 rounded-full"
        >
          Klik atau swipe mascot untuk meledakkan! Lalu klik <strong>START GAME</strong> untuk atur room & daftar pemain.
        </motion.p>
      </main>
    </div>
  );
}
