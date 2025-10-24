'use client'

import { motion } from 'framer-motion'

export default function VehicleDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to from-slate-50 via-white to-slate-100">
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Skeleton */}
        <div className="mb-8">
          <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>

        {/* Hero Section Skeleton */}
        <div className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Galeria Principal Skeleton */}
            <div className="lg:col-span-2">
              <div className="bg-gray-200 rounded-2xl h-[500px] animate-pulse flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-gray-600 text-sm">Carregando galeria...</p>
                </div>
              </div>
            </div>

            {/* Sidebar Skeleton */}
            <div className="space-y-6">
              {/* Card de Preço Skeleton */}
              <div className="bg-gray-200 rounded-2xl p-8 animate-pulse">
                <div className="text-center mb-6">
                  <div className="h-4 bg-gray-300 rounded w-32 mx-auto mb-2"></div>
                  <div className="h-12 bg-gray-300 rounded w-40 mx-auto mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-36 mx-auto"></div>
                </div>
                <div className="h-12 bg-gray-300 rounded-xl w-full"></div>
              </div>

              {/* Card de Contato Skeleton */}
              <div className="bg-gray-200 rounded-2xl p-6 animate-pulse">
                <div className="h-6 bg-gray-300 rounded w-32 mx-auto mb-4"></div>
                <div className="space-y-3">
                  <div className="h-12 bg-gray-300 rounded-lg"></div>
                  <div className="h-12 bg-gray-300 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informações do Veículo Skeleton */}
        <div className="mt-12">
          <div className="bg-gray-200 rounded-2xl p-8 animate-pulse">
            <div className="mb-8">
              <div className="h-8 bg-gray-300 rounded w-64 mb-2"></div>
              <div className="h-6 bg-gray-300 rounded w-48"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="bg-gray-300 rounded-xl p-4 animate-pulse">
                  <div className="h-4 bg-gray-400 rounded w-16 mb-2"></div>
                  <div className="h-5 bg-gray-400 rounded w-20"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Descrição e Características Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          <div className="bg-gray-200 rounded-lg p-6 animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-32 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              <div className="h-4 bg-gray-300 rounded w-4/6"></div>
              <div className="h-4 bg-gray-300 rounded w-3/6"></div>
            </div>
          </div>

          <div className="bg-gray-200 rounded-lg p-6 animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-32 mb-4"></div>
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="h-4 bg-gray-300 rounded w-4 mr-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Formulário Skeleton */}
        <div className="mt-12">
          <div className="bg-gray-200 rounded-lg p-8 animate-pulse">
            <div className="text-center mb-8">
              <div className="h-6 bg-gray-300 rounded w-48 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-64 mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
                <div className="h-10 bg-gray-300 rounded-lg"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
                <div className="h-10 bg-gray-300 rounded-lg"></div>
              </div>
            </div>
            <div className="h-12 bg-gray-300 rounded-lg"></div>
          </div>
        </div>

        {/* Veículos Relacionados Skeleton */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-80 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300 rounded-t-2xl"></div>
                <div className="p-6">
                  <div className="h-5 bg-gray-300 rounded w-32 mb-1"></div>
                  <div className="h-4 bg-gray-300 rounded w-24 mb-4"></div>
                  <div className="h-6 bg-gray-300 rounded w-20 mb-4"></div>
                  <div className="flex justify-between mb-4">
                    <div className="h-4 bg-gray-300 rounded w-16"></div>
                    <div className="h-4 bg-gray-300 rounded w-16"></div>
                    <div className="h-4 bg-gray-300 rounded w-16"></div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="h-8 bg-gray-300 rounded flex-1"></div>
                    <div className="h-8 bg-gray-300 rounded w-8"></div>
                  </div>
                </div>
              </div>
            ))}
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
