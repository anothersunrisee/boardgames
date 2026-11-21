/**
 * Helper Pencocokan Toleran Typo, Spasi & Sinonim
 * Normalisasi huruf kecil, menghilangkan karakter khusus/kurung, dan menghitung Levenshtein distance.
 */

export function normalizeAnswer(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ') // Pisahkan teks dalam kurung misal "(CR7)" atau "(Eyelash Curler)"
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function levenshteinDistance(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return dp[a.length][b.length];
}

/**
 * Cocokkan tebakan pemain terhadap kata rahasia + array alias/sinonim opsional.
 * Contoh: secret = "Cristiano Ronaldo (CR7)", aliases = ["ronaldo", "cr7", "bang dodo"]
 */
export function isFuzzyAnswerMatch(
  guess: string,
  secret: string,
  aliases: string[] = []
): boolean {
  const g = normalizeAnswer(guess);
  if (!g || g.length < 2) return false;

  // Ekstrak isi dalam tanda kurung sebagai alias otomatis (misal "Eyelash Curler" atau "CR7")
  const parenMatches = [...secret.matchAll(/\(([^)]+)\)/g)].map((m) => m[1]);
  const candidates = [secret, ...parenMatches, ...aliases].map(normalizeAnswer);

  return candidates.some((target) => {
    if (!target) return false;
    if (g === target) return true;
    // Cocok jika selisih spasi (misal "bulumata" vs "bulu mata" atau "eyelashcurler")
    if (g.replace(/\s/g, '') === target.replace(/\s/g, '')) return true;
    // Toleransi typo: 1 huruf untuk kata pendek, 2 huruf untuk frasa >= 8 karakter
    const maxDist = target.length >= 8 ? 2 : 1;
    return levenshteinDistance(g, target) <= maxDist;
  });
}
