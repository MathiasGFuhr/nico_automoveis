import { useState, useEffect } from 'react'

/**
 * Hook para debounce de valores
 * 
 * Útil para campos de busca, filtros, etc.
 * Atrasa a atualização do valor até que o usuário pare de digitar
 * 
 * @param value - Valor a ser debounced
 * @param delay - Delay em milissegundos (padrão: 500ms)
 * @returns Valor debounced
 * 
 * @example
 * const [search, setSearch] = useState('')
 * const debouncedSearch = useDebounce(search, 500)
 * 
 * useEffect(() => {
 *   // Buscar apenas quando o usuário parar de digitar
 *   fetchResults(debouncedSearch)
 * }, [debouncedSearch])
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Atualizar o valor debounced após o delay
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cancelar o timeout se o valor mudar novamente
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook para debounce de callbacks
 * 
 * @param callback - Função a ser executada
 * @param delay - Delay em milissegundos (padrão: 500ms)
 * @returns Função debounced
 * 
 * @example
 * const handleSearch = useDebouncedCallback((query: string) => {
 *   fetchResults(query)
 * }, 500)
 * 
 * <input onChange={(e) => handleSearch(e.target.value)} />
 */
export function useDebouncedCallback<T extends (...args: Parameters<T>) => void>(
  callback: T,
  delay: number = 500
): (...args: Parameters<T>) => void {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    const newTimeoutId = setTimeout(() => {
      callback(...args)
    }, delay)

    setTimeoutId(newTimeoutId)
  }
}

