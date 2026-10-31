import { Link } from 'react-router-dom'
import { ArrowUpRight, FileCheck2, CalendarDays, ShieldAlert, Gauge, Image, AudioLines, Video } from 'lucide-react'
import { sampleAnalyses } from '../data/mockData'
import { useAuth } from '../context/AuthContext'
import VerdictBadge from '../components/VerdictBadge'

const iconMap = { Image, Audio: AudioLines, Video }

const stats = [
  { label: 'Total analyses', value: '24', icon: FileCheck2 },
  { label: 'This month', value: '8', icon: CalendarDays },
  { label: 'Flagged', value: '8', icon: ShieldAlert },
  { label: 'Avg. confidence', value: '82%', icon: Gauge },
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
  { label: 'Inconclusive', value: 2, color: '#94A3B8' },
]

export default function Dashboard() {
  const { user } = useAuth()

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
    <div className="dashboard-page">
      <div className="dashboard-heading">
        <div>
          <h1 className="heading-lg">Welcome{user?.name ? `, ${user.name}` : ''}</h1>
          <p className="body-copy">Your verification activity at a glance.</p>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map(({ label, value, icon: Icon }) => (
          <article className="stat-card" key={label}>
            <div className="stat-top">
              <span>{label}</span>
              <Icon size={17} />
            </div>
            <strong>{value}</strong>
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
        {sampleAnalyses.slice(0, 3).map((item) => {
          const Icon = iconMap[item.type] || Image
          return (
            <div className="analysis-table" key={item.id}>
              <div className="file-cell">
                <span className="file-icon"><Icon size={17} /></span>
                <div>
                  <strong>{item.name}</strong>
                  <small>{item.id}</small>
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
        })}
      </div>
    </div>
  )
}