import axios from 'axios'
import toast from 'react-hot-toast'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://team-duo-dare-r2b.onrender.com'

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    
    if (error.response?.status === 500) {
      toast.error('Server error. Please try again later.')
    }
    
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData) => apiClient.post('/auth/register', userData),
  getProfile: () => apiClient.get('/auth/me'),
  updateProfile: (data) => apiClient.put('/auth/me', data),
  onboardingStep1: (data) => apiClient.post('/auth/onboarding/step1', data),
  onboardingStep2: (data) => apiClient.post('/auth/onboarding/step2', data),
  onboardingStep3: (data) => apiClient.post('/auth/onboarding/step3', data),
  onboardingStep4: (data) => apiClient.post('/auth/onboarding/step4', data)
}

export const mentorAPI = {
  searchMentors: (params) => apiClient.get('/mentors/search', { params }),
  getAvailableMentors: (params) => apiClient.get('/mentors/available', { params }),
  getMentorById: (id) => apiClient.get(`/mentors/${id}`),
  getMentorAvailability: (id, date) => apiClient.get(`/mentors/${id}/availability`, { params: { date } }),
  updateAvailability: (availability) => apiClient.put('/mentors/availability', { availability }),
  getSessionRequests: (params) => apiClient.get('/mentors/profile/requests', { params }),
  getMentorStats: () => apiClient.get('/mentors/dashboard/stats')
}

export const sessionAPI = {
  bookSession: (data) => apiClient.post('/sessions/book', data),
  sosRequest: (data) => apiClient.post('/sessions/sos', data),
  getUserSessions: (params) => apiClient.get('/sessions/my-sessions', { params }),
  getSessionById: (id) => apiClient.get(`/sessions/${id}`),
  acceptSession: (id) => apiClient.put(`/sessions/${id}/accept`),
  rejectSession: (id, reason) => apiClient.put(`/sessions/${id}/reject`, { reason }),
  startSession: (id) => apiClient.put(`/sessions/${id}/start`),
  completeSession: (id, notes) => apiClient.put(`/sessions/${id}/complete`, { sessionNotes: notes }),
  rateSession: (id, rating, review) => apiClient.post(`/sessions/${id}/rate`, { rating, review }),
  getMeetingLink: (id) => apiClient.get(`/sessions/${id}/meeting-link`)
}

export const quizAPI = {
  generateQuiz: (data) => apiClient.post('/quiz/generate', data),
  searchQuizzes: (params) => apiClient.get('/quiz/search', { params }),
  getQuizById: (id) => apiClient.get(`/quiz/${id}`),
  submitQuizAttempt: (id, data) => apiClient.post(`/quiz/${id}/attempt`, data),
  getUserQuizResults: (params) => apiClient.get('/quiz/attempts/my-results', { params }),
  getCollegeLeaderboard: (college) => apiClient.get(`/quiz/leaderboard/${college}`)
}

export const userAPI = {
  getDashboard: () => apiClient.get('/users/dashboard'),
  getUserProfile: (id) => apiClient.get(`/users/profile/${id}`),
  getGlobalLeaderboard: (params) => apiClient.get('/users/leaderboard', { params }),
  uploadAvatar: (profilePicture) => apiClient.post('/users/upload-avatar', { profilePicture })
}

export const chatAPI = {
  getUserConversations: () => apiClient.get('/chat/conversations'),
  createChat: (data) => apiClient.post('/chat/create', data),
  getChatMessages: (chatId, params) => apiClient.get(`/chat/${chatId}/messages`, { params }),
  sendMessage: (chatId, data) => apiClient.post(`/chat/${chatId}/messages`, data),
  markMessageAsRead: (messageId) => apiClient.put(`/chat/messages/${messageId}/read`)
}

export const resourceAPI = {
  searchResources: (params) => apiClient.get('/resources/search', { params }),
  createResource: (data) => apiClient.post('/resources/create', data),
  getResourceById: (id) => apiClient.get(`/resources/${id}`),
  rateResource: (id, rating) => apiClient.post(`/resources/${id}/rate`, { rating }),
  generateStudyNotes: (data) => apiClient.post('/resources/generate-notes', data),
  getUserResources: (params) => apiClient.get('/resources/my-uploads', { params })
}

export const notificationAPI = {
  getUserNotifications: (params) => apiClient.get('/notifications/my-notifications', { params }),
  markAsRead: (id) => apiClient.put(`/notifications/${id}/read`),
  deleteNotification: (id) => apiClient.delete(`/notifications/${id}`),
  markAllAsRead: () => apiClient.put('/notifications/mark-all-read')
}

export const adminAPI = {
  getAnalytics: () => apiClient.get('/admin/analytics'),
  getAllUsers: (params) => apiClient.get('/admin/users', { params }),
  getAllSessions: (params) => apiClient.get('/admin/sessions', { params }),
  verifyUser: (id) => apiClient.put(`/admin/users/${id}/verify`),
  deleteUser: (id) => apiClient.delete(`/admin/users/${id}`)
}
