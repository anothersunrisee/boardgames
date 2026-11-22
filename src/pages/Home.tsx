import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, RotateCcw, X, Edit3 } from 'lucide-react';
import { GameCard, type GameCardProps } from '../components/GameCard';
import { GameMascotBot } from '../components/characters/GameMascotBot';
import { PlayerProfileAvatar } from '../components/characters/PlayerProfileAvatar';
import { ConcentricRoomTransition } from '../components/motion/ConcentricRoomTransition';
import { CHARACTER_PACK, getCharacterById } from '../assets-library/characters';
import { ScoreBoard } from '../components/ScoreBoard';
import { GameOnboardingModal, type GameId } from '../components/modals/GameOnboardingModal';
import {
  PlayfulPartyFooter,
  PartyGuideModal,
  DeveloperInfoModal,
  QrisCoffeeModal,
} from '../components/PlayfulPartyFooter';
import { useGameStore } from '../store/useGameStore';
import { sfx } from '../assets-library/soundEngine';

interface GameItem extends Omit<GameCardProps, 'onSelect'> {
  id: GameId;
  route: string;
}

const GAMES: GameItem[] = [
  {
    id: 'game1',
    route: '/game1/round',
    numberBadge: 'GAME 01',
    categoryPill: 'Timer • 30 Detik',
    title: 'Same Brain? NO!',
    description: 'Semua tulis jawaban unik di kertas atau HP! Host hitung mundur 30 detik & tandai jawaban kembar.',
    playerCount: 'Semua Pemain Room',
    bgColor: '#158467',      // Emerald Green
    pillColor: '#43B896',
    characterId: 'c02',      // Kiko
    mascotMood: 'happy',
  },
  {
    id: 'game2',
    route: '/game2/secret',
    numberBadge: 'GAME 02',
    categoryPill: 'Live Interogasi',
    title: 'Beauty Expert?!',
    description: 'Sistem acak benda skincare & makeup ke tim cewek. Tim cowok interogasi live di ruangan!',
    playerCount: 'Cewek vs Cowok Room',
    bgColor: '#C82373',      // Berry Pink
    pillColor: '#EC5FA0',
    characterId: 'c12',      // Riri
    mascotMood: 'happy',
  },
  {
    id: 'game3',
    route: '/game3/secret',
    numberBadge: 'GAME 03',
    categoryPill: 'Live Interogasi',
    title: 'Boys Stuff, Girls Guess!',
    description: 'Sistem acak istilah otomotif & game ke tim cowok. Tim cewek interogasi & tebak live!',
    playerCount: 'Cowok vs Cewek Room',
    bgColor: '#2568EF',      // Cobalt Blue
    pillColor: '#5B95FF',
    characterId: 'c05',      // Zuzu
    mascotMood: 'happy',
  },
  {
    id: 'game4',
    route: '/game4/match',
    numberBadge: 'GAME 04',
    categoryPill: 'Debat 2v2 • Chaos',
    title: "The Devil's Advocate",
    description: 'Sistem mengacak duel debat 2 lawan 2 & topik absurd + Chaos Card untuk membalik keadaan!',
    playerCount: 'Duel 2 vs 2 Acak',
    bgColor: '#E85D2A',      // Warm Terracotta Orange
    pillColor: '#FF8A5B',
    characterId: 'c15',      // Bimi
    mascotMood: 'happy',
  },
  {
    id: 'game5',
    route: '/game5/setup',
    numberBadge: 'GAME 05',
    categoryPill: 'Tim Rantai • Estafet',
    title: 'Chain Quiz Relay!',
    description: 'Cerdas cermat berantai tim 3–4 orang acak. 1 orang salah, rantai putus dan poin hangus!',
    playerCount: 'Tim 3–4 Orang Acak',
    bgColor: '#7C3AED',      // Purple Violet
    pillColor: '#A78BFA',
    characterId: 'c10',      // Nori
    mascotMood: 'happy',
  },
  {
    id: 'game6',
    route: '/game6/match',
    numberBadge: 'GAME 06',
    categoryPill: 'Pitch Duel • 45s',
    title: 'Sell Me This Trash!',
    description: 'Sistem acak barang nggak guna + pembeli absurd. Adu argumen jualan tim 2 vs 2 paling masuk akal!',
    playerCount: 'Duel 2 vs 2 Acak',
    bgColor: '#65A30D',      // Lime Green
    pillColor: '#84CC16',
    characterId: 'c17',      // Juno
    mascotMood: 'winner',
  },
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const {
    roomCreated,
    roomName,
    players,
    autoStartGame1,
    autoStartGame2,
    autoStartGame3,
    autoStartGame4,
    autoStartGame5,
    autoStartGame6,
    resetRoomScores,
  } = useGameStore();

  const [showScoreModal, setShowScoreModal] = useState(false);
  const [transitionData, setTransitionData] = useState<{ active: boolean; title: string; route: string } | null>(null);
  const [onboardingGameId, setOnboardingGameId] = useState<GameId | null>(null);
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [devModalOpen, setDevModalOpen] = useState(false);
  const [qrisModalOpen, setQrisModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(sfx.muted);

  // If room has not been created or player list is empty, redirect to room registration
  useEffect(() => {
    if (!roomCreated || players.length === 0) {
      navigate('/room', { replace: true });
    }
  }, [roomCreated, players, navigate]);

  const cewekCount = players.filter((p) => p.gender === 'cewek').length;
  const cowokCount = players.filter((p) => p.gender === 'cowok').length;

  const handleGameCardClick = (gameId: GameId) => {
    sfx.playPop();
    setOnboardingGameId(gameId);
  };

  const handleConfirmStartGame = (gameId: GameId) => {
    setOnboardingGameId(null);
    handleSelectGame(gameId);
  };

  const handleToggleMute = () => {
    sfx.muted = !isMuted;
    setIsMuted(sfx.muted);
    if (!sfx.muted) sfx.playPop();
  };

  const openGuideModal = () => {
    setDevModalOpen(false);
    setQrisModalOpen(false);
    setGuideModalOpen(true);
  };

  const openDevModal = () => {
    setGuideModalOpen(false);
    setQrisModalOpen(false);
    setDevModalOpen(true);
  };

  const openQrisModal = () => {
    setGuideModalOpen(false);
    setDevModalOpen(false);
    setQrisModalOpen(true);
  };

  const handleSelectGame = (gameId: GameId) => {
    sfx.playWhoosh();
    const game = GAMES.find((g) => g.id === gameId);
    const title = game?.title.toUpperCase() || 'MINI GAME';

    if (gameId === 'game1') {
      autoStartGame1();
      setTransitionData({ active: true, title, route: '/game1/round' });
    } else if (gameId === 'game2') {
      autoStartGame2();
      setTransitionData({ active: true, title, route: '/game2/secret' });
    } else if (gameId === 'game3') {
      autoStartGame3();
      setTransitionData({ active: true, title, route: '/game3/secret' });
    } else if (gameId === 'game4') {
      autoStartGame4();
      setTransitionData({ active: true, title, route: '/game4/match' });
    } else if (gameId === 'game5') {
      const res = autoStartGame5();
      if (res && !res.success) {
        alert(res.message);
        return;
      }
      setTransitionData({ active: true, title, route: '/game5/play' });
    } else if (gameId === 'game6') {
      const res = autoStartGame6();
      if (res && !res.success) {
        alert(res.message);
        return;
      }
      setTransitionData({ active: true, title, route: '/game6/match' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E24] px-4 py-8 md:py-12 relative overflow-hidden">
      {/* Concentric Circles Transition Overlay when Entering any Game */}
      <ConcentricRoomTransition
        active={transitionData?.active ?? false}
        roomTitle={transitionData?.title ?? ''}
        subtitle="MEMASUKI PERMAINAN..."
        onComplete={() => {
          if (transitionData?.route) {
            navigate(transitionData.route);
          }
          setTransitionData(null);
        }}
      />

      <div className="max-w-4xl mx-auto">
        {/* Top Active Room Bar with Player Avatars Strip */}
        <div className="mb-6 p-4 md:p-5 rounded-[28px] bg-white border-2 border-[#1E1E24]/10 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            <div className="w-11 h-11 rounded-2xl bg-[#FFE8DF] flex items-center justify-center text-[#EC5A29] font-bold text-xl shrink-0">
              🏠
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-display text-base font-bold text-[#1E1E24] truncate">
                  {roomName}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#12B76A]/15 text-[#0F5E49] text-xs font-extrabold uppercase">
                  Room Aktif
                </span>
              </div>
              <p className="text-xs text-[#64616C] font-semibold mt-0.5">
                👥 {players.length} Pemain (👧 {cewekCount} Cewek • 👦 {cowokCount} Cowok)
              </p>
            </div>
          </div>

          {/* Player Avatars Strip & Room Actions */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
            <div className="flex items-center -space-x-2 overflow-hidden py-1">
              {players.slice(0, 6).map((p, idx) => (
                <PlayerProfileAvatar
                  key={p.id}
                  character={getCharacterById(p.avatarId || CHARACTER_PACK[idx % CHARACTER_PACK.length].id)}
                  size={34}
                />
              ))}
              {players.length > 6 && (
                <div className="w-8 h-8 rounded-full bg-[#1E1E24] text-white text-xs font-extrabold flex items-center justify-center border-2 border-white">
                  +{players.length - 6}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  sfx.playPop();
                  navigate('/');
                }}
                className="px-3.5 py-2 min-h-[40px] rounded-2xl text-xs font-bold bg-[#1E1E24] text-white hover:bg-[#2C2C35] flex items-center gap-1.5 cursor-pointer shadow-xs transition"
                title="Buka kembali layar Onboarding"
              >
                <span>Intro Game</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sfx.playPop();
                  navigate('/room');
                }}
                className="px-3.5 py-2 min-h-[40px] rounded-2xl text-xs font-bold bg-[#FAF7F2] text-[#1E1E24] hover:bg-black/5 border border-[#1E1E24]/15 flex items-center gap-1.5 cursor-pointer shadow-xs transition"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#2568EF]" />
                <span>Edit Room</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sfx.playPop();
                  setShowScoreModal(true);
                }}
                className="px-3.5 py-2 min-h-[40px] rounded-2xl text-xs font-bold bg-[#FCD34D] text-[#1E1E24] hover:bg-[#FBBF24] flex items-center gap-1.5 cursor-pointer shadow-xs transition"
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>Skor</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sfx.playPop();
                  navigate('/room/podium');
                }}
                className="px-4 py-2 min-h-[40px] rounded-2xl text-xs font-extrabold bg-[#B45309] text-white hover:bg-[#92400E] flex items-center gap-1.5 cursor-pointer shadow-xs transition"
              >
                <Trophy className="w-3.5 h-3.5 text-[#FDE68A]" />
                <span>Juara &amp; Podium</span>
              </button>
            </div>
          </div>
        </div>

        {/* Hero Title & Animated Grok Bot Mascot Parade */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1E1E24] text-[#FAF7F2] text-xs md:text-sm font-bold tracking-wide shadow-xs mb-3">
            <Sparkles className="w-4 h-4 text-[#FBBF24]" />
            <span>PILIH GAME • SISTEM ACAK OTOMATIS</span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-[#1E1E24] mb-3">
            Pilih Game Malam Ini!
          </h1>
          <p className="text-[#64616C] text-base md:text-lg max-w-xl mx-auto font-medium">
            Klik game yang ingin dimainkan, sistem akan langsung membagi role, mengacak barang & soal secara otomatis!
          </p>

          {/* Animated Mascot Parade with Signature Grok Pill Eyes (Kedip 60fps) */}
          <div className="flex items-center justify-center gap-3 md:gap-5 mt-5">
            <GameMascotBot character={CHARACTER_PACK[0]} mood="happy" size={54} />
            <GameMascotBot character={CHARACTER_PACK[3]} mood="happy" size={54} />
            <GameMascotBot character={CHARACTER_PACK[16]} mood="winner" showCrown size={64} />
            <GameMascotBot character={CHARACTER_PACK[4]} mood="happy" size={54} />
            <GameMascotBot character={CHARACTER_PACK[1]} mood="happy" size={54} />
          </div>
        </div>

        {/* 2-Column Responsive Category Cards (Equal Width & Equal Height) */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.08 },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 auto-rows-fr"
        >
          {GAMES.map((game) => (
            <motion.div
              key={game.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="h-full flex"
            >
              <GameCard {...game} onSelect={() => handleGameCardClick(game.id)} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Cumulative Scoreboard Modal (Refined Responsive Width & Height) */}
      <AnimatePresence>
        {showScoreModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg md:max-w-3xl lg:max-w-4xl bg-[#488B76] rounded-[36px] p-5 md:p-6 text-white shadow-2xl relative max-h-[84vh] flex flex-col justify-between overflow-hidden border-[3px] border-[#1E1E24]/10"
            >
              <button
                type="button"
                onClick={() => setShowScoreModal(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center cursor-pointer text-white z-20"
              >
                <X className="w-4 h-4 stroke-[3]" />
              </button>

              <div className="mb-4 overflow-hidden">
                <ScoreBoard players={players} title="Akumulasi Skor Room" transparent />
              </div>

              <div className="flex items-center justify-between pt-2 flex-wrap gap-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    sfx.playPop();
                    resetRoomScores();
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Poin Room</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      sfx.playPop();
                      setShowScoreModal(false);
                      navigate('/room/podium');
                    }}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-[#F59E0B] text-white hover:bg-[#D97706] cursor-pointer shadow-xs"
                  >
                    🏆 Lihat Juara Room
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowScoreModal(false)}
                    className="px-4 py-1.5 rounded-xl text-xs font-extrabold bg-[#FAF7F2] text-[#1E1E24] hover:bg-white cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Game Onboarding Rules, Scoring & Punishment Modal */}
      <GameOnboardingModal
        open={!!onboardingGameId}
        gameId={onboardingGameId}
        onClose={() => setOnboardingGameId(null)}
        onStartGame={handleConfirmStartGame}
      />

      {/* Playful Scalloped Footer with Interactive Mascot Playground */}
      <div className="mt-12 -mx-4 -mb-8 md:-mb-12">
        <PlayfulPartyFooter
          muted={isMuted}
          onToggleMute={handleToggleMute}
          onOpenGuideModal={openGuideModal}
          onOpenDevModal={openDevModal}
          onOpenQrisModal={openQrisModal}
          onSelectGame={(gId) => handleGameCardClick(gId as GameId)}
        />
      </div>

      {/* General Party Games Hub Guide & Rules Modal */}
      <PartyGuideModal
        open={guideModalOpen}
        onClose={() => setGuideModalOpen(false)}
      />

      {/* Separated Developer Info & Coffee Support Modal */}
      <DeveloperInfoModal
        open={devModalOpen}
        onClose={() => setDevModalOpen(false)}
        onOpenQris={openQrisModal}
      />

      {/* Indonesian QRIS Coffee Support Modal with Dynamic Coffee Tiers */}
      <QrisCoffeeModal
        open={qrisModalOpen}
        onClose={() => setQrisModalOpen(false)}
        onBackToDev={openDevModal}
      />
    </div>
  );
};

export default Home;
