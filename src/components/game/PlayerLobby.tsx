import React from 'react';
import { useState } from 'react';
import { Player } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Users, Crown } from 'lucide-react';

interface PlayerLobbyProps {
  players: Player[];
  roomCode: string;
  isHost?: boolean;
  onKickPlayer?: (playerId: string) => void;
  gameStatus?: string;
}

export const PlayerLobby: React.FC<PlayerLobbyProps> = ({
  players,
  roomCode,
  isHost = false,
  onKickPlayer,
  gameStatus = 'waiting'
}) => {
  const [kickingPlayer, setKickingPlayer] = useState<string | null>(null);
  
  const handleKickPlayer = async (playerId: string, nickname: string) => {
    if (!onKickPlayer) return;
    
    const confirmed = window.confirm(
      `Are you sure you want to remove ${nickname} from the game? This action cannot be undone.`
    );
    
    if (confirmed) {
      try {
        setKickingPlayer(playerId);
        await onKickPlayer(playerId);
      } catch (error) {
        console.error('Failed to kick player:', error);
      } finally {
        setKickingPlayer(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card className="text-center">
        <div className="mb-4">
          {isHost && <Crown className="mx-auto mb-2 text-yellow-400" size={32} />}
          <h2 className="text-3xl font-bold text-white mb-2">
            Room Code: {roomCode}
          </h2>
          <p className="text-white/70">
            {isHost 
              ? `${players.length} player${players.length !== 1 ? 's' : ''} in lobby` 
              : 'Waiting for the game to start...'
            }
          </p>
        </div>
        
        <div className="flex items-center justify-center gap-2 text-white/60">
          <Users size={20} />
          <span>
            {players.length} player{players.length !== 1 ? 's' : ''} 
            {gameStatus === 'waiting' ? ' joined' : ' playing'}
          </span>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Players</h3>
          {isHost && players.length > 0 && (
            <div className="text-xs text-white/60 bg-white/5 px-2 py-1 rounded">
              💡 Click "Remove" to kick players
            </div>
          )}
        </div>
        {players.length === 0 ? (
          <p className="text-white/60 text-center py-8">
            No players have joined yet...
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {players.map((player) => (
              <div
                key={player.id}
                className="bg-white/10 hover:bg-white/15 rounded-lg p-3 flex items-center transition-colors"
              >
                <div className="flex items-center flex-1 min-w-0">
                  <span className="text-white font-medium truncate">{player.nickname}</span>
                  <div className={`w-3 h-3 rounded-full ml-2 flex-shrink-0 ${
                  player.isConnected ? 'bg-green-400' : 'bg-red-400'
                  }`} 
                    title={player.isConnected ? 'Online' : 'Offline'}
                  />
                </div>
                {isHost && onKickPlayer && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleKickPlayer(player.id, player.nickname)}
                    disabled={kickingPlayer === player.id}
                    loading={kickingPlayer === player.id}
                    className="px-2 py-1 text-xs ml-2 flex-shrink-0"
                  >
                    {kickingPlayer === player.id ? 'Removing...' : 'Remove'}
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