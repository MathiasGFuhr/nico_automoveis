import { useState, useCallback } from 'react'

interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number // Time to live in milliseconds
}

interface UseCacheReturn {
  get: <T>(key: string) => T | null
  set: <T>(key: string, data: T, ttl?: number) => void
  clear: (key?: string) => void
  has: (key: string) => boolean
  isExpired: (key: string) => boolean
}

// Classe de cache global para uso em serviços
class GlobalCache {
  private cache = new Map<string, CacheItem<any>>()

  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() > item.timestamp + item.ttl) {
      // Item expirado, remover do cache
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl
    }
    this.cache.set(key, item)
  }

  clear(key?: string): void {
    if (key) {
      this.cache.delete(key)
    } else {
      this.cache.clear()
    }
  }

  has(key: string): boolean {
    const item = this.cache.get(key)
    if (!item) return false
    return Date.now() <= item.timestamp + item.ttl
  }

  isExpired(key: string): boolean {
    const item = this.cache.get(key)
    if (!item) return true
    return Date.now() > item.timestamp + item.ttl
  }
}

// Instância global do cache
export const cache = new GlobalCache()

export function useCache(): UseCacheReturn {
  const [cache, setCache] = useState<Map<string, CacheItem<any>>>(new Map())

  const get = useCallback(<T>(key: string): T | null => {
    const item = cache.get(key)
    if (!item) return null

    if (Date.now() > item.timestamp + item.ttl) {
      // Item expirado, remover do cache
      setCache(prev => {
        const newCache = new Map(prev)
        newCache.delete(key)
        return newCache
      })
      return null
    }

    return item.data
  }, [cache])

  const set = useCallback(<T>(key: string, data: T, ttl: number = 5 * 60 * 1000) => { // 5 minutos por padrão
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl
    }

    setCache(prev => new Map(prev).set(key, item))
  }, [])

  const clear = useCallback((key?: string) => {
    if (key) {
      setCache(prev => {
        const newCache = new Map(prev)
        newCache.delete(key)
        return newCache
      })
    } else {
      setCache(new Map())
    }
  }, [])

  const has = useCallback((key: string): boolean => {
    return cache.has(key) && !isExpired(key)
  }, [cache])

  const isExpired = useCallback((key: string): boolean => {
    const item = cache.get(key)
    if (!item) return true
    return Date.now() > item.timestamp + item.ttl
  }, [cache])

  return {
    get,
    set,
    clear,
    has,
    isExpired
  }
}