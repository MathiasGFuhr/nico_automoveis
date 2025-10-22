import { VehicleSpecifications } from '@/types'

interface VehicleSpecsProps {
  specifications: VehicleSpecifications
}

export default function VehicleSpecs({ specifications }: VehicleSpecsProps) {
  const specCategories = [
    {
      title: 'Motor e Performance',
      icon: '⚡',
      color: 'from-blue-500 to-blue-600',
      specs: [
        { label: 'Motor', value: specifications.motor, icon: '🔧' },
        { label: 'Potência', value: specifications.potencia, icon: '💪' },
        { label: 'Torque', value: specifications.torque, icon: '⚙️' },
        { label: 'Aceleração (0-100 km/h)', value: specifications.aceleracao, icon: '🏁' },
        { label: 'Velocidade Máxima', value: specifications.velocidade, icon: '🚀' }
      ]
    },
    {
      title: 'Transmissão e Tração',
      icon: '🔄',
      color: 'from-green-500 to-green-600',
      specs: [
        { label: 'Transmissão', value: specifications.transmissao, icon: '⚙️' },
        { label: 'Tração', value: specifications.tracao, icon: '🛞' },
        { label: 'Combustível', value: specifications.combustivel, icon: '⛽' },
        { label: 'Consumo', value: specifications.consumo, icon: '📊' }
      ]
    },
    {
      title: 'Dimensões e Capacidade',
      icon: '📏',
      color: 'from-purple-500 to-purple-600',
      specs: [
        { label: 'Comprimento', value: specifications.comprimento, icon: '📐' },
        { label: 'Largura', value: specifications.largura, icon: '📏' },
        { label: 'Altura', value: specifications.altura, icon: '📊' },
        { label: 'Entre-eixos', value: specifications.entreEixos, icon: '🔗' },
        { label: 'Peso', value: specifications.peso, icon: '⚖️' }
      ]
    },
    {
      title: 'Capacidades',
      icon: '📦',
      color: 'from-orange-500 to-orange-600',
      specs: [
        { label: 'Capacidade do Tanque', value: specifications.tanque, icon: '⛽' },
        { label: 'Porta-malas', value: specifications.portaMalas, icon: '🧳' }
      ]
    }
  ]

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-secondary-900 mb-4">
          Especificações Técnicas
        </h2>
        <p className="text-secondary-600">
          Conheça todos os detalhes técnicos do veículo
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {specCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
            {/* Header da Categoria */}
                   <div className={`bg-linear-to-r ${category.color} p-6 text-white`}>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{category.icon}</span>
                <h3 className="text-xl font-bold">{category.title}</h3>
              </div>
            </div>

            {/* Especificações */}
            <div className="p-6">
              <div className="space-y-4">
                {category.specs.map((spec, specIndex) => (
                  <div key={specIndex} className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg hover:bg-primary-50 transition-colors group">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{spec.icon}</span>
                      <span className="font-medium text-secondary-700 group-hover:text-primary-700 transition-colors">
                        {spec.label}
                      </span>
                    </div>
                    <span className="font-bold text-secondary-900 group-hover:text-primary-900 transition-colors">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
