'use client'

import { useState } from 'react'
import { ImageUploadWithCompression } from './ImageUploadWithCompression'
import { motion } from 'framer-motion'

interface VehicleImageUploadProps {
  onImagesChange: (files: File[]) => void
  initialImages?: string[]
  className?: string
}

export const VehicleImageUpload = ({
  onImagesChange,
  initialImages = [],
  className = ''
}: VehicleImageUploadProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const handleImagesChange = (files: File[]) => {
    setUploadedFiles(files)
    onImagesChange(files)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Título e Descrição */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Imagens do Veículo
        </h3>
        <p className="text-sm text-gray-600">
          As imagens serão automaticamente comprimidas para otimizar o carregamento
        </p>
      </div>

      {/* Componente de Upload com Compressão */}
      <ImageUploadWithCompression
        onImagesChange={handleImagesChange}
        maxFiles={10}
        acceptedFormats={['image/jpeg', 'image/jpg', 'image/png', 'image/webp']}
        className="w-full"
      />

      {/* Resumo da Compressão */}
      {uploadedFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2 mb-2">
            <div className="text-green-600">✅</div>
            <h4 className="font-medium text-green-900">
              Imagens Otimizadas
            </h4>
          </div>
          <p className="text-sm text-green-700">
            {uploadedFiles.length} imagem(ns) pronta(s) para upload. 
            O tamanho foi reduzido automaticamente para melhorar a performance.
          </p>
        </motion.div>
      )}

      {/* Instruções */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">💡 Dicas para Melhor Qualidade:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use imagens com boa iluminação e resolução</li>
          <li>• Tire fotos de diferentes ângulos (frente, lateral, traseira, interior)</li>
          <li>• Evite imagens muito escuras ou borradas</li>
          <li>• A primeira imagem será usada como principal</li>
        </ul>
      </div>
    </div>
  )
}
