import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CATEGORIES as G1_CATEGORIES, type Category } from '../data/game1-categories';
import { getRandomItems } from '../data/game2-items';
import { WORD_CATEGORIES } from '../data/game3-words';
import {
  DEBATE_TOPICS,
  getRandomTopic,
  getRandomChaosCard,
  type DebateTopic,
} from '../data/game4-topics';
import { getRandomTriviaChain, type TriviaQuestion } from '../data/game5-questions';
import { getRandomPitchItem, type PitchItem } from '../data/game6-pitches';

// ─── Shared Types ───────────────────────────────────────────────────────────

export type Gender = 'cowok' | 'cewek';

export type Player = {
  id: string;
  name: string;
  gender?: Gender;
  kubu: string;
  score: number;
  avatarId?: string;
};

// ─── Game 1 Types ────────────────────────────────────────────────────────────

export type G1Answer = {
  playerId: string;
  answer: string;
  isUnique: boolean;
};

export type G1Round = {
  roundNumber: number;
  category: Category;
  answers: G1Answer[];
};

// ─── Game 2 Types ────────────────────────────────────────────────────────────

export type QnAPair = {
  question: string;
  answer: string;
};

export type G2GirlSlot = {
  playerId: string;
  secretItem: string;
  qna: QnAPair[];
  boyGuesses: { boyId: string; guess: string; correct: boolean }[];
};

// ─── Game 3 Types ────────────────────────────────────────────────────────────

export type G3BoySlot = {
  playerId: string;
  secretWord: string;
  category: string;
  qna: QnAPair[];
  girlGuesses: { girlId: string; guess: string; correct: boolean }[];
};

// ─── Game 4 Types ────────────────────────────────────────────────────────────

export type DebateMatch = {
  matchNumber: number;
  teamAIds: string[]; // Tim PRO (2 orang)
  teamBIds: string[]; // Tim KONTRA (2 orang)
  topic: DebateTopic;
  chaosCardA?: string;
  chaosCardB?: string;
  votesA: number;
  votesB: number;
  winnerTeam?: 'A' | 'B' | 'tie';
  bestPerformanceId?: string;
  isCompleted: boolean;
  isFinal?: boolean;
  // Backward compatibility
  playerAId?: string;
  playerBId?: string;
  winnerId?: string;
};

// ─── Game 5 Types (Cerdas Cermat Berantai) ───────────────────────────────────

export type G5RoundHistory = {
  roundIdx: number; // 0..3 (Ronde 1..4)
  questionInRoundIdx: number; // 0..3 (Soal 1..4 di dalam ronde)
  globalQuestionIdx: number; // 0..15
  memberId: string;
  isCorrect: boolean;
  question: TriviaQuestion;
};

export type G5ActiveChallenge = {
  memberId: string;
  challenge: string;
  assignedAtRound: number; // 1..4
  assignedAtQuestionInRound?: number; // 1..4
};

export const G5_CHALLENGE_LIST = [
  'Bicara dengan suara robot kaku',
  'Pegang kedua daun telinga tanpa lepas',
  'Tersenyum lebar kelihatan gigi tanpa tutup mulut',
  'Berdiri tegak di samping teman sambil posisi hormat',
  'Tepuk tangan heboh setiap kali ada yang bersuara',
  'Wajib katakan "Siap Bosque!" sebelum menjawab',
  'Goyangkan kepala ke kiri dan kanan terus-menerus',
  'Tahan tawa dan pasang muka melotot heran',
  'Bicara dengan nada berbisik rahasia agen mata-mata',
  'Pegang dagu seolah-olah lagi merenungi masa depan',
];

export type G5Team = {
  id: string;
  name: string;
  memberIds: string[];
  questions: TriviaQuestion[]; // 16 pertanyaan (4 ronde x 4 soal)
  currentGlobalQuestionIdx: number; // 0..15
  currentRoundIdx: number; // 0..3
  currentQuestionInRound: number; // 0..3
  roundHistory: G5RoundHistory[];
  punishedMemberIds: string[];
  activeChallenges?: G5ActiveChallenge[];
  correctCount: number; // total soal terjawab benar (0..16)
  successfulRoundsCount: number; // total ronde berhasil (0..4)
  isPassed: boolean;
  isFailed: boolean;
  isTeamFinished: boolean; // true setelah 16 soal selesai
  teamScore?: number;
  currentMemberIdx: number; // backward compatibility
};

// ─── Game 6 Types (Sell Me This Trash 2v2) ───────────────────────────────────

export type G6Match = {
  matchNumber: number;
  teamAIds: string[]; // Duo Sales A (2 orang)
  teamBIds: string[]; // Duo Sales B (2 orang)
  pitchItem: PitchItem;
  votesA: number;
  votesB: number;
  winnerTeam?: 'A' | 'B' | 'tie';
  isCompleted: boolean;
  // Backward compatibility
  playerAId?: string;
  playerBId?: string;
  winnerId?: string | 'tie';
};

// ─── Default Room Players Preset ─────────────────────────────────────────────

export const DEFAULT_ROOM_PLAYERS: Player[] = [
  { id: 'p1', name: 'Dimas', gender: 'cowok', kubu: 'Tim Cowok', score: 0, avatarId: 'c05' },
  { id: 'p2', name: 'Kevin', gender: 'cowok', kubu: 'Tim Cowok', score: 0, avatarId: 'c02' },
  { id: 'p3', name: 'Reno', gender: 'cowok', kubu: 'Tim Cowok', score: 0, avatarId: 'c08' },
  { id: 'p4', name: 'Farhan', gender: 'cowok', kubu: 'Tim Cowok', score: 0, avatarId: 'c11' },
  { id: 'p5', name: 'Alya', gender: 'cewek', kubu: 'Tim Cewek', score: 0, avatarId: 'c01' },
  { id: 'p6', name: 'Bella', gender: 'cewek', kubu: 'Tim Cewek', score: 0, avatarId: 'c07' },
  { id: 'p7', name: 'Caca', gender: 'cewek', kubu: 'Tim Cewek', score: 0, avatarId: 'c04' },
  { id: 'p8', name: 'Dara', gender: 'cewek', kubu: 'Tim Cewek', score: 0, avatarId: 'c09' },
];

// ─── Store Interface ─────────────────────────────────────────────────────────

interface GameStore {
  // ── Room & Players ──
  roomCreated: boolean;
  roomName: string;
  players: Player[];
  setRoomCreated: (created: boolean) => void;
  setRoomName: (name: string) => void;
  setPlayers: (players: Player[]) => void;
  addScore: (playerId: string, points: number) => void;
  resetRoomScores: () => void;

  // ── Auto Game Launchers (Sistem Mengacak Otomatis) ──
  autoStartGame1: () => boolean;
  autoStartGame2: () => { success: boolean; message?: string };
  autoStartGame3: () => { success: boolean; message?: string };
  autoStartGame4: () => { success: boolean; message?: string };
  autoStartGame5: () => { success: boolean; message?: string };
  autoStartGame6: () => { success: boolean; message?: string };

  // ── Game 1 State ──
  g1Rounds: G1Round[];
  g1CurrentRound: number;
  g1UsedCategoryIds: number[];
  g1AddRound: (round: G1Round) => void;
  g1NextRound: () => void;
  g1ShuffleCategory: () => Category;
  g1UndoRound: () => boolean;
  g1Reset: () => void;

  // ── Game 2 State ──
  g2GirlPlayers: Player[];
  g2BoyPlayers: Player[];
  g2Slots: G2GirlSlot[];
  g2CurrentSlotIndex: number;
  g2GirlWins: number;
  g2BoyWins: number;
  incrementG2GirlWins: () => void;
  incrementG2BoyWins: () => void;
  g2SetPlayers: (girls: Player[], boys: Player[]) => void;
  g2SetSlots: (slots: G2GirlSlot[]) => void;
  g2UpdateSlot: (index: number, slot: G2GirlSlot) => void;
  g2NextSlot: () => void;
  g2ShuffleItem: () => string | null;
  g2UndoDecision: () => boolean;
  g2ReplaySameTeams: () => void;
  g2Reset: () => void;

  // ── Game 3 State ──
  g3BoyPlayers: Player[];
  g3GirlPlayers: Player[];
  g3Slots: G3BoySlot[];
  g3CurrentSlotIndex: number;
  g3BoyWins: number;
  g3GirlWins: number;
  incrementG3BoyWins: () => void;
  incrementG3GirlWins: () => void;
  g3SetPlayers: (boys: Player[], girls: Player[]) => void;
  g3SetSlots: (slots: G3BoySlot[]) => void;
  g3UpdateSlot: (index: number, slot: G3BoySlot) => void;
  g3NextSlot: () => void;
  g3ShuffleItem: () => string | null;
  g3UndoDecision: () => boolean;
  g3ReplaySameTeams: () => void;
  g3Reset: () => void;

  // ── Game 4 State (2v2) ──
  g4Players: Player[];
  g4Matches: DebateMatch[];
  g4CurrentMatchIndex: number;
  g4EnableChaos: boolean;
  g4UsedTopicIds: number[];
  g4SetSetup: (players: Player[], matches: DebateMatch[], enableChaos: boolean) => void;
  g4UpdateMatch: (index: number, match: DebateMatch) => void;
  g4NextMatch: () => void;
  g4AddFinalMatch: (match: DebateMatch) => void;
  g4ShuffleTopic: () => DebateTopic | null;
  g4ShuffleChaos: () => string | null;
  g4UndoMatch: () => boolean;
  g4ReplaySameTeams: () => void;
  g4ReshuffleTeams: () => void;
  g4Reset: () => void;

  // ── Game 5 State (Cerdas Cermat Berantai) ──
  g5Teams: G5Team[];
  g5CurrentTeamIndex: number;
  g5UsedQuestionIds: number[];
  g5RecordMemberAnswer: (isCorrect: boolean) => {
    isRoundFinished: boolean;
    isTeamFinished: boolean;
    isCorrect: boolean;
    roundNum: number;
    questionInRoundNum: number;
    globalQuestionNum: number;
    memberId: string;
    roundCorrectCount: number;
    challengeAssigned?: string;
  };
  g5UndoAnswer: () => boolean;
  g5ShuffleCurrentQuestion: () => TriviaQuestion | null;
  g5NextTeam: () => void;
  g5ReplaySameTeams: () => void;
  g5ReshuffleTeams: () => void;
  g5SetTeams: (teams: G5Team[]) => void;
  g5Reset: () => void;

  // ── Game 6 State (Sell Me This Trash 2v2) ──
  g6Matches: G6Match[];
  g6CurrentMatchIndex: number;
  g6UpdateMatch: (index: number, match: G6Match) => void;
  g6NextMatch: () => void;
  g6ShuffleItem: () => PitchItem | null;
  g6UndoMatch: () => boolean;
  g6ReplaySameTeams: () => void;
  g6ReshuffleTeams: () => void;
  g6Reset: () => void;

  // ── Full Reset ──
  fullReset: () => void;
}

const initialState = {
  roomCreated: false,
  roomName: 'Party Games Room',
  players: DEFAULT_ROOM_PLAYERS,
  g1Rounds: [],
  g1CurrentRound: 1,
  g1UsedCategoryIds: [],
  g2GirlPlayers: [],
  g2BoyPlayers: [],
  g2Slots: [],
  g2CurrentSlotIndex: 0,
  g2GirlWins: 0,
  g2BoyWins: 0,
  g3BoyPlayers: [],
  g3GirlPlayers: [],
  g3Slots: [],
  g3CurrentSlotIndex: 0,
  g3BoyWins: 0,
  g3GirlWins: 0,
  g4Players: [],
  g4Matches: [],
  g4CurrentMatchIndex: 0,
  g4EnableChaos: true,
  g4UsedTopicIds: [],
  g5Teams: [],
  g5CurrentTeamIndex: 0,
  g5UsedQuestionIds: [],
  g6Matches: [],
  g6CurrentMatchIndex: 0,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,

  // ── Room & Players Actions ──
  setRoomCreated: (created) => set({ roomCreated: created }),
  setRoomName: (roomName) => set({ roomName }),
  setPlayers: (players) => set({ players }),
  addScore: (playerId, points) =>
    set((state) => ({
      players: state.players.map((p) =>
        p.id === playerId ? { ...p, score: p.score + points } : p
      ),
    })),
  resetRoomScores: () =>
    set((state) => ({
      players: state.players.map((p) => ({ ...p, score: 0 })),
    })),

  // ── Auto Game Launchers ──

  // Game 01 Auto: Ambil semua pemain di room, reset ronde ke 1
  autoStartGame1: () => {
    const { players } = get();
    if (players.length < 2) return false;
    set({
      g1Rounds: [],
      g1CurrentRound: 1,
      g1UsedCategoryIds: [],
    });
    return true;
  },

  // Game 02 Auto: Otomatis pisahkan Cewek (pegang rahasia) & Cowok (tebak), acak urutan & barang
  autoStartGame2: () => {
    const { players } = get();
    let girls = players.filter((p) => p.gender === 'cewek' || p.kubu?.toLowerCase().includes('cewek'));
    let boys = players.filter((p) => p.gender === 'cowok' || p.kubu?.toLowerCase().includes('cowok'));

    // Jika ada pemain yang gender-nya belum diset, masukkan sesuai proporsi
    const unassigned = players.filter((p) => !girls.includes(p) && !boys.includes(p));
    if (unassigned.length > 0) {
      unassigned.forEach((p) => {
        if (girls.length <= boys.length) girls.push(p);
        else boys.push(p);
      });
    }

    // Jika kelompok sama gender semua (misal pesta khusus cowok atau khusus cewek)
    if (girls.length === 0) {
      const splitIdx = Math.max(1, Math.floor(players.length * 0.5));
      girls = players.slice(0, splitIdx);
      boys = players.slice(splitIdx);
    } else if (boys.length === 0) {
      const splitIdx = Math.max(1, Math.floor(players.length * 0.5));
      boys = players.slice(0, splitIdx);
      girls = players.slice(splitIdx);
    }

    const shuffledGirls = [...girls].sort(() => Math.random() - 0.5);
    const randomItems = getRandomItems(shuffledGirls.length);

    const slots: G2GirlSlot[] = shuffledGirls.map((g, i) => ({
      playerId: g.id,
      secretItem: randomItems[i] || 'Lip Tint',
      qna: [],
      boyGuesses: [],
    }));

    set({
      g2GirlPlayers: shuffledGirls,
      g2BoyPlayers: boys,
      g2Slots: slots,
      g2CurrentSlotIndex: 0,
      g2GirlWins: 0,
      g2BoyWins: 0,
    });

    return { success: true };
  },

  // Game 03 Auto: Otomatis Cowok (pegang kata) & Cewek (tebak), acak kata rahasia
  autoStartGame3: () => {
    const { players } = get();
    let boys = players.filter((p) => p.gender === 'cowok' || p.kubu?.toLowerCase().includes('cowok'));
    let girls = players.filter((p) => p.gender === 'cewek' || p.kubu?.toLowerCase().includes('cewek'));

    // Jika ada pemain yang gender-nya belum diset
    const unassigned = players.filter((p) => !boys.includes(p) && !girls.includes(p));
    if (unassigned.length > 0) {
      unassigned.forEach((p) => {
        if (boys.length <= girls.length) boys.push(p);
        else girls.push(p);
      });
    }

    // Jika kelompok sama gender semua
    if (boys.length === 0) {
      const splitIdx = Math.max(1, Math.floor(players.length * 0.5));
      boys = players.slice(0, splitIdx);
      girls = players.slice(splitIdx);
    } else if (girls.length === 0) {
      const splitIdx = Math.max(1, Math.floor(players.length * 0.5));
      girls = players.slice(0, splitIdx);
      boys = players.slice(splitIdx);
    }

    const shuffledBoys = [...boys].sort(() => Math.random() - 0.5);

    const slots: G3BoySlot[] = shuffledBoys.map((b) => {
      const randomCategory = WORD_CATEGORIES[Math.floor(Math.random() * WORD_CATEGORIES.length)];
      const randomWord = randomCategory.words[Math.floor(Math.random() * randomCategory.words.length)];
      return {
        playerId: b.id,
        secretWord: randomWord,
        category: randomCategory.label,
        qna: [],
        girlGuesses: [],
      };
    });

    set({
      g3BoyPlayers: shuffledBoys,
      g3GirlPlayers: girls,
      g3Slots: slots,
      g3CurrentSlotIndex: 0,
      g3BoyWins: 0,
      g3GirlWins: 0,
    });

    return { success: true };
  },

  // Game 04 Auto (Adu Bacot 2v2):
  // Otomatis acak 4 pemain per match (Duo PRO vs Duo KONTRA), topik absurd, dan posisi PRO/KONTRA
  autoStartGame4: () => {
    const { players, g4EnableChaos } = get();
    if (players.length < 2) return { success: false, message: 'Minimal 2 pemain untuk debat' };

    const shuffled = [...players].sort(() => Math.random() - 0.5);
    const matches: DebateMatch[] = [];
    const usedTopicIds: number[] = [];

    // Jika 4 pemain atau lebih, buat pertarungan 2v2
    const matchCount = Math.max(1, Math.floor(shuffled.length / 4));

    for (let m = 0; m < matchCount; m++) {
      const baseIdx = m * 4;
      const p1 = shuffled[baseIdx % shuffled.length];
      const p2 = shuffled[(baseIdx + 1) % shuffled.length];
      const p3 = shuffled[(baseIdx + 2) % shuffled.length];
      const p4 = shuffled[(baseIdx + 3) % shuffled.length];

      const topic = getRandomTopic(usedTopicIds);
      usedTopicIds.push(topic.id);

      matches.push({
        matchNumber: m + 1,
        teamAIds: [p1.id, p2.id],
        teamBIds: [p3.id, p4.id],
        playerAId: p1.id,
        playerBId: p3.id,
        topic,
        chaosCardA: g4EnableChaos ? getRandomChaosCard() : undefined,
        chaosCardB: g4EnableChaos ? getRandomChaosCard() : undefined,
        votesA: 0,
        votesB: 0,
        isCompleted: false,
      });
    }

    set({
      g4Players: players,
      g4Matches: matches,
      g4CurrentMatchIndex: 0,
      g4UsedTopicIds: usedTopicIds,
    });

    return { success: true };
  },

  g4ReplaySameTeams: () => {
    const { g4Matches, g4EnableChaos } = get();
    const usedTopicIds: number[] = [];
    const updated = g4Matches.map((m) => {
      const topic = getRandomTopic(usedTopicIds);
      usedTopicIds.push(topic.id);
      return {
        ...m,
        topic,
        chaosCardA: g4EnableChaos ? getRandomChaosCard() : undefined,
        chaosCardB: g4EnableChaos ? getRandomChaosCard() : undefined,
        votesA: 0,
        votesB: 0,
        winnerTeam: undefined,
        winnerId: undefined,
        isCompleted: false,
      };
    });
    set({
      g4Matches: updated,
      g4CurrentMatchIndex: 0,
      g4UsedTopicIds: usedTopicIds,
    });
  },

  g4ReshuffleTeams: () => {
    const { autoStartGame4 } = get();
    autoStartGame4();
  },

  // Game 05 Auto (Cerdas Cermat Berantai):
  // Mengelompokkan pemain menjadi tim-tim kecil 3-4 orang acak, menyiapkan 4 series chain quiz per tim
  autoStartGame5: () => {
    const { players, g5UsedQuestionIds } = get();
    if (players.length < 2) {
      return { success: false, message: 'Minimal 2 pemain untuk bermain Cerdas Cermat Berantai' };
    }

    const shuffled = [...players].sort(() => Math.random() - 0.5);
    const total = shuffled.length;
    let teamSizes: number[] = [];

    if (total <= 3) {
      teamSizes = [total];
    } else if (total === 4) {
      teamSizes = [2, 2];
    } else if (total === 5) {
      teamSizes = [3, 2];
    } else if (total === 6) {
      teamSizes = [3, 3];
    } else if (total === 7) {
      teamSizes = [4, 3];
    } else if (total === 8) {
      teamSizes = [4, 4];
    } else if (total === 9) {
      teamSizes = [3, 3, 3];
    } else if (total === 10) {
      teamSizes = [4, 3, 3];
    } else if (total === 11) {
      teamSizes = [4, 4, 3];
    } else if (total === 12) {
      teamSizes = [4, 4, 4];
    } else {
      const teamCount = Math.min(5, Math.ceil(total / 4));
      teamSizes = Array(teamCount).fill(Math.floor(total / teamCount));
      const remainder = total % teamCount;
      for (let i = 0; i < remainder; i++) {
        teamSizes[i] += 1;
      }
    }

    let cursor = 0;
    const TEAM_NAMES = [
      'Tim Halilintar 🌩️',
      'Tim Garuda 🦅',
      'Tim Naga 🐉',
      'Tim Rajawali 👑',
      'Tim Singa 🦁',
      'Tim Harimau 🐯',
      'Tim Lumba-Lumba 🐬',
    ];

    let usedIds = [...g5UsedQuestionIds];
    const teams: G5Team[] = [];

    teamSizes.forEach((size, idx) => {
      const members = shuffled.slice(cursor, cursor + size);
      cursor += size;

      // Setiap tim WAJIB mendapatkan 16 pertanyaan (4 ronde x 4 soal)!
      const questions = getRandomTriviaChain(16, usedIds);
      usedIds = [...usedIds, ...questions.map((q) => q.id)];

      teams.push({
        id: `g5-t-${idx + 1}`,
        name: TEAM_NAMES[idx % TEAM_NAMES.length],
        memberIds: members.map((m) => m.id),
        questions,
        currentGlobalQuestionIdx: 0,
        currentRoundIdx: 0,
        currentQuestionInRound: 0,
        currentMemberIdx: 0,
        roundHistory: [],
        punishedMemberIds: [],
        activeChallenges: [],
        correctCount: 0,
        successfulRoundsCount: 0,
        isPassed: false,
        isFailed: false,
        isTeamFinished: false,
        teamScore: 0,
      });
    });

    set({
      g5Teams: teams,
      g5CurrentTeamIndex: 0,
      g5UsedQuestionIds: usedIds,
    });

    return { success: true };
  },

  g5ReplaySameTeams: () => {
    const { g5Teams, g5UsedQuestionIds } = get();
    let usedIds = [...g5UsedQuestionIds];
    const updatedTeams = g5Teams.map((team) => {
      const questions = getRandomTriviaChain(16, usedIds);
      usedIds = [...usedIds, ...questions.map((q) => q.id)];
      return {
        ...team,
        questions,
        currentGlobalQuestionIdx: 0,
        currentRoundIdx: 0,
        currentQuestionInRound: 0,
        currentMemberIdx: 0,
        roundHistory: [],
        punishedMemberIds: [],
        activeChallenges: [],
        correctCount: 0,
        successfulRoundsCount: 0,
        isPassed: false,
        isFailed: false,
        isTeamFinished: false,
        teamScore: 0,
      };
    });
    set({
      g5Teams: updatedTeams,
      g5CurrentTeamIndex: 0,
      g5UsedQuestionIds: usedIds,
    });
  },

  g5ReshuffleTeams: () => {
    const { autoStartGame5 } = get();
    autoStartGame5();
  },

  g5SetTeams: (teams: G5Team[]) => set({ g5Teams: teams }),

  // Game 06 Auto (Sell Me This Trash 2v2):
  // Menghubungkan duel 2v2 (Duo Sales A vs Duo Sales B) dengan barang aneh/rusak + target pasar absurd
  autoStartGame6: () => {
    const { players } = get();
    if (players.length < 2) {
      return { success: false, message: 'Minimal 2 pemain untuk Pitching Duel' };
    }

    const shuffled = [...players].sort(() => Math.random() - 0.5);
    const matches: G6Match[] = [];
    const usedItemIds: number[] = [];

    const matchCount = Math.max(1, Math.floor(shuffled.length / 4));

    for (let m = 0; m < matchCount; m++) {
      const baseIdx = m * 4;
      const p1 = shuffled[baseIdx % shuffled.length];
      const p2 = shuffled[(baseIdx + 1) % shuffled.length];
      const p3 = shuffled[(baseIdx + 2) % shuffled.length];
      const p4 = shuffled[(baseIdx + 3) % shuffled.length];

      const pitchItem = getRandomPitchItem(usedItemIds);
      usedItemIds.push(pitchItem.id);

      matches.push({
        matchNumber: m + 1,
        teamAIds: [p1.id, p2.id],
        teamBIds: [p3.id, p4.id],
        playerAId: p1.id,
        playerBId: p3.id,
        pitchItem,
        votesA: 0,
        votesB: 0,
        isCompleted: false,
      });
    }

    set({
      g6Matches: matches,
      g6CurrentMatchIndex: 0,
    });

    return { success: true };
  },

  g6ReplaySameTeams: () => {
    const { g6Matches } = get();
    const usedItemIds: number[] = [];
    const updated = g6Matches.map((m) => {
      const pitchItem = getRandomPitchItem(usedItemIds);
      usedItemIds.push(pitchItem.id);
      return {
        ...m,
        pitchItem,
        votesA: 0,
        votesB: 0,
        winnerTeam: undefined,
        winnerId: undefined,
        isCompleted: false,
      };
    });
    set({
      g6Matches: updated,
      g6CurrentMatchIndex: 0,
    });
  },

  g6ReshuffleTeams: () => {
    const { autoStartGame6 } = get();
    autoStartGame6();
  },

  // ── Game 1 State Handlers ──
  g1AddRound: (round) =>
    set((state) => ({
      g1Rounds: [...state.g1Rounds, round],
      g1UsedCategoryIds: [...state.g1UsedCategoryIds, round.category.id],
    })),
  g1NextRound: () =>
    set((state) => ({ g1CurrentRound: state.g1CurrentRound + 1 })),
  g1ShuffleCategory: () => {
    const { g1UsedCategoryIds } = get();
    const available = G1_CATEGORIES.filter((c) => !g1UsedCategoryIds.includes(c.id));
    const pool = available.length > 0 ? available : G1_CATEGORIES;
    const picked = pool[Math.floor(Math.random() * pool.length)];
    return picked;
  },
  g1UndoRound: () => {
    const { g1Rounds, addScore } = get();
    if (g1Rounds.length === 0) return false;
    const lastRound = g1Rounds[g1Rounds.length - 1];
    lastRound.answers.forEach((ans) => {
      if (ans.isUnique) {
        addScore(ans.playerId, -3);
      }
    });
    set((state) => ({
      g1Rounds: state.g1Rounds.slice(0, -1),
      g1CurrentRound: Math.max(1, state.g1CurrentRound - 1),
    }));
    return true;
  },
  g1Reset: () =>
    set({ g1Rounds: [], g1CurrentRound: 1, g1UsedCategoryIds: [] }),

  // ── Game 2 State Handlers ──
  g2SetPlayers: (girls, boys) =>
    set({ g2GirlPlayers: girls, g2BoyPlayers: boys }),
  g2SetSlots: (slots) => set({ g2Slots: slots, g2CurrentSlotIndex: 0 }),
  g2UpdateSlot: (index, slot) =>
    set((state) => {
      const updated = [...state.g2Slots];
      updated[index] = slot;
      return { g2Slots: updated };
    }),
  g2NextSlot: () =>
    set((state) => ({ g2CurrentSlotIndex: state.g2CurrentSlotIndex + 1 })),
  incrementG2GirlWins: () =>
    set((state) => ({ g2GirlWins: state.g2GirlWins + 1 })),
  incrementG2BoyWins: () =>
    set((state) => ({ g2BoyWins: state.g2BoyWins + 1 })),
  g2ShuffleItem: () => {
    const { g2Slots, g2CurrentSlotIndex } = get();
    if (!g2Slots[g2CurrentSlotIndex]) return null;
    const newItem = getRandomItems(1)[0] || 'Lip Tint';
    const updated = [...g2Slots];
    updated[g2CurrentSlotIndex] = {
      ...updated[g2CurrentSlotIndex],
      secretItem: newItem,
    };
    set({ g2Slots: updated });
    return newItem;
  },
  g2UndoDecision: () => {
    const { g2Slots, g2CurrentSlotIndex, addScore } = get();
    const targetIdx = Math.min(g2CurrentSlotIndex, g2Slots.length - 1);
    const slot = g2Slots[targetIdx];
    if (!slot) return false;

    const hasBoyCorrect = slot.boyGuesses?.some((g) => g.correct);
    if (hasBoyCorrect) {
      set((s) => ({ g2BoyWins: Math.max(0, s.g2BoyWins - 1) }));
    } else {
      addScore(slot.playerId, -4);
      set((s) => ({ g2GirlWins: Math.max(0, s.g2GirlWins - 1) }));
    }

    const updated = [...g2Slots];
    updated[targetIdx] = {
      ...slot,
      boyGuesses: [],
    };
    set({
      g2Slots: updated,
      g2CurrentSlotIndex: targetIdx,
    });
    return true;
  },
  g2ReplaySameTeams: () => {
    const { g2GirlPlayers } = get();
    const shuffledGirls = [...g2GirlPlayers].sort(() => Math.random() - 0.5);
    const randomItems = getRandomItems(shuffledGirls.length);
    const slots: G2GirlSlot[] = shuffledGirls.map((g, i) => ({
      playerId: g.id,
      secretItem: randomItems[i] || 'Lip Tint',
      qna: [],
      boyGuesses: [],
    }));
    set({
      g2GirlPlayers: shuffledGirls,
      g2Slots: slots,
      g2CurrentSlotIndex: 0,
      g2GirlWins: 0,
      g2BoyWins: 0,
    });
  },
  g2Reset: () =>
    set({ g2GirlPlayers: [], g2BoyPlayers: [], g2Slots: [], g2CurrentSlotIndex: 0, g2GirlWins: 0, g2BoyWins: 0 }),

  // ── Game 3 State Handlers ──
  g3SetPlayers: (boys, girls) =>
    set({ g3BoyPlayers: boys, g3GirlPlayers: girls }),
  g3SetSlots: (slots) => set({ g3Slots: slots, g3CurrentSlotIndex: 0 }),
  g3UpdateSlot: (index, slot) =>
    set((state) => {
      const updated = [...state.g3Slots];
      updated[index] = slot;
      return { g3Slots: updated };
    }),
  g3NextSlot: () =>
    set((state) => ({ g3CurrentSlotIndex: state.g3CurrentSlotIndex + 1 })),
  incrementG3BoyWins: () =>
    set((state) => ({ g3BoyWins: state.g3BoyWins + 1 })),
  incrementG3GirlWins: () =>
    set((state) => ({ g3GirlWins: state.g3GirlWins + 1 })),
  g3ShuffleItem: () => {
    const { g3Slots, g3CurrentSlotIndex } = get();
    if (!g3Slots[g3CurrentSlotIndex]) return null;
    const randomCategory = WORD_CATEGORIES[Math.floor(Math.random() * WORD_CATEGORIES.length)];
    const randomWord = randomCategory.words[Math.floor(Math.random() * randomCategory.words.length)];
    const updated = [...g3Slots];
    updated[g3CurrentSlotIndex] = {
      ...updated[g3CurrentSlotIndex],
      secretWord: randomWord,
      category: randomCategory.label,
    };
    set({ g3Slots: updated });
    return randomWord;
  },
  g3UndoDecision: () => {
    const { g3Slots, g3CurrentSlotIndex, addScore } = get();
    const targetIdx = Math.min(g3CurrentSlotIndex, g3Slots.length - 1);
    const slot = g3Slots[targetIdx];
    if (!slot) return false;

    const hasGirlCorrect = slot.girlGuesses?.some((g) => g.correct);
    if (hasGirlCorrect) {
      set((s) => ({ g3GirlWins: Math.max(0, s.g3GirlWins - 1) }));
    } else {
      addScore(slot.playerId, -4);
      set((s) => ({ g3BoyWins: Math.max(0, s.g3BoyWins - 1) }));
    }

    const updated = [...g3Slots];
    updated[targetIdx] = {
      ...slot,
      girlGuesses: [],
    };
    set({
      g3Slots: updated,
      g3CurrentSlotIndex: targetIdx,
    });
    return true;
  },
  g3ReplaySameTeams: () => {
    const { g3BoyPlayers } = get();
    const shuffledBoys = [...g3BoyPlayers].sort(() => Math.random() - 0.5);
    const slots: G3BoySlot[] = shuffledBoys.map((b) => {
      const randomCategory = WORD_CATEGORIES[Math.floor(Math.random() * WORD_CATEGORIES.length)];
      const randomWord = randomCategory.words[Math.floor(Math.random() * randomCategory.words.length)];
      return {
        playerId: b.id,
        secretWord: randomWord,
        category: randomCategory.label,
        qna: [],
        girlGuesses: [],
      };
    });
    set({
      g3BoyPlayers: shuffledBoys,
      g3Slots: slots,
      g3CurrentSlotIndex: 0,
      g3BoyWins: 0,
      g3GirlWins: 0,
    });
  },
  g3Reset: () =>
    set({ g3BoyPlayers: [], g3GirlPlayers: [], g3Slots: [], g3CurrentSlotIndex: 0, g3BoyWins: 0, g3GirlWins: 0 }),

  // ── Game 4 State Handlers ──
  g4SetSetup: (players, matches, enableChaos) =>
    set({
      g4Players: players,
      g4Matches: matches,
      g4CurrentMatchIndex: 0,
      g4EnableChaos: enableChaos,
      g4UsedTopicIds: matches.map((m) => m.topic.id),
    }),
  g4UpdateMatch: (index, match) =>
    set((state) => {
      const updated = [...state.g4Matches];
      updated[index] = match;
      return { g4Matches: updated };
    }),
  g4NextMatch: () =>
    set((state) => ({ g4CurrentMatchIndex: state.g4CurrentMatchIndex + 1 })),
  g4AddFinalMatch: (match) =>
    set((state) => ({
      g4Matches: [...state.g4Matches, match],
      g4CurrentMatchIndex: state.g4Matches.length,
      g4UsedTopicIds: [...state.g4UsedTopicIds, match.topic.id],
    })),
  g4ShuffleTopic: () => {
    const { g4Matches, g4CurrentMatchIndex, g4UsedTopicIds } = get();
    if (!g4Matches[g4CurrentMatchIndex]) return null;
    const available = DEBATE_TOPICS.filter((t: DebateTopic) => !g4UsedTopicIds.includes(t.id));
    const pool = available.length > 0 ? available : DEBATE_TOPICS;
    const newTopic = pool[Math.floor(Math.random() * pool.length)];
    const updated = [...g4Matches];
    updated[g4CurrentMatchIndex] = {
      ...updated[g4CurrentMatchIndex],
      topic: newTopic,
    };
    set({
      g4Matches: updated,
      g4UsedTopicIds: [...g4UsedTopicIds, newTopic.id],
    });
    return newTopic;
  },
  g4ShuffleChaos: () => {
    const { g4Matches, g4CurrentMatchIndex } = get();
    if (!g4Matches[g4CurrentMatchIndex]) return null;
    const newChaosA = getRandomChaosCard();
    const newChaosB = getRandomChaosCard();
    const updated = [...g4Matches];
    updated[g4CurrentMatchIndex] = {
      ...updated[g4CurrentMatchIndex],
      chaosCardA: newChaosA,
      chaosCardB: newChaosB,
    };
    set({ g4Matches: updated });
    return newChaosA;
  },
  g4UndoMatch: () => {
    const { g4Matches, g4CurrentMatchIndex, addScore } = get();
    const targetIdx = g4Matches[g4CurrentMatchIndex]?.isCompleted
      ? g4CurrentMatchIndex
      : Math.max(0, g4CurrentMatchIndex - 1);
    const match = g4Matches[targetIdx];
    if (!match || !match.isCompleted) return false;

    // Rollback 2v2 scores
    const teamA = match.teamAIds || [match.playerAId!];
    const teamB = match.teamBIds || [match.playerBId!];

    if (match.winnerTeam === 'A' || match.winnerId === match.playerAId) {
      teamA.forEach((id) => addScore(id, -8));
      teamB.forEach((id) => addScore(id, -2));
    } else if (match.winnerTeam === 'B' || match.winnerId === match.playerBId) {
      teamB.forEach((id) => addScore(id, -8));
      teamA.forEach((id) => addScore(id, -2));
    } else {
      [...teamA, ...teamB].forEach((id) => addScore(id, -4));
    }

    const updated = [...g4Matches];
    updated[targetIdx] = {
      ...match,
      winnerTeam: undefined,
      winnerId: undefined,
      votesA: 0,
      votesB: 0,
      isCompleted: false,
    };
    set({
      g4Matches: updated,
      g4CurrentMatchIndex: targetIdx,
    });
    return true;
  },
  g4Reset: () =>
    set({
      g4Players: [],
      g4Matches: [],
      g4CurrentMatchIndex: 0,
      g4EnableChaos: true,
      g4UsedTopicIds: [],
    }),

  // ── Game 5 Handlers (Cerdas Cermat Berantai) ──
  // Format Baru: 1 tim bermain 4 Ronde Beruntun (1 Ronde = 4 Soal Estafet, Total 16 Soal).
  // Tiap 1 ronde (4 soal) terjawab benar = +2 poin ke setiap anggota tim.
  // 4 ronde bersih (16/16) = bonus jackpot +2 poin tambahan (total 10 poin masing-masing).
  // Jika ada anggota yang salah jawab: orang tersebut -2 poin & kena kartu tantangan yang aktif sampai ronde 4 selesai!
  g5RecordMemberAnswer: (isCorrect: boolean) => {
    const { g5Teams, g5CurrentTeamIndex, addScore } = get();
    const currentTeam = g5Teams[g5CurrentTeamIndex];
    if (!currentTeam) {
      return {
        isRoundFinished: false,
        isTeamFinished: false,
        isCorrect: false,
        roundNum: 1,
        questionInRoundNum: 1,
        globalQuestionNum: 1,
        memberId: '',
        roundCorrectCount: 0,
      };
    }

    const globalIdx = currentTeam.currentGlobalQuestionIdx ?? currentTeam.currentMemberIdx ?? 0;
    const roundIdx = Math.min(3, Math.floor(globalIdx / 4));
    const questionInRoundIdx = globalIdx % 4;

    const memberIndexInTeam = globalIdx % currentTeam.memberIds.length;
    const memberId = currentTeam.memberIds[memberIndexInTeam];
    const question = currentTeam.questions[globalIdx] || currentTeam.questions[0];

    const updatedHistory: G5RoundHistory = {
      roundIdx,
      questionInRoundIdx,
      globalQuestionIdx: globalIdx,
      memberId,
      isCorrect,
      question,
    };

    let nextCorrectCount = (currentTeam.correctCount || 0) + (isCorrect ? 1 : 0);
    const nextPunishedMemberIds = [...(currentTeam.punishedMemberIds || [])];
    const nextActiveChallenges = [...(currentTeam.activeChallenges || [])];
    let challengeAssigned: string | undefined = undefined;

    if (!isCorrect) {
      // Salah jawab: orang tersebut -2 poin
      addScore(memberId, -2);

      // Kartu tantangan aktif yang berlaku sampai seluruh 4 ronde tim ini selesai!
      const randomChallenge = G5_CHALLENGE_LIST[Math.floor(Math.random() * G5_CHALLENGE_LIST.length)];
      challengeAssigned = randomChallenge;
      nextActiveChallenges.push({
        memberId,
        challenge: randomChallenge,
        assignedAtRound: roundIdx + 1,
        assignedAtQuestionInRound: questionInRoundIdx + 1,
      });

      if (!nextPunishedMemberIds.includes(memberId)) {
        nextPunishedMemberIds.push(memberId);
      }
    }

    const nextGlobalIdx = globalIdx + 1;
    const isRoundFinished = questionInRoundIdx === 3; // Soal ke-4 dalam ronde ini
    const isTeamFinished = nextGlobalIdx >= 16; // Semua 16 soal selesai

    const allHistory = [...(currentTeam.roundHistory || []), updatedHistory];
    const currentRoundCorrectCount = allHistory.filter(
      (h) => h.roundIdx === roundIdx && h.isCorrect
    ).length;

    let nextSuccessfulRounds = currentTeam.successfulRoundsCount || 0;
    let nextTeamScore = currentTeam.teamScore || 0;

    // Evaluasi jika 1 ronde (4 soal) selesai:
    if (isRoundFinished) {
      // Ronde berhasil jika minimal 3 dari 4 soal terjawab benar
      const isRoundPassed = currentRoundCorrectCount >= 3;
      if (isRoundPassed) {
        nextSuccessfulRounds += 1;
        // Setiap 1 ronde terjawab: +2 poin ke setiap anggota tim
        currentTeam.memberIds.forEach((mId) => addScore(mId, 2));
        nextTeamScore += 2;
      }

      // Jika ke-4 ronde sudah selesai (16 soal) dan semua 4 ronde berhasil (4/4):
      if (isTeamFinished && nextSuccessfulRounds === 4) {
        // Jackpot bonus +2 tambahan (total 10 poin masing-masing)
        currentTeam.memberIds.forEach((mId) => addScore(mId, 2));
        nextTeamScore += 2;
      }
    }

    const nextRoundIdx = Math.min(3, Math.floor(nextGlobalIdx / 4));
    const nextQuestionInRoundIdx = nextGlobalIdx % 4;

    const updatedTeams = [...g5Teams];
    updatedTeams[g5CurrentTeamIndex] = {
      ...currentTeam,
      currentGlobalQuestionIdx: nextGlobalIdx,
      currentRoundIdx: nextRoundIdx,
      currentQuestionInRound: nextQuestionInRoundIdx,
      currentMemberIdx: nextGlobalIdx, // backward compatibility
      roundHistory: allHistory,
      punishedMemberIds: nextPunishedMemberIds,
      activeChallenges: nextActiveChallenges,
      correctCount: nextCorrectCount,
      successfulRoundsCount: nextSuccessfulRounds,
      isTeamFinished,
      isPassed: isTeamFinished && nextSuccessfulRounds >= 2,
      isFailed: isTeamFinished && nextSuccessfulRounds < 2,
      teamScore: nextTeamScore,
    };

    set({ g5Teams: updatedTeams });

    return {
      isRoundFinished,
      isTeamFinished,
      isCorrect,
      roundNum: roundIdx + 1,
      questionInRoundNum: questionInRoundIdx + 1,
      globalQuestionNum: globalIdx + 1,
      memberId,
      roundCorrectCount: currentRoundCorrectCount,
      challengeAssigned,
    };
  },

  g5UndoAnswer: () => {
    const { g5Teams, g5CurrentTeamIndex, addScore } = get();
    const currentTeam = g5Teams[g5CurrentTeamIndex];
    if (!currentTeam || !currentTeam.roundHistory || currentTeam.roundHistory.length === 0) {
      return false;
    }

    const last = currentTeam.roundHistory[currentTeam.roundHistory.length - 1];
    const newHistory = currentTeam.roundHistory.slice(0, -1);

    let nextCorrectCount = currentTeam.correctCount || 0;
    let nextPunishedMemberIds = [...(currentTeam.punishedMemberIds || [])];
    let nextActiveChallenges = [...(currentTeam.activeChallenges || [])];
    let nextSuccessfulRounds = currentTeam.successfulRoundsCount || 0;
    let nextTeamScore = currentTeam.teamScore || 0;

    if (last.isCorrect) {
      nextCorrectCount = Math.max(0, nextCorrectCount - 1);
    } else {
      // Rollback -2 poin: kembalikan +2 poin ke orang yang salah
      addScore(last.memberId, 2);

      // Hapus tantangan yang diberikan pada soal ini
      if (nextActiveChallenges.length > 0) {
        const lastChalIdx = nextActiveChallenges
          .map((c) => c.memberId)
          .lastIndexOf(last.memberId);
        if (lastChalIdx !== -1) {
          nextActiveChallenges.splice(lastChalIdx, 1);
        }
      }

      // Rollback punishment jika member tidak punya kesalahan lain
      const hasOtherWrong = newHistory.some((h) => !h.isCorrect && h.memberId === last.memberId);
      if (!hasOtherWrong) {
        nextPunishedMemberIds = nextPunishedMemberIds.filter((id) => id !== last.memberId);
      }
    }

    // Jika yang di-undo adalah soal ke-4 dari ronde:
    if (last.questionInRoundIdx === 3) {
      const roundCorrectBefore = currentTeam.roundHistory
        .filter((h) => h.roundIdx === last.roundIdx && h.isCorrect).length;
      if (roundCorrectBefore >= 3) {
        nextSuccessfulRounds = Math.max(0, nextSuccessfulRounds - 1);
        currentTeam.memberIds.forEach((mId) => addScore(mId, -2));
        nextTeamScore = Math.max(0, nextTeamScore - 2);

        // Jika sebelumnya dapat jackpot bonus 4/4 ronde:
        if (currentTeam.isTeamFinished && currentTeam.successfulRoundsCount === 4) {
          currentTeam.memberIds.forEach((mId) => addScore(mId, -2));
          nextTeamScore = Math.max(0, nextTeamScore - 2);
        }
      }
    }

    const prevGlobalIdx = Math.max(0, (currentTeam.currentGlobalQuestionIdx ?? 1) - 1);
    const prevRoundIdx = Math.min(3, Math.floor(prevGlobalIdx / 4));
    const prevQuestionInRoundIdx = prevGlobalIdx % 4;

    const updatedTeams = [...g5Teams];
    updatedTeams[g5CurrentTeamIndex] = {
      ...currentTeam,
      currentGlobalQuestionIdx: prevGlobalIdx,
      currentRoundIdx: prevRoundIdx,
      currentQuestionInRound: prevQuestionInRoundIdx,
      currentMemberIdx: prevGlobalIdx,
      roundHistory: newHistory,
      punishedMemberIds: nextPunishedMemberIds,
      activeChallenges: nextActiveChallenges,
      correctCount: nextCorrectCount,
      successfulRoundsCount: nextSuccessfulRounds,
      isTeamFinished: false,
      isPassed: false,
      isFailed: false,
      teamScore: nextTeamScore,
    };

    set({ g5Teams: updatedTeams });
    return true;
  },

  g5ShuffleCurrentQuestion: () => {
    const { g5Teams, g5CurrentTeamIndex, g5UsedQuestionIds } = get();
    const currentTeam = g5Teams[g5CurrentTeamIndex];
    if (!currentTeam || !currentTeam.questions) return null;

    const globalIdx = currentTeam.currentGlobalQuestionIdx ?? currentTeam.currentMemberIdx ?? 0;
    const currentQ = currentTeam.questions[globalIdx];
    if (!currentQ) return null;

    const newQuestions = getRandomTriviaChain(1, g5UsedQuestionIds);
    if (!newQuestions || newQuestions.length === 0) return null;

    const newQuestion = newQuestions[0];
    const updatedQuestions = [...currentTeam.questions];
    updatedQuestions[globalIdx] = newQuestion;

    const updatedTeams = [...g5Teams];
    updatedTeams[g5CurrentTeamIndex] = {
      ...currentTeam,
      questions: updatedQuestions,
    };

    set({
      g5Teams: updatedTeams,
      g5UsedQuestionIds: [...g5UsedQuestionIds, newQuestion.id],
    });

    return newQuestion;
  },

  g5NextTeam: () =>
    set((state) => ({ g5CurrentTeamIndex: state.g5CurrentTeamIndex + 1 })),
  g5Reset: () =>
    set({ g5Teams: [], g5CurrentTeamIndex: 0 }),

  // ── Game 6 Handlers (Sell Me This Trash 2v2) ──
  g6UpdateMatch: (index, match) =>
    set((state) => {
      const updated = [...state.g6Matches];
      updated[index] = match;
      return { g6Matches: updated };
    }),
  g6NextMatch: () =>
    set((state) => ({ g6CurrentMatchIndex: state.g6CurrentMatchIndex + 1 })),
  g6ShuffleItem: () => {
    const { g6Matches, g6CurrentMatchIndex } = get();
    if (!g6Matches[g6CurrentMatchIndex]) return null;
    const newItem = getRandomPitchItem();
    const updated = [...g6Matches];
    updated[g6CurrentMatchIndex] = {
      ...updated[g6CurrentMatchIndex],
      pitchItem: newItem,
    };
    set({ g6Matches: updated });
    return newItem;
  },
  g6UndoMatch: () => {
    const { g6Matches, g6CurrentMatchIndex, addScore } = get();
    const targetIdx = g6Matches[g6CurrentMatchIndex]?.isCompleted
      ? g6CurrentMatchIndex
      : Math.max(0, g6CurrentMatchIndex - 1);
    const match = g6Matches[targetIdx];
    if (!match || !match.isCompleted) return false;

    // Rollback 2v2 scores
    const teamA = match.teamAIds || [match.playerAId!];
    const teamB = match.teamBIds || [match.playerBId!];

    if (match.winnerTeam === 'A' || match.winnerId === match.playerAId) {
      teamA.forEach((id) => addScore(id, -8));
      teamB.forEach((id) => addScore(id, -2));
    } else if (match.winnerTeam === 'B' || match.winnerId === match.playerBId) {
      teamB.forEach((id) => addScore(id, -8));
      teamA.forEach((id) => addScore(id, -2));
    } else {
      [...teamA, ...teamB].forEach((id) => addScore(id, -4));
    }

    const updated = [...g6Matches];
    updated[targetIdx] = {
      ...match,
      winnerTeam: undefined,
      winnerId: undefined,
      votesA: 0,
      votesB: 0,
      isCompleted: false,
    };
    set({
      g6Matches: updated,
      g6CurrentMatchIndex: targetIdx,
    });
    return true;
  },
  g6Reset: () =>
    set({ g6Matches: [], g6CurrentMatchIndex: 0 }),

  // ── Full Reset ──
  fullReset: () => set(initialState),
}),
{
  name: 'party_games_room_storage_v1',
  storage: createJSONStorage(() => localStorage),
}
)
);
