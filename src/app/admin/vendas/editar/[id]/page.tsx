'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import AdminSidebar from '@/components/AdminSidebar'
import { ClientService } from '@/services/clientService'
import { VehicleService } from '@/services/vehicleService'
import { SalesService } from '@/services/salesService'
import { SellerService } from '@/services/sellerService'
import { toast } from 'sonner'
import { 
  Save,
  Menu,
  LogOut,
  Settings,
  ArrowLeft
} from 'lucide-react'

export default function EditarVenda() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const params = useParams()
  const saleId = params.id as string

  const [formData, setFormData] = useState({
    clientId: '',
    vehicleId: '',
    price: '',
    paymentMethod: 'À vista',
    sellerId: '',
    saleDate: new Date().toISOString().split('T')[0],
    status: 'pending' as 'pending' | 'completed' | 'cancelled' | 'refunded',
    notes: '',
    commissionRate: '5'
  })

  const [clients, setClients] = useState<{id: string, name: string, email: string, phone?: string, cpf?: string}[]>([])
  const [vehicles, setVehicles] = useState<{id: string, brand: string, model: string, price: number}[]>([])
  const [sellers, setSellers] = useState<{id: string, name: string}[]>([])

  // Verificar autenticação e carregar dados
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

  // Carregar dados da venda e listas
  useEffect(() => {
    const loadData = async () => {
      if (isAuthenticated) {
        try {
          const [saleData, clientsData, vehiclesData, sellersData] = await Promise.all([
            SalesService.getSaleById(saleId),
            ClientService.getClients(),
            VehicleService.getAvailableVehicles(),
            SellerService.getSellers()
          ])

          // Preencher formulário com dados da venda
          setFormData({
            clientId: saleData.client.id,
            vehicleId: saleData.vehicle.id,
            price: saleData.price.toString(),
            paymentMethod: saleData.payment_method,
            sellerId: saleData.seller.id,
            saleDate: saleData.sale_date,
            status: saleData.status,
            notes: saleData.notes || '',
            commissionRate: saleData.commission_rate?.toString() || '5'
          })

          setClients(clientsData)
          
          // Incluir o veículo atual da venda na lista (mesmo que esteja vendido)
          const currentVehicle = {
            id: saleData.vehicle.id,
            brand: saleData.vehicle.brands.name,
            model: saleData.vehicle.model,
            price: saleData.price
          }
          
          // Adicionar o veículo atual se não estiver na lista de disponíveis
          const vehicleExists = vehiclesData.some((v: { id: string }) => v.id === currentVehicle.id)
          if (!vehicleExists) {
            setVehicles([currentVehicle, ...vehiclesData])
          } else {
            setVehicles(vehiclesData)
          }
          
          setSellers(sellersData)
        } catch (error) {
          console.error('Erro ao carregar dados:', error)
          toast.error('Erro ao carregar dados da venda')
          router.push('/admin/vendas')
        }
      }
    }
    loadData()
  }, [isAuthenticated, saleId, router])

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    localStorage.removeItem('adminUser')
    document.cookie = 'adminAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    router.push('/admin/login')
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleVehicleChange = (vehicleId: string) => {
    const selectedVehicle = vehicles.find(v => v.id === vehicleId)
    if (selectedVehicle) {
      setFormData(prev => ({
        ...prev,
        vehicleId: vehicleId,
        price: selectedVehicle.price.toString()
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.clientId || !formData.vehicleId || !formData.price || !formData.sellerId) {
      toast.error('Por favor, preencha todos os campos obrigatórios')
      return
    }

    setIsSaving(true)

    try {
      const price = parseFloat(formData.price)
      const commissionRate = parseFloat(formData.commissionRate)
      
      const saleData = {
        client_id: formData.clientId,
        vehicle_id: formData.vehicleId,
        seller_id: formData.sellerId,
        price: price,
        commission_rate: commissionRate,
        payment_method: formData.paymentMethod,
        status: formData.status,
        sale_date: formData.saleDate,
        notes: formData.notes || null
      }

      await SalesService.updateSale(saleId, saleData)
      
      toast.success('Venda atualizada com sucesso!')
      router.push('/admin/vendas')
    } catch (error) {
      console.error('Erro ao atualizar venda:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar venda. Tente novamente.'
      toast.error(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
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
        setIsCollapsed={setSidebarCollapsed}
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
                <h1 className="text-2xl font-bold text-secondary-900">Editar Venda</h1>
                <p className="text-sm text-secondary-600">Atualize as informações da venda</p>
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

        <main className="p-6 max-w-5xl mx-auto">
          <button
            onClick={() => router.push('/admin/vendas')}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Informações do Cliente */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6"
              >
                <h2 className="text-xl font-bold text-secondary-900 mb-6">Cliente</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Cliente *
                    </label>
                    <select
                      value={formData.clientId}
                      onChange={(e) => handleInputChange('clientId', e.target.value)}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      <option value="">Selecione o cliente</option>
                      {clients.map(client => (
                        <option key={client.id} value={client.id}>
                          {client.name} - {client.email}
                        </option>
                      ))}
                    </select>
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
                <h2 className="text-xl font-bold text-secondary-900 mb-6">Veículo</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Veículo *
                    </label>
                    <select
                      value={formData.vehicleId}
                      onChange={(e) => handleVehicleChange(e.target.value)}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      <option value="">Selecione o veículo</option>
                      {vehicles.map(vehicle => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.brand} {vehicle.model} - R$ {vehicle.price.toLocaleString('pt-BR')}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Preço da Venda *
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="85000.00"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
              </motion.div>

              {/* Informações de Pagamento */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6"
              >
                <h2 className="text-xl font-bold text-secondary-900 mb-6">Pagamento</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Forma de Pagamento *
                    </label>
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      <option value="À vista">À vista</option>
                      <option value="Financiamento">Financiamento</option>
                      <option value="Consórcio">Consórcio</option>
                      <option value="Parcelado">Parcelado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Taxa de Desconto (%) *
                    </label>
                    <input
                      type="number"
                      value={formData.commissionRate}
                      onChange={(e) => handleInputChange('commissionRate', e.target.value)}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="5"
                      step="0.01"
                      min="0"
                      max="100"
                      required
                    />
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
                <h2 className="text-xl font-bold text-secondary-900 mb-6">Venda</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Vendedor *
                    </label>
                    <select
                      value={formData.sellerId}
                      onChange={(e) => handleInputChange('sellerId', e.target.value)}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      <option value="">Selecione o vendedor</option>
                      {sellers.map(seller => (
                        <option key={seller.id} value={seller.id}>
                          {seller.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Data da Venda *
                    </label>
                    <input
                      type="date"
                      value={formData.saleDate}
                      onChange={(e) => handleInputChange('saleDate', e.target.value)}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Status *
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      <option value="pending">Pendente</option>
                      <option value="completed">Concluída</option>
                      <option value="cancelled">Cancelada</option>
                      <option value="refunded">Reembolsada</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Observações */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 bg-white rounded-xl shadow-sm border border-secondary-200 p-6"
            >
              <h2 className="text-xl font-bold text-secondary-900 mb-6">Observações</h2>
              
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows={4}
                placeholder="Observações adicionais sobre a venda..."
              />
            </motion.div>

            {/* Botões */}
            <div className="mt-8 flex gap-4">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                <Save className="w-5 h-5" />
                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
              
              <button
                type="button"
                onClick={() => router.push('/admin/vendas')}
                className="px-6 py-4 bg-white border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors font-semibold"
              >
                Cancelar
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}

