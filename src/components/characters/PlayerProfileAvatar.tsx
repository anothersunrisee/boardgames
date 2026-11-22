import React from 'react';
import type { CharacterDef, CharacterMood } from '../../assets-library/types';
import { getCharacterById } from '../../assets-library/characters';

// ============================================================================
// STYLE A COMPONENT: ABSTRACT PLAYER PROFILE AVATAR (20 UNIQUE)
// Circular #121216 black portrait badge + bold geometric shape + minimal face
// ============================================================================
export const PlayerProfileAvatar: React.FC<{
  character?: CharacterDef;
  characterId?: string;
  name?: string;
  size?: number;
  mood?: CharacterMood;
  animated?: boolean;
  className?: string;
}> = ({
  character: propCharacter,
  characterId,
  size = 84,
  mood = 'idle',
  animated = false,
  className = '',
}) => {
  const character = propCharacter || getCharacterById(characterId || 'c01');
  const clipId = `avatar-clip-${character.id}-${size}`;

  const renderAbstractSilhouette = () => {
    const c = character.color;
    switch (character.profileShape) {
      case 'trapezoid':
        return <polygon points="34,26 86,26 108,116 12,116" fill={c} />;
      case 'dome':
        return <path d="M18,116 L18,64 C18,28 46,16 78,18 C100,20 112,42 112,72 L112,116 Z" fill={c} />;
      case 'pentagon':
        return <polygon points="8,36 74,14 114,58 98,116 14,116" fill={c} />;
      case 'worm':
        return (
          <path
            d="M34,36 C34,20 56,20 56,36 C56,48 68,52 80,52 C102,52 108,76 92,90 C78,102 48,96 42,112 L94,116 L18,116 C18,92 38,88 54,82 C66,78 34,74 34,36 Z"
            fill={c}
          />
        );
      case 'starburst':
        return (
          <polygon
            points="10,72 34,54 24,34 48,38 56,18 72,34 94,20 96,46 116,58 106,116 14,116"
            fill={c}
          />
        );
      case 'clover':
        return (
          <path
            d="M52,18 C72,12 84,32 76,48 C96,42 110,60 100,78 C92,94 74,92 70,116 L50,116 C52,96 36,96 24,84 C12,70 22,48 40,50 C34,32 40,22 52,18 Z"
            fill={c}
          />
        );
      case 'scallop':
        return (
          <path
            d="M14,72 C8,56 22,48 32,58 C24,42 36,30 48,44 C44,24 62,18 66,38 C74,20 90,28 82,46 C96,36 108,50 94,64 C110,62 112,80 96,86 L92,116 L24,116 Z"
            fill={c}
          />
        );
      case 'flask':
        return (
          <path
            d="M44,18 L76,18 L76,34 C96,52 108,78 108,116 L12,116 C12,78 24,52 44,34 Z"
            fill={c}
          />
        );
      case 'arch':
        return <path d="M22,116 L22,56 C22,26 98,26 98,56 L98,116 Z" fill={c} />;
      case 'crescent':
        return <path d="M90,22 C44,18 14,50 18,92 C20,108 32,116 48,116 L112,116 C92,96 86,58 98,30 Z" fill={c} />;
      case 'hourglass':
        return <path d="M20,24 L100,24 L78,66 L104,116 L16,116 L42,66 Z" fill={c} />;
      case 'diamond':
        return <polygon points="60,12 110,62 84,116 36,116 10,62" fill={c} />;
      case 'pill':
        return <rect x="24" y="20" width="72" height="100" rx="36" fill={c} />;
      case 'blob':
        return (
          <path
            d="M22,74 C16,42 40,20 68,24 C96,28 110,54 102,84 C98,100 94,116 94,116 L24,116 C24,116 26,94 22,74 Z"
            fill={c}
          />
        );
      case 'twinpeak':
        return <path d="M12,116 L24,34 L60,62 L94,28 L108,116 Z" fill={c} />;
      case 'bowtie':
        return <path d="M12,34 L60,54 L108,34 L102,116 L18,116 Z" fill={c} />;
      case 'crownhead':
        return <polygon points="16,116 20,34 44,54 60,22 76,54 100,34 104,116" fill={c} />;
      case 'cloudcut':
        return (
          <path
            d="M14,116 L14,76 C14,56 32,46 44,54 C48,30 78,24 88,48 C106,48 114,68 106,86 L106,116 Z"
            fill={c}
          />
        );
      case 'teardrop':
        return <path d="M60,16 C86,44 104,74 104,96 C104,112 90,116 60,116 C30,116 16,112 16,96 C16,74 34,44 60,16 Z" fill={c} />;
      case 'wave':
      default:
        return <path d="M10,54 Q35,16 60,48 T110,44 L112,116 L8,116 Z" fill={c} />;
    }
  };

  const renderMinimalistFace = () => {
    const faceOffsetY = character.profileShape === 'worm' ? -18 : character.profileShape === 'scallop' ? 12 : 4;
    const faceOffsetX = character.profileShape === 'worm' ? -14 : 0;

    if (mood === 'winner') {
      return (
        <g transform={`translate(${faceOffsetX}, ${faceOffsetY})`} stroke="#121216" strokeWidth="4.2" strokeLinecap="round" fill="none">
          <path d="M41,58 Q46,50 51,58" />
          <path d="M69,58 Q74,50 79,58" />
          <path d="M48,70 Q60,82 72,70" />
        </g>
      );
    }
    if (mood === 'shocked') {
      return (
        <g transform={`translate(${faceOffsetX}, ${faceOffsetY})`} fill="#121216">
          <circle cx="46" cy="56" r="4.8" />
          <circle cx="74" cy="56" r="4.8" />
          <ellipse cx="60" cy="73" rx="6" ry="7.5" />
        </g>
      );
    }
    if (mood === 'dizzy') {
      return (
        <g transform={`translate(${faceOffsetX}, ${faceOffsetY})`} stroke="#121216" strokeWidth="3.8" strokeLinecap="round" fill="none">
          <path d="M41,53 L51,61 M51,53 L41,61" />
          <path d="M69,53 L79,61 M79,53 L69,61" />
          <path d="M49,73 Q55,68 60,73 T71,73" />
        </g>
      );
    }
    if (mood === 'thinking') {
      return (
        <g transform={`translate(${faceOffsetX}, ${faceOffsetY})`} fill="#121216" stroke="#121216" strokeLinecap="round">
          <circle cx="49" cy="54" r="3.6" stroke="none" />
          <circle cx="76" cy="54" r="3.6" stroke="none" />
          <line x1="54" y1="72" x2="68" y2="70" strokeWidth="4" />
        </g>
      );
    }

    switch (character.profileFaceVariant) {
      case 'flat':
        return (
          <g transform={`translate(${faceOffsetX}, ${faceOffsetY})`} stroke="#121216" strokeWidth="4.2" strokeLinecap="round">
            <line x1="42" y1="56" x2="52" y2="56" />
            <line x1="68" y1="56" x2="78" y2="56" />
            <line x1="51" y1="73" x2="69" y2="73" />
          </g>
        );
      case 'smug':
        return (
          <g transform={`translate(${faceOffsetX}, ${faceOffsetY})`} stroke="#121216" strokeWidth="4" strokeLinecap="round" fill="none">
            <line x1="42" y1="54" x2="52" y2="58" />
            <line x1="78" y1="54" x2="68" y2="58" />
            <path d="M53,71 L60,76 L67,71" />
          </g>
        );
      case 'tilted':
        return (
          <g transform={`translate(${faceOffsetX}, ${faceOffsetY}) rotate(22 60 64)`} stroke="#121216" strokeWidth="4" strokeLinecap="round" fill="none">
            <line x1="43" y1="56" x2="52" y2="56" />
            <line x1="68" y1="56" x2="77" y2="56" />
            <path d="M51,70 Q60,78 69,70" />
          </g>
        );
      case 'sleepy':
        return (
          <g transform={`translate(${faceOffsetX}, ${faceOffsetY})`} stroke="#121216" strokeWidth="4" strokeLinecap="round" fill="none">
            <path d="M42,56 Q47,62 52,56" />
            <path d="M68,56 Q73,62 78,56" />
            <path d="M52,71 Q60,77 68,71 Z" fill="#121216" />
          </g>
        );
      case 'cat':
        return (
          <g transform={`translate(${faceOffsetX}, ${faceOffsetY})`} fill="#121216" stroke="#121216" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="47" cy="57" r="3.4" stroke="none" />
            <circle cx="73" cy="57" r="3.4" stroke="none" />
            <path d="M51,69 Q55,75 60,69 Q65,75 69,69" fill="none" />
          </g>
        );
      case 'grumpy':
        return (
          <g transform={`translate(${faceOffsetX}, ${faceOffsetY})`} stroke="#121216" strokeWidth="4" strokeLinecap="round" fill="none">
            <line x1="43" y1="54" x2="54" y2="59" />
            <line x1="77" y1="54" x2="66" y2="59" />
            <path d="M52,74 Q60,66 68,74" />
          </g>
        );
      case 'wink':
        return (
          <g transform={`translate(${faceOffsetX}, ${faceOffsetY})`} stroke="#121216" strokeWidth="4" strokeLinecap="round" fill="none">
            <circle cx="47" cy="57" r="3.6" fill="#121216" stroke="none" />
            <path d="M67,56 Q73,50 79,56" />
            <path d="M51,70 Q60,78 69,70" />
          </g>
        );
      case 'cute':
      case 'cheer':
      case 'smile':
      default:
        return (
          <g transform={`translate(${faceOffsetX}, ${faceOffsetY})`} fill="#121216" stroke="#121216" strokeWidth="3.8" strokeLinecap="round">
            <circle cx="47" cy="56" r="3.5" stroke="none" />
            <circle cx="73" cy="56" r="3.5" stroke="none" />
            <path d={mood === 'happy' ? 'M47,68 Q60,82 73,68' : 'M51,69 Q60,77 69,69'} fill="none" />
          </g>
        );
    }
  };

  return (
    <div
      className={`inline-flex items-center justify-center select-none ${
        animated ? 'transition-transform duration-200 hover:scale-105' : ''
      } ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox="0 0 120 120" className="overflow-visible">
        <defs>
          <clipPath id={clipId}>
            <circle cx="60" cy="60" r="56" />
          </clipPath>
        </defs>

        {/* Crisp Black Circular Portrait Backdrop */}
        <circle cx="60" cy="60" r="56" fill="#121216" />

        {/* Clipped Geometric Character + Crisp Face */}
        <g clipPath={`url(#${clipId})`}>
          <g>
            {renderAbstractSilhouette()}
            <g>
              {renderMinimalistFace()}
            </g>
          </g>
        </g>

        {/* Subtle Inner Ring Highlight */}
        <circle cx="60" cy="60" r="56" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
      </svg>
    </div>
  );
};
