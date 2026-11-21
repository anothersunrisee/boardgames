/**
 * Daftar kode room 4-huruf yang mudah dibaca, diucapkan, dan diketik di HP.
 */
const FUN_ROOM_CODES = [
  'ASIK', 'SERU', 'KOST', 'NONG', 'MAIN', 'TAWA', 'RAME', 'HITS',
  'JOSS', 'MANT', 'KITA', 'GAUL', 'KOCQ', 'KECE', 'PEST', 'RUAR',
  'SERA', 'HALO', 'BOYS', 'GIRL', 'WARP', 'JUAR', 'BROS', 'SIST',
  'CAFE', 'WARG', 'TEAM', 'PLAY', 'NOOB', 'PROS', 'DUOS', 'SQUAD'
];

export function generateRoomCode(): string {
  // 60% chance to pick a fun word, 40% random letters
  if (Math.random() < 0.6) {
    const picked = FUN_ROOM_CODES[Math.floor(Math.random() * FUN_ROOM_CODES.length)];
    return picked;
  }
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function formatRoomCode(code: string): string {
  return code.toUpperCase().trim().slice(0, 4);
}
