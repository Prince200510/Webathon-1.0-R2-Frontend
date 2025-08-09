import { useTheme } from '../../context/ThemeContext'
import { Clock, CheckCircle, MessageCircle, User, Sun, Moon } from 'lucide-react'

const MentorPendingPage = () => {
  const { isDarkMode, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background">
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border"
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h1 className="text-3xl font-bold text-gradient mb-2">Application Under Review</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Thank you for applying to become a mentor with EdTech!
            </p>
          </div>

          <div className="card p-8 mb-6">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-light-text dark:text-dark-text">Application Submitted</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your mentor application has been successfully submitted and is now being reviewed by our admin team.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-light-text dark:text-dark-text">Review in Progress</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Our team is currently reviewing your qualifications, experience, and teaching subjects. This process typically takes 2-3 business days.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-light-text dark:text-dark-text">WhatsApp Notification</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Once your application is approved or if we need additional information, you'll receive a WhatsApp message on the phone number you provided.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-light-text dark:text-dark-text">Account Activation</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    After approval, your mentor account will be activated and you'll be able to start accepting mentorship requests from students.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">What happens next?</h3>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Admin reviews your application within 2-3 business days</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>You'll receive a WhatsApp notification about the decision</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>If approved, you can immediately start mentoring students</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>If additional information is needed, we'll contact you via WhatsApp</span>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Questions? Contact our support team at{' '}
              <a href="mailto:support@edtech.com" className="text-light-primary dark:text-dark-primary hover:underline">
                support@edtech.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MentorPendingPage
