import { Navigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import type { ReactNode } from "react"

interface ProtectedRouteProps {
  children: ReactNode
  requiredType?: "jobseeker" | "employer"
}

export function ProtectedRoute({ children, requiredType }: ProtectedRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    )
  }

  if (!user) return <Navigate to="/auth" replace />
  if (requiredType && user.usertype !== requiredType) {
    return <Navigate to={user.usertype === "jobseeker" ? "/seeker" : "/employer"} replace />
  }

  return <>{children}</>
}
