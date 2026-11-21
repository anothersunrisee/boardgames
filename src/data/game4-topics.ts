export type DebateTopic = {
  id: number;
  topic: string;
  proStance: string;
  contraStance: string;
  vibes?: ('tongkrongan' | 'office' | 'family')[];
};

export const DEBATE_TOPICS: DebateTopic[] = [
  {
    id: 1,
    topic: "Mas-mas tukang parkir depan minimarket jauh lebih sigap gantiin pejabat daripada politisi.",
    proStance: "Setuju! Tanpa janji manis, modal peluit semua masalah beres, perputaran uang 2 ribu langsung lancar nyata!",
    contraStance: "Gak setuju! Pas butuh bantuan ngilang, pas mau cabut tiba-tiba muncul minta jatah!",
    vibes: ['tongkrongan', 'office'],
  },
  {
    id: 2,
    topic: "Bendahara kelompok kita jauh lebih kompeten jadi Menteri Keuangan daripada birokrat resmi.",
    proStance: "Setuju! Uang kas goceng aja dikejar sampai ujung dunia, kas negara dijamin surplus anti-korupsi!",
    contraStance: "Gak setuju! Catatannya cuma di sobekan kertas binder lecek dan gak pernah ada audit independen!",
    vibes: ['tongkrongan', 'office', 'family'],
  },
  {
    id: 3,
    topic: "Besok kita semua wajib ke tempat kumpul santai cuma pake sarung atau celana tidur ternyaman.",
    proStance: "Setuju! Sirkulasi udara maksimal bikin otak encer, bebas gerah, keakraban melonjak 300%!",
    contraStance: "Gak setuju! Polusi pemandangan di ruangan bakal merusak wibawa dan bikin orang luar geleng-geleng kepala!",
    vibes: ['tongkrongan'],
  },
  {
    id: 4,
    topic: "Kalau ditilang polisi, pura-pura kesurupan macan putih adalah strategi bela diri yang sah dan bermartabat.",
    proStance: "Setuju! Polisi bakal bingung mau nilang siapa, hemat uang denda, dan menguji kemampuan spiritual aparat!",
    contraStance: "Gak setuju! Malah dikira aneh, motor tetep disita, terus disuruh rukiah di pos polisi!",
    vibes: ['tongkrongan'],
  },
  {
    id: 5,
    topic: "Makan nasi Padang pake sendok garpu adalah tindak pidana kuliner yang pantas dihukum kerja bakti 1 minggu.",
    proStance: "Setuju! Itu penistaan budaya kuliner leluhur! Kenikmatan bumbu rendang cuma menyatu lewat pori-pori jari tangan!",
    contraStance: "Gak setuju! Hak asasi jari higienis! Cuci tangan di kobokan air hangat jeruk nipis itu sering gak bersih!",
    vibes: ['tongkrongan', 'office', 'family'],
  },
  {
    id: 6,
    topic: "Orang dewasa yang teriak histeris pas lihat kecoa terbang wajib disita hak bicaranya selama 1 hari.",
    proStance: "Setuju! Lawan serangga 3 cm aja panik kabur ke atas kasur, gimana mau melindungi keluarga dari marabahaya!",
    contraStance: "Gak setuju! Kecoa terbang itu bukan serangga biasa, itu teror perang biologis berkecepatan radar!",
    vibes: ['tongkrongan', 'family'],
  },
  {
    id: 7,
    topic: "Teman yang minjam seratus ribu lalu menghilang sebenarnya malaikat yang sedang menguji keikhlasan hati kita.",
    proStance: "Setuju! Jangan ditagih, anggap tiket masuk surga jalur prestasi sedekah tak terduga!",
    contraStance: "Gak setuju! Itu parasit pertemanan berkedok musibah, wajib ditagih sampai akhir zaman!",
    vibes: ['tongkrongan', 'office'],
  },
  {
    id: 8,
    topic: "Tidur siang 30 menit di jam istirahat wajib dijadikan hak asasi manusia demi kesehatan mental bersama.",
    proStance: "Setuju! Otak yang tidur siang adalah mesin produktivitas masa depan, bangun-bangun langsung jadi jenius!",
    contraStance: "Gak setuju! Yang ada bablas sampai maghrib terus pas bangun malah pusing kleyengan!",
    vibes: ['office', 'tongkrongan', 'family'],
  },
  {
    id: 9,
    topic: "Kucing oren sebenarnya adalah intel alien yang sedang memantau kebodohan manusia dari dekat.",
    proStance: "Setuju! Tingkah lakunya gak masuk akal fisika bumi, jelas mereka lagi kirim transmisi sinyal ke luar angkasa!",
    contraStance: "Gak setuju! Jangan overthinking, mereka cuma lapar dan punya satu sel otak yang gantian dipake!",
    vibes: ['tongkrongan', 'family'],
  },
  {
    id: 10,
    topic: "Tukang tambal ban pinggir jalan berhak dapet gelar Profesor Kehormatan Teknik Mesin tanpa skripsi.",
    proStance: "Setuju! Cuma modal baskom air sama kompon karet bisa nyelamatin nyawa orang di malam gelap gulita!",
    contraStance: "Gak setuju! Sering nebak bocor halus padahal pentilnya doang yang kendor biar dapet 25 ribu!",
    vibes: ['tongkrongan', 'office'],
  },
  {
    id: 11,
    topic: "Orang yang makan bubur diaduk punya potensi tersembunyi jadi agen rahasia profesional.",
    proStance: "Setuju! Mereka pragmatis, gak peduli estetika, yang penting semua nutrisi menyatu efisien masuk lambung!",
    contraStance: "Gak setuju! Bentuknya mirip makanan hewan, itu tanda kekacauan batin yang belum selesai!",
    vibes: ['tongkrongan', 'office', 'family'],
  },
  {
    id: 12,
    topic: "Orang yang pasang alarm tiap 5 menit (05.55, 06.00, 06.05) adalah ancaman nyata peradaban rumah tangga.",
    proStance: "Setuju! Satu rumah bangun stres gara-gara alarm dia, tapi yang punya alarm tetep pules ngorok!",
    contraStance: "Gak setuju! Itu sistem mitigasi risiko psikologis biar otak gak kaget menghadapi kejamnya dunia!",
    vibes: ['family', 'office', 'tongkrongan'],
  },
  {
    id: 13,
    topic: "Google Maps sengaja nyasarin kita ke jalan sempit kuburan biar kita inget tobat.",
    proStance: "Setuju! Algoritma satelit punya misi spiritual rahasia untuk menyadarkan manusia yang sombong!",
    contraStance: "Gak setuju! Itu murni sinyal provider yang bapuk dan salah baca koordinat gang sempit!",
    vibes: ['tongkrongan', 'family', 'office'],
  },
  {
    id: 14,
    topic: "Mie instan kuah di warkop selalu 10 kali lebih enak dibanding mie instan yang dimasak sendiri di rumah.",
    proStance: "Setuju! Air rebusan warkop yang dipakai berkali-kali mengandung kaldu legendaris tak tergantikan!",
    contraStance: "Gak setuju! Itu efek sugesti lapar dan bau asep rokok warkop aja, aslinya sama aja micinnya!",
    vibes: ['tongkrongan', 'office'],
  },
  {
    id: 15,
    topic: "Rapat 1 jam yang sebenarnya cukup diselesaikan lewat 1 chat WhatsApp wajib didenda traktir kopi satu divisi.",
    proStance: "Setuju! Menghemat ribuan jam kerja produktif dan membantai budaya basa-basi birokrasi yang melelahkan!",
    contraStance: "Gak setuju! Rapat tatap muka membangun chemistry, kalau cuma chat sering ada salah paham dan emotikon dingin!",
    vibes: ['office'],
  },
  {
    id: 16,
    topic: "Bawa pulang sisa kue atau snack rapat ke meja sendiri adalah bentuk efisiensi logistik kantor yang mulia.",
    proStance: "Setuju! Menghindari mubazir makanan dan membahagiakan perut karyawan yang lembur sampai malam!",
    contraStance: "Gak setuju! Bikin meja kerja berantakan kayak sarang semut dan bikin iri divisi sebelah!",
    vibes: ['office'],
  },
  {
    id: 17,
    topic: "Menyimpan kerupuk rengginang di dalam kaleng biskuit Khong Guan adalah tindak pembohongan publik serius.",
    proStance: "Setuju! Menghancurkan ekspektasi anak cucu yang ngira wafer cokelat tapi dapet rengginang alot!",
    contraStance: "Gak setuju! Itu kearifan lokal daur ulang kaleng kedap udara paling teruji sejak zaman penjajahan!",
    vibes: ['family', 'tongkrongan'],
  },
  {
    id: 18,
    topic: "Orang yang mencabut colokan dispenser atau kulkas buat ngecas HP layak disidang di ruang keluarga.",
    proStance: "Setuju! Air minum jadi gak dingin atau es krim meleleh gara-gara keegoisan baterai 15 persen!",
    contraStance: "Gak setuju! Darurat komunikasi lebih genting, dispenser mati 10 menit airnya masih tetep dingin kok!",
    vibes: ['family', 'office'],
  },
  {
    id: 19,
    topic: "Makan martabak manis bagian pinggirannya doang dan ninggalin tengahnya harus dikeluarkan dari silsilah keluarga.",
    proStance: "Setuju! Itu kriminal gastronomi! Bagian paling gurih garing dimakan, sisanya yang manis eneg ditinggalin!",
    contraStance: "Gak setuju! Pinggiran martabak itu hak penikmat tekstur krispi, tengahnya buat yang suka keju banjir!",
    vibes: ['family', 'tongkrongan'],
  },
  {
    id: 20,
    topic: "Orang yang mengirim pesan suara (voice note) 5 menit tanpa izin wajib dibalas dengan pesan suara 10 detik isi desahan nafas.",
    proStance: "Setuju! Biar kapok! Siapa yang punya waktu denger podcast dadakan tanpa rangkuman poin penting!",
    contraStance: "Gak setuju! Voice note itu sarana ekspresi emosional yang tulus daripada ngetik jempol keriting!",
    vibes: ['office', 'tongkrongan'],
  },
];

export const CHAOS_CARDS: string[] = [
  "😊 Wajib berargumen sambil tersenyum lebar tanpa henti (gigi harus kelihatan)!",
  "🚫 DILARANG menggunakan kata 'aku', 'kamu', 'saya', atau 'lo/gue'!",
  "👔 Harus berbicara dengan intonasi pejabat yang lagi bagi-bagi bansos di podium!",
  "🍢 Wajib memasukkan kata 'BAKSO' minimal 2 kali dalam argumen secara natural!",
  "🎓 Harus berargumen seolah-olah sedang mempertahankan skripsi di depan penguji galak!",
  "🕶️ Wajib menggunakan gaya bahasa anak Jaksel (literally, which is, honestly) di setiap kalimat!",
  "📢 Harus berbicara dengan nada heboh presenter kuis kaget belanja tengah malam!",
  "😭 Berargumen dengan nada sangat dramatis seolah hidupmu sedang hancur lebur!",
  "🤖 Berbicaralah dengan nada robot AI kaku yang baterainya tinggal 2 persen!",
  "🤌 Gunakan gerakan tangan berlebihan ala chef Italia di setiap kalimat!",
  "🧯 Berbicaralah dengan nada berbisik panik seolah ada razia Satpol PP!",
  "🧘‍♂️ Wajib menyelipkan kata mutiara ala motivator sukses di akhir setiap kalimat!",
];

export function getRandomTopic(
  excludeIds: number[] = [],
  vibe?: 'family' | 'office' | 'tongkrongan'
): DebateTopic {
  let pool = DEBATE_TOPICS.filter((t) => !excludeIds.includes(t.id));
  if (vibe) {
    const vibeFiltered = pool.filter((t) => !t.vibes || t.vibes.includes(vibe));
    if (vibeFiltered.length > 0) pool = vibeFiltered;
  }
  if (pool.length === 0) pool = DEBATE_TOPICS;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getRandomChaosCard(): string {
  return CHAOS_CARDS[Math.floor(Math.random() * CHAOS_CARDS.length)];
}
