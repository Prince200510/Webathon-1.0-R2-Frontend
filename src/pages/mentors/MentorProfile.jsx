import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { api } from '../../utils/api'
import { ArrowLeft,  Star,  MapPin,  Calendar,  GraduationCap,  Building,  BookOpen,  Award,  Clock,  Mail,  Phone, Sun, Moon, Video, MessageCircle, CheckCircle} from 'lucide-react'

function MentorProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()
  const [mentor, setMentor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMentorProfile()
  }, [id])

  const fetchMentorProfile = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/mentors/${id}`)
      setMentor(response.data)
    } catch (error) {
      console.error('Error fetching mentor profile:', error)
      setError('Failed to load mentor profile')
    } finally {
      setLoading(false)
    }
  }

  const handleBookSession = () => {
    navigate(`/book-session/${mentor._id}`)
  }

  const handleSendMessage = () => {
    navigate(`/chat?mentorId=${mentor._id}`)
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !mentor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
            {error || 'Mentor not found'}
          </p>
          <button
            onClick={() => navigate('/mentors')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Mentor Search
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'} py-8 transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate('/mentors')}
            className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
              isDarkMode 
                ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-medium">Back to Mentors</span>
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

        <div className={`${isDarkMode ? 'bg-gray-800/80 backdrop-blur-lg border border-gray-700/50' : 'bg-white/80 backdrop-blur-lg border border-gray-200/50'} rounded-2xl shadow-2xl p-8 mb-8 transition-all duration-300`}>
          <div className="flex flex-col xl:flex-row items-start xl:items-center gap-8">
            <div className="relative">
              <div className="w-36 h-36 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-2xl">
                <span className="text-5xl font-bold text-white">
                  {mentor.name?.charAt(0)?.toUpperCase() || 'M'}
                </span>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-full shadow-lg">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
            
            <div className="flex-1 space-y-6">
              <div>
                <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                  {mentor.name}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 mb-4">
                  <div className="flex items-center">
                    {renderStars(mentor.averageRating)}
                    <span className={`ml-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      ({mentor.totalReviews} reviews)
                    </span>
                  </div>
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Available
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 text-sm">
                  <div className={`flex items-center p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <Mail className="w-4 h-4 mr-3 text-blue-500" />
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {mentor.email}
                    </span>
                  </div>
                  {mentor.mentorDetails?.phoneNumber && (
                    <div className={`flex items-center p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                      <Phone className="w-4 h-4 mr-3 text-green-500" />
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                        {mentor.mentorDetails.phoneNumber}
                      </span>
                    </div>
                  )}
                  <div className={`flex items-center p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <Building className="w-4 h-4 mr-3 text-purple-500" />
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {mentor.workExperience?.yearsOfExperience || 0} years exp.
                    </span>
                  </div>
                  <div className={`flex items-center p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <Clock className="w-4 h-4 mr-3 text-orange-500" />
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      ${mentor.hourlyRate}/hour
                    </span>
                  </div>
                </div>
              </div>

              {mentor.bio && (
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/30' : 'bg-blue-50'}`}>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed text-lg`}>
                    {mentor.bio}
                  </p>
                </div>
              )}
            </div>
            {user && user.id !== mentor._id && (
              <div className="flex flex-col gap-3 xl:flex-shrink-0">
                <button
                  onClick={handleBookSession}
                  className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <div className="flex items-center">
                    <Video className="w-5 h-5 mr-2" />
                    Book Session
                  </div>
                </button>
                <button
                  onClick={handleSendMessage}
                  className={`group relative overflow-hidden ${
                    isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  } px-8 py-4 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
                >
                  <div className="flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Send Message
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <div className={`${isDarkMode ? 'bg-gray-800/80 backdrop-blur-lg border border-gray-700/50' : 'bg-white/80 backdrop-blur-lg border border-gray-200/50'} rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl`}>
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6 flex items-center`}>
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mr-3">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                Teaching Subjects
              </h2>
              <div className="flex flex-wrap gap-3">
                {mentor.subjects?.map((subject, index) => (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 dark:from-blue-900/50 dark:to-purple-900/50 dark:text-blue-200 px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                  >
                    {subject}
                  </span>
                ))}
                {(!mentor.subjects || mentor.subjects.length === 0) && (
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} italic`}>
                    No subjects specified
                  </p>
                )}
              </div>
            </div>
            {mentor.specializations && mentor.specializations.length > 0 && (
              <div className={`${isDarkMode ? 'bg-gray-800/80 backdrop-blur-lg border border-gray-700/50' : 'bg-white/80 backdrop-blur-lg border border-gray-200/50'} rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl`}>
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6 flex items-center`}>
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mr-3">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  Specializations
                </h2>
                <div className="flex flex-wrap gap-3">
                  {mentor.specializations.map((spec, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 dark:from-purple-900/50 dark:to-pink-900/50 dark:text-purple-200 px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="lg:col-span-2 space-y-8">
            {mentor.education && (
              <div className={`${isDarkMode ? 'bg-gray-800/80 backdrop-blur-lg border border-gray-700/50' : 'bg-white/80 backdrop-blur-lg border border-gray-200/50'} rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl`}>
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6 flex items-center`}>
                  <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg mr-3">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  Education Background
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-green-50'}`}>
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2 flex items-center`}>
                      <Building className="w-4 h-4 mr-2 text-green-500" />
                      University
                    </h3>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-medium`}>
                      {mentor.education.university || 'Not specified'}
                    </p>
                  </div>
                  <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-green-50'}`}>
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2 flex items-center`}>
                      <Award className="w-4 h-4 mr-2 text-green-500" />
                      Degree
                    </h3>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-medium`}>
                      {mentor.education.degree || 'Not specified'}
                    </p>
                  </div>
                  <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-green-50'}`}>
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2 flex items-center`}>
                      <BookOpen className="w-4 h-4 mr-2 text-green-500" />
                      Field of Study
                    </h3>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-medium`}>
                      {mentor.education.fieldOfStudy || 'Not specified'}
                    </p>
                  </div>
                  <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-green-50'}`}>
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2 flex items-center`}>
                      <Calendar className="w-4 h-4 mr-2 text-green-500" />
                      Graduation Year
                    </h3>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-medium`}>
                      {mentor.education.graduationYear || 'Not specified'}
                    </p>
                  </div>
                </div>
                
                {mentor.education.additionalCertifications && mentor.education.additionalCertifications.length > 0 && (
                  <div className="mt-6">
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3 flex items-center`}>
                      <Award className="w-4 h-4 mr-2 text-green-500" />
                      Additional Certifications
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {mentor.education.additionalCertifications.map((cert, index) => (
                        <span
                          key={index}
                          className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 dark:from-green-900/50 dark:to-emerald-900/50 dark:text-green-200 px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {mentor.workExperience && (
              <div className={`${isDarkMode ? 'bg-gray-800/80 backdrop-blur-lg border border-gray-700/50' : 'bg-white/80 backdrop-blur-lg border border-gray-200/50'} rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl`}>
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6 flex items-center`}>
                  <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg mr-3">
                    <Building className="w-5 h-5 text-white" />
                  </div>
                  Professional Experience
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-orange-50'}`}>
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2 flex items-center`}>
                      <Building className="w-4 h-4 mr-2 text-orange-500" />
                      Current Organization
                    </h3>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-medium`}>
                      {mentor.workExperience.currentOrganization || 'Not specified'}
                    </p>
                  </div>
                  <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-orange-50'}`}>
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2 flex items-center`}>
                      <Award className="w-4 h-4 mr-2 text-orange-500" />
                      Position
                    </h3>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-medium`}>
                      {mentor.workExperience.position || 'Not specified'}
                    </p>
                  </div>
                  <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-orange-50'}`}>
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2 flex items-center`}>
                      <Calendar className="w-4 h-4 mr-2 text-orange-500" />
                      Years of Experience
                    </h3>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-medium`}>
                      {mentor.workExperience.yearsOfExperience || 0} years
                    </p>
                  </div>
                  <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-orange-50'}`}>
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2 flex items-center`}>
                      <Building className="w-4 h-4 mr-2 text-orange-500" />
                      Industry
                    </h3>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-medium`}>
                      {mentor.workExperience.industry || 'Not specified'}
                    </p>
                  </div>
                </div>

                {mentor.workExperience.workDescription && (
                  <div className="mt-6">
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3 flex items-center`}>
                      <BookOpen className="w-4 h-4 mr-2 text-orange-500" />
                      Work Description
                    </h3>
                    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/30' : 'bg-orange-50'}`}>
                      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                        {mentor.workExperience.workDescription}
                      </p>
                    </div>
                  </div>
                )}

                {mentor.workExperience.previousOrganizations && mentor.workExperience.previousOrganizations.length > 0 && (
                  <div className="mt-6">
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3 flex items-center`}>
                      <Building className="w-4 h-4 mr-2 text-orange-500" />
                      Previous Organizations
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {mentor.workExperience.previousOrganizations.map((org, index) => (
                        <span
                          key={index}
                          className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 dark:from-orange-900/50 dark:to-red-900/50 dark:text-orange-200 px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                        >
                          {org}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className={`${isDarkMode ? 'bg-gray-800/80 backdrop-blur-lg border border-gray-700/50' : 'bg-white/80 backdrop-blur-lg border border-gray-200/50'} rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl`}>
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6 flex items-center`}>
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg mr-3">
                  <Award className="w-5 h-5 text-white" />
                </div>
                Statistics & Achievements
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className={`text-center p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-indigo-50'} transition-all duration-200 hover:scale-105`}>
                  <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                    {mentor.totalReviews || 0}
                  </div>
                  <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Reviews
                  </div>
                </div>
                <div className={`text-center p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-indigo-50'} transition-all duration-200 hover:scale-105`}>
                  <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                    {mentor.averageRating?.toFixed(1) || '0.0'}
                  </div>
                  <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Rating
                  </div>
                </div>
                <div className={`text-center p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-indigo-50'} transition-all duration-200 hover:scale-105`}>
                  <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                    {mentor.experience || 0}
                  </div>
                  <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Years Exp.
                  </div>
                </div>
                <div className={`text-center p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-indigo-50'} transition-all duration-200 hover:scale-105`}>
                  <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                    {new Date(mentor.createdAt).getFullYear()}
                  </div>
                  <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Joined
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MentorProfile
