// Tipos comuns reutilizáveis

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
  error?: string
}

export interface PaginationParams {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationParams
}

// Tipos para formulários
export interface ContactFormData {
  name: string
  email: string
  phone: string
  message: string
  vehicleId?: string
  vehicleName?: string
}

export interface BreadcrumbItem {
  label: string
  href: string
}

// Tipos para navegação
export interface NavigationItem {
  label: string
  href: string
  icon?: string
  children?: NavigationItem[]
}

// Tipos para modais
export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
}

export interface ImageModalProps extends ModalProps {
  images: string[]
  thumbnails: string[] // <-- ESTA É A CORREÇÃO QUE FALTAVA
  currentIndex: number
}

// Tipos para galeria
export interface GalleryImage {
  src: string
  alt: string
  caption?: string
}

export interface GalleryProps {
  images: string[]
  onImageClick?: (index: number) => void
}

// Tipos para especificações
export interface SpecCategory {
  title: string
  icon: string
  color: string
  specs: SpecItem[]
}

export interface SpecItem {
  label: string
  value: string
  icon: string
}

// Tipos para características
export interface FeatureCategory {
  title: string
  icon: string
  items: string[]
}

// Tipos para filtros
export interface FilterOption {
  label: string
  value: string | number
  count?: number
}

export interface FilterGroup {
  title: string
  options: FilterOption[]
  type: 'checkbox' | 'radio' | 'range' | 'select'
}

// Tipos para ordenação
export interface SortOption {
  label: string
  value: string
  field: string
  order: 'asc' | 'desc'
}

// Tipos para estados de loading
export interface LoadingState {
  isLoading: boolean
  error?: string
}

// Tipos para notificações
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
}

// Tipos para configurações
export interface AppConfig {
  apiUrl: string
  appName: string
  version: string
  environment: 'development' | 'staging' | 'production'
}