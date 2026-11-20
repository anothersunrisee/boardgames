export type TriviaQuestion = {
  id: number;
  category: string;
  categoryEmoji: string;
  question: string;
  answer: string;
};

export const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  // ── Astronomi (Basic) ──
  {
    id: 1,
    category: "Astronomi",
    categoryEmoji: "🪐",
    question: "Planet apa yang letaknya paling dekat dengan Matahari di tata surya kita?",
    answer: "Merkurius",
  },
  {
    id: 2,
    category: "Astronomi",
    categoryEmoji: "🪐",
    question: "Planet manakah di tata surya kita yang dijuluki sebagai 'Planet Merah'?",
    answer: "Mars",
  },
  {
    id: 3,
    category: "Astronomi",
    categoryEmoji: "🪐",
    question: "Apa nama satelit alami terbesar yang mengelilingi Bumi?",
    answer: "Bulan",
  },
  {
    id: 4,
    category: "Astronomi",
    categoryEmoji: "🪐",
    question: "Planet terbesar di tata surya kita adalah planet apa?",
    answer: "Jupiter",
  },
  {
    id: 5,
    category: "Astronomi",
    categoryEmoji: "🪐",
    question: "Fenomena ketika Bulan berada tepat di antara Matahari dan Bumi disebut gerhana apa?",
    answer: "Gerhana Matahari",
  },

  // ── Agama & Tajwid (Basic) ──
  {
    id: 6,
    category: "Hukum Tajwid",
    categoryEmoji: "📖",
    question: "Hukum bacaan nun mati (نْ) atau tanwin bertemu dengan huruf Ba (ب) disebut apa?",
    answer: "Iqlab",
  },
  {
    id: 7,
    category: "Hukum Tajwid",
    categoryEmoji: "📖",
    question: "Hukum bacaan yang artinya membaca dengan jelas tanpa dengung disebut apa?",
    answer: "Izhar (Izhar Halqi)",
  },
  {
    id: 8,
    category: "Hukum Tajwid",
    categoryEmoji: "📖",
    question: "Berapa jumlah rukun Islam yang wajib diketahui setiap muslim?",
    answer: "5 (Lima)",
  },
  {
    id: 9,
    category: "Hukum Tajwid",
    categoryEmoji: "📖",
    question: "Hukum bacaan mim mati (مْ) bertemu huruf mim (م) disebut apa?",
    answer: "Idgham Mimi / Mutamatsilain",
  },
  {
    id: 10,
    category: "Hukum Tajwid",
    categoryEmoji: "📖",
    question: "Berapa jumlah huruf Qalqalah dalam ilmu tajwid?",
    answer: "5 Huruf (Ba, Jim, Dal, Tha, Qaf / Qutbu Jadin)",
  },

  // ── Biologi & Hewan (Basic) ──
  {
    id: 11,
    category: "Biologi",
    categoryEmoji: "🧬",
    question: "Sebutkan satu-satunya mamalia berkantung yang bertelur (asal Australia)?",
    answer: "Platypus (atau Ekidna)",
  },
  {
    id: 12,
    category: "Biologi",
    categoryEmoji: "🧬",
    question: "Hewan terbesar di bumi saat ini yang hidup di lautan adalah mamalia apa?",
    answer: "Paus Biru",
  },
  {
    id: 13,
    category: "Biologi",
    categoryEmoji: "🧬",
    question: "Organ tubuh manusia yang berfungsi memompa darah ke seluruh tubuh adalah?",
    answer: "Jantung",
  },
  {
    id: 14,
    category: "Biologi",
    categoryEmoji: "🧬",
    question: "Proses tumbuhan hijau mengolah makanan dengan bantuan sinar matahari disebut apa?",
    answer: "Fotosintesis",
  },
  {
    id: 15,
    category: "Biologi",
    categoryEmoji: "🧬",
    question: "Berapa jumlah kaki yang dimiliki oleh seekor laba-laba?",
    answer: "8 (Delapan)",
  },

  // ── Geografi & Indonesia (Basic) ──
  {
    id: 16,
    category: "Geografi",
    categoryEmoji: "🗺️",
    question: "Apa nama ibukota baru Negara Kesatuan Republik Indonesia?",
    answer: "IKN (Ibu Kota Nusantara)",
  },
  {
    id: 17,
    category: "Geografi",
    categoryEmoji: "🗺️",
    question: "Danau vulkanik terbesar di Indonesia yang memiliki pulau Samosir di tengahnya adalah?",
    answer: "Danau Toba",
  },
  {
    id: 18,
    category: "Geografi",
    categoryEmoji: "🗺️",
    question: "Selat yang memisahkan antara Pulau Jawa dan Pulau Sumatera bernama selat apa?",
    answer: "Selat Sunda",
  },
  {
    id: 19,
    category: "Geografi",
    categoryEmoji: "🗺️",
    question: "Gunung tertinggi di Indonesia yang berada di Papua bersalju abadi adalah puncak apa?",
    answer: "Puncak Jaya (Carstensz Pyramid)",
  },
  {
    id: 20,
    category: "Geografi",
    categoryEmoji: "🗺️",
    question: "Benua terbesar di dunia berdasarkan luas daratan dan populasi adalah benua apa?",
    answer: "Benua Asia",
  },

  // ── Kuliner Nusantara (Basic) ──
  {
    id: 21,
    category: "Kuliner",
    categoryEmoji: "🍜",
    question: "Bumbu dapur berwarna hitam pekat yang menjadi ciri khas kuah Rawon Jawa Timur adalah?",
    answer: "Kluwek / Keluak",
  },
  {
    id: 22,
    category: "Kuliner",
    categoryEmoji: "🍜",
    question: "Makanan khas Palembang yang terbuat dari olahan ikan dan tepung sagu disiram cuko adalah?",
    answer: "Pempek",
  },
  {
    id: 23,
    category: "Kuliner",
    categoryEmoji: "🍜",
    question: "Bahan utama pembuatan tempe yang merupakan fermentasi kapang Rhizopus adalah kacang apa?",
    answer: "Kacang Kedelai",
  },
  {
    id: 24,
    category: "Kuliner",
    categoryEmoji: "🍜",
    question: "Gudeg makanan manis khas Yogyakarta bahan utamanya terbuat dari sayur apa?",
    answer: "Nangka Muda (Gori)",
  },

  // ── Teknologi & Pop Culture (Basic) ──
  {
    id: 25,
    category: "Teknologi",
    categoryEmoji: "💻",
    question: "Sistem operasi smartphone dengan logo robot hijau yang dikembangkan oleh Google bernama?",
    answer: "Android",
  },
  {
    id: 26,
    category: "Teknologi",
    categoryEmoji: "💻",
    question: "Siapakah nama pendiri Microsoft yang sempat menjadi orang terkaya di dunia?",
    answer: "Bill Gates",
  },
  {
    id: 27,
    category: "Pop Culture",
    categoryEmoji: "🎬",
    question: "Karakter superhero Marvel yang merupakan miliarder jenius berbaju zirah merah emas adalah?",
    answer: "Iron Man (Tony Stark)",
  },
  {
    id: 28,
    category: "Pop Culture",
    categoryEmoji: "🎬",
    question: "Siapakah nama teman spons kuning SpongeBob yang berbentuk bintang laut merah muda?",
    answer: "Patrick Star",
  },

  // ── Olahraga & Umum (Basic) ──
  {
    id: 29,
    category: "Olahraga",
    categoryEmoji: "⚽",
    question: "Berapa jumlah pemain dalam satu tim sepak bola yang berada di lapangan pertandingan?",
    answer: "11 Orang",
  },
  {
    id: 30,
    category: "Olahraga",
    categoryEmoji: "🏸",
    question: "Alat pemukul dalam permainan bulu tangkis (badminton) disebut apa?",
    answer: "Raket",
  },
  {
    id: 31,
    category: "Pengetahuan Umum",
    categoryEmoji: "💡",
    question: "Mata uang resmi yang digunakan di negara Jepang bernama apa?",
    answer: "Yen (¥)",
  },
  {
    id: 32,
    category: "Pengetahuan Umum",
    categoryEmoji: "💡",
    question: "Berapa jumlah warna pada pelangi yang biasa disingkat Me-Ji-Ku-Hi-Bi-Ni-U?",
    answer: "7 Warna",
  },
];

export function getRandomTriviaChain(count: number, usedIds: number[] = []): TriviaQuestion[] {
  const available = TRIVIA_QUESTIONS.filter((q) => !usedIds.includes(q.id));
  const pool = available.length >= count ? available : TRIVIA_QUESTIONS;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
