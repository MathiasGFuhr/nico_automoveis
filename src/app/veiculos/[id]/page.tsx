import Header from '@/components/Header'
import Footer from '@/components/Footer'
import VehicleGallery from '@/components/VehicleGallery'
import VehicleInfo from '@/components/VehicleInfo'
import ContactForm from '@/components/ContactForm'
import Breadcrumb from '@/components/Breadcrumb'
import RelatedVehicles from '@/components/RelatedVehicles'
import { Vehicle, FuelType, TransmissionType } from '@/types'

// Dados de exemplo - em produção viriam do Supabase
const vehicleData: Vehicle = {
  id: '1',
  brand: 'Toyota',
  model: 'Corolla',
  year: 2022,
  price: 85000,
  mileage: 15000,
  fuel: FuelType.FLEX,
  transmission: TransmissionType.AUTOMATICO,
  color: 'Prata',
  doors: 4,
  city: 'São Paulo',
  state: 'SP',
  plateEnd: '8',
  acceptsTrade: true,
  licensed: true,
  images: [
    'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
    'https://images.unsplash.com/photo-1549317336-206569e8475c?w=800',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
    'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800'
  ],
  description: 'Veículo em excelente estado de conservação, único dono, revisões em dia. Carro seminovo com poucos quilômetros rodados, ideal para quem busca conforto e economia.',
  features: [
    'Ar condicionado',
    'Direção hidráulica',
    'Vidros elétricos',
    'Trava elétrica',
    'Airbag duplo',
    'ABS',
    'Freio a disco',
    'Rádio CD/MP3',
    'Bluetooth',
    'Sensor de estacionamento',
    'Ar quente',
    'Desembaçador traseiro'
  ],
  specifications: {
    motor: '1.8 16V',
    potencia: '132 cv',
    torque: '17,5 kgfm',
    combustivel: 'Flex',
    transmissao: 'Automático CVT',
    tracao: 'Dianteira',
    consumo: '14,2 km/l (etanol) / 16,8 km/l (gasolina)',
    aceleracao: '10,2 segundos (0-100 km/h)',
    velocidade: '180 km/h',
    tanque: '55 litros',
    peso: '1.320 kg',
    comprimento: '4.630 mm',
    largura: '1.780 mm',
    altura: '1.435 mm',
    entreEixos: '2.700 mm',
    portaMalas: '470 litros'
  },
  seller: {
    name: 'Nico Automóveis',
    phone: '(11) 99999-9999',
    email: 'vendas@nicoautomoveis.com',
    address: 'Rua das Flores, 123 - Centro, São Paulo - SP'
  }
}

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function VehicleDetailsPage({ params }: PageProps) {
  const { id } = await params
  const vehicle = vehicleData // Em produção, buscar pelo ID

  return (
    <div className="min-h-screen bg-gradient-to from-slate-50 via-white to-slate-100">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb 
          items={[
            { label: 'Início', href: '/' },
            { label: 'Veículos', href: '/veiculos' },
            { label: `${vehicle.brand} ${vehicle.model}`, href: '#' }
          ]}
        />

        {/* Hero Section - Galeria em Destaque */}
        <div className="mt-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Galeria Principal */}
            <div className="lg:col-span-2">
              <VehicleGallery images={vehicle.images} />
            </div>

            {/* Sidebar com Informações */}
            <div className="space-y-6">
              {/* Card de Preço Premium */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-6">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Preço à Vista
                  </h3>
                  <div className="text-5xl font-bold text-primary-600 mb-2">
                    R$ {vehicle.price.toLocaleString('pt-BR')}
                  </div>
                  <p className="text-sm text-gray-500">
                    Ou consulte financiamento
                  </p>
                </div>
                
                <button className="w-full bg-linear-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                  <span>Falar no WhatsApp</span>
                </button>
              </div>

              {/* Card de Contato */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
                  📞 Contato Direto
                </h3>
                <div className="space-y-3">
                  <a 
                    href="https://wa.me/5555997121218?text=Olá! Gostaria de saber mais sobre este veículo."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">WhatsApp Nico</p>
                      <p className="text-xs text-gray-500">(55) 9 9712-1218</p>
                    </div>
                  </a>
                  
                  <a 
                    href="https://wa.me/5555996436044?text=Olá! Gostaria de saber mais sobre este veículo."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">WhatsApp Lucas</p>
                      <p className="text-xs text-gray-500">(55) 9 9643-6044</p>
                    </div>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>



        {/* Informações do Veículo */}
        <div className="mt-12">
          <VehicleInfo vehicle={vehicle} />
        </div>

        {/* Descrição e Características */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-secondary-900 mb-4">
              Descrição
            </h2>
            <p className="text-secondary-600 leading-relaxed">
              {vehicle.description}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-secondary-900 mb-4">
              Características
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {vehicle.features.map((feature, index) => (
                <div key={index} className="flex items-center text-secondary-600">
                  <span className="text-primary-600 mr-2">✓</span>
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Formulário de Interesse */}
        <div className="mt-12">
          <ContactForm vehicleId={vehicle.id} vehicleName={`${vehicle.brand} ${vehicle.model}`} />
        </div>

        {/* Veículos Relacionados */}
        <RelatedVehicles vehicles={[
          {
            id: '2',
            brand: 'Honda',
            model: 'Civic',
            year: 2021,
            price: 95000,
            mileage: 25000,
            fuel: FuelType.FLEX,
            transmission: TransmissionType.AUTOMATICO,
            color: 'Branco',
            doors: 4,
            city: 'São Paulo',
            state: 'SP',
            plateEnd: '5',
            acceptsTrade: true,
            licensed: true,
            images: [
              'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
              'https://images.unsplash.com/photo-1549317336-206569e8475c?w=800',
            ],
            description: 'Honda Civic 2021',
            features: ['Airbag', 'Freios ABS', 'Ar Condicionado', 'Direção Elétrica', 'Central Multimídia', 'Bluetooth', 'Rodas de Liga Leve', 'Faróis de Neblina', 'Piloto Automático', 'Chave Presencial'],
            specifications: {
              motor: '1.5 Turbo',
              potencia: '173 cv',
              torque: '22,4 kgfm',
              combustivel: FuelType.FLEX,
              transmissao: TransmissionType.AUTOMATICO,
              tracao: 'Dianteira',
              consumo: '12,5 km/l',
              aceleracao: '8,2 segundos',
              velocidade: '200 km/h',
              tanque: '47 litros',
              peso: '1.300 kg',
              comprimento: '4.630 mm',
              largura: '1.800 mm',
              altura: '1.410 mm',
              entreEixos: '2.700 mm',
              portaMalas: '420 litros',
            },
            seller: {
              name: 'João Silva',
              phone: '(11) 99999-9999',
              email: 'joao@exemplo.com',
              address: 'Rua das Flores, 123 - São Paulo, SP'
            }
          },
          {
            id: '3',
            brand: 'Volkswagen',
            model: 'Golf',
            year: 2020,
            price: 78000,
            mileage: 35000,
            fuel: FuelType.FLEX,
            transmission: TransmissionType.AUTOMATICO,
            color: 'Prata',
            doors: 4,
            city: 'São Paulo',
            state: 'SP',
            plateEnd: '2',
            acceptsTrade: false,
            licensed: true,
            images: [
              'https://images.unsplash.com/photo-1583121274602-3e2820c691e7?w=800',
              'https://images.unsplash.com/photo-1593642532400-26709d815480?w=800',
            ],
            description: 'Volkswagen Golf 2020',
            features: ['Airbag', 'Freios ABS', 'Ar Condicionado', 'Direção Elétrica', 'Central Multimídia', 'Bluetooth', 'Rodas de Liga Leve', 'Faróis de Neblina', 'Piloto Automático', 'Chave Presencial'],
            specifications: {
              motor: '1.4 TSI',
              potencia: '150 cv',
              torque: '25,5 kgfm',
              combustivel: FuelType.FLEX,
              transmissao: TransmissionType.AUTOMATICO,
              tracao: 'Dianteira',
              consumo: '11,8 km/l',
              aceleracao: '9,1 segundos',
              velocidade: '195 km/h',
              tanque: '50 litros',
              peso: '1.350 kg',
              comprimento: '4.280 mm',
              largura: '1.790 mm',
              altura: '1.480 mm',
              entreEixos: '2.630 mm',
              portaMalas: '380 litros',
            },
            seller: {
              name: 'João Silva',
              phone: '(11) 99999-9999',
              email: 'joao@exemplo.com',
              address: 'Rua das Flores, 123 - São Paulo, SP'
            }
          },
          {
            id: '4',
            brand: 'Ford',
            model: 'Focus',
            year: 2019,
            price: 65000,
            mileage: 45000,
            fuel: FuelType.FLEX,
            transmission: TransmissionType.AUTOMATICO,
            color: 'Azul',
            doors: 4,
            city: 'São Paulo',
            state: 'SP',
            plateEnd: '7',
            acceptsTrade: true,
            licensed: true,
            images: [
              'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
              'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
            ],
            description: 'Ford Focus 2019',
            features: ['Airbag', 'Freios ABS', 'Ar Condicionado', 'Direção Elétrica', 'Central Multimídia', 'Bluetooth', 'Rodas de Liga Leve', 'Faróis de Neblina', 'Piloto Automático', 'Chave Presencial'],
            specifications: {
              motor: '2.0 16V',
              potencia: '170 cv',
              torque: '20,4 kgfm',
              combustivel: FuelType.FLEX,
              transmissao: TransmissionType.AUTOMATICO,
              tracao: 'Dianteira',
              consumo: '10,5 km/l',
              aceleracao: '9,8 segundos',
              velocidade: '190 km/h',
              tanque: '55 litros',
              peso: '1.400 kg',
              comprimento: '4.530 mm',
              largura: '1.820 mm',
              altura: '1.480 mm',
              entreEixos: '2.650 mm',
              portaMalas: '400 litros',
            },
            seller: {
              name: 'João Silva',
              phone: '(11) 99999-9999',
              email: 'joao@exemplo.com',
              address: 'Rua das Flores, 123 - São Paulo, SP'
            }
          },
          {
            id: '5',
            brand: 'Chevrolet',
            model: 'Cruze',
            year: 2021,
            price: 88000,
            mileage: 20000,
            fuel: FuelType.FLEX,
            transmission: TransmissionType.AUTOMATICO,
            color: 'Preto',
            doors: 4,
            city: 'São Paulo',
            state: 'SP',
            plateEnd: '1',
            acceptsTrade: true,
            licensed: true,
            images: [
              'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
              'https://images.unsplash.com/photo-1549317336-206569e8475c?w=800',
            ],
            description: 'Chevrolet Cruze 2021',
            features: ['Airbag', 'Freios ABS', 'Ar Condicionado', 'Direção Elétrica', 'Central Multimídia', 'Bluetooth', 'Rodas de Liga Leve', 'Faróis de Neblina', 'Piloto Automático', 'Chave Presencial'],
            specifications: {
              motor: '1.4 Turbo',
              potencia: '153 cv',
              torque: '24,5 kgfm',
              combustivel: FuelType.FLEX,
              transmissao: TransmissionType.AUTOMATICO,
              tracao: 'Dianteira',
              consumo: '12,0 km/l',
              aceleracao: '8,5 segundos',
              velocidade: '195 km/h',
              tanque: '52 litros',
              peso: '1.320 kg',
              comprimento: '4.660 mm',
              largura: '1.800 mm',
              altura: '1.460 mm',
              entreEixos: '2.700 mm',
              portaMalas: '445 litros',
            },
            seller: {
              name: 'Maria Santos',
              phone: '(11) 88888-8888',
              email: 'maria@exemplo.com',
              address: 'Av. Paulista, 1000 - São Paulo, SP'
            }
          }
        ]} />
      </main>
      
      <Footer />
    </div>
  )
}