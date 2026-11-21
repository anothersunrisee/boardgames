import type { Player, RoomVibe } from '../store/useGameStore';
import type { SuperlativeAward } from './partyWrapped';

export interface StoryCardPayload {
  roomName: string;
  roomVibe: RoomVibe;
  players: Player[];
  awards: SuperlativeAward[];
}

/**
 * Menghasilkan kartu gambar 1080x1920 (Instagram Story 9:16)
 * menggunakan HTML5 Canvas 2D murni.
 */
export async function generateStoryCardPng(payload: StoryCardPayload): Promise<string> {
  const { roomName, roomVibe, players, awards } = payload;
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not available');

  // Background Gradient
  const bgGradient = ctx.createLinearGradient(0, 0, 1080, 1920);
  bgGradient.addColorStop(0, '#1E1E24');
  bgGradient.addColorStop(0.4, '#2A2035');
  bgGradient.addColorStop(1, '#0F0E17');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, 1080, 1920);

  // Decorative Circles
  ctx.fillStyle = 'rgba(216, 49, 126, 0.15)';
  ctx.beginPath();
  ctx.arc(900, 200, 260, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(37, 104, 239, 0.12)';
  ctx.beginPath();
  ctx.arc(150, 1500, 320, 0, Math.PI * 2);
  ctx.fill();

  // Header App Title
  ctx.fillStyle = '#FAF7F2';
  ctx.font = 'bold 36px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('PARTYHUB INDONESIA 🇮🇩', 540, 140);

  // Vibe Badge
  const vibeLabel =
    roomVibe === 'office'
      ? '💼 KANTOR / SFW'
      : roomVibe === 'family'
      ? '🏡 KELUARGA & ARISAN'
      : '🔥 TONGKRONGAN CHAOS';
  ctx.fillStyle = '#F59E0B';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText(vibeLabel, 540, 190);

  // Room Title
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 64px sans-serif';
  const displayRoomName = roomName.length > 25 ? `${roomName.slice(0, 23)}...` : roomName;
  ctx.fillText(displayRoomName, 540, 290);

  // Podium Container Box
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.beginPath();
  ctx.roundRect(80, 360, 920, 680, 36);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Top 3 Players
  const sorted = [...players].sort((a, b) => b.score - a.score);
  const top1 = sorted[0];
  const top2 = sorted[1];
  const top3 = sorted[2];

  // Helper draw podium pillar
  const drawPodium = (
    player: Player | undefined,
    rank: number,
    x: number,
    w: number,
    h: number,
    color: string,
    label: string
  ) => {
    if (!player) return;
    const y = 1000 - h;

    // Pillar
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, [24, 24, 0, 0]);
    ctx.fill();

    // Rank number
    ctx.fillStyle = '#1E1E24';
    ctx.font = 'bold 54px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`#${rank}`, x + w / 2, y + 80);

    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(label, x + w / 2, y + 120);

    // Player name & score above pillar
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 34px sans-serif';
    const name = player.name.length > 10 ? `${player.name.slice(0, 8)}..` : player.name;
    ctx.fillText(name, x + w / 2, y - 50);

    ctx.fillStyle = '#FBBF24';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(`${player.score} Pts`, x + w / 2, y - 15);
  };

  // Draw #2, #1, #3
  drawPodium(top2, 2, 140, 240, 320, '#E5E7EB', 'RUNNER UP');
  drawPodium(top1, 1, 420, 240, 420, '#F59E0B', 'CHAMPION 👑');
  drawPodium(top3, 3, 700, 240, 260, '#F97316', '3RD PLACE');

  // Superlative Awards Section
  ctx.fillStyle = '#FAF7F2';
  ctx.font = 'bold 42px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✨ PENGHARGAAN SPESIAL PARTY ✨', 540, 1120);

  let startY = 1180;
  awards.slice(0, 3).forEach((award) => {
    // Card Box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.beginPath();
    ctx.roundRect(80, startY, 920, 150, 24);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.stroke();

    // Icon
    ctx.font = '48px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(award.icon, 120, startY + 95);

    // Title & Name
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText(`${award.playerName} — ${award.title}`, 200, startY + 65);

    // Description
    ctx.fillStyle = '#CBD5E1';
    ctx.font = 'normal 24px sans-serif';
    const desc = award.description.length > 55 ? `${award.description.slice(0, 52)}...` : award.description;
    ctx.fillText(desc, 200, startY + 110);

    startY += 175;
  });

  // Footer Branding & URL
  ctx.fillStyle = '#64748B';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Mainkan bareng teman & keluargamu di PartyHub Indonesia', 540, 1780);
  ctx.fillStyle = '#F59E0B';
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText('partyhub.id • Anti-Slop Indonesian Party Games', 540, 1825);

  return canvas.toDataURL('image/png');
}
