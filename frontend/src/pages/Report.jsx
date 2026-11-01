import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Printer, ScanEye, FileText, AlertCircle } from 'lucide-react'
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

  return (
    <div className="report-page">
      <div className="report-toolbar">
        <Link to={`/results/${id}`} className="text-link">
          <ArrowLeft size={14} /> Back to assessment
        </Link>
        <button className="btn btn-ghost btn-sm" type="button" onClick={() => window.print()}>
          <Printer size={14} /> Print / Export PDF
        </button>
      </div>

      <article className="report-sheet card">

        {/* Header */}
        <header className="report-header">
          <div className="brand">
            <span className="brand-mark"><ScanEye size={17} /></span>
            <span className="brand-name">Truth<span>Lens</span></span>
          </div>
          <div className="report-meta">
            <span>Analysis report</span>
            <strong>Ref {result.ref} · {result.date}</strong>
          </div>
        </header>

        {/* Title */}
        <div className="report-title">
          <h1 className="heading-lg">Verification Summary</h1>
          <p>Report ID: {result.ref} · Analysed {result.longDate}</p>
        </div>

        {/* File info */}
        <div className="report-file">
          <FileText size={20} />
          <div>
            <strong>{result.name}</strong>
            <small>{result.type}</small>
          </div>
        </div>

        {/* Verdict */}
        <div className="report-verdict">
          <div>
            <h2>{result.verdict}</h2>
            <p>{result.summary}</p>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase', marginBottom: 8 }}>Confidence</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 40, fontWeight: 600, color: 'var(--ink)', lineHeight: 1 }}>
              {result.confidence}<span style={{ fontSize: 20, color: 'var(--muted)' }}>%</span>
            </div>
            <div style={{ height: 4, borderRadius: 999, background: 'var(--surface-3)', marginTop: 12, overflow: 'hidden' }}>
              <div style={{ width: `${result.confidence}%`, height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, var(--accent-strong), var(--accent))' }} />
            </div>
          </div>
        </div>

        {/* Models */}
        <h3 className="report-section-title">Model observations</h3>
        {result.models.map((m) => (
          <div className="report-model" key={m.key}>
            <span>{m.name}</span>
            <strong>{m.result}</strong>
            <b>{m.score === null ? '—' : `${m.score}%`}</b>
          </div>
        ))}

        {/* Evidence */}
        <h3 className="report-section-title">Evidence items</h3>
        <ul className="report-evidence">
          {result.evidence.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>

        {/* Integrity */}
        <h3 className="report-section-title">Integrity & audit trail</h3>
        <div className="report-integrity">
          {result.integrity.map(({ label, value }) => (
            <div className="report-integrity-row" key={label}>
              <span>{label}</span>
              <code style={{ wordBreak: 'break-all' }}>{value}</code>
            </div>
          ))}
        </div>

        {/* Caveat */}
        <div className="report-caveat">
          <strong>Limitations</strong>
          <p>
            Model scores are each detector’s estimated likelihood that the media is AI-generated or manipulated.
            Automated detection can produce false positives and negatives.
            Always review results with full source context and qualified human judgment.
          </p>
        </div>

      </article>
    </div>
  )
}
