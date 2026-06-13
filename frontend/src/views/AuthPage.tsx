import React, { useState } from "react"
import { LocationSelector } from "@/components/LocationSelector"
import { Lock, Mail, User, Phone, Briefcase, FileText, ChevronRight } from "lucide-react"

interface AuthPageProps {
  onLoginSuccess: (user: any) => void;
  onNavigate: (view: string) => void;
}

export function AuthPage({ onLoginSuccess, onNavigate }: AuthPageProps) {
  const [activeTab, setActiveTab] = useState<"login" | "seeker" | "employer">("login")
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")
  const [loading, setLoading] = useState(false)

  // Login form state
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })

  // Jobseeker registration form state
  const [seekerForm, setSeekerForm] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    experience: "",
    skills: "",
    ugcourse: "",
    pgcourse: "",
    country: "",
    state: "",
    city: ""
  })

  // Employer registration form state
  const [employerForm, setEmployerForm] = useState({
    email: "",
    password: "",
    ename: "",
    comtype: "Company",
    indtype: "",
    address: "",
    pincode: "",
    executive: "",
    phone: "",
    profile: "",
    country: "",
    state: "",
    city: ""
  })

  const clearMessages = () => {
    setErrorMsg("")
    setSuccessMsg("")
  }

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    clearMessages()
    setLoading(true)

    fetch("/api/auth.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "login",
        email: loginForm.email,
        password: loginForm.password
      })
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false)
        if (data.success) {
          onLoginSuccess(data.user)
        } else {
          setErrorMsg(data.message || "Invalid credentials")
        }
      })
      .catch((err) => {
        console.error("Login error:", err)
        setLoading(false)
        setErrorMsg("Network error. Please try again.")
      })
  }

  const handleSeekerRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    clearMessages()
    
    if (!seekerForm.country || !seekerForm.state || !seekerForm.city) {
      setErrorMsg("Please select your country, state, and city.")
      return;
    }

    setLoading(true)
    fetch("/api/auth.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "register_seeker",
        ...seekerForm
      })
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false)
        if (data.success) {
          setSuccessMsg(data.message || "Registration successful! You can now log in.")
          setActiveTab("login")
          setLoginForm({ email: seekerForm.email, password: "" })
        } else {
          setErrorMsg(data.message || "Registration failed")
        }
      })
      .catch((err) => {
        console.error("Seeker registration error:", err)
        setLoading(false)
        setErrorMsg("Network error. Please try again.")
      })
  }

  const handleEmployerRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    clearMessages()
    
    if (!employerForm.country || !employerForm.state || !employerForm.city) {
      setErrorMsg("Please select your country, state, and city.")
      return;
    }

    setLoading(true)
    fetch("/api/auth.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "register_employer",
        ...employerForm
      })
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false)
        if (data.success) {
          setSuccessMsg(data.message || "Registration successful! Pending admin review.")
          setActiveTab("login")
          setLoginForm({ email: employerForm.email, password: "" })
        } else {
          setErrorMsg(data.message || "Registration failed")
        }
      })
      .catch((err) => {
        console.error("Employer registration error:", err)
        setLoading(false)
        setErrorMsg("Network error. Please try again.")
      })
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-6 flex flex-col justify-center min-h-[80vh]">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold font-heading mb-2">Welcome to Job Nova</h2>
        <p className="text-muted-foreground text-sm font-light">
          Configure your career profile or publish vacancy details.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-accent/30 border border-border/80 p-1 rounded-xl mb-8">
        <button
          onClick={() => { setActiveTab("login"); clearMessages(); }}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
            activeTab === "login"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => { setActiveTab("seeker"); clearMessages(); }}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
            activeTab === "seeker"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Jobseeker Sign Up
        </button>
        <button
          onClick={() => { setActiveTab("employer"); clearMessages(); }}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
            activeTab === "employer"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Employer Sign Up
        </button>
      </div>

      {/* Feedback Messages */}
      {errorMsg && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-4 rounded-xl mb-6 font-medium">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs p-4 rounded-xl mb-6 font-medium">
          {successMsg}
        </div>
      )}

      {/* Forms Container */}
      <div className="bg-card/40 backdrop-blur-md border border-border/60 p-6 md:p-8 rounded-2xl shadow-xl">
        {activeTab === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  required
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mt-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm rounded-lg shadow-md transition disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>
        )}

        {activeTab === "seeker" && (
          <form onSubmit={handleSeekerRegisterSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    required
                    value={seekerForm.name}
                    onChange={(e) => setSeekerForm({ ...seekerForm, name: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="john@example.com"
                    required
                    value={seekerForm.email}
                    onChange={(e) => setSeekerForm({ ...seekerForm, email: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    required
                    value={seekerForm.password}
                    onChange={(e) => setSeekerForm({ ...seekerForm, password: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="91xxxxxxxx"
                    required
                    value={seekerForm.phone}
                    onChange={(e) => setSeekerForm({ ...seekerForm, phone: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Experience (Years)</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="e.g. 3"
                    required
                    value={seekerForm.experience}
                    onChange={(e) => setSeekerForm({ ...seekerForm, experience: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Key Skills</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="e.g. React, PHP, SQL"
                    required
                    value={seekerForm.skills}
                    onChange={(e) => setSeekerForm({ ...seekerForm, skills: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">UG Course</label>
                <select
                  required
                  value={seekerForm.ugcourse}
                  onChange={(e) => setSeekerForm({ ...seekerForm, ugcourse: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                >
                  <option value="">Select UG Qualification</option>
                  <option value="B.Tech/B.E.">B.Tech/B.E.</option>
                  <option value="B.C.A.">B.C.A.</option>
                  <option value="B.Sc.">B.Sc.</option>
                  <option value="B.A.">B.A.</option>
                  <option value="B.Com.">B.Com.</option>
                  <option value="Not Pursuing Graduation">Not Pursuing Graduation</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">PG Course</label>
                <select
                  required
                  value={seekerForm.pgcourse}
                  onChange={(e) => setSeekerForm({ ...seekerForm, pgcourse: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                >
                  <option value="">Select PG Qualification</option>
                  <option value="M.Tech">M.Tech</option>
                  <option value="M.C.A.">M.C.A.</option>
                  <option value="MBA/PGDM">MBA/PGDM</option>
                  <option value="M.Sc.">M.Sc.</option>
                  <option value="CA">CA</option>
                  <option value="Not Pursuing Post Graduation">Not Pursuing Post Graduation</option>
                </select>
              </div>
            </div>

            <LocationSelector
              required
              onLocationChange={(country, state, city) => {
                setSeekerForm({ ...seekerForm, country, state, city })
              }}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mt-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm rounded-lg shadow-md transition disabled:opacity-50"
            >
              {loading ? "Registering..." : "Sign Up"}
            </button>
          </form>
        )}

        {activeTab === "employer" && (
          <form onSubmit={handleEmployerRegisterSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Company Name</label>
                <input
                  type="text"
                  placeholder="Infosys Pvt Ltd"
                  required
                  value={employerForm.ename}
                  onChange={(e) => setEmployerForm({ ...employerForm, ename: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Corporate Email</label>
                <input
                  type="email"
                  placeholder="hr@infosys.com"
                  required
                  value={employerForm.email}
                  onChange={(e) => setEmployerForm({ ...employerForm, email: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={employerForm.password}
                  onChange={(e) => setEmployerForm({ ...employerForm, password: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact Phone</label>
                <input
                  type="text"
                  placeholder="91xxxxxxxx"
                  required
                  value={employerForm.phone}
                  onChange={(e) => setEmployerForm({ ...employerForm, phone: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Company Type</label>
                <select
                  required
                  value={employerForm.comtype}
                  onChange={(e) => setEmployerForm({ ...employerForm, comtype: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                >
                  <option value="Company">Company</option>
                  <option value="Consultant">Consultant</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Industry Type</label>
                <input
                  type="text"
                  placeholder="e.g. Software Services"
                  required
                  value={employerForm.indtype}
                  onChange={(e) => setEmployerForm({ ...employerForm, indtype: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">HR Contact Executive</label>
                <input
                  type="text"
                  placeholder="Executive Name"
                  required
                  value={employerForm.executive}
                  onChange={(e) => setEmployerForm({ ...employerForm, executive: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-3 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Office Address</label>
                <input
                  type="text"
                  placeholder="Building, Street Name, Tech Zone..."
                  required
                  value={employerForm.address}
                  onChange={(e) => setEmployerForm({ ...employerForm, address: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pincode</label>
                <input
                  type="text"
                  placeholder="458796"
                  required
                  value={employerForm.pincode}
                  onChange={(e) => setEmployerForm({ ...employerForm, pincode: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Company Profile Summary</label>
              <textarea
                placeholder="Write a brief overview of your company services, mission and values..."
                rows={3}
                required
                value={employerForm.profile}
                onChange={(e) => setEmployerForm({ ...employerForm, profile: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              />
            </div>

            <LocationSelector
              required
              onLocationChange={(country, state, city) => {
                setEmployerForm({ ...employerForm, country, state, city })
              }}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mt-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm rounded-lg shadow-md transition disabled:opacity-50"
            >
              {loading ? "Registering..." : "Sign Up"}
            </button>
          </form>
        )}
      </div>

      <div className="text-center mt-6">
        <button
          onClick={() => onNavigate("landing")}
          className="text-xs text-indigo-500 hover:text-indigo-400 font-semibold inline-flex items-center gap-1.5"
        >
          Back to Home Page <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}
