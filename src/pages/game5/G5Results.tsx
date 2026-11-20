import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RotateCcw, Home, ArrowLeft, Users, Trophy, Check, X } from 'lucide-react';
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

export default function G5Results() {
  const navigate = useNavigate();
  const { players, g5Teams, autoStartGame5 } = useGameStore();
  const [showPunishment, setShowPunishment] = useState(false);
  const [selectedLoser, setSelectedLoser] = useState('');

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];

  useEffect(() => {
    sfx.playFanfare();
  }, []);

  const failedTeams = g5Teams.filter((t) => t.isFailed);

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
          <span className="font-display text-xs px-3.5 py-1.5 rounded-full bg-[#7C3AED] text-white font-bold tracking-wide shadow-xs flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5" />
            <span>Turnamen Selesai</span>
          </span>
        </div>

        {/* Mascot Winner Banner */}
        <motion.div
          className="text-center mb-6 flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
        >
          <div className="mb-2 relative">
            <BlobMascot
              shape="pentagon"
              mood="excited"
              color="#A78BFA"
              accentColor="#6D28D9"
              accessory="crown"
              size={110}
            />
          </div>

          <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#EDE9FE] text-[#7C3AED] text-xs font-black uppercase tracking-wider mb-2 border border-[#7C3AED]/20 shadow-xs">
            <FluentEmoji name="trophy" variant="3d" size={16} />
            <span>CERDAS CERMAT BERANTAI SELESAI</span>
          </span>

          <h1 className="font-display text-2xl md:text-3xl font-bold text-[#1E1E24]">
            Pemenang Tertinggi:
          </h1>
          <div className="flex items-center justify-center gap-3 mt-2 bg-white px-5 py-2 rounded-2xl border border-[#1E1E24]/10 shadow-sm">
            <PlayerProfileAvatar characterId={winner?.avatarId} size={44} name={winner?.name} />
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-display text-2xl md:text-3xl font-black text-[#7C3AED]">
                  {winner?.name}
                </span>
                <FluentEmoji name="crown" variant="3d" size={28} />
              </div>
              <p className="text-xs font-bold text-[#64616C]">
                Total Skor: <span className="text-[#158467] font-black">{winner?.score} Poin</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Team Performance Recap */}
        <Card className="mb-6 p-5 bg-white shadow-xs border border-[#1E1E24]/10">
          <p className="font-display text-base font-bold text-[#1E1E24] mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-[#7C3AED]" />
            <span>Hasil Rantai Tim:</span>
          </p>
          <div className="space-y-2.5">
            {g5Teams.map((team) => {
              const members = team.memberIds
                .map((id) => players.find((p) => p.id === id)?.name)
                .filter(Boolean)
                .join(', ');

              return (
                <div
                  key={team.id}
                  className={`p-3.5 rounded-2xl border-2 flex items-center justify-between transition-all ${
                    team.isPassed
                      ? 'bg-[#ECFDF5] border-[#12B76A]/40 shadow-xs'
                      : 'bg-[#FFF1F2] border-[#F04438]/30 shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-white ${
                        team.isPassed ? 'bg-[#12B76A]' : 'bg-[#F04438]'
                      }`}
                    >
                      {team.isPassed ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : (
                        <X className="w-4 h-4 stroke-[3]" />
                      )}
                    </div>
                    <div>
                      <p className="font-display text-sm font-bold text-[#1E1E24]">{team.name}</p>
                      <p className="text-xs text-[#64616C] font-semibold">{members}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`font-display text-xs font-black px-3 py-1 rounded-full inline-flex items-center gap-1 ${
                        team.isPassed
                          ? 'bg-[#12B76A] text-white'
                          : 'bg-[#F04438] text-white'
                      }`}
                    >
                      {team.isPassed ? 'LULUS (+6 pt)' : 'GAGAL (-2 pt)'}
                    </span>
                    <p className="text-[10px] font-bold text-[#64616C] mt-0.5">
                      {team.isPassed ? '10 Poin Tim' : '0 Poin Tim'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Leaderboard */}
        <div className="mb-6">
          <ScoreBoard players={players} title="Papan Skor Pemain Room" highlightId={winner?.id} />
        </div>

        {/* Punishment Card Button for Lost Teams */}
        {failedTeams.length > 0 && (
          <div className="mb-6">
            <button
              type="button"
              onClick={() => {
                const randomFailed = failedTeams[Math.floor(Math.random() * failedTeams.length)];
                setSelectedLoser(randomFailed.name);
                setShowPunishment(true);
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#FFF7ED] to-[#FFEDD5] border-2 border-[#EA580C] text-[#C2410C] hover:bg-[#FED7AA] font-display text-sm font-black flex items-center justify-center gap-2.5 shadow-sm hover:shadow-md cursor-pointer transition-all active:scale-[0.98]"
            >
              <FluentEmoji name="joker" variant="3d" size={24} />
              <span>Acak Kartu Hukuman untuk Tim yang Gagal!</span>
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 mt-auto">
          <Button
            variant="primary"
            fullWidth
            size="lg"
            onClick={() => {
              sfx.playPop();
              autoStartGame5();
              navigate('/game5/play');
            }}
          >
            <RotateCcw className="w-5 h-5" />
            <span>Main Lagi (Acak Tim & Soal Baru)</span>
          </Button>

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
        loserName={selectedLoser}
      />

      <HostUtilityBar />
    </div>
  );
}
