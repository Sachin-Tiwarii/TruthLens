import { Link } from 'react-router-dom'
import { ArrowUpRight, Search, Image, AudioLines, Video } from 'lucide-react'
import { useMemo, useState } from 'react'
import { sampleAnalyses } from '../data/mockData'
import VerdictBadge from '../components/VerdictBadge'

const icons = { Image, Audio: AudioLines, Video }
const filters = ['All', 'Image', 'Audio', 'Video']

export default function History() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')

  const rows = useMemo(
    () =>
      sampleAnalyses.filter(
        (x) =>
          (filter === 'All' || x.type === filter) &&
          x.name.toLowerCase().includes(query.toLowerCase())
      ),
    [query, filter]
  )

  return (
    <div className="history-page">
      <div className="dashboard-heading">
        <div>
          <h1 className="heading-lg">History</h1>
          <p className="body-copy">Revisit your previous assessments.</p>
        </div>
      </div>

      <div className="history-controls">
        <div className="search-box">
          <Search size={16} />
          <input
            placeholder="Search files"
            aria-label="Search files"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          {filters.map((x) => (
            <button
              key={x}
              type="button"
              className={filter === x ? 'selected' : ''}
              onClick={() => setFilter(x)}
            >
              {x}
            </button>
          ))}
        </div>
      </div>

      <div className="table-card card">
        <div className="analysis-table table-head">
          <span>File</span><span>Type</span><span>Date</span><span>Assessment</span><span>Confidence</span><span />
        </div>
        {rows.length ? (
          rows.map((item) => {
            const Icon = icons[item.type] || Image
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
          })
        ) : (
          <div className="empty-state">No matching analyses.</div>
        )}
      </div>
    </div>
  )
}