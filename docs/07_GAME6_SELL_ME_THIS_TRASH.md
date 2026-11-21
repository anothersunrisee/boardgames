# PARTYHUB INDONESIA — SPESIFIKASI GAME 06: SELL ME THIS TRASH!
> Kategori: Duel Pitching Sales 2v2 • Negosiasi Barang Rongsokan • Roleplay Pembeli Absurd  
> Tema Warna: Lime Green (`#65A30D`) | Maskot: Zuzu / Dollar Bot  
> Target Demografis: Universal (Tongkrongan, Tim Kantor / Ice Breaking Sales, Keluarga & Komunitas)  
> Target Pembaca: Reviewer Sistem, Full-Stack Architect, & Model AI (Gemini Neon High)

---

## 🎯 1. KONSEP & ATURAN UTAMA PERMAINAN

### 1.1. Filosofi & Sensasi Sosial
Terinspirasi dari adegan legendaris *"Sell me this pen"* di film *The Wolf of Wall Street*, namun di-twist menjadi komedi pesta 100% absurd!  
Di **Sell Me This Trash!**, dua tim duo sales ditantang menjual **1 barang rongsokan yang cacat total** (misal: *Sandal jepit beda warna & beda ukuran, Tutup Tupperware mamah yang wadahnya hilang, atau Flashdisk 128MB karatan*) kepada **1 profil target pembeli yang sangat unik** (misal: *CEO Startup Unicorn yang mau pitching Series B, Alien yang baru mendarat di Jakarta, atau Emak-Emak Ketua Arisan Komplek*).  
Pemain harus memutar otak mencari sudut pandang penjualan (*sales angle*) paling kreatif dan mengocok perut. Siapa sangka sandal jepit beda ukuran bisa dipromosikan sebagai *"simbol disrupsi teknologi asimetris anti-mainstream"*?  
Audiens di ruangan berperan sebagai Target Pembeli yang memutuskan ke mana uang mereka akan dibelanjakan.

### 1.2. Peran Partisipan (Orang-Orangnya)
1. **Duo Tim Sales A (2 Pemain):** Mempresentasikan keunggulan barang cacat tersebut selama 45 detik.
2. **Duo Tim Sales B (2 Pemain):** Mempresentasikan barang yang sama dengan sudut pandang tandingan selama 45 detik.
3. **Dewan Pembeli / Audiens (Sisa Pemain di Ruangan):** Menilai siapa sales yang paling meyakinkan dan memberikan suara vote.
4. **Host (Moderator Bazar):** Membaca deskripsi barang, memandu timer pitching, dan mengeksekusi hukuman bagi tim sales yang gagal.

---

## 🖥️ 2. SPESIFIKASI UI & TAMPILAN LAYAR LENGKAP

### 2.1. Tampilan Layar Utama TV / Proyektor Host (`G6Match.tsx`)
1. **Header Desktop Layout:**
   * Badge Neo-Brutalist: `GAME 06 • SELL ME THIS TRASH` dengan aksen hijau lime `#65A30D`.
   * Indikator Match: `Match 1 / 3 • Duo Sales A vs Duo Sales B`.
   * Tombol Host: `Ganti Barang (Shuffle)` dan `Undo Tahap`.
2. **Showcase Barang Rongsokan Raksasa (The Trash Box):**
   * **Nama Barang:** Font display tebal (misal: *"Sandal Jepit Swallow Beda Warna & Beda Ukuran"*).
   * **Kerusakan Absurd (The Flaw):** Kotak peringatan merah: *"Kaki kanan hijau lumut ukuran 10, kaki kiri biru pudar ukuran 7, tali jepit diganjal peniti karatan"*.
   * **Profil Target Pembeli:** Kotak sorotan emas: *"CEO Startup Unicorn yang mau pitching pendanaan Series B ke investor Silicon Valley"*.
3. **Timeline 4 Tahap Pitching:**
   * `1. Persiapan (15s)`: Kedua tim menyusun materi presentasi dan angle jualan.
   * `2. Pitching Tim Sales A (45s)`: Presentasi Duo Sales A dengan lonceng paruh waktu di detik ke-22.
   * `3. Pitching Tim Sales B (45s)`: Presentasi Duo Sales B dengan lonceng paruh waktu di detik ke-22.
   * `4. Voting Pembeli`: Audiens memberikan vote siapa yang paling layak dibeli.
4. **Layar Live Voting Pembeli:**
   * Dua pilar suara interaktif: **[Sales A: {votesA}]** vs **[Sales B: {votesB}]**.
   * Angka vote otomatis bertambah saat penonton menekan tombol di HP Controller.
   * Tombol manual Host: `[+1 Vote Tim A]` dan `[+1 Vote Tim B]` (untuk mode offline tanpa HP).
   * Tombol `[Sahkan Pemenang Sales & Berikan Hukuman ➔]`.

### 2.2. Tampilan Controller HP Pemain (`PlayerController.tsx`)
* **Saat Pitching Berlangsung:** Menampilkan nama produk cacat, kerusakan, dan persona target pembeli.
* **Saat Voting Terbuka:** HP audiens bergetar dan menampilkan 2 tombol belanja besar:  
  * 🛍️ **[BELI DARI TIM SALES A]** (Nama Duo Sales A)
  * 🛍️ **[BELI DARI TIM SALES B]** (Nama Duo Sales B)

---

## ⚖️ 3. LOGIKA SKOR, CARA BENAR, & CARA SALAH

### 3.1. Tabel Perhitungan Skor Matematis
| Hasil Duel Pitching | Cara Benar / Salah | Poin per Anggota Tim | Konsekuensi Tambahan |
| :--- | :--- | :---: | :--- |
| **Pemenang Sales (Vote Tertinggi)** | **CARA BENAR:** Berhasil meyakinkan audiens bahwa barang cacat tersebut bernilai tinggi. | **+8 Poin** (tiap orang) | Bebas dari hukuman |
| **Kalah Sales (Vote Terendah)** | **CARA SALAH:** Gagal meyakinkan pembeli atau materi presentasi garing. | **+2 Poin** (tiap orang) | **WAJIB MEMUTAR ROULETTE HUKUMAN KELOMPOK!** |
| **Hasil Seri (Draw)** | Kedua tim memperoleh jumlah vote pembeli yang sama. | **+4 Poin** (tiap orang) | Keduanya bebas dari hukuman |

### 3.2. Wajib Tag-Team Oper Mic (Detik ke-22)
* Pada detik ke-22 sesi pitching (paruh waktu 45 detik), sistem membunyikan lonceng ting-ting otomatis di speaker TV.
* Anggota tim sales pertama **WAJIB MENYERAHKAN BICARA** kepada rekan setimnya untuk melanjutkan argumen jualan. Ini memastikan kedua pemain sama-sama aktif berkontribusi.

---

## 🔍 4. DEEP EDGE CASES: "KALAU ORANGNYA BEGINI BAGAIMANA, KALAU BEGITU BAGAIMANA"

### 1. Bagaimana jika penonton ingin benar-benar berakting sebagai Target Pembeli?
* *Skenario:* Target pembeli adalah *"Bapak-Bapak Super Pelit"*, dan penonton ingin mengajukan pertanyaan penawaran harga.
* *Penanganan:* Sangat dianjurkan! Host dapat memberikan waktu 15 detik ekstra tanya-jawab di mana penonton melempar pertanyaan menawar ala pasar loak. Tim sales yang mampu menangkis pertanyaan pembeli dengan jawaban paling jenius hampir pasti memenangkan suara!

### 2. Kalau barang cacat yang muncul dirasa terlalu asing bagi kelompok keluarga?
* *Skenario:* Muncul barang seperti *"Flashdisk 128MB Karatan"* di arisan keluarga yang banyak ibu-ibu.
* *Penanganan:* Host cukup menekan tombol **`[Ganti Barang / Shuffle]`**. Sistem akan mengganti barang menjadi sesuatu yang sangat relate dengan rumah tangga (seperti *Tutup Tupperware yang Hilang Wadahnya* atau *Cobek Batu yang Belah Dua*).

### 3. Kalau hasil vote pembeli seri (Draw 50:50)?
* *Skenario:* Audiens terbelah sama rata antara Tim Sales A dan Tim Sales B.
* *Penanganan:* Host dapat menawarkan opsi tawar-menawar diskon terakhir: masing-masing tim diberi 5 detik untuk menyebutkan *"Bonus Pembelian Paling Gila"* (misal: *"Beli sandal beda warna, gratis doa restu dari orang tua sales!"*). Host yang menentukan pemenang akhirnya.

### 4. Kalau salah satu sales tertawa terbahak-bahak dan tidak bisa melanjutkan jualan?
* *Skenario:* Sales A tertawa terpingkal-pingkal karena lawakan rekannya sendiri.
* *Penanganan:* Waktu 45 detik terus berjalan! Rekan setimnya harus segera mengambil alih mic untuk menyelamatkan presentasi tim. Momen pecah tawa ini justru sering membuat audiens terhibur dan malah memberikan vote!

---

## 🔄 5. UX FLOW DIAGRAM & TRANSISI STATE

```
[Mulai Game 6 di Hub]
         │
         ▼
[G6Match: Persiapan / Prep (15s)]
  ├─ TV menampilkan Barang Rongsokan, Kerusakan, & Persona Target Pembeli
  ├─ Kedua tim sales berdiskusi merancang strategi pitching
  │
  ▼
[Fase Pitching Tim Sales A (45s)]
  ├─ 0s - 22s: Anggota Sales A1 berbicara
  ├─ Detik 22: Lonceng ting-ting berbunyi -> Wajib oper ke Anggota Sales A2
  ├─ 23s - 45s: Anggota Sales A2 menutup penjualan
  │
  ▼
[Fase Pitching Tim Sales B (45s)]
  ├─ 0s - 22s: Anggota Sales B1 berbicara
  ├─ Detik 22: Lonceng ting-ting berbunyi -> Wajib oper ke Anggota Sales B2
  ├─ 23s - 45s: Anggota Sales B2 menutup penjualan
  │
  ▼
[Fase Voting Pembeli / Audiens]
  ├─ HP Audiens menampilkan tombol [BELI DARI TIM A] dan [BELI DARI TIM B]
  ├─ TV merender live vote counter
  ├─ Host mengesahkan pemenang -> [Menang: +8 Pts, Kalah: +2 Pts + Hukuman]
  │
  ▼
[Modal Hukuman Tim Kalah Muncul]
  ├─ Tim kalah memutar roulette hukuman komedi tongkrongan
  │
  ▼
[Match Terakhir Selesai?] ─── Tidak ───► [G6NextMatch -> Undi 4 Sales Baru]
         │
        Ya
         │
         ▼
[G6Results: Klasemen Room Terupdate & Penobatan Top Sales Pesta]
```

---

## 📦 6. BANK DATA BARANG RONGSOKAN & TARGET PEMBELI (`game6-pitches.ts`)
1. **Sandal Jepit Swallow Beda Warna & Ukuran:**
   * *Cacat:* Kaki kanan hijau lumut ukuran 10, kaki kiri biru pudar ukuran 7, diganjal peniti karatan.
   * *Target Pembeli:* CEO Startup Unicorn yang mau pitching Series B ke investor Silicon Valley.
2. **Tutup Tupperware Mamah Tanpa Wadah:**
   * *Cacat:* Selembar tutup plastik warna pink, wadah mangkok aslinya hilang ditelan bumi.
   * *Target Pembeli:* Emak-Emak Ketua Arisan Komplek yang terkenal paling judes & teliti.
3. **Flashdisk 128MB Karatan Tahun 2005:**
   * *Cacat:* Kapasitas cuma muat 2 file MP3, colokan USB-nya oblak, berkarat parah.
   * *Target Pembeli:* Hacker Anonymous Internasional yang mau meretas satelit luar angkasa.
4. **Payung Bolong Bagian Tengah:**
   * *Cacat:* Rangkanya tegak gagah, tapi kain bagian tengahnya bolong seukuran bola basket.
   * *Target Pembeli:* Pengantin baru yang lagi foto pre-wedding outdoor pas musim hujan deras.
5. **Sepatu Pantofel Cuma Kaki Kanan:**
   * *Cacat:* Mengkilap klimis mewah beraroma kulit asli, tapi cuma ada sebelah kanan doang.
   * *Target Pembeli:* Pejabat eselon yang besok pagi wajib upacara bendera kenegaraan di istana.
6. **Kipas Angin Rusak Cuma Bunyi 'Nguuung':**
   * *Cacat:* Baling-balingnya macet total gak muter sama sekali, mesinnya berdengung dan panas.
   * *Target Pembeli:* Pendaki gunung salju Everest yang sedang kedinginan di dalam tenda badai.
