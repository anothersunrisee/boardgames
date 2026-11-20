import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Trophy,
  Flame,
  X,
  Play,
  Shuffle,
  Users,
  Timer,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { GameMascotBot } from '../characters/GameMascotBot';
import { CHARACTER_PACK, getCharacterById } from '../../assets-library/characters';
import { PUNISHMENT_CARDS } from '../../assets-library/punishments';
import type { PunishmentCardDef } from '../../assets-library/types';
import { FluentEmoji } from '../ui/FluentEmoji';
import { sfx } from '../../assets-library/soundEngine';

export type GameId = 'game1' | 'game2' | 'game3' | 'game4' | 'game5' | 'game6';

export interface GameOnboardingDetail {
  id: GameId;
  numberBadge: string;
  categoryPill: string;
  title: string;
  tagline: string;
  themeColor: string;
  accentColor: string;
  characterId: string;
  targetPlayers: string;
  duration: string;
  difficulty: 'Santai' | 'Seru' | 'Adu Otak' | 'Absurd & Chaos';

  // 1. CARA MAIN LENGKAP
  steps: {
    number: number;
    title: string;
    description: string;
    emoji: string;
    accentBg?: string;
  }[];

  // 2. SISTEM SKOR
  scoring: {
    label: string;
    points: string;
    type: 'positive' | 'negative' | 'bonus' | 'neutral';
    desc: string;
  }[];
  scoringNote: string;

  // 3. ATURAN HUKUMAN
  punishmentWho: string;
  punishmentRule: string;
  recommendedPunishments: string[];
}

export const GAME_ONBOARDING_DATA: Record<GameId, GameOnboardingDetail> = {
  game1: {
    id: 'game1',
    numberBadge: 'GAME 01',
    categoryPill: 'Host Mode • 30s',
    title: 'Same Brain? NO!',
    tagline: 'Semua tulis di HP masing-masing! Jawaban kembar = GUGUR. Jawaban unik beda sendiri = MENANG!',
    themeColor: '#158467',
    accentColor: '#43B896',
    characterId: 'c02',
    targetPlayers: 'Semua Pemain Room (Individu)',
    duration: '30 Detik per Ronde',
    difficulty: 'Seru',
    steps: [
      {
        number: 1,
        title: 'Host Buka Topik Rahasia',
        description: 'Host menekan tombol untuk memunculkan topik acak (contoh: "Sebutkan nama buah berawalan huruf M").',
        emoji: 'bullhorn',
      },
      {
        number: 2,
        title: 'Semua Ketik di HP Sendiri',
        description: 'Host memulai hitung mundur 30 detik. Semua pemain mengetik 1 jawaban di HP masing-masing tanpa boleh saling contek!',
        emoji: 'mobile',
      },
      {
        number: 3,
        title: 'Reveal Jawaban Bersama',
        description: 'Setelah waktu habis, semua pemain membacakan atau memperlihatkan jawaban secara terbuka ke ruangan.',
        emoji: 'eyes',
      },
      {
        number: 4,
        title: 'Eliminasi Jawaban Kembar!',
        description: 'Jika ada 2 orang atau lebih yang jawabannya sama (misal sama-sama "Mangga"), keduanya tereliminasi dan dapat 0 poin! Hanya jawaban unik yang menang.',
        emoji: 'cross_mark',
      },
    ],
    scoring: [
      {
        label: 'Jawaban Unik (Beda Sendiri)',
        points: '+5 Pts',
        type: 'positive',
        desc: 'Masuk langsung ke Akumulasi Skor Room Individu.',
      },
      {
        label: 'Jawaban Kembar (Same Brain)',
        points: '0 Pts',
        type: 'neutral',
        desc: 'Gagal mendapatkan poin di ronde ini.',
      },
      {
        label: 'Bonus Jawaban Paling Absurd',
        points: '+2 Pts',
        type: 'bonus',
        desc: 'Dipilih secara voting oleh Host / pemain lain di ruangan.',
      },
    ],
    scoringNote: 'Poin dihitung perorangan dan otomatis tersimpan di cache browser Room.',
    punishmentWho: 'Pemain dengan akumulasi poin terendah atau paling sering kembar jawabannya.',
    punishmentRule: 'Pemain yang kalah wajib mengambil 1 kartu hukuman acak dan menjalaninya selama ronde berikutnya!',
    recommendedPunishments: ['pun-01', 'pun-02', 'pun-04'],
  },

  game2: {
    id: 'game2',
    numberBadge: 'GAME 02',
    categoryPill: 'Host Mode • Live',
    title: 'Beauty Expert?!',
    tagline: 'Sistem otomatis acak benda skincare/makeup rahasia ke cewek. 3 Cowok interogasi live di ruangan!',
    themeColor: '#C82373',
    accentColor: '#EC5FA0',
    characterId: 'c12',
    targetPlayers: 'Kubu Cewek vs Kubu Cowok',
    duration: '60 Detik Interogasi',
    difficulty: 'Seru',
    steps: [
      {
        number: 1,
        title: 'Sistem Kunci Benda Rahasia',
        description: 'Sistem mengacak 1 nama produk skincare/makeup (contoh: "Micellar Water", "Eyelash Curler", "Sunscreen Stick") ke layar cewek secara rahasia.',
        emoji: 'lipstick',
      },
      {
        number: 2,
        title: '3 Cowok Interogasi Live',
        description: '3 Cowok perwakilan maju ke depan. Diberikan waktu 60 detik untuk menanyai cewek. Cewek HANYA boleh menjawab "Ya", "Tidak", atau "Bisa Jadi"!',
        emoji: 'detective',
      },
      {
        number: 3,
        title: 'Cowok Berembuk & Tebak',
        description: 'Waktu interogasi habis! Tim cowok berdiskusi singkat dan memutuskan 1 jawaban tebakan akhir nama produk tersebut.',
        emoji: 'brain',
      },
      {
        number: 4,
        title: 'Reveal Jawaban & Poin',
        description: 'Host membuka jawaban asli di layar. Jika cowok benar, cowok menang; jika cowok salah, cewek sukses mengelabui cowok!',
        emoji: 'party_popper',
      },
    ],
    scoring: [
      {
        label: 'Cowok Berhasil Tebak Benar',
        points: '+10 Pts Tim / +3 Pts Individu',
        type: 'positive',
        desc: '+10 Poin Kubu Cowok dan +3 Poin Room untuk 3 cowok interogator.',
      },
      {
        label: 'Cewek Sukses Mengelabui (Cowok Salah)',
        points: '+10 Pts Tim / +4 Pts Individu',
        type: 'positive',
        desc: '+10 Poin Kubu Cewek dan +4 Poin Room untuk cewek pemegang rahasia.',
      },
    ],
    scoringNote: 'Ada 2 nilai: Skor Kubu (Cewek vs Cowok) dan Skor Individu yang terakumulasi di Room.',
    punishmentWho: 'Kubu yang kalah di ronde tebakan (Cowok yang salah tebak ATAU Cewek yang bocor infonya).',
    punishmentRule: 'Kubu yang kalah wajib mengambil shuffle kartu hukuman!',
    recommendedPunishments: ['pun-02', 'pun-03', 'pun-06'],
  },

  game3: {
    id: 'game3',
    numberBadge: 'GAME 03',
    categoryPill: 'Host Mode • Live',
    title: 'Boys Stuff, Girls Guess!',
    tagline: 'Sistem otomatis acak istilah otomotif/game ke cowok. Cewek interogasi & tebak live!',
    themeColor: '#2568EF',
    accentColor: '#5B95FF',
    characterId: 'c05',
    targetPlayers: 'Kubu Cowok vs Kubu Cewek',
    duration: '60 Detik Interogasi',
    difficulty: 'Seru',
    steps: [
      {
        number: 1,
        title: 'Sistem Kunci Istilah Cowok',
        description: 'Sistem mengacak istilah teknis otomotif, perkakas, atau hobi cowok (contoh: "Busi Racing", "Thermal Paste", "Offside Trap") ke cowok.',
        emoji: 'wrench',
      },
      {
        number: 2,
        title: 'Cewek Interogasi Live',
        description: 'Perwakilan cewek menanyai cowok selama 60 detik. Cowok hanya boleh memberi respon singkat "Ya", "Tidak", atau "Bisa Jadi".',
        emoji: 'stopwatch',
      },
      {
        number: 3,
        title: 'Cewek Tebak Istilah',
        description: 'Cewek berembuk bersama dan menyebutkan 1 tebakan final apa nama atau fungsi barang tersebut.',
        emoji: 'thinking',
      },
      {
        number: 4,
        title: 'Buka Jawaban & Tambah Poin',
        description: 'Host membuka hasil. Jika tebakan cewek tepat, cewek raih poin penuh! Jika salah, cowok pertahankan kemenangan.',
        emoji: 'trophy',
      },
    ],
    scoring: [
      {
        label: 'Cewek Berhasil Tebak Benar',
        points: '+10 Pts Tim / +3 Pts Individu',
        type: 'positive',
        desc: '+10 Poin Kubu Cewek dan +3 Poin Room untuk perwakilan cewek.',
      },
      {
        label: 'Cowok Bertahan (Cewek Salah Tebak)',
        points: '+10 Pts Tim / +4 Pts Individu',
        type: 'positive',
        desc: '+10 Poin Kubu Cowok dan +4 Poin Room untuk cowok penjaga rahasia.',
      },
    ],
    scoringNote: 'Poin tim menentukan kubu terkuat, poin perorangan masuk ke leaderboard room.',
    punishmentWho: 'Kubu yang kalah di ronde tebakan.',
    punishmentRule: 'Kubu yang kalah mengambil shuffle kartu hukuman dan menjalankannya secara live!',
    recommendedPunishments: ['pun-01', 'pun-07', 'pun-05'],
  },

  game4: {
    id: 'game4',
    numberBadge: 'GAME 04',
    categoryPill: 'Hot Takes 1v1',
    title: "The Devil's Advocate",
    tagline: 'Sistem mengacak pasangan duel 1v1 & topik absurd (mas parkir jadi presiden?) + Chaos Card kocak!',
    themeColor: '#E85D2A',
    accentColor: '#FF8A5B',
    characterId: 'c15',
    targetPlayers: '👥 Duel 1 vs 1 Acak',
    duration: '30 Detik Debat per Orang',
    difficulty: 'Absurd & Chaos',
    steps: [
      {
        number: 1,
        title: 'Undian Duelist & Topik Absurd',
        description: 'Sistem mengacak 2 pemain untuk bertarung di panggung dan 1 topik perdebatan absurd yang tidak masuk akal.',
        emoji: 'crossed_swords',
      },
      {
        number: 2,
        title: 'Bagi Kubu PRO & KONTRA + Chaos Card',
        description: 'Pemain A wajib membela sisi PRO, Pemain B wajib membela sisi KONTRA. Sistem juga dapat memberikan kartu kondisi Chaos (contoh: intonasi sinetron)!',
        emoji: 'zap',
      },
      {
        number: 3,
        title: 'Adu Bacot Bergantian (30s)',
        description: 'Masing-masing duelist punya waktu 30 detik untuk meyakinkan penonton dengan argumen paling meyakinkan dan kocak.',
        emoji: 'speaking_head',
      },
      {
        number: 4,
        title: 'Voting Penonton Live',
        description: 'Seluruh pemain lain bertindak sebagai juri dan memberikan vote kepada siapa yang debatnya paling layak menang!',
        emoji: 'ballot_box',
      },
    ],
    scoring: [
      {
        label: 'Pemenang Vote Debat 1v1',
        points: '+8 Pts',
        type: 'positive',
        desc: 'Poin Individu Room untuk pemenang adu bacot.',
      },
      {
        label: 'Kalah Vote (Poin Konsolasi)',
        points: '+2 Pts',
        type: 'neutral',
        desc: 'Poin partisipasi bagi duelist runner-up.',
      },
      {
        label: 'Eksekusi Chaos Card Sukses',
        points: '+2 Pts Bonus',
        type: 'bonus',
        desc: 'Jika berhasil menerapkan instruksi kartu Chaos dengan sempurna.',
      },
    ],
    scoringNote: 'Poin duel diakumulasikan ke masing-masing individu di tabel klasemen Room.',
    punishmentWho: 'Duelist yang kalah perolehan vote debat.',
    punishmentRule: 'Pemain yang kalah langsung mendapat kartu hukuman wajib!',
    recommendedPunishments: ['pun-03', 'pun-04', 'pun-08'],
  },

  game5: {
    id: 'game5',
    numberBadge: 'GAME 05',
    categoryPill: 'Tim Rantai • Estafet',
    title: 'Chain Quiz Relay (Cerdas Cermat Berantai)',
    tagline: 'Cerdas cermat berantai tim 3–4 orang acak. 1 orang salah, rantai putus dan tim gugur!',
    themeColor: '#7C3AED',
    accentColor: '#A78BFA',
    characterId: 'c10',
    targetPlayers: '👥 Tim 3–4 Orang Acak (Alpha, Beta, ...)',
    duration: 'Estafet Bergiliran',
    difficulty: 'Adu Otak',
    steps: [
      {
        number: 1,
        title: 'Pembagian Kelompok Acak (3–4 Orang)',
        description: 'Sistem mengacak seluruh pemain di Room ke dalam kelompok-kelompok beranggotakan 3–4 orang (Tim Alpha, Tim Beta, dll.).',
        emoji: 'busts_in_silhouette',
      },
      {
        number: 2,
        title: 'Estafet Soal Trivia Lintas Tema',
        description: 'Pemain bergiliran menjawab: Orang #1 ditanya astronomi, Orang #2 tajwid, Orang #3 geografi, Orang #4 pop culture!',
        emoji: 'link',
      },
      {
        number: 3,
        title: 'SEMUA Wajib Menjawab Benar!',
        description: 'Ketiga/keempatnya harus bekerja sama dan menjawab pertanyaan masing-masing secara berurutan dengan benar.',
        emoji: 'check_mark',
      },
      {
        number: 4,
        title: 'ATURAN MUTLAK: 1 Salah = Rantai Putus!',
        description: 'Jika orang terakhir (atau siapapun di urutan estafet) salah menjawab, RANTAI LANGSUNG PUTUS! Tim tidak mendapat poin dan kena penalti!',
        emoji: 'collision',
      },
    ],
    scoring: [
      {
        label: 'Rantai Sempurna (Semua Benar)',
        points: '+10 Pts Tim / +6 Pts Individu',
        type: 'positive',
        desc: '+10 Poin Kelompok dan +6 Poin Room untuk SETIAP anggota tim!',
      },
      {
        label: 'Rantai Terputus (Gagal)',
        points: '0 Pts Tim / -2 Pts Penalti Room',
        type: 'negative',
        desc: '0 Poin Kelompok dan Penalti -2 Poin Individu untuk seluruh anggota tim.',
      },
    ],
    scoringNote: 'Jika menang, semua anggota tim dapat bonus poin tinggi! Jika kalah, rantai putus dan kena penalti poin.',
    punishmentWho: 'Anggota tim yang salah menjawab dan menyebabkan rantai timnya putus.',
    punishmentRule: 'Pemain yang memutuskan rantai wajib mengambil 1 kartu hukuman shuffle!',
    recommendedPunishments: ['pun-01', 'pun-02', 'pun-05'],
  },

  game6: {
    id: 'game6',
    numberBadge: 'GAME 09',
    categoryPill: 'Pitch Duel • 45s',
    title: 'Sell Me This Trash! (Absurd Pitching)',
    tagline: 'Sistem acak barang nggak guna (payung bolong?) + pembeli absurd. Adu bacot jualan paling masuk akal!',
    themeColor: '#65A30D',
    accentColor: '#84CC16',
    characterId: 'c17',
    targetPlayers: '👥 Duel 1 vs 1 Acak',
    duration: '45 Detik Pitching per Orang',
    difficulty: 'Absurd & Chaos',
    steps: [
      {
        number: 1,
        title: 'Acak Barang Rusak + Target Pembeli Absurd',
        description: 'Sistem menggabungkan 1 barang tidak berguna (misal: "Payung bolong di tengah", "Kipas angin tanpa baling-baling") dengan 1 target pembeli absurd (misal: "Dijual ke astronot di ISS", "Dijual ke vampir")!',
        emoji: 'wastebasket',
      },
      {
        number: 2,
        title: 'Adu Sales Pitching 45 Detik',
        description: 'Dua pemain duel bergantian mempresentasikan barang tersebut selama 45 detik layaknya sales profesional kawakan.',
        emoji: 'microphone',
      },
      {
        number: 3,
        title: 'Adu Bacot Jualan Paling Masuk Akal',
        description: 'Peserta harus memutar otak mencari alasan paling kreatif atau paling bikin ngakak kenapa barang itu wajib dibeli oleh target pasar tersebut.',
        emoji: 'laughing',
      },
      {
        number: 4,
        title: 'Voting Penonton: Siapa yang Dibeli?',
        description: 'Seluruh penonton/pemain lain me-vote siapa yang sales pitching-nya paling persuasif atau paling menghibur!',
        emoji: 'shopping_cart',
      },
    ],
    scoring: [
      {
        label: 'Pemenang Vote Pitching',
        points: '+8 Pts',
        type: 'positive',
        desc: 'Poin Individu Room untuk sales terlaris.',
      },
      {
        label: 'Kalah Pitching (Konsolasi)',
        points: '+2 Pts',
        type: 'neutral',
        desc: 'Poin partisipasi bagi sales runner-up.',
      },
      {
        label: 'Bonus Suara Bulat (Unanimous)',
        points: '+3 Pts Bonus',
        type: 'bonus',
        desc: 'Jika seluruh audiens serempak memilihmu.',
      },
    ],
    scoringNote: 'Poin duel tersimpan secara otomatis di leaderboard individu Room.',
    punishmentWho: 'Sales yang kalah dalam voting duel pitching.',
    punishmentRule: 'Sales yang kalah wajib menerima kartu hukuman promosi absurd!',
    recommendedPunishments: ['pun-01', 'pun-03', 'pun-07'],
  },
};

interface GameOnboardingModalProps {
  open: boolean;
  gameId: GameId | null;
  onClose: () => void;
  onStartGame: (gameId: GameId) => void;
}

export const GameOnboardingModal: React.FC<GameOnboardingModalProps> = ({
  open,
  gameId,
  onClose,
  onStartGame,
}) => {
  const [activeTab, setActiveTab] = useState<'cara-main' | 'skor' | 'hukuman'>('cara-main');
  const [previewPunishment, setPreviewPunishment] = useState<PunishmentCardDef>(PUNISHMENT_CARDS[0]);
  const [isShufflingPunishment, setIsShufflingPunishment] = useState(false);

  const detail = gameId ? GAME_ONBOARDING_DATA[gameId] : null;

  useEffect(() => {
    if (open && detail) {
      setActiveTab('cara-main');
      const rec = detail.recommendedPunishments[0];
      const match = PUNISHMENT_CARDS.find((p) => p.id === rec) || PUNISHMENT_CARDS[0];
      setPreviewPunishment(match);
    }
  }, [open, detail]);

  const handleShufflePreview = () => {
    if (isShufflingPunishment || !detail) return;
    setIsShufflingPunishment(true);
    sfx.playPop(480);

    setTimeout(() => {
      const otherCards = PUNISHMENT_CARDS.filter((c) => c.id !== previewPunishment.id);
      const picked = otherCards[Math.floor(Math.random() * otherCards.length)] || PUNISHMENT_CARDS[0];
      setPreviewPunishment(picked);
      setIsShufflingPunishment(false);
      sfx.playFanfare();
    }, 450);
  };

  const handleStart = () => {
    if (!gameId) return;
    sfx.playSuccess();
    onStartGame(gameId);
  };

  if (!open || !detail) return null;

  const char = getCharacterById(detail.characterId) || CHARACTER_PACK[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 24, stiffness: 280 }}
          className="w-full max-w-lg md:max-w-3xl bg-[#FAF7F2] rounded-[36px] border-[3px] border-[#1E1E24] p-5 sm:p-7 text-[#1E1E24] shadow-[0_16px_40px_rgba(30,30,36,0.22)] relative max-h-[92vh] flex flex-col justify-between overflow-hidden"
        >
          {/* Top Decorative Floating Accents */}
          <div
            style={{ backgroundColor: detail.themeColor }}
            className="absolute -top-12 -right-12 w-36 h-36 rounded-full opacity-15 blur-2xl pointer-events-none"
          />

          {/* Close Button */}
          <button
            type="button"
            onClick={() => {
              sfx.playPop(420);
              onClose();
            }}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center cursor-pointer text-[#1E1E24] transition z-20"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* ========================================================================= */}
          {/* HEADER: Mascot + Badges + Game Title                                      */}
          {/* ========================================================================= */}
          <div className="flex items-start gap-4 mb-4 pr-8">
            {/* Animated Game Mascot */}
            <div className="shrink-0 p-1 rounded-2xl bg-white border-2 border-[#1E1E24]/10 shadow-xs">
              <GameMascotBot character={char} mood="happy" size={56} />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span
                  style={{ backgroundColor: detail.themeColor }}
                  className="px-2.5 py-0.5 rounded-full text-white text-[10px] font-black uppercase tracking-wider"
                >
                  {detail.numberBadge}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#1E1E24]/5 text-[#64616C] text-[10px] font-extrabold uppercase">
                  {detail.categoryPill}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                  ⚡ {detail.difficulty}
                </span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1E1E24] leading-tight truncate">
                {detail.title}
              </h2>

              <p className="text-xs text-[#64616C] font-semibold mt-0.5 line-clamp-2">
                {detail.tagline}
              </p>
            </div>
          </div>

          {/* Quick Meta Pills (Player Role & Duration) */}
          <div className="flex flex-wrap items-center gap-2 mb-4 p-2.5 rounded-2xl bg-white border border-[#1E1E24]/10 text-xs font-bold text-[#1E1E24]">
            <div className="flex items-center gap-1.5 text-[#158467]">
              <Users className="w-3.5 h-3.5" />
              <span>{detail.targetPlayers}</span>
            </div>
            <span className="text-[#1E1E24]/20">•</span>
            <div className="flex items-center gap-1.5 text-[#2568EF]">
              <Timer className="w-3.5 h-3.5" />
              <span>{detail.duration}</span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 3-TAB SEGMENTED NAVIGATION                                                */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-[#EBE7DF] border border-[#1E1E24]/10 mb-4">
            <button
              type="button"
              onClick={() => {
                sfx.playPop();
                setActiveTab('cara-main');
              }}
              className={`py-2 px-3 rounded-xl font-display text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'cara-main'
                  ? 'bg-white text-[#1E1E24] shadow-xs scale-[1.02]'
                  : 'text-[#64616C] hover:text-[#1E1E24]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#2568EF]" />
              <span>Cara Main</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sfx.playPop();
                setActiveTab('skor');
              }}
              className={`py-2 px-3 rounded-xl font-display text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'skor'
                  ? 'bg-white text-[#1E1E24] shadow-xs scale-[1.02]'
                  : 'text-[#64616C] hover:text-[#1E1E24]'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Sistem Skor</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sfx.playPop();
                setActiveTab('hukuman');
              }}
              className={`py-2 px-3 rounded-xl font-display text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'hukuman'
                  ? 'bg-white text-[#1E1E24] shadow-xs scale-[1.02]'
                  : 'text-[#64616C] hover:text-[#1E1E24]'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-[#EC5A29]" />
              <span>Kartu Hukuman</span>
            </button>
          </div>

          {/* ========================================================================= */}
          {/* TAB CONTENTS (Scrollable, Responsive 2-Col on Desktop)                     */}
          {/* ========================================================================= */}
          <div className="flex-1 overflow-y-auto pr-1 custom-scroll max-h-[46vh] mb-4">
            {/* ----------------------------------------------------------------------- */}
            {/* TAB 1: CARA MAIN LENGKAP                                                */}
            {/* ----------------------------------------------------------------------- */}
            {activeTab === 'cara-main' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {detail.steps.map((st) => (
                    <div
                      key={st.number}
                      className="p-3.5 rounded-2xl bg-white border border-[#1E1E24]/10 shadow-xs flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] border border-[#1E1E24]/10 font-display font-black text-xs text-[#1E1E24] flex items-center justify-center shrink-0">
                        {st.number}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <FluentEmoji name={st.emoji} variant="3d" size={18} />
                          <h4 className="font-display text-sm font-bold text-[#1E1E24]">
                            {st.title}
                          </h4>
                        </div>
                        <p className="text-xs text-[#64616C] font-semibold leading-relaxed">
                          {st.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Important Rule Banner */}
                <div className="p-3.5 rounded-2xl bg-[#FFF7ED] border border-[#F97316]/30 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#EA580C] text-white flex items-center justify-center shrink-0 font-bold">
                    💡
                  </div>
                  <p className="text-xs text-[#9A3412] font-semibold leading-snug">
                    <strong>Tips Main:</strong> Buka speaker HP atau sambungkan ke speaker ruangan agar efek suara & countdown timer terdengar heboh oleh semua pemain!
                  </p>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------------- */}
            {/* TAB 2: SISTEM SKOR & POIN ROOM                                          */}
            {/* ----------------------------------------------------------------------- */}
            {activeTab === 'skor' && (
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-[#F0FDF4] border border-[#12B76A]/30 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#12B76A] text-white flex items-center justify-center shrink-0 font-bold">
                    <Trophy className="w-4 h-4 text-[#FBBF24]" />
                  </div>
                  <div>
                    <h4 className="font-display text-xs font-bold text-[#065F46] uppercase tracking-wider">
                      Aturan Akumulasi Skor Room
                    </h4>
                    <p className="text-xs text-[#047857] font-semibold mt-0.5">
                      {detail.scoringNote}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {detail.scoring.map((sc, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-white border border-[#1E1E24]/10 shadow-xs flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-display text-xs font-bold text-[#1E1E24]">
                          {sc.label}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-display text-xs font-black shrink-0 ${
                            sc.type === 'positive'
                              ? 'bg-[#D1FADF] text-[#027A48]'
                              : sc.type === 'negative'
                              ? 'bg-[#FEE4E2] text-[#B42318]'
                              : sc.type === 'bonus'
                              ? 'bg-[#FEF08A] text-[#854D0E]'
                              : 'bg-black/5 text-[#64616C]'
                          }`}
                        >
                          {sc.points}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#64616C] font-semibold leading-relaxed">
                        {sc.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------------- */}
            {/* TAB 3: ATURAN HUKUMAN & SHUFFLE PREVIEW                                 */}
            {/* ----------------------------------------------------------------------- */}
            {activeTab === 'hukuman' && (
              <div className="space-y-3.5">
                <div className="p-3.5 rounded-2xl bg-[#FFF1F2] border border-[#F43F5E]/30 flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-[#E11D48] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-[#9F1239]">
                      <strong>Siapa yang Kena Hukuman:</strong> {detail.punishmentWho}
                    </p>
                    <p className="text-[11px] text-[#BE123C] font-semibold mt-0.5">
                      {detail.punishmentRule}
                    </p>
                  </div>
                </div>

                {/* Interactive Shuffle Punishment Card Preview */}
                <div className="rounded-[28px] bg-white border-2 border-[#1E1E24]/15 p-4 shadow-xs text-center relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#64616C]">
                      🃏 CONTOH KARTU HUKUMAN
                    </span>

                    <button
                      type="button"
                      onClick={handleShufflePreview}
                      disabled={isShufflingPunishment}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#1E1E24]/10 text-xs font-bold text-[#1E1E24] cursor-pointer transition active:scale-95"
                    >
                      <Shuffle
                        className={`w-3.5 h-3.5 text-[#EC5A29] ${
                          isShufflingPunishment ? 'animate-spin' : ''
                        }`}
                      />
                      <span>Acak Contoh Lain</span>
                    </button>
                  </div>

                  {/* The Card */}
                  <div
                    style={{ borderColor: previewPunishment.color }}
                    className="p-4 rounded-2xl bg-[#FAF7F2] border-2 shadow-xs transition-all"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-2xl">{previewPunishment.emoji}</span>
                      <span
                        style={{ backgroundColor: previewPunishment.color }}
                        className="px-2.5 py-0.5 rounded-full text-white text-[10px] font-black uppercase"
                      >
                        {previewPunishment.intensity} • {previewPunishment.duration}
                      </span>
                    </div>

                    <h4 className="font-display text-base font-bold text-[#1E1E24] mb-1.5">
                      {previewPunishment.title}
                    </h4>

                    <p className="text-xs text-[#475467] font-semibold leading-relaxed">
                      "{previewPunishment.text}"
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* FOOTER ACTIONS                                                            */}
          {/* ========================================================================= */}
          <div className="pt-3 border-t border-[#1E1E24]/10 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                sfx.playPop();
                onClose();
              }}
              className="py-2.5 px-4 rounded-2xl bg-transparent hover:bg-black/5 text-[#64616C] hover:text-[#1E1E24] text-xs font-bold cursor-pointer transition"
            >
              Kembali
            </button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98, y: 2 }}
              onClick={handleStart}
              style={{ backgroundColor: detail.themeColor }}
              className="py-3 px-6 rounded-[22px] text-white border-[3px] border-[#1E1E24] shadow-[0_5px_0_#1E1E24] font-display text-sm font-bold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Mulai Main Game!</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
