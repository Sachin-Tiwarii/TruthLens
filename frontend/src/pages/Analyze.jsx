import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, AlertCircle, Image, AudioLines, Video, Lock } from 'lucide-react'
import UploadZone from '../components/UploadZone'

const getType = (file) => {
  if (file.type.startsWith('image/')) return 'Image'
  if (file.type.startsWith('audio/')) return 'Audio'
  return 'Video'
}

const steps = [
  { n: '01', title: 'Upload', text: 'Submit your media. It is hashed on receipt for chain-of-custody integrity.' },
  { n: '02', title: 'Analysis', text: 'Multiple forensic models run in parallel against the media.' },
  { n: '03', title: 'Report', text: 'Receive a verdict with confidence, evidence breakdown, and integrity metadata.' },
]

export default function Analyze() {
  const [file, setFile]       = useState(null)
  const [purpose, setPurpose] = useState('General verification')
  const [error, setError]     = useState('')
  const navigate               = useNavigate()

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
      <div className="page-header">
        <h1 className="heading-lg">Analyze Media</h1>
        <p className="body-copy">Submit an image, audio clip, or video for forensic analysis.</p>
      </div>

      <form className="analyze-layout" onSubmit={handleSubmit}>
        <div className="analyze-main card">
          <div className="analyze-section-heading">
            <h2>Upload media</h2>
            <p>Drag and drop or click to browse. Supported: JPG, PNG, WEBP, MP3, WAV, M4A, MP4, MOV, WEBM.</p>
          </div>

          <UploadZone onFile={setFile} onError={setError} />

          {error && (
            <div className="analyze-error" role="alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-field purpose-field">
            <label htmlFor="purpose">Analysis purpose</label>
            <select
              id="purpose"
              className="input"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            >
              <option>General verification</option>
              <option>Check for AI-generated content</option>
              <option>Check for possible manipulation</option>
              <option>Legal / editorial review</option>
            </select>
          </div>

          <div className="analyze-submit-row">
            <div className="upload-security">
              <Lock size={13} />
              <span>Media processed securely — not stored after analysis</span>
            </div>
            <button type="submit" className="btn" disabled={!file}>
              Run analysis <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <aside className="analyze-aside">
          <div className="card analyze-info-card">
            <h3>What happens next</h3>
            {steps.map(({ n, title, text }) => (
              <div className="analysis-step" key={n}>
                <span className="step-num-badge">{n}</span>
                <div>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="supported-formats">
            <strong>Supported formats</strong>
            <div>
              <span><Image size={14} /> JPG, PNG, WEBP</span>
              <span><AudioLines size={14} /> MP3, WAV, M4A</span>
              <span><Video size={14} /> MP4, MOV, WEBM</span>
            </div>
          </div>

          <p className="small-disclaimer">
            Results are probabilistic estimates and should support human review, not replace it.
          </p>
        </aside>
      </form>
    </div>
  )
}