import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { api } from '../../utils/api'

function SessionDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { isDarkMode } = useTheme()
  
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchSessionDetails()
  }, [id])

  const fetchSessionDetails = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/sessions/${id}`)
      setSession(response.data)
    } catch (error) {
      console.error('Error fetching session:', error)
      setError('Failed to load session details')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdating(true)
      await api.patch(`/sessions/${id}`, { status: newStatus })
      setSession(prev => ({ ...prev, status: newStatus }))
    } catch (error) {
      console.error('Error updating session:', error)
      setError('Failed to update session status')
    } finally {
      setUpdating(false)
    }
  }

  const handleJoinSession = () => {
    navigate(`/session-room/${session._id}`)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const canJoinSession = () => {
    if (!session || session.status !== 'confirmed') return false
    
    const sessionTime = new Date(session.scheduledAt)
    const now = new Date()
    const timeDiff = sessionTime.getTime() - now.getTime()
    return timeDiff <= 15 * 60 * 1000 && timeDiff >= -(session.duration * 60 * 1000)
  }

  const canUpdateStatus = () => {
    if (!session || !user) return false
    if (user._id === session.mentorId?._id && session.status === 'pending') {
      return true
    }
    if (session.status === 'confirmed' && 
        (user._id === session.mentorId?._id || user._id === session.studentId?._id)) {
      return true
    }
    
    return false
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
            {error || 'Session not found'}
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className={`mb-6 flex items-center ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 mb-8`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                {session.subject}
              </h1>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(session.status)}`}>
                {session.status ? session.status.charAt(0).toUpperCase() + session.status.slice(1) : 'Unknown'}
              </span>
            </div>
            
            {canJoinSession() && (
              <button
                onClick={handleJoinSession}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Join Session
              </button>
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                Mentor
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-lg font-bold text-white">
                    {session.mentor?.profile?.firstName?.charAt(0)?.toUpperCase() || 'M'}
                  </span>
                </div>
                <div>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {session.mentor?.profile ? `${session.mentor.profile.firstName || ''} ${session.mentor.profile.lastName || ''}`.trim() : 'Unknown Mentor'}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {session.mentor?.email || ''}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                Student
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center">
                  <span className="text-lg font-bold text-white">
                    {session.student?.profile?.firstName?.charAt(0)?.toUpperCase() || 'S'}
                  </span>
                </div>
                <div>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {session.student?.profile ? `${session.student.profile.firstName || ''} ${session.student.profile.lastName || ''}`.trim() : 'Unknown Student'}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {session.student?.email || ''}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {canUpdateStatus() && (
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              {session.status === 'pending' && user._id === session.mentor?._id && (
                <>
                  <button
                    onClick={() => handleStatusUpdate('confirmed')}
                    disabled={updating}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    Confirm Session
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('cancelled')}
                    disabled={updating}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    Cancel Session
                  </button>
                </>
              )}
              
              {session.status === 'confirmed' && (
                <button
                  onClick={() => handleStatusUpdate('cancelled')}
                  disabled={updating}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  Cancel Session
                </button>
              )}
            </div>
          )}
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              Session Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Scheduled Date & Time
                </label>
                <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {session.scheduledDate ? new Date(session.scheduledDate).toLocaleDateString() : 'Not scheduled'} 
                  {session.startTime && session.endTime ? ` at ${session.startTime} - ${session.endTime}` : ''}
                </p>
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Duration
                </label>
                <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {session.duration || '60'} minutes
                </p>
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Session Type
                </label>
                <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'} capitalize`}>
                  {session.sessionType || 'regular'}
                </p>
              </div>
              
              {session.description && (
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Description
                  </label>
                  <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {session.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              Session Timeline
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-500 mt-2"></div>
                <div>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Session Requested
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {new Date(session.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              
              {session.status !== 'pending' && (
                <div className="flex items-start gap-3">
                  <div className={`w-3 h-3 rounded-full mt-2 ${
                    session.status === 'confirmed' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Session {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {new Date(session.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
              
              {session.status === 'confirmed' && new Date(session.scheduledAt) > new Date() && (
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-gray-300 mt-2"></div>
                  <div>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Session Scheduled
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {new Date(session.scheduledAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SessionDetails
