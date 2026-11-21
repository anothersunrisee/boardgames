/**
 * Helper Pencocokan Toleran Typo, Spasi, Huruf Berulang & Deteksi Duplikasi Otomatis
 * Digunakan untuk Game 01 (Same Brain? NO!), Game 02 & Game 03 (Host Override & Fuzzy Match).
 */

/**
 * Normalisasi pengulangan huruf ekstrem yang disengaja user (misal "nasgoorrrrr" -> "nasgor", "kejuuu" -> "keju")
 */
export function collapseRepeatedChars(str: string): string {
  if (!str) return '';
  return str.replace(/(.)\1{2,}/g, '$1'); // Ganti 3+ huruf sama berturut-turut menjadi 1 huruf
}

export function normalizeAnswer(str: string): string {
  if (!str) return '';
  const noParens = str
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ') // Pisahkan teks dalam kurung misal "(CR7)" atau "(Eyelash Curler)"
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return noParens;
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
 * Uji apakah dua string jawaban dianggap kembar / identik (untuk Game 1)
 */
export function isDuplicateAnswerPair(a: string, b: string): boolean {
  const normA = normalizeAnswer(a);
  const normB = normalizeAnswer(b);
  if (!normA || !normB) return false;

  // 1. Identik persis
  if (normA === normB) return true;

  // 2. Identik jika spasi dihilangkan (misal "nasi goreng" vs "nasigoreng")
  const spaceLessA = normA.replace(/\s/g, '');
  const spaceLessB = normB.replace(/\s/g, '');
  if (spaceLessA === spaceLessB) return true;

  // 3. Identik setelah pembersihan huruf berulang (misal "nasgooorrr" vs "nasgor")
  const collapsedA = collapseRepeatedChars(spaceLessA);
  const collapsedB = collapseRepeatedChars(spaceLessB);
  if (collapsedA === collapsedB) return true;

  // 4. Toleransi Levenshtein Distance (typo 1 huruf untuk >= 4 huruf, 2 huruf untuk >= 8 huruf)
  const maxLen = Math.max(collapsedA.length, collapsedB.length);
  if (maxLen >= 4) {
    const dist = levenshteinDistance(collapsedA, collapsedB);
    if (dist <= 1) return true;
    if (maxLen >= 8 && dist <= 2) return true;
  }

  return false;
}

export type DuplicateGroup = {
  groupId: string;
  canonicalAnswer: string;
  playerIds: string[];
};

/**
 * Deteksi otomatis jawaban kembar di antara seluruh pemain yang submit (Game 1)
 */
export function detectDuplicateAnswers(
  items: { playerId: string; answer: string }[]
): {
  duplicatePlayerIds: Set<string>;
  groups: DuplicateGroup[];
  isUniqueMap: Record<string, boolean>;
} {
  const duplicatePlayerIds = new Set<string>();
  const groups: DuplicateGroup[] = [];
  const assigned = new Set<string>();

  for (let i = 0; i < items.length; i++) {
    const itemA = items[i];
    if (assigned.has(itemA.playerId)) continue;
    if (!itemA.answer || !itemA.answer.trim()) continue;

    const cluster: string[] = [itemA.playerId];

    for (let j = i + 1; j < items.length; j++) {
      const itemB = items[j];
      if (assigned.has(itemB.playerId)) continue;
      if (!itemB.answer || !itemB.answer.trim()) continue;

      if (isDuplicateAnswerPair(itemA.answer, itemB.answer)) {
        cluster.push(itemB.playerId);
      }
    }

    if (cluster.length > 1) {
      cluster.forEach((id) => {
        duplicatePlayerIds.add(id);
        assigned.add(id);
      });
      groups.push({
        groupId: `grp_${groups.length + 1}`,
        canonicalAnswer: itemA.answer.trim(),
        playerIds: cluster,
      });
    }
  }

  const isUniqueMap: Record<string, boolean> = {};
  items.forEach((item) => {
    isUniqueMap[item.playerId] = !duplicatePlayerIds.has(item.playerId);
  });

  return { duplicatePlayerIds, groups, isUniqueMap };
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
    if (g.replace(/\s/g, '') === target.replace(/\s/g, '')) return true;

    // Cek dengan collapsing huruf berulang
    const collG = collapseRepeatedChars(g);
    const collTarget = collapseRepeatedChars(target);
    if (collG === collTarget) return true;

    // Toleransi typo
    const maxDist = target.length >= 8 ? 2 : 1;
    return levenshteinDistance(collG, collTarget) <= maxDist;
  });
}
