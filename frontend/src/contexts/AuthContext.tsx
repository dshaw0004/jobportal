import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface User {
  email: string
  name?: string
  ename?: string
  usertype: "jobseeker" | "employer"
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/auth.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) setUser(data.user)
      })
      .catch((err) => console.error("Session check failed:", err))
      .finally(() => setLoading(false))
  }, [])

  const login = (u: User) => setUser(u)

  const logout = () => {
    fetch("/api/auth.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    })
      .then((res) => res.json())
      .finally(() => setUser(null))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
