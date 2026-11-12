import React from 'react';
import { motion } from 'framer-motion';

export type BlobShape =
  | 'flower'     // 4-leaf clover blob (Headspace Joyful)
  | 'scallop'    // Crown/wave top blob (Headspace Energized)
  | 'hexagon'    // Rounded hexagon (Headspace Confused)
  | 'triangle'   // Rounded triangle (Baby Resume Skills / Stressed)
  | 'dome'       // Arch / Ghost shape (Headspace Sensitive)
  | 'flame'      // Organic fire blob (Habitz streak / Devil's Advocate)
  | 'circle'     // Classic round buddy
  | 'pentagon';  // Habitz pentagon buddy

export type BlobMood =
  | 'happy'      // Closed curved happy eyes
  | 'excited'    // Wide googly eyes + big smile
  | 'curious'    // Looking sideways + "o" mouth
  | 'cheeky'     // Winking / mischievous grin
  | 'dizzy'      // One spiral eye + one dot eye
  | 'confident'  // Cool glasses / raised brow
  | 'spicy';     // Devilish eyebrows + smirk

interface BlobMascotProps {
  shape?: BlobShape;
  mood?: BlobMood;
  color?: string;
  accentColor?: string;
  size?: number;
  className?: string;
  floating?: boolean;
  accessory?: 'none' | 'glasses' | 'crown' | 'headband' | 'horns';
}

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
  const renderShapePath = () => {
    switch (shape) {
      case 'flower':
        return (
          <path
            d="M60 12C73 12 83 20 85 33C97 35 106 46 106 60C106 74 97 85 85 87C83 100 73 108 60 108C47 108 37 100 35 87C23 85 14 74 14 60C14 46 23 35 35 33C37 20 47 12 60 12Z"
            fill={color}
          />
        );
      case 'scallop':
        return (
          <path
            d="M20 32C20 20 32 16 40 25C46 15 54 15 60 25C66 15 74 15 80 25C88 16 100 20 100 32V74C100 94 84 108 60 108C36 108 20 94 20 74V32Z"
            fill={color}
          />
        );
      case 'hexagon':
        return (
          <path
            d="M38 16H82C87 16 92 19 94 24L110 54C112 58 112 62 110 66L94 96C92 101 87 104 82 104H38C33 104 28 101 26 96L10 66C8 62 8 58 10 54L26 24C28 19 33 16 38 16Z"
            fill={color}
          />
        );
      case 'triangle':
        return (
          <path
            d="M68 18L106 86C110 94 104 104 95 104H25C16 104 10 94 14 86L52 18C56 10 64 10 68 18Z"
            fill={color}
          />
        );
      case 'dome':
        return (
          <path
            d="M60 14C86 14 104 34 104 60V92C104 100 98 106 90 106H30C22 106 16 100 16 92V60C16 34 34 14 60 14Z"
            fill={color}
          />
        );
      case 'flame':
        return (
          <path
            d="M62 10C62 10 98 34 98 68C98 91 81 108 58 108C35 108 18 91 18 68C18 52 28 38 35 32C35 32 32 45 42 46C39 28 62 10 62 10Z"
            fill={color}
          />
        );
      case 'pentagon':
        return (
          <path
            d="M66 15L104 42C109 45 111 51 109 57L94 98C92 103 87 107 81 107H39C33 107 28 103 26 98L11 57C9 51 11 45 16 42L54 15C58 12 62 12 66 15Z"
            fill={color}
          />
        );
      case 'circle':
      default:
        return <circle cx="60" cy="60" r="46" fill={color} />;
    }
  };

  const renderFace = () => {
    switch (mood) {
      case 'happy':
        return (
          <g stroke="#1E1E24" strokeWidth="4.5" strokeLinecap="round" fill="none">
            <path d="M40 54C42 60 49 60 51 54" />
            <path d="M69 54C71 60 78 60 80 54" />
            <path d="M36 64C46 77 74 77 84 64" />
          </g>
        );
      case 'dizzy':
        return (
          <g>
            {/* Left Eye */}
            <circle cx="46" cy="58" r="13" fill="#FFFFFF" />
            <circle cx="46" cy="58" r="5.5" fill="#1E1E24" />
            {/* Right Eye with Spiral */}
            <circle cx="74" cy="58" r="13" fill="#FFFFFF" />
            <path
              d="M74 58C74 55 77 55 77 58C77 62 70 62 70 57C70 51 80 51 80 59"
              stroke={accentColor}
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <path d="M54 78Q60 73 66 78" stroke="#1E1E24" strokeWidth="4" strokeLinecap="round" fill="none" />
          </g>
        );
      case 'curious':
        return (
          <g>
            <ellipse cx="47" cy="56" rx="11" ry="13" fill="#FFFFFF" />
            <circle cx="51" cy="55" r="5.5" fill="#1E1E24" />
            <circle cx="53" cy="53" r="2" fill="#FFFFFF" />

            <ellipse cx="73" cy="56" rx="11" ry="13" fill="#FFFFFF" />
            <circle cx="77" cy="55" r="5.5" fill="#1E1E24" />
            <circle cx="79" cy="53" r="2" fill="#FFFFFF" />

            <circle cx="61" cy="76" r="5" fill="#1E1E24" />
          </g>
        );
      case 'spicy':
        return (
          <g>
            {/* Furrowed Brows */}
            <path d="M35 44L53 50" stroke="#1E1E24" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M85 44L67 50" stroke="#1E1E24" strokeWidth="4.5" strokeLinecap="round" />
            {/* Eyes */}
            <circle cx="46" cy="58" r="10" fill="#FFFFFF" />
            <circle cx="48" cy="58" r="5" fill="#1E1E24" />
            <circle cx="74" cy="58" r="10" fill="#FFFFFF" />
            <circle cx="72" cy="58" r="5" fill="#1E1E24" />
            {/* Smirk */}
            <path d="M48 75C56 81 68 79 75 71" stroke="#1E1E24" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          </g>
        );
      case 'cheeky':
        return (
          <g>
            {/* Wink Left */}
            <path d="M38 56L50 51L39 46" stroke="#1E1E24" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Open Right Eye */}
            <circle cx="74" cy="54" r="11" fill="#FFFFFF" />
            <circle cx="72" cy="54" r="5.5" fill="#1E1E24" />
            <circle cx="74" cy="52" r="2" fill="#FFFFFF" />
            {/* Rosy Cheeks */}
            <ellipse cx="36" cy="66" rx="6" ry="3.5" fill={accentColor} opacity="0.55" />
            <ellipse cx="84" cy="66" rx="6" ry="3.5" fill={accentColor} opacity="0.55" />
            {/* Smile with tongue */}
            <path d="M48 68C52 78 68 78 72 68Z" fill="#1E1E24" />
            <path d="M54 73C56 78 64 78 66 73" fill="#FF7597" />
          </g>
        );
      case 'confident':
      case 'excited':
      default:
        return (
          <g>
            <ellipse cx="46" cy="55" rx="10.5" ry="12.5" fill="#FFFFFF" />
            <circle cx="48" cy="55" r="5.5" fill="#1E1E24" />
            <circle cx="50" cy="52" r="2" fill="#FFFFFF" />

            <ellipse cx="74" cy="55" rx="10.5" ry="12.5" fill="#FFFFFF" />
            <circle cx="72" cy="55" r="5.5" fill="#1E1E24" />
            <circle cx="74" cy="52" r="2" fill="#FFFFFF" />

            <ellipse cx="34" cy="65" rx="5.5" ry="3" fill={accentColor} opacity="0.45" />
            <ellipse cx="86" cy="65" rx="5.5" ry="3" fill={accentColor} opacity="0.45" />

            <path
              d="M49 71C53 79 67 79 71 71"
              stroke="#1E1E24"
              strokeWidth="4.5"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        );
    }
  };

  const renderAccessory = () => {
    switch (accessory) {
      case 'glasses':
        return (
          <g stroke="#1E1E24" strokeWidth="3.5" fill="none">
            <rect x="31" y="43" width="26" height="20" rx="5" fill="#FFFFFF" fillOpacity="0.2" />
            <rect x="63" y="43" width="26" height="20" rx="5" fill="#FFFFFF" fillOpacity="0.2" />
            <line x1="57" y1="52" x2="63" y2="52" />
          </g>
        );
      case 'crown':
        return (
          <path
            d="M38 22L44 8L60 18L76 8L82 22H38Z"
            fill="#FBBF24"
            stroke="#1E1E24"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        );
      case 'horns':
        return (
          <g fill="#1E1E24">
            <path d="M28 28C20 16 24 8 34 14C38 16 40 22 38 28Z" />
            <path d="M92 28C100 16 96 8 86 14C82 16 80 22 82 28Z" />
          </g>
        );
      case 'headband':
        return (
          <path
            d="M22 36C38 26 82 26 98 36"
            stroke={accentColor}
            strokeWidth="8"
            strokeLinecap="round"
          />
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className={`inline-flex items-center justify-center select-none ${className}`}
      animate={
        floating
          ? {
              y: [0, -6, 0],
              rotate: [-1.5, 1.5, -1.5],
            }
          : undefined
      }
      transition={
        floating
          ? {
              duration: 3.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }
          : undefined
      }
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible drop-shadow-sm"
      >
        {renderShapePath()}
        {renderFace()}
        {renderAccessory()}
      </svg>
    </motion.div>
  );
};

