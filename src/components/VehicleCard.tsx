interface Vehicle {
  id: string
  brand: string
  model: string
  year: number
  price: number
  mileage: number
  image: string
  fuel: string
  transmission: string
}

interface VehicleCardProps {
  vehicle: Vehicle
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-primary-lg transition-all duration-300 border border-primary-100 hover:border-primary-300">
      <div className="aspect-w-16 aspect-h-9">
        {vehicle.image ? (
          <img
            src={vehicle.image}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="w-full h-40 sm:h-48 object-cover"
          />
        ) : (
          <div className="w-full h-40 sm:h-48 flex items-center justify-center bg-gray-200">
            <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg sm:text-xl font-semibold text-secondary-900 line-clamp-1">
            {vehicle.brand} {vehicle.model}
          </h3>
          <span className="text-xs sm:text-sm text-secondary-500">{vehicle.year}</span>
        </div>
        
        <div className="flex items-center text-secondary-600 mb-3 sm:mb-4">
          <span className="text-xl sm:text-2xl font-bold text-primary-600">
            R$ {vehicle.price.toLocaleString('pt-BR')}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-secondary-600 mb-4">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            {vehicle.mileage.toLocaleString('pt-BR')} km
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            {vehicle.transmission}
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {vehicle.fuel}
          </div>
        </div>
        
        <a 
          href={`/veiculos/${vehicle.id}`}
          className="block w-full bg-primary-600 text-white py-2 px-3 sm:px-4 rounded-lg hover:bg-primary-700 transition-colors shadow-primary text-center text-sm sm:text-base"
        >
          Ver Detalhes
        </a>
      </div>
    </div>
  )
}
