export type Category = {
  id: number;
  prompt: string;
};

/**
 * 50 Pertanyaan Relate Keseharian Indonesia (Anti-AI Slop)
 * Memiliki cakupan jawaban yang cukup sempit, memicu adu tebak yang seru,
 * dan sangat familiar bagi semua kalangan (tongkrongan, kosan, kantor, keluarga).
 */
export const CATEGORIES: Category[] = [
  { id: 1,  prompt: "Menu lauk yang hampir selalu kamu pilih pas makan di Warteg" },
  { id: 2,  prompt: "Gorengan abang-abang pinggir jalan yang paling cepat ludes dibeli" },
  { id: 3,  prompt: "Barang di kamar kosan yang sering dipinjem temen terus gak balik-balik" },
  { id: 4,  prompt: "Toping tambahan paling nikmat pas masak mie instan di rumah" },
  { id: 5,  prompt: "Alasan klasik paling sering dipake buat nolak ajakan nongkrong" },
  { id: 6,  prompt: "Benda yang wajib ada di dalam jok atau bagasi motor" },
  { id: 7,  prompt: "Kelakuan pengendara lain di jalan raya yang paling bikin emosi jiwa" },
  { id: 8,  prompt: "Minuman sachet legendaris yang biasa dipesan di Warkop / Warmindo" },
  { id: 9,  prompt: "Barang receh di depan meja kasir minimarket yang sering kepencet dibeli" },
  { id: 10, prompt: "Hal canggung (awkward) yang sering terjadi pas papasan sama tetangga/rekan kerja" },
  { id: 11, prompt: "Jajanan micin legendaris zaman SD yang dibungkus plastik" },
  { id: 12, prompt: "Sesuatu yang sering bikin orang telat bangun di hari Senin" },
  { id: 13, prompt: "Aktivitas pembunuh waktu pas lagi nunggu antrean yang kelamaan" },
  { id: 14, prompt: "Barang bawaan yang paling bikin panik kalau ketinggalan pas keluar rumah" },
  { id: 15, prompt: "Bumbu dapur yang wajib ada di kulkas atau rak bumbu rumah" },
  { id: 16, prompt: "Posisi favorit pas naik mobil bareng keluarga atau teman" },
  { id: 17, prompt: "Aroma khas yang langsung bikin kamu tahu kamu lagi di rumah sakit" },
  { id: 18, prompt: "Pertanyaan klise basa-basi pas kumpul keluarga besar saat lebaran/liburan" },
  { id: 19, prompt: "Tempat nongkrong murah meriah yang sering jadi pelarian anak muda akhir bulan" },
  { id: 20, prompt: "Sesuatu yang selalu ada di atas meja makan rumah orang Indonesia" },
  { id: 21, prompt: "Alasan orang pura-pura sibuk ngecek layar HP padahal gak ada chat masuk" },
  { id: 22, prompt: "Hal yang sering bikin pengeluaran bulanan bocor alus tanpa disadari" },
  { id: 23, prompt: "Jenis konten media sosial yang bikin orang tahan scrolling berjam-jam" },
  { id: 24, prompt: "Makanan penyelamat anak kosan di tanggal tua saat dompet menipis" },
  { id: 25, prompt: "Kelakuan teman di grup WhatsApp yang paling bikin gatel pengen left group" },
  { id: 26, prompt: "Benda di dalam tas sekolah anak SMA yang sebenernya gak ada hubungannya sama pelajaran" },
  { id: 27, prompt: "Hal pertama yang biasa dicek orang pas baru masuk kamar hotel" },
  { id: 28, prompt: "Minuman dingin kemasan botol di kulkas minimarket yang paling segar pas haus berat" },
  { id: 29, prompt: "Tanda-tanda motor atau mobil udah butuh banget dibawa ke bengkel" },
  { id: 30, prompt: "Pekerjaan rumah tangga (beberes) yang paling males dilakuin di hari libur" },
  { id: 31, prompt: "Peristiwa horor kecil yang sering terjadi di kamar mandi (misal: gayung licin)" },
  { id: 32, prompt: "Topik gosip tongkrongan yang gak bakal ada habisnya dibahas semalaman" },
  { id: 33, prompt: "Barang yang sering dibeli impulsif di e-commerce pas promo kembar (contoh: 11.11)" },
  { id: 34, prompt: "Bagian tubuh ayam goreng yang paling sering jadi rebutan di meja makan" },
  { id: 35, prompt: "Kelakuan emak-emak yang bikin anak geleng-geleng kepala (contoh: nyimpen kantong kresek)" },
  { id: 36, prompt: "Hal yang paling bikin malas ikut reuni sekolah zaman dulu" },
  { id: 37, prompt: "Benda yang wajib ada di meja kasir warung kelontong madura" },
  { id: 38, prompt: "Oleh-oleh makanan khas daerah yang paling sering dititip temen kantor" },
  { id: 39, prompt: "Hal yang bikin orang tiba-tiba batuk pas lagi makan keripik pedas" },
  { id: 40, prompt: "Game jadul di HP jadul nokia yang bikin nostalgia zaman dulu" },
  { id: 41, prompt: "Kegiatan yang paling enak dilakuin pas hujan deras di sore hari" },
  { id: 42, prompt: "Makanan yang kalau dimakan bikin nafas auto bau tapi tetep dicari orang" },
  { id: 43, prompt: "Kelakuan bapak-bapak di pos ronda atau grup WhatsApp keluarga" },
  { id: 44, prompt: "Barang yang selalu dicari-cari pas mau berangkat kerja/kuliah karena sering nyelip" },
  { id: 45, prompt: "Menu sarapan pagi gerobakan yang sering dibeli sebelum jam 8 pagi" },
  { id: 46, prompt: "Tempat yang paling sering dikunjungi pas lagi gak punya tujuan jalan-jalan" },
  { id: 47, prompt: "Hal yang bikin kaget setengah mati pas lagi asik santai di rumah" },
  { id: 48, prompt: "Aktivitas wajib pas lagi liburan ke pantai selain berenang" },
  { id: 49, prompt: "Pemberian gratisan dari toko yang biasanya langsung dibuang atau gak kepake" },
  { id: 50, prompt: "Pertanyaan yang paling males dijawab pas ketemu teman lama di jalan" },
];

/**
 * Pengacak kategori dengan aturan anti-repeat:
 * Soal yang sudah muncul tidak akan muncul lagi sampai seluruh 50 soal terpakai.
 * Jika seluruh 50 soal sudah dimainkan, pool akan direset kembali.
 */
export function pickRandomCategories(count: number, exclude: number[] = []): Category[] {
  let available = CATEGORIES.filter((c) => !exclude.includes(c.id));
  if (available.length < count) {
    // Jika semua 50 soal sudah pernah muncul, reset siklus
    available = CATEGORIES;
  }
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
