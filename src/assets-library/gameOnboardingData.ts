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
