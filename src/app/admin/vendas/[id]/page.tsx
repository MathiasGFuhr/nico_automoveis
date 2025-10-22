'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import AdminSidebar from '@/components/AdminSidebar'
import ConfirmModal from '@/components/ConfirmModal'
import { SalesService } from '@/services/salesService'
import { PDFService } from '@/services/pdfService'
import { toast } from 'sonner'
import { 
  ArrowLeft,
  User,
  Car,
  DollarSign,
  Calendar,
  FileText,
  Download,
  Edit,
  Trash2,
  Phone,
  Mail,
  CreditCard,
  Menu,
  LogOut,
  Settings
} from 'lucide-react'

export default function VerVenda() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sale, setSale] = useState<{
    id: string
    sale_code: string
    sale_date: string
    total_amount: number
    payment_method: string
    status: string
    commission_rate: number
    commission_amount: number
    notes?: string
    client: { id: string; name: string; email: string; phone: string }
    vehicle: { id: string; model: string; year: number; brand: string }
    seller: { id: string; name: string }
  } | null>(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const router = useRouter()
  const params = useParams()
  const saleId = params.id as string

  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem('adminAuth')
      if (auth === 'true') {
        setIsAuthenticated(true)
        loadSale()
      } else {
        router.push('/admin/login')
      }
      setIsLoading(false)
    }
    checkAuth()
  }, [router])

  const loadSale = async () => {
    try {
      const saleData = await SalesService.getSaleById(saleId)
      setSale(saleData)
    } catch (error) {
      console.error('Erro ao carregar venda:', error)
      toast.error('Erro ao carregar dados da venda')
      router.push('/admin/vendas')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    localStorage.removeItem('adminUser')
    document.cookie = 'adminAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    router.push('/admin/login')
  }

  const handleGeneratePDF = async () => {
    if (!sale) return
    
    try {
      const pdfData = {
        saleCode: sale.sale_code || `VND-${sale.id}`,
        clientName: sale.client.name,
        clientEmail: sale.client.email,
        clientPhone: sale.client.phone,
        clientCpf: (sale.client as any).cpf || 'Não informado',
        vehicleBrand: sale.vehicle.brand,
        vehicleModel: sale.vehicle.model,
        vehicleYear: sale.vehicle.year,
        vehiclePrice: sale.total_amount,
        paymentMethod: sale.payment_method,
        saleDate: sale.sale_date,
        sellerName: sale.seller.name,
        commission: sale.commission_amount,
        notes: sale.notes
      }

      await PDFService.generateSalePDF(pdfData)
      toast.success('PDF gerado com sucesso!')
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      toast.error('Erro ao gerar PDF. Tente novamente.')
    }
  }

  const handleDelete = async () => {
    if (!sale) return
    
    try {
      await SalesService.deleteSale(sale.id)
      toast.success('Venda excluída com sucesso!')
      router.push('/admin/vendas')
    } catch (error) {
      console.error('Erro ao excluir venda:', error)
      toast.error('Erro ao excluir venda. Tente novamente.')
    }
  }

  if (isLoading || !sale) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-secondary-50">
      <AdminSidebar 
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        {/* Header */}
        <header className="bg-white border-b border-secondary-200 sticky top-0 z-40 px-6 py-4">
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
                <h1 className="text-2xl font-bold text-secondary-900">Detalhes da Venda</h1>
                <p className="text-sm text-secondary-600">Venda #{sale.sale_code}</p>
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

        <main className="p-6 max-w-6xl mx-auto">
          {/* Botões de Ação */}
          <div className="mb-6 flex flex-wrap gap-3">
            <button
              onClick={() => router.push('/admin/vendas')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
            <button
              onClick={handleGeneratePDF}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Baixar PDF
            </button>
            <button
              onClick={() => router.push(`/admin/vendas/editar/${sale.id}`)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Editar
            </button>
            <button
              onClick={() => setDeleteModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Excluir
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informações do Cliente */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-secondary-900">Cliente</h2>
                  <p className="text-sm text-secondary-600">Informações do comprador</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-secondary-600">Nome</label>
                  <p className="text-lg font-semibold text-secondary-900">{sale.client.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-secondary-600">CPF</label>
                  <p className="text-lg text-secondary-900">{(sale.client as any).cpf || 'Não informado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-secondary-600">Email</label>
                  <div className="flex items-center gap-2 text-secondary-900">
                    <Mail className="w-4 h-4 text-secondary-400" />
                    <p>{sale.client.email}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-secondary-600">Telefone</label>
                  <div className="flex items-center gap-2 text-secondary-900">
                    <Phone className="w-4 h-4 text-secondary-400" />
                    <p>{sale.client.phone}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Informações do Veículo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Car className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-secondary-900">Veículo</h2>
                  <p className="text-sm text-secondary-600">Veículo vendido</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-secondary-600">Marca/Modelo</label>
                  <p className="text-lg font-semibold text-secondary-900">
                    {sale.vehicle.brand} {sale.vehicle.model}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-secondary-600">Ano</label>
                  <p className="text-lg text-secondary-900">{sale.vehicle.year}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-secondary-600">Combustível</label>
                  <p className="text-lg text-secondary-900">{(sale.vehicle as any).fuel_type || 'Não informado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-secondary-600">Transmissão</label>
                  <p className="text-lg text-secondary-900">{(sale.vehicle as any).transmission || 'Não informado'}</p>
                </div>
              </div>
            </motion.div>

            {/* Informações Financeiras */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-secondary-900">Financeiro</h2>
                  <p className="text-sm text-secondary-600">Valores e pagamento</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <label className="text-sm font-medium text-green-700">Valor da Venda</label>
                  <p className="text-3xl font-bold text-green-700">
                    {sale.total_amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-secondary-600">Forma de Pagamento</label>
                  <div className="flex items-center gap-2 text-secondary-900">
                    <CreditCard className="w-4 h-4 text-secondary-400" />
                    <p className="text-lg font-semibold">{sale.payment_method}</p>
                  </div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <label className="text-sm font-medium text-yellow-700">Desconto ({sale.commission_rate}%)</label>
                  <p className="text-2xl font-bold text-yellow-700">
                    {sale.commission_amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Informações da Venda */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-secondary-900">Detalhes</h2>
                  <p className="text-sm text-secondary-600">Informações da venda</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-secondary-600">Código da Venda</label>
                  <p className="text-lg font-mono font-semibold text-secondary-900">{sale.sale_code}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-secondary-600">Data da Venda</label>
                  <div className="flex items-center gap-2 text-secondary-900">
                    <Calendar className="w-4 h-4 text-secondary-400" />
                    <p className="text-lg">{new Date(sale.sale_date).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-secondary-600">Vendedor</label>
                  <p className="text-lg font-semibold text-secondary-900">{sale.seller.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-secondary-600">Status</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
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
                </div>
              </div>
            </motion.div>
          </div>

          {/* Observações */}
          {sale.notes && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 bg-white rounded-xl shadow-sm border border-secondary-200 p-6"
            >
              <h2 className="text-xl font-bold text-secondary-900 mb-4">Observações</h2>
              <p className="text-secondary-700 leading-relaxed">{sale.notes}</p>
            </motion.div>
          )}
        </main>
      </div>

      {/* Modal de Confirmação */}
      <ConfirmModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        title="Excluir Venda"
        message={`Tem certeza que deseja excluir a venda "${sale?.sale_code}"? Esta ação não pode ser desfeita.`}
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  )
}

