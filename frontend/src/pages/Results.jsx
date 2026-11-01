import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, FileText, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react'
import { motion } from 'framer-motion'
import { demoResult, sampleAnalyses } from '../data/mockData'
import LoadingAnimation from '../components/LoadingAnimation'
import { verdictTone } from '../components/VerdictBadge'
import './app.css'

const toneIcon = { ok: CheckCircle2, warn: AlertCircle, bad: ShieldAlert }

const readUpload = () => {
  try { return JSON.parse(sessionStorage.getItem('truthlens_upload') || 'null') } catch { return null }
}

// Demo integrity data
const integrity = [
  { label: 'SHA-256 hash', value: 'a3f2d…c4e91 (truncated)' },
  { label: 'Received at', value: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC' },
  { label: 'Image model', value: 'TruthLens-Vision v0.3.1' },
  { label: 'Audio model', value: 'TruthLens-Audio v0.2.4' },
  { label: 'Fusion engine', value: 'TruthLens-Fusion v1.0.0' },
  { label: 'Report version', value: 'TLR-2026-10-31' },
]

export default function Results() {
  const { id } = useParams()
  const [loading, setLoading] = useState(id === 'new')

  useEffect(() => {
    if (!loading) return
    const t = setTimeout(() => setLoading(false), 2200)
    return () => clearTimeout(t)
  }, [loading])

  if (loading) {
    return (
      <div className="app-panel">
        <LoadingAnimation />
      </div>
    )
  }

  const upload = id === 'new' ? readUpload() : null
  const prior = sampleAnalyses.find((x) => x.id === id)

  const result = {
    ...demoResult,
    ...(prior || {}),
    ...(upload ? { name: upload.name, type: upload.type, id: 'TL-DEMO' } : {}),
  }

  const verdict = result.verdict || demoResult.verdict
  const tone = verdictTone(verdict)
  const VerdictIcon = toneIcon[tone]
  const confidence = result.confidence || demoResult.confidence

  return (
    <div className="as-page">
      <div className="app-toolbar">
        <Link to="/history" className="app-link"><ArrowLeft size={14} aria-hidden="true" /> History</Link>
        <div className="app-toolbar-right">
          <span className="app-pill">Demo result</span>
          <Link to={`/report/${result.id}`} className="app-btn app-btn-ghost app-btn-sm">
            <FileText size={14} aria-hidden="true" /> View report
          </Link>
        </div>
      </div>

      {/* Verdict leads; the fused confidence sits beside it as the one big number. */}
      <section className="as-hero" aria-labelledby="as-verdict">
        <div className="as-verdict">
          <p className="as-file">
            <span>{result.name}</span>
            <span>{result.type}</span>
            <span>{result.date || 'Just now'}</span>
          </p>
          <h1 id="as-verdict" className={`as-title ${tone}`}>
            <VerdictIcon size={30} strokeWidth={2.25} aria-hidden="true" />
            {verdict}
          </h1>
          <p className="as-summary">{result.summary || demoResult.summary}</p>
        </div>

        <div className="as-score">
          <span className="as-label">Confidence</span>
          <div className="as-score-value">{confidence}<span>%</span></div>
          <div className="as-meter" role="img" aria-label={`Confidence ${confidence} percent`}>
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <p className="as-score-note">Fused across all models. A higher score means more certainty in the verdict.</p>
        </div>
      </section>

      <section className="as-section" aria-labelledby="as-models">
        <h2 id="as-models" className="as-h2">Model observations</h2>
        <div className="as-models" role="table" aria-label="Per-model manipulation likelihood">
          <div className="as-model as-model-head" role="row">
            <span role="columnheader">Model</span>
            <span role="columnheader">Finding</span>
            <span role="columnheader" className="as-scale-head">
              Manipulation likelihood
              <span className="as-scale-ticks" aria-hidden="true"><i>0</i><i>50</i><i>100</i></span>
            </span>
          </div>
          {demoResult.models.map((m) => (
            <div className={`as-model${m.score >= 50 ? ' flagged' : ''}`} role="row" key={m.name}>
              <strong role="cell">{m.name}</strong>
              <span role="cell" className="as-finding">{m.result}</span>
              <span role="cell" className="as-bar-cell">
                <span className="as-bar" aria-hidden="true"><b style={{ width: `${m.score}%` }} /></span>
                <code>{m.score}%</code>
              </span>
            </div>
          ))}
        </div>
        <p className="as-legend">The marker on each bar is the 50% decision threshold. Scores above it count toward a manipulation verdict.</p>
      </section>

      <div className="as-split">
        <section className="as-section" aria-labelledby="as-evidence">
          <h2 id="as-evidence" className="as-h2">Evidence</h2>
          <ol className="as-evidence">
            {demoResult.evidence.map((e) => <li key={e}>{e}</li>)}
          </ol>
        </section>

        <section className="as-section" aria-labelledby="as-integrity">
          <h2 id="as-integrity" className="as-h2">Integrity and audit trail</h2>
          <dl className="as-integrity">
            {integrity.map(({ label, value }) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <p className="as-caveat">
        <AlertCircle size={15} aria-hidden="true" />
        Sample data, not a real analysis. Connect a backend for genuine model results. Automated detection can produce false positives and negatives.
      </p>
    </div>
  )
}