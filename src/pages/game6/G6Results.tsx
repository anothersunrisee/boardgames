import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RotateCcw, Home, ArrowLeft, Sparkles, Trophy } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ScoreBoard } from '../../components/ScoreBoard';
import { BlobMascot } from '../../components/ui/BlobMascot';
import { ConfettiShower } from '../../components/motion/ConfettiShower';
import { PlayerProfileAvatar } from '../../components/characters/PlayerProfileAvatar';
import { HostUtilityBar } from '../../components/HostUtilityBar';
import { PunishmentModal } from '../../components/PunishmentModal';
import { FluentEmoji } from '../../components/ui/FluentEmoji';
import { sfx } from '../../utils/sound';

export default function G6Results() {
  const navigate = useNavigate();
  const { players, g6Matches, g6UndoMatch, g6ReplaySameTeams, g6ReshuffleTeams } = useGameStore();
  const [showPunishment, setShowPunishment] = useState(false);

  const handleUndo = () => {
    const success = g6UndoMatch();
    if (success) {
      sfx.playPop();
      navigate('/game6/match');
    }
  };

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];
  const bottom3 = sortedPlayers.length <= 3 ? sortedPlayers : sortedPlayers.slice(-3);

  useEffect(() => {
    sfx.playFanfare();
  }, []);

  // Kumpulkan semua nama pemain yang kalah duel 2v2
  const loserNames: string[] = [];
  g6Matches.forEach((m) => {
    const teamAPlayers = (m.teamAIds && m.teamAIds.length > 0)
      ? players.filter((p) => m.teamAIds.includes(p.id))
      : players.filter((p) => p.id === m.playerAId);
    const teamBPlayers = (m.teamBIds && m.teamBIds.length > 0)
      ? players.filter((p) => m.teamBIds.includes(p.id))
      : players.filter((p) => p.id === m.playerBId);

    if (m.winnerTeam === 'A' || m.winnerId === m.playerAId) {
      loserNames.push(...teamBPlayers.map((p) => p.name));
    } else if (m.winnerTeam === 'B' || m.winnerId === m.playerBId) {
      loserNames.push(...teamAPlayers.map((p) => p.name));
    } else if (m.winnerTeam === 'tie' || m.winnerId === 'tie') {
      loserNames.push(...teamAPlayers.map((p) => p.name), ...teamBPlayers.map((p) => p.name));
    }
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E24] px-4 py-8 md:py-12 flex flex-col justify-between relative overflow-hidden">
      <ConfettiShower particleCount={55} />
      <div className="max-w-xl mx-auto w-full flex-1 flex flex-col">
        {/* Top Header Back Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            className="text-xs font-bold text-[#64616C] hover:text-[#1E1E24] flex items-center gap-1.5 cursor-pointer py-1.5 px-3 rounded-full hover:bg-black/5 transition-colors border border-transparent hover:border-[#1E1E24]/10"
            onClick={() => {
              sfx.playPop();
              navigate('/hub');
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Pilih Game Lain</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleUndo}
              className="text-xs font-bold text-[#DC2626] hover:bg-[#FEE2E2] px-2.5 py-1 rounded-full border border-[#DC2626]/20 transition cursor-pointer"
              title="Undo hasil match terakhir"
            >
              ↩️ Undo Match
            </button>
            <span className="font-display text-xs px-3.5 py-1.5 rounded-full bg-[#65A30D] text-white font-bold tracking-wide shadow-xs flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" />
              <span>Pitch Duel Selesai</span>
            </span>
          </div>
        </div>

        {/* Mascot Winner Banner */}
        <motion.div
          className="text-center mb-6 flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
        >
          <div className="mb-2">
            <BlobMascot
              shape="diamond"
              mood="smug"
              color="#84CC16"
              accentColor="#4D7C0F"
              accessory="crown"
              size={110}
            />
          </div>

          <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#ECFCCB] text-[#65A30D] text-xs font-black uppercase tracking-wider mb-2 border border-[#65A30D]/20 shadow-xs">
            <FluentEmoji name="trophy" variant="3d" size={16} />
            <span>SELL ME THIS TRASH SELESAI</span>
          </span>

          <h1 className="font-display text-2xl md:text-3xl font-bold text-[#1E1E24]">
            Top Sales Absurd:
          </h1>
          <div className="flex items-center justify-center gap-3 mt-2 bg-white px-5 py-2.5 rounded-2xl border border-[#1E1E24]/10 shadow-sm">
            <PlayerProfileAvatar characterId={winner?.avatarId} size={44} name={winner?.name} />
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-display text-2xl md:text-3xl font-black text-[#65A30D]">
                  {winner?.name}
                </span>
                <FluentEmoji name="crown" variant="3d" size={28} />
              </div>
              <p className="text-xs font-bold text-[#64616C]">
                Total Skor: <span className="text-[#65A30D] font-black">{winner?.score} Poin Jualan</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Match History Recap */}
        <Card className="mb-6 p-5 bg-white shadow-xs border border-[#1E1E24]/10">
          <p className="font-display text-base font-bold text-[#1E1E24] mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#65A30D]" />
            <span>Rekap Duel Jualan (2v2 Duo Sales):</span>
          </p>
          <div className="space-y-3">
            {g6Matches.map((m) => {
              const teamAPlayers = (m.teamAIds && m.teamAIds.length > 0)
                ? players.filter((p) => m.teamAIds.includes(p.id))
                : players.filter((p) => p.id === m.playerAId);
              const teamBPlayers = (m.teamBIds && m.teamBIds.length > 0)
                ? players.filter((p) => m.teamBIds.includes(p.id))
                : players.filter((p) => p.id === m.playerBId);

              const isWinnerA = m.winnerTeam === 'A' || m.winnerId === m.playerAId;
              const isWinnerB = m.winnerTeam === 'B' || m.winnerId === m.playerBId;
              const isTie = m.winnerTeam === 'tie' || m.winnerId === 'tie';

              const winnerLabel = isTie
                ? 'Seri (Draw)'
                : isWinnerA
                ? `Duo Sales A (${teamAPlayers.map((p) => p.name).join(' & ')})`
                : `Duo Sales B (${teamBPlayers.map((p) => p.name).join(' & ')})`;

              return (
                <div
                  key={m.matchNumber}
                  className="p-3.5 rounded-2xl border-2 border-[#1E1E24]/10 bg-[#FAF7F2] shadow-xs"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-black uppercase text-[#65A30D]">
                      Match {m.matchNumber} • 2v2
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#65A30D]/15 text-[#3F6212] flex items-center gap-1">
                      <span>Menang:</span>
                      <strong className="font-black">{winnerLabel}</strong>
                    </span>
                  </div>

                  <p className="font-display text-sm font-bold text-[#1E1E24]">
                    "{m.pitchItem.prompt}"
                  </p>

                  <div className="flex items-center justify-between text-xs font-semibold text-[#64616C] mt-2 pt-2 border-t border-[#1E1E24]/10">
                    <span className={isWinnerA ? 'font-bold text-[#4D7C0F]' : ''}>
                      Duo A ({teamAPlayers.map((p) => p.name).join(' & ')}): {m.votesA} vote
                    </span>
                    <span className="text-xs font-black uppercase text-[#64616C]">VS</span>
                    <span className={isWinnerB ? 'font-bold text-[#4D7C0F]' : ''}>
                      Duo B ({teamBPlayers.map((p) => p.name).join(' & ')}): {m.votesB} vote
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Leaderboard */}
        <div className="mb-6">
          <ScoreBoard players={players} title="Papan Skor Sales Absurd" highlightId={winner?.id} />
        </div>

        {/* Zona Hukuman: 3 Pemain Terbawah */}
        {bottom3.length > 0 && players.length > 1 && (
          <div className="mb-6">
            <div className="p-4 rounded-[26px] bg-[#FFE8DF] border-2 border-[#EA580C] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div>
                <span className="text-xs font-black uppercase text-[#B93815] px-2.5 py-0.5 rounded-full bg-[#EA580C]/15 inline-flex items-center gap-1 mb-1.5">
                  <FluentEmoji name="fire" variant="3d" size={14} />
                  <span>3 PEMAIN TERBAWAH KENA HUKUMAN</span>
                </span>
                <p className="text-xs text-[#64616C] font-semibold mb-2">
                  3 sales dengan skor terendah wajib menerima kartu promosi absurd:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {bottom3.map((p) => {
                    const rank = sortedPlayers.indexOf(p) + 1;
                    return (
                      <div key={p.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-[#EA580C]/20 shadow-2xs">
                        <span className="font-display font-black text-xs text-[#DC2626]">#{rank}</span>
                        <PlayerProfileAvatar characterId={p.avatarId} size={20} name={p.name} />
                        <span className="font-display font-bold text-xs text-[#1E1E24]">{p.name}</span>
                        <span className="text-xs font-extrabold text-[#64616C]">({p.score} pt)</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPunishment(true)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#EA580C] text-white font-display text-xs font-bold hover:bg-[#C2410C] cursor-pointer shadow-xs transition flex items-center justify-center gap-1.5 shrink-0"
              >
                <FluentEmoji name="joker" variant="3d" size={18} />
                <span>Shuffle Hukuman 3 Terbawah</span>
              </button>
            </div>
          </div>
        )}

        {/* Replay Action Buttons */}
        <div className="space-y-2.5 mt-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <Button
              variant="cream"
              fullWidth
              size="lg"
              onClick={() => {
                sfx.playPop();
                g6ReplaySameTeams();
                navigate('/game6/match');
              }}
              className="border-2 border-[#65A30D] text-[#3F6212] hover:bg-[#ECFCCB]"
            >
              <RotateCcw className="w-4 h-4 text-[#65A30D]" />
              <span>Main Lagi (Kelompok Sama)</span>
            </Button>

            <Button
              variant="primary"
              fullWidth
              size="lg"
              onClick={() => {
                sfx.playPop();
                g6ReshuffleTeams();
                navigate('/game6/match');
              }}
              className="bg-[#65A30D] hover:bg-[#4D7C0F]"
            >
              <Sparkles className="w-4 h-4 text-[#BEF264]" />
              <span>Main Lagi (Acak Ulang Tim)</span>
            </Button>
          </div>

          <Button
            variant="ink"
            fullWidth
            size="lg"
            onClick={() => {
              sfx.playPop();
              navigate('/hub');
            }}
          >
            <Home className="w-5 h-5" />
            <span>Pilih Game Lain</span>
          </Button>
        </div>
      </div>

      <PunishmentModal
        open={showPunishment}
        onClose={() => setShowPunishment(false)}
        targetType="bottom3"
        targetPlayers={bottom3}
      />

      <HostUtilityBar onUndo={handleUndo} />
    </div>
  );
}
