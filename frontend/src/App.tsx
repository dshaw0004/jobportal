import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "@/contexts/AuthContext"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { ThemeProvider } from "@/components/theme-provider"
import { LandingPage } from "@/views/LandingPage"
import { AuthPage } from "@/views/AuthPage"
import { JobseekerDashboard } from "@/views/JobseekerDashboard"
import { EmployerDashboard } from "@/views/EmployerDashboard"

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
            Initializing Job Nova...
          </p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/auth"
        element={
          user ? (
            <Navigate to={user.usertype === "jobseeker" ? "/seeker" : "/employer"} replace />
          ) : (
            <AuthPage />
          )
        }
      />
      <Route
        path="/seeker"
        element={
          <ProtectedRoute requiredType="jobseeker">
            <JobseekerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employer"
        element={
          <ProtectedRoute requiredType="employer">
            <EmployerDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="jobnova-theme">
        <AuthProvider>
          <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-300">
            <AppRoutes />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
