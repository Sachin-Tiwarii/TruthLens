/**
 * TruthLens mark: a lens ring broken at the upper right, where an amber
 * anomaly marker sits (the same amber markers the Home page specimen uses).
 * Stroke follows currentColor so it works on dark chrome and on the paper report.
 */
export default function BrandMark({ size = 26, className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M20.457 8.922A9 9 0 1 1 15.078 3.543"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="1.9" />
      <circle cx="18.364" cy="5.636" r="2.1" fill="#f2a93b" />
    </svg>
  )
}
