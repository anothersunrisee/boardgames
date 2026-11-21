# PARTYHUB INDONESIA — SPESIFIKASI SISTEM OUTGAME & HYBRID MULTI-DEVICE ARCHITECTURE
> Modul: Onboarding Slicing Canvas, Room Setup, Hybrid Multi-Device (QR & Phone Controller), Game Selection Hub, Podium Juara Room, Sistem Hukuman, dan Sound Engine  
> Target Pembaca: Reviewer Sistem, Full-Stack Architect, & Model AI (Gemini Neon High)  
> Posisi Produk: Platform Game Pesta Luring Universal untuk Semua Kalangan (Tongkrongan, Kantor/Corporate, Keluarga & Arisan, Komunitas)

---

## 🎯 1. ONBOARDING & SLICING CANVAS (`/` & `/onboarding`)

### 1.1. Konsep & Tujuan UX
Layar pertama yang menyambut pengunjung saat membuka PartyHub Indonesia di laptop, proyektor ruang tengah, tablet, atau TV. Bertujuan sebagai pemecah kebekuan (*ice-breaker*) instan sebelum masuk ke administrasi permainan. Pengunjung langsung disajikan kanvas interaktif bergaya *Fruit Ninja*: maskot-maskot pesta 3D gemas melayang di layar dan dapat "ditebas" menggunakan kursor pedang katana atau sapuan jari (*touch swipe*) hingga meledak menjadi partikel konfeti dan serpihan warna-warni.

### 1.2. Elemen Visual & Layout UI
* **Kanvas HTML5 2D Fullscreen (60 FPS):** Merender simulasi fisika maskot melayang dengan gravitasi, pantulan elastis dinding, kecepatan sudut rotasi (*angular velocity*), serta kedipan mata animasi procedural.
* **Judul Besar "PartyHub Indonesia":** Tipografi display gemas (*Fredoka font*) dengan warna *charcoal black* `#1E1E24` dan bayangan solid tebal (Neo-Brutalist offset 6px).
* **Tagline Publik Universal:** *"Main Game Pesta Seru Bareng Tongkrongan, Rekan Kantor, & Keluarga!"*.
* **Tombol "START GAME ➔":** Tombol CTA utama berwarna hitam charcoal dengan ikon Play kuning cerah dan efek penekanan fisik (*tactile active translate 4px*). Menekan tombol ini memicu SFX fanfare Web Audio API dan mengarahkan pengguna ke `/room`.
* **Counter Ledakan Maskot (Pojok Kanan Atas):** Menghitung berapa kali pemain berhasil menebas maskot (misal: `💥 73`).
* **Toggle Suara Ambient (Pojok Kanan Atas):** Ikon speaker untuk mematikan/menghidupkan osilator efek suara sintetis.
* **Teks Panduan Interaktif:** *"Klik atau swipe mascot untuk meledakkan! Lalu klik START GAME untuk atur room & daftar pemain."*

### 1.3. Kursor Khusus Slicing Katana (`CustomGameCursor.tsx`)
* **Hanya Aktif di Onboarding:** Kursor visual katana dengan pisau berpendar (*luminous blade trail*) hanya muncul di halaman onboarding/landing page untuk memberikan sensasi game aksi.
* **Otomatis Dinonaktifkan di Dalam Room & Game:** Sesuai masukan kenyamanan pengguna (mencegah pusing, lag, dan kelelahan mata saat membaca teks soal di TV), kursor otomatis kembali ke kursor standar sistem OS saat pengguna berada di `/room`, `/hub`, dan seluruh halaman mini-game.
* **Deteksi Perangkat Sentuh (Mobile/Tablet):** Jika browser mendeteksi sentuhan (*pointer: coarse*), kursor grafis katana disembunyikan dan sistem beralih ke *touch gesture slicing* murni.

---

## 👥 2. PENDAFTARAN PEMAIN & ROOM SETUP (`/room`)

### 2.1. Entitas Data Pemain (`Player`)
Setiap peserta di dalam ruangan direpresentasikan dengan struktur data terstandarisasi:
```typescript
export type Player = {
  id: string;                 // ID unik string acak (misal: "u7x9b1")
  name: string;               // Nama panggilan pemain (misal: "Alya", "Budi")
  gender?: 'cowok' | 'cewek'; // Gender untuk pembagian kubu interogasi
  kubu: string;               // Label kubu default ("Tim Cewek", "Tim Cowok", atau "Tim Detektif")
  score: number;              // Saldo skor room terakumulasi lintas mini-game (dimulai dari 0)
  avatarId?: string;          // ID avatar maskot (c01 s/d c20)
  status?: 'active' | 'inactive'; // Status kehadiran pemain
  joinedLate?: boolean;       // Penanda pemain yang baru bergabung di tengah turnamen
};
```

### 2.2. Sistem Kurasi Konten: Audience Vibe Filter
Untuk memastikan PartyHub Indonesia nyaman dimainkan di berbagai situasi sosial tanpa memicu rasa canggung (*cringe*), layar Setup menyediakan toggle **Vibe Ruangan**:

| Pilihan Vibe | Karakteristik Konten & Kurasi | Contoh Penyesuaian Topik |
| :--- | :--- | :--- |
| **🔥 Tongkrongan (Full Chaos)** | Seluruh bank data aktif 100%. Debat absurd, sarkasme ringan tongkrongan, kartu hukuman kocak receh. | Topik debat bebas kosan, hukuman pose konyol, godaan receh. |
| **💼 Kantor / Corporate (SFW)** | Aman dari potensi pelecehan, bebas materi sensitif/SARA/politik praktis, diperkaya humor dunia kerja. | Topik rapat WA vs zoom, hukuman gaya bicara formal penyiar berita TVRI. |
| **🏡 Keluarga & Arisan (All-Ages)** | Ramah anak-anak dan orang tua, bebas slang korporat/kosan, topik seputar rumah tangga, kuliner, dan nostalgia lintas generasi. | Kategori benda dapur/perkakas rumah, hukuman menyanyikan lagu anak/daerah. |

### 2.3. Kode Unik Room 4-Huruf Bahasa Indonesia (`roomCode`)
Alih-alih menggunakan UUID angka yang sulit dibaca dari jarak jauh, sistem menghasilkan kode 4 huruf kata bahasa Indonesia yang mudah diucapkan oleh Host:
* Contoh kode: `ASIK`, `SERU`, `KOST`, `NONG`, `RAME`, `POCI`, `WARG`, `KOPI`, `KUIS`, `MAIN`.
* Kode ini ditampilkan dengan ukuran font raksasa di layar TV proyektor.

### 2.4. Integrasi Kode QR Layar TV (`QRCodeDisplay.tsx`)
* Di samping tabel pemain, layar TV menampilkan Kode QR dinamis beresolusi tinggi dengan styling Neo-Brutalist border.
* Pemain di ruangan cukup mengarahkan kamera HP ke layar TV untuk membuka URL:
  `https://partyhub.id/join?code=ASIK`
* Kode room otomatis terisi di HP pemain, mengeliminasi friksi salah ketik.

### 2.5. Preset Instan Roster Cepat (Quick Presets)
Bagi kelompok yang ingin langsung bermain tanpa memasukkan nama satu per satu:
* **Preset 10 Pemain:** 5 Cewek + 5 Cowok dengan nama dan avatar siap pakai.
* **Preset 8 Pemain:** 4 Cewek + 4 Cowok.
* **Preset 6 Pemain:** 3 Cewek + 3 Cowok.

### 2.6. Manajemen Pemain Keluar/Masuk (Late Arrival & Dropout)
* **Pemain Baru Datang Terlambat (`addLatePlayer`):**
  Pemain yang baru tiba di tengah sesi turnamen dapat dimasukkan ke Room tanpa merusak game. Host dapat memilih opsi saldo skor awal:
  1. *Skor Nol (`0 pt`):* Mulai dari bawah.
  2. *Skor Rata-Rata / Median:* Mendapatkan skor tengah pemain aktif agar kompetisi tetap adil.
  3. *Skor Terendah Aktif:* Mengikuti skor pemain posisi terakhir saat ini.
* **Pemain Pulang Duluan (`deactivatePlayer`):**
  Pemain yang harus pulang ditandai `inactive`. Namanya diarsip dari giliran main berikutnya tanpa menghapus catatan skor historisnya di Room.

---

## 📱 3. HYBRID ARCHITECTURE & CONTROLLER HP PEMAIN (`/join` & `/play`)

PartyHub Indonesia menggunakan arsitektur **Zero-Database Ephemeral Realtime Message Broker** yang menggabungkan kemudahan Host 1 Layar dengan kecanggihan Controller HP:

```
┌────────────────────────────────────────────────────────┐
│               HOST SCREEN (TV / PROYEKTOR)             │
│   • Menampilkan Kode Room (misal: "ASIK") & QR Code    │
│   • Merender Pertanyaan, Timer Raksasa, & Panggung     │
│   • Sinkronisasi State: syncHostRoomState()            │
└──────────────────────────┬─────────────────────────────┘
                           │ (WebSockets / Firebase RTDB)
         ┌─────────────────┴─────────────────┐
         ▼                                   ▼
┌─────────────────────────┐       ┌─────────────────────────┐
│   HP PEMAIN 1 (/play)   │  ...  │   HP PEMAIN N (/play)   │
│ • Controller Game 1     │       │ • Kartu Rahasia Privat  │
│ • Submit Jawaban / Guess│       │ • Tombol Live Voting    │
└─────────────────────────┘       └─────────────────────────┘
```

### 3.1. Halaman Masuk Pemain (`PlayerJoin.tsx` — `/join`)
* **Auto-Fill Kode Room:** Membaca parameter URL `?code=XXXX` dari scan QR TV.
* **Input Nama & Pemilihan Avatar:** Pemain memilih nama panggilan dan karakter maskot favoritnya.
* **Pill Toggle Gender:** Memilih `👧 Cewek` atau `👦 Cowok` untuk alokasi peran game interogasi.
* **Session Storage Persistence:** Data sesi tersimpan di `sessionStorage` HP sehingga jika browser HP tidak sengaja ter-refresh atau layar terkunci sementara, pemain otomatis terhubung kembali ke room.

### 3.2. Controller Realtime di HP Pemain (`PlayerController.tsx` — `/play`)
Tampilan controller di HP pemain beradaptasi otomatis mengikuti game yang sedang dibuka oleh Host di TV:
1. **Lobby Mode:** Menampilkan status *"TERHUBUNG KE LAYAR TV"* dengan animasi maskot bersiap.
2. **Controller Game 01 (Same Brain? NO!):** Menampilkan teks soal dari TV dan form ketik 1 jawaban unik. Setelah tombol *"Kunci Jawaban"* ditekan, layar mengunci jawaban dan mengirim aksi `submit_g1_answer`.
3. **Controller Game 02 & 03 (Beauty Expert & Boys Stuff):**
   * *Jika pemain adalah Sang Pemegang Rahasia:* HP menampilkan kartu rahasia berwarna emas dengan nama barang rahasia yang tersembunyi dari TV.
   * *Jika pemain adalah Tim Penebak:* HP menampilkan form input tebakan rahasia (`submit_g2_guess` / `submit_g3_guess`).
4. **Controller Game 04 & 06 (The Devil's Advocate & Sell Me This Trash):**
   * HP menampilkan 2 tombol voting interaktif: **[Vote Tim PRO / Tim A]** dan **[Vote Tim KONTRA / Tim B]**. Suara audiens langsung terakumulasi secara real-time di layar TV proyektor.
5. **Controller Game 05 (Chain Quiz Relay):**
   * Menampilkan nomor ronde aktif, pertanyaan trivia yang sedang dibacakan, dan status anggota tim estafet.
6. **Controller Podium:**
   * Saat Host membuka Podium Juara, HP pemain menampilkan animasi hujan konfeti pribadi, ucapan selamat, dan posisi ranking individunya di room.

### 3.3. Zero-Config 100% Offline Fallback Mode
Jika ruangan pesta tidak memiliki koneksi internet atau pemain kehabisan kuota baterai:
* Seluruh game **100% DAPAT DIMAINKAN SECARA VERBAL & MANUAL** di 1 layar laptop Host.
* Host cukup menggunakan tombol bawaan di layar TV: hitungan serentak tiga detik di G1, mode tebak kertas/verbal di G2 & G3, serta tombol tambah vote manual di G4 & G6.

---

## 🏰 4. GAME SELECTION HUB (`/hub`)

### 4.1. Header Bar Status Room
* Menampilkan nama room aktif dan total pemain terdaftar beserta rasio gender (`👥 10 Pemain (👧 5 Cewek • 👦 5 Cowok)`).
* **Avatar Strip Pemain:** Menampilkan deretan avatar profil pemain yang terdaftar.
* **Tombol Aksi Cepat:**
  * `🎮 Intro`: Kembali ke layar tebas maskot Onboarding.
  * `✏️ Edit`: Membuka kembali `/room` untuk menambah/mengubah nama pemain tanpa menghapus skor yang sudah dikumpulkan.
  * `🏆 Skor`: Membuka laci (*drawer*) papan klasemen sementara room.
  * `👑 Juara`: Langsung membuka panggung podium juara room (`/room/podium`).

### 4.2. Katalog 6 Game Party Neo-Brutalist
Setiap game disajikan dalam bentuk **GameCard Neo-Brutalist** dengan warna identitas yang kontras:
1. **Game 01: Same Brain? NO!** (Emerald Green `#158467`) — Asosiasi kata divergen anti-kembar.
2. **Game 02: Beauty Expert?!** (Magenta Berry `#D8317E`) — Interogasi kosmetik & skincare (atau tema rumah tangga).
3. **Game 03: Boys Stuff, Girls Guess!** (Cobalt Blue `#2568EF`) — Interogasi perkakas, otomotif, game, dan sepakbola.
4. **Game 04: The Devil's Advocate** (Terracotta Orange `#E85D2A`) — Debat kocak 2v2 dengan Chaos Cards.
5. **Game 05: Chain Quiz Relay!** (Purple Violet `#7C3AED`) — Cerdas cermat berantai 4 ronde x 4 soal (16 soal estafet).
6. **Game 06: Sell Me This Trash!** (Lime Green `#65A30D`) — Duel pitching sales 2v2 barang rongsokan ke pembeli absurd.

### 4.3. Modal Aturan & Edukasi Game (`GameOnboardingModal.tsx`)
Saat kartu game di-klik, sistem menampilkan modal edukasi 4 langkah:
* Aturan main ringkas (Langkah 1, 2, 3, 4) dengan ikon 3D emoji.
* Tabel sistem penilaian (Poin Menang, Poin Kalah, Poin Penalti).
* Penjelasan hukuman bagi pemain yang gagal.
* Tombol **"Mulai Main Sekarang 🚀"** yang otomatis mengeksekusi launcher acak room.

---

## 👑 5. PANGGUNG JUARA, HUKUMAN, & PARTY WRAPPED (`/room/podium`)

### 5.1. Panggung Podium Juara 1, 2, dan 3
* Merender tangga podium 3 tingkat dengan avatar bermahkota emas, perak, dan perunggu.
* Partikel konfeti 60 FPS meluncur di layar TV disertai SFX kemenangan megah.

### 5.2. Roulette Hukuman 3 Terbawah (`PunishmentModal.tsx`)
Pemain dengan 3 saldo skor terendah di akhir turnamen wajib memutar roda kartu hukuman tongkrongan yang disesuaikan dengan Audience Vibe Filter:
* *Tongkrongan:* Bicara dengan vokal O semua, pose centil dilarang senyum, bicara slow-motion 0.5x.
* *Kantor (SFW):* Bicara dengan gaya bahasa baku sidang skripsi, tirukan gaya presenter berita TV, puji 3 rekan kerja tanpa tertawa.
* *Keluarga (All-Ages):* Nyanyikan lagu anak-anak dengan gaya seriosa, tirukan suara 3 hewan ternak, ceritakan hal memalukan masa kecil.

### 5.3. Penghargaan Gelar Unik (Party Wrapped Superlatives)
Sistem secara algoritmik menganalisis riwayat game dan menganugerahkan badge sosial unik:
* **👑 The Ultimate MVP:** Pemain dengan poin kumulatif tertinggi di ruangan.
* **🧠 Mastermind:** Pemain dengan jawaban paling unik di Game 1.
* **🔥 Chaos Gremlin:** Pemain dengan performa debat paling pecah di Game 4.
* **🍀 Sultan Hoki:** Pemain yang paling sering menebak benar di Game 2 & 3.
* **🛡️ Silent Carry:** Pemain yang jarang bicara tetapi akurasi jawabannya 100%.

### 5.4. Generator Kartu Cerita Instagram / TikTok 1080x1920 (`storyCardGenerator.ts`)
* Tombol **"Download Story Card 📸"** merender kanvas grafis vertikal resolusi tinggi (1080x1920 PNG).
* Memuat Nama Room, Tanggal Acara, Nama Juara 1-2-3, Penerima Hukuman, dan Badge Superlative.
* Siap dibagikan langsung ke Instagram Story, status WhatsApp, atau grup keluarga!

---

## 🎛️ 6. GLOBAL UTILITY BAR & AUDIO ENGINE

### 6.1. Host Floating Utility Bar (`HostUtilityBar.tsx`)
Mengambang di bagian bawah seluruh layar game:
* **Undo (Tombol Batal):** Mengoreksi salah ketuk poin atau mengembalikan ronde timer.
* **Shuffle (Ganti Soal):** Mengundi ulang pertanyaan atau benda rahasia jika dirasa kurang relate.
* **Mute Audio:** Mematikan efek suara sintetis jika ruangan menggunakan sound system eksternal.
* **Fullscreen (Layar Penuh):** Memaksimalkan browser ke rasio TV 16:9 tanpa bar browser.
* **Menu Hub:** Tombol darurat untuk kembali ke pemilihan game.

### 6.2. Procedural Web Audio API Sound Engine (`soundEngine.ts`)
* Seluruh efek suara (*Pop, Tick, Buzzer, Arpeggio Success, Fanfare*) dihasilkan secara matematis menggunakan osilator web native.
* Bebas dependensi file `.mp3` eksternal: tidak ada risiko audio gagal dimuat saat koneksi lambat.
