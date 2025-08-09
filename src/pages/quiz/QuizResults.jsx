import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { api } from '../../utils/api'

function QuizResults() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { isDarkMode } = useTheme()
  
  const [attempt, setAttempt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAnswers, setShowAnswers] = useState(false)

  useEffect(() => {
    if (location.state?.attemptId) {
      fetchAttemptDetails(location.state.attemptId)
    } else {
      fetchLatestAttempt()
    }
  }, [location.state])

  const fetchAttemptDetails = async (attemptId) => {
    try {
      setLoading(true)
      const response = await api.get(`/quizzes/attempt/${attemptId}`)
      console.log('Attempt data received:', response.data)
      setAttempt(response.data)
    } catch (error) {
      console.error('Error fetching attempt details:', error)
      setError('Failed to load quiz results')
    } finally {
      setLoading(false)
    }
  }

  const fetchLatestAttempt = async () => {
    try {
      setLoading(true)
      const response = await api.get('/quizzes/attempts/latest')
      console.log('Latest attempt data received:', response.data)
      if (response.data) {
        setAttempt(response.data)
      } else {
        setError('No quiz attempts found')
      }
    } catch (error) {
      console.error('Error fetching latest attempt:', error)
      setError('Failed to load quiz results')
    } finally {
      setLoading(false)
    }
  }

  const getScorePercentage = () => {
    if (!attempt || !attempt.score || !attempt.totalQuestions || attempt.totalQuestions === 0) {
      console.log('Invalid attempt data for percentage calculation:', {
        attempt: !!attempt,
        score: attempt?.score,
        totalQuestions: attempt?.totalQuestions
      })
      return 0
    }
    const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100)
    console.log(`Calculated percentage: ${attempt.score}/${attempt.totalQuestions} = ${percentage}%`)
    return percentage
  }

  const getScoreColor = () => {
    const percentage = getScorePercentage()
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getGrade = () => {
    const percentage = getScorePercentage()
    if (percentage >= 90) return 'A+'
    if (percentage >= 80) return 'A'
    if (percentage >= 70) return 'B'
    if (percentage >= 60) return 'C'
    if (percentage >= 50) return 'D'
    return 'F'
  }

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0m 0s'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const retakeQuiz = () => {
    if (attempt?.quiz?._id) {
      navigate(`/quiz/${attempt.quiz._id}/attempt`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !attempt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
            {error || 'No quiz results found'}
          </p>
          <button
            onClick={() => navigate('/quiz')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate('/quiz')}
          className={`mb-6 flex items-center ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Quizzes
        </button>
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8 mb-8 text-center`}>
          <div className="mb-6">
            <div className={`text-6xl font-bold ${getScoreColor()} mb-2`}>
              {getScorePercentage()}%
            </div>
            <div className={`text-3xl font-bold ${getScoreColor()} mb-4`}>
              Grade: {getGrade()}
            </div>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
              Quiz Completed!
            </h1>
            <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {attempt?.quiz?.title || 'Quiz Results'}
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {attempt?.score || 0}
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Correct Answers
              </div>
            </div>
            
            <div>
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {(attempt?.totalQuestions || 0) - (attempt?.score || 0)}
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Incorrect Answers
              </div>
            </div>
            
            <div>
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {attempt?.totalQuestions || 0}
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Total Questions
              </div>
            </div>
            
            <div>
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatTime(attempt?.timeTaken)}
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Time Spent
              </div>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              Quiz Information
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Subject:
                </span>
                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {attempt?.quiz?.subject || 'N/A'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Difficulty:
                </span>
                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} capitalize`}>
                  {attempt?.quiz?.difficulty || 'N/A'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Completed:
                </span>
                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {new Date(attempt.completedAt).toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Attempt:
                </span>
                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  #{attempt.attemptNumber || 1}
                </span>
              </div>
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              Performance Analysis
            </h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Accuracy
                  </span>
                  <span className={`font-medium ${getScoreColor()}`}>
                    {getScorePercentage()}%
                  </span>
                </div>
                <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                  <div 
                    className={`h-2 rounded-full ${getScorePercentage() >= 80 ? 'bg-green-500' : getScorePercentage() >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${getScorePercentage()}%` }}
                  ></div>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                  Recommendation
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {getScorePercentage() >= 80 
                    ? "Excellent work! You have a strong understanding of this topic."
                    : getScorePercentage() >= 60
                    ? "Good job! Consider reviewing the topics you missed to improve further."
                    : "Keep studying! Review the material and try again to improve your understanding."
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
        {attempt.answers && attempt.answers.length > 0 && (
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 mb-8`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Detailed Review
              </h2>
              <button
                onClick={() => setShowAnswers(!showAnswers)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {showAnswers ? 'Hide' : 'Show'} Answers
              </button>
            </div>
            
            {showAnswers && (
              <div className="space-y-6">
                {attempt?.quiz?.questions?.map((question, index) => {
                  const userAnswer = attempt?.answers?.find(a => a.questionIndex === index)
                  const isCorrect = userAnswer?.selectedOption === question.correctAnswer
                  
                  return (
                    <div key={index} className={`p-4 rounded-lg border-l-4 ${isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20'}`}>
                      <div className="flex items-start justify-between mb-3">
                        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          Question {index + 1}
                        </h3>
                        <span className={`px-2 py-1 rounded text-sm font-medium ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>
                      
                      <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {question.questionText}
                      </p>
                      
                      <div className="space-y-2">
                        {question.options?.map((option, optionIndex) => (
                          <div 
                            key={optionIndex}
                            className={`p-2 rounded ${
                              optionIndex === question.correctAnswer
                                ? 'bg-green-100 text-green-800 font-medium'
                                : optionIndex === userAnswer?.selectedOption && !isCorrect
                                ? 'bg-red-100 text-red-800'
                                : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}
                          >
                            <span className="mr-2">
                              {optionIndex === question.correctAnswer && '✓'}
                              {optionIndex === userAnswer?.selectedOption && optionIndex !== question.correctAnswer && '✗'}
                            </span>
                            {option}
                          </div>
                        ))}
                      </div>
                      
                      {question.explanation && (
                        <div className={`mt-3 p-3 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                          <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                            Explanation:
                          </h4>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/quiz')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors
                      ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
          >
            Browse More Quizzes
          </button>
          
          <button
            onClick={retakeQuiz}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Retake Quiz
          </button>
          
          <button
            onClick={() => navigate('/leaderboard')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            View Leaderboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuizResults
