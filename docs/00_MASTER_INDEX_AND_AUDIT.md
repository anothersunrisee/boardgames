# PARTYHUB INDONESIA — ARSITEKTUR SISTEM, MASTER INDEX & AUDIT GO-PUBLIC
> Dokumen Spesifikasi Menyeluruh untuk Review Sistem & Pengujian Model AI (Gemini Neon High)  
> Tanggal Penyusunan: 21 November 2026 | Versi: 1.0 Production Readiness Candidate  
> Posisi Produk: Platform Game Pesta Luring Universal untuk Semua Kalangan (Tongkrongan, Kantor/Corporate, Keluarga & Arisan, Komunitas)

---

## 📌 1. EXECUTIVE SUMMARY & ARSITEKTUR PLATFORM

**PartyHub Indonesia** adalah aplikasi web permainan pesta luring (*offline casual party games*) berbasis **Hybrid Shared-Screen & Mobile Controller Architecture**:
* **Layar Utama (Host Screen):** Berjalan di laptop/tablet/TV proyektor ruang tengah yang dipandu oleh seorang Host, menampilkan teks soal raksasa, countdown timer dramatis, panggung perdebatan, dan leaderboard skor.
* **Controller HP Pemain (Player Controller):** Pemain dapat bergabung dengan cepat cukup memindai Kode QR di layar TV menuju URL `/join?code=XXXX`. HP pemain otomatis bertransformasi menjadi *gamepad* interaktif: mengunci jawaban Game 1, menampilkan kartu rahasia privat di Game 2 & 3, memberikan suara live voting di Game 4 & 6, dan menerima peringatan kartu tantangan di Game 5.
* **100% Zero-Tech Offline Fallback:** Jika tidak ada koneksi internet di lokasi pesta, seluruh game **tetap dapat dimainkan 100% menggunakan 1 laptop Host** dengan mode verbal, tebakan kertas, dan hitungan serentak tiga detik.

Aplikasi ini diposisikan untuk **SEMUA KALANGAN** masyarakat Indonesia melalui sistem **Audience Vibe Filter**:
1. *Tongkrongan Pemuda / Mahasiswa:* Adu argumen cepat, adu tebak kata, dan hukuman receh pemecah tawa.
2. *Kantor / Corporate Gathering:* Ice-breaking dan team building aman (*safe for work*), bebas pelecehan atau materi tidak senonoh.
3. *Keluarga & Arisan Lintas Generasi:* Mudah dipahami oleh kakek-nenek, orang tua, remaja, hingga anak-anak tanpa mekanik gamer rumit.
4. *Komunitas & Reuni:* Cukup 1 klik tanpa login, tanpa registrasi akun, tanpa unduh aplikasi native di Play Store/App Store.

---

## 🗂️ 2. DAFTAR DOKUMEN SPESIFIKASI LENGKAP (MASTER SITEMAP)

Dokumen ini dipecah menjadi modul-modul spesifikasi terperinci yang siap dianalisis oleh Gemini Neon High:

| File Spesifikasi | Deskripsi & Cakupan Lengkap |
| :--- | :--- |
| **`00_MASTER_INDEX_AND_AUDIT.md`** | Dokumen ini. Arsitektur hybrid, temuan audit kritis, dan data flow global. |
| **`01_OUTGAME_SYSTEMS.md`** | Onboarding Fruit Ninja, Setup Room & QR Code, Vibe Filter, Mobile Controller, Hub, Podium, Story Card 1080x1920. |
| **`02_GAME1_SAME_BRAIN_NO.md`** | Game 01: *Same Brain? NO!* (Asosiasi kata divergen anti-kembar, 10 ronde, 50 soal relate Indonesia). |
| **`03_GAME2_BEAUTY_EXPERT.md`** | Game 02: *Beauty Expert?!* (Interogasi produk skincare/makeup atau alat dapur, fuzzy match, Host Override). |
| **`04_GAME3_BOYS_STUFF_GIRLS_GUESS.md`** | Game 03: *Boys Stuff, Girls Guess!* (Interogasi sparepart motor, perkakas, game PS, atlet tenar, Host Override). |
| **`05_GAME4_THE_DEVILS_ADVOCATE.md`** | Game 04: *The Devil's Advocate* (Debat kocak 2v2 Duo PRO vs KONTRA + Kartu Gangguan Chaos Card + Live Audience Voting). |
| **`06_GAME5_CHAIN_QUIZ_RELAY.md`** | Game 05: *Chain Quiz Relay* (Turnamen cerdas cermat 4 ronde x 4 soal = 16 soal estafet + kartu tantangan aktif hingga ronde 4). |
| **`07_GAME6_SELL_ME_THIS_TRASH.md`** | Game 06: *Sell Me This Trash!* (Duel pitching sales 2v2 barang rongsokan ke pembeli absurd + live buyer voting). |
| **`08_TECHNICAL_SPEC_AND_ROADMAP.md`** | Spesifikasi teknis React 19, Vite 8, TypeScript 5.8, Zustand persist, Firebase RTDB, optimasi bundle <275 kB. |

---

## 🚨 3. REKAP STATUS SELF-AUDIT: SOLUSI YANG TELAH DITERAPKAN

Berikut adalah status penyelesaian dari temuan audit fungsional yang telah diimplementasikan:

1. **Perbaikan Bug Setup Legacy:**
   * *Status:* ✅ SELESAI. Halaman setup legacy (`G1Setup`, `G2Setup`, `G3Setup`, `G4Setup`) tidak lagi menimpa pemain asli room dengan mock data. Roster pemain, avatar, dan akumulasi skor room terjaga 100%.
2. **Validasi Jawaban Kaku & Host Override (Game 2 & 3):**
   * *Status:* ✅ SELESAI. Sistem dilengkapi `isFuzzyMatch()` yang menoleransi typo (Levenshtein distance $\le 2$) dan mengenali 30+ sinonim alias. Ditambah tombol **Host Override `[✓ Benar]` / `[✗ Salah]`** di layar Reveal.
3. **Celah Kabel HDMI Pass-the-Device di Layar TV:**
   * *Status:* ✅ SELESAI. Disediakan toggle *"Mode Layar TV / Kertas"* di Game 2 & 3, sehingga penebak menulis di kertas/notes HP tanpa mengoper laptop Host.
4. **Ekspansi Bank Konten Skincare & Peralatan Dapur:**
   * *Status:* ✅ SELESAI. `game2-items.ts` diperluas menjadi 68 item kosmetik, ditambah bank data 35 peralatan dapur dan rumah tangga (`pack-home-kitchen.ts`) untuk keluarga dan arisan.
5. **Inklusivitas Single-Gender:**
   * *Status:* ✅ SELESAI. Pada kelompok 100% cowok atau 100% cewek, sistem membagi 50:50 secara dinamis dan mengubah label menjadi *"Sang Penjaga Rahasia / Insider"* vs *"Skuad Detektif"*.
6. **Tensi Waktu Game 5 (16 Soal Estafet):**
   * *Status:* ✅ SELESAI. Ditambahkan countdown timer 15 detik otomatis per soal dengan audio ticking dramatis, tombol pause/resume, dan penumpukan kartu tantangan fisik.
7. **Hybrid Multi-Device Architecture (Option 3):**
   * *Status:* ✅ SELESAI. Host menampilkan QR Code di TV, pemain membuka `/join` dan `/play` untuk mengunci jawaban, melihat kartu rahasia privat, dan melakukan live voting via WebSockets.
8. **Virality & Social Sharing (Party Wrapped & Story Card):**
   * *Status:* ✅ SELESAI. Ditambahkan sistem gelar Superlative (MVP, Mastermind, Gremlin, Sultan Hoki) dan generator 1080x1920 PNG Story Card langsung dari browser.
9. **Optimasi Bundle & Code Splitting:**
   * *Status:* ✅ SELESAI. Rute dibungkus dengan `React.lazy()` + `<Suspense>`, ukuran chunk awal turun drastis ke <275 kB. Build verifikasi lulus 100% (`✓ built in 3.41s`).

---

## 🔄 4. STRUKTUR GLOBAL STATE (ZUSTAND STORE)

State utama tersimpan di `src/store/useGameStore.ts` dan dipersistensi ke `localStorage` (`party_games_room_storage_v1`):

```typescript
interface GameStore {
  // ── Global Room & Roster ──
  roomCreated: boolean;
  roomName: string;
  roomCode: string; // 4 Huruf kata unik (misal: "ASIK", "SERU")
  roomVibe: RoomVibe; // 'tongkrongan' | 'office' | 'family'
  players: Player[]; // { id, name, gender, kubu, score, avatarId, status, joinedLate }
  
  // ── Manajemen Dinamis Pemain ──
  addLatePlayer: (name: string, gender: Gender, kubu: string, scoreMode?: 'zero' | 'median' | 'lowest') => void;
  deactivatePlayer: (playerId: string) => void;
  addScore: (playerId: string, points: number) => void;
  resetRoomScores: () => void;

  // ── Auto Game Launchers (Sistem Mengacak Otomatis) ──
  autoStartGame1: () => boolean;
  autoStartGame2: () => { success: boolean; message?: string };
  autoStartGame3: () => { success: boolean; message?: string };
  autoStartGame4: () => { success: boolean; message?: string };
  autoStartGame5: () => { success: boolean; message?: string };
  autoStartGame6: () => { success: boolean; message?: string };

  // ── Game 1: Same Brain? NO! ──
  g1Rounds: G1Round[];
  g1CurrentRound: number; // 1 s/d 10
  g1UsedCategoryIds: number[];

  // ── Game 2: Beauty Expert?! ──
  g2GirlPlayers: Player[];
  g2BoyPlayers: Player[];
  g2Slots: G2GirlSlot[];
  g2CurrentSlotIndex: number;
  g2GirlWins: number;
  g2BoyWins: number;

  // ── Game 3: Boys Stuff, Girls Guess! ──
  g3BoyPlayers: Player[];
  g3GirlPlayers: Player[];
  g3Slots: G3BoySlot[];
  g3CurrentSlotIndex: number;
  g3BoyWins: number;
  g3GirlWins: number;

  // ── Game 4: The Devil's Advocate (2v2) ──
  g4Players: Player[];
  g4Matches: DebateMatch[];
  g4CurrentMatchIndex: number;
  g4EnableChaos: boolean;

  // ── Game 5: Chain Quiz Relay (4 Ronde x 4 Soal = 16 Soal) ──
  g5Teams: G5Team[];
  g5CurrentTeamIndex: number;
  g5UsedQuestionIds: number[];

  // ── Game 6: Sell Me This Trash! (2v2 Pitch) ──
  g6Matches: G6Match[];
  g6CurrentMatchIndex: number;
}
```
