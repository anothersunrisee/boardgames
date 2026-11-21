import {
  joinOnlineRoom,
  leaveOnlineRoom,
  submitPlayerAction,
  listenToRoom,
} from './firebase';
import type { OnlinePlayer } from '../types/multiplayer';

const SAMPLE_G1_ANSWERS = [
  'Nasi Padang Lauk Rendang',
  'Mie Instan Kuah Kari Telur',
  'Martabak Manis Keju Coklat',
  'Kopi Susu Gula Aren',
  'Seblak Ceker Level 5',
  'Es Teh Manis Jumbo',
  'Sate Ayam Bumbu Kacang',
  'Bakso Urat Kuah Pedas',
  'Gorengan Tempe Mendoan',
  'Ayam Geprek Sambal Bawang',
  'Nasi Goreng Gila Spesial',
  'Batagor Bumbu Kacang',
];

const SAMPLE_G2_GUESSES = [
  'Micellar Water',
  'Eyelash Curler',
  'Beauty Blender',
  'Cushion Foundation',
  'Setting Spray',
  'Lip Tint Serum',
];

const SAMPLE_G3_GUESSES = [
  'Busi Racing',
  'Kunci Inggris',
  'Obeng Plus',
  'Karburator PE28',
  'Knalpot Racing',
  'Oli Mesin 10W-40',
];

interface CompanionInstance {
  botId: string;
  unsubscribe: () => void;
  cleanup: () => void;
}

const activeCompanions: Map<string, CompanionInstance> = new Map();

/**
 * Spawn a virtual bot companion into the room.
 * The bot automatically acts as Player 2 from an emulated mobile device!
 */
export async function spawnVirtualBot(
  roomCode: string,
  botName = 'Budi (Bot 🤖)',
  avatarId = 'c03',
  gender: 'cewek' | 'cowok' = 'cowok'
): Promise<string> {
  const botId = `bot_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`;

  const botPlayer: OnlinePlayer = {
    id: botId,
    name: botName,
    avatarId,
    gender,
    kubu: gender === 'cewek' ? 'Tim Cewek' : 'Tim Cowok',
    score: 0,
    isOnline: true,
    connectedFromHp: true,
    lastActive: Date.now(),
  };

  // 1. Join room via Firebase
  await joinOnlineRoom(roomCode, botPlayer);

  let hasSubmittedG1 = false;
  let hasSubmittedG2 = false;
  let hasSubmittedG3 = false;
  let hasVotedG4 = false;
  let hasVotedG6 = false;
  let lastPhaseKey = '';

  // 2. Listen to room state and automate mobile player actions
  const unsubscribe = listenToRoom(roomCode, (room) => {
    if (!room) return;

    const currentPhaseKey = `${room.activeGame || ''}_${room.gamePhase || ''}`;
    if (currentPhaseKey !== lastPhaseKey) {
      lastPhaseKey = currentPhaseKey;
      hasSubmittedG1 = false;
      hasSubmittedG2 = false;
      hasSubmittedG3 = false;
      hasVotedG4 = false;
      hasVotedG6 = false;
    }

    // Auto-Action Game 1 (Same Brain? NO!)
    if (
      room.activeGame === 'game1' &&
      room.gamePhase === 'timer' &&
      !hasSubmittedG1
    ) {
      hasSubmittedG1 = true;
      const delay = Math.floor(Math.random() * 3000) + 3500; // 3.5 - 6.5s delay
      setTimeout(async () => {
        const randomAnswer =
          SAMPLE_G1_ANSWERS[Math.floor(Math.random() * SAMPLE_G1_ANSWERS.length)];
        await submitPlayerAction(roomCode, {
          id: `act_${Date.now()}_bot`,
          playerId: botId,
          playerName: botName,
          type: 'submit_g1_answer',
          payload: { answer: randomAnswer },
          timestamp: Date.now(),
        });
      }, delay);
    }

    // Auto-Action Game 2 (Beauty Expert)
    if (
      room.activeGame === 'game2' &&
      room.gamePhase === 'secret' &&
      !hasSubmittedG2
    ) {
      hasSubmittedG2 = true;
      const delay = Math.floor(Math.random() * 4000) + 4000;
      setTimeout(async () => {
        const guess =
          SAMPLE_G2_GUESSES[Math.floor(Math.random() * SAMPLE_G2_GUESSES.length)];
        await submitPlayerAction(roomCode, {
          id: `act_${Date.now()}_bot`,
          playerId: botId,
          playerName: botName,
          type: 'submit_g2_guess',
          payload: { guess },
          timestamp: Date.now(),
        });
      }, delay);
    }

    // Auto-Action Game 3 (Boys Stuff)
    if (
      room.activeGame === 'game3' &&
      room.gamePhase === 'secret' &&
      !hasSubmittedG3
    ) {
      hasSubmittedG3 = true;
      const delay = Math.floor(Math.random() * 4000) + 4000;
      setTimeout(async () => {
        const guess =
          SAMPLE_G3_GUESSES[Math.floor(Math.random() * SAMPLE_G3_GUESSES.length)];
        await submitPlayerAction(roomCode, {
          id: `act_${Date.now()}_bot`,
          playerId: botId,
          playerName: botName,
          type: 'submit_g3_guess',
          payload: { guess },
          timestamp: Date.now(),
        });
      }, delay);
    }

    // Auto-Action Game 4 (The Devil's Advocate Voting)
    if (
      room.activeGame === 'game4' &&
      !hasVotedG4
    ) {
      hasVotedG4 = true;
      const delay = Math.floor(Math.random() * 3000) + 3000;
      setTimeout(async () => {
        const team = Math.random() > 0.5 ? 'A' : 'B';
        await submitPlayerAction(roomCode, {
          id: `act_${Date.now()}_bot`,
          playerId: botId,
          playerName: botName,
          type: 'cast_g4_vote',
          payload: { team },
          timestamp: Date.now(),
        });
      }, delay);
    }

    // Auto-Action Game 6 (Sell Me This Trash Voting)
    if (
      room.activeGame === 'game6' &&
      !hasVotedG6
    ) {
      hasVotedG6 = true;
      const delay = Math.floor(Math.random() * 3000) + 3000;
      setTimeout(async () => {
        const team = Math.random() > 0.5 ? 'A' : 'B';
        await submitPlayerAction(roomCode, {
          id: `act_${Date.now()}_bot`,
          playerId: botId,
          playerName: botName,
          type: 'cast_g6_vote',
          payload: { team },
          timestamp: Date.now(),
        });
      }, delay);
    }
  });

  const cleanup = async () => {
    unsubscribe();
    await leaveOnlineRoom(roomCode, botId);
    activeCompanions.delete(botId);
  };

  activeCompanions.set(botId, { botId, unsubscribe, cleanup });
  return botId;
}

/**
 * Remove a specific bot companion
 */
export async function removeVirtualBot(botId: string): Promise<void> {
  const instance = activeCompanions.get(botId);
  if (instance) {
    await instance.cleanup();
  }
}

/**
 * Remove all active virtual bots
 */
export async function removeAllVirtualBots(): Promise<void> {
  for (const instance of activeCompanions.values()) {
    await instance.cleanup();
  }
}
