export type PunishmentCard = {
  id: number;
  title: string;
  punishment: string;
  emoji: string;
  difficulty: "Kocak" | "Brutal" | "Ekspresif";
};

export const PUNISHMENT_CARDS: PunishmentCard[] = [
  {
    id: 1,
    title: "Vokal O Sejati",
    punishment: "Selama 1 game ke depan, setiap kamu ngobrol semua huruf vokal (A, I, U, E, O) WAJIB diganti huruf 'O' semua!",
    emoji: "🗣️",
    difficulty: "Kocak",
  },
  {
    id: 2,
    title: "Pose Iyup Centil",
    punishment: "Selama 1 game ke depan, kamu DILARANG KETAWA! Kalau kamu senyum atau ketawa dikit aja, wajib reflek pasang pose centil 'iyup' dengan kedua tangan di pipi!",
    emoji: "💅",
    difficulty: "Ekspresif",
  },
  {
    id: 3,
    title: "Presenter Berita Gosip",
    punishment: "Wajib berbicara dengan intonasi presenter berita infotainment TV gosip dengan nada mendayu-dayu dan tatapan dramatis!",
    emoji: "📺",
    difficulty: "Kocak",
  },
  {
    id: 4,
    title: "Izin Yang Mulia",
    punishment: "Setiap kali kamu mau berbicara sepatah kata pun, WAJIB diawali dengan kalimat: 'Mohon izin Yang Mulia Paduka...'!",
    emoji: "👑",
    difficulty: "Kocak",
  },
  {
    id: 5,
    title: "Tukang Sorak Gokil",
    punishment: "Setiap ada pemain lain yang tertawa, kamu wajib tepuk tangan heboh sambil teriak kencang: 'Gokil abis braaay!'",
    emoji: "👏",
    difficulty: "Ekspresif",
  },
  {
    id: 6,
    title: "Model Katalog Busana",
    punishment: "Selama 1 game ke depan, tangan kananmu wajib menempel di pinggang dengan postur tegak seperti foto model majalah busana!",
    emoji: "💃",
    difficulty: "Ekspresif",
  },
  {
    id: 7,
    title: "Patah Hati Melankolis",
    punishment: "Berbicaralah dengan nada orang yang lagi nangis sesenggukan karena baru diputusin pacar secara sepihak!",
    emoji: "😭",
    difficulty: "Brutal",
  },
  {
    id: 8,
    title: "Kucing Manja Meow",
    punishment: "Wajib menyelipkan suara kucing 'Meow~' di akhir setiap kalimat yang kamu ucapkan!",
    emoji: "🐱",
    difficulty: "Kocak",
  },
  {
    id: 9,
    title: "Bicara Slow-Motion 0.5x",
    punishment: "Bicaralah dengan kecepatan super lambat (0.5x speed) seperti kaset pita rusak atau robot kehabisan baterai!",
    emoji: "🐢",
    difficulty: "Brutal",
  },
  {
    id: 10,
    title: "Kedip Genit (Wink Master)",
    punishment: "Setiap kali menyebut angka atau nama orang, kamu harus wink (mengedipkan satu mata genit) ke orang di sebelah kananmu!",
    emoji: "😉",
    difficulty: "Ekspresif",
  },
  {
    id: 11,
    title: "Hamba dan Tuan Besar",
    punishment: "DILARANG menggunakan kata 'aku', 'kamu', atau 'saya'. Ganti dirimu dengan sebutan 'Hamba' dan orang lain sebagai 'Tuan Besar'!",
    emoji: "🙇",
    difficulty: "Brutal",
  },
  {
    id: 12,
    title: "Komentator Bola Histeris",
    punishment: "Berbicaralah dengan nada komentator sepak bola yang sedang histeris melihat peluang emas di menit-menit akhir!",
    emoji: "⚽",
    difficulty: "Kocak",
  },
  {
    id: 13,
    title: "Anak Jaksel Tulen",
    punishment: "Wajib menyelipkan kata 'literally', 'which is', 'honestly', dan 'prefer' di setiap kalimat yang kamu keluarkan!",
    emoji: "🕶️",
    difficulty: "Kocak",
  },
  {
    id: 14,
    title: "Motivator Sukses Emas",
    punishment: "Setiap selesai berbicara, tutup kalimatmu dengan kutipan motivasi bijak: 'Salam super, masa depan ada di tanganmu!'",
    emoji: "🌟",
    difficulty: "Ekspresif",
  },
  {
    id: 15,
    title: "Sumpah Pemuda Berapi-api",
    punishment: "Harus berbicara dengan intonasi pejuang kemerdekaan yang sedang orasi di depan jutaan rakyat dengan kepalan tangan di udara!",
    emoji: "✊",
    difficulty: "Kocak",
  },
];

export function getRandomPunishment(excludeIds: number[] = []): PunishmentCard {
  const available = PUNISHMENT_CARDS.filter((p) => !excludeIds.includes(p.id));
  const pool = available.length > 0 ? available : PUNISHMENT_CARDS;
  return pool[Math.floor(Math.random() * pool.length)];
}
