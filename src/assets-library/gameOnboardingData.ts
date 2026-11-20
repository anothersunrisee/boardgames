import type { GameId } from '../components/modals/GameOnboardingModal';

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
    unicode?: string;
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
        description: 'Host menekan tombol untuk memunculkan topik acak (contoh: "Lauk warteg andalan pas tanggal tua").',
        emoji: 'megaphone',
        unicode: '📢',
      },
      {
        number: 2,
        title: 'Semua Ketik di HP Sendiri',
        description: 'Host memulai hitung mundur 30 detik. Semua pemain mengetik 1 jawaban di HP masing-masing tanpa boleh saling contek!',
        emoji: 'hourglass',
        unicode: '⏳',
      },
      {
        number: 3,
        title: 'Reveal Jawaban Bersama',
        description: 'Setelah waktu habis, semua pemain membacakan atau memperlihatkan jawaban secara terbuka ke ruangan.',
        emoji: 'eyes',
        unicode: '👀',
      },
      {
        number: 4,
        title: 'Eliminasi Jawaban Kembar!',
        description: 'Jika ada 2 orang atau lebih yang jawabannya sama (misal sama-sama "Orek Tempe"), keduanya tereliminasi dan dapat 0 poin! Hanya jawaban unik yang menang.',
        emoji: 'cross-mark',
        unicode: '❌',
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
    tagline: 'Sistem otomatis acak benda skincare/makeup rahasia ke cewek. Cowok interogasi live di ruangan!',
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
        description: 'Sistem mengacak 1 nama produk skincare/makeup (contoh: "Micellar Water", "Eyelash Curler", "Sunscreen Stick") ke cewek secara rahasia.',
        emoji: 'sparkles',
        unicode: '✨',
      },
      {
        number: 2,
        title: 'Cowok Interogasi Live',
        description: 'Perwakilan cowok maju ke depan. Diberikan waktu 60 detik untuk menanyai cewek. Cewek HANYA boleh menjawab "Ya", "Tidak", atau "Bisa Jadi"!',
        emoji: 'eyes',
        unicode: '👀',
      },
      {
        number: 3,
        title: 'Cowok Berembuk & Tebak',
        description: 'Waktu interogasi habis! Tim cowok berdiskusi singkat dan memutuskan 1 jawaban tebakan akhir nama produk tersebut.',
        emoji: 'thinking-face',
        unicode: '🤔',
      },
      {
        number: 4,
        title: 'Reveal Jawaban & Poin',
        description: 'Host membuka jawaban asli di layar. Jika cowok benar, cowok menang; jika cowok salah, cewek sukses mengelabui cowok!',
        emoji: 'party-popper',
        unicode: '🎉',
      },
    ],
    scoring: [
      {
        label: 'Cowok Berhasil Tebak Benar',
        points: '+10 Pts Tim / +3 Pts Individu',
        type: 'positive',
        desc: '+10 Poin Kubu Cowok dan +3 Poin Room untuk cowok penebak benar.',
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
    tagline: 'Sistem otomatis acak sparepart motor, perkakas, game rental PS, atau atlet tenar ke cowok. Cewek tebak!',
    themeColor: '#2568EF',
    accentColor: '#5B95FF',
    characterId: 'c05',
    targetPlayers: 'Kubu Cowok vs Kubu Cewek',
    duration: '60 Detik Interogasi',
    difficulty: 'Seru',
    steps: [
      {
        number: 1,
        title: 'Sistem Kunci Benda Cowok',
        description: 'Sistem mengacak sparepart motor umum, alat perkakas rumah tangga, game rental PS legendaris, atau atlet kelas dunia (Ronaldo, Messi, dll.).',
        emoji: 'game-die',
        unicode: '🎲',
      },
      {
        number: 2,
        title: 'Cewek Interogasi Live',
        description: 'Perwakilan cewek menanyai cowok selama 60 detik. Cowok hanya boleh memberi respon singkat "Ya", "Tidak", atau "Bisa Jadi".',
        emoji: 'hourglass',
        unicode: '⏳',
      },
      {
        number: 3,
        title: 'Cewek Tebak Istilah',
        description: 'Cewek berembuk bersama dan menyebutkan 1 tebakan final apa nama barang atau atlet tersebut.',
        emoji: 'thinking-face',
        unicode: '🤔',
      },
      {
        number: 4,
        title: 'Buka Jawaban & Tambah Poin',
        description: 'Host membuka hasil. Jika tebakan cewek tepat, cewek raih poin penuh! Jika salah, cowok pertahankan kemenangan.',
        emoji: 'trophy',
        unicode: '🏆',
      },
    ],
    scoring: [
      {
        label: 'Cewek Berhasil Tebak Benar',
        points: '+10 Pts Tim / +3 Pts Individu',
        type: 'positive',
        desc: '+10 Poin Kubu Cewek dan +3 Poin Room untuk cewek penebak benar.',
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
    categoryPill: 'Adu Bacot 2v2',
    title: "The Devil's Advocate (Adu Bacot 2v2)",
    tagline: 'Sistem acak pasangan tanding 2v2 (Duo PRO vs Duo KONTRA) & topik absurd + Chaos Card kocak!',
    themeColor: '#E85D2A',
    accentColor: '#FF8A5B',
    characterId: 'c15',
    targetPlayers: '👥 Tim 2 vs 2 Acak (Duo PRO vs Duo KONTRA)',
    duration: 'Adu Bacot Bergantian',
    difficulty: 'Absurd & Chaos',
    steps: [
      {
        number: 1,
        title: 'Undian Tim 2v2 & Topik Absurd',
        description: 'Sistem mengacak 4 pemain menjadi 2 Tim (Duo PRO vs Duo KONTRA) dan 1 topik perdebatan absurd yang mengocok perut.',
        emoji: 'collision',
        unicode: '💥',
      },
      {
        number: 2,
        title: 'Bagi Kubu PRO & KONTRA + Chaos Card',
        description: '2 Pemain kubu PRO vs 2 Pemain kubu KONTRA. Setiap tim harus kompak berargumen + wajib menjalankan kartu kondisi Chaos (misal: intonasi sinetron)!',
        emoji: 'high-voltage',
        unicode: '⚡',
      },
      {
        number: 3,
        title: 'Adu Bacot Berantai (30s per Kubu)',
        description: 'Masing-masing kubu bergiliran meyakinkan penonton dan dewan juri dengan argumen paling ngawur tapi meyakinkan.',
        emoji: 'megaphone',
        unicode: '📢',
      },
      {
        number: 4,
        title: 'Voting Penonton Live',
        description: 'Seluruh penonton/pemain lain memberikan vote live untuk kubu 2v2 dengan performa paling pecah dan berbobot!',
        emoji: 'trophy',
        unicode: '🏆',
      },
    ],
    scoring: [
      {
        label: 'Pemenang Vote Tim 2v2',
        points: '+8 Pts Tiap Anggota',
        type: 'positive',
        desc: 'Masing-masing anggota tim pemenang mendapatkan +8 Poin Room.',
      },
      {
        label: 'Kalah Vote (Poin Konsolasi)',
        points: '+2 Pts Tiap Anggota',
        type: 'neutral',
        desc: 'Poin partisipasi bagi masing-masing anggota tim runner-up.',
      },
      {
        label: 'Eksekusi Chaos Card Sukses',
        points: '+2 Pts Bonus',
        type: 'bonus',
        desc: 'Jika berhasil menerapkan instruksi kartu Chaos dengan kompak.',
      },
    ],
    scoringNote: 'Poin duel diakumulasikan ke masing-masing individu di tabel klasemen Room.',
    punishmentWho: 'Dua pemain di kubu yang kalah perolehan vote.',
    punishmentRule: 'Kubu yang kalah wajib mengambil kartu hukuman kocak!',
    recommendedPunishments: ['pun-03', 'pun-04', 'pun-08'],
  },

  game5: {
    id: 'game5',
    numberBadge: 'GAME 05',
    categoryPill: 'Tim Rantai • Estafet',
    title: 'Chain Quiz Relay (Cerdas Cermat Berantai)',
    tagline: 'Satu tim maju bersama menghadapi 4 ronde soal beruntun! 1 salah = kartu tantangan aktif sampai ronde 4!',
    themeColor: '#7C3AED',
    accentColor: '#A78BFA',
    characterId: 'c10',
    targetPlayers: '👥 Tim Estafet 4 Ronde Beruntun',
    duration: '4 Ronde Berturut-turut per Tim',
    difficulty: 'Adu Otak',
    steps: [
      {
        number: 1,
        title: 'Giliran Tim Tampil (4 Ronde Beruntun)',
        description: '1 Tim maju sekaligus dan menghadapi 4 ronde beruntun (1 ronde = 4 soal estafet, total 16 soal) tanpa ganti tim di tengah jalan!',
        emoji: 'chains',
        unicode: '⛓️',
      },
      {
        number: 2,
        title: 'Estafet Jawaban Cepat',
        description: 'Anggota tim bergiliran menjawab pertanyaan pengetahuan umum, sains, sejarah, pop culture, dll.',
        emoji: 'fire',
        unicode: '🔥',
      },
      {
        number: 3,
        title: 'Kartu Tantangan Tetap Aktif!',
        description: 'Jika 1 orang salah/gagal jawab, pemain tersebut langsung kena penalti (-2 pts) dan WAJIB memegang Kartu Tantangan Konyol yang aktif sampai seluruh 4 ronde timnya selesai!',
        emoji: 'collision',
        unicode: '💥',
      },
      {
        number: 4,
        title: 'Poin Sempurna (+10 Pts)',
        description: 'Tiap ronde tuntas = +2 Pts tiap anggota. Jika berhasil babat habis 4/4 ronde sempurna (16 soal), seluruh anggota tim dapat jackpot +10 Pts masing-masing!',
        emoji: 'check-mark',
        unicode: '✅',
      },
    ],
    scoring: [
      {
        label: '4/4 Ronde Sempurna (Clean Sweep)',
        points: '+10 Pts Tiap Anggota',
        type: 'positive',
        desc: 'Jackpot +10 Poin Room untuk SETIAP anggota tim!',
      },
      {
        label: 'Tiap Ronde Tuntas (Min. 3 Benar)',
        points: '+2 Pts per Ronde',
        type: 'positive',
        desc: '+2 Poin per ronde tuntas untuk setiap anggota tim.',
      },
      {
        label: 'Salah Menjawab',
        points: '-2 Pts Individu',
        type: 'negative',
        desc: 'Pemain yang salah langsung -2 poin dan menanggung Kartu Tantangan aktif hingga Ronde 4 selesai.',
      },
    ],
    scoringNote: 'Di akhir game, tampil klasemen Tim Juara & Pemain MVP dengan poin terbanyak!',
    punishmentWho: 'Anggota tim yang salah menjawab selama 4 ronde berlangsung.',
    punishmentRule: 'Pemain yang salah wajib menjalankan tantangan aktif hingga ronde ke-4 selesai!',
    recommendedPunishments: ['pun-01', 'pun-02', 'pun-05'],
  },

  game6: {
    id: 'game6',
    numberBadge: 'GAME 06',
    categoryPill: 'Pitch Duel 2v2',
    title: 'Sell Me This Trash! (Pitching Duel 2v2)',
    tagline: 'Dua tim sales 2v2 beradu rayuan maut menjual barang rusak/aneh ke target pembeli absurd!',
    themeColor: '#65A30D',
    accentColor: '#84CC16',
    characterId: 'c17',
    targetPlayers: '👥 Duel Sales 2 vs 2',
    duration: '45 Detik Pitching per Tim',
    difficulty: 'Absurd & Chaos',
    steps: [
      {
        number: 1,
        title: 'Acak Barang Rusak + Target Pembeli Absurd',
        description: 'Sistem menggabungkan 1 barang tidak berguna (misal: "Sandal Swallow beda warna", "Tutup Tupperware tanpa wadah") dengan 1 target pembeli absurd!',
        emoji: 'gem-stone',
        unicode: '💎',
      },
      {
        number: 2,
        title: 'Adu Sales Pitching 2v2 (45s per Tim)',
        description: 'Dua tim sales (Duo Sales A vs Duo Sales B) bergiliran mempresentasikan barang secara kompak selama 45 detik layaknya sales profesional.',
        emoji: 'microphone',
        unicode: '🎤',
      },
      {
        number: 3,
        title: 'Adu Bacot Jualan Paling Menghibur',
        description: 'Peserta harus memutar otak mencari alasan paling kreatif atau paling bikin ngakak kenapa barang itu wajib dibeli oleh target pasar tersebut.',
        emoji: 'partying-face',
        unicode: '🥳',
      },
      {
        number: 4,
        title: 'Voting Penonton: Siapa Sales Terbaik?',
        description: 'Seluruh penonton me-vote tim sales mana yang penjelasannya paling persuasif dan kocak!',
        emoji: 'trophy',
        unicode: '🏆',
      },
    ],
    scoring: [
      {
        label: 'Pemenang Vote Duo Sales',
        points: '+8 Pts Tiap Anggota',
        type: 'positive',
        desc: 'Masing-masing anggota duo sales terlaris mendapat +8 Poin Room.',
      },
      {
        label: 'Kalah Pitching (Konsolasi)',
        points: '+2 Pts Tiap Anggota',
        type: 'neutral',
        desc: 'Poin partisipasi bagi masing-masing anggota duo sales runner-up.',
      },
    ],
    scoringNote: 'Poin hasil vote otomatis masuk ke saldo poin individu masing-masing pemain.',
    punishmentWho: 'Duo sales yang kalah perolehan suara.',
    punishmentRule: 'Dua pemain yang kalah wajib mengambil hukuman dan mengeksekusinya!',
    recommendedPunishments: ['pun-04', 'pun-06', 'pun-08'],
  },
};
