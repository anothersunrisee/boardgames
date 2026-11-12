export type Category = {
  id: number;
  prompt: string;
};

export const CATEGORIES: Category[] = [
  { id: 1,  prompt: "Sayuran berwarna hijau" },
  { id: 2,  prompt: "Merek sepatu yang populer" },
  { id: 3,  prompt: "Makanan yang enak dimakan pas hujan" },
  { id: 4,  prompt: "Hal yang ada di dalam tas perempuan" },
  { id: 5,  prompt: "Aplikasi yang paling sering dibuka" },
  { id: 6,  prompt: "Artis Indonesia yang suaranya bagus" },
  { id: 7,  prompt: "Minuman dingin favorit" },
  { id: 8,  prompt: "Hewan peliharaan yang umum" },
  { id: 9,  prompt: "Warna yang sering dipakai untuk baju" },
  { id: 10, prompt: "Makanan pedas yang terkenal" },
  { id: 11, prompt: "Buah tropis yang ada di Indonesia" },
  { id: 12, prompt: "Tempat liburan dalam negeri" },
  { id: 13, prompt: "Makanan khas Jawa" },
  { id: 14, prompt: "Pelajaran yang paling dibenci di sekolah" },
  { id: 15, prompt: "Hal pertama yang dilakukan setelah bangun tidur" },
  { id: 16, prompt: "Merk HP yang paling populer" },
  { id: 17, prompt: "Lagu Indonesia yang semua orang hafal" },
  { id: 18, prompt: "Olahraga yang sering dimainkan di Indonesia" },
  { id: 19, prompt: "Jajanan pinggir jalan yang enak" },
  { id: 20, prompt: "Hal yang dilakukan saat bosan" },
  { id: 21, prompt: "Film Indonesia yang terkenal" },
  { id: 22, prompt: "Alasan telat masuk kerja/sekolah" },
  { id: 23, prompt: "Sesuatu yang ada di dapur" },
  { id: 24, prompt: "Hal yang orang beli saat ke minimarket" },
  { id: 25, prompt: "Merek kopi kekinian" },
  { id: 26, prompt: "Makanan yang dimakan saat ulang tahun" },
  { id: 27, prompt: "Platform streaming yang sering dipakai" },
  { id: 28, prompt: "Hal yang bikin malas kerja/belajar" },
  { id: 29, prompt: "Kata yang sering dipakai anak muda zaman sekarang" },
  { id: 30, prompt: "Merek indomie rasa yang paling populer" },
  { id: 31, prompt: "Artis yang sering masuk FYP TikTok" },
  { id: 32, prompt: "Hal yang dilakukan saat overthinking" },
  { id: 33, prompt: "Makanan yang paling enak di mall" },
  { id: 34, prompt: "Sesuatu yang ada di kamar tidur" },
  { id: 35, prompt: "Alasan tidak mau keluar rumah" },
  { id: 36, prompt: "Pekerjaan yang kelihatannya enak" },
  { id: 37, prompt: "Hal yang orang bawa ke pantai" },
  { id: 38, prompt: "Jenis musik yang paling banyak didengar" },
  { id: 39, prompt: "Konten yang paling banyak ditonton di YouTube" },
  { id: 40, prompt: "Makanan yang enak tapi bikin gemuk" },
  { id: 41, prompt: "Alasan nggak mau pacaran" },
  { id: 42, prompt: "Hal yang bikin pusing saat traveling" },
  { id: 43, prompt: "Makanan yang ada di warteg" },
  { id: 44, prompt: "Hal yang dilakukan saat weekend" },
  { id: 45, prompt: "Sesuatu yang selalu ada di kantor" },
  { id: 46, prompt: "Alasan nggak tidur sampai larut malam" },
  { id: 47, prompt: "Merk skincare yang populer" },
  { id: 48, prompt: "Hal yang orang beli online tapi nggak dipakai" },
  { id: 49, prompt: "Profesi yang banyak diminati anak muda sekarang" },
  { id: 50, prompt: "Tempat nongkrong yang hits" },
  { id: 51, prompt: "Makanan sarapan yang umum" },
  { id: 52, prompt: "Genre film yang paling banyak ditonton" },
  { id: 53, prompt: "Hal yang ada di loker/tas sekolah" },
  { id: 54, prompt: "Merek baju yang populer di Indonesia" },
  { id: 55, prompt: "Kata pertama yang terlintas saat dengar kata 'pantai'" },
  { id: 56, prompt: "Hal yang dilakukan pas macet" },
  { id: 57, prompt: "Makanan yang sering dipesan via ojek online" },
  { id: 58, prompt: "Alasan baterai HP cepat habis" },
  { id: 59, prompt: "Hal yang ada di foto profil WhatsApp orang" },
  { id: 60, prompt: "Merek minuman energi yang populer" },
];

export function pickRandomCategories(count: number, exclude: number[] = []): Category[] {
  const available = CATEGORIES.filter((c) => !exclude.includes(c.id));
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

