import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Dices, Play, Sparkles, Users } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { BlobMascot } from '../../components/ui/BlobMascot';
import { PlayerProfileAvatar } from '../../components/characters/PlayerProfileAvatar';
import { HostUtilityBar } from '../../components/HostUtilityBar';
import { sfx } from '../../utils/sound';

export const G5Setup: React.FC = () => {
  const navigate = useNavigate();
  const { players, g5Teams, autoStartGame5, g5ReshuffleTeams } = useGameStore();

  useEffect(() => {
    // Pastikan tim terinisialisasi jika belum ada
    if (g5Teams.length === 0 && players.length >= 2) {
      autoStartGame5();
    }
  }, [g5Teams.length, players.length, autoStartGame5]);

  const handleShuffle = () => {
    sfx.playPop();
    g5ReshuffleTeams();
  };

  const handleStartGame = () => {
    sfx.playSuccess();
    navigate('/game5/play');
  };

  if (players.length < 2) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E24] px-4 py-8 flex flex-col justify-center items-center">
        <BlobMascot shape="circle" mood="dizzy" size={100} />
        <h2 className="font-display text-2xl font-bold mt-4">Pemain Kurang!</h2>
        <p className="text-sm text-[#64616C] mt-1 mb-6 text-center max-w-sm">
          Minimal butuh 2 pemain untuk bermain Cerdas Cermat Berantai. Daftarkan pemain terlebih dahulu.
        </p>
        <Button variant="primary" onClick={() => navigate('/room')}>
          Atur Daftar Pemain
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E24] px-4 py-6 md:py-8 pb-20 md:pb-16 flex flex-col justify-between relative overflow-hidden">
      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between mb-4">
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
            <Sparkles className="w-3.5 h-3.5" />
            <span>GAME 05 • LOBBY ESTAFET</span>
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch flex-1">
          {/* LEFT COLUMN: Mascot, Rules Card, Shuffle & Start CTA */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <Card className="p-5 bg-white shadow-xs text-center flex flex-col items-center">
              <div className="mb-1.5 inline-block">
                <BlobMascot
                  shape="pentagon"
                  mood="excited"
                  color="#A78BFA"
                  accentColor="#6D28D9"
                  accessory="crown"
                  size={78}
                />
              </div>

              <h1 className="font-display text-2xl md:text-3xl font-bold text-[#1E1E24]">
                Pembagian Kelompok Estafet
              </h1>
              <p className="text-xs text-[#64616C] font-semibold mt-1">
                1 Tim maju menyelesaikan <strong>4 Ronde Beruntun (Total 16 Soal Estafet)</strong>. Salah = -2 pts &amp; tantangan!
              </p>

              {/* Quick Shuffle Bar */}
              <div className="w-full mt-4 pt-3 border-t border-[#1E1E24]/10 flex items-center justify-between gap-2 text-left">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] border border-[#7C3AED]/20 flex items-center justify-center text-[#7C3AED] shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-xs font-bold text-[#1E1E24] truncate">
                      {g5Teams.length} Kelompok ({players.length} Pemain)
                    </p>
                    <p className="text-xs text-[#64616C] font-medium truncate">
                      4 putaran langsung
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleShuffle}
                  className="px-3 py-2 rounded-xl bg-[#FAF7F2] border-2 border-[#1E1E24]/20 hover:border-[#1E1E24] text-[#1E1E24] font-display text-xs font-bold hover:bg-[#F2ECE1] cursor-pointer shadow-xs transition flex items-center gap-1.5 active:scale-95 shrink-0"
                >
                  <Dices className="w-3.5 h-3.5 text-[#7C3AED]" />
                  <span>Acak Ulang</span>
                </button>
              </div>
            </Card>

            {/* Rules Card */}
            <Card className="p-4 bg-[#FFFBEB] border-2 border-[#F59E0B]/30 rounded-2xl">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-[#F59E0B] text-white flex items-center justify-center shrink-0 font-bold text-xs">
                  ⚡
                </div>
                <div>
                  <h4 className="font-display text-xs font-bold text-[#92400E] mb-1">
                    Aturan Chain Quiz Relay:
                  </h4>
                  <ul className="text-xs text-[#92400E] font-medium space-y-1 list-disc list-inside">
                    <li><strong>4 Ronde Beruntun</strong> (1 Ronde = 4 Soal Estafet = 16 Soal).</li>
                    <li>Salah jawab = <strong>-2 Poin</strong> &amp; <strong>Kartu Tantangan</strong> sampai Ronde 4!</li>
                    <li>Tuntas 1 ronde = <strong>+2 Poin</strong>. Bersih 4/4 = <strong>Jackpot +10 Poin</strong>!</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Start Button */}
            <div className="mt-auto">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleStartGame}
                className="shadow-md hover:shadow-lg py-4 text-base flex items-center justify-center gap-2 bg-[#7C3AED] hover:bg-[#6D28D9] border-2 border-[#5B21B6]"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Mulai Turnamen Chain Quiz (Gas!) 🚀</span>
              </Button>
            </div>
          </div>

          {/* RIGHT COLUMN: Teams Lineup Grid */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[540px] overflow-y-auto pr-1">
              {g5Teams.map((team, tIdx) => {
                return (
                  <motion.div
                    key={team.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: tIdx * 0.06 }}
                    className="rounded-3xl bg-white border-2 border-[#1E1E24]/10 p-4 shadow-xs flex flex-col justify-between hover:border-[#7C3AED]/40 transition"
                  >
                    <div>
                      {/* Team Card Header */}
                      <div className="flex items-center justify-between pb-2.5 border-b border-[#1E1E24]/10 mb-2.5">
                        <div>
                          <span className="text-xs font-black uppercase text-[#7C3AED] bg-[#EDE9FE] px-2 py-0.5 rounded-full inline-block mb-0.5">
                            TIM #{tIdx + 1}
                          </span>
                          <h3 className="font-display text-base font-bold text-[#1E1E24]">
                            {team.name}
                          </h3>
                        </div>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-xl bg-[#FAF7F2] border border-[#1E1E24]/10 text-[#64616C]">
                          {team.memberIds.length} Orang
                        </span>
                      </div>

                      {/* Team Members Relay Sequence */}
                      <div className="space-y-1.5 mb-2.5">
                        {Array.from({ length: 4 }).map((_, qIdx) => {
                          const memberId = team.memberIds[qIdx % team.memberIds.length];
                          const member = players.find((p) => p.id === memberId);
                          const isRepeat = qIdx >= team.memberIds.length;

                          return (
                            <div
                              key={`relay-${team.id}-${qIdx}`}
                              className="flex items-center justify-between p-1.5 rounded-xl bg-[#FAF7F2] border border-[#1E1E24]/8 text-xs font-bold"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="w-5 h-5 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-xs font-black shrink-0">
                                  {qIdx + 1}
                                </span>
                                <PlayerProfileAvatar characterId={member?.avatarId} size={22} name={member?.name} />
                                <span className="truncate text-[#1E1E24]">{member?.name}</span>
                              </div>

                              <span className="text-xs text-[#7C3AED] font-extrabold bg-[#EDE9FE] px-2 py-0.5 rounded-lg shrink-0">
                                {isRepeat ? 'Ulang' : `S.${qIdx + 1}`}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Team Footer Note */}
                    <div className="pt-2 border-t border-[#1E1E24]/8 text-xs text-[#64616C] font-semibold flex items-center justify-between">
                      <span>4 Ronde (16 Soal)</span>
                      <span className="text-[#158467] font-bold">+10 Jackpot</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <HostUtilityBar />
    </div>
  );
};

export default G5Setup;
