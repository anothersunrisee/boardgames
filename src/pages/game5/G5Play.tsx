import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Check,
  X,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  Play,
  Users,
  Shuffle,
  Undo2,
  Flame,
  Award,
} from 'lucide-react';
import { useGameStore, type Player } from '../../store/useGameStore';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { BlobMascot } from '../../components/ui/BlobMascot';
import { PlayerProfileAvatar } from '../../components/characters/PlayerProfileAvatar';
import { HostUtilityBar } from '../../components/HostUtilityBar';
import { ConfettiShower } from '../../components/motion/ConfettiShower';
import { FluentEmoji } from '../../components/ui/FluentEmoji';
import { GameDesktopLayout } from '../../components/layout/GameDesktopLayout';
import { PunishmentModal } from '../../components/PunishmentModal';
import { sfx } from '../../utils/sound';

export default function G5Play() {
  const navigate = useNavigate();
  const {
    players,
    g5Teams,
    g5CurrentTeamIndex,
    g5RecordMemberAnswer,
    g5UndoAnswer,
    g5ShuffleCurrentQuestion,
    g5NextTeam,
  } = useGameStore();

  // 3 Tahap Alur Bermain:
  // 1. 'team_ready': Host memanggil tim ke depan & menunjukkan lineup 4 ronde berurutan
  // 2. 'chain_quiz': 1 tim memainkan 4 ronde berurutan tanpa swap tim
  // 3. 'team_summary': Rekapitulasi setelah tim menyelesaikan 4 ronde beruntun
  const [stage, setStage] = useState<'team_ready' | 'chain_quiz' | 'team_summary'>('team_ready');
  const [showAnswer, setShowAnswer] = useState(false);
  const [punishmentModalOpen, setPunishmentModalOpen] = useState(false);
  const [lastPunishedPlayer, setLastPunishedPlayer] = useState<Player | null>(null);

  const currentTeam = g5Teams[g5CurrentTeamIndex];

  if (!currentTeam || g5Teams.length === 0) {
    navigate('/game5/setup');
    return null;
  }

  const isLastTeam = g5CurrentTeamIndex >= g5Teams.length - 1;
  const currentRoundIdx = Math.min(currentTeam.currentMemberIdx, 3);
  const currentMemberIndexInTeam = currentRoundIdx % currentTeam.memberIds.length;
  const currentMemberId = currentTeam.memberIds[currentMemberIndexInTeam];
  const currentMember = players.find((p) => p.id === currentMemberId);
  const currentQuestion = currentTeam.questions[currentRoundIdx] || currentTeam.questions[0];

  const canUndo = (currentTeam.roundHistory && currentTeam.roundHistory.length > 0);

  // 1. Host Mulai Sesi 4 Ronde Tim Ini
  const handleStartTeamRun = () => {
    sfx.playSuccess();
    setStage('chain_quiz');
    setShowAnswer(false);
  };

  // 2. Evaluasi Jawaban Host
  const handleAnswer = (isCorrect: boolean) => {
    setShowAnswer(false);

    if (isCorrect) {
      sfx.playSuccess();
      const result = g5RecordMemberAnswer(true);
      if (result.isTeamFinished) {
        sfx.playFanfare();
        setStage('team_summary');
      }
    } else {
      sfx.playBuzzer();
      if (currentMember) {
        setLastPunishedPlayer(currentMember);
        setPunishmentModalOpen(true);
      }
      const result = g5RecordMemberAnswer(false);
      if (result.isTeamFinished) {
        // Jika ronde 4 salah, modal hukuman muncul dulu; setelah ditutup masuk summary
      }
    }
  };

  // 3. Undo Jawaban / Salah Pencet
  const handleUndo = () => {
    const success = g5UndoAnswer();
    if (success) {
      sfx.playPop();
      setShowAnswer(false);
      if (stage === 'team_summary') {
        setStage('chain_quiz');
      }
    }
  };

  // 4. Shuffle / Ganti Soal
  const handleShuffleQuestion = () => {
    const newQ = g5ShuffleCurrentQuestion();
    if (newQ) {
      sfx.playPop();
      setShowAnswer(false);
    }
  };

  // 5. Tutup Modal Hukuman Perorangan
  const handleClosePunishmentModal = () => {
    setPunishmentModalOpen(false);
    const updatedTeam = useGameStore.getState().g5Teams[g5CurrentTeamIndex];
    if (updatedTeam?.isTeamFinished) {
      setStage('team_summary');
    }
  };

  // 6. Lanjut ke Tim Berikutnya (Setelah 4 Ronde Beruntun Selesai)
  const handleNextTeam = () => {
    sfx.playPop();
    if (isLastTeam) {
      navigate('/game5/results');
    } else {
      g5NextTeam();
      setStage('team_ready');
      setShowAnswer(false);
    }
  };

  // Daftar pemain tim yang kena hukuman
  const punishedPlayers = players.filter((p) =>
    (currentTeam.punishedMemberIds || []).includes(p.id)
  );

  return (
    <GameDesktopLayout
      gameId="game5"
      gameTitle="Cerdas Cermat Berantai"
      badge="GAME 05 • RELAY"
      badgeColor="#7C3AED"
      activeRoundLabel={`${currentTeam.name} • Ronde ${stage === 'chain_quiz' ? currentRoundIdx + 1 : 4}/4`}
      onUndo={canUndo ? handleUndo : undefined}
      undoLabel="Undo Ronde (Batal)"
      onShuffle={stage === 'chain_quiz' ? handleShuffleQuestion : undefined}
      shuffleLabel="Ganti Soal"
    >
      {stage === 'team_summary' && currentTeam.correctCount >= 3 && (
        <ConfettiShower particleCount={50} />
      )}

      <div className="max-w-3xl lg:max-w-4xl mx-auto w-full flex-1 flex flex-col">
        {/* ========================================================================= */}
        {/* TAHAP 1: PANGGIL TIM & TUNJUKKAN ANGGOTA SEBELUM GAS 4 RONDE BERUNTUN      */}
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
                Silakan seluruh anggota tim maju ke depan layar! Tim ini akan menjawab{' '}
                <strong>4 ronde soal berturut-turut</strong> secara estafet. Jika salah,{' '}
                <strong>1 orang yang salah</strong> langsung mendapat kartu hukuman!
              </p>
            </div>

            {/* Lineup 4 Ronde Anggota */}
            <div className="mb-6 p-5 rounded-3xl bg-white border-2 border-[#1E1E24]/10 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#1E1E24]/10 mb-4">
                <span className="font-display text-sm font-bold text-[#1E1E24] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#7C3AED]" />
                  <span>Urutan Penjawab 4 Ronde Beruntun:</span>
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
                        R#{qIdx + 1}
                      </span>
                      <PlayerProfileAvatar characterId={member?.avatarId} size={42} name={member?.name} />
                      <p className="font-display text-xs font-bold text-[#1E1E24] mt-2 truncate w-full">
                        {member?.name}
                      </p>
                      <span className="text-[10px] font-extrabold text-[#7C3AED] bg-[#EDE9FE] px-2 py-0.5 rounded-lg mt-1">
                        {isRepeat ? 'Ronde 4 (Relay)' : `Ronde ${qIdx + 1}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tombol Mulai 4 Ronde Tim */}
            <div className="mt-auto pt-2">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleStartTeamRun}
                className="py-4 text-base md:text-lg bg-[#7C3AED] hover:bg-[#6D28D9] border-2 border-[#5B21B6] shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Tim Sudah di Depan, Gas Mulai Ronde 1! 🚀</span>
              </Button>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* TAHAP 2: 4 RONDE BERUNTUN UNTUK 1 TIM                                      */}
        {/* ========================================================================= */}
        {stage === 'chain_quiz' && (
          <div className="flex-1 flex flex-col justify-between">
            {/* Header Mini Mascot & Active Status */}
            <div className="text-center mb-3">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#EDE9FE] text-[#7C3AED] text-xs font-black uppercase tracking-wider border border-[#7C3AED]/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{currentTeam.name}</span>
                </span>
                <span className="text-xs font-extrabold text-[#1E1E24] bg-white border border-[#1E1E24]/10 px-3 py-0.5 rounded-full shadow-2xs">
                  Ronde <strong>{currentRoundIdx + 1}</strong> dari 4
                </span>
              </div>
            </div>

            {/* Visual 4-Round Pipeline Status */}
            <div className="mb-4 p-3 rounded-2xl bg-white border border-[#1E1E24]/10 shadow-xs">
              <div className="flex items-center justify-between gap-1.5">
                {Array.from({ length: 4 }).map((_, idx) => {
                  const historyItem = currentTeam.roundHistory?.find((h) => h.roundIdx === idx);
                  const isDone = Boolean(historyItem);
                  const isCorrect = historyItem?.isCorrect;
                  const isCurrent = idx === currentRoundIdx && !isDone;
                  const memberId = currentTeam.memberIds[idx % currentTeam.memberIds.length];
                  const mem = players.find((p) => p.id === memberId);

                  return (
                    <React.Fragment key={`chain-step-${idx}`}>
                      <div
                        className={`flex-1 py-1.5 px-2 rounded-xl text-center flex items-center justify-center gap-1.5 transition-all ${
                          isDone && isCorrect
                            ? 'bg-[#ECFDF5] text-[#065F46] border border-[#12B76A]/40 font-bold'
                            : isDone && !isCorrect
                            ? 'bg-[#FEF2F2] text-[#991B1B] border border-[#EF4444]/40 font-bold'
                            : isCurrent
                            ? 'bg-[#7C3AED] text-white border-2 border-[#6D28D9] shadow-xs font-black scale-102 ring-2 ring-[#7C3AED]/30'
                            : 'bg-[#F9FAFB] text-[#9CA3AF] border border-[#E5E7EB] font-medium'
                        }`}
                      >
                        <PlayerProfileAvatar characterId={mem?.avatarId} size={18} name={mem?.name} />
                        <span className="text-[11px] truncate max-w-[85px]">
                          {isDone
                            ? isCorrect
                              ? `✓ ${mem?.name}`
                              : `❌ ${mem?.name}`
                            : isCurrent
                            ? `▶ R${idx + 1}: ${mem?.name}`
                            : `R${idx + 1}: ${mem?.name}`}
                        </span>
                      </div>
                      {idx < 3 && (
                        <ArrowRight
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isDone
                              ? isCorrect
                                ? 'text-[#12B76A]'
                                : 'text-[#EF4444]'
                              : 'text-[#D1D5DB]'
                          }`}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Active Challenges Banner (Stays active across remaining rounds for this team) */}
            {currentTeam.activeChallenges && currentTeam.activeChallenges.length > 0 && (
              <div className="mb-4 p-3.5 rounded-2xl bg-[#FFFBEB] border-2 border-[#F59E0B] shadow-xs">
                <div className="flex items-center gap-1.5 text-xs font-black text-[#B45309] uppercase tracking-wider mb-2">
                  <Flame className="w-4 h-4 text-[#EA580C] animate-pulse" />
                  <span>⚠️ KARTU TANTANGAN AKTIF (BERLAKU SAMPAI RONDE 4 SELESAI):</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentTeam.activeChallenges.map((c, cIdx) => {
                    const mem = players.find((p) => p.id === c.memberId);
                    return (
                      <div
                        key={`challenge-item-${cIdx}`}
                        className="p-2.5 rounded-xl bg-white border border-[#F59E0B]/30 flex items-center gap-2 shadow-2xs"
                      >
                        <PlayerProfileAvatar characterId={mem?.avatarId} size={26} name={mem?.name} />
                        <div className="min-w-0">
                          <p className="font-display text-xs font-bold text-[#1E1E24] truncate">
                            {mem?.name} (Kena R#{c.assignedAtRound}):
                          </p>
                          <p className="text-xs font-extrabold text-[#B45309] leading-tight">
                            "{c.challenge}"
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Active Question Card */}
            <motion.div
              key={`q-${currentRoundIdx}-${currentQuestion?.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3.5 my-auto"
            >
              <div className="rounded-[32px] bg-gradient-to-b from-[#7C3AED] to-[#6D28D9] text-white p-6 md:p-8 shadow-lg border-2 border-[#5B21B6]/30 text-center relative overflow-hidden">
                {/* Category & Inline Shuffle Button */}
                <div className="flex items-center justify-between mb-3">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-xs text-xs font-black uppercase tracking-wider shadow-xs">
                    <FluentEmoji emoji={currentQuestion?.categoryEmoji} size={18} />
                    <span>Kategori: {currentQuestion?.category}</span>
                  </div>

                  {/* Shuffle Button langsung di atas kartu */}
                  <button
                    type="button"
                    onClick={handleShuffleQuestion}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-display text-xs font-bold transition cursor-pointer border border-white/20 active:scale-95"
                    title="Ganti soal ini dengan pertanyaan lain"
                  >
                    <Shuffle className="w-3.5 h-3.5 text-[#FBBF24]" />
                    <span>Ganti Soal</span>
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2.5 mb-3 bg-white/10 py-1.5 px-4 rounded-full max-w-fit mx-auto">
                  <PlayerProfileAvatar characterId={currentMember?.avatarId} size={28} name={currentMember?.name} />
                  <p className="text-xs text-white/95 font-bold">
                    Penjawab Ronde #{currentRoundIdx + 1}:{' '}
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
                  className="shadow-sm hover:shadow-md py-3.5 bg-[#12B76A] hover:bg-[#0E9F5D] border-2 border-[#057A44] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-5 h-5 stroke-[3]" />
                  <span>
                    {currentRoundIdx >= 3 ? 'BENAR! (+2 Poin • Selesai)' : 'BENAR! (+2 Poin • Lanjut)'}
                  </span>
                </Button>

                <Button
                  variant="berry"
                  size="lg"
                  fullWidth
                  onClick={() => handleAnswer(false)}
                  className="shadow-sm hover:shadow-md py-3.5 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <X className="w-5 h-5 stroke-[3]" />
                  <span>SALAH! (-2 Pts & Kartu Tantangan)</span>
                </Button>
              </div>

              {/* Host Undo Assist Pill */}
              {canUndo && (
                <div className="flex justify-center pt-1">
                  <button
                    type="button"
                    onClick={handleUndo}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEE2E2] hover:bg-[#FECACA] text-[#DC2626] text-xs font-bold border border-[#DC2626]/20 transition cursor-pointer shadow-2xs"
                  >
                    <Undo2 className="w-3.5 h-3.5" />
                    <span>Salah Pencet? Undo Jawaban Ronde Lalu</span>
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAHAP 3: HASIL REKAP SETELAH 4 RONDE BERUNTUN SELESAI                      */}
        {/* ========================================================================= */}
        {stage === 'team_summary' && (
          <motion.div
            key="stage-team-summary"
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            className="flex-1 flex flex-col justify-between"
          >
            <div className="p-6 md:p-8 rounded-[32px] bg-white border-2 border-[#1E1E24]/10 shadow-lg text-center relative overflow-hidden my-auto space-y-4">
              <div className="relative inline-flex items-center justify-center">
                <div
                  className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-md border-2 ${
                    currentTeam.correctCount === 4
                      ? 'bg-gradient-to-tr from-[#D6F5EC] to-[#A7F3D0] border-[#12B76A]/20'
                      : currentTeam.correctCount >= 2
                      ? 'bg-gradient-to-tr from-[#EDE9FE] to-[#DDD6FE] border-[#7C3AED]/20'
                      : 'bg-gradient-to-tr from-[#FFE4E6] to-[#FECDD3] border-[#F43F5E]/20'
                  }`}
                >
                  <FluentEmoji
                    name={currentTeam.correctCount === 4 ? 'crown' : currentTeam.correctCount >= 2 ? 'party-popper' : 'dizzy-face'}
                    variant="3d"
                    size={52}
                  />
                </div>
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EDE9FE] text-[#7C3AED] text-xs font-black uppercase tracking-wider border border-[#7C3AED]/20">
                  <Award className="w-3.5 h-3.5" />
                  <span>4 Ronde Beruntun Selesai</span>
                </span>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-[#1E1E24] mt-2">
                  Hasil Tim: {currentTeam.name}
                </h3>
                <p className="text-sm font-semibold text-[#64616C] mt-1">
                  Skor ronde: <strong className="text-[#158467]">{currentTeam.correctCount} dari 4 Soal Benar</strong>{' '}
                  ({currentTeam.teamScore || (currentTeam.correctCount * 2)} Poin Terkumpul)
                </p>
                {currentTeam.correctCount === 4 && (
                  <p className="text-xs font-black text-[#158467] bg-[#ECFDF5] border border-[#12B76A]/30 py-1.5 px-3 rounded-full inline-block mt-2">
                    🎉 JACKPOT 4/4 SEMPURNA! Seluruh anggota tim dapat 10 Poin masing-masing!
                  </p>
                )}
              </div>

              {/* Status Hukuman & Tantangan Aktif */}
              {punishedPlayers.length > 0 ? (
                <div className="p-4 rounded-2xl bg-[#FEF2F2] border-2 border-[#EF4444]/30 text-left">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#991B1B] flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-[#EF4444]" />
                      <span>Pemain yang Kena Penalti (-2 Pts) & Tantangan:</span>
                    </span>
                    <span className="text-[10px] font-bold bg-[#EF4444] text-white px-2 py-0.5 rounded-full">
                      Tantangan Tuntas
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {punishedPlayers.map((p) => {
                      const chal = currentTeam.activeChallenges?.find((c) => c.memberId === p.id);
                      return (
                        <div
                          key={p.id}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#EF4444]/30 shadow-2xs"
                        >
                          <PlayerProfileAvatar characterId={p.avatarId} size={22} name={p.name} />
                          <div>
                            <span className="font-display text-xs font-bold text-[#1E1E24]">{p.name}</span>
                            <span className="text-[10px] text-[#DC2626] font-bold ml-1">(-2 Pts)</span>
                            {chal && (
                              <p className="text-[10px] text-[#B45309] font-semibold italic">"{chal.challenge}"</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-[#ECFDF5] border-2 border-[#12B76A]/30 text-center">
                  <p className="text-sm font-bold text-[#065F46] flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#12B76A]" />
                    <span>Luar Biasa! Rantai Sempurna Tanpa Ada yang Salah! (+10 Pts Penuh Tiap Orang)</span>
                  </p>
                </div>
              )}

              {/* Undo Button if host misclicked round 4 */}
              {canUndo && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleUndo}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F3EFE6] text-[#64616C] hover:text-[#1E1E24] text-xs font-bold border border-[#1E1E24]/15 transition cursor-pointer"
                  >
                    <Undo2 className="w-3.5 h-3.5" />
                    <span>Undo Ronde Terakhir</span>
                  </button>
                </div>
              )}
            </div>

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
                    ? '🏆 Lihat Hasil Akhir & Panggung Pemenang ➡️'
                    : `Panggil Tim Berikutnya: ${g5Teams[g5CurrentTeamIndex + 1]?.name} ➡️`}
                </span>
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Modal Hukuman Khusus untuk 1 Orang yang Salah */}
      {lastPunishedPlayer && (
        <PunishmentModal
          open={punishmentModalOpen}
          onClose={handleClosePunishmentModal}
          targetType="individual"
          loserName={lastPunishedPlayer.name}
          targetPlayers={[lastPunishedPlayer]}
        />
      )}

      <HostUtilityBar
        onUndo={canUndo ? handleUndo : undefined}
        onShuffle={stage === 'chain_quiz' ? handleShuffleQuestion : undefined}
      />
    </GameDesktopLayout>
  );
}
