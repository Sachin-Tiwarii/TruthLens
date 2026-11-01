import { LoaderCircle } from 'lucide-react'

export default function LoadingAnimation({
  label = 'Analyzing media',
  hint = 'This usually takes a few seconds.',
}) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <LoaderCircle className="spin" size={28} />
      <strong>{label}</strong>
      {hint && <span>{hint}</span>}
    </div>
  )
}
