import { useRef, useState } from 'react'
import { UploadCloud, FileImage, FileAudio, FileVideo, X } from 'lucide-react'

const ACCEPT = '.png,.jpg,.jpeg,.webp,.mp3,.wav,.m4a,.flac,.ogg,.mp4,.mov,.webm'
const ALLOWED = /\.(png|jpe?g|webp|mp3|wav|m4a|flac|ogg|mp4|mov|webm)$/i

const formatSize = (bytes) =>
  bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} KB`
    : `${(bytes / 1024 / 1024).toFixed(2)} MB`

export default function UploadZone({ value = null, onFile, onError, maxSizeMB = 100 }) {
  const inputRef = useRef(null)
  const [file, setFile] = useState(value)
  const [dragging, setDragging] = useState(false)

  const choose = (next) => {
    if (!next) return
    if (!ALLOWED.test(next.name)) {
      onError?.('Unsupported file. Please choose an image, audio or video file.')
      return
    }
    if (next.size > maxSizeMB * 1024 * 1024) {
      onError?.(`File is larger than ${maxSizeMB} MB. Please choose a smaller file.`)
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

  const Icon = !file
    ? UploadCloud
    : file.type.startsWith('image/')
      ? FileImage
      : file.type.startsWith('audio/')
        ? FileAudio
        : FileVideo

  return (
    <div
      className={`upload-zone ${dragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        choose(e.dataTransfer.files?.[0])
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        hidden
        onChange={(e) => choose(e.target.files?.[0])}
      />

      <div className="upload-icon"><Icon size={26} /></div>

      {file ? (
        <>
          <strong>{file.name}</strong>
          <span>{formatSize(file.size)}</span>
          <button className="remove-file" type="button" onClick={clear}>
            <X size={14} /> Remove
          </button>
        </>
      ) : (
        <>
          <strong>Drop media here</strong>
          <span>or</span>
          <button className="btn btn-small" type="button" onClick={() => inputRef.current?.click()}>
            Browse files
          </button>
          <small>Image, audio or video · up to {maxSizeMB} MB</small>
        </>
      )}
    </div>
  )
}