// ─── Pack: Dapur & Peralatan Rumah Tangga (Family & Arisan Friendly) ──────────

export type HouseholdItem = {
  name: string;
  category: 'bumbu' | 'alat_masak' | 'perabot' | 'kue';
  aliases: string[];
  clue: string;
};

export const HOUSEHOLD_ITEMS: HouseholdItem[] = [
  { name: 'Ulekan Cobek Batu', category: 'alat_masak', aliases: ['cobek', 'ulekan', 'munthu', 'batu cobek'], clue: 'Benda berat dari batu kali untuk menghaluskan sambal' },
  { name: 'Sodet Kayu', category: 'alat_masak', aliases: ['sodet', 'spatula kayu', 'sutil'], clue: 'Alat pengaduk wajan anti baret' },
  { name: 'Kukusan Dandang', category: 'alat_masak', aliases: ['dandang', 'kukusan', 'klakat', 'langseng'], clue: 'Panci bertingkat dengan lubang-lubang untuk mematangkan nasi atau bakpao' },
  { name: 'Wajan Wok Anti Lengket', category: 'alat_masak', aliases: ['teflon', 'wajan teflon', 'kuali'], clue: 'Tempat menumis masakan tanpa takut lengket' },
  { name: 'Serbet Gantung Dapur', category: 'perabot', aliases: ['serbet', 'kain lap', 'lap tangan'], clue: 'Kain pembersih tangan yang selalu digantung dekat wastafel' },
  { name: 'Tupperware Tutup Kuning', category: 'perabot', aliases: ['tupperware', 'kotak bekal', 'tepak makan'], clue: 'Wadah plastik keramat yang kalau hilang bikin ibu marah besar' },
  { name: 'Panci Presto', category: 'alat_masak', aliases: ['presto', 'pressure cooker'], clue: 'Panci kedap udara yang bikin daging empuk dalam 30 menit' },
  { name: 'Lengkuas (Laos)', category: 'bumbu', aliases: ['lengkuas', 'laos'], clue: 'Bumbu dapur yang bentuknya mirip jahe tapi bikin kecewa saat tergigit di rendang' },
  { name: 'Kunyit Bubuk', category: 'bumbu', aliases: ['kunyit', 'kunir'], clue: 'Rempah kuning yang meninggalkan noda membandel di kuku dan baju' },
  { name: 'Ketumbar', category: 'bumbu', aliases: ['ketumbar'], clue: 'Biji kecil bulat mirip lada yang biasa diulek untuk tempe goreng' },
  { name: 'Bunga Lawang', category: 'bumbu', aliases: ['pekak', 'bunga lawang'], clue: 'Rempah berbentuk bintang yang harum untuk kuah gulai dan sop' },
  { name: 'Terasi Udang', category: 'bumbu', aliases: ['terasi', 'belacan'], clue: 'Bumbu fermentasi hitam menyengat yang bikin sambal terasa gurih mantap' },
  { name: 'Parutan Kelapa Tradisional', category: 'alat_masak', aliases: ['parutan', 'parut kelapa'], clue: 'Papan seng tajam bergerigi untuk memarut kelapa santan' },
  { name: 'Saringan Santan Kain', category: 'alat_masak', aliases: ['saringan teh', 'saringan kain', 'saringan santan'], clue: 'Kain kasa tipis untuk memeras santan murni' },
  { name: 'Pencapit Gorengan Stainless', category: 'alat_masak', aliases: ['capitan', 'pencapit', 'penjepit'], clue: 'Alat dua bilah besi untuk mengangkat pisang goreng panas' },
  { name: 'Mixer Roti Berdiri', category: 'alat_masak', aliases: ['mixer', 'pengocok telur'], clue: 'Mesin pengocok adonan bolu dan telur sampai mengembang' },
  { name: 'Timbangan Dapur Digital', category: 'alat_masak', aliases: ['timbangan kue', 'timbangan'], clue: 'Alat pengukur gram terigu dan gula' },
  { name: 'Talenan Kayu Jati', category: 'perabot', aliases: ['talenan', 'papan potong'], clue: 'Papan landasan pisau saat mengiris bawang' },
  { name: 'Pisau Dapur Victorinox', category: 'alat_masak', aliases: ['pisau', 'pisau daging'], clue: 'Bilah tajam pemotong daging dan sayur' },
  { name: 'Cobek Kayu Sambal Jeruk', category: 'perabot', aliases: ['cobek kayu'], clue: 'Piring uleg dari kayu sawo untuk sambal dadak' },
  { name: 'Termos Air Panas Pencet', category: 'perabot', aliases: ['termos', 'air panas'], clue: 'Wadah penyimpan air panas dengan pompa tombol di atasnya' },
  { name: 'Toples Rengginang Kaleng Biskuit', category: 'perabot', aliases: ['kaleng khong guan', 'kaleng biskuit', 'rengginang'], clue: 'Kaleng biskuit legendaris yang isinya ternyata kerupuk rengginang' },
  { name: 'Ceret Teh Alumunium Peluit', category: 'alat_masak', aliases: ['ceret', 'teko', 'teko peluit'], clue: 'Teko air yang berbunyi melengking kencang saat mendidih' },
  { name: 'Tudung Saji Lipat', category: 'perabot', aliases: ['tudung saji', 'penutup makanan'], clue: 'Kubah jaring pelindung lauk di meja makan dari lalat' },
  { name: 'Centong Nasi Plastik Anti Lengket', category: 'perabot', aliases: ['centong', 'sendok nasi'], clue: 'Sendok lebar bermotif bintik untuk mengambil nasi pulen' },
  { name: 'Piring Kaleng Seng Blurik', category: 'perabot', aliases: ['piring seng', 'piring enamel'], clue: 'Piring seng motif loreng hijau putih tempo dulu' },
  { name: 'Cetakan Kue Nastar Karakter', category: 'kue', aliases: ['cetakan nastar', 'spuit'], clue: 'Alat pembentuk adonan selai nanas saat menjelang lebaran' },
  { name: 'Kertas Roti Baking Paper', category: 'kue', aliases: ['baking paper', 'kertas roti'], clue: 'Kertas minyak tahan panas pelapis loyang oven' },
  { name: 'Korek Gas Dapur Leher Panjang', category: 'alat_masak', aliases: ['pemantik kompor', 'korek kompor'], clue: 'Penyala api berleher besi agar tangan tidak tersulut kompor' },
  { name: 'Sikat Kawat Cuci Panci', category: 'perabot', aliases: ['sabut kawat', 'spon besi'], clue: 'Buntalan serabut kawat untuk mengikis gosong di pantat wajan' },
  { name: 'Jeruk Limau Sambal', category: 'bumbu', aliases: ['jeruk sambal', 'jeruk limau', 'jeruk limo'], clue: 'Jeruk hijau mungil berkulit keriput pengharum sambal terasi' },
  { name: 'Asam Jawa Bungkus', category: 'bumbu', aliases: ['asam jawa', 'asam'], clue: 'Bumbu asam cokelat lengket untuk kuah sayur asem segar' },
  { name: 'Gula Merah Aren Batok', category: 'bumbu', aliases: ['gula merah', 'gula jawa', 'gula aren'], clue: 'Gula kelapa padat berbentuk setengah mangkok untuk bumbu kolak' },
  { name: 'Teko Kaca Minyak Goreng', category: 'perabot', aliases: ['botol minyak', 'wadah minyak'], clue: 'Wadah penuang minyak goreng bekas yang ada corong saringannya' },
  { name: 'Penutup Gelas Karet Silikon', category: 'perabot', aliases: ['tutup gelas'], clue: 'Karet bundar yang menempel erat di bibir cangkir kopi panas' },
];
