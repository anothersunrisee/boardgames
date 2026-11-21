# MASTER PROMPT: SYSTEM AUDIT & ARCHITECTURE REVIEW
## Universal Public Party Games Web Platform (PartyHub Indonesia)
> **Instruksi Penggunaan:** Salin seluruh isi teks di dalam blok kode markdown di bawah ini ke **Gemini (Neon High / Advanced / Pro)** untuk mendapatkan analisis arsitektur, penyempurnaan UI/UX, dan validasi logika gameplay menyeluruh.

---

```markdown
# SYSTEM PROMPT: SENIOR GAME DESIGNER & FULL-STACK PRODUCT ARCHITECT

Halo Gemini! Kamu bertindak sebagai:
1. **Lead Game Designer & Social Mechanics Specialist:** Ahli perancang game pesta kasual (seperti Jackbox Games, Kahoot, Codenames, Heads Up!) dengan pemahaman mendalam tentang dinamika interaksi sosial tongkrongan dan gathering di Indonesia.
2. **Staff Frontend Architect:** Ahli arsitektur React 19, Vite 8, TypeScript, Tailwind CSS, Zustand, Firebase Realtime Database (WebSockets), Web Audio API, serta optimasi performa dan PWA.
3. **UX & Inclusivity Strategist:** Ahli memastikan sebuah produk dapat dimainkan dengan sangat natural dan nyaman oleh **SEMUA KALANGAN** — mulai dari tongkrongan anak muda, rekan kantor (corporate ice breaking), keluarga lintas generasi (anak-anak s/d kakek-nenek), hingga mahasiswa dan komunitas.

---

## 🎯 1. KONSEP & VISI PRODUK: PARTYHUB INDONESIA

Kami sedang membangun **Platform Web Party Games Universal: PartyHub Indonesia**.
* **Format Hybrid Inovatif (Shared-Screen Host + Mobile Controller):**
  1. *Layar TV / Proyektor Host:* 1 Layar utama di laptop/tablet/TV yang menampilkan teks soal raksasa, hitungan mundur timer dramatis, ringkasan perdebatan, dan leaderboard skor.
  2. *Controller HP Pemain (/join & /play):* Pemain di ruangan dapat memindai Kode QR di layar TV menggunakan kamera smartphone mereka untuk bergabung secara instan tanpa registrasi, tanpa login, dan tanpa unduh aplikasi Play Store. HP otomatis menjadi gamepad realtime: mengunci jawaban Game 1, menampilkan kartu rahasia privat di Game 2 & 3, memberikan suara live voting di Game 4 & 6, dan memantau status estafet di Game 5.
  3. *Zero-Config 100% Offline Fallback:* Jika ruangan tidak ada internet atau baterai HP habis, seluruh game **tetap 100% dapat dimainkan** lewat 1 laptop Host menggunakan mode verbal, tebakan kertas, dan hitungan mundur serentak tiga detik.
* **Target Demografis (Semua Kalangan via Audience Vibe Filter):**
  * 🔥 **Tongkrongan (Full Chaos):** Pesta pemuda/mahasiswa. Seluruh bank data aktif 100%, debat absurd, sarkasme ringan, dan seluruh kartu hukuman receh.
  * 💼 **Kantor / Corporate (SFW):** Ramah rekan kerja dan atasan. Aman dari potensi pelecehan (*safe for work*), bebas topik SARA/politik praktis, diperkaya humor dunia kerja (WFO vs WFH, drama meeting WhatsApp), hukuman formal ala presenter berita.
  * 🏡 **Keluarga & Arisan (All-Ages):** Ramah anak-anak hingga orang tua. Bebas istilah teknis/slang, fokus pada topik rumah tangga, kuliner, peralatan dapur, dan nostalgia masa kecil.

---

## 🏗️ 2. ARSITEKTUR SISTEM & ALUR PERMAINAN (OUTGAME)

1. **Layar Onboarding & Slicing Canvas (`/`):**
   * Kanvas interaktif 60 FPS bergaya *Fruit Ninja*: maskot-maskot pesta 3D melayang dan meledak menjadi partikel konfeti warna-warni saat ditebas kursor katana atau swipe jari.
   * Efek audio sintetis Web Audio API (prosedural osilator, tanpa dependensi file mp3 eksternal).
   * Tombol besar **"START GAME ➔"** menuju ruang pendaftaran.
2. **Pendaftaran Pemain & Room Setup (`/room`):**
   * Host memberi nama ruangan (misal: *"Malam Minggu Asik"*).
   * **Kode Unik Room 4-Huruf Bahasa Indonesia:** Menghasilkan kata mudah diucapkan seperti `ASIK`, `SERU`, `KOST`, `NONG`, `RAME`, `WARG`.
   * **Generator QR Code Layar TV:** Pemain cukup scan QR di TV untuk langsung masuk ke `/join?code=XXXX`.
   * **Audience Vibe Filter:** Toggle memilih `🔥 Tongkrongan`, `💼 Kantor / SFW`, atau `🏡 Keluarga & Arisan`.
   * Pendaftaran 2 s/d 20 pemain: nama panggilan, alokasi gender (`👧 Cewek` / `👦 Cowok`), pemilihan avatar dari 10 karakter maskot 3D, dan Preset Cepat (6, 8, 10 pemain).
   * **Manajemen Dinamis Pemain:** Mendukung penambahan pemain baru yang telat datang (*Late Arrival*) dengan opsi saldo skor median/nol, serta penonaktifan pemain yang pulang duluan (*Dropout*) tanpa merusak game.
   * Data pemain otomatis tersimpan di `localStorage` melalui Zustand `persist` (`party_games_room_storage_v1`).
3. **Game Selection Hub (`/hub`):**
   * Bar Status Room: Nama room, strip avatar pemain, rasio gender, laci klasemen skor sementara, dan tombol loncat ke podium juara.
   * Katalog 6 Game Pesta Neo-Brutalist dengan modal onboarding 4 langkah (aturan main, sistem poin, hukuman, dan auto-start launcher).
4. **Panggung Juara, Hukuman, & Party Wrapped (`/room/podium`):**
   * Akumulasi skor perorangan dari seluruh mini-game.
   * Tangga podium juara 1, 2, dan 3 dengan hujan konfeti 60 FPS dan audio fanfare megah.
   * **Roulette Hukuman 3 Terbawah:** 3 Pemain dengan saldo skor terendah memutar kartu hukuman yang disesuaikan dengan Vibe Ruangan.
   * **Party Wrapped Superlatives:** Gelar otomatis (*The Ultimate MVP, The Mastermind, Chaos Gremlin, Sultan Hoki, Silent Carry*).
   * **1080x1920 Instagram Story Card Generator:** Render kanvas grafis resolusi tinggi siap dibagikan ke Instagram Story, status WhatsApp, atau grup keluarga.
5. **Host Utility Bar (Floating Action Bar):**
   * Mengambang di bagian bawah seluruh layar game: Tombol **Undo** (salah pencet/rollback), **Shuffle** (ganti soal/barang seketika), **Mute Audio**, **Fullscreen**, dan **Menu Utama**.

---

## 🎮 3. DEEP DIVE 6 MINI-GAME INGAME

### 🟢 Game 01: Same Brain? NO! (Asosiasi Kata Divergen Anti-Kembar)
* **Pemain:** 2 – 20 Orang (Free-For-All).
* **Mekanik:** Host membacakan 1 pertanyaan keseharian Indonesia (tersedia 50 pertanyaan terkurasi). Timer 30 detik berjalan.
  * *Mode Verbal:* Saat hitungan *"Satu... Dua... Tiga!"*, seluruh pemain meneriakkan 1 kata serentak di detik yang sama.
  * *Mode HP:* Pemain mengetik 1 jawaban di HP Controller dan menguncinya. Saat waktu habis, seluruh jawaban muncul otomatis di grid layar TV.
* **Scoring:** Jawaban Unik = **+2 Poin**. Jawaban Kembar / Sama dengan orang lain = **-1 Poin Penalti**. Blank / Diam = **-1 Poin**.
* **Durasi:** 10 Ronde berturut-turut.

### 🔴 Game 02: Beauty Expert?! (Interogasi Skincare & Kosmetik)
* **Pemain:** Sang Penjaga Rahasia vs Skuad Detektif Penebak (Cewek vs Cowok atau Mode Detektif Netral).
* **Mekanik:** 1 Orang memegang nama produk kecantikan rahasia (68 item + sinonim alias). Penebak diberi waktu 60 detik untuk mengajukan pertanyaan interogasi verbal bebas. Penjaga rahasia HANYA BOLEH menjawab *"YA"*, *"TIDAK"*, atau *"BISA JADI"* (maksimal 2x per ronde).
* **Cara Menebak:** Penebak mengetik di HP Controller (muncul live di TV) atau menulis di kertas (Mode Layar TV).
* **Validasi Cerdas:** Menggunakan Fuzzy Matching (Levenshtein distance $\le 2$ + database alias) + Tombol **Host Override `[✓ Benar]` / `[✗ Salah]`**.
* **Scoring:** Penebak berhasil tebak benar = **+5 Pts Individu / +2 Pts Tim**. Penjaga rahasia sukses mengelabui lawan = **+4 Pts Individu / +2 Pts Tim**. Penjaga rahasia ketebak = **-1 Pt Penalti**.

### 🔵 Game 03: Boys Stuff, Girls Guess! (Interogasi Hobi Cowok / Alat Rumah)
* **Pemain:** Sang Penjaga Rahasia vs Skuad Detektif Penebak (Cowok vs Cewek atau Mode Detektif Netral).
* **Mekanik:** Kebalikan simetris Game 02. Kata rahasia diambil dari 5 kategori hobi cowok: *Sparepart Motor, Perkakas Tukang, Game & Rental PS, Olahraga & Gym, dan Pesepakbola Legendaris* (ditambah 35 item *Peralatan Dapur & Rumah Tangga* untuk mode keluarga).
* **Scoring & Aturan:** Sama persis dengan Game 02 (+5 penebak, +2 tim, -1 jika ketebak).

### 🟠 Game 04: The Devil's Advocate (Debat Kocak 2v2 + Chaos Card)
* **Pemain:** Tim 2 vs 2 (Duo PRO vs Duo KONTRA).
* **Mekanik:** Sistem mengundi 4 pemain menjadi dua tim duo dan memberikan 1 mosi debat absurd (misal: *"Tukang parkir minimarket wajib diangkat jadi pegawai BUMN"*). Masing-masing tim juga dibebani **Chaos Card** (kondisi akting wajib: gaya motivator MLM, gaya sinetron azab, suara rocker serak, gaya intel berbisik).
* **Timeline 8 Tahap:** Persiapan (15s) $\rightarrow$ Opening PRO (30s) $\rightarrow$ Opening KONTRA (30s) $\rightarrow$ Rebuttal PRO (20s) $\rightarrow$ Rebuttal KONTRA (20s) $\rightarrow$ Final PRO (10s) $\rightarrow$ Final KONTRA (10s) $\rightarrow$ Live Audience Voting.
* **Mekanik Anti Free-Rider (Lonceng Tag-Team):** Lonceng otomatis berbunyi di detik ke-15 (Opening) dan detik ke-10 (Rebuttal) mewajibkan oper mic ke partner setim.
* **Scoring:** Duo Menang Vote = **+8 Pts tiap orang**. Duo Kalah Vote = **+2 Pts konsolasi**. Eksekusi Chaos Card Terbaik = **+2 Pts bonus**. Seri = **+4 Pts masing-masing**.

### 🟣 Game 05: Chain Quiz Relay! (Cerdas Cermat Berantai 16 Soal Estafet)
* **Pemain:** Tim 3–4 Orang.
* **Mekanik:** 1 Tim maju ke depan panggung dan menyelesaikan **4 Ronde Berurutan (1 Ronde = 4 Soal Estafet, Total 16 Soal berturut-turut)** tanpa diselingi tim lain. Pertanyaan dijawab bergiliran orang per orang dengan countdown kilat 15 detik.
* **Hukuman Komedi Fisik:** Jika ada anggota yang SALAH MENJAWAB: terkena penalti **-2 Poin individu** dan mendapat **KARTU TANTANGAN KONYOL YANG WAJIB DIJALANKAN SAMPAI RONDE KE-4 SELESAI!** (Berdiri 1 kaki, bicara gaya robot, tepuk tangan terus, dll.). Tantangan bersifat kumulatif jika salah berkali-kali.
* **Scoring:** Lolos ronde (min. 3/4 benar) = **+2 Poin tim** (maksimal `+8 Pts`). Sapu bersih sempurna 16/16 benar (0 salah) = **Bonus Jackpot Ekstra +2 Poin** sehingga masing-masing anggota mengantongi **10 Poin Penuh**.
* **Bank Soal:** 450 soal pilihan 9 kategori (Sejarah, IPA, IPS, Kuliner, Biologi, Geografi, Matematika, Olahraga, Fakta Unik).

### 🟢 Game 06: Sell Me This Trash! (Duel Pitching Sales 2v2 Barang Rongsokan)
* **Pemain:** Tim Sales 2 vs 2.
* **Mekanik:** Dua tim ditantang menjual 1 barang rongsokan cacat (Sandal Swallow beda ukuran, Tutup Tupperware tanpa wadah, Flashdisk karatan) kepada 1 profil target pembeli absurd (CEO Startup, Alien, Emak-Emak Arisan).
* **Tahapan:** Persiapan (15s) $\rightarrow$ Pitching Sales A (45s, lonceng oper mic di detik 22) $\rightarrow$ Pitching Sales B (45s, lonceng oper mic di detik 22) $\rightarrow$ Voting Pembeli/Audiens via HP atau TV.
* **Scoring:** Tim Menang = **+8 Pts tiap orang**. Tim Kalah = **+2 Pts** + **WAJIB MEMUTAR ROULETTE HUKUMAN KELOMPOK!**.

---

## 🔍 4. PERTANYAAN & TUGAS SPESIFIK UNTUK GEMINI NEON HIGH

Tolong berikan evaluasi mendalam, kritis, dan berbasis arsitektur game profesional terhadap spesifikasi di atas:

### 1. Evaluasi Universalitas & Kalibrasi Audience Vibe Filter
* Apakah kurasi konten 3 mode (Tongkrongan, Kantor SFW, Keluarga & Arisan) sudah cukup untuk mencegah momen canggung (*cringe*) atau pelanggaran norma sosial di Indonesia?
* Bagaimana skenario penanganan jika ada pemain anak-anak (usia 8–12 tahun) yang bermain bersama kakek-neneknya (usia 60+ tahun) di Game 2 & Game 3?

### 2. Audit Matematika Skor, Keseimbangan Poin, & Celah Eksploitasi (Loopholes)
* Bandingkan perolehan poin lintas mini-game: Game 1 (10 ronde, unik `+2`, kembar `-1`), Game 2 & 3 (`+5`/`+4`), Game 4 & 6 (`+8`/`+2`), dan Game 5 (`+8` s/d `+10` jackpot). Apakah ada mini-game tertentu yang terlalu mendominasi klasemen Room Podium?
* Analisis celah eksploitasi: Bagaimana mencegah situasi di mana pemain di Game 4 & Game 6 sengaja bersepakat (*collusion*) membagi vote 50:50 agar keduanya dapat `+4 Pts` tanpa bersaing sehat?
* Apakah penalti `-2 Pts` dan kartu tantangan di Game 5 sudah cukup menghibur tanpa merusak motivasi pemain yang kurang jago trivia?

### 3. Simulasi Kasus Ekstrem ("Kalau Begini Bagaimana, Kalau Begitu Bagaimana")
* **Kasus A (Pemain Tiba-tiba Menolak Hukuman):** Apa yang harus dilakukan sistem atau Host jika pemain di posisi 3 terbawah menolak melakukan roulette hukuman karena malu atau cemas sosial?
* **Kasus B (Koneksi HP Terputus di Detik Voting G4/G6):** Bagaimana sistem WebSocket Firebase menangani jika 2 dari 6 pemain HP-nya mendadak disconnect saat jendela voting 15 detik dibuka?
* **Kasus C (Ketimpangan Rasio Gender Parah di G2/G3):** Jika di room ada 9 cowok dan hanya 1 cewek (atau 9 cewek dan 1 cowok), bagaimana rotasi peran agar orang tunggal tersebut tidak kelelahan (*burnout*) menjadi penjaga rahasia terus-menerus?

### 4. Rekomendasi Fitur Viralitas & Post-Game Retention
* Selain Instagram Story Card 1080x1920 yang sudah dibuat, apa mekanik sosial (*social hooks*) tambahan yang bisa memicu pemain memotret layar TV dan mengajak teman-teman di kantor atau tongkrongan lain untuk ikut bermain?
* Apakah ada ide mini-game ke-7 yang sangat cocok melengkapi katalog game pesta di Indonesia?

Jawablah dengan gaya bahasa yang profesional, tajam, terstruktur, berbasis analisis produk kelas dunia, dan kaya akan konteks budaya sosial masyarakat Indonesia!
```
