'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import AdminSidebar from '@/components/AdminSidebar'
import ConfirmModal from '@/components/ConfirmModal'
import { VehicleService } from '@/services/vehicleService'
import { toast } from 'sonner'
import { 
  Car,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Menu,
  LogOut,
  Settings,
  Search,
  Filter,
  ArrowLeft
} from 'lucide-react'

export default function VeiculosTroca() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [vehicles, setVehicles] = useState<Array<{
    id: string
    model: string
    brand: string
    year: number
    price: number
    image?: string
    status: string
  }>>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [deleteModal, setDeleteModal] = useState<{isOpen: boolean, vehicleId: string}>({
    isOpen: false,
    vehicleId: ''
  })
  const router = useRouter()

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

  const loadVehicles = async () => {
    if (isAuthenticated) {
      try {
        console.log('🔍 Carregando veículos em troca...')
        const vehiclesData = await VehicleService.getVehicles()
        console.log('🚗 Todos os veículos carregados:', vehiclesData.length)
        
        // Filtrar apenas veículos em troca (status: 'trade')
        const tradeVehicles = vehiclesData.filter(vehicle => vehicle.status === 'trade')
        console.log('🔄 Veículos em troca encontrados:', tradeVehicles.length)
        console.log('🔄 Veículos em troca:', tradeVehicles.map(v => ({ model: v.model, status: v.status })))
        
        setVehicles(tradeVehicles)
      } catch (error) {
        console.error('Erro ao carregar veículos em troca:', error)
        toast.error('Erro ao carregar veículos em troca')
      }
    }
  }

  // Carregar veículos em troca
  useEffect(() => {
    loadVehicles()
  }, [isAuthenticated])

  // Listener para atualizações quando um veículo em troca for adicionado
  useEffect(() => {
    const handleTradeVehicleAdded = () => {
      console.log('🔄 Novo veículo em troca detectado, atualizando lista...')
      loadVehicles()
    }

    // Listener para eventos customizados
    window.addEventListener('tradeVehicleAdded', handleTradeVehicleAdded)
    
    // Listener para mudanças no localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'tradeVehicleAdded' && e.newValue) {
        console.log('🔄 Mudança no localStorage detectada, atualizando veículos em troca...')
        loadVehicles()
        localStorage.removeItem('tradeVehicleAdded')
      }
    }
    
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('tradeVehicleAdded', handleTradeVehicleAdded)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    localStorage.removeItem('adminUser')
    document.cookie = 'adminAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    router.push('/admin/login')
  }

  const handleToggleVisibility = async (vehicleId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'trade' ? 'available' : 'trade'
      await VehicleService.updateVehicleStatus(vehicleId, newStatus)
      
      setVehicles(prev => prev.map(vehicle => 
        vehicle.id === vehicleId 
          ? { ...vehicle, status: newStatus }
          : vehicle
      ))
      
      toast.success(`Veículo ${newStatus === 'available' ? 'publicado' : 'movido para troca'} com sucesso!`)
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      toast.error('Erro ao atualizar status do veículo')
    }
  }

  const handleDeleteVehicle = async () => {
    try {
      await VehicleService.deleteVehicle(deleteModal.vehicleId)
      setVehicles(prev => prev.filter(vehicle => vehicle.id !== deleteModal.vehicleId))
      toast.success('Veículo excluído com sucesso!')
    } catch (error) {
      console.error('Erro ao excluir veículo:', error)
      toast.error('Erro ao excluir veículo')
    }
  }

  const openDeleteModal = (vehicleId: string) => {
    setDeleteModal({ isOpen: true, vehicleId })
  }

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, vehicleId: '' })
  }

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || vehicle.status === filterStatus
    return matchesSearch && matchesFilter
  })

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

  const sidebarCssVar = { ['--sidebar-width' as string]: sidebarCollapsed ? '80px' : '280px' }

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
                    Veículos em Troca
                  </h1>
                  <p className="text-sm text-secondary-600">Gerenciar veículos recebidos em troca</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => router.push('/admin/veiculos')}
                  className="flex items-center space-x-2 px-4 py-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Voltar</span>
                </button>
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
          <div className="max-w-7xl mx-auto">
            {/* Filtros */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Buscar veículos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="all">Todos</option>
                    <option value="trade">Em Troca</option>
                    <option value="available">Publicados</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Lista de Veículos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.map((vehicle, index) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                    {vehicle.image ? (
                      <img
                        src={vehicle.image}
                        alt={vehicle.model}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                        <Car className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-secondary-900 mb-1">
                          {vehicle.brand} {vehicle.model}
                        </h3>
                        <p className="text-sm text-secondary-600">Ano {vehicle.year}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        vehicle.status === 'trade' 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {vehicle.status === 'trade' ? 'Em Troca' : 'Publicado'}
                      </span>
                    </div>

                    <div className="mb-4">
                      <p className="text-2xl font-bold text-primary-600">
                        R$ {vehicle.price.toLocaleString('pt-BR')}
                      </p>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleToggleVisibility(vehicle.id, vehicle.status)}
                        className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          vehicle.status === 'trade'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                        }`}
                      >
                        {vehicle.status === 'trade' ? (
                          <>
                            <Eye className="w-4 h-4" />
                            <span>Publicar</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-4 h-4" />
                            <span>Mover para Troca</span>
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => router.push(`/admin/veiculos/editar/${vehicle.id}`)}
                        className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => openDeleteModal(vehicle.id)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredVehicles.length === 0 && (
              <div className="text-center py-12">
                <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhum veículo em troca encontrado
                </h3>
                <p className="text-gray-600 mb-6">
                  Os veículos recebidos em troca aparecerão aqui
                </p>
                <button
                  onClick={() => router.push('/admin/veiculos')}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ver Todos os Veículos</span>
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal de Confirmação */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteVehicle}
        title="Excluir Veículo de Troca"
        message="Tem certeza que deseja excluir este veículo? Esta ação não pode ser desfeita."
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  )
}
