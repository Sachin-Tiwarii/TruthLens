import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, FileText, FileSearch, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react'
import { demoResult, sampleAnalyses } from '../data/mockData'
import ConfidenceScore from '../components/ConfidenceScore'
import LoadingAnimation from '../components/LoadingAnimation'
import { verdictTone } from '../components/VerdictBadge'

const toneIcon = { ok: CheckCircle2, warn: AlertCircle, bad: ShieldAlert }

const readUpload = () => {
  try {
    return JSON.parse(sessionStorage.getItem('truthlens_upload') || 'null')
  } catch {
    return null
  }
}

export default function Results() {
  const { id } = useParams()
  const [loading, setLoading] = useState(id === 'new')

  useEffect(() => {
    if (!loading) return
    const timer = setTimeout(() => setLoading(false), 1800)
    return () => clearTimeout(timer)
  }, [loading])

  if (loading) {
    return (
      <div className="results-page">
        <div className="card"><LoadingAnimation /></div>
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

  return (
    <div className="results-page">
      <div className="result-back">
        <Link to="/history" className="text-link">
          <ArrowLeft size={15} /> History
        </Link>
        <span className="pill">Demo result</span>
      </div>

      <div className="dashboard-heading result-heading">
        <div>
          <h1 className="heading-lg">Assessment</h1>
          <p className="body-copy">
            {result.name} · {result.type} · {result.date || 'Just now'}
          </p>
        </div>
        <Link to={`/report/${result.id}`} className="btn btn-outline">
          <FileText size={15} /> View report
        </Link>
      </div>

      <section className="result-summary card">
        <div className="result-verdict">
          <span className={`result-check ${tone}`}><VerdictIcon size={23} /></span>
          <div>
            <h2>{verdict}</h2>
            <p>{result.summary || demoResult.summary}</p>
          </div>
        </div>
        <div className="result-confidence">
          <ConfidenceScore score={result.confidence || demoResult.confidence} />
        </div>
      </section>

      <div className="content-heading">
        <h2>Model observations</h2>
      </div>
      <div className="model-list card">
        {demoResult.models.map((m) => (
          <div className="model-row" key={m.name}>
            <div className="model-info">
              <strong>{m.name}</strong>
              <small>{m.result}</small>
            </div>
            <div className="model-meter">
              <div className="meter-track"><span style={{ width: `${m.score}%` }} /></div>
              <b>{m.score}%</b>
            </div>
          </div>
        ))}
      </div>

      <div className="content-heading">
        <h2>Evidence</h2>
      </div>
      <div className="evidence-list card">
        {demoResult.evidence.map((e) => (
          <div key={e}>
            <FileSearch size={17} />
            <span>{e}</span>
          </div>
        ))}
      </div>

      <div className="result-warning">
        <AlertCircle size={17} />
        <p>Sample data, not a real analysis. A backend is needed for genuine model results.</p>
      </div>
    </div>
  )
}