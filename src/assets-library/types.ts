// ============================================================================
// 1. TYPES & INTERFACES (MODULAR ASSET LIBRARY FOR ANTIGRAVITY PARTY GAMES)
// ============================================================================

export type CharacterMood = 'idle' | 'happy' | 'thinking' | 'shocked' | 'winner' | 'dizzy';
export type CharacterStyle = 'profile' | 'mascot';

export type ProfileShape =
  | 'trapezoid'
  | 'dome'
  | 'pentagon'
  | 'worm'
  | 'starburst'
  | 'clover'
  | 'scallop'
  | 'flask'
  | 'arch'
  | 'crescent'
  | 'hourglass'
  | 'diamond'
  | 'pill'
  | 'blob'
  | 'twinpeak'
  | 'bowtie'
  | 'crownhead'
  | 'cloudcut'
  | 'teardrop'
  | 'wave';

export type ProfileFaceVariant =
  | 'flat'
  | 'smug'
  | 'tilted'
  | 'cute'
  | 'sleepy'
  | 'smile'
  | 'cat'
  | 'grumpy'
  | 'cheer'
  | 'wink';

export type MascotShape =
  | 'squircle'
  | 'cloud'
  | 'teardrop'
  | 'triangle'
  | 'hexagon'
  | 'bean'
  | 'pebble'
  | 'starpuff'
  | 'capsule'
  | 'dome'
  | 'clover'
  | 'flamedrop'
  | 'cube'
  | 'twinbump'
  | 'diamondsoft'
  | 'mushroom'
  | 'wavebot'
  | 'crescentbot'
  | 'pillbot'
  | 'crownpuff';

export type MascotSpark =
  | 'rays'
  | 'stars'
  | 'heart'
  | 'zzz'
  | 'question'
  | 'anger'
  | 'dots'
  | 'bolt'
  | 'none';

export interface CharacterDef {
  id: string;
  index: number;
  name: string;
  tagline: string;
  color: string;
  secondaryColor: string;
  profileShape: ProfileShape;
  profileFaceVariant: ProfileFaceVariant;
  mascotShape: MascotShape;
  mascotSpark?: MascotSpark;
}

export interface PunishmentCardDef {
  id: string;
  title: string;
  text: string;
  intensity: 'Santai' | 'Kocak' | 'Chaos';
  duration: string;
  color: string;
  emoji: string;
  targetMode: '1v1' | 'team' | 'both';
}

export interface GameScoreAction {
  id: string;
  label: string;
  points: number;
  target: 'player' | 'team';
  teamBonusPerMember?: number;
  variant: 'emerald' | 'sunny' | 'cobalt' | 'danger' | 'berry' | 'tangerine';
}

export interface GameRuleConfig {
  id: string;
  name: string;
  mode: 'Individu' | 'Kelompok/Tim' | 'Individu 1v1' | 'Individu / Tim';
  difficulty: 'Easy-Hard' | 'Medium' | 'Hard' | 'Chaos';
  color: string;
  summary: string;
  actions: GameScoreAction[];
}

export interface RoomPlayer {
  id: string;
  name: string;
  team: string;
  avatarId: string;
  roomScore: number; // Kumulatif seluruh game di room ini
}

export interface ScoreLogEntry {
  id: string;
  timestamp: string;
  gameId: string;
  gameName: string;
  description: string;
  deltaText: string;
  isPositive: boolean;
}

export interface RoomCacheState {
  roomName: string;
  activeGameId: string;
  players: RoomPlayer[];
  // Per-game individual scores: gamePlayerScores[gameId][playerId] = number
  gamePlayerScores: Record<string, Record<string, number>>;
  // Per-game team scores: gameTeamScores[gameId][teamName] = number
  gameTeamScores: Record<string, Record<string, number>>;
  logs: ScoreLogEntry[];
  lastUpdated: string;
}
