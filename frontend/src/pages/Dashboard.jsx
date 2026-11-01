import { Link } from 'react-router-dom'
import { ArrowUpRight, FileCheck2, CalendarDays, ShieldAlert, Gauge, Image, AudioLines, Video, TrendingUp, FolderSearch } from 'lucide-react'
import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { useAuthStore } from '../store/authStore'
import VerdictBadge from '../components/VerdictBadge'
import LoadingAnimation from '../components/LoadingAnimation'
import { useAnalysisHistory } from '../hooks/useAnalysisHistory'

const iconMap = { Image, Audio: AudioLines, Video }

const BREAKDOWN = [
  { verdict: 'real',         label: 'Likely authentic',      color: 'var(--ok)' },
  { verdict: 'fake',         label: 'Potentially synthetic', color: 'var(--bad)' },
  { verdict: 'undetermined', label: 'Inconclusive',          color: '#5C6B87' },
]

const monthKey = (d) => `${d.getFullYear()}-${d.getMonth()}`

function summarize(records) {
  const now       = new Date()
  const weekAgo   = now.getTime() - 7 * 24 * 60 * 60 * 1000
  const thisMonth = monthKey(now)
  const lastMonth = monthKey(new Date(now.getFullYear(), now.getMonth() - 1, 1))
  const total     = records.length

  const inMonth   = (key) => records.filter((r) => monthKey(new Date(r.timestamp)) === key).length
  const thisWeek  = records.filter((r) => new Date(r.timestamp).getTime() >= weekAgo).length
  const monthNow  = inMonth(thisMonth)
  const monthDiff = monthNow - inMonth(lastMonth)
  const flagged   = records.filter((r) => r.rawVerdict === 'fake').length
  const avgConf   = total ? Math.round(records.reduce((s, r) => s + r.confidence, 0) / total) : null

  const stats = [
    { label: 'Total Analyses',  value: String(total), sub: `+${thisWeek} this week`, icon: FileCheck2, color: 'var(--accent)' },
    { label: 'This Month',      value: String(monthNow), sub: `${monthDiff >= 0 ? '+' : ''}${monthDiff} from last`, icon: CalendarDays, color: 'var(--ok)' },
    { label: 'Flagged',         value: String(flagged), sub: total ? `${Math.round((flagged / total) * 100)}% of total` : 'none yet', icon: ShieldAlert, color: 'var(--bad)' },
    { label: 'Avg. Confidence', value: avgConf === null ? '—' : `${avgConf}%`, sub: 'across all media', icon: Gauge, color: 'var(--warn)' },
  ]

  const activity = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
    return { label: d.toLocaleDateString(undefined, { month: 'short' }), value: inMonth(monthKey(d)) }
  })

  const breakdown = BREAKDOWN.map((b) => ({
    ...b,
    value: records.filter((r) => r.rawVerdict === b.verdict).length,
  }))

  return { stats, activity, breakdown, total }
}

export default function Dashboard() {
  const user = useAuthStore((s) => s.user)
  const { records, loading, error } = useAnalysisHistory()
  const { stats, activity, breakdown, total } = useMemo(() => summarize(records), [records])

  const maxActivity = Math.max(1, ...activity.map((a) => a.value))
  let acc = 0
  const stops = total
    ? breakdown.map((b) => {
        const start = acc
        acc += (b.value / total) * 100
        return `${b.color} ${start}% ${acc}%`
      }).join(', ')
    : 'var(--surface-3) 0% 100%'

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <h1 className="heading-lg">
          Welcome{user?.name ? `, ${user.name.split('@')[0]}` : ''}
        </h1>
        <p className="body-copy">Your verification activity at a glance.</p>
      </div>

      {error && (
        <div className="result-warning" role="alert" style={{ marginBottom: 16 }}>
          <ShieldAlert size={16} />
          <p>{error}</p>
        </div>
      )}

      {/* Stats */}
      <div className="stats-grid">
        {stats.map(({ label, value, sub, icon: Icon, color }, i) => (
          <motion.article
            className="stat-card"
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
          >
            <div className="stat-top">
              <span>{label}</span>
              <Icon size={16} style={{ color }} />
            </div>
            <div className="stat-value">{loading ? '…' : value}</div>
            <div className="stat-delta">
              <TrendingUp size={12} />
              <span style={{ color: 'var(--muted)', fontWeight: 400 }}>{loading ? '' : sub}</span>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Charts row */}
      <div className="dashboard-grid">
        <section className="card chart-card">
          <div className="chart-head">
            <div>
              <h2>Analyses per month</h2>
              <p>Last 6 months</p>
            </div>
          </div>
          <div
            className="bar-chart"
            role="img"
            aria-label={`Analyses per month: ${activity.map((a) => `${a.label} ${a.value}`).join(', ')}`}
          >
            {activity.map((a, i) => (
              <div className="bar-col" key={`${a.label}-${i}`}>
                <span className="bar-value">{a.value}</span>
                <div className="bar-track">
                  <motion.span
                    className={`bar ${i === activity.length - 1 ? 'current' : ''}`}
                    initial={{ height: 0 }}
                    animate={{ height: `${(a.value / maxActivity) * 100}%` }}
                    transition={{ delay: i * 0.07, duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
                <span className="bar-label">{a.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card chart-card">
          <div className="chart-head">
            <div>
              <h2>Assessments</h2>
              <p>All time</p>
            </div>
          </div>
          <div className="breakdown">
            <div
              className="donut"
              style={{ background: `conic-gradient(${stops})` }}
              role="img"
              aria-label={`Assessment breakdown: ${breakdown.map((b) => `${b.label} ${b.value}`).join(', ')}`}
            >
              <div className="donut-center">
                <strong>{total}</strong>
                <span>total</span>
              </div>
            </div>
            <ul className="legend">
              {breakdown.map((b) => (
                <li key={b.label}>
                  <span><i style={{ background: b.color }} />{b.label}</span>
                  <b>{b.value}</b>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* Recent analyses */}
      <div className="content-heading" style={{ marginTop: 24 }}>
        <h2>Recent analyses</h2>
        <Link to="/history" className="text-link">View all <ArrowUpRight size={14} /></Link>
      </div>

      <div className="table-card card">
        <div className="analysis-table table-head">
          <span>File</span>
          <span>Type</span>
          <span>Date</span>
          <span>Assessment</span>
          <span>Confidence</span>
          <span />
        </div>
        {loading ? (
          <LoadingAnimation label="Loading analyses" hint="" />
        ) : records.length === 0 ? (
          <div className="empty-state">
            <FolderSearch size={32} />
            <strong style={{ color: 'var(--text)' }}>No analyses yet</strong>
            <span style={{ fontSize: 13 }}>
              <Link to="/analyze" className="text-link">Analyze your first file</Link>
            </span>
          </div>
        ) : (
          records.slice(0, 5).map((item) => {
            const Icon = iconMap[item.type] || Image
            return (
              <div className="analysis-table" key={item.id}>
                <div className="file-cell">
                  <span className="file-icon"><Icon size={16} /></span>
                  <div>
                    <strong>{item.name}</strong>
                    <small>{item.ref}</small>
                  </div>
                </div>
                <span>{item.type}</span>
                <span>{item.date}</span>
                <VerdictBadge verdict={item.verdict} />
                <span className="conf-cell">{item.confidence}%</span>
                <Link to={`/results/${item.id}`} className="table-action" aria-label={`View result for ${item.name}`}>
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
