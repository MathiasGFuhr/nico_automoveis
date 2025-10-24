'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import AdminSidebar from '@/components/AdminSidebar'
import ConfirmModal from '@/components/ConfirmModal'
import { useVehicles } from '@/hooks/useVehicles'
import { VehicleService } from '@/services/vehicleService'
import { toast } from 'sonner'
import {
  Car,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Menu,
  LogOut,
  Settings,
  Star,
  MoreHorizontal,
  Calendar,
  DollarSign
} from 'lucide-react'

export default function AdminVeiculos() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [deleteModal, setDeleteModal] = useState<{isOpen: boolean, vehicleId: string, vehicleName: string}>({
    isOpen: false,
    vehicleId: '',
    vehicleName: ''
  })
  const router = useRouter()
  
  // Buscar veículos do Supabase - SEMPRE NO TOPO, ANTES DE QUALQUER RETURN
  const { vehicles: allVehicles, loading: vehiclesLoading, error: vehiclesError, invalidateCache } = useVehicles()

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

  // Listener para detectar novos veículos adicionados
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'vehicleAdded' && e.newValue === 'true') {
        console.log('🚗 Novo veículo detectado - atualizando lista...')
        invalidateCache()
        // Limpar o flag
        localStorage.removeItem('vehicleAdded')
      }
    }

    // Listener para mudanças no localStorage
    window.addEventListener('storage', handleStorageChange)
    
    // Listener para mudanças na mesma aba (usando custom event)
    const handleVehicleAdded = () => {
      console.log('🚗 Novo veículo detectado (mesma aba) - atualizando lista...')
      invalidateCache()
    }
    
    window.addEventListener('vehicleAdded', handleVehicleAdded)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('vehicleAdded', handleVehicleAdded)
    }
  }, [invalidateCache])

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    localStorage.removeItem('adminUser')
    document.cookie = 'adminAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    router.push('/admin/login')
  }

  const handleDeleteVehicle = async () => {
    try {
      await VehicleService.deleteVehicle(deleteModal.vehicleId)
      toast.success('Veículo excluído com sucesso!')
      // Recarregar a lista de veículos
      window.location.reload()
    } catch (error) {
      console.error('Erro ao excluir veículo:', error)
      toast.error('Erro ao excluir veículo. Tente novamente.')
    }
  }

  const openDeleteModal = (vehicleId: string, vehicleName: string) => {
    setDeleteModal({ isOpen: true, vehicleId, vehicleName })
  }

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, vehicleId: '', vehicleName: '' })
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

  // Filtrar veículos (excluir vendidos)
  const filteredVehicles = allVehicles.filter(vehicle => {
    const matchesSearch = vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || vehicle.status.toLowerCase() === filterStatus.toLowerCase()
    const notSold = vehicle.status !== 'sold' // Excluir veículos vendidos
    return matchesSearch && matchesStatus && notSold
  })

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
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  // Error state
  if (vehiclesError) {
    return (
      <div className="min-h-screen bg-secondary-50 flex">
        <div className="hidden lg:block">
          <AdminSidebar 
            isCollapsed={sidebarCollapsed} 
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
          />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-red-600 mb-2">
              Erro ao carregar veículos
            </h3>
            <p className="text-gray-600 mb-6">
              {vehiclesError}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    )
  }

  const sidebarCssVar = { ['--sidebar-width' as string]: sidebarCollapsed ? '80px' : '280px' } as React.CSSProperties
  return (
    <div className="min-h-screen bg-secondary-50 flex">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-80">
            <AdminSidebar 
              isCollapsed={false} 
              onToggle={() => setMobileMenuOpen(false)} 
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-(--sidebar-width)" style={sidebarCssVar}>
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="lg:hidden p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-xl font-bold text-secondary-900">
                    Veículos
                  </h1>
                  <p className="text-sm text-secondary-600">Gerenciar frota de veículos</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button className="p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-secondary-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sair</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Ações e Filtros */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => router.push('/admin/veiculos/novo')}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Veículo</span>
                </button>
                <button 
                  onClick={() => router.push('/admin/veiculos/destaque')}
                  className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  <Star className="w-4 h-4" />
                  <span>Gerenciar Destaques</span>
                </button>
                <button 
                  onClick={() => router.push('/admin/veiculos/troca')}
                  className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Car className="w-4 h-4" />
                  <span>Veículos em Troca</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
                  <input
                    type="text"
                    placeholder="Buscar veículos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-64"
                  />
                </div>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">Todos os Status</option>
                  <option value="disponível">Disponível</option>
                  <option value="reservado">Reservado</option>
                  <option value="vendido">Vendido</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid de Veículos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredVehicles.map((vehicle, index) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Imagem - SEM MARGENS */}
                <div className="relative h-40 sm:h-48 overflow-hidden vehicle-card">
                  {vehicle.image ? (
                    <Image
                      src={vehicle.image}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      width={300}
                      height={200}
                      className="w-full h-full object-cover"
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        display: 'block'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <Car className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      vehicle.status === 'available' 
                        ? 'bg-green-100 text-green-800'
                        : vehicle.status === 'sold'
                        ? 'bg-red-100 text-red-800'
                        : vehicle.status === 'reserved'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {vehicle.status === 'available' ? 'Disponível' :
                       vehicle.status === 'sold' ? 'Vendido' :
                       vehicle.status === 'reserved' ? 'Reservado' : 'Manutenção'}
                    </span>
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="p-3 sm:p-4">
                  <div className="flex items-start justify-between mb-2 sm:mb-3">
                    <div>
                      <h3 className="font-semibold text-secondary-900 text-base sm:text-lg line-clamp-1">
                        {vehicle.brand} {vehicle.model}
                      </h3>
                      <p className="text-secondary-600 text-xs sm:text-sm">
                        {vehicle.year} • {vehicle.mileage.toLocaleString()} km
                      </p>
                    </div>
                    <button className="p-1 text-secondary-400 hover:text-secondary-600">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2 mb-3 sm:mb-4">
                    <div className="flex items-center text-sm sm:text-base text-secondary-600">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span className="font-semibold text-base sm:text-lg text-secondary-900">
                        {vehicle.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                    <div className="flex items-center text-xs sm:text-sm text-secondary-600">
                      <Car className="w-4 h-4 mr-2" />
                      <span>{vehicle.fuel} • {vehicle.transmission}</span>
                    </div>
                    <div className="flex items-center text-xs sm:text-sm text-secondary-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Adicionado em {new Date(vehicle.created_at || new Date()).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex flex-col md:flex-row gap-2 md:gap-3">
                    <button 
                      onClick={() => router.push(`/veiculos/${vehicle.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors text-sm font-medium border border-primary-200 hover:border-primary-300 min-h-[44px]"
                    >
                      <Eye className="w-4 h-4 shrink-0" />
                      <span className="hidden md:inline">Ver</span>
                    </button>
                    <button 
                      onClick={() => router.push(`/admin/veiculos/editar/${vehicle.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium border border-blue-200 hover:border-blue-300 min-h-[44px]"
                    >
                      <Edit className="w-4 h-4 shrink-0" />
                      <span className="hidden md:inline">Editar</span>
                    </button>
                    <button 
                      onClick={() => openDeleteModal(vehicle.id, `${vehicle.brand} ${vehicle.model}`)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium border border-red-200 hover:border-red-300 min-h-[44px]"
                    >
                      <Trash2 className="w-4 h-4 shrink-0" />
                      <span className="hidden md:inline">Excluir</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Paginação */}
          {filteredVehicles.length > 0 && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center space-x-2">
                <button className="px-3 py-2 text-secondary-600 hover:text-primary-600 border border-secondary-300 rounded-lg hover:border-primary-300 transition-colors">
                  Anterior
                </button>
                <button className="px-3 py-2 bg-primary-600 text-white rounded-lg">
                  1
                </button>
                <button className="px-3 py-2 text-secondary-600 hover:text-primary-600 border border-secondary-300 rounded-lg hover:border-primary-300 transition-colors">
                  2
                </button>
                <button className="px-3 py-2 text-secondary-600 hover:text-primary-600 border border-secondary-300 rounded-lg hover:border-primary-300 transition-colors">
                  Próximo
                </button>
              </div>
            </div>
          )}

          {/* Estado Vazio */}
          {filteredVehicles.length === 0 && (
            <div className="text-center py-16">
              <Car className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-secondary-800 mb-2">
                Nenhum veículo encontrado
              </h3>
              <p className="text-secondary-600 mb-6">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Tente ajustar os filtros de busca.'
                  : 'Comece adicionando seu primeiro veículo.'
                }
              </p>
              <button 
                onClick={() => router.push('/admin/veiculos/novo')}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Adicionar Veículo</span>
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Modal de Confirmação */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteVehicle}
        title="Excluir Veículo"
        message={`Tem certeza que deseja excluir o veículo "${deleteModal.vehicleName}"? Esta ação não pode ser desfeita.`}
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  )
}
