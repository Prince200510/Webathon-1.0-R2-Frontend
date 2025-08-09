import React, { useState } from 'react';
import { ChevronUp, ChevronDown, MessageCircle, Check, Clock, User, CheckCircle } from 'lucide-react';
import axios from 'axios';
import AnswerForm from './AnswerForm';
import { getAvatarColor, getInitials, getRoleBadgeColor } from '../../utils/profileUtils';

const AnswerList = ({ answers, questionAuthorId, currentUserId, onAnswerAccepted }) => {
  const [replyingTo, setReplyingTo] = useState(null);
  const [userVotes, setUserVotes] = useState({});

  const handleVote = async (answerId, type) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'https://team-duo-dare-r2b.onrender.com'}/api/community/answers/${answerId}/vote`,
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
        `${import.meta.env.VITE_API_URL || 'https://team-duo-dare-r2b.onrender.com'}/api/community/answers/${answerId}/accept`,
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
    <div key={answer._id} className={`border rounded-lg transition-all duration-200 ${
      answer.isAccepted && !isReply 
        ? 'border-green-300 dark:border-green-600 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20' 
        : isReply 
          ? 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 ml-8 mt-3' 
          : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800'
    }`}>
      {answer.isAccepted && !isReply && (
        <div className="bg-green-600 text-white px-4 py-2 rounded-t-lg">
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Accepted Answer</span>
          </div>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex gap-4">
          <div className="flex flex-col items-center space-y-2 min-w-[50px]">
            <button 
              onClick={() => handleVote(answer._id, 'upvote')}
              className={`p-1.5 rounded-full border-2 transition-all duration-200 ${
                userVotes[answer._id] === 'upvote' 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600'
              }`}
            >
              <ChevronUp className="h-4 w-4" />
            </button>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">{answer.score || 0}</span>
            <button 
              onClick={() => handleVote(answer._id, 'downvote')}
              className={`p-1.5 rounded-full border-2 transition-all duration-200 ${
                userVotes[answer._id] === 'downvote' 
                  ? 'bg-red-600 border-red-600 text-white' 
                  : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-red-500 hover:text-red-600'
              }`}
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1">
            <div className="prose dark:prose-invert max-w-none mb-4">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{answer.content}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {!isReply && (
                  <button 
                    onClick={() => setReplyingTo(replyingTo === answer._id ? null : answer._id)}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                  >
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Reply
                  </button>
                )}
                
                {!isReply && !answer.isAccepted && currentUserId === questionAuthorId && (
                  <button 
                    onClick={() => handleAcceptAnswer(answer._id)}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Accept Answer
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${getAvatarColor(answer.author?.name || 'Anonymous')}`}>
                      {getInitials(answer.author?.name || 'Anonymous')}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {answer.author?.name || 'Anonymous'}
                      </span>
                      {answer.author?.role && (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(answer.author.role)}`}>
                          {answer.author.role}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{formatTimeAgo(answer.createdAt)}</span>
                </div>
              </div>
            </div>
            {replyingTo === answer._id && (
              <div className="mt-4">
                <AnswerForm 
                  questionId={answer.question}
                  parentAnswerId={answer._id}
                  onAnswerSubmitted={handleReplySubmitted}
                  onCancel={() => setReplyingTo(null)}
                />
              </div>
            )}

            {answer.replies && answer.replies.length > 0 && (
              <div className="mt-4 space-y-3">
                {answer.replies.map(reply => renderAnswer(reply, true))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (answers.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400 text-lg">No answers yet. Be the first to help!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {answers.map(answer => renderAnswer(answer))}
    </div>
  );
};

export default AnswerList;
