import React from 'react';
import { Player } from '../../types';
import { Card } from '../ui/Card';
import { Trophy } from 'lucide-react';

interface LiveMiniLeaderboardProps {
  players: Player[];
}

export const LiveMiniLeaderboard: React.FC<LiveMiniLeaderboardProps> = ({ players }) => {
  const sortedPlayers = React.useMemo(() =>
    [...players]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5),
    [players]
  );

  // It's better to show the component with a message rather than returning null or a different structure
  // if the parent component expects a consistent element type.
  // So, the "No scores to display yet" will be inside the main Card.

  return (
    <Card className="mt-6 p-4">
      <div className="flex items-center mb-3">
        <Trophy size={20} className="text-yellow-400 mr-2" />
        <h3 className="text-lg font-semibold text-white">Top 5 Players</h3>
      </div>
      {sortedPlayers.length === 0 ? (
        <p className="text-center text-white/70 py-4">No scores to display yet.</p>
      ) : (
        <ol className="space-y-2">
          {sortedPlayers.map((player, index) => (
            <li
              key={player.id}
              className="flex items-center justify-between bg-white/5 p-2 rounded-md hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center overflow-hidden"> {/* Added overflow-hidden for long nicknames */}
                <span
                  className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mr-2 ${
                    index === 0 ? 'bg-yellow-400 text-yellow-900' :
                    index === 1 ? 'bg-gray-300 text-gray-800' :
                    index === 2 ? 'bg-yellow-600 text-yellow-100' : // Bronze-like color
                    'bg-white/10 text-white/70'
                  }`}
                >
                  {index + 1}
                </span>
                <span className="text-white font-medium truncate">{player.nickname}</span>
              </div>
              <span className="text-blue-400 font-semibold whitespace-nowrap"> {/* Added whitespace-nowrap */}
                {player.score.toLocaleString()} pts
              </span>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
};
