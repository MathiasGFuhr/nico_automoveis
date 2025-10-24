'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import AdminSidebar from '@/components/AdminSidebar'
import { VehicleService } from '@/services/vehicleService'
import { toast } from 'sonner'
import { 
  Save,
  Menu,
  LogOut,
  Settings,
  Star,
  StarOff,
  ArrowLeft
} from 'lucide-react'

export default function GerenciarDestaque() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [vehicles, setVehicles] = useState<Array<{
    id: string
    model: string
    brand: string
    year: number
    price: number
    mileage: number
    image?: string
    featured: boolean
  }>>([])
  const [featuredVehicles, setFeaturedVehicles] = useState<string[]>([])
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

  // Carregar veículos
  useEffect(() => {
    const loadVehicles = async () => {
      if (isAuthenticated) {
        try {
          const vehiclesData = await VehicleService.getVehicles()
          setVehicles(vehiclesData)
          
          // Carregar veículos em destaque
          const featured = vehiclesData.filter(v => v.featured).map(v => v.id)
          setFeaturedVehicles(featured)
        } catch (error) {
          console.error('Erro ao carregar veículos:', error)
          toast.error('Erro ao carregar veículos')
        }
      }
    }
    loadVehicles()
  }, [isAuthenticated])

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    localStorage.removeItem('adminUser')
    document.cookie = 'adminAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    router.push('/admin/login')
  }

  const toggleFeatured = (vehicleId: string) => {
    setFeaturedVehicles(prev => {
      if (prev.includes(vehicleId)) {
        return prev.filter(id => id !== vehicleId)
      } else {
        return [...prev, vehicleId]
      }
    })
  }

  const handleSave = async () => {
    setIsSaving(true)
    
    try {
      // Atualizar todos os veículos
      for (const vehicle of vehicles) {
        const shouldBeFeatured = featuredVehicles.includes(vehicle.id)
        
        if (vehicle.featured !== shouldBeFeatured) {
          await VehicleService.updateVehicleStatus(vehicle.id, shouldBeFeatured ? 'available' : 'available')
          // Atualizar campo featured
          await VehicleService.updateVehicle(vehicle.id, { featured: shouldBeFeatured })
        }
      }
      
      toast.success('Destaques atualizados com sucesso!')
      router.push('/admin/veiculos')
    } catch (error) {
      console.error('Erro ao salvar destaques:', error)
      toast.error('Erro ao salvar destaques. Tente novamente.')
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
                    Gerenciar Destaques
                  </h1>
                  <p className="text-sm text-secondary-600">Selecione os veículos em destaque</p>
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
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-secondary-900">
                    Veículos em Destaque
                  </h2>
                  <p className="text-sm text-secondary-600">
                    Selecione até 4 veículos para aparecerem na página inicial
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => router.push('/admin/veiculos')}
                    className="flex items-center space-x-2 px-4 py-2 text-secondary-600 hover:text-secondary-800 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Voltar</span>
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Salvando...' : 'Salvar'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {vehicles.map((vehicle) => {
                  const isFeatured = featuredVehicles.includes(vehicle.id)
                  const canAddMore = featuredVehicles.length < 4 || isFeatured
                  
                  return (
                    <motion.div
                      key={vehicle.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`relative border-2 rounded-lg p-4 transition-all duration-200 ${
                        isFeatured 
                          ? 'border-primary-500 bg-primary-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      } ${!canAddMore ? 'opacity-50' : 'cursor-pointer'}`}
                      onClick={() => canAddMore && toggleFeatured(vehicle.id)}
                    >
                      {/* Imagem do veículo */}
                      <div className="aspect-w-16 aspect-h-9 mb-4">
                        {vehicle.image ? (
                          <Image
                            src={vehicle.image}
                            alt={`${vehicle.brand} ${vehicle.model}`}
                            width={300}
                            height={128}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400 text-sm">Sem imagem</span>
                          </div>
                        )}
                      </div>

                      {/* Informações do veículo */}
                      <div className="space-y-2">
                        <h3 className="font-semibold text-secondary-900 text-sm">
                          {vehicle.brand} {vehicle.model}
                        </h3>
                        <p className="text-xs text-secondary-600">
                          {vehicle.year} • {vehicle.mileage.toLocaleString()} km
                        </p>
                        <p className="text-sm font-bold text-primary-600">
                          R$ {vehicle.price.toLocaleString()}
                        </p>
                      </div>

                      {/* Botão de destaque */}
                      <div className="absolute top-2 right-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            canAddMore && toggleFeatured(vehicle.id)
                          }}
                          disabled={!canAddMore}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                            isFeatured
                              ? 'bg-primary-600 text-white'
                              : 'bg-white text-gray-400 border border-gray-300 hover:border-primary-300'
                          } ${!canAddMore ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          {isFeatured ? (
                            <Star className="w-4 h-4 fill-current" />
                          ) : (
                            <StarOff className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* Indicador de limite */}
                      {!canAddMore && (
                        <div className="absolute inset-0 bg-gray-100 bg-opacity-75 rounded-lg flex items-center justify-center">
                          <span className="text-xs text-gray-500 font-medium">
                            Máximo 4 veículos
                          </span>
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>

              {/* Resumo */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-600">
                    Veículos selecionados: {featuredVehicles.length}/4
                  </span>
                  <span className="text-sm text-secondary-600">
                    {featuredVehicles.length === 4 ? 'Máximo atingido' : `${4 - featuredVehicles.length} restantes`}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}
