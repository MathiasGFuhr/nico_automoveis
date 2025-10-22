import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import { Vehicle, VehicleFilters, FuelType, TransmissionType } from '@/types/vehicle'

interface UseVehiclesReturn {
  vehicles: Vehicle[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
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

  useEffect(() => {
    let isMounted = true

    const fetchVehicles = async () => {
      try {
        setLoading(true)
        setError(null)

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

        // Aplicar filtros
        if (filters?.brand) {
          query = query.eq('brand_id', filters.brand)
        }
        if (filters?.yearFrom) {
          query = query.gte('year', filters.yearFrom)
        }
        if (filters?.yearTo) {
          query = query.lte('year', filters.yearTo)
        }
        if (filters?.priceFrom) {
          query = query.gte('price', filters.priceFrom)
        }
        if (filters?.priceTo) {
          query = query.lte('price', filters.priceTo)
        }
        if (filters?.fuel) {
          query = query.eq('fuel_type', filters.fuel)
        }
        if (filters?.transmission) {
          query = query.eq('transmission', filters.transmission)
        }
        if (filters?.city) {
          query = query.eq('city', filters.city)
        }
        if (filters?.state) {
          query = query.eq('state', filters.state)
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
  }, [filters?.brand, filters?.yearFrom, filters?.yearTo, filters?.priceFrom, filters?.priceTo, filters?.fuel, filters?.transmission, filters?.city, filters?.state])

  const refetch = async () => {
    try {
      setLoading(true)
      setError(null)

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

      if (filters?.brand) query = query.eq('brand_id', filters.brand)
      if (filters?.yearFrom) query = query.gte('year', filters.yearFrom)
      if (filters?.yearTo) query = query.lte('year', filters.yearTo)
      if (filters?.priceFrom) query = query.gte('price', filters.priceFrom)
      if (filters?.priceTo) query = query.lte('price', filters.priceTo)
      if (filters?.fuel) query = query.eq('fuel_type', filters.fuel)
      if (filters?.transmission) query = query.eq('transmission', filters.transmission)
      if (filters?.city) query = query.eq('city', filters.city)
      if (filters?.state) query = query.eq('state', filters.state)

      // Buscar todos os veículos (removido filtro de status)
      // query = query.eq('status', 'available')

      const { data, error: queryError } = await query

      if (queryError) throw queryError

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

      setVehicles(transformedVehicles)
    } catch (err) {
      console.error('Erro ao buscar veículos:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  return {
    vehicles,
    loading,
    error,
    refetch
  }
}
