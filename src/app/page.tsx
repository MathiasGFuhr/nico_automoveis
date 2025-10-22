'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import VehicleCard from '@/components/VehicleCard'
import VehicleFilter from '@/components/VehicleFilter'
import Footer from '@/components/Footer'

// Dados de exemplo - em produção viriam do Supabase
const sampleVehicles = [
  {
    id: '1',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2022,
    price: 85000,
    mileage: 15000,
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500',
    fuel: 'Flex',
    transmission: 'Automático'
  },
  {
    id: '2',
    brand: 'Honda',
    model: 'Civic',
    year: 2021,
    price: 92000,
    mileage: 22000,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500',
    fuel: 'Flex',
    transmission: 'Automático'
  },
  {
    id: '3',
    brand: 'Volkswagen',
    model: 'Golf',
    year: 2020,
    price: 78000,
    mileage: 35000,
    image: 'https://images.unsplash.com/photo-1549317336-206569e8475c?w=500',
    fuel: 'Flex',
    transmission: 'Manual'
  },
  {
    id: '4',
    brand: 'Ford',
    model: 'Focus',
    year: 2021,
    price: 65000,
    mileage: 28000,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500',
    fuel: 'Flex',
    transmission: 'Automático'
  }
]

export default function Home() {

  return (
    <div className="min-h-screen bg-secondary-50">
      <Header />
      <Hero />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        {/* Filtro de Busca */}
        <VehicleFilter redirectOnSearch={true} />
        
        {/* Espaçamento melhorado */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 md:mt-16 mb-6 md:mb-8"
        >
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-secondary-900 mb-3 md:mb-4">
              Veículos em Destaque
            </h2>
            <p className="text-base sm:text-lg text-secondary-600 max-w-2xl mx-auto">
              Confira nossa seleção especial de veículos com as melhores condições
            </p>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {sampleVehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="transition-transform duration-300"
            >
              <VehicleCard vehicle={vehicle} />
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-8 md:mt-12"
        >
          <Link 
            href="/veiculos"
            className="inline-block bg-primary-600 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 hover:scale-105 transition-all duration-300 shadow-primary w-full sm:w-auto"
          >
            Ver Todos os Veículos
          </Link>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  )
}
