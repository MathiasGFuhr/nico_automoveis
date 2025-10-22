'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import AdminSidebar from '@/components/AdminSidebar'
import { ClientService } from '@/services/clientService'
import { VehicleService } from '@/services/vehicleService'
import { SalesService } from '@/services/salesService'
import { SellerService } from '@/services/sellerService'
import { PDFService } from '@/services/pdfService'
import { toast } from 'sonner'
import { 
  Save,
  Menu,
  LogOut,
  Settings,
  Plus,
  X
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
    discount: '',
    hasTrade: false,
    tradeVehicleName: '',
    tradeValue: '',
    downPayment: '',
    financing: false,
    financingValue: '',
    installments: '',
    interestRate: '',
    paymentMethod: 'À vista',
    seller: '',
    saleDate: new Date().toISOString().split('T')[0],
    notes: '',
    // Campos específicos do veículo na venda
    plate: '',
    mileage: '',
    color: '',
    fuel: '',
    transmission: '',
    year: '',
    chassis: '',
    engine: ''
  })

  const [clients, setClients] = useState<{id: string, name: string, email: string, phone?: string, cpf?: string}[]>([])
  const [vehicles, setVehicles] = useState<{id: string, brand: string, model: string, price: number, year?: number, color?: string, fuel?: string, transmission?: string, mileage?: number, plateEnd?: string}[]>([])
  const [sellers, setSellers] = useState<{id: string, name: string, phone?: string}[]>([])
  const [isCreatingClient, setIsCreatingClient] = useState(false)
  const [newClientData, setNewClientData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
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

  // Carregar clientes, veículos e vendedores
  useEffect(() => {
    const loadData = async () => {
      if (isAuthenticated) {
        try {
          const [clientsData, vehiclesData, sellersData] = await Promise.all([
            ClientService.getClients(),
            VehicleService.getAvailableVehicles(), // Apenas veículos disponíveis
            SellerService.getSellers()
          ])
          console.log('🔍 DEBUG - Vendedores carregados:', sellersData)
          console.log('🚗 DEBUG - Veículos disponíveis:', vehiclesData.length)
          setClients(clientsData)
          setVehicles(vehiclesData)
          setSellers(sellersData)
        } catch (error) {
          console.error('❌ Erro ao carregar dados:', error)
          toast.error('Erro ao carregar dados')
          
          // Fallback para vendedores da revenda (Lucas e Nico)
          setSellers([
            { id: '00000000-0000-0000-0000-000000000001', name: 'Nico' },
            { id: '00000000-0000-0000-0000-000000000002', name: 'Lucas' }
          ])
        }
      }
    }
    loadData()
  }, [isAuthenticated])

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

  // Preencher dados do veículo quando selecionado
  const handleVehicleChange = (vehicleId: string) => {
    const selectedVehicle = vehicles.find(v => v.id === vehicleId)
    if (selectedVehicle) {
      setFormData(prev => ({
        ...prev,
        vehicleId: vehicleId,
        price: selectedVehicle.price.toString(),
        // Preencher automaticamente os dados do veículo
        year: selectedVehicle.year?.toString() || '',
        color: selectedVehicle.color || '',
        fuel: selectedVehicle.fuel || '',
        transmission: selectedVehicle.transmission || '',
        mileage: selectedVehicle.mileage?.toString() || '',
        plate: selectedVehicle.plateEnd || '',
        // Campos que não existem no cadastro do veículo ficam vazios
        chassis: '',
        engine: ''
      }))
    }
  }

  const handleNewClientInputChange = (field: string, value: string) => {
    setNewClientData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const toggleClientCreation = () => {
    setIsCreatingClient(!isCreatingClient)
    if (!isCreatingClient) {
      // Limpar seleção de cliente existente
      setFormData(prev => ({ ...prev, clientId: '' }))
    }
  }

  const createNewClient = async () => {
    try {
      const clientData = {
        name: newClientData.name,
        email: newClientData.email,
        phone: newClientData.phone,
        cpf: newClientData.cpf,
        city: newClientData.city,
        state: newClientData.state,
        client_type: 'buyer' as const
      }

      const newClient = await ClientService.addClient(clientData)
      
      // Atualizar lista de clientes
      setClients(prev => [...prev, newClient])
      
      // Selecionar o novo cliente
      setFormData(prev => ({ ...prev, clientId: newClient.id }))
      
      // Limpar formulário de novo cliente
      setNewClientData({
        name: '',
        email: '',
        phone: '',
        cpf: '',
        address: '',
        city: '',
        state: '',
        zipCode: ''
      })
      
      // Voltar para modo de seleção
      setIsCreatingClient(false)
      
      toast.success('Cliente criado com sucesso!')
    } catch (error) {
      console.error('Erro ao criar cliente:', error)
      toast.error('Erro ao criar cliente. Tente novamente.')
    }
  }

  const calculateFinalPrice = () => {
    const price = parseFloat(formData.price) || 0
    const discountPercent = parseFloat(formData.discount) || 0
    const discountValue = (price * discountPercent) / 100
    const tradeValue = parseFloat(formData.tradeValue) || 0
    return (price - discountValue - tradeValue).toFixed(2)
  }

  const calculateDiscountValue = () => {
    const price = parseFloat(formData.price) || 0
    const discountPercent = parseFloat(formData.discount) || 0
    return ((price * discountPercent) / 100).toFixed(2)
  }

  const calculateFinancingValue = () => {
    const price = parseFloat(formData.price) || 0
    const downPayment = parseFloat(formData.downPayment) || 0
    return (price - downPayment).toFixed(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      // Validações
      if (!formData.clientId) {
        toast.error('Selecione um cliente')
        return
      }
      
      if (!formData.vehicleId) {
        toast.error('Selecione um veículo')
        return
      }
      
      if (!formData.seller) {
        toast.error('Selecione um vendedor')
        return
      }
      
      if (!formData.price || parseFloat(formData.price) <= 0) {
        toast.error('Preço deve ser maior que zero')
        return
      }

      const finalPrice = parseFloat(calculateFinalPrice())
      
      const saleData = {
        client_id: formData.clientId,
        vehicle_id: formData.vehicleId,
        seller_id: formData.seller,
        price: finalPrice,
        commission_rate: 0.05, // 5%
        payment_method: formData.paymentMethod,
        sale_date: formData.saleDate,
        notes: formData.notes,
        status: 'completed' as const
      }

      const newSale = await SalesService.addSale(saleData)
      
      // Disparar evento para atualizar landing page
      console.log('🚗 Venda concluída, disparando eventos de atualização...')
      
      // Evento customizado
      window.dispatchEvent(new CustomEvent('vehicleSold'))
      
      // Flag no localStorage para cross-tab communication
      localStorage.setItem('vehicleSold', 'true')
      localStorage.setItem('lastVehicleUpdate', Date.now().toString())
      
      // Se há troca, criar veículo em troca
      if (formData.hasTrade && formData.tradeVehicleName && formData.tradeValue) {
        try {
          console.log('🔄 Criando veículo em troca...')
          const tradeVehicle = await VehicleService.createTradeVehicle({
            tradeVehicleName: formData.tradeVehicleName,
            tradeValue: parseFloat(formData.tradeValue),
            clientId: formData.clientId
          })
          
          console.log('✅ Veículo em troca criado:', tradeVehicle)
          
          // Disparar eventos para atualizar páginas
          console.log('🔄 Disparando eventos de atualização para veículo em troca...')
          
          // Evento customizado
          window.dispatchEvent(new CustomEvent('tradeVehicleAdded'))
          
          // Flag no localStorage para cross-tab communication
          localStorage.setItem('tradeVehicleAdded', 'true')
          
          toast.success('Veículo em troca adicionado com sucesso!')
        } catch (error) {
          console.error('Erro ao criar veículo em troca:', error)
          toast.error('Venda registrada, mas erro ao adicionar veículo em troca')
        }
      }
      
      // Buscar dados completos para o PDF
      const selectedClient = clients.find(c => c.id === formData.clientId)
      const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId)
      const selectedSeller = sellers.find(s => s.id === formData.seller)
      
      if (selectedClient && selectedVehicle && selectedSeller) {
        // Gerar PDF
        const pdfData = {
          saleCode: newSale.sale_code || `VND-${Date.now()}`,
          clientName: selectedClient.name,
          clientEmail: selectedClient.email,
          clientPhone: selectedClient.phone || 'Não informado',
          clientCpf: selectedClient.cpf || 'Não informado',
          vehicleBrand: selectedVehicle.brand,
          vehicleModel: selectedVehicle.model,
          vehicleYear: parseInt(formData.year) || new Date().getFullYear(),
          vehiclePrice: parseFloat(formData.price),
          paymentMethod: formData.paymentMethod,
          saleDate: formData.saleDate,
          sellerName: selectedSeller.name,
          sellerPhone: selectedSeller.phone || 'Não informado',
          commission: parseFloat(formData.price) * 0.05,
          notes: formData.notes,
          vehiclePlate: formData.plate,
          vehicleMileage: formData.mileage,
          vehicleColor: formData.color,
          vehicleFuel: formData.fuel,
          vehicleTransmission: formData.transmission,
          vehicleChassis: formData.chassis,
          vehicleEngine: formData.engine
        }
        
        await PDFService.generateSalePDF(pdfData)
        toast.success('Venda registrada e PDF gerado com sucesso!')
      } else {
        toast.success('Venda registrada com sucesso!')
      }
      
      router.push('/admin/vendas')
    } catch (error) {
      console.error('Erro ao salvar venda:', error)
      toast.error('Erro ao salvar venda. Tente novamente.')
    } finally {
      setIsSaving(false)
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
                      <div className="space-y-3">
                        {!isCreatingClient ? (
                          <>
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
                            <button
                              type="button"
                              onClick={toggleClientCreation}
                              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Cadastrar novo cliente</span>
                            </button>
                          </>
                        ) : (
                          <div className="border border-primary-200 rounded-lg p-4 bg-primary-50">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-sm font-medium text-primary-900">Novo Cliente</h4>
                              <button
                                type="button"
                                onClick={toggleClientCreation}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Nome *</label>
                                <input
                                  type="text"
                                  required
                                  value={newClientData.name}
                                  onChange={(e) => handleNewClientInputChange('name', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                                <input
                                  type="email"
                                  required
                                  value={newClientData.email}
                                  onChange={(e) => handleNewClientInputChange('email', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Telefone *</label>
                                <input
                                  type="tel"
                                  required
                                  value={newClientData.phone}
                                  onChange={(e) => handleNewClientInputChange('phone', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">CPF *</label>
                                <input
                                  type="text"
                                  required
                                  value={newClientData.cpf}
                                  onChange={(e) => handleNewClientInputChange('cpf', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-gray-700 mb-1">Endereço</label>
                                <input
                                  type="text"
                                  value={newClientData.address}
                                  onChange={(e) => handleNewClientInputChange('address', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Cidade</label>
                                <input
                                  type="text"
                                  value={newClientData.city}
                                  onChange={(e) => handleNewClientInputChange('city', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Estado</label>
                                <input
                                  type="text"
                                  value={newClientData.state}
                                  onChange={(e) => handleNewClientInputChange('state', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                              </div>
                            </div>
                            <div className="mt-4 flex justify-end space-x-2">
                              <button
                                type="button"
                                onClick={toggleClientCreation}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                              >
                                Cancelar
                              </button>
                              <button
                                type="button"
                                onClick={createNewClient}
                                className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
                              >
                                Criar Cliente
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Veículo *
                      </label>
                      <select
                        required
                        value={formData.vehicleId}
                        onChange={(e) => handleVehicleChange(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Selecione o veículo</option>
                        {vehicles.map(vehicle => (
                          <option key={vehicle.id} value={vehicle.id}>{vehicle.brand} {vehicle.model} - R$ {vehicle.price.toLocaleString()}</option>
                        ))}
                      </select>
                    </div>

                    {/* Campos específicos do veículo na venda */}
                    <div className="col-span-2">
                      <h3 className="text-lg font-semibold text-secondary-900 mb-4">Detalhes do Veículo na Venda</h3>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Placa do Veículo
                      </label>
                      <input
                        type="text"
                        value={formData.plate}
                        onChange={(e) => handleInputChange('plate', e.target.value.toUpperCase())}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="ABC-1234"
                        maxLength={8}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Quilometragem
                      </label>
                      <input
                        type="number"
                        value={formData.mileage}
                        onChange={(e) => handleInputChange('mileage', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="50000"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Cor do Veículo
                      </label>
                      <input
                        type="text"
                        value={formData.color}
                        onChange={(e) => handleInputChange('color', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Branco"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Combustível
                      </label>
                      <select
                        value={formData.fuel}
                        onChange={(e) => handleInputChange('fuel', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Selecione o combustível</option>
                        <option value="Gasolina">Gasolina</option>
                        <option value="Etanol">Etanol</option>
                        <option value="Flex">Flex</option>
                        <option value="Diesel">Diesel</option>
                        <option value="GNV">GNV</option>
                        <option value="Elétrico">Elétrico</option>
                        <option value="Híbrido">Híbrido</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Transmissão
                      </label>
                      <select
                        value={formData.transmission}
                        onChange={(e) => handleInputChange('transmission', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Selecione a transmissão</option>
                        <option value="Manual">Manual</option>
                        <option value="Automático">Automático</option>
                        <option value="CVT">CVT</option>
                        <option value="Semi-automático">Semi-automático</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Ano do Veículo
                      </label>
                      <input
                        type="number"
                        value={formData.year}
                        onChange={(e) => handleInputChange('year', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="2020"
                        min="1900"
                        max={new Date().getFullYear() + 1}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Chassi (VIN)
                      </label>
                      <input
                        type="text"
                        value={formData.chassis}
                        onChange={(e) => handleInputChange('chassis', e.target.value.toUpperCase())}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="1HGBH41JXMN109186"
                        maxLength={17}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Motor
                      </label>
                      <input
                        type="text"
                        value={formData.engine}
                        onChange={(e) => handleInputChange('engine', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="1.0, 1.6, 2.0, etc."
                      />
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
                        type="text"
                        required
                        value={formData.price ? parseFloat(formData.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : ''}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-700"
                        placeholder="R$ 0,00"
                        readOnly
                      />
                      <p className="text-xs text-gray-500 mt-1">Preço preenchido automaticamente do cadastro do veículo</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Desconto (%)
                      </label>
                      <input
                        type="number"
                        value={formData.discount}
                        onChange={(e) => handleInputChange('discount', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="0"
                        min="0"
                        max="100"
                        step="0.1"
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

                    <div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.hasTrade}
                          onChange={(e) => handleInputChange('hasTrade', e.target.checked)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm font-medium text-secondary-700">Há troca de veículo</span>
                      </label>
                    </div>

                    {formData.hasTrade && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Nome do Veículo na Troca *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.tradeVehicleName}
                            onChange={(e) => handleInputChange('tradeVehicleName', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Ex: Honda Civic 2020, Toyota Corolla 2019..."
                          />
                          <p className="text-xs text-gray-500 mt-1">Este veículo será adicionado à aba &quot;Veículos em Troca&quot; para completar os dados</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Valor da Troca
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                            <input
                              type="number"
                              value={formData.tradeValue}
                              onChange={(e) => handleInputChange('tradeValue', e.target.value)}
                              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              placeholder="0,00"
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {formData.paymentMethod === 'Financiamento' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Entrada
                          </label>
                          <input
                            type="text"
                            value={formData.downPayment ? parseFloat(formData.downPayment).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : ''}
                            onChange={(e) => {
                              const numericValue = e.target.value.replace(/[^\d]/g, '')
                              handleInputChange('downPayment', numericValue)
                            }}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="R$ 0,00"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Valor Financiado
                          </label>
                          <input
                            type="text"
                            value={parseFloat(calculateFinancingValue()).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-600">
                        {formData.price ? parseFloat(formData.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}
                      </div>
                      <div className="text-sm text-secondary-600">Preço Original</div>
                    </div>
                    {parseFloat(formData.discount || '0') > 0 && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          - {parseFloat(calculateDiscountValue()).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </div>
                        <div className="text-sm text-secondary-600">Desconto ({formData.discount}%)</div>
                      </div>
                    )}
                    {formData.hasTrade && parseFloat(formData.tradeValue || '0') > 0 && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          - {parseFloat(formData.tradeValue || '0').toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </div>
                        <div className="text-sm text-secondary-600">Valor da Troca</div>
                      </div>
                    )}
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {parseFloat(calculateFinalPrice()).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </div>
                      <div className="text-sm text-secondary-600">Valor Final</div>
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
