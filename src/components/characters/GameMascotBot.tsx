import React from 'react';
import { motion } from 'framer-motion';
import type { CharacterDef, CharacterMood } from '../../assets-library/types';

// ============================================================================
// STYLE B COMPONENT: IN-GAME MASCOT BOT (20 UNIQUE - GROK BOT / CUE / DOTS)
// Free-floating smooth organic shapes + signature glowing white pill eyes
// ============================================================================
export const GameMascotBot: React.FC<{
  character: CharacterDef;
  size?: number;
  mood?: CharacterMood;
  stickerBorder?: boolean;
  animated?: boolean;
  showCrown?: boolean;
  className?: string;
}> = ({
  character,
  size = 92,
  mood = 'idle',
  stickerBorder = true,
  animated = true,
  showCrown = false,
  className = '',
}) => {
  const c = character.color;
  const delay = (character.index % 6) * 0.25;

  const renderOrganicBody = (isOutline = false) => {
    const props = isOutline
      ? {
          fill: '#FFFFFF',
          stroke: '#FFFFFF',
          strokeWidth: 15,
          strokeLinejoin: 'round' as const,
          strokeLinecap: 'round' as const,
        }
      : { fill: c };

    switch (character.mascotShape) {
      case 'squircle':
        return <rect x="22" y="24" width="76" height="72" rx="26" transform="rotate(-7 60 60)" {...props} />;
      case 'cloud':
        return (
          <path
            d="M32,88 C18,88 12,75 18,62 C18,48 32,42 40,46 C44,28 74,24 82,44 C98,44 108,58 102,74 C100,84 90,88 78,88 Z"
            {...props}
          />
        );
      case 'teardrop':
        return (
          <path
            d="M60,18 C78,42 96,60 96,76 C96,95 80,104 60,104 C40,104 24,95 24,76 C24,60 42,42 60,18 Z"
            {...props}
          />
        );
      case 'triangle':
        return (
          <path
            d="M52,24 C56,16 64,16 68,24 L100,84 C104,92 98,100 89,100 L31,100 C22,100 16,92 20,84 Z"
            {...props}
          />
        );
      case 'hexagon':
        return (
          <path
            d="M54,18 C58,15 62,15 66,18 L96,35 C100,38 102,42 102,46 L102,74 C102,78 100,82 96,85 L66,102 C62,105 58,105 54,102 L24,85 C20,82 18,78 18,74 L18,46 C18,42 20,38 24,35 Z"
            {...props}
          />
        );
      case 'bean':
        return (
          <path
            d="M26,56 C22,34 48,20 72,26 C94,32 104,54 96,76 C88,96 58,102 36,92 C24,86 28,68 26,56 Z"
            {...props}
          />
        );
      case 'pebble':
        return (
          <path
            d="M22,74 C16,54 34,30 60,26 C88,22 106,46 98,74 C92,94 64,100 40,94 C28,90 25,82 22,74 Z"
            {...props}
          />
        );
      case 'starpuff':
        return (
          <path
            d="M60,16 C70,16 74,30 84,30 C96,30 104,42 98,54 C106,64 102,80 90,82 C88,94 74,104 60,98 C46,104 32,94 30,82 C18,80 14,64 22,54 C16,42 24,30 36,30 C46,30 50,16 60,16 Z"
            {...props}
          />
        );
      case 'capsule':
        return <rect x="18" y="34" width="84" height="54" rx="27" {...props} />;
      case 'dome':
        return <path d="M22,64 C22,34 38,20 60,20 C82,20 98,34 98,64 L98,84 C98,94 90,100 80,100 L40,100 C30,100 22,94 22,84 Z" {...props} />;
      case 'clover':
        return (
          <path
            d="M44,24 C56,16 70,22 72,34 C86,32 98,44 92,58 C100,70 90,88 76,86 C70,98 52,102 44,90 C28,92 18,76 26,64 C16,52 26,34 40,36 C38,30 40,26 44,24 Z"
            {...props}
          />
        );
      case 'flamedrop':
        return (
          <path
            d="M62,16 C74,32 98,46 96,74 C94,94 78,104 58,104 C38,104 22,92 22,72 C22,56 34,44 40,36 C42,42 46,44 50,40 C50,28 58,20 62,16 Z"
            {...props}
          />
        );
      case 'cube':
        return <rect x="24" y="24" width="72" height="72" rx="20" transform="rotate(6 60 60)" {...props} />;
      case 'twinbump':
        return (
          <path
            d="M20,76 C18,52 30,28 46,34 C54,38 56,46 60,46 C64,46 66,38 74,34 C90,28 102,52 100,76 C98,94 82,100 60,100 C38,100 22,94 20,76 Z"
            {...props}
          />
        );
      case 'diamondsoft':
        return (
          <path
            d="M60,16 C68,16 102,50 102,60 C102,70 68,104 60,104 C52,104 18,70 18,60 C18,50 52,16 60,16 Z"
            {...props}
          />
        );
      case 'mushroom':
        return (
          <path
            d="M20,66 C18,38 36,22 60,22 C84,22 102,38 100,66 C98,78 86,80 80,82 L78,94 C76,100 44,100 42,94 L40,82 C34,80 22,78 20,66 Z"
            {...props}
          />
        );
      case 'wavebot':
        return (
          <path
            d="M20,62 C20,38 40,26 60,30 C80,34 100,26 100,56 C100,86 84,100 60,96 C36,92 20,86 20,62 Z"
            {...props}
          />
        );
      case 'crescentbot':
        return <circle cx="60" cy="60" r="39" {...props} />;
      case 'pillbot':
        return <rect x="28" y="18" width="64" height="84" rx="32" transform="rotate(-6 60 60)" {...props} />;
      case 'crownpuff':
      default:
        return (
          <path
            d="M22,74 L22,42 C22,32 34,28 42,38 L52,26 C57,20 63,20 68,26 L78,38 C86,28 98,32 98,42 L98,74 C98,92 84,100 60,100 C36,100 22,92 22,74 Z"
            {...props}
          />
        );
    }
  };

  // Signature Grok Bot / Cue white pill eyes with fluid mood variants
  const renderGrokPillEyes = () => {
    const eyeY = character.mascotShape === 'triangle' || character.mascotShape === 'teardrop' ? 66 : 58;

    if (mood === 'happy' || mood === 'winner') {
      return (
        <g stroke="#FFFFFF" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d={`M41,${eyeY + 3} L49,${eyeY - 4} L41,${eyeY - 10}`} />
          <path d={`M79,${eyeY + 3} L71,${eyeY - 4} L79,${eyeY - 10}`} />
        </g>
      );
    }

    if (mood === 'dizzy') {
      return (
        <g fill="#FFFFFF">
          <rect x="42" y={eyeY - 9} width="8.5" height="20" rx="4.2" transform={`rotate(24 46 ${eyeY})`} />
          <rect x="69" y={eyeY - 9} width="8.5" height="20" rx="4.2" transform={`rotate(-24 73 ${eyeY})`} />
        </g>
      );
    }

    if (mood === 'shocked') {
      return (
        <g fill="#FFFFFF">
          <rect x="43" y={eyeY - 14} width="10" height="28" rx="5" />
          <rect x="67" y={eyeY - 14} width="10" height="28" rx="5" />
        </g>
      );
    }

    if (mood === 'thinking') {
      return (
        <g fill="#FFFFFF">
          <rect x="47" y={eyeY - 11} width="8.5" height="20" rx="4.2" transform={`rotate(-8 51 ${eyeY})`} />
          <rect x="68" y={eyeY - 5} width="15" height="7.5" rx="3.7" transform={`rotate(-18 75 ${eyeY})`} />
        </g>
      );
    }

    // Default ultra-clean Grok Bot white vertical pill eyes
    return (
      <g fill="#FFFFFF">
        <rect x="44" y={eyeY - 11} width="9" height="22" rx="4.5" transform={`rotate(-6 48 ${eyeY})`} />
        <rect x="66" y={eyeY - 11} width="9" height="22" rx="4.5" transform={`rotate(-6 70 ${eyeY})`} />
      </g>
    );
  };

  // Optional tiny floating Grok sticker accent sparks
  const renderSparkAccent = () => {
    if (mood === 'winner') {
      return (
        <g fill="#FBBF24">
          <path d="M98,16 L101,23 L108,26 L101,29 L98,36 L95,29 L88,26 L95,23 Z" />
          <circle cx="18" cy="24" r="4" fill="#EC5A29" />
        </g>
      );
    }
    if (mood === 'thinking') {
      return (
        <g fill="#1E1E24">
          <circle cx="96" cy="24" r="3.2" />
          <circle cx="105" cy="24" r="3.2" />
          <circle cx="114" cy="24" r="3.2" />
        </g>
      );
    }
    switch (character.mascotSpark) {
      case 'rays':
        return (
          <g stroke="#FBBF24" strokeWidth="4" strokeLinecap="round">
            <line x1="94" y1="22" x2="104" y2="14" />
            <line x1="100" y1="32" x2="112" y2="30" />
          </g>
        );
      case 'heart':
        return (
          <path
            d="M102,24 C102,20 107,18 110,21 C113,18 118,20 118,24 C118,29 110,34 110,34 C110,34 102,29 102,24 Z"
            fill="#F43F7E"
          />
        );
      case 'stars':
        return <path d="M102,16 L104.5,22 L111,24.5 L104.5,27 L102,33 L99.5,27 L93,24.5 L99.5,22 Z" fill="#FBBF24" />;
      case 'bolt':
        return <polygon points="102,12 94,25 101,25 97,36 109,22 102,22" fill="#FBBF24" />;
      case 'question':
        return (
          <text x="96" y="32" fill="#1E1E24" fontSize="22" fontWeight="900" fontFamily="Fredoka, sans-serif">
            ?
          </text>
        );
      default:
        return null;
    }
  };

  // Motion physics per mood (smooth anticipation & squash-and-stretch)
  const bodyAnim = !animated
    ? undefined
    : mood === 'winner'
    ? { y: [0, -12, 0], scaleX: [1.04, 0.94, 1.04], scaleY: [0.95, 1.07, 0.95], rotate: [-3, 3, -3] }
    : mood === 'happy'
    ? { y: [0, -8, 0], scaleY: [0.97, 1.04, 0.97] }
    : mood === 'shocked'
    ? { x: [-2, 2, -2, 2, 0], scale: [1, 1.04, 1] }
    : mood === 'dizzy'
    ? { rotate: [-6, 6, -6], y: [0, -3, 0] }
    : { y: [0, -5, 0], rotate: [-1.5, 1.5, -1.5] };

  return (
    <motion.div
      className={`inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
      animate={bodyAnim}
      transition={{
        duration: mood === 'winner' ? 0.85 : mood === 'shocked' ? 0.5 : 2.8,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
      whileHover={animated ? { scale: 1.1 } : undefined}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        className="overflow-visible"
        style={{
          filter: stickerBorder ? 'drop-shadow(0 5px 8px rgba(30,30,36,0.14))' : 'drop-shadow(0 4px 6px rgba(30,30,36,0.1))',
        }}
      >
        {/* Optional Die-Cut Sticker Contour */}
        {stickerBorder && renderOrganicBody(true)}

        {/* Smooth Organic Mascot Body */}
        {renderOrganicBody(false)}

        {/* Optional Winner Crown */}
        {showCrown && (
          <path
            d="M40,22 L46,6 L60,16 L74,6 L80,22 Z"
            fill="#FBBF24"
            stroke="#1E1E24"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
        )}

        {/* Signature White Pill Eyes with smooth 60fps blink & subtle glance */}
        <motion.g
          animate={
            animated
              ? {
                  scaleY: [1, 1, 1, 0.08, 1, 1],
                  x: mood === 'idle' ? [0, 3, 3, 0, -3, 0] : [0, 0, 0, 0, 0, 0],
                }
              : undefined
          }
          transition={{
            duration: 3.8,
            times: [0, 0.42, 0.45, 0.48, 0.52, 1],
            repeat: Infinity,
            delay,
          }}
          style={{ transformOrigin: '60px 58px' }}
        >
          {renderGrokPillEyes()}
        </motion.g>

        {/* Mini Accent Spark */}
        {renderSparkAccent()}
      </svg>
    </motion.div>
  );
};
