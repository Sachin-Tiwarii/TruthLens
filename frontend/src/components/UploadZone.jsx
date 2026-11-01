import { useRef, useState } from 'react'
import { UploadCloud, FileImage, FileAudio, FileVideo, X } from 'lucide-react'

const ACCEPT  = '.png,.jpg,.jpeg,.webp,.mp3,.wav,.m4a,.flac,.ogg,.mp4,.mov,.webm'
const ALLOWED = /\.(png|jpe?g|webp|mp3|wav|m4a|flac|ogg|mp4|mov|webm)$/i

const formatSize = (bytes) =>
  bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} KB`
    : `${(bytes / 1024 / 1024).toFixed(2)} MB`

export default function UploadZone({ value = null, onFile, onError, maxSizeMB = 100 }) {
  const inputRef = useRef(null)
  const [file,     setFile]     = useState(value)
  const [dragging, setDragging] = useState(false)

  const choose = (next) => {
    if (!next) return
    if (!ALLOWED.test(next.name)) {
      onError?.('Unsupported file type. Please choose an image, audio, or video file.')
      return
    }
    if (next.size > maxSizeMB * 1024 * 1024) {
      onError?.(`File exceeds ${maxSizeMB} MB limit. Please choose a smaller file.`)
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

  const FileIcon = !file
    ? UploadCloud
    : file.type.startsWith('image/') ? FileImage
    : file.type.startsWith('audio/') ? FileAudio
    : FileVideo

  if (file) {
    return (
      <div className={`upload-zone ${dragging ? 'dragging' : ''}`}
        onDragOver={(e)  => { e.preventDefault(); setDragging(true) }}
        onDragLeave={()  => setDragging(false)}
        onDrop={(e)      => { e.preventDefault(); setDragging(false); choose(e.dataTransfer.files?.[0]) }}
      >
        <input ref={inputRef} type="file" accept={ACCEPT} hidden onChange={(e) => choose(e.target.files?.[0])} />
        <div className="selected-file">
          <div className="selected-file-icon"><FileIcon size={20} /></div>
          <div className="selected-file-info">
            <strong>{file.name}</strong>
            <span>{formatSize(file.size)} · Ready for analysis</span>
          </div>
          <button className="remove-file" type="button" onClick={clear} aria-label="Remove file">
            <X size={15} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`upload-zone ${dragging ? 'dragging' : ''}`}
      role="button"
      tabIndex={0}
      aria-label="Upload media file"
      onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      onDragOver={(e)  => { e.preventDefault(); setDragging(true) }}
      onDragLeave={()  => setDragging(false)}
      onDrop={(e)      => { e.preventDefault(); setDragging(false); choose(e.dataTransfer.files?.[0]) }}
      onClick={()      => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        hidden
        onChange={(e) => choose(e.target.files?.[0])}
      />

      <div className="upload-icon">
        <UploadCloud size={24} />
      </div>
      <strong>Drop media here</strong>
      <span>or click to browse</span>
      <small>Image, audio or video · up to {maxSizeMB} MB</small>
    </div>
  )
}