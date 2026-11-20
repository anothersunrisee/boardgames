import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, RotateCcw, Users, Crown, Home, UserPlus } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { GameMascotBot } from '../components/characters/GameMascotBot';
import { PlayerProfileAvatar } from '../components/characters/PlayerProfileAvatar';
import { ConfettiShower } from '../components/motion/ConfettiShower';
import { HostUtilityBar } from '../components/HostUtilityBar';
import { PunishmentModal } from '../components/PunishmentModal';
import { CHARACTER_PACK, getCharacterById } from '../assets-library/characters';
import { FluentEmoji } from '../components/ui/FluentEmoji';
import { sfx } from '../assets-library/soundEngine';

export default function RoomPodium() {
  const navigate = useNavigate();
  const { roomName, players, resetRoomScores } = useGameStore();
  const [showPunishment, setShowPunishment] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [podiumRevealKey, setPodiumRevealKey] = useState(1);

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
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E24] px-4 py-8 md:py-12 flex flex-col justify-between relative overflow-hidden">
      {/* 60fps Confetti Shower */}
      <ConfettiShower active />

      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col relative z-20">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            className="text-xs font-bold text-[#64616C] hover:text-[#1E1E24] flex items-center gap-1.5 cursor-pointer py-1 px-3 rounded-full hover:bg-black/5 transition-colors"
            onClick={() => {
              sfx.playPop();
              navigate('/hub');
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Menu Game</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                sfx.playFanfare();
                setPodiumRevealKey((k) => k + 1);
              }}
              className="text-xs font-bold px-3 py-1.5 rounded-full bg-white border border-[#1E1E24]/10 hover:bg-[#FAF7F2] flex items-center gap-1.5 shadow-xs cursor-pointer transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay Podium</span>
            </button>

            <span className="font-display text-xs px-3.5 py-1.5 rounded-full bg-[#F59E0B] text-white font-bold tracking-wide flex items-center gap-1.5 shadow-xs">
              <Trophy className="w-3.5 h-3.5" />
              <span>PODIUM JUARA ROOM</span>
            </span>
          </div>
        </div>

        {/* Room Title */}
        <div className="text-center mb-6">
          <span className="text-xs font-black uppercase tracking-wider text-[#64616C]">
            HASIL AKHIR TOURNAMENT • {roomName}
          </span>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-[#1E1E24] mt-1 flex items-center justify-center gap-2">
            <span>Siapa Juara Party Malam Ini?</span>
            <FluentEmoji name="crown" variant="3d" size={40} />
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-[#64616C] mt-1">
            Skor kumulatif perorangan dari seluruh mini-game yang telah dimainkan
          </p>
        </div>

        {/* Staggered 1-2-3 Podium Pedestals Card */}
        <div
          key={podiumRevealKey}
          className="rounded-[36px] bg-[#1E1E24] text-white p-6 sm:p-8 mb-6 relative overflow-hidden shadow-[0_12px_0_rgba(30,30,36,0.16)]"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBBF24] text-[#1E1E24] text-[11px] font-extrabold uppercase">
              <Crown className="w-3.5 h-3.5" />
              <span>TOP 3 PODIUM JUARA</span>
            </span>
          </div>

          <div className="grid grid-cols-3 items-end gap-2 sm:gap-4 max-w-2xl mx-auto pt-6 pb-2">
            {/* RANK 2 (Left) - reveals 2nd */}
            {second ? (
              (() => {
                const char2 = getCharacterById(second.avatarId || 'c01');
                return (
                  <div className="flex flex-col items-center">
                    <motion.div
                      initial={{ opacity: 0, y: 30, scale: 0.7 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.75, type: 'spring', stiffness: 220, damping: 16 }}
                      className="flex flex-col items-center mb-2 text-center"
                    >
                      <GameMascotBot character={char2} size={78} mood="happy" />
                      <p className="font-display font-bold text-sm sm:text-lg mt-1 leading-tight truncate w-full">
                        {second.name}
                      </p>
                      <span className="text-[10px] text-white/70 font-semibold truncate w-full">
                        {second.kubu}
                      </span>
                      <span className="mt-1 px-2.5 py-0.5 rounded-full bg-white text-[#1E1E24] font-display font-bold text-xs sm:text-sm">
                        {second.score} pts
                      </span>
                    </motion.div>

                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 120 }}
                      transition={{ delay: 0.55, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      className="w-full rounded-t-[24px] bg-[#FAF7F2] text-[#1E1E24] flex flex-col items-center justify-start pt-3.5 shadow-inner overflow-hidden"
                    >
                      <span className="w-9 h-9 rounded-full bg-[#1E1E24] text-white font-display text-lg font-bold flex items-center justify-center">
                        2
                      </span>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider mt-1.5 text-[#64616C]">
                        RUNNER UP
                      </span>
                    </motion.div>
                  </div>
                );
              })()
            ) : <div />}

            {/* RANK 1 (Center) - reveals LAST for dramatic hype */}
            {winner ? (
              (() => {
                const char1 = getCharacterById(winner.avatarId || 'c17');
                return (
                  <div className="flex flex-col items-center">
                    <motion.div
                      initial={{ opacity: 0, y: 40, scale: 0.5 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 1.35, type: 'spring', stiffness: 240, damping: 15 }}
                      className="flex flex-col items-center mb-2 text-center"
                    >
                      <GameMascotBot character={char1} size={98} mood="winner" showCrown />
                      <p className="font-display font-bold text-base sm:text-xl mt-1 text-[#FBBF24] leading-tight truncate w-full flex items-center justify-center gap-1.5">
                        <span>{winner.name}</span>
                        <FluentEmoji name="crown" variant="3d" size={24} />
                      </p>
                      <span className="text-[11px] text-white/75 font-semibold truncate w-full">
                        {winner.kubu}
                      </span>
                      <span className="mt-1 px-3.5 py-0.5 rounded-full bg-[#FBBF24] text-[#1E1E24] font-display font-bold text-xs sm:text-base shadow-md">
                        {winner.score} pts
                      </span>
                    </motion.div>

                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 168 }}
                      transition={{ delay: 1.15, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                      className="w-full rounded-t-[28px] bg-[#FBBF24] text-[#1E1E24] flex flex-col items-center justify-start pt-4 shadow-lg overflow-hidden"
                    >
                      <span className="w-11 h-11 rounded-full bg-[#1E1E24] text-[#FBBF24] font-display text-xl font-bold flex items-center justify-center shadow-md">
                        1
                      </span>
                      <span className="text-xs font-extrabold uppercase tracking-wider mt-1.5">
                        CHAMPION
                      </span>
                      <Trophy className="w-5 h-5 mt-1.5 opacity-60" />
                    </motion.div>
                  </div>
                );
              })()
            ) : <div />}

            {/* RANK 3 (Right) - reveals 1st */}
            {third ? (
              (() => {
                const char3 = getCharacterById(third.avatarId || 'c04');
                return (
                  <div className="flex flex-col items-center">
                    <motion.div
                      initial={{ opacity: 0, y: 24, scale: 0.7 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.25, type: 'spring', stiffness: 220, damping: 16 }}
                      className="flex flex-col items-center mb-2 text-center"
                    >
                      <GameMascotBot character={char3} size={72} mood="idle" />
                      <p className="font-display font-bold text-sm sm:text-lg mt-1 leading-tight truncate w-full">
                        {third.name}
                      </p>
                      <span className="text-[10px] text-white/70 font-semibold truncate w-full">
                        {third.kubu}
                      </span>
                      <span className="mt-1 px-2.5 py-0.5 rounded-full bg-[#FFE8DF] text-[#1E1E24] font-display font-bold text-xs sm:text-sm">
                        {third.score} pts
                      </span>
                    </motion.div>

                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 88 }}
                      transition={{ delay: 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="w-full rounded-t-[24px] bg-[#EC5A29] text-white flex flex-col items-center justify-start pt-3 overflow-hidden"
                    >
                      <span className="w-8 h-8 rounded-full bg-[#1E1E24] text-white font-display text-base font-bold flex items-center justify-center">
                        3
                      </span>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider mt-1 opacity-90">
                        3RD
                      </span>
                    </motion.div>
                  </div>
                );
              })()
            ) : <div />}
          </div>
        </div>

        {/* Full Room Standings Table with Player Avatars */}
        <Card className="mb-6 p-5 bg-white shadow-xs rounded-[28px] border-2 border-[#1E1E24]/10">
          <p className="font-display text-base font-bold text-[#1E1E24] mb-3.5 flex items-center justify-between">
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
              const char = getCharacterById(player.avatarId || CHARACTER_PACK[idx % CHARACTER_PACK.length].id);

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
                    <PlayerProfileAvatar
                      character={char}
                      size={36}
                      mood={isFirst ? 'winner' : 'idle'}
                    />
                    <div>
                      <p className="font-display text-sm font-bold text-[#1E1E24] flex items-center gap-1.5">
                        <span>{player.name}</span>
                        {isFirst && <FluentEmoji name="crown" variant="3d" size={16} />}
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
            <div className="p-4 rounded-[28px] bg-[#FFE8DF] border-2 border-[#EC5A29] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <PlayerProfileAvatar
                  character={getCharacterById(juruKunci.avatarId || 'c11')}
                  size={46}
                  mood="dizzy"
                />
                <div>
                  <span className="text-[10px] font-black uppercase text-[#EC5A29] px-2 py-0.5 rounded-full bg-[#EC5A29]/15 inline-flex items-center gap-1">
                    <FluentEmoji name="collision" variant="3d" size={14} />
                    <span>SI JURU KUNCI</span>
                  </span>
                  <p className="font-display text-base font-bold text-[#1E1E24] mt-0.5">
                    {juruKunci.name} ({juruKunci.score} pts)
                  </p>
                  <p className="text-xs text-[#64616C] font-semibold">
                    Poin paling rendah di room malam ini! Wajib dapat kartu hukuman:
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPunishment(true)}
                className="px-4 py-2.5 rounded-xl bg-[#EC5A29] text-white font-display text-xs font-bold hover:bg-[#D44A1D] cursor-pointer shrink-0 shadow-xs transition flex items-center gap-1.5"
              >
                <FluentEmoji name="joker" variant="3d" size={18} />
                <span>Acak Kartu Hukuman</span>
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
              variant="cream"
              fullWidth
              size="md"
              onClick={() => {
                sfx.playPop();
                navigate('/hub');
              }}
            >
              <Home className="w-4 h-4" />
              <span>Menu Game</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Interactive 3D Flip Punishment Modal */}
      <PunishmentModal
        open={showPunishment}
        onClose={() => setShowPunishment(false)}
        loserName={juruKunci?.name}
      />

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-[32px] bg-white p-6 border-3 border-[#1E1E24] shadow-xl text-center">
            <div className="w-12 h-12 rounded-full bg-[#FFE4E2] text-[#F04438] flex items-center justify-center mx-auto mb-3">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl font-bold mb-1">Reset Semua Poin Room?</h3>
            <p className="text-xs text-[#64616C] font-semibold mb-5">
              Poin seluruh pemain akan kembali ke 0. Nama & kubu pemain tetap tersimpan.
            </p>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border-2 border-[#1E1E24]/15 font-bold text-xs text-[#64616C] hover:bg-black/5"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleResetScores}
                className="flex-1 py-2.5 rounded-xl bg-[#F04438] text-white font-bold text-xs shadow-xs hover:bg-[#D92D20]"
              >
                Ya, Reset
              </button>
            </div>
          </div>
        </div>
      )}

      <HostUtilityBar />
    </div>
  );
}
