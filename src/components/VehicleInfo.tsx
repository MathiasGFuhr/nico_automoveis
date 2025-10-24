'use client'

import { motion } from 'framer-motion'
import { Calendar, Gauge, Settings, Car, Fuel, Hash, Palette, RefreshCw, Shield } from 'lucide-react'
import { Vehicle } from '@/types'

interface VehicleInfoProps {
  vehicle: Pick<Vehicle,
    'brand' | 'model' | 'year' | 'mileage' | 'transmission' |
    'fuel' | 'color' | 'doors' | 'plateEnd' | 'acceptsTrade' | 'licensed'
  >
}

export default function VehicleInfo({ vehicle }: VehicleInfoProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05 // Reduzido para 50ms
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 } // Reduzido para 200ms
    }
  }

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header do Veículo */}
      <motion.div className="mb-8" variants={itemVariants}>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            {vehicle.brand}
          </h1>
          <h2 className="text-2xl font-bold text-primary-600 mb-2">
            {vehicle.model}
          </h2>
          <p className="text-gray-500 text-sm font-medium">
            1.8 16V FLEX 4P AUTOMÁTICO
          </p>
        </div>
      </motion.div>

      {/* Grid de Informações - Layout 3x3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <motion.div 
          className="bg-gray-50 border border-gray-200 p-4 rounded-xl hover:bg-gray-100 transition-all duration-200"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center space-x-2 mb-1">
            <Calendar className="w-4 h-4 text-gray-600" />
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Ano</p>
          </div>
          <p className="text-sm font-bold text-gray-900">
            {vehicle.year}
          </p>
        </motion.div>

        <motion.div 
          className="bg-gray-50 border border-gray-200 p-4 rounded-xl hover:bg-gray-100 transition-all duration-200"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center space-x-2 mb-1">
            <Gauge className="w-4 h-4 text-gray-600" />
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">KM</p>
          </div>
          <p className="text-sm font-bold text-gray-900">
            {vehicle.mileage.toLocaleString('pt-BR')}
          </p>
        </motion.div>

        <motion.div 
          className="bg-gray-50 border border-gray-200 p-4 rounded-xl hover:bg-gray-100 transition-all duration-200"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center space-x-2 mb-1">
            <Settings className="w-4 h-4 text-gray-600" />
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Câmbio</p>
          </div>
          <p className="text-sm font-bold text-gray-900">
            {vehicle.transmission}
          </p>
        </motion.div>

        <motion.div 
          className="bg-gray-50 border border-gray-200 p-4 rounded-xl hover:bg-gray-100 transition-all duration-200"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center space-x-2 mb-1">
            <Car className="w-4 h-4 text-gray-600" />
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Carroceria</p>
          </div>
          <p className="text-sm font-bold text-gray-900">
            {vehicle.doors} portas
          </p>
        </motion.div>

        <motion.div 
          className="bg-gray-50 border border-gray-200 p-4 rounded-xl hover:bg-gray-100 transition-all duration-200"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center space-x-2 mb-1">
            <Fuel className="w-4 h-4 text-gray-600" />
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Combustível</p>
          </div>
          <p className="text-sm font-bold text-gray-900">
            {vehicle.fuel}
          </p>
        </motion.div>

        <motion.div 
          className="bg-gray-50 border border-gray-200 p-4 rounded-xl hover:bg-gray-100 transition-all duration-200"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center space-x-2 mb-1">
            <Hash className="w-4 h-4 text-gray-600" />
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Final de placa</p>
          </div>
          <p className="text-sm font-bold text-gray-900">
            {vehicle.plateEnd}
          </p>
        </motion.div>

        <motion.div 
          className="bg-gray-50 border border-gray-200 p-4 rounded-xl hover:bg-gray-100 transition-all duration-200"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center space-x-2 mb-1">
            <Palette className="w-4 h-4 text-gray-600" />
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Cor</p>
          </div>
          <p className="text-sm font-bold text-gray-900">
            {vehicle.color}
          </p>
        </motion.div>

        <motion.div 
          className="bg-gray-50 border border-gray-200 p-4 rounded-xl hover:bg-gray-100 transition-all duration-200"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center space-x-2 mb-1">
            <RefreshCw className="w-4 h-4 text-gray-600" />
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Aceita troca</p>
          </div>
          <p className="text-sm font-bold text-primary-600">
            {vehicle.acceptsTrade ? 'Sim' : 'Não'}
          </p>
        </motion.div>

        <motion.div 
          className="bg-gray-50 border border-gray-200 p-4 rounded-xl hover:bg-gray-100 transition-all duration-200"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center space-x-2 mb-1">
            <Shield className="w-4 h-4 text-gray-600" />
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Licenciado</p>
          </div>
          <p className="text-sm font-bold text-primary-600">
            {vehicle.licensed ? 'Sim' : 'Não'}
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
