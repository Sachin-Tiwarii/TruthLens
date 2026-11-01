import { useEffect, useState } from 'react'
import { Check, Loader2 } from 'lucide-react'

const stages = [
  'Hashing the file for chain of custody',
  'Running forensic models in parallel',
  'Fusing results and building your report',
]

export default function LoadingAnimation() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const a = setTimeout(() => setActive(1), 700)
    const b = setTimeout(() => setActive(2), 1450)
    return () => { clearTimeout(a); clearTimeout(b) }
  }, [])

  return (
    <div className="app-loading" role="status" aria-live="polite">
      <div className="app-scan" aria-hidden="true"><i /></div>
      <h2>Analyzing your file</h2>
      <ul>
        {stages.map((s, i) => (
          <li key={s} className={i < active ? 'done' : i === active ? 'now' : ''}>
            {i < active ? <Check size={15} aria-hidden="true" /> : i === active ? <Loader2 size={15} className="app-spin" aria-hidden="true" /> : <span className="app-dot" />}
            {s}
          </li>
        ))}
      </ul>
    </div>
  )
}