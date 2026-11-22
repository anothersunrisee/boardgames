import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Plus, ThumbsUp, Sparkles, Shuffle } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { BlobMascot } from '../../components/ui/BlobMascot';
import { PlayerProfileAvatar } from '../../components/characters/PlayerProfileAvatar';
import { HostUtilityBar } from '../../components/HostUtilityBar';
import { PunishmentModal } from '../../components/PunishmentModal';
import { FluentEmoji } from '../../components/ui/FluentEmoji';
import { GameDesktopLayout } from '../../components/layout/GameDesktopLayout';
import { sfx } from '../../utils/sound';
import { syncHostRoomState, listenToPlayerActions } from '../../services/firebase';

type PitchStage = 'prep' | 'pitchA' | 'pitchB' | 'voting';

export default function G6Match() {
  const navigate = useNavigate();
  const {
    roomCode,
    players,
    g6Matches,
    g6CurrentMatchIndex,
    g6UpdateMatch,
    g6NextMatch,
    addScore,
    g6ShuffleItem,
  } = useGameStore();

  const match = g6Matches[g6CurrentMatchIndex];

  const [stage, setStage] = useState<PitchStage>('prep');
  const [timeLeft, setTimeLeft] = useState(15);
  const [isRunning, setIsRunning] = useState(false);
  const [votesA, setVotesA] = useState(0);
  const [votesB, setVotesB] = useState(0);
  const [showPunishment, setShowPunishment] = useState(false);
  const [loserName, setLoserName] = useState('');
  const timerRef = useRef<number | null>(null);

  const handleShuffleItem = () => {
    const newItem = g6ShuffleItem();
    if (newItem) {
      sfx.playPop();
    }
  };

  const handleUndoStage = () => {
    sfx.playPop();
    if (stage === 'pitchA') setStage('prep');
    else if (stage === 'pitchB') setStage('pitchA');
    else if (stage === 'voting') setStage('pitchB');
  };

  const playerA = players.find((p) => p.id === match?.playerAId) || players[0];
  const playerB = players.find((p) => p.id === match?.playerBId) || players[1];

  const teamAPlayers = (match?.teamAIds && match.teamAIds.length > 0)
    ? players.filter((p) => match.teamAIds.includes(p.id))
    : [playerA];

  const teamBPlayers = (match?.teamBIds && match.teamBIds.length > 0)
    ? players.filter((p) => match.teamBIds.includes(p.id))
    : [playerB];

  // Sync state ke Firebase Realtime untuk HP Controller
  useEffect(() => {
    if (!roomCode || !match) return;
    syncHostRoomState(roomCode, {
      activeGame: 'game6',
      gamePhase: stage === 'voting' ? 'voting' : 'pitch',
      gameState: {
        g6ItemTitle: match.pitchItem?.product,
        g6ItemDescription: match.pitchItem?.flaw,
        g6TeamAIds: teamAPlayers.map((p) => p.id),
        g6TeamBIds: teamBPlayers.map((p) => p.id),
      },
    });
  }, [roomCode, match, stage, teamAPlayers, teamBPlayers]);

  // Dengarkan live voting dari HP pembeli/penonton
  useEffect(() => {
    if (!roomCode) return;
    const unsubscribe = listenToPlayerActions(roomCode, (actionsMap) => {
      if (!actionsMap) return;
      let countA = 0;
      let countB = 0;
      Object.values(actionsMap).forEach((action) => {
        if (action.type === 'cast_g6_vote') {
          if (action.payload?.team === 'A') countA++;
          if (action.payload?.team === 'B') countB++;
        }
      });
      if (countA > 0 || countB > 0) {
        setVotesA(countA);
        setVotesB(countB);
      }
    });
    return () => unsubscribe();
  }, [roomCode]);

  // Setup initial stage
  useEffect(() => {
    if (!match) return;
    setStage('prep');
    setTimeLeft(15);
    setIsRunning(true);
    setVotesA(0);
    setVotesB(0);
  }, [g6CurrentMatchIndex]);

  // Timer logic
  useEffect(() => {
    if (stage === 'voting') return;

    if (isRunning && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            sfx.playBuzzer();
            return 0;
          }
          if (prev <= 5) {
            sfx.playTick();
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft, stage]);

  if (!match) {
    navigate('/hub');
    return null;
  }

  const isLastMatch = g6CurrentMatchIndex >= g6Matches.length - 1;

  const handleNextStage = () => {
    sfx.playPop();
    if (stage === 'prep') {
      setStage('pitchA');
      setTimeLeft(45);
      setIsRunning(true);
    } else if (stage === 'pitchA') {
      setStage('pitchB');
      setTimeLeft(45);
      setIsRunning(true);
    } else if (stage === 'pitchB') {
      setStage('voting');
      setIsRunning(false);
    }
  };

  const handleVoteA = () => {
    sfx.playPop(720);
    setVotesA((v) => v + 1);
  };

  const handleVoteB = () => {
    sfx.playPop(820);
    setVotesB((v) => v + 1);
  };

  const handleFinishVoting = () => {
    sfx.playSuccess();
    let winnerTeam: 'A' | 'B' | 'tie' = 'tie';

    // Aturan 2v2 Sales: Menang +8 pt tiap anggota, Kalah +2 pt tiap anggota, Seri +4 pt
    if (votesA > votesB) {
      winnerTeam = 'A';
      teamAPlayers.forEach((p) => addScore(p.id, 8));
      teamBPlayers.forEach((p) => addScore(p.id, 2));
      setLoserName(teamBPlayers.map((p) => p.name).join(' & '));
    } else if (votesB > votesA) {
      winnerTeam = 'B';
      teamBPlayers.forEach((p) => addScore(p.id, 8));
      teamAPlayers.forEach((p) => addScore(p.id, 2));
      setLoserName(teamAPlayers.map((p) => p.name).join(' & '));
    } else {
      winnerTeam = 'tie';
      [...teamAPlayers, ...teamBPlayers].forEach((p) => addScore(p.id, 4));
      setLoserName(`${teamAPlayers.map((p) => p.name).join(' & ')} & ${teamBPlayers.map((p) => p.name).join(' & ')}`);
    }

    g6UpdateMatch(g6CurrentMatchIndex, {
      ...match,
      votesA,
      votesB,
      winnerTeam,
      winnerId: winnerTeam === 'A' ? teamAPlayers[0]?.id : winnerTeam === 'B' ? teamBPlayers[0]?.id : undefined,
      isCompleted: true,
    });

    if (isLastMatch) {
      navigate('/game6/results');
    } else {
      g6NextMatch();
    }
  };

  return (
    <GameDesktopLayout
      gameId="game6"
      gameTitle="Sell Me This Trash!"
      badge="GAME 06 • PITCH DUEL"
      badgeColor="#65A30D"
      activeRoundLabel={`Pitch Match ${match.matchNumber}/${g6Matches.length}`}
      onShuffle={handleShuffleItem}
      shuffleLabel="Ganti Barang"
      onUndo={stage !== 'prep' ? handleUndoStage : undefined}
      undoLabel="Stage Lalu"
    >
      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col justify-between gap-3">
        {/* Pitch Item & Absurd Buyer Banner (Compact Top Header) */}
        <div className="rounded-[24px] bg-gradient-to-b from-[#65A30D] to-[#4D7C0F] text-white p-4 md:p-5 shadow-[0_6px_0_#3F6212] border-2 border-[#3F6212]/30 relative overflow-hidden shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#BEF264]" />
              <span>SELL ME THIS TRASH!</span>
            </div>
            <button
              type="button"
              onClick={handleShuffleItem}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white font-display text-xs font-bold transition cursor-pointer"
              title="Ganti barang dan target pembeli baru"
            >
              <Shuffle className="w-3 h-3 text-[#BEF264]" />
              <span>Ganti Barang &amp; Target</span>
            </button>
          </div>

          <h2 className="font-display text-xl md:text-2xl font-bold leading-snug text-center">
            "{match.pitchItem.prompt}"
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-3 text-left">
            <div className="p-3 rounded-2xl bg-white/15 border border-white/10">
              <span className="text-xs font-black uppercase bg-[#EF4438] text-white px-2.5 py-0.5 rounded-full">
                Barang Rusak / Aneh
              </span>
              <p className="font-display text-sm sm:text-base font-bold text-white mt-1">
                {match.pitchItem.product}
              </p>
              <p className="text-xs text-white/90 italic mt-0.5">
                Kondisi: {match.pitchItem.flaw}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-white/15 border border-white/10">
              <span className="text-xs font-black uppercase bg-[#FBBF24] text-[#1E1E24] px-2.5 py-0.5 rounded-full">
                Calon Pembeli Absurd
              </span>
              <p className="font-display text-sm sm:text-base font-bold text-white mt-1">
                {match.pitchItem.targetBuyer}
              </p>
              <p className="text-xs text-white/90 italic mt-0.5">
                Yakinkan target pembeli ini agar mau beli!
              </p>
            </div>
          </div>
        </div>

        {/* Middle Stage: Split 2 Columns (Timer Left | Duo Sales / Voting Right) */}
        <div className="flex-1 flex flex-col min-h-0">
          <AnimatePresence mode="wait">
            {stage !== 'voting' ? (
              <motion.div
                key={stage}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-3.5 items-stretch"
              >
                {/* LEFT COLUMN: Mascot + Timer Ring + Controls */}
                <div className="md:col-span-5 rounded-[24px] bg-white border-2 border-[#1E1E24]/10 shadow-xs p-4 flex flex-col items-center justify-center text-center gap-3">
                  <BlobMascot
                    shape="diamond"
                    mood={timeLeft <= 5 ? 'spicy' : 'smug'}
                    color="#84CC16"
                    accentColor="#4D7C0F"
                    accessory="sunglasses"
                    size={68}
                  />

                  <span className="font-display text-xs font-black uppercase tracking-wider text-[#3F6212] bg-[#ECFCCB] px-3 py-1 rounded-full border border-[#65A30D]/25">
                    {stage === 'prep'
                      ? 'Persiapan Ide (15s)'
                      : stage === 'pitchA'
                      ? 'Giliran Duo Sales A (45s)'
                      : 'Giliran Duo Sales B (45s)'}
                  </span>

                  <div
                    className={`w-32 h-32 lg:w-36 lg:h-36 rounded-full flex flex-col items-center justify-center border-4 shadow-md transition-all ${
                      timeLeft <= 5
                        ? 'bg-[#FFE8DF] border-[#F04438] text-[#F04438] animate-pulse'
                        : 'bg-[#FAF7F2] border-[#65A30D] text-[#4D7C0F]'
                    }`}
                  >
                    <span className="font-display text-4xl lg:text-5xl font-bold tabular-nums">{timeLeft}</span>
                    <span className="text-xs font-bold text-[#64616C] uppercase">Detik</span>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] border-2 border-[#1E1E24]/15 text-xs font-bold text-[#1E1E24] hover:bg-black/5 flex items-center gap-1 cursor-pointer"
                      onClick={() => {
                        sfx.playPop();
                        setIsRunning(!isRunning);
                      }}
                    >
                      {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isRunning ? 'Jeda' : 'Lanjut'}</span>
                    </button>

                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] border-2 border-[#1E1E24]/15 text-xs font-bold text-[#1E1E24] hover:bg-black/5 flex items-center gap-1 cursor-pointer"
                      onClick={() => {
                        sfx.playPop();
                        setTimeLeft((t) => t + 10);
                      }}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+10s</span>
                    </button>

                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] border-2 border-[#1E1E24]/15 text-xs font-bold text-[#1E1E24] hover:bg-black/5 flex items-center gap-1 cursor-pointer"
                      onClick={() => {
                        sfx.playPop();
                        setTimeLeft(stage === 'prep' ? 15 : 45);
                        setIsRunning(true);
                      }}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>

                {/* RIGHT COLUMN: Duo Sales A & Duo Sales B Cards */}
                <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    className={`p-4 rounded-[24px] border-2 transition-all text-center flex flex-col items-center justify-center gap-2.5 ${
                      stage === 'pitchA'
                        ? 'bg-[#ECFCCB] border-[#65A30D] ring-3 ring-[#65A30D]/25 shadow-sm'
                        : 'bg-white border-[#1E1E24]/10 shadow-xs'
                    }`}
                  >
                    <span className="text-xs font-black uppercase px-3 py-0.5 rounded-full bg-[#4D7C0F] text-white">
                      DUO SALES A
                    </span>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {teamAPlayers.map((p) => (
                        <div key={p.id} className="flex items-center gap-2 bg-[#FAF7F2] border border-[#1E1E24]/10 px-3 py-1.5 rounded-xl">
                          <PlayerProfileAvatar characterId={p.avatarId} size={30} name={p.name} />
                          <span className="font-display text-sm font-bold text-[#1E1E24] truncate max-w-[100px]">
                            {p.name}
                          </span>
                        </div>
                      ))}
                    </div>
                    {stage === 'pitchA' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-black text-[#4D7C0F] animate-pulse bg-white px-3 py-1 rounded-full border border-[#65A30D]/25">
                        <FluentEmoji name="microphone" variant="3d" size={14} />
                        <span>Sedang Presentasi!</span>
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-[#64616C]">Siap berjualan!</span>
                    )}
                  </div>

                  <div
                    className={`p-4 rounded-[24px] border-2 transition-all text-center flex flex-col items-center justify-center gap-2.5 ${
                      stage === 'pitchB'
                        ? 'bg-[#ECFCCB] border-[#65A30D] ring-3 ring-[#65A30D]/25 shadow-sm'
                        : 'bg-white border-[#1E1E24]/10 shadow-xs'
                    }`}
                  >
                    <span className="text-xs font-black uppercase px-3 py-0.5 rounded-full bg-[#3F6212] text-white">
                      DUO SALES B
                    </span>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {teamBPlayers.map((p) => (
                        <div key={p.id} className="flex items-center gap-2 bg-[#FAF7F2] border border-[#1E1E24]/10 px-3 py-1.5 rounded-xl">
                          <PlayerProfileAvatar characterId={p.avatarId} size={30} name={p.name} />
                          <span className="font-display text-sm font-bold text-[#1E1E24] truncate max-w-[100px]">
                            {p.name}
                          </span>
                        </div>
                      ))}
                    </div>
                    {stage === 'pitchB' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-black text-[#4D7C0F] animate-pulse bg-white px-3 py-1 rounded-full border border-[#65A30D]/25">
                        <FluentEmoji name="microphone" variant="3d" size={14} />
                        <span>Sedang Presentasi!</span>
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-[#64616C]">Menunggu giliran</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="voting-stage"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-3.5 items-stretch"
              >
                <Card className="md:col-span-5 p-5 bg-[#ECFCCB] border-2 border-[#65A30D]/30 text-center shadow-xs flex flex-col items-center justify-center gap-2.5">
                  <FluentEmoji name="bullseye" variant="3d" size={38} />
                  <p className="font-display text-lg font-bold text-[#3F6212]">
                    Seluruh Audiens Memilih!
                  </p>
                  <p className="text-xs text-[#3F6212]/90 font-semibold leading-relaxed">
                    Siapa yang rayuan jualan barang rusaknya paling meyakinkan? Klik kartu tim untuk menambah suara!
                  </p>
                  <span className="px-3 py-1 rounded-full bg-white text-xs font-extrabold text-[#3F6212] border border-[#65A30D]/25">
                    Total Suara Masuk: {votesA + votesB}
                  </span>
                </Card>

                <div className="md:col-span-7 grid grid-cols-2 gap-3.5">
                  <div
                    onClick={handleVoteA}
                    className="p-5 rounded-[24px] bg-white border-3 border-[#65A30D] hover:bg-[#F7FEE7] text-center cursor-pointer transition shadow-xs flex flex-col items-center justify-center active:scale-98"
                  >
                    <div className="flex -space-x-2 mb-1.5">
                      {teamAPlayers.map((p) => (
                        <PlayerProfileAvatar key={p.id} characterId={p.avatarId} size={38} name={p.name} />
                      ))}
                    </div>
                    <p className="font-display text-sm font-bold text-[#1E1E24] truncate w-full">
                      Duo Sales A ({teamAPlayers.map((p) => p.name).join(' & ')})
                    </p>
                    <p className="font-display text-4xl font-bold text-[#65A30D] my-2.5 tabular-nums">{votesA}</p>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#65A30D] text-white text-xs font-bold shadow-xs">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>+1 Vote Tim A</span>
                    </span>
                  </div>

                  <div
                    onClick={handleVoteB}
                    className="p-5 rounded-[24px] bg-white border-3 border-[#3F6212] hover:bg-[#F7FEE7] text-center cursor-pointer transition shadow-xs flex flex-col items-center justify-center active:scale-98"
                  >
                    <div className="flex -space-x-2 mb-1.5">
                      {teamBPlayers.map((p) => (
                        <PlayerProfileAvatar key={p.id} characterId={p.avatarId} size={38} name={p.name} />
                      ))}
                    </div>
                    <p className="font-display text-sm font-bold text-[#1E1E24] truncate w-full">
                      Duo Sales B ({teamBPlayers.map((p) => p.name).join(' & ')})
                    </p>
                    <p className="font-display text-4xl font-bold text-[#3F6212] my-2.5 tabular-nums">{votesB}</p>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3F6212] text-white text-xs font-bold shadow-xs">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>+1 Vote Tim B</span>
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Fixed Anchored Main Action Button (Consistent vertical placement) */}
        <div className="shrink-0">
          {stage !== 'voting' ? (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleNextStage}
            >
              {stage === 'prep'
                ? `Mulai Pitching Duo Sales A (${teamAPlayers.map((p) => p.name).join(' & ')}) →`
                : stage === 'pitchA'
                ? `Lanjut Pitching Duo Sales B (${teamBPlayers.map((p) => p.name).join(' & ')}) →`
                : 'Masuk ke Voting Audiens 🗳️ →'}
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleFinishVoting}
            >
              {isLastMatch ? (
                <>
                  <FluentEmoji name="crown" variant="3d" size={22} />
                  <span>Kunci Skor &amp; Lihat Juara Pitching</span>
                </>
              ) : (
                <span>Kunci Poin &amp; Lanjut Match Berikutnya →</span>
              )}
            </Button>
          )}
        </div>
      </div>

      <PunishmentModal
        open={showPunishment}
        onClose={() => setShowPunishment(false)}
        loserName={loserName}
        targetType={
          (votesA > votesB ? teamBPlayers : teamAPlayers).length > 1
            ? 'team'
            : 'individual'
        }
        targetTeamName={
          (votesA > votesB ? teamBPlayers : teamAPlayers).length > 1
            ? loserName
            : undefined
        }
        targetPlayers={votesA > votesB ? teamBPlayers : teamAPlayers}
      />

      <div className="block lg:hidden">
        <HostUtilityBar
          onShuffle={handleShuffleItem}
          onUndo={stage !== 'prep' ? handleUndoStage : undefined}
        />
      </div>
    </GameDesktopLayout>
  );
}
