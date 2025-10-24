'use client'

import { motion } from 'framer-motion'

export default function VehicleListSkeleton() {
  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header Skeleton */}
      <div className="bg-white shadow-sm border-b border-primary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="h-8 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
            <div className="hidden md:flex space-x-8">
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section Skeleton */}
        <div className="text-center mb-12">
          <div className="h-12 bg-gray-200 rounded w-96 mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-[600px] mx-auto animate-pulse"></div>
        </div>

        {/* Filtros Skeleton */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 animate-pulse mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1 h-12 bg-gray-200 rounded-xl"></div>
            <div className="flex gap-2">
              <div className="h-12 bg-gray-200 rounded-xl w-24"></div>
              <div className="h-12 bg-gray-200 rounded-xl w-20"></div>
            </div>
          </div>
          <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>

        {/* Grid de Veículos Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              {/* Imagem Skeleton */}
              <div className="aspect-w-16 aspect-h-9">
                <div className="w-full h-40 sm:h-48 bg-gray-200 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>

              {/* Conteúdo Skeleton */}
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-start mb-2">
                  <div className="h-6 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                </div>

                <div className="h-8 bg-gray-200 rounded w-24 mb-3"></div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-14"></div>
                  </div>
                </div>

                <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Paginação Skeleton */}
        <div className="flex justify-center mt-12">
          <div className="flex space-x-2">
            <div className="h-10 bg-gray-200 rounded-lg w-20"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-10"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-10"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-20"></div>
          </div>
        </div>
      </main>

      {/* Footer Skeleton */}
      <div className="bg-gray-200 py-12 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="h-6 bg-gray-300 rounded w-32 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-48"></div>
            </div>
            <div>
              <div className="h-6 bg-gray-300 rounded w-32 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-16"></div>
                <div className="h-4 bg-gray-300 rounded w-20"></div>
                <div className="h-4 bg-gray-300 rounded w-16"></div>
                <div className="h-4 bg-gray-300 rounded w-20"></div>
              </div>
            </div>
            <div>
              <div className="h-6 bg-gray-300 rounded w-32 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-24"></div>
                <div className="h-4 bg-gray-300 rounded w-32"></div>
                <div className="h-4 bg-gray-300 rounded w-40"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
