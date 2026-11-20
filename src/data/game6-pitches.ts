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
    product: "Sandal Jepit Swallow Beda Warna & Beda Ukuran",
    flaw: "Kaki kanan hijau lumut ukuran 10, kaki kiri biru pudar ukuran 7, tali jepitnya diganjal peniti karatan",
    targetBuyer: "CEO Startup Unicorn yang mau pitching pendanaan Series B ke investor Silicon Valley",
    prompt: "Jual Sandal Swallow Beda Ukuran ke CEO Startup yang Mau Pitching ke Investor!",
  },
  {
    id: 2,
    product: "Tutup Tupperware Mamah yang Gak Ada Wadahnya",
    flaw: "Cuma selembar tutup plastik warna pink, wadah mangkok aslinya hilang ditelan bumi",
    targetBuyer: "Emak-Emak Ketua Arisan Komplek yang terkenal paling judes & teliti",
    prompt: "Jual Tutup Tupperware Tanpa Wadah ke Emak-Emak Ketua Arisan Komplek!",
  },
  {
    id: 3,
    product: "Knalpot Racing Mberr Bobokan Nembak-Nembak Api",
    flaw: "Suaranya memekakkan telinga radius 500 meter, kalau deselerasi nembak letupan api mirip petasan",
    targetBuyer: "Dokter Bedah Saraf Spesialis Telinga (THT) yang lagi istirahat jaga malam di RS",
    prompt: "Jual Knalpot Racing Mberr Bising ke Dokter Spesialis Telinga yang Lagi Jaga Malam!",
  },
  {
    id: 4,
    product: "Remote TV Jadul yang Dilakban Cokelat & Harus Ditepuk",
    flaw: "Tutup baterainya hilang diganti kertas koran + lakban cokelat tebal, tombol volume harus digetok ke tembok dulu baru respon",
    targetBuyer: "Gamer Sultan yang baru beli Smart TV OLED 85 Inch resolusi 8K seharga 60 juta",
    prompt: "Jual Remote TV Jadul Dilakban Cokelat ke Gamer Sultan Pemilik Smart TV 8K!",
  },
  {
    id: 5,
    product: "Kabel Charger HP Serabut Kuningan Terkelupas",
    flaw: "Kabelnya sudah terkelupas kawat tembaganya, cuma bisa ngisi daya kalau posisinya ditekuk 45 derajat sambil ditindih botol minum",
    targetBuyer: "Eksekutif Korporat SCBD yang baterai HP-nya tinggal 1% pas genting call zoom investor luar negeri",
    prompt: "Jual Charger HP Kabel Terkelupas ke Eksekutif SCBD Pas Baterai Tinggal 1%!",
  },
  {
    id: 6,
    product: "Payung Promosi Caleg 2004 Rusuk Patah Sebelah",
    flaw: "Sablon muka calegnya luntur, rusuk besinya patah 2 bikin payung miring sebelah, kalau dibuka suaranya mirip tulang retak",
    targetBuyer: "Model Catwalk Paris Fashion Week yang lagi pemotretan runway outdoor musim semi",
    prompt: "Jual Payung Caleg Patah Sebelah ke Model Catwalk Paris Fashion Week!",
  },
  {
    id: 7,
    product: "Kipas Angin Dinding Bunyi 'Ngiik-Grok-Ngiik'",
    flaw: "Gak bisa diem di tempat, muter liar sambil ngeluarin decitan horor mirip kuntilanak tengah malam",
    targetBuyer: "Pasangan Pengantin Baru yang lagi sewa villa bulan madu sunyi di pegunungan",
    prompt: "Jual Kipas Angin Bunyi Horor Kuntilanak ke Pasangan Pengantin Baru yang Lagi Honeymoon!",
  },
  {
    id: 8,
    product: "Helm Bogo Kaca Pelangi Gelap Total",
    flaw: "Kalau siang silau bikin pusing, kalau malam pandangan gelap 100% mirip ditutup kain kafan",
    targetBuyer: "Driver Ojol yang lagi kejar orderan antar martabak telor jam 2 dini hari di jalanan tanpa lampu",
    prompt: "Jual Helm Bogo Kaca Gelap Gulita ke Driver Ojol yang Orderan Jam 2 Malam!",
  },
  {
    id: 9,
    product: "Dispenser Galon yang Keran Dinginnya Keluar Air Mendidih",
    flaw: "Keran biru es batu malah nyembur air panas 95°C, keran merah kopi malah keluar air es beku",
    targetBuyer: "Barista Cafe Artisanal Jaksel yang punya standar seduh manual brew presisi per derajat",
    prompt: "Jual Dispenser Keran Terbalik ke Barista Cafe Manual Brew Jaksel!",
  },
  {
    id: 10,
    product: "Botol Kecap Manis Warung dengan Kerak Karamel 5 Cm",
    flaw: "Tutup botolnya sudah menyatu abadi dengan leher botol gara-gara tumpukan kerak kecap kering dari era Reformasi",
    targetBuyer: "Food Vlogger Bintang Lima Michelin yang terkenal higienis & anti-bakteri",
    prompt: "Jual Botol Kecap Kerak Abadi ke Food Vlogger Bintang Lima Higienis!",
  },
  {
    id: 11,
    product: "Setrikaan Gosong Berkerak Gosong Lengket",
    flaw: "Tapak bawahnya ada lapisan hitam gosong pekat yang kalau kena kain langsung nyetak motif batik cokelat terbakar",
    targetBuyer: "Calon Pengantin Pria yang 1 jam lagi mau akad nikah pake baju jas putih sutra",
    prompt: "Jual Setrika Gosong Berkerak ke Calon Pengantin Pria 1 Jam Sebelum Akad Nikah!",
  },
  {
    id: 12,
    product: "Motor Matic Karbu yang Harus Disela Engkol 47 Kali",
    flaw: "Tombol starter mati, kalau diengkol harus sambil baca doa selamat dan digas setengah biar gak kebanjiran bensin",
    targetBuyer: "Maling Amatir yang lagi terpojok dikejar warga satu kampung di gang buntu",
    prompt: "Jual Motor Matic Susah Nyala ke Maling Amatir yang Lagi Dikejar Warga!",
  },
  {
    id: 13,
    product: "Sabun Batangan Sisa Secuil Seukuran Koin Tipis",
    flaw: "Bentuknya melengkung tipis transparan, kalau digosok langsung retak jadi 3 bagian dan gak ngeluarin busa",
    targetBuyer: "General Manager Hotel Bintang Lima Mewah yang lagi inspeksi amenities kamar presidential suite",
    prompt: "Jual Sabun Batang Tipis Secuil ke GM Hotel Bintang Lima Mewah!",
  },
  {
    id: 14,
    product: "Korek Api Tokai Gas Kosong tapi Percikan Api Nyala",
    flaw: "Gasnya kering kerontang 0%, cuma keluar percikan batu api merah kecil setiap digesek kencang",
    targetBuyer: "Chef Eksekutif Restoran Mewah yang mau atraksi flambé daging steak wagyu A5 depan tamu VIP",
    prompt: "Jual Korek Tokai Kosong Gas ke Chef Restoran yang Mau Aksi Flambé Wagyu!",
  },
  {
    id: 15,
    product: "Celana Kulot Jeans Robek Pas di Selangkangan Belakang",
    flaw: "Modelnya modis kekinian, tapi ada robekan ventilasi darurat selebar 15 cm tepat di jahitan tengah belakang",
    targetBuyer: "Instruktur Senam Aerobik Minggu Pagi yang memimpin ratusan warga di panggung alun-alun",
    prompt: "Jual Celana Robek Selangkangan ke Instruktur Senam di Panggung Alun-Alun!",
  },
  {
    id: 16,
    product: "Powerbank Berat 5 Kg Kapasitas 200 mAh",
    flaw: "Bentuk dan beratnya sebanding sama batako semen proyek, pas dicolok cuma nambah baterai 3% lalu mati total",
    targetBuyer: "Selebgram Fashion Bandara yang hobinya bepergian minimalis cuma bawa clutch bag kecil",
    prompt: "Jual Powerbank Batako 5 Kg ke Selebgram Fashion Bandara!",
  },
  {
    id: 17,
    product: "Bantal Kapuk Jadul Isi Gumpalan Keras Mirip Batu Kali",
    flaw: "Bentuknya sudah gepeng tidak karuan, sarungnya motif bunga pudar, kalau ditekan ada gumpalan kapuk sekeras batu",
    targetBuyer: "Influencer Terapi Tulang Leher Chiropractor yang lagi bikin konten kasur ergonomis",
    prompt: "Jual Bantal Kapuk Keras Batu ke Influencer Terapi Tulang Leher Chiropractor!",
  },
  {
    id: 18,
    product: "Kipas Angin Tanpa Baling-Baling (Cuma Dinamo Berdengung)",
    flaw: "Baling-balingnya copot, cuma tersisa as besi dinamo yang muter kencang sambil ngeluarin bau angit korsleting",
    targetBuyer: "Astronot di Stasiun Luar Angkasa ISS yang kepanasan saat berada di orbit bumi",
    prompt: "Jual Dinamo Kipas Angit ke Astronot di Stasiun Luar Angkasa!",
  },
  {
    id: 19,
    product: "Payung Bolong Bermotif Jaring Ikan Transparan",
    flaw: "Kain payungnya full bolong-bolong estetik mirip kelambu jaring, air hujan leluasa menerpa kepala",
    targetBuyer: "Pejalan Kaki di Kota Bogor yang terjebak hujan badai angin petir jam 5 sore",
    prompt: "Jual Payung Bolong Jaring ke Pejalan Kaki di Bogor Pas Hujan Badai Petir!",
  },
  {
    id: 20,
    product: "Sisir Rambut Bergigi Besi Paku Berkarat",
    flaw: "Geriginya terbuat dari paku seng tipis yang kasar dan tajam",
    targetBuyer: "Pria Botak Licin Mengkilap yang sangat bangga dengan kehalusan kulit kepalanya",
    prompt: "Jual Sisir Paku Besi ke Pria Botak Licin Mengkilap!",
  },
  {
    id: 21,
    product: "Senter Bertenaga Sinar Surya (Hanya Nyala Saat Terik)",
    flaw: "Sensor lampunya cuma mau hidup kalau diletakkan di bawah sengatan matahari jam 12 siang terik, malam hari mati lelap",
    targetBuyer: "Vampir Kuno yang sudah hidup 500 tahun dan alergi fatal terhadap sinar matahari",
    prompt: "Jual Senter Tenaga Surya ke Vampir Kuno Alergi Matahari!",
  },
  {
    id: 22,
    product: "Es Batu Beku Rasa Bumbu Soto Ayam Kuah Kuning",
    flaw: "Bentuknya kotak es batu kristal bening, tapi pas dijilat rasanya kunyit asin, sereh, dan micin pekat",
    targetBuyer: "Penguin Kutub Selatan yang sedang kehausan mencari air tawar segar",
    prompt: "Jual Es Batu Rasa Kuah Soto Ayam ke Penguin Kutub Selatan!",
  },
  {
    id: 23,
    product: "Kacamata Hitam Minus 12 Sangat Gelap & Pusing",
    flaw: "Lensa tebal pantat botol sirup, bikin jarak pandang 10 cm jadi blur melengkung dan memicu migren instan",
    targetBuyer: "Wasit Utama Sepak Bola Liga 1 yang sedang memimpin partai panas final perebutan juara",
    prompt: "Jual Kacamata Minus 12 Gelap ke Wasit Sepak Bola di Partai Final!",
  },
  {
    id: 24,
    product: "Jas Hujan Sekali Pakai dari Bahan Tisu Basah Mengering",
    flaw: "Kena rintik gerimis pertama langsung robek hancur menjadi bubur kertas di sekujur badan",
    targetBuyer: "Anak Motor Komunitas Touring Lintas Sumatera yang mau terobos badai bukit barisan",
    prompt: "Jual Jas Hujan Tisu Basah ke Rider Touring Lintas Sumatera!",
  },
  {
    id: 25,
    product: "Mic Karaoke yang Mengubah Suara Jadi Tangisan Bayi Owe-Owe",
    flaw: "Apapun lagu yang dinyanyikan, output suara speaker diubah otomatis jadi jeritan bayi minta susu",
    targetBuyer: "Vokalis Band Death Metal Cadas yang mau perform di festival musik padas underground",
    prompt: "Jual Mic Tangisan Bayi ke Vokalis Band Death Metal di Festival Underground!",
  },
  {
    id: 26,
    product: "Buku Kamus Tebal Bahasa Planet Mars Tanpa Arti",
    flaw: "Isi halamannya ada 800 lembar penuh simbol garis segitiga ngacak tanpa penjelasan tata bahasa",
    targetBuyer: "Siswa SMA yang 10 menit lagi masuk ruangan Ujian Nasional Bahasa Indonesia",
    prompt: "Jual Kamus Bahasa Mars ke Siswa yang Mau Ujian Nasional Bahasa Indonesia!",
  },
  {
    id: 27,
    product: "Gelas Kopi Tanpa Dasar (Bolong Silinder Pipa)",
    flaw: "Bagian dasarnya tidak ada alasnya sama sekali, kopi yang dituangkan langsung mengalir bebas ke lantai",
    targetBuyer: "Bapak-Bapak Pengabdi Kopi Tubruk Pagi Hari di Pos Kamling Ronda",
    prompt: "Jual Gelas Bolong Tanpa Bawah ke Bapak Pengabdi Kopi Tubruk di Pos Ronda!",
  },
  {
    id: 28,
    product: "Jam Alarm Beker yang Suaranya Bisikan Desahan Lembut",
    flaw: "Bukannya bunyi dering nyaring, jam ini malah berbisik 'ssshhh... tidur lagi aja ya manis...' dengan tempo merdu",
    targetBuyer: "Mahasiswa Tingkat Akhir yang jadwal sidang skripsinya jam 06.30 pagi dengan dosen killer",
    prompt: "Jual Alarm Suara Desahan Lemah ke Mahasiswa yang Jadwal Sidang Jam 06.30 Pagi!",
  },
  {
    id: 29,
    product: "Piring Makan Berlubang Saringan Santan Kelapa",
    flaw: "Seluruh permukaannya pori-pori saringan, kalau dikasih nasi kuah gulai, celana langsung banjir bumbu",
    targetBuyer: "Pemilik Rumah Makan Nasi Padang Legendaris yang porsi kuahnya selalu banjir melimpah",
    prompt: "Jual Piring Saringan Santan ke Pemilik Rumah Makan Nasi Padang!",
  },
  {
    id: 30,
    product: "Gembok Pagar Rumah yang Kuncinya Gak Bisa Dicabut",
    flaw: "Anak kuncinya patah dan macet di lubang silinder gembok dalam posisi setengah terkunci",
    targetBuyer: "Satpam Komplek Perumahan Mewah yang bertugas menjaga portal keamanan utama",
    prompt: "Jual Gembok Macet Kunci Patah ke Satpam Komplek Perumahan Mewah!",
  },
];

export function getRandomPitchItem(usedIds: number[] = []): PitchItem {
  const available = PITCH_ITEMS.filter((p) => !usedIds.includes(p.id));
  const pool = available.length > 0 ? available : PITCH_ITEMS;
  return pool[Math.floor(Math.random() * pool.length)];
}
