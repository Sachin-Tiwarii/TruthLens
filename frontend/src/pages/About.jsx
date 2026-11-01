import { Link } from 'react-router-dom'
import { ArrowRight, ScanEye, Layers3, SearchCheck } from 'lucide-react'

const values = [
  { icon: ScanEye, title: 'Clarity', text: 'Findings in plain language.' },
  { icon: Layers3, title: 'Multiple signals', text: 'Compare models, not a single score.' },
  { icon: SearchCheck, title: 'Evidence first', text: 'See what drives each assessment.' },
]

export default function About() {
  return (
    <div className="public-page">
      <section className="page-hero">
        <div className="container">
          <h1 className="heading-xl">A clearer lens on digital truth.</h1>
          <p className="hero-copy">
            TruthLens is an AI media detection platform that helps people examine images, audio and video with context and confidence.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container about-grid">
          <h2 className="heading-lg">Detection is a starting point.</h2>
          <div className="body-copy">
            <p>
              A single automated score leaves questions unanswered. TruthLens combines multiple model outputs with supporting observations so results are easier to interpret and share.
            </p>
            <p>
              Automated analysis has limits. Always weigh results against source context and human judgment.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="grid-3 value-grid">
            {values.map(({ icon: Icon, title, text }) => (
              <article key={title}>
                <Icon />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container about-cta">
          <h2 className="heading-md">See how your media is assessed.</h2>
          <Link to="/analyze" className="btn">
            Start analyzing <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  )
}