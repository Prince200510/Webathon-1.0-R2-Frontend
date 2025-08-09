import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronUp, ChevronDown, Eye, Clock, User, CheckCircle, Bot, MessageSquare, AlertCircle } from 'lucide-react';
import axios from 'axios';
import AnswerForm from './AnswerForm';
import AnswerList from './AnswerListNew';
import { getAvatarColor, getInitials, getRoleBadgeColor } from '../../utils/profileUtils';

const QuestionDetail = ({ question: initialQuestion, onBack }) => {
  const [question, setQuestion] = useState(initialQuestion);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [userVote, setUserVote] = useState(null);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchQuestionDetails();
    getCurrentUser();
  }, []);

  const getCurrentUser = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUser({ id: payload.userId });
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }
  };

  const fetchQuestionDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'https://webathon-1-0-r2-backend.onrender.com'}/api/community/questions/${initialQuestion._id}`
      );
      setQuestion(response.data.question);
      setAnswers(response.data.answers);
      
      if (currentUser) {
        const userUpvote = response.data.question.upvotes.find(
          vote => vote.user === currentUser.id
        );
        const userDownvote = response.data.question.downvotes.find(
          vote => vote.user === currentUser.id
        );
        
        if (userUpvote) setUserVote('upvote');
        else if (userDownvote) setUserVote('downvote');
      }
    } catch (error) {
      console.error('Error fetching question details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (type) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'https://webathon-1-0-r2-backend.onrender.com'}/api/community/questions/${question._id}/vote`,
        { type },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setQuestion(prev => ({
        ...prev,
        upvoteCount: response.data.upvoteCount,
        downvoteCount: response.data.downvoteCount,
        score: response.data.score
      }));

      setUserVote(userVote === type ? null : type);
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const getAISuggestion = async () => {
    try {
      setLoadingAI(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'https://webathon-1-0-r2-backend.onrender.com'}/api/community/questions/${question._id}/ai-suggestion`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAiSuggestion(response.data.suggestion);
    } catch (error) {
      console.error('Error getting AI suggestion:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      }
    } finally {
      setLoadingAI(false);
    }
  };

  const handleAnswerSubmitted = (newAnswer) => {
    setAnswers(prev => [...prev, { ...newAnswer, replies: [] }]);
    setShowAnswerForm(false);
  };

  const handleAnswerAccepted = (answerId) => {
    setAnswers(prev => prev.map(answer => ({
      ...answer,
      isAccepted: answer._id === answerId
    })));
    setQuestion(prev => ({ ...prev, isResolved: true }));
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const questionDate = new Date(date);
    const diffInSeconds = Math.floor((now - questionDate) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return questionDate.toLocaleDateString();
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: 'bg-green-500',
      intermediate: 'bg-yellow-500',
      advanced: 'bg-red-500'
    };
    return colors[difficulty] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button 
          onClick={onBack}
          className="group flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-all duration-200 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg"
        >
          <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Questions
        </button>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-xl p-6 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-500/10 to-blue-500/10 rounded-full blur-2xl"></div>
          
          <div className="relative flex gap-6">
            <div className="flex flex-col items-center space-y-2 min-w-[70px]">
              <button 
                onClick={() => handleVote('upvote')}
                className={`group p-2 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                  userVote === 'upvote' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 border-blue-600 text-white shadow-lg' 
                    : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 hover:shadow-md bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm'
                }`}
              >
                <ChevronUp className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
              </button>
              <div className="text-center py-2 px-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl shadow-inner">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{question.score || 0}</span>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">VOTES</div>
              </div>
              <button 
                onClick={() => handleVote('downvote')}
                className={`group p-2 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                  userVote === 'downvote' 
                    ? 'bg-gradient-to-r from-red-600 to-pink-600 border-red-600 text-white shadow-lg' 
                    : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-red-500 hover:text-red-600 hover:shadow-md bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm'
                }`}
              >
                <ChevronDown className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
              </button>
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-tight pr-4">
                  {question.title}
                </h1>
                {question.isResolved && (
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700 shadow-sm shrink-0">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Resolved
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center bg-gray-100 dark:bg-gray-700/50 px-3 py-1 rounded-full">
                  <Clock className="h-4 w-4 mr-2" />
                  Asked {formatTimeAgo(question.createdAt)}
                </div>
                <div className="flex items-center bg-gray-100 dark:bg-gray-700/50 px-3 py-1 rounded-full">
                  <Eye className="h-4 w-4 mr-2" />
                  {question.views} views
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold text-white shadow-lg ${getDifficultyColor(question.difficulty)} ring-2 ring-white dark:ring-gray-800`}>
                  {question.difficulty?.toUpperCase()}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                  {question.subject?.replace('-', ' ').toUpperCase()}
                </span>
                {question.tags?.map(tag => (
                  <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="prose dark:prose-invert max-w-none mb-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{question.content}</p>
                {question.image && (
                  <div className="mt-4">
                    <img 
                      src={`${import.meta.env.VITE_API_URL || 'https://webathon-1-0-r2-backend.onrender.com'}${question.image}`} 
                      alt="Question attachment"
                      className="max-w-full h-auto rounded-xl border border-gray-200 dark:border-gray-600 shadow-lg hover:shadow-xl transition-shadow duration-300"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50/80 to-blue-50/80 dark:from-gray-700/50 dark:to-blue-900/20 rounded-xl border border-gray-200/50 dark:border-gray-600/50">
                <div className="flex items-center space-x-3">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg ${getAvatarColor(question.author?.name || 'Anonymous')} ring-2 ring-white dark:ring-gray-800`}
                  >
                    {getInitials(question.author?.name || 'Anonymous')}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900 dark:text-white">{question.author?.name || 'Anonymous'}</span>
                    {question.author?.role && (
                      <span className={`text-sm px-2 py-0.5 rounded-full ${getRoleBadgeColor(question.author.role)} font-medium w-fit`}>
                        {question.author.role}
                      </span>
                    )}
                  </div>
                </div>
              <button 
                onClick={getAISuggestion}
                disabled={loadingAI}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Bot className="h-4 w-4 mr-2" />
                {loadingAI ? 'Getting AI Help...' : 'Get AI Suggestion'}
              </button>
            </div>

            {aiSuggestion && (
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-6 mb-6">
                <h3 className="flex items-center text-lg font-semibold text-purple-800 dark:text-purple-300 mb-4">
                  <Bot className="h-5 w-5 mr-2" />
                  AI Assistant
                </h3>
                <div className="prose dark:prose-invert max-w-none">
                  {aiSuggestion.split('\n').map((line, index) => (
                    <p key={index} className="text-gray-700 dark:text-gray-300 mb-2">{line}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                  {answers.length} Answer{answers.length !== 1 ? 's' : ''}
                </h2>
                {answers.length > 0 && (
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 px-3 py-1 rounded-full">
                    <MessageSquare className="h-4 w-4" />
                    <span>Community Discussion</span>
                  </div>
                )}
              </div>
              <button 
                onClick={() => setShowAnswerForm(!showAnswerForm)}
                className="group inline-flex items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <MessageSquare className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                {showAnswerForm ? 'Cancel' : 'Write Answer'}
              </button>
            </div>

            {showAnswerForm && (
              <div className="mb-6 bg-gradient-to-r from-green-50/50 to-blue-50/50 dark:from-green-900/10 dark:to-blue-900/10 rounded-xl p-4 border border-green-200/50 dark:border-green-700/50">
                <AnswerForm 
                  questionId={question._id}
                  onAnswerSubmitted={handleAnswerSubmitted}
                  onCancel={() => setShowAnswerForm(false)}
                />
              </div>
            )}

            <AnswerList 
              answers={answers}
              questionAuthorId={question.author._id}
              currentUserId={currentUser?.id}
              onAnswerAccepted={handleAnswerAccepted}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail;
