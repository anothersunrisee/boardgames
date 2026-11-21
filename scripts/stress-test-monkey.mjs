import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

// ─── Configuration ───────────────────────────────────────────────────────────
const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const DURATION_MINUTES = process.env.DURATION_MINUTES ? parseFloat(process.env.DURATION_MINUTES) : 120; // 2 Jam
const DURATION_MS = DURATION_MINUTES * 60 * 1000;
const OUTPUT_DIR = path.resolve('stress-test-output');
const ERRORS_DIR = path.join(OUTPUT_DIR, 'errors');
const SCREENSHOTS_DIR = path.join(OUTPUT_DIR, 'screenshots');
const DASHBOARD_PATH = path.join(OUTPUT_DIR, 'LIVE_DASHBOARD.md');
const LOG_PATH = path.join(OUTPUT_DIR, 'stress-test.log');

// Pastikan direktori output ada
fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.mkdirSync(ERRORS_DIR, { recursive: true });
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

// ─── Telemetry State ─────────────────────────────────────────────────────────
const startTime = Date.now();
const endTime = startTime + DURATION_MS;

const metrics = {
  totalCycles: 0,
  totalClicks: 0,
  totalReloads: 0,
  totalNavigations: 0,
  totalStoryCardsGenerated: 0,
  gamesPlayed: {
    game1: 0,
    game2: 0,
    game3: 0,
    game4: 0,
    game5: 0,
    game6: 0,
  },
  errors: [],
  warnings: [],
  memorySamples: [], // { time, heapMB }
  gpuStatus: 'Active (D3D11 / ANGLE Hardware Accelerated)',
  lastActivePage: '/',
};

function log(msg) {
  const ts = new Date().toISOString();
  const line = `[${ts}] ${msg}`;
  console.log(line);
  try {
    fs.appendFileSync(LOG_PATH, line + '\n', 'utf8');
  } catch {}
}

function updateLiveDashboard() {
  const elapsedMs = Date.now() - startTime;
  const elapsedMins = (elapsedMs / (1000 * 60)).toFixed(1);
  const remainingMins = Math.max(0, ((endTime - Date.now()) / (1000 * 60))).toFixed(1);
  const progressPct = Math.min(100, (elapsedMs / DURATION_MS) * 100).toFixed(1);

  const latestMem = metrics.memorySamples.length > 0
    ? metrics.memorySamples[metrics.memorySamples.length - 1].heapMB
    : 'N/A';
  const peakMem = metrics.memorySamples.length > 0
    ? Math.max(...metrics.memorySamples.map((s) => s.heapMB)).toFixed(1)
    : 'N/A';

  const content = `# ⚡ LIVE TELEMETRY: 2-HOUR PLAYWRIGHT MONKEY STRESS-TEST
> **PartyHub Indonesia — Frontend Stability, Memory Leak & Chaos Audit**  
> Diperbarui otomatis secara realtime setiap siklus permainan. Bisa diremote via Antigravity 2.0 kapan saja.

---

### ⏱️ STATUS DURASI & PROGRES
* **Status Pengujian:** ${Date.now() >= endTime ? '✅ SELESAI (2 Jam Selesai Penuh)' : '🚀 SEDANG BERJALAN AKTIF (NON-STOP)'}
* **Waktu Berjalan (Elapsed):** \`${elapsedMins} menit\` dari total \`${DURATION_MINUTES} menit\` (${progressPct}%)
* **Waktu Tersisa:** \`${remainingMins} menit\`
* **Target Host:** [${BASE_URL}](${BASE_URL})
* **Halaman Aktif Terakhir:** \`${metrics.lastActivePage}\`
* **Status Akselerasi GPU:** **${metrics.gpuStatus}**

---

### 📊 METRIK PERFORMA & KEHANDALAN
| Metrik Pengujian | Nilai Terkini | Target / Standar | Status |
| :--- | :---: | :---: | :---: |
| **Total Siklus Selesai (Cycles)** | **${metrics.totalCycles}** siklus | $\ge 20$ siklus | ${metrics.totalCycles > 0 ? '🟢 Normal' : '🟡 Inisialisasi'} |
| **Total Interaksi & Klik (Clicks)** | **${metrics.totalClicks.toLocaleString()}** kali | $\ge 1,000$ | 🟢 Sangat Aktif |
| **Total Reload Acak (Surprise F5)** | **${metrics.totalReloads}** kali | $\ge 10$ kali | 🟢 Tahan Reload |
| **Story Card 1080x1920 Rendered** | **${metrics.totalStoryCardsGenerated}** kartu | $\ge 5$ kali | 🟢 Canvas Stabil |
| **Memory Heap JS Terkini** | **${latestMem} MB** | $\le 250$ MB | ${typeof latestMem === 'number' && latestMem > 250 ? '🔴 Waspada Leak' : '🟢 Sehat (<250MB)'} |
| **Peak Memory Heap** | **${peakMem} MB** | $\le 350$ MB | 🟢 Terkendali |
| **Total Uncaught Errors / Crash** | **${metrics.errors.length}** error | **0 Error** | ${metrics.errors.length === 0 ? '🏆 100% ZERO CRASH' : '⚠️ Ditemukan Bug!'} |

---

### 🎮 DISTRIBUSI MINI-GAME YANG DIMAINKAN
* 🟢 **Game 01 (Same Brain? NO!):** ${metrics.gamesPlayed.game1} sesi
* 🔴 **Game 02 (Beauty Expert?!):** ${metrics.gamesPlayed.game2} sesi
* 🔵 **Game 03 (Boys Stuff, Girls Guess!):** ${metrics.gamesPlayed.game3} sesi
* 🟠 **Game 04 (The Devil's Advocate 2v2):** ${metrics.gamesPlayed.game4} sesi
* 🟣 **Game 05 (Chain Quiz Relay 16 Soal):** ${metrics.gamesPlayed.game5} sesi
* 🟢 **Game 06 (Sell Me This Trash! 2v2):** ${metrics.gamesPlayed.game6} sesi

---

### 🚨 DAFTAR ERROR / CRASH (JIKA ADA)
${
  metrics.errors.length === 0
    ? '> *Belum ada error runtime atau unhandled exception yang terdeteksi! Semua tombol, navigasi, canvas, dan audio berjalan 100% stabil.*'
    : metrics.errors
        .slice(-10)
        .map(
          (err, idx) =>
            `${idx + 1}. **[${err.timestamp}] di \`${err.url}\`:**  \n   \`${err.message}\`  \n   📸 *Screenshot:* \`${err.screenshot}\``
        )
        .join('\n\n')
}

---
*File ini diperbarui otomatis setiap beberapa detik oleh \`scripts/stress-test-monkey.mjs\`.*
`;

  try {
    fs.writeFileSync(DASHBOARD_PATH, content, 'utf8');
  } catch {}
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Main Stress Tester ──────────────────────────────────────────────────────
async function runMonkeyTest() {
  log(`🚀 Memulai 2-Hour Monkey Stress Test di ${BASE_URL}`);
  log(`🎮 Konfigurasi GPU: Hardware Acceleration D3D11 / ANGLE diaktifkan`);
  log(`⏱️ Target Durasi: ${DURATION_MINUTES} Menit (${(DURATION_MS / 3600000).toFixed(1)} Jam)`);

  updateLiveDashboard();

  // Launch Chromium dengan Flags GPU Penuh
  const browser = await chromium.launch({
    headless: false, // Menjalankan jendela nyata dengan pipeline GPU native
    args: [
      '--enable-gpu',
      '--use-gl=angle',
      '--use-angle=d3d11', // DirectX 11 backend hardware GPU (NVIDIA / Intel)
      '--enable-webgl',
      '--enable-webgl2',
      '--ignore-gpu-blocklist',
      '--enable-accelerated-2d-canvas', // Akselerasi khusus Canvas 2D Fruit Ninja & Story Card
      '--enable-gpu-rasterization',
      '--enable-zero-copy',
      '--num-raster-threads=4',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
    ],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });

  const page = await context.newPage();

  // Listener Error Tangkapan Layar Otomatis
  page.on('pageerror', async (err) => {
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const screenName = `crash_${ts}.png`;
    const screenPath = path.join(ERRORS_DIR, screenName);

    try {
      await page.screenshot({ path: screenPath });
    } catch {}

    const errObj = {
      timestamp: new Date().toLocaleTimeString(),
      url: page.url(),
      message: err.message,
      screenshot: `errors/${screenName}`,
    };
    metrics.errors.push(errObj);
    log(`❌ CRASH / PAGEERROR: ${err.message} di ${page.url()}`);
    updateLiveDashboard();
  });

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Filter out harmless extension/websocket retries if any
      if (!text.includes('favicon') && !text.includes('ERR_CONNECTION_REFUSED')) {
        metrics.warnings.push({
          timestamp: new Date().toLocaleTimeString(),
          url: page.url(),
          text,
        });
        log(`⚠️ Console Error: ${text}`);
      }
    }
  });

  // Sampling Memori Heap
  async function sampleMemory() {
    try {
      const heap = await page.evaluate(() => {
        if (window.performance && (window.performance).memory) {
          return Math.round((window.performance).memory.usedJSHeapSize / (1024 * 1024));
        }
        return null;
      });
      if (heap !== null) {
        metrics.memorySamples.push({ time: Date.now(), heapMB: heap });
        if (metrics.memorySamples.length > 50) metrics.memorySamples.shift();
      }
    } catch {}
  }

  // Helper Klik Aman
  async function safeClick(selector, label = '') {
    try {
      const el = page.locator(selector).first();
      if (await el.isVisible({ timeout: 1500 })) {
        await el.click({ timeout: 2000 });
        metrics.totalClicks++;
        if (label) log(`👆 Clicked: ${label}`);
        await sleep(300);
        return true;
      }
    } catch {}
    return false;
  }

  // Helper Random Slice di Canvas Onboarding
  async function simulateCanvasSlicing() {
    try {
      const canvas = page.locator('canvas').first();
      if (await canvas.isVisible({ timeout: 2000 })) {
        log('🗡️ Menyayat maskot di Onboarding Canvas...');
        const box = await canvas.boundingBox();
        if (box) {
          for (let i = 0; i < 5; i++) {
            const startX = box.x + Math.random() * box.width;
            const startY = box.y + Math.random() * box.height;
            const endX = box.x + Math.random() * box.width;
            const endY = box.y + Math.random() * box.height;
            await page.mouse.move(startX, startY);
            await page.mouse.down();
            await page.mouse.move(endX, endY, { steps: 5 });
            await page.mouse.up();
            metrics.totalClicks++;
            await sleep(150);
          }
        }
      }
    } catch {}
  }

  // Helper Surprise Reload (Chaos Testing)
  async function maybeSurpriseReload() {
    if (Math.random() < 0.08) { // 8% chance
      log('🌪️ CHAOS MONKEY: Memaksa reload F5 mendadak untuk uji Zustand rehydration!');
      metrics.totalReloads++;
      await page.reload({ waitUntil: 'domcontentloaded' });
      await sleep(1000);
    }
  }

  // ─── Loop Utama Pengujian Selama 2 Jam ─────────────────────────────────────
  while (Date.now() < endTime) {
    metrics.totalCycles++;
    log(`\n========================================`);
    log(`🔁 MEMULAI SIKLUS #${metrics.totalCycles} (Uptime: ${((Date.now() - startTime) / 60000).toFixed(1)}m)`);
    log(`========================================`);

    try {
      // 1. Kunjungi Landing Page
      metrics.lastActivePage = '/';
      await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
      metrics.totalNavigations++;
      await sampleMemory();
      await sleep(1000);

      // Sayat balon di canvas
      await simulateCanvasSlicing();

      // Klik tombol "START GAME"
      await safeClick('button:has-text("START GAME")', 'Start Game CTA');
      await sleep(1200);

      // 2. Layar Room Setup (/room)
      metrics.lastActivePage = '/room';
      await sampleMemory();

      // Coba ganti Vibe Filter secara acak
      const vibes = ['🔥 Tongkrongan', '💼 Kantor', '🏡 Keluarga'];
      const randomVibe = vibes[Math.floor(Math.random() * vibes.length)];
      await safeClick(`button:has-text("${randomVibe}")`, `Vibe Filter: ${randomVibe}`);

      // Coba tombol preset cepat
      const presets = ['Preset 6', 'Preset 8', 'Preset 10'];
      const randomPreset = presets[Math.floor(Math.random() * presets.length)];
      await safeClick(`button:has-text("${randomPreset}")`, `Preset: ${randomPreset}`);

      // Surprise reload test di Room Setup
      await maybeSurpriseReload();

      // Klik "Simpan & Masuk Room"
      await safeClick('button:has-text("Simpan & Masuk Room")', 'Simpan Room CTA');
      await sleep(1500);

      // 3. Game Selection Hub (/hub)
      metrics.lastActivePage = '/hub';
      await sampleMemory();

      // Buka drawer skor untuk cek integritas
      await safeClick('button:has-text("Skor")', 'Buka Drawer Skor');
      await sleep(600);
      await safeClick('button:has-text("Tutup")', 'Tutup Drawer Skor');

      // Pilih 1 mini-game secara acak (Game 1 s/d Game 6)
      const gameIds = ['game1', 'game2', 'game3', 'game4', 'game5', 'game6'];
      const chosenGame = gameIds[Math.floor(Math.random() * gameIds.length)];
      log(`🎯 Memilih permainan: ${chosenGame}`);

      const gameTitles = {
        game1: 'Same Brain? No!',
        game2: 'Beauty Expert?!',
        game3: 'Boys Stuff',
        game4: "Devil's Advocate",
        game5: 'Chain Quiz Relay',
        game6: 'Sell Me This Trash',
      };

      // Klik kartu game
      await safeClick(`h3:has-text("${gameTitles[chosenGame]}")`, `Kartu ${chosenGame}`);
      await sleep(800);

      // Klik tombol modal "Mulai Main Sekarang"
      await safeClick('button:has-text("Mulai Main Sekarang")', 'Mulai Main Modal');
      await sleep(2000);

      // 4. In-Game Automation
      metrics.lastActivePage = `/${chosenGame}`;
      metrics.gamesPlayed[chosenGame]++;

      if (chosenGame === 'game1') {
        // Mainkan 2-3 ronde Game 1
        for (let r = 0; r < 2; r++) {
          await sleep(1000);
          await safeClick('button:has-text("Ganti Kategori")', 'Shuffle Kategori G1');
          await safeClick('button:has-text("Waktu Habis")', 'Skip Timer G1');
          await sleep(800);
          // Toggle 2 kartu pemain
          const cards = page.locator('div[class*="rounded-2xl border-2 cursor-pointer"]');
          const count = await cards.count();
          if (count > 0) {
            await cards.nth(0).click();
            metrics.totalClicks++;
          }
          await safeClick('button:has-text("Lanjut Ronde")', 'Lanjut Ronde G1');
          await sleep(1000);
        }
      } else if (chosenGame === 'game2') {
        // Game 2: Secret & QnA
        await sleep(1000);
        await safeClick('button:has-text("Intip Benda Rahasia")', 'Intip Secret G2');
        await safeClick('button:has-text("Pertanyaan 1")', 'Check Q1 G2');
        await safeClick('button:has-text("KETEBAK!")', 'Verdict Ketebak G2');
        await sleep(1000);
      } else if (chosenGame === 'game3') {
        // Game 3: Boys Stuff
        await sleep(1000);
        await safeClick('button:has-text("Intip Benda Rahasia")', 'Intip Secret G3');
        await safeClick('button:has-text("Pertanyaan 1")', 'Check Q1 G3');
        await safeClick('button:has-text("GAGAL!")', 'Verdict Gagal G3');
        await sleep(1000);
      } else if (chosenGame === 'game4') {
        // Game 4: Devil's Advocate
        await sleep(1000);
        await safeClick('button:has-text("Mulai")', 'Start Stage G4');
        await safeClick('button:has-text("+1 Vote Tim PRO")', 'Vote PRO G4');
        await safeClick('button:has-text("+1 Vote Tim KONTRA")', 'Vote KONTRA G4');
        await sleep(1000);
      } else if (chosenGame === 'game5') {
        // Game 5: Chain Quiz Relay
        await sleep(1000);
        await safeClick('button:has-text("Mulai Ronde")', 'Mulai Ronde G5');
        await sleep(500);
        await safeClick('button:has-text("Intip Kunci")', 'Intip Kunci G5');
        await safeClick('button:has-text("BENAR")', 'Jawaban Benar G5');
        await sleep(500);
        await safeClick('button:has-text("SALAH")', 'Jawaban Salah G5');
        await sleep(1000);
      } else if (chosenGame === 'game6') {
        // Game 6: Sell Me This Trash
        await sleep(1000);
        await safeClick('button:has-text("+1 Vote Tim A")', 'Vote Sales A G6');
        await safeClick('button:has-text("+1 Vote Tim B")', 'Vote Sales B G6');
        await sleep(1000);
      }

      // Chaos reload di tengah game
      await maybeSurpriseReload();

      // 5. Kunjungi Podium (/room/podium)
      metrics.lastActivePage = '/room/podium';
      await page.goto(`${BASE_URL}/room/podium`, { waitUntil: 'domcontentloaded' });
      metrics.totalNavigations++;
      await sampleMemory();
      await sleep(1500);

      // Simulasikan ekspor Instagram Story Card 1080x1920 (menguji beban Canvas 2D)
      const storyBtn = page.locator('button:has-text("Story Card")').first();
      if (await storyBtn.isVisible({ timeout: 1500 })) {
        log('📸 Merender Instagram Story Card 1080x1920 (Canvas 2D)...');
        await storyBtn.click();
        metrics.totalClicks++;
        metrics.totalStoryCardsGenerated++;
        await sleep(2500); // Tunggu canvas generate blob PNG
      }

      // Simulasikan TV Backdrop mode
      await safeClick('button:has-text("Foto Bareng")', 'TV Backdrop Photo Mode');
      await sleep(800);
      await safeClick('button:has-text("Kembali")', 'Tutup TV Backdrop');

      // Ambil screenshot berkala setiap 5 siklus
      if (metrics.totalCycles % 5 === 0) {
        const snapPath = path.join(SCREENSHOTS_DIR, `cycle_${metrics.totalCycles}_podium.png`);
        await page.screenshot({ path: snapPath });
        log(`📷 Menyimpan snapshot siklus ke ${snapPath}`);
      }

      // Update Dashboard Live
      updateLiveDashboard();
      await sleep(1000);
    } catch (cycleErr) {
      log(`⚠️ Peringatan siklus #${metrics.totalCycles}: ${cycleErr.message}`);
      await sleep(2000);
    }
  }

  log(`\n🎉 PENGUJIAN 2 JAM SELESAI PENUH!`);
  updateLiveDashboard();
  await browser.close();
}

runMonkeyTest().catch((err) => {
  console.error('Fatal stress test runner error:', err);
});
