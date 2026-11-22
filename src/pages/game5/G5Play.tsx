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
import { syncHostRoomState } from '../../services/firebase';

export default function G5Play() {
  const navigate = useNavigate();
  const {
    roomCode,
    players,
    g5Teams,
    g5CurrentTeamIndex,
    g5RecordMemberAnswer,
    g5UndoAnswer,
    g5ShuffleCurrentQuestion,
    g5NextTeam,
  } = useGameStore();

  // 4 Tahap Alur Bermain:
  // 1. 'team_ready': Host memanggil tim ke depan & menunjukkan alur 4 ronde berurutan (1 ronde = 4 soal estafet, total 16 soal)
  // 2. 'chain_quiz': Tim memainkan 4 soal di dalam ronde aktif
  // 3. 'round_summary': Rekap tiap 1 ronde (4 soal) selesai -> evaluasi ronde, +2 pts tim, & hukuman/kartu tantangan
  // 4. 'team_summary': Rekapitulasi setelah tim menyelesaikan seluruh 4 ronde (16 soal)
  const [stage, setStage] = useState<'team_ready' | 'chain_quiz' | 'round_summary' | 'team_summary'>('team_ready');
  const [showAnswer, setShowAnswer] = useState(false);
  const [punishmentModalOpen, setPunishmentModalOpen] = useState(false);
  const [lastPunishedPlayer, setLastPunishedPlayer] = useState<Player | null>(null);
  const [completedRoundData, setCompletedRoundData] = useState<{
    roundNum: number;
    roundCorrectCount: number;
    isRoundPassed: boolean;
  } | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  const currentTeam = g5Teams[g5CurrentTeamIndex];

  if (!currentTeam || g5Teams.length === 0) {
    navigate('/game5/setup');
    return null;
  }

  const isLastTeam = g5CurrentTeamIndex >= g5Teams.length - 1;
  const currentGlobalIdx = Math.min(15, currentTeam.currentGlobalQuestionIdx ?? currentTeam.currentMemberIdx ?? 0);
  const currentRoundIdx = Math.min(3, Math.floor(currentGlobalIdx / 4));
  const currentQuestionInRound = currentGlobalIdx % 4;

  // Reset timer on question change
  React.useEffect(() => {
    if (stage === 'chain_quiz') {
      setTimeLeft(15);
      setIsTimerPaused(false);
    }
  }, [currentGlobalIdx, stage]);

  // Sync state ke Firebase Realtime untuk HP Controller
  React.useEffect(() => {
    if (!roomCode || !currentTeam) return;
    const currentQ = currentTeam.questions[currentGlobalIdx];
    syncHostRoomState(roomCode, {
      activeGame: 'game5',
      gamePhase: stage,
      gameState: {
        g5ActiveQuestion: currentQ?.question,
        g5ActiveCategory: currentQ?.category,
        g5ActiveMemberId: currentTeam.memberIds[currentQuestionInRound % currentTeam.memberIds.length],
        g5CurrentRound: currentRoundIdx + 1,
        g5TimeLeft: timeLeft,
      },
    });
  }, [roomCode, currentTeam, stage, currentGlobalIdx, currentQuestionInRound, currentRoundIdx, timeLeft]);

  // Tick interval
  React.useEffect(() => {
    if (stage !== 'chain_quiz' || isTimerPaused || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          sfx.playBuzzer();
          return 0;
        }
        if (prev <= 4) {
          sfx.playPop(500);
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [stage, isTimerPaused, timeLeft]);

  const currentMemberIndexInTeam = currentGlobalIdx % currentTeam.memberIds.length;
  const currentMemberId = currentTeam.memberIds[currentMemberIndexInTeam];
  const currentMember = players.find((p) => p.id === currentMemberId);
  const currentQuestion = currentTeam.questions[currentGlobalIdx] || currentTeam.questions[0];

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

    const result = g5RecordMemberAnswer(isCorrect);

    if (isCorrect) {
      sfx.playSuccess();
    } else {
      sfx.playBuzzer();
      if (currentMember) {
        setLastPunishedPlayer(currentMember);
        setPunishmentModalOpen(true);
      }
    }

    if (result.isTeamFinished) {
      sfx.playFanfare();
      setStage('team_summary');
    } else if (result.isRoundFinished) {
      setCompletedRoundData({
        roundNum: result.roundNum,
        roundCorrectCount: result.roundCorrectCount,
        isRoundPassed: result.roundCorrectCount >= 3,
      });
      // Jika benar di soal ke-4, langsung buka ringkasan ronde
      if (isCorrect) {
        setStage('round_summary');
      }
    }
  };

  // 3. Undo Jawaban / Salah Pencet
  const handleUndo = () => {
    const success = g5UndoAnswer();
    if (success) {
      sfx.playPop();
      setShowAnswer(false);
      setCompletedRoundData(null);
      if (stage === 'round_summary' || stage === 'team_summary') {
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
    } else if (completedRoundData) {
      setStage('round_summary');
    }
  };

  // 6. Host Lanjut ke Ronde Berikutnya (setelah ringkasan ronde)
  const handleStartNextRound = () => {
    sfx.playSuccess();
    setCompletedRoundData(null);
    setShowAnswer(false);
    setStage('chain_quiz');
  };

  // 7. Lanjut ke Tim Berikutnya (Setelah seluruh 4 Ronde / 16 Soal Selesai)
  const handleNextTeam = () => {
    sfx.playPop();
    if (isLastTeam) {
      navigate('/game5/results');
    } else {
      g5NextTeam();
      setStage('team_ready');
      setShowAnswer(false);
      setCompletedRoundData(null);
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
      activeRoundLabel={`${currentTeam.name} • Ronde ${currentRoundIdx + 1}/4 (Soal ${currentQuestionInRound + 1}/4)`}
      onUndo={canUndo ? handleUndo : undefined}
      undoLabel="Undo Ronde (Batal)"
      onShuffle={stage === 'chain_quiz' ? handleShuffleQuestion : undefined}
      shuffleLabel="Ganti Soal"
    >
      {stage === 'team_summary' && (currentTeam.successfulRoundsCount || 0) >= 3 && (
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
              <p className="text-xs sm:text-sm text-[#64616C] font-semibold mt-1.5 max-w-lg mx-auto">
                Silakan seluruh anggota tim maju ke depan layar! Tim ini akan memainkan{' '}
                <strong>4 Ronde Beruntun (1 Ronde = 4 Soal Estafet, Total 16 Soal)</strong>.
                Jika ada 1 orang salah, pemain tersebut langsung <strong>-2 Poin</strong> dan mendapat{' '}
                <strong>Kartu Tantangan yang WAJIB dijalankan terus sampai ronde 4 selesai!</strong>
              </p>
            </div>

            {/* Lineup 4 Ronde Pipeline Card */}
            <div className="mb-6 p-5 rounded-3xl bg-white border-2 border-[#1E1E24]/10 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#1E1E24]/10 mb-4">
                <span className="font-display text-sm font-bold text-[#1E1E24] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#7C3AED]" />
                  <span>Target Sesi: 4 Ronde (16 Soal Estafet)</span>
                </span>
                <span className="text-[11px] font-extrabold text-[#7C3AED] bg-[#EDE9FE] px-2.5 py-0.5 rounded-full">
                  +2 Pts/Ronde • 10 Pts Jackpot (4/4)
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, rIdx) => {
                  return (
                    <div
                      key={`ready-round-${rIdx}`}
                      className="p-3.5 rounded-2xl bg-[#FAF7F2] border-2 border-[#1E1E24]/8 text-center flex flex-col items-center justify-between shadow-2xs hover:border-[#7C3AED]/30 transition"
                    >
                      <span className="w-6 h-6 rounded-full bg-[#7C3AED] text-white flex items-center justify-center font-display font-black text-xs mb-1.5">
                        R{rIdx + 1}
                      </span>
                      <p className="font-display text-sm font-bold text-[#1E1E24]">
                        Ronde #{rIdx + 1}
                      </p>
                      <p className="text-xs text-[#64616C] font-medium mt-0.5">
                        4 Soal Estafet
                      </p>
                      <span className="text-xs font-extrabold text-[#158467] bg-[#ECFDF5] px-2 py-0.5 rounded-lg mt-2">
                        +2 Poin Tim
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
        {/* TAHAP 2: 4 SOAL DI DALAM RONDE AKTIF (4 RONDE X 4 SOAL = 16 SOAL)           */}
        {/* ========================================================================= */}
        {stage === 'chain_quiz' && (
          <div className="flex-1 flex flex-col justify-between">
            {/* Header Mini Mascot & Active Status */}
            <div className="text-center mb-2">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#EDE9FE] text-[#7C3AED] text-xs font-black uppercase tracking-wider border border-[#7C3AED]/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{currentTeam.name}</span>
                </span>
                <span className="text-xs font-extrabold text-[#1E1E24] bg-white border border-[#1E1E24]/10 px-3 py-0.5 rounded-full shadow-2xs">
                  Ronde <strong>{currentRoundIdx + 1}</strong> dari 4 • Soal <strong>{currentQuestionInRound + 1}</strong>/4
                </span>
                <span className="text-xs font-bold text-[#64616C] bg-white border border-[#1E1E24]/10 px-2.5 py-0.5 rounded-full shadow-2xs">
                  #{currentGlobalIdx + 1}/16
                </span>
              </div>
            </div>

            {/* Top 4-Round Pipeline Stepper */}
            <div className="mb-2 p-2.5 rounded-2xl bg-white border border-[#1E1E24]/10 shadow-xs">
              <div className="flex items-center justify-between gap-1.5">
                {Array.from({ length: 4 }).map((_, rIdx) => {
                  const isDone = rIdx < currentRoundIdx;
                  const isCurrent = rIdx === currentRoundIdx;
                  return (
                    <div
                      key={`round-pill-${rIdx}`}
                      className={`flex-1 py-1 px-2 rounded-xl text-center text-xs transition-all ${
                        isDone
                          ? 'bg-[#ECFDF5] text-[#065F46] font-bold border border-[#12B76A]/30'
                          : isCurrent
                          ? 'bg-[#7C3AED] text-white font-black shadow-xs ring-2 ring-[#7C3AED]/30'
                          : 'bg-[#F9FAFB] text-[#64616C] font-medium border border-[#E5E7EB]'
                      }`}
                    >
                      <span>{isDone ? `✓ Ronde ${rIdx + 1}` : isCurrent ? `▶ Ronde ${rIdx + 1}` : `Ronde ${rIdx + 1}`}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Visual 4-Question Relay Stepper for the CURRENT Round */}
            <div className="mb-3.5 p-3 rounded-2xl bg-white border border-[#1E1E24]/10 shadow-xs">
              <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#1E1E24]/8 text-xs font-extrabold text-[#64616C]">
                <span>Estafet Soal Ronde #{currentRoundIdx + 1}:</span>
                <span className="text-[#7C3AED]">Minimal 3 Benar = Poin Ronde</span>
              </div>
              <div className="flex items-center justify-between gap-1.5">
                {Array.from({ length: 4 }).map((_, qInRoundIdx) => {
                  const qGlobalIndex = currentRoundIdx * 4 + qInRoundIdx;
                  const historyItem = currentTeam.roundHistory?.find(
                    (h) => h.globalQuestionIdx === qGlobalIndex
                  );
                  const isDone = Boolean(historyItem);
                  const isCorrect = historyItem?.isCorrect;
                  const isCurrent = qInRoundIdx === currentQuestionInRound;
                  const memberId = currentTeam.memberIds[qGlobalIndex % currentTeam.memberIds.length];
                  const mem = players.find((p) => p.id === memberId);

                  return (
                    <React.Fragment key={`chain-step-${qInRoundIdx}`}>
                      <div
                        className={`flex-1 py-1.5 px-2 rounded-xl text-center flex items-center justify-center gap-1.5 transition-all ${
                          isDone && isCorrect
                            ? 'bg-[#ECFDF5] text-[#065F46] border border-[#12B76A]/40 font-bold'
                            : isDone && !isCorrect
                            ? 'bg-[#FEF2F2] text-[#991B1B] border border-[#EF4444]/40 font-bold'
                            : isCurrent
                            ? 'bg-[#7C3AED] text-white border-2 border-[#6D28D9] shadow-xs font-black scale-102 ring-2 ring-[#7C3AED]/30'
                            : 'bg-[#F9FAFB] text-[#64616C] border border-[#E5E7EB] font-medium'
                        }`}
                      >
                        <PlayerProfileAvatar characterId={mem?.avatarId} size={18} name={mem?.name} />
                        <span className="text-xs truncate max-w-[85px]">
                          {isDone
                            ? isCorrect
                              ? `✓ ${mem?.name}`
                              : `❌ ${mem?.name}`
                            : isCurrent
                            ? `▶ S${qInRoundIdx + 1}: ${mem?.name}`
                            : `S${qInRoundIdx + 1}: ${mem?.name}`}
                        </span>
                      </div>
                      {qInRoundIdx < 3 && (
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
              <div className="mb-3.5 p-3 rounded-2xl bg-[#FFFBEB] border-2 border-[#F59E0B] shadow-xs">
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

            {/* 15-Second Urgent Countdown Timer Bar */}
            <div className="mb-3 p-2.5 rounded-2xl bg-white border border-[#1E1E24]/10 shadow-2xs flex items-center gap-3">
              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className={`font-display text-xs font-black px-2.5 py-0.5 rounded-full transition-colors ${
                    timeLeft <= 3
                      ? 'bg-[#FEE2E2] text-[#DC2626] animate-pulse'
                      : timeLeft <= 7
                      ? 'bg-[#FEF3C7] text-[#D97706]'
                      : 'bg-[#EDE9FE] text-[#7C3AED]'
                  }`}
                >
                  ⏱️ {timeLeft > 0 ? `${timeLeft}s` : 'WAKTU HABIS!'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsTimerPaused(!isTimerPaused)}
                  className="text-xs font-bold text-[#64616C] hover:text-[#1E1E24] px-2.5 py-1 rounded-lg hover:bg-black/5 cursor-pointer"
                >
                  {isTimerPaused ? '▶ Lanjut' : '⏸ Jeda'}
                </button>
              </div>

              {/* Progress Track */}
              <div className="flex-1 h-3 rounded-full bg-[#FAF7F2] border border-[#1E1E24]/10 overflow-hidden relative">
                <motion.div
                  className={`h-full transition-all duration-300 rounded-full ${
                    timeLeft <= 3
                      ? 'bg-gradient-to-r from-[#EF4444] to-[#DC2626]'
                      : timeLeft <= 7
                      ? 'bg-gradient-to-r from-[#F59E0B] to-[#D97706]'
                      : 'bg-gradient-to-r from-[#10B981] to-[#059669]'
                  }`}
                  style={{ width: `${(timeLeft / 15) * 100}%` }}
                />
              </div>

              <button
                type="button"
                onClick={() => setTimeLeft(15)}
                className="text-xs font-bold text-[#64616C] hover:text-[#7C3AED] px-2.5 py-1 rounded-lg hover:bg-black/5 shrink-0 cursor-pointer"
                title="Reset timer ke 15 detik"
              >
                ↺ Reset 15s
              </button>
            </div>

            {/* Active Question Card */}
            <motion.div
              key={`q-${currentRoundIdx}-${currentQuestionInRound}-${currentQuestion?.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3 my-auto"
            >
              <div className="rounded-[32px] bg-gradient-to-b from-[#7C3AED] to-[#6D28D9] text-white p-5 md:p-7 shadow-lg border-2 border-[#5B21B6]/30 text-center relative overflow-hidden">
                {/* Category & Inline Shuffle Button */}
                <div className="flex items-center justify-between mb-2.5">
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

                <div className="flex items-center justify-center gap-2 mb-2 bg-white/10 py-1.5 px-4 rounded-full max-w-fit mx-auto">
                  <PlayerProfileAvatar characterId={currentMember?.avatarId} size={26} name={currentMember?.name} />
                  <p className="text-xs text-white/95 font-bold">
                    Penjawab Soal #{currentQuestionInRound + 1}:{' '}
                    <span className="font-display font-black text-white underline">{currentMember?.name}</span>
                  </p>
                </div>

                <h2 className="font-display text-lg md:text-2xl font-bold leading-snug my-2">
                  "{currentQuestion?.question}"
                </h2>
              </div>

              {/* Host Answer Clue Spoiler Box */}
              <Card className="p-3.5 bg-white shadow-xs border border-[#1E1E24]/10 text-center">
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
                    className="mt-2.5 p-2.5 rounded-xl bg-[#EDE9FE] text-[#7C3AED] font-display font-bold text-sm md:text-base border border-[#7C3AED]/20"
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
              <div className="grid grid-cols-2 gap-3 pt-1">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => handleAnswer(true)}
                  className="shadow-sm hover:shadow-md py-3.5 bg-[#12B76A] hover:bg-[#0E9F5D] border-2 border-[#057A44] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-5 h-5 stroke-[3]" />
                  <span>
                    {currentQuestionInRound === 3
                      ? currentRoundIdx === 3
                        ? 'BENAR! (Turnamen Tuntas 🎉)'
                        : 'BENAR! (Ronde Selesai ✓)'
                      : 'BENAR! (Lanjut Soal ✓)'}
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
                  <span>SALAH! (-2 Pts & Tantangan)</span>
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
                    <span>Salah Pencet? Undo Jawaban Soal Lalu</span>
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAHAP 3: RINGKASAN SETIAP 1 RONDE (4 SOAL) SELESAI                        */}
        {/* ========================================================================= */}
        {stage === 'round_summary' && (
          <motion.div
            key="stage-round-summary"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col justify-between my-auto py-2"
          >
            <div className="p-6 md:p-8 rounded-[32px] bg-white border-2 border-[#1E1E24]/10 shadow-lg text-center relative overflow-hidden my-auto space-y-4">
              <div className="relative inline-flex items-center justify-center">
                <div
                  className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-md border-2 ${
                    completedRoundData?.isRoundPassed
                      ? 'bg-gradient-to-tr from-[#D6F5EC] to-[#A7F3D0] border-[#12B76A]/20'
                      : 'bg-gradient-to-tr from-[#FFE4E6] to-[#FECDD3] border-[#F43F5E]/20'
                  }`}
                >
                  <FluentEmoji
                    name={completedRoundData?.isRoundPassed ? 'trophy' : 'warning'}
                    variant="3d"
                    size={48}
                  />
                </div>
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EDE9FE] text-[#7C3AED] text-xs font-black uppercase tracking-wider border border-[#7C3AED]/20">
                  <Award className="w-3.5 h-3.5" />
                  <span>RONDE {completedRoundData?.roundNum || currentRoundIdx} DARI 4 SELESAI</span>
                </span>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-[#1E1E24] mt-2">
                  {completedRoundData?.isRoundPassed ? '🎉 Ronde Berhasil Dituntaskan!' : '⚠️ Ronde Belum Sempurna!'}
                </h3>
                <p className="text-sm font-semibold text-[#64616C] mt-1">
                  Skor Ronde Ini: <strong className="text-[#158467] font-black">{completedRoundData?.roundCorrectCount || 0} dari 4 Soal Terjawab Benar</strong>
                </p>
                {completedRoundData?.isRoundPassed ? (
                  <p className="text-xs font-black text-[#158467] bg-[#ECFDF5] border border-[#12B76A]/30 py-1.5 px-3.5 rounded-full inline-block mt-2">
                    ✓ +2 Poin Ditambahkan untuk Seluruh Anggota Tim {currentTeam.name}!
                  </p>
                ) : (
                  <p className="text-xs font-black text-[#B45309] bg-[#FFFBEB] border border-[#F59E0B]/30 py-1.5 px-3.5 rounded-full inline-block mt-2">
                    Minimal butuh 3 jawaban benar untuk mendapatkan +2 Poin ronde.
                  </p>
                )}
              </div>

              {/* Status Hukuman / Tantangan yang Didapat */}
              {currentTeam.activeChallenges && currentTeam.activeChallenges.length > 0 ? (
                <div className="p-4 rounded-2xl bg-[#FFFBEB] border-2 border-[#F59E0B]/40 text-left">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#B45309] flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-[#EA580C] animate-pulse" />
                      <span>KARTU TANTANGAN AKTIF (WAJIB DIJALANKAN SAMPAI RONDE 4):</span>
                    </span>
                    <span className="text-xs font-bold bg-[#EA580C] text-white px-2.5 py-0.5 rounded-full">
                      Tetap Berlaku
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentTeam.activeChallenges.map((c, cIdx) => {
                      const mem = players.find((p) => p.id === c.memberId);
                      return (
                        <div
                          key={`chal-summary-${cIdx}`}
                          className="p-2.5 rounded-xl bg-white border border-[#F59E0B]/30 flex items-center gap-2 shadow-2xs"
                        >
                          <PlayerProfileAvatar characterId={mem?.avatarId} size={26} name={mem?.name} />
                          <div className="min-w-0">
                            <span className="font-display text-xs font-bold text-[#1E1E24]">{mem?.name}</span>
                            <span className="text-xs text-[#DC2626] font-bold ml-1">(-2 Pts)</span>
                            <p className="text-xs font-extrabold text-[#B45309]">"{c.challenge}"</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-[#ECFDF5] border border-[#12B76A]/30 text-center">
                  <p className="text-xs font-bold text-[#065F46] flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#12B76A]" />
                    <span>Luar biasa! Tidak ada yang salah di ronde ini, tim masih bersih tanpa tantangan!</span>
                  </p>
                </div>
              )}

              {/* Undo if host misclicked 4th question */}
              {canUndo && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleUndo}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] hover:bg-[#F3EFE6] text-[#64616C] hover:text-[#1E1E24] text-xs font-bold border border-[#1E1E24]/15 transition cursor-pointer"
                  >
                    <Undo2 className="w-3.5 h-3.5" />
                    <span>Salah Pencet? Undo Soal Lalu</span>
                  </button>
                </div>
              )}
            </div>

            {/* Tombol Lanjut ke Ronde Berikutnya */}
            <div className="mt-auto pt-4">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleStartNextRound}
                className="py-4 text-base md:text-lg bg-[#7C3AED] hover:bg-[#6D28D9] border-2 border-[#5B21B6] shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>
                  Lanjut ke Ronde {(completedRoundData?.roundNum || currentRoundIdx) + 1} dari 4 (4 Soal Berikutnya) 🚀
                </span>
              </Button>
            </div>
          </motion.div>
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
                    (currentTeam.successfulRoundsCount || 0) === 4
                      ? 'bg-gradient-to-tr from-[#D6F5EC] to-[#A7F3D0] border-[#12B76A]/20'
                      : (currentTeam.successfulRoundsCount || 0) >= 2
                      ? 'bg-gradient-to-tr from-[#EDE9FE] to-[#DDD6FE] border-[#7C3AED]/20'
                      : 'bg-gradient-to-tr from-[#FFE4E6] to-[#FECDD3] border-[#F43F5E]/20'
                  }`}
                >
                  <FluentEmoji
                    name={(currentTeam.successfulRoundsCount || 0) === 4 ? 'crown' : (currentTeam.successfulRoundsCount || 0) >= 2 ? 'party-popper' : 'dizzy-face'}
                    variant="3d"
                    size={52}
                  />
                </div>
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EDE9FE] text-[#7C3AED] text-xs font-black uppercase tracking-wider border border-[#7C3AED]/20">
                  <Award className="w-3.5 h-3.5" />
                  <span>4 Ronde Beruntun (16 Soal) Selesai</span>
                </span>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-[#1E1E24] mt-2">
                  Hasil Tim: {currentTeam.name}
                </h3>
                <p className="text-sm font-semibold text-[#64616C] mt-1">
                  Skor Performa: <strong className="text-[#158467] font-black">{currentTeam.successfulRoundsCount || 0} dari 4 Ronde Berhasil</strong>{' '}
                  ({currentTeam.correctCount || 0} dari 16 Soal Terjawab Benar • {currentTeam.teamScore || 0} Poin Terkumpul)
                </p>
                {(currentTeam.successfulRoundsCount || 0) === 4 && (
                  <p className="text-xs font-black text-[#158467] bg-[#ECFDF5] border border-[#12B76A]/30 py-1.5 px-3.5 rounded-full inline-block mt-2">
                    🎉 JACKPOT 4/4 RONDE SEMPURNA! Seluruh anggota tim dapat 10 Poin masing-masing!
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
                    <span className="text-xs font-bold bg-[#EF4444] text-white px-2.5 py-0.5 rounded-full">
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
                            <span className="text-xs text-[#DC2626] font-bold ml-1">(-2 Pts)</span>
                            {chal && (
                              <p className="text-xs text-[#B45309] font-semibold italic">"{chal.challenge}"</p>
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
