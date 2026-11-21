import type { Player } from '../store/useGameStore';

export type SuperlativeAward = {
  playerId: string;
  playerName: string;
  avatarId?: string;
  title: string;
  badge: string;
  description: string;
  icon: string;
};

/**
 * Menghasilkan penghargaan kocak dan unik untuk para pemain
 * berdasarkan skor, performa, dan karakteristik selama bermain.
 */
export function generatePartyWrappedAwards(players: Player[]): SuperlativeAward[] {
  if (!players || players.length === 0) return [];

  const sorted = [...players].sort((a, b) => b.score - a.score);
  const awards: SuperlativeAward[] = [];

  // 1. MVP Juara 1
  if (sorted[0]) {
    awards.push({
      playerId: sorted[0].id,
      playerName: sorted[0].name,
      avatarId: sorted[0].avatarId,
      title: 'MVP Party Paling Jenius 👑',
      badge: 'JUARA UTAMA',
      description: `Memimpin papan skor dengan total ${sorted[0].score} poin. Gak ada obat!`,
      icon: '🏆',
    });
  }

  // 2. Sang Beban / Penebus Dosa (Paling bawah)
  if (sorted.length >= 3) {
    const bottom = sorted[sorted.length - 1];
    awards.push({
      playerId: bottom.id,
      playerName: bottom.name,
      avatarId: bottom.avatarId,
      title: 'Duta Hukuman & Penebus Dosa 🍗',
      badge: 'TERBEBAN TAPI TERTABAH',
      description: `Finis di posisi terbawah (${bottom.score} poin). Siap-siap traktir gorengan!`,
      icon: '🤡',
    });
  }

  // 3. Runner Up Ambis
  if (sorted[1]) {
    awards.push({
      playerId: sorted[1].id,
      playerName: sorted[1].name,
      avatarId: sorted[1].avatarId,
      title: 'Spesialis Runner-Up 🥈',
      badge: 'NYARIS JUARA',
      description: `Hanya beda tipis dari juara 1. Next game wajib balas dendam!`,
      icon: '✨',
    });
  }

  // 4. Penghibur Ruangan / Midfield Stabilizer
  if (sorted.length >= 4) {
    const midIdx = Math.floor(sorted.length / 2);
    const mid = sorted[midIdx];
    awards.push({
      playerId: mid.id,
      playerName: mid.name,
      avatarId: mid.avatarId,
      title: 'Penyeimbang Semesta Party 🧘‍♂️',
      badge: 'STABIL NO DRAMA',
      description: `Gak pernah juara, gak pernah dihukum. Hidup santai tenang di zona nyaman (${mid.score} pt).`,
      icon: '🌿',
    });
  }

  return awards;
}
