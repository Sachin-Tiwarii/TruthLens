export default function ConfidenceScore({ score = 0, label = 'Confidence' }) {
  const value = Math.max(0, Math.min(100, Number(score) || 0))

  return (
    <div className="confidence-wrap">
      <div className="confidence-top">
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>
      <div
        className="confidence-track"
        role="progressbar"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span style={{ width: `${value}%` }} />
      </div>
      <small>An estimate, not a guarantee.</small>
    </div>
  )
}