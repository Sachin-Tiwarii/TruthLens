
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Image,
  AudioLines,
  Video,
  ShieldCheck,
  ScanLine,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const capabilities = [
  {
    icon: Image,
    title: 'Images',
    text: 'Spot generated or manipulated visuals.',
  },
  {
    icon: AudioLines,
    title: 'Audio',
    text: 'Detect synthetic or altered speech.',
  },
  {
    icon: Video,
    title: 'Video',
    text: 'Find signs of manipulation across frames.',
  },
]

const steps = [
  ['01', 'Upload', 'Add an image, audio clip or video.'],
  ['02', 'Analyze', 'Multiple models check for synthetic signals.'],
  ['03', 'Review', 'Get a verdict, confidence score and evidence.'],
]

function VerificationVisual() {
  return (
    <div className="prism-visual">
      <div className="prism-scene">

        {/* Ambient orbit rings */}
        <motion.div
          className="prism-orbit prism-orbit-one"
          animate={{ rotate: 360 }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        <motion.div
          className="prism-orbit prism-orbit-two"
          animate={{ rotate: -360 }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Main rotating 3D structure */}
        <motion.div
          className="prism-rotator"
          animate={{
            rotateY: [0, 360],
            rotateX: [-12, 12, -12],
            y: [0, -12, 0],
          }}
          transition={{
            rotateY: {
              duration: 24,
              repeat: Infinity,
              ease: 'linear',
            },
            rotateX: {
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            },
            y: {
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
        >
          <div className="prism-cube">

            <div className="prism-face prism-front" />
            <div className="prism-face prism-back" />
            <div className="prism-face prism-left" />
            <div className="prism-face prism-right" />
            <div className="prism-face prism-top" />
            <div className="prism-face prism-bottom" />

            {/* Inner geometric frame */}
            <div className="prism-inner-frame" />

          </div>
        </motion.div>

        {/* Floating center shield */}
        <motion.div
          className="prism-center"
          animate={{
            y: [0, -9, 0],
            scale: [1, 1.04, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="prism-shield">
            <ShieldCheck size={62} strokeWidth={1.15} />
          </div>
        </motion.div>

        {/* Scanning beam */}
        <motion.div
          className="prism-scan"
          animate={{
            y: ['-130px', '130px', '-130px'],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Small floating particles */}
        <motion.span
          className="prism-particle particle-one"
          animate={{ y: [0, -20, 0], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        <motion.span
          className="prism-particle particle-two"
          animate={{ y: [0, 18, 0], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        <motion.span
          className="prism-particle particle-three"
          animate={{ y: [0, -14, 0], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 3.5, repeat: Infinity }}
        />

        <div className="prism-ground" />

      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div className="home-page">

      {/* HERO */}
      <section className="hero-section">
        <div className="container hero-grid">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="hero-eyebrow">
              <ShieldCheck size={15} />
              AI-POWERED MEDIA VERIFICATION
            </span>

            <h1 className="heading-xl hero-title">
              Verify what's real in a world of synthetic media.
            </h1>

            <p className="hero-copy">
              AI-powered detection for images, audio and video,
              with clear evidence behind every result.
            </p>

            <div className="hero-actions">
              <Link to="/about" className="text-link">
                Learn more
              </Link>
            </div>

            <div className="hero-trust">
              <span>
                <ShieldCheck size={15} />
                Explainable results
              </span>

              <span>
                <ScanLine size={15} />
                Digital forensics
              </span>
            </div>
          </motion.div>

          {/* New 3D animation */}
          <motion.div
            className="hero-visual-wrapper"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <VerificationVisual />
          </motion.div>

        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="section" id="capabilities">
        <div className="container">

          <div className="section-heading">
            <h2 className="heading-lg">
              One workspace, three formats.
            </h2>
          </div>

          <div className="grid-3 capability-grid">
            {capabilities.map(({ icon: Icon, title, text }) => (
              <article className="capability-card" key={title}>
                <span className="capability-icon">
                  <Icon size={21} />
                </span>

                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>

        </div>
      </section>

            {/* HOW IT WORKS */}
      <section className="section section-soft" id="how-it-works">
        <div className="container">

          <div className="section-heading">
            <h2 className="heading-lg">How it works</h2>
          </div>

          <div className="steps-grid">
            {steps.map(([number, title, text]) => (
              <article className="step-card" key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>

        </div>
      </section>

    </div>
  )
}