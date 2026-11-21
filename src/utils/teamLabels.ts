import type { Player } from '../store/useGameStore';

export interface InterrogationLabels {
  holderTeamLabel: string;
  guesserTeamLabel: string;
  holderSingular: string;
  guesserSingular: string;
  isNeutral: boolean;
}

/**
 * Menghasilkan label peran interogasi dinamis.
 * Jika kelompok beranggotakan single-gender (100% cowok atau 100% cewek) atau forceNeutralMode aktif,
 * label otomatis beralih dari Cewek/Cowok ke peran netral: "Sang Insider (Penjaga Rahasia)" & "Skuad Detektif".
 */
export function getInterrogationLabels(
  holders: Player[],
  guessers: Player[],
  forceNeutralMode = false,
  gameType: 'g2' | 'g3' = 'g2'
): InterrogationLabels {
  const holdersAllGirl = holders.length > 0 && holders.every((p) => p.gender === 'cewek');
  const holdersAllBoy = holders.length > 0 && holders.every((p) => p.gender === 'cowok');
  const guessersAllGirl = guessers.length > 0 && guessers.every((p) => p.gender === 'cewek');
  const guessersAllBoy = guessers.length > 0 && guessers.every((p) => p.gender === 'cowok');

  const isClassicG2 = gameType === 'g2' && holdersAllGirl && guessersAllBoy;
  const isClassicG3 = gameType === 'g3' && holdersAllBoy && guessersAllGirl;

  if (!forceNeutralMode && (isClassicG2 || isClassicG3)) {
    return {
      holderTeamLabel: isClassicG2 ? 'Kubu Cewek (Pemegang Rahasia)' : 'Kubu Cowok (Pemegang Rahasia)',
      guesserTeamLabel: isClassicG2 ? 'Kubu Cowok (Penebak)' : 'Kubu Cewek (Penebak)',
      holderSingular: isClassicG2 ? 'Cewek' : 'Cowok',
      guesserSingular: isClassicG2 ? 'Cowok' : 'Cewek',
      isNeutral: false,
    };
  }

  return {
    holderTeamLabel: 'Sang Insider (Penjaga Rahasia)',
    guesserTeamLabel: 'Skuad Detektif (Tim Penebak)',
    holderSingular: 'Penjaga Rahasia',
    guesserSingular: 'Detektif Penebak',
    isNeutral: true,
  };
}
