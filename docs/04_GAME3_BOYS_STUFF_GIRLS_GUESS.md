# PARTYHUB INDONESIA — SPESIFIKASI GAME 03: BOYS STUFF, GIRLS GUESS!
> Kategori: Interogasi Asimetris • Tebak Hobi Cowok (Otomotif, Perkakas, Game, Sepakbola, Alat Rumah)  
> Tema Warna: Cobalt Blue (`#2568EF`) | Maskot: Juno / Bimi  
> Target Demografis: Universal (Adu Gender Pria vs Wanita ATAU Mode Detektif vs Insider Netral)  
> Target Pembaca: Reviewer Sistem, Full-Stack Architect, & Model AI (Gemini Neon High)

---

## 🎯 1. KONSEP & ATURAN UTAMA PERMAINAN

### 1.1. Filosofi & Sensasi Sosial
Merupakan kebalikan simetris dari Game 02. Istilah dunia otomotif, perkakas tukang, rental PlayStation, sepakbola dunia, dan alat gym sering kali menjadi topik obrolan akrab di kalangan pria, namun menjadi teka-teki membingungkan bagi lawan jenis.  
Di **Boys Stuff, Girls Guess!**, 1 orang perwakilan cowok memegang kata rahasia (misal: *Busi Motor, Kunci Inggris, Obeng Kembang, Joystick PS2, Cristiano Ronaldo, Barbel*). Kubu penantang (para cewek) diberi waktu 60 detik untuk melancarkan interogasi verbal.  
Pemegang rahasia **HANYA BOLEH MENJAWAB** dengan 3 kata: **"YA"**, **"TIDAK"**, atau **"BISA JADI"**.

### 1.2. Peran Partisipan (Orang-Orangnya)
1. **Sang Penjaga Rahasia (The Insider):**
   * Default: Perwakilan Cowok di ruangan (atau pemain yang diundi di Mode Netral).
   * Menjaga kata rahasia dan menahan diri agar tidak memberikan petunjuk selain 3 frasa yang diizinkan.
2. **Skuad Detektif / Tim Penebak (The Interrogators):**
   * Default: Para Cewek di ruangan (atau kubu penantang di Mode Netral).
   * Menyelidiki bentuk, fungsi, tempat penyimpanan, dan cara penggunaan benda tersebut.
3. **Host (Wasit & Timekeeper):**
   * Memandu waktu, menjaga agar tidak ada pembocoran verbal, dan memvalidasi tebakan.

---

## 🖥️ 2. SPESIFIKASI UI & TAMPILAN LAYAR LENGKAP

### 2.1. Tampilan Layar Utama TV / Proyektor Host (`G3Secret.tsx` & `G3Guess.tsx`)
1. **Header Desktop Layout:**
   * Badge Neo-Brutalist: `GAME 03 • BOYS STUFF` dengan aksen cobalt blue `#2568EF`.
   * Indikator Slot Giliran: `Slot 1 / 4 • Penjaga Rahasia: Budi`.
   * Papan Skor Kubu Live: `👦 Tim Rahasia: X Wins • 👧 Tim Penebak: Y Wins`.
2. **Kartu Kata Rahasia (Secret Card):**
   * *Status Tersembunyi (Default):* Kotak bermotif garis putus-putus dengan teks tersamarkan `••••••••••••••` dan tombol `[Intip Benda Rahasia (Budi)]`.
   * *Status Terbuka:* Menampilkan nama benda rahasia dengan font besar (misal: *"Kunci Inggris"*), kategori (*Perkakas Tukang*), dan tips petunjuk.
   * Tombol `[Ganti Benda / Shuffle]` untuk mengundi ulang kata jika dirasa terlalu teknis atau kurang umum.
3. **Tracker Tanya-Jawab Live (Q&A Verbal Tracker):**
   * Menampilkan jatah 2 pertanyaan clue langsung dari penebak.
   * Tombol checkmark: `[Pertanyaan 1 Selesai]` dan `[Pertanyaan 2 Selesai]`.
4. **Kotak Tebakan Masuk Realtime dari HP:**
   * Menampilkan tebakan live dari HP penebak:  
     `📱 Tebakan Masuk: Alya: "Obeng" • Sari: "Kunci Pas"`.
5. **Tombol Keputusan Juri Host (Verdict Phase):**
   * `[KETEBAK! (+5 Cewek / Penebak)]` — Memberikan kemenangan kepada kubu penebak.
   * `[GAGAL! (+3 Budi / Penjaga Rahasia)]` — Memberikan poin kepada penjaga rahasia.
   * **Selector Penebak Cepat:** Tombol profil cewek (`[🎯 Alya (+5)]`, `[🎯 Sari (+5)]`) untuk menghadiahkan poin individu kepada penebak yang tepat sasaran.
6. **Layar Mode TV / Kertas Alternatif (`G3Guess.tsx`):**
   * Mode anti-cabut kabel HDMI: Penebak menulis jawaban di kertas/notes HP, Host cukup mengetuk `[✓ Benar]` / `[✗ Salah]` di samping nama masing-masing pemain pada layar Reveal.

### 2.2. Tampilan Controller HP Pemain (`PlayerController.tsx`)
* **Jika Pemain adalah Sang Penjaga Rahasia:**
  Layar HP menampilkan kartu rahasia privat:  
  `🔒 BENDA RAHASIA KAMU: "Kunci Inggris" (Kategori: Perkakas)`  
  Pemain cukup melihat HP-nya tanpa perlu meninggalkan tempat duduknya di sofa tongkrongan.
* **Jika Pemain adalah Tim Penebak:**
  Layar HP menampilkan form tebakan instan: *"Tebak barang hobi cowok rahasia..."* beserta tombol kirim `[Kirim Tebakan ➔]`.

---

## 🕹️ 3. CARA MENEBAK & DUA PILIHAN JALUR BERMAIN

### Jalur A: Mode HP Controller (Realtime Digital)
1. Penjaga rahasia membaca kata rahasia di HP-nya secara tertutup.
2. Tim penebak bertanya secara verbal: *"Ada di garasi bukan?"*, *"Bisa berputar gak?"*. Penjaga rahasia menjawab *"Ya / Tidak / Bisa Jadi"*.
3. Tim penebak mengirimkan tebakan via controller HP. Jawaban langsung muncul di TV Host.

### Jalur B: Mode Layar TV / Kertas (Zero-Device Fallback)
1. Penjaga rahasia membalikkan badan sejenak ke arah TV Host untuk melihat kata rahasia.
2. Sesi interogasi verbal berlangsung 60 detik.
3. Semua penebak menuliskan tebakan mereka di notes HP atau secarik kertas.
4. Saat waktu habis, semua penebak serentak membacakan tebakannya. Host menekan tombol keputusan di layar TV.

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
Sistem mengenali variasi sebutan lokal masyarakat Indonesia:
* Target: *"Kunci Inggris"* $\rightarrow$ Alias sah: `adjustable wrench`, `kunci monyet`, `kunci buaya`.
* Target: *"Busi Motor"* $\rightarrow$ Alias sah: `spark plug`, `busi pengapian`.
* Target: *"Obeng Kembang"* $\rightarrow$ Alias sah: `obeng plus`, `phillips screwdriver`, `obeng kembang plus`.
* Target: *"Joystick PS2"* $\rightarrow$ Alias sah: `stik ps`, `stick ps2`, `controller ps`, `gamepad`.
* Target: *"Cristiano Ronaldo"* $\rightarrow$ Alias sah: `cr7`, `ronaldo`, `siuuu`, `bang dodo`.
* **Hak Veto Host Override:** Host berwenang penuh memvalidasi jawaban yang hampir tepat dengan tombol `[✓ Tandai Benar (+3 Pts)]`.

---

## 🔍 5. DEEP EDGE CASES: "KALAU ORANGNYA BEGINI BAGAIMANA, KALAU BEGITU BAGAIMANA"

### 1. Kalau grup yang bermain adalah 100% Cewek (misal acara arisan/gathering perempuan)?
* *Skenario:* Tidak ada pemain cowok sama sekali di ruangan.
* *Penanganan:* Sistem otomatis membagi kubu secara acak seimbang 50:50. Label UI otomatis berubah menjadi peran netral **"Sang Penjaga Rahasia"** vs **"Skuad Detektif"**.
* *Alternatif Tema:* Host dapat beralih ke paket **Peralatan Dapur & Rumah Tangga** (`pack-home-kitchen.ts`) yang berisi 35 benda relate (Sodet, Parutan Kelapa, Cobek Batu, Panci Presto, Serbet Dapur).

### 2. Kalau Penjaga Rahasia terus-menerus menjawab "Bisa Jadi"?
* *Skenario:* Penjaga rahasia mengulur waktu dengan terus menjawab *"Bisa Jadi"*.
* *Penanganan:* Berlaku **Batas Kuota Jawaban "Bisa Jadi" Maksimal 2x per ronde**. Setelah 2x, penjaga rahasia wajib menjawab tegas *"YA"* atau *"TIDAK"*.

### 3. Kalau tebakan penebak mendekati fungsi tapi salah istilah teknis?
* *Skenario:* Kata rahasia adalah *"Kunci Inggris"*, lalu penebak menjawab *"Kunci pas yang ukurannya bisa diputer-puter diperlebar"*.
* *Penanganan:* Karena deskripsi fungsinya 100% akurat dan menunjukkan pemain tahu persis benda tersebut, Host berhak menggunakan tombol **Host Override `[✓ Benar]`** untuk mengesahkan kemenangan!

### 4. Kalau Penjaga Rahasia tidak familiar dengan kata rahasia yang muncul?
* *Skenario:* Pemain cowok yang jarang main game mendapatkan kata rahasia *"VGA Card"* atau *"GTA San Andreas"*.
* *Penanganan:* Host menekan tombol **`[Ganti Benda / Shuffle]`**. Sistem mengundi kata baru yang lebih populer (seperti *Knalpot Racing* atau *Lionel Messi*) tanpa penalti.

### 5. Kalau penebak kehabisan waktu dan gagal menebak?
* *Skenario:* Waktu 60 detik habis tanpa ada tebakan benar.
* *Penanganan:* Host membunyikan buzzer, mengumumkan kata rahasia di layar, dan menekan tombol `[GAGAL!]` untuk memberikan `+4 Poin` kepada penjaga rahasia.

---

## 🔄 6. UX FLOW DIAGRAM & TRANSISI STATE

```
[Mulai Game 3 di Hub]
         │
         ▼
[G3Secret: Fase Rahasia (Slot Aktif)]
  ├─ TV menampilkan kartu tertutup & tombol Intip
  ├─ HP Penjaga Rahasia menampilkan kata rahasia privat
  ├─ Host mengarahkan sesi tanya-jawab interogasi verbal (Maks 2 Pertanyaan Clue)
  │
  ▼ (Sesi Tanya Jawab Selesai)
[G3Guess / Verdict: Fase Tebakan Penebak]
  ├─ Pilihan A: Penebak ketik tebakan di HP Controller -> Muncul live di TV
  ├─ Pilihan B: Penebak sebut tebakan verbal di ruangan
  ├─ Host memilih hasil: [KETEBAK! (+5 Cewek)] atau [GAGAL! (+3 Cowok)]
  ├─ Host dapat memilih tombol profil cewek spesifik yang menebak benar
  │
  ▼
[Slot Terakhir Selesai?] ─── Tidak ───► [G3NextSlot -> Masuk ke Slot Pemain Berikutnya]
         │
        Ya
         │
         ▼
[G3Results: Rekap Kemenangan Kubu & Update Klasemen Room]
  └─ Pilihan: [Replay Game 3] atau [Kembali ke Hub Game]
```

---

## 📦 7. BANK DATA KATA RAHASIA DUNIA COWOK (`game3-words.ts`)
Terkurasi dalam 5 kategori legendaris:
1. **Sparepart & Aksesoris Motor:** Busi Motor, Rantai Motor, Knalpot Racing, Kampas Rem, Karburator, Aki Basah, Spion Bar End, Shockbreaker Tabung, Ban Tubeless, Oli Mesin MPX.
2. **Perkakas Tukang & Garasi:** Kunci Inggris, Obeng Kembang, Tang Buaya, Palu Kambing, Meteran Gulung, Gergaji Besi, Lem Korea/Alteco, Isolasi Listrik Hitam, Solder Timah, Kunci L.
3. **Rental PS & Game Tongkrongan:** Joystick PS2 Getar, Memory Card 8MB, GTA San Andreas, Winning Eleven / PES, Guitar Hero, Mortal Kombat, Kabel AV Merah Kuning Putih, Game FIFA / FC24.
4. **Olahraga & Fitness:** Barbel Dumbbell, Shaker Protein, Sarung Tinju Muay Thai, Sepatu Futsal Rumput Sintetis, Skipping Rope, Grip Handgrip Tangan, Dekker Tulang Kering.
5. **Pesepakbola Legendaris:** Cristiano Ronaldo, Lionel Messi, Zinedine Zidane, Ronaldinho, Kylian Mbappe, Erling Haaland, Neymar Jr, Wayne Rooney, Paolo Maldini.
