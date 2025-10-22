import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'

interface Client {
  id: string
  name: string
  email: string
  phone: string
  cpf: string
  city: string
  state: string
  client_type: 'buyer' | 'seller' | 'prospect'
  status: 'active' | 'inactive' | 'interested'
  rating: number
  notes?: string
  created_at: string
  updated_at: string
}

interface UseClientsReturn {
  clients: Client[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useClients(): UseClientsReturn {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchClients = async () => {
      try {
        setLoading(true)
        setError(null)

        const supabase = createClient()
        const { data, error: queryError } = await supabase
          .from('clients')
          .select('*')
          .order('created_at', { ascending: false })

        if (queryError) throw queryError

        if (isMounted) {
          setClients(data || [])
        }
      } catch (err) {
        if (isMounted) {
          console.error('Erro ao buscar clientes:', err)
          setError(err instanceof Error ? err.message : 'Erro desconhecido')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchClients()

    return () => {
      isMounted = false
    }
  }, [])

  const refetch = async () => {
    try {
      setLoading(true)
      setError(null)

      const supabase = createClient()
      const { data, error: queryError } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })

      if (queryError) throw queryError

      setClients(data || [])
    } catch (err) {
      console.error('Erro ao buscar clientes:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  return {
    clients,
    loading,
    error,
    refetch
  }
}
