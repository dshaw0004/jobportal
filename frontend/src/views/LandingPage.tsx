import React, { useState, useEffect } from "react"
import {
  Search,
  MapPin,
  Mail,
  Phone,
  ArrowRight,
  Briefcase,
  Clock,
  TrendingUp,
  Users,
  Building2,
  CheckCircle,
  ChevronRight,
} from "lucide-react"

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
}

interface LandingPageProps {
  onNavigate: (view: string) => void;
}

const CATEGORIES = [
  { label: "Software & IT", icon: "💻", count: "1.2k+" },
  { label: "Finance & Banking", icon: "🏦", count: "840+" },
  { label: "Healthcare", icon: "🏥", count: "620+" },
  { label: "Marketing & Sales", icon: "📈", count: "510+" },
  { label: "Engineering", icon: "⚙️", count: "730+" },
  { label: "Education", icon: "🎓", count: "390+" },
  { label: "Design & Creative", icon: "🎨", count: "280+" },
  { label: "Operations", icon: "📦", count: "460+" },
]

const STATS = [
  { value: "45,000+", label: "Active Employers", icon: Building2 },
  { value: "2.1M+", label: "Jobs Posted", icon: Briefcase },
  { value: "8.4M+", label: "Candidates Hired", icon: Users },
  { value: "98%", label: "Satisfaction Rate", icon: TrendingUp },
]

export function LandingPage({ onNavigate }: LandingPageProps) {
  const [keyword, setKeyword] = useState("")
  const [jobs, setJobs] = useState<Job[]>([])
  const [recentJobs, setRecentJobs] = useState<Job[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchDone, setSearchDone] = useState(false)
  const [contactForm, setContactForm] = useState({ name: "", email: "", comments: "" })
  const [contactMsg, setContactMsg] = useState("")

  useEffect(() => {
    fetch("/api/jobs.php?action=recent")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.jobs) setRecentJobs(data.jobs)
      })
      .catch((err) => console.error("Error fetching recent jobs:", err))
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!keyword.trim()) return

    setIsSearching(true)
    fetch(`/api/jobs.php?action=search&keyword=${encodeURIComponent(keyword)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.jobs) {
          setJobs(data.jobs)
          setSearchDone(true)
        }
        setIsSearching(false)
      })
      .catch((err) => {
        console.error("Error searching jobs:", err)
        setIsSearching(false)
      })
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setContactMsg("Thank you! We will get back to you within 24 hours.")
    setContactForm({ name: "", email: "", comments: "" })
    setTimeout(() => setContactMsg(""), 5000)
  }

  return (
    <div className="flex flex-col w-full min-h-screen">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border py-20 px-6 md:px-12">
        {/* Subtle background tint that works in both themes */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/5 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6 relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              India's Fastest Growing Job Portal
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold font-heading tracking-tight text-foreground leading-tight">
            Find the Job That<br />
            <span className="text-indigo-600 dark:text-indigo-400">Fits Your Future</span>
          </h1>

          <p className="text-base md:text-lg text-muted-foreground max-w-xl font-light leading-relaxed">
            Browse thousands of verified openings from top companies. One profile, one click, and you're on your way.
          </p>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="w-full max-w-2xl flex flex-col sm:flex-row items-stretch gap-2 bg-background border border-border rounded-2xl shadow-lg p-2"
          >
            <div className="flex items-center flex-1 px-3 gap-2">
              <Search className="text-muted-foreground h-4 w-4 shrink-0" />
              <input
                type="text"
                placeholder="Job title, skills, or company name..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-transparent text-foreground placeholder-muted-foreground/60 focus:outline-none text-sm py-2"
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow transition duration-200"
            >
              {isSearching ? "Searching…" : "Search Jobs"}
            </button>
          </form>

          <p className="text-xs text-muted-foreground">
            Popular: <button onClick={() => { setKeyword("React"); }} className="underline hover:text-indigo-500 transition">React Developer</button>,{" "}
            <button onClick={() => { setKeyword("Data Analyst"); }} className="underline hover:text-indigo-500 transition">Data Analyst</button>,{" "}
            <button onClick={() => { setKeyword("MBA"); }} className="underline hover:text-indigo-500 transition">MBA</button>,{" "}
            <button onClick={() => { setKeyword("Nursing"); }} className="underline hover:text-indigo-500 transition">Nursing</button>
          </p>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────── */}
      <section className="border-b border-border bg-accent/20">
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map(({ value, label, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <Icon className="h-5 w-5 text-indigo-500 mb-1" />
              <span className="text-xl font-extrabold font-heading text-foreground">{value}</span>
              <span className="text-xs text-muted-foreground font-light">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── SEARCH RESULTS ───────────────────────────────────────── */}
      {searchDone && (
        <section className="py-10 px-6 max-w-6xl mx-auto w-full">
          <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
            <h2 className="text-xl font-bold font-heading">
              Results for &ldquo;{keyword}&rdquo; ({jobs.length})
            </h2>
            <button
              onClick={() => { setKeyword(""); setSearchDone(false); setJobs([]) }}
              className="text-xs text-indigo-500 hover:text-indigo-600 font-semibold"
            >
              Clear
            </button>
          </div>
          {jobs.length === 0 ? (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-xl text-center">
              No jobs found for &ldquo;{keyword}&rdquo;. Try a broader keyword.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {jobs.map((job) => (
                <JobCard key={job.jobid} job={job} onNavigate={onNavigate} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── JOB CATEGORIES ───────────────────────────────────────── */}
      <section className="py-14 px-6 max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold font-heading">Browse by Category</h2>
            <p className="text-muted-foreground text-sm font-light mt-1">Explore opportunities across every industry</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATEGORIES.map(({ label, icon, count }) => (
            <button
              key={label}
              onClick={() => { setKeyword(label); handleSearch({ preventDefault: () => {} } as React.FormEvent) }}
              className="group flex flex-col items-start gap-3 p-5 bg-background border border-border rounded-2xl hover:border-indigo-500/40 hover:shadow-sm transition duration-200 text-left"
            >
              <span className="text-2xl">{icon}</span>
              <div>
                <p className="text-sm font-semibold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">{label}</p>
                <p className="text-xs text-muted-foreground font-light mt-0.5">{count} jobs</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── RECENT JOBS ──────────────────────────────────────────── */}
      <section className="py-14 px-6 max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold font-heading">Latest Openings</h2>
            <p className="text-muted-foreground text-sm font-light mt-1">Freshly posted vacancies — updated daily</p>
          </div>
          <button
            onClick={() => onNavigate("auth")}
            className="hidden sm:flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            View all <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        {recentJobs.length === 0 ? (
          <div className="text-center text-muted-foreground py-12 text-sm">Loading recent opportunities…</div>
        ) : (
          <div className="flex flex-col gap-3">
            {recentJobs.slice(0, 6).map((job) => (
              <JobRow key={job.jobid} job={job} onNavigate={onNavigate} />
            ))}
          </div>
        )}
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section className="py-16 px-6 border-y border-border bg-accent/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold font-heading">How JOB NOVA Works</h2>
            <p className="text-muted-foreground text-sm font-light mt-2 max-w-md mx-auto">
              Get hired in three simple steps — no fees, no fuss.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Create Your Profile", desc: "Register and fill in your education, skills, and work experience in minutes." },
              { step: "02", title: "Discover Opportunities", desc: "Browse qualified job matches or use advanced filters to find the perfect role." },
              { step: "03", title: "Apply & Get Hired", desc: "One-click applications — employers review your profile and contact you directly." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-extrabold font-heading text-indigo-500/30">{step}</span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <h3 className="font-heading font-bold text-base text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate("auth")}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-md transition"
            >
              Get Started as Jobseeker
            </button>
            <button
              onClick={() => onNavigate("auth")}
              className="px-8 py-3 border border-border bg-background hover:bg-accent text-foreground font-semibold text-sm rounded-xl transition"
            >
              Post a Job as Employer
            </button>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ─────────────────────────────────────────── */}
      <section className="py-16 px-6 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold font-heading mb-4">Why Thousands Trust JOB NOVA</h2>
            <p className="text-muted-foreground text-sm font-light mb-8 leading-relaxed">
              We connect qualified candidates with the right companies — fast, transparently, and without hidden costs.
            </p>
            <ul className="space-y-4">
              {[
                "Verified employer listings — no ghost jobs",
                "Qualification-based job matching algorithm",
                "Instant application status tracking",
                "Resume upload and one-click apply",
                "100% free for job seekers, forever",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-foreground">
                  <CheckCircle className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Avg. Time to Hire", value: "12 Days", sub: "From application to offer" },
              { label: "Active Jobs Right Now", value: "4,800+", sub: "Updated every hour" },
              { label: "Industries Covered", value: "30+", sub: "Across all sectors" },
              { label: "Cities Supported", value: "500+", sub: "Pan-India coverage" },
            ].map(({ label, value, sub }) => (
              <div key={label} className="bg-background border border-border rounded-2xl p-5">
                <p className="text-xl font-extrabold font-heading text-indigo-600 dark:text-indigo-400">{value}</p>
                <p className="text-xs font-semibold text-foreground mt-1">{label}</p>
                <p className="text-[11px] text-muted-foreground font-light mt-0.5">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────── */}
      <section className="py-16 px-6 border-t border-border bg-accent/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold font-heading mb-2">Get in Touch</h2>
            <p className="text-muted-foreground text-sm font-light max-w-md mx-auto">
              Have questions about listings, partnerships, or your account? Drop us a message.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
            <div className="md:col-span-2 space-y-5">
              {[
                { icon: MapPin, label: "Location", value: "West Bengal, India" },
                { icon: Phone, label: "Phone", value: "+91 85093 32887" },
                { icon: Mail, label: "Email", value: "info@jobnova.com" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="p-2.5 bg-background border border-border rounded-xl text-indigo-500 shrink-0">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground">{value}</p>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleContactSubmit} className="md:col-span-3 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text" placeholder="Your Name" value={contactForm.name} required
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition"
                />
                <input
                  type="email" placeholder="Email Address" value={contactForm.email} required
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition"
                />
              </div>
              <textarea
                placeholder="Your message…" rows={4} value={contactForm.comments} required
                onChange={(e) => setContactForm({ ...contactForm, comments: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition"
              />
              {contactMsg && (
                <p className="text-xs text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-lg font-medium">
                  {contactMsg}
                </p>
              )}
              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer className="py-8 border-t border-border bg-background text-center">
        <p className="text-xs text-muted-foreground font-light">
          &copy; {new Date().getFullYear()} JOB NOVA &mdash; All rights reserved. Built with ❤️ for India&rsquo;s workforce.
        </p>
      </footer>
    </div>
  )
}

/* ── Reusable Job Card (search results) ─────────────────── */
function JobCard({ job, onNavigate }: { job: Job; onNavigate: (v: string) => void }) {
  return (
    <div className="bg-background border border-border hover:border-indigo-500/30 rounded-2xl p-5 shadow-sm transition duration-200 flex flex-col justify-between gap-4">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <h3 className="font-heading font-bold text-base text-foreground leading-snug">{job.title}</h3>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">{job.ename}</p>
          </div>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-semibold shrink-0">
            {job.basicpay}
          </span>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 font-light">{job.jobdesc}</p>
      </div>
      <div className="flex items-center justify-between text-xs border-t border-border pt-3">
        <div className="flex items-center gap-3 text-muted-foreground">
          <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-indigo-500" />{job.location.split(",").slice(-1)[0]}</span>
          <span className="flex items-center gap-1"><Briefcase className="h-3 w-3 text-indigo-500" />{job.experience} Yrs</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-indigo-500" />{job.postdate}</span>
        </div>
        <button
          onClick={() => onNavigate("auth")}
          className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-0.5"
        >
          Apply <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}

/* ── Reusable Job Row (recent jobs list) ─────────────────── */
function JobRow({ job, onNavigate }: { job: Job; onNavigate: (v: string) => void }) {
  return (
    <div className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background border border-border hover:border-indigo-500/30 rounded-2xl px-5 py-4 transition duration-200">
      <div className="flex items-start gap-4 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/10 flex items-center justify-center shrink-0 text-indigo-500 font-bold text-sm font-heading">
          {job.ename.charAt(0)}
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-sm text-foreground truncate">{job.title}</h3>
          <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{job.ename}</p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-muted-foreground font-light">
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location.split(",").slice(-1)[0]}</span>
            <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{job.experience} Yrs exp</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
          {job.basicpay}
        </span>
        <button
          onClick={() => onNavigate("auth")}
          className="px-4 py-1.5 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500 hover:text-white hover:border-indigo-500 font-semibold text-xs rounded-lg transition duration-200"
        >
          Apply
        </button>
      </div>
    </div>
  )
}
