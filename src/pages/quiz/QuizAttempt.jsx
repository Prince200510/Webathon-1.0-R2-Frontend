import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { api } from '../../utils/api'

function QuizAttempt() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { isDarkMode } = useTheme()
  
  const [quiz, setQuiz] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [quizStarted, setQuizStarted] = useState(false)

  useEffect(() => {
    fetchQuiz()
  }, [id])

  useEffect(() => {
    if (quizStarted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitQuiz()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      
      return () => clearInterval(timer)
    }
  }, [quizStarted, timeRemaining])

  const fetchQuiz = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/quizzes/${id}`)
      setQuiz(response.data.quiz || response.data)
      setTimeRemaining((response.data.quiz?.timeLimit || response.data.timeLimit || 30) * 60) 
    } catch (error) {
      console.error('Error fetching quiz:', error)
      setError('Failed to load quiz')
    } finally {
      setLoading(false)
    }
  }

  const startQuiz = () => {
    setQuizStarted(true)
  }

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }))
  }

  const goToNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const goToQuestion = (questionIndex) => {
    setCurrentQuestion(questionIndex)
  }

  const handleSubmitQuiz = async () => {
    try {
      setSubmitting(true)
      
      const attemptData = {
        quizId: id,
        answers: Object.entries(answers).map(([questionIndex, answerIndex]) => ({
          questionIndex: parseInt(questionIndex),
          selectedOption: answerIndex
        })),
        timeSpent: (quiz.timeLimit * 60) - timeRemaining
      }

      const response = await api.post(`/quizzes/${quiz._id}/attempt`, attemptData)
      navigate('/quiz/results', { 
        state: { 
          attemptId: response.data._id,
          score: response.data.score,
          totalQuestions: quiz.questions.length
        }
      })
      
    } catch (error) {
      console.error('Error submitting quiz:', error)
      setError('Failed to submit quiz')
    } finally {
      setSubmitting(false)
    }
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getProgressPercentage = () => {
    return ((currentQuestion + 1) / quiz.questions.length) * 100
  }

  const getAnsweredCount = () => {
    return Object.keys(answers).length
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
            {error || 'Quiz not found'}
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

  if (!quizStarted) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
        <div className="max-w-2xl mx-auto px-4">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8`}>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
              {quiz.title}
            </h1>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between">
                <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Questions:
                </span>
                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {quiz.questions.length}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Time Limit:
                </span>
                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {quiz.timeLimit} minutes
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Subject:
                </span>
                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {quiz.subject}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Difficulty:
                </span>
                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} capitalize`}>
                  {quiz.difficulty}
                </span>
              </div>
            </div>

            <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'} p-4 rounded-lg mb-8`}>
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                Instructions:
              </h3>
              <ul className={`list-disc list-inside space-y-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <li>Read each question carefully before selecting an answer</li>
                <li>You can navigate between questions using the navigation buttons</li>
                <li>Make sure to answer all questions before submitting</li>
                <li>The quiz will auto-submit when time runs out</li>
                <li>Once submitted, you cannot change your answers</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => navigate('/quiz')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors
                          ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
              >
                Cancel
              </button>
              <button
                onClick={startQuiz}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentQ = quiz.questions[currentQuestion]

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-b border-gray-200 dark:border-gray-700 px-6 py-4`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {quiz.title}
            </h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Question {currentQuestion + 1} of {quiz.questions.length}
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className={`text-lg font-mono ${timeRemaining <= 300 ? 'text-red-600' : isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {formatTime(timeRemaining)}
            </div>
            
            <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Answered: {getAnsweredCount()}/{quiz.questions.length}
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-4">
          <div className={`w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-8`}>
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                {currentQ.questionText}
              </h2>
              
              <div className="space-y-4">
                {currentQ.options.map((option, index) => (
                  <label
                    key={index}
                    className={`block p-4 rounded-lg border-2 cursor-pointer transition-all
                              ${answers[currentQuestion] === index
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : `border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 
                                   ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`
                              }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name={`question-${currentQuestion}`}
                        value={index}
                        checked={answers[currentQuestion] === index}
                        onChange={() => handleAnswerSelect(currentQuestion, index)}
                        className="mr-3 text-blue-600"
                      />
                      <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {option}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex justify-between mt-8">
                <button
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestion === 0}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                            ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                >
                  Previous
                </button>
                
                <div className="flex gap-3">
                  {currentQuestion === quiz.questions.length - 1 ? (
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={submitting}
                      className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                    >
                      {submitting ? 'Submitting...' : 'Submit Quiz'}
                    </button>
                  ) : (
                    <button
                      onClick={goToNextQuestion}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 sticky top-8`}>
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                Question Navigator
              </h3>
              
              <div className="grid grid-cols-5 gap-2">
                {quiz.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToQuestion(index)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors
                              ${currentQuestion === index
                                ? 'bg-blue-600 text-white'
                                : answers[index] !== undefined
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                  : `${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
                              }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              
              <div className="mt-6 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-600 rounded"></div>
                  <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Current</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 rounded"></div>
                  <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded`}></div>
                  <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Not answered</span>
                </div>
              </div>
              
              <button
                onClick={handleSubmitQuiz}
                disabled={submitting}
                className="w-full mt-6 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuizAttempt
