import React from 'react';
import type { GameRuleConfig } from '../../assets-library/types';
import { sfx } from '../../assets-library/soundEngine';

// ============================================================================
// TACTILE UI PRIMITIVES (EXPORTABLE FOR FUTURE GAMES)
// ============================================================================
export const BTN_VARIANTS: Record<string, string> = {
  ink: 'bg-[#1E1E24] text-[#FAF7F2] shadow-[0_5px_0_#0A0A0D] hover:bg-[#2C2C35]',
  cream: 'bg-[#FAF7F2] text-[#1E1E24] border-2 border-[#1E1E24]/15 shadow-[0_5px_0_#D8D0C5] hover:bg-white',
  emerald: 'bg-[#158467] text-white shadow-[0_5px_0_#0D5945] hover:bg-[#199978]',
  berry: 'bg-[#C82373] text-white shadow-[0_5px_0_#8C144E] hover:bg-[#DC2C82]',
  cobalt: 'bg-[#2568EF] text-white shadow-[0_5px_0_#1644A8] hover:bg-[#3675F5]',
  tangerine: 'bg-[#EC5A29] text-white shadow-[0_5px_0_#AD3912] hover:bg-[#F5693B]',
  ochre: 'bg-[#8C6D46] text-white shadow-[0_5px_0_#5C4428] hover:bg-[#9E7C52]',
  sunny: 'bg-[#FBBF24] text-[#1E1E24] shadow-[0_5px_0_#C49B10] hover:bg-[#FCD34D]',
  danger: 'bg-[#F04438] text-white shadow-[0_5px_0_#B42318] hover:bg-[#F95549]',
};

export const BTN_SIZES: Record<string, string> = {
  sm: 'min-h-[38px] px-3.5 py-1.5 text-xs md:text-sm rounded-[16px]',
  md: 'min-h-[46px] px-5 py-2.5 text-sm md:text-base rounded-[20px]',
  lg: 'min-h-[54px] px-7 py-3.5 text-base md:text-lg rounded-[24px]',
  icon: 'w-11 h-11 rounded-full flex items-center justify-center p-0',
};

export const TactileButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: keyof typeof BTN_VARIANTS;
    size?: keyof typeof BTN_SIZES;
    fullWidth?: boolean;
  }
> = ({ children, variant = 'ink', size = 'md', fullWidth = false, className = '', onClick, ...props }) => {
  return (
    <button
      onClick={(e) => {
        sfx.playPop();
        onClick?.(e);
      }}
      className={`tactile-btn font-display font-bold inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed ${
        BTN_VARIANTS[variant] || BTN_VARIANTS.ink
      } ${BTN_SIZES[size] || BTN_SIZES.md} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const DifficultyBadge: React.FC<{ level: GameRuleConfig['difficulty'] }> = ({ level }) => {
  const map = {
    'Easy-Hard': 'bg-[#FDE68A] text-[#92400E]',
    Medium: 'bg-[#D6F5EC] text-[#158467]',
    Hard: 'bg-[#FCE4F0] text-[#C82373]',
    Chaos: 'bg-[#FFE4E2] text-[#B42318]',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${map[level]}`}>
      {level}
    </span>
  );
};
