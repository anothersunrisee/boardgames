import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, X, ArrowRight, Trophy, Eye, EyeOff, Sparkles, AlertTriangle } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { BlobMascot } from '../../components/ui/BlobMascot';
import { HostUtilityBar } from '../../components/HostUtilityBar';
import { PunishmentModal } from '../../components/PunishmentModal';
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
    navigate('/');
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
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E24] px-4 py-8 md:py-12 flex flex-col justify-between">
      <div className="max-w-xl mx-auto w-full flex-1 flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-5">
          <button
            type="button"
            className="text-xs font-bold text-[#64616C] hover:text-[#1E1E24] flex items-center gap-1.5 cursor-pointer py-1 px-2.5 rounded-full hover:bg-black/5 transition-colors"
            onClick={() => {
              sfx.playPop();
              navigate('/');
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Pilih Game Lain</span>
          </button>

          <span className="font-display text-xs px-3.5 py-1.5 rounded-full bg-[#7C3AED] text-white font-bold tracking-wide">
            {currentTeam.name} ({g5CurrentTeamIndex + 1} / {g5Teams.length})
          </span>
        </div>

        {/* Mascot & Chain Progress Bar */}
        <div className="text-center mb-5">
          <div className="mb-2">
            <BlobMascot
              shape="pentagon"
              mood={teamOutcome === 'success' ? 'excited' : teamOutcome === 'broken' ? 'dizzy' : 'confident'}
              color="#A78BFA"
              accentColor="#6D28D9"
              size={85}
            />
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-[#EDE9FE] text-[#7C3AED] text-xs font-extrabold uppercase tracking-wider mb-2">
            CERDAS CERMAT BERANTAI
          </span>

          <h1 className="font-display text-2xl md:text-3xl font-bold text-[#1E1E24]">
            {currentTeam.name}
          </h1>
          <p className="text-xs text-[#64616C] font-semibold mt-1">
            Semua anggota wajib menjawab benar berurutan! Kalau 1 orang salah, rantai putus dan tim gugur.
          </p>
        </div>

        {/* Chain Relay Visual Progress */}
        <div className="mb-5 p-3.5 rounded-2xl bg-white border-2 border-[#1E1E24]/10 shadow-xs">
          <p className="text-[11px] font-extrabold text-[#64616C] uppercase tracking-wider mb-2 text-center">
            Urutan Estafet Jawaban:
          </p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {currentTeam.memberIds.map((mId, idx) => {
              const mem = players.find((p) => p.id === mId);
              const isPast = idx < currentTeam.currentMemberIdx;
              const isCurrent = idx === currentTeam.currentMemberIdx && teamOutcome === null;
              return (
                <div key={mId} className="flex items-center gap-2">
                  <div
                    className={`px-3 py-1.5 rounded-xl font-display text-xs font-bold transition-all ${
                      isPast
                        ? 'bg-[#D6F5EC] text-[#12B76A] border-2 border-[#12B76A]'
                        : isCurrent
                        ? 'bg-[#7C3AED] text-white border-2 border-[#7C3AED] shadow-sm scale-105'
                        : 'bg-[#FAF7F2] text-[#64616C] border border-[#1E1E24]/10'
                    }`}
                  >
                    <span>
                      {isPast ? '✅ ' : `${idx + 1}. `}
                      {mem?.name}
                    </span>
                  </div>
                  {idx < currentTeam.memberIds.length - 1 && (
                    <span className="text-[#64616C] text-xs font-black">➔</span>
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
              <div className="rounded-[28px] bg-[#7C3AED] text-white p-6 shadow-md border-2 border-[#1E1E24]/10 text-center relative overflow-hidden">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-extrabold uppercase tracking-wider mb-2">
                  <span>{currentQuestion?.categoryEmoji}</span>
                  <span>Kategori: {currentQuestion?.category}</span>
                </div>

                <p className="text-xs text-white/80 font-bold mb-1">
                  Pertanyaan untuk: <span className="underline font-black">{currentMember?.name}</span>
                </p>

                <h2 className="font-display text-xl md:text-2xl font-bold leading-snug my-2">
                  "{currentQuestion?.question}"
                </h2>
              </div>

              {/* Host Answer Clue Box (Hidden by default for fairness) */}
              <Card className="p-4 bg-white shadow-xs border border-[#1E1E24]/10 text-center">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#64616C] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
                    <span>Kunci Jawaban Host:</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      sfx.playPop();
                      setShowAnswer(!showAnswer);
                    }}
                    className="text-xs font-bold text-[#7C3AED] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {showAnswer ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showAnswer ? 'Sembunyikan' : 'Buka Kunci'}</span>
                  </button>
                </div>

                {showAnswer ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 p-2.5 rounded-xl bg-[#EDE9FE] text-[#7C3AED] font-display font-bold text-base"
                  >
                    {currentQuestion?.answer}
                  </motion.div>
                ) : (
                  <p className="text-xs text-[#64616C] italic mt-1 select-none">
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
                >
                  <Check className="w-5 h-5 stroke-[3]" />
                  <span>BENAR! (Lanjut)</span>
                </Button>

                <Button
                  variant="berry"
                  size="lg"
                  fullWidth
                  onClick={() => handleAnswer(false)}
                >
                  <X className="w-5 h-5 stroke-[3]" />
                  <span>SALAH! (Putus)</span>
                </Button>
              </div>
            </motion.div>
          ) : teamOutcome === 'success' ? (
            <motion.div
              key="success-outcome"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-[28px] bg-[#D6F5EC] border-3 border-[#12B76A] text-center space-y-3"
            >
              <span className="text-5xl inline-block">🎉⚡</span>
              <h2 className="font-display text-2xl font-bold text-[#158467]">
                RANTAI BERHASIL DITUNTASKAN! (+6 pt)
              </h2>
              <p className="text-sm font-semibold text-[#158467]">
                Luar biasa! Semua anggota <strong>{currentTeam.name}</strong> berhasil menjawab benar secara berurutan. Tim meraih <strong>10 Poin Kelompok</strong> dan masing-masing anggota mendapat <strong>+6 poin di Room</strong>!
              </p>

              <div className="pt-3">
                <Button
                  variant="emerald"
                  size="lg"
                  fullWidth
                  onClick={handleNextTeam}
                >
                  {isLastTeam ? (
                    <>
                      <Trophy className="w-5 h-5" />
                      <span>Lihat Hasil Akhir Turnamen 👑</span>
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
          ) : (
            <motion.div
              key="broken-outcome"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-[28px] bg-[#FFE8DF] border-3 border-[#F04438] text-center space-y-3"
            >
              <span className="text-5xl inline-block">💥⛓️</span>
              <h2 className="font-display text-2xl font-bold text-[#F04438]">
                RANTAI TERPUTUS! (-2 Poin Room)
              </h2>
              <p className="text-sm font-semibold text-[#64616C]">
                Sayang sekali, <strong>{failedMemberName}</strong> gagal menjawab dengan benar. Rantai putus: Tim mendapat <strong>0 Poin</strong> dan seluruh anggota tim kena penalti <strong>-2 poin di Room</strong>!
              </p>

              {/* Punishment Card Button for Loser */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowPunishment(true)}
                  className="w-full py-3 px-4 rounded-2xl bg-white border-2 border-[#EC5A29] text-[#EC5A29] hover:bg-[#FFE8DF] font-display text-sm font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer mb-3"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>🃏 Ambil Kartu Hukuman untuk {failedMemberName}!</span>
                </button>

                <Button
                  variant="ink"
                  size="lg"
                  fullWidth
                  onClick={handleNextTeam}
                >
                  {isLastTeam ? (
                    <>
                      <Trophy className="w-5 h-5" />
                      <span>Lihat Hasil Akhir 👑</span>
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

      <HostUtilityBar />
    </div>
  );
}
