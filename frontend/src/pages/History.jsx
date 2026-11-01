import { Link } from 'react-router-dom'
import { ArrowUpRight, Search, Image, AudioLines, Video, FolderSearch } from 'lucide-react'
import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import VerdictBadge from '../components/VerdictBadge'
import LoadingAnimation from '../components/LoadingAnimation'
import { useAnalysisHistory } from '../hooks/useAnalysisHistory'

const icons   = { Image, Audio: AudioLines, Video }
const filters = ['All', 'Image', 'Audio', 'Video']

export default function History() {
  const [query,  setQuery]  = useState('')
  const [filter, setFilter] = useState('All')
  const { records, loading, error } = useAnalysisHistory()

  const rows = useMemo(
    () => records.filter(
      (x) =>
        (filter === 'All' || x.type === filter) &&
        x.name.toLowerCase().includes(query.toLowerCase())
    ),
    [records, query, filter]
  )

  return (
    <div>
      <div className="page-header">
        <h1 className="heading-lg">Case Library</h1>
        <p className="body-copy">Revisit and export previous verification assessments.</p>
      </div>

      <div className="history-controls">
        <div className="search-box">
          <Search size={15} />
          <input
            placeholder="Search by filename…"
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
          <span>File</span>
          <span>Type</span>
          <span>Date</span>
          <span>Assessment</span>
          <span>Confidence</span>
          <span />
        </div>

        {loading ? (
          <LoadingAnimation label="Loading your analyses" hint="" />
        ) : error ? (
          <div className="empty-state" role="alert">
            <FolderSearch size={32} />
            <strong style={{ color: 'var(--text)' }}>{error}</strong>
          </div>
        ) : rows.length ? (
          rows.map((item, i) => {
            const Icon = icons[item.type] || Image
            return (
              <motion.div
                className="analysis-table"
                key={item.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
              >
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
                <Link
                  to={`/results/${item.id}`}
                  className="table-action"
                  aria-label={`View result for ${item.name}`}
                >
                  <ArrowUpRight size={16} />
                </Link>
              </motion.div>
            )
          })
        ) : (
          <div className="empty-state">
            <FolderSearch size={32} />
            {records.length ? (
              <>
                <strong style={{ color: 'var(--text)' }}>No matching analyses</strong>
                <span style={{ fontSize: 13 }}>Try a different search or filter.</span>
              </>
            ) : (
              <>
                <strong style={{ color: 'var(--text)' }}>No analyses yet</strong>
                <span style={{ fontSize: 13 }}>
                  <Link to="/analyze" className="text-link">Analyze your first file</Link>
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}