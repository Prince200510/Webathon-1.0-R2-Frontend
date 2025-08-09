import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { api } from '../../utils/api'

function Leaderboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { isDarkMode } = useTheme()
  
  const [leaderboardData, setLeaderboardData] = useState([])
  const [userRank, setUserRank] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [timeframe, setTimeframe] = useState('all') // all, week, month
  const [subject, setSubject] = useState('all')
  const [subjects, setSubjects] = useState([])

  useEffect(() => {
    fetchLeaderboard()
    fetchSubjects()
  }, [timeframe, subject])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      setError('')
      const params = new URLSearchParams()
      if (timeframe !== 'all') params.append('timeframe', timeframe)
      if (subject !== 'all') params.append('subject', subject)
      
      // Use college leaderboard endpoint - fallback to a default college if none set
      const college = user?.profile?.college || 'General'
      console.log('Fetching leaderboard for college:', college)
      
      const response = await api.get(`/quizzes/leaderboard/${college}?${params}`)
      console.log('Leaderboard response:', response.data)
      
      setLeaderboardData(response.data.leaderboard || [])
      setUserRank(response.data.userRank || null)
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
      setError('Failed to load leaderboard. You may need to complete some quizzes first.')
      setLeaderboardData([])
      setUserRank(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/quizzes/subjects')
      setSubjects(response.data)
    } catch (error) {
      console.error('Error fetching subjects:', error)
    }
  }

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return '🏆'
      case 2:
        return '🥈'
      case 3:
        return '🥉'
      default:
        return `#${rank}`
    }
  }

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return 'text-yellow-600'
      case 2:
        return 'text-gray-500'
      case 3:
        return 'text-amber-600'
      default:
        return isDarkMode ? 'text-gray-300' : 'text-gray-700'
    }
  }

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 75) return 'text-blue-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
      <div className="max-w-6xl mx-auto px-4">
        <button
          onClick={() => navigate('/quiz')}
          className={`mb-6 flex items-center ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Quizzes
        </button>
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            🏆 Leaderboard
          </h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            See how you rank against other students
          </p>
        </div>
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 mb-8`}>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Timeframe
              </label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                          ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              >
                <option value="all">All Time</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                          ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              >
                <option value="all">All Subjects</option>
                {subjects.map((subj) => (
                  <option key={subj} value={subj}>
                    {subj}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {userRank && (
          <div className={`${isDarkMode ? 'bg-gradient-to-r from-blue-800 to-purple-800' : 'bg-gradient-to-r from-blue-500 to-purple-600'} rounded-lg shadow-lg p-6 mb-8 text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Your Current Rank</h2>
                <p className="text-blue-100">
                  {timeframe === 'all' ? 'All Time' : timeframe === 'week' ? 'This Week' : 'This Month'} • {subject === 'all' ? 'All Subjects' : subject}
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">
                  {getRankIcon(userRank)}
                </div>
                <div className="text-2xl font-bold">
                  #{userRank}
                </div>
                <div className="text-lg">
                  {user?.gamification?.points || 0} points
                </div>
              </div>
            </div>
          </div>
        )}
        {leaderboardData.length >= 3 && (
          <div className="mb-8">
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} text-center mb-6`}>
              Top Performers
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 text-center transform md:mt-8`}>
                <div className="text-4xl mb-2">🥈</div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-gray-400 to-gray-600 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">
                    {(leaderboardData[1]?.profile?.firstName || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
                <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                  {`${leaderboardData[1]?.profile?.firstName || ''} ${leaderboardData[1]?.profile?.lastName || ''}`.trim() || 'User'}
                </h3>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                  {leaderboardData[1]?.gamification?.points || 0}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  points
                </p>
              </div>
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 text-center transform md:-mt-4 border-4 border-yellow-400`}>
                <div className="text-5xl mb-2">🏆</div>
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {(leaderboardData[0]?.profile?.firstName || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                  {`${leaderboardData[0]?.profile?.firstName || ''} ${leaderboardData[0]?.profile?.lastName || ''}`.trim() || 'User'}
                </h3>
                <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                  {leaderboardData[0]?.gamification?.points || 0}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  points
                </p>
              </div>
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 text-center transform md:mt-8`}>
                <div className="text-4xl mb-2">🥉</div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-700 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">
                    {(leaderboardData[2]?.profile?.firstName || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
                <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                  {`${leaderboardData[2]?.profile?.firstName || ''} ${leaderboardData[2]?.profile?.lastName || ''}`.trim() || 'User'}
                </h3>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                  {leaderboardData[2]?.gamification?.points || 0}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  points
                </p>
              </div>
            </div>
          </div>
        )}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden`}>
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Complete Rankings
            </h2>
          </div>

          {error ? (
            <div className="p-8 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchLeaderboard}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          ) : leaderboardData.length === 0 ? (
            <div className="p-8 text-center">
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
                No quiz data available for the selected filters.
              </p>
              <button
                onClick={() => navigate('/quiz')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Take Your First Quiz
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {leaderboardData.map((entry, index) => (
                <div 
                  key={entry._id} 
                  className={`p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
                            ${entry._id === user?._id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`text-2xl font-bold ${getRankColor(index + 1)} min-w-[3rem]`}>
                      {getRankIcon(index + 1)}
                    </div>
                    
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-lg font-bold text-white">
                        {(entry.profile?.firstName || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {`${entry.profile?.firstName || ''} ${entry.profile?.lastName || ''}`.trim() || 'Unknown User'}
                        {entry._id === user?._id && (
                          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            You
                          </span>
                        )}
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Points: {entry.gamification?.points || 0}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {entry.gamification?.points || 0}
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Quiz Points: {entry.gamification?.quizPoints || 0}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/quiz')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium mr-4"
          >
            Take a Quiz
          </button>
          
          <button
            onClick={() => navigate('/student')}
            className={`px-8 py-3 rounded-lg font-medium transition-colors
                      ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default Leaderboard
