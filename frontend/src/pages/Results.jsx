import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, FileText, FileSearch, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react'
import ConfidenceScore from '../components/ConfidenceScore'
import LoadingAnimation from '../components/LoadingAnimation'
import { verdictTone } from '../components/VerdictBadge'
import { useAnalysisResult } from '../hooks/useAnalysisResult'

const toneIcon = { ok: CheckCircle2, warn: AlertCircle, bad: ShieldAlert }

export default function Results() {
  const { id } = useParams()
  const { result, loading, error } = useAnalysisResult(id)

  if (loading) {
    return (
      <div className="results-page">
        <div className="card"><LoadingAnimation label="Loading result" hint="" /></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="results-page">
        <div className="result-back">
          <Link to="/history" className="text-link">
            <ArrowLeft size={15} /> History
          </Link>
        </div>
        <div className="card empty-state" role="alert">{error}</div>
      </div>
    )
  }

  const tone = verdictTone(result.verdict)
  const VerdictIcon = toneIcon[tone]

  return (
    <div className="results-page">
      <div className="result-back">
        <Link to="/history" className="text-link">
          <ArrowLeft size={15} /> History
        </Link>
        <span className="pill">{result.ref}</span>
      </div>

      <div className="dashboard-heading result-heading">
        <div>
          <h1 className="heading-lg">Assessment</h1>
          <p className="body-copy">
            {result.name} · {result.type} · {result.date}
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
            <h2>{result.verdict}</h2>
            <p>{result.summary}</p>
          </div>
        </div>
        <div className="result-confidence">
          <ConfidenceScore score={result.confidence} />
        </div>
      </section>

      <div className="content-heading">
        <h2>Model observations</h2>
      </div>
      <p className="small-disclaimer">Each score is that model’s estimated likelihood that the media is AI-generated or manipulated.</p>
      <div className="model-list card">
        {result.models.map((m) => (
          <div className="model-row" key={m.key}>
            <div className="model-info">
              <strong>{m.name}</strong>
              <small>{m.result}</small>
            </div>
            <div className="model-meter">
              <div className="meter-track"><span style={{ width: `${m.score ?? 0}%` }} /></div>
              <b>{m.score === null ? '—' : `${m.score}%`}</b>
            </div>
          </div>
        ))}
      </div>

      <div className="content-heading">
        <h2>Evidence</h2>
      </div>
      <div className="evidence-list card">
        {result.evidence.map((e) => (
          <div key={e}>
            <FileSearch size={17} />
            <span>{e}</span>
          </div>
        ))}
      </div>

      <div className="result-warning">
        <AlertCircle size={17} />
        <p>Automated detection can produce false positives and negatives. Use this result to support human review, together with the source and context of the media.</p>
      </div>
    </div>
  )
}
