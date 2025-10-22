import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'

interface DashboardMetrics {
  totalVehicles: number
  availableVehicles: number
  soldVehicles: number
  totalClients: number
  activeClients: number
  totalSales: number
  salesValue: number
  totalCommission: number
  pendingSales: number
  loading: boolean
  error: string | null
}

export function useDashboardMetrics(): DashboardMetrics {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalVehicles: 0,
    availableVehicles: 0,
    soldVehicles: 0,
    totalClients: 0,
    activeClients: 0,
    totalSales: 0,
    salesValue: 0,
    totalCommission: 0,
    pendingSales: 0,
    loading: true,
    error: null
  })

  useEffect(() => {
    let isMounted = true

    const fetchMetrics = async () => {
      try {
        const supabase = createClient()

        // Buscar métricas de veículos
        const { data: vehicles, error: vehiclesError } = await supabase
          .from('vehicles')
          .select('status')

        if (vehiclesError) throw vehiclesError

        // Buscar métricas de clientes
        const { data: clients, error: clientsError } = await supabase
          .from('clients')
          .select('status')

        if (clientsError) throw clientsError

        // Buscar métricas de vendas
        const { data: sales, error: salesError } = await supabase
          .from('sales')
          .select('price, commission_amount, status')

        if (salesError) throw salesError

        if (!isMounted) return

        const totalVehicles = vehicles?.length || 0
        const availableVehicles = vehicles?.filter(v => v.status === 'available').length || 0
        const soldVehicles = vehicles?.filter(v => v.status === 'sold').length || 0

        const totalClients = clients?.length || 0
        const activeClients = clients?.filter(c => c.status === 'active').length || 0

        const completedSales = sales?.filter(s => s.status === 'completed') || []
        const totalSales = completedSales.length
        const salesValue = completedSales.reduce((sum, sale) => sum + sale.price, 0)
        const totalCommission = completedSales.reduce((sum, sale) => sum + sale.commission_amount, 0)
        const pendingSales = sales?.filter(s => s.status === 'pending').length || 0

        setMetrics({
          totalVehicles,
          availableVehicles,
          soldVehicles,
          totalClients,
          activeClients,
          totalSales,
          salesValue,
          totalCommission,
          pendingSales,
          loading: false,
          error: null
        })
      } catch (err) {
        if (isMounted) {
          console.error('Erro ao buscar métricas:', err)
          setMetrics(prev => ({
            ...prev,
            loading: false,
            error: err instanceof Error ? err.message : 'Erro desconhecido'
          }))
        }
      }
    }

    fetchMetrics()

    return () => {
      isMounted = false
    }
  }, [])

  return metrics
}

