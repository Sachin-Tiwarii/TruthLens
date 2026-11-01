import api from './api'

// Models run on CPU and load on first use, so a single analysis can take minutes
// (videos especially). Matches the backend's default_api_timeout_seconds (1200 s).
const ANALYSIS_TIMEOUT_MS = 20 * 60 * 1000

export const analysisService = {
  analyze: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/detect', formData, { timeout: ANALYSIS_TIMEOUT_MS })
  },
  getHistory: (params = {}) => api.get('/history', { params: { limit: 500, ...params } }),
  getResult: (id) => api.get(`/history/${encodeURIComponent(id)}`),
}
