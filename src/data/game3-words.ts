export type WordCategory = {
  label: string;
  words: string[];
};

export const WORD_CATEGORIES: WordCategory[] = [
  {
    label: "Pesepakbola Legendaris (Super Terkenal)",
    words: [
      "Cristiano Ronaldo (CR7)",
      "Lionel Messi",
      "David Beckham",
      "Neymar Jr",
      "Kylian Mbappé",
      "Zinedine Zidane",
      "Ronaldinho",
      "Erling Haaland",
      "Diego Maradona",
      "Pelé",
      "Bambang Pamungkas",
    ],
  },
  {
    label: "Sparepart & Komponen Motor",
    words: [
      "Busi",
      "Karburator",
      "Knalpot Brong",
      "Spion Jalu",
      "Aki Motor",
      "Kampas Rem",
      "V-Belt Matic",
      "Oli Samping",
      "Standar Samping",
      "Rantai Motor",
      "Shockbreaker",
      "Ban Tubeless",
      "Piringan Cakram",
      "Radiator",
      "Velg Bintang",
    ],
  },
  {
    label: "Perkakas & Alat Tukang Rumah",
    words: [
      "Obeng Kembang (+)",
      "Tang Buaya",
      "Palu Martil",
      "Kunci Inggris",
      "Gergaji Kayu",
      "Meteran Gulung",
      "Bor Listrik",
      "Solder Listrik",
      "Tespen Listrik",
      "Pompa Ban Manual",
      "Lem Tembak",
      "Amplas Kayu",
    ],
  },
  {
    label: "Rental PS & Game Tongkrongan",
    words: [
      "PlayStation 2 (PS2)",
      "Memory Card 8MB",
      "Rental PS Billing",
      "GTA San Andreas",
      "Winning Eleven",
      "Stick Getar PS",
      "Cheat Kebal GTA",
      "Game Boy",
      "Mobile Legends",
      "Tamiya 4WD",
    ],
  },
  {
    label: "Hobi, Gym & Olahraga Cowok",
    words: [
      "Futsal Malam",
      "Barbel Gym",
      "Bench Press",
      "Push Up",
      "Tarik Tambang",
      "Kopi Hitam Panas",
      "Karambol",
      "Papan Catur",
    ],
  },
];

export function getRandomWordFromCategory(categoryLabel: string): string {
  const cat = WORD_CATEGORIES.find((c) => c.label === categoryLabel);
  if (!cat) return "";
  return cat.words[Math.floor(Math.random() * cat.words.length)];
}
