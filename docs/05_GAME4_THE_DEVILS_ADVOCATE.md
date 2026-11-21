# PARTYHUB INDONESIA — SPESIFIKASI GAME 04: THE DEVIL'S ADVOCATE
> Kategori: Debat Komedi 2v2 • Adu Bacot Spontan • Akting Chaos Card  
> Tema Warna: Terracotta Orange (`#E85D2A`) | Maskot: Flame / Sparky  
> Target Demografis: Universal (Tongkrongan, Rekan Kantor SFW, Keluarga & Komunitas)  
> Target Pembaca: Reviewer Sistem, Full-Stack Architect, & Model AI (Gemini Neon High)

---

## 🎯 1. KONSEP & ATURAN UTAMA PERMAINAN

### 1.1. Filosofi & Sensasi Sosial
Banyak orang merasa canggung saat diminta berbicara di depan umum (*public speaking*). Di **The Devil's Advocate**, kecanggungan tersebut diubah menjadi tawa lepas karena **premis perdebatan yang sengaja dibuat 100% absurd dan tidak masuk akal!**  
Empat pemain diundi menjadi dua tim duo (Duo PRO vs Duo KONTRA). Mereka dipaksa mempertahankan posisi yang berlawanan dengan logika normal (misal: *"Tukang parkir minimarket lebih cocok jadi presiden daripada lulusan universitas top"*).  
Untuk melipatgandakan komedi, setiap tim juga dibebani **Kartu Gangguan (Chaos Card)** yang mewajibkan mereka berdebat menggunakan intonasi atau gaya akting tertentu (misal: gaya motivator MLM super optimis, gaya sinetron azab menangis tersedu-sedu, atau gaya rocker bersuara parau).  
Seluruh pemain lain yang sedang duduk bertindak sebagai **Dewan Juri / Audiens** yang memberikan suara pemenang secara real-time.

### 1.2. Peran Partisipan (Orang-Orangnya)
1. **Duo Tim PRO (2 Pemain):** Bertugas membela mosi debat sekuat tenaga dengan memasukkan gaya akting Chaos Card A.
2. **Duo Tim KONTRA (2 Pemain):** Bertugas menyerang balik mosi debat dengan memasukkan gaya akting Chaos Card B.
3. **Dewan Juri / Audiens (Sisa Pemain di Ruangan):** Menonton perdebatan, tertawa, dan menekan tombol vote di HP Controller atau mengangkat tangan.
4. **Host (Moderator Sidang):** Memandu tahapan timer perdebatan, membunyikan lonceng oper mic, dan mengumumkan pemenang.

---

## 🖥️ 2. SPESIFIKASI UI & TAMPILAN LAYAR LENGKAP

### 2.1. Tampilan Layar Utama TV / Proyektor Host (`G4Match.tsx`)
1. **Header Desktop Layout:**
   * Badge Neo-Brutalist: `GAME 04 • DEVIL'S ADVOCATE` dengan aksen terakota `#E85D2A`.
   * Indikator Match: `Match 1 / 3 • Duo PRO vs Duo KONTRA`.
   * Tombol Host: `Ganti Topik (Shuffle)` dan `Ganti Chaos Card`.
2. **Kartu Topik Debat Raksasa:**
   * Kotak terakota tebal dengan teks topik kontroversial/absurd (misal: *"Rapat 1 jam yang sebenarnya cukup lewat 1 chat WhatsApp wajib didenda traktir kopi satu divisi"*).
3. **Kartu Chaos Card Duo Tim:**
   * **Kotak Tim PRO (Kiri):** Avatar Duo PRO + Kartu Kuning: *"Gaya Motivator MLM (Selalu panggil 'Sahabat Sukses' dan tepuk tangan sendiri)"*.
   * **Kotak Tim KONTRA (Kanan):** Avatar Duo KONTRA + Kartu Merah: *"Gaya Sinetron Azab (Bicara sambil memegang dada dan menangis histeris)"*.
4. **Timeline Tahapan & Timer Debat (8 Stage Order):**
   * Progress bar visual 8 tahap perdebatan:
     1. `Persiapan (15s)`: Kedua tim menyusun strategi dan membaca Chaos Card.
     2. `Argumen Pembuka PRO (30s)`: Tim PRO menyampaikan dasar pemikiran.
     3. `Argumen Pembuka KONTRA (30s)`: Tim KONTRA menyampaikan bantahan awal.
     4. `Serang Balik PRO (20s)`: Tim PRO mematahkan bantahan lawan.
     5. `Serang Balik KONTRA (20s)`: Tim KONTRA melancarkan serangan balasan.
     6. `Pernyataan Penutup PRO (10s)`: Kesimpulan akhir Tim PRO.
     7. `Pernyataan Penutup KONTRA (10s)`: Kesimpulan akhir Tim KONTRA.
     8. `Live Voting Audiens`: Audiens memberikan suara pemenang.
5. **Layar Live Voting Pemenang:**
   * Dua pilar skor voting besar: **[PRO: {votesA}]** vs **[KONTRA: {votesB}]**.
   * Angka voting bertambah secara live ketika audiens menekan tombol vote di HP Controller.
   * Tombol manual Host: `[+1 Vote Tim PRO]` dan `[+1 Vote Tim KONTRA]` (untuk mode offline/angkat tangan).
   * Tombol `[Sahkan Hasil Voting & Lanjut Match ➔]`.

### 2.2. Tampilan Controller HP Pemain (`PlayerController.tsx`)
* **Saat Sesi Debat Berlangsung:** Menampilkan topik debat aktif, mosi tim, dan teks petunjuk Chaos Card.
* **Saat Sesi Voting Terbuka:** HP audiens bergetar haptik dan menampilkan 2 tombol voting raksasa:  
  * 🟢 **[VOTE TIM PRO]** (Nama Duo PRO)
  * 🔴 **[VOTE TIM KONTRA]** (Nama Duo KONTRA)  
  Pemain menekan satu pilihan, dan suara mereka langsung terkirim ke layar TV Host.

---

## ⚖️ 3. LOGIKA SKOR, CARA BENAR, & CARA SALAH

### 3.1. Tabel Perhitungan Skor Matematis
| Hasil Match | Cara Benar / Salah | Poin per Anggota Tim | Keterangan |
| :--- | :--- | :---: | :--- |
| **Duo Menang Vote** | **CARA BENAR:** Berhasil meyakinkan audiens dengan argumen paling kocak dan menghibur. | **+8 Poin** (tiap orang) | Poin penuh penentu klasemen |
| **Duo Kalah Vote** | **CARA SALAH:** Kalah dalam perolehan suara audiens. | **+2 Poin** (tiap orang) | Poin konsolasi keaktifan bicara |
| **Hasil Seri (Draw)** | Kedua tim memperoleh jumlah vote yang sama persis. | **+4 Poin** (tiap orang) | Poin imbang adil |
| **Bonus Chaos Card** | **BONUS EKSEKUSI:** Menjalankan akting Chaos Card dengan sangat komitmen dan totalitas. | **+2 Poin Ekstra** | Diberikan atas persetujuan Host/audiens |

### 3.2. Mengatasi Celah Exploit Free-Rider (Pemain Pasif)
* *Masalah:* Dalam tim 2v2, ada risiko 1 pemain mendominasi pembicaraan sementara rekannya hanya berdiri diam namun tetap menikmati `+8 Poin`.
* *Solusi Mekanik (Lonceng Wajib Tag-Team):*
  * Sistem membunyikan SFX lonceng ting-ting otomatis di paruh waktu tahap debat (detik ke-15 pada Opening 30s, dan detik ke-10 pada Rebuttal 20s).
  * Lonceng ini adalah sinyal **WAJIB OPER MIC** ke rekan setimnya. Jika salah satu pemain sama sekali tidak berbicara, Host berhak memotong poin konsolasi tim tersebut!

---

## 🔍 4. DEEP EDGE CASES: "KALAU ORANGNYA BEGINI BAGAIMANA, KALAU BEGITU BAGAIMANA"

### 1. Kalau jumlah pemain di ruangan ganjil (misal 5, 7, 9, atau 11 orang)?
* *Skenario:* Di room 7 orang, 4 orang bermain debat 2v2, sehingga tersisa 3 orang penonton.
* *Penanganan:* Sangat ideal! Tiga pemain yang tidak bermain bertindak sebagai **Dewan Juri Netral**. Sistem rotasi otomatis (`autoStartGame4`) memastikan setiap orang di room akan mendapatkan giliran bertanding pada match berikutnya secara adil.

### 2. Kalau hasil perolehan suara vote seri (Draw 50:50)?
* *Skenario:* Audiens memberikan 3 vote untuk Tim PRO dan 3 vote untuk Tim KONTRA.
* *Penanganan:* Ada dua opsi resmi di PartyHub Indonesia:
  1. *Opsi Default:* Kedua tim sama-sama mendapatkan **+4 Poin imbang**.
  2. *Opsi Sudden Death (Punchline 10 Detik):* Host memberikan waktu 10 detik kepada 1 perwakilan masing-masing tim untuk melontarkan satu kalimat pamungkas (*roast/punchline*). Host bertindak sebagai penentu suara pamungkas!

### 3. Kalau topik debat terlalu liar atau sensitif saat dimainkan di kantor / keluarga?
* *Skenario:* Muncul topik yang rawan menyinggung privasi atau HR kantor.
* *Penanganan:* Aktifkan **Audience Vibe Filter**:
  * *Vibe Kantor (SFW):* Menyaring topik seputar budaya kerja (Work-from-Home vs WFO, rapat via WhatsApp, lembur pizza, dresscode santai).
  * *Vibe Keluarga (All-Ages):* Topik seputar pembagian warisan receh, sarapan bubur diaduk vs tidak diaduk, aturan jam malam anak.
  * *Tombol Darurat Host:* Host dapat menekan tombol **`[Ganti Topik / Shuffle]`** kapan saja untuk mendapatkan topik baru dalam 1 detik.

### 4. Kalau pemain malu-malu atau kehabisan kata-kata saat gilirannya berbicara?
* *Skenario:* Pemain PRO terdiam di detik ke-10 karena kehabisan ide.
* *Penanganan:* Rekan setimnya diizinkan melakukan *interupsi penyelamatan* setelah detik ke-15, atau Host dapat memberikan petunjuk pancingan konyol dari layar TV.

### 5. Kalau audiens curang dengan hanya me-vote teman dekatnya?
* *Skenario:* Juri tidak objektif dan hanya memilih temannya meski lawannya jauh lebih lucu.
* *Penanganan:* Host memiliki wewenang juri tertinggi. Host dapat menggunakan tombol koreksi vote di layar TV untuk menyeimbangkan suara jika terjadi kecurangan nyata.

---

## 🔄 5. UX FLOW DIAGRAM & TRANSISI STATE

```
[Mulai Game 4 di Hub]
         │
         ▼
[G4Match: Persiapan / Prep (15s)]
  ├─ TV merender Topik Debat & Chaos Card Tim PRO + KONTRA
  ├─ Kedua tim berdiskusi cepat menyusun strategi
  │
  ▼
[Fase Pembuka / Opening Arguments]
  ├─ PRO Opening (30s) -> Lonceng detik 15 (Wajib oper ke partner)
  ├─ KONTRA Opening (30s) -> Lonceng detik 15 (Wajib oper ke partner)
  │
  ▼
[Fase Serang Balik / Rebuttal Battle]
  ├─ PRO Rebuttal (20s) -> Adu argumen langsung
  ├─ KONTRA Rebuttal (20s) -> Adu argumen langsung
  │
  ▼
[Fase Penutup / Final Statement]
  ├─ PRO Final (10s) -> Kalimat penutup pamungkas
  ├─ KONTRA Final (10s) -> Kalimat penutup pamungkas
  │
  ▼
[Fase Live Voting Audiens]
  ├─ HP Audiens menampilkan tombol [VOTE PRO] dan [VOTE KONTRA]
  ├─ TV merender live vote counter
  ├─ Host mengesahkan pemenang -> [Pemenang: +8 Pts, Kalah: +2 Pts]
  │
  ▼
[Match Terakhir Selesai?] ─── Tidak ───► [G4NextMatch -> Undi 4 Pemain Baru]
         │
        Ya
         │
         ▼
[G4Results: Klasemen Room Terupdate & Penghargaan Debater Terbaik]
```

---

## 🎭 6. CONTOH BANK TOPIK DEBAT & KARTU CHAOS CARDS

### Topik Debat Terkurasi (`game4-topics.ts`):
1. *Tukang parkir minimarket yang tiba-tiba muncul wajib diangkat jadi pegawai BUMN dengan gaji tetap.*
2. *Besok kita semua wajib ke kantor/kampus gak usah pake celana panjang (cuma boleh pake boxer santai atau sarung).*
3. *Makan bubur ayam diaduk adalah bentuk pelanggaran etika sosial yang harus didenda Rp 50.000.*
4. *Rapat kerja 1 jam yang sebenarnya cukup diselesaikan lewat 1 chat WhatsApp wajib didenda traktir kopi satu divisi.*
5. *Orang yang hobi bales chat cuma pake huruf 'Y' atau 'P' wajib disita HP-nya selama 3 hari berturut-turut.*
6. *Mantan pacar wajib memberikan surat keterangan kelakuan baik (SKCK) kepada pacar baru kita.*

### Kartu Gangguan / Chaos Cards:
* **Gaya Motivator MLM:** Wajib bicara dengan intonasi super optimis, panggil semua orang "Sahabat Sukses", dan tepuk tangan sendiri setiap 5 detik.
* **Gaya Sinetron Azab:** Bicara sambil memegang dada seolah kena serangan jantung, mata melotot, dan menangis histeris meminta ampun.
* **Gaya Rocker Serak:** Suara wajib serak menggelegar ala vokalis heavy metal, diakhiri dengan gestur tangan metal 🤘.
* **Gaya Berbisik Agen Intel:** Bicara dengan volume super pelan seolah sedang membongkar konspirasi rahasia negara yang disadap CIA.
* **Gaya Sales Obat Keliling:** Bicara dengan tempo super cepat tanpa jeda napas, mengklaim mosi debat dapat menyembuhkan pegal linu dan reumatik.
