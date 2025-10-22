'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import AdminSidebar from '@/components/AdminSidebar'
import ConfirmModal from '@/components/ConfirmModal'
import { useSales } from '@/hooks/useSales'
import { SalesService } from '@/services/salesService'
import { PDFService } from '@/services/pdfService'
import { toast } from 'sonner'
import { 
  DollarSign, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Menu,
  LogOut,
  Settings,
  Calendar,
  User,
  Car,
  TrendingUp,
  FileText,
  Download
} from 'lucide-react'

export default function AdminVendas() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [deleteModal, setDeleteModal] = useState<{isOpen: boolean, saleId: string, saleCode: string}>({
    isOpen: false,
    saleId: '',
    saleCode: ''
  })
  const router = useRouter()
  
  // Buscar vendas do Supabase - SEMPRE NO TOPO, ANTES DE QUALQUER RETURN
  const { 
    sales: allSales, 
    loading: salesLoading, 
    error: salesError,
    totalSales,
    totalCommission,
    pendingSales
  } = useSales()

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

  const handleDeleteSale = async () => {
    try {
      await SalesService.deleteSale(deleteModal.saleId)
      toast.success('Venda excluída com sucesso!')
      // Recarregar a lista de vendas
      window.location.reload()
    } catch (error) {
      console.error('Erro ao excluir venda:', error)
      toast.error('Erro ao excluir venda. Tente novamente.')
    }
  }

  const openDeleteModal = (saleId: string, saleCode: string) => {
    setDeleteModal({ isOpen: true, saleId, saleCode })
  }

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, saleId: '', saleCode: '' })
  }

  const handleGeneratePDF = async (sale: {
    id: string
    sale_code?: string
    client?: { name: string; email: string; phone: string; cpf?: string }
    vehicle?: { brand: string; model: string; year: number }
    seller?: { name: string }
    total_amount?: number
    price?: number
    payment_method: string
    sale_date: string
    commission_rate: number
    commission_amount?: number
    notes?: string
  }) => {
    try {
      console.log('🔍 DEBUG - Dados da venda:', sale)
      
      const pdfData = {
        saleCode: sale.sale_code || `VND-${sale.id}`,
        clientName: sale.client?.name || 'Cliente não informado',
        clientEmail: sale.client?.email || 'Email não informado',
        clientPhone: sale.client?.phone || 'Telefone não informado',
        clientCpf: sale.client?.cpf || 'CPF não informado',
        vehicleBrand: sale.vehicle?.brand || 'Marca não informada',
        vehicleModel: sale.vehicle?.model || 'Modelo não informado',
        vehicleYear: sale.vehicle?.year || new Date().getFullYear(),
        vehiclePrice: sale.price || 0,
        paymentMethod: sale.payment_method || 'Não informado',
        saleDate: sale.sale_date || new Date().toISOString().split('T')[0],
        sellerName: sale.seller?.name || 'Vendedor não informado',
        commission: sale.commission_amount || 0,
        notes: sale.notes || ''
      }
      
      console.log('📄 DEBUG - Dados do PDF:', pdfData)
      
      await PDFService.generateSalePDF(pdfData)
      toast.success('PDF gerado com sucesso!')
    } catch (error) {
      console.error('❌ Erro ao gerar PDF:', error)
      toast.error('Erro ao gerar PDF. Tente novamente.')
    }
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

  // Filtrar vendas
  const filteredSales = allSales.filter(sale => {
    const matchesSearch = sale.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${sale.vehicle.brand} ${sale.vehicle.model}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.sale_code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || sale.status.toLowerCase() === filterStatus.toLowerCase()
    return matchesSearch && matchesStatus
  })

  // Loading state
  if (salesLoading) {
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
  if (salesError) {
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
              Erro ao carregar vendas
            </h3>
            <p className="text-gray-600 mb-6">
              {salesError}
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
                    Vendas
                  </h1>
                  <p className="text-sm text-secondary-600">Controle de vendas e comissões</p>
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
          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-600 mb-1">Total de Vendas</p>
                  <p className="text-2xl font-bold text-secondary-900">
                    {totalSales.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-600 mb-1">Comissões</p>
                  <p className="text-2xl font-bold text-secondary-900">
                    {totalCommission.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-600 mb-1">Pendentes</p>
                  <p className="text-2xl font-bold text-secondary-900">{pendingSales}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Ações e Filtros */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => router.push('/admin/vendas/nova')}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nova Venda</span>
                </button>
                <button 
                  onClick={() => router.push('/admin/vendas/relatorios')}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-secondary-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>Relatório</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
                  <input
                    type="text"
                    placeholder="Buscar vendas..."
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
                  <option value="concluída">Concluída</option>
                  <option value="pendente">Pendente</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
            </div>
          </div>

          {/* Lista de Vendas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Cliente</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Veículo</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Valor</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Data</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Vendedor</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredSales.map((sale, index) => (
                    <motion.tr
                      key={sale.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-secondary-600">{sale.sale_code}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-primary-600" />
                          </div>
                          <span className="font-medium text-secondary-900">{sale.client.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Car className="w-4 h-4 text-secondary-400" />
                          <span className="text-secondary-900">{sale.vehicle.brand} {sale.vehicle.model} {sale.vehicle.year}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-secondary-900">
                            {sale.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </div>
                          <div className="text-sm text-secondary-600">{sale.payment_method}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          sale.status === 'completed' 
                            ? 'bg-green-100 text-green-800'
                            : sale.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {sale.status === 'completed' ? 'Concluída' :
                           sale.status === 'pending' ? 'Pendente' :
                           sale.status === 'cancelled' ? 'Cancelada' : 'Reembolsada'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-secondary-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{new Date(sale.sale_date).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-secondary-900">{sale.seller.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col md:flex-row gap-2 md:gap-1">
                          <button 
                            onClick={() => router.push(`/admin/vendas/${sale.id}`)}
                            className="flex items-center justify-center gap-1 px-3 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors text-sm font-medium border border-primary-200 hover:border-primary-300 min-h-[36px]"
                          >
                            <Eye className="w-4 h-4 shrink-0" />
                            <span className="hidden md:inline">Ver</span>
                          </button>
                          <button 
                            onClick={() => handleGeneratePDF(sale)}
                            className="flex items-center justify-center gap-1 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors text-sm font-medium border border-green-200 hover:border-green-300 min-h-[36px]"
                          >
                            <Download className="w-4 h-4 shrink-0" />
                            <span className="hidden md:inline">PDF</span>
                          </button>
                          <button 
                            onClick={() => router.push(`/admin/vendas/editar/${sale.id}`)}
                            className="flex items-center justify-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium border border-blue-200 hover:border-blue-300 min-h-[36px]"
                          >
                            <Edit className="w-4 h-4 shrink-0" />
                            <span className="hidden md:inline">Editar</span>
                          </button>
                          <button 
                            onClick={() => openDeleteModal(sale.id, sale.sale_code)}
                            className="flex items-center justify-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium border border-red-200 hover:border-red-300 min-h-[36px]"
                          >
                            <Trash2 className="w-4 h-4 shrink-0" />
                            <span className="hidden md:inline">Excluir</span>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Estado Vazio */}
          {filteredSales.length === 0 && (
            <div className="text-center py-16">
              <DollarSign className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-secondary-800 mb-2">
                Nenhuma venda encontrada
              </h3>
              <p className="text-secondary-600 mb-6">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Tente ajustar os filtros de busca.'
                  : 'Comece registrando sua primeira venda.'
                }
              </p>
              <button 
                onClick={() => router.push('/admin/vendas/nova')}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Nova Venda</span>
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Modal de Confirmação */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteSale}
        title="Excluir Venda"
        message={`Tem certeza que deseja excluir a venda "${deleteModal.saleCode}"? Esta ação não pode ser desfeita.`}
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  )
}
