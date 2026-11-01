import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, AlertCircle, Image, AudioLines, Video, Lock } from 'lucide-react'
import UploadZone from '../components/UploadZone'
import LoadingAnimation from '../components/LoadingAnimation'
import { useAnalysisStore } from '../store/analysisStore'

const steps = [
  { n: '01', title: 'Upload', text: 'Submit your media. Its SHA-256 fingerprint is recorded on receipt so the report is tied to the exact file.' },
  { n: '02', title: 'Analysis', text: 'Every installed forensic model for that media type checks it, and their scores are combined.' },
  { n: '03', title: 'Report', text: 'Receive a verdict with confidence, evidence breakdown, and integrity metadata.' },
]

export default function Analyze() {
  const [file, setFile]           = useState(null)
  const [purpose, setPurpose]     = useState('General verification')
  const [fileError, setFileError] = useState('')
  const navigate                  = useNavigate()
  const mounted                   = useRef(true)

  const analyze          = useAnalysisStore((s) => s.analyze)
  const uploading        = useAnalysisStore((s) => s.uploadStatus === 'uploading')
  const uploadFileName   = useAnalysisStore((s) => s.uploadFileName)
  const uploadError      = useAnalysisStore((s) => s.uploadError)
  const clearUploadError = useAnalysisStore((s) => s.clearUploadError)

  useEffect(() => {
    mounted.current = true
    clearUploadError() // don't show an error left over from an earlier visit
    return () => { mounted.current = false }
  }, [clearUploadError])

  const error = fileError || uploadError

  const handleFile = (next) => {
    setFile(next)
    clearUploadError()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) { setFileError('Please upload a file before continuing.'); return }
    setFileError('')
    const requestId = await analyze(file)
    // If the user left the page meanwhile, the result is still saved in their history.
    if (requestId && mounted.current) navigate(`/results/${requestId}`)
  }

  if (uploading) {
    return (
      <div>
        <div className="page-header">
          <h1 className="heading-lg">Analyze Media</h1>
          <p className="body-copy">Running forensic analysis on {uploadFileName || 'your file'}.</p>
        </div>
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
    <div>
      <div className="page-header">
        <h1 className="heading-lg">Analyze Media</h1>
        <p className="body-copy">Submit an image, audio clip, or video for forensic analysis.</p>
      </div>

      <form className="analyze-layout" onSubmit={handleSubmit}>
        <div className="analyze-main card">
          <div className="analyze-section-heading">
            <h2>Upload media</h2>
            <p>Drag and drop or click to browse. Supported: JPG, PNG, WEBP, MP3, WAV, M4A, FLAC, OGG, MP4, MOV, WEBM.</p>
          </div>

          <UploadZone value={file} onFile={handleFile} onError={setFileError} />

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
              <span><Image size={15} /> JPG, PNG, WEBP</span>
              <span><AudioLines size={15} /> MP3, WAV, M4A, FLAC, OGG</span>
              <span><Video size={15} /> MP4, MOV, WEBM</span>
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
