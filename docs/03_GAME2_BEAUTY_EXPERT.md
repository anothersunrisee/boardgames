# PARTYHUB INDONESIA — SPESIFIKASI GAME 02: BEAUTY EXPERT?!
> Kategori: Interogasi Asimetris • Tebak Benda Skincare & Makeup (atau Tema Rumah Tangga)  
> Tema Warna: Magenta Berry (`#D8317E`) | Maskot: Lulu / Milo  
> Target Demografis: Universal (Adu Gender Pria vs Wanita ATAU Mode Detektif vs Insider Netral)  
> Target Pembaca: Reviewer Sistem, Full-Stack Architect, & Model AI (Gemini Neon High)

---

## 🎯 1. KONSEP & ATURAN UTAMA PERMAINAN

### 1.1. Filosofi & Sensasi Sosial
Dunia perawatan diri, skincare, dan kosmetik sering kali menjadi dunia yang sangat akrab bagi sebagian orang, namun menjadi "misteri asing penuh istilah ilmiah" bagi yang lain.  
Di **Beauty Expert?!**, 1 orang pemain memegang satu nama produk/alat kecantikan rahasia (misal: *Micellar Water, Eyelash Curler, Cushion, Sunscreen, Beauty Blender*). Kubu lawan (para penebak) diberi kesempatan melontarkan pertanyaan interogasi bebas selama 60 detik.  
Pemegang rahasia **HANYA BOLEH MENJAWAB** dengan 3 frasa: **"YA"**, **"TIDAK"**, atau **"BISA JADI"**.  
Tensi permainan terbangun saat kubu penebak kebingungan merangkai logika: *"Dipake di muka bukan?"*, *"Bikin putih gak?"*, *"Teksturnya cair atau padat?"*.

### 1.2. Peran Partisipan (Orang-Orangnya)
1. **Sang Penjaga Rahasia (The Insider):**
   * Default: Perwakilan Cewek di ruangan (atau pemain yang diundi di Mode Netral).
   * Mengetahui nama benda rahasia dan bersumpah tidak membocorkannya secara verbal.
2. **Skuad Detektif / Tim Penebak (The Interrogators):**
   * Default: Para Cowok di ruangan (atau kubu penantang di Mode Netral).
   * Mengajukan pertanyaan interogasi dan memasukkan tebakan akhir.
3. **Host (Wasit & Timekeeper):**
   * Memandu timer, memastikan penjaga rahasia hanya menjawab 3 frasa sah, dan mengesahkan tebakan akhir.

---

## 🖥️ 2. SPESIFIKASI UI & TAMPILAN LAYAR LENGKAP

### 2.1. Tampilan Layar Utama TV / Proyektor Host (`G2Secret.tsx` & `G2Guess.tsx`)
1. **Header Desktop Layout:**
   * Badge Neo-Brutalist: `GAME 02 • BEAUTY EXPERT?!` dengan aksen magenta `#D8317E`.
   * Indikator Slot Giliran: `Slot 1 / 4 • Penjaga Rahasia: Alya`.
   * Papan Skor Kubu Live: `👧 Tim Rahasia: X Wins • 👦 Tim Penebak: Y Wins`.
2. **Kartu Benda Rahasia (Secret Card):**
   * *Status Tersembunyi (Default):* Kotak bermotif garis putus-putus dengan teks tersamarkan `••••••••••••••` dan tombol `[Intip Benda Rahasia (Alya)]`.
   * *Status Terbuka:* Menampilkan nama benda rahasia dengan font besar (misal: *"Penjepit Bulu Mata"*), kategori (*Alat Makeup*), serta panduan petunjuk.
   * Tombol `[Ganti Benda / Shuffle]` untuk mengundi ulang jika benda dirasa terlalu sulit atau kurang dikenal.
3. **Tracker Tanya-Jawab Live (Q&A Verbal Tracker):**
   * Menampilkan kuota pertanyaan interogasi langsung.
   * Dua tombol checkmark besar: `[Pertanyaan 1 Selesai]` dan `[Pertanyaan 2 Selesai]`.
4. **Kotak Tebakan Masuk Realtime dari HP:**
   * Jika penebak menggunakan HP Controller, nama dan tebakan mereka langsung muncul di kotak biru:  
     `📱 Tebakan Masuk: Kevin: "Mascara" • Budi: "Jepit Bulumata"`.
5. **Tombol Keputusan Juri Host (Verdict Phase):**
   * `[KETEBAK! (+5 Cowok / Penebak)]` — Memberikan poin kemenangan ke kubu penebak.
   * `[GAGAL! (+3 Alya / Penjaga Rahasia)]` — Memberikan poin ke penjaga rahasia karena sukses mengelabui penebak.
   * **Selector Penebak Cepat:** Deretan tombol nama penebak (`[🎯 Budi (+5)]`, `[🎯 Kevin (+5)]`) agar Host bisa menghadiahkan poin individu secara akurat kepada orang yang pertama kali menyebut jawaban benar.
6. **Layar Mode TV / Kertas Alternatif (`G2Guess.tsx`):**
   * Toggle ramah proyektor: *"Mode Layar TV / Kertas"*. Host tidak perlu mengoper laptop ke 8 orang penebak secara bergiliran (mencegah kabel HDMI proyektor copot/rusak).
   * Tombol **Host Override**: Di samping tebakan setiap pemain pada layar Reveal, tersedia tombol `[✓ Benar]` dan `[✗ Salah]` agar Host dapat menganulir keputusan sistem.

### 2.2. Tampilan Controller HP Pemain (`PlayerController.tsx`)
* **Jika Pemain adalah Sang Penjaga Rahasia:**
  Layar HP otomatis menampilkan kartu emas rahasia bertuliskan:  
  `🔒 BENDA RAHASIA KAMU: "Penjepit Bulu Mata"`  
  Layar ini bersifat privat sehingga pemain tidak perlu maju ke depan laptop TV untuk mengintip!
* **Jika Pemain adalah Tim Penebak:**
  Layar HP menampilkan form input teks: *"Masukkan tebakan produk skincare/makeup rahasia..."* beserta tombol kirim `[Kirim Tebakan ➔]`.

---

## 🕹️ 3. CARA MENEBAK & MEKANISME DUA JALUR (HYBRID)

### Jalur A: Mode HP Controller (Realtime Digital)
1. Penjaga Rahasia melihat nama benda rahasia di layar HP-nya secara privat.
2. Tim Penebak mengajukan pertanyaan interogasi secara lisan di ruangan. Penjaga rahasia menjawab *"Ya / Tidak / Bisa Jadi"*.
3. Tim Penebak mengetikkan tebakan rahasia di HP masing-masing dan menekan tombol kirim.
4. Di layar TV Host, seluruh tebakan yang masuk langsung terpampang secara rapi. Host menekan tombol validasi.

### Jalur B: Mode Layar TV / Kertas (Zero-Device / Kabel HDMI Aman)
1. Penjaga Rahasia membalik badan sejenak ke arah TV atau Host membisikkan kata rahasia.
2. Sesi interogasi verbal 60 detik berjalan.
3. Seluruh penebak menuliskan tebakan mereka di notes HP atau secarik kertas.
4. Saat waktu habis, semua penebak serentak membacakan tebakannya. Host cukup menekan tombol `[KETEBAK!]` atau `[GAGAL!]` di layar TV.

---

## ⚖️ 4. LOGIKA SKOR, CARA BENAR, & CARA SALAH

### 4.1. Tabel Perhitungan Skor Matematis
| Kondisi Permainan | Cara Benar / Salah | Dampak Skor Individu | Dampak Skor Tim di Room |
| :--- | :--- | :---: | :---: |
| **Penebak Berhasil Menebak Benar** | **CARA BENAR (PENEBAK):** Menyebut nama benda rahasia (atau sinonim sah) sebelum waktu habis. | **+5 Poin** (untuk penebak utama yang menemukan jawaban) | **+2 Poin** untuk seluruh anggota tim penebak lainnya |
| **Penjaga Rahasia Ketebak** | **CARA SALAH (PENJAGA):** Gagal mempertahankan rahasianya. | **-1 Poin (Penalti)** | `0 Poin` |
| **Penjaga Rahasia Sukses Mengelabui** | **CARA BENAR (PENJAGA):** Seluruh tebakan lawan salah hingga waktu habis. | **+4 Poin** (atau +3 Pts) untuk penjaga rahasia | **+2 Poin** untuk seluruh anggota tim penjaga rahasia |
| **Penebak Gagal Total** | **CARA SALAH (PENEBAK):** Tidak ada satu pun anggota yang menebak dengan benar. | `0 Poin` | `0 Poin` |

### 4.2. Algoritma Pencocokan Cerdas (Fuzzy Matching Engine)
Sistem dilengkapi fungsi `isFuzzyMatch(guess, secret, aliases)`:
* **Toleransi Spasi & Tanda Baca:** *"penjepit bulu mata"* $\leftrightarrow$ *"penjepit bulumata"*.
* **Toleransi Typo (Levenshtein Distance $\le 2$):** *"micelar water"* $\leftrightarrow$ *"micellar water"*.
* **Database Alias & Sinonim:**
  * Target: *"Penjepit Bulu Mata"* $\rightarrow$ Alias sah: `eyelash curler`, `jepitan bulu mata`, `curler`.
  * Target: *"Kapas Wajah"* $\rightarrow$ Alias sah: `cotton pad`, `kapas toner`, `kapas pembersih`.
  * Target: *"Pelembap"* $\rightarrow$ Alias sah: `moisturizer`, `moisturiser`, `krim pelembab`.
* **Hak Veto Host Override:** Jika sistem menandai salah karena ejaan yang sangat aneh namun Host tahu maksud pemain benar, Host cukup menekan tombol `[✓ Tandai Benar (+3 Pts)]` pada layar Reveal!

---

## 🔍 5. DEEP EDGE CASES: "KALAU ORANGNYA BEGINI BAGAIMANA, KALAU BEGITU BAGAIMANA"

### 1. Kalau grup yang bermain adalah 100% Cowok (misal tim futsal/kantor pria)?
* *Skenario:* Tidak ada pemain cewek di dalam ruangan.
* *Penanganan:* Sistem `autoStartGame2` otomatis membagi pemain secara proporsional 50:50. Label UI otomatis berganti dari "Cewek vs Cowok" menjadi **"Sang Insider / Tim Rahasia"** vs **"Skuad Detektif"**.
* *Alternatif Tema:* Host dapat mengganti tema kosmetik menjadi **Tema Dapur & Rumah Tangga** (Lengkuas, Sodet, Kukusan, Kunyit, Cobek) yang sangat seru dan adil untuk kelompok pria!

### 2. Kalau Penjaga Rahasia terus-menerus menjawab "Bisa Jadi" untuk mengulur waktu?
* *Skenario:* Penjaga rahasia takut memberi petunjuk, sehingga tiap pertanyaan dijawab *"Bisa jadi... bisa jadi..."*.
* *Penanganan:* Diberlakukan **Aturan Kuota Jawaban "Bisa Jadi"**: Penjaga rahasia maksimal HANYA BOLEH menjawab *"Bisa Jadi"* sebanyak **2 KALI per ronde**. Pertanyaan ke-3 dan seterusnya WAJIB dijawab tegas *"YA"* atau *"TIDAK"*.

### 3. Kalau penebak menyebut merk produk, bukan jenis bendanya?
* *Skenario:* Benda rahasia adalah *"Mascara"*, lalu penebak menyebut *"Maybelline"* atau *"Wardah"*.
* *Penanganan:* Host menolak tebakan merk dan memberikan peringatan verbal: *"Sebutkan jenis benda atau fungsinya, bukan nama merk!"*. Jika penebak langsung menyusul dengan *"Oh, maskara pelentik bulu mata!"*, Host mengesahkannya sebagai BENAR.

### 4. Kalau Penjaga Rahasia sendiri tidak tahu benda apakah itu?
* *Skenario:* Seorang pemain mendapatkan kartu rahasia *"Gua Sha"* atau *"Niacinamide"* dan dia sendiri bingung cara kerjanya.
* *Penanganan:* Host cukup menekan tombol **`[Ganti Benda / Shuffle]`** di layar TV. Sistem akan langsung mengundi benda baru yang lebih populer (seperti *Lipstik* atau *Sunscreen*) tanpa penalti skor.

### 5. Kalau ada dua orang penebak yang menyebut jawaban benar secara bersamaan?
* *Skenario:* Budi dan Dimas sama-sama teriak *"Cushion!"* di detik yang sama.
* *Penanganan:* Host memilih tombol penebak cepat `[🎯 Budi (+5)]`, lalu melalui Host Bar atau laci skor, Host dapat menambahkan `+5 Poin` tambahan secara manual untuk Dimas.

### 6. Kalau waktu 60 detik habis dan belum ada tebakan sama sekali?
* *Skenario:* Kubu penebak buntu dan waktu hitung mundur mencapai 0.
* *Penanganan:* Host membunyikan buzzer kegagalan. Penjaga rahasia dinyatakan menang dan mendapatkan **+4 Poin**. Host menekan tombol `[GAGAL!]` dan melanjutkan ke slot pemain berikutnya.

---

## 🔄 6. UX FLOW DIAGRAM & TRANSISI STATE

```
[Mulai Game 2 di Hub]
         │
         ▼
[G2Secret: Fase Rahasia (Slot Aktif)]
  ├─ TV menampilkan kartu tertutup & tombol Intip
  ├─ HP Penjaga Rahasia menampilkan kartu rahasia privat
  ├─ Host mengarahkan sesi tanya-jawab interogasi verbal (Maks 2 Pertanyaan Clue)
  │
  ▼ (Sesi Tanya Jawab Selesai)
[G2Guess / Verdict: Fase Tebakan Penebak]
  ├─ Pilihan A: Penebak ketik tebakan di HP Controller -> Muncul live di TV
  ├─ Pilihan B: Penebak sebut tebakan verbal di ruangan
  ├─ Host memilih hasil: [KETEBAK! (+5 Cowok)] atau [GAGAL! (+3 Cewek)]
  ├─ Host dapat memilih tombol profil cowok spesifik yang menebak benar
  │
  ▼
[Slot Terakhir Selesai?] ─── Tidak ───► [G2NextSlot -> Masuk ke Slot Pemain Berikutnya]
         │
        Ya
         │
         ▼
[G2Results: Rekap Kemenangan Kubu & Update Klasemen Room]
  └─ Pilihan: [Replay Game 2] atau [Kembali ke Hub Game]
```

---

## 📦 7. BANK DATA 68 ITEM SKINCARE & KOSMETIK (`game2-items.ts`)
Terkurasi dalam 5 kategori luas:
1. **Skincare Dasar:** Micellar Water, Toner Wajah, Serum Wajah, Moisturizer, Sunscreen, Eye Cream, Clay Mask, Sheet Mask, Facial Wash, Face Mist.
2. **Makeup Wajah:** Cushion, Foundation Cair, Bedak Tabur, Concealer, BB Cream, Primer Wajah, Contour, Highlighter, Blush On, Setting Spray.
3. **Area Mata & Alis:** Maskara, Pensil Alis, Eyeliner Spidol, Eyeshadow Palette, Lem Bulu Mata, Bulu Mata Palsu, Eyebrow Pomade.
4. **Area Bibir:** Lip Tint, Lip Balm, Lip Cream Matte, Lip Gloss, Lipstik Batang, Lip Scrub, Lip Liner.
5. **Alat Kecantikan:** Penjepit Bulu Mata (Eyelash Curler), Beauty Blender (Spons Wajah), Kuas Bedak (Powder Brush), Gua Sha, Jade Roller, Pouch Kosmetik, Kapas Pembersih Wajah.
