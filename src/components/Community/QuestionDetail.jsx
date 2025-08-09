import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronUp, ChevronDown, Eye, Clock, User, CheckCircle, Bot, MessageSquare } from 'lucide-react';
import axios from 'axios';
import AnswerForm from './AnswerForm';
import AnswerList from './AnswerList';

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
        `${import.meta.env.VITE_API_URL || 'https://team-duo-dare-r2b.onrender.com'}/api/community/questions/${initialQuestion._id}`
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
        `${import.meta.env.VITE_API_URL || 'https://team-duo-dare-r2b.onrender.com'}/api/community/questions/${question._id}/vote`,
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
        `${import.meta.env.VITE_API_URL || 'https://team-duo-dare-r2b.onrender.com'}/api/community/questions/${question._id}/ai-suggestion`,
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
      beginner: '#4CAF50',
      intermediate: '#FF9800',
      advanced: '#F44336'
    };
    return colors[difficulty] || '#9E9E9E';
  };

  if (loading) {
    return (
      <div className="question-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading question...</p>
      </div>
    );
  }

  return (
    <div className="question-detail">
      <div className="question-detail-header">
        <button className="back-btn" onClick={onBack}>
          ← Back to Questions
        </button>
      </div>

      <div className="question-content">
        <div className="question-voting">
          <button 
            className={`vote-btn ${userVote === 'upvote' ? 'active' : ''}`}
            onClick={() => handleVote('upvote')}
          >
            ▲
          </button>
          <span className="vote-score">{question.score || 0}</span>
          <button 
            className={`vote-btn ${userVote === 'downvote' ? 'active' : ''}`}
            onClick={() => handleVote('downvote')}
          >
            ▼
          </button>
        </div>

        <div className="question-main">
          <div className="question-header">
            <h1>{question.title}</h1>
            {question.isResolved && (
              <span className="resolved-badge">✓ Resolved</span>
            )}
          </div>

          <div className="question-meta">
            <div className="question-stats">
              <span>Asked {formatTimeAgo(question.createdAt)}</span>
              <span>{question.views} views</span>
            </div>
            <div className="question-tags">
              <span 
                className="difficulty-tag"
                style={{ backgroundColor: getDifficultyColor(question.difficulty) }}
              >
                {question.difficulty}
              </span>
              <span className="subject-tag">
                {question.subject.replace('-', ' ')}
              </span>
              {question.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>

          <div className="question-body">
            <p>{question.content}</p>
            {question.image && (
              <div className="question-image">
                <img 
                  src={`${import.meta.env.VITE_API_URL || 'https://team-duo-dare-r2b.onrender.com'}${question.image}`} 
                  alt="Question attachment"
                />
              </div>
            )}
          </div>

          <div className="question-author">
            <div className="author-info">
              <span className="author-name">{question.author.name}</span>
              <span className="author-role">({question.author.role})</span>
            </div>
          </div>

          <div className="question-actions">
            <button 
              className="ai-suggestion-btn"
              onClick={getAISuggestion}
              disabled={loadingAI}
            >
              {loadingAI ? 'Getting AI Help...' : '🤖 Get AI Suggestion'}
            </button>
          </div>

          {aiSuggestion && (
            <div className="ai-suggestion">
              <h3>🤖 AI Assistant</h3>
              <div className="ai-content">
                {aiSuggestion.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="answers-section">
        <div className="answers-header">
          <h2>{answers.length} Answer{answers.length !== 1 ? 's' : ''}</h2>
          <button 
            className="answer-btn"
            onClick={() => setShowAnswerForm(!showAnswerForm)}
          >
            {showAnswerForm ? 'Cancel' : 'Write Answer'}
          </button>
        </div>

        {showAnswerForm && (
          <AnswerForm 
            questionId={question._id}
            onAnswerSubmitted={handleAnswerSubmitted}
            onCancel={() => setShowAnswerForm(false)}
          />
        )}

        <AnswerList 
          answers={answers}
          questionAuthorId={question.author._id}
          currentUserId={currentUser?.id}
          onAnswerAccepted={handleAnswerAccepted}
        />
      </div>
    </div>
  );
};

export default QuestionDetail;
