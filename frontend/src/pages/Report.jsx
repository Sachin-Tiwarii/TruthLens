import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Printer, ScanEye, FileText } from 'lucide-react'
import ConfidenceScore from '../components/ConfidenceScore'
import LoadingAnimation from '../components/LoadingAnimation'
import { useAnalysisResult } from '../hooks/useAnalysisResult'

export default function Report() {
  const { id } = useParams()
  const { result, loading, error } = useAnalysisResult(id)

  if (loading) {
    return (
      <div className="report-page">
        <div className="card"><LoadingAnimation label="Loading report" hint="" /></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="report-page">
        <div className="report-toolbar">
          <Link to="/history" className="text-link">
            <ArrowLeft size={15} /> History
          </Link>
        </div>
        <div className="card empty-state" role="alert">{error}</div>
      </div>
    )
  }

  return (
    <div className="report-page">
      <div className="report-toolbar">
        <Link to={`/results/${id}`} className="text-link">
          <ArrowLeft size={15} /> Back
        </Link>
        <button className="btn btn-outline btn-small" type="button" onClick={() => window.print()}>
          <Printer size={14} /> Print
        </button>
      </div>

      <article className="report-sheet card">
        <header className="report-header">
          <div className="brand">
            <span className="brand-mark"><ScanEye size={20} /></span>
            <span className="brand-name">truth<span>lens</span></span>
          </div>
          <span className="report-label">Analysis report</span>
        </header>

        <div className="report-title">
          <h1 className="heading-lg">Verification summary</h1>
          <p className="body-copy">Ref {result.ref} · {result.longDate}</p>
        </div>

        <div className="report-file">
          <FileText size={20} />
          <div>
            <strong>{result.name}</strong>
            <small>{result.type}</small>
          </div>
        </div>

        <div className="report-verdict">
          <div>
            <h2>{result.verdict}</h2>
            <p>{result.summary}</p>
          </div>
          <div className="report-score">
            <ConfidenceScore score={result.confidence} />
          </div>
        </div>

        <h3 className="report-section-title">Model observations</h3>
        {result.models.map((m) => (
          <div className="report-model" key={m.key}>
            <span>{m.name}</span>
            <strong>{m.result}</strong>
            <b>{m.score === null ? '—' : `${m.score}%`}</b>
          </div>
        ))}

        <h3 className="report-section-title">Evidence</h3>
        <ul className="report-evidence">
          {result.evidence.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>

        <div className="report-caveat">
          <strong>Limitations</strong>
          <p>
            Model scores are each detector’s estimated likelihood that the media is AI-generated or manipulated. Automated detection can give false positives and negatives, so review results with source context.
          </p>
        </div>
      </article>
    </div>
  )
}
