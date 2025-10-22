'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import AdminSidebar from '@/components/AdminSidebar'
import { useAllVehicles } from '@/hooks/useAllVehicles'
import { toast } from 'sonner'
import {
  Car,
  Search,
  Menu,
  LogOut,
  Settings,
  Calendar,
  DollarSign,
  Eye,
  CheckCircle,
  Package
} from 'lucide-react'

export default function VeiculosVendidos() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()
  
  // Buscar todos os veículos do Supabase (incluindo vendidos)
  const { vehicles: allVehicles, loading: vehiclesLoading } = useAllVehicles()
  
  // Estado para armazenar IDs das vendas
  const [vehicleSaleIds, setVehicleSaleIds] = useState<Record<string, string>>({})

  // Verificar autenticação
  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem('adminAuth')
      if (auth === 'true') {
        setIsAuthenticated(true)
      } else {
        router.push('/admin/login')
      }
      setIsLoading(false)
    }
    checkAuth()
  }, [router])

  // Buscar IDs das vendas para veículos vendidos
  useEffect(() => {
    const fetchSaleIds = async () => {
      // Filtrar veículos vendidos
      const soldVehiclesFiltered = allVehicles.filter(vehicle => {
        const matchesSearch = vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
        const isSold = vehicle.status === 'sold'
        return matchesSearch && isSold
      })
      
      if (soldVehiclesFiltered.length > 0) {
        try {
          const { createClient } = await import('@/lib/supabase-client')
          const supabase = createClient()
          
          const vehicleIds = soldVehiclesFiltered.map(v => v.id)
          const { data: sales, error } = await supabase
            .from('sales')
            .select('id, vehicle_id')
            .in('vehicle_id', vehicleIds)
            .eq('status', 'completed')
          
          if (error) {
            console.error('Erro ao buscar IDs das vendas:', error)
            return
          }
          
          const saleIdsMap: Record<string, string> = {}
          sales?.forEach(sale => {
            saleIdsMap[sale.vehicle_id] = sale.id
          })
          
          setVehicleSaleIds(saleIdsMap)
          console.log('🔍 IDs das vendas carregados:', saleIdsMap)
        } catch (error) {
          console.error('Erro ao buscar IDs das vendas:', error)
        }
      }
    }
    
    fetchSaleIds()
  }, [allVehicles, searchTerm])

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    localStorage.removeItem('adminUser')
    document.cookie = 'adminAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    router.push('/admin/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  // Filtrar apenas veículos vendidos
  const soldVehicles = allVehicles.filter(vehicle => {
    const matchesSearch = vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
    const isSold = vehicle.status === 'sold'
    console.log(`🔍 DEBUG - Veículo ${vehicle.model}: status="${vehicle.status}" (tipo: ${typeof vehicle.status}), isSold=${isSold}`)
    return matchesSearch && isSold
  })

  // Debug logs
  console.log('🔍 DEBUG - Total de veículos carregados:', allVehicles.length)
  console.log('🔍 DEBUG - Veículos vendidos encontrados:', soldVehicles.length)
  console.log('🔍 DEBUG - Status dos veículos:', allVehicles.map(v => ({ model: v.model, status: v.status })))
  console.log('🔍 DEBUG - Veículos vendidos:', soldVehicles.map(v => ({ model: v.model, status: v.status })))
  console.log('🔍 DEBUG - Imagens dos veículos vendidos:', soldVehicles.map(v => ({ 
    model: v.model, 
    images: v.images, 
    image: v.image,
    imagesLength: v.images?.length,
    firstImage: v.images?.[0]
  })))

  // Loading state
  if (vehiclesLoading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex">
        <div className="hidden lg:block">
          <AdminSidebar 
            isCollapsed={sidebarCollapsed} 
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>
        <div className={`flex-1 flex items-center justify-center ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-secondary-50">
      <AdminSidebar 
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        {/* Header */}
        <header className="bg-white border-b border-secondary-200 sticky top-0 z-40 px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 hover:bg-secondary-100 rounded-lg transition-colors hidden md:block"
              >
                <Menu className="w-5 h-5 text-secondary-600" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 hover:bg-secondary-100 rounded-lg transition-colors md:hidden"
              >
                <Menu className="w-5 h-5 text-secondary-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-secondary-900">Veículos Vendidos</h1>
                <p className="text-sm text-secondary-600">Histórico de veículos que foram vendidos</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin/configuracoes')}
                className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5 text-secondary-600" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden md:inline">Sair</span>
              </button>
            </div>
          </div>
        </header>

        <main className="p-8 max-w-7xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-lg border border-green-200 p-8 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-semibold mb-2 uppercase tracking-wide">Total Vendidos</p>
                  <p className="text-4xl font-bold text-green-700">{soldVehicles.length}</p>
                  <p className="text-sm text-green-600 mt-1">veículos vendidos</p>
                </div>
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg border border-blue-200 p-8 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-semibold mb-2 uppercase tracking-wide">Valor Total</p>
                  <p className="text-4xl font-bold text-blue-700">
                    {soldVehicles.reduce((sum, v) => sum + v.price, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                  <p className="text-sm text-blue-600 mt-1">faturamento total</p>
                </div>
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl shadow-lg border border-yellow-200 p-8 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600 font-semibold mb-2 uppercase tracking-wide">Em Estoque</p>
                  <p className="text-4xl font-bold text-yellow-700">
                    {allVehicles.filter(v => v.status === 'available').length}
                  </p>
                  <p className="text-sm text-yellow-600 mt-1">veículos disponíveis</p>
                </div>
                <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Package className="w-8 h-8 text-white" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Filtros */}
          <div className="mb-10">
            <div className="relative max-w-lg">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar veículo vendido..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
              />
            </div>
          </div>

          {/* Grid de Veículos Vendidos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {soldVehicles.map((vehicle, index) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                {/* Imagem do Veículo */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                  {(() => {
                    const imageUrl = vehicle.images?.[0] || vehicle.image
                    console.log(`🔍 DEBUG - Tentando carregar imagem para ${vehicle.model}:`, imageUrl)
                    
                    if (imageUrl) {
                      return (
                        <img 
                          src={imageUrl} 
                          alt={`${vehicle.brand} ${vehicle.model}`}
                          className="w-full h-full object-cover"
                          onLoad={() => console.log(`✅ Imagem carregada para ${vehicle.model}`)}
                          onError={(e) => {
                            console.log(`❌ Erro ao carregar imagem para ${vehicle.model}:`, e.currentTarget.src)
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      )
                    } else {
                      return (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                          <Car className="w-16 h-16 text-gray-400 mb-2" />
                          <p className="text-gray-500 text-sm">Sem imagem</p>
                        </div>
                      )
                    }
                  })()}
                  
                  {/* Badge de Vendido */}
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      ✓ Vendido
                    </span>
                  </div>
                  
                  {/* Overlay gradiente */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                {/* Conteúdo do Card */}
                <div className="p-6">
                  {/* Header do Veículo */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {vehicle.brand} {vehicle.model}
                    </h3>
                    <p className="text-gray-600 text-sm">{vehicle.year} • {vehicle.color}</p>
                  </div>

                  {/* Preço */}
                  <div className="mb-4">
                    <p className="text-2xl font-bold text-green-600">
                      {vehicle.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                    <p className="text-sm text-gray-500">Valor da venda</p>
                  </div>

                  {/* Especificações */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Combustível</p>
                      <p className="font-semibold text-gray-900">{vehicle.fuel}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Transmissão</p>
                      <p className="font-semibold text-gray-900">{vehicle.transmission}</p>
                    </div>
                  </div>

                  {/* Data de Venda */}
                  <div className="flex items-center space-x-2 text-gray-600 mb-4">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      Vendido em {new Date(vehicle.created_at || Date.now()).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  {/* Botão de Ação */}
                  <button 
                    onClick={() => {
                      const saleId = vehicleSaleIds[vehicle.id]
                      if (saleId) {
                        router.push(`/admin/vendas/${saleId}`)
                      } else {
                        console.error('ID da venda não encontrado para o veículo:', vehicle.id)
                        toast.error('Erro ao carregar detalhes da venda')
                      }
                    }}
                    disabled={!vehicleSaleIds[vehicle.id]}
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                      vehicleSaleIds[vehicle.id] 
                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {vehicleSaleIds[vehicle.id] ? 'Ver Detalhes da Venda' : 'Carregando...'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Estado Vazio */}
          {soldVehicles.length === 0 && (
            <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl shadow-lg border border-gray-200 mt-8">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">
                {searchTerm ? 'Nenhum resultado encontrado' : 'Nenhum veículo vendido'}
              </h3>
              <p className="text-gray-600 text-lg max-w-md mx-auto">
                {searchTerm 
                  ? 'Tente ajustar os termos da sua busca para encontrar o que procura.'
                  : 'Quando houver vendas, elas aparecerão aqui para acompanhamento.'
                }
              </p>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-semibold"
                >
                  Limpar Busca
                </button>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

