# NIRANTARA PARTYGAMES — ARSITEKTUR SISTEM, MASTER INDEX & AUDIT GO-PUBLIC
> Dokumen Spesifikasi Menyeluruh untuk Review Sistem & Pengujian Model AI (Gemini Neon High)  
> Tanggal Penyusunan: 21 November 2026 | Versi: 1.0 Production Readiness Candidate

---

## 📌 1. EXECUTIVE SUMMARY & ARSITEKTUR PLATFORM

**Nirantara Partygames** adalah aplikasi web permainan pesta luring (*offline casual party games*) berbasis **Shared-Screen Host Mode** (1 layar utama di laptop/tablet/TV proyektor yang dipandu oleh seorang Host, dimainkan bersama oleh 2 hingga 20 orang dalam satu ruangan).

Aplikasi ini dibangun dengan prinsip:
1. **Zero Login / Zero Friction:** Pemain tidak perlu mengunduh aplikasi atau scan QR per orang untuk memulai. Cukup buka browser, atur nama room, pilih game, dan mainkan langsung.
2. **Neo-Brutalist Pop Aesthetics:** Mengombinasikan tipografi gemas (*Fredoka* display font + *Plus Jakarta Sans* body font), palet warna cerah bergaya pesta (*warm cream* `#FAF7F2`, *charcoal black* `#1E1E24`, aksen neon punchy), bayangan solid tebal (*drop-shadow offset* 4px–8px), serta **3D Microsoft Fluent Emoji** lintas platform.
3. **Sintetis Audio Prosedural (Web Audio API):** Suara SFX (*pop, tick, success fanfare, buzzer, whoosh*) di-sintesis secara matematis langsung di browser melalui osilator audio native tanpa dependensi file `.mp3` eksternal yang rawan gagal muat di jaringan seluler.
4. **State Persistence Lokal Terpadu:** Seluruh progres room, daftar anggota, avatar, akumulasi skor lintas mini-game, riwayat jawaban, serta kartu tantangan tersimpan otomatis di browser via Zustand + `localStorage` (`party_games_room_storage_v1`).

---

## 🗂️ 2. DAFTAR DOKUMEN SPESIFIKASI LENGKAP (MASTER SITEMAP)

Dokumen ini dipecah menjadi modul-modul spesifikasi terperinci:

| File Spesifikasi | Deskripsi & Cakupan |
| :--- | :--- |
| **`00_MASTER_INDEX_AND_AUDIT.md`** | Dokumen ini. Arsitektur, temuan audit kritis, dan data flow global. |
| **`01_OUTGAME_SYSTEMS.md`** | Onboarding Fruit Ninja, Setup Room & Avatar, Game Hub, Podium Juara Room, Sound Engine, Host Bar. |
| **`02_GAME1_SAME_BRAIN_NO.md`** | Game 01: *Same Brain? NO!* (Asosiasi kata divergen, 10 ronde, 50 soal relate Indonesia). |
| **`03_GAME2_BEAUTY_EXPERT.md`** | Game 02: *Beauty Expert?!* (Interogasi produk skincare/makeup cewek vs cowok, tebakan rahasia). |
| **`04_GAME3_BOYS_STUFF_GIRLS_GUESS.md`** | Game 03: *Boys Stuff, Girls Guess!* (Interogasi sparepart motor, perkakas, game PS, atlet tenar). |
| **`05_GAME4_THE_DEVILS_ADVOCATE.md`** | Game 04: *The Devil's Advocate* (Debat kocak 2v2 Duo PRO vs KONTRA + Chaos Card). |
| **`06_GAME5_CHAIN_QUIZ_RELAY.md`** | Game 05: *Chain Quiz Relay* (Turnamen cerdas cermat 4 ronde x 4 soal = 16 soal estafet + kartu tantangan aktif). |
| **`07_GAME6_SELL_ME_THIS_TRASH.md`** | Game 06: *Sell Me This Trash!* (Duel pitching sales 2v2 barang rongsokan ke pembeli absurd). |
| **`08_TECHNICAL_SPEC_AND_ROADMAP.md`** | Spesifikasi teknis React 19 + Vite 8, state tree Zustand, PWA, SEO/OpenGraph, dan checklist rilis. |

---

## 🚨 3. HASIL SELF-AUDIT MENYELURUH: TEMUAN KRITIS & STATUS PERBAIKAN

Berikut adalah daftar temuan audit fungsional dan logika (*edge cases*) yang wajib diperhatikan oleh developer dan model AI yang menganalisis sistem ini:

### ⚠️ A. Temuan Kritis Logika & Data Persistence

1. **Bug Roster Overwrite pada Halaman Setup Legacy (`/game1/setup`, `/game2/setup`, `/game3/setup`, `/game4/setup`)**
   * *Akar Masalah:* Sebelum sistem Room terpusat (`/room`) dibangun, tiap game memiliki form setup tersendiri dengan state lokal mock (`Dina, Bimo, Sari, Rian` di G1, `Alex, Budi, Citra` di G4). Jika pemain me-refresh browser di tengah game atau host kembali ke setup, form menampilkan pemain mock. Jika tombol "Mulai" ditekan, fungsi `setPlayers()` akan **menimpa seluruh pemain asli room dan mereset skor ke 0**.
   * *Status Solusi:* Halaman setup legacy harus diselaraskan: jika `players.length >= 2`, halaman wajib otomatis mengimpor `players` asli room dan menjaga ID, avatar, serta saldo skor mereka, atau langsung dialihkan (*redirect*) ke launcher otomatis (`autoStartGameX`).

2. **Pencocokan Jawaban Kaku (*Exact String Match*) di Game 2 & Game 3 Tanpa Tombol Override Host**
   * *Akar Masalah:* Tebakan pemain divalidasi dengan kode kaku:
     `correct: guess.toLowerCase().trim() === secret.toLowerCase().trim()`
     Jika benda adalah *"Penjepit Bulu Mata"* dan pemain menebak *"jepit bulu mata"*, *"penjepit bulumata"*, atau *"eyelash curler"*, sistem menilainya SALAH. Pada layar *Reveal*, skor otomatis diberikan di background tanpa ada tombol bagi Host untuk mengoreksi (*Host Override / Anulir Keputusan*).
   * *Status Solusi:* Wajib menambahkan tombol toggle **[Tandai Benar ✓]** dan **[Tandai Salah ✗]** di samping tebakan masing-masing pemain pada layar Reveal, sehingga Host bertindak sebagai juri sah di tongkrongan.

3. **Keterbatasan Jumlah Item Game 2 (Beauty Expert)**
   * *Akar Masalah:* Bank data `MAKEUP_ITEMS` di `game2-items.ts` hanya berisi **26 item**. Jika dimainkan oleh grup beranggotakan 6 cewek selama 3 sesi, item tebakan akan cepat habis dan terulang.
   * *Status Solusi:* Wajib diperluas menjadi 60–80 item dengan kategori yang mencakup Skincare, Makeup Wajah, Produk Bibir, Haircare, dan Alat Kecantikan.

4. **Kondisi Khusus: Grup 100% Cowok atau 100% Cewek di Game Gender (G2 & G3)**
   * *Akar Masalah:* Jika satu ruangan semuanya cowok (misalnya kumpul tim futsal/kantor pria) atau semuanya cewek, sistem `autoStart` sudah membagi pemain 50:50, namun label UI masih tertulis kaku: *"Cewek Pemegang Rahasia"* dan *"Para Cowok Menebak"*. Ini membuat separuh pemain cowok dipanggil "Cewek".
   * *Status Solusi:* Label UI harus bersifat dinamis: jika kubu diisi oleh pemain bergender sama, gunakan istilah netral seperti *"Tim Pemegang Rahasia"* dan *"Tim Penebak"*.

5. **Ketahanan Navigasi / Anti-Refresh Tidak Sengaja (`beforeunload`)**
   * *Akar Masalah:* Host yang tidak sengaja menekan tombol Back di mouse/trackpad atau me-refresh halaman dapat memutus alur stage yang sedang berjalan.
   * *Status Solusi:* Tambahkan event listener `beforeunload` saat sesi permainan aktif berlangsung: *"Game sedang berjalan! Yakin ingin keluar?"*.

6. **Penyusutan Bundle File JavaScript (Code-Splitting via `React.lazy`)**
   * *Akar Masalah:* Build Vite menghasilkan single file `index-BibCiehe.js` sebesar **1,005 kB** karena seluruh data 450 soal kuis, 6 halaman game, dan seluruh komponen diimpor secara sinkron di `App.tsx`.
   * *Status Solusi:* Bungkus rute game di `App.tsx` menggunakan `React.lazy()` dan `<Suspense>`, sehingga ukuran landing page turun drastis ke **<150 kB**.

7. **Metadata Sosial & PWA (Kesiapan Go-Public)**
   * *Akar Masalah:* `index.html` memiliki karakter glitch `Party Games â€” Playful Offline Mini Games` dan belum memiliki meta tag Open Graph (`og:image`, `og:title`, `og:description`). Jika tautan dibagikan ke WhatsApp atau media sosial, tidak muncul kartu pratinjau yang menarik.
   * *Status Solusi:* Perbaiki charset title, lengkapi Open Graph dan Twitter Cards, serta sertakan `manifest.webmanifest`.

---

## 🔄 4. STRUKTUR GLOBAL STATE (ZUSTAND STORE)

State utama tersimpan di `src/store/useGameStore.ts` dengan skema berikut:

```typescript
interface GameStore {
  // ── Global Room & Roster ──
  roomCreated: boolean;
  roomName: string;
  players: Player[]; // { id, name, gender, kubu, score, avatarId }
  
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
  g4Matches: DebateMatch[]; // { matchNumber, teamAIds, teamBIds, topic, chaosCardA, chaosCardB, votesA, votesB, winnerTeam }
  g4CurrentMatchIndex: number;
  g4EnableChaos: boolean;

  // ── Game 5: Chain Quiz Relay (4 Ronde x 4 Soal = 16 Soal) ──
  g5Teams: G5Team[]; // { id, name, memberIds, questions[16], currentGlobalQuestionIdx, currentRoundIdx, successfulRoundsCount, activeChallenges, roundHistory }
  g5CurrentTeamIndex: number;
  g5UsedQuestionIds: number[];

  // ── Game 6: Sell Me This Trash! (2v2 Pitch) ──
  g6Matches: G6Match[]; // { matchNumber, teamAIds, teamBIds, pitchItem, buyerPersona, votesA, votesB, winnerTeam }
  g6CurrentMatchIndex: number;
}
```
