import React, { useState, useEffect } from 'react';
import { Eye, MessageCircle, ChevronUp, Clock, User, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { getAvatarColor, getInitials, getRoleBadgeColor } from '../../utils/profileUtils';

const QuestionList = ({ filters, activeTab, onQuestionClick }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  useEffect(() => {
    fetchQuestions();
  }, [filters, activeTab, pagination.currentPage]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      let endpoint = '/api/community/questions';
      if (activeTab === 'my-questions') {
        endpoint = '/api/community/my-questions';
      }

      const params = {
        page: pagination.currentPage,
        limit: 10,
        ...filters
      };

      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === 'all' || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'https://webathon-1-0-r2-backend.onrender.com'}${endpoint}`, {
        params,
        headers: activeTab === 'my-questions' ? { Authorization: `Bearer ${token}` } : {}
      });

      setQuestions(response.data.questions);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        total: response.data.total,
        hasNextPage: response.data.hasNextPage,
        hasPrevPage: response.data.hasPrevPage
      });
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
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

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 dark:border-blue-800"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
        </div>
        <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 font-medium">Loading amazing questions...</p>
        <div className="flex items-center space-x-2 mt-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mb-6 mx-auto">
            <MessageCircle className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">No questions found</h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
            {activeTab === 'my-questions' 
              ? "You haven't asked any questions yet. Start by asking your first question and get help from the community!"
              : "No questions match your current filters. Try adjusting your search criteria or be the first to ask a question!"}
          </p>
          <div className="mt-6 flex justify-center space-x-2">
            <div className="w-3 h-3 bg-blue-300 dark:bg-blue-600 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-purple-300 dark:bg-purple-600 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <div className="w-3 h-3 bg-blue-300 dark:bg-blue-600 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">{pagination.total} questions</span>
      </div>

      <div className="space-y-6">
        {questions.map(question => (
          <div 
            key={question._id} 
            onClick={() => onQuestionClick(question)}
            className="group relative border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-xl dark:hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer bg-white dark:bg-gray-800 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-900/10 dark:hover:to-purple-900/10 transform hover:-translate-y-1"
          >
            {question.isResolved && (
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700 shadow-sm">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Resolved
                </span>
              </div>
            )}

            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex lg:flex-col justify-center lg:justify-start space-x-4 lg:space-x-0 lg:space-y-4 lg:min-w-[90px] order-2 lg:order-1">
                <div className="flex flex-col items-center p-3 lg:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50 hover:shadow-md transition-all duration-200 min-w-[70px]">
                  <ChevronUp className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600 dark:text-blue-400 mb-1" />
                  <span className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white">{question.score || 0}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden lg:block">VOTES</span>
                </div>
                
                <div className="flex flex-col items-center p-3 lg:p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-100 dark:border-green-800/50 hover:shadow-md transition-all duration-200 min-w-[70px]">
                  <MessageCircle className="h-4 w-4 lg:h-5 lg:w-5 text-green-600 dark:text-green-400 mb-1" />
                  <span className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white">{question.answerCount || 0}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden lg:block">ANSWERS</span>
                </div>
                
                <div className="flex flex-col items-center p-3 lg:p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-100 dark:border-purple-800/50 hover:shadow-md transition-all duration-200 min-w-[70px]">
                  <Eye className="h-4 w-4 lg:h-5 lg:w-5 text-purple-600 dark:text-purple-400 mb-1" />
                  <span className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white">{question.views || 0}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden lg:block">VIEWS</span>
                </div>
              </div>
              <div className="flex-1 min-w-0 order-1 lg:order-2">
                <div className="mb-4">
                  <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2 pr-4 lg:pr-16">
                    {question.title}
                  </h3>
                  <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                    {question.content.length > 150 
                      ? `${question.content.substring(0, 150)}...` 
                      : question.content}
                  </p>
                </div>
                <div className="mb-4 lg:mb-6">
                  <div className="flex flex-wrap gap-2">
                    <span 
                      className={`inline-flex items-center px-2 lg:px-3 py-1 rounded-full text-xs font-semibold text-white shadow-sm ${
                        question.difficulty === 'beginner' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                        question.difficulty === 'intermediate' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                        'bg-gradient-to-r from-red-500 to-red-600'
                      }`}
                    >
                      {question.difficulty?.toUpperCase()}
                    </span>
                    <span className="inline-flex items-center px-2 lg:px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                      {question.subject?.replace('-', ' ').toUpperCase()}
                    </span>
                    {question.tags?.slice(0, window.innerWidth < 768 ? 2 : 3).map(tag => (
                      <span key={tag} className="inline-flex items-center px-2 lg:px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        #{tag}
                      </span>
                    ))}
                    {question.tags?.length > (window.innerWidth < 768 ? 2 : 3) && (
                      <span className="inline-flex items-center px-2 lg:px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                        +{question.tags.length - (window.innerWidth < 768 ? 2 : 3)} more
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg ${getAvatarColor(question.author?.name || 'Anonymous')} ring-2 ring-white dark:ring-gray-800`}>
                        {getInitials(question.author?.name || 'Anonymous')}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 dark:text-white text-sm">{question.author?.name || 'Anonymous'}</span>
                        {question.author?.role && (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${getRoleBadgeColor(question.author.role)} w-fit`}>
                            {question.author.role}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-xs lg:text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 px-3 py-1 rounded-full w-fit">
                    <Clock className="h-3 w-3 lg:h-4 lg:w-4" />
                    <span>{formatTimeAgo(question.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-8">
          <button 
            disabled={!pagination.hasPrevPage}
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          <div className="flex space-x-1">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              let pageNum;
              if (pagination.totalPages <= 5) {
                pageNum = i + 1;
              } else if (pagination.currentPage <= 3) {
                pageNum = i + 1;
              } else if (pagination.currentPage >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i;
              } else {
                pageNum = pagination.currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${
                    pageNum === pagination.currentPage
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button 
            disabled={!pagination.hasNextPage}
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionList;
