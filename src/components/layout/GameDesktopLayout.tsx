import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, VolumeX, Sparkles, BookOpen } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { PlayerProfileAvatar } from '../characters/PlayerProfileAvatar';
import { FluentEmoji } from '../ui/FluentEmoji';
import { GameOnboardingModal, type GameId } from '../modals/GameOnboardingModal';
import { sfx } from '../../utils/sound';

export interface GameDesktopLayoutProps {
  children: React.ReactNode;
  gameId?: GameId;
  gameTitle?: string;
  badge?: string;
  badgeColor?: string;
  onExit?: () => void;
  sidebarActions?: React.ReactNode;
  activeRoundLabel?: string;
}

/**
 * 80:20 Responsive Layout for Party Games
 * - Mobile: 1-Column streamlined game view with quick rule button
 * - Desktop (lg+): 80% Main Game Stage + 20% Right Sidebar (Host Tools + Cara Main + Live Real-Time Room Leaderboard)
 */
export const GameDesktopLayout: React.FC<GameDesktopLayoutProps> = ({
  children,
  gameId,
  gameTitle,
  badge,
  badgeColor = '#7C3AED',
  onExit,
  sidebarActions,
  activeRoundLabel,
}) => {
  const navigate = useNavigate();
  const { players, roomName } = useGameStore();
  const [muted, setMuted] = useState(sfx.muted);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  const toggleMute = () => {
    sfx.muted = !muted;
    setMuted(sfx.muted);
    if (!sfx.muted) sfx.playPop();
  };

  const handleExit = () => {
    sfx.playPop();
    if (onExit) {
      onExit();
    } else {
      navigate('/hub');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E24] px-3 sm:px-6 py-4 md:py-8 flex flex-col justify-between">
      {/* Container: Max width fits desktop beautifully */}
      <div className="max-w-[1440px] mx-auto w-full flex-1 flex flex-col lg:flex-row gap-6 items-start">
        
        {/* ========================================================================= */}
        {/* 80% MAIN GAME STAGE (Center / Left Column)                                */}
        {/* ========================================================================= */}
        <main className="w-full lg:flex-1 min-w-0 flex flex-col justify-start">
          {children}
        </main>

        {/* ========================================================================= */}
        {/* 20% DESKTOP HOST DOCK & LIVE REAL-TIME LEADERBOARD (Right Sidebar)        */}
        {/* ========================================================================= */}
        <aside className="hidden lg:flex flex-col gap-4 w-76 xl:w-84 shrink-0 sticky top-6">
          
          {/* Host Quick Actions Card */}
          <div className="rounded-[28px] bg-white p-4 border border-[#1E1E24]/10 shadow-[0_8px_20px_rgba(30,30,36,0.04)]">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E1E24]/8 mb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#64616C] block">
                  {badge || 'HOST CONTROL DECK'}
                </span>
                <p className="font-display text-xs font-bold text-[#1E1E24] truncate max-w-[140px]">
                  {gameTitle || roomName || 'Party Room'}
                </p>
              </div>

              {/* Sound Toggle Button */}
              <button
                type="button"
                onClick={toggleMute}
                title={muted ? 'Nyalakan Suara' : 'Matikan Suara'}
                className="w-8 h-8 rounded-full bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#1E1E24]/10 flex items-center justify-center transition cursor-pointer"
              >
                {muted ? (
                  <VolumeX className="w-4 h-4 text-[#F04438]" />
                ) : (
                  <Volume2 className="w-4 h-4 text-[#12B76A]" />
                )}
              </button>
            </div>

            {/* Navigation & Game Status */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleExit}
                className="w-full py-2.5 px-3 rounded-xl bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#1E1E24]/10 text-xs font-extrabold text-[#1E1E24] flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Pilih Game Lain</span>
              </button>

              {gameId && (
                <button
                  type="button"
                  onClick={() => {
                    sfx.playPop();
                    setShowOnboarding(true);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-[#FFF7ED] hover:bg-[#FFEDD5] border border-[#F97316]/30 text-[#C2410C] text-xs font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#EA580C]" />
                  <span>Cara Main & Hukuman</span>
                </button>
              )}

              {sidebarActions}

              {activeRoundLabel && (
                <div
                  style={{ backgroundColor: `${badgeColor}15`, color: badgeColor }}
                  className="py-1.5 px-3 rounded-xl text-[11px] font-extrabold text-center border border-current/20 flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{activeRoundLabel}</span>
                </div>
              )}
            </div>
          </div>

          {/* Real-Time Live Room Leaderboard */}
          <div className="rounded-[28px] bg-white p-4 border border-[#1E1E24]/10 shadow-[0_8px_20px_rgba(30,30,36,0.04)] flex flex-col max-h-[calc(100vh-280px)]">
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-[#1E1E24]/8 mb-2.5">
              <div className="flex items-center gap-1.5">
                <FluentEmoji name="trophy" variant="3d" size={20} />
                <h3 className="font-display text-xs font-black uppercase tracking-wider text-[#1E1E24]">
                  Live Skor Room
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#12B76A]/10 text-[#065F46] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#12B76A] animate-ping" />
                <span>Realtime</span>
              </span>
            </div>

            {/* Scrollable Player Rows */}
            <div className="space-y-1.5 overflow-y-auto pr-1 flex-1 custom-scroll">
              {sortedPlayers.map((player, idx) => {
                const isTop1 = idx === 0;
                const isTop2 = idx === 1;
                const isTop3 = idx === 2;

                return (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl transition ${
                      isTop1
                        ? 'bg-[#FEF3C7] border border-[#F59E0B]/40'
                        : isTop2
                        ? 'bg-[#FAF7F2] border border-[#1E1E24]/8'
                        : isTop3
                        ? 'bg-[#FFE8DF]/60 border border-[#EC5A29]/20'
                        : 'bg-white hover:bg-[#FAF7F2] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-display text-[11px] font-bold w-4 text-center shrink-0 text-[#64616C]">
                        {isTop1 ? <FluentEmoji name="crown" variant="3d" size={14} /> : `#${idx + 1}`}
                      </span>

                      <PlayerProfileAvatar characterId={player.avatarId} size={24} name={player.name} />

                      <div className="truncate">
                        <p className="font-display text-xs font-bold text-[#1E1E24] truncate leading-tight">
                          {player.name}
                        </p>
                        <span className="text-[9px] text-[#64616C] font-semibold block truncate">
                          {player.kubu}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`font-display text-xs font-black px-2 py-0.5 rounded-full shrink-0 ml-1.5 ${
                        player.score < 0
                          ? 'bg-[#FEE2E2] text-[#DC2626]'
                          : isTop1
                          ? 'bg-[#F59E0B] text-white shadow-2xs'
                          : 'bg-[#FAF7F2] text-[#1E1E24] border border-[#1E1E24]/10'
                      }`}
                    >
                      {player.score > 0 ? `+${player.score}` : player.score}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Quick Link to Full Podium */}
            <div className="pt-2.5 mt-2 border-t border-[#1E1E24]/8">
              <button
                type="button"
                onClick={() => {
                  sfx.playPop();
                  navigate('/room/podium');
                }}
                className="w-full py-1.5 px-2 rounded-lg text-[10px] font-bold text-[#64616C] hover:text-[#1E1E24] hover:bg-black/5 transition cursor-pointer text-center"
              >
                Buka Panggung Podium Lengkap →
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Floating Rule & Punishment Button on Mobile */}
      {gameId && (
        <button
          type="button"
          onClick={() => {
            sfx.playPop();
            setShowOnboarding(true);
          }}
          className="lg:hidden fixed bottom-4 left-4 z-40 py-2 px-3.5 rounded-full bg-[#1E1E24] text-white border-2 border-white/20 shadow-lg text-xs font-bold flex items-center gap-1.5 active:scale-95 transition"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#FBBF24]" />
          <span>Cara Main & Hukuman</span>
        </button>
      )}

      {/* Game Onboarding Rules & Punishment Modal */}
      {gameId && (
        <GameOnboardingModal
          open={showOnboarding}
          gameId={gameId}
          onClose={() => setShowOnboarding(false)}
          onStartGame={() => setShowOnboarding(false)}
        />
      )}
    </div>
  );
};
