import { useRef, useState } from 'react'
import { UploadCloud, FileImage, FileAudio, FileVideo, X } from 'lucide-react'

const ACCEPT = '.png,.jpg,.jpeg,.webp,.mp3,.wav,.m4a,.mp4,.mov,.webm'
const ALLOWED = /\.(png|jpe?g|webp|mp3|wav|m4a|mp4|mov|webm)$/i

const formatSize = (bytes) =>
  bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1024 / 1024).toFixed(2)} MB`

export default function UploadZone({ value = null, onFile, onError, maxSizeMB = 100 }) {
  const inputRef = useRef(null)
  const [file, setFile] = useState(value)
  const [dragging, setDragging] = useState(false)

  const choose = (next) => {
    if (!next) return
    if (!ALLOWED.test(next.name)) {
      onError?.('Unsupported file type. Please choose an image, audio, or video file.')
      return
    }
    if (next.size > maxSizeMB * 1024 * 1024) {
      onError?.(`File exceeds the ${maxSizeMB} MB limit. Please choose a smaller file.`)
      return
    }
    onError?.('')
    setFile(next)
    onFile?.(next)
  }

  const clear = () => {
    setFile(null)
    onError?.('')
    onFile?.(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const dropProps = {
    onDragOver: (e) => { e.preventDefault(); setDragging(true) },
    onDragLeave: () => setDragging(false),
    onDrop: (e) => { e.preventDefault(); setDragging(false); choose(e.dataTransfer.files?.[0]) },
  }

  const input = (
    <input ref={inputRef} type="file" accept={ACCEPT} hidden onChange={(e) => choose(e.target.files?.[0])} />
  )

  if (file) {
    const FileIcon = file.type.startsWith('image/') ? FileImage : file.type.startsWith('audio/') ? FileAudio : FileVideo
    return (
      <div className={`app-drop has-file${dragging ? ' dragging' : ''}`} {...dropProps}>
        {input}
        <div className="app-file">
          <span className="app-file-icon"><FileIcon size={20} aria-hidden="true" /></span>
          <div className="app-file-info">
            <strong>{file.name}</strong>
            <span>{formatSize(file.size)} · Ready for analysis</span>
          </div>
          <button className="app-icon-btn" type="button" onClick={clear} aria-label="Remove file">
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`app-drop${dragging ? ' dragging' : ''}`}
      role="button"
      tabIndex={0}
      aria-label="Upload media file"
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click() }
      }}
      {...dropProps}
    >
      {input}
      <span className="app-drop-icon"><UploadCloud size={24} aria-hidden="true" /></span>
      <strong>Drop media here</strong>
      <span>or click to browse</span>
      <small>Image, audio, or video, up to {maxSizeMB} MB</small>
    </div>
  )
}