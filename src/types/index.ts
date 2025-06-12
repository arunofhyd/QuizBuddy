export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  timeLimit: number; // in seconds
  points: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GameSession {
  id: string;
  roomCode: string;
  quizId: string;
  quiz: Quiz;
  hostId: string;
  status: 'waiting' | 'active' | 'question' | 'answer_reveal' | 'results' | 'leaderboard' | 'finished';
  currentQuestionIndex: number;
  questionStartTime?: number;
  players: Player[];
  createdAt: Date;
}

export interface Player {
  id: string;
  nickname: string;
  score: number;
  answers: PlayerAnswer[];
  isConnected: boolean;
  joinedAt: Date;
}

export interface PlayerAnswer {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
  timeToAnswer: number; // in milliseconds
  points: number;
}

export interface LeaderboardEntry {
  playerId: string;
  nickname: string;
  score: number;
  rank: number;
  lastQuestionPoints?: number;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
}