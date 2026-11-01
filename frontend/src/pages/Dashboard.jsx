import { Link } from 'react-router-dom'
import { ArrowUpRight, FileCheck2, CalendarDays, ShieldAlert, Gauge, Image, AudioLines, Video, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { sampleAnalyses } from '../data/mockData'
import { useAuthStore } from '../store/authStore'
import VerdictBadge from '../components/VerdictBadge'

const iconMap = { Image, Audio: AudioLines, Video }

const stats = [
  { label: 'Total Analyses', value: '24',  sub: '+3 this week', icon: FileCheck2,  color: 'var(--accent)' },
  { label: 'This Month',     value: '8',   sub: '+2 from last',  icon: CalendarDays, color: 'var(--ok)' },
  { label: 'Flagged',        value: '8',   sub: '33% of total',  icon: ShieldAlert,  color: 'var(--bad)' },
  { label: 'Avg. Confidence',value: '82%', sub: 'across all media', icon: Gauge,    color: 'var(--warn)' },
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
  { label: 'Synthetic',        value: 5,  color: 'var(--bad)' },
  { label: 'Manipulated',      value: 3,  color: 'var(--warn)' },
  { label: 'Inconclusive',     value: 2,  color: '#5C6B87' },
]

export default function Dashboard() {
  const user = useAuthStore((s) => s.user)
  const maxActivity = Math.max(...activity.map((a) => a.value))
  const total = breakdown.reduce((sum, b) => sum + b.value, 0)
  let acc = 0
  const stops = breakdown.map((b) => {
    const start = acc
    acc += (b.value / total) * 100
    return `${b.color} ${start}% ${acc}%`
  }).join(', ')

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <h1 className="heading-lg">
          Welcome{user?.name ? `, ${user.name.split('@')[0]}` : ''}
        </h1>
        <p className="body-copy">Your verification activity at a glance.</p>
      </div>

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
            <div className="stat-value">{value}</div>
            <div className="stat-delta">
              <TrendingUp size={12} />
              <span style={{ color: 'var(--muted)', fontWeight: 400 }}>{sub}</span>
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
              <div className="bar-col" key={a.label}>
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
              aria-label="Assessment breakdown"
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
        {sampleAnalyses.slice(0, 5).map((item) => {
          const Icon = iconMap[item.type] || Image
          return (
            <div className="analysis-table" key={item.id}>
              <div className="file-cell">
                <span className="file-icon"><Icon size={16} /></span>
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
                <ArrowUpRight size={16} />
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
