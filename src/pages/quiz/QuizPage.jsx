import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import { formatDate, formatTime } from '../../utils/helpers';

const QuizPage = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [userAttempts, setUserAttempts] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedTab, setSelectedTab] = useState('available');
  const [loading, setLoading] = useState(true);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [quizForm, setQuizForm] = useState({
    subject: '',
    difficulty: 'medium',
    questionCount: 10,
    timeLimit: 30
  });

  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
    'English', 'History', 'Geography', 'Economics', 'Psychology'
  ];

  const difficulties = ['easy', 'medium', 'hard'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [quizzesRes, attemptsRes, leaderboardRes] = await Promise.all([
        api.get('/quizzes/search'),
        api.get('/quizzes/attempts/my-results'),
        api.get('/quizzes/leaderboard/default')
      ]);

      setQuizzes(quizzesRes.data.quizzes || []);
      setUserAttempts(attemptsRes.data.attempts || []);
      setLeaderboard(leaderboardRes.data.leaderboard || []);
    } catch (error) {
      console.error('Failed to fetch quiz data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateQuiz = async () => {
    if (!quizForm.subject) {
      alert('Please select a subject');
      return;
    }

    setGeneratingQuiz(true);
    try {
      const response = await api.post('/quizzes/generate', {
        subject: quizForm.subject,
        topic: quizForm.subject,  
        difficulty: quizForm.difficulty,
        questionCount: quizForm.questionCount
      });
      setQuizzes(prev => [response.data, ...prev]);
      setQuizForm({
        subject: '',
        difficulty: 'medium',
        questionCount: 10,
        timeLimit: 30
      });
      alert('Quiz generated successfully!');
    } catch (error) {
      console.error('Failed to generate quiz:', error);
      alert('Failed to generate quiz. Please try again.');
    } finally {
      setGeneratingQuiz(false);
    }
  };

  const startQuiz = (quizId) => {
    navigate(`/quiz/${quizId}/attempt`);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const renderAvailableQuizzes = () => (
    <div className="space-y-6">
      {/* Quiz Generator */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Generate AI-Powered Quiz
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subject
            </label>
            <select
              value={quizForm.subject}
              onChange={(e) => setQuizForm(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select Subject</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Difficulty
            </label>
            <select
              value={quizForm.difficulty}
              onChange={(e) => setQuizForm(prev => ({ ...prev, difficulty: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Questions
            </label>
            <select
              value={quizForm.questionCount}
              onChange={(e) => setQuizForm(prev => ({ ...prev, questionCount: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value={5}>5 Questions</option>
              <option value={10}>10 Questions</option>
              <option value={15}>15 Questions</option>
              <option value={20}>20 Questions</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Time Limit (min)
            </label>
            <select
              value={quizForm.timeLimit}
              onChange={(e) => setQuizForm(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>60 minutes</option>
            </select>
          </div>
        </div>
        <button
          onClick={generateQuiz}
          disabled={!quizForm.subject || generatingQuiz}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
        >
          {generatingQuiz ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Generating...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate Quiz
            </>
          )}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div key={quiz._id} className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {quiz.title}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                  {quiz.difficulty}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {quiz.questions.length} Questions
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {quiz.timeLimit} minutes
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {quiz.attempts || 0} attempts
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-500">
                  Created {formatDate(quiz.createdAt)}
                </span>
                <button
                  onClick={() => startQuiz(quiz._id)}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                >
                  Start Quiz
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderUserAttempts = () => (
    <div className="space-y-4">
      {userAttempts.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No attempts yet</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Start taking quizzes to see your progress here.
          </p>
        </div>
      ) : (
        userAttempts.map((attempt) => (
          <div key={attempt._id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {attempt.quiz.title}
                </h3>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>Completed {formatDate(attempt.completedAt)}</span>
                  <span>Time: {attempt.timeTaken} minutes</span>
                  <span className={`font-semibold ${getScoreColor(attempt.score)}`}>
                    Score: {attempt.score}%
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${getScoreColor(attempt.score)}`}>
                  {attempt.score}%
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-500">
                  {attempt.correctAnswers}/{attempt.totalQuestions}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${attempt.score >= 70 ? 'bg-green-500' : attempt.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${attempt.score}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderLeaderboard = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Performers</h3>
      </div>
      <div className="p-6">
        {leaderboard.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No leaderboard data available
          </p>
        ) : (
          <div className="space-y-4">
            {leaderboard.map((entry, index) => (
              <div key={entry._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {entry.user?.name || 
                       (entry.user?.firstName && entry.user?.lastName 
                         ? `${entry.user.firstName} ${entry.user.lastName}` 
                         : 'Unknown User')}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {entry.totalQuizzes || 0} quizzes completed
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white">{Math.round(entry.averageScore || 0)}%</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">avg score</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Quiz Center
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Test your knowledge with AI-generated quizzes and track your progress
          </p>
        </div>
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'available', label: 'Available Quizzes' },
              { id: 'attempts', label: 'My Attempts' },
              { id: 'leaderboard', label: 'Leaderboard' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        {selectedTab === 'available' && renderAvailableQuizzes()}
        {selectedTab === 'attempts' && renderUserAttempts()}
        {selectedTab === 'leaderboard' && renderLeaderboard()}
      </div>
    </div>
  );
};

export default QuizPage;
