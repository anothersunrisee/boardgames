import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, RotateCcw, FastForward, Home, Trophy, Undo2, Shuffle } from 'lucide-react';
import { sfx } from '../utils/sound';

export interface HostUtilityBarProps {
  onSkipRound?: () => void;
  onResetGame?: () => void;
  onUndo?: () => void;
  onShuffle?: () => void;
  undoTitle?: string;
  shuffleTitle?: string;
}

export const HostUtilityBar: React.FC<HostUtilityBarProps> = ({
  onSkipRound,
  onResetGame,
  onUndo,
  onShuffle,
  undoTitle = 'Batalkan Aksi (Undo)',
  shuffleTitle = 'Acak / Ganti Soal Baru (Shuffle)',
}) => {
  const navigate = useNavigate();
  const [muted, setMuted] = useState(sfx.muted);

  const toggleMute = () => {
    sfx.muted = !muted;
    setMuted(sfx.muted);
    if (!sfx.muted) sfx.playPop();
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-center gap-1.5 px-2.5 py-2 rounded-full bg-[#1E1E24] text-[#FAF7F2] shadow-xl border-2 border-white/15">
      {/* Undo Button (Jika Tersedia) */}
      {onUndo && (
        <button
          type="button"
          onClick={() => {
            sfx.playPop();
            onUndo();
          }}
          title={undoTitle}
          className="px-3 py-1.5 min-h-[38px] rounded-full bg-[#EF4444]/20 hover:bg-[#EF4444]/35 text-[#FCA5A5] flex items-center gap-1.5 transition cursor-pointer text-xs font-bold"
        >
          <Undo2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Undo</span>
        </button>
      )}

      {/* Shuffle Button (Jika Tersedia) */}
      {onShuffle && (
        <button
          type="button"
          onClick={() => {
            sfx.playPop();
            onShuffle();
          }}
          title={shuffleTitle}
          className="px-3 py-1.5 min-h-[38px] rounded-full bg-[#7C3AED]/35 hover:bg-[#7C3AED]/50 text-[#DDD6FE] flex items-center gap-1.5 transition cursor-pointer text-xs font-bold"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ganti Soal</span>
        </button>
      )}

      <button
        type="button"
        onClick={() => {
          sfx.playPop();
          navigate('/hub');
        }}
        title="Kembali ke Hub Game"
        className="px-3 py-1.5 min-h-[38px] rounded-full hover:bg-white/15 flex items-center gap-1.5 transition cursor-pointer text-xs font-bold"
      >
        <Home className="w-4 h-4 text-[#4AE3B5]" />
        <span className="hidden sm:inline">Menu Game</span>
      </button>

      <button
        type="button"
        onClick={() => {
          sfx.playPop();
          navigate('/room/podium');
        }}
        title="Leaderboard & Podium Akhir"
        className="px-3 py-1.5 min-h-[38px] rounded-full hover:bg-white/15 flex items-center gap-1.5 transition cursor-pointer text-xs font-bold text-[#FBBF24]"
      >
        <Trophy className="w-4 h-4" />
        <span className="hidden sm:inline">Leaderboard</span>
      </button>

      <button
        type="button"
        onClick={toggleMute}
        title={muted ? 'Nyalakan Suara' : 'Matikan Suara'}
        aria-label={muted ? 'Nyalakan Suara' : 'Matikan Suara'}
        className="w-10 h-10 rounded-full hover:bg-white/15 flex items-center justify-center transition cursor-pointer"
      >
        {muted ? (
          <VolumeX className="w-4 h-4 text-[#F04438]" />
        ) : (
          <Volume2 className="w-4 h-4 text-[#4AE3B5]" />
        )}
      </button>

      {onSkipRound && (
        <button
          type="button"
          onClick={() => {
            sfx.playPop();
            onSkipRound();
          }}
          title="Lanjut / Skip Ronde"
          className="px-3 py-1.5 min-h-[38px] rounded-full hover:bg-white/15 flex items-center gap-1.5 transition cursor-pointer text-xs font-bold text-[#FBBF24]"
        >
          <FastForward className="w-4 h-4" />
          <span className="hidden md:inline">Lewati</span>
        </button>
      )}

      {onResetGame && (
        <button
          type="button"
          onClick={() => {
            sfx.playPop();
            onResetGame();
          }}
          title="Ulang Game Ini"
          className="w-10 h-10 rounded-full hover:bg-white/15 flex items-center justify-center transition cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-[#FF85C0]" />
        </button>
      )}
    </div>
  );
};

export default HostUtilityBar;

