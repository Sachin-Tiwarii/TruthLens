export const sampleAnalyses = [
  { id: 'TL-2048', name: 'campaign_visual_final.png', type: 'Image', date: 'Oct 31, 2026', verdict: 'Likely authentic', confidence: 91, status: 'Completed' },
  { id: 'TL-2047', name: 'voice_note_interview.wav', type: 'Audio', date: 'Oct 30, 2026', verdict: 'Potentially synthetic', confidence: 84, status: 'Completed' },
  { id: 'TL-2046', name: 'event_highlights.mp4', type: 'Video', date: 'Oct 29, 2026', verdict: 'Inconclusive', confidence: 56, status: 'Completed' },
  { id: 'TL-2045', name: 'product_portrait.jpg', type: 'Image', date: 'Oct 27, 2026', verdict: 'Potentially manipulated', confidence: 78, status: 'Completed' },
]

export const demoResult = {
  id: 'TL-2048',
  name: 'campaign_visual_final.png',
  type: 'Image',
  date: 'October 31, 2026',
  verdict: 'Likely authentic',
  confidence: 91,
  summary: 'This image shows signals consistent with natural capture. No strong signs of AI generation were found.',
  models: [
    { name: 'Visual artifacts', result: 'Consistent', score: 94 },
    { name: 'Synthetic patterns', result: 'Low signal', score: 89 },
    { name: 'Metadata', result: 'Partial', score: 90 },
  ],
  evidence: [
    'No generative texture patterns detected.',
    'Lighting and edges look consistent.',
    'Metadata is incomplete and is not proof of origin.',
  ],
}