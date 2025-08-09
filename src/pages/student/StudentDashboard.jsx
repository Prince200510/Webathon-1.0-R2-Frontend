import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { userAPI, sessionAPI, quizAPI } from '../../utils/apiClient'
import Layout from '../../components/layout/Layout'
import { BookOpen,  Users,  Trophy,  Calendar,  Clock,  Star, TrendingUp, Award, PlayCircle, MessageCircle, AlertCircle, CheckCircle, Compass, Headphones} from 'lucide-react'
import { formatDate, formatTime, getBadgeColor, getStatusColor } from '../../utils/helpers'

const StudentDashboard = () => {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      const response = await userAPI.getDashboard()
      setDashboardData(response.data)
    } catch (error) {
      console.error('Failed to load dashboard:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSOSRequest = async () => {
    try {
      const subject = prompt('What subject do you need help with?')
      if (subject) {
        const message = prompt('Please describe your specific problem or question:')
        if (message) {
          await sessionAPI.sosRequest({ subject, message })
          alert('SOS request submitted successfully! Admin team has been notified and will assign a mentor shortly.')
          loadDashboard()
        }
      }
    } catch (error) {
      console.error('SOS request failed:', error)
      alert('Failed to submit SOS request. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="loading-spinner"></div>
        </div>
      </Layout>
    )
  }

  const { upcomingSessions = [], recentQuizzes = [], stats = {} } = dashboardData || {}

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">
              Welcome back, {user?.profile?.firstName}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Ready to continue your learning journey?
            </p>
          </div>
          <button
            onClick={handleSOSRequest}
            className="mt-4 sm:mt-0 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium flex items-center"
          >
            <AlertCircle className="h-4 w-4 mr-2" />
            SOS Help
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Points</p>
                <p className="text-2xl font-bold text-light-text dark:text-dark-text">
                  {user?.gamification?.points || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(user?.gamification?.badge)}`}>
                {user?.gamification?.badge?.toUpperCase() || 'BRONZE'}
              </span>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Sessions Completed</p>
                <p className="text-2xl font-bold text-light-text dark:text-dark-text">
                  {stats.totalSessions || 0}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Average Quiz Score</p>
                <p className="text-2xl font-bold text-light-text dark:text-dark-text">
                  {Math.round(stats.averageQuizScore || 0)}%
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">College Rank</p>
                <p className="text-2xl font-bold text-light-text dark:text-dark-text">
                  #{stats.collegeRank || '--'}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Trophy className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-500 text-white rounded-lg mr-4">
                <Compass className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">AI Career Pathway</h3>
                <p className="text-blue-700 dark:text-blue-300 text-sm">Discover your ideal career path</p>
              </div>
            </div>
            <p className="text-blue-800 dark:text-blue-200 text-sm mb-4">
              Get personalized career recommendations based on your skills, interests, and academic performance using advanced AI analysis.
            </p>
            <Link to="/career-pathway" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium">
              Explore Career Paths
              <TrendingUp className="h-4 w-4 ml-2" />
            </Link>
          </div>

          <div className="card p-6 bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-500 text-white rounded-lg mr-4">
                <Headphones className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">VR Interview Prep</h3>
                <p className="text-purple-700 dark:text-purple-300 text-sm">Practice with realistic scenarios</p>
              </div>
            </div>
            <p className="text-purple-800 dark:text-purple-200 text-sm mb-4">
              Experience immersive interview simulations with AI-powered feedback to boost your confidence and performance.
            </p>
            <Link to="/vr-interview" className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 font-medium">
              Start VR Session
              <PlayCircle className="h-4 w-4 ml-2" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="card p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-light-text dark:text-dark-text">
                  Upcoming Sessions
                </h2>
                <Link to="/mentors" className="text-light-primary dark:text-dark-primary hover:underline text-sm">
                  Book New Session
                </Link>
              </div>

              {upcomingSessions.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4">No upcoming sessions</p>
                  <Link to="/mentors" className="btn-primary">
                    Find a Mentor
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div key={session._id} className="border border-light-border dark:border-dark-border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-light-primary to-light-accent dark:from-dark-primary dark:to-dark-accent rounded-full flex items-center justify-center text-white font-semibold">
                            {session.mentor?.profile?.firstName?.[0]}
                          </div>
                          <div>
                            <h3 className="font-medium text-light-text dark:text-dark-text">
                              {session.mentor?.profile?.firstName} {session.mentor?.profile?.lastName}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {session.subject}
                            </p>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(session.scheduledDate)}
                              <Clock className="h-3 w-3 ml-2 mr-1" />
                              {formatTime(session.startTime)} - {formatTime(session.endTime)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                            {session.status}
                          </span>
                          <Link to={`/sessions/${session._id}`} className="btn-primary text-sm">
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Learning Progress moved under sessions */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
                Learning Progress
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Weekly Goal Progress</span>
                    <span className="text-sm font-medium text-light-text dark:text-dark-text">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full" style={{width: '75%'}}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Skill Development</span>
                    <span className="text-sm font-medium text-light-text dark:text-dark-text">68%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full" style={{width: '68%'}}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Interview Readiness</span>
                    <span className="text-sm font-medium text-light-text dark:text-dark-text">45%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full" style={{width: '45%'}}></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-light-border dark:border-dark-border">
                <h3 className="text-md font-medium text-light-text dark:text-dark-text mb-3">Recent Achievements</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    <Award className="h-3 w-3 mr-1" />
                    Quiz Master
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    <Star className="h-3 w-3 mr-1" />
                    Perfect Attendance
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Fast Learner
                  </span>
                </div>
              </div>

              {/* Study Stats moved here */}
              <div className="mt-6 pt-4 border-t border-light-border dark:border-dark-border">
                <h3 className="text-sm font-semibold text-light-text dark:text-dark-text mb-3">Today's Progress</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Study Time</span>
                    </div>
                    <span className="text-sm font-medium text-light-text dark:text-dark-text">2h 45m</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Tasks Completed</span>
                    </div>
                    <span className="text-sm font-medium text-light-text dark:text-dark-text">5/8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Points Earned</span>
                    </div>
                    <span className="text-sm font-medium text-light-text dark:text-dark-text">+120</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
                Recent Quiz Results
              </h2>
              
              {recentQuizzes.length === 0 ? (
                <div className="text-center py-4">
                  <BookOpen className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">No recent quizzes</p>
                  <Link to="/quiz" className="btn-primary text-sm">
                    Take a Quiz
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentQuizzes.map((attempt) => (
                    <div key={attempt._id} className="border border-light-border dark:border-dark-border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-sm text-light-text dark:text-dark-text">
                            {attempt.quiz?.title}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {attempt.quiz?.subject}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-light-text dark:text-dark-text">
                            {attempt.percentage}%
                          </p>
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < Math.floor(attempt.percentage / 20)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card p-6">
              <h2 className="text-lg font-semibold text-light-text dark:text-dark-text mb-6">
                Quick Actions
              </h2>
              <div className="space-y-4">
                {/* Featured Actions */}
                <div className="space-y-3">
                  <Link to="/career-pathway" className="w-full p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-all group flex items-center">
                    <div className="p-3 bg-blue-500 text-white rounded-lg mr-4 group-hover:bg-blue-600 transition-colors">
                      <Compass className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100">AI Career Pathway</h3>
                      <p className="text-sm text-blue-700 dark:text-blue-300">Discover your ideal career path with AI</p>
                    </div>
                  </Link>
                  
                  <Link to="/vr-interview" className="w-full p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 transition-all group flex items-center">
                    <div className="p-3 bg-purple-500 text-white rounded-lg mr-4 group-hover:bg-purple-600 transition-colors">
                      <Headphones className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-purple-900 dark:text-purple-100">VR Interview Prep</h3>
                      <p className="text-sm text-purple-700 dark:text-purple-300">Practice interviews in VR environment</p>
                    </div>
                  </Link>
                </div>

                {/* Compact Action Grid */}
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/sessions/my-sessions" className="p-3 border border-light-border dark:border-dark-border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group text-center">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg mx-auto mb-2 w-fit group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
                      <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-sm font-medium text-light-text dark:text-dark-text">My Sessions</span>
                  </Link>
                  
                  <Link to="/mentors" className="p-3 border border-light-border dark:border-dark-border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group text-center">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg mx-auto mb-2 w-fit group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800 transition-colors">
                      <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className="text-sm font-medium text-light-text dark:text-dark-text">Find Mentors</span>
                  </Link>
                  
                  <Link to="/quiz" className="p-3 border border-light-border dark:border-dark-border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group text-center">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg mx-auto mb-2 w-fit group-hover:bg-orange-200 dark:group-hover:bg-orange-800 transition-colors">
                      <PlayCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <span className="text-sm font-medium text-light-text dark:text-dark-text">Take Quiz</span>
                  </Link>
                  
                  <Link to="/chat" className="p-3 border border-light-border dark:border-dark-border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group text-center">
                    <div className="p-2 bg-pink-100 dark:bg-pink-900 rounded-lg mx-auto mb-2 w-fit group-hover:bg-pink-200 dark:group-hover:bg-pink-800 transition-colors">
                      <MessageCircle className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                    </div>
                    <span className="text-sm font-medium text-light-text dark:text-dark-text">Chat</span>
                  </Link>

                  <Link to="/leaderboard" className="p-3 border border-light-border dark:border-dark-border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group text-center">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg mx-auto mb-2 w-fit group-hover:bg-yellow-200 dark:group-hover:bg-yellow-800 transition-colors">
                      <Trophy className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <span className="text-sm font-medium text-light-text dark:text-dark-text">Leaderboard</span>
                  </Link>

                  <Link to="/resources" className="p-3 border border-light-border dark:border-dark-border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group text-center">
                    <div className="p-2 bg-teal-100 dark:bg-teal-900 rounded-lg mx-auto mb-2 w-fit group-hover:bg-teal-200 dark:group-hover:bg-teal-800 transition-colors">
                      <BookOpen className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                    </div>
                    <span className="text-sm font-medium text-light-text dark:text-dark-text">Resources</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default StudentDashboard;