import { motion } from 'framer-motion'
import { LoaderCircle, ScanLine } from 'lucide-react'

const stages = [
  'Ingesting media…',
  'Extracting features…',
  'Running model analysis…',
  'Fusing evidence…',
  'Generating report…',
]

export default function LoadingAnimation({
  label = 'Analyzing media',
  hint  = 'This usually takes a few seconds.',
}) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
      >
        <LoaderCircle size={30} />
      </motion.div>

      <strong>{label}</strong>

      {hint && (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
          {hint}
        </span>
      )}

      {/* Pipeline stages */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8, alignItems: 'center' }}>
        {stages.map((stage, i) => (
          <motion.div
            key={stage}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              color: 'var(--muted)', fontSize: 12,
              fontFamily: 'var(--font-mono)',
            }}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: [0, 1, 0.4] }}
            transition={{
              delay: i * 0.45,
              duration: 0.9,
              repeat: Infinity,
              repeatDelay: stages.length * 0.45 - 0.9,
              ease: 'easeInOut',
            }}
          >
            <ScanLine size={11} />
            {stage}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
