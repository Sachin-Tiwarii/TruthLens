import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, AlertCircle, Image, AudioLines, Video } from 'lucide-react'
import UploadZone from '../components/UploadZone'

const getType = (file) => {
  if (file.type.startsWith('image/')) return 'Image'
  if (file.type.startsWith('audio/')) return 'Audio'
  return 'Video'
}

const steps = [
  ['01', 'Upload', 'Add your image, audio or video.'],
  ['02', 'Analysis', 'Multiple models check for synthetic signals.'],
  ['03', 'Report', 'Review the verdict, confidence and evidence.'],
]

export default function Analyze() {
  const [file, setFile] = useState(null)
  const [purpose, setPurpose] = useState('General verification')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!file) {
      setError('Please upload a file before continuing.')
      return
    }
    try {
      sessionStorage.setItem(
        'truthlens_upload',
        JSON.stringify({
          name: file.name,
          type: getType(file),
          size: file.size,
          purpose,
          uploadedAt: new Date().toISOString(),
        })
      )
    } catch {
      setError('Unable to prepare your file. Please try again.')
      return
    }
    navigate('/results/new')
  }

  return (
    <div className="analyze-page">
      <div className="dashboard-heading">
        <div>
          <h1 className="heading-lg">Analyze media</h1>
          <p className="body-copy">Check an image, audio clip or video for AI generation or manipulation.</p>
        </div>
      </div>

      <form className="analyze-layout" onSubmit={handleSubmit}>
        <div className="analyze-main card">
          <UploadZone onFile={setFile} onError={setError} />

          {error && (
            <div className="analyze-error" role="alert">
              <AlertCircle size={17} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-field purpose-field">
            <label htmlFor="purpose">What would you like to check?</label>
            <select
              id="purpose"
              className="input"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            >
              <option>General verification</option>
              <option>Check for AI-generated content</option>
              <option>Check for possible manipulation</option>
            </select>
          </div>

          <div className="analyze-submit-row">
            <button type="submit" className="btn" disabled={!file}>
              Continue <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <aside className="analyze-aside">
          <div className="card analyze-info-card">
            <h3>What happens next</h3>
            {steps.map(([n, title, text]) => (
              <div className="analysis-step" key={n}>
                <span>{n}</span>
                <div>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="supported-formats">
            <strong>Supported media</strong>
            <div>
              <span><Image size={15} /> JPG, PNG, WEBP</span>
              <span><AudioLines size={15} /> MP3, WAV, M4A</span>
              <span><Video size={15} /> MP4, MOV, WEBM</span>
            </div>
          </div>

          <p className="small-disclaimer">
            Results are estimates and should support human review, not replace it.
          </p>
        </aside>
      </form>
    </div>
  )
}