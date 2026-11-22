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
  const { players, g5Teams, g5ReplaySameTeams, g5ReshuffleTeams } = useGameStore();
  const [showPunishment, setShowPunishment] = useState(false);

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];

  useEffect(() => {
    sfx.playFanfare();
  }, []);

  // Tim Juara & Tim Kalah
  const sortedTeamsByScore = [...g5Teams].sort((a, b) => (b.teamScore || 0) - (a.teamScore || 0));
  const championTeam = sortedTeamsByScore[0];
  const failingTeam = sortedTeamsByScore[sortedTeamsByScore.length - 1] || g5Teams[0];
  const losingTeamMembers = failingTeam ? players.filter((p) => failingTeam.memberIds.includes(p.id)) : [];

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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mt-2">
            {/* Champion Team Card */}
            <div className="p-4 rounded-2xl bg-white border-2 border-[#7C3AED]/30 shadow-xs text-center flex flex-col items-center justify-between">
              <span className="text-xs font-black uppercase text-[#7C3AED] bg-[#EDE9FE] px-2.5 py-0.5 rounded-full mb-1">
                TIM JUARA 1
              </span>
              <p className="font-display text-xl font-black text-[#1E1E24]">
                {championTeam?.name}
              </p>
              <p className="text-xs font-bold text-[#158467] mt-1">
                Skor Tim: <strong className="font-black text-sm">{championTeam?.teamScore || 0} Pts</strong>
              </p>
            </div>

            {/* Individual MVP Card */}
            <div className="p-4 rounded-2xl bg-white border-2 border-[#F59E0B]/40 shadow-xs text-center flex flex-col items-center justify-between">
              <span className="text-xs font-black uppercase text-[#B45309] bg-[#FEF3C7] px-2.5 py-0.5 rounded-full mb-1">
                MVP PERORANGAN
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <PlayerProfileAvatar characterId={winner?.avatarId} size={30} name={winner?.name} />
                <p className="font-display text-xl font-black text-[#7C3AED]">
                  {winner?.name}
                </p>
              </div>
              <p className="text-xs font-bold text-[#64616C] mt-1">
                Saldo: <strong className="text-[#158467] font-black text-sm">{winner?.score} Poin</strong>
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
                    (team.successfulRoundsCount || 0) >= 3
                      ? 'bg-[#ECFDF5] border-[#12B76A]/40 shadow-xs'
                      : 'bg-[#FFF1F2] border-[#F04438]/30 shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-xs ${
                        (team.successfulRoundsCount || 0) >= 3 ? 'bg-[#12B76A]' : 'bg-[#F04438]'
                      }`}
                    >
                      {(team.successfulRoundsCount || 0) >= 3 ? (
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
                        (team.successfulRoundsCount || 0) >= 3
                          ? 'bg-[#12B76A] text-white'
                          : 'bg-[#F04438] text-white'
                      }`}
                    >
                      {team.successfulRoundsCount || 0}/4 Ronde ({team.correctCount || 0}/16 Soal)
                    </span>
                    <p className="text-xs font-bold text-[#64616C] mt-0.5">
                      {team.teamScore || 0} Poin Tim
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

        {/* Punishment Card for Lost Team */}
        {failingTeam && (
          <div className="mb-6">
            <div className="p-4 rounded-[26px] bg-[#FFE8DF] border-2 border-[#EA580C] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div>
                <span className="text-xs font-black uppercase text-[#B93815] px-2.5 py-0.5 rounded-full bg-[#EA580C]/15 inline-flex items-center gap-1 mb-1.5">
                  <FluentEmoji name="fire" variant="3d" size={14} />
                  <span>HUKUMAN: 1 TIM GUGUR ({failingTeam.name})</span>
                </span>
                <p className="text-xs text-[#64616C] font-semibold mb-2">
                  Seluruh anggota {failingTeam.name} ({losingTeamMembers.length} orang) wajib jalani hukuman bersama:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {losingTeamMembers.map((p) => (
                    <div key={p.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-[#EA580C]/20 shadow-2xs">
                      <PlayerProfileAvatar characterId={p.avatarId} size={20} name={p.name} />
                      <span className="font-display font-bold text-xs text-[#1E1E24]">{p.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPunishment(true)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#EA580C] text-white font-display text-xs font-bold hover:bg-[#C2410C] cursor-pointer shadow-xs transition flex items-center justify-center gap-1.5 shrink-0"
              >
                <FluentEmoji name="joker" variant="3d" size={18} />
                <span>Shuffle Hukuman Tim</span>
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons: Opsi Kelompok Sama atau Shuffle Tim */}
        <div className="space-y-3 mt-auto">
          <Button
            variant="primary"
            fullWidth
            size="lg"
            onClick={() => {
              sfx.playPop();
              g5ReplaySameTeams();
              navigate('/game5/play');
            }}
          >
            <RotateCcw className="w-5 h-5" />
            <span>Main Lagi (Kelompok Sama)</span>
          </Button>

          <Button
            variant="cream"
            fullWidth
            size="lg"
            onClick={() => {
              sfx.playPop();
              g5ReshuffleTeams();
              navigate('/game5/play');
            }}
          >
            <RotateCcw className="w-5 h-5 text-[#7C3AED]" />
            <span>Main Lagi (Acak Ulang / Shuffle Tim)</span>
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
        targetType="team"
        targetTeamName={failingTeam?.name}
        targetPlayers={losingTeamMembers}
      />

      <HostUtilityBar />
    </div>
  );
}
