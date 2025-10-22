'use client'

import { useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Filter, 
  X,
  Car,
  Fuel,
  Calendar,
  DollarSign,
  RefreshCw
} from 'lucide-react'

interface VehicleFilterProps {
  onFilter?: (filters: FilterState) => void
  totalResults?: number
  redirectOnSearch?: boolean
}

interface FilterState {
  search: string
  brand: string
  year: string
  priceMin: string
  priceMax: string
  fuel: string
  transmission: string
}

export default function VehicleFilter({ 
  onFilter, 
  totalResults = 0,
  redirectOnSearch = false
}: VehicleFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    brand: '',
    year: '',
    priceMin: '',
    priceMax: '',
    fuel: '',
    transmission: ''
  })

  // Dados para filtros
  const brands = useMemo(() => [
    'Toyota', 'Honda', 'Volkswagen', 'Ford', 'Chevrolet', 'Fiat', 
    'Renault', 'Nissan', 'Hyundai', 'Kia', 'BMW', 'Mercedes-Benz',
    'Audi', 'Peugeot', 'Citroën', 'Jeep', 'Mitsubishi', 'Suzuki'
  ], [])

  const years = Array.from({ length: 15 }, (_, i) => (2024 - i).toString())

  const handleInputChange = useCallback((field: keyof FilterState, value: string | string[]) => {
    const newFilters = { ...filters, [field]: value }
    setFilters(newFilters)
    
    if (onFilter) {
      setIsLoading(true)
      // Simular delay de API
      setTimeout(() => {
        onFilter(newFilters)
        setIsLoading(false)
      }, 200)
    }
  }, [filters, onFilter])


  const clearFilters = useCallback(() => {
    const clearedFilters: FilterState = {
      search: '',
      brand: '',
      year: '',
      priceMin: '',
      priceMax: '',
      fuel: '',
      transmission: ''
    }
    setFilters(clearedFilters)
    onFilter?.(clearedFilters)
  }, [onFilter])

  const handleSearch = useCallback(() => {
    if (redirectOnSearch) {
      // Criar URL com parâmetros de filtros
      const params = new URLSearchParams()
      
      if (filters.search) params.set('search', filters.search)
      if (filters.brand) params.set('brand', filters.brand)
      if (filters.year) params.set('year', filters.year)
      if (filters.priceMin) params.set('priceMin', filters.priceMin)
      if (filters.priceMax) params.set('priceMax', filters.priceMax)
      if (filters.fuel) params.set('fuel', filters.fuel)
      if (filters.transmission) params.set('transmission', filters.transmission)
      
      const queryString = params.toString()
      const url = queryString ? `/veiculos?${queryString}` : '/veiculos'
      
      router.push(url)
    } else {
      onFilter?.(filters)
    }
  }, [filters, redirectOnSearch, router, onFilter])

  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter(value => 
      value !== '' && 
      (Array.isArray(value) ? value.length > 0 : true)
    ).length
  }, [filters])

  const hasSearchTerm = useMemo(() => {
    return filters.search.trim().length > 0
  }, [filters.search])

  return (
    <div className="space-y-4">
      {/* Barra de Busca Principal */}
      <motion.div
        className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          {/* Busca */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por marca, modelo, palavra-chave..."
              value={filters.search}
              onChange={(e) => handleInputChange('search', e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg"
            />
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-2">
            {redirectOnSearch && (
              <button
                onClick={handleSearch}
                disabled={!hasSearchTerm}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-colors ${
                  hasSearchTerm 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Search className="w-5 h-5" />
                <span>Buscar</span>
              </button>
            )}

            {!redirectOnSearch && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors relative"
              >
                <Filter className="w-5 h-5" />
                <span>Filtros</span>
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            )}

            {!redirectOnSearch && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Resultados - apenas quando não é redirecionamento */}
        {!redirectOnSearch && (
          <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
            <span className="text-sm text-gray-600">
              {totalResults > 0 ? `${totalResults} veículos encontrados` : 'Nenhum veículo encontrado'}
            </span>
            {isLoading && (
              <RefreshCw className="w-4 h-4 animate-spin text-primary-600" />
            )}
          </div>
        )}
      </motion.div>

      {/* Filtros Expandidos - apenas quando não é redirecionamento */}
      {!redirectOnSearch && (
        <AnimatePresence>
          {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Marca */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Car className="inline w-4 h-4 mr-1" />
                  Marca
                </label>
                <select
                  value={filters.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Todas as marcas</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              {/* Ano */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Ano
                </label>
                <select
                  value={filters.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Todos os anos</option>
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Preço Mínimo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="inline w-4 h-4 mr-1" />
                  Preço Mín.
                </label>
                <input
                  type="number"
                  placeholder="R$ 0"
                  value={filters.priceMin}
                  onChange={(e) => handleInputChange('priceMin', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Preço Máximo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="inline w-4 h-4 mr-1" />
                  Preço Máx.
                </label>
                <input
                  type="number"
                  placeholder="R$ 500.000"
                  value={filters.priceMax}
                  onChange={(e) => handleInputChange('priceMax', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Combustível */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Fuel className="inline w-4 h-4 mr-1" />
                  Combustível
                </label>
                <select
                  value={filters.fuel}
                  onChange={(e) => handleInputChange('fuel', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Todos os tipos</option>
                  <option value="Flex">Flex</option>
                  <option value="Gasolina">Gasolina</option>
                  <option value="Etanol">Etanol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Híbrido">Híbrido</option>
                  <option value="Elétrico">Elétrico</option>
                </select>
              </div>

              {/* Transmissão */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transmissão
                </label>
                <select
                  value={filters.transmission}
                  onChange={(e) => handleInputChange('transmission', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Todos os tipos</option>
                  <option value="Manual">Manual</option>
                  <option value="Automático">Automático</option>
                  <option value="CVT">CVT</option>
                  <option value="Semi-automático">Semi-automático</option>
                </select>
              </div>
            </div>

            {/* Botão Limpar */}
            <div className="flex justify-center mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={clearFilters}
                className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <X className="w-5 h-5" />
                <span>Limpar Todos os Filtros</span>
              </button>
            </div>
          </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}