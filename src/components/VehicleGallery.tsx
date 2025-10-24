'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react'
import Image from 'next/image'
import ImageModal from './ImageModal'

interface VehicleGalleryProps {
  images: string[]
}

export default function VehicleGallery({ images }: VehicleGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Função para otimizar URLs de imagem do Supabase Storage
  const getOptimizedImageUrl = (
    url: string,
    size: 'thumb' | 'medium' | 'large' = 'medium',
  ) => {
    if (!url) return ''

    // Se for URL do Supabase Storage, adicionar parâmetros de otimização
    if (url.includes('supabase.co')) {
      const baseUrl = url.split('?')[0]
      const params = new URLSearchParams()

      switch (size) {
        case 'thumb':
          params.set('width', '150')
          params.set('height', '150')
          params.set('resize', 'contain') // Mantido 'contain'
          params.set('quality', '80')
          break
        case 'medium':
          params.set('width', '800')
          params.set('height', '600')
          params.set('resize', 'contain') // Mantido 'contain'
          params.set('quality', '85')
          break
        case 'large':
          params.set('width', '1200')
          params.set('height', '900')
          params.set('resize', 'contain') // Mantido 'contain'
          params.set('quality', '90')
          break
      }

      return `${baseUrl}?${params.toString()}`
    }

    // Se for URL do Unsplash (fallback)
    if (url.includes('unsplash.com')) {
      const baseUrl = url.split('?')[0]
      const params = new URLSearchParams()

      switch (size) {
        case 'thumb':
          params.set('w', '150')
          params.set('h', '150')
          params.set('fit', 'crop')
          params.set('q', '80')
          break
        case 'medium':
          params.set('w', '800')
          params.set('h', '600')
          params.set('fit', 'crop')
          params.set('q', '85')
          break
        case 'large':
          params.set('w', '1200')
          params.set('h', '900')
          params.set('fit', 'crop') // Aqui deveria ser 'clip' ou 'fill' se quiser 'contain'
          params.set('q', '90')
          break
      }

      return `${baseUrl}?${params.toString()}`
    }

    return url
  }

  const nextImage = () => {
    const nextIndex = (selectedImage + 1) % images.length
    setSelectedImage(nextIndex)
  }

  const prevImage = () => {
    const prevIndex = (selectedImage - 1 + images.length) % images.length
    setSelectedImage(prevIndex)
  }

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <motion.div
        className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Imagem Principal Premium (Estrutura Corrigida) */}
        {/* Este é o contêiner principal. 
          - 'relative' ancora todos os botões e overlays.
          - 'group' é para efeitos de hover (como no overlay).
          - 'aspect-[4/3]' força a proporção correta (1200x900).
          - 'bg-gray-100' é o fundo que estava aparecendo nas bordas.
        */}
         <div className="relative group aspect-4/3 bg-gray-100 overflow-hidden">
           {/* Imagem Principal - Preenchendo completamente o card */}
           <motion.div
             key={selectedImage}
             initial={{ opacity: 0, scale: 1.05 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 0.95 }}
             transition={{ 
               duration: 0.4, 
               ease: [0.4, 0.0, 0.2, 1] 
             }}
             className="w-full h-full"
           >
             <Image
               src={getOptimizedImageUrl(images[selectedImage], 'large')}
               alt="Veículo"
               width={1200}
               height={900}
               className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
               onClick={openModal}
               onLoad={() => {
                 // Imagem carregada com sucesso
                 console.log('Imagem principal carregada:', selectedImage + 1)
               }}
               onError={() => {
                 console.error('Erro ao carregar imagem principal')
               }}
             />
           </motion.div>

          {/* Overlay Gradiente (Agora posicionado corretamente) */}
          <motion.div
            className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent pointer-events-none"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />

          {/* Botões de Navegação (Agora posicionados corretamente) */}
          <motion.button
            onClick={prevImage}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-800 p-3 rounded-full shadow-lg"
            initial={{ opacity: 0, x: -30, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            whileHover={{ scale: 1.15, x: -5 }}
            whileTap={{ scale: 0.9 }}
            transition={{
              duration: 0.2,
              ease: [0.4, 0.0, 0.2, 1],
              scale: { duration: 0.1 },
            }}
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>

          <motion.button
            onClick={nextImage}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-800 p-3 rounded-full shadow-lg"
            initial={{ opacity: 0, x: 30, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            whileHover={{ scale: 1.15, x: 5 }}
            whileTap={{ scale: 0.9 }}
            transition={{
              duration: 0.2,
              ease: [0.4, 0.0, 0.2, 1],
              scale: { duration: 0.1 },
            }}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>

          {/* Indicador de Posição com transição suave */}
          <motion.div
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full text-sm font-medium shadow-lg"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0.0, 0.2, 1],
            }}
            key={`indicator-${selectedImage}`}
          >
            <motion.span
              key={`text-${selectedImage}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.2,
                ease: [0.4, 0.0, 0.2, 1],
              }}
            >
              {selectedImage + 1} / {images.length}
            </motion.span>
          </motion.div>

          {/* Botão de Expandir (Agora posicionado corretamente) */}
          <motion.button
            onClick={openModal}
            className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm text-gray-800 p-3 rounded-full shadow-lg"
            initial={{ opacity: 0, scale: 0 }}
            whileHover={{ opacity: 1, scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Expand className="w-5 h-5" />
          </motion.button>
        </div>
        {/* Fim do contêiner principal da imagem */}

        {/* Miniaturas Premium */}
        <div className="p-6 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Galeria de Imagens ({images.length})
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Mostrando todas as imagens</span>
            </div>
          </div>

          {/* Grid responsivo com lazy loading para miniaturas */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
            {images.map((image, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setSelectedImage(index)
                }}
                className={`relative w-full aspect-square rounded-xl overflow-hidden border-3 ${
                  selectedImage === index
                    ? 'border-primary-600 ring-4 ring-primary-100 shadow-primary-200'
                    : 'border-gray-200 hover:border-primary-300 hover:shadow-lg'
                }`}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{
                  duration: 0.2,
                  ease: [0.25, 0.1, 0.25, 1],
                  delay: index * 0.02,
                }}
              >
                {/* Miniatura otimizada com transição suave */}
                <motion.div
                  className="w-full h-full"
                  whileHover={{ scale: 1.1 }}
                  transition={{
                    duration: 0.2,
                    ease: [0.4, 0.0, 0.2, 1],
                  }}
                >
                  <Image
                    src={getOptimizedImageUrl(image, 'thumb')}
                    alt={`Imagem ${index + 1}`}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover transition-opacity duration-200"
                    onLoad={() => {
                      console.log('Miniatura carregada:', index + 1)
                    }}
                  />
                </motion.div>

                {/* Indicador de seleção */}
                {selectedImage === index && (
                  <motion.div
                    className="absolute inset-0 bg-primary-600/20 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>

          {/* Se houver muitas imagens, mostrar scroll horizontal como fallback */}
          {images.length > 12 && (
            <div className="mt-4">
              <div className="flex space-x-3 overflow-x-auto scrollbar-hide pb-2">
                {images.map((image, index) => (
                  <motion.button
                    key={`scroll-${index}`}
                    onClick={() => setSelectedImage(index)}
                    className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index
                        ? 'border-primary-600 ring-2 ring-primary-100'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Image
                      src={image}
                      alt={`Imagem ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-contain"
                    />
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Modal de Imagem */}
      <ImageModal
        images={images}
        currentIndex={selectedImage}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  )
}