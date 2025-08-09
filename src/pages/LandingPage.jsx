import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { BookOpen,   Users,   Award,   PlayCircle,   Star,   MessageSquare,   TrendingUp,   Shield,  Sun,  Moon,  Menu,  X,  ChevronRight,  CheckCircle,  Globe,  Zap,  Heart,  Brain,  Clock,  Target,  Lightbulb,  GraduationCap,  Laptop,  Coffee,  Github,  Linkedin,  Twitter,  ArrowRight,  Code,  Database,  Smartphone,  Calculator,  Atom,  Palette,  Music,  Languages,  ChevronDown} from 'lucide-react'
import princeImage from '../assest/prince.jpg'
import maazImage from '../assest/maaz.png'

const LandingPage = () => {
  const { isDarkMode, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const educationalElements = [
    { icon: Calculator, label: 'Mathematics', color: 'text-blue-400' },
    { icon: Atom, label: 'Physics', color: 'text-green-400' },
    { icon: Code, label: 'Programming', color: 'text-yellow-400' },
    { icon: Palette, label: 'Arts', color: 'text-pink-400' },
    { icon: Music, label: 'Music', color: 'text-indigo-400' },
    { icon: Languages, label: 'Languages', color: 'text-red-400' },
    { icon: BookOpen, label: 'Literature', color: 'text-cyan-400' }
  ]

  const features = [
    {
      icon: Users,
      title: "Expert Mentors",
      description: "Connect with 1,500+ verified industry professionals and academic experts from top universities and companies worldwide"
    },
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Advanced AI generates personalized quizzes, study materials, and learning paths tailored to your unique learning style"
    },
    {
      icon: MessageSquare,
      title: "Real-time Communication",
      description: "Instant messaging, video calls, and collaborative whiteboards for seamless learning experience anytime, anywhere"
    },
    {
      icon: PlayCircle,
      title: "Interactive Sessions",
      description: "Live video sessions with screen sharing, recording, and interactive tools for better engagement and understanding"
    },
    {
      icon: Award,
      title: "Gamified Learning",
      description: "Earn points, unlock achievements, and compete on leaderboards while mastering new skills and concepts"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Enterprise-grade security with end-to-end encryption for all your learning activities and personal data"
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Access learning materials and get help anytime, anywhere with our global mentor network across time zones"
    },
    {
      icon: Target,
      title: "Goal Tracking",
      description: "Set learning objectives and track your progress with detailed analytics, insights, and personalized recommendations"
    },
    {
      icon: Lightbulb,
      title: "Smart Recommendations",
      description: "AI-driven suggestions for courses, mentors, and study materials based on your learning patterns and goals"
    }
  ]

  const stats = [
    { number: "25K+", label: "Active Students", desc: "Learning daily on our platform" },
    { number: "1.5K+", label: "Expert Mentors", desc: "From top companies globally" },
    { number: "100+", label: "Subject Areas", desc: "Comprehensive coverage" },
    { number: "98%", label: "Success Rate", desc: "Student satisfaction score" }
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Computer Science Student • MIT",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face",
      content: "EduConnect completely transformed my coding journey. The AI-generated practice problems and expert mentorship helped me land internships at Google and Microsoft!",
      rating: 5,
      course: "Advanced Algorithms & Data Structures"
    },
    {
      name: "Michael Rodriguez",
      role: "Engineering Student • Stanford",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
      content: "The mentors here are incredible. Real industry professionals who provide practical insights you can't get from textbooks. My problem-solving skills improved dramatically.",
      rating: 5,
      course: "Machine Learning & AI"
    },
    {
      name: "Priya Sharma",
      role: "Data Science Student • IIT Delhi",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
      content: "Live sessions with real-time doubt solving made complex statistical concepts crystal clear. The interactive approach helped me secure a data scientist role!",
      rating: 5,
      course: "Statistics & Data Analytics"
    }
  ]

  const teamMembers = [
    {
      name: "Prince Maurya",
      role: "Fullstack Developer",
      image: princeImage,
      bio: "I am a student studying computer engineering. I know how to use many computer languages like C, C++, Java, HTML/CSS, Python, SQL, React JS, and MySQL. Besides programming, I also understand Augmented Reality (AR) and Virtual Reality (VR) technologies.",
      education: "TCET, Computer Engineering",
      experience: "Nimap Infotech - Internship",
      social: {
        linkedin: "https://www.linkedin.com/in/prince-maurya-810b83277",
        twitter: "#",
        github: "https://github.com/Prince200510"
      },
      skills: ["Product Strategy", "AI/ML", "Team Leadership", "EdTech Innovation"]
    },
    {
      name: "Maaz Shaikh",
      role: "MERN Stack Developer",
      image: maazImage,
      bio: "I'm a passionate software developer with a strong focus on the MERN stack, IoT projects, and Python. I love building full-stack web applications and exploring the endless possibilities of IoT devices. I'm always eager to learn new technologies and improve my skills.",
      education: "Computer Engineering",
      experience: "Full-Stack Web Development & IoT Projects",
      social: {
        linkedin: "#",
        twitter: "#",
        github: "#"
      },
      skills: ["MERN Stack", "React", "Node.js", "MongoDB", "IoT Development", "Python"]
    }
  ]

  const subjects = [
    { name: "Mathematics", icon: "📊", students: "5.2K+", difficulty: "All Levels" },
    { name: "Computer Science", icon: "💻", students: "8.1K+", difficulty: "Beginner to Advanced" },
    { name: "Physics", icon: "⚛️", students: "3.4K+", difficulty: "Intermediate" },
    { name: "Chemistry", icon: "🧪", students: "2.8K+", difficulty: "All Levels" },
    { name: "Biology", icon: "🧬", students: "3.1K+", difficulty: "Beginner to Advanced" },
    { name: "Economics", icon: "📈", students: "2.5K+", difficulty: "Intermediate" },
    { name: "Business", icon: "💼", students: "4.3K+", difficulty: "All Levels" },
    { name: "Literature", icon: "📚", students: "1.9K+", difficulty: "All Levels" },
    { name: "History", icon: "🏛️", students: "1.2K+", difficulty: "Beginner" },
    { name: "Psychology", icon: "🧠", students: "2.1K+", difficulty: "Intermediate" }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <nav className="fixed top-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md z-50 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EduConnect
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Features</a>
              <a href="#team" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Team</a>
              <a href="#testimonials" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Reviews</a>
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              >
                {isDarkMode ? 
                  <Sun className="w-5 h-5 text-yellow-500" /> : 
                  <Moon className="w-5 h-5 text-blue-600" />
                }
              </button>
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/admin/login"
                  className="flex items-center px-4 py-2.5 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-700 rounded-xl font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-300 transition-all"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Admin
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl"
                >
                  Get Started Free
                </Link>
              </div>
            </div>
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
              >
                {isDarkMode ? 
                  <Sun className="w-5 h-5 text-yellow-500" /> : 
                  <Moon className="w-5 h-5 text-blue-600" />
                }
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                <a href="#features" className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 rounded-lg transition-colors">
                  Features
                </a>
                <a href="#team" className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 rounded-lg transition-colors">
                  Team
                </a>
                <a href="#testimonials" className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 rounded-lg transition-colors">
                  Reviews
                </a>
                <div className="pt-2 space-y-2">
                  <Link
                    to="/login"
                    className="block w-full text-center px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/admin/login"
                    className="flex items-center justify-center w-full px-4 py-2 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-700 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Admin Login
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full text-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    Get Started Free
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20"></div>
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 dark:bg-purple-800 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-yellow-200 dark:bg-yellow-700 rounded-full opacity-25"></div>
        {educationalElements.map((element, index) => (
          <div
            key={index}
            className={`absolute opacity-10 dark:opacity-20 animate-float-slow ${element.color}`}
            style={{
              top: `${10 + (index * 15) % 80}%`,
              left: `${5 + (index * 20) % 90}%`,
              animationDelay: `${index * 0.5}s`,
              fontSize: '2rem'
            }}
          >
            <element.icon size={32} />
          </div>
        ))}
        <div className="absolute top-1/4 left-1/4 text-gray-300 dark:text-gray-700 font-mono text-lg transform rotate-12 animate-pulse">
          f(x) = ax² + bx + c
        </div>
        <div className="absolute top-1/3 right-1/4 text-gray-300 dark:text-gray-700 font-mono text-sm transform -rotate-12 animate-pulse">
          &lt;div className="learning"&gt;
        </div>
        <div className="absolute bottom-1/3 left-1/3 text-gray-300 dark:text-gray-700 font-mono text-lg transform rotate-6 animate-pulse">
          E = mc²
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                🎉 Join 25,000+ students already learning with us
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
              Transform Your
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Learning Journey
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-10 leading-relaxed">
              Connect with world-class mentors, access AI-powered learning tools, and join a thriving community 
              of learners dedicated to academic excellence and professional growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                to="/register"
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl"
              >
                Start Learning for Free
                <ArrowRight className="w-5 h-5 inline ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="group px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold text-lg hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all">
                <PlayCircle className="w-5 h-5 inline mr-2 group-hover:scale-110 transition-transform" />
                Watch Demo
              </button>
            </div>
            <div className="hidden lg:block">
              <div className="absolute top-1/4 left-8 animate-float">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
                  <Code className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="absolute top-1/3 right-8 animate-float-delay">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
                  <GraduationCap className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-900 dark:text-white font-semibold mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="features" className="py-20 bg-white dark:bg-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wide">Features</span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mt-2 mb-4">
              Why Choose EduConnect?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover the comprehensive features that make learning effective, engaging, and enjoyable for students worldwide
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group p-8 rounded-2xl bg-gray-50 dark:bg-gray-700 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-600 dark:hover:to-purple-900/30 transition-all duration-300 hover:shadow-xl hover:scale-105 border border-transparent hover:border-blue-200 dark:hover:border-blue-700">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="team" className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wide">Our Team</span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mt-2 mb-4">Meet the Visionaries</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">Passionate educators and technologists working together to revolutionize online learning</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {teamMembers.map((member, index) => (
              <div key={index} className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-80 object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                    <p className="text-blue-200 font-medium">{member.role}</p>
                  </div>
                </div>
                <div className="p-8">
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {member.bio}
                  </p>
                  <div className="space-y-3 mb-6">
                    <div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">Education: </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{member.education}</span>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">Experience: </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{member.experience}</span>
                    </div>
                  </div>
                  <div className="mb-6">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white mb-3 block">Skills & Expertise:</span>
                    <div className="flex flex-wrap gap-2">
                      {member.skills.map((skill, skillIndex) => (
                        <span key={skillIndex} className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    {member.social.linkedin && (
                      <a href={member.social.linkedin} className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {member.social.twitter && (
                      <a href={member.social.twitter} className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                    {member.social.github && (
                      <a href={member.social.github} className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-white dark:bg-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wide">Subjects</span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mt-2 mb-4">
              Subjects We Cover
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Expert guidance across all major academic disciplines with personalized learning approaches
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {subjects.map((subject, index) => (
              <div key={index} className="group p-6 bg-gray-50 dark:bg-gray-700 rounded-2xl text-center hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-600 dark:hover:to-purple-900/30 transition-all cursor-pointer hover:scale-105 hover:shadow-lg border border-transparent hover:border-blue-200 dark:hover:border-blue-700">
                <div className="text-4xl mb-3">{subject.icon}</div>
                <div className="text-gray-900 dark:text-white font-semibold mb-2">
                  {subject.name}
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">
                  {subject.students}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {subject.difficulty}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="testimonials" className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wide">Testimonials</span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mt-2 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">Hear from students who have transformed their learning journey with EduConnect</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-700 dark:to-purple-900/30 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200 dark:border-gray-600">
              <div className="flex items-center space-x-1 mb-6">
                {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed font-medium">
                "{testimonials[activeTestimonial].content}"
              </blockquote>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={testimonials[activeTestimonial].image}
                    alt={testimonials[activeTestimonial].name}
                    className="w-16 h-16 rounded-full border-4 border-white dark:border-gray-600 shadow-lg"
                  />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white text-lg">
                      {testimonials[activeTestimonial].name}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {testimonials[activeTestimonial].role}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    Course: {testimonials[activeTestimonial].course}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-8 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === activeTestimonial
                      ? 'bg-blue-600 w-8'
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to Transform Your Future?</h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">Join 25,000+ students who have already accelerated their learning journey with world-class mentors and AI-powered tools</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              to="/register"
              className="group px-10 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl"
            >
              Start Learning Today - It's Free!
              <ArrowRight className="w-5 h-5 inline ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-10 py-4 border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all">
              Schedule a Demo
            </button>
          </div>
          <div className="mt-8 text-blue-100">
            <p className="text-sm">No credit card required • Start learning in under 2 minutes</p>
          </div>
        </div>
      </section>
      <footer className="bg-gray-900 dark:bg-black text-white py-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">EduConnect</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                Empowering students worldwide through personalized learning experiences, expert mentorship, 
                and cutting-edge AI technology.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-6 text-lg">Platform</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Find Mentors</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Courses</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mobile App</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-6 text-lg">Support</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <div className="text-center mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 inline-block">
                <p className="text-white font-semibold text-lg">
                  🏆 Built for TCET-ACM-Webathon 1.0 Round 2
                </p>
                <p className="text-blue-100 text-sm mt-1">
                  Innovating the future of education technology
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 mb-4 md:mb-0">
                &copy; 2025 EduConnect. All rights reserved.
              </p>
              <div className="flex space-x-6 text-gray-400 text-sm">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
