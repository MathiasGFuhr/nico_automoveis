'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import AdminSidebar from '@/components/AdminSidebar'
import ConfirmModal from '@/components/ConfirmModal'
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics'
import { useVehicles } from '@/hooks/useVehicles'
import { 
  Car, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Settings, 
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Menu
} from 'lucide-react'

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState<{isOpen: boolean, vehicleId: string, vehicleName: string}>({
    isOpen: false,
    vehicleId: '',
    vehicleName: ''
  })
  const router = useRouter()

  // Buscar métricas reais e veículos
  const metrics = useDashboardMetrics()
  const { vehicles: recentVehicles, loading: vehiclesLoading } = useVehicles()

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

  // Ações rápidas com navegação
  const handleAddVehicle = () => {
    router.push('/admin/veiculos/novo')
  }

  const handleEditVehicles = () => {
    router.push('/admin/veiculos')
  }

  const handleManageClients = () => {
    router.push('/admin/clientes')
  }

  const handleSettings = () => {
    router.push('/admin/configuracoes')
  }

  const handleViewVehicle = (id: string) => {
    router.push(`/veiculos/${id}`)
  }

  const handleEditVehicle = (id: string) => {
    router.push(`/admin/veiculos/editar/${id}`)
  }

  const handleDeleteVehicle = async () => {
    try {
      const { VehicleService } = await import('@/services/vehicleService')
      await VehicleService.deleteVehicle(deleteModal.vehicleId)
      console.log('✅ Veículo deletado com sucesso:', deleteModal.vehicleId)
      const { toast } = await import('sonner')
      toast.success('Veículo deletado com sucesso!')
      // Recarregar a página para atualizar a lista
      window.location.reload()
    } catch (error) {
      console.error('❌ Erro ao deletar veículo:', error)
      const { toast } = await import('sonner')
      toast.error('Erro ao deletar veículo. Tente novamente.')
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

  // Estatísticas com dados reais
  const stats = [
    {
      title: 'Total de Veículos',
      value: metrics.loading ? '...' : metrics.totalVehicles.toString(),
      change: `${metrics.availableVehicles} disponíveis`,
      icon: Car,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Clientes Ativos',
      value: metrics.loading ? '...' : metrics.totalClients.toString(),
      change: `${metrics.activeClients} ativos`,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Vendas Concluídas',
      value: metrics.loading ? '...' : `R$ ${(metrics.salesValue / 1000).toFixed(1)}K`,
      change: `${metrics.totalSales} vendas`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Desconto Total',
      value: metrics.loading ? '...' : `R$ ${(metrics.totalCommission / 1000).toFixed(1)}K`,
      change: `${metrics.pendingSales} pendentes`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  // Pegar apenas os 3 veículos mais recentes
  const displayVehicles = recentVehicles.slice(0, 3)

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
                    Dashboard
                  </h1>
                  <p className="text-sm text-secondary-600">Visão geral do sistema</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handleSettings}
                  className="p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
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
          {/* Título */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-secondary-900 mb-2">
              Dashboard
            </h2>
            <p className="text-secondary-600">
              Visão geral do sistema e gerenciamento de veículos
            </p>
          </div>

          {/* Estatísticas com dados reais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-secondary-900">
                      {stat.value}
                    </p>
                    <p className="text-sm text-green-600 font-medium">
                      {stat.change}
                    </p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Ações Rápidas com botões funcionais */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Ações Rápidas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button 
                onClick={handleAddVehicle}
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <Plus className="w-5 h-5 text-primary-600" />
                <span className="font-medium text-secondary-900">Adicionar Veículo</span>
              </button>
              <button 
                onClick={handleEditVehicles}
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <Edit className="w-5 h-5 text-primary-600" />
                <span className="font-medium text-secondary-900">Editar Veículos</span>
              </button>
              <button 
                onClick={handleManageClients}
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <Users className="w-5 h-5 text-primary-600" />
                <span className="font-medium text-secondary-900">Gerenciar Clientes</span>
              </button>
              <button 
                onClick={handleSettings}
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <Settings className="w-5 h-5 text-primary-600" />
                <span className="font-medium text-secondary-900">Configurações</span>
              </button>
            </div>
          </motion.div>

          {/* Veículos Recentes com dados reais */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-secondary-900">
                  Veículos Recentes
                </h3>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => router.push('/admin/veiculos')}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Ver todos
                  </button>
                </div>
              </div>
            </div>
            
            {vehiclesLoading ? (
              <div className="p-8 text-center text-secondary-600">
                <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4">Carregando veículos...</p>
              </div>
            ) : displayVehicles.length === 0 ? (
              <div className="p-8 text-center text-secondary-600">
                <p>Nenhum veículo encontrado</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {displayVehicles.map((vehicle, index) => (
                  <motion.div
                    key={vehicle.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      {vehicle.image ? (
                        <Image
                          src={vehicle.image}
                          alt={`${vehicle.brand} ${vehicle.model}`}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Car className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-secondary-900">
                          {vehicle.brand} {vehicle.model}
                        </h4>
                        <p className="text-sm text-secondary-600">
                          {vehicle.year} • {vehicle.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
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
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-1">
                          <button 
                            onClick={() => handleViewVehicle(vehicle.id)}
                            className="flex items-center justify-center gap-1 px-3 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors text-sm font-medium border border-primary-200 hover:border-primary-300 min-h-[36px]"
                            title="Visualizar"
                          >
                            <Eye className="w-4 h-4 shrink-0" />
                            <span className="hidden sm:inline">Ver</span>
                          </button>
                          <button 
                            onClick={() => handleEditVehicle(vehicle.id)}
                            className="flex items-center justify-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium border border-blue-200 hover:border-blue-300 min-h-[36px]"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4 shrink-0" />
                            <span className="hidden sm:inline">Editar</span>
                          </button>
                          <button 
                            onClick={() => openDeleteModal(vehicle.id, `${vehicle.brand} ${vehicle.model}`)}
                            className="flex items-center justify-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium border border-red-200 hover:border-red-300 min-h-[36px]"
                            title="Deletar"
                          >
                            <Trash2 className="w-4 h-4 shrink-0" />
                            <span className="hidden sm:inline">Excluir</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
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
