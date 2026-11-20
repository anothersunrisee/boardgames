import React, { useEffect, useRef, useState } from 'react';

/**
 * High-Visibility Playful Slicing Cursor Component
 * Provides an unmissable, vibrant Fruit-Ninja blade cursor with high-contrast outlines,
 * glowing ambient halo, and instant zero-latency tracking on desktop browsers.
 * Automatically disabled on touch-only mobile devices.
 */
export const CustomGameCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [isDown, setIsDown] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch-only devices to avoid showing custom desktop cursor
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    let rafId: number = 0;
    let targetX = -100;
    let targetY = -100;

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') {
        setIsTouchDevice(true);
        return;
      }
      targetX = e.clientX;
      targetY = e.clientY;
      if (!visible) setVisible(true);

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      setIsDown(true);
    };

    const handlePointerUp = () => {
      setIsDown(false);
    };

    const handleMouseLeave = () => {
      setVisible(false);
      setIsDown(false);
    };

    const handleMouseEnter = () => {
      setVisible(true);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [visible]);

  if (isTouchDevice || !visible) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform select-none"
      style={{
        transform: 'translate3d(-100px, -100px, 0)',
        transition: 'opacity 0.15s ease',
      }}
      aria-hidden="true"
    >
      {/* Dynamic Slicing Katana Blade Cursor */}
      <div
        className="relative -top-2 -left-2 transition-transform duration-100 ease-out origin-[8px_8px]"
        style={{
          transform: isDown ? 'rotate(-25deg) scale(1.15)' : 'rotate(0deg) scale(1)',
        }}
      >
        {/* Ambient Luminous Halo Ring */}
        <div
          className={`absolute -top-3 -left-3 rounded-full blur-[2px] transition-all duration-150 ${
            isDown
              ? 'w-14 h-14 bg-[#FF5A26]/40 ring-4 ring-[#FF5A26]/30'
              : 'w-10 h-10 bg-[#FBBF24]/35 ring-2 ring-[#FBBF24]/20'
          }`}
        />

        {/* High-Contrast SVG Katana */}
        <svg
          width="44"
          height="44"
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]"
        >
          {/* Thick Solid White Backing / Silhouette (Never blends with dark backgrounds) */}
          <path
            d="M 6 6 L 24 14 L 18 19 L 13 24 Z"
            fill="#FFFFFF"
            stroke="#FFFFFF"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          <line x1="16" y1="26" x2="26" y2="16" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
          <line x1="21" y1="21" x2="40" y2="40" stroke="#FFFFFF" strokeWidth="8.5" strokeLinecap="round" />

          {/* 1. Handle (Tsuka) */}
          <line x1="21" y1="21" x2="40" y2="40" stroke="#1E1E24" strokeWidth="5.5" strokeLinecap="round" />
          {/* Handle Diamonds */}
          <circle cx="26" cy="26" r="2" fill="#EF4444" />
          <circle cx="31" cy="31" r="2" fill="#FBBF24" />
          <circle cx="36" cy="36" r="2" fill="#EF4444" />

          {/* 2. Guard (Tsuba) */}
          <line x1="16" y1="26" x2="26" y2="16" stroke="#1E1E24" strokeWidth="5" strokeLinecap="round" />
          <line x1="16.5" y1="25.5" x2="25.5" y2="16.5" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />

          {/* 3. Katana Blade */}
          <path
            d="M 6 6 Q 18 11 24 15 L 19 20 Q 12 16 6 6 Z"
            fill={isDown ? '#FF5A26' : '#38BDF8'}
            stroke="#1E1E24"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Shiny Blade Reflection Edge */}
          <path d="M 6 6 Q 16 10.5 22 14" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />

          {/* 4. Crosshair Precision Reticle Hotspot at Tip (6, 6) */}
          <circle cx="6" cy="6" r="3" fill="#FFFFFF" stroke="#1E1E24" strokeWidth="1.5" />
          <circle cx="6" cy="6" r="1.2" fill={isDown ? '#EF4444' : '#F59E0B'} />
        </svg>
      </div>
    </div>
  );
};
