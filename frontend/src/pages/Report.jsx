import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Printer, ScanEye, FileText } from 'lucide-react'
import { demoResult } from '../data/mockData'
import ConfidenceScore from '../components/ConfidenceScore'

export default function Report() {
  const { id } = useParams()

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
          <p className="body-copy">Ref {id} · October 31, 2026</p>
        </div>

        <div className="report-file">
          <FileText size={20} />
          <div>
            <strong>{demoResult.name}</strong>
            <small>{demoResult.type}</small>
          </div>
        </div>

        <div className="report-verdict">
          <div>
            <h2>{demoResult.verdict}</h2>
            <p>{demoResult.summary}</p>
          </div>
          <div className="report-score">
            <ConfidenceScore score={demoResult.confidence} />
          </div>
        </div>

        <h3 className="report-section-title">Model observations</h3>
        {demoResult.models.map((m) => (
          <div className="report-model" key={m.name}>
            <span>{m.name}</span>
            <strong>{m.result}</strong>
            <b>{m.score}%</b>
          </div>
        ))}

        <h3 className="report-section-title">Evidence</h3>
        <ul className="report-evidence">
          {demoResult.evidence.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>

        <div className="report-caveat">
          <strong>Limitations</strong>
          <p>
            Sample preview, not a real scan. Automated detection can give false positives and negatives, so review results with source context.
          </p>
        </div>
      </article>
    </div>
  )
}