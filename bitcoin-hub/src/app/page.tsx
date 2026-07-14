'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import type { Series, CuratedMeta } from './data'
import { SERIES, CURATED, DIFFICULTY_COLORS, getFallbackMeta } from './data'

/* ── Types ───────────────────────────────────────────── */

interface Repo {
  id: number
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  topics: string[]
  updated_at: string
}

type Enriched = Repo & CuratedMeta

/* ── Helpers ─────────────────────────────────────────── */

function classifyRepo(name: string): Series | null {
  const lower = name.toLowerCase()
  if (lower.includes('newbie')) return 'Newbies'
  if (lower.includes('intermediate')) return 'Intermediate'
  if (lower.includes('advanced')) return 'Advanced'
  return null
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

function enrichRepo(repo: Repo): Enriched {
  const curated = CURATED[repo.name]
  return { ...repo, ...(curated ?? getFallbackMeta()) }
}

/* ── Accordion Item ──────────────────────────────────── */

function QaBlock({
  question,
  answer,
  index,
  cardId,
  open,
  onToggle,
}: {
  question: string
  answer: string
  index: number
  cardId: number
  open: boolean
  onToggle: () => void
}) {
  const panelId = `qa-panel-${cardId}-${index}`
  const btnId = `qa-btn-${cardId}-${index}`

  return (
    <div className="border border-border-subtle rounded-lg overflow-hidden">
      <button
        id={btnId}
        onClick={onToggle}
        className="qa-toggle"
        aria-expanded={open}
        aria-controls={panelId}
      >
        <span
          className={`qa-icon ${open ? 'bg-bitcoin text-charcoal' : 'bg-bitcoin/15 text-bitcoin'}`}
          aria-hidden="true"
        >
          {index + 1}
        </span>
        <span className="flex-1 text-foreground">{question}</span>
        <svg
          className={`w-4 h-4 shrink-0 text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={btnId}
        className={`qa-accordion ${open ? 'open' : ''}`}
        style={{ maxHeight: open ? '600px' : '0' }}
      >
        <div className="px-4 pb-4 pt-1 text-sm leading-relaxed border-t border-border-subtle/60"
             style={{ color: 'var(--text-muted)' }}>
          {answer}
        </div>
      </div>
    </div>
  )
}

/* ── Repo Card ───────────────────────────────────────── */

function RepoCard({ repo }: { repo: Enriched }) {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null)

  const handleToggle = useCallback((i: number) => {
    setOpenAccordion((prev) => (prev === i ? null : i))
  }, [])

  return (
    <article className="repo-card flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold leading-tight" style={{ color: 'var(--text-foreground)' }}>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-bitcoin transition-colors focus-visible:outline-none focus-visible:underline focus-visible:text-bitcoin"
            >
              {repo.name}
            </a>
          </h3>
          {repo.description && (
            <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--text-muted)' }}>
              {repo.description}
            </p>
          )}
        </div>
        <span className={`diff-badge shrink-0 ${DIFFICULTY_COLORS[repo.difficulty]}`}>
          {repo.difficulty}
        </span>
      </div>

      {/* Display title */}
      <p className="text-sm font-medium text-bitcoin/90">
        {repo.displayTitle}
      </p>

      {/* Q&A Accordion */}
      <div className="space-y-2.5" role="list" aria-label="Lesson questions and answers">
        {repo.qa.map((item, i) => (
          <div key={i} role="listitem">
            <QaBlock
              question={item.q}
              answer={item.a}
              index={i}
              cardId={repo.id}
              open={openAccordion === i}
              onToggle={() => handleToggle(i)}
            />
          </div>
        ))}
      </div>

      {/* Fun fact */}
      {repo.funFact && (
        <div className="fun-fact-box flex items-start gap-2 text-xs rounded-lg p-3 mt-1 border"
             style={{ color: 'rgba(180, 130, 20, 0.9)' }}>
          <span className="shrink-0 text-base leading-none" aria-hidden="true">⚡</span>
          <span><strong>Did you know?</strong> {repo.funFact}</span>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-3 text-xs pt-3 border-t mt-auto"
           style={{ color: 'var(--text-muted)', borderColor: 'var(--border-light)' }}>
        <span className="flex items-center gap-1" title="Stars">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span>{repo.stargazers_count}</span>
        </span>
        <span className="flex items-center gap-1" title="Forks">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 1a3 3 0 0 0-3 3c0 .62.19 1.19.5 1.67L6.67 8.5A3 3 0 0 0 5 8a3 3 0 0 0-3 3 3 3 0 0 0 3 3c.79 0 1.5-.3 2.04-.8l2.29 2.28A2.99 2.99 0 0 0 9 17a3 3 0 0 0 3 3 3 3 0 0 0 3-3c0-.62-.19-1.19-.5-1.67l2.83-2.83c.48.31 1.05.5 1.67.5a3 3 0 0 0 3-3 3 3 0 0 0-3-3c-.79 0-1.5.3-2.04.8l-2.29-2.28A2.99 2.99 0 0 0 15 4a3 3 0 0 0-3-3z"/>
          </svg>
          <span>{repo.forks_count}</span>
        </span>
        <span className="flex items-center gap-1 ml-auto" title="Language">
          <span className="w-2 h-2 rounded-full bg-bitcoin/60" aria-hidden="true" />
          <span>{repo.language || '—'}</span>
        </span>
        <span>{timeAgo(repo.updated_at)}</span>
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
          style={{ background: 'var(--bg-crisp)', color: 'var(--text-foreground)' }}
          aria-label={`View ${repo.name} on GitHub (opens in new tab)`}
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          GitHub
        </a>
      </div>
    </article>
  )
}

/* ── Page ────────────────────────────────────────────── */

export default function Home() {
  const [repos, setRepos] = useState<Repo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeSeries, setActiveSeries] = useState<Series>('Newbies')
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    async function fetchRepos() {
      try {
        const res = await fetch('https://api.github.com/users/heat-a11y/repos?per_page=100&sort=updated')
        if (!res.ok) throw new Error(`GitHub API: ${res.status}`)
        const data: Repo[] = await res.json()
        if (!cancelled) setRepos(data)
      } catch (e: unknown) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchRepos()
    return () => { cancelled = true }
  }, [])

  const enriched = repos.map(enrichRepo)

  const grouped = enriched.reduce<Record<string, Enriched[]>>((acc, repo) => {
    const series = classifyRepo(repo.name)
    const key = series ?? 'Other'
    if (!acc[key]) acc[key] = []
    acc[key].push(repo)
    return acc
  }, {})

  const newbies = grouped.Newbies ?? []
  const intermediate = grouped.Intermediate ?? []
  const advanced = grouped.Advanced ?? []
  const other = grouped.Other ?? []
  const filteredRepos = grouped[activeSeries] ?? []

  const handleSeriesChange = useCallback((s: Series) => {
    setActiveSeries(s)
    /* Move keyboard focus to the content region so screen-readers
       announce the new repo list without forcing the user to tab back down. */
    contentRef.current?.focus()
  }, [])

  return (
    <div className="flex flex-col flex-1">
      {/* Skip-link for keyboard users */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Header */}
      <header className="border-b" style={{ borderColor: 'var(--border-light)' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-6 sm:py-8 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="text-2xl sm:text-3xl" aria-hidden="true">₿</span>
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight" style={{ color: 'var(--text-foreground)' }}>
              Bitcoin Knowledge Hub
            </h1>
          </div>
          <p className="text-sm sm:text-base max-w-2xl" style={{ color: 'var(--text-muted)' }}>
            A curated collection of Bitcoin repositories from{' '}
            <a href="https://github.com/heat-a11y" target="_blank" rel="noopener noreferrer"
               className="text-bitcoin hover:underline focus-visible:underline">
              @heat-a11y
            </a>{' '}
            — organized by skill level with interactive Q&A accordions for self-guided learning.
          </p>
        </div>
      </header>

      {/* Main */}
      <main id="main-content" className="flex-1 max-w-6xl mx-auto w-full px-5 sm:px-6 py-6 sm:py-8">
        {/* Series filters */}
        <section aria-label="Filter by skill level">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3" role="tablist" aria-label="Bitcoin series">
            {SERIES.map((s) => (
              <button
                key={s.key}
                onClick={() => handleSeriesChange(s.key)}
                className={`btn-filter w-full sm:w-auto ${activeSeries === s.key ? 'active' : 'inactive'}`}
                role="tab"
                aria-selected={activeSeries === s.key}
                aria-controls="series-panel"
              >
                <span className="block leading-tight">{s.label}</span>
                <span className="block text-xs font-normal mt-0.5 opacity-80">{s.desc}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Content panel */}
        <section
          id="series-panel"
          ref={contentRef}
          role="tabpanel"
          aria-label={`${activeSeries} series repositories`}
          tabIndex={-1}
          className="mt-8 sm:mt-10 outline-none"
        >
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-bitcoin/30 border-t-bitcoin rounded-full animate-spin" role="status">
                <span className="sr-only">Loading repositories...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-900/20 border border-red-800/40 rounded-xl p-6 text-center" role="alert">
              <p className="text-red-400 font-medium">Failed to load repositories</p>
              <p className="text-red-300/70 text-sm mt-1">{error}</p>
              <button onClick={() => window.location.reload()}
                className="mt-4 px-5 py-2 bg-red-800/40 hover:bg-red-800/60 text-red-300 rounded-lg text-sm transition-colors">
                Retry
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Stats bar */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs mb-6 pb-4 border-b"
                   style={{ color: 'var(--text-muted)', borderColor: 'var(--border-light)' }}>
                <span>Newbies: <strong style={{ color: 'var(--text-foreground)' }}>{newbies.length}</strong></span>
                <span>Intermediate: <strong style={{ color: 'var(--text-foreground)' }}>{intermediate.length}</strong></span>
                <span>Advanced: <strong style={{ color: 'var(--text-foreground)' }}>{advanced.length}</strong></span>
                {other.length > 0 && <span>Other: <strong style={{ color: 'var(--text-foreground)' }}>{other.length}</strong></span>}
                {newbies.length + intermediate.length + advanced.length > 0 && (
                  <span className="sm:ml-auto">
                    Showing <strong style={{ color: 'var(--text-foreground)' }}>{filteredRepos.length}</strong> repo{filteredRepos.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Series heading */}
              <h2 className="text-lg sm:text-xl font-semibold mb-5 sm:mb-6 flex items-center gap-2"
                  style={{ color: 'var(--text-foreground)' }}>
                <span className="w-2 h-2 rounded-full bg-bitcoin" aria-hidden="true" />
                {activeSeries} Series
              </h2>

              {/* Cards */}
              {filteredRepos.length === 0 ? (
                <p className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
                  No repositories in this category.
                </p>
              ) : (
                <div className="grid gap-5 sm:gap-6 sm:grid-cols-2">
                  {filteredRepos.map((repo) => (
                    <RepoCard key={repo.id} repo={repo} />
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto" style={{ borderColor: 'var(--border-light)' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-5 sm:py-6 flex items-center justify-between text-xs"
             style={{ color: 'var(--text-muted)' }}>
          <span>Data sourced from GitHub API — educational content curated for self-paced learning</span>
          <a href="https://github.com/heat-a11y" target="_blank" rel="noopener noreferrer"
             className="hover:text-bitcoin transition-colors">@heat-a11y</a>
        </div>
      </footer>
    </div>
  )
}
