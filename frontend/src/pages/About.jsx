import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import './pages.css'

const principles = [
  {
    title: 'Clarity above all',
    text: 'Every verdict comes with a plain-language explanation, not just a numeric score.',
  },
  {
    title: 'Multi-model signals',
    text: 'Several independent detection models run on every file and their outputs are fused, so no single model is a point of failure.',
  },
  {
    title: 'Evidence first',
    text: 'The evidence list shows exactly what drove the verdict. No black boxes and no unexplained outputs.',
  },
  {
    title: 'Integrity hashing',
    text: 'Every submission is SHA-256 hashed on receipt to support chain of custody and audit trails.',
  },
]

const facts = [
  { label: 'Detection models', value: '5+' },
  { label: 'Media formats', value: '9' },
  { label: 'Average latency', value: '< 4 s' },
  { label: 'Report formats', value: 'PDF, JSON' },
]

export default function About() {
  return (
    <div className="tl-page tl-about">
      <header className="tl-about-wrap tl-about-intro">
        <h1>A clearer lens on digital truth.</h1>

        <div className="tl-about-intro-body">
          <p className="tl-about-lead">
            TruthLens is a forensic-grade AI media verification platform built for journalists,
            investigators, legal professionals, and anyone who needs to know what’s real.
          </p>

          <dl className="tl-about-facts" aria-label="Platform at a glance">
            {facts.map(({ label, value }) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <section className="tl-about-wrap tl-about-split">
        <h2>Detection is a starting point.</h2>
        <div className="tl-about-prose">
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
      </section>

      <section className="tl-about-wrap tl-about-principles" aria-labelledby="principles-title">
        <h2 id="principles-title">Built around evidence.</h2>
        <dl>
          {principles.map(({ title, text }) => (
            <div key={title}>
              <dt>{title}</dt>
              <dd>{text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="tl-about-wrap tl-about-close">
        <div>
          <h2>Ready to verify your first file?</h2>
          <p>No setup required. Try the demo in under 30 seconds.</p>
        </div>
        <Link to="/register" className="tl-about-btn">
          Get started <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </section>
    </div>
  )
}
