import React, { useState } from 'react';
import { ChevronUp, ChevronDown, MessageCircle, Check, Clock, User, CheckCircle } from 'lucide-react';
import axios from 'axios';
import AnswerForm from './AnswerForm';

const AnswerList = ({ answers, questionAuthorId, currentUserId, onAnswerAccepted }) => {
  const [replyingTo, setReplyingTo] = useState(null);
  const [userVotes, setUserVotes] = useState({});

  const handleVote = async (answerId, type) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'https://webathon-1-0-r2-backend.onrender.com'}/api/community/answers/${answerId}/vote`,
        { type },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserVotes(prev => ({
        ...prev,
        [answerId]: prev[answerId] === type ? null : type
      }));
    } catch (error) {
      console.error('Error voting on answer:', error);
    }
  };

  const handleAcceptAnswer = async (answerId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_API_URL || 'https://webathon-1-0-r2-backend.onrender.com'}/api/community/answers/${answerId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      onAnswerAccepted(answerId);
    } catch (error) {
      console.error('Error accepting answer:', error);
    }
  };

  const handleReplySubmitted = (reply) => {
    setReplyingTo(null);
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const answerDate = new Date(date);
    const diffInSeconds = Math.floor((now - answerDate) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return answerDate.toLocaleDateString();
  };

  const renderAnswer = (answer, isReply = false) => (
    <div key={answer._id} className={`answer ${isReply ? 'reply' : ''} ${answer.isAccepted ? 'accepted' : ''}`}>
      {answer.isAccepted && !isReply && (
        <div className="accepted-badge">
          ✓ Accepted Answer
        </div>
      )}
      
      <div className="answer-content">
        <div className="answer-voting">
          <button 
            className={`vote-btn ${userVotes[answer._id] === 'upvote' ? 'active' : ''}`}
            onClick={() => handleVote(answer._id, 'upvote')}
          >
            ▲
          </button>
          <span className="vote-score">{answer.score || 0}</span>
          <button 
            className={`vote-btn ${userVotes[answer._id] === 'downvote' ? 'active' : ''}`}
            onClick={() => handleVote(answer._id, 'downvote')}
          >
            ▼
          </button>
        </div>

        <div className="answer-main">
          <div className="answer-body">
            <p>{answer.content}</p>
          </div>

          <div className="answer-meta">
            <div className="answer-actions">
              {!isReply && (
                <button 
                  className="reply-btn"
                  onClick={() => setReplyingTo(replyingTo === answer._id ? null : answer._id)}
                >
                  Reply
                </button>
              )}
              
              {!isReply && !answer.isAccepted && currentUserId === questionAuthorId && (
                <button 
                  className="accept-btn"
                  onClick={() => handleAcceptAnswer(answer._id)}
                >
                  Accept Answer
                </button>
              )}
            </div>

            <div className="answer-author">
              <span className="author-name">{answer.author.name}</span>
              <span className="author-role">({answer.author.role})</span>
              <span className="answer-time">{formatTimeAgo(answer.createdAt)}</span>
            </div>
          </div>

          {replyingTo === answer._id && (
            <AnswerForm 
              questionId={answer.question}
              parentAnswerId={answer._id}
              onAnswerSubmitted={handleReplySubmitted}
              onCancel={() => setReplyingTo(null)}
            />
          )}

          {answer.replies && answer.replies.length > 0 && (
            <div className="replies">
              {answer.replies.map(reply => renderAnswer(reply, true))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (answers.length === 0) {
    return (
      <div className="no-answers">
        <p>No answers yet. Be the first to help!</p>
      </div>
    );
  }

  return (
    <div className="answer-list">
      {answers.map(answer => renderAnswer(answer))}
    </div>
  );
};

export default AnswerList;
