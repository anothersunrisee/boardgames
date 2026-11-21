# 🎮 PartyHub Indonesia — Universal Hybrid Party Games Platform
> Platform Game Pesta Luring Universal untuk Semua Kalangan (Tongkrongan, Kantor/Corporate, Keluarga & Arisan, Komunitas)  
> Dibangun dengan **React 19 + TypeScript + Vite 8 + Tailwind CSS + Zustand + Firebase Realtime Database + Web Audio API**.

---

## 🌟 FITUR UTAMA

1. **Format Hybrid Inovatif (Shared-Screen Host + Mobile Controller):**
   * **Host di Layar TV / Proyektor:** Menampilkan soal raksasa, countdown timer 15s/30s/45s, panggung perdebatan, dan leaderboard juara.
   * **Controller HP Pemain (`/join` & `/play`):** Pemain scan Kode QR di TV untuk langsung masuk ke room tanpa download aplikasi dan tanpa registrasi akun. HP menjadi gamepad realtime untuk mengunci jawaban, melihat kartu rahasia privat, dan melakukan live voting.
   * **100% Zero-Tech Offline Fallback:** Jika tidak ada koneksi internet, seluruh game 100% dapat dimainkan di 1 laptop Host secara verbal dan manual.
2. **Audience Vibe Filter (Kurasi Konten Lintas Demografi):**
   * 🔥 **Tongkrongan (Full Chaos):** 100% bank data aktif, debat kocak, sarkasme receh, hukuman konyol.
   * 💼 **Kantor / Corporate (SFW):** Aman dari potensi pelecehan (*safe for work*), bebas materi sensitif/SARA, humor dunia kerja.
   * 🏡 **Keluarga & Arisan (All-Ages):** Ramah anak-anak dan lansia, topik rumah tangga, bumbu dapur, nostalgia masa kecil.
3. **6 Game Pesta Seru:**
   * 🟢 **Game 01: Same Brain? NO!** (Asosiasi kata divergen anti-kembar, 10 ronde, 50 soal relate Indonesia).
   * 🔴 **Game 02: Beauty Expert?!** (Interogasi produk skincare/kosmetik, fuzzy match, Host Override).
   * 🔵 **Game 03: Boys Stuff, Girls Guess!** (Interogasi sparepart motor, perkakas, game PS, atlet tenar, atau alat dapur).
   * 🟠 **Game 04: The Devil's Advocate** (Debat kocak 2v2 Duo PRO vs KONTRA + Kartu Gangguan Chaos Card).
   * 🟣 **Game 05: Chain Quiz Relay!** (Turnamen cerdas cermat 4 ronde x 4 soal = 16 soal estafet + kartu tantangan aktif).
   * 🟢 **Game 06: Sell Me This Trash!** (Duel pitching sales 2v2 barang rongsokan ke pembeli absurd).
4. **Post-Game Virality Loop:**
   * Tangga Podium Juara 1, 2, 3 dengan hujan konfeti 60 FPS.
   * Roulette Hukuman 3 Terbawah (*Punishment Modal*).
   * Party Wrapped Superlatives (*MVP, Mastermind, Gremlin, Sultan Hoki, Silent Carry*).
   * **1080x1920 Instagram Story Card Generator:** Render kanvas PNG siap bagikan ke Instagram Story atau WhatsApp.

---

## 📁 DOKUMENTASI SPESIFIKASI LENGKAP (`docs/`)

Seluruh sistem telah didokumentasikan secara mendalam di folder `docs/`:

* [`docs/00_MASTER_INDEX_AND_AUDIT.md`](file:///d:/Freelance/2026/boardgames/docs/00_MASTER_INDEX_AND_AUDIT.md): Arsitektur global, status self-audit, data flow, dan Zustand state tree.
* [`docs/01_OUTGAME_SYSTEMS.md`](file:///d:/Freelance/2026/boardgames/docs/01_OUTGAME_SYSTEMS.md): Onboarding Fruit Ninja, Setup Room & QR Code, Vibe Filter, Mobile Controller, Hub, Podium, & Sound Engine.
* [`docs/02_GAME1_SAME_BRAIN_NO.md`](file:///d:/Freelance/2026/boardgames/docs/02_GAME1_SAME_BRAIN_NO.md): Spesifikasi lengkap Game 1 (UI, logika, skor, edge cases, 50 soal).
* [`docs/03_GAME2_BEAUTY_EXPERT.md`](file:///d:/Freelance/2026/boardgames/docs/03_GAME2_BEAUTY_EXPERT.md): Spesifikasi lengkap Game 2 (UI, logika, fuzzy matching, Host Override, 68 item kosmetik).
* [`docs/04_GAME3_BOYS_STUFF_GIRLS_GUESS.md`](file:///d:/Freelance/2026/boardgames/docs/04_GAME3_BOYS_STUFF_GIRLS_GUESS.md): Spesifikasi lengkap Game 3 (UI, logika, 5 kategori hobi cowok + 35 alat dapur keluarga).
* [`docs/05_GAME4_THE_DEVILS_ADVOCATE.md`](file:///d:/Freelance/2026/boardgames/docs/05_GAME4_THE_DEVILS_ADVOCATE.md): Spesifikasi lengkap Game 4 (UI, timeline 8 tahap, 2v2 debat, tag-team bell, Chaos Cards).
* [`docs/06_GAME5_CHAIN_QUIZ_RELAY.md`](file:///d:/Freelance/2026/boardgames/docs/06_GAME5_CHAIN_QUIZ_RELAY.md): Spesifikasi lengkap Game 5 (UI, 16 soal estafet, timer 15s, tantangan aktif kumulatif, 450 soal).
* [`docs/07_GAME6_SELL_ME_THIS_TRASH.md`](file:///d:/Freelance/2026/boardgames/docs/07_GAME6_SELL_ME_THIS_TRASH.md): Spesifikasi lengkap Game 6 (UI, pitching 2v2, 45s timer, buyer persona, voting live).
* [`docs/08_TECHNICAL_SPEC_AND_ROADMAP.md`](file:///d:/Freelance/2026/boardgames/docs/08_TECHNICAL_SPEC_AND_ROADMAP.md): Spesifikasi teknis, optimasi bundle <275 kB, PWA, dan status checklist.
* [`PROMPT_GEMINI_NEON_HIGH.md`](file:///d:/Freelance/2026/boardgames/PROMPT_GEMINI_NEON_HIGH.md): Master Prompt komprehensif siap salin ke **Gemini Neon High / Gemini Pro**.

---

## 🚀 MEMULAI PROYEK (GETTING STARTED)

### 1. Prasyarat
* Node.js v20+ atau v22+
* npm

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Lingkungan (Opsional untuk Realtime Mobile Controller)
Salin `.env.example` menjadi `.env` jika ingin menghubungkan proyek ke Firebase Realtime Database:
```bash
cp .env.example .env
```
*(Catatan: Aplikasi tetap berjalan 100% dalam mode offline jika variabel lingkungan Firebase tidak diisi).*

### 4. Menjalankan Server Pengembangan (Dev Server)
```bash
npm run dev
```
Buka browser di `http://localhost:5173`.

### 5. Membangun Proyek untuk Produksi (Production Build)
```bash
npm run build
```
Menghasilkan bundle teroptimasi di folder `dist/` dengan ukuran entry chunk <275 kB.
