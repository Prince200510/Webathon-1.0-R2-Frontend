import { format, parseISO, isToday, isTomorrow, isYesterday } from 'date-fns'

export const formatDate = (date) => {
  if (!date) return ''
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  
  if (isToday(dateObj)) {
    return 'Today'
  } else if (isTomorrow(dateObj)) {
    return 'Tomorrow'
  } else if (isYesterday(dateObj)) {
    return 'Yesterday'
  } else {
    return format(dateObj, 'MMM d, yyyy')
  }
}

export const formatTime = (time) => {
  if (!time) return ''
  
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  return `${displayHour}:${minutes} ${ampm}`
}

export const formatDateTime = (dateTime) => {
  if (!dateTime) return ''
  
  const dateObj = typeof dateTime === 'string' ? parseISO(dateTime) : dateTime
  return format(dateObj, 'MMM d, yyyy h:mm a')
}

export const getTimeFromNow = (date) => {
  if (!date) return ''
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  const now = new Date()
  const diffInMinutes = Math.floor((now - dateObj) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`
  
  return format(dateObj, 'MMM d, yyyy')
}

export const getBadgeColor = (badge) => {
  const colors = {
    bronze: 'badge-bronze',
    silver: 'badge-silver',
    gold: 'badge-gold',
    mentorlegend: 'badge-mentorlegend'
  }
  return colors[badge] || 'badge-bronze'
}

export const getDifficultyColor = (difficulty) => {
  const colors = {
    easy: 'text-green-600 dark:text-green-400',
    medium: 'text-yellow-600 dark:text-yellow-400',
    hard: 'text-red-600 dark:text-red-400'
  }
  return colors[difficulty] || colors.medium
}

export const getStatusColor = (status) => {
  const colors = {
    pending: 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900',
    accepted: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900',
    rejected: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900',
    completed: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900',
    cancelled: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900',
    in_progress: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900'
  }
  return colors[status] || colors.pending
}

export const generateTimeSlots = (startTime, endTime, duration = 60) => {
  const slots = []
  const start = parseInt(startTime.split(':')[0])
  const end = parseInt(endTime.split(':')[0])
  
  for (let hour = start; hour < end; hour += duration / 60) {
    const timeString = `${hour.toString().padStart(2, '0')}:00`
    slots.push(timeString)
  }
  
  return slots
}

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const truncateText = (text, maxLength = 100) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const capitalizeFirst = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const getInitials = (firstName, lastName) => {
  if (!firstName && !lastName) return 'U'
  const first = firstName ? firstName.charAt(0).toUpperCase() : ''
  const last = lastName ? lastName.charAt(0).toUpperCase() : ''
  return first + last
}

export const calculateCompletionPercentage = (current, total) => {
  if (!total || total === 0) return 0
  return Math.round((current / total) * 100)
}

export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const generateSessionRoomId = (sessionId) => {
  return `edtech-session-${sessionId}`
}

export const formatPrice = (price) => {
  if (!price) return 'Free'
  return `$${price}`
}

export const getGradeFromPercentage = (percentage) => {
  if (percentage >= 90) return 'A'
  if (percentage >= 80) return 'B'
  if (percentage >= 70) return 'C'
  if (percentage >= 60) return 'D'
  return 'F'
}

export const formatNumber = (num) => {
  if (!num) return '0'
  return num.toLocaleString()
}
