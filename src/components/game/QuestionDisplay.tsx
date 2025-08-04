import React, { useState, useEffect } from 'react';
import { Question } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Clock } from 'lucide-react';

interface QuestionDisplayProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  timeLimit: number;
  onAnswerSelect?: (selectedOption: number) => void;
  selectedAnswer?: number;
  showResults?: boolean;
  isHost?: boolean;
  playerHasAnswered?: boolean; // Add this
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  questionNumber,
  totalQuestions,
  timeLimit,
  onAnswerSelect,
  selectedAnswer,
  showResults = false,
  isHost = false,
  playerHasAnswered = false // Add this
}) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  useEffect(() => {
    setTimeLeft(timeLimit);
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // onAnswerSelect(-1) removed - no automatic timeout submission from here
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLimit, question.id]); // Removed selectedAnswer

  const progressPercentage = (timeLeft / timeLimit) * 100;

  return (
    <div className="space-y-6">
      {/* Timer and Progress */}
      <Card className="text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="flex items-center gap-2 text-white/70">
            <Clock size={20} />
            <span className="text-lg font-medium">{timeLeft}s</span>
          </div>
          <div className="text-white/70">
            Question {questionNumber} of {totalQuestions}
          </div>
        </div>
        
        <div className="w-full bg-white/20 rounded-full h-3 mb-4">
          <div
            className="bg-blue-500 h-3 rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </Card>

      {/* Question */}
      <Card>
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          {question.text}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((option, index) => {
            let buttonClass = '';
            
            if (showResults) {
              const isCorrect = index === question.correctAnswer;
              const isSelected = selectedAnswer === index;

              if (isSelected && isCorrect) {
                buttonClass = 'bg-green-600 hover:bg-green-600 text-white ring-2 ring-green-400 ring-offset-1 ring-offset-gray-800 opacity-100';
              } else if (isSelected && !isCorrect) {
                buttonClass = 'bg-red-600 hover:bg-red-600 text-white ring-2 ring-red-400 ring-offset-1 ring-offset-gray-800 opacity-100';
              } else if (!isSelected && isCorrect) {
                // Correct answer, not selected by player
                buttonClass = 'bg-gray-700 hover:bg-gray-700 text-white ring-2 ring-green-400 ring-offset-1 ring-offset-gray-800 opacity-100';
              } else {
                // Not selected, not correct
                buttonClass = 'bg-gray-800 hover:bg-gray-800 text-gray-400 opacity-50 cursor-not-allowed';
              }
            } else {
              // Before results are shown
              if (selectedAnswer === index) {
                // Player's selected answer
                buttonClass = 'bg-blue-600 hover:bg-blue-600 text-white border-blue-500 ring-2 ring-blue-400 ring-offset-1 ring-offset-gray-800';
              } else {
                // Other options, not yet selected or waiting for others
                buttonClass = `bg-gray-700 text-white border-gray-600 ${
                  !playerHasAnswered && timeLeft > 0 ? 'hover:bg-gray-600 hover:border-gray-500 cursor-pointer' : 'cursor-not-allowed opacity-75'
                }`;
              }
            }

            return (
              <Button
                key={index}
                onClick={() => !showResults && !isHost && onAnswerSelect?.(index)}
                disabled={showResults || isHost || timeLeft === 0 || playerHasAnswered} // playerHasAnswered will disable further clicks after one selection
                className={`p-6 text-left h-auto justify-start ${buttonClass}`}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 rounded-lg px-3 py-2 font-bold">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="flex-1">{option}</span>
                  {showResults && selectedAnswer === index && (
                    <div className="text-lg font-bold">
                      {selectedAnswer === question.correctAnswer ? '✓' : '✗'}
                    </div>
                  )}
                </div>
              </Button>
            );
          })}
        </div>

      </Card>
    </div>
  );
};