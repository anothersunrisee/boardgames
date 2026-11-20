import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { PlayerProfileAvatar } from './characters/PlayerProfileAvatar';
import { CHARACTER_PACK, getCharacterById } from '../assets-library/characters';
import { FluentEmoji } from './ui/FluentEmoji';

export interface PlayerScoreItem {
  id: string;
  name: string;
  kubu?: string;
  team?: string;
  score: number;
  avatarId?: string;
}

interface ScoreBoardProps {
  players: PlayerScoreItem[];
  title?: string;
  highlightId?: string;
}

const RANK_STYLES = [
  'bg-[#FBBF24] text-[#1E1E24]', // #1 Butter Gold
  'bg-[#FAF7F2] text-[#1E1E24]', // #2 Warm Cream
  'bg-[#F9A8B8] text-[#1E1E24]', // #3 Pastel Berry
];

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  players,
  title = 'Leaderboard',
  highlightId,
}) => {
  const [tab, setTab] = useState<'individu' | 'kubu'>('individu');

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  const teamMap = players.reduce<Record<string, number>>((acc, p) => {
    const teamName = p.kubu?.trim() || p.team?.trim() || 'Tanpa Kubu';
    acc[teamName] = (acc[teamName] || 0) + p.score;
    return acc;
  }, {});

  const sortedTeams = Object.entries(teamMap)
    .map(([team, score]) => ({ team, score }))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="rounded-[32px] bg-[#488B76] p-5 md:p-6 text-white shadow-[0_8px_0_rgba(30,30,36,0.12)] border-[3px] border-[#1E1E24]/10">
      {/* Header + Segmented Pill Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-2.5">
          <FluentEmoji name="trophy" variant="3d" size={26} />
          <h2 className="font-display text-xl md:text-2xl font-bold">{title}</h2>
        </div>

        <div className="inline-flex p-1 rounded-full bg-[#356B5A]">
          <button
            type="button"
            onClick={() => setTab('individu')}
            className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              tab === 'individu'
                ? 'bg-[#FAF7F2] text-[#1E1E24] shadow-xs'
                : 'text-white/80 hover:text-white'
            }`}
          >
            Individu
          </button>
          <button
            type="button"
            onClick={() => setTab('kubu')}
            className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              tab === 'kubu'
                ? 'bg-[#FAF7F2] text-[#1E1E24] shadow-xs'
                : 'text-white/80 hover:text-white'
            }`}
          >
            Skor Kubu
          </button>
        </div>
      </div>

      {/* Stacked Leaderboard Rows */}
      {tab === 'individu' ? (
        <div className="space-y-2.5">
          {sortedPlayers.map((player, idx) => {
            const isWinner = player.id === highlightId;
            const rowStyle =
              RANK_STYLES[idx] || 'bg-[#356B5A] text-white border border-white/15';
            const char = getCharacterById(player.avatarId || CHARACTER_PACK[idx % CHARACTER_PACK.length].id);

            return (
              <div
                key={player.id}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-[20px] font-bold shadow-xs transition-transform ${
                  isWinner ? 'ring-3 ring-amber-300 scale-[1.01]' : ''
                } ${rowStyle}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-display text-base w-6 text-center flex items-center justify-center">
                    {idx === 0 ? <FluentEmoji name="crown" variant="3d" size={20} /> : `#${idx + 1}`}
                  </span>
                  <PlayerProfileAvatar
                    character={char}
                    size={38}
                    mood={idx === 0 ? 'winner' : 'idle'}
                  />
                  <div>
                    <p className="text-sm font-bold leading-tight">{player.name}</p>
                    <p className="text-[11px] opacity-75 font-semibold">
                      {player.kubu || player.team}
                    </p>
                  </div>
                </div>

                {/* Score Pill */}
                <div
                  className={`px-3.5 py-1 rounded-full font-display text-sm shadow-xs ${
                    player.score < 0
                      ? 'bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5]'
                      : 'bg-white text-[#1E1E24]'
                  }`}
                >
                  {player.score > 0 ? `+${player.score}` : player.score} pts
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2.5">
          {sortedTeams.map((item, idx) => (
            <div
              key={item.team}
              className={`flex items-center justify-between px-4 py-3 rounded-[20px] font-bold ${
                RANK_STYLES[idx] || 'bg-[#356B5A] text-white border border-white/15'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4" />
                <span className="font-display text-base">
                  #{idx + 1} {item.team}
                </span>
              </div>
              <span className="px-3.5 py-1 rounded-full bg-white text-[#1E1E24] font-display text-sm shadow-xs">
                {item.score} pts
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScoreBoard;
