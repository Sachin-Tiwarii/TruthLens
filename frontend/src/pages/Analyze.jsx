import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, AlertCircle, Image, AudioLines, Video } from 'lucide-react'
import UploadZone from '../components/UploadZone'
import LoadingAnimation from '../components/LoadingAnimation'
import { useAnalysisStore } from '../store/analysisStore'

const steps = [
  ['01', 'Upload', 'Add your image, audio or video.'],
  ['02', 'Analysis', 'Multiple models check for synthetic signals.'],
  ['03', 'Report', 'Review the verdict, confidence and evidence.'],
]

export default function Analyze() {
  const [file, setFile] = useState(null)
  const [purpose, setPurpose] = useState('General verification')
  const [fileError, setFileError] = useState('')
  const navigate = useNavigate()
  const mounted = useRef(true)

  const analyze = useAnalysisStore((s) => s.analyze)
  const uploading = useAnalysisStore((s) => s.uploadStatus === 'uploading')
  const uploadFileName = useAnalysisStore((s) => s.uploadFileName)
  const uploadError = useAnalysisStore((s) => s.uploadError)
  const clearUploadError = useAnalysisStore((s) => s.clearUploadError)

  useEffect(() => {
    mounted.current = true
    clearUploadError() // don't show an error left over from an earlier visit
    return () => {
      mounted.current = false
    }
  }, [])

  const error = fileError || uploadError

  const handleFile = (next) => {
    setFile(next)
    clearUploadError()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      setFileError('Please upload a file before continuing.')
      return
    }
    setFileError('')
    const requestId = await analyze(file)
    // If the user left the page meanwhile, the result is still saved in their history.
    if (requestId && mounted.current) navigate(`/results/${requestId}`)
  }

  if (uploading) {
    return (
      <div className="analyze-page">
        <div className="card">
          <LoadingAnimation
            label={`Analyzing ${uploadFileName || 'media'}`}
            hint="Models run on CPU and load on first use, so this can take a few minutes. Videos take longer."
          />
        </div>
      </div>
    )
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
          <UploadZone value={file} onFile={handleFile} onError={setFileError} />

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
              <span><AudioLines size={15} /> MP3, WAV, M4A, FLAC, OGG</span>
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