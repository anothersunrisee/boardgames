import React from 'react';
import { motion } from 'framer-motion';
import { Hand, ShieldAlert } from 'lucide-react';
import { BlobMascot } from './ui/BlobMascot';
import { PlayerProfileAvatar } from './characters/PlayerProfileAvatar';
import { Button } from './ui/Button';

interface PassDeviceModalProps {
  playerName: string;
  avatarId?: string;
  teamName?: string;
  subtitle?: string;
  accentColor?: string;
  onReady: () => void;
  onBack?: () => void;
}

export const PassDeviceModal: React.FC<PassDeviceModalProps> = ({
  playerName,
  avatarId,
  teamName,
  subtitle = 'Pemain lain harap tutup mata / jangan intip layar TV ya!',
  accentColor = '#9D71E8',
  onReady,
  onBack,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 bg-[#FAF7F2] flex flex-col items-center justify-center p-6 text-center"
    >
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="absolute top-6 left-6 text-xs font-bold text-[#64616C] hover:text-[#1E1E24] flex items-center gap-1 cursor-pointer"
        >
          ← Kembali
        </button>
      )}
      <div
        style={{ backgroundColor: `${accentColor}18` }}
        className="w-40 h-40 rounded-full flex flex-col items-center justify-center mb-5 relative"
      >
        <BlobMascot
          shape="pentagon"
          mood="curious"
          color={accentColor}
          size={110}
        />
        {avatarId && (
          <div className="absolute -bottom-2 -right-1 shadow-md rounded-2xl bg-white p-1">
            <PlayerProfileAvatar characterId={avatarId} size={48} name={playerName} />
          </div>
        )}
      </div>

      <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FFE8DF] text-[#EC5A29] text-xs font-extrabold uppercase tracking-wider mb-3">
        <ShieldAlert className="w-4 h-4" />
        <span>Kunci Privasi Rahasia</span>
      </div>

      <p className="text-[#64616C] font-bold text-base mb-1">
        Host, panggil pemain ini ke depan layar:
      </p>
      <h2 className="font-display text-4xl md:text-5xl font-bold text-[#1E1E24] mb-2">
        {playerName}
      </h2>

      {teamName && (
        <span className="px-3.5 py-1 rounded-full bg-[#1E1E24]/8 text-[#1E1E24] text-xs font-bold mb-4">
          Kubu: {teamName}
        </span>
      )}

      <p className="text-[#64616C] text-sm max-w-xs mb-8">
        {subtitle}
      </p>

      <div className="w-full max-w-xs">
        <Button variant="ink" size="lg" fullWidth onClick={onReady}>
          <Hand className="w-5 h-5" />
          <span>Saya {playerName}, Buka Rahasia!</span>
        </Button>
      </div>
    </motion.div>
  );
};

export default PassDeviceModal;

