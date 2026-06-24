import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { LocationSelector } from "@/components/LocationSelector"
import { Building, PlusCircle, LayoutList, Users, LogOut, Upload, Download, CheckCircle, XCircle, User, Eye, MapPin, Settings } from "lucide-react"



interface Job {
  jobid: string;
  title: string;
  jobdesc: string;
  vacno: string;
  experience: string;
  basicpay: string;
  fnarea: string;
  location: string;
  industry: string;
  ugqual: string;
  pgqual: string;
  jprofile: string;
  postdate: string;
  applicant_count?: number;
}

interface Applicant {
  apply_id: string;
  app_status: number;
  date_applied: string;
  jobid: string;
  job_title: string;
  user_id: string;
  js_name: string;
  js_phone: string;
  js_location: string;
  js_experience: string;
  js_skills: string;
  basic_edu: string;
  master_edu: string;
  other_qual: string;
  js_resume: string | null;
  js_photo: string | null;
  selection_status: "Selected" | "Rejected" | "Pending";
}

export function EmployerDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<"profile" | "post" | "manage" | "applicants" | "settings">("profile")
  const [profile, setProfile] = useState<any>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  
  // Selected Job ID for viewing applicants
  const [selectedJobTitle, setSelectedJobTitle] = useState<string>("")
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [applicantLoading, setApplicantLoading] = useState(false)

  // Candidate Details Modal state
  const [selectedCandidate, setSelectedCandidate] = useState<Applicant | null>(null)

  // Form states
  const [profileForm, setProfileForm] = useState({
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

  const [jobForm, setJobForm] = useState({
    title: "",
    vacno: "1",
    jobdesc: "",
    experience: "",
    money: "Rs",
    pay: "",
    fnarea: "",
    industry: "",
    ugqual: "B.Tech/B.E.",
    pgqual: "Not Pursuing Post Graduation",
    jprofile: "",
    country: "",
    state: "",
    city: ""
  })

  // Settings Form state
  const [passwordForm, setPasswordForm] = useState({ old_password: "", new_password: "", confirm_password: "" })
  const [deletePassword, setDeletePassword] = useState("")

  const [alert, setAlert] = useState<{ type: "success" | "error"; msg: string } | null>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  const showAlert = (type: "success" | "error", msg: string) => {
    setAlert({ type, msg })
    setTimeout(() => setAlert(null), 5000)
  }

  const fetchProfile = () => {
    fetch("/api/employer.php?action=profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProfile(data.profile)
          setProfileForm({
            ename: data.profile.ename || "",
            comtype: data.profile.etype || "Company",
            indtype: data.profile.industry || "",
            address: data.profile.address || "",
            pincode: data.profile.pincode || "",
            executive: data.profile.executive || "",
            phone: data.profile.phone || "",
            profile: data.profile.profile || "",
            country: "",
            state: "",
            city: ""
          })
        }
      })
      .catch((err) => console.error("Error fetching profile:", err))
  }

  const fetchJobs = () => {
    fetch("/api/jobs.php?action=manage")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setJobs(data.jobs)
        }
      })
      .catch((err) => console.error("Error fetching jobs:", err))
  }

  useEffect(() => {
    fetchProfile()
    fetchJobs()
  }, [])

  useEffect(() => {
    if (activeTab === "manage") {
      fetchJobs()
    }
  }, [activeTab])

  // Fetch applicants for a job
  const handleViewApplicants = (jobid: number, title: string) => {
    setSelectedJobTitle(title)
    setActiveTab("applicants")
    setApplicantLoading(true)
    fetch(`/api/employer.php?action=applicants&jid=${jobid}`)
      .then((res) => res.json())
      .then((data) => {
        setApplicantLoading(false)
        if (data.success) {
          setApplicants(data.applicants)
        }
      })
      .catch((err) => {
        console.error(err)
        setApplicantLoading(false)
      })
  }

  // Update profile
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetch("/api/employer.php?action=update", {
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
          showAlert("success", "Company profile updated successfully!")
          fetchProfile()
        } else {
          showAlert("error", data.message || "Failed to update profile")
        }
      })
      .catch((err) => {
        console.error(err)
        showAlert("error", "Error updating profile")
      })
  }

  // Post new job
  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!jobForm.country || !jobForm.state || !jobForm.city) {
      showAlert("error", "Please select a country, state, and city for the job location.")
      return;
    }

    const payString = `${jobForm.money} ${jobForm.pay}`
    fetch("/api/jobs.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "post",
        title: jobForm.title,
        vacno: jobForm.vacno,
        jobdesc: jobForm.jobdesc,
        experience: jobForm.experience,
        basicpay: payString,
        fnarea: jobForm.fnarea,
        industry: jobForm.industry,
        ugqual: jobForm.ugqual,
        pgqual: jobForm.pgqual,
        jprofile: jobForm.jprofile,
        country: jobForm.country,
        state: jobForm.state,
        city: jobForm.city
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          showAlert("success", "Job posted successfully!")
          setJobForm({
            title: "",
            vacno: "1",
            jobdesc: "",
            experience: "",
            money: "Rs",
            pay: "",
            fnarea: "",
            industry: "",
            ugqual: "B.Tech/B.E.",
            pgqual: "Not Pursuing Post Graduation",
            jprofile: "",
            country: "",
            state: "",
            city: ""
          })
          setActiveTab("manage")
        } else {
          showAlert("error", data.message || "Failed to post job")
        }
      })
      .catch((err) => {
        console.error(err)
        showAlert("error", "Error posting job")
      })
  }

  // Delete a job
  const handleDeleteJob = (jid: string) => {
    if (!confirm("Are you sure you want to delete this job posting? All applicants associated will be deleted as well.")) return

    fetch("/api/jobs.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "delete",
        jid
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          showAlert("success", "Job posting deleted successfully!")
          fetchJobs()
        } else {
          showAlert("error", data.message || "Failed to delete job")
        }
      })
      .catch((err) => {
        console.error(err)
        showAlert("error", "Error deleting job")
      })
  }

  // Select applicant
  const handleSelectCandidate = (app: Applicant) => {
    fetch("/api/employer.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "select",
        user_id: app.user_id,
        job_id: app.jobid
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          showAlert("success", "Candidate successfully shortlisted/selected!")
          // Update local state
          setApplicants((prev) =>
            prev.map((a) => (a.apply_id === app.apply_id ? { ...a, selection_status: "Selected" } : a))
          )
          if (selectedCandidate?.apply_id === app.apply_id) {
            setSelectedCandidate({ ...selectedCandidate, selection_status: "Selected" })
          }
        } else {
          showAlert("error", data.message || "Error selecting candidate")
        }
      })
      .catch((err) => console.error(err))
  }

  // Reject applicant
  const handleRejectCandidate = (app: Applicant) => {
    fetch("/api/employer.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "reject",
        user_id: app.user_id,
        job_id: app.jobid
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          showAlert("success", "Candidate application rejected.")
          // Update local state
          setApplicants((prev) =>
            prev.map((a) => (a.apply_id === app.apply_id ? { ...a, selection_status: "Rejected" } : a))
          )
          if (selectedCandidate?.apply_id === app.apply_id) {
            setSelectedCandidate({ ...selectedCandidate, selection_status: "Rejected" })
          }
        } else {
          showAlert("error", data.message || "Error rejecting candidate")
        }
      })
      .catch((err) => console.error(err))
  }

  // Upload Logo
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

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    fetch("/api/upload.php?type=logo", {
      method: "POST",
      body: formData
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          showAlert("success", "Company logo uploaded successfully!")
          fetchProfile()
        } else {
          showAlert("error", data.message || "Failed to upload logo")
        }
      })
      .catch((err) => {
        console.error(err)
        showAlert("error", "Error uploading logo")
      })
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full max-w-7xl mx-auto py-8 px-6">
      {/* Sidebar */}
      <aside className="w-full md:w-64 shrink-0 flex flex-col gap-6">
        <div className="bg-card/40 backdrop-blur-md border border-border/60 rounded-2xl p-6 flex flex-col items-center text-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-violet-500 to-indigo-500" />
          
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-border bg-accent/30 mb-4 group cursor-pointer flex items-center justify-center" onClick={() => logoInputRef.current?.click()}>
            {profile?.logo ? (
              <img src={`/uploads/logo/${profile.logo}`} alt="Logo" className="max-w-full max-h-full object-contain" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-accent/50">
                <Building className="h-8 w-8 mb-1" />
                <span className="text-[10px] font-bold">Upload Logo</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-200">
              <Upload className="h-5 w-5 text-white" />
            </div>
            <input type="file" ref={logoInputRef} onChange={handleLogoUpload} className="hidden" accept=".jpg,.jpeg,.png" />
          </div>

          <h3 className="font-heading font-bold text-base leading-tight mb-1">{profile?.ename || user?.ename}</h3>
          <span className="text-[10px] uppercase tracking-widest text-violet-400 font-bold bg-violet-500/10 border border-violet-500/20 px-3 py-1 rounded-full mb-4">
            Employer
          </span>
          <p className="text-[11px] text-muted-foreground font-light">{profile?.email || user?.email}</p>
        </div>

        <nav className="flex flex-col gap-1.5 bg-card/35 backdrop-blur-sm border border-border/50 p-2 rounded-2xl">
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full text-left px-4 py-2.5 text-xs font-semibold rounded-xl flex items-center gap-3 transition ${
              activeTab === "profile" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
            }`}
          >
            <Building className="h-4 w-4" /> Company Profile
          </button>
          <button
            onClick={() => setActiveTab("post")}
            className={`w-full text-left px-4 py-2.5 text-xs font-semibold rounded-xl flex items-center gap-3 transition ${
              activeTab === "post" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
            }`}
          >
            <PlusCircle className="h-4 w-4" /> Post New Job
          </button>
          <button
            onClick={() => setActiveTab("manage")}
            className={`w-full text-left px-4 py-2.5 text-xs font-semibold rounded-xl flex items-center gap-3 transition ${
              activeTab === "manage" || activeTab === "applicants" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
            }`}
          >
            <LayoutList className="h-4 w-4" /> Manage Jobs
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

      {/* Main Content */}
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

        {/* Verification banner if employer is not approved (status 0) */}
        {profile?.login_status == 0 && (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs p-4 rounded-2xl mb-6 font-medium">
            Account Pending Approval: Your portal registration is under admin review. You can edit details or prepare jobs, but job applicants cannot find your postings until active status is confirmed.
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
                      className="py-2.5 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-lg shadow-md transition"
                    >
                      Update Password
                    </button>
                  </form>
                </div>

                <div className="bg-rose-500/5 border border-rose-500/20 p-5 rounded-2xl shadow-sm">
                  <h3 className="font-heading font-bold text-lg text-rose-500 mb-2">Delete Account</h3>
                  <p className="text-xs text-rose-400/80 mb-4 font-medium">Warning: This action is permanent and will delete all your job postings and company data.</p>
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
              <div>
                <h2 className="text-2xl font-bold font-heading">Company Profile</h2>
                <p className="text-xs text-muted-foreground font-light">Set up details shown to applicants on job postings.</p>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Company Name</label>
                    <input
                      type="text"
                      required
                      value={profileForm.ename}
                      onChange={(e) => setProfileForm({ ...profileForm, ename: e.target.value })}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">HR/Contact Phone</label>
                    <input
                      type="text"
                      required
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Company Type</label>
                    <select
                      required
                      value={profileForm.comtype}
                      onChange={(e) => setProfileForm({ ...profileForm, comtype: e.target.value })}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    >
                      <option value="Company">Company</option>
                      <option value="Consultant">Consultant</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Industry Sector</label>
                    <input
                      type="text"
                      required
                      value={profileForm.indtype}
                      onChange={(e) => setProfileForm({ ...profileForm, indtype: e.target.value })}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Executive Name</label>
                    <input
                      type="text"
                      required
                      value={profileForm.executive}
                      onChange={(e) => setProfileForm({ ...profileForm, executive: e.target.value })}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="sm:col-span-3 flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Street Address</label>
                    <input
                      type="text"
                      required
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pincode</label>
                    <input
                      type="text"
                      required
                      value={profileForm.pincode}
                      onChange={(e) => setProfileForm({ ...profileForm, pincode: e.target.value })}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Company Description</label>
                  <textarea
                    required
                    rows={4}
                    value={profileForm.profile}
                    onChange={(e) => setProfileForm({ ...profileForm, profile: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  />
                </div>

                <div className="flex flex-col gap-3 border border-border/50 bg-accent/20 p-4 rounded-xl">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Current Registered Location: <span className="text-indigo-400 font-semibold">{profile?.location}</span></span>
                  <LocationSelector
                    onLocationChange={(country, state, city) => {
                      setProfileForm({ ...profileForm, country, state, city })
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-lg shadow-md transition"
                >
                  Save Profile Changes
                </button>
              </form>
            </div>
          )}

          {activeTab === "post" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-heading">Post a Job Vacancy</h2>
                <p className="text-xs text-muted-foreground font-light">Fill out details to publish a new job listing.</p>
              </div>

              <form onSubmit={handlePostJob} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Job Title / Designation</label>
                    <input
                      type="text"
                      required
                      value={jobForm.title}
                      onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                      placeholder="e.g. Network Administrator"
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Vacancies Count</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={jobForm.vacno}
                      onChange={(e) => setJobForm({ ...jobForm, vacno: e.target.value })}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Experience (Years)</label>
                    <input
                      type="text"
                      required
                      value={jobForm.experience}
                      onChange={(e) => setJobForm({ ...jobForm, experience: e.target.value })}
                      placeholder="e.g. 5"
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pay Scale Type</label>
                    <select
                      value={jobForm.money}
                      onChange={(e) => setJobForm({ ...jobForm, money: e.target.value })}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    >
                      <option value="Rs">Rs</option>
                      <option value="USD">USD</option>
                      <option value="GBP">GBP</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Salary Amount</label>
                    <input
                      type="text"
                      required
                      value={jobForm.pay}
                      onChange={(e) => setJobForm({ ...jobForm, pay: e.target.value })}
                      placeholder="e.g. 75000 or 1000000"
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Functional Area</label>
                    <input
                      type="text"
                      required
                      value={jobForm.fnarea}
                      onChange={(e) => setJobForm({ ...jobForm, fnarea: e.target.value })}
                      placeholder="e.g. Network Administration"
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Industry Type</label>
                    <input
                      type="text"
                      required
                      value={jobForm.industry}
                      onChange={(e) => setJobForm({ ...jobForm, industry: e.target.value })}
                      placeholder="e.g. Software Services"
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Min UG Qualification Required</label>
                    <select
                      value={jobForm.ugqual}
                      onChange={(e) => setJobForm({ ...jobForm, ugqual: e.target.value })}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    >
                      <option value="B.Tech/B.E.">B.Tech/B.E.</option>
                      <option value="B.C.A.">B.C.A.</option>
                      <option value="B.Sc.">B.Sc.</option>
                      <option value="B.A.">B.A.</option>
                      <option value="B.Com.">B.Com.</option>
                      <option value="Not Pursuing Graduation">Not Pursuing Graduation</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Min PG Qualification Required</label>
                    <select
                      value={jobForm.pgqual}
                      onChange={(e) => setJobForm({ ...jobForm, pgqual: e.target.value })}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    >
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
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Job Description</label>
                  <textarea
                    required
                    rows={4}
                    value={jobForm.jobdesc}
                    onChange={(e) => setJobForm({ ...jobForm, jobdesc: e.target.value })}
                    placeholder="Write detailed responsibilities, key tasks, etc..."
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Preferred Candidate Key Skills & Profile</label>
                  <textarea
                    required
                    rows={3}
                    value={jobForm.jprofile}
                    onChange={(e) => setJobForm({ ...jobForm, jprofile: e.target.value })}
                    placeholder="Describe desired skills, certifications, patience, attention to detail, etc..."
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  />
                </div>

                <div className="flex flex-col gap-3 border border-border/50 bg-accent/20 p-4 rounded-xl">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Job Location:</span>
                  <LocationSelector
                    onLocationChange={(country, state, city) => {
                      setJobForm({ ...jobForm, country, state, city })
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-lg shadow-md transition"
                >
                  Publish Job Vacancy
                </button>
              </form>
            </div>
          )}

          {activeTab === "manage" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-heading">Manage Job Postings</h2>
                <p className="text-xs text-muted-foreground font-light">List of active vacancies and review incoming applicants.</p>
              </div>

              {jobs.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground font-light text-sm">
                  You have not posted any job listings yet!
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div key={job.jobid} className="bg-background border border-border/80 p-5 rounded-2xl shadow-sm hover:border-violet-500/30 transition duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-heading font-bold text-lg">{job.title}</h3>
                        <p className="text-xs text-violet-400 font-medium">Post Date: {job.postdate} • Location: {job.location}</p>
                        <p className="text-xs text-muted-foreground font-light line-clamp-2 mt-1">{job.jobdesc}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-[10px] font-medium bg-accent border border-border px-2 py-0.5 rounded">
                            UG: {job.ugqual}
                          </span>
                          <span className="text-[10px] font-medium bg-accent border border-border px-2 py-0.5 rounded">
                            PG: {job.pgqual}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          onClick={() => handleViewApplicants(parseInt(job.jobid), job.title)}
                          className="px-4 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5"
                        >
                          <Users className="h-3.5 w-3.5" /> Applicants ({job.applicant_count || 0})
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job.jobid)}
                          className="px-4 py-1.5 border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 text-xs font-bold rounded-lg transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "applicants" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="text-2xl font-bold font-heading">Applicants: {selectedJobTitle}</h2>
                  <p className="text-xs text-muted-foreground font-light">Shortlist or reject candidates who applied.</p>
                </div>
                <button
                  onClick={() => setActiveTab("manage")}
                  className="text-xs text-violet-400 hover:text-violet-300 font-semibold"
                >
                  Back to List
                </button>
              </div>

              {applicantLoading ? (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  Loading applicants list...
                </div>
              ) : applicants.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground font-light text-sm">
                  No applicants have applied to this vacancy yet.
                </div>
              ) : (
                <div className="border border-border rounded-2xl overflow-hidden bg-background">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-accent/40 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
                        <th className="px-6 py-3">Full Name</th>
                        <th className="px-6 py-3">Education Qualifications</th>
                        <th className="px-6 py-3">Skills Summary</th>
                        <th className="px-6 py-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-xs text-foreground">
                      {applicants.map((app) => (
                        <tr key={app.apply_id} className="hover:bg-accent/10">
                          <td className="px-6 py-4">
                            <button
                              onClick={() => setSelectedCandidate(app)}
                              className="font-semibold text-violet-400 hover:underline flex items-center gap-1.5 text-left"
                            >
                              {app.js_name} <Eye className="h-3 w-3 inline" />
                            </button>
                            <span className="text-[10px] text-muted-foreground block font-light">{app.date_applied}</span>
                          </td>
                          <td className="px-6 py-4 font-light">
                            <span className="font-medium">UG:</span> {app.basic_edu} <br />
                            <span className="font-medium">PG:</span> {app.master_edu}
                          </td>
                          <td className="px-6 py-4 font-light max-w-xs truncate">{app.js_skills}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              {app.selection_status === "Selected" ? (
                                <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold rounded-lg flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3" /> Selected
                                </span>
                              ) : app.selection_status === "Rejected" ? (
                                <span className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold rounded-lg flex items-center gap-1">
                                  <XCircle className="h-3 w-3" /> Rejected
                                </span>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleSelectCandidate(app)}
                                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold rounded"
                                  >
                                    Select
                                  </button>
                                  <button
                                    onClick={() => handleRejectCandidate(app)}
                                    className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold rounded"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Candidate Details Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border max-w-md w-full rounded-2xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="font-heading font-bold text-lg text-foreground">Candidate Profile</h3>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="text-muted-foreground hover:text-foreground text-sm font-semibold"
              >
                Close
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border bg-accent/25 shrink-0">
                  {selectedCandidate.js_photo ? (
                    <img src={`/uploads/images/${selectedCandidate.js_photo}`} alt="Photo" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <User className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-base">{selectedCandidate.js_name}</h4>
                  <p className="text-xs text-muted-foreground font-light flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-violet-400" /> {selectedCandidate.js_location}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-3 border-b border-border/40 pb-2">
                  <span className="text-muted-foreground font-medium">Phone Number</span>
                  <span className="col-span-2 font-semibold">{selectedCandidate.js_phone}</span>
                </div>
                <div className="grid grid-cols-3 border-b border-border/40 pb-2">
                  <span className="text-muted-foreground font-medium">Experience</span>
                  <span className="col-span-2 font-semibold">{selectedCandidate.js_experience} Years</span>
                </div>
                <div className="grid grid-cols-3 border-b border-border/40 pb-2">
                  <span className="text-muted-foreground font-medium">UG Qualification</span>
                  <span className="col-span-2 font-semibold">{selectedCandidate.basic_edu}</span>
                </div>
                <div className="grid grid-cols-3 border-b border-border/40 pb-2">
                  <span className="text-muted-foreground font-medium">PG Qualification</span>
                  <span className="col-span-2 font-semibold">{selectedCandidate.master_edu}</span>
                </div>
                {selectedCandidate.other_qual && (
                  <div className="grid grid-cols-3 border-b border-border/40 pb-2">
                    <span className="text-muted-foreground font-medium">Other Qual.</span>
                    <span className="col-span-2 font-semibold">{selectedCandidate.other_qual}</span>
                  </div>
                )}
                <div className="space-y-1">
                  <span className="text-muted-foreground font-medium block">Key Skills Summary</span>
                  <p className="p-3 bg-accent/40 rounded-lg text-foreground font-light">{selectedCandidate.js_skills}</p>
                </div>
                
                {selectedCandidate.js_resume && (
                  <div className="pt-2 flex justify-center">
                    <a
                      href={`/uploads/resume/${selectedCandidate.js_resume}`}
                      download
                      className="px-4 py-2 border border-violet-500/20 bg-violet-500/5 hover:bg-violet-500/10 text-violet-400 font-bold rounded-lg flex items-center gap-2 transition"
                    >
                      <Download className="h-4 w-4" /> Download Candidate Resume
                    </a>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6 border-t border-border bg-accent/20 flex gap-3">
              {selectedCandidate.selection_status === "Selected" ? (
                <span className="w-full text-center py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold rounded-lg">
                  Candidate Selected
                </span>
              ) : selectedCandidate.selection_status === "Rejected" ? (
                <span className="w-full text-center py-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold rounded-lg">
                  Application Rejected
                </span>
              ) : (
                <>
                  <button
                    onClick={() => handleSelectCandidate(selectedCandidate)}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow transition"
                  >
                    Select Candidate
                  </button>
                  <button
                    onClick={() => handleRejectCandidate(selectedCandidate)}
                    className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg shadow transition"
                  >
                    Reject Candidate
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
