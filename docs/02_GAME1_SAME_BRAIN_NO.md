# NIRANTARA PARTYGAMES — SPESIFIKASI GAME 01: SAME BRAIN? NO!
> Kategori: Asosiasi Kata Divergen • Tebak Cepat Anti-Kembar  
> Tema Warna: Emerald Green (`#158467`) | Maskot: Chiko (Circle / Leaf)  
> Target Pembaca: Reviewer Sistem & Model AI (Gemini Neon High)

---

## 🎯 1. KONSEP & ATURAN UTAMA PERMAINAN

### 1.1. Filosofi Permainan
Di permainan kuis biasa, pemain berlomba-lomba mencari jawaban yang sama. Di **Same Brain? NO!**, aturan justru dibalik: **Pemain dilarang keras memiliki pikiran yang sama!**
Setiap orang harus memikirkan satu jawaban yang relevan dengan topik, namun harus se-unik mungkin agar tidak sama dengan jawaban teman lain di ruangan.

### 1.2. Alur Permainan per Ronde
1. **Host Membacakan Kategori:** Layar menampilkan 1 pertanyaan relate keseharian (misal: *"Menu lauk yang hampir selalu kamu pilih pas makan di Warteg"*).
2. **Timer Berpikir 30 Detik:** Pemain memiliki waktu 30 detik untuk memikirkan 1 kata kunci di kepala masing-masing (dilarang berbisik atau membocorkan jawaban).
3. **Momen Mengucap Bersama (Count of Three):** Setelah timer habis atau di-skip oleh Host, Host menghitung: *"Satu... Dua... Tiga!"*. Seluruh pemain di ruangan **wajib meneriakkan kata mereka secara serentak di detik yang sama!**
4. **Fase Penilaian Host (Scoring Phase):**
   * Host memeriksa siapa saja pemain yang jawabannya **KEMBAR / SAMA** (misal: Budi dan Kevin sama-sama menjawab *"Ayam Goreng"*).
   * Host cukup mengetuk (*tap*) kartu nama pemain yang kembar di layar untuk menandai mereka sebagai pemain yang "Sama Pikiran" (*Twin Brain Penalty*).
   * Pemain dengan jawaban unik otomatis ditandai hijau (*Unique Brain*).
5. **Poin Diberikan:**
   * **Jawaban Unik (Beda Sendiri):** **+2 Poin** ke saldo Room pemain.
   * **Jawaban Kembar / Sama dengan Orang Lain:** **-1 Poin** (Penalti karena "Satu Otak"!).
6. **Lanjut Ronde:** Permainan berlangsung selama **10 Ronde** berturut-turut. Di akhir ronde ke-10, muncul papan pemenang dan hukuman untuk 3 pemain terbawah.

---

## 🖥️ 2. SPESIFIKASI UI & TAMPILAN LAYAR

### 2.1. Layar Ronde Permainan (`G1Round.tsx`)
* **Header Bar GameDesktopLayout:**
  * Badge Hijau: `GAME 01 • SAME BRAIN`
  * Indikator Ronde: `Ronde 3 / 10`
  * Tombol Host: `Ganti Kategori` (Shuffle) dan `Undo ke Timer`.
* **Kartu Kategori Utama (Emerald Green Box):**
  * Kotak hijau tebal dengan bayangan solid `#0F5E49`.
  * Menampilkan teks pertanyaan besar di tengah (misal: *"Barang di kamar kosan yang sering dipinjem temen terus gak balik-balik"*).
  * Tombol shuffle cepat di dalam kartu untuk mengganti pertanyaan seketika jika topik dirasa kurang relevan.
* **Timer Lingkaran 30 Detik:**
  * Countdown angka besar dengan warna dinamis (Hijau $\rightarrow$ Kuning $\rightarrow$ Merah saat $\le 6$ detik dengan suara metronom berdetak).
  * Tombol kontrol timer: `Jeda (Pause)`, `Lanjut (Resume)`, `Ulang 30s (Reset)`, dan `Langsung Nilai (Skip)`.
* **Layar Fase Penilaian (Scoring Grid):**
  * Menampilkan kartu seluruh pemain room dalam grid responsif.
  * Setiap kartu memuat Avatar 3D, Nama Pemain, dan status jawaban.
  * Status Default: Hijau (`✓ Unik (+2 Pts)`).
  * Status Diketuk (Tap): Merah (`❌ Kembar (-1 Pt)`).
  * Ringkasan Live di Bawah: `X Jawaban Unik • Y Jawaban Kembar`.
  * Tombol Aksi: `Simpan & Lanjut Ronde Berikutnya ➔`.

### 2.2. Layar Hasil Akhir (`G1Results.tsx`)
* Menampilkan Juara 1 Game 1 dengan avatar bermahkota.
* Menampilkan Papan Klasemen Lengkap Room dengan total perolehan skor terakumulasi.
* Tombol Navigasi: `Main Lagi Game 1` atau `Kembali ke Menu Game`.

---

## 📚 3. BANK DATA 50 PERTANYAAN RELATE INDONESIA (`game1-categories.ts`)

Seluruh pertanyaan telah melalui kurasi ketat **Anti-AI Slop** agar sangat familiar dan memicu tawa di kalangan masyarakat Indonesia (mahasiswa, rekan kantor, keluarga):
1. *Menu lauk yang hampir selalu kamu pilih pas makan di Warteg*
2. *Gorengan abang-abang pinggir jalan yang paling cepat ludes dibeli*
3. *Barang di kamar kosan yang sering dipinjem temen terus gak balik-balik*
4. *Toping tambahan paling nikmat pas masak mie instan di rumah*
5. *Alasan klasik paling sering dipake buat nolak ajakan nongkrong*
6. *Benda yang wajib ada di dalam jok atau bagasi motor*
7. *Kelakuan pengendara lain di jalan raya yang paling bikin emosi jiwa*
8. *Minuman sachet legendaris yang biasa dipesan di Warkop / Warmindo*
9. *Barang receh di depan meja kasir minimarket yang sering kepencet dibeli*
10. *Hal canggung (awkward) yang sering terjadi pas papasan sama tetangga/rekan kerja*
... (total 50 pertanyaan unik dengan algoritma shuffle tanpa pengulangan hingga 50 ronde).

---

## ⚖️ 4. LOGIKA SKOR & PERHITUNGAN MATEMATIS

| Kondisi Jawaban | Dampak Skor Pemain | Efek Suara | Status UI |
| :--- | :---: | :---: | :---: |
| **Jawaban Unik** (Tidak ada yang menyamai) | **+2 Poin** | Arpeggio Sukses | Kartu Hijau (`#D6F5EC`) |
| **Jawaban Kembar** (2 orang atau lebih sama) | **-1 Poin** | Buzzer Sawtooth | Kartu Merah (`#FFE8DF`) |
| **Pemain Tidak Menjawab / Blank** | **-1 Poin** | Buzzer | Kartu Merah |

---

## 🔍 5. PENANGANAN KASUS KHUSUS (*EDGE CASES*)

### A. Bagaimana jika SELURUH pemain di ruangan menjawab unik (tidak ada yang sama)?
* Sistem mencatat semua pemain berhasil. Seluruh anggota mendapatkan **+2 Poin**. Host langsung menekan tombol simpan dan melanjutkan ronde.

### B. Bagaimana jika SELURUH pemain menjawab kata yang sama persis (misal semua jawab "Telor")?
* Host mengetuk semua kartu pemain sehingga seluruh kartu berwarna merah. Seluruh pemain mendapatkan penalti **-1 Poin**. Ini menciptakan momen tawa besar di tongkrongan karena semua orang terbukti "satu otak".

### C. Bagaimana jika host salah mengetuk kartu pemain di fase penilaian?
* Host cukup mengetuk ulang kartu pemain tersebut untuk membatalkan status penalti (toggle on/off).
* Jika host sudah terlanjur menekan tombol lanjut ronde namun menyadari ada kesalahan, tombol **"Undo ke Timer"** di Host Bar dapat digunakan untuk merollback ronde dan mengembalikan saldo skor pemain.

### D. Penanganan Roster Room (Perbaikan Bug Setup Legacy):
* Jika host membuka `/game1/setup` saat `players.length >= 2`, halaman setup **TIDAK BOLEH** mereset nama menjadi `Dina, Bimo, Sari, Rian`, melainkan wajib langsung memuat pemain room asli dan menjaga saldo skor mereka.
