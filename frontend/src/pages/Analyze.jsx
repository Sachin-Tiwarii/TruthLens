import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, AlertCircle, Image, AudioLines, Video, Lock } from 'lucide-react'
import UploadZone from '../components/UploadZone'
import './app.css'

const getType = (file) => {
  if (file.type.startsWith('image/')) return 'Image'
  if (file.type.startsWith('audio/')) return 'Audio'
  return 'Video'
}

const steps = [
  { n: '01', title: 'Upload', text: 'Your file is hashed on receipt to protect chain of custody.' },
  { n: '02', title: 'Analysis', text: 'Several forensic models run in parallel against the media.' },
  { n: '03', title: 'Report', text: 'You get a verdict, a confidence score, the evidence behind it, and integrity metadata.' },
]

const formats = [
  { icon: Image, label: 'Images', types: 'JPG, PNG, WEBP' },
  { icon: AudioLines, label: 'Audio', types: 'MP3, WAV, M4A' },
  { icon: Video, label: 'Video', types: 'MP4, MOV, WEBM' },
]

export default function Analyze() {
  const [file, setFile] = useState(null)
  const [purpose, setPurpose] = useState('General verification')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!file) { setError('Please upload a file before continuing.'); return }
    try {
      sessionStorage.setItem('truthlens_upload', JSON.stringify({
        name: file.name, type: getType(file), size: file.size,
        purpose, uploadedAt: new Date().toISOString(),
      }))
    } catch {
      setError('Unable to prepare your file. Please try again.'); return
    }
    navigate('/results/new')
  }

  return (
    <div>
      <header className="app-head">
        <h1>Analyze media</h1>
        <p>Submit an image, audio clip, or video for forensic analysis.</p>
      </header>

      <form className="app-analyze" onSubmit={handleSubmit}>
        <section className="app-panel app-analyze-main">
          <h2 className="app-h2">Upload media</h2>
          <p className="app-sub">Drag a file into the box or click to browse.</p>

          <UploadZone onFile={setFile} onError={setError} />

          {error && (
            <div className="app-error" role="alert">
              <AlertCircle size={16} aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <div className="app-field">
            <label htmlFor="purpose">Analysis purpose</label>
            <select id="purpose" className="app-input" value={purpose} onChange={(e) => setPurpose(e.target.value)}>
              <option>General verification</option>
              <option>Check for AI-generated content</option>
              <option>Check for possible manipulation</option>
              <option>Legal / editorial review</option>
            </select>
          </div>

          <div className="app-submit-row">
            <p className="app-secure">
              <Lock size={13} aria-hidden="true" /> Media is processed securely and not stored after analysis.
            </p>
            <button type="submit" className="app-btn" disabled={!file}>
              Run analysis <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </section>

        <aside className="app-analyze-aside">
          <section className="app-panel">
            <h2 className="app-h2">What happens next</h2>
            <ol className="app-steps">
              {steps.map(({ n, title, text }) => (
                <li key={n}>
                  <span className="app-step-n">{n}</span>
                  <div>
                    <strong>{title}</strong>
                    <p>{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="app-panel app-formats">
            <h2 className="app-h2">Supported formats</h2>
            <ul>
              {formats.map(({ icon: Icon, label, types }) => (
                <li key={label}>
                  <Icon size={15} aria-hidden="true" />
                  <span>{label}</span>
                  <code>{types}</code>
                </li>
              ))}
            </ul>
          </section>

          <p className="app-fine">
            Results are probabilistic estimates and should support human review, not replace it.
          </p>
        </aside>
      </form>
    </div>
  )
}