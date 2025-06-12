import React from 'react';
import { Player } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button'; // Added Button import
import { Users, Crown } from 'lucide-react';

interface PlayerLobbyProps {
  players: Player[];
  roomCode: string;
  isHost?: boolean;
  onKickPlayer?: (playerId: string) => void; // Added onKickPlayer prop
}

export const PlayerLobby: React.FC<PlayerLobbyProps> = ({
  players,
  roomCode,
  isHost = false,
  onKickPlayer
}) => {
  return (
    <div className="space-y-6">
      <Card className="text-center">
        <div className="mb-4">
          {isHost && <Crown className="mx-auto mb-2 text-yellow-400" size={32} />}
          <h2 className="text-3xl font-bold text-white mb-2">
            Room Code: {roomCode}
          </h2>
          <p className="text-white/70">
            {isHost ? 'Players are joining...' : 'Waiting for the game to start...'}
          </p>
        </div>
        
        <div className="flex items-center justify-center gap-2 text-white/60">
          <Users size={20} />
          <span>{players.length} player{players.length !== 1 ? 's' : ''} joined</span>
        </div>
      </Card>

      <Card>
        <h3 className="text-xl font-semibold text-white mb-4">Players</h3>
        {players.length === 0 ? (
          <p className="text-white/60 text-center py-8">
            No players have joined yet...
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {players.map((player) => (
              <div
                key={player.id}
                className="bg-white/10 rounded-lg p-3 flex items-center" // Removed justify-between to allow button to push to the right
              >
                <span className="text-white font-medium">{player.nickname}</span>
                <div className={`w-3 h-3 rounded-full ml-2 mr-auto ${ // Added ml-2 for spacing and mr-auto to push button
                  player.isConnected ? 'bg-green-400' : 'bg-red-400'
                }`} />
                {isHost && onKickPlayer && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to kick ${player.nickname}?`)) {
                        onKickPlayer(player.id);
                      }
                    }}
                    className="px-2 py-1 text-xs" // Adjusted padding and text size
                  >
                    Kick
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};