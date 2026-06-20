import { useEffect, useState } from "react"
import { LandingPage } from "@/views/LandingPage"
import { AuthPage } from "@/views/AuthPage"
import { JobseekerDashboard } from "@/views/JobseekerDashboard"
import { EmployerDashboard } from "@/views/EmployerDashboard"
import { JobsPage } from "@/views/JobsPage"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Briefcase, LogOut } from "lucide-react"

export function App() {
  const [view, setView] = useState<string>("loading")
  const [user, setUser] = useState<any>(null)

  // Check session on load
  useEffect(() => {
    fetch("/api/auth.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setUser(data.user)
          if (data.user.usertype === "jobseeker") {
            setView("seeker-dashboard")
          } else if (data.user.usertype === "employer") {
            setView("employer-dashboard")
          } else {
            setView("landing")
          }
        } else {
          setView("landing")
        }
      })
      .catch((err) => {
        console.error("Session check failed:", err)
        setView("landing")
      })
  }, [])

  const handleLoginSuccess = (loggedInUser: any) => {
    setUser(loggedInUser)
    if (loggedInUser.usertype === "jobseeker") {
      setView("seeker-dashboard")
    } else if (loggedInUser.usertype === "employer") {
      setView("employer-dashboard")
    }
  }

  const handleLogout = () => {
    fetch("/api/auth.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" })
    })
      .then((res) => res.json())
      .then(() => {
        setUser(null)
        setView("landing")
      })
      .catch((err) => console.error("Logout failed:", err))
  }

  const handleBrandClick = () => {
    if (user) {
      if (user.usertype === "jobseeker") setView("seeker-dashboard")
      else if (user.usertype === "employer") setView("employer-dashboard")
    } else {
      setView("landing")
    }
  }

  if (view === "loading") {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Initializing Job Nova...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300">
      {/* Global Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={handleBrandClick}
            className="flex items-center gap-2 font-heading font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent"
          >
            <Briefcase className="h-5 w-5 text-indigo-500 shrink-0" />
            JOB NOVA
          </button>

          <div className="flex items-center gap-3.5">
            <nav className="hidden sm:flex items-center gap-1">
              <button
                onClick={() => setView("landing")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                  view === "landing" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setView("jobs")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                  view === "jobs" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Find Jobs
              </button>
              {user && (
                <button
                  onClick={() => setView(user.usertype === "jobseeker" ? "seeker-dashboard" : "employer-dashboard")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                    view.includes("dashboard") ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Dashboard
                </button>
              )}
            </nav>

            <ThemeToggle />

            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden md:inline text-xs text-muted-foreground font-light">
                  Logged in as <strong className="text-foreground font-semibold">{user.name || user.ename || user.email}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3.5 py-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 font-semibold text-xs rounded-lg flex items-center gap-1.5 hover:bg-rose-500/20 transition"
                  title="Sign Out"
                >
                  <LogOut className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setView("auth")}
                className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs rounded-lg shadow-md transition duration-200"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* View router */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col justify-start">
        {view === "landing" && <LandingPage onNavigate={setView} />}
        {view === "jobs" && <JobsPage onNavigate={setView} />}
        {view === "auth" && <AuthPage onLoginSuccess={handleLoginSuccess} onNavigate={setView} />}
        {view === "seeker-dashboard" && <JobseekerDashboard user={user} onLogout={handleLogout} />}
        {view === "employer-dashboard" && <EmployerDashboard user={user} onLogout={handleLogout} />}
      </main>
    </div>
  )
}

export default App
