import type { Gender, RoomVibe } from '../store/useGameStore';

export interface OnlinePlayer {
  id: string;
  name: string;
  avatarId: string;
  gender: Gender;
  kubu: string;
  score: number;
  isHost?: boolean;
  isOnline: boolean;
  lastActive: number;
}

export interface PlayerAction {
  id: string;
  playerId: string;
  playerName: string;
  type:
    | 'submit_g1_answer'
    | 'submit_g2_guess'
    | 'submit_g3_guess'
    | 'cast_g4_vote'
    | 'cast_g6_vote'
    | 'buzz_g5';
  payload: any;
  timestamp: number;
}

export interface OnlineRoomData {
  code: string;
  name: string;
  vibe: RoomVibe;
  hostId: string;
  createdAt: number;
  status: 'lobby' | 'playing' | 'podium';
  playMode?: 'single_screen' | 'multi_device';
  activeGame?: string | null;
  gamePhase?: string | null;
  gameState?: {
    // Game 1
    g1Prompt?: string;
    g1RoundNum?: number;
    g1TimerSeconds?: number;
    // Game 2 & 3
    g2SecretHolders?: Record<string, string>; // playerId -> secret item
    g3SecretHolders?: Record<string, string>; // playerId -> secret word
    activeSlotPlayerId?: string;
    activeCategory?: string;
    // Game 4 & 6
    g4Topic?: string;
    g4ProTeamIds?: string[];
    g4ContraTeamIds?: string[];
    g4ChaosCardPro?: string;
    g4ChaosCardContra?: string;
    g6ItemTitle?: string;
    g6ItemDescription?: string;
    g6TeamAIds?: string[];
    g6TeamBIds?: string[];
    // Game 5
    g5ActiveQuestion?: string;
    g5ActiveCategory?: string;
    g5ActiveMemberId?: string;
    g5CurrentRound?: number;
    g5TimeLeft?: number;
  };
  players: Record<string, OnlinePlayer>;
  actions?: Record<string, PlayerAction>;
}
