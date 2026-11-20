export type TriviaQuestion = {
  id: number;
  category: string;
  categoryEmoji: string;
  question: string;
  answer: string;
};

export const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  // ── Sejarah Indonesia & Dunia (General) ──
  {
    id: 1,
    category: "Sejarah",
    categoryEmoji: "📜",
    question: "Di kota manakah teks Proklamasi Kemerdekaan Indonesia dibacakan pada 17 Agustus 1945?",
    answer: "Jakarta (Pegangsaan Timur No. 56)",
  },
  {
    id: 2,
    category: "Sejarah",
    categoryEmoji: "📜",
    question: "Siapakah nama tokoh yang mengetik naskah proklamasi kemerdekaan Republik Indonesia?",
    answer: "Sayuti Melik",
  },
  {
    id: 3,
    category: "Sejarah",
    categoryEmoji: "📜",
    question: "Siapakah pahlawan wanita yang menjahit Bendera Pusaka Merah Putih pertama kali?",
    answer: "Fatmawati",
  },
  {
    id: 4,
    category: "Sejarah",
    categoryEmoji: "📜",
    question: "Candi Buddha termegah di dunia yang berlokasi di Magelang, Jawa Tengah bernama candi apa?",
    answer: "Candi Borobudur",
  },
  {
    id: 5,
    category: "Sejarah",
    categoryEmoji: "📜",
    question: "Peristiwa pengasingan Bung Karno & Hatta oleh golongan pemuda jelang proklamasi terjadi di daerah mana?",
    answer: "Rengasdengklok",
  },
  {
    id: 6,
    category: "Sejarah",
    categoryEmoji: "📜",
    question: "Hari Pahlawan Nasional di Indonesia diperingati setiap tanggal berapa di bulan November?",
    answer: "10 November",
  },
  {
    id: 7,
    category: "Sejarah",
    categoryEmoji: "📜",
    question: "Kapal pesiar mewah legendaris yang tenggelam di Samudra Atlantik setelah menabrak gunung es tahun 1912 bernama?",
    answer: "Titanic",
  },
  {
    id: 8,
    category: "Sejarah",
    categoryEmoji: "📜",
    question: "Tembok pertahanan raksasa terpanjang di dunia yang menjadi keajaiban dunia berada di negara mana?",
    answer: "Tiongkok (China)",
  },
  {
    id: 9,
    category: "Sejarah",
    categoryEmoji: "📜",
    question: "Monumen megah di Paris, Prancis yang dibangun untuk memperingati kemenangan militer Napoleon bernama?",
    answer: "Arc de Triomphe",
  },
  {
    id: 10,
    category: "Sejarah",
    categoryEmoji: "📜",
    question: "Siapakah Presiden pertama Republik Indonesia yang membacakan naskah Proklamasi?",
    answer: "Ir. Soekarno (Bung Karno)",
  },

  // ── Negara & Geografi Dunia (General) ──
  {
    id: 11,
    category: "Negara & Geografi",
    categoryEmoji: "🌍",
    question: "Negara apakah yang dijuluki 'Negeri Sakura' dan beribu kota di Tokyo?",
    answer: "Jepang",
  },
  {
    id: 12,
    category: "Negara & Geografi",
    categoryEmoji: "🌍",
    question: "Apa nama ibu kota resmi negara tetangga kita, Malaysia?",
    answer: "Kuala Lumpur",
  },
  {
    id: 13,
    category: "Negara & Geografi",
    categoryEmoji: "🌍",
    question: "Negara kincir angin di Eropa yang terkenal dengan kebun bunga tulip adalah negara apa?",
    answer: "Belanda",
  },
  {
    id: 14,
    category: "Negara & Geografi",
    categoryEmoji: "🌍",
    question: "Menara Eiffel yang sangat ikonik berada di ibu kota negara mana?",
    answer: "Prancis (Paris)",
  },
  {
    id: 15,
    category: "Negara & Geografi",
    categoryEmoji: "🌍",
    question: "Negara manakah di dunia yang memiliki luas daratan paling besar di seluruh dunia?",
    answer: "Rusia",
  },
  {
    id: 16,
    category: "Negara & Geografi",
    categoryEmoji: "🌍",
    question: "Gunung tertinggi di dunia yang berada di kawasan pegunungan Himalaya bernama gunung apa?",
    answer: "Gunung Everest",
  },
  {
    id: 17,
    category: "Negara & Geografi",
    categoryEmoji: "🌍",
    question: "Sungai terpanjang di benua Afrika yang mengalir melintasi Mesir adalah sungai apa?",
    answer: "Sungai Nil",
  },
  {
    id: 18,
    category: "Negara & Geografi",
    categoryEmoji: "🌍",
    question: "Patung Merlion berkepala singa dan bertubuh ikan adalah ikon terkenal dari negara mana?",
    answer: "Singapura",
  },
  {
    id: 19,
    category: "Negara & Geografi",
    categoryEmoji: "🌍",
    question: "Negara di Asia Timur yang terkenal dengan K-Pop, drama Korea, dan beribu kota di Seoul adalah?",
    answer: "Korea Selatan",
  },
  {
    id: 20,
    category: "Negara & Geografi",
    categoryEmoji: "🌍",
    question: "Benua apakah yang terkenal dengan es abadi dan berada di kutub selatan bumi?",
    answer: "Benua Antartika",
  },

  // ── Politik & Kenegaraan Umum (General) ──
  {
    id: 21,
    category: "Politik Umum",
    categoryEmoji: "🏛️",
    question: "Berapa tahun masa jabatan Presiden Republik Indonesia dalam satu periode menurut UUD 1945?",
    answer: "5 Tahun",
  },
  {
    id: 22,
    category: "Politik Umum",
    categoryEmoji: "🏛️",
    question: "Lembaga parlemen perwakilan rakyat di Indonesia yang berkantor di Senayan disingkat menjadi?",
    answer: "DPR (Dewan Perwakilan Rakyat)",
  },
  {
    id: 23,
    category: "Politik Umum",
    categoryEmoji: "🏛️",
    question: "Gedung putih kediaman dan kantor resmi Presiden Amerika Serikat di Washington DC disebut apa?",
    answer: "White House (Gedung Putih)",
  },
  {
    id: 24,
    category: "Politik Umum",
    categoryEmoji: "🏛️",
    question: "Burung apakah yang menjadi lambang negara Republik Indonesia dengan semboyan Bhinneka Tunggal Ika?",
    answer: "Burung Garuda (Garuda Pancasila)",
  },
  {
    id: 25,
    category: "Politik Umum",
    categoryEmoji: "🏛️",
    question: "Ibu Kota Nusantara (IKN) baru Republik Indonesia dibangun di provinsi mana?",
    answer: "Kalimantan Timur",
  },
  {
    id: 26,
    category: "Politik Umum",
    categoryEmoji: "🏛️",
    question: "Asas pemilu di Indonesia adalah LUBER dan JURDIL. Apa kepanjangan dari huruf 'L' pada LUBER?",
    answer: "Langsung",
  },
  {
    id: 27,
    category: "Politik Umum",
    categoryEmoji: "🏛️",
    question: "Lagu kebangsaan resmi Republik Indonesia yang digubah oleh W.R. Supratman berjudul apa?",
    answer: "Indonesia Raya",
  },
  {
    id: 28,
    category: "Politik Umum",
    categoryEmoji: "🏛️",
    question: "Sistem pemerintahan di mana kekuasaan tertinggi berada di tangan rakyat disebut sistem apa?",
    answer: "Demokrasi",
  },
  {
    id: 29,
    category: "Politik Umum",
    categoryEmoji: "🏛️",
    question: "Organisasi perdamaian antarbangsa terbesar di dunia yang disingkat PBB dalam bahasa Inggris adalah?",
    answer: "UN (United Nations)",
  },
  {
    id: 30,
    category: "Politik Umum",
    categoryEmoji: "🏛️",
    question: "Warna apakah yang mendominasi bendera resmi Perserikatan Bangsa-Bangsa (PBB)?",
    answer: "Biru Muda dan Putih",
  },

  // ── Astronomi & Sains Dasar ──
  {
    id: 31,
    category: "Astronomi",
    categoryEmoji: "🪐",
    question: "Planet apa yang letaknya paling dekat dengan Matahari di tata surya kita?",
    answer: "Merkurius",
  },
  {
    id: 32,
    category: "Astronomi",
    categoryEmoji: "🪐",
    question: "Planet manakah di tata surya kita yang dijuluki sebagai 'Planet Merah'?",
    answer: "Mars",
  },
  {
    id: 33,
    category: "Astronomi",
    categoryEmoji: "🪐",
    question: "Apa nama satelit alami terbesar yang mengelilingi planet Bumi?",
    answer: "Bulan",
  },
  {
    id: 34,
    category: "Astronomi",
    categoryEmoji: "🪐",
    question: "Planet raksasa terbesar di seluruh tata surya kita adalah planet apa?",
    answer: "Jupiter",
  },
  {
    id: 35,
    category: "Astronomi",
    categoryEmoji: "🪐",
    question: "Fenomena ketika Bulan berada tepat di antara Matahari dan Bumi disebut gerhana apa?",
    answer: "Gerhana Matahari",
  },

  // ── Biologi & Alam ──
  {
    id: 36,
    category: "Biologi",
    categoryEmoji: "🧬",
    question: "Hewan mamalia terbesar di bumi saat ini yang hidup di lautan adalah mamalia apa?",
    answer: "Paus Biru",
  },
  {
    id: 37,
    category: "Biologi",
    categoryEmoji: "🧬",
    question: "Organ tubuh manusia yang bertugas memompa darah ke seluruh tubuh adalah?",
    answer: "Jantung",
  },
  {
    id: 38,
    category: "Biologi",
    categoryEmoji: "🧬",
    question: "Proses tumbuhan hijau memasak makanan sendiri dengan bantuan sinar matahari disebut apa?",
    answer: "Fotosintesis",
  },
  {
    id: 39,
    category: "Biologi",
    categoryEmoji: "🧬",
    question: "Berapakah jumlah kaki yang dimiliki oleh seekor laba-laba?",
    answer: "8 (Delapan)",
  },

  // ── Pop Culture & Kuliner ──
  {
    id: 40,
    category: "Pop Culture",
    categoryEmoji: "🎬",
    question: "Superhero Marvel yang mengenakan kostum laba-laba merah dan biru bernama?",
    answer: "Spider-Man (Peter Parker)",
  },
  {
    id: 41,
    category: "Pop Culture",
    categoryEmoji: "🎬",
    question: "Siapakah sahabat spons kuning SpongeBob yang tinggal di bawah batu dan berwarna pink?",
    answer: "Patrick Star",
  },
  {
    id: 42,
    category: "Kuliner",
    categoryEmoji: "🍜",
    question: "Makanan khas Palembang yang terbuat dari olahan ikan dan disajikan dengan kuah cuko hitam adalah?",
    answer: "Pempek",
  },
  {
    id: 43,
    category: "Kuliner",
    categoryEmoji: "🍜",
    question: "Makanan olahan daging sapi asal Minangkabau yang dinobatkan sebagai salah satu makanan terlezat di dunia?",
    answer: "Rendang",
  },
  {
    id: 44,
    category: "Olahraga",
    categoryEmoji: "⚽",
    question: "Berapa jumlah pemain dalam satu tim sepak bola yang bertanding di lapangan?",
    answer: "11 Pemain",
  },
  {
    id: 45,
    category: "Pengetahuan Umum",
    categoryEmoji: "💡",
    question: "Mata uang resmi yang digunakan di negara Jepang bernama apa?",
    answer: "Yen (¥)",
  },
];

export function getRandomTriviaChain(count: number, usedIds: number[] = []): TriviaQuestion[] {
  const available = TRIVIA_QUESTIONS.filter((q) => !usedIds.includes(q.id));
  const pool = available.length >= count ? available : TRIVIA_QUESTIONS;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
