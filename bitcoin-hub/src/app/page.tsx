'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import type { Series, CuratedMeta, GlossaryEntry } from './data'
import { SERIES, CURATED, DIFFICULTY_COLORS, QUEST_LEVELS, getFallbackMeta } from './data'

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

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('visible')
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

function BitcoinSvg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 7v10M9 10h6M9 14h6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function QaBlock({
  question, answer, index, cardId, open, onToggle,
}: {
  question: string; answer: string; index: number; cardId: number
  open: boolean; onToggle: () => void
}) {
  const panelId = `qa-panel-${cardId}-${index}`
  const btnId = `qa-btn-${cardId}-${index}`
  return (
    <div className="border border-border-subtle rounded-lg overflow-hidden">
      <button id={btnId} onClick={onToggle} className="qa-toggle" aria-expanded={open} aria-controls={panelId}>
        <span className={`qa-icon ${open ? 'bg-bitcoin text-charcoal' : 'bg-bitcoin/15 text-bitcoin'}`} aria-hidden="true">{index + 1}</span>
        <span className="flex-1 text-foreground">{question}</span>
        <svg className={`w-4 h-4 shrink-0 text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      <div id={panelId} role="region" aria-labelledby={btnId} className={`qa-accordion ${open ? 'open' : ''}`}>
        <div><div className="px-4 pb-4 pt-1 text-sm leading-relaxed border-t border-border-subtle/60" style={{ color: 'var(--text-muted)' }}>{answer}</div></div>
      </div>
    </div>
  )
}

function GlossaryModal({ entries, onClose }: { entries: GlossaryEntry[]; onClose: () => void }) {
  return (
    <div className="glossary-overlay" onClick={onClose}>
      <div className="glossary-card p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Glossary
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-muted">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" /></svg>
          </button>
        </div>
        <div className="space-y-3">
          {entries.map((g, i) => (
            <div key={i} className="p-3 rounded-xl" style={{ background: 'rgba(147,51,234,0.04)', border: '1px solid rgba(147,51,234,0.1)' }}>
              <p className="text-sm font-semibold text-purple-300">{g.term}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{g.definition}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function RepoCard({ repo }: { repo: Enriched }) {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null)
  const [showGlossary, setShowGlossary] = useState(false)
  const handleToggle = useCallback((i: number) => setOpenAccordion((p) => (p === i ? null : i)), [])

  return (
    <>
      <article className="repo-card flex flex-col gap-3 reveal reveal-delay-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold leading-tight" style={{ color: 'var(--text-foreground)' }}>
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="hover:text-bitcoin transition-colors focus-visible:underline">{repo.name}</a>
            </h3>
            {repo.description && <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{repo.description}</p>}
          </div>
          <span className={`diff-badge shrink-0 ${DIFFICULTY_COLORS[repo.difficulty]}`}>{repo.difficulty}</span>
        </div>

        <p className="text-sm font-medium text-bitcoin/90">{repo.displayTitle}</p>

        <div className="space-y-2.5" role="list" aria-label="Lesson questions and answers">
          {repo.qa.map((item, i) => (
            <div key={i} role="listitem">
              <QaBlock question={item.q} answer={item.a} index={i} cardId={repo.id} open={openAccordion === i} onToggle={() => handleToggle(i)} />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setShowGlossary(true)} className="glossary-chip inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all hover:bg-purple-500/15">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
            Glossary ({repo.glossary.length})
          </button>
        </div>

        {repo.funFact && (
          <div className="fun-fact-box flex items-start gap-2 text-xs rounded-lg p-3 mt-1 border" style={{ color: 'rgba(180, 130, 20, 0.9)' }}>
            <span className="shrink-0 text-base leading-none" aria-hidden="true">⚡</span>
            <span><strong>Did you know?</strong> {repo.funFact}</span>
          </div>
        )}

        <div className="flex items-center gap-3 text-xs pt-3 border-t mt-auto" style={{ color: 'var(--text-muted)', borderColor: 'var(--border-light)' }}>
          <span className="flex items-center gap-1" title="Stars">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
            <span>{repo.stargazers_count}</span>
          </span>
          <span className="flex items-center gap-1" title="Forks">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1a3 3 0 0 0-3 3c0 .62.19 1.19.5 1.67L6.67 8.5A3 3 0 0 0 5 8a3 3 0 0 0-3 3 3 3 0 0 0 3 3c.79 0 1.5-.3 2.04-.8l2.29 2.28A2.99 2.99 0 0 0 9 17a3 3 0 0 0 3 3 3 3 0 0 0 3-3c0-.62-.19-1.19-.5-1.67l2.83-2.83c.48.31 1.05.5 1.67.5a3 3 0 0 0 3-3 3 3 0 0 0-3-3c-.79 0-1.5.3-2.04.8l-2.29-2.28A2.99 2.99 0 0 0 15 4a3 3 0 0 0-3-3z" /></svg>
            <span>{repo.forks_count}</span>
          </span>
          <span className="flex items-center gap-1 ml-auto" title="Language">
            <span className="w-2 h-2 rounded-full bg-bitcoin/60" aria-hidden="true" />
            <span>{repo.language || '—'}</span>
          </span>
          <span>{timeAgo(repo.updated_at)}</span>
          <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors" style={{ background: 'var(--bg-crisp)', color: 'var(--text-foreground)' }}>
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>
            GitHub
          </a>
        </div>
      </article>
      {showGlossary && <GlossaryModal entries={repo.glossary} onClose={() => setShowGlossary(false)} />}
    </>
  )
}

const PARTICLE_CONFIGS = [
  { left: '12%', dur: '18s', delay: '0s', size: '4px' },
  { left: '33%', dur: '24s', delay: '2s', size: '3px' },
  { left: '55%', dur: '16s', delay: '4s', size: '5px' },
  { left: '78%', dur: '22s', delay: '1s', size: '2px' },
  { left: '92%', dur: '20s', delay: '3s', size: '3px' },
  { left: '8%', dur: '26s', delay: '5s', size: '4px' },
  { left: '45%', dur: '14s', delay: '0s', size: '2px' },
  { left: '67%', dur: '28s', delay: '6s', size: '5px' },
  { left: '20%', dur: '19s', delay: '1s', size: '3px' },
  { left: '88%', dur: '21s', delay: '7s', size: '4px' },
  { left: '5%', dur: '25s', delay: '2s', size: '2px' },
  { left: '40%', dur: '17s', delay: '4s', size: '3px' },
  { left: '60%', dur: '23s', delay: '3s', size: '5px' },
  { left: '15%', dur: '15s', delay: '6s', size: '2px' },
  { left: '72%', dur: '27s', delay: '0s', size: '4px' },
  { left: '50%', dur: '20s', delay: '5s', size: '3px' },
  { left: '28%', dur: '18s', delay: '3s', size: '5px' },
  { left: '83%', dur: '22s', delay: '1s', size: '2px' },
  { left: '95%', dur: '16s', delay: '7s', size: '4px' },
  { left: '10%', dur: '24s', delay: '2s', size: '3px' },
]

function ParticlesBg() {
  return (
    <div className="particles-bg" aria-hidden="true">
      {PARTICLE_CONFIGS.map((p, i) => (
        <div key={i} className="particle" style={{
          left: p.left,
          animationDuration: p.dur,
          animationDelay: p.delay,
          width: p.size,
          height: p.size,
        }} />
      ))}
    </div>
  )
}

function QuestGame() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'victory' | 'defeat'>('menu')
  const [levelIdx, setLevelIdx] = useState(0)
  const [qIdx, setQIdx] = useState(0)
  const [hp, setHp] = useState(40)
  const [xp, setXp] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)

  const level = QUEST_LEVELS[levelIdx]
  const question = level?.questions[qIdx]
  const maxHp = 40
  const xpPerLevel = 20
  const xpPerCorrect = 4

  const startGame = useCallback(() => {
    setLevelIdx(0)
    setQIdx(0)
    setHp(40)
    setXp(0)
    setSelected(null)
    setAnswered(false)
    setGameState('playing')
  }, [])

  const handleAnswer = useCallback((optIdx: number) => {
    if (answered) return
    setSelected(optIdx)
    setAnswered(true)
    if (optIdx === question.correct) {
      const newXp = xp + xpPerCorrect
      setXp(newXp)
      if (newXp >= xpPerLevel) {
        if (levelIdx >= QUEST_LEVELS.length - 1) {
          setTimeout(() => { setGameState('victory') }, 800)
          return
        }
        setTimeout(() => {
          setLevelIdx((p) => p + 1)
          setQIdx(0)
          setXp(0)
          setSelected(null)
          setAnswered(false)
        }, 800)
      } else {
        setTimeout(() => {
          if (qIdx < level.questions.length - 1) {
            setQIdx((p) => p + 1)
          }
          setSelected(null)
          setAnswered(false)
        }, 800)
      }
    } else {
      const newHp = hp - 10
      setHp(newHp)
      if (newHp <= 0) {
        setTimeout(() => { setGameState('defeat') }, 600)
      } else {
        setTimeout(() => {
          if (qIdx < level.questions.length - 1) {
            setQIdx((p) => p + 1)
          }
          setSelected(null)
          setAnswered(false)
        }, 600)
      }
    }
  }, [answered, question, xp, levelIdx, qIdx, hp, level])

  if (gameState === 'menu') {
    return (
      <div className="quest-container rounded-2xl p-8 sm:p-12 text-center reveal">
        <div className="flex flex-col items-center gap-5 max-w-lg mx-auto">
          <div className="w-20 h-20 rounded-2xl bg-bitcoin/10 flex items-center justify-center bitcoin-pulse">
            <span className="text-4xl">⚔️</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold">Bitcoin Quest</h2>
          <p className="text-sm text-muted max-w-sm">
            Defeat the fiat overlords with Bitcoin knowledge. Answer questions to attack — wrong answers cost HP, right answers earn XP.
          </p>
          <div className="flex gap-4 text-xs text-muted">
            <span>🎯 10 Levels</span>
            <span>❓ 50 Questions</span>
            <span>🗺️ 10 Zones</span>
          </div>
          <button onClick={startGame} className="px-8 py-3 bg-bitcoin text-charcoal font-bold rounded-xl text-sm hover:brightness-110 transition-all shadow-lg shadow-bitcoin/20">
            🎮 Launch Quest
          </button>
        </div>
      </div>
    )
  }

  if (gameState === 'victory') {
    return (
      <div className="quest-container rounded-2xl p-8 sm:p-12 text-center reveal">
        <div className="flex flex-col items-center gap-4 max-w-lg mx-auto">
          <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
            <span className="text-4xl">🏆</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold victory-text">Victory!</h2>
          <p className="text-sm text-muted">You defeated the fiat overlords! Bitcoin knowledge is power.</p>
          <button onClick={startGame} className="px-8 py-3 bg-bitcoin text-charcoal font-bold rounded-xl text-sm hover:brightness-110 transition-all shadow-lg shadow-bitcoin/20">
            🔄 Play Again
          </button>
        </div>
      </div>
    )
  }

  if (gameState === 'defeat') {
    return (
      <div className={`quest-container rounded-2xl p-8 sm:p-12 text-center ${hp <= 0 ? 'game-over' : ''}`}>
        <div className="flex flex-col items-center gap-4 max-w-lg mx-auto">
          <div className="w-20 h-20 rounded-2xl bg-red-500/10 flex items-center justify-center">
            <span className="text-4xl">💀</span>
          </div>
          <h2 className="text-2xl font-bold text-red-400">Game Over</h2>
          <p className="text-sm text-muted">You were defeated! Study the cards below and try again.</p>
          <button onClick={startGame} className="px-8 py-3 bg-bitcoin text-charcoal font-bold rounded-xl text-sm hover:brightness-110 transition-all shadow-lg shadow-bitcoin/20">
            🔄 Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="quest-container rounded-2xl p-5 sm:p-7 reveal">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between text-xs text-muted">
          <span className="font-semibold text-foreground">Level {levelIdx + 1}: {level.name}</span>
          <span>Q{qIdx + 1}/{level.questions.length}</span>
        </div>

        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm">❤️</span>
            <div className="hp-bar w-24 h-2.5 rounded-full overflow-hidden">
              <div className="hp-fill h-full rounded-full transition-all duration-500" style={{ width: `${(hp / maxHp) * 100}%` }} />
            </div>
            <span className="text-xs font-mono">{hp}/{maxHp}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">⭐</span>
            <div className="xp-bar w-24 h-2.5 rounded-full overflow-hidden">
              <div className="xp-fill h-full rounded-full transition-all duration-500" style={{ width: `${(xp / xpPerLevel) * 100}%` }} />
            </div>
            <span className="text-xs font-mono">{xp}/{xpPerLevel}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs bg-white/5 rounded-xl px-4 py-2.5 border border-border-subtle">
          <span className="text-lg">🗺️</span>
          <span className="text-muted">Zone:</span>
          <span className="font-medium">{level.zone}</span>
          <span className="text-muted mx-1">·</span>
          <span className="text-lg">👹</span>
          <span className="text-muted">Boss:</span>
          <span className="font-medium text-bitcoin">{level.boss}</span>
        </div>

        <div className="rounded-xl p-5 border border-border-subtle" style={{ background: 'rgba(247,147,26,0.03)' }}>
          <p className="text-base sm:text-lg font-medium mb-4">{question.question}</p>
          <div className="grid gap-2.5">
            {question.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className={`quest-option w-full text-left px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3 ${answered ? 'disabled' : ''} ${answered && selected === i ? (i === question.correct ? 'correct' : 'wrong') : ''}`}
              >
                <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(247,147,26,0.08)', color: 'var(--text-muted)' }}>
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
                {answered && i === question.correct && <span className="ml-auto text-emerald-400 text-lg">✓</span>}
                {answered && selected === i && i !== question.correct && <span className="ml-auto text-red-400 text-lg">✗</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-muted">
          {QUEST_LEVELS.map((_, i) => (
            <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i < levelIdx ? 'bg-bitcoin' : i === levelIdx ? 'bg-bitcoin/60' : 'bg-white/10'}`} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [repos, setRepos] = useState<Repo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeSeries, setActiveSeries] = useState<Series>('Newbies')
  const contentRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)

  useScrollReveal()

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
  const filteredRepos = grouped[activeSeries] ?? []

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText('bc1q47tl79lx5ua5hecnsj42d6whgk8hjlqvlv3jh7')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  return (
    <div className="flex flex-col">
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* ═══ HERO ═══ */}
      <section className="hero-gradient min-h-screen flex items-center justify-center relative overflow-hidden">
        <ParticlesBg />
        <div className="max-w-4xl mx-auto px-5 py-20 text-center relative z-10 flex flex-col items-center gap-6 reveal">
          <div className="w-24 h-24 rounded-3xl bg-bitcoin/10 flex items-center justify-center bitcoin-pulse border border-bitcoin/20">
            <BitcoinSvg className="w-12 h-12 text-bitcoin" />
          </div>
          <div>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">Bitcoin<br /><span className="text-bitcoin">Knowledge Hub</span></h1>
            <p className="text-sm sm:text-base text-muted max-w-lg mx-auto mt-3">From newbie to advanced — interactive quest, tools, and curated resources. All in one place.</p>
          </div>
          <div className="flex gap-3 flex-wrap justify-center">
            <a href="#quest" className="px-6 py-2.5 bg-bitcoin text-charcoal font-semibold rounded-xl text-sm hover:brightness-110 transition-all shadow-lg shadow-bitcoin/20">🎮 Play Quest</a>
            <a href="#cards" className="px-6 py-2.5 border border-bitcoin/30 text-bitcoin font-semibold rounded-xl text-sm hover:bg-bitcoin/10 transition-all">📚 Explore Cards</a>
          </div>
          <div className="donation-box rounded-xl px-5 py-3 flex items-center gap-3 text-xs sm:text-sm reveal reveal-delay-2">
            <span className="text-bitcoin">₿</span>
            <span className="text-muted">Donate:</span>
            <code className="text-bitcoin font-mono text-xs sm:text-sm select-all">bc1q47tl79lx5ua5hecnsj42d6whgk8hjlqvlv3jh7</code>
            <button onClick={handleCopy} className="px-3 py-1 rounded-lg bg-bitcoin/10 text-bitcoin hover:bg-bitcoin/20 transition-colors text-xs font-medium">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </section>

      {/* ═══ QUEST ═══ */}
      <section id="quest" className="max-w-2xl mx-auto w-full px-5 py-16 sm:py-20">
        <div className="text-center mb-8 reveal">
          <h2 className="text-2xl sm:text-3xl font-bold">⚔️ Bitcoin Quest</h2>
          <p className="text-sm text-muted mt-2">Defeat bosses across 10 levels with Bitcoin knowledge. Every question is unique.</p>
        </div>
        <QuestGame />
      </section>

      {/* ═══ SEPARATOR ═══ */}
      <div className="max-w-6xl mx-auto px-5 reveal">
        <div className="border-t border-bitcoin/10" />
      </div>

      {/* ═══ CARDS ═══ */}
      <main id="main-content" className="flex-1 max-w-6xl mx-auto w-full px-5 py-16 sm:py-20">
        <section id="cards">
          <div className="text-center mb-10 reveal">
            <h2 className="text-2xl sm:text-3xl font-bold">📚 Learn & Explore</h2>
            <p className="text-sm text-muted mt-2">Curated repositories with Q&A and click-to-reveal glossary terms.</p>
          </div>

          <section aria-label="Filter by skill level" className="reveal">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3" role="tablist" aria-label="Bitcoin series">
              {SERIES.map((s) => (
                <button
                  key={s.key}
                  onClick={() => { setActiveSeries(s.key); contentRef.current?.focus() }}
                  className={`btn-filter w-full sm:w-auto ${activeSeries === s.key ? 'active' : 'inactive'}`}
                  role="tab" aria-selected={activeSeries === s.key} aria-controls="series-panel"
                >
                  <span className="block leading-tight">{s.label}</span>
                  <span className="block text-xs font-normal mt-0.5 opacity-80">{s.desc}</span>
                </button>
              ))}
            </div>
          </section>

          <section id="series-panel" ref={contentRef} role="tabpanel" aria-label={`${activeSeries} series repositories`} tabIndex={-1} className="mt-8 sm:mt-10 outline-none">

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
                <button onClick={() => window.location.reload()} className="mt-4 px-5 py-2 bg-red-800/40 hover:bg-red-800/60 text-red-300 rounded-lg text-sm transition-colors">Retry</button>
              </div>
            )}

            {!loading && !error && (
              <>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs mb-6 pb-4 border-b" style={{ color: 'var(--text-muted)', borderColor: 'var(--border-light)' }}>
                  <span>Showing <strong style={{ color: 'var(--text-foreground)' }}>{filteredRepos.length}</strong> repo{filteredRepos.length !== 1 ? 's' : ''}</span>
                </div>

                {filteredRepos.length === 0 ? (
                  <p className="text-center py-12" style={{ color: 'var(--text-muted)' }}>No repositories in this category.</p>
                ) : (
                  <div className="grid gap-5 sm:gap-6 sm:grid-cols-2">
                    {filteredRepos.map((repo) => (
                      <div key={repo.id} className="reveal">
                        <RepoCard repo={repo} />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </section>
        </section>
      </main>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t" style={{ borderColor: 'var(--border-light)' }}>
        <div className="max-w-6xl mx-auto px-5 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 reveal">
            <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
              <BitcoinSvg className="w-5 h-5 text-bitcoin" />
              <span>Stack sats, not shit. ₿</span>
            </div>

            <div className="donation-box rounded-xl px-4 py-2.5 flex items-center gap-2.5 text-xs">
              <span className="text-bitcoin font-medium">Donate ₿</span>
              <code className="text-bitcoin/80 font-mono text-[11px] select-all">bc1q47tl79lx5ua5hecnsj42d6whgk8hjlqvlv3jh7</code>
              <button onClick={handleCopy} className="px-2.5 py-1 rounded-lg bg-bitcoin/10 text-bitcoin hover:bg-bitcoin/20 transition-colors text-[11px] font-medium">
                {copied ? '✓' : 'Copy'}
              </button>
            </div>

            <a href="https://github.com/heat-a11y" target="_blank" rel="noopener noreferrer" className="text-xs hover:text-bitcoin transition-colors" style={{ color: 'var(--text-muted)' }}>
              @heat-a11y
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
