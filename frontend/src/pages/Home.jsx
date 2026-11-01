import { motion } from 'framer-motion'
import { ArrowRight, Image, AudioLines, Video, ShieldCheck, ScanLine, Fingerprint, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
})

const capabilities = [
  { icon: Image,     title: 'Image Forensics',  text: 'GAN detection, ELA analysis, noise inconsistency mapping and metadata integrity checks on still images.' },
  { icon: AudioLines, title: 'Audio Analysis',  text: 'Spectral artifact detection, voice synthesis fingerprinting, and temporal consistency analysis.' },
  { icon: Video,     title: 'Video Verification', text: 'Frame-level manipulation detection, optical flow analysis, and deepfake signature recognition.' },
]

const steps = [
  { num: '01', title: 'Ingest', text: 'Submit any image, audio clip, or video. Media is hashed on receipt for chain-of-custody.' },
  { num: '02', title: 'Analyze', text: 'Multi-model forensic pipeline runs in parallel — detection, ELA, spectral, and optical-flow nodes.' },
  { num: '03', title: 'Report', text: 'Receive a verdict with confidence score, per-model breakdown, evidence list, and integrity audit trail.' },
]

function VerificationVisual() {
  return (
    <div className="prism-visual">
      <div className="prism-scene">

        {/* Ambient orbit rings */}
        <motion.div
          className="prism-orbit prism-orbit-one"
          animate={{ rotate: 360 }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="prism-orbit prism-orbit-two"
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />

        {/* Main rotating 3D structure */}
        <motion.div
          className="prism-rotator"
          style={{ perspective: 600 }}
          animate={{ rotateY: [0, 360], rotateX: [-8, 8, -8], y: [0, -10, 0] }}
          transition={{
            rotateY: { duration: 28, repeat: Infinity, ease: 'linear' },
            rotateX: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
            y:       { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <div className="prism-cube" style={{ transformStyle: 'preserve-3d' }}>
            <div className="prism-face prism-front"  />
            <div className="prism-face prism-back"   />
            <div className="prism-face prism-left"   />
            <div className="prism-face prism-right"  />
            <div className="prism-face prism-top"    />
            <div className="prism-face prism-bottom" />
            <div className="prism-inner-frame" />
          </div>
        </motion.div>

        {/* Floating center shield */}
        <motion.div
          className="prism-center"
          animate={{ y: [0, -10, 0], scale: [1, 1.04, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="prism-shield">
            <ShieldCheck size={56} strokeWidth={1.2} />
          </div>
        </motion.div>

        {/* Scanning beam */}
        <motion.div
          className="prism-scan"
          animate={{ y: ['-120px', '120px', '-120px'], opacity: [0, 0.9, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Small floating particles */}
        <motion.span className="prism-particle particle-one"   animate={{ y: [0, -18, 0], opacity: [.4, 1, .4] }} transition={{ duration: 2.8, repeat: Infinity }} />
        <motion.span className="prism-particle particle-two"   animate={{ y: [0, 16,  0], opacity: [.4, 1, .4] }} transition={{ duration: 3.6, repeat: Infinity }} />
        <motion.span className="prism-particle particle-three" animate={{ y: [0, -12, 0], opacity: [.4, 1, .4] }} transition={{ duration: 3.2, repeat: Infinity }} />

        <div className="prism-ground" />
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div className="home-page">

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section className="hero-section">
        <div className="container hero-grid">

          <motion.div {...fadeUp(0)}>
            <div className="eyebrow hero-eyebrow">
              <ShieldCheck size={14} /> AI-Powered Media Verification
            </div>

            <h1 className="heading-xl hero-title">
              Know what's real.<br />
              Prove it.
            </h1>

            <p className="hero-copy">
              Forensic-grade detection for images, audio, and video —
              with explainable evidence behind every verdict. Built for journalists,
              investigators, and legal teams.
            </p>

            <div className="hero-actions">
              <Link to="/register" className="btn">
                Start verifying <ArrowRight size={16} />
              </Link>
              <Link to="/about" className="btn btn-ghost">
                Learn more
              </Link>
            </div>

            <div className="hero-trust">
              <span className="hero-trust-item"><ShieldCheck size={14} /> Explainable verdicts</span>
              <span className="hero-trust-item"><ScanLine size={14} /> Multi-model forensics</span>
              <span className="hero-trust-item"><Fingerprint size={14} /> Integrity hashing</span>
              <span className="hero-trust-item"><Lock size={14} /> Audit-ready reports</span>
            </div>
          </motion.div>

          <motion.div
            className="hero-visual-wrapper"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <VerificationVisual />
          </motion.div>

        </div>
      </section>

      {/* ══ CAPABILITIES ══════════════════════════════════════ */}
      <section className="section" id="capabilities">
        <div className="container">
          <motion.div className="section-heading" {...fadeUp(0)}>
            <div className="eyebrow">What we analyze</div>
            <h2 className="heading-lg">Three formats.<br />One unified verdict.</h2>
            <p>From a single interface, verify images, audio, and video with the same rigorous forensic methodology.</p>
          </motion.div>

          <div className="grid-3 capability-grid">
            {capabilities.map(({ icon: Icon, title, text }, i) => (
              <motion.article
                className="capability-card"
                key={title}
                {...fadeUp(i * 0.08)}
              >
                <span className="capability-icon"><Icon size={20} /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══════════════════════════════════════ */}
      <section className="section" id="how-it-works" style={{ background: 'var(--surface)', borderBlock: '1px solid var(--line)' }}>
        <div className="container">
          <motion.div className="section-heading" {...fadeUp(0)}>
            <div className="eyebrow">The pipeline</div>
            <h2 className="heading-lg">Evidence from ingest to report.</h2>
            <p>Every analysis runs a structured forensic pipeline — no black boxes, no unexplained scores.</p>
          </motion.div>

          <div className="steps-grid">
            {steps.map(({ num, title, text }, i) => (
              <motion.article className="step-card" key={num} {...fadeUp(i * 0.1)}>
                <span className="step-num">{num}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══════════════════════════════════════════════ */}
      <section className="section">
        <div className="container">
          <motion.div className="cta-panel" {...fadeUp(0)}>
            <div>
              <div className="eyebrow">Ready to verify?</div>
              <h2 className="heading-lg">Stop guessing.<br />Start knowing.</h2>
              <p>TruthLens delivers forensic clarity for every piece of media you need to assess.</p>
            </div>
            <div className="cta-actions">
              <Link to="/register" className="btn">Get started <ArrowRight size={16} /></Link>
              <Link to="/login"    className="btn btn-ghost">Sign in</Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}