import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, FileText, FileSearch, CheckCircle2, AlertCircle, ShieldAlert, Hash, Clock, Cpu } from 'lucide-react'
import { motion } from 'framer-motion'
import { demoResult, sampleAnalyses } from '../data/mockData'
import LoadingAnimation from '../components/LoadingAnimation'
import { verdictTone } from '../components/VerdictBadge'
import VerdictBadge from '../components/VerdictBadge'

const toneIcon = { ok: CheckCircle2, warn: AlertCircle, bad: ShieldAlert }

const readUpload = () => {
  try { return JSON.parse(sessionStorage.getItem('truthlens_upload') || 'null') } catch { return null }
}

// Fake integrity data for demo
const integrity = [
  { label: 'SHA-256 Hash',      value: 'a3f2d...c4e91 (truncated)' },
  { label: 'Received at',       value: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC' },
  { label: 'Image model',       value: 'TruthLens-Vision v0.3.1' },
  { label: 'Audio model',       value: 'TruthLens-Audio v0.2.4' },
  { label: 'Fusion engine',     value: 'TruthLens-Fusion v1.0.0' },
  { label: 'Report version',    value: 'TLR-2026-10-31' },
]

export default function Results() {
  const { id }     = useParams()
  const [loading, setLoading] = useState(id === 'new')

  useEffect(() => {
    if (!loading) return
    const t = setTimeout(() => setLoading(false), 2200)
    return () => clearTimeout(t)
  }, [loading])

  if (loading) {
    return (
      <div className="results-page">
        <div className="card">
          <LoadingAnimation />
        </div>
      </div>
    )
  }

  const upload = id === 'new' ? readUpload() : null
  const prior  = sampleAnalyses.find((x) => x.id === id)

  const result = {
    ...demoResult,
    ...(prior  || {}),
    ...(upload ? { name: upload.name, type: upload.type, id: 'TL-DEMO' } : {}),
  }

  const verdict    = result.verdict || demoResult.verdict
  const tone       = verdictTone(verdict)
  const VerdictIcon = toneIcon[tone]
  const confidence  = result.confidence || demoResult.confidence

  return (
    <div className="results-page">

      {/* Toolbar */}
      <div className="result-back">
        <Link to="/history" className="text-link">
          <ArrowLeft size={14} /> History
        </Link>
        <div style={{ display: 'flex', gap: 8 }}>
          <span className="pill">Demo result</span>
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
            {result.name} · {result.type} · {result.date || 'Just now'}
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
            <h2><VerdictBadge verdict={verdict} /></h2>
            <p style={{ marginTop: 10 }}>{result.summary || demoResult.summary}</p>
          </div>
        </div>

        <div className="confidence-wrap">
          <div className="confidence-top">
            <span>Confidence score</span>
          </div>
          <div className="confidence-score">
            {confidence}<span>%</span>
          </div>
          <div className="confidence-track">
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
            />
          </div>
          <small>Fused across all models — higher score = higher certainty of verdict</small>
        </div>
      </motion.section>

      {/* Model observations */}
      <div className="content-heading">
        <h2>Model observations</h2>
      </div>
      <div className="model-list card">
        {demoResult.models.map((m, i) => (
          <motion.div
            className="model-row"
            key={m.name}
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
                  animate={{ width: `${m.score}%` }}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.7, ease: 'easeOut' }}
                />
              </div>
              <b>{m.score}%</b>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Evidence */}
      <div className="content-heading" style={{ marginTop: 24 }}>
        <h2>Evidence</h2>
      </div>
      <div className="evidence-list card">
        {demoResult.evidence.map((e, i) => (
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
        {integrity.map(({ label, value }) => (
          <div className="integrity-row" key={label}>
            <span className="integrity-label">{label}</span>
            <span className="integrity-value">{value}</span>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="result-warning">
        <AlertCircle size={16} />
        <p>Sample data — not a real analysis. Connect a backend for genuine model results. Automated detection can produce false positives and negatives.</p>
      </div>
    </div>
  )
}
