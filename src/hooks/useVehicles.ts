import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import { Vehicle, VehicleFilters, FuelType, TransmissionType } from '@/types/vehicle'
import { useDebounce } from './useDebounce'

// Cache simples em memória (em produção usar Redis)
interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
}

class SimpleCache {
  private cache = new Map<string, CacheItem<unknown>>()

  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() > item.timestamp + item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data as T
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
}

const cache = new SimpleCache()

interface UseVehiclesReturn {
  vehicles: Vehicle[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  invalidateCache: () => void
}

// Tipos para dados do Supabase
interface SupabaseVehicleImage {
  image_url: string
  alt_text?: string
  is_primary: boolean
  sort_order: number
}

interface SupabaseVehicleFeature {
  feature_name: string
}

interface SupabaseVehicleSpecification {
  motor?: string
  potencia?: string
  torque?: string
  combustivel?: string
  transmissao?: string
  tracao?: string
  consumo?: string
  aceleracao?: string
  velocidade?: string
  tanque?: string
  peso?: string
  comprimento?: string
  largura?: string
  altura?: string
  entre_eixos?: string
  porta_malas?: string
}

interface SupabaseVehicleData {
  id: string
  model: string
  year: number
  price: number
  mileage: number
  fuel_type: string
  transmission: string
  color: string
  doors: number
  city: string
  state: string
  plate_end: string
  accepts_trade: boolean
  licensed: boolean
  description: string
  status: string
  featured: boolean
  created_at?: string
  updated_at?: string
  brands: { name: string }
  categories: { name: string }
  vehicle_images: SupabaseVehicleImage[]
  vehicle_features: SupabaseVehicleFeature[]
  vehicle_specifications: SupabaseVehicleSpecification
}

export function useVehicles(filters?: VehicleFilters): UseVehiclesReturn {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Debounce dos filtros para evitar consultas excessivas
  const debouncedFilters = useDebounce(filters, 300) // 300ms de delay

  useEffect(() => {
    let isMounted = true

    const fetchVehicles = async () => {
      try {
        setLoading(true)
        setError(null)

        // Criar chave de cache baseada nos filtros debounced
        const cacheKey = `useVehicles-${JSON.stringify(debouncedFilters)}`

        // Verificar cache primeiro
        const cachedData = cache.get<Vehicle[]>(cacheKey)
        if (cachedData) {
          console.log('✅ Cache hit - useVehicles retornados do cache')
          setVehicles(cachedData)
          setLoading(false)
          return
        }

        const supabase = createClient()
        let query = supabase
          .from('vehicles')
          .select(`
            *,
            brands!inner(name),
            categories!inner(name),
            vehicle_images(image_url, alt_text, is_primary, sort_order),
            vehicle_features(feature_name),
            vehicle_specifications(*)
          `)

        // Aplicar filtros debounced
        if (debouncedFilters?.brand) {
          query = query.eq('brand_id', debouncedFilters.brand)
        }
        if (debouncedFilters?.yearFrom) {
          query = query.gte('year', debouncedFilters.yearFrom)
        }
        if (debouncedFilters?.yearTo) {
          query = query.lte('year', debouncedFilters.yearTo)
        }
        if (debouncedFilters?.priceFrom) {
          query = query.gte('price', debouncedFilters.priceFrom)
        }
        if (debouncedFilters?.priceTo) {
          query = query.lte('price', debouncedFilters.priceTo)
        }
        if (debouncedFilters?.fuel) {
          query = query.eq('fuel_type', debouncedFilters.fuel)
        }
        if (debouncedFilters?.transmission) {
          query = query.eq('transmission', debouncedFilters.transmission)
        }
        if (debouncedFilters?.city) {
          query = query.eq('city', debouncedFilters.city)
        }
        if (debouncedFilters?.state) {
          query = query.eq('state', debouncedFilters.state)
        }

        // Buscar todos os veículos (removido filtro de status)
        // query = query.eq('status', 'available')

        const { data, error: queryError } = await query

        if (queryError) throw queryError

        if (!isMounted) return

        // Transformar dados
        const transformedVehicles: Vehicle[] = (data as SupabaseVehicleData[])?.map(vehicle => ({
          id: vehicle.id,
          brand: vehicle.brands.name,
          model: vehicle.model,
          year: vehicle.year,
          price: vehicle.price,
          mileage: vehicle.mileage,
          fuel: vehicle.fuel_type as FuelType,
          transmission: vehicle.transmission as TransmissionType,
          color: vehicle.color,
          doors: vehicle.doors,
          city: vehicle.city,
          state: vehicle.state,
          plateEnd: vehicle.plate_end,
          acceptsTrade: vehicle.accepts_trade,
          licensed: vehicle.licensed,
          description: vehicle.description,
          status: vehicle.status as 'available' | 'reserved' | 'sold' | 'maintenance',
          featured: vehicle.featured,
          image: vehicle.vehicle_images?.find(img => img.is_primary)?.image_url || vehicle.vehicle_images?.[0]?.image_url || '',
          images: vehicle.vehicle_images?.map(img => img.image_url) || [],
          features: vehicle.vehicle_features?.map(f => f.feature_name) || [],
          specifications: vehicle.vehicle_specifications ? {
            motor: vehicle.vehicle_specifications.motor || '',
            potencia: vehicle.vehicle_specifications.potencia || '',
            torque: vehicle.vehicle_specifications.torque || '',
            combustivel: vehicle.vehicle_specifications.combustivel || '',
            transmissao: vehicle.vehicle_specifications.transmissao || '',
            tracao: vehicle.vehicle_specifications.tracao || '',
            consumo: vehicle.vehicle_specifications.consumo || '',
            aceleracao: vehicle.vehicle_specifications.aceleracao || '',
            velocidade: vehicle.vehicle_specifications.velocidade || '',
            tanque: vehicle.vehicle_specifications.tanque || '',
            peso: vehicle.vehicle_specifications.peso || '',
            comprimento: vehicle.vehicle_specifications.comprimento || '',
            largura: vehicle.vehicle_specifications.largura || '',
            altura: vehicle.vehicle_specifications.altura || '',
            entreEixos: vehicle.vehicle_specifications.entre_eixos || '',
            portaMalas: vehicle.vehicle_specifications.porta_malas || ''
          } : undefined,
          seller: {
            name: 'Nico Automóveis',
            phone: '(55) 9 9999-9999',
            email: 'contato@nicoautomoveis.com',
            address: 'Santo Cristo, RS'
          }
        })) || []

        // Salvar no cache por 5 minutos
        cache.set(cacheKey, transformedVehicles, 5 * 60 * 1000)
        console.log('💾 Cache miss - useVehicles salvos no cache')

        setVehicles(transformedVehicles)
      } catch (err) {
        if (isMounted) {
          console.error('Erro ao buscar veículos:', err)
          setError(err instanceof Error ? err.message : 'Erro desconhecido')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchVehicles()

    return () => {
      isMounted = false
    }
  }, [debouncedFilters])

  const refetch = async () => {
    // Limpar cache e refazer a consulta
    const cacheKey = `useVehicles-${JSON.stringify(debouncedFilters)}`
    cache.clear(cacheKey)
    // Trigger re-fetch by updating a dummy state
    setLoading(true)
  }

  const invalidateCache = () => {
    // Limpar todos os caches relacionados a veículos
    cache.clear()
    console.log('🔄 Cache de veículos invalidado - forçando atualização')
    setLoading(true)
  }

  return {
    vehicles,
    loading,
    error,
    refetch,
    invalidateCache
  }
}
