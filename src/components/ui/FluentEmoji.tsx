import React, { useState } from 'react';

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
  '💡': 'glowing-star',
  '👧': 'sparkles',
  '👦': 'high-voltage',
  '⚔️': 'collision',
  '⚔': 'collision',
  '🗣️': 'megaphone',
  '🗣': 'megaphone',
  '🗳️': 'trophy',
  '🗳': 'trophy',
  '💄': 'sparkles',
  '🕵️': 'eyes',
  '🕵': 'eyes',
  '🧠': 'exploding-head',
  '🔧': 'rocket',
  '⏱️': 'hourglass',
  '⏱': 'hourglass',
  '👥': 'chains',
  '🔗': 'chains',
  '🗑️': 'warning',
  '🗑': 'warning',
  '😆': 'partying-face',
  '🛒': 'gem-stone',
  '📜': 'hourglass',
  '🌍': 'gem-stone',
  '🌎': 'gem-stone',
  '🌏': 'gem-stone',
  '🏛️': 'trophy',
  '🏛': 'trophy',
  '🪐': 'rocket',
  '🧬': 'sparkles',
  '🎬': 'popcorn',
  '🍜': 'popcorn',
  '⚽': 'game-die',
  '🥇': 'crown',
  '🥈': 'trophy',
  '🥉': 'star',
};

// Aliases for string names passed to <FluentEmoji name="..." />
const ASSET_ALIASES: Record<string, string> = {
  'crossed_swords': 'collision',
  'crossed-swords': 'collision',
  'swords': 'collision',
  'zap': 'high-voltage',
  'lightning': 'high-voltage',
  'high_voltage': 'high-voltage',
  'speaking_head': 'megaphone',
  'speaking-head': 'megaphone',
  'bullhorn': 'megaphone',
  'ballot_box': 'trophy',
  'ballot-box': 'trophy',
  'mobile': 'hourglass',
  'phone': 'hourglass',
  'cross_mark': 'cross-mark',
  'cross': 'cross-mark',
  'check_mark': 'check-mark',
  'check': 'check-mark',
  'party_popper': 'party-popper',
  'party': 'party-popper',
  'lipstick': 'sparkles',
  'detective': 'eyes',
  'spy': 'eyes',
  'brain': 'exploding-head',
  'wrench': 'rocket',
  'tool': 'rocket',
  'stopwatch': 'hourglass',
  'timer': 'hourglass',
  'thinking': 'thinking-face',
  'busts_in_silhouette': 'chains',
  'busts': 'chains',
  'users': 'chains',
  'link': 'chains',
  'wastebasket': 'warning',
  'trash': 'warning',
  'laughing': 'partying-face',
  'shopping_cart': 'gem-stone',
  'cart': 'gem-stone',
  'bulb': 'glowing-star',
  'lightbulb': 'glowing-star',
  'idea': 'glowing-star',
};

// List of available 3D PNG versions in public/emojis/*-3d.png
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

export const UNICODE_FALLBACKS: Record<string, string> = {
  'party-popper': '🎉',
  'high-voltage': '⚡',
  'crown': '👑',
  'trophy': '🏆',
  'collision': '💥',
  'chains': '⛓️',
  'sparkles': '✨',
  'fire': '🔥',
  'check-mark': '✅',
  'cross-mark': '❌',
  'warning': '⚠️',
  'joker': '🃏',
  'thinking-face': '🤔',
  'exploding-head': '🤯',
  'dizzy-face': '😵',
  'partying-face': '🥳',
  'star': '⭐',
  'glowing-star': '🌟',
  'game-die': '🎲',
  'bullseye': '🎯',
  'hourglass': '⏳',
  'rocket': '🚀',
  'eyes': '👀',
  'gem-stone': '💎',
  'smirking-face': '😏',
  'smiling-face-with-sunglasses': '😎',
  'popcorn': '🍿',
  'microphone': '🎤',
  'megaphone': '📢',
  'artist-palette': '🎨',
  'clown-face': '🤡',
};

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
 * Features automatic alias resolution and fallback resilience (never displays broken images).
 */
export const FluentEmoji: React.FC<FluentEmojiProps> = ({
  emoji,
  name,
  size = 24,
  variant = '3d',
  className = '',
  style = {},
  alt,
}) => {
  const [loadFailed, setLoadFailed] = useState(false);

  // 1. Resolve normalized asset key
  let assetKey: string | undefined = undefined;

  if (name) {
    const cleanName = name.toLowerCase().trim();
    assetKey = ASSET_ALIASES[cleanName] || (HAS_3D.has(cleanName) ? cleanName : undefined);
    if (!assetKey && cleanName.replace(/_/g, '-') in ASSET_ALIASES) {
      assetKey = ASSET_ALIASES[cleanName.replace(/_/g, '-')];
    }
    if (!assetKey && HAS_3D.has(cleanName.replace(/_/g, '-'))) {
      assetKey = cleanName.replace(/_/g, '-');
    }
  }

  if (!assetKey && emoji) {
    const cleanEmoji = emoji.trim();
    assetKey = UNICODE_TO_ASSET[cleanEmoji] || UNICODE_TO_ASSET[cleanEmoji.replace(/\uFE0F/g, '')];
  }

  // 2. Resolved unicode symbol for resilience
  const fallbackChar =
    emoji ||
    (assetKey ? UNICODE_FALLBACKS[assetKey] : undefined) ||
    '✨';

  // 3. If valid assetKey and not failed, render official Windows 11 3D asset
  if (assetKey && HAS_3D.has(assetKey) && !loadFailed) {
    const is3D = variant === '3d';
    const base = import.meta.env.BASE_URL || '/';
    const cleanBase = base.endsWith('/') ? base : `${base}/`;
    const src = is3D ? `${cleanBase}emojis/${assetKey}-3d.png` : `${cleanBase}emojis/${assetKey}.svg`;

    return (
      <span
        className={`inline-flex items-center justify-center align-middle ${className}`}
        style={{
          width: size,
          height: size,
          minWidth: size,
          minHeight: size,
          ...style,
        }}
      >
        <img
          src={src}
          alt={alt || ''}
          role="presentation"
          width={size}
          height={size}
          draggable={false}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
            setLoadFailed(true);
          }}
          className="select-none pointer-events-none object-contain w-full h-full"
          loading="eager"
        />
      </span>
    );
  }

  // 4. Resilient Fallback: Font-based or clean Unicode emoji with Windows 11 font stack
  return (
    <span
      className={`inline-flex items-center justify-center select-none align-middle font-normal leading-none ${className}`}
      style={{
        fontFamily: "'Fluent Emoji Color', 'Fluent Emoji Flat', 'Segoe UI Emoji', sans-serif",
        fontSize: size * 0.9,
        lineHeight: 1,
        width: size,
        height: size,
        ...style,
      }}
      aria-label={alt || emoji || assetKey}
    >
      {fallbackChar}
    </span>
  );
};
