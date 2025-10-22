import { useState, useEffect, useCallback } from 'react'

interface CacheEntry<T> {
  data: T
  timestamp: number
}

const cache = new Map<string, CacheEntry<unknown>>()

/**
 * Hook para gerenciar cache de dados
 * 
 * @param key - Chave única para o cache
 * @param fetchFn - Função assíncrona para buscar os dados
 * @param ttl - Time to live em milissegundos (padrão: 5 minutos)
 * @returns Dados cacheados, loading, error e função refetch
 */
export function useCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = 5 * 60 * 1000 // 5 minutos
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true)
      setError(null)

      // Verificar se existe cache válido
      if (!forceRefresh) {
        const cached = cache.get(key) as CacheEntry<T> | undefined
        if (cached && Date.now() - cached.timestamp < ttl) {
          setData(cached.data)
          setLoading(false)
          return cached.data
        }
      }

      // Buscar dados novos
      const freshData = await fetchFn()
      
      // Atualizar cache
      cache.set(key, {
        data: freshData,
        timestamp: Date.now()
      })

      setData(freshData)
      return freshData
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
      throw err
    } finally {
      setLoading(false)
    }
  }, [key, fetchFn, ttl])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refetch = useCallback(() => {
    return fetchData(true)
  }, [fetchData])

  const clearCache = useCallback(() => {
    cache.delete(key)
  }, [key])

  return {
    data,
    loading,
    error,
    refetch,
    clearCache
  }
}

/**
 * Limpa todo o cache
 */
export function clearAllCache() {
  cache.clear()
}

/**
 * Remove entradas antigas do cache
 * @param maxAge - Idade máxima em milissegundos
 */
export function cleanCache(maxAge: number = 60 * 60 * 1000) {
  const now = Date.now()
  const keysToDelete: string[] = []

  cache.forEach((entry, key) => {
    if (now - entry.timestamp > maxAge) {
      keysToDelete.push(key)
    }
  })

  keysToDelete.forEach(key => cache.delete(key))
}

