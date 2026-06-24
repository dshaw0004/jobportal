import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { LocationSelector } from "@/components/LocationSelector"
import { User, CheckCircle, Search, Clock, Award, LogOut, Upload, Settings } from "lucide-react"



interface Job {
  jobid: string;
  title: string;
  jobdesc: string;
  experience: string;
  basicpay: string;
  location: string;
  postdate: string;
  ename: string;
  logo: string | null;
  has_applied?: boolean;
}

export function JobseekerDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<"profile" | "recommended" | "search" | "applied" | "shortlisted" | "settings">("profile")
  const [profile, setProfile] = useState<any>(null)
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([])
  const [appliedJobs, setAppliedJobs] = useState<any[]>([])
  const [shortlistedJobs, setShortlistedJobs] = useState<any[]>([])
  
  // Search state
  const [searchForm, setSearchForm] = useState({ company: "", location: "", desig: "", skills: "", industry: "" })
  const [searchResults, setSearchResults] = useState<Job[]>([])
  const [searchDone, setSearchDone] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    experience: "",
    skills: "",
    ugcourse: "",
    pgcourse: "",
    other_qual: "",
    country: "",
    state: "",
    city: ""
  })

  // Settings Form state
  const [passwordForm, setPasswordForm] = useState({ old_password: "", new_password: "", confirm_password: "" })
  const [deletePassword, setDeletePassword] = useState("")

  // Alerts
  const [alert, setAlert] = useState<{ type: "success" | "error"; msg: string } | null>(null)

  const photoInputRef = useRef<HTMLInputElement>(null)
  const resumeInputRef = useRef<HTMLInputElement>(null)

  const showAlert = (type: "success" | "error", msg: string) => {
    setAlert({ type, msg })
    setTimeout(() => setAlert(null), 5000)
  }

  // Load profile data
  const fetchProfile = () => {
    fetch("/api/jobseeker.php?action=profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProfile(data.profile)
          setProfileForm({
            name: data.profile.name || "",
            phone: data.profile.phone || "",
            experience: data.profile.experience || "",
            skills: data.profile.skills || "",
            ugcourse: data.profile.basic_edu || "",
            pgcourse: data.profile.master_edu || "",
            other_qual: data.profile.other_qual || "",
            country: "",
            state: "",
            city: ""
          })
        }
      })
      .catch((err) => console.error("Error fetching profile:", err))
  }

  // Fetch lists based on active tab
  useEffect(() => {
    fetchProfile()
  }, [])

  useEffect(() => {
    if (activeTab === "recommended") {
      fetch("/api/jobseeker.php?action=recommended")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setRecommendedJobs(data.jobs)
        })
        .catch((err) => console.error(err))
    } else if (activeTab === "applied") {
      fetch("/api/jobseeker.php?action=applied")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setAppliedJobs(data.jobs)
        })
        .catch((err) => console.error(err))
    } else if (activeTab === "shortlisted") {
      fetch("/api/jobseeker.php?action=selected")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setShortlistedJobs(data.jobs)
        })
        .catch((err) => console.error(err))
    }
  }, [activeTab])

  // Profile submit
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetch("/api/jobseeker.php?action=update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update",
        ...profileForm
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          showAlert("success", "Profile updated successfully!")
          fetchProfile()
        } else {
          showAlert("error", data.message || "Failed to update profile")
        }
      })
      .catch((err) => {
        console.error(err)
        showAlert("error", "Network error updating profile")
      })
  }

  // Apply to a job
  const handleApply = (jid: string) => {
    fetch("/api/jobseeker.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "apply",
        jid
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          showAlert("success", data.message || "Applied successfully!")
          // Update recommended jobs applied status locally
          setRecommendedJobs((prev) =>
            prev.map((job) => (job.jobid === jid ? { ...job, has_applied: true } : job))
          )
          setSearchResults((prev) =>
            prev.map((job) => (job.jobid === jid ? { ...job, has_applied: true } : job))
          )
        } else {
          showAlert("error", data.message || "Already applied or error occurred")
        }
      })
      .catch((err) => {
        console.error(err)
        showAlert("error", "Error applying for job")
      })
  }

  // Upload handlers
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      showAlert("error", "New passwords do not match")
      return
    }
    fetch("/api/auth.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update_password",
        old_password: passwordForm.old_password,
        new_password: passwordForm.new_password
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          showAlert("success", data.message || "Password updated successfully")
          setPasswordForm({ old_password: "", new_password: "", confirm_password: "" })
        } else {
          showAlert("error", data.message || "Failed to update password")
        }
      })
      .catch((err) => {
        console.error(err)
        showAlert("error", "Error updating password")
      })
  }

  const handleDeleteAccount = (e: React.FormEvent) => {
    e.preventDefault()
    if (!confirm("Are you sure you want to permanently delete your account? This action cannot be undone.")) return

    fetch("/api/auth.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "delete_account",
        password: deletePassword
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          logout()
          navigate("/")
        } else {
          showAlert("error", data.message || "Failed to delete account")
        }
      })
      .catch((err) => {
        console.error(err)
        showAlert("error", "Error deleting account")
      })
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    fetch("/api/upload.php?type=image", {
      method: "POST",
      body: formData
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          showAlert("success", "Profile image updated successfully!")
          fetchProfile()
        } else {
          showAlert("error", data.message || "Failed to upload image")
        }
      })
      .catch((err) => {
        console.error(err)
        showAlert("error", "Error uploading image")
      })
  }

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    fetch("/api/upload.php?type=file", {
      method: "POST",
      body: formData
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          showAlert("success", "Resume document uploaded successfully!")
          fetchProfile()
        } else {
          showAlert("error", data.message || "Failed to upload resume")
        }
      })
      .catch((err) => {
        console.error(err)
        showAlert("error", "Error uploading resume")
      })
  }

  // Advanced Search query
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchLoading(true)
    const params = new URLSearchParams({
      action: "search",
      com: searchForm.company,
      loc: searchForm.location,
      desig: searchForm.desig,
      skills: searchForm.skills,
      industry: searchForm.industry
    })

    fetch(`/api/jobs.php?action=search&${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setSearchLoading(false)
        if (data.success) {
          // Double check if already applied by fetching applied jobs list
          fetch("/api/jobseeker.php?action=applied")
            .then((appRes) => appRes.json())
            .then((appData) => {
              const appliedIds = appData.success ? appData.jobs.map((j: any) => j.jobid) : []
              const processedResults = data.jobs.map((job: Job) => ({
                ...job,
                has_applied: appliedIds.includes(job.jobid)
              }))
              setSearchResults(processedResults)
              setSearchDone(true)
            })
        }
      })
      .catch((err) => {
        console.error(err)
        setSearchLoading(false)
      })
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full max-w-7xl mx-auto py-8 px-6">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 shrink-0 flex flex-col gap-6">
        <div className="bg-card/40 backdrop-blur-md border border-border/60 rounded-2xl p-6 flex flex-col items-center text-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 to-violet-500" />
          
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-border/80 bg-accent/30 mb-4 group cursor-pointer" onClick={() => photoInputRef.current?.click()}>
            {profile?.photo ? (
              <img src={`/uploads/images/${profile.photo}`} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-accent">
                <User className="h-10 w-10" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-200">
              <Upload className="h-5 w-5 text-white" />
            </div>
            <input type="file" ref={photoInputRef} onChange={handlePhotoUpload} className="hidden" accept=".jpg,.jpeg,.png" />
          </div>
          
          <h3 className="font-heading font-bold text-lg leading-tight mb-1">{profile?.name || user?.name}</h3>
          <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full mb-4">
            Job Seeker
          </span>
          <p className="text-xs text-muted-foreground font-light break-all">{profile?.email || user?.email}</p>
        </div>

        {/* Navigation list */}
        <nav className="flex flex-col gap-1.5 bg-card/35 backdrop-blur-sm border border-border/50 p-2 rounded-2xl">
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full text-left px-4 py-2.5 text-xs font-semibold rounded-xl flex items-center gap-3 transition ${
              activeTab === "profile" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
            }`}
          >
            <User className="h-4 w-4" /> My Profile
          </button>
          <button
            onClick={() => setActiveTab("recommended")}
            className={`w-full text-left px-4 py-2.5 text-xs font-semibold rounded-xl flex items-center gap-3 transition ${
              activeTab === "recommended" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
            }`}
          >
            <Award className="h-4 w-4" /> Recommended Jobs
          </button>
          <button
            onClick={() => setActiveTab("search")}
            className={`w-full text-left px-4 py-2.5 text-xs font-semibold rounded-xl flex items-center gap-3 transition ${
              activeTab === "search" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
            }`}
          >
            <Search className="h-4 w-4" /> Advanced Search
          </button>
          <button
            onClick={() => setActiveTab("applied")}
            className={`w-full text-left px-4 py-2.5 text-xs font-semibold rounded-xl flex items-center gap-3 transition ${
              activeTab === "applied" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
            }`}
          >
            <Clock className="h-4 w-4" /> Applied Jobs
          </button>
          <button
            onClick={() => setActiveTab("shortlisted")}
            className={`w-full text-left px-4 py-2.5 text-xs font-semibold rounded-xl flex items-center gap-3 transition ${
              activeTab === "shortlisted" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
            }`}
          >
            <CheckCircle className="h-4 w-4" /> Shortlisted Status
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full text-left px-4 py-2.5 text-xs font-semibold rounded-xl flex items-center gap-3 transition ${
              activeTab === "settings" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
            }`}
          >
            <Settings className="h-4 w-4" /> Settings
          </button>
          <div className="h-px bg-border my-2" />
          <button
            onClick={() => { logout(); navigate("/") }}
            className="w-full text-left px-4 py-2.5 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 rounded-xl flex items-center gap-3 transition"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <section className="flex-1 flex flex-col min-w-0">
        {alert && (
          <div className={`p-4 rounded-xl mb-6 text-xs font-medium border ${
            alert.type === "success" 
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
              : "bg-destructive/10 border-destructive/20 text-destructive"
          }`}>
            {alert.msg}
          </div>
        )}

        <div className="bg-card/45 backdrop-blur-md border border-border/60 p-6 md:p-8 rounded-3xl shadow-xl flex-1 flex flex-col">
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-heading">Settings</h2>
                <p className="text-xs text-muted-foreground font-light">Manage your account security and preferences.</p>
              </div>

              <div className="space-y-6">
                <div className="bg-background border border-border/80 p-5 rounded-2xl shadow-sm">
                  <h3 className="font-heading font-bold text-lg mb-4">Change Password</h3>
                  <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-sm">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current Password</label>
                      <input
                        type="password"
                        required
                        value={passwordForm.old_password}
                        onChange={(e) => setPasswordForm({ ...passwordForm, old_password: e.target.value })}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">New Password</label>
                      <input
                        type="password"
                        required
                        value={passwordForm.new_password}
                        onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Confirm New Password</label>
                      <input
                        type="password"
                        required
                        value={passwordForm.confirm_password}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                      />
                    </div>
                    <button
                      type="submit"
                      className="py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm rounded-lg shadow-md transition"
                    >
                      Update Password
                    </button>
                  </form>
                </div>

                <div className="bg-rose-500/5 border border-rose-500/20 p-5 rounded-2xl shadow-sm">
                  <h3 className="font-heading font-bold text-lg text-rose-500 mb-2">Delete Account</h3>
                  <p className="text-xs text-rose-400/80 mb-4 font-medium">Warning: This action is permanent and will delete your profile and all applications.</p>
                  <form onSubmit={handleDeleteAccount} className="space-y-4 max-w-sm">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-rose-500/70 uppercase tracking-wider">Verify Password to Delete</label>
                      <input
                        type="password"
                        required
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        className="w-full bg-background border border-rose-500/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition text-foreground"
                      />
                    </div>
                    <button
                      type="submit"
                      className="py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm rounded-lg shadow-md transition"
                    >
                      Permanently Delete Account
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold font-heading">My Profile</h2>
                  <p className="text-xs text-muted-foreground font-light">Keep your candidate details and CV updated for recruiters.</p>
                </div>
                
                {/* Resume Upload Panel */}
                <div className="flex flex-col gap-1.5 max-w-xs">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Resume Document (.pdf, .doc)</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => resumeInputRef.current?.click()}
                      className="px-3 py-1.5 border border-border bg-background hover:bg-accent text-xs font-semibold rounded-lg flex items-center gap-2 transition"
                    >
                      <Upload className="h-3 w-3" /> Upload CV
                    </button>
                    <input type="file" ref={resumeInputRef} onChange={handleResumeUpload} className="hidden" accept=".pdf,.doc,.docx" />
                    {profile?.Resume && (
                      <a
                        href={`/uploads/resume/${profile.Resume}`}
                        download
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline"
                      >
                        Download Current
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Experience (Years)</label>
                    <input
                      type="text"
                      required
                      value={profileForm.experience}
                      onChange={(e) => setProfileForm({ ...profileForm, experience: e.target.value })}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Key Skills</label>
                    <input
                      type="text"
                      required
                      value={profileForm.skills}
                      onChange={(e) => setProfileForm({ ...profileForm, skills: e.target.value })}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">UG Qualification</label>
                    <select
                      required
                      value={profileForm.ugcourse}
                      onChange={(e) => setProfileForm({ ...profileForm, ugcourse: e.target.value })}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    >
                      <option value="">Select UG</option>
                      <option value="B.Tech/B.E.">B.Tech/B.E.</option>
                      <option value="B.C.A.">B.C.A.</option>
                      <option value="B.Sc.">B.Sc.</option>
                      <option value="B.A.">B.A.</option>
                      <option value="B.Com.">B.Com.</option>
                      <option value="Not Pursuing Graduation">Not Pursuing Graduation</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">PG Qualification</label>
                    <select
                      required
                      value={profileForm.pgcourse}
                      onChange={(e) => setProfileForm({ ...profileForm, pgcourse: e.target.value })}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    >
                      <option value="">Select PG</option>
                      <option value="M.Tech">M.Tech</option>
                      <option value="M.C.A.">M.C.A.</option>
                      <option value="MBA/PGDM">MBA/PGDM</option>
                      <option value="M.Sc.">M.Sc.</option>
                      <option value="CA">CA</option>
                      <option value="Not Pursuing Post Graduation">Not Pursuing Post Graduation</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Other Credentials / Certifications</label>
                  <input
                    type="text"
                    value={profileForm.other_qual}
                    onChange={(e) => setProfileForm({ ...profileForm, other_qual: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    placeholder="e.g. AWS Solutions Architect"
                  />
                </div>

                <div className="flex flex-col gap-3 border border-border/50 bg-accent/20 p-4 rounded-xl">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Update Current Location: <span className="text-indigo-400 font-semibold">{profile?.location}</span></span>
                  <LocationSelector
                    onLocationChange={(country, state, city) => {
                      setProfileForm({ ...profileForm, country, state, city })
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm rounded-lg shadow-md transition"
                >
                  Save Profile Changes
                </button>
              </form>
            </div>
          )}

          {activeTab === "recommended" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-heading">Recommended Jobs</h2>
                <p className="text-xs text-muted-foreground font-light">Based on your educational qualifications: <span className="text-indigo-400 font-medium">{profile?.basic_edu}</span> & <span className="text-indigo-400 font-medium">{profile?.master_edu}</span></p>
              </div>

              {recommendedJobs.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground font-light text-sm">
                  No matches recommended at this moment. You can search jobs in the Search panel!
                </div>
              ) : (
                <div className="space-y-4">
                  {recommendedJobs.map((job) => (
                    <div key={job.jobid} className="bg-background border border-border/80 p-5 rounded-2xl shadow-sm hover:border-indigo-500/30 transition duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="font-heading font-bold text-lg">{job.title}</h3>
                        <p className="text-xs text-indigo-400 font-medium">{job.ename} • {job.location}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2 font-light">{job.jobdesc}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                          {job.basicpay}
                        </span>
                        {job.has_applied ? (
                          <span className="px-3 py-1 bg-accent border border-border text-muted-foreground text-xs font-bold rounded-lg cursor-default">
                            Applied
                          </span>
                        ) : (
                          <button
                            onClick={() => handleApply(job.jobid)}
                            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-sm transition"
                          >
                            Apply Now
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "search" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-heading">Advanced Job Search</h2>
                <p className="text-xs text-muted-foreground font-light">Specify keywords to filter jobs precisely.</p>
              </div>

              <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 border border-border/60 bg-accent/25 p-4 rounded-xl">
                <input
                  type="text"
                  placeholder="Company Name"
                  value={searchForm.company}
                  onChange={(e) => setSearchForm({ ...searchForm, company: e.target.value })}
                  className="bg-background border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                />
                <input
                  type="text"
                  placeholder="Job Designation/Title"
                  value={searchForm.desig}
                  onChange={(e) => setSearchForm({ ...searchForm, desig: e.target.value })}
                  className="bg-background border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                />
                <input
                  type="text"
                  placeholder="Key Skills Required"
                  value={searchForm.skills}
                  onChange={(e) => setSearchForm({ ...searchForm, skills: e.target.value })}
                  className="bg-background border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                />
                <input
                  type="text"
                  placeholder="Preferred Location"
                  value={searchForm.location}
                  onChange={(e) => setSearchForm({ ...searchForm, location: e.target.value })}
                  className="bg-background border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                />
                <input
                  type="text"
                  placeholder="Industry Type"
                  value={searchForm.industry}
                  onChange={(e) => setSearchForm({ ...searchForm, industry: e.target.value })}
                  className="bg-background border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                />
                <button
                  type="submit"
                  disabled={searchLoading}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2 rounded-lg transition"
                >
                  {searchLoading ? "Searching..." : "Search"}
                </button>
              </form>

              {searchDone && (
                <div className="space-y-4">
                  <h3 className="font-heading font-bold text-lg">Results ({searchResults.length})</h3>
                  {searchResults.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground text-xs font-light">
                      No jobs matched your filters. Try widening your keywords.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {searchResults.map((job) => (
                        <div key={job.jobid} className="bg-background border border-border/80 p-5 rounded-2xl shadow-sm hover:border-indigo-500/30 transition duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <h3 className="font-heading font-bold text-lg">{job.title}</h3>
                            <p className="text-xs text-indigo-400 font-medium">{job.ename} • {job.location}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2 font-light">{job.jobdesc}</p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                              {job.basicpay}
                            </span>
                            {job.has_applied ? (
                              <span className="px-3 py-1 bg-accent border border-border text-muted-foreground text-xs font-bold rounded-lg cursor-default">
                                Applied
                              </span>
                            ) : (
                              <button
                                onClick={() => handleApply(job.jobid)}
                                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-sm transition"
                              >
                                Apply Now
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "applied" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-heading">Applied Jobs</h2>
                <p className="text-xs text-muted-foreground font-light">Track the selection state of your job applications.</p>
              </div>

              {appliedJobs.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground font-light text-sm">
                  You have not applied to any jobs yet!
                </div>
              ) : (
                <div className="border border-border rounded-2xl overflow-hidden bg-background">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-accent/40 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
                        <th className="px-6 py-3">Company</th>
                        <th className="px-6 py-3">Job Title</th>
                        <th className="px-6 py-3">Applied Date</th>
                        <th className="px-6 py-3">Selection State</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-xs text-foreground">
                      {appliedJobs.map((job) => (
                        <tr key={job.apply_id} className="hover:bg-accent/10">
                          <td className="px-6 py-4 font-semibold text-indigo-400">{job.ename}</td>
                          <td className="px-6 py-4 font-medium">{job.title}</td>
                          <td className="px-6 py-4 text-muted-foreground font-light">{job.date_applied}</td>
                          <td className="px-6 py-4">
                            {job.status == 2 ? (
                              <span className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 font-semibold rounded-full">
                                Rejected
                              </span>
                            ) : job.status == 1 ? (
                              <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold rounded-full animate-pulse">
                                Selected
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold rounded-full">
                                Pending Review
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "shortlisted" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-heading">Shortlisted Job Offers</h2>
                <p className="text-xs text-muted-foreground font-light">Congratulations! These employers have shortlisted you for interview calls.</p>
              </div>

              {shortlistedJobs.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground font-light text-sm">
                  No active shortlists yet. Keep updating your profile to attract recruiters!
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs p-4 rounded-2xl flex items-center gap-3">
                    <Award className="h-5 w-5 shrink-0" />
                    <span>You have been accepted/shortlisted for {shortlistedJobs.length} job(s). The hiring managers will contact you via your phone or email.</span>
                  </div>
                  {shortlistedJobs.map((job) => (
                    <div key={job.sel_id} className="bg-card/40 border border-emerald-500/20 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                      <div>
                        <h3 className="font-heading font-bold text-lg text-foreground">{job.title}</h3>
                        <p className="text-xs text-indigo-400 font-medium">{job.ename}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                          Shortlisted on {job.date_selected}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
