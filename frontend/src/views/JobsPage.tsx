import { useState, useEffect } from "react"
import { Search, MapPin, Briefcase, Clock, ArrowRight, Filter, ChevronLeft, ChevronRight } from "lucide-react"

// Ensure matching structure with LandingPage
interface Job {
  jobid: string
  title: string
  ename: string
  location: string
  experience: string
  basicpay: string
  jobdesc: string
  postdate: string
}

export function JobsPage({ onNavigate }: { onNavigate: (view: string) => void }) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Pagination state
  const [page, setPage] = useState<number>(1)
  const limit = 10

  // Filter state
  const [filters, setFilters] = useState({
    keyword: "",
    com: "",
    loc: "",
    desig: "",
    skills: "",
    industry: ""
  })

  useEffect(() => {
    fetchJobs()
  }, [page, filters])

  const fetchJobs = async () => {
    setIsLoading(true)
    setError(null)

    const offset = (page - 1) * limit
    const queryParams = new URLSearchParams()

    queryParams.append("action", "list")
    queryParams.append("limit", limit.toString())
    queryParams.append("offset", offset.toString())

    if (filters.keyword) queryParams.append("keyword", filters.keyword)
    if (filters.com) queryParams.append("com", filters.com)
    if (filters.loc) queryParams.append("loc", filters.loc)
    if (filters.desig) queryParams.append("desig", filters.desig)
    if (filters.skills) queryParams.append("skills", filters.skills)
    if (filters.industry) queryParams.append("industry", filters.industry)

    try {
      const response = await fetch(`/api/jobs.php?${queryParams.toString()}`)
      const data = await response.json()

      if (data.success) {
        setJobs(data.jobs || [])
        setTotalCount(data.total_count || 0)
      } else {
        setError(data.message || "Failed to fetch jobs")
      }
    } catch (err) {
      console.error("Error fetching jobs:", err)
      setError("An error occurred while fetching jobs.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
    setPage(1) // Reset page when filters change
  }

  const totalPages = Math.ceil(totalCount / limit)

  return (
    <div className="w-full flex flex-col py-8 px-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar for Filters */}
        <div className="w-full md:w-1/4 flex flex-col gap-4 md:sticky md:top-24 bg-background border border-border rounded-2xl p-5 shadow-sm">
          <h2 className="text-xl font-bold font-heading mb-4 flex items-center gap-2">
            <Filter className="h-5 w-5 text-indigo-500" />
            Filters
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Keyword</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  name="keyword"
                  placeholder="Job title, skills..."
                  value={filters.keyword}
                  onChange={handleFilterChange}
                  className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Company</label>
              <input
                type="text"
                name="com"
                placeholder="Company name"
                value={filters.com}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Location</label>
              <input
                type="text"
                name="loc"
                placeholder="City, State"
                value={filters.loc}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Industry</label>
              <input
                type="text"
                name="industry"
                placeholder="e.g. IT, Healthcare"
                value={filters.industry}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition"
              />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-full md:w-3/4 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background border border-border rounded-2xl p-5 shadow-sm">
            <h1 className="text-2xl font-extrabold font-heading tracking-tight">Explore Jobs</h1>
            <p className="text-sm text-muted-foreground font-medium">
              Showing <span className="text-foreground font-bold">{jobs.length > 0 ? (page - 1) * limit + 1 : 0}</span> to <span className="text-foreground font-bold">{Math.min(page * limit, totalCount)}</span> of <span className="text-indigo-600 dark:text-indigo-400 font-bold">{totalCount}</span> jobs
            </p>
          </div>

          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
              <p className="text-sm text-muted-foreground">Loading jobs...</p>
            </div>
          ) : jobs.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {jobs.map(job => (
                <JobCard key={job.jobid} job={job} onNavigate={onNavigate} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-accent/20">
              <p className="text-muted-foreground text-sm font-medium">No jobs found matching your filters.</p>
              <button
                onClick={() => { setFilters({ keyword: "", com: "", loc: "", desig: "", skills: "", industry: "" }); setPage(1); }}
                className="mt-4 text-indigo-500 hover:text-indigo-600 font-semibold text-sm underline"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 bg-background border border-border rounded-lg text-foreground hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let startPage = Math.max(1, Math.min(page - 2, totalPages - 4))
                  let pageNum = startPage + i

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-semibold transition ${
                        page === pageNum
                          ? "bg-indigo-600 text-white shadow-md border-transparent"
                          : "bg-background border border-border text-foreground hover:bg-accent"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 bg-background border border-border rounded-lg text-foreground hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Reusable Job Card ─────────────────── */
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
          <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-indigo-500" />{job.location.split(",").slice(-1)[0] || job.location}</span>
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
