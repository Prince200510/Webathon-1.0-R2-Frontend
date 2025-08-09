import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { ChevronRight, ChevronLeft, Check, User, GraduationCap, Briefcase, BookOpen, Sun, Moon, Plus, X } from 'lucide-react'
import toast from 'react-hot-toast'

const MentorOnboardingPage = () => {
  const { user, completeOnboardingStep } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()
  const [currentStep, setCurrentStep] = useState(user?.onboardingStep || 1)
  const [isLoading, setIsLoading] = useState(false)
  
  const [stepData, setStepData] = useState({
    step1: {
      firstName: '',
      lastName: '',
      fullName: '',
      address: '',
      phoneNumber: '',
      profilePicture: ''
    },
    step2: {
      university: '',
      degree: '',
      graduationYear: '',
      fieldOfStudy: '',
      additionalCertifications: [],
      pastEducation: []
    },
    step3: {
      currentOrganization: '',
      position: '',
      yearsOfExperience: '',
      industry: '',
      previousOrganizations: [],
      workDescription: ''
    },
    step4: {
      teachingSubjects: [],
      customSubjects: [],
      mentorshipExperience: '',
      mentorshipYears: '',
      specializations: [],
      availability: 'part-time'
    }
  })

  const [customSubject, setCustomSubject] = useState('')
  const [customCertification, setCustomCertification] = useState('')
  const [customOrganization, setCustomOrganization] = useState('')

  const steps = [
    { number: 1, title: 'Personal Details', icon: User, description: 'Your basic information' },
    { number: 2, title: 'Education', icon: GraduationCap, description: 'Academic qualifications' },
    { number: 3, title: 'Professional Experience', icon: Briefcase, description: 'Work background' },
    { number: 4, title: 'Mentorship Details', icon: BookOpen, description: 'Teaching preferences' }
  ]

  const commonSubjects = [
    'Mathematics', 'Computer Science', 'Physics', 'Chemistry', 'Biology',
    'Economics', 'Business Administration', 'Engineering', 'Data Science',
    'Machine Learning', 'Web Development', 'Mobile Development', 'Marketing',
    'Finance', 'Accounting', 'Psychology', 'Literature', 'History',
    'Graphic Design', 'UI/UX Design', 'Project Management', 'Operations',
    'Statistics', 'Research Methods', 'Technical Writing', 'Public Speaking'
  ]

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing',
    'Retail', 'Consulting', 'Media & Entertainment', 'Real Estate',
    'Government', 'Non-Profit', 'Automotive', 'Energy', 'Telecommunications',
    'Food & Beverage', 'Travel & Tourism', 'Legal', 'Construction'
  ]

  const handleStepSubmit = async (step) => {
    setIsLoading(true)
    
    try {
      let dataToSubmit = stepData[`step${step}`]
      
      if (step === 4) {
        const mentorData = {
          education: {
            university: stepData.step2.university,
            degree: stepData.step2.degree,
            graduationYear: stepData.step2.graduationYear,
            fieldOfStudy: stepData.step2.fieldOfStudy,
            additionalCertifications: stepData.step2.additionalCertifications
          },
          workExperience: {
            currentOrganization: stepData.step3.currentOrganization,
            position: stepData.step3.position,
            yearsOfExperience: parseInt(stepData.step3.yearsOfExperience),
            industry: stepData.step3.industry,
            previousOrganizations: stepData.step3.previousOrganizations,
            workDescription: stepData.step3.workDescription
          },
          teachingSubjects: [...stepData.step4.teachingSubjects, ...stepData.step4.customSubjects],
          contactEmail: user.email,
          phoneNumber: stepData.step1.phoneNumber,
          bio: `${stepData.step4.mentorshipExperience} with ${stepData.step4.mentorshipYears} years of mentorship experience.`,
          address: stepData.step1.address,
          availability: stepData.step4.availability,
          specializations: stepData.step4.specializations
        }
        
        const result = await fetch('/api/auth/mentor/onboarding', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(mentorData)
        })
        
        if (result.ok) {
          toast.success('Mentor application submitted! You will be notified via WhatsApp once approved.')
          window.location.href = '/mentor-pending'
        } else {
          throw new Error('Failed to submit application')
        }
      } else {
        if (step === 1) {
          dataToSubmit = {
            ...dataToSubmit,
            fullName: `${stepData.step1.firstName} ${stepData.step1.lastName}`
          }
        }
        
        const result = await completeOnboardingStep(step, dataToSubmit)
        
        if (result.success) {
          setCurrentStep(step + 1)
          toast.success(`Step ${step} completed!`)
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

  const addToArray = (step, field, value, customField = null) => {
    if (value.trim()) {
      setStepData(prev => ({
        ...prev,
        [`step${step}`]: {
          ...prev[`step${step}`],
          [field]: [...prev[`step${step}`][field], value.trim()]
        }
      }))
      if (customField) {
        if (customField === 'customSubject') setCustomSubject('')
        if (customField === 'customCertification') setCustomCertification('')
        if (customField === 'customOrganization') setCustomOrganization('')
      }
    }
  }

  const removeFromArray = (step, field, index) => {
    setStepData(prev => ({
      ...prev,
      [`step${step}`]: {
        ...prev[`step${step}`],
        [field]: prev[`step${step}`][field].filter((_, i) => i !== index)
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
          Complete Address *
        </label>
        <textarea
          value={stepData.step1.address}
          onChange={(e) => updateStepData(1, 'address', e.target.value)}
          className="input-field"
          placeholder="Street Address, City, State, Postal Code, Country"
          rows="3"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
          Phone Number *
        </label>
        <input
          type="tel"
          value={stepData.step1.phoneNumber}
          onChange={(e) => updateStepData(1, 'phoneNumber', e.target.value)}
          className="input-field"
          placeholder="+1 (555) 123-4567"
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
            University/Institution *
          </label>
          <input
            type="text"
            value={stepData.step2.university}
            onChange={(e) => updateStepData(2, 'university', e.target.value)}
            className="input-field"
            placeholder="Enter your university name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
            Degree *
          </label>
          <input
            type="text"
            value={stepData.step2.degree}
            onChange={(e) => updateStepData(2, 'degree', e.target.value)}
            className="input-field"
            placeholder="e.g., Bachelor of Science, Master of Arts"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
            Field of Study *
          </label>
          <input
            type="text"
            value={stepData.step2.fieldOfStudy}
            onChange={(e) => updateStepData(2, 'fieldOfStudy', e.target.value)}
            className="input-field"
            placeholder="e.g., Computer Science, Business Administration"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
            Graduation Year *
          </label>
          <input
            type="number"
            value={stepData.step2.graduationYear}
            onChange={(e) => updateStepData(2, 'graduationYear', e.target.value)}
            className="input-field"
            placeholder="2020"
            min="1950"
            max="2030"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
          Additional Certifications
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={customCertification}
            onChange={(e) => setCustomCertification(e.target.value)}
            className="input-field flex-1"
            placeholder="Enter certification name"
          />
          <button
            type="button"
            onClick={() => addToArray(2, 'additionalCertifications', customCertification, 'customCertification')}
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {stepData.step2.additionalCertifications.map((cert, index) => (
            <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
              {cert}
              <button
                type="button"
                onClick={() => removeFromArray(2, 'additionalCertifications', index)}
                className="text-blue-600 hover:text-blue-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
            Current Organization *
          </label>
          <input
            type="text"
            value={stepData.step3.currentOrganization}
            onChange={(e) => updateStepData(3, 'currentOrganization', e.target.value)}
            className="input-field"
            placeholder="Company name or Self-employed"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
            Current Position *
          </label>
          <input
            type="text"
            value={stepData.step3.position}
            onChange={(e) => updateStepData(3, 'position', e.target.value)}
            className="input-field"
            placeholder="Your job title"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
            Years of Experience *
          </label>
          <input
            type="number"
            value={stepData.step3.yearsOfExperience}
            onChange={(e) => updateStepData(3, 'yearsOfExperience', e.target.value)}
            className="input-field"
            placeholder="5"
            min="0"
            max="50"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
            Industry *
          </label>
          <select
            value={stepData.step3.industry}
            onChange={(e) => updateStepData(3, 'industry', e.target.value)}
            className="input-field"
            required
          >
            <option value="">Select industry</option>
            {industries.map((industry) => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
          Work Description *
        </label>
        <textarea
          value={stepData.step3.workDescription}
          onChange={(e) => updateStepData(3, 'workDescription', e.target.value)}
          className="input-field"
          placeholder="Describe your current role and responsibilities"
          rows="4"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
          Previous Organizations
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={customOrganization}
            onChange={(e) => setCustomOrganization(e.target.value)}
            className="input-field flex-1"
            placeholder="Previous company name"
          />
          <button
            type="button"
            onClick={() => addToArray(3, 'previousOrganizations', customOrganization, 'customOrganization')}
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {stepData.step3.previousOrganizations.map((org, index) => (
            <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
              {org}
              <button
                type="button"
                onClick={() => removeFromArray(3, 'previousOrganizations', index)}
                className="text-green-600 hover:text-green-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-4">
          Select subjects you can mentor (choose at least 2) *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          {commonSubjects.map((subject) => (
            <button
              key={subject}
              type="button"
              onClick={() => toggleArrayItem(4, 'teachingSubjects', subject)}
              className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                stepData.step4.teachingSubjects.includes(subject)
                  ? 'border-light-primary bg-light-primary text-white dark:border-dark-primary dark:bg-dark-primary'
                  : 'border-light-border dark:border-dark-border hover:border-light-primary dark:hover:border-dark-primary'
              }`}
            >
              {subject}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={customSubject}
            onChange={(e) => setCustomSubject(e.target.value)}
            className="input-field flex-1"
            placeholder="Add custom subject not listed above"
          />
          <button
            type="button"
            onClick={() => addToArray(4, 'customSubjects', customSubject, 'customSubject')}
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {stepData.step4.customSubjects.map((subject, index) => (
            <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm">
              {subject}
              <button
                type="button"
                onClick={() => removeFromArray(4, 'customSubjects', index)}
                className="text-purple-600 hover:text-purple-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
            Years of Mentorship Experience *
          </label>
          <input
            type="number"
            value={stepData.step4.mentorshipYears}
            onChange={(e) => updateStepData(4, 'mentorshipYears', e.target.value)}
            className="input-field"
            placeholder="2"
            min="0"
            max="30"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
            Availability *
          </label>
          <select
            value={stepData.step4.availability}
            onChange={(e) => updateStepData(4, 'availability', e.target.value)}
            className="input-field"
            required
          >
            <option value="part-time">Part-time (10-20 hours/week)</option>
            <option value="full-time">Full-time (30+ hours/week)</option>
            <option value="weekends">Weekends only</option>
            <option value="flexible">Flexible schedule</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
          Mentorship Experience Description *
        </label>
        <textarea
          value={stepData.step4.mentorshipExperience}
          onChange={(e) => updateStepData(4, 'mentorshipExperience', e.target.value)}
          className="input-field"
          placeholder="Describe your experience in mentoring, teaching, or guiding others"
          rows="4"
          required
        />
      </div>
    </div>
  )

  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return stepData.step1.firstName && stepData.step1.lastName && stepData.step1.address && stepData.step1.phoneNumber
      case 2:
        return stepData.step2.university && stepData.step2.degree && stepData.step2.fieldOfStudy && stepData.step2.graduationYear
      case 3:
        return stepData.step3.currentOrganization && stepData.step3.position && stepData.step3.yearsOfExperience && stepData.step3.industry && stepData.step3.workDescription
      case 4:
        return (stepData.step4.teachingSubjects.length + stepData.step4.customSubjects.length >= 2) && stepData.step4.mentorshipYears && stepData.step4.mentorshipExperience
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
            <h1 className="text-3xl font-bold text-gradient mb-2">Become a Mentor</h1>
            <p className="text-gray-600 dark:text-gray-400">Share your expertise and guide the next generation</p>
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
                    Submit Application
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

export default MentorOnboardingPage
