import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, FileText, FileSearch, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react'
import { motion } from 'framer-motion'
import { demoResult, sampleAnalyses } from '../data/mockData'
import LoadingAnimation from '../components/LoadingAnimation'
import VerdictBadge, { verdictTone } from '../components/VerdictBadge'
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
    <div>
      <div className="app-toolbar">
        <Link to="/history" className="app-link"><ArrowLeft size={14} aria-hidden="true" /> History</Link>
        <div className="app-toolbar-right">
          <span className="app-pill">Demo result</span>
          <Link to={`/report/${result.id}`} className="app-btn app-btn-ghost app-btn-sm">
            <FileText size={14} aria-hidden="true" /> View report
          </Link>
        </div>
      </div>

      <header className="app-head">
        <h1>Assessment</h1>
        <p>{result.name} · {result.type} · {result.date || 'Just now'}</p>
      </header>

      <section className="app-panel app-verdict">
        <div className="app-verdict-main">
          <span className={`app-verdict-icon ${tone}`}><VerdictIcon size={22} aria-hidden="true" /></span>
          <div>
            <VerdictBadge verdict={verdict} />
            <p>{result.summary || demoResult.summary}</p>
          </div>
        </div>

        <div className="app-confidence">
          <span className="app-label">Confidence score</span>
          <div className="app-confidence-score">{confidence}<span>%</span></div>
          <div className="app-meter" role="img" aria-label={`Confidence ${confidence} percent`}>
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <small>Fused across all models. A higher score means more certainty in the verdict.</small>
        </div>
      </section>

      <div className="app-section-head"><h2 className="app-h2">Model observations</h2></div>
      <section className="app-panel app-models">
        {demoResult.models.map((m) => (
          <div className="app-model" key={m.name}>
            <div>
              <strong>{m.name}</strong>
              <small>{m.result}</small>
            </div>
            <div className="app-model-meter">
              <div className="app-meter"><span style={{ width: `${m.score}%` }} /></div>
              <b>{m.score}%</b>
            </div>
          </div>
        ))}
      </section>

      <div className="app-section-head"><h2 className="app-h2">Evidence</h2></div>
      <ul className="app-panel app-evidence">
        {demoResult.evidence.map((e) => (
          <li key={e}><FileSearch size={15} aria-hidden="true" /><span>{e}</span></li>
        ))}
      </ul>

      <div className="app-section-head"><h2 className="app-h2">Integrity and audit trail</h2></div>
      <dl className="app-panel app-integrity">
        {integrity.map(({ label, value }) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <div className="app-note">
        <AlertCircle size={16} aria-hidden="true" />
        <p>Sample data, not a real analysis. Connect a backend for genuine model results. Automated detection can produce false positives and negatives.</p>
      </div>
    </div>
  )
}