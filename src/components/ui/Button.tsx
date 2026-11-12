import React from 'react';
import { sfx } from '../../utils/sound';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'ink' | 'cream' | 'emerald' | 'berry' | 'cobalt' | 'tangerine' | 'danger' | 'primary' | 'game1' | 'game2' | 'game3' | 'game4' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  fullWidth?: boolean;
}

const variantClasses: Record<string, string> = {
  ink: 'bg-[#1E1E24] text-[#FAF7F2] shadow-[0_5px_0_#0B0B0E] hover:bg-[#2C2C35]',
  cream: 'bg-[#FAF7F2] text-[#1E1E24] border-2 border-[#1E1E24]/15 shadow-[0_5px_0_#D8D0C5] hover:bg-white',
  emerald: 'bg-[#158467] text-white shadow-[0_5px_0_#0D5945] hover:bg-[#199978]',
  berry: 'bg-[#D8317E] text-white shadow-[0_5px_0_#9E1C58] hover:bg-[#E63E8C]',
  cobalt: 'bg-[#2568EF] text-white shadow-[0_5px_0_#1644A8] hover:bg-[#3675F5]',
  tangerine: 'bg-[#EC5A29] text-white shadow-[0_5px_0_#AD3912] hover:bg-[#F5693B]',
  danger: 'bg-[#F04438] text-white shadow-[0_5px_0_#B42318] hover:bg-[#F95549]',
  // Aliases for backward compatibility:
  primary: 'bg-[#FBBF24] text-[#1E1E24] shadow-[0_5px_0_#D97706] hover:bg-[#FCD34D]',
  game1: 'bg-[#158467] text-white shadow-[0_5px_0_#0D5945] hover:bg-[#199978]',
  game2: 'bg-[#D8317E] text-white shadow-[0_5px_0_#9E1C58] hover:bg-[#E63E8C]',
  game3: 'bg-[#2568EF] text-white shadow-[0_5px_0_#1644A8] hover:bg-[#3675F5]',
  game4: 'bg-[#EC5A29] text-white shadow-[0_5px_0_#AD3912] hover:bg-[#F5693B]',
  ghost: 'bg-[#1E1E24]/10 text-[#1E1E24] shadow-[0_4px_0_rgba(30,30,36,0.15)] hover:bg-[#1E1E24]/15',
};

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'min-h-[40px] px-4 py-2 text-sm rounded-2xl',
  md: 'min-h-[48px] px-6 py-3 text-base rounded-[20px]',
  lg: 'min-h-[56px] px-7 py-4 text-lg rounded-[24px]',
  icon: 'w-12 h-12 rounded-full flex items-center justify-center p-0',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'ink',
  size = 'md',
  fullWidth = false,
  className = '',
  onClick,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    sfx.playPop();
    onClick?.(e);
  };

  return (
    <button
      onClick={handleClick}
      className={`tactile-btn font-display font-bold inline-flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
        variantClasses[variant] || variantClasses.ink
      } ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
