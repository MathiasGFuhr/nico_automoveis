'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import AdminSidebar from '@/components/AdminSidebar'
import ConfirmModal from '@/components/ConfirmModal'
import { useClients } from '@/hooks/useClients'
import { ClientService } from '@/services/clientService'
import { toast } from 'sonner'
import { 
  Users, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Menu,
  LogOut,
  Settings,
  Phone,
  Mail,
  Calendar,
  Star
} from 'lucide-react'

export default function AdminClientes() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [deleteModal, setDeleteModal] = useState<{isOpen: boolean, clientId: string, clientName: string}>({
    isOpen: false,
    clientId: '',
    clientName: ''
  })
  const router = useRouter()
  
  // Buscar clientes do Supabase - SEMPRE NO TOPO, ANTES DE QUALQUER RETURN
  const { clients: allClients, loading: clientsLoading, error: clientsError } = useClients()

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

  const handleDeleteClient = async () => {
    try {
      await ClientService.deleteClient(deleteModal.clientId)
      toast.success('Cliente excluído com sucesso!')
      // Recarregar a lista de clientes
      window.location.reload()
    } catch (error) {
      console.error('Erro ao excluir cliente:', error)
      toast.error('Erro ao excluir cliente. Tente novamente.')
    }
  }

  const openDeleteModal = (clientId: string, clientName: string) => {
    setDeleteModal({ isOpen: true, clientId, clientName })
  }

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, clientId: '', clientName: '' })
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

  // Filtrar clientes
  const filteredClients = allClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.phone?.includes(searchTerm)
    const matchesType = filterType === 'all' || client.client_type.toLowerCase() === filterType.toLowerCase()
    return matchesSearch && matchesType
  })

  // Loading state
  if (clientsLoading) {
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
  if (clientsError) {
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
              Erro ao carregar clientes
            </h3>
            <p className="text-gray-600 mb-6">
              {clientsError}
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
      <div className="flex-1 flex flex-col min-w-0 lg:pl-[var(--sidebar-width)]" style={sidebarCssVar}>
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
                    Clientes
                  </h1>
                  <p className="text-sm text-secondary-600">Gerenciar base de clientes</p>
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
                  <span>Novo Cliente</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
                  <input
                    type="text"
                    placeholder="Buscar clientes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-64"
                  />
                </div>
                
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">Todos os Tipos</option>
                  <option value="comprador">Comprador</option>
                  <option value="vendedor">Vendedor</option>
                  <option value="prospect">Prospect</option>
                </select>
              </div>
            </div>
          </div>

          {/* Lista de Clientes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Cliente</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Contato</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Tipo</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Último Contato</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Avaliação</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredClients.map((client, index) => (
                    <motion.tr
                      key={client.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-600 font-semibold text-sm">
                              {client.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-secondary-900">{client.name}</div>
                            <div className="text-sm text-secondary-600">
                              {client.city}, {client.state}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-secondary-600">
                            <Phone className="w-4 h-4 mr-2" />
                            <span>{client.phone}</span>
                          </div>
                          <div className="flex items-center text-sm text-secondary-600">
                            <Mail className="w-4 h-4 mr-2" />
                            <span>{client.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          client.client_type === 'buyer' 
                            ? 'bg-green-100 text-green-800'
                            : client.client_type === 'seller'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {client.client_type === 'buyer' ? 'Comprador' : 
                           client.client_type === 'seller' ? 'Vendedor' : 'Prospect'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          client.status === 'active' 
                            ? 'bg-green-100 text-green-800'
                            : client.status === 'interested'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {client.status === 'active' ? 'Ativo' :
                           client.status === 'interested' ? 'Interessado' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-secondary-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{new Date(client.created_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < client.rating 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-secondary-600">
                            ({client.rating} estrelas)
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col md:flex-row gap-2 md:gap-1">
                          <button 
                            onClick={() => router.push(`/admin/clientes/editar/${client.id}`)}
                            className="flex items-center justify-center gap-1 px-3 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors text-sm font-medium border border-primary-200 hover:border-primary-300 min-h-[36px]"
                          >
                            <Eye className="w-4 h-4 flex-shrink-0" />
                            <span className="hidden md:inline">Ver</span>
                          </button>
                          <button 
                            onClick={() => router.push(`/admin/clientes/editar/${client.id}`)}
                            className="flex items-center justify-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium border border-blue-200 hover:border-blue-300 min-h-[36px]"
                          >
                            <Edit className="w-4 h-4 flex-shrink-0" />
                            <span className="hidden md:inline">Editar</span>
                          </button>
                          <button 
                            onClick={() => openDeleteModal(client.id, client.name)}
                            className="flex items-center justify-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium border border-red-200 hover:border-red-300 min-h-[36px]"
                          >
                            <Trash2 className="w-4 h-4 flex-shrink-0" />
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
          {filteredClients.length === 0 && (
            <div className="text-center py-16">
              <Users className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-secondary-800 mb-2">
                Nenhum cliente encontrado
              </h3>
              <p className="text-secondary-600 mb-6">
                {searchTerm || filterType !== 'all' 
                  ? 'Tente ajustar os filtros de busca.'
                  : 'Comece adicionando seu primeiro cliente.'
                }
              </p>
              <button 
                onClick={() => router.push('/admin/clientes/novo')}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Novo Cliente</span>
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Modal de Confirmação */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteClient}
        title="Excluir Cliente"
        message={`Tem certeza que deseja excluir o cliente "${deleteModal.clientName}"? Esta ação não pode ser desfeita.`}
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  )
}
