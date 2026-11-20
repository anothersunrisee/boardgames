import type { CharacterDef, CharacterStyle, CharacterMood } from './types';

// ============================================================================
// BODYMOVIN / LOTTIE v5.7+ JSON GENERATORS (MOTION DESIGN SKILL)
// 60fps timing, cubic-bezier easing, blink scale, and smooth floating physics
// ============================================================================

export function hexToLottieRgba(hex: string): [number, number, number, number] {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  return [Number(r.toFixed(3)), Number(g.toFixed(3)), Number(b.toFixed(3)), 1];
}

export function generateCharacterLottieJSON(char: CharacterDef, style: CharacterStyle, mood: CharacterMood) {
  const mainRgba = hexToLottieRgba(char.color);
  const eyeRgba: [number, number, number, number] =
    style === 'profile' ? [0.07, 0.07, 0.09, 1] : [1, 1, 1, 1];
  const floatAmp = mood === 'winner' || mood === 'happy' ? 14 : mood === 'shocked' ? 6 : 8;
  const durationFrames = 120; // 2 seconds loop at 60fps

  const layers: Record<string, unknown>[] = [];

  // Optional Portrait Circle Background for Style A (Profile Avatar)
  if (style === 'profile') {
    layers.push({
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'Portrait_Circle_Mask_BG',
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [120, 120, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      shapes: [
        {
          ty: 'el',
          p: { a: 0, k: [0, 0] },
          s: { a: 0, k: [216, 216] },
          nm: 'PortraitCircle',
        },
        {
          ty: 'fl',
          c: { a: 0, k: [0.071, 0.071, 0.086, 1] },
          o: { a: 0, k: 100 },
          nm: 'VoidFill',
        },
      ],
      ip: 0,
      op: durationFrames,
      st: 0,
    });
  }

  // Main Character Body Layer with smooth cubic-bezier floating & squash-stretch
  layers.push({
    ddd: 0,
    ind: 2,
    ty: 4,
    nm: `${char.name}_${style}_Body`,
    sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: {
        a: 1,
        k: [
          { t: 0, s: [-2], e: [2.5], o: { x: [0.42], y: [0] }, i: { x: [0.58], y: [1] } },
          { t: 60, s: [2.5], e: [-2], o: { x: [0.42], y: [0] }, i: { x: [0.58], y: [1] } },
          { t: 120, s: [-2] },
        ],
      },
      p: {
        a: 1,
        k: [
          { t: 0, s: [120, 124, 0], e: [120, 124 - floatAmp, 0], o: { x: 0.42, y: 0 }, i: { x: 0.58, y: 1 } },
          { t: 60, s: [120, 124 - floatAmp, 0], e: [120, 124, 0], o: { x: 0.42, y: 0 }, i: { x: 0.58, y: 1 } },
          { t: 120, s: [120, 124, 0] },
        ],
      },
      a: { a: 0, k: [0, 0, 0] },
      s: {
        a: 1,
        k: [
          { t: 0, s: [102, 98, 100], e: [98, 103, 100], o: { x: [0.4], y: [0] }, i: { x: [0.6], y: [1] } },
          { t: 60, s: [98, 103, 100], e: [102, 98, 100], o: { x: [0.4], y: [0] }, i: { x: [0.6], y: [1] } },
          { t: 120, s: [102, 98, 100] },
        ],
      },
    },
    shapes: [
      {
        ty: 'rc',
        p: { a: 0, k: [0, 0] },
        s: { a: 0, k: [142, 134] },
        r: { a: 0, k: style === 'mascot' ? 56 : 44 },
        nm: `Shape_${style === 'mascot' ? char.mascotShape : char.profileShape}`,
      },
      {
        ty: 'fl',
        c: { a: 0, k: mainRgba },
        o: { a: 0, k: 100 },
        nm: 'BodyFill',
      },
    ],
    ip: 0,
    op: durationFrames,
    st: 0,
  });

  // Left & Right Eyes with realistic 60fps smooth blink & subtle glance
  [-22, 22].forEach((offsetX, idx) => {
    layers.push({
      ddd: 0,
      ind: 3 + idx,
      ty: 4,
      nm: idx === 0 ? 'Eye_Left_Blink' : 'Eye_Right_Blink',
      parent: 2,
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: mood === 'thinking' ? -6 : 0 },
        p: {
          a: 1,
          k: [
            { t: 0, s: [offsetX, -4, 0], e: [offsetX + 4, -6, 0], o: { x: 0.4, y: 0 }, i: { x: 0.6, y: 1 } },
            { t: 45, s: [offsetX + 4, -6, 0], e: [offsetX, -4, 0], o: { x: 0.4, y: 0 }, i: { x: 0.6, y: 1 } },
            { t: 120, s: [offsetX, -4, 0] },
          ],
        },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [100, 100, 100], e: [100, 100, 100] },
            { t: 74, s: [100, 100, 100], e: [108, 10, 100], o: { x: [0.4], y: [0] }, i: { x: [0.6], y: [1] } },
            { t: 79, s: [108, 10, 100], e: [100, 100, 100], o: { x: [0.2], y: [0] }, i: { x: [0.8], y: [1] } },
            { t: 85, s: [100, 100, 100] },
          ],
        },
      },
      shapes: [
        {
          ty: 'rc',
          p: { a: 0, k: [0, 0] },
          s: { a: 0, k: style === 'mascot' ? [14, 34] : [12, 12] },
          r: { a: 0, k: 12 },
          nm: 'EyePill',
        },
        {
          ty: 'fl',
          c: { a: 0, k: eyeRgba },
          o: { a: 0, k: 100 },
          nm: 'EyeFill',
        },
      ],
      ip: 0,
      op: durationFrames,
      st: 0,
    });
  });

  return {
    v: '5.7.14',
    fr: 60,
    ip: 0,
    op: durationFrames,
    w: 240,
    h: 240,
    nm: `PartyHub_${char.name}_${style}_${mood}`,
    ddd: 0,
    assets: [],
    layers,
  };
}

export function generateRoomTransitionLottieJSON(title = 'SAME BRAIN? NO!') {
  const ringColors = ['#1E1E24', '#158467', '#C82373', '#2568EF', '#FBBF24', '#FAF7F2'];
  return {
    v: '5.7.14',
    fr: 60,
    ip: 0,
    op: 110,
    w: 1080,
    h: 1080,
    nm: `RoomStart_ConcentricCircles_${title.replace(/\s+/g, '_')}`,
    ddd: 0,
    assets: [],
    layers: ringColors.map((hex, i) => ({
      ddd: 0,
      ind: i + 1,
      ty: 4,
      nm: `Concentric_Ring_${i + 1}`,
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [540, 540, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: i * 5, s: [0, 0, 100], e: [145, 145, 100], o: { x: [0.16], y: [1] }, i: { x: [0.3], y: [1] } },
            { t: i * 5 + 34, s: [145, 145, 100] },
            { t: 82 + i * 3, s: [145, 145, 100], e: [0, 0, 100], o: { x: [0.7], y: [0] }, i: { x: [0.84], y: [0] } },
            { t: 106, s: [0, 0, 100] },
          ],
        },
      },
      shapes: [
        { ty: 'el', p: { a: 0, k: [0, 0] }, s: { a: 0, k: [1100, 1100] }, nm: 'Circle' },
        { ty: 'fl', c: { a: 0, k: hexToLottieRgba(hex) }, o: { a: 0, k: 100 }, nm: 'Fill' },
      ],
      ip: 0,
      op: 110,
      st: 0,
    })),
  };
}

export function generateSceneLottieJSON(scene: 'winner' | 'game_end' | 'podium' | 'punishment_shuffle') {
  const paletteMap: Record<typeof scene, { nm: string; colors: string[]; frames: number }> = {
    winner: { nm: 'Winner_Trophy_Confetti_Burst', colors: ['#FBBF24', '#EC5A29', '#4AE3B5', '#C82373'], frames: 120 },
    game_end: { nm: 'Game_End_Curtain_Ribbon', colors: ['#1E1E24', '#2568EF', '#FBBF24'], frames: 96 },
    podium: { nm: 'Leaderboard_Podium_123_Reveal', colors: ['#FBBF24', '#FAF7F2', '#EC5A29', '#4AE3B5'], frames: 150 },
    punishment_shuffle: { nm: 'Punishment_Card_Shuffle_Flip', colors: ['#EC5A29', '#C82373', '#1E1E24', '#FBBF24'], frames: 110 },
  };
  const cfg = paletteMap[scene];

  return {
    v: '5.7.14',
    fr: 60,
    ip: 0,
    op: cfg.frames,
    w: 600,
    h: 600,
    nm: cfg.nm,
    ddd: 0,
    assets: [],
    layers: cfg.colors.map((hex, i) => ({
      ddd: 0,
      ind: i + 1,
      ty: 4,
      nm: `${cfg.nm}_Element_${i + 1}`,
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { t: i * 6, s: [0], e: [100] },
            { t: i * 6 + 14, s: [100] },
          ],
        },
        r: {
          a: 1,
          k: [
            { t: i * 6, s: [-18 + i * 12], e: [0], o: { x: [0.2], y: [1] }, i: { x: [0.3], y: [1] } },
            { t: i * 6 + 32, s: [0] },
          ],
        },
        p: {
          a: 1,
          k: [
            { t: i * 6, s: [300, 420, 0], e: [300 + (i - 1.5) * 85, 280 - i * 18, 0], o: { x: 0.22, y: 1 }, i: { x: 0.36, y: 1 } },
            { t: i * 6 + 36, s: [300 + (i - 1.5) * 85, 280 - i * 18, 0] },
          ],
        },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: i * 6, s: [20, 20, 100], e: [108, 94, 100], o: { x: [0.2], y: [1] }, i: { x: [0.3], y: [1] } },
            { t: i * 6 + 22, s: [108, 94, 100], e: [100, 100, 100] },
            { t: i * 6 + 34, s: [100, 100, 100] },
          ],
        },
      },
      shapes: [
        { ty: 'rc', p: { a: 0, k: [0, 0] }, s: { a: 0, k: [120, 160] }, r: { a: 0, k: 24 }, nm: 'CardOrBadge' },
        { ty: 'fl', c: { a: 0, k: hexToLottieRgba(hex) }, o: { a: 0, k: 100 }, nm: 'Fill' },
      ],
      ip: 0,
      op: cfg.frames,
      st: 0,
    })),
  };
}
