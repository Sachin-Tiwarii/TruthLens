import api from './api'

export const analysisService = {
  analyze: (formData) => api.post('/analysis', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getHistory: () => api.get('/analysis/history'),
  getResult: (id) => api.get(`/analysis/${id}`),
}
