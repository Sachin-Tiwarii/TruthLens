import { Link } from 'react-router-dom'
import { ArrowUpRight, FileCheck2, CalendarDays, ShieldAlert, Gauge, Image, AudioLines, Video } from 'lucide-react'
import { useMemo } from 'react'
import { useAuthStore } from '../store/authStore'
import VerdictBadge from '../components/VerdictBadge'
import LoadingAnimation from '../components/LoadingAnimation'
import { useAnalysisHistory } from '../hooks/useAnalysisHistory'

const iconMap = { Image, Audio: AudioLines, Video }

const BREAKDOWN = [
  { verdict: 'real', label: 'Likely authentic', color: 'var(--ok)' },
  { verdict: 'fake', label: 'Potentially synthetic', color: 'var(--bad)' },
  { verdict: 'undetermined', label: 'Inconclusive', color: '#94A3B8' },
]

const monthKey = (date) => `${date.getFullYear()}-${date.getMonth()}`

function summarize(records) {
  const now = new Date()
  const thisMonth = monthKey(now)
  const total = records.length
  const avgConfidence = total
    ? Math.round(records.reduce((sum, r) => sum + r.confidence, 0) / total)
    : null

  const stats = [
    { label: 'Total analyses', value: String(total), icon: FileCheck2 },
    {
      label: 'This month',
      value: String(records.filter((r) => monthKey(new Date(r.timestamp)) === thisMonth).length),
      icon: CalendarDays,
    },
    { label: 'Flagged', value: String(records.filter((r) => r.rawVerdict === 'fake').length), icon: ShieldAlert },
    { label: 'Avg. confidence', value: avgConfidence === null ? '—' : `${avgConfidence}%`, icon: Gauge },
  ]

  const activity = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
    const key = monthKey(date)
    return {
      label: date.toLocaleDateString(undefined, { month: 'short' }),
      value: records.filter((r) => monthKey(new Date(r.timestamp)) === key).length,
    }
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
    ? breakdown
        .map((b) => {
          const start = acc
          acc += (b.value / total) * 100
          return `${b.color} ${start}% ${acc}%`
        })
        .join(', ')
    : 'var(--line) 0% 100%'

  return (
    <div className="dashboard-page">
      <div className="dashboard-heading">
        <div>
          <h1 className="heading-lg">Welcome{user?.name ? `, ${user.name}` : ''}</h1>
          <p className="body-copy">Your verification activity at a glance.</p>
        </div>
      </div>

      {error && (
        <div className="result-warning" role="alert">
          <ShieldAlert size={17} />
          <p>{error}</p>
        </div>
      )}

      <div className="stats-grid">
        {stats.map(({ label, value, icon: Icon }) => (
          <article className="stat-card" key={label}>
            <div className="stat-top">
              <span>{label}</span>
              <Icon size={17} />
            </div>
            <strong>{loading ? '…' : value}</strong>
          </article>
        ))}
      </div>

      <div className="dashboard-grid">
        <section className="card chart-card">
          <div className="chart-head">
            <h2>Analyses per month</h2>
            <p>Last 6 months</p>
          </div>
          <div
            className="bar-chart"
            role="img"
            aria-label={`Analyses per month: ${activity.map((a) => `${a.label} ${a.value}`).join(', ')}`}
          >
            {activity.map((a, i) => (
              <div className="bar-col" key={a.label}>
                <span className="bar-value">{a.value}</span>
                <div className="bar-track">
                  <span
                    className={`bar ${i === activity.length - 1 ? 'current' : ''}`}
                    style={{ height: `${(a.value / maxActivity) * 100}%` }}
                  />
                </div>
                <span className="bar-label">{a.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card chart-card">
          <div className="chart-head">
            <h2>Assessments</h2>
            <p>All time</p>
          </div>
          <div className="breakdown">
            <div className="donut" style={{ background: `conic-gradient(${stops})` }} role="img" aria-label="Assessment breakdown">
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

      <div className="content-heading">
        <h2>Recent analyses</h2>
        <Link to="/history" className="text-link">
          View all <ArrowUpRight size={15} />
        </Link>
      </div>

      <div className="table-card card">
        <div className="analysis-table table-head">
          <span>File</span><span>Type</span><span>Date</span><span>Assessment</span><span>Confidence</span><span />
        </div>
        {loading ? (
          <LoadingAnimation label="Loading analyses" hint="" />
        ) : records.length === 0 ? (
          <div className="empty-state">
            No analyses yet. <Link to="/analyze" className="text-link">Analyze your first file</Link>
          </div>
        ) : (
          records.slice(0, 3).map((item) => {
            const Icon = iconMap[item.type] || Image
            return (
              <div className="analysis-table" key={item.id}>
                <div className="file-cell">
                  <span className="file-icon"><Icon size={17} /></span>
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
                  <ArrowUpRight size={17} />
                </Link>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
