import { Link } from 'react-router-dom'
import { ArrowRight, ScanEye, Layers3, SearchCheck, Fingerprint } from 'lucide-react'
import './pages.css'

const values = [
  {
    icon: ScanEye,
    title: 'Clarity above all',
    text: 'Every verdict comes with a plain-language explanation, not just a numeric score.',
  },
  {
    icon: Layers3,
    title: 'Multi-model signals',
    text: 'Several independent detection models run on every file and their outputs are fused, so no single model is a point of failure.',
  },
  {
    icon: SearchCheck,
    title: 'Evidence first',
    text: 'The evidence list shows exactly what drove the verdict. No black boxes and no unexplained outputs.',
  },
  {
    icon: Fingerprint,
    title: 'Integrity hashing',
    text: 'Every submission is SHA-256 hashed on receipt to support chain of custody and audit trails.',
  },
]

const stats = [
  { label: 'Detection models', value: '5+' },
  { label: 'Media formats', value: '9' },
  { label: 'Average latency', value: '< 4 s' },
  { label: 'Report formats', value: 'PDF, JSON' },
]

export default function About() {
  return (
    <div className="tl-page">
      {/* Hero */}
      <section className="tl-hero">
        <div className="tl-wrap">
          <h1 className="tl-h1">A clearer lens on digital truth.</h1>
          <p className="tl-lead">
            TruthLens is a forensic-grade AI media verification platform built for journalists,
            investigators, legal professionals, and anyone who needs to know what’s real.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="tl-stats-band" aria-label="Platform at a glance">
        <dl className="tl-wrap tl-stats">
          {stats.map(({ label, value }) => (
            <div key={label}>
              <dd>{value}</dd>
              <dt>{label}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* Mission */}
      <section className="tl-section">
        <div className="tl-wrap tl-mission">
          <h2 className="tl-h2">Detection is a starting point.</h2>
          <div className="tl-prose">
            <p>
              A single automated score leaves questions unanswered. TruthLens combines the outputs of
              multiple models with supporting evidence, so results are easier to interpret, challenge,
              and share, whether you’re in a newsroom, a courtroom, or a research lab.
            </p>
            <p>
              Automated analysis has real limits, and we show our uncertainty openly. Always weigh
              results against the full source context and qualified human judgment. Our reports are
              designed to support expert review, not replace it.
            </p>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="tl-section tl-section-alt">
        <div className="tl-wrap">
          <h2 className="tl-h2 tl-section-title">Built around evidence.</h2>
          <div className="tl-values">
            {values.map(({ icon: Icon, title, text }) => (
              <article key={title}>
                <span className="tl-icon"><Icon size={20} aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="tl-section">
        <div className="tl-wrap">
          <div className="tl-cta">
            <div>
              <h2 className="tl-h3">Ready to verify your first file?</h2>
              <p>No setup required. Try the demo in under 30 seconds.</p>
            </div>
            <Link to="/register" className="tl-btn-primary">
              Get started <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}