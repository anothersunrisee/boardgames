# NIRANTARA PARTYGAMES — SPESIFIKASI SISTEM OUTGAME & GLOBAL CONTROLS
> Modul: Onboarding, Room Setup, Game Hub, Podium Juara, Sistem Hukuman, dan Sound Engine  
> Target Pembaca: Reviewer Sistem & Model AI (Gemini Neon High)

---

## 🎯 1. ONBOARDING & LANDING PAGE (`/` & `/onboarding`)

### 1.1. Konsep & Tujuan UX
Layar pertama yang menyambut pengunjung saat membuka web. Bertujuan sebagai pemecah kebekuan (*ice-breaker*) instan sebelum masuk ke administrasi permainan. Pengunjung langsung disajikan kanvas interaktif bergaya *Fruit Ninja*: maskot-maskot gemas melayang di layar dan dapat "ditebas" atau di-klik hingga meledak menjadi partikel konfeti dan serpihan warna-warni.

### 1.2. Elemen Visual & Layout UI
* **Kanvas HTML5 2D Fullscreen:** Merender simulasi fisika maskot melayang dengan gravitasi, pantulan dinding, rotasi (*angular velocity*), serta kedipan mata (60 FPS).
* **Judul Besar "Nirantara Partygames!":** Menggunakan font display *Fredoka* dengan bayangan solid tebal.
* **Tombol "START GAME ➔":** Tombol CTA utama berwarna hitam charcoal dengan ikon Play kuning dan bayangan tactile 6px. Menekan tombol ini memicu SFX fanfare dan mengarahkan pengguna ke `/room`.
* **Counter Ledakan Maskot (Pojok Kanan Atas):** Menghitung berapa kali pemain berhasil menebas maskot (misal: `💥 73`).
* **Toggle Suara Ambient (Pojok Kanan Atas):** Ikon speaker untuk mematikan/menghidupkan efek suara.
* **Teks Panduan Interaktif:** *"Klik atau swipe mascot untuk meledakkan! Lalu klik START GAME untuk atur room & daftar pemain."*

### 1.3. Kursor Khusus Slicing Katana (`CustomGameCursor.tsx`)
* **Hanya Aktif di Onboarding:** Kursor visual katana dengan pisau berpendar (*luminous blade*) hanya muncul di halaman onboarding/landing page.
* **Otomatis Dinonaktifkan di Dalam Room & Game:** Sesuai masukan kenyamanan pengguna (menghindari pusing dan kelelahan mata), kursor kembali ke kursor standar sistem OS saat pengguna berada di `/room`, `/hub`, dan seluruh halaman permainan.
* **Deteksi Perangkat Sentuh (Mobile/Tablet):** Jika layar mendeteksi sentuhan (*touch coarse pointer*), kursor desktop disembunyikan dan sistem beralih ke *touch gesture slicing*.

---

## 👥 2. PENDAFTARAN PEMAIN & ROOM SETUP (`/room`)

### 2.1. Entitas Data Pemain (`Player`)
Setiap peserta di dalam ruangan direpresentasikan dengan objek data:
```typescript
export type Player = {
  id: string;        // ID unik string acak (misal: "u7x9b1")
  name: string;      // Nama panggilan pemain (misal: "Alya", "Budi")
  gender?: 'cowok' | 'cewek'; // Gender untuk pembagian kubu
  kubu: string;      // Label kubu default ("Tim Cewek" atau "Tim Cowok")
  score: number;     // Akumulasi skor room lintas mini-game (dimulai dari 0)
  avatarId?: string; // ID avatar maskot (c01 s/d c20)
};
```

### 2.2. Elemen Visual & Fitur UI
1. **Nama Room:** Input teks untuk memberi nama sesi party (default: *"Party Malam Ini"*).
2. **Preset Cepat (Quick Presets):**
   * **Preset 10 Pemain:** 5 Cewek + 5 Cowok dengan nama dan avatar siap pakai.
   * **Preset 8 Pemain:** 4 Cewek + 4 Cowok.
   * **Preset 6 Pemain:** 3 Cewek + 3 Cowok.
3. **Kartu Baris Pemain (Player Row):**
   * **Avatar Picker Modal:** Klik lingkaran avatar untuk memilih salah satu dari 10 karakter maskot ekspresif (Chiko, Milo, Lulu, Bimi, Nori, Juno, Zuzu, dll.).
   * **Input Nama:** Form teks bebas dengan placeholder nomor pemain.
   * **Gender Switcher (Pill Toggle):** Tombol switch cepat antara `👧 Cewek` (Pink/Berry) dan `👦 Cowok` (Cobalt Blue). Mengubah gender otomatis menyinkronkan label kubu default.
   * **Tombol Hapus:** Ikon tempat sampah merah (dibatasi minimal 2 pemain).
4. **Tombol "Tambah Pemain +" (Maksimal 20 Pemain):** Menambahkan baris pemain baru dengan alokasi gender penyeimbang otomatis.
5. **Tombol "Simpan & Masuk Room ➔":** Menyimpan seluruh data ke Zustand + LocalStorage dan menampilkan transisi lingkaran konsentris (*Concentric Room Transition*) menuju `/hub`.

### 2.3. Penanganan Kasus Khusus (*Edge Cases*)
* **Bagaimana jika nama pemain kosong saat disimpan?** Sistem otomatis memberikan fallback `Pemain 1`, `Pemain 2`, dst., sehingga tidak akan pernah ada pemain tanpa nama.
* **Bagaimana jika jumlah pemain ganjil (misal 5 atau 7 orang)?** Sistem tetap menerima jumlah pemain berapa pun antara 2 hingga 20 orang. Game-game yang membutuhkan pasangan akan mengacak rotasi pemain secara otomatis.

---

## 🏰 3. GAME SELECTION HUB (`/hub`)

### 3.1. Header Bar Status Room
* Menampilkan nama room aktif dan total pemain terdaftar beserta rasio gender (`👥 10 Pemain (👧 5 Cewek • 👦 5 Cowok)`).
* **Avatar Strip Pemain:** Menampilkan deretan avatar profil pemain yang terdaftar.
* **Tombol Aksi Cepat:**
  * `🎮 Intro`: Kembali ke layar tebas maskot Onboarding.
  * `✏️ Edit`: Membuka kembali `/room` untuk menambah/mengubah nama pemain tanpa menghapus skor yang sudah dikumpulkan.
  * `🏆 Skor`: Membuka laci (*drawer*) papan klasemen sementara room.
  * `👑 Juara`: Langsung membuka panggung podium juara room (`/room/podium`).

### 3.2. Katalog 6 Game Party
Setiap game disajikan dalam bentuk **GameCard Neo-Brutalist** dengan warna identitas yang kontras:
1. **Game 01: Same Brain? NO!** (Emerald Green `#158467`) — Asosiasi kata divergen anti-kembar.
2. **Game 02: Beauty Expert?!** (Magenta Pink `#D8317E`) — Interogasi kosmetik & skincare cewek vs cowok.
3. **Game 03: Boys Stuff, Girls Guess!** (Cobalt Blue `#2568EF`) — Interogasi perkakas, motor, dan game cowok vs cewek.
4. **Game 04: The Devil's Advocate** (Terracotta Orange `#E85D2A`) — Debat kocak 2v2 dengan Chaos Cards.
5. **Game 05: Chain Quiz Relay!** (Purple Violet `#7C3AED`) — Cerdas cermat berantai 4 ronde x 4 soal (16 soal estafet).
6. **Game 06: Sell Me This Trash!** (Lime Green `#65A30D`) — Duel pitching sales 2v2 barang rongsokan.

### 3.3. Modal Aturan & Edukasi Game (`GameOnboardingModal`)
Saat kartu game di-klik, sistem tidak langsung melempar pemain ke dalam game, melainkan memunculkan modal panduan interaktif:
* Langkah-langkah cara bermain (1, 2, 3, 4) dengan ikon 3D emoji.
* Tabel sistem penilaian (Poin Menang, Poin Kalah, Poin Konsolasi).
* Siapa yang akan terkena hukuman di akhir game.
* Tombol **"Mulai Main Sekarang 🚀"** yang mengeksekusi fungsi auto-start permainan.

---

## 🏆 4. PODIUM JUARA ROOM & KLIMAKS TOURNAMENT (`/room/podium`)

### 4.1. Visual & Panggung Juara
* Menampilkan panggung 3 tingkat (Juara 1 Emas di tengah, Juara 2 Perak di kiri, Juara 3 Perunggu di kanan).
* Dilengkapi avatar pemenang dengan mahkota emas 3D dan hujan konfeti (60 FPS Canvas).
* Menampilkan daftar peringkat lengkap seluruh pemain dari skor tertinggi hingga terendah.

### 4.2. Sistem Hukuman 3 Terbawah (Bottom 3 Punishments)
* 3 Pemain dengan perolehan skor terendah di klasemen akhir otomatis ditandai sebagai **Kubu Hukuman**.
* Host dapat menekan tombol **"Ambil Kartu Hukuman 3 Terbawah 🔥"** untuk membuka modal roulette hukuman kocak yang wajib dijalani oleh ketiga pemain terbawah secara bersamaan.

### 4.3. Opsi Selesai Permainan
* **Replay Podium:** Memutar ulang animasi selebrasi kemenangan.
* **Reset Skor Room:** Mengembalikan semua skor pemain ke 0 untuk memulai turnamen baru dengan anggota yang sama.
* **Ganti Roster Pemain:** Navigasi ke `/room` untuk mendaftarkan grup baru.

---

## 🃏 5. SISTEM KARTU HUKUMAN (`PunishmentModal.tsx` & `punishments.ts`)

### 5.1. Bank Data Kartu Hukuman
Berisi kumpulan hukuman ramah tongkrongan Indonesia yang berfokus pada kelucuan verbal dan ekspresi wajah (bukan kekerasan fisik):
* **Vokal O Sejati:** Mengganti semua vokal (A, I, U, E) menjadi O selama 1 game.
* **Pose Iyup Centil:** Dilarang tertawa; jika tersenyum wajib memasang pose centil kedua tangan di pipi.
* **Presenter Berita Gosip:** Berbicara dengan nada infotainment TV dramatis.
* **Izin Yang Mulia:** Wajib mengawali setiap ucapan dengan kalimat *"Mohon izin Yang Mulia Paduka..."*.
* **Bicara Slow-Motion 0.5x:** Berbicara super lambat seperti kaset rusak.
* **Kucing Manja Meow:** Wajib menyelipkan kata *"Meow~"* di akhir setiap kalimat.

### 5.2. Cara Kerja Modal
* Mendukung mode individu (1 orang yang salah) maupun mode kelompok (1 tim gugur atau 3 pemain terbawah).
* Host menekan tombol **"Acak Ulang Hukuman"** untuk mengocok kartu lain jika hukuman dirasa kurang cocok.

---

## 🔊 6. PROCEDURAL WEB AUDIO ENGINE (`sound.ts`)

Tidak menggunakan aset file suara eksternal (`.mp3` / `.wav`), melainkan osilator Web Audio API murni:
* `playPop(pitch)`: Suara sine wave frekuensi tinggi untuk tombol klik dan interaksi ringan.
* `playTick(urgent)`: Suara metronom timer. Berubah menjadi nada tinggi darurat jika waktu tersisa $\le 5$ detik.
* `playSuccess()`: Harmoni arpeggio 4 nada (C5, E5, G5, C6) saat jawaban benar atau babak selesai.
* `playBuzzer()`: Suara sawtooth rendah menurun (190Hz $\rightarrow$ 130Hz) saat waktu habis atau jawaban salah.
* `playFanfare()`: Rangkaian melodi kemenangan meriah untuk selebrasi juara.
* **Status Mute Terpadu:** Pengaturan mute tersimpan di sesi dan disinkronkan ke seluruh game.

---

## 🎛️ 7. HOST UTILITY BAR (`HostUtilityBar.tsx`)

Bilah navigasi mengambang (*floating pill bar*) di bagian bawah layar permainan untuk kendali penuh Host:
1. **Tombol Undo (Salah Pencet):** Membatalkan aksi terakhir (kembali ke timer, rollback skor, atau batalkan hukuman).
2. **Tombol Ganti Soal / Acak:** Mengganti pertanyaan/benda aktif seketika tanpa merusak giliran pemain.
3. **Toggle Mute Audio:** Mematikan/menyalakan SFX suara dalam satu klik.
4. **Tombol Menu Utama:** Kembali ke Hub tanpa kehilangan progres sesi.
