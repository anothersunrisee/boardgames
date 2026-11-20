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
  playerAId: string;
  playerBId: string;
  topic: DebateTopic;
  chaosCardA?: string;
  chaosCardB?: string;
  votesA: number;
  votesB: number;
  bestPerformanceId?: string;
  winnerId?: string;
  isCompleted: boolean;
  isFinal?: boolean;
};

// ─── Game 5 Types (Cerdas Cermat Berantai) ───────────────────────────────────

export type G5RoundHistory = {
  roundIdx: number;
  memberId: string;
  isCorrect: boolean;
  question: TriviaQuestion;
};

export type G5Team = {
  id: string;
  name: string;
  memberIds: string[];
  questions: TriviaQuestion[];
  currentMemberIdx: number;
  roundHistory: G5RoundHistory[];
  punishedMemberIds: string[];
  correctCount: number;
  isPassed: boolean;
  isFailed: boolean;
  isTeamFinished: boolean;
  teamScore?: number;
};

// ─── Game 6 Types (Sell Me This Trash) ───────────────────────────────────────

export type G6Match = {
  matchNumber: number;
  playerAId: string;
  playerBId: string;
  pitchItem: PitchItem;
  votesA: number;
  votesB: number;
  winnerId?: string | 'tie';
  isCompleted: boolean;
};

// ─── Default Room Players Preset ─────────────────────────────────────────────

export const DEFAULT_ROOM_PLAYERS: Player[] = [
  { id: 'p1', name: 'Alya', gender: 'cewek', kubu: 'Tim Cewek', score: 0, avatarId: 'c01' },
  { id: 'p2', name: 'Bella', gender: 'cewek', kubu: 'Tim Cewek', score: 0, avatarId: 'c07' },
  { id: 'p3', name: 'Caca', gender: 'cewek', kubu: 'Tim Cewek', score: 0, avatarId: 'c04' },
  { id: 'p4', name: 'Dara', gender: 'cewek', kubu: 'Tim Cewek', score: 0, avatarId: 'c09' },
  { id: 'p5', name: 'Elsa', gender: 'cewek', kubu: 'Tim Cewek', score: 0, avatarId: 'c12' },
  { id: 'p6', name: 'Fani', gender: 'cewek', kubu: 'Tim Cewek', score: 0, avatarId: 'c16' },
  { id: 'p7', name: 'Gaby', gender: 'cewek', kubu: 'Tim Cewek', score: 0, avatarId: 'c19' },
  { id: 'p8', name: 'Dimas', gender: 'cowok', kubu: 'Tim Cowok', score: 0, avatarId: 'c05' },
  { id: 'p9', name: 'Kevin', gender: 'cowok', kubu: 'Tim Cowok', score: 0, avatarId: 'c02' },
  { id: 'p10', name: 'Reno', gender: 'cowok', kubu: 'Tim Cowok', score: 0, avatarId: 'c08' },
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
  g3Reset: () => void;

  // ── Game 4 State ──
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
  g4Reset: () => void;

  // ── Game 5 State (Cerdas Cermat Berantai) ──
  g5Teams: G5Team[];
  g5CurrentTeamIndex: number;
  g5UsedQuestionIds: number[];
  g5RecordMemberAnswer: (isCorrect: boolean) => {
    isTeamFinished: boolean;
    isCorrect: boolean;
    roundNum: number;
    memberId: string;
  };
  g5UndoAnswer: () => boolean;
  g5ShuffleCurrentQuestion: () => TriviaQuestion | null;
  g5NextTeam: () => void;
  g5ReshuffleTeams: () => void;
  g5SetTeams: (teams: G5Team[]) => void;
  g5Reset: () => void;

  // ── Game 6 State (Sell Me This Trash) ──
  g6Matches: G6Match[];
  g6CurrentMatchIndex: number;
  g6UpdateMatch: (index: number, match: G6Match) => void;
  g6NextMatch: () => void;
  g6ShuffleItem: () => PitchItem | null;
  g6UndoMatch: () => boolean;
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
    let girls = players.filter((p) => p.gender === 'cewek');
    let boys = players.filter((p) => p.gender === 'cowok');

    if (girls.length === 0) {
      const splitIdx = Math.max(1, Math.floor(players.length * 0.7));
      girls = players.slice(0, splitIdx);
      boys = players.slice(splitIdx);
    } else if (boys.length === 0) {
      const splitIdx = Math.max(1, Math.floor(players.length * 0.3));
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
    let boys = players.filter((p) => p.gender === 'cowok');
    let girls = players.filter((p) => p.gender === 'cewek');

    if (boys.length === 0) {
      const splitIdx = Math.max(1, Math.floor(players.length * 0.3));
      boys = players.slice(0, splitIdx);
      girls = players.slice(splitIdx);
    } else if (girls.length === 0) {
      const splitIdx = Math.max(1, Math.floor(players.length * 0.7));
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

  // Game 04 Auto: Otomatis acak pasangan tanding 1v1, topik absurd, dan posisi PRO/KONTRA
  autoStartGame4: () => {
    const { players, g4EnableChaos } = get();
    if (players.length < 2) return { success: false, message: 'Minimal 2 pemain untuk debat' };

    const shuffled = [...players].sort(() => Math.random() - 0.5);
    const matches: DebateMatch[] = [];
    const usedTopicIds: number[] = [];

    const pairCount = Math.floor(shuffled.length / 2);

    for (let i = 0; i < pairCount * 2; i += 2) {
      const pA = shuffled[i];
      const pB = shuffled[i + 1];
      const topic = getRandomTopic(usedTopicIds);
      usedTopicIds.push(topic.id);

      matches.push({
        matchNumber: matches.length + 1,
        playerAId: pA.id,
        playerBId: pB.id,
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

      // Setiap tim WAJIB mendapatkan 4 series pertanyaan langsung!
      const questions = getRandomTriviaChain(4, usedIds);
      usedIds = [...usedIds, ...questions.map((q) => q.id)];

      teams.push({
        id: `g5-t-${idx + 1}`,
        name: TEAM_NAMES[idx % TEAM_NAMES.length],
        memberIds: members.map((m) => m.id),
        questions,
        currentMemberIdx: 0,
        roundHistory: [],
        punishedMemberIds: [],
        correctCount: 0,
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

  g5ReshuffleTeams: () => {
    const { autoStartGame5 } = get();
    autoStartGame5();
  },

  g5SetTeams: (teams: G5Team[]) => set({ g5Teams: teams }),

  // Game 06 Auto (Sell Me This Trash!):
  // Menghubungkan duel 1v1 dengan barang aneh/rusak + target pasar absurd
  autoStartGame6: () => {
    const { players } = get();
    if (players.length < 2) {
      return { success: false, message: 'Minimal 2 pemain untuk Pitching Duel' };
    }

    const shuffled = [...players].sort(() => Math.random() - 0.5);
    const matches: G6Match[] = [];
    const usedItemIds: number[] = [];

    const pairCount = Math.floor(shuffled.length / 2);

    for (let i = 0; i < pairCount * 2; i += 2) {
      const pA = shuffled[i];
      const pB = shuffled[i + 1];
      const pitchItem = getRandomPitchItem(usedItemIds);
      usedItemIds.push(pitchItem.id);

      matches.push({
        matchNumber: matches.length + 1,
        playerAId: pA.id,
        playerBId: pB.id,
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

    // Rollback scores
    if (match.winnerId) {
      addScore(match.winnerId, -8);
      const loserId = match.winnerId === match.playerAId ? match.playerBId : match.playerAId;
      addScore(loserId, -2);
    }

    const updated = [...g4Matches];
    updated[targetIdx] = {
      ...match,
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
  g5RecordMemberAnswer: (isCorrect: boolean) => {
    const { g5Teams, g5CurrentTeamIndex, addScore } = get();
    const currentTeam = g5Teams[g5CurrentTeamIndex];
    if (!currentTeam) {
      return { isTeamFinished: false, isCorrect: false, roundNum: 0, memberId: '' };
    }

    const roundIdx = currentTeam.currentMemberIdx;
    const memberIndexInTeam = roundIdx % currentTeam.memberIds.length;
    const memberId = currentTeam.memberIds[memberIndexInTeam];
    const question = currentTeam.questions[roundIdx] || currentTeam.questions[0];

    const updatedHistory: G5RoundHistory = {
      roundIdx,
      memberId,
      isCorrect,
      question,
    };

    let nextCorrectCount = currentTeam.correctCount || 0;
    const nextPunishedMemberIds = [...(currentTeam.punishedMemberIds || [])];

    if (isCorrect) {
      nextCorrectCount += 1;
      // +3 poin per individu untuk jawaban benar
      addScore(memberId, 3);
    } else {
      // 1 orang yang salah mendapat hukuman perorangan
      if (!nextPunishedMemberIds.includes(memberId)) {
        nextPunishedMemberIds.push(memberId);
      }
    }

    const nextIdx = roundIdx + 1;
    const isTeamFinished = nextIdx >= 4;

    const updatedTeams = [...g5Teams];
    updatedTeams[g5CurrentTeamIndex] = {
      ...currentTeam,
      currentMemberIdx: nextIdx,
      roundHistory: [...(currentTeam.roundHistory || []), updatedHistory],
      punishedMemberIds: nextPunishedMemberIds,
      correctCount: nextCorrectCount,
      isTeamFinished,
      isPassed: isTeamFinished && nextCorrectCount >= 3,
      isFailed: isTeamFinished && nextCorrectCount < 3,
      teamScore: nextCorrectCount * 3 + (isTeamFinished && nextCorrectCount === 4 ? 4 : 0),
    };

    set({ g5Teams: updatedTeams });

    return {
      isTeamFinished,
      isCorrect,
      roundNum: roundIdx + 1,
      memberId,
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

    if (last.isCorrect) {
      nextCorrectCount = Math.max(0, nextCorrectCount - 1);
      addScore(last.memberId, -3); // rollback score
    } else {
      // rollback punishment if this member has no other wrong answers in history
      const hasOtherWrong = newHistory.some((h) => !h.isCorrect && h.memberId === last.memberId);
      if (!hasOtherWrong) {
        nextPunishedMemberIds = nextPunishedMemberIds.filter((id) => id !== last.memberId);
      }
    }

    const prevIdx = Math.max(0, currentTeam.currentMemberIdx - 1);

    const updatedTeams = [...g5Teams];
    updatedTeams[g5CurrentTeamIndex] = {
      ...currentTeam,
      currentMemberIdx: prevIdx,
      roundHistory: newHistory,
      punishedMemberIds: nextPunishedMemberIds,
      correctCount: nextCorrectCount,
      isTeamFinished: false,
      isPassed: false,
      isFailed: false,
      teamScore: nextCorrectCount * 3,
    };

    set({ g5Teams: updatedTeams });
    return true;
  },

  g5ShuffleCurrentQuestion: () => {
    const { g5Teams, g5CurrentTeamIndex, g5UsedQuestionIds } = get();
    const currentTeam = g5Teams[g5CurrentTeamIndex];
    if (!currentTeam) return null;

    const roundIdx = Math.min(currentTeam.currentMemberIdx, 3);
    const newQuestions = getRandomTriviaChain(1, g5UsedQuestionIds);
    if (!newQuestions || newQuestions.length === 0) return null;

    const newQuestion = newQuestions[0];
    const updatedQuestions = [...currentTeam.questions];
    updatedQuestions[roundIdx] = newQuestion;

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

  // ── Game 6 Handlers (Sell Me This Trash) ──
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

    // Rollback scores
    if (match.winnerId && match.winnerId !== 'tie') {
      addScore(match.winnerId, -8);
      const loserId = match.winnerId === match.playerAId ? match.playerBId : match.playerAId;
      addScore(loserId, -2);
    } else if (match.winnerId === 'tie') {
      addScore(match.playerAId, -4);
      addScore(match.playerBId, -4);
    }

    const updated = [...g6Matches];
    updated[targetIdx] = {
      ...match,
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
