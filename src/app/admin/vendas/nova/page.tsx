'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import AdminSidebar from '@/components/AdminSidebar'
import { 
  DollarSign, 
  Save,
  Menu,
  LogOut,
  Settings,
  User,
  Car,
  Calendar,
  FileText,
  Calculator
} from 'lucide-react'

export default function NovaVenda() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    clientId: '',
    vehicleId: '',
    price: '',
    downPayment: '',
    financing: false,
    financingValue: '',
    installments: '',
    interestRate: '',
    paymentMethod: 'À vista',
    commission: '',
    seller: '',
    saleDate: new Date().toISOString().split('T')[0],
    notes: ''
  })

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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const calculateCommission = () => {
    const price = parseFloat(formData.price) || 0
    const commissionRate = 0.05 // 5%
    return (price * commissionRate).toFixed(2)
  }

  const calculateFinancingValue = () => {
    const price = parseFloat(formData.price) || 0
    const downPayment = parseFloat(formData.downPayment) || 0
    return (price - downPayment).toFixed(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSaving(false)
    router.push('/admin/vendas')
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
  const clients = [
    { id: '1', name: 'João Silva', email: 'joao@email.com' },
    { id: '2', name: 'Maria Santos', email: 'maria@email.com' },
    { id: '3', name: 'Pedro Oliveira', email: 'pedro@email.com' }
  ]

  const vehicles = [
    { id: '1', name: 'Toyota Corolla 2022', price: 85000, status: 'Disponível' },
    { id: '2', name: 'Honda Civic 2021', price: 92000, status: 'Disponível' },
    { id: '3', name: 'Volkswagen Golf 2020', price: 78000, status: 'Disponível' }
  ]

  const sellers = [
    { id: '1', name: 'Nico' },
    { id: '2', name: 'Lucas' }
  ]

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
                    Nova Venda
                  </h1>
                  <p className="text-sm text-secondary-600">Registrar nova venda</p>
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
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Informações da Venda */}
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">Informações da Venda</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Cliente *
                      </label>
                      <select
                        required
                        value={formData.clientId}
                        onChange={(e) => handleInputChange('clientId', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Selecione o cliente</option>
                        {clients.map(client => (
                          <option key={client.id} value={client.id}>{client.name} - {client.email}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Veículo *
                      </label>
                      <select
                        required
                        value={formData.vehicleId}
                        onChange={(e) => handleInputChange('vehicleId', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Selecione o veículo</option>
                        {vehicles.map(vehicle => (
                          <option key={vehicle.id} value={vehicle.id}>{vehicle.name} - R$ {vehicle.price.toLocaleString()}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Vendedor *
                      </label>
                      <select
                        required
                        value={formData.seller}
                        onChange={(e) => handleInputChange('seller', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Selecione o vendedor</option>
                        {sellers.map(seller => (
                          <option key={seller.id} value={seller.id}>{seller.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Data da Venda *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.saleDate}
                        onChange={(e) => handleInputChange('saleDate', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Valores */}
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">Valores</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Preço do Veículo *
                      </label>
                      <input
                        type="number"
                        required
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="85000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Forma de Pagamento *
                      </label>
                      <select
                        required
                        value={formData.paymentMethod}
                        onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="À vista">À vista</option>
                        <option value="Financiamento">Financiamento</option>
                        <option value="Consórcio">Consórcio</option>
                      </select>
                    </div>

                    {formData.paymentMethod === 'Financiamento' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Entrada
                          </label>
                          <input
                            type="number"
                            value={formData.downPayment}
                            onChange={(e) => handleInputChange('downPayment', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="20000"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Valor Financiado
                          </label>
                          <input
                            type="text"
                            value={calculateFinancingValue()}
                            readOnly
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Número de Parcelas
                          </label>
                          <input
                            type="number"
                            value={formData.installments}
                            onChange={(e) => handleInputChange('installments', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="48"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Taxa de Juros (% a.m.)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={formData.interestRate}
                            onChange={(e) => handleInputChange('interestRate', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="1.5"
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Comissão (5%)
                      </label>
                      <input
                        type="text"
                        value={calculateCommission()}
                        readOnly
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Observações */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Observações
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Observações sobre a venda, condições especiais, etc."
                  />
                </div>

                {/* Resumo da Venda */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-secondary-900 mb-4">Resumo da Venda</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-600">
                        R$ {formData.price ? parseFloat(formData.price).toLocaleString('pt-BR') : '0'}
                      </div>
                      <div className="text-sm text-secondary-600">Valor Total</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        R$ {calculateCommission()}
                      </div>
                      <div className="text-sm text-secondary-600">Comissão</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {formData.paymentMethod}
                      </div>
                      <div className="text-sm text-secondary-600">Pagamento</div>
                    </div>
                  </div>
                </div>

                {/* Botões */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => router.push('/admin/vendas')}
                    className="px-6 py-3 border border-gray-300 text-secondary-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Salvando...' : 'Registrar Venda'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}
