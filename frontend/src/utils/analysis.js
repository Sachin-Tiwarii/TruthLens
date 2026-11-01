// Converts backend analysis records into the shapes the UI components render.

const VERDICT_LABELS = {
  real: 'Likely authentic',
  fake: 'Potentially synthetic',
  undetermined: 'Inconclusive',
}

const MODEL_LABELS = {
  npr_deepfakedetection: 'NPR (neighboring pixel relationships)',
  universalfakedetect: 'UniversalFakeDetect (CLIP)',
  yermandy_clip_detection: 'CLIP deepfake detector (Yermandy)',
  wavelet_clip_detection: 'Wavelet-CLIP',
  trufor: 'TruFor (edit and splice detection)',
  spsl_deepfake_detection: 'SPSL (face forgery)',
  ucf_deepfake_detection: 'UCF (face forgery)',
  cross_efficient_vit: 'Cross Efficient ViT (video frames)',
  vocoder_artifacts: 'Vocoder artifacts (synthetic voice)',
}

export const verdictLabel = (verdict) => VERDICT_LABELS[verdict] || 'Inconclusive'

export const mediaTypeLabel = (type) =>
  type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Unknown'

export const toPercent = (value) => Math.round((Number(value) || 0) * 100)

export const shortRef = (requestId) =>
  requestId ? `TL-${requestId.slice(0, 8).toUpperCase()}` : ''

export const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : ''

export const formatLongDate = (iso) =>
  iso
    ? new Date(iso).toLocaleString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : ''

const formatUtc = (iso) =>
  iso ? new Date(iso).toISOString().replace('T', ' ').slice(0, 19) + ' UTC' : ''

const formatBytes = (bytes) =>
  bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1024 / 1024).toFixed(2)} MB`

const modelLabel = (key) =>
  MODEL_LABELS[key] ||
  key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

export function normalizeHistoryRecord(record) {
  return {
    id: record.request_id,
    ref: shortRef(record.request_id),
    name: record.media_name || 'Untitled upload',
    type: mediaTypeLabel(record.media_type),
    rawVerdict: record.verdict,
    verdict: verdictLabel(record.verdict),
    confidence: toPercent(record.confidence),
    timestamp: record.timestamp,
    date: formatDate(record.timestamp),
  }
}

const summaryFor = (verdict, type) => {
  const noun = type.toLowerCase()
  if (verdict === 'real') {
    return `The detection models found no strong signs that this ${noun} was AI-generated or manipulated.`
  }
  if (verdict === 'fake') {
    return `The detection models found signals consistent with AI generation or manipulation in this ${noun}.`
  }
  return `The detection models could not reach a clear verdict for this ${noun}.`
}

export function normalizeAnalysisDetail(detail) {
  const full = detail.full_response || {}
  const type = mediaTypeLabel(detail.media_type)

  const entries = Object.entries(full.model_results || {})
  // Models whose service isn't running (optional, not built yet) aren't failures; hide them.
  const skippedCount = entries.filter(([, r]) => r?.unavailable).length
  const models = entries.filter(([, r]) => !r?.unavailable).map(([key, result]) => {
    if (!result || result.error) {
      return { key, name: modelLabel(key), result: 'Could not process this file', score: null }
    }
    return {
      key,
      name: modelLabel(key),
      result: result.prediction === 1 ? 'Synthetic signals found' : 'No strong synthetic signal',
      score: toPercent(result.probability),
    }
  })

  const evidence = []
  const totalVotes = full.base_model_total_votes ?? 0
  if (totalVotes > 0) {
    evidence.push(
      `${full.base_model_fake_votes ?? 0} of ${totalVotes} model${totalVotes === 1 ? '' : 's'} flagged this ${type.toLowerCase()} as likely synthetic.`
    )
  }
  const method = detail.ensemble_method || full.ensemble_method_used
  if (detail.ensemble_score != null) {
    evidence.push(
      `Combined likelihood of synthesis: ${toPercent(detail.ensemble_score)}%${method ? ` (${method} ensemble)` : ''}.`
    )
  }
  models
    .filter((m) => m.score === null)
    .forEach((m) => evidence.push(`${m.name} did not return a result and was excluded.`))
  if (skippedCount > 0) {
    evidence.push(
      `${skippedCount} optional model${skippedCount === 1 ? ' is' : 's are'} not installed and ${skippedCount === 1 ? 'was' : 'were'} skipped.`
    )
  }
  const seconds = detail.inference_time ?? full.total_inference_time_seconds
  if (seconds != null) evidence.push(`Processed in ${Number(seconds).toFixed(1)} s on CPU.`)

  // Real audit data. Older analyses (before hashing was added) have no SHA-256 or size.
  const answered = models.filter((m) => m.score !== null).map((m) => m.name)
  const integrity = [
    { label: 'SHA-256', value: full.media_sha256 || 'Not recorded for this analysis' },
    { label: 'Received at', value: formatUtc(detail.timestamp) },
    full.media_size_bytes != null && { label: 'File size', value: formatBytes(full.media_size_bytes) },
    { label: 'Models run', value: answered.length ? answered.join(', ') : 'None' },
    method && { label: 'Ensemble method', value: method },
    seconds != null && { label: 'Processing time', value: `${Number(seconds).toFixed(1)} s (CPU)` },
    { label: 'Request ID', value: detail.request_id },
  ].filter(Boolean)

  return {
    id: detail.request_id,
    ref: shortRef(detail.request_id),
    name: detail.media_name || 'Untitled upload',
    type,
    rawVerdict: detail.verdict,
    verdict: verdictLabel(detail.verdict),
    confidence: toPercent(detail.confidence),
    summary: summaryFor(detail.verdict, type),
    models,
    evidence,
    integrity,
    date: formatDate(detail.timestamp),
    longDate: formatLongDate(detail.timestamp),
  }
}
