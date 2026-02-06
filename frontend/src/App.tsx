import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PredictionsProvider } from './context/PredictionsContext'
import { Layout } from './components/Layout'
import { Chatbot } from './components/ChatBot'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Footer } from './components/Footer'
import { useAuth } from './context/SupabaseAuthContext'
import { HomePage } from './pages/HomePage'
import { PredictionPage } from './pages/PredictionPage'
import { ReportPage } from './pages/ReportPage'
import { LeaderboardPage } from './pages/LeaderboardPage'
import { ProfilePage } from './pages/ProfilePage'
import { ContactPage } from './pages/ContactPage'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { AdminDashboard } from './pages/AdminDashboard'
import { WorkerTaskPage } from './pages/WorkerTaskPage'

export default function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <PredictionsProvider>
      <BrowserRouter>
        {user ? (
          <>
            <Chatbot />
            <Routes>
              {/* Home Page: Full width, no Layout wrapper */}
              <Route path="/" element={<HomePage />} />

              {/* Dashboard Pages: Wrapped in Layout */}
              <Route
                path="/*"
                element={
                  <Layout>
                    <Routes>
                      <Route
                        path="/prediction"
                        element={
                          <ProtectedRoute>
                            <PredictionPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/report"
                        element={
                          <ProtectedRoute>
                            <ReportPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/leaderboard"
                        element={
                          <ProtectedRoute>
                            <LeaderboardPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/profile"
                        element={
                          <ProtectedRoute>
                            <ProfilePage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin"
                        element={
                          <ProtectedRoute requiredRole="admin">
                            <AdminDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/worker"
                        element={
                          <ProtectedRoute requiredRole="worker">
                            <WorkerTaskPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="/contact" element={<ContactPage />} />
                      {/* Redirect login/signup to dashboard if already logged in */}
                      <Route path="/signup" element={<Navigate to="/prediction" />} />
                      {/* Catch-all for dashboard routes */}
                      <Route path="*" element={<Navigate to="/prediction" />} />
                    </Routes>
                  </Layout>
                }
              />
            </Routes>
          </>
        ) : (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}
        <Footer />
      </BrowserRouter>
    </PredictionsProvider>
  )
}
