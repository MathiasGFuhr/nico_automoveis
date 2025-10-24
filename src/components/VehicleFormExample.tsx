'use client'

import { useState } from 'react'
import { VehicleImageUpload } from './VehicleImageUpload'
import { motion } from 'framer-motion'

// Exemplo de como usar o componente de upload com compressão
export const VehicleFormExample = () => {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    price: '',
    description: ''
  })
  const [images, setImages] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleImagesChange = (files: File[]) => {
    setImages(files)
    console.log(`📸 ${files.length} imagens selecionadas`)
    files.forEach((file, index) => {
      console.log(`Imagem ${index + 1}: ${file.name} (${(file.size / 1024).toFixed(1)}KB)`)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Aqui você faria o upload das imagens comprimidas para o Supabase
      console.log('📤 Enviando dados do veículo:', formData)
      console.log('📤 Enviando imagens comprimidas:', images)

      // Simular upload
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert('✅ Veículo cadastrado com sucesso!')
      
      // Reset form
      setFormData({
        brand: '',
        model: '',
        year: '',
        price: '',
        description: ''
      })
      setImages([])
      
    } catch (error) {
      console.error('❌ Erro ao cadastrar veículo:', error)
      alert('❌ Erro ao cadastrar veículo. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Cadastro de Veículo
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marca
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modelo
              </label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ano
              </label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preço (R$)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Upload de Imagens com Compressão */}
          <VehicleImageUpload
            onImagesChange={handleImagesChange}
            className="w-full"
          />

          {/* Botão de Submit */}
          <div className="flex justify-end">
            <motion.button
              type="submit"
              disabled={isSubmitting || images.length === 0}
              className={`
                px-8 py-3 rounded-lg font-medium transition-colors
                ${isSubmitting || images.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                }
              `}
              whileHover={!isSubmitting && images.length > 0 ? { scale: 1.02 } : {}}
              whileTap={!isSubmitting && images.length > 0 ? { scale: 0.98 } : {}}
            >
              {isSubmitting ? 'Cadastrando...' : 'Cadastrar Veículo'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
