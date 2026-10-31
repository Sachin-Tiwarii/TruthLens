export const verdictTone = (verdict = '') => {
  if (/authentic/i.test(verdict)) return 'ok'
  if (/inconclusive/i.test(verdict)) return 'warn'
  return 'bad'
}

export default function VerdictBadge({ verdict }) {
  return <span className={`badge ${verdictTone(verdict)}`}>{verdict}</span>
}