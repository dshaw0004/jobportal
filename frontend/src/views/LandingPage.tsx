import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Search,
  MapPin,
  Briefcase,
  CheckCircle,
  ArrowRight,
  Building2,
  Train,
  Wallet,
  Shield,
  GraduationCap,
  Wrench,
  Calendar,
  Share2,
  Smile,
  Mail,
  Network,
  Zap,
  ShieldCheck,
  TrendingUp,
  CreditCard
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
  industry?: string;
}

const logoBase64 = "data:image/png;base64,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"

const COMPANY_LOGOS = {
  Google: "https://lh3.googleusercontent.com/aida-public/AB6AXuC4WT-ao_Wx6rLtgFi1qDaLQZAmQWc8An_otqzkd59AwU60IQy7l9xmSxu-GzIdWbIig8nsxCN8fSqXOovwhjKpymrDBXug3XSfdjQE-N025OsYFx8ryBkJ74SKwBCEn0uTEDGGFRPVdrIEo86ohA13eAMB6XdTVif5fLWz20dmj8j6s_dKOLQq3Wa0J5DAsHuH0s40lBTa1cE41BA60ZvVbMYtYNATb97L_HgK3X1zecOu75FbMN5NcxlxnarPdj__zIs_M4CyZGBI",
  Microsoft: "https://lh3.googleusercontent.com/aida-public/AB6AXuAf_CPY7Dz0BBIJQHE7vAn-DIfEGPnqoKZetEj6pjWERasB6wHIXDhH31Z3He56b_3fxED8-D7n6bdTgBuVr7djmA3wquOQqoA2HEqhQJaisnUZ-DjAn_lWZ9yq5JI0WKdW9Ct5LpvdP0tmCQY4PVfwlbWSJsDsPMJ68NQNr1f4ArDqovogMQd66I6DrjsDVt24M2zlFXNVIBqjvWItOm_61XZuCEQ4xeX827CdHsDhrQNpI0eI8pIa9jQH5vWd9N2fXpE08e_F9JZF",
  Amazon: "https://lh3.googleusercontent.com/aida-public/AB6AXuDi_nJvoeqkPQk7bFHW7K5wwC0vQE0D7xd3e-d8o-rIg4G8x-ZHIuqa_dLsajzZroav9eJwTnCau6gBsY9_s1S719-597Gu1UeRyXWQlT8l3XxmBA8LtIM23xju63MCEgEhiURjcV7gM-5b4q-SpSlrGndiFK9DO7Krl6WC3GlAFyaOt7a2rX8Q-h5uThG_w3X12YUWhYe9tr_waQDpRaY5whK8AXim2uLS-3XI5ZfXBJVZmqax5WfS0pXB53HXX9bRFlvABopHuO_X",
  Infosys: "https://lh3.googleusercontent.com/aida-public/AB6AXuAUiGIMjW-KC_kD8xqYYKFza5nD79wN_NEaXrAr2ZYAjxoSAwrzID1U4sPKsjBHbFZrRs7jt4RtBsxrCgHWYWQY_iv7tUqf9oQtueUa1l8zARS-yFuRBvgdIEAjpd9t5UP6QX6adZYo4oX3-G-AJUPyxbdA20_V9rnbxTDWJCiiflut3hp8kSbj9SlDfjoamZvDMBNpRK6pGLVAfxWTzyFc0YrhAG3pMmjhYjGBmMiW_kjurszygg8P-pgnq1QXBJ5hzF5kMXHcv7OV",
  TCS: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_wwB_FiwASfKTsXuvhS5Kl8UTDEVoFNCDbu3ADr9W3xHlhojTQMmoEwZ4CBuZK3IoziZM60MV0MWtsAj6RqOq9w9VDVktIetMZNAYj3OgNB0HYkJl84gnpDj3w89VR-DZQCmjF-FuBXghtyNGz7U6vay4TiD3727BdEu7h86yM680Q3AFavhz0eVXid-6CVsdIOIvO0kQNaG8D9gNhRWNxaUJGX5PGAfkayn8gVqAsOflTr6Q_MHrluS8DzsEYW0qtzVThdGCugSt",
  Wipro: "https://lh3.googleusercontent.com/aida-public/AB6AXuARqI_WmyffXtSz99zJD9gyERf-nT0jw55H_PZzHdWzgOeBtuVfRKupFEvzRBwI-eXqvqIlAp2EiP-Krfj_OOetNPrJc3XTuzYRshGxUzK70Ek4wARUVvbVqsZdJUeR1yHrEolH4h3l-d1mrQWEiRqN2iXFnu_PQsYXCCggNIrL4ib8QAFtFvPm0Bej3zL3ZPeZrjulf4KtqW6LzWzm8jn-5Qdfi7wk8ieh_gTB0f_u0V7DXN-9Dhm_NJGTCkotNztw_8B48VclTpdn",
  Accenture: "https://lh3.googleusercontent.com/aida-public/AB6AXuCc-ePejgzmslWH06RtZ5zpknPUivDeaY30fhFb8JA8X7UNwkEOAN8kT2786GcK_zWdk0umt-yuHOgWvLRp6sVrgcdP_H1k8Bmboo0MDejgKRIQ0rBLy9POyy-3E-mR7DgOBgCbRU-Rp1jX_HkrtsNxFQdxUhmJhyz-3RLiD5YSuzvrHvYhxf-TuZuj9AqwYd_3O0d4qpBKmG0oc_BIXtrOO7nli8_gDl8fQ0MH0XFGl3LZxK2tw5ihMDxwSIaLknB-qgvaUTBgJq69"
}

// Static fallback data for Govt Jobs
const STATIC_GOVT_JOBS = [
  { jobid: "static-g1", title: "Administrative Officer", ename: "Staff Selection Commission (SSC)", location: "New Delhi, India", postdate: "Last Date: 24 Oct, 2024", icon: "building", status: "Open" },
  { jobid: "static-g2", title: "Assistant Loco Pilot", ename: "Indian Railways (RRB)", location: "Multiple Locations", postdate: "Last Date: 15 Nov, 2024", icon: "train", status: "Open" },
  { jobid: "static-g3", title: "Probationary Officer", ename: "State Bank of India (SBI)", location: "Pan India", postdate: "Last Date: 05 Oct, 2024", icon: "wallet", status: "Expiring Soon" },
  { jobid: "static-g4", title: "Sub Inspector", ename: "Delhi Police", location: "Delhi", postdate: "Last Date: 30 Oct, 2024", icon: "shield", status: "Open" },
  { jobid: "static-g5", title: "Post Graduate Teacher", ename: "Kendriya Vidyalaya Sangathan (KVS)", location: "All India", postdate: "Last Date: 12 Nov, 2024", icon: "school", status: "Open" },
  { jobid: "static-g6", title: "Junior Engineer", ename: "Public Works Department (PWD)", location: "Karnataka", postdate: "Last Date: 10 Nov, 2024", icon: "wrench", status: "Open" }
]

// Static fallback data for Private Jobs
const STATIC_PRIVATE_JOBS = [
  { jobid: "static-p1", title: "Software Engineer II", ename: "Microsoft", location: "Remote", type: "Full-time", basicpay: "₹18L - 25L", logoKey: "Microsoft" as keyof typeof COMPANY_LOGOS },
  { jobid: "static-p2", title: "Product Manager", ename: "Amazon", location: "Hyderabad", type: "On-site", basicpay: "₹22L - 30L", logoKey: "Amazon" as keyof typeof COMPANY_LOGOS },
  { jobid: "static-p3", title: "Cloud Architect", ename: "Infosys", location: "Bengaluru", type: "Hybrid", basicpay: "₹15L - 20L", logoKey: "Infosys" as keyof typeof COMPANY_LOGOS }
]

// Function to classify Government jobs based on name, title, or industry
const isGovtJob = (job: Job) => {
  const query = (job.title + " " + job.ename + " " + (job.industry || "")).toLowerCase();
  return (
    query.includes("ssc") ||
    query.includes("upsc") ||
    query.includes("railway") ||
    query.includes("rrb") ||
    query.includes("sbi") ||
    query.includes("police") ||
    query.includes("kvs") ||
    query.includes("pwd") ||
    query.includes("government") ||
    query.includes("public sector") ||
    query.includes("commission") ||
    query.includes("bank")
  );
}

// Function to choose lucide icon based on job title
const getGovtIconComponent = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes("pilot") || t.includes("loco") || t.includes("railway") || t.includes("train")) {
    return <Train className="w-6 h-6 text-primary" />;
  }
  if (t.includes("officer") || t.includes("po") || t.includes("bank") || t.includes("account")) {
    return <Wallet className="w-6 h-6 text-primary" />;
  }
  if (t.includes("police") || t.includes("inspector") || t.includes("security")) {
    return <Shield className="w-6 h-6 text-primary" />;
  }
  if (t.includes("teacher") || t.includes("school") || t.includes("professor") || t.includes("lecturer")) {
    return <GraduationCap className="w-6 h-6 text-primary" />;
  }
  if (t.includes("engineer") || t.includes("works") || t.includes("engineering")) {
    return <Wrench className="w-6 h-6 text-primary" />;
  }
  return <Building2 className="w-6 h-6 text-primary" />;
}

const renderGovtIcon = (iconName: string, title: string) => {
  switch (iconName) {
    case "train": return <Train className="w-6 h-6 text-primary" />;
    case "wallet": return <Wallet className="w-6 h-6 text-primary" />;
    case "shield": return <Shield className="w-6 h-6 text-primary" />;
    case "school": return <GraduationCap className="w-6 h-6 text-primary" />;
    case "wrench": return <Wrench className="w-6 h-6 text-primary" />;
    default: return getGovtIconComponent(title);
  }
}

export function LandingPage() {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState("")
  const [location, setLocation] = useState("")
  const [jobs, setJobs] = useState<Job[]>([])
  const [recentJobs, setRecentJobs] = useState<Job[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchDone, setSearchDone] = useState(false)

  // Fetch recent jobs on load
  useEffect(() => {
    fetch("/api/jobs.php?action=recent")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.jobs) setRecentJobs(data.jobs)
      })
      .catch((err) => console.error("Error fetching recent jobs:", err))
  }, [])

  // Setup animations using reveal-section
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100", "translate-y-0")
          entry.target.classList.remove("opacity-0", "translate-y-10")
        }
      })
    }, observerOptions)

    const sections = document.querySelectorAll("section.reveal-section")
    sections.forEach((section) => {
      section.classList.add("transition-all", "duration-700", "opacity-0", "translate-y-10")
      observer.observe(section)
    })

    return () => {
      sections.forEach((section) => observer.unobserve(section))
    }
  }, [recentJobs, searchDone, jobs])

  const performSearch = (searchKey: string, searchLoc: string = "") => {
    setIsSearching(true)
    fetch(`/api/jobs.php?action=search&keyword=${encodeURIComponent(searchKey)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.jobs) {
          let results = data.jobs
          if (searchLoc.trim()) {
            results = results.filter((job: Job) =>
              job.location.toLowerCase().includes(searchLoc.toLowerCase())
            )
          }
          setJobs(results)
          setSearchDone(true)
        }
        setIsSearching(false)
      })
      .catch((err) => {
        console.error("Error searching jobs:", err)
        setIsSearching(false)
      })
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(keyword, location)
  }

  // Filter dynamic govt/private jobs
  const dynamicGovtJobs = recentJobs.filter(isGovtJob).slice(0, 6)
  const dynamicPrivateJobs = recentJobs.filter(j => !isGovtJob(j)).slice(0, 3)

  // Merge with static fallbacks to guarantee a rich UI
  const displayGovtJobs = [
    ...dynamicGovtJobs,
    ...STATIC_GOVT_JOBS.slice(dynamicGovtJobs.length)
  ]

  const displayPrivateJobs = [
    ...dynamicPrivateJobs,
    ...STATIC_PRIVATE_JOBS.slice(dynamicPrivateJobs.length)
  ]

  return (
    <div className="flex flex-col w-full min-h-screen bg-surface text-on-surface">
      {/* 1. Sticky Nav */}
      <nav className="sticky top-0 w-full z-50 bg-surface/80 backdrop-blur-md shadow-[0px_4px_20px_rgba(26,115,232,0.08)]">
        <div className="flex justify-between items-center px-gutter py-4 max-w-container-max mx-auto">
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center">
              <img alt="Job Nova Logo" className="h-10" src={logoBase64} />
            </a>
            <div className="hidden md:flex items-center gap-6">
              <a className="font-Inter text-label-md text-primary font-bold border-b-2 border-primary transition-all" href="#">Home</a>
              <button onClick={() => { setKeyword("Government"); performSearch("Government"); }} className="font-Inter text-label-md text-on-surface-variant hover:text-primary transition-all bg-transparent border-none cursor-pointer">Govt Jobs</button>
              <button onClick={() => { setKeyword("Software"); performSearch("Software"); }} className="font-Inter text-label-md text-on-surface-variant hover:text-primary transition-all bg-transparent border-none cursor-pointer">Private Jobs</button>
              <a className="font-Inter text-label-md text-on-surface-variant hover:text-primary transition-all" href="#">Companies</a>
              <a className="font-Inter text-label-md text-on-surface-variant hover:text-primary transition-all" href="#">Resources</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/auth")} className="hidden sm:block font-Inter text-label-md text-on-surface-variant hover:text-primary transition-all bg-transparent border-none cursor-pointer">Login/Register</button>
            <button onClick={() => navigate("/auth")} className="bg-primary-container text-on-primary-container font-Inter text-label-md px-6 py-2.5 rounded-xl font-semibold shadow-sm hover:opacity-90 active:scale-[0.98] transition-all">Post a Job</button>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <header className="relative overflow-hidden pt-xl pb-20 px-gutter">
        <div className="max-w-container-max mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="z-10">
            <h1 className="font-headline text-display-lg text-on-surface mb-md leading-tight">
              Find the Right <span className="text-primary">Job, Faster</span>
            </h1>
            <p className="font-body text-body-lg text-on-surface-variant mb-xl max-w-[512px]">
              Explore thousands of Government and Private sector opportunities across India. Your dream career starts with a single click.
            </p>
            {/* Signature Search Bar */}
            <form onSubmit={handleSearchSubmit} className="bg-surface-container-low p-2 rounded-2xl shadow-[0px_4px_20px_rgba(26,115,232,0.08)] flex flex-col md:flex-row gap-2 mb-lg">
              <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-outline-variant focus-within:border-primary">
                <Search className="w-5 h-5 text-outline shrink-0" />
                <input
                  className="w-full bg-transparent border-none focus:ring-0 font-body text-body-md focus:outline-none"
                  placeholder="Job title, keywords..."
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
              <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-outline-variant focus-within:border-primary">
                <MapPin className="w-5 h-5 text-outline shrink-0" />
                <input
                  className="w-full bg-transparent border-none focus:ring-0 font-body text-body-md focus:outline-none"
                  placeholder="City or state"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <button type="submit" className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-secondary transition-colors cursor-pointer">
                {isSearching ? "Searching..." : "Search"}
              </button>
            </form>
            <div className="flex flex-wrap gap-2">
              {["SSC", "UPSC", "Railway", "Banking", "IT", "Marketing", "Remote"].map((tag) => (
                <span
                  key={tag}
                  onClick={() => { setKeyword(tag); performSearch(tag); }}
                  className="text-label-sm text-on-surface-variant font-semibold px-3 py-1 bg-surface-container-high rounded-full hover:bg-primary-fixed-dim cursor-pointer transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
            <img
              className="rounded-2xl shadow-2xl relative z-10 w-full h-[500px] object-cover border-8 border-white"
              alt="A modern, high-end office environment featuring diverse young professionals collaborating in a workspace"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVhj7Sw2V4VlY073iUnjWxl4ozaNwBzSWKwCTi9uBjqXBknjXcdv6SO4ZTzFJKID9ewIZwIBc6Er0QoI43iVH94ET1OEpdLKP31sKGvwsEdNObmVHqehxB_A5b4yrxi_2ibknA2BtOBBbHk5UJiVWIlj0Cifz9o0c6Z0qJdxt8e7Eez-uP-uOasW0d3c7gZQc9PsLUCw-ZTSxsEDlqWowH4mJ8mBEdWmiw0qUwUKFBeyObsqnM4Of-amtumPU5Egg_adZ4S6Ml-jXo"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg z-20 animate-bounce">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-label-sm font-bold text-on-surface">1.2k+ New Jobs</p>
                  <p className="text-[10px] text-on-surface-variant">Added in last 24 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search Results Section (Conditional) */}
      {searchDone && (
        <section className="reveal-section py-10 px-6 max-w-container-max mx-auto w-full">
          <div className="flex items-center justify-between border-b border-outline-variant pb-4 mb-6">
            <h2 className="text-xl font-bold font-headline">
              Results for "{keyword}" {location && `in "${location}"`} ({jobs.length})
            </h2>
            <button
              onClick={() => { setKeyword(""); setLocation(""); setSearchDone(false); setJobs([]) }}
              className="text-xs text-primary hover:text-secondary font-semibold bg-transparent border-none cursor-pointer"
            >
              Clear Results
            </button>
          </div>
          {jobs.length === 0 ? (
            <div className="bg-error-container text-on-error-container text-sm p-4 rounded-xl text-center border border-outline-variant">
              No jobs found. Try another keyword or location.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-md">
              {jobs.map((job: any) => (
                <div key={job.jobid} className="bg-white p-md rounded-2xl shadow-[0px_4px_20px_rgba(26,115,232,0.08)] border border-transparent hover:border-primary transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-primary/5 p-3 rounded-xl">
                        {isGovtJob(job) ? getGovtIconComponent(job.title) : <Briefcase className="w-6 h-6 text-primary" />}
                      </div>
                      <span className="bg-green-100 text-green-700 text-label-sm px-2 py-1 rounded">Open</span>
                    </div>
                    <h4 className="font-headline font-semibold text-lg mb-1">{job.title}</h4>
                    <p className="text-on-surface-variant text-label-md mb-2">{job.ename}</p>
                    <p className="text-on-surface-variant text-sm mb-4 line-clamp-3">{job.jobdesc}</p>
                  </div>
                  <div>
                    <div className="space-y-2 mb-6 border-t border-outline-variant pt-4">
                      <div className="flex items-center gap-2 text-on-surface-variant text-label-sm">
                        <MapPin className="w-4 h-4 text-on-surface-variant" /> {job.location.split(",").slice(-2).join(", ")}
                      </div>
                      <div className="flex items-center gap-2 text-on-surface-variant text-label-sm">
                        <CreditCard className="w-4 h-4 text-on-surface-variant" /> Basic Pay: {job.basicpay}
                      </div>
                    </div>
                    <button onClick={() => navigate("/auth")} className="w-full py-3 rounded-xl border border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all cursor-pointer">Apply Now</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 3. Split Section: Career Path */}
      <section className="reveal-section py-xl px-gutter bg-surface-container-lowest">
        <div className="max-w-container-max mx-auto">
          <h2 className="font-headline text-headline-lg text-center mb-xl">Choose Your Career Path</h2>
          <div className="grid md:grid-cols-2 gap-lg">
            {/* Govt Jobs Card */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-secondary p-1">
              <div className="bg-white rounded-[14px] p-8 h-full transition-all group-hover:bg-white/95">
                <div className="mb-6 inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-xl text-primary">
                  <Building2 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-headline text-headline-md mb-3 text-on-surface">Government Jobs</h3>
                <p className="font-body text-body-md text-on-surface-variant mb-6">Secure your future with stable and prestigious careers in Public Sector Undertakings and Government departments.</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {["SSC", "UPSC", "Railways", "State PSC"].map((s) => (
                    <span key={s} className="px-3 py-1 bg-surface-container-low border border-outline-variant rounded-lg text-label-md text-on-surface">{s}</span>
                  ))}
                </div>
                <button
                  onClick={() => { setKeyword("Government"); performSearch("Government"); }}
                  className="inline-flex items-center gap-2 font-Inter font-bold text-primary hover:gap-4 transition-all bg-transparent border-none cursor-pointer"
                >
                  Explore Govt Jobs <ArrowRight className="w-4 h-4 text-primary" />
                </button>
              </div>
            </div>
            {/* Private Jobs Card */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-tertiary to-secondary p-1">
              <div className="bg-white rounded-[14px] p-8 h-full transition-all group-hover:bg-white/95">
                <div className="mb-6 inline-flex items-center justify-center w-14 h-14 bg-tertiary/10 rounded-xl text-tertiary">
                  <Briefcase className="w-8 h-8 text-tertiary" />
                </div>
                <h3 className="font-headline text-headline-md mb-3 text-on-surface">Private Jobs</h3>
                <p className="font-body text-body-md text-on-surface-variant mb-6">Accelerate your career in fast-growing industries with top MNCs and innovative Indian startups.</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {["IT & Software", "Marketing", "Fintech", "Sales"].map((s) => (
                    <span key={s} className="px-3 py-1 bg-surface-container-low border border-outline-variant rounded-lg text-label-md text-on-surface">{s}</span>
                  ))}
                </div>
                <button
                  onClick={() => { setKeyword("Software"); performSearch("Software"); }}
                  className="inline-flex items-center gap-2 font-Inter font-bold text-tertiary hover:gap-4 transition-all bg-transparent border-none cursor-pointer"
                >
                  Explore Private Jobs <ArrowRight className="w-4 h-4 text-tertiary" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Govt Jobs */}
      <section className="reveal-section py-xl px-gutter">
        <div className="max-w-container-max mx-auto">
          <div className="flex justify-between items-end mb-lg">
            <div>
              <h2 className="font-headline text-headline-lg mb-2 text-on-surface">Featured Govt Jobs</h2>
              <p className="text-on-surface-variant">Latest openings from top Government departments</p>
            </div>
            <button onClick={() => { setKeyword("Government"); performSearch("Government"); }} className="text-primary font-bold hover:underline bg-transparent border-none cursor-pointer">View All</button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-md">
            {displayGovtJobs.map((job: any) => {
              const isStatic = job.jobid.toString().startsWith("static-");
              const statusText = isStatic ? job.status : "Open";
              return (
                <div key={job.jobid} className="bg-white p-md rounded-2xl shadow-[0px_4px_20px_rgba(26,115,232,0.08)] border border-transparent hover:border-primary transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-primary/5 p-3 rounded-xl">
                        {renderGovtIcon(job.icon, job.title)}
                      </div>
                      <span className={`text-label-sm px-2 py-1 rounded ${statusText === "Expiring Soon" ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}`}>
                        {statusText}
                      </span>
                    </div>
                    <h4 className="font-headline font-semibold text-lg mb-1 text-on-surface">{job.title}</h4>
                    <p className="text-on-surface-variant text-label-md mb-4">{job.ename}</p>
                    {!isStatic && <p className="text-on-surface-variant text-sm mb-4 line-clamp-3">{job.jobdesc}</p>}
                  </div>
                  <div>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-on-surface-variant text-label-sm">
                        <MapPin className="w-4 h-4 text-on-surface-variant" /> {isStatic ? job.location : job.location.split(",").slice(-2).join(", ")}
                      </div>
                      <div className="flex items-center gap-2 text-on-surface-variant text-label-sm">
                        <Calendar className="w-4 h-4 text-on-surface-variant" /> {isStatic ? job.postdate : `Posted: ${job.postdate}`}
                      </div>
                    </div>
                    <button onClick={() => navigate("/auth")} className="w-full py-3 rounded-xl border border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all cursor-pointer">Apply Now</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Featured Private Jobs */}
      <section className="reveal-section py-xl px-gutter bg-surface-container-low">
        <div className="max-w-container-max mx-auto">
          <div className="flex justify-between items-end mb-lg">
            <div>
              <h2 className="font-headline text-headline-lg mb-2 text-on-surface">Featured Private Jobs</h2>
              <p className="text-on-surface-variant">Opportunity knocking from top global and local tech leaders</p>
            </div>
            <button onClick={() => { setKeyword("Software"); performSearch("Software"); }} className="text-primary font-bold hover:underline bg-transparent border-none cursor-pointer">View All</button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-md">
            {displayPrivateJobs.map((job: any) => {
              const isStatic = job.jobid.toString().startsWith("static-");
              let logoUrl = "";
              let firstLetter = "";

              if (isStatic) {
                logoUrl = COMPANY_LOGOS[job.logoKey as keyof typeof COMPANY_LOGOS] || "";
              } else {
                if (job.logo) {
                  logoUrl = job.logo.startsWith("http") ? job.logo : `/uploads/logo/${job.logo}`;
                } else {
                  // Fallback to name search
                  const comName = job.ename.toLowerCase();
                  if (comName.includes("microsoft")) logoUrl = COMPANY_LOGOS.Microsoft;
                  else if (comName.includes("amazon")) logoUrl = COMPANY_LOGOS.Amazon;
                  else if (comName.includes("infosys")) logoUrl = COMPANY_LOGOS.Infosys;
                  else firstLetter = job.ename.charAt(0);
                }
              }

              return (
                <div key={job.jobid} className="bg-white p-md rounded-2xl shadow-[0px_4px_20px_rgba(26,115,232,0.08)] group hover:-translate-y-1 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex gap-4 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center p-2">
                        {logoUrl ? (
                          <img alt={job.ename} className="w-full h-full object-contain" src={logoUrl} />
                        ) : (
                          <span className="font-bold text-primary font-headline text-lg">{firstLetter}</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-headline font-semibold text-on-surface">{job.title}</h4>
                        <p className="text-on-surface-variant text-label-md">{job.ename}</p>
                      </div>
                    </div>
                    {!isStatic && <p className="text-on-surface-variant text-sm mb-4 line-clamp-3">{job.jobdesc}</p>}
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="bg-primary/10 text-primary text-label-sm px-2 py-1 rounded">
                        <MapPin className="w-3 h-3 text-primary inline mr-1" /> {isStatic ? job.location : job.location.split(",").slice(-1)[0]}
                      </span>
                      <span className="bg-surface-container-high text-on-surface-variant text-label-sm px-2 py-1 rounded">
                        <Briefcase className="w-3 h-3 text-on-surface-variant inline mr-1" /> {isStatic ? job.type : `${job.experience} Yrs Exp`}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-t border-outline-variant pt-4">
                    <p className="text-on-surface font-bold">
                      {job.basicpay} <span className="text-on-surface-variant font-normal text-xs">{isStatic ? "/yr" : ""}</span>
                    </p>
                    <button onClick={() => navigate("/auth")} className="bg-primary text-white px-6 py-2 rounded-lg text-label-md font-bold group-hover:bg-secondary transition-all cursor-pointer">Apply</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Trusted Companies Logo Grid */}
      <section className="reveal-section py-xl px-gutter">
        <div className="max-w-container-max mx-auto text-center">
          <p className="text-label-md text-outline font-semibold mb-lg uppercase tracking-widest">Hiring at world class companies</p>
          <div className="flex flex-wrap justify-center items-center gap-xl opacity-60 grayscale hover:grayscale-0 transition-all">
            <img alt="Google" className="h-8" src={COMPANY_LOGOS.Google} />
            <img alt="Microsoft" className="h-8" src={COMPANY_LOGOS.Microsoft} />
            <img alt="Amazon" className="h-8" src={COMPANY_LOGOS.Amazon} />
            <img alt="Infosys" className="h-10" src={COMPANY_LOGOS.Infosys} />
            <img alt="TCS" className="h-10" src={COMPANY_LOGOS.TCS} />
            <img alt="Wipro" className="h-10" src={COMPANY_LOGOS.Wipro} />
            <img alt="Accenture" className="h-8" src={COMPANY_LOGOS.Accenture} />
          </div>
        </div>
      </section>

      {/* 7. Why Choose */}
      <section className="reveal-section py-xl px-gutter bg-white">
        <div className="max-w-container-max mx-auto">
          <h2 className="font-headline text-headline-lg text-center mb-xl text-on-surface">Why Professionals Choose Job Nova</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-lg">
            <div className="p-lg bg-surface-container-low rounded-2xl text-center flex flex-col items-center">
              <Network className="w-12 h-12 text-primary mb-4" />
              <h4 className="font-headline text-lg font-bold mb-2 text-on-surface">One Platform</h4>
              <p className="text-on-surface-variant text-body-md">Both Government & Private sectors in one integrated dashboard.</p>
            </div>
            <div className="p-lg bg-surface-container-low rounded-2xl text-center flex flex-col items-center">
              <Zap className="w-12 h-12 text-primary mb-4" />
              <h4 className="font-headline text-lg font-bold mb-2 text-on-surface">Fast Search</h4>
              <p className="text-on-surface-variant text-body-md">Intelligent matching system that understands your career goals.</p>
            </div>
            <div className="p-lg bg-surface-container-low rounded-2xl text-center flex flex-col items-center">
              <ShieldCheck className="w-12 h-12 text-primary mb-4" />
              <h4 className="font-headline text-lg font-bold mb-2 text-on-surface">Verified Listings</h4>
              <p className="text-on-surface-variant text-body-md">Every job posting is manually reviewed for authenticity and safety.</p>
            </div>
            <div className="p-lg bg-surface-container-low rounded-2xl text-center flex flex-col items-center">
              <TrendingUp className="w-12 h-12 text-primary mb-4" />
              <h4 className="font-headline text-lg font-bold mb-2 text-on-surface">Career Growth</h4>
              <p className="text-on-surface-variant text-body-md">Resources, resume tools, and expert guidance for every stage.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. How It Works */}
      <section className="reveal-section py-xl px-gutter">
        <div className="max-w-container-max mx-auto">
          <h2 className="font-headline text-headline-lg text-center mb-xl text-on-surface">Your Path to Success</h2>
          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-outline-variant -translate-y-1/2 z-0"></div>
            <div className="grid lg:grid-cols-4 gap-xl relative z-10">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-headline-md mb-6 shadow-lg font-headline">1</div>
                <h4 className="font-headline font-bold mb-2 text-on-surface">Create Account</h4>
                <p className="text-on-surface-variant text-label-md">Join thousands of seekers and set up your preferences.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white text-primary border-2 border-primary rounded-full flex items-center justify-center text-headline-md mb-6 shadow-lg font-headline">2</div>
                <h4 className="font-headline font-bold mb-2 text-on-surface">Build Profile</h4>
                <p className="text-on-surface-variant text-label-md">Showcase your skills with our smart resume builder.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white text-primary border-2 border-primary rounded-full flex items-center justify-center text-headline-md mb-6 shadow-lg font-headline">3</div>
                <h4 className="font-headline font-bold mb-2 text-on-surface">Apply Smart</h4>
                <p className="text-on-surface-variant text-label-md">Use one-click apply for thousands of matching roles.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white text-primary border-2 border-primary rounded-full flex items-center justify-center text-headline-md mb-6 shadow-lg font-headline">4</div>
                <h4 className="font-headline font-bold mb-2 text-on-surface">Get Hired</h4>
                <p className="text-on-surface-variant text-label-md">Land your dream job and start your new chapter.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Success Stories */}
      <section className="reveal-section py-xl px-gutter bg-surface-container-low">
        <div className="max-w-container-max mx-auto">
          <h2 className="font-headline text-headline-lg text-center mb-xl text-on-surface">Success Stories</h2>
          <div className="grid md:grid-cols-3 gap-lg">
            <div className="bg-white p-lg rounded-2xl shadow-sm border border-outline-variant">
              <div className="flex items-center gap-4 mb-6">
                <img className="w-14 h-14 rounded-full object-cover" alt="Rahul Sharma placed at TCS" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBeuhfLqEbZ9z07ss-89JkapAhbtPrZzhwZqJTo4BOJeAL7V6J3ZV-qETLh-7LQQ2vXWWA2bUeiZpyNRh1U7x4YNsZP0F9hzlLu0-j9qDfLWw0VHVXQZFpMJjJGmaIC8EADoZot5KogIL1HJfH0DTcEHBwUiVCypNChahw4sthxJjzpyjCyX0nirL1WB8LSr_6q-W0t6hn4suNJ-jiFvNXIDLb3UQXQqR9MvQaYzRrkWiQvHj6pTClddynZmr1m2P36oTLQdtWF5VI" />
                <div>
                  <h5 className="font-headline font-bold text-on-surface">Rahul Sharma</h5>
                  <p className="text-xs text-on-surface-variant font-Inter">Placed at TCS</p>
                </div>
              </div>
              <p className="text-body-md text-on-surface italic leading-relaxed">"Job Nova helped me find the perfect balance. I was looking for IT roles but also considering PSU exams. The platform gave me clarity and the resources to land my current role at TCS."</p>
            </div>
            <div className="bg-white p-lg rounded-2xl shadow-sm border border-outline-variant">
              <div className="flex items-center gap-4 mb-6">
                <img className="w-14 h-14 rounded-full object-cover" alt="Priya Verma SBI PO candidate" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQ8A21welXVcCGomKrIFMkq8Xo2liN1Yp5aV8rJpgrBhV30IGtn0Vi5LDhL6QO7P7RME9zw7eRqyYGEbuDqxL_4jDCpRpQiGvvMzP2-u08bG_DbquJKFeP6QTmUty4eHe5whY5ALIXCwrZHy9pIrHcLgUSck6v-_ehn4EMnZTnlnJj1Q1PBzrLwYxio_IsvR0cCmRMS-KSPVEjo7FFs_l05_80C6s7W4e-7CYi3mWdD3BviGBPFDz7a52_95-xMKkFuJzlfuRmk8oG" />
                <div>
                  <h5 className="font-headline font-bold text-on-surface">Priya Verma</h5>
                  <p className="text-xs text-on-surface-variant font-Inter">SBI PO Candidate</p>
                </div>
              </div>
              <p className="text-body-md text-on-surface italic leading-relaxed">"The Govt Job alerts on this platform are second to none. I never missed a deadline, and the previous year papers provided in the resources section were a game changer."</p>
            </div>
            <div className="bg-white p-lg rounded-2xl shadow-sm border border-outline-variant">
              <div className="flex items-center gap-4 mb-6">
                <img className="w-14 h-14 rounded-full object-cover" alt="Arjun Iyer marketing lead at Zomato" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfVEymvLz3mnuaDMxFKH_t-RwOyxQQMMsmEHv-MZ761-hfxKqZlOxzceJZJYfu_afY_MaXj05XH_djqOGZrtChW-ljcfrK37FjujJx4nUDIxAjt4i--52nsn2Sw3hE6HtsC84mF5ksuHwsOHrVRa8ezBY0ObiH1-7P5-dHtPQwhx4MhPx7kqxmjC2DD8MwH7zk7ViUtzID64n9dIiBrvHLCDX9ikJ5ameRXuc5GsSnZHg-JoMpKjcfIOYLnw0TQ9vCm-jzYgojr24s" />
                <div>
                  <h5 className="font-headline font-bold text-on-surface">Arjun Iyer</h5>
                  <p className="text-xs text-on-surface-variant font-Inter">Marketing Lead, Zomato</p>
                </div>
              </div>
              <p className="text-body-md text-on-surface italic leading-relaxed">"Found my latest role through Job Nova's personalized recommendations. It's refreshing to see a platform that actually understands the Indian private sector landscape so well."</p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. CTA Banner */}
      <section className="reveal-section py-xl px-gutter">
        <div className="max-w-container-max mx-auto bg-primary rounded-[32px] p-xl text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          <div className="relative z-10">
            <h2 className="font-headline text-display-lg text-white mb-md">Ready to Start Your Career Journey?</h2>
            <p className="text-primary-fixed-dim text-body-lg mb-xl max-w-[672px] mx-auto">Join over 1 million job seekers who have found their dream careers with Job Nova.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={() => { setKeyword("Government"); performSearch("Government"); }} className="bg-white text-primary px-8 py-4 rounded-xl font-bold hover:bg-primary-fixed-dim transition-colors border-none cursor-pointer">Browse Govt Jobs</button>
              <button onClick={() => { setKeyword("Software"); performSearch("Software"); }} className="bg-primary-container text-white border border-white/30 px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-colors cursor-pointer">Browse Private Jobs</button>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Footer */}
      <footer className="bg-surface-container-low w-full pt-xl pb-md">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-lg px-gutter max-w-container-max mx-auto mb-xl">
          <div className="col-span-2 md:col-span-1">
            <img alt="Job Nova Logo" className="h-8 mb-6" src={logoBase64} />
            <p className="text-on-surface-variant text-label-md leading-relaxed">India's leading job platform for both Government and Private sector opportunities.</p>
          </div>
          <div>
            <h6 className="font-headline font-bold text-primary mb-6">Company</h6>
            <ul className="space-y-4 list-none p-0 m-0">
              <li><a className="text-on-surface-variant hover:text-primary transition-colors text-label-md decoration-none" href="#">About Us</a></li>
              <li><a className="text-on-surface-variant hover:text-primary transition-colors text-label-md decoration-none" href="#">Careers</a></li>
              <li><a className="text-on-surface-variant hover:text-primary transition-colors text-label-md decoration-none" href="#">Press</a></li>
            </ul>
          </div>
          <div>
            <h6 className="font-headline font-bold text-primary mb-6">Resources</h6>
            <ul className="space-y-4 list-none p-0 m-0">
              <li><a className="text-on-surface-variant hover:text-primary transition-colors text-label-md decoration-none" href="#">Blog</a></li>
              <li><a className="text-on-surface-variant hover:text-primary transition-colors text-label-md decoration-none" href="#">Guides</a></li>
              <li><a className="text-on-surface-variant hover:text-primary transition-colors text-label-md decoration-none" href="#">Help Center</a></li>
            </ul>
          </div>
          <div>
            <h6 className="font-headline font-bold text-primary mb-6">Jobs</h6>
            <ul className="space-y-4 list-none p-0 m-0">
              <li><button onClick={() => { setKeyword("Government"); performSearch("Government"); }} className="text-on-surface-variant hover:text-primary transition-colors text-label-md bg-transparent border-none cursor-pointer p-0 font-Inter">Govt Jobs</button></li>
              <li><button onClick={() => { setKeyword("Software"); performSearch("Software"); }} className="text-on-surface-variant hover:text-primary transition-colors text-label-md bg-transparent border-none cursor-pointer p-0 font-Inter">IT Jobs</button></li>
              <li><button onClick={() => { setKeyword("Sales"); performSearch("Sales"); }} className="text-on-surface-variant hover:text-primary transition-colors text-label-md bg-transparent border-none cursor-pointer p-0 font-Inter">Sales</button></li>
            </ul>
          </div>
          <div>
            <h6 className="font-headline font-bold text-primary mb-6">Support</h6>
            <ul className="space-y-4 list-none p-0 m-0">
              <li><a className="text-on-surface-variant hover:text-primary transition-colors text-label-md decoration-none" href="#">Contact Us</a></li>
              <li><a className="text-on-surface-variant hover:text-primary transition-colors text-label-md decoration-none" href="#">Privacy Policy</a></li>
              <li><a className="text-on-surface-variant hover:text-primary transition-colors text-label-md decoration-none" href="#">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-outline-variant px-gutter max-w-container-max mx-auto pt-md flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-on-surface-variant text-label-sm">© {new Date().getFullYear()} Job Nova. All rights reserved.</p>
          <div className="flex gap-6">
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#"><Smile className="w-5 h-5" /></a>
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#"><Share2 className="w-5 h-5" /></a>
            <a className="text-on-surface-variant hover:text-primary transition-colors" href="#"><Mail className="w-5 h-5" /></a>
          </div>
        </div>
      </footer>
    </div>
  )
}
