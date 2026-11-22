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
      <div className="max-w-3xl lg:max-w-4xl mx-auto w-full flex-1 flex flex-col">
        {/* Pitch Item & Absurd Buyer Banner */}
        <div className="rounded-[32px] bg-gradient-to-b from-[#65A30D] to-[#4D7C0F] text-white p-6 md:p-8 shadow-[0_12px_28px_rgba(101,163,13,0.25)] border-2 border-[#3F6212]/30 mb-5 relative overflow-hidden text-center">
          <div className="flex items-center justify-between mb-2.5">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/20 text-xs font-black uppercase tracking-wider shadow-xs">
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
              <span>Ganti Barang & Target</span>
            </button>
          </div>

          <h2 className="font-display text-2xl md:text-3xl font-bold leading-snug">
            "{match.pitchItem.prompt}"
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 text-left">
            <div className="p-3.5 rounded-2xl bg-white/15 border border-white/10">
              <span className="text-xs font-black uppercase bg-[#EF4444] text-white px-2.5 py-0.5 rounded-full shadow-xs">
                Barang Rusak / Aneh
              </span>
              <p className="font-display text-base font-bold text-white mt-1.5">
                {match.pitchItem.product}
              </p>
              <p className="text-xs text-white/90 italic mt-0.5">
                Kondisi: {match.pitchItem.flaw}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/15 border border-white/10">
              <span className="text-xs font-black uppercase bg-[#FBBF24] text-[#1E1E24] px-2.5 py-0.5 rounded-full shadow-xs">
                Calon Pembeli Absurd
              </span>
              <p className="font-display text-base font-bold text-white mt-1.5">
                {match.pitchItem.targetBuyer}
              </p>
              <p className="text-xs text-white/90 italic mt-0.5">
                Tantangan: Yakinkan target pembeli ini agar mau beli!
              </p>
            </div>
          </div>
        </div>

        {/* Pitching Combatants Duel Cards (2v2 Duo Sales) */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div
            className={`p-4 rounded-2xl border-2 transition-all text-center flex flex-col items-center justify-between ${
              stage === 'pitchA'
                ? 'bg-[#ECFCCB] border-[#65A30D] ring-4 ring-[#65A30D]/20 shadow-md scale-102'
                : 'bg-white border-[#1E1E24]/10 shadow-xs'
            }`}
          >
            <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-[#4D7C0F] text-white shadow-xs">
              DUO SALES A
            </span>
            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2">
              {teamAPlayers.map((p) => (
                <div key={p.id} className="flex items-center gap-1 bg-[#F4F4F6] px-2 py-0.5 rounded-lg">
                  <PlayerProfileAvatar characterId={p.avatarId} size={24} name={p.name} />
                  <span className="font-display text-xs font-bold text-[#1E1E24] truncate max-w-[80px]">
                    {p.name}
                  </span>
                </div>
              ))}
            </div>
            {stage === 'pitchA' && (
              <span className="inline-flex items-center gap-1 text-xs font-black text-[#4D7C0F] animate-pulse mt-2 bg-white/90 px-2.5 py-0.5 rounded-full border border-[#65A30D]/20">
                <FluentEmoji name="microphone" variant="3d" size={14} />
                <span>Sedang Presentasi!</span>
              </span>
            )}
          </div>

          <div
            className={`p-4 rounded-2xl border-2 transition-all text-center flex flex-col items-center justify-between ${
              stage === 'pitchB'
                ? 'bg-[#ECFCCB] border-[#65A30D] ring-4 ring-[#65A30D]/20 shadow-md scale-102'
                : 'bg-white border-[#1E1E24]/10 shadow-xs'
            }`}
          >
            <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-[#3F6212] text-white shadow-xs">
              DUO SALES B
            </span>
            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2">
              {teamBPlayers.map((p) => (
                <div key={p.id} className="flex items-center gap-1 bg-[#F4F4F6] px-2 py-0.5 rounded-lg">
                  <PlayerProfileAvatar characterId={p.avatarId} size={24} name={p.name} />
                  <span className="font-display text-xs font-bold text-[#1E1E24] truncate max-w-[80px]">
                    {p.name}
                  </span>
                </div>
              ))}
            </div>
            {stage === 'pitchB' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-black text-[#65A30D] animate-pulse mt-2 bg-white/90 px-2.5 py-0.5 rounded-full border border-[#65A30D]/20">
                <FluentEmoji name="microphone" variant="3d" size={14} />
                <span>Sedang Presentasi!</span>
              </span>
            )}
          </div>
        </div>

        {/* Timer & Stage Action Area */}
        <AnimatePresence mode="wait">
          {stage !== 'voting' ? (
            <motion.div
              key={stage}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 flex flex-col items-center justify-center text-center"
            >
              <div className="mb-3">
                <BlobMascot
                  shape="diamond"
                  mood={timeLeft <= 5 ? 'spicy' : 'smug'}
                  color="#84CC16"
                  accentColor="#4D7C0F"
                  accessory="sunglasses"
                  size={92}
                />
              </div>

              <span className="font-display text-xs font-black uppercase tracking-wider text-[#65A30D] mb-1.5 bg-[#ECFCCB] px-3.5 py-1 rounded-full border border-[#65A30D]/20">
                {stage === 'prep'
                  ? 'Persiapan Ide Duo Sales (15s)'
                  : stage === 'pitchA'
                  ? `Giliran Pitching: Duo Sales A (${teamAPlayers.map((p) => p.name).join(' & ')}) (45s)`
                  : `Giliran Pitching: Duo Sales B (${teamBPlayers.map((p) => p.name).join(' & ')}) (45s)`}
              </span>

              {/* Countdown Clock */}
              <div
                className={`w-36 h-36 rounded-full flex flex-col items-center justify-center border-4 shadow-md transition-all my-2 ${
                  timeLeft <= 5
                    ? 'bg-[#FFE8DF] border-[#F04438] text-[#F04438] animate-pulse'
                    : 'bg-white border-[#65A30D] text-[#65A30D]'
                }`}
              >
                <span className="font-display text-5xl font-bold">{timeLeft}</span>
                <span className="text-[11px] font-bold text-[#64616C] uppercase">Detik</span>
              </div>

              {/* Timer Controls */}
              <div className="flex items-center gap-2 mt-4">
                <button
                  type="button"
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-[#1E1E24]/10 text-xs font-bold text-[#1E1E24] hover:bg-black/5 flex items-center gap-1 cursor-pointer shadow-xs"
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
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-[#1E1E24]/10 text-xs font-bold text-[#1E1E24] hover:bg-black/5 flex items-center gap-1 cursor-pointer shadow-xs"
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
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-[#1E1E24]/10 text-xs font-bold text-[#1E1E24] hover:bg-black/5 flex items-center gap-1 cursor-pointer shadow-xs"
                  onClick={() => {
                    sfx.playPop();
                    setTimeLeft(45);
                    setIsRunning(true);
                  }}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Main Advance Button */}
              <div className="w-full mt-6">
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
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="voting-stage"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Card className="p-4 bg-[#ECFCCB] border-2 border-[#65A30D]/30 text-center shadow-xs">
                <p className="font-display text-sm font-bold text-[#65A30D] flex items-center justify-center gap-1.5">
                  <FluentEmoji name="bullseye" variant="3d" size={18} />
                  <span>Seluruh Audiens di Ruangan Memilih!</span>
                </p>
                <p className="text-xs text-[#64616C] font-semibold mt-1">
                  Siapa yang argumen & rayuan jualan barang rusaknya paling meyakinkan? Klik untuk menambah suara:
                </p>
              </Card>

              {/* Voting Counters (2v2) */}
              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={handleVoteA}
                  className="p-5 rounded-2xl bg-white border-3 border-[#65A30D] hover:bg-[#F7FEE7] text-center cursor-pointer transition shadow-xs flex flex-col items-center active:scale-98"
                >
                  <div className="flex -space-x-2 mb-1">
                    {teamAPlayers.map((p) => (
                      <PlayerProfileAvatar key={p.id} characterId={p.avatarId} size={38} name={p.name} />
                    ))}
                  </div>
                  <p className="font-display text-sm font-bold text-[#1E1E24] mt-2 truncate w-full">
                    Duo Sales A ({teamAPlayers.map((p) => p.name).join(' & ')})
                  </p>
                  <p className="font-display text-4xl font-bold text-[#65A30D] my-2">{votesA}</p>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#65A30D] text-white text-xs font-bold shadow-xs">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>+1 Vote Tim A</span>
                  </span>
                </div>

                <div
                  onClick={handleVoteB}
                  className="p-5 rounded-2xl bg-white border-3 border-[#3F6212] hover:bg-[#F7FEE7] text-center cursor-pointer transition shadow-xs flex flex-col items-center active:scale-98"
                >
                  <div className="flex -space-x-2 mb-1">
                    {teamBPlayers.map((p) => (
                      <PlayerProfileAvatar key={p.id} characterId={p.avatarId} size={38} name={p.name} />
                    ))}
                  </div>
                  <p className="font-display text-sm font-bold text-[#1E1E24] mt-2 truncate w-full">
                    Duo Sales B ({teamBPlayers.map((p) => p.name).join(' & ')})
                  </p>
                  <p className="font-display text-4xl font-bold text-[#3F6212] my-2">{votesB}</p>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3F6212] text-white text-xs font-bold shadow-xs">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>+1 Vote Tim B</span>
                  </span>
                </div>
              </div>

              {/* Finalize Button */}
              <div className="pt-3">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleFinishVoting}
                >
                  {isLastMatch ? (
                    <>
                      <FluentEmoji name="crown" variant="3d" size={22} />
                      <span>Kunci Skor & Lihat Juara Pitching</span>
                    </>
                  ) : (
                    <span>Kunci Poin & Lanjut Match Berikutnya →</span>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
