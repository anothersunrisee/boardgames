import type { CharacterDef } from './types';

// ============================================================================
// DESIGN TOKENS
// ============================================================================
export const DESIGN_TOKENS = {
  colors: [
    { name: 'Warm Cream', token: '--bg-cream', hex: '#FAF7F2', role: 'Canvas Utama', darkText: true },
    { name: 'Soft Sand', token: '--bg-sand', hex: '#F2ECE1', role: 'Input & Surface', darkText: true },
    { name: 'Deep Ink', token: '--ink-primary', hex: '#1E1E24', role: 'Teks & Border', darkText: false },
    { name: 'Portrait Void', token: '--avatar-frame', hex: '#121216', role: 'Frame Avatar Profil', darkText: false },
    { name: 'Emerald Pop', token: '--accent-emerald', hex: '#158467', role: 'Mind Sync / Sukses', darkText: false },
    { name: 'Berry Pink', token: '--accent-berry', hex: '#C82373', role: 'Beauty / Highlight', darkText: false },
    { name: 'Cobalt Blue', token: '--accent-cobalt', hex: '#2568EF', role: 'Boys Trivia / Info', darkText: false },
    { name: 'Tangerine', token: '--accent-tangerine', hex: '#EC5A29', role: 'Debat / Chaos', darkText: false },
    { name: 'Warm Ochre', token: '--accent-ochre', hex: '#8C6D46', role: 'GeoZoom / Klasik', darkText: false },
    { name: 'Sunny Gold', token: '--accent-sunny', hex: '#FBBF24', role: 'Juara / Podium #1', darkText: true },
    { name: 'Mint Glow', token: '--accent-mint', hex: '#4AE3B5', role: 'Mascot Highlight', darkText: true },
    { name: 'Coral Alert', token: '--accent-danger', hex: '#F04438', role: 'Minus Poin / Hukuman', darkText: false },
  ],
};

// ============================================================================
// 20 UNIQUE CHARACTER PACK (DUAL STYLE: PROFILE vs MASCOT)
// ============================================================================
export const CHARACTER_PACK: CharacterDef[] = [
  { id: 'c01', index: 1, name: 'Mochi', tagline: 'Kalem tapi tajam', color: '#F9A8B8', secondaryColor: '#EC4899', profileShape: 'trapezoid', profileFaceVariant: 'flat', mascotShape: 'squircle', mascotSpark: 'rays' },
  { id: 'c02', index: 2, name: 'Kiko', tagline: 'Si strategis cepat', color: '#3EC473', secondaryColor: '#158467', profileShape: 'dome', profileFaceVariant: 'smug', mascotShape: 'cloud', mascotSpark: 'rays' },
  { id: 'c03', index: 3, name: 'Boba', tagline: 'Santai anti panik', color: '#FA9C42', secondaryColor: '#EA580C', profileShape: 'pentagon', profileFaceVariant: 'tilted', mascotShape: 'pebble', mascotSpark: 'rays' },
  { id: 'c04', index: 4, name: 'Lulu', tagline: 'Ceria penuh ide', color: '#6CCDFB', secondaryColor: '#2568EF', profileShape: 'worm', profileFaceVariant: 'cute', mascotShape: 'teardrop', mascotSpark: 'stars' },
  { id: 'c05', index: 5, name: 'Zuzu', tagline: 'Pemicu tawa', color: '#2F88FF', secondaryColor: '#1D4ED8', profileShape: 'starburst', profileFaceVariant: 'sleepy', mascotShape: 'cube', mascotSpark: 'bolt' },
  { id: 'c06', index: 6, name: 'Toma', tagline: 'Berani ambil risiko', color: '#F25A38', secondaryColor: '#C2410C', profileShape: 'clover', profileFaceVariant: 'smile', mascotShape: 'clover', mascotSpark: 'heart' },
  { id: 'c07', index: 7, name: 'Puff', tagline: 'Imut tapi licik', color: '#FBA5B5', secondaryColor: '#DB2777', profileShape: 'scallop', profileFaceVariant: 'cat', mascotShape: 'starpuff', mascotSpark: 'heart' },
  { id: 'c08', index: 8, name: 'Gogo', tagline: 'Kompetitif garis keras', color: '#FCC946', secondaryColor: '#D97706', profileShape: 'flask', profileFaceVariant: 'grumpy', mascotShape: 'hexagon', mascotSpark: 'stars' },
  { id: 'c09', index: 9, name: 'Vivi', tagline: 'Insting detektif', color: '#9D6BFF', secondaryColor: '#6D28D9', profileShape: 'arch', profileFaceVariant: 'wink', mascotShape: 'triangle', mascotSpark: 'heart' },
  { id: 'c10', index: 10, name: 'Nori', tagline: 'Raja plot twist', color: '#14B8A6', secondaryColor: '#0F766E', profileShape: 'crescent', profileFaceVariant: 'cheer', mascotShape: 'flamedrop', mascotSpark: 'stars' },
  { id: 'c11', index: 11, name: 'Dodo', tagline: 'Suka bingung sendiri', color: '#A36B43', secondaryColor: '#78350F', profileShape: 'hourglass', profileFaceVariant: 'flat', mascotShape: 'bean', mascotSpark: 'question' },
  { id: 'c12', index: 12, name: 'Riri', tagline: 'Ratu drama panggung', color: '#F43F7E', secondaryColor: '#BE185D', profileShape: 'diamond', profileFaceVariant: 'wink', mascotShape: 'diamondsoft', mascotSpark: 'rays' },
  { id: 'c13', index: 13, name: 'Milo', tagline: 'Pendengar misterius', color: '#38BDF8', secondaryColor: '#0284C7', profileShape: 'pill', profileFaceVariant: 'sleepy', mascotShape: 'capsule', mascotSpark: 'zzz' },
  { id: 'c14', index: 14, name: 'Sora', tagline: 'Cepat tanggap', color: '#22C55E', secondaryColor: '#15803D', profileShape: 'blob', profileFaceVariant: 'smile', mascotShape: 'dome', mascotSpark: 'dots' },
  { id: 'c15', index: 15, name: 'Bimi', tagline: 'Penuh kejutan chaos', color: '#FF6B2C', secondaryColor: '#C2410C', profileShape: 'twinpeak', profileFaceVariant: 'grumpy', mascotShape: 'twinbump', mascotSpark: 'anger' },
  { id: 'c16', index: 16, name: 'Kaya', tagline: 'Si paling rapi', color: '#A855F7', secondaryColor: '#7E22CE', profileShape: 'bowtie', profileFaceVariant: 'cheer', mascotShape: 'mushroom', mascotSpark: 'stars' },
  { id: 'c17', index: 17, name: 'Juno', tagline: 'Lahir untuk menang', color: '#FBBF24', secondaryColor: '#B45309', profileShape: 'crownhead', profileFaceVariant: 'smug', mascotShape: 'crownpuff', mascotSpark: 'rays' },
  { id: 'c18', index: 18, name: 'Tutu', tagline: 'Suka ngelamun lucu', color: '#60A5FA', secondaryColor: '#2563EB', profileShape: 'cloudcut', profileFaceVariant: 'cute', mascotShape: 'wavebot', mascotSpark: 'dots' },
  { id: 'c19', index: 19, name: 'Pika', tagline: 'Energi tak habis', color: '#EC4899', secondaryColor: '#9D174D', profileShape: 'teardrop', profileFaceVariant: 'cat', mascotShape: 'crescentbot', mascotSpark: 'bolt' },
  { id: 'c20', index: 20, name: 'Wawa', tagline: 'Penutup paling epic', color: '#10B981', secondaryColor: '#047857', profileShape: 'wave', profileFaceVariant: 'tilted', mascotShape: 'pillbot', mascotSpark: 'stars' },
];

export function getCharacterById(id: string): CharacterDef {
  return CHARACTER_PACK.find((c) => c.id === id) || CHARACTER_PACK[0];
}
