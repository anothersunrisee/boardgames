export type DebateTopic = {
  id: number;
  topic: string;
  proStance: string;
  contraStance: string;
};

export const DEBATE_TOPICS: DebateTopic[] = [
  {
    id: 1,
    topic: "Mas-mas tukang parkir depan Indomaret jauh lebih cocok gantiin Presiden daripada politisi.",
    proStance: "Setuju! Tanpa janji manis, modal peluit semua masalah beres, perputaran uang 2 ribu langsung lancar nyata!",
    contraStance: "Gak setuju! Pas rakyat butuh bantuan ngilang, pas rakyat mau cabut tiba-tiba muncul minta jatah!",
  },
  {
    id: 2,
    topic: "Bendahara kita jauh lebih kompeten jadi Menteri Keuangan daripada menteri resmi.",
    proStance: "Setuju! Uang kas goceng aja dikejar sampai ujung dunia, kas negara dijamin surplus anti-korupsi!",
    contraStance: "Gak setuju! Catatannya cuma di sobekan kertas binder lecek dan gak pernah ada audit independen!",
  },
  {
    id: 3,
    topic: "Besok kita semua wajib ke kampus / ke kantor gak usah pake celana (cuma boxer atau sarung).",
    proStance: "Setuju! Sirkulasi udara maksimal bikin otak encer, bebas gerah, produktivitas kerja melonjak 300%!",
    contraStance: "Gak setuju! Polusi pemandangan di ruang rapat bakal merusak moral dan bikin HRD kena serangan jantung!",
  },
  {
    id: 4,
    topic: "Kalau ditilang polisi, pura-pura kesurupan macan putih adalah strategi bela diri yang sah dan bermartabat.",
    proStance: "Setuju! Polisi bakal bingung mau nilang siapa, hemat uang denda, dan menguji kemampuan spiritual aparat!",
    contraStance: "Gak setuju! Malah dikira gila, motor tetep disita, terus disuruh rukiah di pos polisi!",
  },
  {
    id: 5,
    topic: "Makan nasi Padang pake sendok garpu adalah tindak pidana yang pantas dihukum kurungan 5 tahun.",
    proStance: "Setuju! Itu penistaan budaya kuliner leluhur! Kenikmatan bumbu rendang cuma menyatu lewat pori-pori jari tangan!",
    contraStance: "Gak setuju! Hak asasi jari higienis! Cuci tangan di kobokan air hangat jeruk nipis itu sering gak bersih!",
  },
  {
    id: 6,
    topic: "Cowok yang teriak histeris pas lihat kecoa terbang wajib dicabut KTP dan hak suaranya seumur hidup.",
    proStance: "Setuju! Lawan serangga 3 cm aja panik kabur ke atas kasur, gimana mau melindungi keluarga dari marabahaya!",
    contraStance: "Gak setuju! Kecoa terbang itu bukan serangga biasa, itu teror perang biologis radar militer!",
  },
  {
    id: 7,
    topic: "Teman yang minjam seratus ribu lalu menghilang sebenarnya malaikat yang sedang menguji keikhlasan hati kita.",
    proStance: "Setuju! Jangan ditagih, anggap tiket masuk surga jalur prestasi sedekah tak terduga!",
    contraStance: "Gak setuju! Itu parasit pertemanan berkedok musibah, wajib diviralkan di grup WA keluarga!",
  },
  {
    id: 8,
    topic: "Tidur siang 4 jam di meja kerja adalah hak asasi manusia yang dijamin UUD 1945.",
    proStance: "Setuju! Otak yang tidur adalah mesin ekonomi masa depan, karyawan bangun langsung jadi jenius!",
    contraStance: "Gak setuju! Itu namanya makan gaji buta, perusahaan bisa bangkrut gara-gara orkestra dengkuran!",
  },
  {
    id: 9,
    topic: "Kucing oren sebenarnya adalah alien kiriman galaksi lain yang sedang memata-matai kebodohan manusia.",
    proStance: "Setuju! Tingkah lakunya gak masuk akal fisika bumi, jelas mereka lagi kirim transmisi sinyal ke luar angkasa!",
    contraStance: "Gak setuju! Jangan overthinking, mereka cuma lapar dan punya satu sel otak yang gantian dipake!",
  },
  {
    id: 10,
    topic: "Tukang tambal ban pinggir jalan berhak dapet gelar Profesor Kehormatan Teknik Mesin tanpa skripsi.",
    proStance: "Setuju! Cuma modal baskom air sama kompon karet bisa nyelamatin nyawa orang di malam gelap gulita!",
    contraStance: "Gak setuju! Sering nebak bocor halus padahal pentilnya doang yang kendor biar dapet 25 ribu!",
  },
  {
    id: 11,
    topic: "Orang yang makan bubur diaduk punya potensi tersembunyi jadi agen rahasia CIA.",
    proStance: "Setuju! Mereka pragmatis, gak peduli estetika, yang penting semua nutrisi menyatu efisien masuk lambung!",
    contraStance: "Gak setuju! Bentuknya mirip makanan hewan, itu tanda kekacauan batin yang belum selesai!",
  },
  {
    id: 12,
    topic: "Ngapain kuliah capek-capek 4 tahun kalau bisa jadi bandar lele sukses atau joki skripsi?",
    proStance: "Setuju! Modal kolam terpal dapet cuan jutaan tanpa drama revisi dosen pembimbing arogan!",
    contraStance: "Gak setuju! Kuliah itu buat memperluas koneksi, wawasan, dan punya foto pake toga buat status ibu di FB!",
  },
  {
    id: 13,
    topic: "Orang yang pasang alarm tiap 5 menit (05.55, 06.00, 06.05) adalah ancaman nyata peradaban rumah tangga.",
    proStance: "Setuju! Satu rumah bangun stres gara-gara alarm dia, tapi yang punya alarm tetep pules ngorok!",
    contraStance: "Gak setuju! Itu sistem mitigasi risiko psikologis biar otak gak kaget menghadapi kejamnya dunia!",
  },
  {
    id: 14,
    topic: "Google Maps sengaja nyasarin kita ke kuburan atau jurang biar kita inget mati dan tobat.",
    proStance: "Setuju! Algoritma satelit punya misi spiritual rahasia untuk menyadarkan manusia yang sombong!",
    contraStance: "Gak setuju! Itu murni sinyal provider Indosat/Telkomsel yang ampas di pelosok desa!",
  },
  {
    id: 15,
    topic: "Chat gebetan baru dibalas 12 jam kemudian adalah tanda hubungan yang sangat dewasa dan berwibawa.",
    proStance: "Setuju! Menunjukkan punya kesibukan berkelas, gak clingy, dan bikin rasa penasaran membara!",
    contraStance: "Gak setuju! Itu kode keras lu cuma cadangan urutan ke-7 di kontak arsip WhatsApp dia!",
  },
  {
    id: 16,
    topic: "Satu-satunya profesi yang pasti masuk surga tanpa hisab adalah abang kurir paket COD.",
    proStance: "Setuju! Membawa kebahagiaan sejati ke depan pintu rumah saat hati sedang hancur lebur!",
    contraStance: "Gak setuju! Sering ngilangin paket di pagar terus lempar ke kandang anjing tetangga!",
  },
  {
    id: 17,
    topic: "Mandi malam bikin rematik itu cuma mitos konspirasi bapak-bapak pemalas biar gak antre air.",
    proStance: "Setuju! Air dingin tengah malam bikin badan seger, otot kencang, dan menyucikan aura kelam!",
    contraStance: "Gak setuju! Kearifan lokal nenek moyang jangan dilawan, nanti tua tulangmu berbunyi kretek-kretek!",
  },
  {
    id: 18,
    topic: "Orang yang nyalain lampu sein ke kiri tapi belok ke kanan sebenarnya sedang melatih insting bertahan hidup kita.",
    proStance: "Setuju! Berkat emak-emak sein kiri belok kanan, konsentrasi dan reflek refleks pengemudi Indonesia nomor 1 di dunia!",
    contraStance: "Gak setuju! Itu pembunuhan berencana terselubung yang bikin asuransi kendaraan bangkrut!",
  },
  {
    id: 19,
    topic: "Mie goreng instan lebih nikmat dimakan pakai sendok daripada pakai garpu.",
    proStance: "Setuju! Bumbu micin minyak bawang yang tertinggal di piring bisa disendok tuntas tanpa sisa!",
    contraStance: "Gak setuju! Mie diciptakan untuk digulung elegan pakai garpu, bukan disendok kayak bubur balita!",
  },
  {
    id: 20,
    topic: "Lebih terhormat nganggur di rumah sambil nge-game daripada kerja tapi gaji UMR habis buat flexing kopi Jaksel.",
    proStance: "Setuju! Bebas stres, gak boncos cicilan gaya hidup palsu, dan mental tetap sehat walafiat!",
    contraStance: "Gak setuju! Bekerja itu bentuk kontribusi sosial, nganggur cuma jadi beban kuota wifi orang tua!",
  },
];

export const CHAOS_CARDS: string[] = [
  "😊 Wajib berargumen sambil tersenyum lebar tanpa henti (gigi harus kelihatan)!",
  "🚫 DILARANG menggunakan kata 'aku', 'kamu', 'saya', atau 'lo/gue'!",
  "👔 Harus berbicara dengan intonasi pejabat politik yang lagi kampanye bagi-bagi sembako!",
  "🍢 Wajib memasukkan kata 'CILOK' minimal 2 kali dalam argumen secara natural!",
  "🎓 Harus berargumen seolah-olah sedang mempertahankan skripsi di depan dosen penguji galak!",
  "🕶️ Wajib menggunakan gaya bahasa anak Jaksel (literally, which is, honestly, prefer) di setiap kalimat!",
  "📢 Harus berbicara dengan nada heboh presenter kuis kaget tengah malam!",
  "😭 Berargumen dengan nada sangat dramatis seolah hidupmu sedang hancur lebur!",
  "🤖 Berbicaralah dengan nada robot AI yang kehabisan baterai!",
  "🤌 Gunakan gerakan tangan berlebihan ala chef Italia di setiap kalimat!",
  "🧯 Berbicaralah dengan nada berbisik panik seolah ada razia Satpol PP!",
  "🧘‍♂️ Wajib menyelipkan kata mutiara ala motivator sukses di akhir setiap kalimat!",
];

export function getRandomTopic(excludeIds: number[] = []): DebateTopic {
  const available = DEBATE_TOPICS.filter((t) => !excludeIds.includes(t.id));
  const pool = available.length > 0 ? available : DEBATE_TOPICS;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getRandomChaosCard(): string {
  return CHAOS_CARDS[Math.floor(Math.random() * CHAOS_CARDS.length)];
}
