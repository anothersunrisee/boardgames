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
    <div className="fixed bottom-4 right-4 z-40 flex items-center gap-1.5 sm:gap-2 px-3 py-2 rounded-full bg-[#1E1E24] text-[#FAF7F2] shadow-lg border border-white/10">
      {/* Undo Button (Jika Tersedia) */}
      {onUndo && (
        <button
          type="button"
          onClick={() => {
            sfx.playPop();
            onUndo();
          }}
          title={undoTitle}
          className="px-2.5 py-1.5 rounded-full bg-[#EF4444]/20 hover:bg-[#EF4444]/30 text-[#FCA5A5] flex items-center gap-1 transition cursor-pointer text-xs font-bold"
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
          className="px-2.5 py-1.5 rounded-full bg-[#7C3AED]/30 hover:bg-[#7C3AED]/45 text-[#C4B5FD] flex items-center gap-1 transition cursor-pointer text-xs font-bold"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ganti</span>
        </button>
      )}

      <button
        type="button"
        onClick={() => {
          sfx.playPop();
          navigate('/');
        }}
        title="Menu Utama"
        className="w-9 h-9 rounded-full hover:bg-white/15 flex items-center justify-center transition cursor-pointer"
      >
        <Home className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => {
          sfx.playPop();
          navigate('/room/podium');
        }}
        title="Juara & Klasemen Room"
        className="w-9 h-9 rounded-full hover:bg-white/15 flex items-center justify-center transition cursor-pointer text-[#F59E0B]"
      >
        <Trophy className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={toggleMute}
        title={muted ? 'Nyalakan Suara' : 'Matikan Suara'}
        className="w-9 h-9 rounded-full hover:bg-white/15 flex items-center justify-center transition cursor-pointer"
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
          title="Skip Ronde"
          className="w-9 h-9 rounded-full hover:bg-white/15 flex items-center justify-center transition cursor-pointer"
        >
          <FastForward className="w-4 h-4 text-[#FBBF24]" />
        </button>
      )}

      {onResetGame && (
        <button
          type="button"
          onClick={() => {
            sfx.playPop();
            onResetGame();
          }}
          title="Reset Permainan"
          className="w-9 h-9 rounded-full hover:bg-white/15 flex items-center justify-center transition cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-[#FF85C0]" />
        </button>
      )}
    </div>
  );
};

export default HostUtilityBar;

