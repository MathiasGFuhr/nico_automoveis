'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import AdminSidebar from '@/components/AdminSidebar'
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
  MoreHorizontal,
  Star,
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

  // Dados de exemplo
  const vehicles = [
    {
      id: '1',
      brand: 'Toyota',
      model: 'Corolla',
      year: 2022,
      price: 85000,
      mileage: 15000,
      status: 'Disponível',
      image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500',
      fuel: 'Flex',
      transmission: 'Automático',
      color: 'Branco',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      brand: 'Honda',
      model: 'Civic',
      year: 2021,
      price: 92000,
      mileage: 22000,
      status: 'Vendido',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500',
      fuel: 'Flex',
      transmission: 'Automático',
      color: 'Prata',
      createdAt: '2024-01-10'
    },
    {
      id: '3',
      brand: 'Volkswagen',
      model: 'Golf',
      year: 2020,
      price: 78000,
      mileage: 35000,
      status: 'Reservado',
      image: 'https://images.unsplash.com/photo-1549317336-206569e8475c?w=500',
      fuel: 'Flex',
      transmission: 'Manual',
      color: 'Azul',
      createdAt: '2024-01-08'
    },
    {
      id: '4',
      brand: 'Ford',
      model: 'Focus',
      year: 2021,
      price: 65000,
      mileage: 28000,
      status: 'Disponível',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500',
      fuel: 'Flex',
      transmission: 'Automático',
      color: 'Preto',
      createdAt: '2024-01-05'
    }
  ]

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || vehicle.status.toLowerCase() === filterStatus.toLowerCase()
    return matchesSearch && matchesStatus
  })

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
      <div className="flex-1 flex flex-col min-w-0">
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
                <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Veículo</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVehicles.map((vehicle, index) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Imagem */}
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={vehicle.image}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      vehicle.status === 'Disponível' 
                        ? 'bg-green-100 text-green-800'
                        : vehicle.status === 'Vendido'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {vehicle.status}
                    </span>
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-secondary-900 text-lg">
                        {vehicle.brand} {vehicle.model}
                      </h3>
                      <p className="text-secondary-600 text-sm">
                        {vehicle.year} • {vehicle.mileage.toLocaleString()} km
                      </p>
                    </div>
                    <button className="p-1 text-secondary-400 hover:text-secondary-600">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-secondary-600">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span className="font-semibold text-lg text-secondary-900">
                        {vehicle.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-secondary-600">
                      <Car className="w-4 h-4 mr-2" />
                      <span>{vehicle.fuel} • {vehicle.transmission}</span>
                    </div>
                    <div className="flex items-center text-sm text-secondary-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Adicionado em {new Date(vehicle.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center space-x-2">
                    <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                      <span>Ver</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                      <span>Editar</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                      <span>Excluir</span>
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
              <button className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                <Plus className="w-5 h-5" />
                <span>Adicionar Veículo</span>
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
