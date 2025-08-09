import { createContext, useContext, useEffect, useState } from 'react'
import { apiClient } from '../utils/apiClient'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      loadUser()
    } else {
      setIsLoading(false)
    }
  }, [])

  const loadUser = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.get('/auth/me')
      setUser(response.data)
      setIsAuthenticated(true)
    } catch (error) {
      localStorage.removeItem('token')
      console.error('Failed to load user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password })
      const { token, user: userData } = response.data
      
      localStorage.setItem('token', token)
      setUser(userData)
      setIsAuthenticated(true)
      
      toast.success('Login successful!')
      return { success: true, user: userData }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const register = async (email, password, role) => {
    try {
      const response = await apiClient.post('/auth/register', { email, password, role })
      const { token, user: userData } = response.data
      
      localStorage.setItem('token', token)
      setUser(userData)
      setIsAuthenticated(true)
      
      toast.success('Registration successful!')
      return { success: true, user: userData }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setIsAuthenticated(false)
    toast.success('Logged out successfully')
    window.location.href = '/'
  }

  const updateProfile = async (profileData) => {
    try {
      const response = await apiClient.put('/auth/me', profileData)
      setUser(response.data)
      toast.success('Profile updated successfully!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const completeOnboardingStep = async (step, data) => {
    try {
      const response = await apiClient.post(`/auth/onboarding/step${step}`, data)
      setUser(prevUser => ({ ...prevUser, ...response.data.user }))
      return { success: true, user: response.data.user }
    } catch (error) {
      const message = error.response?.data?.message || 'Onboarding step failed'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    completeOnboardingStep,
    refreshUser: loadUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
