import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Palette,
  Users,
  Film,
  Trophy,
  Shuffle,
  Copy,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Plus,
  Trash2,
  Crown,
  Flame,
  Layers,
  Code2,
  Database,
  ArrowRight,
  Zap,
  Star,
  RefreshCw,
  CheckCircle2,
  Smile,
  ArrowLeft,
} from 'lucide-react';

import type {
  CharacterMood,
  CharacterDef,
  PunishmentCardDef,
  GameScoreAction,
  RoomPlayer,
  ScoreLogEntry,
  RoomCacheState,
} from '../assets-library/types';
import { DESIGN_TOKENS, CHARACTER_PACK, getCharacterById } from '../assets-library/characters';
import { PUNISHMENT_CARDS } from '../assets-library/punishments';
import { GAME_RULES } from '../assets-library/gameRules';
import { sfx } from '../assets-library/soundEngine';
import {
  generateCharacterLottieJSON,
  generateRoomTransitionLottieJSON,
  generateSceneLottieJSON,
} from '../assets-library/lottie';

import { TactileButton, DifficultyBadge } from '../components/ui/TactileElements';
import { PlayerProfileAvatar } from '../components/characters/PlayerProfileAvatar';
import { GameMascotBot } from '../components/characters/GameMascotBot';
import { ConcentricRoomTransition, RING_PALETTE } from '../components/motion/ConcentricRoomTransition';
import { ConfettiShower } from '../components/motion/ConfettiShower';
import { LottieInspectorModal } from '../components/motion/LottieInspectorModal';

// ============================================================================
// PERSISTENT ROOM CACHE STORAGE HELPERS (LOCALSTORAGE)
// ============================================================================
const ROOM_CACHE_KEY = 'party_games_hub_room_cache_v1';

function createDefaultRoomState(): RoomCacheState {
  return {
    roomName: 'Malam Mingguan UNY #01',
    activeGameId: 'same-brain',
    players: [
      { id: 'p1', name: 'Fajar', team: 'Kubu Utara', avatarId: 'c05', roomScore: 65 },
      { id: 'p2', name: 'Nadia', team: 'Kubu Selatan', avatarId: 'c01', roomScore: 80 },
      { id: 'p3', name: 'Rizky', team: 'Kubu Utara', avatarId: 'c02', roomScore: 45 },
      { id: 'p4', name: 'Sinta', team: 'Kubu Selatan', avatarId: 'c07', roomScore: 55 },
      { id: 'p5', name: 'Dimas', team: 'Kubu Utara', avatarId: 'c08', roomScore: 25 },
      { id: 'p6', name: 'Tiara', team: 'Kubu Selatan', avatarId: 'c09', roomScore: 35 },
    ],
    gamePlayerScores: {
      'same-brain': { p1: 30, p2: 40, p3: 15, p4: 25, p5: 10, p6: 15 },
      'beauty-expert': { p1: 20, p2: 20, p3: 20, p4: 20, p5: 10, p6: 20 },
      'boys-stuff': { p1: 15, p2: 20, p3: 10, p4: 10, p5: 5, p6: 0 },
      'devils-advocate': {},
      'uny-geozoom': {},
    },
    gameTeamScores: {
      'same-brain': { 'Kubu Utara': 55, 'Kubu Selatan': 80 },
      'beauty-expert': { 'Kubu Utara': 30, 'Kubu Selatan': 60 },
      'boys-stuff': { 'Kubu Utara': 30, 'Kubu Selatan': 30 },
      'devils-advocate': {},
      'uny-geozoom': {},
    },
    logs: [
      {
        id: 'log-init-1',
        timestamp: 'Baru saja',
        gameId: 'beauty-expert',
        gameName: 'Beauty Expert?!',
        description: 'Kubu Selatan menang ronde tim (+30 Tim / +20 per anggota)',
        deltaText: '+30 Tim',
        isPositive: true,
      },
      {
        id: 'log-init-2',
        timestamp: 'Baru saja',
        gameId: 'same-brain',
        gameName: 'Same Brain? NO!',
        description: 'Nadia menjawab unik sendirian',
        deltaText: '+15',
        isPositive: true,
      },
    ],
    lastUpdated: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  };
}

function loadRoomState(): RoomCacheState {
  if (typeof window === 'undefined') return createDefaultRoomState();
  try {
    const raw = window.localStorage.getItem(ROOM_CACHE_KEY);
    if (!raw) return createDefaultRoomState();
    const parsed = JSON.parse(raw) as RoomCacheState;
    if (!parsed || !Array.isArray(parsed.players)) return createDefaultRoomState();
    return parsed;
  } catch {
    return createDefaultRoomState();
  }
}

type TabKey = 'design-system' | 'characters' | 'motion-studio' | 'podium-punishment' | 'leaderboard';

export default function StudioAssetPack() {
  const [activeTab, setActiveTab] = useState<TabKey>('characters');
  const [muted, setMuted] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Lottie Inspector Modal State
  const [lottieModal, setLottieModal] = useState<{ title: string; json: Record<string, unknown> } | null>(null);

  // Fullscreen Room Transition Overlay State
  const [transitionOpen, setTransitionOpen] = useState(false);
  const [transitionTitle, setTransitionTitle] = useState('SAME BRAIN? NO!');

  // Tab 2: Character Pack State
  const [charViewMode, setCharViewMode] = useState<'compare' | 'profile' | 'mascot'>('compare');
  const [globalMood, setGlobalMood] = useState<CharacterMood>('idle');
  const [stickerBorder, setStickerBorder] = useState(true);

  // Tab 3: Motion Studio State
  const [studioWinnerKey, setStudioWinnerKey] = useState(1);
  const [studioEndKey, setStudioEndKey] = useState(1);

  // Tab 4: Podium & Punishment Shuffle State
  const [podiumRevealKey, setPodiumRevealKey] = useState(1);
  const [punishmentFilter, setPunishmentFilter] = useState<'Semua' | 'Santai' | 'Kocak' | 'Chaos'>('Semua');
  const [isShuffling, setIsShuffling] = useState(false);
  const [activePunishment, setActivePunishment] = useState<PunishmentCardDef>(PUNISHMENT_CARDS[0]);
  const [cardFlipped, setCardFlipped] = useState(true);

  // Tab 5: Persistent Room & Game Leaderboard Engine State
  const [room, setRoom] = useState<RoomCacheState>(() => loadRoomState());
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerTeam, setNewPlayerTeam] = useState('Kubu Utara');
  const [newPlayerAvatar, setNewPlayerAvatar] = useState('c10');
  const [confirmReset, setConfirmReset] = useState(false);
  const [gameBoardSubtab, setGameBoardSubtab] = useState<'individu' | 'kelompok'>('individu');

  // Auto-save room state to browser localStorage whenever it changes
  useEffect(() => {
    try {
      window.localStorage.setItem(ROOM_CACHE_KEY, JSON.stringify(room));
    } catch {}
  }, [room]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const toggleMute = () => {
    sfx.muted = !muted;
    setMuted(sfx.muted);
    if (!sfx.muted) sfx.playPop(640);
  };

  const getChar = useCallback((id: string): CharacterDef => {
    return getCharacterById(id);
  }, []);

  // Derived Sorted Room Players (Grand Cumulative Leaderboard)
  const sortedRoomPlayers = useMemo(() => {
    return [...room.players].sort((a, b) => b.roomScore - a.roomScore);
  }, [room.players]);

  // Derived Teams Summary across Room
  const roomTeamsRanking = useMemo(() => {
    const map: Record<string, { team: string; totalRoomScore: number; members: RoomPlayer[] }> = {};
    room.players.forEach((p) => {
      const t = p.team.trim() || 'Tanpa Kubu';
      if (!map[t]) map[t] = { team: t, totalRoomScore: 0, members: [] };
      map[t].totalRoomScore += p.roomScore;
      map[t].members.push(p);
    });
    return Object.values(map).sort((a, b) => b.totalRoomScore - a.totalRoomScore);
  }, [room.players]);

  // Losing Team / Bottom Players for Punishment Card Shuffle
  const losingTeamInfo = useMemo(() => {
    if (roomTeamsRanking.length >= 2) {
      const last = roomTeamsRanking[roomTeamsRanking.length - 1];
      return {
        label: `Tim Kalah: ${last.team}`,
        members: last.members,
        score: last.totalRoomScore,
      };
    }
    const bottom = sortedRoomPlayers.slice(-2);
    return {
      label: 'Pemain Peringkat Terbawah',
      members: bottom,
      score: bottom[0]?.roomScore ?? 0,
    };
  }, [roomTeamsRanking, sortedRoomPlayers]);

  // Active Game Rule Config
  const activeGameRule = useMemo(
    () => GAME_RULES.find((g) => g.id === room.activeGameId) || GAME_RULES[0],
    [room.activeGameId]
  );

  // Per-Game Individual Ranking
  const activeGamePlayerRanking = useMemo(() => {
    const map = room.gamePlayerScores[room.activeGameId] || {};
    return room.players
      .map((p) => ({ ...p, gameScore: map[p.id] || 0 }))
      .sort((a, b) => b.gameScore - a.gameScore);
  }, [room.players, room.gamePlayerScores, room.activeGameId]);

  // Per-Game Team Ranking
  const activeGameTeamRanking = useMemo(() => {
    const teamScores = room.gameTeamScores[room.activeGameId] || {};
    const teamsSet = new Set<string>(room.players.map((p) => p.team.trim() || 'Tanpa Kubu'));
    return Array.from(teamsSet)
      .map((team) => {
        const members = room.players.filter((p) => (p.team.trim() || 'Tanpa Kubu') === team);
        const memberSum = members.reduce(
          (acc, m) => acc + ((room.gamePlayerScores[room.activeGameId] || {})[m.id] || 0),
          0
        );
        return {
          team,
          members,
          teamScore: teamScores[team] ?? memberSum,
        };
      })
      .sort((a, b) => b.teamScore - a.teamScore);
  }, [room.players, room.gameTeamScores, room.gamePlayerScores, room.activeGameId]);

  // Award Points to Individual Player (updates BOTH Per-Game Score AND Cumulative Room Score!)
  const handleAwardPlayer = (player: RoomPlayer, action: GameScoreAction) => {
    if (action.points >= 0) sfx.playPop(660);
    else sfx.playPenalty();

    const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setRoom((prev) => {
      const gid = prev.activeGameId;
      const curGameMap = { ...(prev.gamePlayerScores[gid] || {}) };
      curGameMap[player.id] = (curGameMap[player.id] || 0) + action.points;

      const curTeamMap = { ...(prev.gameTeamScores[gid] || {}) };
      const teamKey = player.team.trim() || 'Tanpa Kubu';
      curTeamMap[teamKey] = (curTeamMap[teamKey] || 0) + action.points;

      const updatedPlayers = prev.players.map((p) =>
        p.id === player.id ? { ...p, roomScore: p.roomScore + action.points } : p
      );

      const logEntry: ScoreLogEntry = {
        id: `log-${Date.now()}-${Math.random()}`,
        timestamp: nowTime,
        gameId: gid,
        gameName: activeGameRule.name,
        description: `${player.name} (${player.team}) — ${action.label}`,
        deltaText: `${action.points >= 0 ? '+' : ''}${action.points}`,
        isPositive: action.points >= 0,
      };

      return {
        ...prev,
        players: updatedPlayers,
        gamePlayerScores: { ...prev.gamePlayerScores, [gid]: curGameMap },
        gameTeamScores: { ...prev.gameTeamScores, [gid]: curTeamMap },
        logs: [logEntry, ...prev.logs].slice(0, 20),
        lastUpdated: nowTime,
      };
    });
  };

  // Award Team Victory (updates Game Team Score + Automatically adds Individual Room Points to ALL team members!)
  const handleAwardTeam = (teamName: string, action: GameScoreAction) => {
    sfx.playFanfare();
    const memberDelta = action.teamBonusPerMember ?? action.points;
    const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    setRoom((prev) => {
      const gid = prev.activeGameId;
      const curTeamMap = { ...(prev.gameTeamScores[gid] || {}) };
      curTeamMap[teamName] = (curTeamMap[teamName] || 0) + action.points;

      const curGameMap = { ...(prev.gamePlayerScores[gid] || {}) };
      const updatedPlayers = prev.players.map((p) => {
        if ((p.team.trim() || 'Tanpa Kubu') === teamName) {
          curGameMap[p.id] = (curGameMap[p.id] || 0) + memberDelta;
          return { ...p, roomScore: p.roomScore + memberDelta };
        }
        return p;
      });

      const logEntry: ScoreLogEntry = {
        id: `log-${Date.now()}-${Math.random()}`,
        timestamp: nowTime,
        gameId: gid,
        gameName: activeGameRule.name,
        description: `Tim ${teamName} menang! (+${action.points} Tim & +${memberDelta} per anggota)`,
        deltaText: `+${action.points} Tim`,
        isPositive: true,
      };

      return {
        ...prev,
        players: updatedPlayers,
        gamePlayerScores: { ...prev.gamePlayerScores, [gid]: curGameMap },
        gameTeamScores: { ...prev.gameTeamScores, [gid]: curTeamMap },
        logs: [logEntry, ...prev.logs].slice(0, 20),
        lastUpdated: nowTime,
      };
    });

    showToast(`Tim ${teamName} +${action.points} poin tim & +${memberDelta} per anggota!`);
  };

  // Add New Player to Room
  const handleAddPlayer = () => {
    if (!newPlayerName.trim()) return;
    const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const added: RoomPlayer = {
      id: `p-${Date.now()}`,
      name: newPlayerName.trim(),
      team: newPlayerTeam.trim() || 'Kubu Utara',
      avatarId: newPlayerAvatar,
      roomScore: 0,
    };
    setRoom((prev) => ({
      ...prev,
      players: [...prev.players, added],
      lastUpdated: nowTime,
    }));
    setNewPlayerName('');
    const curIdx = CHARACTER_PACK.findIndex((c) => c.id === newPlayerAvatar);
    setNewPlayerAvatar(CHARACTER_PACK[(curIdx + 1) % CHARACTER_PACK.length].id);
    showToast(`${added.name} masuk ke ${added.team}!`);
  };

  // Remove Player from Room
  const handleRemovePlayer = (id: string) => {
    if (room.players.length <= 2) {
      showToast('Minimal 2 pemain di dalam room!');
      return;
    }
    setRoom((prev) => ({
      ...prev,
      players: prev.players.filter((p) => p.id !== id),
      lastUpdated: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    }));
  };

  // Reset Room Cache cleanly
  const handleResetRoom = () => {
    const fresh = createDefaultRoomState();
    setRoom(fresh);
    setConfirmReset(false);
    showToast('Room cache berhasil di-reset ke data awal!');
  };

  // Punishment Card Shuffle Trigger (Animated Deck Riffle + 3D Flip)
  const triggerPunishmentShuffle = () => {
    if (isShuffling) return;
    setIsShuffling(true);
    setCardFlipped(false);

    [0, 1, 2, 3, 4, 5].forEach((i) => {
      setTimeout(() => sfx.playShuffleTick(i), i * 115);
    });

    const pool =
      punishmentFilter === 'Semua'
        ? PUNISHMENT_CARDS
        : PUNISHMENT_CARDS.filter((c) => c.intensity === punishmentFilter);

    const candidates = pool.length > 1 ? pool.filter((c) => c.id !== activePunishment.id) : pool;
    const picked = candidates[Math.floor(Math.random() * candidates.length)] || PUNISHMENT_CARDS[0];

    setTimeout(() => {
      setActivePunishment(picked);
      setIsShuffling(false);
      setCardFlipped(true);
      sfx.playFanfare();
    }, 820);
  };

  // Launch End-Game Podium from Real Room Scores
  const launchRoomEndPodium = () => {
    setTransitionTitle('HASIL AKHIR ROOM!');
    setTransitionOpen(true);
    setTimeout(() => {
      setActiveTab('podium-punishment');
      setPodiumRevealKey((k) => k + 1);
      sfx.playFanfare();
    }, 950);
  };

  // Copy helper
  const copyText = (text: string, label: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    sfx.playPop(700);
    showToast(`${label} disalin: ${text}`);
  };

  // Top 3 players for Podium
  const top3Players = useMemo(() => {
    const fallback = [
      { id: 'f1', name: 'Nadia', team: 'Kubu Selatan', avatarId: 'c01', roomScore: 80 },
      { id: 'f2', name: 'Fajar', team: 'Kubu Utara', avatarId: 'c05', roomScore: 65 },
      { id: 'f3', name: 'Sinta', team: 'Kubu Selatan', avatarId: 'c07', roomScore: 55 },
    ];
    const list =
      sortedRoomPlayers.length >= 3
        ? sortedRoomPlayers.slice(0, 3)
        : [...sortedRoomPlayers, ...fallback].slice(0, 3);
    return list;
  }, [sortedRoomPlayers]);

  const TABS: { id: TabKey; label: string; shortLabel: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'design-system', label: 'Design System & UI', shortLabel: 'Design UI', icon: <Palette className="w-4 h-4" /> },
    { id: 'characters', label: '20 Karakter Pack', shortLabel: '20 Karakter', icon: <Smile className="w-4 h-4" />, badge: '2 Style' },
    { id: 'motion-studio', label: 'Lottie Motion Studio', shortLabel: 'Lottie Studio', icon: <Film className="w-4 h-4" /> },
    { id: 'podium-punishment', label: 'Podium 1-2-3 & Hukuman', shortLabel: 'Podium & Card', icon: <Trophy className="w-4 h-4" /> },
    { id: 'leaderboard', label: 'Room & Game Engine', shortLabel: 'Leaderboard', icon: <Database className="w-4 h-4" />, badge: 'Cache' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E24] font-sans selection:bg-[#FBBF24] pb-20">
      {/* Visual Tokens & Tactile Helper Styles */}
      <style>{`
        .font-display { font-family: 'Fredoka', cursive, sans-serif; letter-spacing: -0.01em; }
        .font-sans { font-family: 'Plus Jakarta Sans', sans-serif; }
        .tactile-card {
          border-radius: 28px;
          border: 2.5px solid rgba(30, 30, 36, 0.1);
          box-shadow: 0 8px 0 rgba(30, 30, 36, 0.08), 0 12px 24px -6px rgba(30, 30, 36, 0.05);
        }
        .tactile-btn {
          transition: transform 0.12s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.15s ease;
        }
        .tactile-btn:active:not(:disabled) {
          transform: translateY(4px);
        }
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
      `}</style>

      {/* Fullscreen Concentric Circles Transition */}
      <ConcentricRoomTransition
        active={transitionOpen}
        roomTitle={transitionTitle}
        onComplete={() => setTransitionOpen(false)}
      />

      {/* Lottie JSON Inspector Modal */}
      <AnimatePresence>
        {lottieModal && (
          <LottieInspectorModal
            title={lottieModal.title}
            jsonData={lottieModal.json}
            onClose={() => setLottieModal(null)}
            onNotify={showToast}
          />
        )}
      </AnimatePresence>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.94 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] px-5 py-3 rounded-full bg-[#1E1E24] text-[#FAF7F2] font-bold text-xs sm:text-sm shadow-xl flex items-center gap-2 border border-white/15"
          >
            <CheckCircle2 className="w-4 h-4 text-[#4AE3B5] shrink-0" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Sticky Studio Header */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b-2 border-[#1E1E24]/8">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="w-10 h-10 rounded-2xl bg-[#FAF7F2] border-2 border-[#1E1E24]/15 hover:border-[#1E1E24] flex items-center justify-center text-[#1E1E24] shadow-[0_3px_0_#D8D0C5] transition active:translate-y-1"
              title="Kembali ke Beranda Party Game"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div className="w-11 h-11 rounded-2xl bg-[#1E1E24] flex items-center justify-center shadow-[0_4px_0_#0A0A0D]">
              <GameMascotBot character={CHARACTER_PACK[4]} size={34} stickerBorder={false} mood="happy" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-lg sm:text-xl font-bold leading-none">
                  PartyHub Asset & Lottie Kit
                </h1>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#D6F5EC] text-[#158467] text-[10px] font-extrabold uppercase">
                  Antigravity Ready • TSX
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#64616C] font-semibold mt-0.5">
                Design System • 20 Dual-Style Karakter • Lottie JSON • Podium & Room Cache
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <TactileButton
              variant="sunny"
              size="sm"
              onClick={() => {
                setTransitionTitle(activeGameRule.name.toUpperCase());
                setTransitionOpen(true);
              }}
            >
              <Play className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Test Transisi Room</span>
              <span className="sm:hidden">Transisi</span>
            </TactileButton>

            <button
              onClick={toggleMute}
              title={muted ? 'Nyalakan SFX' : 'Matikan SFX'}
              className="w-10 h-10 rounded-full bg-[#1E1E24] text-[#FAF7F2] flex items-center justify-center shadow-[0_4px_0_#0A0A0D] cursor-pointer hover:bg-[#2C2C35]"
            >
              {muted ? <VolumeX className="w-4 h-4 text-[#F04438]" /> : <Volume2 className="w-4 h-4 text-[#4AE3B5]" />}
            </button>
          </div>
        </div>

        {/* 5-Tab Navigation Bar */}
        <div className="max-w-6xl mx-auto px-4 pb-3 overflow-x-auto no-scrollbar">
          <div className="inline-flex sm:flex items-center gap-2 min-w-max">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    sfx.playPop(isActive ? 480 : 600);
                    setActiveTab(tab.id);
                  }}
                  className={`px-4 py-2.5 rounded-[18px] font-display font-bold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer ${
                    isActive
                      ? 'bg-[#1E1E24] text-[#FAF7F2] shadow-[0_4px_0_#0A0A0D]'
                      : 'bg-white text-[#64616C] border-2 border-[#1E1E24]/10 hover:text-[#1E1E24] hover:border-[#1E1E24]/25'
                  }`}
                >
                  {tab.icon}
                  <span className="hidden md:inline">{tab.label}</span>
                  <span className="md:hidden">{tab.shortLabel}</span>
                  {tab.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        isActive ? 'bg-[#FBBF24] text-[#1E1E24]' : 'bg-[#F2ECE1] text-[#1E1E24]'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        <AnimatePresence mode="wait">
          {/* ================================================================= */}
          {/* TAB 1: DESIGN SYSTEM & UI PACK                                    */}
          {/* ================================================================= */}
          {activeTab === 'design-system' && (
            <motion.section
              key="tab-ds"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-6"
            >
              {/* Intro Hero Banner */}
              <div className="rounded-[32px] bg-[#1E1E24] text-[#FAF7F2] p-6 sm:p-8 relative overflow-hidden shadow-[0_10px_0_rgba(30,30,36,0.14)]">
                <div className="relative z-10 max-w-2xl">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FBBF24] text-[#1E1E24] text-xs font-extrabold uppercase mb-3">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Design System & Tactile UI Pack v1.0</span>
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl font-bold mb-2">
                    Fondasi Visual Konsisten untuk Semua Party Game
                  </h2>
                  <p className="text-white/80 text-sm sm:text-base font-medium">
                    Klik swatch warna untuk langsung copy kode HEX. Semua tombol, pill status, badge kesulitan, dan kartu tactile sudah siap pakai agar game baru tetap terasa seragam.
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-3 absolute right-6 bottom-5">
                  <PlayerProfileAvatar character={CHARACTER_PACK[0]} size={72} />
                  <GameMascotBot character={CHARACTER_PACK[1]} size={78} mood="happy" />
                </div>
              </div>

              {/* Color Token Swatches */}
              <div className="tactile-card bg-white p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="font-display text-2xl font-bold">Palet Warna & Token</h3>
                    <p className="text-xs text-[#64616C] font-semibold">Klik kartu warna mana saja untuk menyalin kode HEX</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#F2ECE1] text-xs font-extrabold">12 Core Tokens</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
                  {DESIGN_TOKENS.colors.map((swatch) => (
                    <motion.button
                      key={swatch.hex}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => copyText(swatch.hex, swatch.name)}
                      className="text-left rounded-[22px] overflow-hidden border-2 border-[#1E1E24]/10 bg-[#FAF7F2] hover:border-[#1E1E24] transition cursor-pointer group"
                    >
                      <div
                        style={{ backgroundColor: swatch.hex }}
                        className="h-20 p-3 flex items-start justify-between"
                      >
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                            swatch.darkText ? 'bg-[#1E1E24]/10 text-[#1E1E24]' : 'bg-white/20 text-white'
                          }`}
                        >
                          {swatch.hex}
                        </span>
                        <Copy
                          className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition ${
                            swatch.darkText ? 'text-[#1E1E24]' : 'text-white'
                          }`}
                        />
                      </div>
                      <div className="p-3">
                        <p className="font-display font-bold text-sm">{swatch.name}</p>
                        <p className="text-[11px] text-[#64616C] font-semibold">{swatch.role}</p>
                        <p className="text-[10px] font-mono text-[#8C6D46] mt-0.5">{swatch.token}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Typography & Tactile Buttons Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Typography Scale */}
                <div className="tactile-card bg-white p-6 space-y-5">
                  <h3 className="font-display text-2xl font-bold">Skala Tipografi</h3>
                  <div className="space-y-4 divide-y divide-[#1E1E24]/10">
                    <div className="pt-1">
                      <span className="text-[11px] font-extrabold uppercase text-[#158467]">
                        Display Hero • Fredoka Bold (36–56px)
                      </span>
                      <p className="font-display text-3xl sm:text-4xl font-bold mt-1">
                        Party Games Hub!
                      </p>
                    </div>
                    <div className="pt-3">
                      <span className="text-[11px] font-extrabold uppercase text-[#2568EF]">
                        Section Heading • Fredoka Bold (24–30px)
                      </span>
                      <p className="font-display text-2xl font-bold mt-1">
                        Klasemen Akhir & Podium Juara
                      </p>
                    </div>
                    <div className="pt-3">
                      <span className="text-[11px] font-extrabold uppercase text-[#C82373]">
                        Body & Instruksi • Plus Jakarta Sans (14–16px)
                      </span>
                      <p className="text-sm sm:text-base text-[#64616C] font-medium mt-1 leading-relaxed">
                        Setiap ronde memiliki bobot poin berbeda tergantung tingkat kesulitan game. Skor individu terus diakumulasi sampai room selesai!
                      </p>
                    </div>
                    <div className="pt-3">
                      <span className="text-[11px] font-extrabold uppercase text-[#EC5A29]">
                        Micro Label & Badge • ExtraBold Uppercase (11–12px)
                      </span>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <DifficultyBadge level="Easy-Hard" />
                        <DifficultyBadge level="Medium" />
                        <DifficultyBadge level="Hard" />
                        <DifficultyBadge level="Chaos" />
                        <span className="px-3 py-1 rounded-full bg-[#1E1E24] text-[#FBBF24] text-[11px] font-extrabold uppercase">
                          ● LIVE CACHE
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tactile 3D Buttons Showcase */}
                <div className="tactile-card bg-white p-6 space-y-5">
                  <div>
                    <h3 className="font-display text-2xl font-bold">Tombol Tactile 3D</h3>
                    <p className="text-xs text-[#64616C] font-semibold">
                      Coba klik untuk merasakan efek tekan pegas (translateY 4px) + bunyi pop halus
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    <TactileButton variant="ink">Deep Ink</TactileButton>
                    <TactileButton variant="cream">Warm Cream</TactileButton>
                    <TactileButton variant="emerald">Emerald</TactileButton>
                    <TactileButton variant="berry">Berry Pink</TactileButton>
                    <TactileButton variant="cobalt">Cobalt Blue</TactileButton>
                    <TactileButton variant="tangerine">Tangerine</TactileButton>
                    <TactileButton variant="ochre">Warm Ochre</TactileButton>
                    <TactileButton variant="sunny">Sunny Gold</TactileButton>
                    <TactileButton variant="danger">Danger / Minus</TactileButton>
                  </div>

                  <div className="pt-3 border-t border-[#1E1E24]/10 space-y-2.5">
                    <p className="text-xs font-extrabold uppercase text-[#64616C]">Ukuran Tombol (sm / md / lg / icon)</p>
                    <div className="flex flex-wrap items-center gap-3">
                      <TactileButton variant="emerald" size="sm">Small Button</TactileButton>
                      <TactileButton variant="cobalt" size="md">Medium Button</TactileButton>
                      <TactileButton variant="tangerine" size="lg">Large Action</TactileButton>
                      <TactileButton variant="sunny" size="icon" aria-label="Star">
                        <Star className="w-5 h-5" />
                      </TactileButton>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tactile Card Container Templates */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="rounded-[28px] bg-[#158467] text-white p-5 shadow-[0_8px_0_rgba(30,30,36,0.12)] border-[3px] border-[#1E1E24]/10">
                  <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold">Game Card Container</span>
                  <h4 className="font-display text-2xl font-bold mt-3">Mode Tim / Individu</h4>
                  <p className="text-sm text-white/85 mt-1">Border tebal lembut, sudut 28px, bayangan solid 8px di bawah.</p>
                </div>
                <div className="tactile-card bg-white p-5">
                  <span className="px-3 py-1 rounded-full bg-[#F2ECE1] text-[#1E1E24] text-xs font-extrabold">Surface Card</span>
                  <h4 className="font-display text-2xl font-bold mt-3">Panel Setup & Skor</h4>
                  <p className="text-sm text-[#64616C] mt-1">Kontras tinggi di atas latar Warm Cream #FAF7F2.</p>
                </div>
                <div className="rounded-[28px] bg-[#FFE8DF] border-[3px] border-[#EC5A29] p-5 shadow-[0_8px_0_rgba(236,90,41,0.18)]">
                  <span className="px-3 py-1 rounded-full bg-[#EC5A29] text-white text-xs font-extrabold">Alert / Chaos Card</span>
                  <h4 className="font-display text-2xl font-bold text-[#1E1E24] mt-3">Kartu Tantangan</h4>
                  <p className="text-sm text-[#7C2D12] font-semibold mt-1">Untuk Chaos Card debat atau pengumuman hukuman tim kalah.</p>
                </div>
              </div>
            </motion.section>
          )}

          {/* ================================================================= */}
          {/* TAB 2: 20 UNIQUE CHARACTER PACK (DUAL STYLE + LOTTIE JSON EXPORT) */}
          {/* ================================================================= */}
          {activeTab === 'characters' && (
            <motion.section
              key="tab-chars"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-6"
            >
              {/* Style Comparison & Global Mood Control Bar */}
              <div className="tactile-card bg-white p-5 sm:p-6 space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-[#E0EBFF] text-[#2568EF] text-xs font-extrabold uppercase mb-1.5">
                      20 KARAKTER UNIK • 2 GAYA VISUAL BERBEDA
                    </span>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold">
                      Profil Pemain (Abstract Badge) vs Mascot Game (Grok Bot / Cue)
                    </h2>
                    <p className="text-xs sm:text-sm text-[#64616C] font-medium mt-1 max-w-2xl">
                      <strong>Style A (Profil Pemain)</strong> memakai siluet geometris abstrak di dalam bingkai lingkaran hitam pekat dengan wajah minimalis. <strong>Style B (Mascot Game)</strong> tampil bebas melayang dengan mata pil putih bercahaya yang berkedip & melirik halus.
                    </p>
                  </div>

                  {/* Style View Switcher */}
                  <div className="flex flex-wrap items-center gap-2">
                    {(
                      [
                        { id: 'compare', label: 'Bandingkan A & B' },
                        { id: 'profile', label: 'Style A: Profil' },
                        { id: 'mascot', label: 'Style B: Mascot' },
                      ] as const
                    ).map((m) => (
                      <button
                        key={m.id}
                        onClick={() => {
                          sfx.playPop();
                          setCharViewMode(m.id);
                        }}
                        className={`px-3.5 py-2 rounded-full text-xs font-extrabold cursor-pointer transition ${
                          charViewMode === m.id
                            ? 'bg-[#1E1E24] text-white shadow-xs'
                            : 'bg-[#F2ECE1] text-[#64616C] hover:text-[#1E1E24]'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Global Live Mood Animator Switcher */}
                <div className="pt-4 border-t border-[#1E1E24]/10 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-extrabold uppercase text-[#64616C] mr-1">
                      Mood Animasi Live:
                    </span>
                    {(
                      [
                        { id: 'idle', label: '😌 Idle (Kedip)' },
                        { id: 'happy', label: '😄 Happy' },
                        { id: 'thinking', label: '🤔 Thinking' },
                        { id: 'shocked', label: '😮 Shocked' },
                        { id: 'winner', label: '🏆 Winner' },
                        { id: 'dizzy', label: '😵 Dizzy' },
                      ] as { id: CharacterMood; label: string }[]
                    ).map((mood) => (
                      <button
                        key={mood.id}
                        onClick={() => {
                          sfx.playPop(580);
                          setGlobalMood(mood.id);
                        }}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold cursor-pointer transition ${
                          globalMood === mood.id
                            ? 'bg-[#158467] text-white shadow-xs'
                            : 'bg-[#FAF7F2] border border-[#1E1E24]/12 text-[#1E1E24] hover:bg-[#F2ECE1]'
                        }`}
                      >
                        {mood.label}
                      </button>
                    ))}
                  </div>

                  {charViewMode !== 'profile' && (
                    <button
                      onClick={() => {
                        sfx.playPop();
                        setStickerBorder(!stickerBorder);
                      }}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold cursor-pointer border-2 transition ${
                        stickerBorder
                          ? 'bg-[#FDE68A] border-[#1E1E24] text-[#1E1E24]'
                          : 'bg-[#FAF7F2] border-[#1E1E24]/15 text-[#64616C]'
                      }`}
                    >
                      Sticker Contour: {stickerBorder ? 'ON' : 'OFF'}
                    </button>
                  )}
                </div>
              </div>

              {/* 20 Unique Characters Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {CHARACTER_PACK.map((char) => (
                  <div
                    key={char.id}
                    className="tactile-card bg-white p-4 flex flex-col justify-between gap-3 hover:border-[#1E1E24]/30 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          style={{ backgroundColor: char.color }}
                          className="w-6 h-6 rounded-full text-[11px] font-display font-bold text-[#1E1E24] flex items-center justify-center shadow-xs"
                        >
                          {char.index}
                        </span>
                        <div>
                          <h3 className="font-display font-bold text-base leading-tight">{char.name}</h3>
                          <p className="text-[11px] text-[#64616C] font-semibold">{char.tagline}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-[#64616C] bg-[#F2ECE1] px-2 py-0.5 rounded-full">
                        {char.id}
                      </span>
                    </div>

                    {/* Dual Style Stage */}
                    <div className="rounded-[22px] bg-[#FAF7F2] border border-[#1E1E24]/8 p-3.5 flex items-center justify-around min-h-[126px]">
                      {(charViewMode === 'compare' || charViewMode === 'profile') && (
                        <div className="flex flex-col items-center gap-1.5">
                          <PlayerProfileAvatar
                            character={char}
                            size={charViewMode === 'profile' ? 96 : 74}
                            mood={globalMood}
                          />
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#64616C]">
                            Profil
                          </span>
                        </div>
                      )}

                      {charViewMode === 'compare' && (
                        <div className="h-14 w-[2px] bg-[#1E1E24]/10 rounded-full" />
                      )}

                      {(charViewMode === 'compare' || charViewMode === 'mascot') && (
                        <div className="flex flex-col items-center gap-1.5">
                          <GameMascotBot
                            character={char}
                            size={charViewMode === 'mascot' ? 100 : 78}
                            mood={globalMood}
                            stickerBorder={stickerBorder}
                            showCrown={globalMood === 'winner'}
                          />
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#158467]">
                            Mascot Bot
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Copy Lottie JSON Actions */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          sfx.playPop();
                          setLottieModal({
                            title: `${char.name} — Profil Avatar (${globalMood})`,
                            json: generateCharacterLottieJSON(char, 'profile', globalMood),
                          });
                        }}
                        className="px-2.5 py-2 rounded-xl bg-[#F2ECE1] hover:bg-[#1E1E24] hover:text-white text-[11px] font-bold flex items-center justify-center gap-1 transition cursor-pointer"
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>Lottie Profil</span>
                      </button>
                      <button
                        onClick={() => {
                          sfx.playPop();
                          setLottieModal({
                            title: `${char.name} — Mascot Bot (${globalMood})`,
                            json: generateCharacterLottieJSON(char, 'mascot', globalMood),
                          });
                        }}
                        className="px-2.5 py-2 rounded-xl bg-[#D6F5EC] hover:bg-[#158467] hover:text-white text-[#158467] text-[11px] font-bold flex items-center justify-center gap-1 transition cursor-pointer"
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>Lottie Bot</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* ================================================================= */}
          {/* TAB 3: LOTTIE & MOTION STUDIO                                     */}
          {/* ================================================================= */}
          {activeTab === 'motion-studio' && (
            <motion.section
              key="tab-studio"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-6"
            >
              {/* 1. Concentric Circles Room Start Transition Card */}
              <div className="tactile-card bg-white p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#FFE8DF] text-[#EC5A29] text-xs font-extrabold uppercase">
                    ROOM START TRANSITION • LOTTIE READY
                  </span>
                  <h2 className="font-display text-3xl font-bold leading-tight">
                    Transisi Lingkaran Bertumpuk dari Tengah
                  </h2>
                  <p className="text-sm text-[#64616C] font-medium">
                    Animasi pembuka saat room dimulai atau berpindah game: 6 lapis lingkaran warna-warni mengembang serempak dari pusat dengan kurva bezier cepat-halus lalu membuka layar game baru!
                  </p>

                  <div className="space-y-2">
                    <label className="block text-xs font-extrabold uppercase text-[#64616C]">
                      Judul Room / Game di Tengah Transisi:
                    </label>
                    <input
                      value={transitionTitle}
                      onChange={(e) => setTransitionTitle(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-[#F2ECE1] font-display font-bold text-base outline-none border-2 border-transparent focus:border-[#1E1E24]"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    <TactileButton
                      variant="tangerine"
                      onClick={() => setTransitionOpen(true)}
                    >
                      <Play className="w-4 h-4" />
                      <span>Play Fullscreen Transition</span>
                    </TactileButton>
                    <TactileButton
                      variant="cream"
                      onClick={() =>
                        setLottieModal({
                          title: `RoomStart_ConcentricCircles`,
                          json: generateRoomTransitionLottieJSON(transitionTitle),
                        })
                      }
                    >
                      <Code2 className="w-4 h-4" />
                      <span>Copy Lottie JSON</span>
                    </TactileButton>
                  </div>
                </div>

                {/* Live Mini Preview Box of Concentric Circles */}
                <div className="lg:col-span-7">
                  <div className="relative h-72 rounded-[28px] bg-[#1E1E24] overflow-hidden flex items-center justify-center border-[3px] border-[#1E1E24]">
                    {RING_PALETTE.map((hex, i) => (
                      <motion.div
                        key={hex}
                        animate={{ scale: [0, 1.45, 1.45, 0] }}
                        transition={{
                          duration: 3.6,
                          repeat: Infinity,
                          delay: i * 0.14,
                          times: [0, 0.4, 0.72, 1],
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        style={{ backgroundColor: hex, width: 340, height: 340 }}
                        className="absolute rounded-full"
                      />
                    ))}
                    <motion.div
                      animate={{ scale: [0.7, 1.04, 1, 0.7], opacity: [0, 1, 1, 0] }}
                      transition={{ duration: 3.6, repeat: Infinity, times: [0.15, 0.35, 0.7, 0.88] }}
                      className="relative z-10 text-center px-4"
                    >
                      <span className="px-3 py-1 rounded-full bg-[#1E1E24] text-[#FBBF24] text-[10px] font-extrabold uppercase">
                        LIVE LOOP PREVIEW
                      </span>
                      <p className="font-display text-2xl sm:text-3xl font-bold text-[#1E1E24] mt-1">
                        {transitionTitle || 'PARTY ROOM'}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* 2. Winner Celebration & Game End Animations Side-by-Side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Winner Celebration Motion Card */}
                <div className="tactile-card bg-white p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-extrabold uppercase text-[#D97706]">
                        WINNER CELEBRATION • CONFETTI BURST
                      </span>
                      <h3 className="font-display text-2xl font-bold">Animasi Juara & Trophy</h3>
                    </div>
                    <div className="flex gap-2">
                      <TactileButton
                        variant="sunny"
                        size="sm"
                        onClick={() => {
                          sfx.playFanfare();
                          setStudioWinnerKey((k) => k + 1);
                        }}
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Replay</span>
                      </TactileButton>
                      <TactileButton
                        variant="cream"
                        size="sm"
                        onClick={() =>
                          setLottieModal({
                            title: 'Winner_Trophy_Confetti_Burst',
                            json: generateSceneLottieJSON('winner'),
                          })
                        }
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>JSON</span>
                      </TactileButton>
                    </div>
                  </div>

                  <div
                    key={studioWinnerKey}
                    className="relative h-72 rounded-[26px] bg-gradient-to-b from-[#1E1E24] to-[#2C2440] overflow-hidden flex flex-col items-center justify-center text-white p-4"
                  >
                    <ConfettiShower active />

                    {/* Rotating Sunburst Aura */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
                      className="absolute w-64 h-64 rounded-full border-[14px] border-dashed border-[#FBBF24]/20"
                    />

                    {/* Trophy & Winner Bot Anticipation Pop */}
                    <motion.div
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: [0, 1.18, 0.94, 1], rotate: [-20, 8, -3, 0] }}
                      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                      className="relative z-10 flex flex-col items-center"
                    >
                      <div className="relative">
                        <GameMascotBot
                          character={CHARACTER_PACK[16]}
                          size={104}
                          mood="winner"
                          showCrown
                        />
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.35, type: 'spring' }}
                          className="absolute -right-4 bottom-0 w-11 h-11 rounded-full bg-[#FBBF24] text-[#1E1E24] flex items-center justify-center shadow-lg border-2 border-[#1E1E24]"
                        >
                          <Trophy className="w-5 h-5" />
                        </motion.div>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-3 text-center"
                      >
                        <span className="px-3 py-0.5 rounded-full bg-[#FBBF24] text-[#1E1E24] text-[10px] font-extrabold uppercase tracking-wider">
                          CHAMPION OF THE ROUND
                        </span>
                        <h4 className="font-display text-3xl font-bold mt-1">PEMENANG!</h4>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>

                {/* Game End Curtain & Badge Motion Card */}
                <div className="tactile-card bg-white p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-extrabold uppercase text-[#2568EF]">
                        GAME END • CURTAIN & RIBBON REVEAL
                      </span>
                      <h3 className="font-display text-2xl font-bold">Animasi Game Selesai</h3>
                    </div>
                    <div className="flex gap-2">
                      <TactileButton
                        variant="cobalt"
                        size="sm"
                        onClick={() => {
                          sfx.playWhoosh();
                          setStudioEndKey((k) => k + 1);
                        }}
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Replay</span>
                      </TactileButton>
                      <TactileButton
                        variant="cream"
                        size="sm"
                        onClick={() =>
                          setLottieModal({
                            title: 'Game_End_Curtain_Ribbon',
                            json: generateSceneLottieJSON('game_end'),
                          })
                        }
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>JSON</span>
                      </TactileButton>
                    </div>
                  </div>

                  <div
                    key={studioEndKey}
                    className="relative h-72 rounded-[26px] bg-[#2568EF] overflow-hidden flex flex-col items-center justify-center text-white p-4"
                  >
                    {/* Split Curtain Panels Sliding In */}
                    <motion.div
                      initial={{ x: '-100%' }}
                      animate={{ x: '-58%' }}
                      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-y-0 left-0 w-full bg-[#1E1E24] -skew-x-12"
                    />
                    <motion.div
                      initial={{ x: '100%' }}
                      animate={{ x: '58%' }}
                      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-y-0 right-0 w-full bg-[#158467] -skew-x-12"
                    />

                    {/* Center Badge Pop */}
                    <motion.div
                      initial={{ scale: 0.4, opacity: 0, rotate: -10 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      transition={{ delay: 0.28, type: 'spring', stiffness: 260, damping: 16 }}
                      className="relative z-10 bg-[#FAF7F2] text-[#1E1E24] rounded-[28px] px-7 py-5 border-[4px] border-[#1E1E24] shadow-[0_8px_0_#1E1E24] text-center"
                    >
                      <span className="inline-block px-3 py-0.5 rounded-full bg-[#C82373] text-white text-[10px] font-extrabold uppercase mb-1">
                        WAKTU HABIS • RONDE SELESAI
                      </span>
                      <h4 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
                        GAME END!
                      </h4>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <GameMascotBot character={CHARACTER_PACK[3]} size={44} mood="happy" />
                        <GameMascotBot character={CHARACTER_PACK[11]} size={44} mood="shocked" />
                        <GameMascotBot character={CHARACTER_PACK[7]} size={44} mood="happy" />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* ================================================================= */}
          {/* TAB 4: END-GAME PODIUM (1-2-3) & PUNISHMENT CARD SHUFFLE          */}
          {/* ================================================================= */}
          {activeTab === 'podium-punishment' && (
            <motion.section
              key="tab-podium"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-8"
            >
              {/* PART A: ANIMATED 1-2-3 LEADERBOARD PODIUM WITH MASCOTS & CONFETTI */}
              <div className="rounded-[36px] bg-[#1E1E24] text-white p-6 sm:p-8 relative overflow-hidden shadow-[0_12px_0_rgba(30,30,36,0.16)]">
                <ConfettiShower active />

                <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 mb-6">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBBF24] text-[#1E1E24] text-[11px] font-extrabold uppercase">
                      <Crown className="w-3.5 h-3.5" />
                      <span>GRAND ROOM PODIUM • DATA LIVE CACHE</span>
                    </span>
                    <h2 className="font-display text-2xl sm:text-4xl font-bold mt-1.5">
                      Juara Room: {room.roomName}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <TactileButton
                      variant="sunny"
                      size="sm"
                      onClick={() => {
                        sfx.playFanfare();
                        setPodiumRevealKey((k) => k + 1);
                      }}
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Replay Podium Reveal</span>
                    </TactileButton>
                    <TactileButton
                      variant="cream"
                      size="sm"
                      onClick={() =>
                        setLottieModal({
                          title: 'Leaderboard_Podium_123_Reveal',
                          json: generateSceneLottieJSON('podium'),
                        })
                      }
                    >
                      <Code2 className="w-4 h-4" />
                      <span>Lottie JSON</span>
                    </TactileButton>
                  </div>
                </div>

                {/* Staggered 2nd - 1st - 3rd Pedestals (Reveals in order: 3rd -> 2nd -> 1st!) */}
                <div
                  key={podiumRevealKey}
                  className="relative z-20 grid grid-cols-3 items-end gap-2 sm:gap-5 max-w-3xl mx-auto pt-8 pb-2"
                >
                  {/* RANK 2 (Left) - reveals 2nd */}
                  {(() => {
                    const p2 = top3Players[1];
                    const char2 = getChar(p2.avatarId);
                    return (
                      <div className="flex flex-col items-center">
                        <motion.div
                          initial={{ opacity: 0, y: 30, scale: 0.7 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ delay: 0.75, type: 'spring', stiffness: 220, damping: 16 }}
                          className="flex flex-col items-center mb-2 text-center"
                        >
                          <GameMascotBot character={char2} size={82} mood="happy" />
                          <p className="font-display font-bold text-base sm:text-xl mt-1 leading-tight">
                            {p2.name}
                          </p>
                          <span className="text-[11px] text-white/70 font-semibold">{p2.team}</span>
                          <span className="mt-1 px-3 py-0.5 rounded-full bg-white text-[#1E1E24] font-display font-bold text-xs sm:text-sm">
                            {p2.roomScore} pts
                          </span>
                        </motion.div>

                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 132 }}
                          transition={{ delay: 0.55, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                          className="w-full rounded-t-[26px] bg-[#FAF7F2] text-[#1E1E24] flex flex-col items-center justify-start pt-4 shadow-inner overflow-hidden"
                        >
                          <span className="w-10 h-10 rounded-full bg-[#1E1E24] text-white font-display text-xl font-bold flex items-center justify-center">
                            2
                          </span>
                          <span className="text-[11px] font-extrabold uppercase tracking-wider mt-2 text-[#64616C]">
                            RUNNER UP
                          </span>
                        </motion.div>
                      </div>
                    );
                  })()}

                  {/* RANK 1 (Center) - reveals LAST for dramatic hype */}
                  {(() => {
                    const p1 = top3Players[0];
                    const char1 = getChar(p1.avatarId);
                    return (
                      <div className="flex flex-col items-center">
                        <motion.div
                          initial={{ opacity: 0, y: 40, scale: 0.5 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ delay: 1.35, type: 'spring', stiffness: 240, damping: 15 }}
                          className="flex flex-col items-center mb-2 text-center"
                        >
                          <GameMascotBot character={char1} size={102} mood="winner" showCrown />
                          <p className="font-display font-bold text-lg sm:text-2xl mt-1 text-[#FBBF24] leading-tight">
                            {p1.name}
                          </p>
                          <span className="text-[11px] text-white/75 font-semibold">{p1.team}</span>
                          <span className="mt-1 px-3.5 py-0.5 rounded-full bg-[#FBBF24] text-[#1E1E24] font-display font-bold text-sm sm:text-base shadow-md">
                            {p1.roomScore} pts
                          </span>
                        </motion.div>

                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 184 }}
                          transition={{ delay: 1.15, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                          className="w-full rounded-t-[28px] bg-[#FBBF24] text-[#1E1E24] flex flex-col items-center justify-start pt-5 shadow-lg overflow-hidden"
                        >
                          <span className="w-12 h-12 rounded-full bg-[#1E1E24] text-[#FBBF24] font-display text-2xl font-bold flex items-center justify-center shadow-md">
                            1
                          </span>
                          <span className="text-xs font-extrabold uppercase tracking-wider mt-2">
                            CHAMPION
                          </span>
                          <Trophy className="w-6 h-6 mt-2 opacity-60" />
                        </motion.div>
                      </div>
                    );
                  })()}

                  {/* RANK 3 (Right) - reveals 1st */}
                  {(() => {
                    const p3 = top3Players[2];
                    const char3 = getChar(p3.avatarId);
                    return (
                      <div className="flex flex-col items-center">
                        <motion.div
                          initial={{ opacity: 0, y: 24, scale: 0.7 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ delay: 0.25, type: 'spring', stiffness: 220, damping: 16 }}
                          className="flex flex-col items-center mb-2 text-center"
                        >
                          <GameMascotBot character={char3} size={76} mood="idle" />
                          <p className="font-display font-bold text-base sm:text-xl mt-1 leading-tight">
                            {p3.name}
                          </p>
                          <span className="text-[11px] text-white/70 font-semibold">{p3.team}</span>
                          <span className="mt-1 px-3 py-0.5 rounded-full bg-[#FFE8DF] text-[#1E1E24] font-display font-bold text-xs sm:text-sm">
                            {p3.roomScore} pts
                          </span>
                        </motion.div>

                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 96 }}
                          transition={{ delay: 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                          className="w-full rounded-t-[26px] bg-[#EC5A29] text-white flex flex-col items-center justify-start pt-3.5 overflow-hidden"
                        >
                          <span className="w-9 h-9 rounded-full bg-[#1E1E24] text-white font-display text-lg font-bold flex items-center justify-center">
                            3
                          </span>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider mt-1.5 opacity-90">
                            3RD PLACE
                          </span>
                        </motion.div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* PART B: PUNISHMENT CARD SHUFFLE (FOR LOSING TEAM / PLAYERS) */}
              <div className="tactile-card bg-white p-6 sm:p-8 space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE4E2] text-[#B42318] text-xs font-extrabold uppercase mb-2">
                      <Flame className="w-3.5 h-3.5" />
                      <span>KARTU HUKUMAN TIM KALAH • 14 KARTU KOCAK</span>
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold">
                      Shuffle Kartu Hukuman
                    </h3>
                    <p className="text-sm text-[#64616C] font-medium mt-1">
                      Tim atau pemain dengan poin terbawah wajib menerima 1 kartu hukuman acak untuk game berikutnya!
                    </p>
                  </div>

                  {/* Losing Team Target Pill (Live Synced from Room Leaderboard) */}
                  <div className="rounded-2xl bg-[#FAF7F2] border-2 border-[#F04438]/30 px-4 py-3 flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {losingTeamInfo.members.slice(0, 3).map((m) => (
                        <PlayerProfileAvatar key={m.id} character={getChar(m.avatarId)} size={38} mood="dizzy" />
                      ))}
                    </div>
                    <div>
                      <p className="text-[11px] font-extrabold uppercase text-[#F04438]">
                        TARGET HUKUMAN SAAT INI
                      </p>
                      <p className="font-display font-bold text-sm text-[#1E1E24]">
                        {losingTeamInfo.label} ({losingTeamInfo.members.map((m) => m.name).join(', ')})
                      </p>
                    </div>
                  </div>
                </div>

                {/* Filter Intensity Pills */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-extrabold uppercase text-[#64616C]">Level Hukuman:</span>
                    {(['Semua', 'Santai', 'Kocak', 'Chaos'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => {
                          sfx.playPop();
                          setPunishmentFilter(lvl);
                        }}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold cursor-pointer transition ${
                          punishmentFilter === lvl
                            ? 'bg-[#1E1E24] text-white'
                            : 'bg-[#F2ECE1] text-[#64616C] hover:text-[#1E1E24]'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>

                  <TactileButton
                    variant="cream"
                    size="sm"
                    onClick={() =>
                      setLottieModal({
                        title: 'Punishment_Card_Shuffle_Flip',
                        json: generateSceneLottieJSON('punishment_shuffle'),
                      })
                    }
                  >
                    <Code2 className="w-4 h-4" />
                    <span>Copy Punishment Lottie JSON</span>
                  </TactileButton>
                </div>

                {/* Animated Stacked Shuffle Deck & 3D Flip Reveal */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  {/* Left: Visual Shuffle Stage */}
                  <div className="lg:col-span-7 flex flex-col items-center justify-center py-4 perspective-1000">
                    <div className="relative w-full max-w-md min-h-[290px] flex items-center justify-center">
                      {/* Flying Background Shuffle Cards */}
                      {[0, 1, 2, 3].map((idx) => (
                        <motion.div
                          key={idx}
                          animate={
                            isShuffling
                              ? {
                                  x: [0, (idx % 2 === 0 ? -1 : 1) * (85 + idx * 14), 0],
                                  y: [0, (idx - 1.5) * 26, 0],
                                  rotate: [0, (idx % 2 === 0 ? -18 : 18), (idx - 1.5) * 4],
                                  scale: [0.95, 1.03, 0.95],
                                }
                              : {
                                  x: (idx - 1.5) * 4,
                                  y: idx * 3,
                                  rotate: (idx - 1.5) * 2.5,
                                  scale: 0.95,
                                }
                          }
                          transition={{
                            duration: isShuffling ? 0.36 : 0.4,
                            repeat: isShuffling ? 2 : 0,
                            ease: 'easeInOut',
                          }}
                          style={{
                            backgroundColor: ['#1E1E24', '#EC5A29', '#C82373', '#2568EF'][idx],
                          }}
                          className="absolute inset-0 rounded-[30px] border-[3px] border-[#1E1E24] opacity-85 shadow-lg"
                        />
                      ))}

                      {/* Front Active Dealt Punishment Card (3D Flip) */}
                      <motion.div
                        key={activePunishment.id + String(isShuffling)}
                        initial={{ rotateY: 180, scale: 0.85 }}
                        animate={{
                          rotateY: cardFlipped && !isShuffling ? 0 : 180,
                          scale: isShuffling ? 0.88 : 1,
                        }}
                        transition={{ type: 'spring', stiffness: 180, damping: 18 }}
                        style={{ backgroundColor: activePunishment.color }}
                        className="relative z-10 w-full min-h-[290px] rounded-[30px] border-[4px] border-[#1E1E24] shadow-[0_10px_0_#1E1E24] p-6 text-white flex flex-col justify-between preserve-3d"
                      >
                        <div className="flex items-center justify-between">
                          <span className="px-3.5 py-1 rounded-full bg-[#1E1E24] text-[#FBBF24] text-xs font-extrabold uppercase">
                            {activePunishment.intensity} • {activePunishment.duration}
                          </span>
                          <span className="text-3xl">{activePunishment.emoji}</span>
                        </div>

                        <div className="my-4">
                          <p className="text-xs font-extrabold uppercase tracking-wider opacity-80 mb-1">
                            KARTU HUKUMAN TERPILIH:
                          </p>
                          <h4 className="font-display text-2xl sm:text-3xl font-bold leading-tight mb-2">
                            {activePunishment.title}
                          </h4>
                          <p className="text-sm sm:text-base font-bold leading-relaxed bg-black/20 rounded-2xl p-4 border border-white/15">
                            “{activePunishment.text}”
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-xs font-bold opacity-90">
                          <span>Berlaku untuk: {losingTeamInfo.label}</span>
                          <span>#{activePunishment.id.toUpperCase()}</span>
                        </div>
                      </motion.div>
                    </div>

                    <div className="mt-6 w-full max-w-md">
                      <TactileButton
                        variant="ink"
                        size="lg"
                        fullWidth
                        disabled={isShuffling}
                        onClick={triggerPunishmentShuffle}
                      >
                        <Shuffle className={`w-5 h-5 text-[#FBBF24] ${isShuffling ? 'animate-spin' : ''}`} />
                        <span>{isShuffling ? 'Mengocok Kartu Hukuman...' : 'Shuffle Hukuman Lagi!'}</span>
                      </TactileButton>
                    </div>
                  </div>

                  {/* Right: Quick Browse All 14 Punishment Cards */}
                  <div className="lg:col-span-5 space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                    <p className="text-xs font-extrabold uppercase text-[#64616C] sticky top-0 bg-white py-1">
                      Daftar Deck Hukuman ({PUNISHMENT_CARDS.length} Kartu — Klik untuk Preview):
                    </p>
                    {PUNISHMENT_CARDS.map((card) => (
                      <button
                        key={card.id}
                        onClick={() => {
                          sfx.playPop();
                          setActivePunishment(card);
                          setCardFlipped(true);
                        }}
                        className={`w-full text-left p-3.5 rounded-2xl border-2 transition cursor-pointer flex items-start gap-3 ${
                          activePunishment.id === card.id
                            ? 'bg-[#FFE8DF] border-[#EC5A29]'
                            : 'bg-[#FAF7F2] border-transparent hover:border-[#1E1E24]/20'
                        }`}
                      >
                        <span className="text-xl shrink-0">{card.emoji}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-display font-bold text-sm truncate">{card.title}</p>
                            <span className="px-2 py-0.5 rounded-full bg-white text-[10px] font-extrabold text-[#1E1E24] border border-[#1E1E24]/10 shrink-0">
                              {card.intensity}
                            </span>
                          </div>
                          <p className="text-xs text-[#64616C] line-clamp-2 mt-0.5">{card.text}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* ================================================================= */}
          {/* TAB 5: PERSISTENT ROOM & GAME LEADERBOARD ENGINE (LOCALSTORAGE)   */}
          {/* ================================================================= */}
          {activeTab === 'leaderboard' && (
            <motion.section
              key="tab-leaderboard"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-6"
            >
              {/* Top Cache Status & Room Controls */}
              <div className="tactile-card bg-white p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D6F5EC] text-[#158467] text-xs font-extrabold">
                      <Database className="w-3.5 h-3.5" />
                      <span>Tersimpan Otomatis di Cache Browser (localStorage)</span>
                    </span>
                    <span className="text-[11px] font-bold text-[#64616C]">
                      Sync terakhir: {room.lastUpdated} • Aman meski di-refresh!
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      value={room.roomName}
                      onChange={(e) => setRoom((prev) => ({ ...prev, roomName: e.target.value }))}
                      className="font-display text-2xl font-bold bg-transparent border-b-2 border-dashed border-[#1E1E24]/25 focus:border-[#1E1E24] outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <TactileButton variant="sunny" size="md" onClick={launchRoomEndPodium}>
                    <Trophy className="w-4 h-4" />
                    <span>Akhiri Room → Podium & Hukuman</span>
                  </TactileButton>

                  {!confirmReset ? (
                    <TactileButton variant="cream" size="md" onClick={() => setConfirmReset(true)}>
                      <RefreshCw className="w-4 h-4" />
                      <span>Reset Room</span>
                    </TactileButton>
                  ) : (
                    <div className="flex items-center gap-1.5 bg-[#FFE4E2] px-3 py-1.5 rounded-2xl border border-[#F04438]">
                      <span className="text-xs font-extrabold text-[#B42318]">Yakin reset?</span>
                      <button
                        onClick={handleResetRoom}
                        className="px-2.5 py-1 rounded-xl bg-[#F04438] text-white text-xs font-bold cursor-pointer"
                      >
                        Ya
                      </button>
                      <button
                        onClick={() => setConfirmReset(false)}
                        className="px-2.5 py-1 rounded-xl bg-white text-[#1E1E24] text-xs font-bold cursor-pointer"
                      >
                        Batal
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Game Selector Bar (Different + and - Points per Game Difficulty!) */}
              <div className="tactile-card bg-white p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="font-display text-xl font-bold">1. Pilih Game Aktif di Room Ini</h3>
                    <p className="text-xs text-[#64616C] font-semibold">
                      Setiap game punya bobot poin (+) dan penalti (-) berbeda sesuai tingkat kesulitannya!
                    </p>
                  </div>
                  <DifficultyBadge level={activeGameRule.difficulty} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                  {GAME_RULES.map((g) => {
                    const selected = room.activeGameId === g.id;
                    return (
                      <button
                        key={g.id}
                        onClick={() => {
                          sfx.playPop();
                          setRoom((prev) => ({ ...prev, activeGameId: g.id }));
                        }}
                        style={selected ? { backgroundColor: g.color, color: '#FFFFFF' } : undefined}
                        className={`p-3.5 rounded-2xl text-left border-2 transition cursor-pointer flex flex-col justify-between gap-2 ${
                          selected
                            ? 'border-[#1E1E24] shadow-[0_5px_0_#1E1E24]'
                            : 'bg-[#FAF7F2] border-[#1E1E24]/10 hover:border-[#1E1E24]/30'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                              selected ? 'bg-black/25 text-white' : 'bg-white text-[#64616C]'
                            }`}
                          >
                            {g.mode}
                          </span>
                          <span className="text-[10px] font-extrabold opacity-80">{g.difficulty}</span>
                        </div>
                        <p className="font-display font-bold text-sm leading-snug">{g.name}</p>
                      </button>
                    );
                  })}
                </div>

                {/* Active Game Rule Explanation */}
                <div
                  style={{ borderColor: activeGameRule.color }}
                  className="rounded-2xl bg-[#FAF7F2] border-l-[6px] p-4 flex flex-wrap items-center justify-between gap-3"
                >
                  <div>
                    <p className="font-display font-bold text-base">
                      Aturan Poin {activeGameRule.name} ({activeGameRule.mode})
                    </p>
                    <p className="text-xs text-[#64616C] font-semibold mt-0.5">{activeGameRule.summary}</p>
                  </div>

                  {/* Team Award Buttons (if this game supports team scoring!) */}
                  {activeGameRule.actions.some((a) => a.target === 'team') && (
                    <div className="flex flex-wrap items-center gap-2">
                      {activeGameRule.actions
                        .filter((a) => a.target === 'team')
                        .map((teamAction) =>
                          activeGameTeamRanking.map((t) => (
                            <TactileButton
                              key={`${teamAction.id}-${t.team}`}
                              variant={teamAction.variant}
                              size="sm"
                              onClick={() => handleAwardTeam(t.team, teamAction)}
                            >
                              <Users className="w-3.5 h-3.5" />
                              <span>
                                Menang {t.team} (+{teamAction.points} Tim / +{teamAction.teamBonusPerMember} Org)
                              </span>
                            </TactileButton>
                          ))
                        )}
                    </div>
                  )}
                </div>
              </div>

              {/* Dual Leaderboard Columns: LEFT = Per-Game Scoring & Board, RIGHT = Grand Room Cumulative */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* LEFT COLUMN: Per-Game Individual & Team Score Controls */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="tactile-card bg-white p-5 sm:p-6 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-extrabold uppercase text-[#2568EF]">
                          LEADERBOARD PER GAME
                        </span>
                        <h3 className="font-display text-2xl font-bold">{activeGameRule.name}</h3>
                      </div>

                      <div className="inline-flex p-1 rounded-full bg-[#F2ECE1]">
                        <button
                          onClick={() => setGameBoardSubtab('individu')}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold cursor-pointer transition ${
                            gameBoardSubtab === 'individu'
                              ? 'bg-[#1E1E24] text-white'
                              : 'text-[#64616C]'
                          }`}
                        >
                          Nilai Perorangan
                        </button>
                        <button
                          onClick={() => setGameBoardSubtab('kelompok')}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold cursor-pointer transition ${
                            gameBoardSubtab === 'kelompok'
                              ? 'bg-[#1E1E24] text-white'
                              : 'text-[#64616C]'
                          }`}
                        >
                          Nilai Kelompok
                        </button>
                      </div>
                    </div>

                    {gameBoardSubtab === 'individu' ? (
                      <div className="space-y-3">
                        {activeGamePlayerRanking.map((p, idx) => (
                          <div
                            key={p.id}
                            className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#1E1E24]/10 flex flex-wrap items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-display font-bold text-sm w-6 text-center text-[#64616C]">
                                #{idx + 1}
                              </span>
                              <PlayerProfileAvatar character={getChar(p.avatarId)} size={44} />
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-display font-bold text-base leading-tight">{p.name}</p>
                                  <span className="px-2 py-0.5 rounded-full bg-white border border-[#1E1E24]/10 text-[10px] font-bold text-[#64616C]">
                                    {p.team}
                                  </span>
                                </div>
                                <p className="text-xs font-bold text-[#158467]">
                                  Skor Game Ini: {p.gameScore} pts • Total Room: {p.roomScore} pts
                                </p>
                              </div>
                            </div>

                            {/* Individual + / - Action Buttons matching active game difficulty */}
                            <div className="flex flex-wrap items-center gap-1.5">
                              {activeGameRule.actions
                                .filter((a) => a.target === 'player')
                                .map((act) => (
                                  <TactileButton
                                    key={act.id}
                                    variant={act.variant}
                                    size="sm"
                                    onClick={() => handleAwardPlayer(p, act)}
                                  >
                                    <span>{act.label}</span>
                                  </TactileButton>
                                ))}
                              <button
                                onClick={() => handleRemovePlayer(p.id)}
                                title="Hapus pemain"
                                className="p-2 text-[#64616C] hover:text-[#F04438] cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {activeGameTeamRanking.map((t, idx) => (
                          <div
                            key={t.team}
                            className="p-4 rounded-2xl bg-[#FAF7F2] border-2 border-[#1E1E24]/10 flex flex-wrap items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-9 h-9 rounded-full bg-[#1E1E24] text-[#FBBF24] font-display font-bold flex items-center justify-center">
                                #{idx + 1}
                              </span>
                              <div>
                                <p className="font-display font-bold text-lg">{t.team}</p>
                                <p className="text-xs text-[#64616C] font-semibold">
                                  Anggota: {t.members.map((m) => m.name).join(', ')}
                                </p>
                              </div>
                            </div>
                            <span className="px-4 py-1.5 rounded-full bg-white border-2 border-[#1E1E24]/15 font-display font-bold text-lg">
                              {t.teamScore} pts
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add New Player with 20 Avatar Picker */}
                  <div className="tactile-card bg-white p-5 space-y-3">
                    <h4 className="font-display font-bold text-lg">Tambah Pemain ke Room</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <input
                        value={newPlayerName}
                        onChange={(e) => setNewPlayerName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddPlayer()}
                        placeholder="Nama pemain baru..."
                        className="px-4 py-2.5 rounded-2xl bg-[#F2ECE1] font-bold text-sm outline-none"
                      />
                      <input
                        value={newPlayerTeam}
                        onChange={(e) => setNewPlayerTeam(e.target.value)}
                        placeholder="Nama kubu/tim..."
                        className="px-4 py-2.5 rounded-2xl bg-[#F2ECE1] font-bold text-sm outline-none"
                      />
                      <TactileButton variant="emerald" onClick={handleAddPlayer}>
                        <Plus className="w-4 h-4" />
                        <span>Tambah Pemain</span>
                      </TactileButton>
                    </div>

                    {/* Mini Avatar Selector Strip */}
                    <div>
                      <p className="text-[11px] font-extrabold uppercase text-[#64616C] mb-2">
                        Pilih Avatar Profil (20 Variasi):
                      </p>
                      <div className="flex items-center gap-2 overflow-x-auto pb-2">
                        {CHARACTER_PACK.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => {
                              sfx.playPop();
                              setNewPlayerAvatar(c.id);
                            }}
                            className={`p-1 rounded-full shrink-0 transition cursor-pointer ${
                              newPlayerAvatar === c.id
                                ? 'ring-3 ring-[#EC5A29] scale-105'
                                : 'opacity-70 hover:opacity-100'
                            }`}
                          >
                            <PlayerProfileAvatar character={c} size={38} animated={false} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: Grand Cumulative Room Leaderboard & Score History */}
                <div className="lg:col-span-5 space-y-5">
                  <div className="rounded-[32px] bg-[#488B76] text-white p-6 shadow-[0_8px_0_rgba(30,30,36,0.12)] border-[3px] border-[#1E1E24]/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Crown className="w-6 h-6 text-[#FBBF24]" />
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-white/80">
                            AKUMULASI SEMUA GAME
                          </span>
                          <h3 className="font-display text-2xl font-bold leading-none">
                            Grand Room Leaderboard
                          </h3>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {sortedRoomPlayers.map((p, idx) => {
                        const rowBg =
                          idx === 0
                            ? 'bg-[#FBBF24] text-[#1E1E24]'
                            : idx === 1
                            ? 'bg-[#FAF7F2] text-[#1E1E24]'
                            : idx === 2
                            ? 'bg-[#F9A8B8] text-[#1E1E24]'
                            : 'bg-[#356B5A] text-white border border-white/15';
                        return (
                          <motion.div
                            layout
                            key={p.id}
                            className={`flex items-center justify-between px-3.5 py-3 rounded-[20px] font-bold shadow-xs ${rowBg}`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="font-display text-base w-7 text-center">#{idx + 1}</span>
                              <GameMascotBot
                                character={getChar(p.avatarId)}
                                size={40}
                                mood={idx === 0 ? 'winner' : 'idle'}
                                stickerBorder={false}
                                showCrown={idx === 0}
                              />
                              <div>
                                <p className="text-sm font-bold leading-tight">{p.name}</p>
                                <p className="text-[11px] opacity-75">{p.team}</p>
                              </div>
                            </div>
                            <span className="px-3.5 py-1 rounded-full bg-white text-[#1E1E24] font-display font-bold text-sm">
                              {p.roomScore} pts
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>

                    <TactileButton variant="ink" fullWidth onClick={launchRoomEndPodium}>
                      <span>Tampilkan Podium 1-2-3 & Hukuman</span>
                      <ArrowRight className="w-4 h-4" />
                    </TactileButton>
                  </div>

                  {/* Live Activity Log */}
                  <div className="tactile-card bg-white p-5 space-y-3">
                    <h4 className="font-display font-bold text-base flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#EC5A29]" />
                      <span>Riwayat Poin Room (Tersimpan)</span>
                    </h4>
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {room.logs.map((log) => (
                        <div
                          key={log.id}
                          className="p-2.5 rounded-xl bg-[#FAF7F2] flex items-center justify-between gap-2 text-xs"
                        >
                          <div className="min-w-0">
                            <span className="font-extrabold text-[#64616C] mr-1.5">[{log.gameName}]</span>
                            <span className="font-semibold text-[#1E1E24]">{log.description}</span>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full font-display font-bold shrink-0 ${
                              log.isPositive
                                ? 'bg-[#D6F5EC] text-[#158467]'
                                : 'bg-[#FFE4E2] text-[#B42318]'
                            }`}
                          >
                            {log.deltaText}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
