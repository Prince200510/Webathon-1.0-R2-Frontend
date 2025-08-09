import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { api } from '../../utils/api'

function ProfilePage() {
  const navigate = useNavigate()
  const { user, logout, updateUser } = useAuth()
  const { isDarkMode } = useTheme()
  
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState('personal')
  const [personalInfo, setPersonalInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
    location: user?.location || ''
  })
  
  const [profileInfo, setProfileInfo] = useState({
    bio: user?.profile?.bio || '',
    subjects: user?.profile?.subjects || [],
    experience: user?.profile?.experience || '',
    education: user?.profile?.education || '',
    skills: user?.profile?.skills || [],
    availability: user?.profile?.availability || {},
    hourlyRate: user?.profile?.hourlyRate || '',
    socialLinks: user?.profile?.socialLinks || {
      linkedin: '',
      twitter: '',
      github: '',
      website: ''
    }
  })
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [statistics, setStatistics] = useState(null)
  useEffect(() => {
    fetchUserStatistics()
  }, [])

  const fetchUserStatistics = async () => {
    try {
      const response = await api.get('/api/users/statistics')
      setStatistics(response.data)
    } catch (error) {
      console.error('Error fetching statistics:', error)
    }
  }

  const handlePersonalInfoChange = (field, value) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleProfileInfoChange = (field, value) => {
    setProfileInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubjectAdd = (subject) => {
    if (subject.trim() && !profileInfo.subjects.includes(subject.trim())) {
      setProfileInfo(prev => ({
        ...prev,
        subjects: [...prev.subjects, subject.trim()]
      }))
    }
  }

  const handleSubjectRemove = (index) => {
    setProfileInfo(prev => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index)
    }))
  }

  const handleSkillAdd = (skill) => {
    if (skill.trim() && !profileInfo.skills.includes(skill.trim())) {
      setProfileInfo(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()]
      }))
    }
  }

  const handleSkillRemove = (index) => {
    setProfileInfo(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }))
  }

  const handleSavePersonalInfo = async () => {
    try {
      setSaving(true)
      setError('')
      
      const response = await api.patch('/api/users/profile', personalInfo)
      updateUser(response.data)
      setSuccess('Personal information updated successfully!')
      
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Error updating personal info:', error)
      setError(error.response?.data?.message || 'Failed to update personal information')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveProfileInfo = async () => {
    try {
      setSaving(true)
      setError('')
      
      const response = await api.patch('/api/users/profile', { profile: profileInfo })
      updateUser(response.data)
      setSuccess('Profile information updated successfully!')
      
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Error updating profile info:', error)
      setError(error.response?.data?.message || 'Failed to update profile information')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match')
      return
    }
    
    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    try {
      setSaving(true)
      setError('')
      
      await api.patch('/api/users/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      
      setSuccess('Password changed successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Error changing password:', error)
      setError(error.response?.data?.message || 'Failed to change password')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await api.delete('/api/users/account')
        logout()
        navigate('/')
      } catch (error) {
        console.error('Error deleting account:', error)
        setError('Failed to delete account')
      }
    }
  }

  const renderPersonalInfoTab = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
            Full Name *
          </label>
          <input
            type="text"
            value={personalInfo.name}
            onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                      ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
            required
          />
        </div>

        <div>
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
            Email Address *
          </label>
          <input
            type="email"
            value={personalInfo.email}
            onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                      ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
            required
          />
        </div>

        <div>
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
            Phone Number
          </label>
          <input
            type="tel"
            value={personalInfo.phone}
            onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                      ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
            Date of Birth
          </label>
          <input
            type="date"
            value={personalInfo.dateOfBirth}
            onChange={(e) => handlePersonalInfoChange('dateOfBirth', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                      ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
          />
        </div>

        <div className="md:col-span-2">
          <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
            Location
          </label>
          <input
            type="text"
            value={personalInfo.location}
            onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
            placeholder="City, Country"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                      ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSavePersonalInfo}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div>
        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
          Bio
        </label>
        <textarea
          value={profileInfo.bio}
          onChange={(e) => handleProfileInfoChange('bio', e.target.value)}
          rows={4}
          placeholder="Tell others about yourself, your interests, and your expertise..."
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                    ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
        />
      </div>

      {user?.role === 'mentor' && (
        <>
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Subjects You Teach
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {profileInfo.subjects.map((subject, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {subject}
                  <button
                    onClick={() => handleSubjectRemove(index)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add a subject (press Enter)"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSubjectAdd(e.target.value)
                  e.target.value = ''
                }
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                        ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Years of Experience
              </label>
              <input
                type="number"
                value={profileInfo.experience}
                onChange={(e) => handleProfileInfoChange('experience', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                          ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Hourly Rate ($)
              </label>
              <input
                type="number"
                value={profileInfo.hourlyRate}
                onChange={(e) => handleProfileInfoChange('hourlyRate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                          ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Education & Qualifications
            </label>
            <textarea
              value={profileInfo.education}
              onChange={(e) => handleProfileInfoChange('education', e.target.value)}
              rows={3}
              placeholder="Your educational background, degrees, certifications..."
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                        ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
            />
          </div>
        </>
      )}

      <div>
        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
          Skills
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {profileInfo.skills.map((skill, index) => (
            <span
              key={index}
              className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              {skill}
              <button
                onClick={() => handleSkillRemove(index)}
                className="text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          placeholder="Add a skill (press Enter)"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSkillAdd(e.target.value)
              e.target.value = ''
            }
          }}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                    ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
        />
      </div>

      <div>
        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
          Social Links
        </label>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="url"
            value={profileInfo.socialLinks.linkedin}
            onChange={(e) => handleProfileInfoChange('socialLinks', {...profileInfo.socialLinks, linkedin: e.target.value})}
            placeholder="LinkedIn URL"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                      ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
          />
          <input
            type="url"
            value={profileInfo.socialLinks.website}
            onChange={(e) => handleProfileInfoChange('socialLinks', {...profileInfo.socialLinks, website: e.target.value})}
            placeholder="Website URL"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                      ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSaveProfileInfo}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </div>
  )

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
          Change Password
        </h3>
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Current Password
            </label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData(prev => ({...prev, currentPassword: e.target.value}))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                        ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              New Password
            </label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData(prev => ({...prev, newPassword: e.target.value}))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                        ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData(prev => ({...prev, confirmPassword: e.target.value}))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                        ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
            />
          </div>

          <button
            onClick={handleChangePassword}
            disabled={saving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Changing...' : 'Change Password'}
          </button>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
          Danger Zone
        </h3>
        <div className={`${isDarkMode ? 'bg-red-900/20' : 'bg-red-50'} border border-red-200 rounded-lg p-4`}>
          <h4 className="text-red-600 font-medium mb-2">Delete Account</h4>
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )

  const renderStatisticsTab = () => (
    <div className="space-y-6">
      {statistics ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'} rounded-lg p-6 text-center`}>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {statistics.totalSessions || 0}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Total Sessions
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-green-50'} rounded-lg p-6 text-center`}>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {statistics.quizzesTaken || 0}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Quizzes Taken
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-purple-50'} rounded-lg p-6 text-center`}>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {statistics.averageScore || 0}%
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Average Quiz Score
            </div>
          </div>

          {user?.role === 'mentor' && (
            <>
              <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-yellow-50'} rounded-lg p-6 text-center`}>
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {statistics.studentsHelped || 0}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Students Helped
                </div>
              </div>

              <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'} rounded-lg p-6 text-center`}>
                <div className="text-3xl font-bold text-indigo-600 mb-2">
                  {statistics.rating || 0}/5
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Average Rating
                </div>
              </div>

              <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-red-50'} rounded-lg p-6 text-center`}>
                <div className="text-3xl font-bold text-red-600 mb-2">
                  ${statistics.totalEarnings || 0}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Total Earnings
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className={`mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Loading statistics...
          </p>
        </div>
      )}
    </div>
  )

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {user?.name}
              </h1>
              <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} capitalize`}>
                {user?.role}
              </p>
            </div>
          </div>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden`}>
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {[
              { id: 'personal', label: 'Personal Info', icon: '👤' },
              { id: 'profile', label: 'Profile', icon: '📝' },
              { id: 'security', label: 'Security', icon: '🔒' },
              { id: 'statistics', label: 'Statistics', icon: '📊' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 text-center font-medium transition-colors
                          ${activeTab === tab.id
                            ? `border-b-2 border-blue-500 ${isDarkMode ? 'text-blue-400 bg-gray-700' : 'text-blue-600 bg-blue-50'}`
                            : `${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`
                          }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'personal' && renderPersonalInfoTab()}
            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'security' && renderSecurityTab()}
            {activeTab === 'statistics' && renderStatisticsTab()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
