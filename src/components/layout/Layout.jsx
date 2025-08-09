import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import NotificationCenter from '../NotificationCenter'
import { Home,  Users,  BookOpen,  MessageCircle,  Trophy,  User,  Settings,  LogOut, Menu, X, Sun, Moon, Bell, Search, HelpCircle} from 'lucide-react'

const Layout = ({ children }) => {
  const { user, logout } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)


  const getNavigationItems = () => {
    const baseItems = [
      { 
        name: 'Dashboard', 
        href: user?.role === 'admin' ? '/admin' : user?.role === 'mentor' ? '/mentor' : '/student', 
        icon: Home 
      },
      { name: 'Profile', href: '/profile', icon: User },
      { name: 'Community', href: '/community', icon: HelpCircle },
      { name: 'Chat', href: '/chat', icon: MessageCircle },
      { name: 'Resources', href: '/resources', icon: BookOpen }
    ]

    if (user?.role === 'student') {
      baseItems.splice(2, 0, 
        { name: 'Find Mentors', href: '/mentors', icon: Users },
        { name: 'Quizzes', href: '/quiz', icon: BookOpen },
        { name: 'Leaderboard', href: '/leaderboard', icon: Trophy }
      )
    }

    return baseItems
  }

  const navigationItems = getNavigationItems()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background">
      <div className="flex h-screen overflow-hidden">
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-light-surface dark:bg-dark-surface border-r border-light-border dark:border-dark-border transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
          <div className="flex items-center justify-between h-16 px-6 border-b border-light-border dark:border-dark-border">
            <h1 className="text-xl font-bold text-gradient">EdTech</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href || 
                             (item.href !== '/' && location.pathname.startsWith(item.href))
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-light-primary text-white dark:bg-dark-primary'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-light-border dark:border-dark-border p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-light-primary to-light-accent dark:from-dark-primary dark:to-dark-accent rounded-full flex items-center justify-center text-white font-semibold">
                {user?.profile?.firstName?.[0] || user?.email?.[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-light-text dark:text-dark-text truncate">
                  {user?.profile?.firstName} {user?.profile?.lastName}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={toggleTheme}
                className="flex-1 btn-secondary flex items-center justify-center"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 btn-secondary flex items-center justify-center text-red-600 dark:text-red-400"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          <header className="bg-light-surface dark:bg-dark-surface border-b border-light-border dark:border-dark-border px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="flex-1 max-w-md mx-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="input-field pl-10"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setNotificationOpen(true)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 relative"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
      <NotificationCenter 
        isOpen={notificationOpen} 
        onClose={() => setNotificationOpen(false)} 
      />
    </div>
  )
}

export default Layout
