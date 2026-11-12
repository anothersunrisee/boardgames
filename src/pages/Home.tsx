import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { GameCard, type GameCardProps } from '../components/GameCard';
import { BlobMascot } from '../components/ui/BlobMascot';
import { HostUtilityBar } from '../components/HostUtilityBar';

const GAMES: (Omit<GameCardProps, 'onSelect'> & { route: string })[] = [
  {
    route: '/game1/setup',
    numberBadge: 'GAME 01',
    categoryPill: 'Host Mode • 30s',
    title: 'Same Brain? NO!',
    description: 'Semua tulis di HP masing-masing! Host hitung mundur 30 detik & tandai jawaban kembar.',
    playerCount: '3–15 Pemain',
    bgColor: '#158467',      // Emerald Green
    pillColor: '#43B896',
    mascotShape: 'flower',
    mascotMood: 'dizzy',
    mascotColor: '#5CE6C0',
    mascotAccent: '#0F5E49',
    mascotAccessory: 'headband',
  },
  {
    route: '/game2/setup',
    numberBadge: 'GAME 02',
    categoryPill: 'Host Mode • Live',
    title: 'Beauty Expert?!',
    description: 'Host pegang benda rahasia. 3 cowok tanya 2 clue langsung di ruangan lalu tebak!',
    playerCount: '7 Cewek + 3 Cowok',
    bgColor: '#C82373',      // Berry Pink
    pillColor: '#EC5FA0',
    mascotShape: 'scallop',
    mascotMood: 'cheeky',
    mascotColor: '#FF8AC2',
    mascotAccent: '#9A1454',
    mascotAccessory: 'crown',
  },
  {
    route: '/game3/setup',
    numberBadge: 'GAME 03',
    categoryPill: 'Host Mode • Live',
    title: 'Boys Stuff, Girls Guess!',
    description: 'Host simpan istilah cowok. 7 cewek interogasi verbal & kunci tebakan live!',
    playerCount: '3 Cowok + 7 Cewek',
    bgColor: '#2568EF',      // Cobalt Blue
    pillColor: '#5B95FF',
    mascotShape: 'hexagon',
    mascotMood: 'confident',
    mascotColor: '#7CC0FF',
    mascotAccent: '#1545A8',
    mascotAccessory: 'glasses',
  },
  {
    route: '/game4/setup',
    numberBadge: 'GAME 04',
    categoryPill: 'Hot Takes 1v1',
    title: "The Devil's Advocate",
    description: 'Debat 1 lawan 1 opini super absurd (mas-mas parkir jadi presiden?) + Chaos Card kocak!',
    playerCount: '10 Pemain (5 Match)',
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

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E24] px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Top Pill Badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1E1E24] text-[#FAF7F2] text-xs md:text-sm font-bold tracking-wide shadow-xs">
            <Sparkles className="w-4 h-4 text-[#FBBF24]" />
            <span>OFFLINE PASS-THE-DEVICE PARTY GAMES</span>
          </div>
        </div>

        {/* Hero Title & Mini Mascot Parade (Headspace Check-in Vibe) */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-[#1E1E24] mb-3">
            Pilih Game Malam Ini!
          </h1>
          <p className="text-[#64616C] text-base md:text-lg max-w-xl mx-auto font-medium">
            Satu layar untuk semua. Tanpa login, tanpa ribet—langsung oper HP ke teman sebelahmu!
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

        {/* Stacked / 2-Column Responsive Category Cards */}
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
              key={game.route}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <GameCard {...game} onSelect={() => navigate(game.route)} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <HostUtilityBar />
    </div>
  );
};

export default Home;
