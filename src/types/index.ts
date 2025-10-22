// Exportações centralizadas de todos os tipos

// Tipos do veículo
export type {
  Vehicle,
  VehicleSpecifications,
  VehicleSeller,
  VehicleFeatures,
  VehicleFilters,
  VehicleSearchParams
} from './vehicle'

export {
  FuelType,
  TransmissionType,
  VehicleCategory
} from './vehicle'

// Tipos comuns
export type {
  ApiResponse,
  PaginationParams,
  PaginatedResponse,
  ContactFormData,
  BreadcrumbItem,
  NavigationItem,
  ModalProps,
  ImageModalProps,
  GalleryImage,
  GalleryProps,
  SpecCategory,
  SpecItem,
  FeatureCategory,
  FilterOption,
  FilterGroup,
  SortOption,
  LoadingState,
  Notification,
  AppConfig
} from './common'

// Re-exportações para facilitar imports
export * from './vehicle'
export * from './common'
