import { create } from 'zustand';
import type { Category } from '../data/game1-categories';
import { getRandomItems } from '../data/game2-items';
import { WORD_CATEGORIES } from '../data/game3-words';
import { getRandomTopic, getRandomChaosCard, type DebateTopic } from '../data/game4-topics';
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

export type G5Team = {
  id: string;
  name: string;
  memberIds: string[];
  questions: TriviaQuestion[];
  currentMemberIdx: number;
  isPassed: boolean;
  isFailed: boolean;
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
  { id: 'p1', name: 'Alya', gender: 'cewek', kubu: 'Tim Cewek', score: 0 },
  { id: 'p2', name: 'Bella', gender: 'cewek', kubu: 'Tim Cewek', score: 0 },
  { id: 'p3', name: 'Caca', gender: 'cewek', kubu: 'Tim Cewek', score: 0 },
  { id: 'p4', name: 'Dara', gender: 'cewek', kubu: 'Tim Cewek', score: 0 },
  { id: 'p5', name: 'Elsa', gender: 'cewek', kubu: 'Tim Cewek', score: 0 },
  { id: 'p6', name: 'Fani', gender: 'cewek', kubu: 'Tim Cewek', score: 0 },
  { id: 'p7', name: 'Gaby', gender: 'cewek', kubu: 'Tim Cewek', score: 0 },
  { id: 'p8', name: 'Dimas', gender: 'cowok', kubu: 'Tim Cowok', score: 0 },
  { id: 'p9', name: 'Kevin', gender: 'cowok', kubu: 'Tim Cowok', score: 0 },
  { id: 'p10', name: 'Reno', gender: 'cowok', kubu: 'Tim Cowok', score: 0 },
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
  g1Reset: () => void;

  // ── Game 2 State ──
  g2GirlPlayers: Player[];
  g2BoyPlayers: Player[];
  g2Slots: G2GirlSlot[];
  g2CurrentSlotIndex: number;
  g2SetPlayers: (girls: Player[], boys: Player[]) => void;
  g2SetSlots: (slots: G2GirlSlot[]) => void;
  g2UpdateSlot: (index: number, slot: G2GirlSlot) => void;
  g2NextSlot: () => void;
  g2Reset: () => void;

  // ── Game 3 State ──
  g3BoyPlayers: Player[];
  g3GirlPlayers: Player[];
  g3Slots: G3BoySlot[];
  g3CurrentSlotIndex: number;
  g3SetPlayers: (boys: Player[], girls: Player[]) => void;
  g3SetSlots: (slots: G3BoySlot[]) => void;
  g3UpdateSlot: (index: number, slot: G3BoySlot) => void;
  g3NextSlot: () => void;
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
  g4Reset: () => void;

  // ── Game 5 State (Cerdas Cermat Berantai) ──
  g5Teams: G5Team[];
  g5CurrentTeamIndex: number;
  g5RecordMemberAnswer: (isCorrect: boolean) => { isChainBroken: boolean; isTeamPassed: boolean };
  g5NextTeam: () => void;
  g5Reset: () => void;

  // ── Game 6 State (Sell Me This Trash) ──
  g6Matches: G6Match[];
  g6CurrentMatchIndex: number;
  g6UpdateMatch: (index: number, match: G6Match) => void;
  g6NextMatch: () => void;
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
  g3BoyPlayers: [],
  g3GirlPlayers: [],
  g3Slots: [],
  g3CurrentSlotIndex: 0,
  g4Players: [],
  g4Matches: [],
  g4CurrentMatchIndex: 0,
  g4EnableChaos: true,
  g4UsedTopicIds: [],
  g5Teams: [],
  g5CurrentTeamIndex: 0,
  g6Matches: [],
  g6CurrentMatchIndex: 0,
};

export const useGameStore = create<GameStore>((set, get) => ({
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
  // Mengelompokkan pemain menjadi tim-tim kecil 3-4 orang acak, menyiapkan pertanyaan berantai
  autoStartGame5: () => {
    const { players } = get();
    if (players.length < 3) {
      return { success: false, message: 'Minimal 3 pemain untuk bermain Cerdas Cermat Berantai' };
    }

    const shuffled = [...players].sort(() => Math.random() - 0.5);
    const teams: G5Team[] = [];
    let usedQuestionIds: number[] = [];

    // Tentukan ukuran tim (target 3 sampai 4 orang per tim)
    const total = shuffled.length;
    let teamSizes: number[] = [];

    if (total <= 5) {
      teamSizes = [total];
    } else if (total <= 8) {
      const half = Math.floor(total / 2);
      teamSizes = [half, total - half];
    } else {
      // 9+ pemain: bagi menjadi grup 3-4 orang
      let remaining = total;
      while (remaining > 0) {
        if (remaining === 5) {
          teamSizes.push(3, 2);
          break;
        } else if (remaining === 4) {
          teamSizes.push(4);
          break;
        } else if (remaining >= 6) {
          teamSizes.push(3);
          remaining -= 3;
        } else {
          teamSizes.push(remaining);
          break;
        }
      }
    }

    let cursor = 0;
    const TEAM_NAMES = ['Tim Alpha ⚡', 'Tim Garuda 🦅', 'Tim Halilintar 🌩️', 'Tim Naga 🐉', 'Tim Rajawali 👑'];

    teamSizes.forEach((size, idx) => {
      const members = shuffled.slice(cursor, cursor + size);
      cursor += size;

      const questions = getRandomTriviaChain(members.length, usedQuestionIds);
      usedQuestionIds = [...usedQuestionIds, ...questions.map((q) => q.id)];

      teams.push({
        id: `g5-t-${idx + 1}`,
        name: TEAM_NAMES[idx % TEAM_NAMES.length],
        memberIds: members.map((m) => m.id),
        questions,
        currentMemberIdx: 0,
        isPassed: false,
        isFailed: false,
      });
    });

    set({
      g5Teams: teams,
      g5CurrentTeamIndex: 0,
    });

    return { success: true };
  },

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
  g2Reset: () =>
    set({ g2GirlPlayers: [], g2BoyPlayers: [], g2Slots: [], g2CurrentSlotIndex: 0 }),

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
  g3Reset: () =>
    set({ g3BoyPlayers: [], g3GirlPlayers: [], g3Slots: [], g3CurrentSlotIndex: 0 }),

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
    if (!currentTeam) return { isChainBroken: true, isTeamPassed: false };

    const memberCount = currentTeam.memberIds.length;
    const nextIdx = currentTeam.currentMemberIdx + 1;

    if (!isCorrect) {
      // Rantai putus! Tim gagal dapat poin
      const updatedTeams = [...g5Teams];
      updatedTeams[g5CurrentTeamIndex] = {
        ...currentTeam,
        isFailed: true,
        isPassed: false,
      };
      set({ g5Teams: updatedTeams });
      return { isChainBroken: true, isTeamPassed: false };
    }

    // Jawaban benar
    if (nextIdx >= memberCount) {
      // Semua anggota berhasil menjawab berantai! Tim lulus!
      const updatedTeams = [...g5Teams];
      updatedTeams[g5CurrentTeamIndex] = {
        ...currentTeam,
        currentMemberIdx: nextIdx,
        isPassed: true,
        isFailed: false,
      };
      set({ g5Teams: updatedTeams });

      // Berikan poin ke seluruh anggota tim yang sukses berantai (+1 poin tiap orang)
      currentTeam.memberIds.forEach((id) => {
        addScore(id, 1);
      });

      return { isChainBroken: false, isTeamPassed: true };
    }

    // Lanjut ke anggota tim berikutnya
    const updatedTeams = [...g5Teams];
    updatedTeams[g5CurrentTeamIndex] = {
      ...currentTeam,
      currentMemberIdx: nextIdx,
    };
    set({ g5Teams: updatedTeams });

    return { isChainBroken: false, isTeamPassed: false };
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
  g6Reset: () =>
    set({ g6Matches: [], g6CurrentMatchIndex: 0 }),

  // ── Full Reset ──
  fullReset: () => set(initialState),
}));
