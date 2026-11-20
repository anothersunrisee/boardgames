export type WordCategory = {
  label: string;
  words: string[];
};

export const WORD_CATEGORIES: WordCategory[] = [
  {
    label: "Sparepart Motor",
    words: [
      "Knalpot",
      "Busi",
      "Spion",
      "Aki Motor",
      "Rantai Motor",
      "Ban Tubeless",
      "Kampas Rem",
      "Stang Motor",
      "Shockbreaker",
      "Standar Samping",
      "Lampu Sein",
      "Klakson",
      "Speedometer",
      "Karburator",
      "Oli Mesin",
      "Jok Motor",
      "Spakbor",
      "Piringan Cakram",
      "Radiator",
      "Velg Motor",
    ],
  },
  {
    label: "Pemain Sepak Bola (Super Terkenal)",
    words: [
      "Cristiano Ronaldo (CR7)",
      "Lionel Messi",
      "Neymar Jr",
      "Kylian Mbappé",
      "David Beckham",
      "Erling Haaland",
      "Zlatan Ibrahimović",
      "Ronaldinho",
      "Zinedine Zidane",
      "Diego Maradona",
      "Pelé",
      "Karim Benzema",
      "Luka Modrić",
      "Bambang Pamungkas",
      "Pratama Arhan",
      "Asnawi Mangkualam",
      "Marselino Ferdinan",
      "Ernando Ari",
    ],
  },
  {
    label: "Alat Perkakas & Bengkel",
    words: [
      "Palu / Martil",
      "Obeng Plus / Minus",
      "Tang",
      "Gergaji",
      "Bor Listrik",
      "Kunci Inggris",
      "Kunci Pas",
      "Meteran Gulung",
      "Paku",
      "Baut & Mur",
      "Cutter",
      "Isolasi Hitam",
      "Lem Fox / Aibon",
      "Amplas",
      "Tangga Lipat",
      "Pompa Ban",
    ],
  },
  {
    label: "Istilah Sepak Bola Umum",
    words: [
      "Penalti",
      "Kartu Merah",
      "Kartu Kuning",
      "Offside",
      "Tendangan Bebas",
      "Kiper",
      "Corner Kick (Sepak Pojok)",
      "Gol Salto",
      "Babak Tambahan",
      "Lemparan Ke Dalam",
    ],
  },
];

export function getRandomWordFromCategory(categoryLabel: string): string {
  const cat = WORD_CATEGORIES.find((c) => c.label === categoryLabel);
  if (!cat) return "";
  return cat.words[Math.floor(Math.random() * cat.words.length)];
}
