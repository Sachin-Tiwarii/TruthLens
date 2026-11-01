import { useEffect } from 'react'
import { useAnalysisStore } from '../store/analysisStore'

// Reads one analysis from the store's result cache, fetching it if needed.
export function useAnalysisResult(id) {
  const entry = useAnalysisStore((s) => s.results[id])
  const fetchResult = useAnalysisStore((s) => s.fetchResult)

  useEffect(() => {
    fetchResult(id)
  }, [id, fetchResult])

  return {
    result: entry?.status === 'success' ? entry.data : null,
    loading: !entry || entry.status === 'loading',
    error: entry?.status === 'error' ? entry.error : '',
  }
}
