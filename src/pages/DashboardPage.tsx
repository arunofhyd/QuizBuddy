import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, addDoc, doc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import { Layout } from '../components/layouts/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { QuizCard } from '../components/quiz/QuizCard';
import { Quiz } from '../types';
import { Plus, LogOut, User } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadQuizzes();
  }, [currentUser]);

  const loadQuizzes = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const q = query(
        collection(db, 'quizzes'),
        where('createdBy', '==', currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      
      const quizzesData: Quiz[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        quizzesData.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as Quiz);
      });

      setQuizzes(quizzesData);
    } catch (err) {
      console.error('Error loading quizzes:', err);
      setError('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = async () => {
    if (!currentUser) return;

    try {
      const newQuiz: Omit<Quiz, 'id'> = {
        title: 'New Quiz',
        description: '',
        questions: [],
        createdBy: currentUser.uid,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await addDoc(collection(db, 'quizzes'), {
        ...newQuiz,
        createdAt: Timestamp.fromDate(newQuiz.createdAt),
        updatedAt: Timestamp.fromDate(newQuiz.updatedAt)
      });

      navigate(`/quiz-editor/${docRef.id}`);
    } catch (err) {
      console.error('Error creating quiz:', err);
      setError('Failed to create quiz');
    }
  };

  const handleEditQuiz = (quiz: Quiz) => {
    navigate(`/quiz-editor/${quiz.id}`);
  };

  const handlePlayQuiz = (quiz: Quiz) => {
    navigate(`/host/${quiz.id}`);
  };

  const handleDeleteQuiz = async (quizId: string) => {
    try {
      await deleteDoc(doc(db, 'quizzes', quizId));
      setQuizzes(prev => prev.filter(quiz => quiz.id !== quizId));
    } catch (err) {
      console.error('Error deleting quiz:', err);
      setError('Failed to delete quiz');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return (
      <Layout background="host">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-white text-xl">Loading...</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout background="host">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Quiz Dashboard</h1>
            <p className="text-white/70">Manage your quizzes and host games</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white/70">
              <User size={20} />
              <span>{currentUser?.email}</span>
            </div>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut size={20} className="mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
            {error}
          </div>
        )}

        {/* Create Quiz Button */}
        <div className="mb-8">
          <Button onClick={handleCreateQuiz} size="lg">
            <Plus size={20} className="mr-2" />
            Create New Quiz
          </Button>
        </div>

        {/* Quizzes Grid */}
        {quizzes.length === 0 ? (
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-white mb-2">No quizzes yet</h3>
            <p className="text-white/70 mb-6">
              Create your first quiz to get started with hosting interactive games!
            </p>
            <Button onClick={handleCreateQuiz}>
              <Plus size={20} className="mr-2" />
              Create Your First Quiz
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                onPlay={handlePlayQuiz}
                onEdit={handleEditQuiz}
                onDelete={handleDeleteQuiz}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};