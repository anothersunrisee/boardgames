export type PitchItem = {
  id: number;
  product: string;
  flaw: string;
  targetBuyer: string;
  prompt: string;
};

export const PITCH_ITEMS: PitchItem[] = [
  {
    id: 1,
    product: "Kipas Angin Tanpa Baling-Baling",
    flaw: "Cuma mesin dinamo muter doang, gak ngeluarin angin sama sekali",
    targetBuyer: "Astronot di Stasiun Luar Angkasa ISS (Gravitasi Nol)",
    prompt: "Jual Kipas Angin Tanpa Baling-Baling ke Astronot di Luar Angkasa!",
  },
  {
    id: 2,
    product: "Payung Bolong Bermotif Jaring Ikan",
    flaw: "Kain payungnya bolong-bolong transparan mirip jaring ikan",
    targetBuyer: "Warga Bogor yang lagi jalan kaki pas hujan badai petir",
    prompt: "Jual Payung Bolong Jaring Ikan ke Pejalan Kaki di Bogor pas Hujan Badai!",
  },
  {
    id: 3,
    product: "Sisir Rambut Bergigi Besi Berkarat",
    flaw: "Geriginya tajam dan kasar",
    targetBuyer: "Pria Botak Licin Mengkilap yang bangga dengan kepalanya",
    prompt: "Jual Sisir Rambut Besi ke Pria Botak Licin Mengkilap!",
  },
  {
    id: 4,
    product: "Senter Bertenaga Sinar Matahari",
    flaw: "Cuma bisa menyala kalau terkena terik sinar matahari langsung siang hari",
    targetBuyer: "Vampir Bangsawan Kuno yang alergi sinar ultraviolet",
    prompt: "Jual Senter Bertenaga Sinar Matahari ke Vampir Bangsawan Kuno!",
  },
  {
    id: 5,
    product: "Es Batu Rasa Kuah Rawon Hangat",
    flaw: "Bentuknya es batu beku tapi rasanya kuah kluwek asin gurih",
    targetBuyer: "Penguin Kutub Utara yang sedang kepanasan",
    prompt: "Jual Es Batu Rasa Kuah Rawon ke Penguin di Kutub Utara!",
  },
  {
    id: 6,
    product: "Kacamata Hitam Minus 10 Sangat Buram",
    flaw: "Bikin pandangan gelap total dan pusing tujuh keliling",
    targetBuyer: "Wasit Sepak Bola Liga 1 yang sedang memimpin laga final",
    prompt: "Jual Kacamata Hitam Minus 10 Buram ke Wasit Sepak Bola!",
  },
  {
    id: 7,
    product: "Jas Hujan Tembus Pandang Berbahan Tisu Toilet",
    flaw: "Langsung hancur lebur saat terkena tetesan air pertama",
    targetBuyer: "Anak Motor Sunmori yang touring Bandung-Jakarta",
    prompt: "Jual Jas Hujan Tisu Toilet ke Anak Motor Touring!",
  },
  {
    id: 8,
    product: "Helm Motor Tanpa Kaca Depan & Bolong di Atas",
    flaw: "Bikin angin, debu, dan air hujan langsung masuk ke muka",
    targetBuyer: "Pembalap MotoGP yang balapan di sirkuit basah",
    prompt: "Jual Helm Motor Bolong Tanpa Kaca ke Pembalap MotoGP!",
  },
  {
    id: 9,
    product: "Kasur Berduri Buah Durian Musang King",
    flaw: "Permukaannya tajam, berbau menyengat menyiksa",
    targetBuyer: "Orang yang menderita Insomnia Akut 3 hari gak tidur",
    prompt: "Jual Kasur Berduri Durian ke Penderita Insomnia Parah!",
  },
  {
    id: 10,
    product: "Jam Beker Alarm Berbisik Suara Lemah Lembut",
    flaw: "Suaranya desahan bisikan pelan hampir tidak terdengar",
    targetBuyer: "Mahasiswa Tukang Tidur Kebo yang ada sidang skripsi jam 7 pagi",
    prompt: "Jual Jam Beker Suara Bisikan Lemah ke Mahasiswa Tukang Tidur Kebo!",
  },
  {
    id: 11,
    product: "Powerbank Berkapasitas 50 mAh (Berat 3 Kilogram)",
    flaw: "Cuma bisa nambah baterai 2% tapi seberat barbel fitness",
    targetBuyer: "Influencer TikTok yang lagi live streaming maraton seharian",
    prompt: "Jual Powerbank 3 Kg Kapasitas 50 mAh ke Seleb TikTok!",
  },
  {
    id: 12,
    product: "Pintu Rumah Anti-Maling Tanpa Kunci & Handle",
    flaw: "Kalau sudah ditutup gak ada yang bisa buka dari luar maupun dalam",
    targetBuyer: "Keluarga yang baru beli rumah baru di komplek rawan maling",
    prompt: "Jual Pintu Anti-Maling Tanpa Handle ke Pemilik Rumah Baru!",
  },
  {
    id: 13,
    product: "Sepatu Hak Tinggi (High Heels) Beroda Sepatu Roda",
    flaw: "Tinggi 15 cm dengan roda licin tanpa rem",
    targetBuyer: "Pendaki Gunung yang mau summit attack Gunung Rinjani",
    prompt: "Jual High Heels Beroda Roda ke Pendaki Gunung Rinjani!",
  },
  {
    id: 14,
    product: "Mic Karaoke yang Mengubah Suara Jadi Tangisan Bayi",
    flaw: "Apapun lagu yang dinyanyikan, outputnya jadi rengekan bayi haus susu",
    targetBuyer: "Vokalis Band Rock Underground beraliran cadas",
    prompt: "Jual Mic Suara Tangisan Bayi ke Vokalis Band Metal Underground!",
  },
  {
    id: 15,
    product: "Baju Hangat Wol Tebal Berpemanas Internal 60°C",
    flaw: "Panasnya mendidih dan tidak bisa dimatikan",
    targetBuyer: "Warga Kota Surabaya dan Bekasi saat jam 12 siang terik",
    prompt: "Jual Jaket Pemanas 60°C ke Warga Surabaya di Jam 12 Siang Terik!",
  },
  {
    id: 16,
    product: "Piring Makan Berlubang Saringan Santan",
    flaw: "Setiap ditaruh makanan basah, kuahnya langsung tumpah ke celana",
    targetBuyer: "Penjual Soto Kuah Santan Madura legendaris",
    prompt: "Jual Piring Makan Berlubang Saringan ke Penjual Soto Kuah!",
  },
  {
    id: 17,
    product: "Cangkir Teh Tanpa Bagian Bawah (Bolong Tembus Pandang)",
    flaw: "Hanya silinder tabung kosong tanpa alas cangkir",
    targetBuyer: "Bapak-Bapak Pecinta Kopi Hitam Pagi Hari di Pos Ronda",
    prompt: "Jual Cangkir Teh Bolong Tanpa Alas ke Bapak-Bapak Pos Ronda!",
  },
  {
    id: 18,
    product: "Buku Pelajaran Bahasa Alien (Huruf Tidak Dikenal)",
    flaw: "Semua tulisan berupa coretan acak tanpa terjemahan",
    targetBuyer: "Anak SD yang besok pagi ada Ujian Akhir Semester Matematika",
    prompt: "Jual Buku Bahasa Alien ke Anak SD yang Mau Ujian Matematika!",
  },
];

export function getRandomPitchItem(usedIds: number[] = []): PitchItem {
  const available = PITCH_ITEMS.filter((p) => !usedIds.includes(p.id));
  const pool = available.length > 0 ? available : PITCH_ITEMS;
  return pool[Math.floor(Math.random() * pool.length)];
}
