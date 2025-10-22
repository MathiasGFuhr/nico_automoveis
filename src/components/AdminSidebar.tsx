'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Car, 
  Users, 
  DollarSign, 
  Settings, 
  BarChart3, 
  FileText,
  ChevronLeft,
  ChevronRight,
  Home,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  LogOut
} from 'lucide-react'

interface AdminSidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

export default function AdminSidebar({ isCollapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname()

  const menuItems = [
    {
      title: 'Dashboard',
      href: '/admin/dashboard',
      icon: Home,
      active: pathname === '/admin/dashboard'
    },
    {
      title: 'Veículos',
      href: '/admin/veiculos',
      icon: Car,
      active: pathname.startsWith('/admin/veiculos'),
      submenu: [
        { title: 'Todos os Veículos', href: '/admin/veiculos' },
        { title: 'Adicionar Veículo', href: '/admin/veiculos/novo' },
        { title: 'Veículos Vendidos', href: '/admin/veiculos/vendidos' },
        { title: 'Categorias', href: '/admin/veiculos/categorias' }
      ]
    },
    {
      title: 'Clientes',
      href: '/admin/clientes',
      icon: Users,
      active: pathname.startsWith('/admin/clientes'),
      submenu: [
        { title: 'Todos os Clientes', href: '/admin/clientes' },
        { title: 'Novo Cliente', href: '/admin/clientes/novo' }
      ]
    },
    {
      title: 'Vendas',
      href: '/admin/vendas',
      icon: DollarSign,
      active: pathname.startsWith('/admin/vendas'),
      submenu: [
        { title: 'Todas as Vendas', href: '/admin/vendas' },
        { title: 'Nova Venda', href: '/admin/vendas/nova' },
        { title: 'Relatórios', href: '/admin/vendas/relatorios' }
      ]
    },
    {
      title: 'Relatórios',
      href: '/admin/relatorios',
      icon: BarChart3,
      active: pathname.startsWith('/admin/relatorios')
    },
    {
      title: 'Configurações',
      href: '/admin/configuracoes',
      icon: Settings,
      active: pathname.startsWith('/admin/configuracoes')
    }
  ]

  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleSubmenu = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-white border-r border-gray-200 h-screen flex flex-col shadow-lg fixed left-0 top-0 z-40"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex items-center space-x-3"
              >
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <Car className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-secondary-900">
                    <span className="text-primary-600">Nico</span> Admin
                  </h1>
                  <p className="text-xs text-secondary-600">Painel Administrativo</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-secondary-600" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-secondary-600" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item, index) => (
          <div key={item.title}>
            {/* Menu Item */}
            <div>
              {item.submenu ? (
                <button
                  onClick={() => toggleSubmenu(item.title)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                    item.active
                      ? 'bg-primary-50 text-primary-700 border border-primary-200'
                      : 'text-secondary-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex-1 flex items-center justify-between"
                      >
                        <span className="font-medium">{item.title}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                    item.active
                      ? 'bg-primary-50 text-primary-700 border border-primary-200'
                      : 'text-secondary-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex-1 flex items-center justify-between"
                      >
                        <span className="font-medium">{item.title}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Link>
              )}
            </div>

            {/* Submenu */}
            <AnimatePresence>
              {item.submenu && expandedItems.includes(item.title) && !isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-8 mt-1 space-y-1"
                >
                  {item.submenu.map((subItem) => (
                    <Link
                      key={subItem.title}
                      href={subItem.href}
                      className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                        pathname === subItem.href
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-secondary-600 hover:bg-gray-50 hover:text-secondary-900'
                      }`}
                    >
                      {subItem.title}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-secondary-700">A</span>
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1"
              >
                <p className="text-sm font-medium text-secondary-900">Admin</p>
                <p className="text-xs text-secondary-600">admin@nicoautomoveis.com</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
