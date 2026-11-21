# PARTYHUB INDONESIA — SPESIFIKASI GAME 05: CHAIN QUIZ RELAY!
> Kategori: Cerdas Cermat Berantai 16 Soal Estafet • Turnamen Cepat Tim • Kartu Tantangan Akting  
> Tema Warna: Purple Violet (`#7C3AED`) | Maskot: Milo / Star  
> Target Demografis: Universal (Tongkrongan, Tim Kantor, Keluarga Lintas Generasi)  
> Target Pembaca: Reviewer Sistem, Full-Stack Architect, & Model AI (Gemini Neon High)

---

## 🎯 1. KONSEP & ATURAN UTAMA PERMAINAN

### 1.1. Filosofi & Sensasi Sosial
Kuis trivia cerdas cermat sering kali membosankan jika formatnya kaku dan hanya menguji hafalan akademis. Di **Chain Quiz Relay**, trivia diubah menjadi arena olahraga sosial estafet penuh tawa!  
Pemain dibagi menjadi tim-tim kecil (3 hingga 4 orang per kelompok). Satu tim maju ke panggung dan wajib menyelesaikan **4 Ronde Berurutan (1 Ronde = 4 Soal Estafet, Total 16 Soal berturut-turut)** tanpa diselingi tim lain.  
Pertanyaan dijawab secara bergantian orang per orang tanpa boleh saling berbisik.  
Jika ada anggota yang **SALAH MENJAWAB**, dia tidak hanya kehilangan poin, tetapi juga **MENDAPATKAN KARTU TANTANGAN KONYOL YANG WAJIB DIJALANKAN SAMPAI RONDE KE-4 SELESAI!** (Misal: berdiri dengan satu kaki, bicara dengan nada opera, atau kepala digoyangkan terus-menerus).  
Pemandangan anggota tim yang berusaha menjawab soal sejarah sambil berdiri satu kaki dan bicara gaya robot menjadi magnet tawa terbesar bagi seluruh penonton di ruangan.

### 1.2. Peran Partisipan (Orang-Orangnya)
1. **Tim yang Sedang Maju (3–4 Pemain):** Berdiri di depan layar TV, menjawab soal secara berurutan sesuai urutan estafet.
2. **Pemain Aktif per Soal:** Satu anggota tim yang sedang memegang giliran. Hanya dia yang boleh bersuara. Rekan setim dilarang membantu.
3. **Tim Penonton (Tim-Tim Lain):** Duduk menonton di sofa, mengawasi apakah ada yang berbisik curang, dan menertawakan aksi tantangan lawan.
4. **Host (Quizmaster & Wasit):** Membacakan soal, mengontrol countdown 15 detik, memvalidasi jawaban, dan memastikan kartu tantangan dijalankan dengan tertib.

---

## 🖥️ 2. SPESIFIKASI UI & TAMPILAN LAYAR LENGKAP

### 2.1. Tampilan Layar Utama TV / Proyektor Host (`G5Play.tsx`)
1. **Header Desktop Layout:**
   * Badge Neo-Brutalist: `GAME 05 • CHAIN QUIZ RELAY` dengan aksen ungu violet `#7C3AED`.
   * Indikator Tim & Ronde: `Tim Garuda • Ronde 2 / 4 (Soal 7 / 16)`.
   * Tombol Host: `Ganti Soal (Shuffle)`, `Undo Jawaban`, dan `Jeda Timer`.
2. **Struktur 4 Tahap UX Layar:**
   * **Tahap 1: `team_ready` (Panggilan Tim):**
     * Memanggil nama tim ke depan panggung.
     * Menampilkan daftar anggota dan roadmap 4 ronde (16 soal estafet).
     * Tombol besar `[Mulai Ronde 1 ➔]`.
   * **Tahap 2: `chain_quiz` (Layar Soal Berantai Aktif):**
     * Badge Kategori Soal: (Sejarah, IPA, IPS, Fakta Unik, Kuliner, dll.).
     * Teks Soal Raksasa berfont display tebal terbaca jelas dari 4 meter.
     * **Countdown Timer 15 Detik:** Lingkaran timer beranimasi cepat dengan SFX detak jam dramatis dan warning merah saat $\le 5$ detik.
     * **Indikator Giliran Anggota:** Menampilkan avatar dan nama pemain yang WAJIB menjawab soal ini (misal: `🎯 Giliran: Budi`).
     * Tombol Spoiler Host: `[Intip Kunci Jawaban]` (membuka jawaban untuk memandu Host).
     * Tombol Eksekusi Cepat: `[✓ BENAR]` (Hijau besar) dan `[✗ SALAH]` (Merah besar).
   * **Tahap 3: `round_summary` (Rekap per Ronde Selesai):**
     * Muncul tiap 4 soal selesai.
     * Menampilkan evaluasi: Skor benar ronde ini (`3/4 Benar ➔ Lolos Ronde (+2 Pts Tim)` atau `2/4 Benar ➔ Ronde Gagal`).
     * Jika ada yang salah: Modal Kartu Tantangan Konyol otomatis terbuka untuk memberikan hukuman fisik yang wajib dijalankan!
     * Tombol `[Lanjut ke Ronde Berikutnya ➔]`.
   * **Tahap 4: `team_summary` (Grand Rekapitulasi 16 Soal Tim):**
     * Menampilkan total skor 16 soal.
     * Pengecekan Jackpot Sempurna 16/16.
     * Tombol `[Panggil Tim Berikutnya ➔]`.
3. **Daftar Tantangan Aktif (Persistent Challenge Stack):**
   * Di sudut kanan layar TV, selalu terpampang kartu nama pemain yang sedang menanggung tantangan aktif:  
     `⚡ Alya: Bicara dengan intonasi robot`  
     `⚡ Kevin: Berdiri dengan 1 kaki`

### 2.2. Tampilan Controller HP Pemain (`PlayerController.tsx`)
* Menampilkan nama tim aktif yang sedang bermain di panggung.
* Menampilkan teks soal trivia dan hitungan mundur timer yang sinkron dengan layar TV.
* Jika pemain sedang menanggung kartu tantangan, HP-nya menampilkan peringatan kuning besar berisi teks tantangan yang wajib ia teruskan.

---

## ⚖️ 3. LOGIKA SKOR, CARA BENAR, & CARA SALAH

### 3.1. Tabel Perhitungan Skor Matematis
| Kondisi Permainan | Cara Benar / Salah | Dampak Skor Individu | Dampak Skor Tim |
| :--- | :--- | :---: | :---: |
| **Jawaban Benar** | **CARA BENAR:** Menjawab dengan benar dalam batas waktu 15 detik tanpa bantuan bisikan. | `0 Poin` | Berkontribusi pada kuota lolos ronde |
| **Jawaban Salah / Waktu Habis** | **CARA SALAH:** Menjawab salah atau waktu 15 detik habis sebelum menjawab. | **-2 Poin (Penalti Individu) + Kartu Tantangan** | Kehilangan 1 kuota benar |
| **Lolos Ronde (Minimal 3 dari 4 Benar)** | **CARA BENAR TIM:** Tim berhasil menjawab minimal 3 soal benar dalam 1 ronde. | `0 Poin` | **+2 Poin Tim** ke saldo Room seluruh anggota |
| **Gagal Ronde ($\le 2$ Benar)** | **CARA SALAH TIM:** Menjawab salah 2 kali atau lebih dalam ronde tersebut. | `0 Poin` | `0 Poin` (Tidak dapat bonus ronde) |
| **Jackpot Sapu Bersih Sempurna** | **PRESTASI MAKSIMAL:** Menjawab **16 dari 16 soal benar (0 Salah / Clean Sheet)**! | **+2 Poin Ekstra** | **Total 10 Poin Penuh** untuk masing-masing anggota tim (`8 + 2`) |

### 3.2. Penjelasan Logika Jackpot 10 Poin
* 4 Ronde Lolos = `4 x +2 Pts = +8 Poin`.
* Bonus Sempurna 16/16 = `+2 Poin Bonus Ekstra`.
* Total Akhir Jackpot = **10 Poin Penuh**.
* Tim yang salah 1 kali saja (misal 15/16 benar) tetap mendapatkan `+8 Poin` ronde, namun **TIDAK BERHAK** atas Bonus Jackpot Sempurna.

---

## 🔍 4. DEEP EDGE CASES: "KALAU ORANGNYA BEGINI BAGAIMANA, KALAU BEGITU BAGAIMANA"

### 1. Bagaimana menjaga tensi penonton agar tidak bosan saat 1 tim menyelesaikan 16 soal berturut-turut?
* *Masalah:* Jika 1 tim bermain terlalu lama, penonton yang menunggu giliran bisa merasa bosan.
* *Solusi Mekanik PartyHub:*
  1. **Timer Kilat 15 Detik:** Alur soal berjalan sangat cepat tanpa basa-basi (16 soal rata-rata selesai dalam waktu 3–4 menit saja).
  2. **Tontonan Komedi Tantangan Fisik:** Semakin banyak anggota tim yang salah, semakin banyak tantangan konyol bertumpuk yang harus mereka peragakan di depan panggung. Penonton justru sangat terhibur menyaksikan penderitaan komedi teman-temannya!
  3. **Peran Penonton sebagai Pengawas (Police Role):** Penonton aktif bersorak dan memprotes jika ada anggota tim yang melanggar kartu tantangannya (misal: menurunkan kakinya saat berdiri 1 kaki).

### 2. Kalau ada anggota tim yang salah berkali-kali (tumpukan 2 atau 3 tantangan sekaligus)?
* *Skenario:* Budi salah di Ronde 1 dan salah lagi di Ronde 3.
* *Penanganan:* Tantangan bersifat **KUMULATIF (BERTUMPUK)**! Budi wajib menjalankan kedua tantangan tersebut secara bersamaan (misal: berdiri 1 kaki SAMBIL bicara dengan nada robot). Ini menjadi momen paling pecah di turnamen!

### 3. Kalau anggota tim membisikkan jawaban ke teman yang sedang giliran (Pelanggaran Estafet)?
* *Skenario:* Giliran Alya, lalu Kevin dari belakang membisikkan jawaban *"Bandung!"*.
* *Penanganan:* Berlaku **Aturan Denda Bisikan**. Soal tersebut otomatis dinyatakan **SALAH / HANGUS**, dan Kevin (si pembisik) dikenai denda **-2 Poin individu** dan wajib mengambil 1 Kartu Tantangan Konyol!

### 4. Kalau jumlah anggota tim hanya 2 orang atau 3 orang (Pemain tidak pas dibagi 4)?
* *Skenario:* Ada tim yang hanya beranggotakan 3 orang.
* *Penanganan:* Sistem estafet menggunakan algoritma modulo berulang:  
  `Soal 1: Pemain 1 ➔ Soal 2: Pemain 2 ➔ Soal 3: Pemain 3 ➔ Soal 4: Pemain 1 ➔ Soal 5: Pemain 2...`  
  Seluruh anggota tetap mendapatkan giliran secara simetris dan adil hingga soal ke-16.

### 5. Kalau soal trivia dirasa terlalu rumit untuk kelompok keluarga / anak-anak?
* *Skenario:* Muncul pertanyaan sains antariksa yang terlalu spesifik.
* *Penanganan:* Host cukup menekan tombol **`[Ganti Soal / Shuffle]`**. Sistem langsung mengganti soal tersebut dengan pertanyaan baru dari bank data tanpa menambah counter ronde.

### 6. Kalau Host salah pencet tombol Benar/Salah?
* *Skenario:* Host tidak sengaja menekan tombol Salah padahal jawaban pemain benar.
* *Penanganan:* Host cukup menekan tombol **`[Undo Jawaban]`** di Host Utility Bar. Skor, tantangan, dan timer akan dikembalikan ke status soal tersebut sebelum ditekan.

---

## 🔄 5. UX FLOW DIAGRAM & TRANSISI STATE

```
[Mulai Game 5 di Hub]
         │
         ▼
[G5Play: State TEAM_READY]
  ├─ TV menampilkan Nama Tim & Daftar Anggota Estafet
  ├─ Host mengarahkan tim berdiri di depan panggung
  │
  ▼
┌────────────────────────────────────────────────────────┐
│ LOOP 4 RONDE BERUNTUN (TOTAL 16 SOAL ESTAFET)          │
│                                                        │
│  [G5Play: State CHAIN_QUIZ (Soal 1..4 per Ronde)]      │
│    ├─ Teks Soal & Countdown 15s berjalan               │
│    ├─ Pemain aktif menjawab secara lisan               │
│    ├─ Host intip kunci & tekan [✓ Benar] / [✗ Salah]  │
│    │  • Benar ➔ Lanjut soal estafet berikutnya         │
│    │  • Salah ➔ -2 Pts & Kartu Tantangan Konyol Aktif  │
│    │                                                   │
│    ▼ (4 Soal Selesai)                                  │
│  [G5Play: State ROUND_SUMMARY]                         │
│    ├─ Cek kelulusan ronde (Min. 3/4 Benar) ➔ +2 Pts    │
│    ├─ Evaluasi Kartu Tantangan yang wajib diteruskan   │
│    └─ Host tekan [Lanjut ke Ronde Berikutnya]          │
└──────────────────────────┬─────────────────────────────┘
                           │
                 (16 Soal Tim Selesai)
                           │
                           ▼
[G5Play: State TEAM_SUMMARY]
  ├─ Rekap Total 16 Soal Tim
  ├─ Cek Bonus Jackpot Sempurna 16/16 (Ekstra +2 Pts)
  ├─ Akumulasi skor tim masuk ke Saldo Utama Room
  │
  ▼
[Tim Terakhir Selesai?] ─── Tidak ───► [G5NextTeam -> Panggil Tim Berikutnya]
         │
        Ya
         │
         ▼
[G5Results: Papan Klasemen Lengkap Room & Upacara Juara Kuis]
```

---

## 📚 6. BANK DATA 450 SOAL TRIVIA 9 KATEGORI (`game5-questions.ts`)
Terkurasi luas melingkupi:
1. **Pengetahuan Umum & Keseharian Indonesia:** Mata uang, nama jembatan legendaris, pelabuhan, hari libur nasional, makanan khas daerah.
2. **Sejarah & Budaya:** Tokoh proklamasi, kerajaan kuno Nusantara, candi-candi besar, peristiwa bersejarah dunia.
3. **IPA & Sains Populer:** Konsep gaya fisika, wujud zat, tata surya, hukum gravitasi, fenomena alam.
4. **Biologi & Dunia Satwa:** Hewan mamalia, rantai makanan, metamorfosis serangga, habitat satwa langka Indonesia.
5. **IPS & Geografi Dunia:** Ibukota negara dunia, bendera, benua, pegunungan tertinggi, sungai terpanjang.
6. **Kuliner & Tradisi Lokal:** Bumbu rempah masakan Padang, jenis sambal nusantara, filosofi tumpeng, jajanan pasar.
7. **Matematika Cepat & Logika:** Perhitungan hitungan mental sederhana (perkalian, persentase diskon belanja, deret angka).
8. **Olahraga & Prestasi:** Bulu tangkis, sepakbola Piala Dunia, rekor olimpiade, atlet legendaris Indonesia.
9. **Fakta Unik & Pop Culture:** Asal-usul nama benda, fenomena viral, rekor dunia unik, fakta tubuh manusia.

### Bank Kartu Tantangan Konyol (Active Challenges):
* *Berdiri dengan satu kaki selama ronde berlangsung.*
* *Wajib menjawab dengan intonasi robot kaku tanpa ekspresi wajah.*
* *Tepuk tangan heboh setiap kali ada orang yang bersuara di ruangan.*
* *Wajib katakan "Siap Bosque!" dengan lantang sebelum menjawab soal.*
* *Goyangkan kepala ke kiri dan kanan terus-menerus seolah sedang mendengar musik.*
* *Tahan tawa dan pasang muka melotot heran ke arah penonton.*
* *Bicara dengan nada berbisik rahasia agen mata-mata CIA.*
* *Pegang dagu seolah-olah lagi merenungi masa depan bangsa.*
