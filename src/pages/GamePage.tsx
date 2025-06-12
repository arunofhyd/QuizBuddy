import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { Layout } from '../components/layouts/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PlayerLobby } from '../components/game/PlayerLobby';
import { QuestionDisplay } from '../components/game/QuestionDisplay';
import { Leaderboard } from '../components/game/Leaderboard';
import { LiveMiniLeaderboard } from '../components/game/LiveMiniLeaderboard'; // Import LiveMiniLeaderboard
import { LeaderboardEntry } from '../types';
import { ArrowLeft, Trophy } from 'lucide-react';

export const GamePage: React.FC = () => {
  const { gameSession, currentPlayer, submitAnswer, leaveGame, error } = useGame();
  const navigate = useNavigate();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const prevStatusRef = useRef<GameSession['status']>();

  useEffect(() => {
    if (gameSession) {
      prevStatusRef.current = gameSession.status;
    }
  }, [gameSession?.status]);

  useEffect(() => {
    if (!gameSession && !currentPlayer) {
      navigate('/');
    }
  }, [gameSession, currentPlayer, navigate]);

  useEffect(() => {
    // Reset answer state when a new question starts
    if (gameSession?.status === 'question') {
      setSelectedAnswer(null);
      setHasAnswered(false);
    }
  }, [gameSession?.currentQuestionIndex, gameSession?.status]);

  // New useEffect for automatic timeout submission
  useEffect(() => {
    if (
      gameSession &&
      currentPlayer &&
      prevStatusRef.current === 'question' && // Check previous status
      gameSession.status === 'answer_reveal' && // Check current status
      gameSession.quiz &&
      gameSession.quiz.questions &&
      gameSession.currentQuestionIndex >= 0 && // Ensure index is non-negative
      gameSession.currentQuestionIndex < gameSession.quiz.questions.length &&
      !hasAnswered // Check if player hasn't already answered
    ) {
      console.log(`Player ${currentPlayer.id} timed out for question index ${gameSession.currentQuestionIndex}. Submitting -1.`);
      submitAnswer(-1);
      setHasAnswered(true); // Mark as answered to prevent re-submission
    }
  }, [
    gameSession?.status,
    gameSession?.currentQuestionIndex,
    currentPlayer,
    hasAnswered,
    submitAnswer,
    gameSession // Include gameSession due to access to gameSession.quiz.questions
  ]);

  const handleAnswerSelect = useCallback(async (selectedOption: number) => {
    if (hasAnswered || !gameSession || gameSession.status !== 'question') return;

    setHasAnswered(true); // Set immediately to prevent re-submission

    // Since onAnswerSelect(-1) is no longer called by QuestionDisplay's timer,
    // selectedOption will always be a user-chosen option index.
    setSelectedAnswer(selectedOption); // Keep track of what user selected locally
    await submitAnswer(selectedOption); // Submit the actual selected option
  }, [hasAnswered, gameSession, submitAnswer]);

  const handleLeaveGame = () => {
    if (window.confirm('Are you sure you want to leave the game?')) {
      leaveGame();
      navigate('/');
    }
  };

  const generateLeaderboard = (): LeaderboardEntry[] => {
    if (!gameSession) return [];

    const entries = gameSession.players
      .map((player) => ({
        playerId: player.id,
        nickname: player.nickname,
        score: player.score,
        rank: 0,
        lastQuestionPoints: player.answers.length > 0 
          ? player.answers[player.answers.length - 1]?.points 
          : undefined
      }))
      .sort((a, b) => b.score - a.score)
      .map((entry, index) => ({ ...entry, rank: index + 1 }));

    return entries;
  };

  if (!gameSession || !currentPlayer) {
    return (
      <Layout background="game">
        <div className="container mx-auto px-4 py-8">
          <Card className="text-center">
            <div className="text-xl text-white mb-4">Loading game...</div>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout background="game">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {gameSession.quiz.title}
            </h1>
            <p className="text-white/70">
              Playing as: {currentPlayer.nickname} • Room: {gameSession.roomCode}
            </p>
          </div>
          
          <Button variant="ghost" onClick={handleLeaveGame} icon={<ArrowLeft size={20} />}>
            Leave Game
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="mb-6">
            <div className="text-red-400">{error}</div>
          </Card>
        )}

        {/* Game Content */}
        {gameSession.status === 'waiting' ? (
          <PlayerLobby
            players={gameSession.players}
            roomCode={gameSession.roomCode}
            isHost={false}
          />
        ) : gameSession.status === 'question' || gameSession.status === 'answer_reveal' ? (
          <div className="space-y-6">
            <QuestionDisplay
              key={gameSession.quiz.questions[gameSession.currentQuestionIndex].id} // Keep existing key
              question={gameSession.quiz.questions[gameSession.currentQuestionIndex]}
              questionNumber={gameSession.currentQuestionIndex + 1}
              totalQuestions={gameSession.quiz.questions.length}
              timeLimit={gameSession.quiz.questions[gameSession.currentQuestionIndex].timeLimit}
              onAnswerSelect={handleAnswerSelect}
              selectedAnswer={selectedAnswer || undefined}
              showResults={gameSession.status === 'answer_reveal'} // Key change here
              isHost={false}
              playerHasAnswered={hasAnswered}
            />
            {/* Message when player has answered during 'question' state */}
            {gameSession.status === 'question' && hasAnswered && (
              <Card className="text-center">
                <div className="text-white/70 mb-2">Answer submitted!</div>
                <div className="text-sm text-white/60">
                  Waiting for other players...
                </div>
              </Card>
            )}
            {/* Message when answers are revealed */}
            {gameSession.status === 'answer_reveal' && (
              <Card className="text-center">
                <div className="text-white/70 mb-2">The results are in!</div>
                <div className="text-sm text-white/60">
                  Waiting for the host to continue to the leaderboard...
                </div>
              </Card>
            )}
            {/* Render LiveMiniLeaderboard during answer_reveal state */}
            {gameSession.status === 'answer_reveal' && gameSession.players && gameSession.players.length > 0 && (
              <LiveMiniLeaderboard players={gameSession.players} />
            )}
          </div>
        ) : gameSession.status === 'leaderboard' ? (
          <div className="space-y-6">
            <Leaderboard
              entries={generateLeaderboard()}
              title={`Question ${gameSession.currentQuestionIndex + 1} Results`}
              showLastQuestionPoints={true}
            />
            
            <Card className="text-center">
              <div className="text-white/70">
                Waiting for the next question...
              </div>
            </Card>
          </div>
        ) : gameSession.status === 'finished' ? (
          <div className="space-y-6">
            <Leaderboard
              entries={generateLeaderboard()}
              title="Final Results 🏆"
            />
            
            <Card className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Game Complete!</h3>
              <p className="text-white/70 mb-6">
                Thanks for playing "{gameSession.quiz.title}"!
              </p>
              
              {/* Player's final position */}
              {(() => {
                const leaderboard = generateLeaderboard();
                const playerEntry = leaderboard.find(entry => entry.playerId === currentPlayer.id);
                if (playerEntry) {
                  return (
                    <div className="bg-blue-600/20 rounded-lg p-4 mb-6">
                      <div className="text-white font-semibold">Your Final Position</div>
                      <div className="text-2xl font-bold text-white">
                        #{playerEntry.rank} • {playerEntry.score.toLocaleString()} points
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
              
              <Button onClick={() => navigate('/')} icon={<ArrowLeft size={20} />}>
                Back to Home
              </Button>
            </Card>
          </div>
        ) : null}
      </div>
    </Layout>
  );
};