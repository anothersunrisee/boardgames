import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, RotateCcw, AlertTriangle, Users, Sparkles, Home, UserPlus } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { BlobMascot } from '../components/ui/BlobMascot';
import { HostUtilityBar } from '../components/HostUtilityBar';
import { PunishmentModal } from '../components/PunishmentModal';
import { sfx } from '../utils/sound';

export default function RoomPodium() {
  const navigate = useNavigate();
  const { roomName, players, resetRoomScores } = useGameStore();
  const [showPunishment, setShowPunishment] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    sfx.playFanfare();
  }, []);

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];
  const second = sortedPlayers[1];
  const third = sortedPlayers[2];
  const juruKunci = sortedPlayers[sortedPlayers.length - 1];

  const handleResetScores = () => {
    sfx.playPop();
    resetRoomScores();
    setShowResetConfirm(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E24] px-4 py-8 md:py-12 flex flex-col justify-between">
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            className="text-xs font-bold text-[#64616C] hover:text-[#1E1E24] flex items-center gap-1.5 cursor-pointer py-1 px-2.5 rounded-full hover:bg-black/5 transition-colors"
            onClick={() => {
              sfx.playPop();
              navigate('/');
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Menu Game</span>
          </button>

          <span className="font-display text-xs px-3.5 py-1.5 rounded-full bg-[#F59E0B] text-white font-bold tracking-wide flex items-center gap-1.5 shadow-xs">
            <Trophy className="w-3.5 h-3.5" />
            <span>PODIUM JUARA ROOM</span>
          </span>
        </div>

        {/* Room Title */}
        <div className="text-center mb-6">
          <span className="text-xs font-black uppercase tracking-wider text-[#64616C]">
            HASIL AKHIR TOURNAMENT • {roomName}
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-[#1E1E24] mt-1">
            Siapa Juara Party Malam Ini? 👑
          </h1>
          <p className="text-xs font-semibold text-[#64616C] mt-1">
            Skor kumulatif perorangan dari seluruh mini-game yang telah dimainkan
          </p>
        </div>

        {/* 🥇 MVP Podium Winner Card */}
        {winner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            className="p-6 md:p-8 rounded-[32px] bg-gradient-to-b from-[#FEF3C7] to-[#FDE68A] border-3 border-[#F59E0B] shadow-[0_10px_0_#D97706] text-center mb-6 relative overflow-hidden"
          >
            <div className="mb-2">
              <BlobMascot
                shape="scallop"
                mood="excited"
                color="#FCD34D"
                accentColor="#D97706"
                accessory="crown"
                size={120}
              />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F59E0B] text-white text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>JUARA 1 & MVP ROOM</span>
            </div>

            <h2 className="font-display text-3xl md:text-5xl font-extrabold text-[#1E1E24]">
              {winner.name} 👑
            </h2>

            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="px-3 py-1 rounded-full bg-white/70 font-display text-base font-bold text-[#B45309] shadow-xs">
                ⭐ {winner.score} Poin Kumulatif
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/50 text-xs font-bold text-[#64616C]">
                {winner.gender === 'cewek' ? '👧 Cewek' : '👦 Cowok'}
              </span>
            </div>
          </motion.div>
        )}

        {/* 🥈 & 🥉 Runner-Up Row */}
        {(second || third) && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            {second && (
              <div className="p-4 rounded-2xl bg-white border-2 border-[#1E1E24]/10 shadow-xs text-center">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#E5E7EB] text-[#4B5563]">
                  🥈 Peringkat 2
                </span>
                <p className="font-display text-lg font-bold text-[#1E1E24] mt-1.5">
                  {second.name}
                </p>
                <span className="inline-block px-3 py-0.5 rounded-full bg-[#FAF7F2] border border-[#1E1E24]/10 font-display text-sm font-bold text-[#1E1E24] mt-1">
                  {second.score} pts
                </span>
              </div>
            )}

            {third && (
              <div className="p-4 rounded-2xl bg-white border-2 border-[#1E1E24]/10 shadow-xs text-center">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#FED7AA] text-[#C2410C]">
                  🥉 Peringkat 3
                </span>
                <p className="font-display text-lg font-bold text-[#1E1E24] mt-1.5">
                  {third.name}
                </p>
                <span className="inline-block px-3 py-0.5 rounded-full bg-[#FAF7F2] border border-[#1E1E24]/10 font-display text-sm font-bold text-[#1E1E24] mt-1">
                  {third.score} pts
                </span>
              </div>
            )}
          </div>
        )}

        {/* Full Room Standings Table */}
        <Card className="mb-6 p-5 bg-white shadow-xs">
          <p className="font-display text-base font-bold text-[#1E1E24] mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#F59E0B]" />
              <span>Papan Klasemen Seluruh Pemain:</span>
            </span>
            <span className="text-xs font-semibold text-[#64616C]">
              {players.length} Pemain
            </span>
          </p>

          <div className="space-y-2">
            {sortedPlayers.map((player, idx) => {
              const isFirst = idx === 0;
              const isNegative = player.score < 0;

              return (
                <div
                  key={player.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between transition ${
                    isFirst
                      ? 'bg-[#FEF3C7] border-[#F59E0B]'
                      : 'bg-[#FAF7F2] border-[#1E1E24]/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-display text-sm font-bold w-6 text-center text-[#64616C]">
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="font-display text-sm font-bold text-[#1E1E24] flex items-center gap-1.5">
                        <span>{player.name}</span>
                        {isFirst && <span>👑</span>}
                      </p>
                      <p className="text-[11px] text-[#64616C] font-semibold">
                        {player.gender === 'cewek' ? '👧 Cewek' : '👦 Cowok'} • {player.kubu}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`font-display text-xs font-black px-3 py-1 rounded-full ${
                      isNegative
                        ? 'bg-[#F04438] text-white'
                        : isFirst
                        ? 'bg-[#F59E0B] text-white'
                        : 'bg-white border border-[#1E1E24]/10 text-[#1E1E24]'
                    }`}
                  >
                    {player.score > 0 ? `+${player.score}` : player.score} pts
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* 🃏 Hukuman Si Juru Kunci (Pemain Terbawah) */}
        {juruKunci && players.length > 1 && (
          <div className="mb-6">
            <div className="p-4 rounded-2xl bg-[#FFE8DF] border-2 border-[#EC5A29] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="text-center sm:text-left">
                <span className="text-[10px] font-black uppercase text-[#EC5A29] px-2 py-0.5 rounded-full bg-[#EC5A29]/15">
                  💀 SI JURU KUNCI
                </span>
                <p className="font-display text-base font-bold text-[#1E1E24] mt-0.5">
                  {juruKunci.name} ({juruKunci.score} pts)
                </p>
                <p className="text-xs text-[#64616C] font-semibold">
                  Poin paling rendah di room malam ini! Wajib dapat kartu hukuman:
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowPunishment(true)}
                className="px-4 py-2 rounded-xl bg-[#EC5A29] text-white font-display text-xs font-bold hover:bg-[#D44A1D] cursor-pointer shrink-0 shadow-xs transition"
              >
                🃏 Acak Kartu Hukuman
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 mt-auto">
          <Button
            variant="primary"
            fullWidth
            size="lg"
            onClick={() => setShowResetConfirm(true)}
          >
            <RotateCcw className="w-5 h-5" />
            <span>Mulai Musim Baru (Reset Semua Poin Room)</span>
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="cream"
              fullWidth
              size="md"
              onClick={() => {
                sfx.playPop();
                navigate('/room');
              }}
            >
              <UserPlus className="w-4 h-4" />
              <span>Edit Pemain</span>
            </Button>

            <Button
              variant="ink"
              fullWidth
              size="md"
              onClick={() => {
                sfx.playPop();
                navigate('/');
              }}
            >
              <Home className="w-4 h-4" />
              <span>Pilih Game Lain</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal to Reset Scores */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm bg-white rounded-3xl p-6 text-center border-2 border-[#1E1E24]/10 shadow-xl"
          >
            <div className="w-12 h-12 rounded-full bg-[#FFE8DF] text-[#EC5A29] flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-[#1E1E24]">
              Reset Seluruh Poin Room?
            </h3>
            <p className="text-xs text-[#64616C] font-semibold mt-1 mb-5">
              Semua skor pemain akan kembali ke 0 pts untuk memulai sesi permainan yang baru.
            </p>
            <div className="flex gap-2">
              <Button
                variant="cream"
                fullWidth
                size="md"
                onClick={() => setShowResetConfirm(false)}
              >
                Batal
              </Button>
              <Button
                variant="primary"
                fullWidth
                size="md"
                onClick={handleResetScores}
              >
                Ya, Reset Poin!
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      <PunishmentModal
        open={showPunishment}
        onClose={() => setShowPunishment(false)}
        loserName={juruKunci?.name}
      />

      <HostUtilityBar />
    </div>
  );
}
