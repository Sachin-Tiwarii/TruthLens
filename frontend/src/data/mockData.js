// Mock data for demo/preview mode
export const sampleAnalyses = [
  {
    id: 'TL-001',
    name: 'press-photo-01.jpg',
    type: 'Image',
    date: 'Oct 31, 2026',
    verdict: 'Likely authentic',
    confidence: 91,
  },
  {
    id: 'TL-002',
    name: 'audio-clip-interview.mp3',
    type: 'Audio',
    date: 'Oct 30, 2026',
    verdict: 'Synthetic speech detected',
    confidence: 87,
  },
  {
    id: 'TL-003',
    name: 'campaign-video.mp4',
    type: 'Video',
    date: 'Oct 29, 2026',
    verdict: 'Likely authentic',
    confidence: 76,
  },
  {
    id: 'TL-004',
    name: 'headshot-suspect.png',
    type: 'Image',
    date: 'Oct 28, 2026',
    verdict: 'AI-generated image',
    confidence: 95,
  },
  {
    id: 'TL-005',
    name: 'voicemail-evidence.wav',
    type: 'Audio',
    date: 'Oct 27, 2026',
    verdict: 'Inconclusive',
    confidence: 54,
  },
  {
    id: 'TL-006',
    name: 'news-clip-edit.webm',
    type: 'Video',
    date: 'Oct 26, 2026',
    verdict: 'Manipulation detected',
    confidence: 83,
  },
]

export const demoResult = {
  id: 'TL-DEMO',
  name: 'sample-media-file.jpg',
  type: 'Image',
  date: 'Oct 31, 2026',
  verdict: 'Likely authentic',
  confidence: 91,
  summary:
    'Analysis across three detection models found no conclusive evidence of AI generation or post-processing manipulation. Minor compression artefacts are consistent with standard JPEG encoding.',
  models: [
    { name: 'GAN Detector',        result: 'No GAN signature found',              score: 8  },
    { name: 'ELA Analysis',        result: 'Error-level distribution normal',       score: 12 },
    { name: 'Metadata Integrity',  result: 'EXIF chain intact',                    score: 5  },
    { name: 'Noise Fingerprint',   result: 'Camera noise consistent',              score: 14 },
    { name: 'Semantic Coherence',  result: 'Scene elements are spatially coherent', score: 9  },
  ],
  evidence: [
    'EXIF metadata shows Canon EOS 5D Mark IV, f/2.8, 1/200s, ISO 400.',
    'Error-level analysis shows uniform compression consistent with single-save JPEG.',
    'Noise pattern matches typical CMOS sensor pattern for stated ISO.',
    'No frequency-domain artefacts characteristic of GAN generation detected.',
    'Color histogram distribution within natural image baseline bounds.',
    'Facial geometry (if present) shows no neural blending or region splicing.',
  ],
}
