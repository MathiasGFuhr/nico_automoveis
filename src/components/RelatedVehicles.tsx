'use client'

import { Vehicle } from '@/types'
import { VehicleService } from '@/services/vehicleService'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { usePrefetch } from '@/hooks/usePrefetch'

interface RelatedVehiclesProps {
  vehicleId: string
}

// Componente interno para os cards com prefetch
function RelatedVehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const { prefetchPage } = usePrefetch()
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = () => {
    setIsHovered(true)
    prefetchPage(`/veiculos/${vehicle.id}`)
  }

  return (
    <Link
      href={`/veiculos/${vehicle.id}`}
      onMouseEnter={handleMouseEnter}
      className="block"
    >
      <div className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-2 ${
        isHovered ? 'scale-105' : 'scale-100'
      }`}>
        {/* Imagem do Veículo */}
        <div className="relative aspect-w-16 aspect-h-12 overflow-hidden">
          {vehicle.images && vehicle.images.length > 0 ? (
            <div className="w-full h-48 bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-2">
              <Image
                src={vehicle.images[0]}
                alt={`${vehicle.brand} ${vehicle.model}`}
                width={300}
                height={192}
                className="w-auto h-auto max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          ) : (
            <div className="w-full h-48 flex items-center justify-center bg-gray-200">
              <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          <div className="absolute top-4 right-4">
            <button className="bg-white/90 backdrop-blur-sm text-gray-800 p-2 rounded-full shadow-lg hover:bg-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Informações do Veículo */}
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {vehicle.brand} {vehicle.model}
            </h3>
            <p className="text-sm text-gray-500">
              {vehicle.year} • {vehicle.mileage.toLocaleString('pt-BR')} km
            </p>
          </div>

          {/* Preço */}
          <div className="mb-4">
            <div className="text-2xl font-bold text-primary-600">
              R$ {vehicle.price.toLocaleString('pt-BR')}
            </div>
          </div>

          {/* Especificações */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              <span>{vehicle.transmission}</span>
            </div>
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>{vehicle.mileage.toLocaleString('pt-BR')} km</span>
            </div>
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{vehicle.fuel}</span>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex space-x-2">
            <button className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors flex items-center justify-center space-x-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
              <span>WhatsApp</span>
            </button>
            <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function RelatedVehicles({ vehicleId }: RelatedVehiclesProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadRelatedVehicles = async () => {
      try {
        setIsLoading(true)
        const relatedVehicles = await VehicleService.getRelatedVehicles(vehicleId, 4)
        setVehicles(relatedVehicles)
      } catch (error) {
        console.error('Erro ao buscar veículos relacionados:', error)
        setVehicles([])
      } finally {
        setIsLoading(false)
      }
    }

    loadRelatedVehicles()
  }, [vehicleId])

  if (isLoading) {
    return (
      <div className="mt-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Veículos Relacionados
          </h2>
          <p className="text-gray-600">
            Outros veículos que podem te interessar
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (vehicles.length === 0) {
    return null
  }

  return (
    <div className="mt-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Veículos Relacionados
        </h2>
        <p className="text-gray-600">
          Outros veículos que podem te interessar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {vehicles.map((vehicle) => (
          <RelatedVehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>
    </div>
  )
}
