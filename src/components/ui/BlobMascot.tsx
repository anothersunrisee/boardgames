import React from 'react';
import { GameMascotBot } from '../characters/GameMascotBot';
import type { CharacterDef, MascotShape, CharacterMood } from '../../assets-library/types';

export type BlobShape =
  | 'flower'
  | 'scallop'
  | 'hexagon'
  | 'triangle'
  | 'dome'
  | 'flame'
  | 'circle'
  | 'pentagon'
  | 'diamond';

export type BlobMood =
  | 'happy'
  | 'excited'
  | 'curious'
  | 'cheeky'
  | 'dizzy'
  | 'confident'
  | 'spicy'
  | 'smug';

export type BlobAccessory = 'none' | 'glasses' | 'sunglasses' | 'crown' | 'headband' | 'horns';

interface BlobMascotProps {
  shape?: BlobShape;
  mood?: BlobMood;
  color?: string;
  accentColor?: string;
  size?: number;
  className?: string;
  floating?: boolean;
  accessory?: BlobAccessory;
}

const SHAPE_MAP: Record<BlobShape, MascotShape> = {
  flower: 'clover',
  scallop: 'starpuff',
  hexagon: 'hexagon',
  triangle: 'triangle',
  dome: 'dome',
  flame: 'flamedrop',
  circle: 'squircle',
  pentagon: 'pebble',
  diamond: 'diamondsoft',
};

const MOOD_MAP: Record<BlobMood, CharacterMood> = {
  happy: 'happy',
  excited: 'winner',
  curious: 'thinking',
  cheeky: 'happy',
  dizzy: 'dizzy',
  confident: 'happy',
  spicy: 'shocked',
  smug: 'thinking',
};

export const BlobMascot: React.FC<BlobMascotProps> = ({
  shape = 'flower',
  mood = 'excited',
  color = '#4AE3B5',
  accentColor = '#158467',
  size = 120,
  className = '',
  floating = true,
  accessory = 'none',
}) => {
  const mascotShape = SHAPE_MAP[shape] || 'squircle';
  const mascotMood = MOOD_MAP[mood] || 'idle';

  const syntheticChar: CharacterDef = {
    id: `blob-${shape}`,
    index: 1,
    name: 'Mascot',
    tagline: 'Party Mascot Bot',
    color: color,
    secondaryColor: accentColor,
    profileShape: 'trapezoid',
    profileFaceVariant: 'flat',
    mascotShape: mascotShape,
    mascotSpark: accessory === 'horns' ? 'anger' : accessory === 'crown' ? 'rays' : 'stars',
  };

  return (
    <GameMascotBot
      character={syntheticChar}
      size={size}
      mood={mascotMood}
      stickerBorder={true}
      animated={floating}
      showCrown={accessory === 'crown' || mood === 'excited'}
      className={className}
    />
  );
};

export default BlobMascot;
