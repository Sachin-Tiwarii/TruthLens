export const verdictTone = (verdict = '') => {
  if (/authentic/i.test(verdict)) return 'ok'
  if (/inconclusive/i.test(verdict)) return 'warn'
  return 'bad'
}

export default function VerdictBadge({ verdict }) {
  const tone = verdictTone(verdict)
  return <span className={`app-badge ${tone}`}>{verdict}</span>
}