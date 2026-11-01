import { Link } from 'react-router-dom'
import { ArrowUpRight, Search, Image, AudioLines, Video, FolderSearch } from 'lucide-react'
import { useMemo, useState } from 'react'
import { sampleAnalyses } from '../data/mockData'
import VerdictBadge from '../components/VerdictBadge'
import './app.css'

const icons = { Image, Audio: AudioLines, Video }
const filters = ['All', 'Image', 'Audio', 'Video']

export default function History() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')

  const rows = useMemo(
    () =>
      sampleAnalyses.filter(
        (x) => (filter === 'All' || x.type === filter) && x.name.toLowerCase().includes(query.toLowerCase())
      ),
    [query, filter]
  )

  return (
    <div>
      <header className="app-head">
        <h1>Case library</h1>
        <p>Revisit and export previous verification assessments.</p>
      </header>

      <div className="app-controls">
        <div className="app-search">
          <Search size={15} aria-hidden="true" />
          <input placeholder="Search by filename" aria-label="Search files" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="app-tabs" role="group" aria-label="Filter by media type">
          {filters.map((x) => (
            <button key={x} type="button" aria-pressed={filter === x} className={filter === x ? 'selected' : ''} onClick={() => setFilter(x)}>
              {x}
            </button>
          ))}
        </div>
      </div>

      <div className="app-panel app-table-wrap">
        <div className="app-table app-table-head" aria-hidden="true">
          <span>File</span><span>Type</span><span>Date</span><span>Assessment</span><span>Confidence</span><span />
        </div>

        {rows.length ? (
          rows.map((item) => {
            const Icon = icons[item.type] || Image
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
          })
        ) : (
          <div className="app-empty">
            <FolderSearch size={30} aria-hidden="true" />
            <strong>No matching analyses</strong>
            <span>Try a different search or filter.</span>
          </div>
        )}
      </div>
    </div>
  )
}