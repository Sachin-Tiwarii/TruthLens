import { useEffect } from 'react'
import { useAnalysisStore } from '../store/analysisStore'

// Reads the signed-in user's history from the store, loading it on first use.
// Records already in the store stay visible while a refresh is in flight.
export function useAnalysisHistory() {
  const records = useAnalysisStore((s) => s.history)
  const status = useAnalysisStore((s) => s.historyStatus)
  const error = useAnalysisStore((s) => s.historyError)
  const fetchHistory = useAnalysisStore((s) => s.fetchHistory)

  // On mount: load, or retry a previous failure.
  useEffect(() => {
    if (useAnalysisStore.getState().historyStatus === 'error') fetchHistory()
  }, [fetchHistory])

  // Whenever the store marks history as out of date (first visit, new analysis, new user).
  useEffect(() => {
    if (status === 'idle') fetchHistory()
  }, [status, fetchHistory])

  return {
    records,
    loading: records.length === 0 && (status === 'idle' || status === 'loading'),
    error: status === 'error' ? error : '',
  }
}
