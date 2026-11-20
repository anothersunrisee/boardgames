import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, RotateCcw, X, Edit3 } from 'lucide-react';
import { GameCard, type GameCardProps } from '../components/GameCard';
import { BlobMascot } from '../components/ui/BlobMascot';
import { HostUtilityBar } from '../components/HostUtilityBar';
import { ScoreBoard } from '../components/ScoreBoard';
import { useGameStore } from '../store/useGameStore';
import { sfx } from '../utils/sound';

type GameId = 'game1' | 'game2' | 'game3' | 'game4';

interface GameItem extends Omit<GameCardProps, 'onSelect'> {
  id: GameId;
  route: string;
}

const GAMES: GameItem[] = [
  {
    id: 'game1',
    route: '/game1/round',
    numberBadge: 'GAME 01',
    categoryPill: 'Host Mode • 30s',
    title: 'Same Brain? NO!',
    description: 'Semua tulis di HP masing-masing! Host hitung mundur 30 detik & tandai jawaban kembar.',
    playerCount: 'Semua Pemain Room',
    bgColor: '#158467',      // Emerald Green
    pillColor: '#43B896',
    mascotShape: 'flower',
    mascotMood: 'dizzy',
    mascotColor: '#5CE6C0',
    mascotAccent: '#0F5E49',
    mascotAccessory: 'headband',
  },
  {
    id: 'game2',
    route: '/game2/secret',
    numberBadge: 'GAME 02',
    categoryPill: 'Host Mode • Live',
    title: 'Beauty Expert?!',
    description: 'Sistem otomatis acak benda skincare/makeup ke tiap cewek. 3 cowok interogasi live di ruangan!',
    playerCount: 'Cewek vs Cowok Room',
    bgColor: '#C82373',      // Berry Pink
    pillColor: '#EC5FA0',
    mascotShape: 'scallop',
    mascotMood: 'cheeky',
    mascotColor: '#FF8AC2',
    mascotAccent: '#9A1454',
    mascotAccessory: 'crown',
  },
  {
    id: 'game3',
    route: '/game3/secret',
    numberBadge: 'GAME 03',
    categoryPill: 'Host Mode • Live',
    title: 'Boys Stuff, Girls Guess!',
    description: 'Sistem otomatis acak istilah otomotif/game ke cowok. Cewek interogasi & tebak live!',
    playerCount: 'Cowok vs Cewek Room',
    bgColor: '#2568EF',      // Cobalt Blue
    pillColor: '#5B95FF',
    mascotShape: 'hexagon',
    mascotMood: 'confident',
    mascotColor: '#7CC0FF',
    mascotAccent: '#1545A8',
    mascotAccessory: 'glasses',
  },
  {
    id: 'game4',
    route: '/game4/match',
    numberBadge: 'GAME 04',
    categoryPill: 'Hot Takes 1v1',
    title: "The Devil's Advocate",
    description: 'Sistem mengacak pasangan duel 1v1 & topik absurd (mas parkir jadi presiden?) + Chaos Card kocak!',
    playerCount: 'Duel 1 vs 1 Acak',
    bgColor: '#E85D2A',      // Warm Terracotta Orange
    pillColor: '#FF8A5B',
    mascotShape: 'triangle',
    mascotMood: 'spicy',
    mascotColor: '#FFB03A',
    mascotAccent: '#B53B10',
    mascotAccessory: 'horns',
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
    resetRoomScores,
  } = useGameStore();

  const [showScoreModal, setShowScoreModal] = useState(false);

  // If room has not been created or player list is empty, redirect to room registration
  useEffect(() => {
    if (!roomCreated || players.length === 0) {
      navigate('/room', { replace: true });
    }
  }, [roomCreated, players, navigate]);

  const cewekCount = players.filter((p) => p.gender === 'cewek').length;
  const cowokCount = players.filter((p) => p.gender === 'cowok').length;

  const handleSelectGame = (gameId: GameId) => {
    sfx.playPop();

    if (gameId === 'game1') {
      autoStartGame1();
      navigate('/game1/round');
    } else if (gameId === 'game2') {
      autoStartGame2();
      navigate('/game2/secret');
    } else if (gameId === 'game3') {
      autoStartGame3();
      navigate('/game3/secret');
    } else if (gameId === 'game4') {
      autoStartGame4();
      navigate('/game4/match');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E24] px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Top Active Room Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-3 md:p-4 rounded-3xl bg-white border-2 border-[#1E1E24]/10 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#FFE8DF] flex items-center justify-center text-[#EC5A29] font-bold">
              🏠
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-sm font-bold text-[#1E1E24]">
                  {roomName}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#12B76A]/15 text-[#12B76A] text-[10px] font-extrabold uppercase">
                  Room Aktif
                </span>
              </div>
              <p className="text-xs text-[#64616C] font-semibold">
                👥 {players.length} Pemain (👧 {cewekCount} Cewek • 👦 {cowokCount} Cowok)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={() => {
                sfx.playPop();
                navigate('/room');
              }}
              className="px-3 py-1.5 rounded-2xl text-xs font-bold bg-[#FAF7F2] text-[#1E1E24] hover:bg-black/5 border border-[#1E1E24]/10 flex items-center gap-1.5 cursor-pointer shadow-xs transition"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#2568EF]" />
              <span>Edit Pemain</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sfx.playPop();
                setShowScoreModal(true);
              }}
              className="px-3 py-1.5 rounded-2xl text-xs font-bold bg-[#FCD34D] text-[#1E1E24] hover:bg-[#FBBF24] flex items-center gap-1.5 cursor-pointer shadow-xs transition"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Skor Room</span>
            </button>
          </div>
        </div>

        {/* Hero Title & Mini Mascot Parade */}
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

          {/* Mini Expressive Shape Row */}
          <div className="flex items-center justify-center gap-3 md:gap-5 mt-5">
            <BlobMascot shape="circle" mood="happy" color="#F7A1C4" size={48} />
            <BlobMascot shape="dome" mood="curious" color="#38BDF8" size={48} />
            <BlobMascot shape="pentagon" mood="excited" color="#FBBF24" size={52} />
            <BlobMascot shape="flame" mood="spicy" color="#FB7185" size={48} />
            <BlobMascot shape="scallop" mood="cheeky" color="#A78BFA" size={48} />
          </div>
        </div>

        {/* 2-Column Responsive Category Cards */}
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
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {GAMES.map((game) => (
            <motion.div
              key={game.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <GameCard {...game} onSelect={() => handleSelectGame(game.id)} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Cumulative Scoreboard Modal */}
      <AnimatePresence>
        {showScoreModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-[#488B76] rounded-[32px] p-6 text-white shadow-xl relative"
            >
              <button
                type="button"
                onClick={() => setShowScoreModal(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center cursor-pointer text-white"
              >
                <X className="w-4 h-4 stroke-[3]" />
              </button>

              <div className="mb-4">
                <ScoreBoard players={players} title="Akumulasi Skor Room" />
              </div>

              <div className="flex items-center justify-between pt-2">
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

                <button
                  type="button"
                  onClick={() => setShowScoreModal(false)}
                  className="px-5 py-2 rounded-xl text-xs font-extrabold bg-[#FCD34D] text-[#1E1E24] hover:bg-[#FBBF24] cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <HostUtilityBar />
    </div>
  );
};

export default Home;
