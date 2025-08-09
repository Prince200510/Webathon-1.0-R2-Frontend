import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { ChevronRight, ChevronLeft, Check, User, GraduationCap, BookOpen, Settings, Sun, Moon } from 'lucide-react'
import toast from 'react-hot-toast'

const OnboardingPage = () => {
  const { user, completeOnboardingStep } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()
  const [currentStep, setCurrentStep] = useState(user?.onboardingStep || 1)
  const [isLoading, setIsLoading] = useState(false)
  
  const [stepData, setStepData] = useState({
    step1: {
      firstName: '',
      lastName: '',
      profilePicture: '',
      location: ''
    },
    step2: {
      college: '',
      currentYear: '',
      stream: '',
      pastEducation: []
    },
    step3: {
      skillset: []
    },
    step4: {
      preferences: {
        subjects: [],
        mode: 'online',
        language: 'English'
      }
    }
  })

  const steps = [
    { number: 1, title: 'Personal Info', icon: User, description: 'Tell us about yourself' },
    { number: 2, title: 'Education', icon: GraduationCap, description: 'Your academic background' },
    { number: 3, title: 'Skills', icon: BookOpen, description: 'What are you good at?' },
    { number: 4, title: 'Preferences', icon: Settings, description: 'Learning preferences' }
  ]

  const commonSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'HTML/CSS', 'Java', 'C++', 'SQL',
    'Data Analysis', 'Machine Learning', 'Graphic Design', 'Marketing', 'Writing',
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Psychology'
  ]

  const commonSubjects = [
    'Mathematics', 'Computer Science', 'Physics', 'Chemistry', 'Biology',
    'Economics', 'Business', 'Engineering', 'Literature', 'History',
    'Psychology', 'Data Science', 'Marketing', 'Finance'
  ]

  const handleStepSubmit = async (step) => {
    setIsLoading(true)
    
    try {
      const result = await completeOnboardingStep(step, stepData[`step${step}`])
      
      if (result.success) {
        if (step < 4) {
          setCurrentStep(step + 1)
          toast.success(`Step ${step} completed!`)
        } else {
          toast.success('Onboarding completed! Welcome to EdTech!')
        }
      }
    } catch (error) {
      toast.error('Failed to complete step. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const updateStepData = (step, field, value) => {
    setStepData(prev => ({
      ...prev,
      [`step${step}`]: {
        ...prev[`step${step}`],
        [field]: value
      }
    }))
  }

  const updateNestedStepData = (step, parentField, childField, value) => {
    setStepData(prev => ({
      ...prev,
      [`step${step}`]: {
        ...prev[`step${step}`],
        [parentField]: {
          ...prev[`step${step}`][parentField],
          [childField]: value
        }
      }
    }))
  }

  const toggleArrayItem = (step, field, item) => {
    setStepData(prev => {
      const currentArray = prev[`step${step}`][field] || []
      const newArray = currentArray.includes(item)
        ? currentArray.filter(i => i !== item)
        : [...currentArray, item]
      
      return {
        ...prev,
        [`step${step}`]: {
          ...prev[`step${step}`],
          [field]: newArray
        }
      }
    })
  }

  const toggleNestedArrayItem = (step, parentField, field, item) => {
    setStepData(prev => {
      const currentArray = prev[`step${step}`][parentField][field] || []
      const newArray = currentArray.includes(item)
        ? currentArray.filter(i => i !== item)
        : [...currentArray, item]
      
      return {
        ...prev,
        [`step${step}`]: {
          ...prev[`step${step}`],
          [parentField]: {
            ...prev[`step${step}`][parentField],
            [field]: newArray
          }
        }
      }
    })
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
            First Name *
          </label>
          <input
            type="text"
            value={stepData.step1.firstName}
            onChange={(e) => updateStepData(1, 'firstName', e.target.value)}
            className="input-field"
            placeholder="Enter your first name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
            Last Name *
          </label>
          <input
            type="text"
            value={stepData.step1.lastName}
            onChange={(e) => updateStepData(1, 'lastName', e.target.value)}
            className="input-field"
            placeholder="Enter your last name"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
          Location *
        </label>
        <input
          type="text"
          value={stepData.step1.location}
          onChange={(e) => updateStepData(1, 'location', e.target.value)}
          className="input-field"
          placeholder="City, State/Country"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
          Profile Picture URL (Optional)
        </label>
        <input
          type="url"
          value={stepData.step1.profilePicture}
          onChange={(e) => updateStepData(1, 'profilePicture', e.target.value)}
          className="input-field"
          placeholder="https://example.com/your-photo.jpg"
        />
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
          College/University *
        </label>
        <input
          type="text"
          value={stepData.step2.college}
          onChange={(e) => updateStepData(2, 'college', e.target.value)}
          className="input-field"
          placeholder="Enter your institution name"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
            Current Year *
          </label>
          <select
            value={stepData.step2.currentYear}
            onChange={(e) => updateStepData(2, 'currentYear', e.target.value)}
            className="input-field"
            required
          >
            <option value="">Select year</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
            <option value="Graduate">Graduate</option>
            <option value="PhD">PhD</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
            Stream/Major *
          </label>
          <input
            type="text"
            value={stepData.step2.stream}
            onChange={(e) => updateStepData(2, 'stream', e.target.value)}
            className="input-field"
            placeholder="e.g., Computer Science"
            required
          />
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-4">
          Select your skills (choose at least 3) *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {commonSkills.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => toggleArrayItem(3, 'skillset', skill)}
              className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                stepData.step3.skillset.includes(skill)
                  ? 'border-light-primary bg-light-primary text-white dark:border-dark-primary dark:bg-dark-primary'
                  : 'border-light-border dark:border-dark-border hover:border-light-primary dark:hover:border-dark-primary'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-4">
          Subjects you need help with *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {commonSubjects.map((subject) => (
            <button
              key={subject}
              type="button"
              onClick={() => toggleNestedArrayItem(4, 'preferences', 'subjects', subject)}
              className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                stepData.step4.preferences.subjects.includes(subject)
                  ? 'border-light-primary bg-light-primary text-white dark:border-dark-primary dark:bg-dark-primary'
                  : 'border-light-border dark:border-dark-border hover:border-light-primary dark:hover:border-dark-primary'
              }`}
            >
              {subject}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
            Preferred Mode *
          </label>
          <select
            value={stepData.step4.preferences.mode}
            onChange={(e) => updateNestedStepData(4, 'preferences', 'mode', e.target.value)}
            className="input-field"
            required
          >
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
            Preferred Language *
          </label>
          <select
            value={stepData.step4.preferences.language}
            onChange={(e) => updateNestedStepData(4, 'preferences', 'language', e.target.value)}
            className="input-field"
            required
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Hindi">Hindi</option>
            <option value="Chinese">Chinese</option>
          </select>
        </div>
      </div>
    </div>
  )

  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return stepData.step1.firstName && stepData.step1.lastName && stepData.step1.location
      case 2:
        return stepData.step2.college && stepData.step2.currentYear && stepData.step2.stream
      case 3:
        return stepData.step3.skillset.length >= 3
      case 4:
        return stepData.step4.preferences.subjects.length > 0
      default:
        return false
    }
  }

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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gradient mb-2">Welcome to EdTech!</h1>
            <p className="text-gray-600 dark:text-gray-400">Let's set up your profile to get started</p>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isActive = currentStep === step.number
                const isCompleted = currentStep > step.number
                
                return (
                  <div key={step.number} className="flex items-center flex-1">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      isCompleted
                        ? 'bg-green-500 border-green-500 text-white'
                        : isActive
                        ? 'border-light-primary dark:border-dark-primary text-light-primary dark:text-dark-primary'
                        : 'border-gray-300 dark:border-gray-600 text-gray-400'
                    }`}>
                      {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </div>
                    <div className="ml-3 flex-1">
                      <p className={`text-sm font-medium ${
                        isActive ? 'text-light-primary dark:text-dark-primary' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-400">{step.description}</p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`h-px flex-1 mx-4 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="card p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">
                Step {currentStep}: {steps[currentStep - 1].title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {steps[currentStep - 1].description}
              </p>
            </div>

            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                disabled={currentStep === 1}
                className="btn-secondary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </button>

              <button
                type="button"
                onClick={() => handleStepSubmit(currentStep)}
                disabled={!isStepValid(currentStep) || isLoading}
                className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="loading-spinner h-4 w-4 mr-2"></div>
                ) : currentStep === 4 ? (
                  <>
                    Complete Setup
                    <Check className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OnboardingPage
