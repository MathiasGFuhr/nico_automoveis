import { useState, useEffect } from 'react'
import { VehicleService } from '@/services/vehicleService'
import { Vehicle } from '@/types/vehicle'

interface UseAllVehiclesReturn {
  vehicles: Vehicle[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useAllVehicles(): UseAllVehiclesReturn {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVehicles = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔍 useAllVehicles - Buscando todos os veículos...')
      const data = await VehicleService.getAllVehicles()
      console.log('🔍 useAllVehicles - Veículos carregados:', data.length)
      console.log('🔍 useAllVehicles - Status dos veículos:', data.map(v => ({ model: v.model, status: v.status })))
      setVehicles(data)
    } catch (err) {
      console.error('❌ useAllVehicles - Erro ao buscar veículos:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicles()
  }, [])

  return {
    vehicles,
    loading,
    error,
    refetch: fetchVehicles
  }
}
