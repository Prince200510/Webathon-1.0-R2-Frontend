import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { api } from '../../utils/api'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt'
import { ArrowLeft,  Users,  Clock,  BookOpen, Phone, PhoneOff, Mic, MicOff, Video, VideoOff, Sun, Moon, MessageCircle, Share, Settings} from 'lucide-react'

function SessionRoom() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme() 
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [zegoInstance, setZegoInstance] = useState(null)
  const [isCallStarted, setIsCallStarted] = useState(false)
  const [sessionStarted, setSessionStarted] = useState(false)
  const [sessionEnded, setSessionEnded] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [chatVisible, setChatVisible] = useState(false)
  const [chatMessages, setChatMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    if (sessionId) {
      fetchSessionDetails()
    }
  }, [sessionId])

  useEffect(() => {
    if (session && sessionStarted) {
      const timer = setInterval(() => {
        const now = new Date()
        const sessionDate = new Date(session.scheduledDate)
        const [startHour, startMinute] = session.startTime.split(':')
        const [endHour, endMinute] = session.endTime.split(':')
        
        const endTime = new Date(sessionDate)
        endTime.setHours(parseInt(endHour), parseInt(endMinute))
        
        const remaining = Math.max(0, endTime.getTime() - now.getTime())
        setTimeRemaining(remaining)
        
        if (remaining === 0) {
          setSessionEnded(true)
          clearInterval(timer)
        }
      }, 1000)
      
      return () => clearInterval(timer)
    }
  }, [session, sessionStarted])

  const fetchSessionDetails = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/sessions/${sessionId}`)
      setSession(response.data)
      if (response.data.status === 'accepted') {
        await api.put(`/sessions/${sessionId}/start`)
        setSessionStarted(true)
      } else if (response.data.status === 'in_progress') {
        setSessionStarted(true)
      }
    } catch (error) {
      console.error('Error fetching session:', error)
      setError('Failed to load session details')
    } finally {
      setLoading(false)
    }
  }

  const initializeZegoCall = () => {
    if (!session || !session.roomID) return
    const appID = parseInt(process.env.REACT_APP_ZEGO_APP_ID || '1484647939')
    const serverSecret = process.env.REACT_APP_ZEGO_SERVER_SECRET || 'your_server_secret'
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      session.roomID,
      user._id,
      user.profile?.firstName + ' ' + user.profile?.lastName || user.email
    )

    const zp = ZegoUIKitPrebuilt.create(kitToken)
    setZegoInstance(zp)
    zp.joinRoom({
      container: document.getElementById('zego-container'),
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall, 
      },
      turnOnMicrophoneWhenJoining: true,
      turnOnCameraWhenJoining: true,
      showMyCameraToggleButton: true,
      showMyMicrophoneToggleButton: true,
      showAudioVideoSettingsButton: true,
      showScreenSharingButton: true,
      showTextChat: false, 
      showUserList: false,
      maxUsers: 2,
      layout: "Auto",
      showLayoutButton: false,
      
      onJoinRoom: () => {
        console.log('Joined room successfully')
        setIsCallStarted(true)
      },
      
      onLeaveRoom: () => {
        console.log('Left room')
        setIsCallStarted(false)
        navigate('/sessions/my-sessions')
      },
      
      onUserJoin: (users) => {
        console.log('User joined:', users)
      },
      
      onUserLeave: (users) => {
        console.log('User left:', users)
      }
    })
  }

  const handleLeaveCall = () => {
    if (zegoInstance) {
      zegoInstance.destroy()
    }
    navigate('/sessions/my-sessions')
  }

  const handleCompleteSession = async () => {
    try {
      if (user.role === 'mentor') {
        const notes = prompt('Please enter session notes:')
        if (notes) {
          await api.put(`/sessions/${sessionId}/complete`, {
            sessionNotes: notes
          })
        }
      }
      handleLeaveCall()
    } catch (error) {
      console.error('Error completing session:', error)
    }
  }

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        sender: user.profile?.firstName + ' ' + user.profile?.lastName || user.email,
        message: newMessage,
        timestamp: new Date(),
        userId: user._id
      }
      setChatMessages(prev => [...prev, message])
      setNewMessage('')
    }
  }

  const formatTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / (1000 * 60))
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/sessions/my-sessions')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (sessionEnded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-600 mb-4">Session Completed</h2>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
            Thank you for participating in the session!
          </p>
          <button
            onClick={() => navigate('/sessions/my-sessions')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Sessions
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-all duration-300`}>
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-6 py-4 shadow-sm`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={handleLeaveCall}
              className={`mr-4 p-2 rounded-lg transition-all duration-200 ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div>
              <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {session?.subject} Session
              </h1>
              <div className="flex items-center space-x-4 text-sm">
                <div className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <Users className="w-4 h-4 mr-1" />
                  <span>
                    {user.role === 'student' 
                      ? `with ${session?.mentor?.profile?.firstName} ${session?.mentor?.profile?.lastName}`
                      : `with ${session?.student?.profile?.firstName} ${session?.student?.profile?.lastName}`
                    }
                  </span>
                </div>
                <div className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{session?.startTime} - {session?.endTime}</span>
                </div>
                <div className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <BookOpen className="w-4 h-4 mr-1" />
                  <span>{session?.subject}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {sessionStarted && (
              <div className={`px-3 py-1 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <span className={`text-lg font-mono ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
              session?.status === 'in_progress' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400' 
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400'
            }`}>
              {session?.status === 'in_progress' ? '🔴 Live' : '⏳ Starting...'}
            </div>
            <button
              onClick={() => setChatVisible(!chatVisible)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                chatVisible
                  ? 'bg-blue-600 text-white' 
                  : isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              <MessageCircle className="w-5 h-5" />
            </button>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {user.role === 'mentor' && session?.status === 'in_progress' && (
              <button
                onClick={handleCompleteSession}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-200 font-semibold"
              >
                Complete Session
              </button>
            )}
            <button
              onClick={handleLeaveCall}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-200 font-semibold flex items-center"
            >
              <PhoneOff className="w-4 h-4 mr-2" />
              Leave
            </button>
          </div>
        </div>
      </div>
      {session?.sessionNotes && (
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-200'} border-b px-6 py-3`}>
          <div className="flex items-center">
            <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
            <span className={`text-sm font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-800'}`}>
              Session Notes:
            </span>
            <span className={`text-sm ml-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {session.sessionNotes}
            </span>
          </div>
        </div>
      )}

      <div className="flex h-[calc(100vh-140px)]">
        <div className={`flex-1 ${chatVisible ? 'pr-80' : ''} relative`}>
          {!isCallStarted ? (
            <div className="h-full flex items-center justify-center">
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl p-8 text-center max-w-md mx-4`}>
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Video className="w-10 h-10 text-white" />
                </div>
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                  Ready to Start?
                </h3>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                  Click the button below to join the video session
                </p>
                <button
                  onClick={initializeZegoCall}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold flex items-center justify-center mx-auto"
                >
                  <Video className="w-5 h-5 mr-2" />
                  Join Video Call
                </button>
              </div>
            </div>
          ) : (
            <div 
              id="zego-container" 
              className="w-full h-full"
              style={{ 
                background: isDarkMode ? '#1f2937' : '#f9fafb'
              }}
            />
          )}
        </div>
        {chatVisible && (
          <div className={`w-80 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-l flex flex-col`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
                <MessageCircle className="w-5 h-5 mr-2 text-blue-500" />
                Session Chat
              </h3>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {chatMessages.length === 0 ? (
                <div className="text-center">
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No messages yet. Start the conversation!
                  </p>
                </div>
              ) : (
                chatMessages.map((message) => (
                  <div key={message.id} className={`${message.userId === user._id ? 'ml-8' : 'mr-8'}`}>
                    <div className={`p-3 rounded-lg ${
                      message.userId === user._id 
                        ? 'bg-blue-600 text-white ml-auto' 
                        : isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium opacity-75">
                          {message.sender}
                        </span>
                        <span className="text-xs opacity-50">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm">{message.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className={`flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                            ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {isCallStarted && (
        <div className="fixed bottom-4 left-4 z-50">
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg px-4 py-2 shadow-lg`}>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
              <span className={`text-sm font-medium ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                Connected
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SessionRoom
