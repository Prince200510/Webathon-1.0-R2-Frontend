import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { api } from '../../utils/api'
import { ArrowLeft,  Video,  Clock,  Calendar,  BookOpen,  Star, Sun, Moon, CheckCircle, Mail, Phone, CreditCard, AlertCircle, Shield, Timer} from 'lucide-react'

function BookSession() {
  const { mentorId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()
  
  const [mentor, setMentor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  
  const [formData, setFormData] = useState({
    subject: '',
    sessionNotes: '',
    scheduledDate: '',
    startTime: '',
    endTime: ''
  })

  const [paymentStep, setPaymentStep] = useState(null) 
  const [paymentId, setPaymentId] = useState('')
  const [showReceipt, setShowReceipt] = useState(false)
  const [receiptData, setReceiptData] = useState(null)

  useEffect(() => {
    if (mentorId) {
      fetchMentorDetails()
    }
  }, [mentorId])

  const fetchMentorDetails = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/mentors/${mentorId}`)
      setMentor(response.data)
    } catch (error) {
      console.error('Error fetching mentor:', error)
      setError('Failed to load mentor details')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    if (name === 'startTime') {
      const start = new Date(`2000-01-01T${value}:00`)
      const end = new Date(start.getTime() + 60 * 60 * 1000)
      const endTimeString = end.toTimeString().slice(0, 5)
      
      setFormData(prev => ({
        ...prev,
        [name]: value,
        endTime: endTimeString
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const validateTime = (startTime) => {
    const start = parseInt(startTime.split(':')[0])
    return start >= 9 && start < 21 
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.subject || !formData.scheduledDate || !formData.startTime) {
      setError('Please fill in all required fields')
      return
    }

    if (!validateTime(formData.startTime)) {
      setError('Sessions can only be booked between 9 AM and 9 PM')
      return
    }
    setPaymentStep('payment')
    setError('')
  }

  const handlePaymentComplete = () => {
    setPaymentStep('id-entry')
  }

  const handlePaymentIdSubmit = async () => {
    if (!paymentId.trim()) {
      setError('Please enter the payment ID')
      return
    }

    try {
      setPaymentStep('processing')
      setError('')
      
      const requestData = {
        mentorId,
        subject: formData.subject,
        scheduledDate: formData.scheduledDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        sessionNotes: formData.sessionNotes,
        paymentId: paymentId,
        paymentMethod: 'razorpay_link',
        paymentAmount: 100  
      }
      
      console.log('Sending booking request:', requestData)
      const response = await api.post('/sessions/book', requestData)
      const receipt = {
        sessionId: response.data.sessionId,
        paymentId: paymentId,
        amount: '₹1.00',
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        studentName: user.profile?.firstName + ' ' + user.profile?.lastName,
        mentorName: mentor.profile?.firstName + ' ' + mentor.profile?.lastName,
        subject: formData.subject,
        sessionDate: formData.scheduledDate,
        sessionTime: formData.startTime + ' - ' + formData.endTime
      }

      setReceiptData(receipt)
      setShowReceipt(true)
      setSuccess('🎉 Session booked successfully! Receipt generated and notifications sent.')
      
    } catch (bookingError) {
      console.error('Booking error details:', bookingError.response?.data || bookingError.message)
      setError(`Failed to book session: ${bookingError.response?.data?.message || 'Please check your payment ID and try again.'}`)
      console.error('Booking error:', bookingError)
      setPaymentStep('id-entry')
    }
  }

  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'} py-8 transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Back Button and Theme Toggle */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
              isDarkMode 
                ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-medium">Back</span>
          </button>
          
          <button
            onClick={toggleTheme}
            className={`p-3 rounded-full transition-all duration-200 ${
              isDarkMode 
                ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
                : 'bg-white hover:bg-gray-50 text-gray-600 shadow-lg'
            }`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Enhanced Mentor Info */}
          {mentor && (
            <div className={`lg:col-span-1 ${isDarkMode ? 'bg-gray-800/80 backdrop-blur-lg border border-gray-700/50' : 'bg-white/80 backdrop-blur-lg border border-gray-200/50'} rounded-2xl shadow-2xl p-6 h-fit transition-all duration-300 hover:shadow-3xl`}>
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6 flex items-center`}>
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mr-3">
                  <Video className="w-5 h-5 text-white" />
                </div>
                Session with
              </h2>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  {mentor.profile?.profilePicture ? (
                    <img 
                      src={mentor.profile.profilePicture} 
                      alt={mentor.profile.firstName}
                      className="w-20 h-20 rounded-xl object-cover shadow-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg">
                      <span className="text-2xl font-bold text-white">
                        {mentor.profile?.firstName?.charAt(0)?.toUpperCase() || 'M'}
                      </span>
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1 rounded-full">
                    <CheckCircle className="w-3 h-3" />
                  </div>
                </div>
                <div>
                  <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {mentor.profile?.firstName} {mentor.profile?.lastName}
                  </h3>
                  <div className="flex items-center mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < (mentor.mentorDetails?.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      ({mentor.mentorDetails?.totalRatings || 0})
                    </span>
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    ₹{mentor.mentorDetails?.hourlyRate || 500}/hour
                  </p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className={`flex items-center p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <Mail className="w-4 h-4 mr-3 text-blue-500" />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {mentor.email}
                  </span>
                </div>
                {mentor.profile?.phone && (
                  <div className={`flex items-center p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <Phone className="w-4 h-4 mr-3 text-green-500" />
                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {mentor.profile.phone}
                    </span>
                  </div>
                )}
              </div>

              {/* Subjects */}
              {mentor.mentorDetails?.teachingSubjects && mentor.mentorDetails.teachingSubjects.length > 0 && (
                <div className="mb-6">
                  <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3 flex items-center`}>
                    <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
                    Teaching Subjects
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {mentor.mentorDetails.teachingSubjects.map((subject, index) => (
                      <span
                        key={index}
                        className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 dark:from-blue-900/50 dark:to-purple-900/50 dark:text-blue-200 px-3 py-1 rounded-lg text-xs font-semibold"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Time Restriction Notice */}
              <div className={`p-4 rounded-lg border-l-4 border-yellow-500 ${isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'} mb-6`}>
                <div className="flex items-center">
                  <Timer className="w-5 h-5 text-yellow-500 mr-2" />
                  <span className={`text-sm font-semibold ${isDarkMode ? 'text-yellow-400' : 'text-yellow-800'}`}>
                    Booking Hours
                  </span>
                </div>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                  Sessions can only be booked between 9:00 AM and 9:00 PM
                </p>
              </div>

              {/* Payment Info */}
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-green-900/20 border border-green-700/50' : 'bg-green-50 border border-green-200'}`}>
                <div className="flex items-center mb-2">
                  <Shield className="w-5 h-5 text-green-500 mr-2" />
                  <span className={`text-sm font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-800'}`}>
                    Quick Payment Link
                  </span>
                </div>
                <p className={`text-sm ${isDarkMode ? 'text-green-300' : 'text-green-700'} mb-2`}>
                  Pay only ₹1 via Razorpay link
                </p>
                <p className={`text-xs ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                  Payment link: razorpay.me/@edtech1
                </p>
              </div>
            </div>
          )}

          {/* Enhanced Booking Form */}
          <div className={`lg:col-span-2 ${isDarkMode ? 'bg-gray-800/80 backdrop-blur-lg border border-gray-700/50' : 'bg-white/80 backdrop-blur-lg border border-gray-200/50'} rounded-2xl shadow-2xl p-8 transition-all duration-300 hover:shadow-3xl`}>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-8 flex items-center`}>
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl mr-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              Book a Session
            </h1>

            {error && (
              <div className="bg-gradient-to-r from-red-100 to-pink-100 border border-red-300 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-center">
                <AlertCircle className="w-5 h-5 mr-3" />
                {error}
              </div>
            )}

            {success && (
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300 text-green-700 px-6 py-4 rounded-xl mb-6 flex items-center">
                <CheckCircle className="w-5 h-5 mr-3" />
                {success}
              </div>
            )}

            {paymentProcessing && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-8 max-w-md mx-4 text-center`}>
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-8 h-8 text-white" />
                  </div>
                  <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                    Complete Payment
                  </h3>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                    A new tab has opened with the Razorpay payment link. Please complete the ₹1 payment and then return to this page.
                  </p>
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-900/20 border border-blue-700/50' : 'bg-blue-50 border border-blue-200'} mb-6`}>
                    <p className={`text-sm font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-800'}`}>
                      Payment Link: razorpay.me/@edtech1
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                      Amount: ₹1
                    </p>
                  </div>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
                    Waiting for payment confirmation...
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Subject Dropdown */}
              <div>
                <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                  Subject *
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200
                            ${isDarkMode ? 'bg-gray-700/50 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  required
                >
                  <option value="">Select a subject</option>
                  {mentor?.mentorDetails?.teachingSubjects?.map((subject, index) => (
                    <option key={index} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              {/* Session Notes */}
              <div>
                <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                  Session Notes
                </label>
                <textarea
                  name="sessionNotes"
                  value={formData.sessionNotes}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200
                            ${isDarkMode ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                  placeholder="Describe what you'd like to cover in this session..."
                />
              </div>

              {/* Date and Time */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                    Date *
                  </label>
                  <input
                    type="date"
                    name="scheduledDate"
                    value={formData.scheduledDate}
                    onChange={handleInputChange}
                    min={getMinDate()}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200
                              ${isDarkMode ? 'bg-gray-700/50 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                    Start Time * (9 AM - 9 PM only)
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    min="09:00"
                    max="21:00"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200
                              ${isDarkMode ? 'bg-gray-700/50 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    required
                  />
                </div>
              </div>

              {/* Duration Display */}
              {formData.startTime && (
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-900/20 border border-blue-700/50' : 'bg-blue-50 border border-blue-200'}`}>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-blue-500 mr-2" />
                    <span className={`text-sm font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-800'}`}>
                      Session Duration: 1 hour
                    </span>
                  </div>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                    {formData.startTime} - {formData.endTime}
                  </p>
                </div>
              )}

              {/* Enhanced Submit Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg
                            ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || paymentStep}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center"
                >
                  {paymentStep ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Book Session
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Payment Modal */}
        {paymentStep === 'payment' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`max-w-md w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-2xl`}>
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                Complete Payment
              </h3>
              
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-900/20 border border-blue-700/50' : 'bg-blue-50 border border-blue-200'} mb-6`}>
                <p className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-700'} mb-3`}>
                  Please click the link below to pay ₹1 for your session:
                </p>
                <a 
                  href="https://razorpay.me/@edtech1/100"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay ₹1 on Razorpay
                </a>
              </div>

              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                After completing the payment, copy the Payment ID from Razorpay and click "Payment Done" below.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setPaymentStep(null)}
                  className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePaymentComplete}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Payment Done - Enter ID
                </button>
              </div>
            </div>
          </div>
        )}
        {paymentStep === 'id-entry' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`max-w-md w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-2xl`}>
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                Enter Payment ID
              </h3>
              
              <div className="mb-6">
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Payment ID from Razorpay *
                </label>
                <input
                  type="text"
                  value={paymentId}
                  onChange={(e) => setPaymentId(e.target.value)}
                  placeholder="e.g., pay_xxxxxxxxxxxxx"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                            ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
                />
                <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  You can find this in your payment confirmation message or email from Razorpay
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setPaymentStep('payment')}
                  className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                >
                  Back
                </button>
                <button
                  onClick={handlePaymentIdSubmit}
                  disabled={!paymentId.trim() || paymentStep === 'processing'}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {paymentStep === 'processing' ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    'Submit & Book Session'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
        {showReceipt && receiptData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`max-w-lg w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-2xl`}>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Payment Successful!
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
                  Your session has been booked successfully
                </p>
              </div>
              <div className={`border rounded-lg p-4 mb-6 ${isDarkMode ? 'border-gray-600 bg-gray-700/50' : 'border-gray-200 bg-gray-50'}`}>
                <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                  Receipt Details
                </h4>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Session ID:</span>
                    <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>{receiptData.sessionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Payment ID:</span>
                    <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>{receiptData.paymentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Amount:</span>
                    <span className="font-semibold text-green-600">{receiptData.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Date & Time:</span>
                    <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>{receiptData.date} {receiptData.time}</span>
                  </div>
                  <hr className={`my-3 ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`} />
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Student:</span>
                    <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>{receiptData.studentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Mentor:</span>
                    <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>{receiptData.mentorName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Subject:</span>
                    <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>{receiptData.subject}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Session Date:</span>
                    <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>{receiptData.sessionDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Session Time:</span>
                    <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>{receiptData.sessionTime}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => window.print()}
                  className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                >
                  Print Receipt
                </button>
                <button
                  onClick={() => navigate('/sessions/my-sessions')}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View My Sessions
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookSession
