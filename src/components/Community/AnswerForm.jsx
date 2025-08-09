import React, { useState } from 'react';
import { Send, X } from 'lucide-react';
import axios from 'axios';

const AnswerForm = ({ questionId, parentAnswerId, onAnswerSubmitted, onCancel }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Answer content is required');
      return;
    }

    if (content.length < 10) {
      setError('Answer must be at least 10 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'https://team-duo-dare-r2b.onrender.com'}/api/community/questions/${questionId}/answers`,
        { 
          content: content.trim(),
          parentAnswerId 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onAnswerSubmitted(response.data);
      setContent('');
    } catch (error) {
      console.error('Error submitting answer:', error);
      setError(error.response?.data?.message || 'Failed to submit answer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {parentAnswerId ? 'Reply to Answer' : 'Your Answer'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your answer here..."
            rows={6}
            maxLength={5000}
            className={`w-full px-4 py-3 border rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
              error ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
          <div className="mt-1 text-right text-xs text-gray-500 dark:text-gray-400">{content.length}/5000</div>
        </div>

        <div className="flex items-center justify-end space-x-3">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting...
              </div>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Answer
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnswerForm;
