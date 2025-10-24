import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

export function usePrefetch() {
  const router = useRouter()

  const prefetchPage = useCallback((path: string) => {
    try {
      router.prefetch(path)
    } catch (error) {
      console.warn(`Falha no prefetch para ${path}:`, error)
    }
  }, [router])

  const prefetchMultiple = useCallback((paths: string[]) => {
    paths.forEach(path => prefetchPage(path))
  }, [prefetchPage])

  return {
    prefetchPage,
    prefetchMultiple
  }
}
