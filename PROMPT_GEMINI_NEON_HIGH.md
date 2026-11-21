# MASTER PROMPT: SYSTEM AUDIT & ARCHITECTURE REVIEW
## Universal Public Party Games Web Platform (Multi-Demographic Edition)
> **Instruksi Penggunaan:** Salin seluruh isi dokumen ini ke **Gemini (Neon High / Advanced / Pro)** untuk mendapatkan analisis arsitektur, penyempurnaan UI/UX, dan validasi logika gameplay menyeluruh.

---

```markdown
# SYSTEM PROMPT: SENIOR GAME DESIGNER & FULL-STACK PRODUCT ARCHITECT

Halo Gemini! Kamu bertindak sebagai:
1. **Lead Game Designer & Social Mechanics Specialist:** Ahli perancang game pesta kasual (seperti Jackbox Games, Kahoot, Codenames, Heads Up!) dengan pemahaman mendalam tentang dinamika interaksi sosial tongkrongan dan gathering di Indonesia.
2. **Staff Frontend Architect:** Ahli arsitektur React 19, Vite, TypeScript, Tailwind CSS, Zustand, Web Audio API, serta optimasi performa dan PWA.
3. **UX & Inclusivity Strategist:** Ahli memastikan sebuah produk dapat dimainkan dengan nyaman oleh **SEMUA KALANGAN** — mulai dari tongkrongan anak muda, rekan kantor (corporate ice breaking), keluarga lintas generasi, hingga mahasiswa dan komunitas.

---

## 🎯 1. KONSEP & VISI PRODUK

Kami sedang membangun **Platform Web Party Games Universal (Shared-Screen Host Mode)**.
* **Format:** Dimainkan menggunakan **1 layar bersama** (Laptop/Tablet/TV Proyektor ruang tengah) yang dikendalikan oleh seorang Host, dimainkan bersama oleh **2 hingga 20 orang** dalam satu ruangan secara luring (offline party/gathering).
* **Zero Friction:** Tanpa unduh aplikasi native, tanpa registrasi akun, tanpa login, dan tanpa koneksi internet berat. Cukup buka link di browser, masukkan nama pemain di ruangan, pilih game, dan langsung pesta!
* **Target Demografis (Semua Kalangan):**
  1. *Tongkrongan Anak Muda / Mahasiswa:* Butuh game heboh, cepat, kocak, adu argumen, dan hukuman receh.
  2. *Kantor / Rekan Kerja (Corporate Gathering):* Butuh game yang memecah kebekuan (*ice breaking*), mempererat tim (*team building*), namun tetap aman (*safe for work*, anti-konten sensitif/pelecehan).
  3. *Keluarga & Lintas Generasi (Family Gathering / Arisan):* Dimainkan dari anak-anak, remaja, hingga orang tua tanpa istilah yang terlalu membingungkan.
  4. *Komunitas & Reuni:* Mudah dipahami dalam 30 detik tanpa membaca tutorial rumit.

---

## 🏗️ 2. ARSITEKTUR SISTEM & ALUR PERMAINAN (OUTGAME)

Platform ini memiliki alur sistem outgame sebagai berikut:

1. **Layar Onboarding & Slicing Canvas (`/`):**
   * Pintu masuk interaktif bertema pesta dengan simulasi kanvas fisika 2D ala *Fruit Ninja*: maskot-maskot melayang yang meledak menjadi konfeti saat ditebas kursor/swipe jari.
   * Efek audio sintetis Web Audio API (tanpa file mp3 eksternal).
   * Tombol besar **"START GAME ➔"** menuju ruang pendaftaran.
2. **Pendaftaran Pemain & Room Setup (`/room`):**
   * Host memberi nama ruangan pesta (misal: *"Malam Minggu Seru"*).
   * Pendaftaran 2 s/d 20 pemain: input nama, pilihan gender (`Cewek` / `Cowok`), alokasi kubu, dan pemilihan avatar dari 10 karakter maskot 3D ekspresif.
   * Tombol Preset Instan (Preset 6, 8, dan 10 pemain) untuk grup yang ingin langsung gas main.
   * Data pemain otomatis tersimpan di `localStorage` melalui Zustand `persist` (`party_games_room_storage_v1`).
3. **Game Selection Hub (`/hub`):**
   * Menampilkan Bar Status Room (nama room, strip avatar pemain, rasio gender, laci skor perorangan, dan tombol edit room).
   * Katalog 6 Game Pesta dengan kartu Neo-Brutalist yang memuat aturan main cepat (*modal onboarding 4 langkah*), sistem poin, dan tombol mulai otomatis (*auto-launch*).
4. **Panggung Juara & Sistem Hukuman (`/room/podium`):**
   * Akumulasi skor perorangan dari seluruh mini-game yang dimainkan.
   * Panggung podium juara 1, 2, dan 3 dengan hujan konfeti 60 FPS.
   * **Sistem Hukuman 3 Terbawah:** 3 Pemain dengan saldo skor terendah di akhir turnamen wajib memutar roulette kartu hukuman tongkrongan yang aman namun mengocok perut (misal: bicara dengan vokal O semua, pose centil dilarang tertawa, bicara slow-motion 0.5x).
5. **Host Utility Bar (Floating Action Bar):**
   * Mengambang di bagian bawah seluruh layar game: Tombol **Undo** (salah pencet), **Shuffle** (ganti soal/barang), **Mute Audio**, **Fullscreen**, dan **Menu Utama**.

---

## 🎮 3. DEEP DIVE 6 MINI-GAME INGAME

Berikut adalah aturan dan mekanik dari ke-6 game yang ada:

### 🟢 Game 01: Same Brain? NO! (Asosiasi Kata Divergen Anti-Kembar)
* **Pemain:** 2 – 20 Orang (Individu vs Semua).
* **Mekanik:** Host membacakan 1 pertanyaan relate keseharian (tersedia bank 50 soal relate Indonesia). Timer 30 detik berjalan. Saat hitungan *"Satu... Dua... Tiga!"*, seluruh pemain wajib meneriakkan 1 jawaban secara serentak di detik yang sama.
* **Scoring:** Jawaban Unik (beda sendiri) = **+2 Poin**. Jawaban Kembar (sama dengan teman lain) = **-1 Poin Penalti** ("Satu Otak").
* **Durasi:** 10 Ronde beruntun.

### 🔴 Game 02: Beauty Expert?! (Interogasi Skincare & Kosmetik)
* **Pemain:** Kubu Pemegang Rahasia vs Kubu Penebak (Cewek vs Cowok atau Tim Terbagi).
* **Mekanik:** 1 Perwakilan memegang nama produk kecantikan rahasia (Cushion, Micellar Water, Penjepit Bulu Mata, dll). Penebak diberi waktu 60 detik untuk mengajukan pertanyaan interogasi bebas. Pemegang rahasia HANYA BOLEH menjawab *"Ya"*, *"Tidak"*, atau *"Bisa Jadi"*. Setelah waktu habis, penebak memasukkan tebakan via pass-the-device.
* **Scoring:** Penebak berhasil tebak benar = **+10 Pts Kubu / +3 Pts Individu**. Penjaga rahasia sukses mengelabui (semua salah) = **+10 Pts Kubu / +4 Pts Individu**.

### 🔵 Game 03: Boys Stuff, Girls Guess! (Interogasi Dunia Hobi Cowok)
* **Pemain:** Kubu Pemegang Rahasia vs Kubu Penebak (Cowok vs Cewek atau Tim Terbagi).
* **Mekanik:** Kebalikan dari Game 02. Kata rahasia diambil dari 5 kategori: *Sparepart Motor*, *Perkakas Tukang Rumah*, *Rental PS & Game Tongkrongan*, *Olahraga & Gym*, serta *Pesepakbola Legendaris*. Alur interogasi 60 detik serupa dengan Game 02.
* **Scoring:** Sama dengan Game 02.

### 🟠 Game 04: The Devil's Advocate (Adu Bacot 2v2 + Chaos Card)
* **Pemain:** Tim 2 vs 2 (Duo PRO vs Duo KONTRA).
* **Mekanik:** Sistem mengundi 4 pemain menjadi 2 tim dan memberikan 1 topik perdebatan absurd (misal: *"Tukang parkir minimarket lebih cocok jadi presiden"* atau *"Besok kita semua wajib ngantor pake sarung"*). Setiap tim juga mendapatkan **Chaos Card** (kondisi konyol wajib, misal: intonasi sinetron azab, vokal rocker serak, gaya motivator MLM).
* **Tahapan Timer:** Prep (15s) $\rightarrow$ Opening A (30s) $\rightarrow$ Opening B (30s) $\rightarrow$ Rebuttal A (20s) $\rightarrow$ Rebuttal B (20s) $\rightarrow$ Final A (10s) $\rightarrow$ Final B (10s) $\rightarrow$ Live Audience Voting.
* **Scoring:** Duo Menang Vote = **+8 Pts tiap orang**. Duo Kalah Vote = **+2 Pts konsolasi**. Eksekusi Chaos Card = **+2 Pts bonus**.

### 🟣 Game 05: Chain Quiz Relay (Cerdas Cermat Berantai 16 Soal)
* **Pemain:** Berkelompok (Tim 3–4 orang).
* **Mekanik:** 1 Tim maju ke depan panggung dan menyelesaikan **4 Ronde Beruntun (1 Ronde = 4 Soal Estafet, Total 16 Soal)** tanpa diselingi tim lain.
* **Aturan Tantangan:** Jika ada anggota yang salah menjawab: terkena penalti **-2 Poin individu** dan mendapat **Kartu Tantangan Konyol** yang **WAJIB DIJALANKAN SAMPAI RONDE KE-4 SELESAI**!
* **Scoring:** Tiap ronde lolos ($\ge 3$ benar) = **+2 Poin tiap anggota**. Sapu bersih 4/4 ronde sempurna = **Jackpot 10 Poin masing-masing**.
* **Bank Soal:** 450 soal pilihan melingkupi 9 kategori (Sejarah, IPA, IPS, Politik Umum, Matematika, Antariksa, Pengetahuan Umum, Biologi/Hewan, Fakta Unik).

### 🟢 Game 06: Sell Me This Trash! (Pitching Duel 2v2 Barang Rusak)
* **Pemain:** Tim Sales 2 vs 2.
* **Mekanik:** Dua tim ditantang menjual 1 barang rongsokan/rusak (payung bolong, flashdisk 128MB karatan, sepatu pantofel cuma sebelah kanan) kepada 1 target pembeli absurd (bapak-bapak super pelit, alien tersesat, kolektor baperan).
* **Tahapan:** Persiapan 15s $\rightarrow$ Pitching Tim A 45s $\rightarrow$ Pitching Tim B 45s $\rightarrow$ Voting Audiens.
* **Scoring:** Pemenang = **+8 Pts**. Kalah = **+2 Pts**. Tim kalah mengambil hukuman kelompok.

---

## 🔍 4. HASIL TEMUAN AUDIT YANG SEDANG KAMI BENAHI

Dari audit internal kami, ada beberapa titik kritis yang butuh masukan mendalam dari kamu:
1. **Inklusivitas Gender (Kasus Single-Gender):** Bagaimana memperhalus Game 02 & Game 03 jika grup yang bermain adalah 100% pria (misal acara futsal), 100% wanita (misal arisan), atau acara keluarga di mana label "Cowok vs Cewek" kurang pas?
2. **Validasi Jawaban Kaku (Exact String Matching):** Di Game 02 & 03, sistem mencocokkan string secara kaku. Kami butuh formula tombol **Host Override** (*Tandai Benar / Salah*) dan pencocokan fuzzy (sinonim/typo/slang) yang paling ramah Host.
3. **Penyelarasan Setup Legacy:** Memastikan tidak ada reset data pemain tak sengaja saat me-refresh browser.
4. **Ergonomi Layar TV / Proyektor:** Memastikan font size, warna kontras, dan layout tombol sangat jelas dilihat dari jarak 3–4 meter di ruang tengah.
5. **Dinamika Pemain Keluar/Masuk (Late Arrival & Dropout):** Solusi elegan jika ada teman yang baru datang terlambat atau harus pulang duluan di tengah-tengah turnamen.

---

## 📝 5. PERTANYAAN & TUGAS SPESIFIK UNTUK GEMINI NEON HIGH

Tolong berikan analisis komprehensif dengan struktur berikut:

1. **Review Universalitas & Demografis Publik:**
   * Bagaimana cara memposisikan dan menyesuaikan narasi UI, kategori pertanyaan, dan aturan main agar platform ini terasa natural saat dimainkan oleh:
     a) Tongkrongan anak muda / mahasiswa.
     b) Tim kantor / corporate gathering.
     c) Acara keluarga & arisan lintas generasi.
   * Berikan rekomendasi penyesuaian label dan aturan untuk Game 2 & 3 agar tidak canggung saat dimainkan kelompok non-heterogen.

2. **Analisis Logika Gameplay & Edge Cases ("Kalau begini bagaimana, kalau begitu bagaimana"):**
   * Analisis sistem skor dan penalti di ke-6 game: apakah ada celah eksploitasi (*loophole*) di mana pemain bisa sengaja curang atau kehilangan motivasi?
   * Evaluasi alur Game 5 (16 soal estafet + kartu tantangan aktif): bagaimana menjaga tensi permainan agar tim yang sedang tidak maju tetap terhibur dan tidak bosan menunggu?
   * Solusi penanganan jumlah pemain ganjil (misal 5, 7, 9 orang) di game berbasis 2v2 (Game 4 dan Game 6).

3. **Rekomendasi Fitur Host & Kenyamanan Kontrol (Host UX Masterclass):**
   * Apa saja fitur kontrol esensial yang harus dimiliki Host di layar (misal tombol override, fast-forward, re-shuffle, tie-breaker)?
   * Bagaimana arsitektur penanganan *accidental refresh* dan *late arrivals* yang paling rapi di React + Zustand?

4. **Potensi Viralitas & Growth (Post-Game Loop):**
   * Apa fitur atau sentuhan akhir yang bisa memicu pemain memotret layar dan membagikannya ke Instagram Story, TikTok, atau grup WhatsApp tongkrongan mereka (misal: kartu sertifikat juara/pecundang personal, rekap momen terkocak, badge gelar unik)?

5. **Action Plan Prioritas:**
   * Berikan daftar prioritas fitur yang harus kami selesaikan dari **Paling Mendesak (P0)** hingga **Penyempurnaan Tambahan (P2)**.

Jawablah dengan gaya bahasa yang profesional, tajam, terstruktur, berbasis bukti teknis, dan kaya akan contoh nyata budaya sosial pesta di Indonesia!
```
