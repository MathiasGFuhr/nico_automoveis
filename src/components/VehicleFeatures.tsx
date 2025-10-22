import type { VehicleFeatures } from '@/types'

interface VehicleFeaturesProps {
  features: VehicleFeatures['features']
}

export default function VehicleFeatures({ features }: VehicleFeaturesProps) {
  const featureCategories = [
    {
      title: 'Segurança',
      icon: '🛡️',
      items: features.filter(feature => 
        feature.toLowerCase().includes('airbag') ||
        feature.toLowerCase().includes('abs') ||
        feature.toLowerCase().includes('freio') ||
        feature.toLowerCase().includes('segurança')
      )
    },
    {
      title: 'Conforto',
      icon: '🪑',
      items: features.filter(feature => 
        feature.toLowerCase().includes('ar condicionado') ||
        feature.toLowerCase().includes('ar quente') ||
        feature.toLowerCase().includes('vidro') ||
        feature.toLowerCase().includes('direção')
      )
    },
    {
      title: 'Entretenimento',
      icon: '🎵',
      items: features.filter(feature => 
        feature.toLowerCase().includes('rádio') ||
        feature.toLowerCase().includes('bluetooth') ||
        feature.toLowerCase().includes('cd') ||
        feature.toLowerCase().includes('usb')
      )
    },
    {
      title: 'Exterior',
      icon: '🚗',
      items: features.filter(feature => 
        feature.toLowerCase().includes('desembaçador') ||
        feature.toLowerCase().includes('farol') ||
        feature.toLowerCase().includes('luz') ||
        feature.toLowerCase().includes('espelho')
      )
    }
  ]

  return (
    <div className="space-y-6">
      {featureCategories.map((category, categoryIndex) => (
        category.items.length > 0 && (
          <div key={categoryIndex} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-xl">{category.icon}</span>
              <h3 className="text-lg font-semibold text-secondary-900">
                {category.title}
              </h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {category.items.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-primary-600 text-sm">✓</span>
                  <span className="text-sm font-medium text-secondary-700">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )
      ))}
    </div>
  )
}
