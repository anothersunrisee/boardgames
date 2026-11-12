import { create } from 'zustand';
import type { Category } from '../data/game1-categories';
import type { DebateTopic } from '../data/game4-topics';

// ─── Shared Types ───────────────────────────────────────────────────────────

export type Player = {
  id: string;
  name: string;
  kubu: string;
  score: number;
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
  qna: QnAPair[]; // max 2 per boy × 3 boys = 6
  boyGuesses: { boyId: string; guess: string; correct: boolean }[];
};

// ─── Game 3 Types ────────────────────────────────────────────────────────────

export type G3BoySlot = {
  playerId: string;
  secretWord: string;
  category: string;
  qna: QnAPair[]; // 2 per girl, up to 7 girls = 14
  girlGuesses: { girlId: string; guess: string; correct: boolean }[];
};

// ─── Game 4 Types ────────────────────────────────────────────────────────────

export type DebateMatch = {
  matchNumber: number;
  playerAId: string; // PRO stance
  playerBId: string; // CONTRA stance
  topic: DebateTopic;
  chaosCardA?: string;
  chaosCardB?: string;
  votesA: number;
  votesB: number;
  bestPerformanceId?: string;
  winnerId?: string; // id or 'tie'
  isCompleted: boolean;
  isFinal?: boolean;
};

// ─── Store ───────────────────────────────────────────────────────────────────

interface GameStore {
  // ── Players (set during pre-game setup) ──
  players: Player[];
  setPlayers: (players: Player[]) => void;
  addScore: (playerId: string, points: number) => void;

  // ── Game 1 ──
  g1Rounds: G1Round[];
  g1CurrentRound: number;
  g1UsedCategoryIds: number[];
  g1AddRound: (round: G1Round) => void;
  g1NextRound: () => void;
  g1Reset: () => void;

  // ── Game 2 ──
  g2GirlPlayers: Player[];
  g2BoyPlayers: Player[];
  g2Slots: G2GirlSlot[];
  g2CurrentSlotIndex: number;
  g2SetPlayers: (girls: Player[], boys: Player[]) => void;
  g2SetSlots: (slots: G2GirlSlot[]) => void;
  g2UpdateSlot: (index: number, slot: G2GirlSlot) => void;
  g2NextSlot: () => void;
  g2Reset: () => void;

  // ── Game 3 ──
  g3BoyPlayers: Player[];
  g3GirlPlayers: Player[];
  g3Slots: G3BoySlot[];
  g3CurrentSlotIndex: number;
  g3SetPlayers: (boys: Player[], girls: Player[]) => void;
  g3SetSlots: (slots: G3BoySlot[]) => void;
  g3UpdateSlot: (index: number, slot: G3BoySlot) => void;
  g3NextSlot: () => void;
  g3Reset: () => void;

  // ── Game 4 ──
  g4Players: Player[];
  g4Matches: DebateMatch[];
  g4CurrentMatchIndex: number;
  g4EnableChaos: boolean;
  g4UsedTopicIds: number[];
  g4SetSetup: (players: Player[], matches: DebateMatch[], enableChaos: boolean) => void;
  g4UpdateMatch: (index: number, match: DebateMatch) => void;
  g4NextMatch: () => void;
  g4AddFinalMatch: (match: DebateMatch) => void;
  g4Reset: () => void;

  // ── Global reset ──
  fullReset: () => void;
}

const initialState = {
  players: [],
  g1Rounds: [],
  g1CurrentRound: 1,
  g1UsedCategoryIds: [],
  g2GirlPlayers: [],
  g2BoyPlayers: [],
  g2Slots: [],
  g2CurrentSlotIndex: 0,
  g3BoyPlayers: [],
  g3GirlPlayers: [],
  g3Slots: [],
  g3CurrentSlotIndex: 0,
  g4Players: [],
  g4Matches: [],
  g4CurrentMatchIndex: 0,
  g4EnableChaos: true,
  g4UsedTopicIds: [],
};

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,

  // Players
  setPlayers: (players) => set({ players }),
  addScore: (playerId, points) =>
    set((state) => ({
      players: state.players.map((p) =>
        p.id === playerId ? { ...p, score: p.score + points } : p
      ),
    })),

  // Game 1
  g1AddRound: (round) =>
    set((state) => ({
      g1Rounds: [...state.g1Rounds, round],
      g1UsedCategoryIds: [...state.g1UsedCategoryIds, round.category.id],
    })),
  g1NextRound: () =>
    set((state) => ({ g1CurrentRound: state.g1CurrentRound + 1 })),
  g1Reset: () =>
    set({ g1Rounds: [], g1CurrentRound: 1, g1UsedCategoryIds: [] }),

  // Game 2
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
  g2Reset: () =>
    set({ g2GirlPlayers: [], g2BoyPlayers: [], g2Slots: [], g2CurrentSlotIndex: 0 }),

  // Game 3
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
  g3Reset: () =>
    set({ g3BoyPlayers: [], g3GirlPlayers: [], g3Slots: [], g3CurrentSlotIndex: 0 }),

  // Game 4
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
  g4Reset: () =>
    set({
      g4Players: [],
      g4Matches: [],
      g4CurrentMatchIndex: 0,
      g4EnableChaos: true,
      g4UsedTopicIds: [],
    }),

  // Full reset
  fullReset: () => set(initialState),
}));
