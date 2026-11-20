import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight, Trophy, Eye, EyeOff, Sparkles, Play, Users, ShieldAlert } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { BlobMascot } from '../../components/ui/BlobMascot';
import { PlayerProfileAvatar } from '../../components/characters/PlayerProfileAvatar';
import { HostUtilityBar } from '../../components/HostUtilityBar';
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

  // 3 Tahap Alur Bermain:
  // 1. 'team_ready': Host memanggil tim ke depan & menunjukkan anggota sebelum mulai
  // 2. 'chain_quiz': 4 seri soal langsung untuk tim tersebut
  // 3. 'team_summary': Hasil 4 soal rantai untuk tim tersebut (berhasil 4/4 atau putus)
  const [stage, setStage] = useState<'team_ready' | 'chain_quiz' | 'team_summary'>('team_ready');
  const [showAnswer, setShowAnswer] = useState(false);
  const [teamOutcome, setTeamOutcome] = useState<'success' | 'broken' | null>(null);
  const [failedMemberName, setFailedMemberName] = useState('');
  const [failedQuestionIndex, setFailedQuestionIndex] = useState(0);

  const currentTeam = g5Teams[g5CurrentTeamIndex];

  if (!currentTeam || g5Teams.length === 0) {
    navigate('/game5/setup');
    return null;
  }

  const isLastTeam = g5CurrentTeamIndex >= g5Teams.length - 1;
  const currentMemberIndexInTeam = currentTeam.currentMemberIdx % currentTeam.memberIds.length;
  const currentMemberId = currentTeam.memberIds[currentMemberIndexInTeam];
  const currentMember = players.find((p) => p.id === currentMemberId);
  const currentQuestion = currentTeam.questions[currentTeam.currentMemberIdx] || currentTeam.questions[0];

  const handleStartTeamRun = () => {
    sfx.playSuccess();
    setStage('chain_quiz');
    setShowAnswer(false);
  };

  const handleAnswer = (isCorrect: boolean) => {
    setShowAnswer(false);
    if (isCorrect) {
      sfx.playSuccess();
      const result = g5RecordMemberAnswer(true);
      if (result.isTeamPassed) {
        sfx.playFanfare();
        setTeamOutcome('success');
        setStage('team_summary');
      }
    } else {
      sfx.playBuzzer();
      setFailedMemberName(currentMember?.name || 'Pemain');
      setFailedQuestionIndex(currentTeam.currentMemberIdx + 1);
      g5RecordMemberAnswer(false);
      setTeamOutcome('broken');
      setStage('team_summary');
    }
  };

  const handleNextTeam = () => {
    sfx.playPop();
    if (isLastTeam) {
      navigate('/game5/results');
    } else {
      g5NextTeam();
      setStage('team_ready');
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
        {/* ========================================================================= */}
        {/* TAHAP 1: PANGGIL TIM & TUNJUKKAN ANGGOTA SEBELUM GAS                      */}
        {/* ========================================================================= */}
        {stage === 'team_ready' && (
          <motion.div
            key="stage-team-ready"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col justify-between"
          >
            <div className="text-center mb-6">
              <div className="mb-2 inline-block">
                <BlobMascot
                  shape="pentagon"
                  mood="excited"
                  color="#A78BFA"
                  accentColor="#6D28D9"
                  accessory="crown"
                  size={100}
                />
              </div>

              <div className="flex justify-center mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#EDE9FE] text-[#7C3AED] text-xs font-black uppercase tracking-wider border border-[#7C3AED]/20 shadow-xs">
                  <Users className="w-3.5 h-3.5" />
                  <span>GILIRAN TIM {g5CurrentTeamIndex + 1} DARI {g5Teams.length}</span>
                </span>
              </div>

              <h1 className="font-display text-3xl md:text-5xl font-bold text-[#1E1E24]">
                {currentTeam.name}
              </h1>
              <p className="text-xs sm:text-sm text-[#64616C] font-semibold mt-1.5 max-w-md mx-auto">
                Silakan seluruh anggota tim maju ke depan layar! Kalian akan menjawab <strong>4 soal berturut-turut</strong> secara estafet.
              </p>
            </div>

            {/* Lineup 4 Seri Anggota */}
            <div className="mb-6 p-5 rounded-3xl bg-white border-2 border-[#1E1E24]/10 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#1E1E24]/10 mb-4">
                <span className="font-display text-sm font-bold text-[#1E1E24] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#7C3AED]" />
                  <span>Urutan Penjawab 4 Seri Soal:</span>
                </span>
                <span className="text-[11px] font-extrabold text-[#7C3AED] bg-[#EDE9FE] px-2.5 py-0.5 rounded-full">
                  Target: 4/4 Sempurna
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, qIdx) => {
                  const mId = currentTeam.memberIds[qIdx % currentTeam.memberIds.length];
                  const member = players.find((p) => p.id === mId);
                  const isRepeat = qIdx >= currentTeam.memberIds.length;

                  return (
                    <div
                      key={`ready-slot-${qIdx}`}
                      className="p-3.5 rounded-2xl bg-[#FAF7F2] border-2 border-[#1E1E24]/8 text-center flex flex-col items-center justify-between shadow-2xs hover:border-[#7C3AED]/30 transition"
                    >
                      <span className="w-6 h-6 rounded-full bg-[#7C3AED] text-white flex items-center justify-center font-display font-black text-xs mb-2">
                        #{qIdx + 1}
                      </span>
                      <PlayerProfileAvatar characterId={member?.avatarId} size={42} name={member?.name} />
                      <p className="font-display text-xs font-bold text-[#1E1E24] mt-2 truncate w-full">
                        {member?.name}
                      </p>
                      <span className="text-[10px] font-extrabold text-[#7C3AED] bg-[#EDE9FE] px-2 py-0.5 rounded-lg mt-1">
                        {isRepeat ? 'Soal 4 (Relay)' : `Soal Seri ${qIdx + 1}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Big Action Button to Start Team Run */}
            <div className="mt-auto pt-2">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleStartTeamRun}
                className="py-4 text-base md:text-lg bg-[#7C3AED] hover:bg-[#6D28D9] border-2 border-[#5B21B6] shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Tim Sudah di Depan, Gas Mulai Soal 1! 🚀</span>
              </Button>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* TAHAP 2: 4 SERI SOAL BERANTAI LANGSUNG                                    */}
        {/* ========================================================================= */}
        {stage === 'chain_quiz' && (
          <div className="flex-1 flex flex-col justify-between">
            {/* Header Mini Mascot & Active Status */}
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#EDE9FE] text-[#7C3AED] text-xs font-black uppercase tracking-wider border border-[#7C3AED]/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{currentTeam.name}</span>
                </span>
                <span className="text-xs font-extrabold text-[#64616C] bg-black/5 px-2.5 py-0.5 rounded-full">
                  Soal {currentTeam.currentMemberIdx + 1} dari 4
                </span>
              </div>
            </div>

            {/* Visual 4-Step Chain Progress Indicator */}
            <div className="mb-4 p-3 rounded-2xl bg-white border border-[#1E1E24]/10 shadow-xs">
              <div className="flex items-center justify-between gap-1.5">
                {Array.from({ length: 4 }).map((_, idx) => {
                  const isDone = idx < currentTeam.currentMemberIdx;
                  const isCurrent = idx === currentTeam.currentMemberIdx;
                  const memberId = currentTeam.memberIds[idx % currentTeam.memberIds.length];
                  const mem = players.find((p) => p.id === memberId);

                  return (
                    <React.Fragment key={`chain-step-${idx}`}>
                      <div
                        className={`flex-1 py-1.5 px-2 rounded-xl text-center flex items-center justify-center gap-1.5 transition-all ${
                          isDone
                            ? 'bg-[#ECFDF5] text-[#065F46] border border-[#12B76A]/40 font-bold'
                            : isCurrent
                            ? 'bg-[#7C3AED] text-white border-2 border-[#6D28D9] shadow-xs font-black scale-102 animate-pulse'
                            : 'bg-[#F9FAFB] text-[#9CA3AF] border border-[#E5E7EB] font-medium'
                        }`}
                      >
                        <PlayerProfileAvatar characterId={mem?.avatarId} size={18} name={mem?.name} />
                        <span className="text-[11px] truncate max-w-[85px]">
                          {isDone ? `✓ ${mem?.name}` : isCurrent ? `▶ ${mem?.name}` : `#${idx + 1} ${mem?.name}`}
                        </span>
                      </div>
                      {idx < 3 && (
                        <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${isDone ? 'text-[#12B76A]' : 'text-[#D1D5DB]'}`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Active Question Card */}
            <motion.div
              key={`q-${currentTeam.currentMemberIdx}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 my-auto"
            >
              <div className="rounded-[32px] bg-gradient-to-b from-[#7C3AED] to-[#6D28D9] text-white p-6 md:p-8 shadow-lg border-2 border-[#5B21B6]/30 text-center relative overflow-hidden">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-xs text-xs font-black uppercase tracking-wider mb-3 shadow-xs">
                  <FluentEmoji emoji={currentQuestion?.categoryEmoji} size={18} />
                  <span>Kategori: {currentQuestion?.category}</span>
                </div>

                <div className="flex items-center justify-center gap-2.5 mb-3 bg-white/10 py-1.5 px-4 rounded-full max-w-fit mx-auto">
                  <PlayerProfileAvatar characterId={currentMember?.avatarId} size={28} name={currentMember?.name} />
                  <p className="text-xs text-white/95 font-bold">
                    Giliran Menjawab Soal #{currentTeam.currentMemberIdx + 1}:{' '}
                    <span className="font-display font-black text-white underline">{currentMember?.name}</span>
                  </p>
                </div>

                <h2 className="font-display text-xl md:text-2xl font-bold leading-snug my-2">
                  "{currentQuestion?.question}"
                </h2>
              </div>

              {/* Host Answer Clue Spoiler Box */}
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
                  className="shadow-sm hover:shadow-md py-3.5 bg-[#12B76A] hover:bg-[#0E9F5D] border-2 border-[#057A44]"
                >
                  <Check className="w-5 h-5 stroke-[3]" />
                  <span>
                    {currentTeam.currentMemberIdx >= 3 ? 'BENAR! (Lolos Sempurna!)' : 'BENAR! (Lanjut Rantai)'}
                  </span>
                </Button>

                <Button
                  variant="berry"
                  size="lg"
                  fullWidth
                  onClick={() => handleAnswer(false)}
                  className="shadow-sm hover:shadow-md py-3.5"
                >
                  <X className="w-5 h-5 stroke-[3]" />
                  <span>SALAH! (Rantai Putus)</span>
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAHAP 3: HASIL 4 SOAL RANTAI UNTUK TIM INI                                */}
        {/* ========================================================================= */}
        {stage === 'team_summary' && (
          <motion.div
            key="stage-team-summary"
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            className="flex-1 flex flex-col justify-between"
          >
            {teamOutcome === 'success' ? (
              <div className="p-6 md:p-8 rounded-[32px] bg-white border-2 border-[#12B76A]/30 shadow-lg text-center relative overflow-hidden my-auto">
                <div className="relative inline-flex items-center justify-center mb-3">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#D6F5EC] to-[#A7F3D0] flex items-center justify-center shadow-md border-2 border-[#12B76A]/20">
                    <FluentEmoji name="party-popper" variant="3d" size={54} />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-white shadow-md flex items-center justify-center border border-[#1E1E24]/10">
                    <FluentEmoji name="high-voltage" variant="3d" size={26} />
                  </div>
                </div>

                <div className="mb-2">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#ECFDF5] text-[#065F46] text-xs font-black uppercase tracking-wider border border-[#12B76A]/20">
                    <Trophy className="w-3.5 h-3.5 text-[#12B76A]" />
                    <span>Rantai 4 Soal Sempurna!</span>
                  </span>
                </div>

                <h3 className="font-display text-2xl md:text-3xl font-bold text-[#1E1E24] mb-1">
                  Luar Biasa, {currentTeam.name}!
                </h3>
                <p className="text-xs sm:text-sm text-[#065F46] font-semibold max-w-sm mx-auto mb-4">
                  Semua 4 anggota berhasil menjawab berantai tanpa ada yang salah!
                </p>

                <div className="inline-flex items-center gap-3 p-2.5 rounded-2xl bg-[#ECFDF5] border border-[#12B76A]/30 text-xs font-bold text-[#065F46]">
                  <span>+10 Poin Tim</span>
                  <span>•</span>
                  <span>+6 Poin Individu Tiap Anggota</span>
                </div>
              </div>
            ) : (
              <div className="p-6 md:p-8 rounded-[32px] bg-white border-2 border-[#F04438]/30 shadow-lg text-center relative overflow-hidden my-auto">
                <div className="relative inline-flex items-center justify-center mb-3">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#FEE2E2] to-[#FECACA] flex items-center justify-center shadow-md border-2 border-[#F04438]/20">
                    <FluentEmoji name="collision" variant="3d" size={54} />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-white shadow-md flex items-center justify-center border border-[#1E1E24]/10">
                    <FluentEmoji name="chains" variant="3d" size={26} />
                  </div>
                </div>

                <div className="mb-2">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FEF2F2] text-[#991B1B] text-xs font-black uppercase tracking-wider border border-[#F04438]/20">
                    <ShieldAlert className="w-3.5 h-3.5 text-[#F04438]" />
                    <span>Rantai Terputus di Soal #{failedQuestionIndex}!</span>
                  </span>
                </div>

                <h3 className="font-display text-2xl md:text-3xl font-bold text-[#1E1E24] mb-1">
                  Sayang Sekali, {currentTeam.name}!
                </h3>
                <p className="text-xs sm:text-sm text-[#991B1B] font-semibold max-w-sm mx-auto mb-4">
                  Jawaban terhenti di soal #{failedQuestionIndex} oleh <strong>{failedMemberName}</strong>. Rantai estafet putus dan tim gagal mengumpulkan poin bonus.
                </p>

                <div className="inline-flex items-center gap-3 p-2.5 rounded-2xl bg-[#FEF2F2] border border-[#F04438]/30 text-xs font-bold text-[#991B1B]">
                  <span>0 Poin Tim</span>
                  <span>•</span>
                  <span>Penalti -2 Poin per Anggota</span>
                </div>
              </div>
            )}

            {/* Bottom Navigation Button */}
            <div className="mt-auto pt-4">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleNextTeam}
                className="py-4 text-base md:text-lg bg-[#7C3AED] hover:bg-[#6D28D9] border-2 border-[#5B21B6] shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>
                  {isLastTeam
                    ? '🏆 Lihat Hasil Akhir & Panggung Hukuman ➡️'
                    : `Panggil Tim Berikutnya: ${g5Teams[g5CurrentTeamIndex + 1]?.name} ➡️`}
                </span>
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      <HostUtilityBar />
    </GameDesktopLayout>
  );
}
