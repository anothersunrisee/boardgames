# NIRANTARA PARTYGAMES — SPESIFIKASI TEKNIS & ROADMAP PRODUKSI
> Dokumen Implementasi Teknis, State Tree, Optimasi PWA, SEO & Action Plan  
> Target Pembaca: Developer, Reviewer Sistem & Model AI (Gemini Neon High)

---

## 🛠️ 1. STACK TEKNOLOGI UTAMA

* **Core Framework:** React 19 (`react`, `react-dom`, `react-router-dom` v7).
* **Build Tooling:** Vite v8.3.8 (Transpile super cepat dengan Rolldown/ESBuild, HMR <50ms).
* **Bahasa & Type Safety:** TypeScript 5.8 (Strict mode aktif, no any siluman).
* **Styling & Design System:** Tailwind CSS v4 (`@tailwindcss/vite`), Custom CSS variables, Neo-brutalist solid offset shadows.
* **State Management:** Zustand v5 dengan middleware `persist` (`createJSONStorage` ke browser `localStorage`).
* **Motion & Animation:** Framer Motion (Transisi layout, pop animation, spring physics).
* **Iconography & Visual Assets:** Lucide React + Microsoft Fluent Emoji Web Fonts (Cross-platform 3D Modern Emoji).
* **Audio Synthesis:** Web Audio API Procedural Oscillators (`AudioContext`, Sine/Sawtooth/Triangle procedural synthesis).
* **Canvas Simulation:** HTML5 Canvas 2D (Simulasi 60 FPS partikel ledakan maskot & confetti shower).

---

## 🌳 2. PETA ARSITEKTUR DIREKTORI (`src/`)

```
src/
├── assets-library/          # Tipe data, karakter maskot, data edukasi onboarding
│   ├── characters.ts        # Katalog 10 profil maskot karakter (c01 s/d c10)
│   ├── gameOnboardingData.ts # Data aturan main, langkah, & sistem poin modal 6 game
│   ├── punishments.ts       # Bank 10+ kartu hukuman pesta
│   └── soundEngine.ts       # Mesin audio Web Audio API
├── components/              # Komponen antarmuka modular
│   ├── characters/          # Avatar profil, GameMascotBot, PlayerProfileAvatar
│   ├── layout/              # GameDesktopLayout (kerangka responsif desktop/TV/mobile)
│   ├── modals/              # GameOnboardingModal, AvatarPickerModal, ScoreModal
│   ├── motion/              # ConcentricRoomTransition, ConfettiShower
│   ├── ui/                  # Button, Card, BlobMascot, FluentEmoji, CustomGameCursor
│   ├── HostUtilityBar.tsx   # Floating bar kendali host (Undo, Shuffle, Mute, Hub)
│   ├── PassDeviceModal.tsx  # Modal privasi oper HP
│   └── PunishmentModal.tsx  # Modal kartu hukuman & tombol acak ulang
├── data/                    # Bank data konten & pertanyaan (Anti-AI Slop)
│   ├── game1-categories.ts  # 50 Pertanyaan relate Indonesia Same Brain
│   ├── game2-items.ts       # Bank nama kosmetik & skincare Beauty Expert
│   ├── game3-words.ts       # 5 Kategori kata rahasia cowok (sparepart, perkakas, game, atlet)
│   ├── game4-topics.ts      # Topik debat absurd 2v2 & kartu Chaos
│   ├── game5-questions.ts   # 450 Soal trivia 9 kategori cerdas cermat estafet
│   └── game6-pitches.ts     # Barang rongsokan & pembeli absurd 2v2
├── pages/                   # Halaman rute aplikasi
│   ├── Onboarding.tsx       # Landing page kanvas tebas maskot Fruit Ninja
│   ├── RoomSetup.tsx        # Pendaftaran pemain, gender, avatar, & preset
│   ├── Home.tsx             # Game Selection Hub
│   ├── RoomPodium.tsx       # Panggung juara room & hukuman 3 terbawah
│   ├── game1/               # G1Setup, G1Round, G1Reveal, G1Results
│   ├── game2/               # G2Setup, G2Secret, G2QnA, G2Guess, G2Reveal, G2Results
│   ├── game3/               # G3Setup, G3Secret, G3QnA, G3Guess, G3Reveal, G3Results
│   ├── game4/               # G4Setup, G4Match, G4RoundResult, G4Results
│   ├── game5/               # G5Setup, G5Play (16 soal estafet), G5Results
│   └── game6/               # G6Match (pitching 2v2), G6Results
├── store/
│   └── useGameStore.ts      # State utama Zustand + LocalStorage
└── utils/
    └── sound.ts             # Wrapper sound effects synthesizer
```

---

## 📋 3. PRODUCTION READINESS CHECKLIST (ROADMAP GO-PUBLIC)

Berikut adalah checklist tugas teknis sebelum aplikasi diluncurkan ke domain publik:

### 🔴 Tahap 1: Perbaikan Kritis Logika & Gameplay (Prioritas 1)
- [ ] **Sinkronisasi Setup Legacy ke Room Roster:**
  Ubah `G1Setup`, `G2Setup`, `G3Setup`, dan `G4Setup` agar otomatis mendeteksi `players` dari Room. Hentikan pemanggilan `setPlayers()` dengan array mock statis agar skor dan avatar pemain asli tidak hilang.
- [ ] **Tombol Host Override di Layar Reveal (Game 2 & Game 3):**
  Di `G2Reveal.tsx` dan `G3Reveal.tsx`, tambahkan tombol toggle `[✓ Benar]` dan `[✗ Salah]` di setiap kartu tebakan pemain agar Host dapat mengoreksi typo atau sinonim secara sah.
- [ ] **Ekspansi Bank Konten Game 2 (Beauty Expert):**
  Perkaya `game2-items.ts` dari 26 item menjadi 60–80 produk mencakup Skincare, Makeup, Alat Rambut, dan Bodycare.
- [ ] **Label Dinamis Kubu Single-Gender:**
  Beri penamaan netral (*Kubu Pemegang Rahasia* vs *Kubu Penebak*) jika pemain di ruangan 100% cowok atau 100% cewek.

### 🟡 Tahap 2: Kenyamanan Host & Perlindungan Sesi (Prioritas 2)
- [ ] **Perlindungan `beforeunload`:**
  Pasang listener konfirmasi saat pertandingan sedang berjalan agar tab browser tidak sengaja tertutup atau ter-back.
- [ ] **Tombol Fullscreen di Host Utility Bar:**
  Sediakan satu tombol untuk mengaktifkan mode fullscreen browser (`document.documentElement.requestFullscreen()`) saat laptop dicolok ke TV/proyektor ruang tengah.
- [ ] **Fitur Tambah/Hapus Pemain di Tengah Sesi (Late Arrival / Dropout):**
  Sediakan drawer ringkas dari Host Bar untuk memasukkan teman yang baru datang terlambat tanpa harus me-reset turnamen.

### 🟢 Tahap 3: Optimasi Performa, SEO, & PWA (Prioritas 3)
- [ ] **Code Splitting dengan `React.lazy()`:**
  Bungkus seluruh rute halaman di `App.tsx` dengan lazy-loading dan `<Suspense>` agar ukuran bundle awal turun dari 1,005 kB ke <150 kB.
- [ ] **Perbaikan Title & Tag Open Graph di `index.html`:**
  Perbaiki glitch `â€”` pada title menjadi `Nirantara Partygames — Game Pesta Seru Bareng Teman`. Tambahkan meta tag `og:image`, `og:title`, dan `og:description` agar link share WhatsApp menampilkan banner preview yang menggoda.
- [ ] **File Web App Manifest (`site.webmanifest`):**
  Sediakan file manifest PWA agar pengguna smartphone atau tablet dapat menekan tombol *"Add to Home Screen"* dan menikmati aplikasi dalam mode native fullscreen tanpa address bar.
