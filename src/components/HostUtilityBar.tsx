import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, RotateCcw, FastForward, Home } from 'lucide-react';
import { sfx } from '../utils/sound';

export interface HostUtilityBarProps {
  onSkipRound?: () => void;
  onResetGame?: () => void;
}

export const HostUtilityBar: React.FC<HostUtilityBarProps> = ({
  onSkipRound,
  onResetGame,
}) => {
  const navigate = useNavigate();
  const [muted, setMuted] = useState(sfx.muted);

  const toggleMute = () => {
    sfx.muted = !muted;
    setMuted(sfx.muted);
    if (!sfx.muted) sfx.playPop();
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2 px-3 py-2 rounded-full bg-[#1E1E24] text-[#FAF7F2] shadow-lg border border-white/10">
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

