import React, { useState } from 'react';
import { Trophy, Users } from 'lucide-react';
import { BlobMascot } from './ui/BlobMascot';

export interface PlayerScoreItem {
  id: string;
  name: string;
  kubu?: string;
  team?: string;
  score: number;
}

interface ScoreBoardProps {
  players: PlayerScoreItem[];
  title?: string;
  highlightId?: string;
}

const RANK_STYLES = [
  'bg-[#F472B6] text-[#1E1E24]', // #1 Vibrant Pastel Pink
  'bg-[#FAF7F2] text-[#1E1E24]', // #2 Warm Cream
  'bg-[#FCD34D] text-[#1E1E24]', // #3 Butter Gold
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
    <div className="rounded-[32px] bg-[#488B76] p-6 md:p-7 text-white shadow-[0_8px_0_rgba(30,30,36,0.12)] border-[3px] border-[#1E1E24]/10">
      {/* Header + Segmented Pill Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Trophy className="w-7 h-7 text-[#FCD34D]" />
          <h2 className="font-display text-2xl md:text-3xl font-bold">{title}</h2>
        </div>

        <div className="inline-flex p-1 rounded-full bg-[#356B5A]">
          <button
            type="button"
            onClick={() => setTab('individu')}
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all cursor-pointer ${
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
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all cursor-pointer ${
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
        <div className="space-y-3">
          {sortedPlayers.map((player, idx) => {
            const isWinner = player.id === highlightId;
            const rowStyle =
              RANK_STYLES[idx] || 'bg-[#5CA08B] text-white border border-white/15';

            return (
              <div
                key={player.id}
                className={`flex items-center justify-between px-4 py-3.5 rounded-[22px] font-bold shadow-xs transition-transform ${
                  isWinner ? 'ring-3 ring-amber-300 scale-[1.01]' : ''
                } ${rowStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-display text-lg w-8 text-center">
                    #{idx + 1}
                  </span>
                  <BlobMascot
                    shape={idx === 0 ? 'flower' : idx === 1 ? 'scallop' : 'circle'}
                    mood={idx === 0 ? 'excited' : 'happy'}
                    color={idx === 0 ? '#FBBF24' : '#60A5FA'}
                    size={38}
                    floating={false}
                  />
                  <div>
                    <p className="text-base leading-tight">{player.name}</p>
                    <p className="text-xs opacity-75 font-semibold">
                      {player.kubu || player.team}
                    </p>
                  </div>
                </div>

                {/* Circular Score Pill */}
                <div className="px-4 py-1.5 rounded-full bg-white text-[#1E1E24] font-display text-base shadow-xs">
                  {player.score} pts
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {sortedTeams.map((item, idx) => (
            <div
              key={item.team}
              className={`flex items-center justify-between px-5 py-4 rounded-[22px] font-bold ${
                RANK_STYLES[idx] || 'bg-[#5CA08B] text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5" />
                <span className="font-display text-lg">
                  #{idx + 1} {item.team}
                </span>
              </div>
              <div className="px-4 py-1.5 rounded-full bg-white text-[#1E1E24] font-display text-base">
                {item.score} pts
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScoreBoard;
