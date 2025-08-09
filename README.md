# 🎓 EduConnect - AI-Powered Learning Platform

<div align="center">
  <img src="https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=EduConnect+Platform" alt="EduConnect Banner" />
  
  [![Built for TCET-ACM-Webathon](https://img.shields.io/badge/Built%20for-TCET--ACM--Webathon%201.0-blue.svg)](https://tcet.ac.in)
  [![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?logo=mongodb)](https://mongodb.com/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
</div>

## 🌟 Project Overview

**EduConnect** is a revolutionary AI-powered learning platform designed to transform the educational experience by connecting students with expert mentors, providing personalized learning paths, and leveraging cutting-edge AI technology to enhance knowledge acquisition.

Built for **TCET-ACM-Webathon 1.0 Round 2**, this platform addresses the growing need for personalized, accessible, and interactive online education.

## 🎯 Problem Statement

### Current Educational Challenges:

- **Limited Access to Quality Mentors**: Students struggle to find expert guidance in specific subjects
- **One-Size-Fits-All Learning**: Traditional education doesn't adapt to individual learning styles
- **Lack of Interactive Learning**: Static content fails to engage modern learners
- **No Real-time Support**: Students often get stuck without immediate help
- **Progress Tracking Gaps**: Difficulty in monitoring learning progress effectively
- **Gamification Absence**: Learning lacks motivation and engagement elements

## 💡 Our Solution

EduConnect provides a comprehensive solution through:

### 🧑‍🏫 **Expert Mentor Network**

- Connect with 1,500+ verified industry professionals
- Real-time mentorship from top universities and companies
- Subject-specific expert guidance

### 🤖 **AI-Powered Learning**

- Personalized quiz generation using Google Gemini AI
- AI-powered career pathway recommendations and insights
- Adaptive learning paths based on individual progress
- Smart content recommendations

### 💬 **Real-time Communication**

- Instant messaging system
- Video calling capabilities
- Collaborative whiteboards
- Screen sharing for better learning

### 🏆 **Gamification System**

- Points and badges for achievements
- Leaderboards for healthy competition
- Progress tracking and streaks
- Milestone celebrations

### 📊 **Advanced Analytics**

- Detailed progress insights
- Performance analytics
- Learning pattern recognition
- Goal tracking and recommendations

## 🏗️ Technical Architecture

### Frontend Architecture

```
📦 Frontend (React.js)
├── 🎨 UI/UX Components
│   ├── Responsive Design (Tailwind CSS)
│   ├── Dark/Light Theme Support
│   ├── Interactive Animations
│   └── Mobile-First Approach
├── 🔐 Authentication System
│   ├── JWT Token Management
│   ├── Role-based Access Control
│   ├── Protected Routes
│   └── Session Management
├── 📱 Core Features
│   ├── Dashboard (Student/Mentor/Admin)
│   ├── Live Chat Interface
│   ├── Quiz Generation & Taking
│   ├── Video Calling Integration
│   ├── Resource Management
│   ├── Notification Center
│   └── Profile Management
└── 🌐 State Management
    ├── Context API
    ├── React Hooks
    └── Local Storage Integration
```

### Backend Architecture - backend is uploaded in the https://github.com/Prince200510/Webathon-1.0-R2-Backend

```
📦 Backend (Node.js + Express)
├── 🗃️ Database Layer (MongoDB)
│   ├── User Management
│   ├── Quiz & Attempts
│   ├── Chat Messages
│   ├── Sessions & Bookings
│   ├── Resources & Files
│   ├── Notifications
│   └── Activity Tracking
├── 🔐 Authentication & Security
│   ├── JWT Token System
│   ├── Password Encryption (bcrypt)
│   ├── Rate Limiting
│   ├── Input Validation
│   └── CORS Configuration
├── 🤖 AI Integration
│   ├── Google Gemini API
│   ├── Quiz Generation
│   ├── Content Recommendations
│   └── Smart Suggestions
├── 📡 Real-time Features
│   ├── Socket.io Integration
│   ├── Live Chat
│   ├── Notifications
│   └── Activity Updates
├── 📁 File Management
│   ├── Multer for Uploads
│   ├── Resource Storage
│   ├── Image Processing
│   └── File Security
└── 🌐 External Integrations
    ├── WhatsApp API
    ├── Email Services
    ├── Video Calling APIs
    └── Payment Gateways
```

## 🚀 Features

### 👨‍🎓 **For Students**

- **Personalized Dashboard**: Track progress, upcoming sessions, and achievements
- **AI Quiz Generation**: Get custom quizzes based on your learning needs
- **AI Career Pathway**: Get personalized career recommendations powered by Google Gemini AI
- **VR Interview Preparation**: Practice interviews in immersive VR environments with AI feedback
- **Mentor Booking**: Find and book sessions with expert mentors
- **Real-time Chat**: Instant communication with mentors and peers
- **Resource Library**: Access curated learning materials
- **Progress Tracking**: Monitor your learning journey with detailed analytics
- **Gamification**: Earn points, badges, and climb leaderboards

### 👨‍🏫 **For Mentors**

- **Mentor Dashboard**: Manage students, sessions, and earnings
- **Availability Management**: Set your available time slots
- **Session Management**: Conduct and track mentoring sessions
- **Student Progress**: Monitor student performance and provide feedback
- **Resource Sharing**: Upload and share learning materials
- **Communication Tools**: Chat and video call with students

### 👨‍💼 **For Administrators**

- **Admin Panel**: Comprehensive platform management
- **User Management**: Manage students, mentors, and permissions
- **Content Moderation**: Review and approve resources
- **Analytics Dashboard**: Platform-wide statistics and insights
- **Notification System**: Send announcements and updates
- **Revenue Tracking**: Monitor platform revenue and transactions

## 🛠️ Technology Stack

### Frontend Technologies

| Technology           | Version | Purpose                 |
| -------------------- | ------- | ----------------------- |
| **React.js**         | 18.2.0  | Frontend Framework      |
| **Vite**             | 4.x     | Build Tool & Dev Server |
| **Tailwind CSS**     | 3.x     | Styling Framework       |
| **Lucide React**     | Latest  | Icon Library            |
| **React Router**     | 6.x     | Client-side Routing     |
| **Axios**            | Latest  | HTTP Client             |
| **Socket.io Client** | Latest  | Real-time Communication |

### Backend Technologies

| Technology            | Version | Purpose                 |
| --------------------- | ------- | ----------------------- |
| **Node.js**           | 18.x    | Runtime Environment     |
| **Express.js**        | 4.x     | Web Framework           |
| **MongoDB**           | 6.0     | Database                |
| **Mongoose**          | 7.x     | ODM for MongoDB         |
| **Socket.io**         | Latest  | Real-time Communication |
| **JWT**               | Latest  | Authentication          |
| **bcryptjs**          | Latest  | Password Hashing        |
| **Multer**            | Latest  | File Upload             |
| **Google Gemini API** | Latest  | AI Integration          |

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Nodemon** - Development server
- **Postman** - API testing
- **Git** - Version control

## 🥽 VR Interview Preparation

Experience next-generation interview preparation with our immersive VR technology:

### ✨ VR Features

- **🎯 Realistic Environments**: Practice in virtual office spaces, conference rooms, and startup environments
- **🎭 Role-Specific Scenarios**: Customized interview questions for Software Engineers, Data Scientists, Product Managers, and Business Analysts
- **🤖 AI-Powered Analysis**: Real-time feedback on speech patterns, body language, and response quality
- **📊 Performance Metrics**: Detailed analytics on communication skills, confidence levels, and technical knowledge
- **🎤 Speech Analysis**: Voice tone, pace, clarity, and filler word detection
- **👁️ Body Language Tracking**: Posture, eye contact, and gesture analysis (VR mode)
- **🏆 Scoring System**: AI-generated scores with personalized improvement recommendations

### 🎮 Experience Modes

- **💻 Desktop Mode**: Standard screen-based practice with video recording
- **🥽 VR Mode**: Full immersion with VR headset support (Oculus, HTC Vive, etc.)
- **📱 AR Mode**: Augmented reality overlay for mobile devices

### 🎯 Interview Types

- **Technical Interviews**: Coding challenges, system design, and algorithmic thinking
- **Behavioral Interviews**: STAR method practice and soft skills assessment
- **Case Studies**: Business problem-solving and analytical thinking
- **Presentation Skills**: Public speaking and presentation delivery

### 📈 AI Feedback System

- **Strengths Identification**: Highlight your best qualities and communication skills
- **Improvement Areas**: Specific suggestions for enhancement
- **Industry Benchmarks**: Compare your performance with industry standards
- **Progress Tracking**: Monitor improvement over multiple sessions

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18.x or higher)
- **npm** or **yarn** package manager
- **MongoDB** (local installation or MongoDB Atlas)
- **Git** for version control
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

## ⚡ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Prince200510/educonnect.git
cd educonnect
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure your environment variables in .env file
# Add MongoDB URI, JWT secrets, API keys, etc.

# Start the backend server
npm start
# or for development
npm run dev
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (in new terminal)
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure your environment variables
# Add backend API URL, etc.

# Start the frontend development server
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: mongodb://localhost:27017 (if running locally)

## 🔧 Configuration

### Environment Variables

#### Backend (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/edtech-platform

# Authentication
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

# AI Integration
GEMINI_API_KEY=your_gemini_api_key

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# External APIs
WHATSAPP_TOKEN=your_whatsapp_token
WHATSAPP_INSTANCE_ID=your_instance_id
WHATSAPP_API_URL=https://api.ultramsg.com/instance123/messages/chat

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env)

```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api

# Socket.io URL
VITE_SOCKET_URL=http://localhost:5000

# Environment
VITE_NODE_ENV=development
```

## 📁 Project Structure

```
📦 EduConnect/
├── 📁 backend/
│   ├── 📁 config/
│   │   └── database.js
│   ├── 📁 controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── quizController.js
│   │   ├── chatController.js
│   │   ├── sessionController.js
│   │   ├── resourceController.js
│   │   ├── notificationController.js
│   │   └── adminController.js
│   ├── 📁 middleware/
│   │   ├── auth.js
│   │   └── trackActivity.js
│   ├── 📁 models/
│   │   ├── User.js
│   │   ├── Quiz.js
│   │   ├── Chat.js
│   │   ├── Session.js
│   │   ├── Resource.js
│   │   ├── Notification.js
│   │   └── Answer.js
│   ├── 📁 routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── quizRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── sessionRoutes.js
│   │   ├── resourceRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── adminRoutes.js
│   ├── 📁 utils/
│   │   ├── aiServices.js
│   │   ├── helpers.js
│   │   └── seedDatabase.js
│   ├── 📁 uploads/
│   │   └── resources/
│   ├── package.json
│   ├── server.js
│   └── .env
├── 📁 frontend/
│   ├── 📁 public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── layout/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── ChatInterface.jsx
│   │   │   └── NotificationCenter.jsx
│   │   ├── 📁 context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── ChatContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── 📁 hooks/
│   │   │   ├── useSocket.js
│   │   │   └── useAdminActivityTracker.js
│   │   ├── 📁 pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── quiz/
│   │   │   ├── chat/
│   │   │   ├── sessions/
│   │   │   ├── resources/
│   │   │   ├── profile/
│   │   │   └── admin/
│   │   ├── 📁 styles/
│   │   │   └── chat.css
│   │   ├── 📁 utils/
│   │   │   ├── api.js
│   │   │   └── adminApi.js
│   │   ├── 📁 assest/
│   │   │   ├── prince.jpg
│   │   │   └── maaz.png
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env
├── README.md
├── LICENSE
└── .gitignore
```

## 🔗 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password

### Users

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/leaderboard` - Get global leaderboard
- `POST /api/users/upload-avatar` - Upload profile picture

### Quizzes

- `GET /api/quizzes/search` - Search quizzes
- `POST /api/quizzes/generate` - Generate AI quiz
- `GET /api/quizzes/:id` - Get quiz by ID
- `POST /api/quizzes/:id/attempt` - Submit quiz attempt
- `GET /api/quizzes/attempts/my-results` - Get user quiz results
- `GET /api/quizzes/leaderboard/:college` - Get quiz leaderboard

### Chat

- `GET /api/chat/conversations` - Get user conversations
- `GET /api/chat/messages/:conversationId` - Get conversation messages
- `POST /api/chat/messages` - Send new message
- `PUT /api/chat/messages/:messageId/read` - Mark message as read

### Sessions

- `GET /api/sessions/mentor` - Get mentor sessions
- `GET /api/sessions/student` - Get student sessions
- `POST /api/sessions/book` - Book new session
- `PUT /api/sessions/:id/status` - Update session status

### Resources

- `GET /api/resources` - Get all resources
- `POST /api/resources` - Upload new resource
- `GET /api/resources/:id` - Get resource by ID
- `DELETE /api/resources/:id` - Delete resource

### Admin

- `GET /api/admin/users` - Get all users
- `GET /api/admin/stats` - Get platform statistics
- `PUT /api/admin/users/:id/role` - Update user role
- `DELETE /api/admin/users/:id` - Delete user

## 🎨 UI/UX Features

### Design System

- **Color Palette**: Blue to purple gradient theme
- **Typography**: Clean, readable fonts
- **Icons**: Lucide React icon library
- **Responsive**: Mobile-first design approach
- **Accessibility**: ARIA labels and keyboard navigation

### Theme Support

- **Light Mode**: Clean, bright interface
- **Dark Mode**: Easy on the eyes for night usage
- **System Theme**: Automatically matches user's OS preference

### Animations

- **Smooth Transitions**: CSS transitions for interactions
- **Loading States**: Skeleton screens and spinners
- **Hover Effects**: Interactive feedback
- **Micro-interactions**: Delightful user experience

## 🔒 Security Features

### Authentication & Authorization

- **JWT Tokens**: Secure token-based authentication
- **Role-based Access**: Different permissions for users
- **Password Hashing**: bcrypt for secure password storage
- **Session Management**: Automatic token refresh

### Data Protection

- **Input Validation**: Sanitization of user inputs
- **Rate Limiting**: Prevent API abuse
- **CORS Configuration**: Secure cross-origin requests
- **File Upload Security**: Validation and sanitization

### Privacy

- **Data Encryption**: Sensitive data encryption
- **Privacy Controls**: User data management
- **GDPR Compliance**: Data protection regulations
- **Audit Logs**: Track user activities

## 📊 Analytics & Monitoring

### User Analytics

- **Learning Progress**: Track user advancement
- **Engagement Metrics**: Time spent, interactions
- **Performance Analytics**: Quiz scores, improvements
- **Behavior Patterns**: Learning preferences

### Platform Analytics

- **User Activity**: Daily/monthly active users
- **Feature Usage**: Most used features
- **Performance Metrics**: Response times, errors
- **Revenue Tracking**: Subscription and payments

## 🤖 AI Integration

### Google Gemini API

- **Quiz Generation**: Create custom quizzes
- **Content Suggestions**: Recommend learning materials
- **Difficulty Adjustment**: Adaptive quiz difficulty
- **Progress Analysis**: AI-powered insights

### Features

- **Natural Language Processing**: Understand user queries
- **Personalization**: Tailored learning experiences
- **Automated Grading**: Instant quiz scoring
- **Smart Recommendations**: Content suggestions

## 🔗 External Integrations

### Communication

- **WhatsApp API**: Send notifications via WhatsApp
- **Email Services**: SMTP email integration
- **Video Calling**: Third-party video APIs

### Payments

- **Payment Gateways**: Secure payment processing
- **Subscription Management**: Recurring payments
- **Invoice Generation**: Automated billing

## 🧪 Testing

### Frontend Testing

```bash
# Run frontend tests
cd frontend
npm run test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### Backend Testing

```bash
# Run backend tests
cd backend
npm run test

# Run tests with coverage
npm run test:coverage

# Run integration tests
npm run test:integration
```

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

```bash
# Build frontend for production
cd frontend
npm run build

# Deploy to Vercel
npx vercel --prod

# Deploy to Netlify
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Backend Deployment (Heroku/Railway)

```bash
# Build and deploy to Heroku
cd backend
git add .
git commit -m "Deploy to production"
git push heroku main

# Deploy to Railway
railway login
railway deploy
```

### Database (MongoDB Atlas)

1. Create MongoDB Atlas account
2. Create new cluster
3. Configure network access
4. Update connection string in environment variables

## 📈 Performance Optimization

### Frontend Optimization

- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Compressed and optimized images
- **Caching**: Browser caching strategies
- **Bundle Analysis**: Webpack bundle analyzer

### Backend Optimization

- **Database Indexing**: Optimized database queries
- **Caching**: Redis for session and data caching
- **Compression**: Gzip compression for responses
- **Load Balancing**: Multiple server instances

## 🐛 Debugging

### Common Issues

#### Frontend Issues

```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev

# Check for port conflicts
lsof -i :3000
```

#### Backend Issues

```bash
# Check MongoDB connection
mongo --eval "db.stats()"

# Verify environment variables
node -e "console.log(process.env)"

# Check server logs
npm run dev 2>&1 | tee server.log
```

## 📚 Learning Resources

### Documentation

- [React Documentation](https://reactjs.org/docs)
- [Node.js Documentation](https://nodejs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)

### Tutorials

- [React Tutorial](https://reactjs.org/tutorial)
- [Node.js Tutorial](https://nodejs.dev/learn)
- [MongoDB Tutorial](https://www.mongodb.com/docs/manual/tutorial/)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

### Code Style

- Use ESLint and Prettier for code formatting
- Follow React and Node.js best practices
- Write meaningful commit messages
- Add comments for complex logic

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

### Development Team

- **Prince Maurya** - Full Stack Developer
  - [LinkedIn](https://www.linkedin.com/in/prince-maurya-810b83277)
  - [GitHub](https://github.com/Prince200510)
- **Maaz Shaikh** - MERN Stack Developer
  - [LinkedIn](#)
  - [GitHub](#)

## 🏆 Acknowledgments

- **TCET-ACM-Webathon 1.0** for providing the platform to showcase innovation
- **Thakur College of Engineering** for supporting student innovation
- **Open Source Community** for amazing tools and libraries
- **All Contributors** who helped improve this project

## 📞 Support

### Get Help

- 📧 Email: princemaurya8879@gmail.com
- 📱 WhatsApp: +91-9987742369
- 🐛 Issues: [GitHub Issues](https://github.com/Prince200510/educonnect/issues)

### FAQ

**Q: How do I reset my password?**
A: Use the "Forgot Password" link on the login page.

**Q: Can I become a mentor?**
A: Yes! Apply through your profile settings with your qualifications.

**Q: Is the platform free?**
A: Basic features are free. Premium features require a subscription.

**Q: How does the AI quiz generation work?**
A: We use Google Gemini AI to create personalized quizzes based on your learning progress.

---

<div align="center">
  <p>Made with ❤️ for TCET-ACM-Webathon 1.0 Round 2</p>
  <p>🚀 Transforming Education Through Technology</p>
  
  [![GitHub stars](https://img.shields.io/github/stars/Prince200510/educonnect.svg?style=social&label=Star)](https://github.com/Prince200510/educonnect)
  [![GitHub forks](https://img.shields.io/github/forks/Prince200510/educonnect.svg?style=social&label=Fork)](https://github.com/Prince200510/educonnect/fork)
</div>
