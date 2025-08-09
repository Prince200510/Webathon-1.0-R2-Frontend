import { useState, useEffect } from 'react';
import { aiAPI } from '../utils/api';
import { TrendingUp,  Target,  BookOpen,  Award,  Clock,  DollarSign,  Users,  BarChart3, Lightbulb, ArrowRight, Star, MapPin, Briefcase, GraduationCap, Brain, Zap} from 'lucide-react';

const CareerPathway = () => {
  const [careerData, setCareerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [userSkills, setUserSkills] = useState([]);

  const fetchCareerPathway = async () => {
    setLoading(true);
    try {
      const response = await aiAPI.getCareerPathway();
      setCareerData(response.data.data);
      if (response.data.data.careerRecommendations.length > 0) {
        setSelectedCareer(response.data.data.careerRecommendations[0]);
      }
    } catch (error) {
      console.error('Error fetching career pathway:', error);
      // Set fallback data if API fails
      const fallbackData = getFallbackData();
      setCareerData(fallbackData);
      setSelectedCareer(fallbackData.careerRecommendations[0]);
    } finally {
      setLoading(false);
    }
  };

  const getFallbackData = () => ({
    careerRecommendations: [
      {
        title: "Software Engineer",
        match: 85,
        description: "Develop software applications and systems",
        requirements: ["Programming skills", "Problem-solving", "Team collaboration"],
        averageSalary: "₹6-15 LPA",
        growthProspect: "Excellent",
        whyRecommended: "Strong foundation in computer science concepts"
      },
      {
        title: "Data Scientist",
        match: 75,
        description: "Analyze complex data to derive insights",
        requirements: ["Statistics", "Machine Learning", "Python/R"],
        averageSalary: "₹8-20 LPA",
        growthProspect: "Very High",
        whyRecommended: "Growing field with high demand"
      }
    ],
    skillAnalysis: {
      currentSkills: [
        { name: "Academic Foundation", level: 75, description: "Strong academic performance" }
      ],
      requiredSkills: [
        { name: "Programming", importance: "High", description: "Essential for software development" }
      ],
      skillGaps: ["Industry experience", "Practical project work"]
    },
    learningPath: {
      shortTerm: [
        {
          title: "Strengthen Core Subjects",
          timeline: "1-3 months",
          resources: ["Online courses", "Practice problems"],
          priority: "High"
        }
      ],
      mediumTerm: [
        {
          title: "Gain Practical Experience",
          timeline: "6-12 months",
          resources: ["Internships", "Projects"],
          priority: "High"
        }
      ],
      longTerm: [
        {
          title: "Specialize in Chosen Field",
          timeline: "1-2 years",
          resources: ["Advanced courses", "Industry mentorship"],
          priority: "High"
        }
      ]
    },
    aiInsights: {
      strengths: ["Academic performance", "Learning consistency"],
      opportunities: ["Emerging technologies", "Industry growth"],
      recommendations: ["Focus on practical skills", "Build professional network"],
      industryTrends: ["Digital transformation", "AI/ML integration"]
    },
    nextSteps: [
      {
        action: "Complete relevant online certifications",
        timeline: "Next 3 months",
        importance: "High"
      }
    ]
  });

  useEffect(() => {
    fetchCareerPathway();
  }, []);

  const SkillProgressBar = ({ skill, level }) => (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-gray-700 dark:text-gray-300">{skill}</span>
        <span className="text-blue-600 dark:text-blue-400">{level}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000"
          style={{ width: `${level}%` }}
        ></div>
      </div>
    </div>
  );

  const CareerCard = ({ career, isSelected, onClick }) => (
    <div 
      className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
        isSelected 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg transform scale-105' 
          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:shadow-md'
      } bg-white dark:bg-gray-800`}
      onClick={() => onClick(career)}
    >
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
          <Briefcase className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{career.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{career.field}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center text-green-600">
            <DollarSign className="w-4 h-4 mr-1" />
            <span>{career.salary}</span>
          </div>
          <div className="flex items-center text-blue-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>{career.growth}%</span>
          </div>
        </div>
        <div className="flex items-center text-yellow-500">
          <Star className="w-4 h-4 mr-1" />
          <span>{career.matchScore}%</span>
        </div>
      </div>
    </div>
  );

  const LearningPath = ({ path }) => (
    <div className="space-y-4">
      {(path || []).map((step, index) => (
        <div key={index} className="flex items-start space-x-4">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-purple-500' : 'bg-gray-400'
            } text-white font-semibold text-sm`}>
              {index + 1}
            </div>
            {index < path.length - 1 && (
              <div className="w-0.5 h-8 bg-gray-300 dark:bg-gray-600 mt-2"></div>
            )}
          </div>
          <div className="flex-1 pb-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{step.title}</h4>
            {step.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{step.description}</p>
            )}
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                <span>{step.timeline}</span>
              </div>
              <div className="flex items-center">
                <Target className="w-3 h-3 mr-1" />
                <span>{step.priority}</span>
              </div>
            </div>
            {step.resources && (
              <div className="mt-2">
                <div className="flex flex-wrap gap-1">
                  {step.resources.map((resource, resourceIndex) => (
                    <span 
                      key={resourceIndex}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs"
                    >
                      {resource}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">AI is analyzing your career pathway...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!careerData) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
        <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Career Pathway Analysis
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Let AI analyze your skills and learning progress to suggest personalized career paths.
        </p>
        <button
          onClick={fetchCareerPathway}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          Generate Career Pathway
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Generating your AI career pathway...</p>
        </div>
      </div>
    );
  }

  if (!careerData) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <Brain className="h-16 w-16 mx-auto mb-4" />
          <p>Unable to generate career pathway at the moment.</p>
          <button 
            onClick={fetchCareerPathway}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">🚀 AI Career Pathway</h2>
            <p className="text-blue-100">
              Powered by Gemini Flash 2.0 • Personalized career recommendations based on your skills and interests
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">85%</div>
            <div className="text-blue-200">Career Match</div>
          </div>
        </div>
      </div>

      {/* Career Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-yellow-500" />
          Top Career Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {(careerData.careerRecommendations || []).map((career, index) => (
            <CareerCard
              key={index}
              career={career}
              isSelected={selectedCareer?.title === career.title}
              onClick={setSelectedCareer}
            />
          ))}
        </div>
      </div>

      {/* Selected Career Details */}
      {selectedCareer && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Career Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-blue-500" />
              {selectedCareer.title} Overview
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{selectedCareer.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="font-semibold text-green-600">{selectedCareer.salary}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Average Salary</div>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="font-semibold text-blue-600">{selectedCareer.growth}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Job Growth</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Top Companies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(selectedCareer.companies || ['Tech Companies', 'Startups', 'IT Services']).map((company, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                    >
                      {company}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Popular Locations
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(selectedCareer.locations || ['Bangalore', 'Mumbai', 'Pune', 'Hyderabad']).map((location, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                    >
                      {location}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Learning Path */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-purple-500" />
              Recommended Learning Path
            </h3>
            
            {/* Short Term Goals */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <Target className="w-4 h-4 mr-2 text-green-500" />
                Short Term (1-3 months)
              </h4>
              <LearningPath path={careerData.learningPath?.shortTerm || []} />
            </div>

            {/* Medium Term Goals */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <Target className="w-4 h-4 mr-2 text-blue-500" />
                Medium Term (6-12 months)
              </h4>
              <LearningPath path={careerData.learningPath?.mediumTerm || []} />
            </div>

            {/* Long Term Goals */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <Target className="w-4 h-4 mr-2 text-purple-500" />
                Long Term (1-2 years)
              </h4>
              <LearningPath path={careerData.learningPath?.longTerm || []} />
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                <Lightbulb className="w-4 h-4 mr-2 text-yellow-500" />
                AI Recommendation
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedCareer.whyRecommended || "This career path aligns well with your skills and interests based on our AI analysis."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Skills Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-green-500" />
          Your Skills Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Current Skills</h4>
            {(careerData.skillAnalysis?.currentSkills || []).map((skill, index) => (
              <SkillProgressBar key={index} skill={skill.name} level={skill.level} />
            ))}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Skills to Develop</h4>
            {(careerData.skillAnalysis?.requiredSkills || []).map((skill, index) => (
              <div key={index} className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{skill.name}</span>
                  <span className="text-yellow-600 dark:text-yellow-400 text-sm">{skill.importance}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{skill.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Award className="w-5 h-5 mr-2 text-orange-500" />
          Next Steps
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(careerData.nextSteps || []).map((action, index) => (
            <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">{action.action}</h4>
                <ArrowRight className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{action.timeline}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Importance: {action.importance}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareerPathway;
