import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, X, ArrowRight, Trophy, Eye, EyeOff, Sparkles, AlertTriangle } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { BlobMascot } from '../../components/ui/BlobMascot';
import { PlayerProfileAvatar } from '../../components/characters/PlayerProfileAvatar';
import { HostUtilityBar } from '../../components/HostUtilityBar';
import { PunishmentModal } from '../../components/PunishmentModal';
import { ConfettiShower } from '../../components/motion/ConfettiShower';
import { FluentEmoji } from '../../components/ui/FluentEmoji';
import { GameDesktopLayout } from '../../components/layout/GameDesktopLayout';
import { sfx } from '../../utils/sound';

export default function G5Play() {
  const navigate = useNavigate();
  const {
    players,
    g5Teams,
    g5CurrentTeamIndex,
    g5RecordMemberAnswer,
    g5NextTeam,
  } = useGameStore();

  const [showAnswer, setShowAnswer] = useState(false);
  const [teamOutcome, setTeamOutcome] = useState<'success' | 'broken' | null>(null);
  const [showPunishment, setShowPunishment] = useState(false);
  const [failedMemberName, setFailedMemberName] = useState('');

  const currentTeam = g5Teams[g5CurrentTeamIndex];

  if (!currentTeam || g5Teams.length === 0) {
    navigate('/hub');
    return null;
  }

  const isLastTeam = g5CurrentTeamIndex >= g5Teams.length - 1;
  const currentMemberId = currentTeam.memberIds[currentTeam.currentMemberIdx];
  const currentMember = players.find((p) => p.id === currentMemberId);
  const currentQuestion = currentTeam.questions[currentTeam.currentMemberIdx];

  const handleAnswer = (isCorrect: boolean) => {
    setShowAnswer(false);
    if (isCorrect) {
      sfx.playSuccess();
      const result = g5RecordMemberAnswer(true);
      if (result.isTeamPassed) {
        sfx.playFanfare();
        setTeamOutcome('success');
      }
    } else {
      sfx.playBuzzer();
      setFailedMemberName(currentMember?.name || 'Pemain');
      g5RecordMemberAnswer(false);
      setTeamOutcome('broken');
    }
  };

  const handleNextTeam = () => {
    sfx.playPop();
    if (isLastTeam) {
      navigate('/game5/results');
    } else {
      g5NextTeam();
      setTeamOutcome(null);
      setShowAnswer(false);
    }
  };

  return (
    <GameDesktopLayout
      gameId="game5"
      gameTitle="Cerdas Cermat Berantai"
      badge="GAME 05 • RELAY"
      badgeColor="#7C3AED"
      activeRoundLabel={`${currentTeam.name} (${g5CurrentTeamIndex + 1}/${g5Teams.length})`}
    >
      {teamOutcome === 'success' && <ConfettiShower particleCount={50} />}

      <div className="max-w-3xl lg:max-w-4xl mx-auto w-full flex-1 flex flex-col">
        {/* Top Header on Mobile (Hidden on Desktop because it's in the 20% Sidebar) */}
        <div className="flex lg:hidden items-center justify-between mb-5">
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
            <span>{currentTeam.name}</span>
            <span className="bg-white/20 px-1.5 py-0.5 rounded-full text-[10px]">
              {g5CurrentTeamIndex + 1}/{g5Teams.length}
            </span>
          </span>
        </div>

        {/* Mascot & Chain Progress Bar */}
        <div className="text-center mb-5">
          <div className="mb-2 inline-block">
            <BlobMascot
              shape="pentagon"
              mood={teamOutcome === 'success' ? 'excited' : teamOutcome === 'broken' ? 'dizzy' : 'confident'}
              color="#A78BFA"
              accentColor="#6D28D9"
              accessory={teamOutcome === 'success' ? 'crown' : undefined}
              size={88}
            />
          </div>

          <div className="flex justify-center mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EDE9FE] text-[#7C3AED] text-xs font-extrabold uppercase tracking-wider border border-[#7C3AED]/20 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CERDAS CERMAT BERANTAI</span>
            </span>
          </div>

          <h1 className="font-display text-2xl md:text-3xl font-bold text-[#1E1E24] flex items-center justify-center gap-2">
            <span>{currentTeam.name}</span>
          </h1>
          <p className="text-xs text-[#64616C] font-semibold mt-1 max-w-md mx-auto">
            Semua anggota wajib menjawab benar berurutan! Kalau 1 orang salah, rantai putus dan tim gugur.
          </p>
        </div>

        {/* Chain Relay Visual Progress (Urutan Estafet Jawaban) */}
        <div className="mb-5 p-4 rounded-2xl bg-white border border-[#1E1E24]/10 shadow-[0_4px_16px_rgba(30,30,36,0.04)]">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-[11px] font-black text-[#64616C] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#7C3AED] animate-pulse" />
              <span>Urutan Estafet Jawaban ({currentTeam.memberIds.length} Pemain)</span>
            </span>
            <span className="text-[11px] font-extrabold text-[#7C3AED] bg-[#EDE9FE] px-2.5 py-0.5 rounded-full">
              {teamOutcome === 'success'
                ? 'Sempurna 🎉'
                : teamOutcome === 'broken'
                ? 'Terputus 💥'
                : `Giliran ke-${currentTeam.currentMemberIdx + 1}`}
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 flex-wrap">
            {currentTeam.memberIds.map((mId, idx) => {
              const mem = players.find((p) => p.id === mId);
              const isPast = idx < currentTeam.currentMemberIdx || teamOutcome === 'success';
              const isCurrent = idx === currentTeam.currentMemberIdx && teamOutcome === null;
              const isFailed = teamOutcome === 'broken' && idx === currentTeam.currentMemberIdx;

              return (
                <div key={mId} className="flex items-center gap-2">
                  <div
                    className={`px-3 py-2 rounded-2xl font-display text-xs font-bold transition-all flex items-center gap-2 ${
                      isPast
                        ? 'bg-[#ECFDF5] text-[#065F46] border-2 border-[#12B76A]/40 shadow-xs'
                        : isFailed
                        ? 'bg-[#FEF2F2] text-[#991B1B] border-2 border-[#F04438] shadow-xs'
                        : isCurrent
                        ? 'bg-[#7C3AED] text-white border-2 border-[#6D28D9] shadow-md scale-105 ring-4 ring-[#7C3AED]/20 animate-pulse'
                        : 'bg-[#F9FAFB] text-[#6B7280] border border-[#E5E7EB]'
                    }`}
                  >
                    <div className="relative">
                      <PlayerProfileAvatar characterId={mem?.avatarId} size={26} name={mem?.name} />
                      {isPast && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#12B76A] text-white flex items-center justify-center shadow-xs">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                      {isFailed && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#F04438] text-white flex items-center justify-center shadow-xs">
                          <X className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-1">
                        <span className={`text-[10px] font-black uppercase ${isCurrent ? 'text-white/80' : 'text-[#9CA3AF]'}`}>
                          #{idx + 1}
                        </span>
                        <span className="font-bold">{mem?.name}</span>
                      </div>
                      <span className="text-[10px] block opacity-80 leading-tight">
                        {isPast ? 'Benar ✅' : isFailed ? 'Gagal ❌' : isCurrent ? 'Menjawab...' : 'Menunggu'}
                      </span>
                    </div>
                  </div>

                  {idx < currentTeam.memberIds.length - 1 && (
                    <div className="flex items-center text-[#9CA3AF]">
                      <ArrowRight className={`w-3.5 h-3.5 ${isPast ? 'text-[#12B76A]' : 'text-[#D1D5DB]'}`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Question Area or Outcome */}
        <AnimatePresence mode="wait">
          {teamOutcome === null ? (
            <motion.div
              key={`q-${currentTeam.currentMemberIdx}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-4"
            >
              {/* Question Card */}
              <div className="rounded-[32px] bg-gradient-to-b from-[#7C3AED] to-[#6D28D9] text-white p-6 md:p-8 shadow-lg border-2 border-[#5B21B6]/30 text-center relative overflow-hidden">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-xs text-xs font-black uppercase tracking-wider mb-3 shadow-xs">
                  <FluentEmoji emoji={currentQuestion?.categoryEmoji} size={18} />
                  <span>Kategori: {currentQuestion?.category}</span>
                </div>

                <div className="flex items-center justify-center gap-2.5 mb-3 bg-white/10 py-1.5 px-4 rounded-full max-w-fit mx-auto">
                  <PlayerProfileAvatar characterId={currentMember?.avatarId} size={28} name={currentMember?.name} />
                  <p className="text-xs text-white/95 font-bold">
                    Giliran Menjawab: <span className="font-display font-black text-white underline">{currentMember?.name}</span>
                  </p>
                </div>

                <h2 className="font-display text-xl md:text-2xl font-bold leading-snug my-2">
                  "{currentQuestion?.question}"
                </h2>
              </div>

              {/* Host Answer Clue Box (Hidden by default for fairness) */}
              <Card className="p-4 bg-white shadow-xs border border-[#1E1E24]/10 text-center">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#64616C] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
                    <span>Kunci Jawaban Host:</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      sfx.playPop();
                      setShowAnswer(!showAnswer);
                    }}
                    className="text-xs font-bold text-[#7C3AED] hover:underline flex items-center gap-1 cursor-pointer py-1 px-2.5 rounded-lg hover:bg-[#EDE9FE]/50 transition-colors"
                  >
                    {showAnswer ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showAnswer ? 'Sembunyikan' : 'Buka Kunci'}</span>
                  </button>
                </div>

                {showAnswer ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-2.5 p-3 rounded-xl bg-[#EDE9FE] text-[#7C3AED] font-display font-bold text-base border border-[#7C3AED]/20"
                  >
                    {currentQuestion?.answer}
                  </motion.div>
                ) : (
                  <p className="text-xs text-[#64616C] italic mt-1.5 select-none font-medium">
                    •••••••••••••••••••••••• (klik buka kunci untuk melihat)
                  </p>
                )}
              </Card>

              {/* Verdict Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => handleAnswer(true)}
                  className="shadow-sm hover:shadow-md"
                >
                  <Check className="w-5 h-5 stroke-[3]" />
                  <span>BENAR! (Lanjut)</span>
                </Button>

                <Button
                  variant="berry"
                  size="lg"
                  fullWidth
                  onClick={() => handleAnswer(false)}
                  className="shadow-sm hover:shadow-md"
                >
                  <X className="w-5 h-5 stroke-[3]" />
                  <span>SALAH! (Putus)</span>
                </Button>
              </div>
            </motion.div>
          ) : teamOutcome === 'success' ? (
            <motion.div
              key="success-outcome"
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="p-6 md:p-8 rounded-[32px] bg-white border-2 border-[#12B76A]/30 shadow-[0_16px_36px_rgba(18,183,106,0.14)] text-center relative overflow-hidden"
            >
              {/* Background celebratory glow */}
              <div className="absolute -top-16 -right-16 w-44 h-44 bg-[#D6F5EC]/60 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-[#EDE9FE]/60 rounded-full blur-2xl pointer-events-none" />

              {/* Top Floating 3D Fluent Emoji Badge */}
              <div className="relative inline-flex items-center justify-center mb-3">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#D6F5EC] to-[#A7F3D0] flex items-center justify-center shadow-md border-2 border-[#12B76A]/20">
                  <FluentEmoji name="party-popper" variant="3d" size={54} />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-white shadow-md flex items-center justify-center border border-[#1E1E24]/10">
                  <FluentEmoji name="high-voltage" variant="3d" size={26} />
                </div>
              </div>

              {/* Banner Ribbon */}
              <div className="mb-2">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#ECFDF5] text-[#065F46] text-xs font-black uppercase tracking-wider border border-[#12B76A]/20">
                  <Trophy className="w-3.5 h-3.5 text-[#12B76A]" />
                  <span>Rantai Sempurna!</span>
                </span>
              </div>

              <h2 className="font-display text-2xl md:text-3xl font-bold text-[#1E1E24] mb-2">
                Rantai Berhasil Dituntaskan!
              </h2>

              <p className="text-sm font-semibold text-[#64616C] max-w-md mx-auto mb-6">
                Luar biasa! Seluruh anggota <span className="font-bold text-[#1E1E24]">{currentTeam.name}</span> berhasil menjawab kuis secara berurutan tanpa cela!
              </p>

              {/* Reward Breakdown Cards */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3.5 rounded-2xl bg-[#F0FDF4] border border-[#12B76A]/30 text-center">
                  <p className="text-[11px] font-bold text-[#065F46] uppercase tracking-wider mb-0.5">
                    Skor Kelompok
                  </p>
                  <p className="font-display text-2xl font-black text-[#158467]">
                    +10 Poin
                  </p>
                  <p className="text-[10px] text-[#64616C] font-semibold">
                    Untuk {currentTeam.name}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#EDE9FE] border border-[#7C3AED]/25 text-center">
                  <p className="text-[11px] font-bold text-[#7C3AED] uppercase tracking-wider mb-0.5">
                    Akumulasi Room
                  </p>
                  <p className="font-display text-2xl font-black text-[#7C3AED]">
                    +6 Poin
                  </p>
                  <p className="text-[10px] text-[#64616C] font-semibold">
                    Tiap Anggota Tim
                  </p>
                </div>
              </div>

              <Button
                variant="emerald"
                size="lg"
                fullWidth
                onClick={handleNextTeam}
                className="shadow-md hover:shadow-lg transition-all"
              >
                {isLastTeam ? (
                  <>
                    <FluentEmoji name="crown" variant="3d" size={24} />
                    <span>Lihat Hasil Akhir Turnamen</span>
                  </>
                ) : (
                  <>
                    <span>Lanjut ke Tim Berikutnya</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="broken-outcome"
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="p-6 md:p-8 rounded-[32px] bg-white border-2 border-[#F04438]/30 shadow-[0_16px_36px_rgba(240,68,56,0.14)] text-center relative overflow-hidden"
            >
              <div className="absolute -top-16 -right-16 w-44 h-44 bg-[#FFE8DF]/60 rounded-full blur-2xl pointer-events-none" />

              {/* Top Floating 3D Fluent Emoji Badge */}
              <div className="relative inline-flex items-center justify-center mb-3">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#FFE8DF] to-[#FECDD3] flex items-center justify-center shadow-md border-2 border-[#F04438]/20">
                  <FluentEmoji name="collision" variant="3d" size={54} />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-white shadow-md flex items-center justify-center border border-[#1E1E24]/10">
                  <FluentEmoji name="chains" variant="3d" size={26} />
                </div>
              </div>

              <div className="mb-2">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FEF2F2] text-[#991B1B] text-xs font-black uppercase tracking-wider border border-[#F04438]/20">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#F04438]" />
                  <span>Rantai Terputus!</span>
                </span>
              </div>

              <h2 className="font-display text-2xl md:text-3xl font-bold text-[#1E1E24] mb-2">
                Sayang Sekali, Rantai Putus!
              </h2>

              <p className="text-sm font-semibold text-[#64616C] max-w-md mx-auto mb-6">
                <span className="font-bold text-[#1E1E24]">{failedMemberName}</span> gagal menjawab dengan benar. Rantai tim terhenti dan tim menerima penalti skor.
              </p>

              {/* Penalty Breakdown Cards */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3.5 rounded-2xl bg-[#FFF1F2] border border-[#F04438]/30 text-center">
                  <p className="text-[11px] font-bold text-[#991B1B] uppercase tracking-wider mb-0.5">
                    Skor Kelompok
                  </p>
                  <p className="font-display text-2xl font-black text-[#F04438]">
                    0 Poin
                  </p>
                  <p className="text-[10px] text-[#64616C] font-semibold">
                    Gagal Lolos Rantai
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FFF7ED] border border-[#F97316]/30 text-center">
                  <p className="text-[11px] font-bold text-[#C2410C] uppercase tracking-wider mb-0.5">
                    Penalti Room
                  </p>
                  <p className="font-display text-2xl font-black text-[#EA580C]">
                    -2 Poin
                  </p>
                  <p className="text-[10px] text-[#64616C] font-semibold">
                    Tiap Anggota Tim
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setShowPunishment(true)}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#FFF7ED] to-[#FFEDD5] border-2 border-[#EA580C] text-[#C2410C] hover:bg-[#FED7AA] font-display text-sm font-black flex items-center justify-center gap-2.5 shadow-sm hover:shadow-md cursor-pointer transition-all active:scale-[0.98]"
                >
                  <FluentEmoji name="joker" variant="3d" size={24} />
                  <span>Ambil Kartu Hukuman untuk {failedMemberName}!</span>
                </button>

                <Button
                  variant="ink"
                  size="lg"
                  fullWidth
                  onClick={handleNextTeam}
                >
                  {isLastTeam ? (
                    <>
                      <FluentEmoji name="trophy" variant="3d" size={22} />
                      <span>Lihat Hasil Akhir Turnamen</span>
                    </>
                  ) : (
                    <>
                      <span>Lanjut ke Tim Berikutnya</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Punishment Shuffle Modal */}
      <PunishmentModal
        open={showPunishment}
        onClose={() => setShowPunishment(false)}
        loserName={failedMemberName}
      />

      <div className="block lg:hidden">
        <HostUtilityBar />
      </div>
    </GameDesktopLayout>
  );
}
