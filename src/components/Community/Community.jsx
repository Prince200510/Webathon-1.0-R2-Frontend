import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import QuestionList from './QuestionList';
import QuestionForm from './QuestionForm';
import QuestionDetail from './QuestionDetailNew';

const Community = () => {
  const [activeTab, setActiveTab] = useState('questions');
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [filters, setFilters] = useState({
    subject: 'all',
    difficulty: 'all',
    isResolved: undefined,
    sortBy: 'newest',
    search: ''
  });

  const subjects = [
    'all', 'mathematics', 'physics', 'chemistry', 'biology',
    'computer-science', 'english', 'history', 'geography', 'other'
  ];

  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'upvotes', label: 'Most Upvoted' }
  ];

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question);
  };

  const handleBackToList = () => {
    setSelectedQuestion(null);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const renderFilters = () => (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 p-6 mb-8 shadow-lg">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Filter Questions</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">Find exactly what you're looking for</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
            <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
            Subject
          </label>
          <select 
            value={filters.subject} 
            onChange={(e) => handleFilterChange('subject', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm shadow-sm hover:shadow-md"
          >
            {subjects.map(subject => (
              <option key={subject} value={subject}>
                {subject === 'all' ? 'All Subjects' : 
                 subject.charAt(0).toUpperCase() + subject.slice(1).replace('-', ' ')}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
            Difficulty
          </label>
          <select 
            value={filters.difficulty} 
            onChange={(e) => handleFilterChange('difficulty', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm shadow-sm hover:shadow-md"
          >
            {difficulties.map(difficulty => (
              <option key={difficulty} value={difficulty}>
                {difficulty === 'all' ? 'All Levels' : 
                 difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
            <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
            Status
          </label>
          <select 
            value={filters.isResolved || 'all'} 
            onChange={(e) => {
              const value = e.target.value;
              handleFilterChange('isResolved', 
                value === 'all' ? undefined : value === 'true'
              );
            }}
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm shadow-sm hover:shadow-md"
          >
            <option value="all">All Questions</option>
            <option value="false">Unanswered</option>
            <option value="true">Resolved</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
            <div className="w-2 h-2 rounded-full bg-orange-500 mr-2"></div>
            Sort by
          </label>
          <select 
            value={filters.sortBy} 
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm shadow-sm hover:shadow-md"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search questions, topics, or keywords..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm shadow-sm hover:shadow-md text-lg"
          />
        </div>
      </div>
    </div>
  );

  if (selectedQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <QuestionDetail 
          question={selectedQuestion} 
          onBack={handleBackToList}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl opacity-10 blur-3xl"></div>
          <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-gray-700/50 p-8 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  Community Q&A
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
                  Ask questions, share knowledge, and learn together with our vibrant community of learners and experts
                </p>
                <div className="flex items-center space-x-6 mt-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>Active Community</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span>AI-Powered Help</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span>Expert Mentors</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setShowQuestionForm(true)}
                  className="group inline-flex items-center px-8 py-4 border border-transparent text-lg font-semibold rounded-2xl shadow-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                >
                  <Plus className="h-6 w-6 mr-3 group-hover:rotate-90 transition-transform duration-300" />
                  Ask Question
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-8">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 p-2 inline-flex shadow-lg">
            <button 
              onClick={() => setActiveTab('questions')}
              className={`px-8 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                activeTab === 'questions' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              All Questions
            </button>
            <button 
              onClick={() => setActiveTab('my-questions')}
              className={`px-8 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                activeTab === 'my-questions' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              My Questions
            </button>
          </div>
        </div>
        {renderFilters()}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-gray-700/50 shadow-xl overflow-hidden">
          {showQuestionForm ? (
            <QuestionForm 
              onClose={() => setShowQuestionForm(false)}
              onQuestionCreated={() => {
                setShowQuestionForm(false);
              }}
            />
          ) : (
            <QuestionList 
              filters={filters}
              activeTab={activeTab}
              onQuestionClick={handleQuestionClick}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Community;
