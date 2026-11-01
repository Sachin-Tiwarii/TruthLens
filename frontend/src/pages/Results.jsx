import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, FileText, FileSearch, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react'
import { motion } from 'framer-motion'
import LoadingAnimation from '../components/LoadingAnimation'
import VerdictBadge, { verdictTone } from '../components/VerdictBadge'
import { useAnalysisResult } from '../hooks/useAnalysisResult'

const toneIcon = { ok: CheckCircle2, warn: AlertCircle, bad: ShieldAlert }

export default function Results() {
  const { id } = useParams()
  const { result, loading, error } = useAnalysisResult(id)

  if (loading) {
    return (
      <div className="results-page">
        <div className="card">
          <LoadingAnimation label="Loading assessment" hint="" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="results-page">
        <div className="result-back">
          <Link to="/history" className="text-link">
            <ArrowLeft size={14} /> History
          </Link>
        </div>
        <div className="card empty-state" role="alert">
          <AlertCircle size={28} />
          <strong style={{ color: 'var(--text)' }}>{error}</strong>
        </div>
      </div>
    )
  }

  const tone        = verdictTone(result.verdict)
  const VerdictIcon = toneIcon[tone]

  return (
    <div className="results-page">

      {/* Toolbar */}
      <div className="result-back">
        <Link to="/history" className="text-link">
          <ArrowLeft size={14} /> History
        </Link>
        <div style={{ display: 'flex', gap: 8 }}>
          <span className="pill">{result.ref}</span>
          <Link to={`/report/${result.id}`} className="btn btn-ghost btn-sm">
            <FileText size={14} /> View report
          </Link>
        </div>
      </div>

      {/* Page header */}
      <div className="result-heading">
        <div>
          <h1 className="heading-lg">Assessment</h1>
          <p className="body-copy" style={{ fontSize: 13, marginTop: 4 }}>
            {result.name} · {result.type} · {result.date}
          </p>
        </div>
      </div>

      {/* Verdict + Confidence */}
      <motion.section
        className="result-summary card"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="result-verdict">
          <span className={`result-check ${tone}`}>
            <VerdictIcon size={22} />
          </span>
          <div>
            <h2><VerdictBadge verdict={result.verdict} /></h2>
            <p style={{ marginTop: 10 }}>{result.summary}</p>
          </div>
        </div>

        <div className="confidence-wrap">
          <div className="confidence-top">
            <span>Confidence score</span>
          </div>
          <div className="confidence-score">
            {result.confidence}<span>%</span>
          </div>
          <div className="confidence-track">
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: `${result.confidence}%` }}
              transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
            />
          </div>
          <small>Combined across the models that ran — higher score = higher certainty of verdict</small>
        </div>
      </motion.section>

      {/* Model observations */}
      <div className="content-heading">
        <h2>Model observations</h2>
      </div>
      <p className="small-disclaimer" style={{ marginBottom: 10 }}>
        Each score is that model’s estimated likelihood that the media is AI-generated or manipulated.
      </p>
      <div className="model-list card">
        {result.models.map((m, i) => (
          <motion.div
            className="model-row"
            key={m.key}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
          >
            <div className="model-info">
              <strong>{m.name}</strong>
              <small>{m.result}</small>
            </div>
            <div className="model-meter">
              <div className="meter-track">
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: `${m.score ?? 0}%` }}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.7, ease: 'easeOut' }}
                />
              </div>
              <b>{m.score === null ? '—' : `${m.score}%`}</b>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Evidence */}
      <div className="content-heading" style={{ marginTop: 24 }}>
        <h2>Evidence</h2>
      </div>
      <div className="evidence-list card">
        {result.evidence.map((e, i) => (
          <motion.div
            className="evidence-item"
            key={e}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.05 }}
          >
            <FileSearch size={15} />
            <span>{e}</span>
          </motion.div>
        ))}
      </div>

      {/* Integrity */}
      <div className="content-heading" style={{ marginTop: 24 }}>
        <h2>Integrity & audit trail</h2>
      </div>
      <div className="integrity-section card">
        {result.integrity.map(({ label, value }) => (
          <div className="integrity-row" key={label}>
            <span className="integrity-label">{label}</span>
            <span className="integrity-value" style={{ wordBreak: 'break-all' }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="result-warning">
        <AlertCircle size={16} />
        <p>Automated detection can produce false positives and negatives. Use this result to support human review, together with the source and context of the media.</p>
      </div>
    </div>
  )
}
