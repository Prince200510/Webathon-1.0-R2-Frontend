import { useState, useEffect } from 'react';
import { 
  Headphones, 
  Video, 
  Mic, 
  Play, 
  Pause, 
  RotateCcw, 
  Award,
  Star,
  Clock,
  Brain,
  Eye,
  Volume2,
  Settings,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  BookOpen,
  Target,
  Zap
} from 'lucide-react';
import { aiAPI } from '../utils/api';

const VRInterviewPrep = () => {
  const [vrSession, setVrSession] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [vrMode, setVrMode] = useState('desktop'); // 'desktop', 'vr', 'ar'
  const [selectedRole, setSelectedRole] = useState('');
  const [sessionResults, setSessionResults] = useState(null);
  const [vrSettings, setVrSettings] = useState({
    difficulty: 'medium',
    duration: 30,
    includeVideo: true,
    environment: 'office'
  });

  // Realistic scoring tracking
  const [sessionMetrics, setSessionMetrics] = useState({
    totalRecordingTime: 0,
    questionsAnswered: 0,
    averageResponseTime: 0,
    engagementScore: 0,
    responseQuality: []
  });
  const [recordingStartTime, setRecordingStartTime] = useState(null);
  const [questionStartTime, setQuestionStartTime] = useState(null);

  // Mock VR Interview Data
  const interviewRoles = [
    {
      id: 'software-engineer',
      title: 'Software Engineer',
      description: 'Technical coding and system design questions',
      icon: '💻',
      color: 'bg-blue-500',
      questions: 15,
      duration: '45-60 min'
    },
    {
      id: 'data-scientist',
      title: 'Data Scientist',
      description: 'Statistics, ML algorithms, and data analysis',
      icon: '📊',
      color: 'bg-purple-500',
      questions: 12,
      duration: '40-50 min'
    },
    {
      id: 'product-manager',
      title: 'Product Manager',
      description: 'Strategy, prioritization, and leadership',
      icon: '🎯',
      color: 'bg-green-500',
      questions: 10,
      duration: '30-45 min'
    },
    {
      id: 'business-analyst',
      title: 'Business Analyst',
      description: 'Process analysis and business requirements',
      icon: '📈',
      color: 'bg-orange-500',
      questions: 8,
      duration: '25-35 min'
    }
  ];

  const vrEnvironments = [
    { id: 'office', name: 'Corporate Office', icon: '🏢' },
    { id: 'startup', name: 'Startup Space', icon: '🚀' },
    { id: 'conference', name: 'Conference Room', icon: '🏛️' },
    { id: 'home', name: 'Remote Home Office', icon: '🏠' }
  ];

  const startVRSession = async () => {
    if (!selectedRole) {
      alert('Please select an interview role first');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate VR session initialization
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockSession = {
        id: Date.now().toString(),
        role: selectedRole,
        questions: generateMockQuestions(selectedRole),
        startTime: new Date(),
        settings: vrSettings
      };
      
      setVrSession(mockSession);
      setSessionActive(true);
      setCurrentQuestion(0);
      setQuestionStartTime(new Date());
      
      // Reset metrics for new session
      setSessionMetrics({
        totalRecordingTime: 0,
        questionsAnswered: 0,
        averageResponseTime: 0,
        engagementScore: 0,
        responseQuality: []
      });
    } catch (error) {
      console.error('Failed to start VR session:', error);
      alert('Failed to start VR session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockQuestions = (role) => {
    const questionSets = {
      'software-engineer': [
        {
          id: 1,
          type: 'technical',
          question: "Explain the difference between SQL and NoSQL databases. When would you use each?",
          expectedDuration: 180,
          difficulty: 'medium',
          category: 'System Design'
        },
        {
          id: 2,
          type: 'coding',
          question: "Write a function to reverse a linked list. Explain your approach and time complexity.",
          expectedDuration: 300,
          difficulty: 'medium',
          category: 'Data Structures'
        },
        {
          id: 3,
          type: 'behavioral',
          question: "Tell me about a challenging project you worked on and how you overcame obstacles.",
          expectedDuration: 240,
          difficulty: 'easy',
          category: 'Behavioral'
        }
      ],
      'data-scientist': [
        {
          id: 1,
          type: 'technical',
          question: "Explain the bias-variance tradeoff in machine learning. How do you handle overfitting?",
          expectedDuration: 200,
          difficulty: 'hard',
          category: 'Machine Learning'
        },
        {
          id: 2,
          type: 'analytical',
          question: "How would you approach A/B testing for a recommendation system?",
          expectedDuration: 250,
          difficulty: 'medium',
          category: 'Analytics'
        }
      ],
      'product-manager': [
        {
          id: 1,
          type: 'strategic',
          question: "How would you prioritize features for a mobile app with limited development resources?",
          expectedDuration: 300,
          difficulty: 'medium',
          category: 'Strategy'
        },
        {
          id: 2,
          type: 'analytical',
          question: "Design metrics to measure the success of a new social media feature.",
          expectedDuration: 240,
          difficulty: 'hard',
          category: 'Analytics'
        }
      ]
    };

    return questionSets[role] || questionSets['software-engineer'];
  };

  const endSession = () => {
    if (vrSession) {
      const endTime = new Date();
      const duration = Math.round((endTime - vrSession.startTime) / 1000 / 60);
      
      // Calculate realistic AI score based on actual interaction
      const aiScore = calculateRealisticScore();
      
      const results = {
        sessionId: vrSession.id,
        role: selectedRole,
        duration: duration,
        questionsCompleted: currentQuestion + 1,
        totalQuestions: vrSession.questions.length,
        completionRate: Math.round(((currentQuestion + 1) / vrSession.questions.length) * 100),
        aiScore: aiScore,
        feedback: generateAIFeedback(aiScore),
        metrics: sessionMetrics
      };
      
      setSessionResults(results);
    }
    
    setSessionActive(false);
    setVrSession(null);
    setCurrentQuestion(0);
    setIsRecording(false);
    setRecordingStartTime(null);
    setQuestionStartTime(null);
  };

  const calculateRealisticScore = () => {
    let score = 0;
    
    // Base score for just starting (10 points)
    score += 10;
    
    // Recording time score (0-40 points)
    const recordingTimeScore = Math.min(40, (sessionMetrics.totalRecordingTime / 300) * 40); // Max 40 points for 5+ minutes of speaking
    score += recordingTimeScore;
    
    // Questions answered score (0-30 points)
    const questionScore = (sessionMetrics.questionsAnswered / vrSession.questions.length) * 30;
    score += questionScore;
    
    // Engagement score (0-20 points) - based on how well they used the recording feature
    if (sessionMetrics.totalRecordingTime > 60) score += 10; // Spoke for at least 1 minute
    if (sessionMetrics.questionsAnswered > 0) score += 10; // Attempted to answer questions
    
    // Penalize if no interaction
    if (sessionMetrics.totalRecordingTime < 10) {
      score = Math.max(5, score * 0.3); // Minimum 5 points, maximum 30% of calculated score
    }
    
    return Math.round(Math.max(5, Math.min(100, score))); // Ensure score is between 5-100
  };

  const generateAIFeedback = (score) => {
    let feedback = {
      overall: "",
      strengths: [],
      improvements: [],
      nextSteps: []
    };

    if (score < 30) {
      feedback.overall = "Limited interaction detected. To improve your score, try speaking more during the interview.";
      feedback.strengths = ["Completed the session", "Showed initiative by starting"];
      feedback.improvements = [
        "Speak out loud when answering questions",
        "Use the recording feature to practice responses",
        "Engage with each question for at least 30 seconds"
      ];
      feedback.nextSteps = [
        "Practice speaking your responses aloud",
        "Record yourself answering common interview questions",
        "Work on communication confidence"
      ];
    } else if (score < 60) {
      feedback.overall = "Good start! You engaged with the session but there's room for improvement.";
      feedback.strengths = [
        "Participated in the interview process",
        "Attempted to answer questions",
        "Showed engagement with the platform"
      ];
      feedback.improvements = [
        "Provide longer, more detailed responses",
        "Practice speaking clearly and confidently",
        "Work on structuring your answers better"
      ];
      feedback.nextSteps = [
        "Practice the STAR method for behavioral questions",
        "Rehearse technical explanations out loud",
        "Work on expanding your responses"
      ];
    } else if (score < 80) {
      feedback.overall = "Well done! Good engagement and communication during the interview.";
      feedback.strengths = [
        "Clear communication style",
        "Good engagement with questions",
        "Demonstrated interview preparation"
      ];
      feedback.improvements = [
        "Add more specific examples to responses",
        "Work on technical depth in answers",
        "Practice time management for responses"
      ];
      feedback.nextSteps = [
        "Practice advanced technical questions",
        "Prepare specific project examples",
        "Work on concise yet comprehensive answers"
      ];
    } else {
      feedback.overall = "Excellent performance! Strong communication and interview skills demonstrated.";
      feedback.strengths = [
        "Excellent communication skills",
        "Well-structured responses",
        "Strong technical knowledge demonstration",
        "Confident delivery"
      ];
      feedback.improvements = [
        "Continue practicing for consistency",
        "Explore advanced topics in your field",
        "Consider mentoring others"
      ];
      feedback.nextSteps = [
        "Focus on industry-specific advanced topics",
        "Practice leadership and scenario questions",
        "Prepare for senior-level interviews"
      ];
    }

    return feedback;
  };

  const toggleRecording = () => {
    const now = new Date();
    
    if (!isRecording) {
      // Start recording
      setIsRecording(true);
      setRecordingStartTime(now);
    } else {
      // Stop recording
      setIsRecording(false);
      
      if (recordingStartTime) {
        const recordingDuration = (now - recordingStartTime) / 1000; // in seconds
        setSessionMetrics(prev => ({
          ...prev,
          totalRecordingTime: prev.totalRecordingTime + recordingDuration
        }));
      }
      setRecordingStartTime(null);
    }
  };

  const nextQuestion = () => {
    // Stop any ongoing recording
    if (isRecording && recordingStartTime) {
      const now = new Date();
      const recordingDuration = (now - recordingStartTime) / 1000;
      setSessionMetrics(prev => ({
        ...prev,
        totalRecordingTime: prev.totalRecordingTime + recordingDuration
      }));
    }
    
    // Mark question as answered if they recorded something
    if (sessionMetrics.totalRecordingTime > 0 || isRecording) {
      setSessionMetrics(prev => ({
        ...prev,
        questionsAnswered: prev.questionsAnswered + 1
      }));
    }
    
    if (currentQuestion < vrSession.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setIsRecording(false);
      setRecordingStartTime(null);
      setQuestionStartTime(new Date());
    } else {
      endSession();
    }
  };

  const RoleCard = ({ role, isSelected, onClick }) => (
    <div 
      className={`p-4 rounded-lg cursor-pointer transition-all border-2 ${
        isSelected 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
      onClick={() => onClick(role.id)}
    >
      <div className="flex items-center mb-3">
        <div className={`w-12 h-12 ${role.color} rounded-lg flex items-center justify-center text-2xl mr-3`}>
          {role.icon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{role.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{role.description}</p>
        </div>
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{role.questions} questions</span>
        <span>{role.duration}</span>
      </div>
    </div>
  );

  const VRControls = () => (
    <div className="flex items-center justify-center space-x-4 p-4 bg-gray-900 text-white rounded-lg">
      <button
        onClick={toggleRecording}
        className={`p-3 rounded-full ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} transition-colors`}
      >
        {isRecording ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
      </button>
      
      <div className="flex items-center space-x-2">
        <Mic className={`w-5 h-5 ${isRecording ? 'text-red-400' : 'text-gray-400'}`} />
        <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-400 animate-pulse' : 'bg-gray-400'}`}></div>
        <span className="text-sm text-gray-300">
          Speaking: {Math.floor(sessionMetrics.totalRecordingTime / 60)}:{Math.floor(sessionMetrics.totalRecordingTime % 60).toString().padStart(2, '0')}
        </span>
      </div>
      
      <button
        onClick={nextQuestion}
        className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-medium transition-colors"
      >
        {currentQuestion < vrSession?.questions.length - 1 ? 'Next Question' : 'Finish Interview'}
      </button>
      
      <button
        onClick={endSession}
        className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-medium transition-colors"
      >
        End Session
      </button>
    </div>
  );

  const SessionResults = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Award className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Interview Complete!</h2>
        <p className="text-gray-600 dark:text-gray-400">Here's your AI-powered performance analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{sessionResults.aiScore}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">AI Score</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">{sessionResults.completionRate}%</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg text-center">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{sessionResults.duration}m</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Duration</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
            Strengths
          </h3>
          <ul className="space-y-2">
            {sessionResults.feedback.strengths.map((strength, index) => (
              <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Star className="w-4 h-4 mr-2 text-yellow-500" />
                {strength}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
            Areas for Improvement
          </h3>
          <ul className="space-y-2">
            {sessionResults.feedback.improvements.map((improvement, index) => (
              <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Target className="w-4 h-4 mr-2 text-orange-500" />
                {improvement}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-purple-500" />
          Recommended Next Steps
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sessionResults.feedback.nextSteps.map((step, index) => (
            <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">{step}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={() => {
            setSessionResults(null);
            setSelectedRole('');
          }}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
        >
          Start New Session
        </button>
        <button
          onClick={() => setSessionResults(null)}
          className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );

  if (sessionResults) {
    return (
      <div className="space-y-6">
        <SessionResults />
      </div>
    );
  }

  if (sessionActive && vrSession) {
    const currentQ = vrSession.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / vrSession.questions.length) * 100;

    return (
      <div className="space-y-6">
        {/* VR Session Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">🥽 VR Interview Session Active</h2>
              <p className="text-purple-100">
                {interviewRoles.find(r => r.id === selectedRole)?.title} Interview
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{currentQuestion + 1}/{vrSession.questions.length}</div>
              <div className="text-purple-200">Questions</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-purple-700 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Current Question */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                currentQ.difficulty === 'easy' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                currentQ.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
              }`}>
                {currentQ.difficulty.charAt(0).toUpperCase() + currentQ.difficulty.slice(1)}
              </div>
              <span className="text-sm text-gray-500">{currentQ.category}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              {Math.floor(currentQ.expectedDuration / 60)}:{(currentQ.expectedDuration % 60).toString().padStart(2, '0')}
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Question {currentQuestion + 1}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
            {currentQ.question}
          </p>
        </div>

        {/* VR Controls */}
        <VRControls />

        {/* Real-time Score Preview */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-blue-500" />
            Score Preview (Live)
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <div className="text-lg font-bold text-blue-600">{Math.floor(sessionMetrics.totalRecordingTime / 60)}:{Math.floor(sessionMetrics.totalRecordingTime % 60).toString().padStart(2, '0')}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Speaking Time</div>
            </div>
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
              <div className="text-lg font-bold text-green-600">{sessionMetrics.questionsAnswered}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Questions Answered</div>
            </div>
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
              <div className="text-lg font-bold text-purple-600">{Math.round(((currentQuestion + 1) / vrSession.questions.length) * 100)}%</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Progress</div>
            </div>
            <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
              <div className="text-lg font-bold text-orange-600">
                {sessionMetrics.totalRecordingTime > 60 ? Math.min(85, 20 + Math.floor(sessionMetrics.totalRecordingTime / 10)) : Math.max(5, Math.floor(sessionMetrics.totalRecordingTime / 2))}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Estimated Score</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500 text-center">
            💡 Tip: Speak for at least 30 seconds per question to improve your score
          </div>
        </div>

        {/* VR Environment Simulation */}
        <div className="bg-gradient-to-b from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 p-8 rounded-lg text-center">
          <div className="animate-pulse">
            <Eye className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <p className="text-blue-800 dark:text-blue-200 font-medium">
              VR Environment: {vrEnvironments.find(env => env.id === vrSettings.environment)?.name}
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-300 mt-2">
              {isRecording ? '🔴 Recording your response...' : '⏸️ Paused - Click play to continue'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">🥽 VR Interview Preparation</h2>
            <p className="text-purple-100">
              Experience realistic interview scenarios with AI-powered feedback
            </p>
          </div>
          <div className="text-right">
            <Headphones className="w-12 h-12 mx-auto mb-2" />
            <div className="text-purple-200 text-sm">Immersive Experience</div>
          </div>
        </div>
      </div>

      {/* VR Mode Selection */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Choose Your Experience</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: 'desktop', name: 'Desktop Mode', icon: '💻', desc: 'Standard screen experience' },
            { id: 'vr', name: 'VR Mode', icon: '🥽', desc: 'Full VR immersion (requires headset)' },
            { id: 'ar', name: 'AR Mode', icon: '📱', desc: 'Augmented reality overlay' }
          ].map(mode => (
            <div
              key={mode.id}
              className={`p-4 rounded-lg cursor-pointer transition-all border-2 ${
                vrMode === mode.id
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setVrMode(mode.id)}
            >
              <div className="text-3xl mb-2">{mode.icon}</div>
              <h4 className="font-medium text-gray-900 dark:text-white">{mode.name}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{mode.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Interview Role Selection */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Select Interview Role</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {interviewRoles.map(role => (
            <RoleCard
              key={role.id}
              role={role}
              isSelected={selectedRole === role.id}
              onClick={setSelectedRole}
            />
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Session Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Difficulty Level
            </label>
            <select
              value={vrSettings.difficulty}
              onChange={(e) => setVrSettings({...vrSettings, difficulty: e.target.value})}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="easy">Easy (Beginner friendly)</option>
              <option value="medium">Medium (Intermediate level)</option>
              <option value="hard">Hard (Advanced concepts)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Session Duration (minutes)
            </label>
            <input
              type="number"
              min="15"
              max="90"
              value={vrSettings.duration}
              onChange={(e) => setVrSettings({...vrSettings, duration: parseInt(e.target.value)})}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              VR Environment
            </label>
            <select
              value={vrSettings.environment}
              onChange={(e) => setVrSettings({...vrSettings, environment: e.target.value})}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {vrEnvironments.map(env => (
                <option key={env.id} value={env.id}>{env.icon} {env.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeVideo"
              checked={vrSettings.includeVideo}
              onChange={(e) => setVrSettings({...vrSettings, includeVideo: e.target.checked})}
              className="mr-2"
            />
            <label htmlFor="includeVideo" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Enable video recording for body language analysis
            </label>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={startVRSession}
          disabled={!selectedRole || isLoading}
          className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all ${
            !selectedRole || isLoading
              ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transform hover:scale-105'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Initializing VR Session...
            </div>
          ) : (
            <div className="flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Start VR Interview
            </div>
          )}
        </button>
        {!selectedRole && (
          <p className="text-sm text-gray-500 mt-2">Please select an interview role to continue</p>
        )}
      </div>
      <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🚀 VR Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: '🎯', title: 'AI-Powered Analysis', desc: 'Real-time feedback on your responses' },
            { icon: '🎭', title: 'Realistic Environments', desc: 'Immersive office and meeting room settings' },
            { icon: '📊', title: 'Performance Metrics', desc: 'Detailed analytics and improvement suggestions' },
            { icon: '🎤', title: 'Speech Analysis', desc: 'Voice tone, pace, and clarity evaluation' },
            { icon: '👁️', title: 'Body Language', desc: 'Posture and gesture analysis (VR mode)' },
            { icon: '📚', title: 'Role-Specific Questions', desc: 'Customized questions for your target role' }
          ].map((feature, index) => (
            <div key={index} className="p-4 bg-white dark:bg-gray-800 rounded-lg">
              <div className="text-2xl mb-2">{feature.icon}</div>
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">{feature.title}</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VRInterviewPrep;
