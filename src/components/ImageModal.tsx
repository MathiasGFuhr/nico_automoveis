'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from 'lucide-react'
import Image from 'next/image'

import { ImageModalProps } from '@/types'

export default function ImageModal({ images, currentIndex, isOpen, onClose }: ImageModalProps) {
  const [activeIndex, setActiveIndex] = useState(currentIndex)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([currentIndex]))
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)

  // Função para otimizar URLs de imagem do Supabase Storage
  const getOptimizedImageUrl = (url: string, size: 'thumb' | 'large' = 'large') => {
    if (!url) return ''
    
    // Se for URL do Supabase Storage, adicionar parâmetros de otimização
    if (url.includes('supabase.co')) {
      const baseUrl = url.split('?')[0]
      const params = new URLSearchParams()
      
      switch(size) {
        case 'thumb': 
          params.set('width', '100')
          params.set('height', '100')
          params.set('resize', 'cover')
          params.set('quality', '70')
          break
        case 'large': 
          params.set('width', '1200')
          params.set('height', '900')
          params.set('resize', 'cover')
          params.set('quality', '90')
          break
      }
      
      return `${baseUrl}?${params.toString()}`
    }
    
    // Se for URL do Unsplash (fallback)
    if (url.includes('unsplash.com')) {
      const baseUrl = url.split('?')[0]
      const params = new URLSearchParams()
      
      switch(size) {
        case 'thumb': 
          params.set('w', '100')
          params.set('h', '100')
          params.set('fit', 'crop')
          params.set('q', '70')
          break
        case 'large': 
          params.set('w', '1200')
          params.set('h', '900')
          params.set('fit', 'crop')
          params.set('q', '90')
          break
      }
      
      return `${baseUrl}?${params.toString()}`
    }
    
    return url
  }

  useEffect(() => {
    setActiveIndex(currentIndex)
  }, [currentIndex])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          e.preventDefault()
          prevImage()
          break
        case 'ArrowRight':
          e.preventDefault()
          nextImage()
          break
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const nextImage = () => {
    const nextIndex = (activeIndex + 1) % images.length
    setActiveIndex(nextIndex)
    setLoadedImages(prev => new Set([...prev, nextIndex]))
    setZoom(1)
    setRotation(0)
  }

  const prevImage = () => {
    const prevIndex = (activeIndex - 1 + images.length) % images.length
    setActiveIndex(prevIndex)
    setLoadedImages(prev => new Set([...prev, prevIndex]))
    setZoom(1)
    setRotation(0)
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.5, 3))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.5, 0.5))
  }

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={handleOverlayClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header com controles */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between">
            {/* Indicador de posição */}
            <div className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium">
              {activeIndex + 1} de {images.length}
            </div>

            {/* Controles de zoom e rotação */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleZoomOut}
                className="bg-white/10 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-white text-sm font-medium">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="bg-white/10 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleRotate}
                className="bg-white/10 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            {/* Botão fechar */}
            <button
              onClick={onClose}
              className="bg-white/10 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Botões de navegação */}
        <motion.button
          onClick={prevImage}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 backdrop-blur-md text-white p-4 rounded-full hover:bg-white/20 transition-all duration-300"
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>

        <motion.button
          onClick={nextImage}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 backdrop-blur-md text-white p-4 rounded-full hover:bg-white/20 transition-all duration-300"
          whileHover={{ scale: 1.1, x: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>

        {/* Imagem principal com zoom e rotação */}
        <div className="relative max-w-7xl max-h-[80vh] flex items-center justify-center">
          <motion.div
            className="relative"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transformOrigin: 'center',
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Image
              src={getOptimizedImageUrl(images[activeIndex], 'large')}
              alt={`Imagem ${activeIndex + 1}`}
              width={1200}
              height={900}
              className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl"
              onLoad={() => {
                const nextIndex = (activeIndex + 1) % images.length
                const prevIndex = (activeIndex - 1 + images.length) % images.length
                setLoadedImages(prev => new Set([...prev, nextIndex, prevIndex]))
              }}
            />
          </motion.div>
        </div>

        {/* Miniaturas na parte inferior */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
            <div className="flex space-x-3 max-w-4xl overflow-x-auto scrollbar-hide">
              {images.map((image, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    setActiveIndex(index)
                    setLoadedImages(prev => new Set([...prev, index]))
                    setZoom(1)
                    setRotation(0)
                  }}
                  className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    activeIndex === index
                      ? 'border-white shadow-lg scale-110'
                      : 'border-white/30 hover:border-white/60 hover:scale-105'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Image
                    src={getOptimizedImageUrl(image, 'thumb')}
                    alt={`Miniatura ${index + 1}`}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
