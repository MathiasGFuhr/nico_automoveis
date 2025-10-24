import { createClient } from '@/lib/supabase-client'
import { Vehicle, VehicleFilters, FuelType, TransmissionType } from '@/types/vehicle'

// Cache simples em memória (em produção usar Redis)
interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
}

class SimpleCache {
  private cache = new Map<string, CacheItem<any>>()

  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() > item.timestamp + item.ttl) {
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
}

const cache = new SimpleCache()

// Tipos específicos para dados do Supabase
interface SupabaseBrand {
  name: string
}

interface SupabaseCategory {
  name: string
}

interface SupabaseVehicleImage {
  image_url: string
  alt_text?: string
  is_primary: boolean
  sort_order: number
}

interface SupabaseVehicleFeature {
  feature_name: string
  vehicle_feature_types: {
    name: string
    category: string
    icon: string
  }
}


interface SupabaseVehicle {
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
  brands: SupabaseBrand
  categories: SupabaseCategory
  vehicle_images: SupabaseVehicleImage[]
  vehicle_features: SupabaseVehicleFeature[]
}

const supabase = createClient()

export class VehicleService {
  // Buscar todos os veículos com filtros (COM CACHE)
  static async getVehicles(filters?: VehicleFilters) {
    // Criar chave de cache baseada nos filtros
    const cacheKey = `vehicles-${JSON.stringify(filters)}`

    // Verificar cache primeiro
    const cachedData = cache.get<Vehicle[]>(cacheKey)
    if (cachedData) {
      console.log('✅ Cache hit - veículos retornados do cache')
      return cachedData
    }

    let query = supabase
      .from('vehicles')
      .select(`
        *,
        brands!inner(name),
        categories!inner(name),
        vehicle_images(image_url, alt_text, is_primary, sort_order),
        vehicle_features(feature_name)
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

    // Excluir veículos vendidos
    query = query.neq('status', 'sold')

    const { data, error } = await query

    if (error) {
      throw new Error(`Erro ao buscar veículos: ${error.message}`)
    }

    const transformedData = this.transformVehicles(data || [])

    // Salvar no cache por 5 minutos
    cache.set(cacheKey, transformedData, 5 * 60 * 1000)

    console.log('💾 Cache miss - veículos salvos no cache')
    return transformedData
  }

  // Buscar apenas veículos disponíveis para venda
  static async getAvailableVehicles() {
    const { data, error } = await supabase
      .from('vehicles')
      .select(`
        *,
        brands!inner(name),
        categories!inner(name),
        vehicle_images(image_url, alt_text, is_primary, sort_order)
      `)
      .eq('status', 'available')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Erro ao buscar veículos disponíveis: ${error.message}`)
    }

    return this.transformVehicles(data || [])
  }

  // Buscar todos os veículos (incluindo vendidos)
  static async getAllVehicles() {
    const { data, error } = await supabase
      .from('vehicles')
      .select(`
        *,
        brands!inner(name),
        categories!inner(name),
        vehicle_images(image_url, alt_text, is_primary, sort_order)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Erro ao buscar veículos: ${error.message}`)
    }

    console.log('🔍 VehicleService.getAllVehicles - Dados brutos:', data?.length)
    console.log('🔍 VehicleService.getAllVehicles - Primeiro veículo:', data?.[0])

    const transformed = this.transformVehicles(data || [])
    console.log('🔍 VehicleService.getAllVehicles - Dados transformados:', transformed.length)
    console.log('🔍 VehicleService.getAllVehicles - Primeiro veículo transformado:', transformed[0])

    return transformed
  }

  // Buscar veículos relacionados (OTIMIZADO - Query específica com cache)
  static async getRelatedVehicles(currentVehicleId: string, limit: number = 4) {
    const cacheKey = `related-${currentVehicleId}-${limit}`

    // Verificar cache primeiro
    const cachedData = cache.get<Vehicle[]>(cacheKey)
    if (cachedData) {
      console.log('✅ Cache hit - veículos relacionados retornados do cache')
      return cachedData
    }

    const { data, error } = await supabase
      .from('vehicles')
      .select(`
        *,
        brands!inner(name),
        categories!inner(name),
        vehicle_images(image_url, alt_text, is_primary, sort_order)
      `)
      .neq('id', currentVehicleId)
      .eq('status', 'available')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      throw new Error(`Erro ao buscar veículos relacionados: ${error.message}`)
    }

    const transformedData = this.transformVehicles(data || [])

    // Salvar no cache por 10 minutos (mais tempo pois muda menos)
    cache.set(cacheKey, transformedData, 10 * 60 * 1000)

    console.log('💾 Cache miss - veículos relacionados salvos no cache')
    return transformedData
  }

  // Buscar veículo por ID (OTIMIZADO - Uma consulta com JOIN e cache)
  static async getVehicleById(id: string) {
    const cacheKey = `vehicle-${id}`

    // Verificar cache primeiro
    const cachedData = cache.get<Vehicle>(cacheKey)
    if (cachedData) {
      console.log('✅ Cache hit - veículo retornado do cache')
      return cachedData
    }

    const { data, error } = await supabase
      .from('vehicles')
      .select(`
        *,
        brands!inner(name),
        categories!inner(name),
        vehicle_images(image_url, alt_text, is_primary, sort_order),
        vehicle_features(feature_name)
      `)
      .eq('id', id)
      .single()

    if (error) {
      throw new Error(`Erro ao buscar veículo: ${error.message}`)
    }

    // Se o veículo estiver vendido, retornar null
    if (data.status === 'sold') {
      return null
    }

    const transformedData = this.transformVehicle(data)

    // Salvar no cache por 15 minutos (veículos mudam pouco)
    cache.set(cacheKey, transformedData, 15 * 60 * 1000)

    console.log('💾 Cache miss - veículo salvo no cache')
    return transformedData
  }

  // Buscar marcas (COM CACHE)
  static async getBrands() {
    const cacheKey = 'brands'

    // Verificar cache primeiro
    const cachedData = cache.get<any[]>(cacheKey)
    if (cachedData) {
      console.log('✅ Cache hit - marcas retornadas do cache')
      return cachedData
    }

    const { data, error } = await supabase
      .from('brands')
      .select('id, name')
      .order('name')

    if (error) {
      throw new Error(`Erro ao buscar marcas: ${error.message}`)
    }

    const result = data || []

    // Salvar no cache por 30 minutos (marcas mudam pouco)
    cache.set(cacheKey, result, 30 * 60 * 1000)

    console.log('💾 Cache miss - marcas salvas no cache')
    return result
  }

  // Buscar categorias (COM CACHE)
  static async getCategories() {
    const cacheKey = 'categories'

    // Verificar cache primeiro
    const cachedData = cache.get<any[]>(cacheKey)
    if (cachedData) {
      console.log('✅ Cache hit - categorias retornadas do cache')
      return cachedData
    }

    const { data, error } = await supabase
      .from('categories')
      .select('id, name')
      .order('name')

    if (error) {
      throw new Error(`Erro ao buscar categorias: ${error.message}`)
    }

    const result = data || []

    // Salvar no cache por 30 minutos (categorias mudam pouco)
    cache.set(cacheKey, result, 30 * 60 * 1000)

    console.log('💾 Cache miss - categorias salvas no cache')
    return result
  }

  // Buscar tipos de combustível únicos (COM CACHE)
  static async getFuelTypes() {
    const cacheKey = 'fuelTypes'

    // Verificar cache primeiro
    const cachedData = cache.get<string[]>(cacheKey)
    if (cachedData) {
      console.log('✅ Cache hit - tipos de combustível retornados do cache')
      return cachedData
    }

    const { data, error } = await supabase
      .from('vehicles')
      .select('fuel_type')
      .not('fuel_type', 'is', null)

    if (error) {
      throw new Error(`Erro ao buscar tipos de combustível: ${error.message}`)
    }

    const uniqueFuelTypes = [...new Set(data?.map(v => v.fuel_type) || [])]

    // Salvar no cache por 15 minutos (tipos mudam pouco)
    cache.set(cacheKey, uniqueFuelTypes.sort(), 15 * 60 * 1000)

    console.log('💾 Cache miss - tipos de combustível salvos no cache')
    return uniqueFuelTypes.sort()
  }

  // Buscar tipos de transmissão únicos (COM CACHE)
  static async getTransmissionTypes() {
    const cacheKey = 'transmissionTypes'

    // Verificar cache primeiro
    const cachedData = cache.get<string[]>(cacheKey)
    if (cachedData) {
      console.log('✅ Cache hit - tipos de transmissão retornados do cache')
      return cachedData
    }

    const { data, error } = await supabase
      .from('vehicles')
      .select('transmission')
      .not('transmission', 'is', null)

    if (error) {
      throw new Error(`Erro ao buscar tipos de transmissão: ${error.message}`)
    }

    const uniqueTransmissions = [...new Set(data?.map(v => v.transmission) || [])]

    // Salvar no cache por 15 minutos (tipos mudam pouco)
    cache.set(cacheKey, uniqueTransmissions.sort(), 15 * 60 * 1000)

    console.log('💾 Cache miss - tipos de transmissão salvos no cache')
    return uniqueTransmissions.sort()
  }

  // Buscar cidades únicas (COM CACHE)
  static async getCities() {
    const cacheKey = 'cities'

    // Verificar cache primeiro
    const cachedData = cache.get<string[]>(cacheKey)
    if (cachedData) {
      console.log('✅ Cache hit - cidades retornadas do cache')
      return cachedData
    }

    const { data, error } = await supabase
      .from('vehicles')
      .select('city, state')
      .not('city', 'is', null)

    if (error) {
      throw new Error(`Erro ao buscar cidades: ${error.message}`)
    }

    const uniqueCities = [...new Set(data?.map(v => `${v.city}, ${v.state}`) || [])]

    // Salvar no cache por 15 minutos (cidades mudam pouco)
    cache.set(cacheKey, uniqueCities.sort(), 15 * 60 * 1000)

    console.log('💾 Cache miss - cidades salvas no cache')
    return uniqueCities.sort()
  }

  // Buscar características disponíveis
  static async getFeatureTypes() {
    const { data, error } = await supabase
      .from('vehicle_feature_types')
      .select('id, name, category, icon')
      .order('category, name')

    if (error) {
      throw new Error(`Erro ao buscar características: ${error.message}`)
    }

    return data || []
  }

  // Transformar dados do banco para o formato da aplicação
  private static transformVehicles(vehicles: SupabaseVehicle[]): Vehicle[] {
    return vehicles.map(vehicle => this.transformVehicle(vehicle))
  }

  private static transformVehicle(vehicle: SupabaseVehicle): Vehicle {
    return {
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
      images: [...new Set(vehicle.vehicle_images?.map(img => img.image_url) || [])],
      features: vehicle.vehicle_features?.map(f => f.feature_name) || [],
      seller: {
        name: 'Nico Automóveis',
        phone: '(55) 9 9999-9999',
        email: 'contato@nicoautomoveis.com',
        address: 'Santo Cristo, RS'
      }
    }
  }

  // Atualizar status do veículo (COM LIMPEZA DE CACHE)
  static async updateVehicleStatus(id: string, status: 'available' | 'reserved' | 'sold' | 'maintenance' | 'trade') {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('vehicles')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // Limpar cache relacionado a este veículo e listagens
    cache.clear(`vehicle-${id}`)
    cache.clear() // Limpar todos os caches para garantir consistência

    return data
  }

  // Método para limpar cache manualmente (útil para admin)
  static clearCache(key?: string) {
    cache.clear(key)
  }

  // Adicionar novo veículo (COM LIMPEZA DE CACHE)
  static async addVehicle(vehicleData: {
    model: string
    brand_id: string
    category_id: string
    year: number
    price: number
    mileage: number
    fuel_type: FuelType
    transmission: TransmissionType
    color: string
    doors: number
    city: string
    state: string
    plate_end: string
    accepts_trade: boolean
    licensed: boolean
    description: string
    status: 'available' | 'reserved' | 'sold' | 'maintenance'
    featured: boolean
  }) {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('vehicles')
      .insert(vehicleData)
      .select()
      .single()

    if (error) throw error

    // Limpar cache de listagens para incluir o novo veículo
    cache.clear()

    return data
  }

  // Substituir características (features) de um veículo (COM LIMPEZA DE CACHE)
  static async upsertVehicleFeatures(vehicleId: string, features: string[]) {
    const supabase = createClient()

    // Remove todas as atuais
    const del = await supabase
      .from('vehicle_features')
      .delete()
      .eq('vehicle_id', vehicleId)

    if (del.error) throw del.error

    if (!features || features.length === 0) {
      // Limpar cache do veículo
      cache.clear(`vehicle-${vehicleId}`)
      cache.clear()
      return true
    }

    // Insere em lote
    const rows = features.map((feature) => ({
      vehicle_id: vehicleId,
      feature_name: feature
    }))

    const ins = await supabase
      .from('vehicle_features')
      .insert(rows)

    if (ins.error) throw ins.error

    // Limpar cache do veículo
    cache.clear(`vehicle-${vehicleId}`)
    cache.clear()

    return true
  }

  // Deletar veículo (COM LIMPEZA DE CACHE)
  static async deleteVehicle(id: string) {
    const supabase = createClient()

    // Buscar imagens do veículo antes de deletar para remover do storage
    const { data: vehicleImages, error: fetchImagesError } = await supabase
      .from('vehicle_images')
      .select('image_url')
      .eq('vehicle_id', id)

    if (fetchImagesError) {
      console.warn('Erro ao buscar imagens do veículo:', fetchImagesError)
    }

    // Remover arquivos do storage se existirem
    if (vehicleImages && vehicleImages.length > 0) {
      const filePaths = vehicleImages.map(img => {
        const url = new URL(img.image_url)
        const fileName = url.pathname.split('/').pop()
        return `vehicle-images/${fileName}`
      }).filter(Boolean)

      if (filePaths.length > 0) {
        const { error: storageError } = await supabase.storage
          .from('vehicle-images')
          .remove(filePaths)

        if (storageError) {
          console.warn('Erro ao remover arquivos do storage:', storageError)
        } else {
          console.log(`${filePaths.length} arquivos removidos do storage`)
        }
      }
    }

    // Remover vendas relacionadas que referenciam este veículo
    const deleteSales = await supabase
      .from('sales')
      .delete()
      .eq('vehicle_id', id)

    if (deleteSales.error && deleteSales.error.code !== 'PGRST116') { // ignore not found
      throw deleteSales.error
    }

    // Remover dependências primeiro para evitar violação de FK
    const deleteImages = await supabase
      .from('vehicle_images')
      .delete()
      .eq('vehicle_id', id)

    if (deleteImages.error) throw deleteImages.error

    const deleteFeatures = await supabase
      .from('vehicle_features')
      .delete()
      .eq('vehicle_id', id)

    if (deleteFeatures.error) throw deleteFeatures.error

    const deleteSpecifications = await supabase
      .from('vehicle_specifications')
      .delete()
      .eq('vehicle_id', id)

    if (deleteSpecifications.error) throw deleteSpecifications.error

    // Por fim, remover o veículo
    const deleteVehicle = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id)

    if (deleteVehicle.error) throw deleteVehicle.error

    // Limpar cache relacionado a este veículo
    cache.clear(`vehicle-${id}`)
    cache.clear() // Limpar todos os caches para garantir consistência
  }

  // Atualizar veículo (COM LIMPEZA DE CACHE)
  static async updateVehicle(id: string, vehicleData: Partial<SupabaseVehicle>) {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('vehicles')
      .update(vehicleData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // Limpar cache relacionado a este veículo
    cache.clear(`vehicle-${id}`)
    cache.clear() // Limpar todos os caches para garantir consistência

    return data
  }


  // Criar veículo em troca (COM LIMPEZA DE CACHE)
  static async createTradeVehicle(tradeData: {
    tradeVehicleName: string
    tradeValue: number
    clientId: string
  }) {
    const supabase = createClient()

    // Criar um veículo básico em troca
    const vehicleData = {
      model: tradeData.tradeVehicleName,
      year: new Date().getFullYear(), // Ano atual como padrão
      price: tradeData.tradeValue,
      mileage: 0,
      fuel_type: 'gasolina',
      transmission: 'manual',
      color: 'Não informado',
      doors: 4,
      city: 'Não informado',
      state: 'Não informado',
      plate_end: '00',
      accepts_trade: false,
      licensed: false,
      description: `Veículo recebido em troca: ${tradeData.tradeVehicleName}`,
      status: 'trade', // Status específico para troca
      featured: false,
      brand_id: '00000000-0000-0000-0000-000000000001', // ID padrão para marca "Não informado"
      category_id: '00000000-0000-0000-0000-000000000001' // ID padrão para categoria "Não informado"
    }

    const { data, error } = await supabase
      .from('vehicles')
      .insert([vehicleData])
      .select()
      .single()

    if (error) throw error

    // Limpar cache de listagens para incluir o novo veículo
    cache.clear()

    return data
  }
}
