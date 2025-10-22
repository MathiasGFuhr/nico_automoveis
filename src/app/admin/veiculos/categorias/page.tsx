'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import AdminSidebar from '@/components/AdminSidebar'
import ConfirmModal from '@/components/ConfirmModal'
import { 
  Car, 
  Plus,
  Edit,
  Trash2,
  Search,
  Menu,
  LogOut,
  Settings,
  Tag,
  Save,
  X
} from 'lucide-react'

export default function CategoriasVeiculos() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  interface Category {
    id: string
    name: string
    description: string
    vehicleCount: number
    icon: string
    color: string
  }

  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deleteModal, setDeleteModal] = useState<{isOpen: boolean, categoryId: string, categoryName: string}>({
    isOpen: false,
    categoryId: '',
    categoryName: ''
  })
  const router = useRouter()

  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    icon: 'Car'
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
  const categories = [
    {
      id: '1',
      name: 'Sedan',
      description: 'Veículos de 4 portas com porta-malas separado',
      vehicleCount: 12,
      icon: 'Car',
      color: 'blue'
    },
    {
      id: '2',
      name: 'Hatchback',
      description: 'Veículos compactos com porta-malas integrado',
      vehicleCount: 8,
      icon: 'Car',
      color: 'green'
    },
    {
      id: '3',
      name: 'SUV',
      description: 'Veículos utilitários esportivos',
      vehicleCount: 15,
      icon: 'Car',
      color: 'purple'
    },
    {
      id: '4',
      name: 'Pickup',
      description: 'Veículos de carga com caçamba',
      vehicleCount: 5,
      icon: 'Car',
      color: 'orange'
    }
  ]

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddCategory = () => {
    // Simular adição
    setShowAddForm(false)
    setNewCategory({ name: '', description: '', icon: 'Car' })
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
  }

  const handleDeleteCategory = () => {
    // Simular exclusão
    console.log('Deletar categoria:', deleteModal.categoryId)
    // Aqui você implementaria a lógica real de exclusão
    setDeleteModal({ isOpen: false, categoryId: '', categoryName: '' })
  }

  const openDeleteModal = (categoryId: string, categoryName: string) => {
    setDeleteModal({ isOpen: true, categoryId, categoryName })
  }

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, categoryId: '', categoryName: '' })
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
                    Categorias de Veículos
                  </h1>
                  <p className="text-sm text-secondary-600">Gerenciar categorias da frota</p>
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
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nova Categoria</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
                  <input
                    type="text"
                    placeholder="Buscar categorias..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-64"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Grid de Categorias */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-${category.color}-50 rounded-lg flex items-center justify-center`}>
                    <Car className={`w-6 h-6 text-${category.color}-600`} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="p-2 text-secondary-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(category.id, category.name)}
                      className="p-2 text-secondary-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-secondary-900 text-lg mb-2">
                    {category.name}
                  </h3>
                  <p className="text-secondary-600 text-sm mb-4">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary-500">
                      {category.vehicleCount} veículos
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${category.color}-100 text-${category.color}-800`}>
                      {category.name}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Modal Adicionar Categoria */}
          {showAddForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowAddForm(false)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-secondary-900">Nova Categoria</h3>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="p-2 text-secondary-600 hover:text-secondary-800 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleAddCategory(); }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Nome da Categoria
                    </label>
                    <input
                      type="text"
                      required
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Ex: Sedan"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Descrição
                    </label>
                    <textarea
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Descreva a categoria..."
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 border border-gray-300 text-secondary-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>Salvar</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}

          {/* Estado Vazio */}
          {filteredCategories.length === 0 && (
            <div className="text-center py-16">
              <Tag className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-secondary-800 mb-2">
                Nenhuma categoria encontrada
              </h3>
              <p className="text-secondary-600 mb-6">
                {searchTerm 
                  ? 'Tente ajustar os filtros de busca.'
                  : 'Comece criando sua primeira categoria.'
                }
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Nova Categoria</span>
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Modal de Confirmação */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteCategory}
        title="Excluir Categoria"
        message={`Tem certeza que deseja excluir a categoria "${deleteModal.categoryName}"? Esta ação não pode ser desfeita.`}
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  )
}
