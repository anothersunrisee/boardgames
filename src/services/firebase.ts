import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  set,
  get,
  update,
  remove,
  onValue,
  onDisconnect,
  push,
  type Database,
} from 'firebase/database';
import type { OnlineRoomData, OnlinePlayer, PlayerAction } from '../types/multiplayer';

// Firebase configuration read from Vite environment variables (.env)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDemoDummyApiKeyForPartyHubOnly',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'partyhub-indonesia.firebaseapp.com',
  databaseURL:
    import.meta.env.VITE_FIREBASE_DATABASE_URL ||
    'https://partyhub-indonesia-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'partyhub-indonesia',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'partyhub-indonesia.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1234567890',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1234567890:web:abcdef123456',
};

let app: FirebaseApp | null = null;
let db: Database | null = null;

export function isFirebaseConfigured(): boolean {
  return (
    !!import.meta.env.VITE_FIREBASE_API_KEY &&
    !!import.meta.env.VITE_FIREBASE_DATABASE_URL
  );
}

export function getFirebaseDb(): Database | null {
  if (db) return db;
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getDatabase(app);
    return db;
  } catch (err) {
    console.warn('Firebase Realtime Database belum dikonfigurasi atau gagal inisialisasi:', err);
    return null;
  }
}

/**
 * Host membuat Room Baru di Firebase
 */
export async function createOnlineRoom(room: OnlineRoomData): Promise<boolean> {
  const database = getFirebaseDb();
  if (!database) return false;
  try {
    const roomRef = ref(database, `rooms/${room.code}`);
    await set(roomRef, room);

    // Auto remove room when Host disconnects
    const hostStatusRef = ref(database, `rooms/${room.code}/hostStatus`);
    await onDisconnect(hostStatusRef).set('offline');
    return true;
  } catch (err) {
    console.error('Gagal membuat online room:', err);
    return false;
  }
}

/**
 * Ambil data room sekali (One-time fetch)
 */
export async function getOnlineRoom(roomCode: string): Promise<OnlineRoomData | null> {
  const database = getFirebaseDb();
  if (!database) return null;
  try {
    const roomRef = ref(database, `rooms/${roomCode}`);
    const snapshot = await get(roomRef);
    if (snapshot.exists()) {
      return snapshot.val() as OnlineRoomData;
    }
    return null;
  } catch (err) {
    console.error('Gagal fetch online room:', err);
    return null;
  }
}

/**
 * Host menyinkronkan daftar roster pemain ke Firebase
 * Mempertahankan status connectedFromHp jika pemain sudah connect
 */
export async function syncRosterSlots(
  roomCode: string,
  players: Record<string, OnlinePlayer>
): Promise<void> {
  const database = getFirebaseDb();
  if (!database) return;
  try {
    const playersRef = ref(database, `rooms/${roomCode}/players`);
    const snapshot = await get(playersRef);
    const existingPlayers = snapshot.exists() ? (snapshot.val() as Record<string, OnlinePlayer>) : {};

    const merged: Record<string, OnlinePlayer> = {};
    for (const [id, p] of Object.entries(players)) {
      const prev = existingPlayers[id];
      merged[id] = {
        ...p,
        isOnline: prev?.isOnline ?? p.isOnline ?? false,
        connectedFromHp: prev?.connectedFromHp ?? p.connectedFromHp ?? false,
        deviceId: prev?.deviceId ?? p.deviceId,
        lastActive: prev?.lastActive ?? Date.now(),
      };
    }
    await set(playersRef, merged);
  } catch (err) {
    console.error('Gagal sync roster slots:', err);
  }
}

/**
 * Host menyinkronkan state permainan (fase game, pertanyaan, giliran)
 */
export async function syncHostRoomState(
  roomCode: string,
  partial: Partial<OnlineRoomData>
): Promise<void> {
  const database = getFirebaseDb();
  if (!database) return;
  try {
    const roomRef = ref(database, `rooms/${roomCode}`);
    await update(roomRef, partial);
  } catch (err) {
    console.error('Gagal sync state room:', err);
  }
}

/**
 * Pemain bergabung ke Room via HP Controller
 */
export async function joinOnlineRoom(
  roomCode: string,
  player: OnlinePlayer
): Promise<{ success: boolean; error?: string; room?: OnlineRoomData }> {
  const database = getFirebaseDb();
  if (!database) {
    return { success: false, error: 'Koneksi database tidak tersedia.' };
  }

  try {
    const roomRef = ref(database, `rooms/${roomCode}`);
    const snapshot = await get(roomRef);

    if (!snapshot.exists()) {
      return { success: false, error: `Room "${roomCode}" tidak ditemukan. Cek kembali kode di layar TV!` };
    }

    const roomData = snapshot.val() as OnlineRoomData;
    const playerRef = ref(database, `rooms/${roomCode}/players/${player.id}`);
    
    const enrichedPlayer: OnlinePlayer = {
      ...player,
      isOnline: true,
      connectedFromHp: true,
      lastActive: Date.now(),
    };

    await set(playerRef, enrichedPlayer);

    // Otomatis tandai offline saat HP pemain disconnect
    const onlineRef = ref(database, `rooms/${roomCode}/players/${player.id}/isOnline`);
    await onDisconnect(onlineRef).set(false);

    return { success: true, room: roomData };
  } catch (err: any) {
    return { success: false, error: err.message || 'Gagal masuk ke room.' };
  }
}

/**
 * Pemain meninggalkan room
 */
export async function leaveOnlineRoom(roomCode: string, playerId: string): Promise<void> {
  const database = getFirebaseDb();
  if (!database) return;
  try {
    const playerRef = ref(database, `rooms/${roomCode}/players/${playerId}`);
    await remove(playerRef);
  } catch (err) {
    console.error('Gagal keluar dari room:', err);
  }
}

/**
 * Mendengarkan perubahan data Room secara realtime
 */
export function listenToRoom(
  roomCode: string,
  callback: (room: OnlineRoomData | null) => void
): () => void {
  const database = getFirebaseDb();
  if (!database) return () => {};

  const roomRef = ref(database, `rooms/${roomCode}`);
  const unsubscribe = onValue(
    roomRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val() as OnlineRoomData);
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error('Realtime listener error:', error);
    }
  );

  return () => unsubscribe();
}

/**
 * Pemain mengirim aksi dari HP (submit tebakan, kirim jawaban, cast vote)
 */
export async function submitPlayerAction(
  roomCode: string,
  action: PlayerAction
): Promise<void> {
  const database = getFirebaseDb();
  if (!database) return;
  try {
    const actionsRef = ref(database, `rooms/${roomCode}/actions`);
    const newActionRef = push(actionsRef);
    await set(newActionRef, {
      ...action,
      id: newActionRef.key || action.id,
    });
  } catch (err) {
    console.error('Gagal submit aksi pemain:', err);
  }
}

/**
 * Host mendengarkan aksi masuk dari seluruh pemain secara realtime
 */
export function listenToPlayerActions(
  roomCode: string,
  callback: (actions: Record<string, PlayerAction>) => void
): () => void {
  const database = getFirebaseDb();
  if (!database) return () => {};

  const actionsRef = ref(database, `rooms/${roomCode}/actions`);
  const unsubscribe = onValue(actionsRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val() as Record<string, PlayerAction>);
    } else {
      callback({});
    }
  });

  return () => unsubscribe();
}
