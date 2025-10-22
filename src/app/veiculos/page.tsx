'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import VehicleCard from '@/components/VehicleCard'
import VehicleFilter from '@/components/VehicleFilter'
import { useVehicles } from '@/hooks/useVehicles'
import { VehicleFilters, FuelType, TransmissionType } from '@/types/vehicle'

interface FilterState {
  search: string
  brand: string
  year: string
  priceMin: string
  priceMax: string
  fuel: string
  transmission: string
}

function VeiculosContent() {
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

  // Calcular filtros da URL
  const urlFilters = useMemo(() => ({
    search: searchParams.get('search') || '',
    brand: searchParams.get('brand') || '',
    year: searchParams.get('year') || '',
    priceMin: searchParams.get('priceMin') || '',
    priceMax: searchParams.get('priceMax') || '',
    fuel: searchParams.get('fuel') || '',
    transmission: searchParams.get('transmission') || ''
  }), [searchParams])

  // Sincronizar filtros com URL apenas quando necessário
  useEffect(() => {
    setFilters(urlFilters)
  }, [urlFilters])

  // Converter filtros para o formato do Supabase
  const supabaseFilters: VehicleFilters = useMemo(() => ({
    brand: filters.brand || undefined,
    yearFrom: filters.year ? parseInt(filters.year) : undefined,
    yearTo: filters.year ? parseInt(filters.year) : undefined,
    priceFrom: filters.priceMin ? parseInt(filters.priceMin) : undefined,
    priceTo: filters.priceMax ? parseInt(filters.priceMax) : undefined,
    fuel: filters.fuel as FuelType || undefined,
    transmission: filters.transmission as TransmissionType || undefined
  }), [filters])

  // Buscar veículos do Supabase
  const { vehicles: allVehicles, loading, error } = useVehicles(supabaseFilters)

  // Filtrar veículos localmente (busca por texto e excluir vendidos)
  const filteredVehicles = useMemo(() => {
    let filtered = [...allVehicles]

    // Excluir veículos vendidos
    filtered = filtered.filter(vehicle => vehicle.status !== 'sold')

    // Busca por texto
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(vehicle => 
        vehicle.brand.toLowerCase().includes(searchTerm) ||
        vehicle.model.toLowerCase().includes(searchTerm) ||
        `${vehicle.brand} ${vehicle.model}`.toLowerCase().includes(searchTerm)
      )
    }

    return filtered
  }, [allVehicles, filters.search])

  const handleFilter = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-secondary-600">Carregando veículos...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-semibold text-red-600 mb-2">
              Erro ao carregar veículos
            </h3>
            <p className="text-gray-600 mb-6">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
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

export default function VeiculosPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-secondary-600">Carregando veículos...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <VeiculosContent />
    </Suspense>
  )
}