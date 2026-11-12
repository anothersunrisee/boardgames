import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  tone?: 'white' | 'cream' | 'emerald' | 'berry' | 'cobalt' | 'tangerine' | 'sunny' | 'lavender';
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const toneMap: Record<NonNullable<CardProps['tone']>, string> = {
  white: 'bg-white text-[#1E1E24]',
  cream: 'bg-[#F4EFE6] text-[#1E1E24]',
  emerald: 'bg-[#158467] text-white',
  berry: 'bg-[#D8317E] text-white',
  cobalt: 'bg-[#2568EF] text-white',
  tangerine: 'bg-[#EC5A29] text-white',
  sunny: 'bg-[#FDE68A] text-[#1E1E24]',
  lavender: 'bg-[#E9D5FF] text-[#1E1E24]',
};

export const Card: React.FC<CardProps> = ({
  children,
  tone = 'white',
  className = '',
  style,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      style={style}
      className={`tactile-card relative overflow-hidden p-6 ${toneMap[tone]} ${
        onClick ? 'cursor-pointer active:translate-y-1' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
