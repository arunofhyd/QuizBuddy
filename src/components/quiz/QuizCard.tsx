import React from 'react';
import { Quiz } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Play, Edit, Trash2, Clock, HelpCircle } from 'lucide-react';

interface QuizCardProps {
  quiz: Quiz;
  onPlay: (quiz: Quiz) => void;
  onEdit: (quiz: Quiz) => void;
  onDelete: (quizId: string) => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  quiz,
  onPlay,
  onEdit,
  onDelete
}) => {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${quiz.title}"?`)) {
      onDelete(quiz.id);
    }
  };

  return (
    <Card className="h-full">
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-2">{quiz.title}</h3>
          {quiz.description && (
            <p className="text-white/70 mb-4 line-clamp-2">{quiz.description}</p>
          )}
          
          <div className="flex items-center gap-4 text-sm text-white/60 mb-4">
            <div className="flex items-center gap-1">
              <HelpCircle size={16} />
              <span>{quiz.questions.length} question{quiz.questions.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>
                ~{Math.max(1, Math.round(
                  quiz.questions.reduce((acc, q) => acc + q.timeLimit, 0) / 60
                ))} min
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t border-white/10">
          <Button
            variant="primary"
            onClick={() => onPlay(quiz)}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <Play size={16} />
            Host
          </Button>
          <Button
            variant="ghost"
            onClick={() => onEdit(quiz)}
            className="px-3"
          >
            <Edit size={16} />
          </Button>
          <Button
            variant="ghost"
            onClick={handleDelete}
            className="px-3 text-red-400 hover:text-red-300"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </Card>
  );
};