# 🎮 MEGA PROMPT: PARTY GAMES WEB APP (HOST MODE & PRODUCTION POLISH)

> Gunakan prompt ini di **Gemini Argon** untuk melakukan audit, redesign, dan visual refinement pada aplikasi web **Party Games (Same Brain, Beauty Expert, Boys Stuff, The Devil's Advocate)** agar mencapai level kualitas *award-winning casual game UI* (Headspace/Nintendo Party Game aesthetic).

---

## 📌 PROJECT OVERVIEW & CONSTRAINTS

- **Jenis Aplikasi:** Offline / Local Party Game Web App (**HOST MODE / MC BOARD**).
- **Konsep Permainan:** 
  - **Satu HP untuk Host/MC** ditaruh di tengah meja.
  - Semua pemain lainnya bermain live secara verbal atau menulis jawaban di HP/kertas masing-masing (tanpa perlu oper-operan HP yang ribet).
  - Host mengontrol timer 30 detik, membukakan kartu rahasia, dan langsung menilai skor dengan 1x klik.
- **Core Principle:** **ZERO DATABASE, ZERO LOGIN.** Seluruh state bersifat *in-memory* (menggunakan Zustand), reset otomatis setiap sesi baru.
- **Tech Stack:**
  - **Framework:** React 19 + Vite + TypeScript
  - **Styling:** Tailwind CSS v4 + Custom Theme Design Tokens
  - **Animation:** Framer Motion (Transisi kartu spring, bounce, timer pulse, status pill switch)
  - **Typography:** `Fredoka` (Display/Headings/Buttons/Scores) + `Plus Jakarta Sans` (Body/Labels)
  - **Target Device:** Mobile-first (375px–430px) hingga Tablet/Desktop (768px–1280px) untuk ditaruh di meja atau layar TV saat kumpul.

---

## 🎨 DESIGN SYSTEM & VISUAL WORLD (PLAYFUL GEOMETRIC MASCOT & PASTEL BENTO UI)

Aplikasi mengadopsi estetika **Warm Alabaster Cream & Playful Geometric Mascot UI** (terinspirasi dari *Headspace*, *Habitz*, *Cue*, dan *Grok Bot*):

### 1. Color Palette & Surface Tokens
- **Canvas Background:** `#FAF7F2` (Warm Alabaster Cream — bersih, ramah mata, tanpa dark background).
- **Secondary Surface:** `#F2ECE1` (untuk input field, container timer, dan pill taktil).
- **Primary Ink:** `#1E1E24` (Deep Charcoal untuk teks utama, badge status, dan tombol panah).
- **Full-Bleed Category Palettes:**
  - **Game 01 (Same Brain):** Card `#158467` (Emerald), Pill `#43B896`, Mascot `#5CE6C0`
  - **Game 02 (Beauty Expert):** Card `#C82373` (Berry Pink), Pill `#EC5FA0`, Mascot `#FF8AC2`
  - **Game 03 (Boys Stuff):** Card `#2568EF` (Cobalt Blue), Pill `#5B95FF`, Mascot `#7CC0FF`
  - **Game 04 (Devil's Advocate):** Card `#E85D2A` (Terracotta Orange), Pill `#FF8A5B`, Mascot `#FFB03A`
- **Semantic & Scoring Colors:**
  - Jawaban Unik / Berhasil Tebak: `#12B76A` (Mint Green)
  - Jawaban Kembar / Gagal Tebak: `#F04438` (Coral Red)

### 2. Custom SVG Geometric Mascots (`<BlobMascot />`)
- Karakter geometri kustom (bunga, scallop crown, heksagon, segitiga tanduk) dengan mata ekspresif dan aksesori unik.
- Maskot tampil rapi di tiap kartu dan tidak tertutup elemen tombol apapun.

---

## 🕹️ DETAIL 4 MINI-GAMES (HOST MODE FLOW)

### 1. 🧠 Game 01 — Same Brain? NO! (Unique Answer Challenge)
- **Host Mode:**
  - Host cukup input nama 3–15 pemain lalu tekan Mulai.
  - Muncul Kategori Soal besar dan jelas (misal: *"Sayuran berwarna hijau"*).
  - **Timer Hitung Mundur 30 Detik:**
    - Lingkaran timer taktil besar (`30s`), tombol Play/Pause/Reset (+10s).
    - Bunyi tick saat 5 detik terakhir dan buzzer saat waktu habis.
  - **Live Party Answering:** Semua pemain menulis 1 jawaban di HP masing-masing!
  - **Mode Scoring 1-Tap:**
    - Host dan pemain membacakan jawaban secara live.
    - Host tinggal klik kartu pemain yang jawabannya **KEMBAR / KALAH** (otomatis berubah jadi merah `Kembar 0 pt`). Pemain lainnya tetap hijau `Unik +1 pt`.
    - Tombol "Simpan Skor & Lanjut Ronde Berikutnya →" (hingga ronde 10 dan hasil juara).

---

### 2. 💄 Game 02 — Beauty Expert?! (Boys Guess Girls Things)
- **Host Mode Live:**
  - Host input 7 Cewek & 3 Cowok.
  - Setiap ronde giliran 1 Cewek.
  - **Fitur Intip Benda Rahasia:**
    - Tombol blur-lock *"👁️ Intip Benda Rahasia"* agar hanya cewek yang bersangkutan yang melihat benda skincare/makeup-nya.
  - **Live Verbal Interogasi:**
    - 3 Cowok bergantian mengajukan maksimal 2 pertanyaan verbal langsung ke cewek di ruangan.
  - **Host Verdict Buttons:**
    - **"🎉 KETEBAK!"** (+1 poin untuk tim cowok / cowok yang berhasil menebak).
    - **"❌ GAGAL TEBAK!"** (+1 poin bertahan untuk cewek).
  - Langsung update skor & lanjut ke cewek berikutnya!

---

### 3. 🔧 Game 03 — Boys Stuff, Girls Guess! (Girls Guess Boys Things)
- **Host Mode Live:**
  - Host input 3 Cowok & 7 Cewek, pilih kategori (Part Motor, Sepak Bola, Gaming, Otomotif, dll.).
  - Setiap ronde giliran 1 Cowok.
  - Tombol *"👁️ Intip Kata Rahasia"* hanya untuk cowok tersebut.
  - 7 Cewek mengajukan maksimal 2 pertanyaan verbal secara live di ruangan.
  - **Host Verdict Buttons:**
    - **"🎉 KETEBAK!"** (+1 poin untuk tim cewek / cewek penebak).
    - **"❌ GAGAL TEBAK!"** (+1 poin bertahan untuk cowok).
  - Langsung update skor & lanjut ke cowok berikutnya!

---

### 4. 😈 Game 04 — The Devil's Advocate (1 vs 1 Absurd Hot Takes)
- **Topik Debat Super Absurd, Kocak & Relatable Indonesia:**
  - *"Mas-mas tukang parkir depan Indomaret jauh lebih cocok gantiin Presiden daripada politisi."*
  - *"Bendahara kelas/kantor kita jauh lebih kompeten jadi Menteri Keuangan daripada menteri resmi."*
  - *"Besok kita semua wajib ke kampus / ke kantor gak usah pake celana (cuma boxer atau sarung)."*
  - *"Kalau ditilang polisi, pura-pura kesurupan macan putih adalah strategi bela diri yang sah dan bermartabat."*
  - *"Makan nasi Padang pake sendok garpu adalah tindak pidana yang pantas dihukum kurungan 5 tahun."*
  - *"Cowok yang teriak histeris pas lihat kecoa terbang wajib dicabut KTP dan hak suaranya seumur hidup."*
  - *"Teman yang minjam seratus ribu lalu menghilang sebenarnya malaikat yang sedang menguji keikhlasan hati kita."*
  - *"Tidur siang 4 jam di meja kerja adalah hak asasi manusia yang dijamin UUD 1945."*
  - *"Kucing oren sebenarnya adalah alien kiriman galaksi lain yang sedang memata-matai kebodohan manusia."*
- **Fitur CHAOS CARD:** Tantangan kocak acak saat debat (bicara gaya caleg, dilarang kata 'aku', wajib sebut kata 'CILOK', dll.).
- **Debate Timer & Audience Voting:** Digital timer per babak + voting audiens instan.
