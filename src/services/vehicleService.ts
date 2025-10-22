import { createClient } from '@/lib/supabase-client'
import { Vehicle, VehicleFilters, FuelType, TransmissionType } from '@/types/vehicle'

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
  // Buscar todos os veículos com filtros
  static async getVehicles(filters?: VehicleFilters) {
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

    return this.transformVehicles(data || [])
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

  // Buscar veículo por ID
  static async getVehicleById(id: string) {
    const { data, error } = await supabase
      .from('vehicles')
      .select(`
        *,
        brands!inner(name),
        categories!inner(name),
        vehicle_images(image_url, alt_text, is_primary, sort_order)
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

    // Buscar características separadamente
    const { data: features } = await supabase
      .from('vehicle_features')
      .select('feature_name')
      .eq('vehicle_id', id)

    // Especificações removidas do projeto

    // Adicionar dados buscados separadamente
    const vehicleWithRelations = {
      ...data,
      vehicle_features: features || []
    }

    return this.transformVehicle(vehicleWithRelations)
  }

  // Buscar marcas
  static async getBrands() {
    const { data, error } = await supabase
      .from('brands')
      .select('id, name')
      .order('name')

    if (error) {
      throw new Error(`Erro ao buscar marcas: ${error.message}`)
    }

    return data || []
  }

  // Buscar categorias
  static async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name')
      .order('name')

    if (error) {
      throw new Error(`Erro ao buscar categorias: ${error.message}`)
    }

    return data || []
  }

  // Buscar tipos de combustível únicos
  static async getFuelTypes() {
    const { data, error } = await supabase
      .from('vehicles')
      .select('fuel_type')
      .not('fuel_type', 'is', null)

    if (error) {
      throw new Error(`Erro ao buscar tipos de combustível: ${error.message}`)
    }

    const uniqueFuelTypes = [...new Set(data?.map(v => v.fuel_type) || [])]
    return uniqueFuelTypes.sort()
  }

  // Buscar tipos de transmissão únicos
  static async getTransmissionTypes() {
    const { data, error } = await supabase
      .from('vehicles')
      .select('transmission')
      .not('transmission', 'is', null)

    if (error) {
      throw new Error(`Erro ao buscar tipos de transmissão: ${error.message}`)
    }

    const uniqueTransmissions = [...new Set(data?.map(v => v.transmission) || [])]
    return uniqueTransmissions.sort()
  }

  // Buscar cidades únicas
  static async getCities() {
    const { data, error } = await supabase
      .from('vehicles')
      .select('city, state')
      .not('city', 'is', null)

    if (error) {
      throw new Error(`Erro ao buscar cidades: ${error.message}`)
    }

    const uniqueCities = [...new Set(data?.map(v => `${v.city}, ${v.state}`) || [])]
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

  // Atualizar status do veículo
  static async updateVehicleStatus(id: string, status: 'available' | 'reserved' | 'sold' | 'maintenance') {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('vehicles')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Adicionar novo veículo
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
    return data
  }

  // Substituir características (features) de um veículo
  static async upsertVehicleFeatures(vehicleId: string, features: string[]) {
    const supabase = createClient()

    // Remove todas as atuais
    const del = await supabase
      .from('vehicle_features')
      .delete()
      .eq('vehicle_id', vehicleId)

    if (del.error) throw del.error

    if (!features || features.length === 0) return true

    // Insere em lote
    const rows = features.map((feature) => ({
      vehicle_id: vehicleId,
      feature_name: feature
    }))

    const ins = await supabase
      .from('vehicle_features')
      .insert(rows)

    if (ins.error) throw ins.error
    return true
  }

  // Deletar veículo
  static async deleteVehicle(id: string) {
    const supabase = createClient()
    
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
  }

  // Atualizar veículo
  static async updateVehicle(id: string, vehicleData: Partial<SupabaseVehicle>) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('vehicles')
      .update(vehicleData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Atualizar status do veículo (para destaques)
  static async updateVehicleStatus(id: string, status: string) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('vehicles')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Criar veículo em troca
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
    return data
  }
}
