'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import AdminSidebar from '@/components/AdminSidebar'
import { VehicleService } from '@/services/vehicleService'
import { ImageService } from '@/services/imageService'
import { FuelType, TransmissionType } from '@/types/vehicle'
import { VehicleImageUpload } from '@/components/VehicleImageUpload'
import { SimpleImageCard } from '@/components/SimpleImageCard'
import { toast } from 'sonner'
import { 
  Car, 
  Save,
  Menu,
  LogOut,
  Settings,
  Upload,
  X,
  Plus,
  Image as ImageIcon,
  Star
} from 'lucide-react'

export default function NovoVeiculo() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    price: '',
    mileage: '',
    fuel: '',
    transmission: '',
    color: '',
    doors: '',
    category: '',
    condition: '',
    description: '',
    city: 'Santo Cristo',
    state: 'RS',
    plateEnd: '',
    acceptsTrade: false,
    licensed: true,
    features: [] as string[],
    images: [] as File[]
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

  const handleInputChange = (field: string, value: string | string[] | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      // Buscar IDs reais das marcas e categorias
      const brands = await VehicleService.getBrands()
      const categories = await VehicleService.getCategories()
      
      // Encontrar marca
      let brandId = brands.find(b => b.name.toLowerCase() === formData.brand.toLowerCase())?.id
      if (!brandId) {
        // Se não encontrar, usar a primeira marca disponível
        if (brands.length > 0) {
          brandId = brands[0].id
        } else {
          throw new Error('Nenhuma marca encontrada. Execute o script de dados iniciais.')
        }
      }
      
      // Encontrar categoria
      let categoryId = categories.find(c => c.name.toLowerCase() === (formData.category || 'sedan').toLowerCase())?.id
      if (!categoryId) {
        // Se não encontrar, usar a primeira categoria disponível
        if (categories.length > 0) {
          categoryId = categories[0].id
        } else {
          throw new Error('Nenhuma categoria encontrada. Execute o script de dados iniciais.')
        }
      }

      // Preparar dados para o Supabase
      const vehicleData = {
        model: formData.model,
        brand_id: brandId,
        category_id: categoryId,
        year: formData.year ? parseInt(formData.year) : new Date().getFullYear(),
        price: formData.price ? parseFloat(formData.price.replace(/[^\d,]/g, '').replace(',', '.')) : 0,
        mileage: formData.mileage ? parseInt(formData.mileage) : 0,
        fuel_type: formData.fuel as FuelType,
        transmission: formData.transmission as TransmissionType,
        color: formData.color,
        doors: formData.doors ? parseInt(formData.doors) : 4, // Default para 4 portas
        city: formData.city,
        state: formData.state,
        plate_end: formData.plateEnd,
        accepts_trade: formData.acceptsTrade,
        licensed: formData.licensed,
        description: formData.description,
        status: 'available' as const,
        featured: false
      }

      // Salvar no Supabase
      const newVehicle = await VehicleService.addVehicle(vehicleData)
      
      console.log('Veículo criado com sucesso:', newVehicle)
      
      // Salvar características (features)
      try {
        await VehicleService.upsertVehicleFeatures(newVehicle.id, formData.features)
      } catch (featureError) {
        console.error('Erro ao salvar características:', featureError)
      }

      // Upload das imagens se houver
      if (formData.images.length > 0) {
        try {
          console.log(`Enviando ${formData.images.length} imagens para o veículo ${newVehicle.id}`)
          const uploadedUrls = await ImageService.uploadMultipleImages(formData.images, newVehicle.id)
          console.log(`${uploadedUrls.length} imagens enviadas com sucesso`)
        } catch (imageError) {
          console.error('Erro ao enviar imagens:', imageError)
          // Não falhar o cadastro por causa das imagens
        }
      }

      // Limpar imagens duplicadas
      try {
        await ImageService.removeDuplicateImages(newVehicle.id)
      } catch (cleanupError) {
        console.error('Erro ao limpar imagens duplicadas:', cleanupError)
      }
      
      // Disparar evento para atualizar a lista de veículos
      console.log('🚗 Veículo cadastrado com sucesso - disparando evento de atualização')
      
      // Disparar custom event para a mesma aba
      window.dispatchEvent(new CustomEvent('vehicleAdded'))
      
      // Disparar evento para outras abas via localStorage
      localStorage.setItem('vehicleAdded', 'true')
      
      // Redirecionar para a lista de veículos
      router.push('/admin/veiculos')
      } catch (error) {
        console.error('Erro ao salvar veículo:', error)
        toast.error('Erro ao salvar veículo. Tente novamente.')
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

  const brands = [
    'Toyota', 'Honda', 'Volkswagen', 'Ford', 'Chevrolet', 'Fiat',
    'Renault', 'Nissan', 'Hyundai', 'Kia', 'BMW', 'Mercedes-Benz',
    'Audi', 'Peugeot', 'Citroën', 'Jeep', 'Mitsubishi', 'Suzuki'
  ]

  const features = [
    'Ar Condicionado', 'Direção Hidráulica', 'Vidros Elétricos', 'Trava Elétrica',
    'Alarme', 'Som', 'Bluetooth', 'GPS', 'Câmera de Ré', 'Sensor de Estacionamento',
    'Airbag', 'ABS', 'Teto Solar', 'Rodas de Liga', 'Piloto Automático'
  ]

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
                    Adicionar Veículo
                  </h1>
                  <p className="text-sm text-secondary-600">Cadastrar novo veículo na frota</p>
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
                {/* Informações Básicas */}
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">Informações Básicas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Marca *
                      </label>
                      <select
                        required
                        value={formData.brand}
                        onChange={(e) => handleInputChange('brand', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Selecione a marca</option>
                        {brands.map(brand => (
                          <option key={brand} value={brand}>{brand}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Modelo *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.model}
                        onChange={(e) => handleInputChange('model', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Ex: Corolla"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Ano *
                      </label>
                      <input
                        type="number"
                        required
                        value={formData.year}
                        onChange={(e) => handleInputChange('year', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="2022"
                        min="1990"
                        max="2024"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Preço *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.price}
                        onChange={(e) => {
                          // Remover tudo que não é dígito
                          const numericValue = e.target.value.replace(/[^\d]/g, '')
                          // Converter para número e formatar
                          if (numericValue) {
                            const number = parseInt(numericValue)
                            const formatted = (number / 100).toLocaleString('pt-BR', { 
                              style: 'currency', 
                              currency: 'BRL' 
                            })
                            handleInputChange('price', formatted)
                          } else {
                            handleInputChange('price', '')
                          }
                        }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="R$ 0,00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Quilometragem *
                      </label>
                      <input
                        type="number"
                        required
                        value={formData.mileage}
                        onChange={(e) => handleInputChange('mileage', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="15000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Combustível *
                      </label>
                      <select
                        required
                        value={formData.fuel}
                        onChange={(e) => handleInputChange('fuel', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Selecione o combustível</option>
                        <option value="Flex">Flex</option>
                        <option value="Gasolina">Gasolina</option>
                        <option value="Etanol">Etanol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Híbrido">Híbrido</option>
                        <option value="Elétrico">Elétrico</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Transmissão *
                      </label>
                      <select
                        required
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
                        Cor *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.color}
                        onChange={(e) => handleInputChange('color', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Branco"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Final da Placa
                      </label>
                      <input
                        type="text"
                        value={formData.plateEnd}
                        onChange={(e) => handleInputChange('plateEnd', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="8"
                        maxLength={1}
                      />
                    </div>

                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.acceptsTrade}
                          onChange={(e) => handleInputChange('acceptsTrade', e.target.checked)}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm text-secondary-700">Aceita troca</span>
                      </label>
                      
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.licensed}
                          onChange={(e) => handleInputChange('licensed', e.target.checked)}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm text-secondary-700">Licenciado</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Características */}
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">Características</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Número de Portas
                      </label>
                      <select
                        value={formData.doors}
                        onChange={(e) => handleInputChange('doors', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Selecione</option>
                        <option value="2">2 Portas</option>
                        <option value="4">4 Portas</option>
                        <option value="5">5 Portas</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Categoria
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Selecione a categoria</option>
                        <option value="Sedan">Sedan</option>
                        <option value="Hatchback">Hatchback</option>
                        <option value="SUV">SUV</option>
                        <option value="Pickup">Pickup</option>
                        <option value="Coupé">Coupé</option>
                        <option value="Conversível">Conversível</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Condição
                      </label>
                      <select
                        value={formData.condition}
                        onChange={(e) => handleInputChange('condition', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Selecione a condição</option>
                        <option value="Seminovo">Seminovo</option>
                        <option value="Usado">Usado</option>
                        <option value="Novo">Novo</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Opcionais */}
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">Opcionais</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {features.map(feature => (
                      <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.features.includes(feature)}
                          onChange={() => handleFeatureToggle(feature)}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm text-secondary-700">{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Descrição */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Descreva o veículo, histórico, estado de conservação, etc."
                  />
                </div>

                {/* Upload de Imagens SIMPLES */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-secondary-900">Imagens do Veículo</h3>
                  <SimpleImageCard
                    onImagesChange={(files) => {
                      console.log('🖼️ Imagens alteradas:', files.length, 'arquivos')
                      setFormData(prev => ({
                        ...prev,
                        images: files
                      }))
                    }}
                    maxFiles={10}
                  />
                </div>

                {/* Botões */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => router.push('/admin/veiculos')}
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
                    <span>{isSaving ? 'Salvando...' : 'Salvar Veículo'}</span>
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
