'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import AdminSidebar from '@/components/AdminSidebar'
import { useSales } from '@/hooks/useSales'
import { toast } from 'sonner'
import { 
  DollarSign, 
  Download,
  Menu,
  LogOut,
  Settings,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter,
  FileText
} from 'lucide-react'

export default function RelatoriosVendas() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dateRange, setDateRange] = useState('30')
  const [reportType, setReportType] = useState('sales')
  const router = useRouter()

  // Buscar dados reais do Supabase
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

  // Calcular métricas baseadas nos dados reais
  const getFilteredSales = () => {
    if (!allSales) return []
    
    const days = parseInt(dateRange)
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    
    return allSales.filter(sale => {
      const saleDate = new Date(sale.sale_date)
      return saleDate >= cutoffDate
    })
  }

  const filteredSales = getFilteredSales()
  
  // Métricas calculadas
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.price, 0)
  const totalCommissionAmount = filteredSales.reduce((sum, sale) => sum + sale.commission_amount, 0)
  const averageSaleValue = filteredSales.length > 0 ? totalRevenue / filteredSales.length : 0
  const completedSales = filteredSales.filter(sale => sale.status === 'completed').length
  const pendingSalesCount = filteredSales.filter(sale => sale.status === 'pending').length
  
  // Vendas por vendedor
  const salesBySeller = filteredSales.reduce((acc, sale) => {
    const sellerName = sale.seller.name
    if (!acc[sellerName]) {
      acc[sellerName] = { count: 0, revenue: 0 }
    }
    acc[sellerName].count += 1
    acc[sellerName].revenue += sale.price
    return acc
  }, {} as Record<string, { count: number, revenue: number }>)

  // Vendas por mês
  const salesByMonth = filteredSales.reduce((acc, sale) => {
    const month = new Date(sale.sale_date).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    if (!acc[month]) {
      acc[month] = { count: 0, revenue: 0 }
    }
    acc[month].count += 1
    acc[month].revenue += sale.price
    return acc
  }, {} as Record<string, { count: number, revenue: number }>)

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

  // Dados reais calculados acima
  const topSellersArray = Object.entries(salesBySeller)
    .map(([name, data]) => ({ name, sales: data.count, revenue: data.revenue, commission: data.revenue * 0.05 }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  const topVehiclesArray = filteredSales
    .reduce((acc, sale) => {
      const key = `${sale.vehicle.brands.name} ${sale.vehicle.model}`
      if (!acc[key]) {
        acc[key] = { brand: sale.vehicle.brands.name, model: sale.vehicle.model, sales: 0, revenue: 0 }
      }
      acc[key].sales += 1
      acc[key].revenue += sale.price
      return acc
    }, {} as Record<string, { brand: string, model: string, sales: number, revenue: number }>)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

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
                    Relatórios de Vendas
                  </h1>
                  <p className="text-sm text-secondary-600">Análise detalhada de vendas</p>
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
          {/* Filtros */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center space-x-4">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="7">Últimos 7 dias</option>
                  <option value="30">Últimos 30 dias</option>
                  <option value="90">Últimos 90 dias</option>
                  <option value="365">Último ano</option>
                </select>

                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="sales">Vendas</option>
                  <option value="vehicles">Veículos</option>
                  <option value="sellers">Vendedores</option>
                  <option value="commission">Comissões</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-secondary-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Filter className="w-4 h-4" />
                  <span>Filtros</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Exportar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Métricas Principais */}
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
                    R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+12%</span>
                  </div>
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
                  <p className="text-sm font-medium text-secondary-600 mb-1">Veículos Vendidos</p>
                  <p className="text-2xl font-bold text-secondary-900">{completedSales}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+8%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
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
                  <p className="text-sm font-medium text-secondary-600 mb-1">Comissões</p>
                  <p className="text-2xl font-bold text-secondary-900">
                    R$ {totalCommissionAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+15%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Gráficos e Tabelas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Vendas por Mês */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Vendas por Mês</h3>
              <div className="space-y-4">
                {Object.entries(salesByMonth).map(([month, data], index) => (
                  <div key={month} className="flex items-center justify-between">
                    <span className="text-secondary-600">{month}</span>
                    <div className="flex items-center space-x-4">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full" 
                          style={{ width: `${(data.revenue / Math.max(...Object.values(salesByMonth).map(d => d.revenue))) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-secondary-900 w-20 text-right">
                        R$ {data.revenue.toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Top Vendedores */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Top Vendedores</h3>
              <div className="space-y-4">
                {topSellersArray.map((seller, index) => (
                  <div key={seller.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-semibold text-sm">
                          {seller.name[0]}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-secondary-900">{seller.name}</div>
                        <div className="text-sm text-secondary-600">{seller.sales} vendas</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-secondary-900">
                        R$ {seller.revenue.toLocaleString('pt-BR')}
                      </div>
                      <div className="text-sm text-secondary-600">
                        R$ {seller.commission.toLocaleString('pt-BR')} desconto
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Top Veículos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Top Veículos Vendidos</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-900">Veículo</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-900">Vendas</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-900">Receita</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-900">Ticket Médio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {topVehiclesArray.map((vehicle, index) => (
                    <tr key={vehicle.brand} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="font-medium text-secondary-900">{vehicle.brand} {vehicle.model}</div>
                      </td>
                      <td className="px-4 py-4 text-secondary-900">{vehicle.sales}</td>
                      <td className="px-4 py-4 text-secondary-900">
                        R$ {vehicle.revenue.toLocaleString('pt-BR')}
                      </td>
                      <td className="px-4 py-4 text-secondary-900">
                        R$ {(vehicle.revenue / vehicle.sales).toLocaleString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
