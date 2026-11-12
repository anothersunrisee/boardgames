export type WordCategory = {
  label: string;
  words: string[];
};

export const WORD_CATEGORIES: WordCategory[] = [
  {
    label: "Part Motor",
    words: ["Busi", "Karburator", "Kampas Rem", "Oli Mesin", "Rantai", "Knalpot", "Klakson", "Velg", "Ban Tubeless", "Spakbor"],
  },
  {
    label: "Sepak Bola",
    words: ["Striker", "Offside", "Hat-trick", "Penalti", "Dribble", "Corner Kick", "Kartu Merah", "Tendangan Bebas", "Kiper", "Diving"],
  },
  {
    label: "Otomotif",
    words: ["Kopling", "Transmisi", "Radiator", "Suspensi", "Power Steering", "Rem ABS", "Turbo", "Mesin Diesel", "Oli Transmisi", "Aki"],
  },
  {
    label: "Dunia Game",
    words: ["Farming", "Respawn", "Rank", "Noob", "GG", "Headshot", "Lag", "Cheat Engine", "Buff", "Nerf"],
  },
  {
    label: "Barang Cowok",
    words: ["Pomade", "Multitool", "Parfum", "Dompet Kulit", "Earphone", "Jam Tangan", "Tas Pinggang", "Charger Power Bank", "Pisau Lipat", "Kaca Spion"],
  },
  {
    label: "Teknologi",
    words: ["RAM", "Processor", "Bandwidth", "Motherboard", "Heatsink", "SSD", "GPU", "Firmware", "Kernel", "Port USB"],
  },
  {
    label: "Alat Pertukangan",
    words: ["Obeng", "Kunci Pas", "Bor Listrik", "Palu", "Gergaji Mesin", "Waterpass", "Tang Kombinasi", "Meteran", "Klem C", "Mata Bor"],
  },
];

export function getRandomWordFromCategory(categoryLabel: string): string {
  const cat = WORD_CATEGORIES.find((c) => c.label === categoryLabel);
  if (!cat) return "";
  return cat.words[Math.floor(Math.random() * cat.words.length)];
}

