import { chromium } from 'playwright';

// Parse CLI arguments: --code=RUAR --name="Budi Bot" --url=http://localhost:5173
const args = process.argv.slice(2);
function getArg(name, defaultValue) {
  const prefix = `--${name}=`;
  const found = args.find((a) => a.startsWith(prefix));
  return found ? found.slice(prefix.length) : defaultValue;
}

const ROOM_CODE = (getArg('code', 'RUAR')).toUpperCase();
const BOT_NAME = getArg('name', 'Budi (Bot 🤖)');
const BASE_URL = getArg('url', 'http://localhost:5173');

const G1_ANSWERS = [
  'Nasi Goreng Spesial Telur',
  'Martabak Manis Keju Coklat',
  'Mie Ayam Bakso Urat',
  'Kopi Susu Gula Aren',
  'Seblak Pedas Level 5',
  'Es Teh Manis Jumbo',
  'Ayam Geprek Sambal Bawang',
  'Sate Ayam Madura',
];

console.log(`🤖 Memulai Playwright Companion Bot...`);
console.log(`🎯 Room Target: ${ROOM_CODE}`);
console.log(`👤 Nama Bot: ${BOT_NAME}`);
console.log(`🌐 Target URL: ${BASE_URL}`);

async function run() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-blink-features=AutomationControlled'],
  });

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // Mobile Viewport (iPhone 14)
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
  });

  const page = await context.newPage();

  const joinUrl = `${BASE_URL}/join?code=${ROOM_CODE}`;
  console.log(`📲 Membuka halaman join: ${joinUrl}`);
  await page.goto(joinUrl, { waitUntil: 'networkidle' });

  // 1. Join room: check if input name is available
  try {
    await page.waitForTimeout(1000);

    // Look for manual name input or click "+ Nama saya belum ada di TV"
    const customNameToggle = page.locator('text=+ Nama saya belum ada di TV');
    if (await customNameToggle.isVisible({ timeout: 2000 })) {
      await customNameToggle.click();
      await page.waitForTimeout(500);
    }

    const nameInput = page.locator('input[placeholder*="nama kamu"]');
    if (await nameInput.isVisible({ timeout: 3000 })) {
      await nameInput.fill(BOT_NAME);
    }

    // Click submit button
    const joinButton = page.locator('button:has-text("Masuk ke Room")');
    await joinButton.click();
    console.log(`✅ Bot berhasil bergabung ke room! Menunggu permainan...`);
  } catch (err) {
    console.warn(`Join error / already joined:`, err.message);
  }

  // 2. Continuous gameplay automation loop
  while (true) {
    try {
      await page.waitForTimeout(1500);

      // A. Game 1: Input text & submit
      const g1Input = page.locator('input[placeholder*="Ketik 1 jawaban unik"]');
      if (await g1Input.isVisible({ timeout: 500 })) {
        const isAlreadyLocked = await page.locator('text=Jawabanmu Terkunci').isVisible();
        if (!isAlreadyLocked) {
          const randomAns = G1_ANSWERS[Math.floor(Math.random() * G1_ANSWERS.length)];
          console.log(`📝 Bot Game 1: Mengetik "${randomAns}"...`);
          await page.waitForTimeout(3000); // 3s delay
          await g1Input.fill(randomAns);

          const lockButton = page.locator('button:has-text("Kunci Jawaban Unik")');
          if (await lockButton.isVisible()) {
            await lockButton.click();
            await page.waitForTimeout(600);
            const confirmBtn = page.locator('button:has-text("Ya, Kunci Sekarang")');
            if (await confirmBtn.isVisible({ timeout: 1500 })) {
              await confirmBtn.click();
              console.log(`🔒 Bot Game 1: Jawaban terkunci.`);
            }
          }
        }
      }

      // B. Game 4 / 6: Voting
      const voteTeamA = page.locator('button:has-text("Vote Tim A")');
      if (await voteTeamA.isVisible({ timeout: 500 })) {
        const hasVoted = await page.locator('text=Voting Kamu Terkirim').isVisible();
        if (!hasVoted) {
          console.log(`🗳️ Bot: Voting Tim A...`);
          await page.waitForTimeout(2500);
          await voteTeamA.click();
          await page.waitForTimeout(500);
          const confirmVote = page.locator('button:has-text("Ya, Kirim Vote")');
          if (await confirmVote.isVisible({ timeout: 1500 })) {
            await confirmVote.click();
          }
        }
      }

      // C. Game 5: Cheering
      const cheerBtn = page.locator('button:has-text("Bakar Semangat")');
      if (await cheerBtn.isVisible({ timeout: 500 })) {
        await cheerBtn.click();
        await page.waitForTimeout(3000);
      }
    } catch {
      // Loop seamlessly
    }
  }
}

run().catch((err) => {
  console.error('Fatal bot error:', err);
  process.exit(1);
});
