'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react'
import ImageModal from './ImageModal'

interface VehicleGalleryProps {
  images: string[]
}

export default function VehicleGallery({ images }: VehicleGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // --- OTIMIZAÇÃO DE IMAGEM APLICADA AQUI ---

  // 1. URLs para a imagem principal (slider grande)
  // Pedimos uma versão de alta qualidade, mas otimizada para web (max 1200px)
  const mainImageUrls = images.map(
    (url) => `${url}?width=1200&quality=85`,
  )

  // 2. URLs para as miniaturas (thumbnails)
  // Pedimos versões pequenas e quadradas, com qualidade menor (75%)
  const thumbnailUrls = images.map(
    (url) => `${url}?width=200&height=200&quality=75&resize=cover`,
  )

  // 3. URLs para o Modal (quando o usuário clica para expandir)
  // Pedimos uma versão de alta definição (HD), mas ainda otimizada.
  const modalImageUrls = images.map(
    (url) => `${url}?width=1920&quality=90`,
  )

  // --- FIM DA OTIMIZAÇÃO ---

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length)
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
        {/* Imagem Principal Premium */}
        <div className="relative group">
          <div className="aspect-w-16 aspect-h-9 overflow-hidden">
            <img
              // <-- MUDANÇA AQUI: Usando a URL otimizada
              src={mainImageUrls[selectedImage]}
              alt="Veículo"
              className="w-full h-[500px] object-cover cursor-pointer transition-transform duration-200 hover:scale-105"
              onClick={openModal}
            />
            {/* Overlay Gradiente */}
            <motion.div
              className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Botões de Navegação Premium */}
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

          {/* Indicador de Posição Premium */}
          <motion.div
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full text-sm font-medium shadow-lg"
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.25,
              ease: [0.4, 0.0, 0.2, 1],
              delay: 0.1,
            }}
            key={selectedImage}
          >
            {selectedImage + 1} / {images.length}
          </motion.div>

          {/* Botão de Expandir */}
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

          {/* Grid responsivo para mostrar todas as miniaturas */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
            {/* <-- MUDANÇA AQUI: Usando as URLs de miniatura */}
            {thumbnailUrls.map((image, index) => (
              <motion.button
                key={index}
                onClick={() => setSelectedImage(index)}
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
                <motion.img
                  // <-- MUDANÇA AQUI: `image` agora é a URL da miniatura
                  src={image}
                  alt={`Imagem ${index + 1}`}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{
                    duration: 0.15,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                />
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
                {/* <-- MUDANÇA AQUI: Usando as URLs de miniatura */}
                {thumbnailUrls.map((image, index) => (
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
                    <img
                      // <-- MUDANÇA AQUI: `image` agora é a URL da miniatura
                      src={image}
                      alt={`Imagem ${index + 1}`}
                      className="w-full h-full object-cover"
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
        // <-- MUDANÇA AQUI: Passando as URLs de alta definição para o modal
        images={modalImageUrls}
        currentIndex={selectedImage}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  )
}