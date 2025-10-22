// Tipos relacionados ao veículo

export interface Vehicle {
  id: string
  brand: string
  model: string
  year: number
  price: number
  mileage: number
  fuel: FuelType
  transmission: TransmissionType
  color: string
  doors: number
  city: string
  state: string
  plateEnd: string
  acceptsTrade: boolean
  licensed: boolean
  images: string[]
  image: string // Imagem principal
  description: string
  features: string[]
  specifications?: VehicleSpecifications
  seller: VehicleSeller
  status: 'available' | 'reserved' | 'sold' | 'maintenance' | 'trade'
  featured: boolean
  created_at?: string
  updated_at?: string
}



export interface VehicleSpecifications {
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

export interface VehicleSeller {
  name: string
  phone: string
  email: string
  address: string
}

export interface VehicleFeatures {
  features: string[]
}

// Enums para valores fixos
export enum FuelType {
  FLEX = 'Flex',
  GASOLINA = 'Gasolina',
  ETANOL = 'Etanol',
  DIESEL = 'Diesel',
  GNV = 'GNV',
  ELETRICO = 'Elétrico'
}

export enum TransmissionType {
  MANUAL = 'Manual',
  AUTOMATICO = 'Automático',
  CVT = 'CVT',
  SEMI_AUTOMATICO = 'Semi-automático'
}

export enum VehicleCategory {
  HATCHBACK = 'Hatchback',
  SEDAN = 'Sedan',
  SUV = 'SUV',
  PICKUP = 'Pickup',
  COUPE = 'Coupé',
  CONVERSIVEL = 'Conversível'
}

// Tipos para filtros e busca
export interface VehicleFilters {
  brand?: string
  model?: string
  yearFrom?: number
  yearTo?: number
  priceFrom?: number
  priceTo?: number
  mileageFrom?: number
  mileageTo?: number
  fuel?: FuelType
  transmission?: TransmissionType
  city?: string
  state?: string
}

export interface VehicleSearchParams {
  query?: string
  filters?: VehicleFilters
  sortBy?: 'price' | 'year' | 'mileage' | 'created_at'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}
