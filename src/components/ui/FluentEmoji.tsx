import React from 'react';

// Mapping from unicode emoji to curated Microsoft Fluent Emoji asset key
const UNICODE_TO_ASSET: Record<string, string> = {
  '🎉': 'party-popper',
  '⚡': 'high-voltage',
  '👑': 'crown',
  '🏆': 'trophy',
  '💥': 'collision',
  '⛓️': 'chains',
  '⛓': 'chains',
  '✨': 'sparkles',
  '🔥': 'fire',
  '✅': 'check-mark',
  '✔️': 'check-mark',
  '❌': 'cross-mark',
  '✖️': 'cross-mark',
  '⚠️': 'warning',
  '🃏': 'joker',
  '🤔': 'thinking-face',
  '🤯': 'exploding-head',
  '😵': 'dizzy-face',
  '🥳': 'partying-face',
  '🌟': 'glowing-star',
  '⭐': 'star',
  '🎲': 'game-die',
  '🎯': 'bullseye',
  '⏳': 'hourglass',
  '⌛': 'hourglass',
  '🚀': 'rocket',
  '👀': 'eyes',
  '💎': 'gem-stone',
  '😏': 'smirking-face',
  '😎': 'smiling-face-with-sunglasses',
  '🍿': 'popcorn',
  '🎤': 'microphone',
  '📢': 'megaphone',
  '🎨': 'artist-palette',
  '🤡': 'clown-face',
};

// List of available 3D PNG versions
const HAS_3D = new Set([
  'party-popper',
  'high-voltage',
  'crown',
  'trophy',
  'collision',
  'chains',
  'sparkles',
  'fire',
  'check-mark',
  'cross-mark',
  'warning',
  'joker',
  'thinking-face',
  'exploding-head',
  'dizzy-face',
  'partying-face',
  'star',
  'glowing-star',
  'game-die',
  'bullseye',
  'hourglass',
  'rocket',
  'eyes',
  'gem-stone',
  'smirking-face',
  'smiling-face-with-sunglasses',
  'popcorn',
  'microphone',
  'megaphone',
  'artist-palette',
  'clown-face',
]);

export interface FluentEmojiProps {
  emoji?: string;
  name?: string;
  size?: number;
  variant?: 'color' | '3d';
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
}

/**
 * Windows 11 Microsoft Fluent Emoji Component
 * Renders high-fidelity official Windows 11 emojis across all operating systems & browsers.
 */
export const FluentEmoji: React.FC<FluentEmojiProps> = ({
  emoji,
  name,
  size = 24,
  variant = 'color',
  className = '',
  style = {},
  alt,
}) => {
  // Determine asset key
  let assetKey = name;
  if (!assetKey && emoji) {
    // Strip variation selectors if needed
    const cleanEmoji = emoji.trim();
    assetKey = UNICODE_TO_ASSET[cleanEmoji] || UNICODE_TO_ASSET[cleanEmoji.replace(/\uFE0F/g, '')];
  }

  if (assetKey) {
    const is3D = variant === '3d' && HAS_3D.has(assetKey);
    const src = is3D ? `/emojis/${assetKey}-3d.png` : `/emojis/${assetKey}.svg`;

    return (
      <img
        src={src}
        alt={alt || emoji || assetKey}
        width={size}
        height={size}
        draggable={false}
        className={`inline-block select-none align-middle pointer-events-none object-contain ${className}`}
        style={{
          width: size,
          height: size,
          minWidth: size,
          minHeight: size,
          ...style,
        }}
        loading="eager"
      />
    );
  }

  // Fallback: Use the Windows 11 Fluent Emoji web font
  return (
    <span
      className={`inline-block select-none align-middle font-normal leading-none ${className}`}
      style={{
        fontFamily: "'Fluent Emoji Color', 'Fluent Emoji Flat', sans-serif",
        fontSize: size,
        lineHeight: 1,
        ...style,
      }}
      aria-label={alt || emoji}
    >
      {emoji}
    </span>
  );
};
