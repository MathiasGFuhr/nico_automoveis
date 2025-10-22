'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import VehicleCard from '@/components/VehicleCard'
import VehicleFilter from '@/components/VehicleFilter'

// Dados de exemplo - em produção viriam do Supabase
const allVehicles = [
  {
    id: '1',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2022,
    price: 85000,
    mileage: 15000,
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500',
    fuel: 'Flex',
    transmission: 'Automático',
    color: 'Branco',
    doors: 4,
    category: 'Sedan',
    condition: 'Seminovo',
    features: ['Ar Condicionado', 'Direção Hidráulica', 'Freios ABS', 'Airbag']
  },
  {
    id: '2',
    brand: 'Honda',
    model: 'Civic',
    year: 2021,
    price: 92000,
    mileage: 22000,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500',
    fuel: 'Flex',
    transmission: 'Automático',
    color: 'Preto',
    doors: 4,
    category: 'Sedan',
    condition: 'Seminovo',
    features: ['Ar Condicionado', 'Direção Hidráulica', 'Freios ABS', 'Airbag', 'GPS']
  },
  {
    id: '3',
    brand: 'Volkswagen',
    model: 'Golf',
    year: 2020,
    price: 78000,
    mileage: 35000,
    image: 'https://images.unsplash.com/photo-1549317336-206569e8475c?w=500',
    fuel: 'Flex',
    transmission: 'Manual',
    color: 'Prata',
    doors: 5,
    category: 'Hatchback',
    condition: 'Usado',
    features: ['Ar Condicionado', 'Direção Hidráulica', 'Freios ABS']
  },
  {
    id: '4',
    brand: 'Ford',
    model: 'Focus',
    year: 2021,
    price: 65000,
    mileage: 28000,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500',
    fuel: 'Flex',
    transmission: 'Automático',
    color: 'Azul',
    doors: 4,
    category: 'Sedan',
    condition: 'Seminovo',
    features: ['Ar Condicionado', 'Direção Hidráulica', 'Freios ABS', 'Airbag', 'Som']
  },
  {
    id: '5',
    brand: 'Chevrolet',
    model: 'Onix',
    year: 2023,
    price: 72000,
    mileage: 12000,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500',
    fuel: 'Flex',
    transmission: 'Automático',
    color: 'Branco',
    doors: 4,
    category: 'Hatchback',
    condition: 'Novo',
    features: ['Ar Condicionado', 'Direção Hidráulica', 'Freios ABS', 'Airbag', 'GPS', 'Bluetooth']
  },
  {
    id: '6',
    brand: 'Fiat',
    model: 'Argo',
    year: 2022,
    price: 68000,
    mileage: 18000,
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500',
    fuel: 'Flex',
    transmission: 'Manual',
    color: 'Vermelho',
    doors: 5,
    category: 'Hatchback',
    condition: 'Seminovo',
    features: ['Ar Condicionado', 'Direção Hidráulica', 'Freios ABS']
  },
  {
    id: '7',
    brand: 'BMW',
    model: 'Série 3',
    year: 2023,
    price: 180000,
    mileage: 8000,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500',
    fuel: 'Gasolina',
    transmission: 'Automático',
    color: 'Preto',
    doors: 4,
    category: 'Sedan',
    condition: 'Novo',
    features: ['Ar Condicionado', 'Direção Hidráulica', 'Freios ABS', 'Airbag', 'GPS', 'Bluetooth', 'Teto Solar', 'Bancos de Couro']
  },
  {
    id: '8',
    brand: 'Volkswagen',
    model: 'Tiguan',
    year: 2022,
    price: 120000,
    mileage: 25000,
    image: 'https://images.unsplash.com/photo-1549317336-206569e8475c?w=500',
    fuel: 'Flex',
    transmission: 'Automático',
    color: 'Cinza',
    doors: 5,
    category: 'SUV',
    condition: 'Seminovo',
    features: ['Ar Condicionado', 'Direção Hidráulica', 'Freios ABS', 'Airbag', 'GPS', 'Câmera de Ré']
  }
]

interface FilterState {
  search: string
  brand: string
  year: string
  priceMin: string
  priceMax: string
  fuel: string
  transmission: string
}

export default function VeiculosPage() {
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    brand: '',
    year: '',
    priceMin: '',
    priceMax: '',
    fuel: '',
    transmission: ''
  })

  // Carregar filtros da URL
  useEffect(() => {
    const newFilters: FilterState = {
      search: searchParams.get('search') || '',
      brand: searchParams.get('brand') || '',
      year: searchParams.get('year') || '',
      priceMin: searchParams.get('priceMin') || '',
      priceMax: searchParams.get('priceMax') || '',
      fuel: searchParams.get('fuel') || '',
      transmission: searchParams.get('transmission') || ''
    }
    setFilters(newFilters)
  }, [searchParams])

  // Filtrar veículos
  const filteredVehicles = useMemo(() => {
    let filtered = [...allVehicles]

    // Busca por texto
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(vehicle => 
        vehicle.brand.toLowerCase().includes(searchTerm) ||
        vehicle.model.toLowerCase().includes(searchTerm) ||
        `${vehicle.brand} ${vehicle.model}`.toLowerCase().includes(searchTerm)
      )
    }

    // Filtros específicos
    if (filters.brand) {
      filtered = filtered.filter(vehicle => vehicle.brand === filters.brand)
    }

    if (filters.year) {
      filtered = filtered.filter(vehicle => vehicle.year.toString() === filters.year)
    }

    if (filters.priceMin) {
      filtered = filtered.filter(vehicle => vehicle.price >= parseInt(filters.priceMin))
    }

    if (filters.priceMax) {
      filtered = filtered.filter(vehicle => vehicle.price <= parseInt(filters.priceMax))
    }

    if (filters.fuel) {
      filtered = filtered.filter(vehicle => vehicle.fuel === filters.fuel)
    }

    if (filters.transmission) {
      filtered = filtered.filter(vehicle => vehicle.transmission === filters.transmission)
    }


    return filtered
  }, [filters])

  const handleFilter = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-4">
            Nossa Frota de <span className="text-primary-600">Veículos</span>
          </h1>
          <p className="text-lg text-secondary-600 max-w-3xl mx-auto">
            Encontre o veículo perfeito para você. Todos os nossos carros passam por rigorosa inspeção e vêm com garantia.
          </p>
        </div>

        {/* Filtros */}
        <VehicleFilter 
          onFilter={handleFilter}
          totalResults={filteredVehicles.length}
        />

        {/* Grid de Veículos */}
        {filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🚗</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Nenhum veículo encontrado
            </h3>
            <p className="text-gray-600 mb-6">
              Tente ajustar os filtros para encontrar mais veículos.
            </p>
            <button
              onClick={() => setFilters({
                search: '',
                brand: '',
                year: '',
                priceMin: '',
                priceMax: '',
                fuel: '',
                transmission: ''
              })}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        )}

        {/* Paginação */}
        {filteredVehicles.length > 0 && (
          <div className="flex justify-center mt-12">
            <div className="flex space-x-2">
              <button className="px-3 py-2 text-secondary-600 hover:text-primary-600 border border-secondary-300 rounded-lg hover:border-primary-300">
                Anterior
              </button>
              <button className="px-3 py-2 bg-primary-600 text-white rounded-lg">
                1
              </button>
              <button className="px-3 py-2 text-secondary-600 hover:text-primary-600 border border-secondary-300 rounded-lg hover:border-primary-300">
                2
              </button>
              <button className="px-3 py-2 text-secondary-600 hover:text-primary-600 border border-secondary-300 rounded-lg hover:border-primary-300">
                Próximo
              </button>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  )
}