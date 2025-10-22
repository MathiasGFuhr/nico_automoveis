import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'

interface Sale {
  id: string
  sale_code: string
  price: number
  commission_rate: number
  commission_amount: number
  payment_method: string
  status: 'pending' | 'completed' | 'cancelled' | 'refunded'
  sale_date: string
  notes?: string
  created_at: string
  updated_at: string
  client: {
    id: string
    name: string
    email: string
    phone: string
    cpf?: string
  }
  vehicle: {
    id: string
    brand: string
    model: string
    year: number
  }
  seller: {
    id: string
    name: string
    email: string
  }
}

interface UseSalesReturn {
  sales: Sale[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  totalSales: number
  totalCommission: number
  pendingSales: number
}

interface SupabaseSale {
  id: string
  sale_code: string
  price: number
  commission_rate: number
  commission_amount: number
  payment_method: string
  status: string
  sale_date: string
  notes?: string
  created_at: string
  updated_at: string
  clients: {
    id: string
    name: string
    email: string
    phone: string
    cpf?: string
  }
  vehicles: {
    id: string
    model: string
    year: number
    brands: { name: string }
  }
  users: {
    id: string
    name: string
    email: string
  }
}

export function useSales(): UseSalesReturn {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchSales = async () => {
      try {
        setLoading(true)
        setError(null)

        const supabase = createClient()
        const { data, error: queryError } = await supabase
          .from('sales')
          .select(`
            *,
            clients!inner(id, name, email, phone, cpf),
            vehicles!inner(id, model, year, brands!inner(name)),
            users!inner(id, name, email)
          `)
          .order('created_at', { ascending: false })

        if (queryError) throw queryError

        if (!isMounted) return

        const transformedSales: Sale[] = (data as unknown as SupabaseSale[])?.map(sale => ({
          id: sale.id,
          sale_code: sale.sale_code,
          price: sale.price,
          commission_rate: sale.commission_rate,
          commission_amount: sale.commission_amount,
          payment_method: sale.payment_method,
          status: sale.status as 'pending' | 'completed' | 'cancelled' | 'refunded',
          sale_date: sale.sale_date,
          notes: sale.notes,
          created_at: sale.created_at,
          updated_at: sale.updated_at,
          client: {
            id: sale.clients.id,
            name: sale.clients.name,
            email: sale.clients.email,
            phone: sale.clients.phone,
            cpf: sale.clients.cpf
          },
          vehicle: {
            id: sale.vehicles.id,
            brand: sale.vehicles.brands.name,
            model: sale.vehicles.model,
            year: sale.vehicles.year
          },
          seller: {
            id: sale.users.id,
            name: sale.users.name,
            email: sale.users.email
          }
        })) || []

        if (isMounted) {
          setSales(transformedSales)
        }
      } catch (err) {
        if (isMounted) {
          console.error('Erro ao buscar vendas:', err)
          setError(err instanceof Error ? err.message : 'Erro desconhecido')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchSales()

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
        .from('sales')
        .select(`
          *,
          clients!inner(id, name, email, phone, cpf),
          vehicles!inner(id, model, year, brands!inner(name)),
          users!inner(id, name, email)
        `)
        .order('created_at', { ascending: false })

      if (queryError) throw queryError

      const transformedSales: Sale[] = (data as unknown as SupabaseSale[])?.map(sale => ({
        id: sale.id,
        sale_code: sale.sale_code,
        price: sale.price,
        commission_rate: sale.commission_rate,
        commission_amount: sale.commission_amount,
        payment_method: sale.payment_method,
        status: sale.status as 'pending' | 'completed' | 'cancelled' | 'refunded',
        sale_date: sale.sale_date,
        notes: sale.notes,
        created_at: sale.created_at,
        updated_at: sale.updated_at,
        client: {
          id: sale.clients.id,
          name: sale.clients.name,
          email: sale.clients.email,
          phone: sale.clients.phone,
          cpf: sale.clients.cpf
        },
        vehicle: {
          id: sale.vehicles.id,
          brand: sale.vehicles.brands.name,
          model: sale.vehicles.model,
          year: sale.vehicles.year
        },
        seller: {
          id: sale.users.id,
          name: sale.users.name,
          email: sale.users.email
        }
      })) || []

      setSales(transformedSales)
    } catch (err) {
      console.error('Erro ao buscar vendas:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  // Calcular estatísticas
  const totalSales = sales
    .filter(sale => sale.status === 'completed')
    .reduce((sum, sale) => sum + sale.price, 0)

  const totalCommission = sales
    .filter(sale => sale.status === 'completed')
    .reduce((sum, sale) => sum + sale.commission_amount, 0)

  const pendingSales = sales.filter(sale => sale.status === 'pending').length

  return {
    sales,
    loading,
    error,
    refetch,
    totalSales,
    totalCommission,
    pendingSales
  }
}
