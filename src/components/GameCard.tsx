import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Users } from 'lucide-react';
import { BlobMascot, type BlobMood, type BlobShape } from './ui/BlobMascot';
import { sfx } from '../utils/sound';

export interface GameCardProps {
  id?: string;
  game?: number;
  numberBadge: string;
  categoryPill: string;
  title: string;
  description: string;
  playerCount: string;
  bgColor: string;
  pillColor: string;
  mascotShape: BlobShape;
  mascotMood: BlobMood;
  mascotColor: string;
  mascotAccent: string;
  mascotAccessory?: 'none' | 'glasses' | 'crown' | 'headband' | 'horns';
  onSelect: () => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  numberBadge,
  categoryPill,
  title,
  description,
  playerCount,
  bgColor,
  pillColor,
  mascotShape,
  mascotMood,
  mascotColor,
  mascotAccent,
  mascotAccessory = 'none',
  onSelect,
}) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.985 }}
      onClick={() => {
        sfx.playPop(580);
        onSelect();
      }}
      style={{ backgroundColor: bgColor }}
      className="group relative overflow-hidden rounded-[32px] p-6 md:p-7 text-white cursor-pointer border-[3px] border-[#1E1E24]/10 shadow-[0_8px_0_rgba(30,30,36,0.1)] transition-all min-h-[220px] flex flex-col justify-between"
    >
      {/* Top Row: Category Pill + Game Number & Action Button at Top Right */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            style={{ backgroundColor: pillColor }}
            className="px-3.5 py-1.5 rounded-full font-display font-bold text-xs md:text-sm tracking-wide text-white shadow-xs"
          >
            {categoryPill}
          </span>

          <span className="px-2.5 py-1 rounded-full bg-black/20 backdrop-blur-xs text-[11px] font-extrabold tracking-wider uppercase">
            {numberBadge}
          </span>
        </div>

        {/* Circular Action Arrow at Top Right (Never overlaps the mascot) */}
        <div className="w-10 h-10 rounded-full bg-[#1E1E24] text-[#FAF7F2] flex items-center justify-center shadow-md group-hover:scale-110 group-hover:bg-white group-hover:text-[#1E1E24] transition-all shrink-0">
          <ArrowUpRight className="w-5 h-5" />
        </div>
      </div>

      {/* Middle Row: Title & Copywriting */}
      <div className="relative z-10 max-w-[68%] my-3">
        <h2 className="font-display text-2xl md:text-3xl font-bold leading-tight mb-1.5">
          {title}
        </h2>
        <p className="text-white/90 text-sm md:text-base font-medium leading-snug">
          {description}
        </p>
      </div>

      {/* Bottom Row: Player Tag on Left */}
      <div className="relative z-10 flex items-center mt-auto pt-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1E1E24]/25 text-xs font-bold text-white">
          <Users className="w-3.5 h-3.5" />
          <span>{playerCount}</span>
        </div>
      </div>

      {/* Peeking Geometric Mascot on Right/Bottom-Right (Fully Visible & Unblocked) */}
      <div className="absolute right-0 -bottom-3 pointer-events-none transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3">
        <BlobMascot
          shape={mascotShape}
          mood={mascotMood}
          color={mascotColor}
          accentColor={mascotAccent}
          accessory={mascotAccessory}
          size={140}
        />
      </div>
    </motion.div>
  );
};

export default GameCard;
