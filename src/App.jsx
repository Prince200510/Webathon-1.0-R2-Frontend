import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import LoadingSpinner from './components/LoadingSpinner'
import ProtectedRoute from './components/ProtectedRoute'
import AdminProtectedRoute from './components/AdminProtectedRoute'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import OnboardingPage from './pages/auth/OnboardingPage'
import MentorOnboardingPage from './pages/auth/MentorOnboardingPage'
import MentorPendingPage from './pages/auth/MentorPendingPage'
import StudentDashboard from './pages/student/StudentDashboard'
import MentorDashboard from './pages/mentor/MentorDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminLogin from './pages/auth/AdminLogin'
import MentorManagement from './pages/admin/MentorManagement'
import AdminManagement from './pages/admin/AdminManagement'
import MentorSearch from './pages/mentors/MentorSearch'
import MentorProfile from './pages/mentors/MentorProfile'
import BookSession from './pages/sessions/BookSession'
import SessionDetails from './pages/sessions/SessionDetails'
import SessionRoom from './pages/sessions/SessionRoom'
import MySessions from './pages/sessions/MySessions'
import QuizPage from './pages/quiz/QuizPage'
import QuizAttempt from './pages/quiz/QuizAttempt'
import QuizResults from './pages/quiz/QuizResults'
import Leaderboard from './pages/quiz/Leaderboard'
import ChatPage from './pages/chat/ChatPage'
import ResourceLibrary from './pages/resources/ResourceLibrary'
import ProfilePage from './pages/profile/ProfilePage'
import CareerPathwayPage from './pages/student/CareerPathwayPage'
import VRInterviewPage from './pages/student/VRInterviewPage'
import Community from './components/Community/Community'

function App() {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={
        <AdminProtectedRoute>
          <AdminDashboard />
        </AdminProtectedRoute>
      } />
      <Route path="/admin/dashboard" element={
        <AdminProtectedRoute>
          <AdminDashboard />
        </AdminProtectedRoute>
      } />
      <Route path="/admin/mentors" element={
        <AdminProtectedRoute>
          <MentorManagement />
        </AdminProtectedRoute>
      } />
      <Route path="/admin/administrators" element={
        <AdminProtectedRoute>
          <AdminManagement />
        </AdminProtectedRoute>
      } />
      {!isAuthenticated ? (
        <Route path="*" element={<Navigate to="/" replace />} />
      ) : (
        <>
          {user && !user.onboardingCompleted ? (
            <>
              {user.role === 'mentor' ? (
                <>
                  <Route path="/mentor-onboarding" element={<MentorOnboardingPage />} />
                  <Route path="*" element={<Navigate to="/mentor-onboarding" replace />} />
                </>
              ) : (
                <>
                  <Route path="/onboarding" element={<OnboardingPage />} />
                  <Route path="*" element={<Navigate to="/onboarding" replace />} />
                </>
              )}
            </>
          ) : user && user.role === 'mentor' && user.mentorDetails?.approvalStatus === 'pending' ? (
            <>
              <Route path="/mentor-pending" element={<MentorPendingPage />} />
              <Route path="*" element={<Navigate to="/mentor-pending" replace />} />
            </>
          ) : (
            <>
              <Route path="/student" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/mentor" element={
                <ProtectedRoute allowedRoles={['mentor']}>
                  <MentorDashboard />
                </ProtectedRoute>
              } />

              <Route path="/mentors" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <MentorSearch />
                </ProtectedRoute>
              } />
              
              <Route path="/mentors/:id" element={
                <ProtectedRoute allowedRoles={['student', 'mentor']}>
                  <MentorProfile />
                </ProtectedRoute>
              } />
              
              <Route path="/book-session/:mentorId" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <BookSession />
                </ProtectedRoute>
              } />
              
              <Route path="/sessions/my-sessions" element={
                <ProtectedRoute allowedRoles={['student', 'mentor']}>
                  <MySessions />
                </ProtectedRoute>
              } />
              
              <Route path="/sessions/:id" element={
                <ProtectedRoute allowedRoles={['student', 'mentor']}>
                  <SessionDetails />
                </ProtectedRoute>
              } />
              
              <Route path="/session-room/:id" element={
                <ProtectedRoute allowedRoles={['student', 'mentor']}>
                  <SessionRoom />
                </ProtectedRoute>
              } />

              <Route path="/quiz" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <QuizPage />
                </ProtectedRoute>
              } />
              
              <Route path="/quiz/:id/attempt" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <QuizAttempt />
                </ProtectedRoute>
              } />
              
              <Route path="/quiz/results" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <QuizResults />
                </ProtectedRoute>
              } />
              
              <Route path="/leaderboard" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <Leaderboard />
                </ProtectedRoute>
              } />

              <Route path="/career-pathway" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <CareerPathwayPage />
                </ProtectedRoute>
              } />

              <Route path="/vr-interview" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <VRInterviewPage />
                </ProtectedRoute>
              } />

              <Route path="/chat" element={
                <ProtectedRoute allowedRoles={['student', 'mentor']}>
                  <ChatPage />
                </ProtectedRoute>
              } />
              
              <Route path="/community" element={
                <ProtectedRoute allowedRoles={['student', 'mentor']}>
                  <Community />
                </ProtectedRoute>
              } />
              
              <Route path="/resources" element={
                <ProtectedRoute allowedRoles={['student', 'mentor']}>
                  <ResourceLibrary />
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute allowedRoles={['student', 'mentor']}>
                  <ProfilePage />
                </ProtectedRoute>
              } />

              <Route path="*" element={<Navigate to={user?.role === 'mentor' ? '/mentor' : '/student'} replace />} />
            </>
          )}
        </>
      )}
    </Routes>
  )
}

export default App
