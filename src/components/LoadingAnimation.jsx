import { LoaderCircle } from 'lucide-react'

export default function LoadingAnimation({ label = 'Analyzing media' }) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <LoaderCircle className="spin" size={28} />
      <strong>{label}</strong>
      <span>This usually takes a few seconds.</span>
    </div>
  )
}