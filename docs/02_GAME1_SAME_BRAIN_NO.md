# PARTYHUB INDONESIA — SPESIFIKASI GAME 01: SAME BRAIN? NO!
> Kategori: Asosiasi Kata Divergen • Tebak Cepat Anti-Kembar • Reaksi Spontan  
> Tema Warna: Emerald Green (`#158467`) | Maskot: Chiko (Circle / Leaf)  
> Target Demografis: Universal (Tongkrongan, Rekan Kantor SFW, Keluarga & Arisan)  
> Target Pembaca: Reviewer Sistem, Full-Stack Architect, & Model AI (Gemini Neon High)

---

## 🎯 1. KONSEP & ATURAN UTAMA PERMAINAN

### 1.1. Filosofi & Sensasi Sosial
Pada kebanyakan game kuis trivia (seperti Family 100 atau Kahoot), pemain berlomba-lomba mencari jawaban yang paling populer atau sama dengan orang lain. Di **Same Brain? NO!**, aturan sosial tersebut **DIBALIK 180 DERAJAT**: **Pemain dilarang keras memiliki pikiran yang sama!**  
Setiap pemain harus memikirkan satu kata kunci yang sah dan relevan dengan topik, namun harus se-unik mungkin agar tidak ada satu pun orang lain di ruangan yang memikirkan kata tersebut. Game ini memicu tawa histeris ketika dua orang sahabat atau rekan kerja ternyata memiliki "otak kembar" dan meneriakkan kata yang sama persis di detik yang sama.

### 1.2. Peran & Partisipan (Orang-Orangnya)
* **Jumlah Pemain:** 2 hingga 20 Orang (Format: Semua Lawan Semua / Free-For-All).
* **Peran Host (Pemandu):** Membaca kategori, mengontrol timer, memandu hitungan mundur tiga detik, dan memvalidasi keunikan jawaban.
* **Peran Pemain Aktif:** Seluruh pemain yang terdaftar di room berpikir secara mandiri tanpa berdiskusi atau memberi kode tangan.

---

## 🖥️ 2. SPESIFIKASI UI & TAMPILAN LAYAR LENGKAP

### 2.1. Tampilan Layar Utama TV / Proyektor Host (`G1Round.tsx`)
1. **Header Desktop Layout:**
   * Badge Neo-Brutalist: `GAME 01 • SAME BRAIN` dengan aksen hijau emerald `#158467`.
   * Indikator Ronde: `Ronde 3 / 10`.
   * Tombol Host Cepat: `Ganti Kategori (Shuffle)` dan `Undo ke Timer`.
2. **Kartu Kategori Pertanyaan (Emerald Box):**
   * Kotak hijau tebal dengan bayangan solid `#0F5E49`.
   * Teks pertanyaan raksasa terbaca jelas dari jarak 3–4 meter (misal: *"Menu lauk yang hampir selalu kamu pilih pas makan di Warteg"*).
3. **Timer Lingkaran 30 Detik (Fase Berpikir):**
   * SVG Circular Countdown berdiameter 180px dengan angka detik besar.
   * Transisi warna dinamis: Hijau (30s–15s) $\rightarrow$ Kuning (14s–7s) $\rightarrow$ Merah Berpendar (6s–0s) disertai SFX detak jam metronom (*sfx.playTick()*).
   * Tombol Kontrol: `[Jeda / Pause]`, `[Lanjut / Resume]`, `[Reset 30s]`, dan `[Waktu Habis → Buka Jawaban]`.
4. **Grid Penilaian Cepat (Fase Live Scoring):**
   * Menampilkan grid kartu seluruh pemain di room (2–20 kartu).
   * Setiap kartu memuat: Avatar 3D, Nama Pemain, Saldo Skor Room, dan Status Jawaban.
   * **Integrasi Jawaban HP:** Jika pemain mengetik di HP Controller, teks jawaban muncul otomatis di bawah namanya: `📱 "Tongkol Balado"`.
   * **Status Kartu Hijau (Default):** `[✓ Unik (+2 Pts)]`.
   * **Status Kartu Merah (Diketuk):** `[❌ Kembar (-1 Pt)]`.
   * Bar Ringkasan Live di Bawah: `X Jawaban Unik • Y Jawaban Kembar`.
   * Tombol Lanjut: `[Simpan & Lanjut Ronde Berikutnya ➔]`.

### 2.2. Tampilan Controller HP Pemain (`PlayerController.tsx`)
1. **Header Mini:** Nama pemain, avatar profil, kode room aktif, dan status lampu indikator koneksi `LIVE TV`.
2. **Teks Soal:** Menampilkan teks kategori yang sama persis dengan layar TV.
3. **Form Input Jawaban:** Form teks besar dengan placeholder *"Tulis 1 jawaban unikmu di sini..."*.
4. **Tombol "Kunci Jawaban 🔒":** Menghasilkan getaran haptik dan SFX pop, lalu mengunci input ke tampilan konfirmasi hijau: *"Jawabanmu Terkunci: [Jawaban]"*. Jawaban langsung terkirim ke layar TV Host via WebSocket.

---

## 🕹️ 3. CARA MENEBAK & MENJAWAB: DUA PILIHAN MODE BERMAIN

PartyHub Indonesia mendukung dua pilihan cara bermain yang fleksibel:

### Opsi A: Mode Verbal Serentak (Zero Tech / Tongkrongan Klasik)
1. Timer 30 detik berjalan di TV. Pemain memikirkan 1 kata di kepala masing-masing (dilarang menulis atau berbicara).
2. Di detik ke-0 (atau saat Host menekan tombol Buka Jawaban), Host menghitung lantang:  
   **"SATU... DUA... TIGA!"**
3. Seluruh pemain di ruangan **WAJIB MENERIAKKAN JAWABAN MEREKA BERSAMA-SAMA PADA DETIK YANG SAMA**.
4. Suasana ruangan langsung pecah! Host menanyakan siapa yang jawabannya kembar.
5. Host mengetuk kartu nama pemain yang kembar di layar TV untuk mengubahnya menjadi merah (-1).

### Opsi B: Mode HP Controller (Realtime Digital / Anti-Nyontek)
1. Seluruh pemain mengetikkan jawaban rahasia mereka di form HP masing-masing selama timer 30 detik.
2. Pemain menekan tombol *"Kunci Jawaban"*.
3. Saat waktu habis, layar TV Host otomatis memunculkan jawaban semua pemain secara serentak di grid penilaian.
4. Sistem atau Host langsung melihat siapa saja yang menulis kata yang sama.

---

## ⚖️ 4. LOGIKA SKOR, CARA BENAR, & CARA SALAH

### 4.1. Tabel Perhitungan Skor Matematis
| Kondisi Jawaban | Cara Benar / Salah | Dampak Poin Saldo Room | Visual Kartu di TV |
| :--- | :--- | :---: | :---: |
| **Jawaban Unik** | **CARA BENAR:** Menjawab kata yang relevan dan **tidak ada satu pun pemain lain** di ruangan yang menyebut kata tersebut. | **+2 Poin** | Hijau Cerah (`#D6F5EC`) |
| **Jawaban Kembar** | **CARA SALAH:** Menyebut kata yang sama persis atau bersinonim langsung dengan minimal 1 pemain lain di ruangan. | **-1 Poin (Penalti)** | Merah Muda (`#FFE8DF`) |
| **Blank / Diam Saja** | **CARA SALAH:** Tidak bersuara saat hitungan ketiga atau tidak mengunci jawaban di HP dalam 30 detik. | **-1 Poin (Penalti)** | Merah Muda |
| **Jawaban Ditolak (Veto)** | **CARA SALAH:** Menyebut kata yang tidak masuk akal / keluar dari konteks topik demi menghindari kembaran. | **-1 Poin (Penalti)** | Merah Muda |

### 4.2. Simulasi Ekonomi Poin
* Durasi Game: **10 Ronde Beruntun**.
* Perolehan Maksimal Teoretis: `+20 Poin` (Jika 10x selalu unik).
* Penalti Maksimal Teoretis: `-10 Poin` (Jika 10x selalu kembar atau blank).
* Rata-rata Skor Normal: `+8 s/d +14 Poin`.

---

## 🔍 5. DEEP EDGE CASES: "KALAU ORANGNYA BEGINI BAGAIMANA, KALAU BEGITU BAGAIMANA"

### 1. Kalau ada pemain yang menjawab ngawur / tidak masuk akal agar pasti unik?
* *Skenario:* Topik adalah *"Menu lauk warteg"*, lalu seorang pemain menjawab *"Batu bata"* atau *"Pesawat Boeing"* agar tidak mungkin ada yang menyamai.
* *Penanganan:* Berlaku aturan **"Hak Veto Ruangan"**. Jika Host atau mayoritas pemain di ruangan menilai jawaban tersebut tidak relevan dengan kategori, Host langsung mengetuk kartu pemain tersebut menjadi **Merah (-1)**. Jawaban ngawur dianggap setara dengan *Blank*!

### 2. Kalau SELURUH pemain di ruangan menjawab unik (tidak ada satu pun yang kembar)?
* *Skenario:* Di room 6 orang, semua menjawab menu yang berbeda (Ayam, Tempe, Telor, Lele, Kangkung, Tongkol).
* *Penanganan:* Semua pemain berhak mendapatkan **+2 Poin**. Host tidak perlu mengetuk kartu siapa pun, cukup tekan tombol *"Simpan & Lanjut Ronde Berikutnya"*.

### 3. Kalau SELURUH pemain menjawab kata yang sama persis?
* *Skenario:* Topik lauk warteg, dan saat hitungan ketiga ternyata SEMUA 8 orang kompak teriak *"Telor!"*.
* *Penanganan:* Momen komedi terbaik! Host mengetuk seluruh kartu pemain menjadi **Merah (-1)**. Seluruh ruangan mendapatkan penalti satu otak, memicu tawa besar dan menjaga selisih skor tetap seimbang.

### 4. Kalau ada 3 orang kembar dan sisanya beda sendiri?
* *Skenario:* Budi, Kevin, dan Dimas sama-sama jawab *"Ayam Goreng"*, sedangkan Alya jawab *"Sayur Sop"*, Rian jawab *"Usus"*, dan Sari jawab *"Perkedel"*.
* *Penanganan:* Host hanya mengetuk 3 kartu (Budi, Kevin, Dimas) menjadi Merah (-1). Tiga pemain lainnya (Alya, Rian, Sari) tetap Hijau (+2).

### 5. Kalau ada pemain yang jawabannya mirip tapi beda sebutan / sinonim?
* *Skenario:* Pemain A menjawab *"Es Teh Manis"*, Pemain B menjawab *"Teh Obeng"* (istilah Batam/Kepri) atau *"Es Manis"*.
* *Penanganan:* Host bertindak sebagai juri lokal. Jika esensi bendanya sama persis, Host menganggapnya **KEMBAR (-1)**.

### 6. Kalau pemain diam saja / malu bicara / AFK?
* *Skenario:* Saat hitungan ketiga, salah satu pemain hanya tersenyum malu dan tidak mengeluarkan suara.
* *Penanganan:* Dianggap *Blank*. Host langsung mengetuk kartunya menjadi **Merah (-1)**. Ini mendorong semua orang untuk aktif berpartisipasi dan tidak bersikap pasif.

### 7. Kalau Host salah pencet kartu pemain di fase penilaian?
* *Skenario:* Host tidak sengaja mengetuk kartu Alya padahal jawabannya unik.
* *Penanganan:* Setiap kartu pemain bersifat **Toggle On/Off**. Host cukup mengetuk sekali lagi kartu Alya untuk mengembalikannya ke status Hijau Unik (+2).
* *Jika sudah terlanjur lanjut ronde:* Tombol **"Undo ke Timer"** di Host Utility Bar dapat ditekan untuk membatalkan penyimpanan ronde dan mengembalikan saldo skor room seperti semula.

### 8. Kalau ada teman yang baru datang di tengah permainan (misal di ronde ke-4)?
* *Skenario:* Pesta sudah berjalan sampai ronde 3, lalu tiba-tiba Rizky baru sampai di tempat nongkrong.
* *Penanganan:* Host membuka `/room` melalui menu bar, menambahkan Rizky dengan tombol *Add Late Player*. Rizky mendapatkan saldo skor median ruangan, lalu saat kembali ke `/game1/round`, Rizky langsung otomatis terdaftar di grid penilaian ronde ke-4!

### 9. Kalau HP pemain kehabisan baterai di tengah permainan?
* *Skenario:* Pemain C controller HP-nya mati di ronde 6.
* *Penanganan:* Pemain C tidak perlu terlempar dari game. Sistem PartyHub otomatis mendukung hybrid fallback: Pemain C beralih ke Mode Verbal (meneriakkan jawabannya), sementara teman-teman lainnya tetap mengetik di HP. Host menilai kartu Pemain C secara manual di layar TV.

### 10. Penyesuaian Vibe Ruangan (Keluarga vs Kantor vs Tongkrongan):
* **Mode Tongkrongan:** Soal-soal seputar kehidupan kosan, warkop, kebiasaan ngaret, dan kelakuan absurd pengendara jalanan.
* **Mode Kantor (SFW):** Soal seputar makanan katering kantor, drama meeting online, kebiasaan saat lembur, dan barang di meja kerja.
* **Mode Keluarga & Arisan:** Soal seputar masakan ibu, barang rumah yang sering hilang, kebiasaan waktu kecil, dan jajanan pasar tradisional.

---

## 🔄 6. UX FLOW DIAGRAM & TRANSISI STATE

```
[Start Game 1 di Hub]
         │
         ▼
[G1Round: State TIMER (30 Detik)]
  ├─ TV merender countdown & soal raksasa
  ├─ HP Controller merender form input jawaban
  ├─ Host punya opsi: [Pause], [Reset], [Ganti Soal/Shuffle]
  │
  ▼ (Waktu Habis / Tombol Nilai Ditekan)
[G1Round: State SCORING (Grid Pemain)]
  ├─ Pilihan A: Host hitung 1-2-3, pemain teriak serentak
  ├─ Pilihan B: Jawaban HP Controller muncul di bawah nama pemain
  ├─ Host mengetuk kartu pemain KEMBAR -> Merah (-1)
  ├─ Pemain UNIK tetap -> Hijau (+2)
  │
  ▼ (Host Tekan "Simpan & Lanjut")
[Ronde < 10?] ─── Ya ───► [G1NextRound -> Kembali ke TIMER Ronde Baru]
         │
       Tidak (Ronde 10 Selesai)
         │
         ▼
[G1Results: Papan Klasemen & Fanfare Juara Game 1]
  ├─ Podium mini juara 1 Game 1
  ├─ Akumulasi skor langsung tersimpan ke Saldo Utama Room
  └─ Pilihan: [Main Lagi Game 1] atau [Kembali ke Hub Game]
```

---

## 📚 7. BANK DATA 50 PERTANYAAN RELATE INDONESIA (`game1-categories.ts`)
Sistem dilengkapi 50 kategori terkurasi ketat anti-repetisi:
1. *Menu lauk yang hampir selalu kamu pilih pas makan di Warteg.*
2. *Gorengan abang-abang pinggir jalan yang paling cepat ludes dibeli.*
3. *Barang di kamar kosan yang sering dipinjem temen terus gak balik-balik.*
4. *Toping tambahan paling nikmat pas masak mie instan di rumah.*
5. *Alasan klasik paling sering dipake buat nolak ajakan nongkrong.*
6. *Benda yang wajib ada di dalam jok atau bagasi motor.*
7. *Kelakuan pengendara lain di jalan raya yang paling bikin emosi jiwa.*
8. *Minuman sachet legendaris yang biasa dipesan di Warkop / Warmindo.*
9. *Barang receh di depan meja kasir minimarket yang sering kepencet dibeli.*
10. *Hal canggung (awkward) yang sering terjadi pas papasan sama tetangga/rekan kerja.*
11. *Aktivitas penghilang rasa bosan pas terjebak macet total berjam-jam.*
12. *Camilan kemasan legendaris zaman SD yang sekarang masih sering dicari.*
13. *Pertanyaan paling bikin males yang sering ditanya keluarga pas kumpul Lebaran/Natal.*
14. *Benda di rumah yang selalu dicari ibu tapi selalu ketemu di tempat aneh.*
15. *Aplikasi di HP yang paling sering kamu buka pas baru bangun tidur.*
... *(total 50 pertanyaan unik terdaftar dalam file data)*.
