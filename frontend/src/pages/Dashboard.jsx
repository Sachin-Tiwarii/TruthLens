import { Link } from 'react-router-dom'
import { ArrowUpRight, FileCheck2, CalendarDays, ShieldAlert, Gauge, Image, AudioLines, Video } from 'lucide-react'
import { sampleAnalyses } from '../data/mockData'
import { useAuthStore } from '../store/authStore'
import VerdictBadge from '../components/VerdictBadge'
import './app.css'

const iconMap = { Image, Audio: AudioLines, Video }

const stats = [
  { label: 'Total analyses', value: '24', sub: '+3 this week', icon: FileCheck2, tone: 'blue' },
  { label: 'This month', value: '8', sub: '+2 from last month', icon: CalendarDays, tone: 'ok' },
  { label: 'Flagged', value: '8', sub: '33% of total', icon: ShieldAlert, tone: 'bad' },
  { label: 'Average confidence', value: '82%', sub: 'across all media', icon: Gauge, tone: 'warn' },
]

const activity = [
  { label: 'May', value: 3 },
  { label: 'Jun', value: 4 },
  { label: 'Jul', value: 2 },
  { label: 'Aug', value: 3 },
  { label: 'Sep', value: 4 },
  { label: 'Oct', value: 8 },
]

const breakdown = [
  { label: 'Likely authentic', value: 14, color: 'var(--ok)' },
  { label: 'Synthetic', value: 5, color: 'var(--bad)' },
  { label: 'Manipulated', value: 3, color: 'var(--warn)' },
  { label: 'Inconclusive', value: 2, color: '#5c6b87' },
]

export default function Dashboard() {
  const user = useAuthStore((s) => s.user)
  const maxActivity = Math.max(...activity.map((a) => a.value))
  const total = breakdown.reduce((sum, b) => sum + b.value, 0)
  let acc = 0
  const stops = breakdown
    .map((b) => {
      const start = acc
      acc += (b.value / total) * 100
      return `${b.color} ${start}% ${acc}%`
    })
    .join(', ')

  return (
    <div>
      <header className="app-head">
        <h1>Welcome{user?.name ? `, ${user.name.split('@')[0]}` : ''}</h1>
        <p>Your verification activity at a glance.</p>
      </header>

      <section className="app-panel app-stats" aria-label="Summary">
        {stats.map(({ label, value, sub, icon: Icon, tone }) => (
          <div key={label}>
            <div className="app-stat-top">
              <span>{label}</span>
              <Icon size={16} className={`tone-${tone}`} aria-hidden="true" />
            </div>
            <div className="app-stat-value">{value}</div>
            <div className="app-stat-sub">{sub}</div>
          </div>
        ))}
      </section>

      <div className="app-dash-grid">
        <section className="app-panel">
          <h2 className="app-h2">Analyses per month</h2>
          <p className="app-sub">Last 6 months</p>
          <div
            className="app-bars"
            role="img"
            aria-label={`Analyses per month: ${activity.map((a) => `${a.label} ${a.value}`).join(', ')}`}
          >
            {activity.map((a, i) => (
              <div className="app-bar-col" key={a.label}>
                <span className="app-bar-val">{a.value}</span>
                <div className="app-bar-track">
                  <span className={`app-bar${i === activity.length - 1 ? ' current' : ''}`} style={{ height: `${(a.value / maxActivity) * 100}%` }} />
                </div>
                <span className="app-bar-label">{a.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="app-panel">
          <h2 className="app-h2">Assessments</h2>
          <p className="app-sub">All time</p>
          <div className="app-breakdown">
            <div className="app-donut" style={{ background: `conic-gradient(${stops})` }} role="img" aria-label="Assessment breakdown">
              <div>
                <strong>{total}</strong>
                <span>total</span>
              </div>
            </div>
            <ul className="app-legend">
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

      <div className="app-section-head">
        <h2 className="app-h2">Recent analyses</h2>
        <Link to="/history" className="app-link">View all <ArrowUpRight size={14} aria-hidden="true" /></Link>
      </div>

      <div className="app-panel app-table-wrap">
        <div className="app-table app-table-head" aria-hidden="true">
          <span>File</span><span>Type</span><span>Date</span><span>Assessment</span><span>Confidence</span><span />
        </div>
        {sampleAnalyses.slice(0, 5).map((item) => {
          const Icon = iconMap[item.type] || Image
          return (
            <div className="app-table" key={item.id}>
              <div className="app-file-cell">
                <span className="app-file-icon sm"><Icon size={16} aria-hidden="true" /></span>
                <div>
                  <strong>{item.name}</strong>
                  <small>{item.id}</small>
                </div>
              </div>
              <span>{item.type}</span>
              <span>{item.date}</span>
              <VerdictBadge verdict={item.verdict} />
              <span className="app-conf">{item.confidence}%</span>
              <Link to={`/results/${item.id}`} className="app-icon-btn" aria-label={`View result for ${item.name}`}>
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}