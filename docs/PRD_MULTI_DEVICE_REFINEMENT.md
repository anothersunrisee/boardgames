# 📱 PRD: REFINEMENT SCREEN UI & INTERAKSI MULTI-DEVICE (HP CONTROLLER & HOST SCREEN)
> **PartyHub Indonesia — Standard Operating Specification & Architecture Reference**  
> *Dokumen panduan implementasi screen UI controller HP minimalis, host TV screen answer reveal, automatic duplicate detection, dan host override engine.*

---

## 1. Executive Summary & Problem Statement

### 1.1 Masalah di Versi Sebelumnya
1. **Layar Host Game 01 (Same Brain? NO!) Belum Menampilkan Jawaban Asli:**
   - Di versi sebelumnya, pemain mengetik di HP, tetapi di layar TV hanya muncul daftar nama pemain yang harus diklik manual oleh Host. Host dan pemain harus saling berteriak membacakan jawaban.
   - Tidak ada card visual di layar TV yang langsung menampilkan apa yang diketik oleh masing-masing user.
2. **Belum Ada Deteksi Otomatis Jawaban Kembar:**
   - Host harus manual mengingat siapa yang kembar.
   - User yang sengaja typo (misal: `"nasgor"` vs `"nasgoorrrrr"`) tidak terdeteksi oleh sistem string biasa, dan belum ada tombol Host Override untuk menyamakan/menyatukan (*merge*) jawaban tersebut.
3. **UI Controller di HP Terlalu Kompleks:**
   - Layar HP membutuhkan UI yang sangat fokus, minimalis, dan ergonomis (tanpa aset-aset berat seperti di TV).
   - Memerlukan tombol: `Form Input di Tengah`, `Hapus / Reset`, `Batal`, dan `Kunci Jawaban` dengan **Double Confirmation Dialog** (konfirmasi sebelum kirim agar pemain tidak salah pencet).
4. **Aturan Khusus Game 05 (Cerdas Cermat Berantai 16 Soal):**
   - Game 5 adalah estafet berkelompok di mana anggota tim maju bersama ke depan layar TV. Pemain **TIDAK MENGGUNAKAN CONTROLLER HP** untuk menjawab kuis ini.
   - HP hanya menampilkan *Spectator Screen* ("Fokus ke Layar TV!") lengkap dengan tombol reaksi/cheering interaktif.
5. **Pemilihan Mode di Room Setup (Register Page):**
   - Belum ada tombol saklar (switch mode) yang eksplisit antara:
     - **Mode A: Satu Layar Bersama (Host / Pass & Play)** — 100% offline, 1 gadget digilir.
     - **Mode B: Multi-Device (HP Masing-Masing)** — TV sebagai Host + HP sebagai Controller, menampilkan QR Code, kode room 4 huruf, dan link join.

---

## 2. Design System & Token Compliance (Anti-Inkonsistensi)

Sesuai arahan wajib: **Dilarang membuat UI baru yang menyimpang dari aset dan styling game yang sudah ada.**
Semua komponen wajib menggunakan token desain PartyHub yang telah terdefinisi:

* **Palet Warna Utama:**
  * Background Host: `#FAF7F2` (Warm Cream / Kanvas Netral)
  * Background Controller HP: `#FAF7F2` dengan Card `#FFFFFF` dan aksen border `#1E1E24`/10
  * Game 01 (Same Brain? NO!): `#158467` (Emerald), `#0F5E49` (Dark Emerald), `#D6F5EC` (Mint)
  * Game 02 (Beauty Expert?!): `#D8317E` (Berry), `#BE185D` (Deep Rose), `#FCE4F0` (Soft Rose)
  * Game 03 (Boys Stuff, Girls Guess!): `#2568EF` (Cobalt), `#1D4ED8` (Deep Blue), `#E0EBFF` (Ice Blue)
  * Game 04 (The Devil's Advocate): `#EC5A29` (Sunset Orange), `#C44319` (Rust), `#FFE8DF` (Soft Peach)
  * Game 05 (Chain Quiz Relay): `#7928CA` (Electric Violet), `#581C87` (Deep Indigo)
  * Game 06 (Sell Me This Trash!): `#F59E0B` (Amber Gold), `#D97706` (Bronze Gold)
* **Tipografi & Tombol:**
  * Header & Judul: Font Display Bold (`font-display font-black`)
  * Tactile Buttons: Border 2px solid `#1E1E24`, `rounded-2xl`, shadow tactile `shadow-[0_4px_0_#1E1E24]` dengan efek press `active:translate-y-1 active:shadow-none`.
  * Mascots & Avatar: `PlayerProfileAvatar` dan `CHARACTER_PACK` (c01 s/d c12).

---

## 3. Spesifikasi Screen UI & Logic Tiap Game

### 3.1 Register Page / Room Setup: Switch Mode Switcher
* **Posisi:** Tepat di atas konfigurasi pemain di [`src/pages/RoomSetup.tsx`](file:///d:/Freelance/2026/boardgames/src/pages/RoomSetup.tsx).
* **Komponen:** 2 Tombol Card Seleksi Interaktif:
  1. **Mode Satu Layar (Pass & Play):**
     - Icon: 💻 Laptop / Monitor
     - Judul: `Satu Layar Bersama`
     - Subjudul: *1 HP/Laptop digilir bersama di tongkrongan. 100% Offline tanpa internet.*
     - Aksi: Menyembunyikan banner QR code dan kode join agar layar bersih & fokus.
  2. **Mode Multi-Device (HP Masing-Masing):**
     - Icon: 📱 Smartphone Multi-User
     - Judul: `Multi-Device (Pakai HP Masing-Masing)`
     - Subjudul: *TV sebagai Host Utama + Semua pemain pegang HP untuk ketik jawaban & voting rahasia.*
     - Aksi: Membuka panel QR code interaktif, 4-Letter Room Code besar dengan tombol copy link, dan daftar realtime pemain yang terhubung.

---

### 3.2 Game 01: Same Brain? NO!

#### A. Controller HP (Pemain)
* **Layout:** Vertikal ergonomis satu tangan (Mobile Portrait). Form berada di tengah layar.
* **Elemen:**
  1. **Top Bar:** Avatar pemain, nama pemain, status indikator koneksi (`LIVE TV`), dan badge game.
  2. **Center Form:**
     - Prompt Kategori dari TV (Contoh: *"Sebutkan 1 topping martabak manis!"*)
     - Text Input besar & nyaman diketik (Auto-focus, max 30 karakter, teks tebal).
     - Counter karakter dan tombol cepat `Hapus` (Clear text).
  3. **Action Button:**
     - Tombol `Kunci Jawaban Unik` (`bg-[#158467]`, tactile shadow).
     - Menekan tombol ini memunculkan **Double Confirmation Dialog**:
       - *Dialog Modal:* "Yakin kunci jawaban: **[Nasi Goreng]**? Jawaban tidak bisa diubah lagi!"
       - Pilihan: `Batal Edit Lagi` vs `Ya, Kunci Jawaban!`.
  4. **State Terkunci (Locked In):**
     - Setelah dikonfirmasi, form input berubah menjadi Card Jawaban Terkunci dengan animasi centang hijau `CheckCircle2`.
     - Teks: *"Jawabanmu sudah masuk ke TV. Tunggu Host membuka kartu semua pemain!"*.

#### B. Layar Host (TV Screen)
* **Fase 1: Timer Berjalan (30 Detik):**
  - Ticker realtime di bawah timer: Menampilkan pill avatar setiap pemain yang sudah selesai mengunci jawaban (`dimas ✅`, `kevin ✅`, `alya ⏳ sedang mengetik`).
  - Suara SFX Pop setiap ada pemain yang mengunci jawaban dari HP.
* **Fase 2: Waktu Habis / Reveal & Scoring:**
  - **Grid Card Jawaban Pemain:**
    - Setiap pemain mendapatkan 1 Card Jawaban yang menampilkan:
      - Avatar karakter + Nama pemain.
      - Teks jawaban asli yang diketik (Contoh: `"Nasi Goreng"`).
      - Status Badge Otomatis: `UNIK (+2)` atau `KEMBAR (-1)`.
  - **Mesin Deteksi Otomatis (Duplicate Answer Engine):**
    - Sistem melakukan normalisasi string (huruf kecil, strip karakter khusus, pembersihan pengulangan huruf ekstrem seperti `nasgooorrrrr` -> `nasgor`).
    - Jika ada $\ge 2$ pemain yang jawabannya sama/mirip, sistem langsung menandai mereka sebagai `KEMBAR (-1)` dengan warna kartu merah muda (`#FFE8DF`).
    - Pemain dengan jawaban tunggal langsung ditandai `UNIK (+2)` dengan warna kartu hijau mint (`#D6F5EC`).
  - **Host Override & Merge Engine (Intervensi Host):**
    - Host dapat mengklik tombol **"Ubah Status"** pada masing-masing kartu untuk beralih antara:
      - `[❌ Tandai Kembar (-1)]` $\leftrightarrow$ `[✅ Tandai Unik (+2)]`.
    - Host dapat mengklik tombol **"Gabungkan Jawaban (Merge)"** untuk menyatukan dua kata yang konotasinya sama meskipun ejaannya sengaja dibedakan pemain.
    - Tally bar skor di bawah langsung ter-update realtime secara dinamis.

---

### 3.3 Game 02 & Game 03: Beauty Expert & Boys Stuff

#### A. Controller HP
* **Pemegang Rahasia (Cewek di G2 / Cowok di G3):**
  - Layar HP menampilkan Kartu Rahasia Pribadi dengan warna tema (`#D8317E` Berry / `#2568EF` Cobalt).
  - Teks instruksi: *"🤫 KATA RAHASIA MILIKMU: [Eyelash Curler]. Jangan sebut kata ini, jawab pertanyaan temanmu!"*.
* **Penebak (Cowok di G2 / Cewek di G3):**
  - Form input minimalis di tengah layar untuk mengetik tebakan rahasia.
  - Tombol kirim dengan konfirmasi modal.
  - Notifikasi saat tebakan sudah berhasil terkirim ke Host.

#### B. Layar Host (TV Screen)
* Menampilkan daftar tebakan yang masuk secara realtime.
* Mesin *Fuzzy Matching* memeriksa apakah tebakan pemain cocok dengan kata rahasia atau aliasnya.
* Tombol **Host Override** (centang hijau / silang merah) tetap tersedia agar Host bisa mengesahkan jawaban yang benar menurut kesepakatan tongkrongan.

---

### 3.4 Game 04: The Devil's Advocate (Debat 2v2)

#### A. Controller HP (Penonton / Juri Voting)
* Pemain yang tidak sedang maju debat bertindak sebagai juri pemilih:
* Layar HP menampilkan 2 Card Voting besar:
  - Card 1: `🔥 TIM A (PRO) — [Nama Anggota]` (Warna `#158467`)
  - Card 2: `❄️ TIM B (KONTRA) — [Nama Anggota]` (Warna `#2568EF`)
* Saat diklik, muncul **Confirmation Dialog**:
  - *"Vote [Tim A]? Pilihanmu tidak bisa diubah."*
* Setelah vote terkunci, muncul feedback *"Suaramu telah masuk ke kotak suara TV!"*.

#### B. Layar Host (TV Screen)
* Menampilkan timer debat 60 detik per babak.
* Saat waktu debat habis, muncul live ballot box yang membuka hasil voting penonton dengan efek suspense dramatis sebelum mengumumkan tim pemenang.

---

### 3.5 Game 05: Chain Quiz Relay (Kuis Berantai 16 Soal) — ATURAN KHUSUS!

> [!IMPORTANT]
> **Pemain TIDAK menggunakan HP untuk Game 05!**
> Karena Game 5 dimainkan dengan cara 1 tim (4 orang) maju bersama ke depan TV untuk estafet 16 pertanyaan cepat, maka seluruh kontrol permainan berada di **Layar Host (TV Screen)** dengan Host Utility Bar / keyboard / touch screen.

#### A. Controller HP (Spectator & Hype Mode)
* Layar HP beralih ke **Mode Penonton / Supporter**:
  - Header: `GAME 05 • KUIS BERANTAI`
  - Pesan Utama: *"🎯 FOKUS KE LAYAR TV UTAMA! Tim sedang estafet menjawab 16 soal cerdas cermat!"*
  - **Interactive Hype Cheer Buttons (Tombol Reaksi):**
    - `👏 Tepuk Tangan`
    - `🔥 Bakar Semangat`
    - `🎉 Hore!`
    - Memberikan getaran haptic dan memunculkan animasi reaksi ringan di layar HP agar pemain yang sedang menunggu giliran tetap seru dan engaged.

#### B. Layar Host (TV Screen)
* Tetap mempertahankan gameplay estafet 16 soal interaktif:
  - Tampilan kartu soal besar di TV.
  - Anggota tim menjawab lisan satu per satu secara estafet.
  - Tombol Host: `BENAR (+Poin)`, `SALAH (Kena Challenge Fisik)`, dan `SKIP/PASS`.

---

### 3.6 Game 06: Sell Me This Trash! (Sales Pitch 2v2)

#### A. Controller HP (Audience Voting)
* Penonton memberikan penilaian pitch terbaik:
  - Card Vote Duo Sales A vs Duo Sales B.
  - Double confirmation modal sebelum kirim vote.

#### B. Layar Host (TV Screen)
* Menampilkan foto barang rongsokan, timer pitching 45 detik untuk Duo A dan Duo B, serta kalkulasi perolehan skor podium akhir.

---

## 4. Rencana Kerja Implementasi (Execution Roadmap)

1. **Step 1:** Tambahkan state `playMode: 'single_screen' | 'multi_device'` di [`src/store/useGameStore.ts`](file:///d:/Freelance/2026/boardgames/src/store/useGameStore.ts).
2. **Step 2:** Perbarui [`src/pages/RoomSetup.tsx`](file:///d:/Freelance/2026/boardgames/src/pages/RoomSetup.tsx) dengan 2-Button Switcher Mode yang responsif dan elegan.
3. **Step 3:** Buat helper mesin pendeteksi duplikasi teks dan pembersihan typo di [`src/utils/fuzzyMatch.ts`](file:///d:/Freelance/2026/boardgames/src/utils/fuzzyMatch.ts) (`findDuplicateGroups`, normalisasi huruf berulang).
4. **Step 4:** Refaktor [`src/pages/game1/G1Round.tsx`](file:///d:/Freelance/2026/boardgames/src/pages/game1/G1Round.tsx):
   - Tampilkan Card Jawaban Asli tiap user di TV.
   - Deteksi otomatis Kembar/Unik.
   - Implementasikan Host Override button & Merge Grouping.
5. **Step 5:** Refaktor [`src/pages/PlayerController.tsx`](file:///d:/Freelance/2026/boardgames/src/pages/PlayerController.tsx):
   - UI minimalis terpusat di tengah layar.
   - Tombol Hapus, Batal, Kunci Jawaban.
   - Double Confirmation Dialog modal.
   - Game 4 Voting confirmation modal.
   - Game 5 Spectator & Hype Mode (tanpa kuis HP).
6. **Step 6:** Jalankan uji kompilasi `npm run build` dan push ke GitHub origin main.
7. **Step 7:** Buat laporan konfirmasi final kepada user.
