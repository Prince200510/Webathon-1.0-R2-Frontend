import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { api } from '../../utils/api'
import { generateAdvancedPDF } from '../../utils/pdfGenerator'

function ResourceLibrary() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { isDarkMode } = useTheme()
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [subjects, setSubjects] = useState([])
  const [generating, setGenerating] = useState(false)
  const [generateTopic, setGenerateTopic] = useState('')
  const [selectedResource, setSelectedResource] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const resourceTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'notes', label: 'Study Notes' },
    { value: 'video', label: 'Video Tutorials' },
    { value: 'pdf', label: 'PDF Documents' },
    { value: 'quiz', label: 'Practice Quizzes' },
    { value: 'worksheet', label: 'Worksheets' },
    { value: 'reference', label: 'Reference Material' }
  ]

  useEffect(() => {
    fetchResources()
    fetchSubjects()
  }, [selectedSubject, selectedType])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showModal) {
        setShowModal(false)
        setSelectedResource(null)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [showModal])

  const fetchResources = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedSubject !== 'all') params.append('subject', selectedSubject)
      if (selectedType !== 'all') params.append('type', selectedType)
      if (searchTerm) params.append('search', searchTerm)
      
      const response = await api.get(`/resources?${params}`)
      setResources(response.data)
    } catch (error) {
      console.error('Error fetching resources:', error)
      setError('Failed to load resources')
    } finally {
      setLoading(false)
    }
  }

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/resources/subjects')
      setSubjects(response.data)
    } catch (error) {
      console.error('Error fetching subjects:', error)
    }
  }

  const handleSearch = () => {
    fetchResources()
  }

  const handleDownloadPDF = (resource) => {
    try {
      generateAdvancedPDF(resource.title, resource.content, resource.subject);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  }

  const handleGenerateNotes = async () => {
    if (!generateTopic.trim()) return
    
    try {
      setGenerating(true)
      const response = await api.post('/resources/generate-notes', {
        topic: generateTopic,
        subject: selectedSubject === 'all' ? 'General' : selectedSubject
      })
      
      setResources(prev => [response.data, ...prev])
      setGenerateTopic('')
      
    } catch (error) {
      console.error('Error generating notes:', error)
      setError('Failed to generate study notes')
    } finally {
      setGenerating(false)
    }
  }

  const getResourceIcon = (type) => {
    switch (type) {
      case 'notes':
        return '📝'
      case 'video':
        return '🎥'
      case 'pdf':
        return '📄'
      case 'quiz':
        return '❓'
      case 'worksheet':
        return '📋'
      case 'reference':
        return '📚'
      default:
        return '📄'
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'notes':
        return 'bg-blue-100 text-blue-800'
      case 'video':
        return 'bg-red-100 text-red-800'
      case 'pdf':
        return 'bg-green-100 text-green-800'
      case 'quiz':
        return 'bg-purple-100 text-purple-800'
      case 'worksheet':
        return 'bg-yellow-100 text-yellow-800'
      case 'reference':
        return 'bg-indigo-100 text-indigo-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleResourceClick = async (resource) => {
    if (resource.type === 'quiz') {
      navigate(`/quiz/${resource._id}/attempt`)
    } else if (resource.fileUrl || (resource.url && resource.url.includes('uploads/'))) {
      try {
        console.log('Downloading resource via API:', resource._id);
        const response = await api.get(`/resources/${resource._id}/download`, {
          responseType: 'blob'
        });
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${resource.title}.${resource.type === 'pdf' ? 'pdf' : 'txt'}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error downloading resource:', error);
        alert('Failed to download resource. Please try again.');
      }
    } else if (resource.url && !resource.url.includes('uploads/')) {
      window.open(resource.url, '_blank');
    } else if (resource.content) {
      setSelectedResource(resource)
      setShowModal(true)
    }
  }

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading && resources.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            📚 Resource Library
          </h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Discover study materials, tutorials, and practice resources
          </p>
        </div>

        <div className={`${isDarkMode ? 'bg-gradient-to-r from-blue-800 to-purple-800' : 'bg-gradient-to-r from-blue-500 to-purple-600'} rounded-lg shadow-lg p-6 mb-8 text-white`}>
          <h2 className="text-2xl font-bold mb-4">🤖 AI Study Notes Generator</h2>
          <p className="mb-4 text-blue-100">
            Generate personalized study notes on any topic using AI
          </p>
          
          <div className="flex gap-4">
            <input
              type="text"
              value={generateTopic}
              onChange={(e) => setGenerateTopic(e.target.value)}
              placeholder="Enter a topic (e.g., 'Photosynthesis', 'Calculus Derivatives')"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50"
              onKeyPress={(e) => e.key === 'Enter' && handleGenerateNotes()}
            />
            <button
              onClick={handleGenerateNotes}
              disabled={generating || !generateTopic.trim()}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? 'Generating...' : 'Generate Notes'}
            </button>
          </div>
        </div>
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 mb-8`}>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search resources..."
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                            ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <svg className="w-5 h-5 absolute left-3 top-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                          ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              >
                <option value="all">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
                          ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              >
                {resourceTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className={`mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Loading resources...
            </p>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
              No Resources Found
            </h3>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
              Try adjusting your search criteria or generate some AI-powered study notes
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedSubject('all')
                setSelectedType('all')
                fetchResources()
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <div
                key={resource._id}
                className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer group`}
                onClick={() => handleResourceClick(resource)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl">{getResourceIcon(resource.type)}</div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                    {resource.type}
                  </span>
                </div>

                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2 group-hover:text-blue-600 transition-colors`}>
                  {resource.title}
                </h3>

                {resource.description && (
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4 line-clamp-3`}>
                    {resource.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {resource.subject}
                  </span>
                  <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {new Date(resource.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {resource.downloads && (
                  <div className="mt-3 flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                    {resource.downloads} downloads
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleResourceClick(resource)
                    }}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    {resource.type === 'quiz' ? 'Take Quiz' : 'View Resource'}
                  </button>
                  
                  {(resource.url || resource.fileUrl) && (
                    <button
                      onClick={async (e) => {
                        e.stopPropagation()
                        if (resource.fileUrl && resource.fileUrl.includes('uploads/')) {
                          try {
                            const response = await api.get(`/resources/${resource._id}/download`, {
                              responseType: 'blob'
                            });
                            
                            const url = window.URL.createObjectURL(new Blob([response.data]));
                            const link = document.createElement('a');
                            link.href = url;
                            link.setAttribute('download', `${resource.title}.${resource.type === 'pdf' ? 'pdf' : 'txt'}`);
                            document.body.appendChild(link);
                            link.click();
                            link.remove();
                            window.URL.revokeObjectURL(url);
                          } catch (error) {
                            console.error('Error downloading resource:', error);
                            alert('Failed to download resource');
                          }
                        } else {
                          window.open(resource.url || resource.fileUrl, '_blank');
                        }
                      }}
                      className={`px-3 py-2 rounded-lg transition-colors ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {user?.role === 'mentor' && (
          <button
            onClick={() => navigate('/resources/upload')}
            className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
            title="Upload Resource"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        )}
        {showModal && selectedResource && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowModal(false)
                setSelectedResource(null)
              }
            }}
          >
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col`}>
              <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between flex-shrink-0`}>
                <div>
                  <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedResource.title}
                  </h2>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                    {selectedResource.subject} • {selectedResource.type}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowModal(false)
                    setSelectedResource(null)
                  }}
                  className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="px-6 py-4 overflow-y-auto flex-1 min-h-0">
                {selectedResource.description && (
                  <div className={`mb-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Description</h3>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {selectedResource.description}
                    </p>
                  </div>
                )}
                <div className={`prose max-w-none ${isDarkMode ? 'prose-invert' : ''}`}>
                  <div 
                    className={`whitespace-pre-wrap ${isDarkMode ? 'text-gray-300' : 'text-gray-800'} leading-relaxed`}
                    dangerouslySetInnerHTML={{ 
                      __html: selectedResource.content
                        .replace(/\n/g, '<br>')
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>')
                        .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-5 mb-3">$1</h2>')
                        .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
                        .replace(/^- (.*$)/gm, '<li class="ml-4 list-disc">$1</li>')
                    }}
                  />
                </div>
              </div>
              <div className={`px-6 py-4 border-t ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'} flex justify-between items-center flex-shrink-0`}>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Created: {new Date(selectedResource.createdAt).toLocaleDateString()}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDownloadPDF(selectedResource)}
                    className={`px-4 py-2 rounded-lg transition-colors font-medium ${isDarkMode ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                  >
                    📄 Download PDF
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedResource.content)
                      alert('Content copied to clipboard!')
                    }}
                    className={`px-4 py-2 rounded-lg transition-colors font-medium ${isDarkMode ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-500 hover:bg-gray-600 text-white'}`}
                  >
                    📋 Copy Content
                  </button>
                  <button
                    onClick={() => {
                      setShowModal(false)
                      setSelectedResource(null)
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    ✕ Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ResourceLibrary
