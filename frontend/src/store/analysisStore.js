import { create } from 'zustand'
import { analysisService } from '../services/analysisService'
import { getErrorMessage } from '../services/api'
import { normalizeAnalysisDetail, normalizeHistoryRecord } from '../utils/analysis'

// status values: 'idle' | 'loading' | 'success' | 'error'
const initialState = {
  history: [],
  historyStatus: 'idle',
  historyError: '',
  // Result details cached by request id: { [id]: { status, data, error } }
  results: {},
  uploadStatus: 'idle', // 'idle' | 'uploading' | 'error'
  uploadError: '',
  uploadFileName: '',
}

export const useAnalysisStore = create((set, get) => ({
  ...initialState,

  fetchHistory: async ({ force = false } = {}) => {
    const { historyStatus } = get()
    if (historyStatus === 'loading') return
    if (historyStatus === 'success' && !force) return
    set({ historyStatus: 'loading', historyError: '' })
    try {
      const { data } = await analysisService.getHistory()
      set({ history: (data.records || []).map(normalizeHistoryRecord), historyStatus: 'success' })
    } catch (err) {
      set({
        historyStatus: 'error',
        historyError: getErrorMessage(err, 'Unable to load your analyses.'),
      })
    }
  },

  fetchResult: async (id) => {
    const cached = get().results[id]
    if (cached?.status === 'loading' || cached?.status === 'success') return
    const setResult = (entry) => set((state) => ({ results: { ...state.results, [id]: entry } }))

    setResult({ status: 'loading', data: null, error: '' })
    try {
      const { data } = await analysisService.getResult(id)
      setResult({ status: 'success', data: normalizeAnalysisDetail(data), error: '' })
    } catch (err) {
      setResult({
        status: 'error',
        data: null,
        error:
          err.response?.status === 404
            ? 'This analysis could not be found.'
            : getErrorMessage(err, 'Unable to load this analysis.'),
      })
    }
  },

  // Uploads a file for analysis. Resolves to the new request id, or null on failure
  // (the message is then in uploadError).
  analyze: async (file) => {
    if (get().uploadStatus === 'uploading') return null
    set({ uploadStatus: 'uploading', uploadError: '', uploadFileName: file.name })
    try {
      const { data } = await analysisService.analyze(file)
      // History is now out of date; the next screen that needs it refetches.
      set({ uploadStatus: 'idle', uploadFileName: '', historyStatus: 'idle' })
      return data.request_id
    } catch (err) {
      set({
        uploadStatus: 'error',
        uploadFileName: '',
        uploadError: getErrorMessage(err, 'The analysis failed. Please try again.'),
      })
      return null
    }
  },

  clearUploadError: () => {
    if (get().uploadStatus === 'error') set({ uploadStatus: 'idle', uploadError: '' })
  },

  // Called on sign-in/sign-out so one user's analyses never show for another.
  reset: () => set(initialState),
}))
