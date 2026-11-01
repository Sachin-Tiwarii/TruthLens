
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  Image,
  AudioLines,
  Video,
  ShieldCheck,
  ScanLine,
  Fingerprint,
  FileCheck2,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import ForensicSpecimen from './ForensicSpecimen.jsx'
import './home.css'

const capabilities = [
  {
    icon: Image,
    title: 'Image forensics',
    text: 'Find edited, generated, or composited regions in still images, and check whether the file’s own metadata holds up.',
    methods: [
      'GAN detection',
      'Error level analysis',
      'Noise inconsistency mapping',
      'Metadata integrity checks',
    ],
  },
  {
    icon: AudioLines,
    title: 'Audio analysis',
    text: 'Tell recorded speech from synthesized or spliced speech by examining the signal itself, not just how it sounds.',
    methods: [
      'Spectral artifact detection',
      'Voice synthesis fingerprinting',
      'Temporal consistency analysis',
    ],
  },
  {
    icon: Video,
    title: 'Video verification',
    text: 'Check motion and faces frame by frame to catch manipulation that holds up at normal playback speed.',
    methods: [
      'Frame-level manipulation detection',
      'Optical flow analysis',
      'Deepfake signature recognition',
    ],
  },
]

const steps = [
  {
    num: '01',
    title: 'Ingest',
    text: 'Submit any image, audio clip, or video. We hash it on receipt so its chain of custody starts immediately.',
  },
  {
    num: '02',
    title: 'Analyze',
    text: 'Detection, ELA, spectral, and optical-flow models run in parallel and are scored independently.',
  },
  {
    num: '03',
    title: 'Report',
    text: 'Get a verdict with a confidence score, a per-model breakdown, the supporting evidence, and an audit trail.',
  },
]

const trust = [
  { icon: ShieldCheck, label: 'Explainable verdicts' },
  { icon: ScanLine, label: 'Multi-model forensics' },
  { icon: Fingerprint, label: 'Integrity hashing' },
  { icon: FileCheck2, label: 'Audit-ready reports' },
]

export default function Home() {
  const reduce = useReducedMotion()

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduce ? 0 : 0.09,
        delayChildren: 0.05,
      },
    },
  }

  const item = {
    hidden: {
      opacity: reduce ? 1 : 0,
      y: reduce ? 0 : 18,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <div className="home-page">

      {/* Hero */}
      <section className="hp-hero">
        <div className="hp-container hp-hero-grid">

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="hp-hero-copy"
          >
            <motion.h1 variants={item} className="hp-h1">
              Know what’s real.
              <br />
              Prove it.
            </motion.h1>

            <motion.p variants={item} className="hp-lead">
              Forensic-grade detection for images, audio, and video,
              with explainable evidence behind every verdict.
              Built for journalists, investigators, and legal teams.
            </motion.p>

            <motion.div variants={item} className="hp-actions">
              <Link to="/register" className="hp-btn hp-btn-primary">
                Start verifying
                <ArrowRight size={16} aria-hidden="true" />
              </Link>

              <Link to="/about" className="hp-btn hp-btn-ghost">
                Learn more
              </Link>
            </motion.div>

            <motion.ul variants={item} className="hp-trust">
              {trust.map(({ icon: Icon, label }) => (
                <li key={label}>
                  <Icon size={15} aria-hidden="true" />
                  {label}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          {/* 3D Forensic Specimen */}
          <motion.div
            className="hp-stage"
            initial={{
              opacity: 0,
              scale: reduce ? 1 : 0.94,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 1,
              delay: 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div
              className="hp-stage-glow"
              aria-hidden="true"
            />

            <ForensicSpecimen />
          </motion.div>

        </div>
      </section>

      {/* Capabilities */}
      <section className="hp-section" id="capabilities">
        <div className="hp-container">

          <div className="hp-heading">
            <h2 className="hp-h2">
              Three formats, one verdict.
            </h2>

            <p>
              Verify images, audio, and video from a single
              interface, using the same forensic method for each.
            </p>
          </div>

          <div className="hp-cap-grid">
            {capabilities.map(
              ({ icon: Icon, title, text, methods }) => (
                <article className="hp-cap" key={title}>

                  <span className="hp-cap-icon">
                    <Icon size={20} aria-hidden="true" />
                  </span>

                  <h3>{title}</h3>

                  <p>{text}</p>

                  <ul>
                    {methods.map((method) => (
                      <li key={method}>{method}</li>
                    ))}
                  </ul>

                </article>
              )
            )}
          </div>

        </div>
      </section>

      {/* How it works */}
      <section
        className="hp-section hp-section-alt"
        id="how-it-works"
      >
        <div className="hp-container">

          <div className="hp-heading">
            <h2 className="hp-h2">
              Evidence from ingest to report.
            </h2>

            <p>
              Every analysis follows the same structured pipeline.
              No black boxes and no unexplained scores.
            </p>
          </div>

          <ol className="hp-steps">
            {steps.map(({ num, title, text }) => (
              <li className="hp-step" key={num}>
                <span className="hp-step-num">{num}</span>

                <h3>{title}</h3>

                <p>{text}</p>
              </li>
            ))}
          </ol>

        </div>
      </section>
        </div>
  
  )
}
