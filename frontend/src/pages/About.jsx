import { Link } from 'react-router-dom'
import { ArrowRight, ScanEye, Layers3, SearchCheck, Fingerprint, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'

const values = [
  {
    icon: ScanEye,
    title: 'Clarity above all',
    text: 'Every verdict is accompanied by plain-language explanations, not just a numeric score.',
  },
  {
    icon: Layers3,
    title: 'Multi-model signals',
    text: 'We run multiple independent detection models and fuse their outputs — no single point of failure.',
  },
  {
    icon: SearchCheck,
    title: 'Evidence first',
    text: 'The evidence list shows exactly what drove the verdict. No black boxes, no unexplained outputs.',
  },
  {
    icon: Fingerprint,
    title: 'Integrity hashing',
    text: 'Every submission is SHA-256 hashed on receipt for chain-of-custody and audit-trail compliance.',
  },
]

const team = [
  { name: 'Forensic Analysis', stat: '5+ models' },
  { name: 'Media formats',     stat: '9 types' },
  { name: 'Avg. latency',      stat: '< 4 s' },
  { name: 'Report formats',    stat: 'PDF + JSON' },
]

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="page-hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="eyebrow" style={{ marginBottom: 20 }}>
              <ShieldCheck size={14} /> About TruthLens
            </div>
            <h1 className="heading-xl" style={{ maxWidth: 680 }}>
              A clearer lens on<br />digital truth.
            </h1>
            <p className="hero-copy" style={{ maxWidth: 560, marginTop: 24 }}>
              TruthLens is a forensic-grade AI media verification platform built
              for journalists, investigators, legal professionals, and anyone who
              needs to know what's real.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats strip */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--line)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
          {team.map(({ name, stat }, i) => (
            <motion.div
              key={name}
              style={{
                padding: '28px 32px',
                borderLeft: i > 0 ? '1px solid var(--line)' : 'none',
                display: 'flex', flexDirection: 'column', gap: 4,
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 600, color: 'var(--accent)', lineHeight: 1 }}>
                {stat}
              </span>
              <span style={{ color: 'var(--muted)', fontSize: 13 }}>{name}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mission */}
      <section className="section">
        <div className="container about-grid">
          <div>
            <div className="eyebrow" style={{ marginBottom: 16 }}>Our mission</div>
            <h2 className="heading-lg">Detection is a<br />starting point.</h2>
          </div>
          <div className="body-copy">
            <p>
              A single automated score leaves questions unanswered. TruthLens combines
              multiple model outputs with supporting evidence so results are easier to
              interpret, challenge, and share — whether you're in a newsroom, a courtroom,
              or a research lab.
            </p>
            <p>
              Automated analysis has real limits. We surface our uncertainty honestly.
              Always weigh results against full source context and qualified human judgment.
              Our reports are designed to support, not replace, expert review.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section" style={{ background: 'var(--surface)', borderBlock: '1px solid var(--line)' }}>
        <div className="container">
          <div className="section-heading">
            <div className="eyebrow">Our principles</div>
            <h2 className="heading-lg">Built around evidence.</h2>
          </div>
          <div className="grid-2 value-grid">
            {values.map(({ icon: Icon, title, text }, i) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Icon size={20} />
                <h3>{title}</h3>
                <p>{text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="about-cta">
            <div>
              <h2 className="heading-md">Ready to verify your first file?</h2>
              <p style={{ marginTop: 8, color: 'var(--text)', fontSize: 14 }}>
                No setup required — try the demo in under 30 seconds.
              </p>
            </div>
            <Link to="/register" className="btn">
              Get started <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}