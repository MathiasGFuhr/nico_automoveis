'use client'

import { useState, useRef, useEffect } from 'react'
import { useImageCompression } from '@/hooks/useImageCompression'
import { motion, AnimatePresence } from 'framer-motion'

interface ImageUploadWithCompressionProps {
  onImagesChange: (files: File[]) => void
  onPrimaryImageChange?: (index: number) => void
  maxFiles?: number
  acceptedFormats?: string[]
  className?: string
}

export const ImageUploadWithCompression = ({
  onImagesChange,
  onPrimaryImageChange,
  maxFiles = 10,
  acceptedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  className = ''
}: ImageUploadWithCompressionProps) => {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [compressionResults, setCompressionResults] = useState<Array<{
    originalName: string
    originalSize: number
    compressedSize: number
    compressionRatio: number
  }>>([])
  const [primaryImageIndex, setPrimaryImageIndex] = useState<number>(0)
  const [imageUrls, setImageUrls] = useState<string[]>([])
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { compressMultipleImages, isCompressing, compressionProgress } = useImageCompression()

  // Limpar URLs quando o componente for desmontado
  useEffect(() => {
    return () => {
      imageUrls.forEach(url => URL.revokeObjectURL(url))
    }
  }, [])

  const handleFiles = async (files: FileList | null) => {
    if (!files) return

    const fileArray = Array.from(files)
    const validFiles = fileArray.filter(file => 
      acceptedFormats.includes(file.type) && file.size <= 10 * 1024 * 1024 // 10MB max
    )

    if (validFiles.length === 0) {
      alert('Por favor, selecione apenas imagens válidas (JPEG, PNG, WebP) com tamanho máximo de 10MB.')
      return
    }

    if (uploadedFiles.length + validFiles.length > maxFiles) {
      alert(`Máximo de ${maxFiles} imagens permitidas.`)
      return
    }

    try {
      // SEM COMPRESSÃO - usar arquivos originais
      console.log('Processando arquivos SEM compressão:', validFiles.length)
      
      // Atualizar estado
      const newFiles = [...uploadedFiles, ...validFiles]
      setUploadedFiles(newFiles)
      onImagesChange(newFiles)
      
      // Criar URLs para preview das imagens (SEM COMPRESSÃO)
      const newUrls = validFiles.map(file => {
        const url = URL.createObjectURL(file)
        console.log('URL criada (SEM COMPRESSÃO):', url, 'Arquivo:', file.name)
        return url
      })
      setImageUrls(prev => [...prev, ...newUrls])
      
      // Se é a primeira imagem, definir como principal
      if (uploadedFiles.length === 0) {
        setPrimaryImageIndex(0)
      }

      // Salvar resultados da compressão para exibição (SEM COMPRESSÃO)
      const results = validFiles.map(file => ({
        originalName: file.name,
        originalSize: file.size,
        compressedSize: file.size,
        compressionRatio: 0
      }))
      setCompressionResults(prev => [...prev, ...results])

    } catch (error) {
      console.error('Erro ao processar imagens:', error)
      alert('Erro ao processar as imagens. Tente novamente.')
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }

  const removeFile = (index: number) => {
    // Liberar URL da imagem removida
    if (imageUrls[index]) {
      URL.revokeObjectURL(imageUrls[index])
    }
    
    const newFiles = uploadedFiles.filter((_, i) => i !== index)
    const newResults = compressionResults.filter((_, i) => i !== index)
    const newUrls = imageUrls.filter((_, i) => i !== index)
    
    setUploadedFiles(newFiles)
    setCompressionResults(newResults)
    setImageUrls(newUrls)
    onImagesChange(newFiles)
    
    // Ajustar índice da imagem principal se necessário
    if (primaryImageIndex >= index && primaryImageIndex > 0) {
      setPrimaryImageIndex(prev => prev - 1)
    } else if (primaryImageIndex === index && newFiles.length > 0) {
      setPrimaryImageIndex(0)
    } else if (newFiles.length === 0) {
      setPrimaryImageIndex(0)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Área de Upload */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${isCompressing ? 'pointer-events-none opacity-50' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedFormats.join(',')}
          onChange={handleFileInput}
          className="hidden"
        />
        
        <div className="space-y-2">
          <div className="text-4xl">📸</div>
          <h3 className="text-lg font-medium text-gray-900">
            {isCompressing ? 'Comprimindo imagens...' : 'Arraste imagens aqui'}
          </h3>
          <p className="text-sm text-gray-500">
            ou{' '}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              clique para selecionar
            </button>
          </p>
          <p className="text-xs text-gray-400">
            Máximo {maxFiles} imagens • JPEG, PNG, WebP • Até 10MB cada
          </p>
        </div>

        {/* Barra de Progresso */}
        {isCompressing && (
          <div className="mt-4">
            <div className="bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-blue-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${compressionProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {compressionProgress}% concluído
            </p>
          </div>
        )}
      </div>

      {/* Lista de Imagens */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <h4 className="font-medium text-gray-900">
              Imagens ({uploadedFiles.length}/{maxFiles})
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploadedFiles.map((file, index) => {
                console.log(`🔍 Renderizando imagem ${index}:`, {
                  fileName: file.name,
                  fileSize: file.size,
                  hasUrl: !!imageUrls[index],
                  url: imageUrls[index]
                })
                return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative group bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Imagem Preview */}
                  <div 
                    className="aspect-square bg-gray-100 cursor-pointer relative overflow-hidden"
                  >
                    {imageUrls[index] ? (
                      <div className="w-full h-full relative">
                        <img
                          src={imageUrls[index]}
                          alt={file.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                          onLoad={() => {
                            console.log('✅ IMAGEM CARREGADA:', file.name, 'URL:', imageUrls[index])
                            // Forçar re-render
                            const img = document.querySelector(`img[alt="${file.name}"]`) as HTMLImageElement
                            if (img) {
                              img.style.opacity = '1'
                              img.style.visibility = 'visible'
                            }
                          }}
                          onError={(e) => console.error('❌ ERRO AO CARREGAR:', file.name, 'URL:', imageUrls[index], e)}
                          style={{ 
                            backgroundColor: '#f3f4f6',
                            minHeight: '200px',
                            display: 'block',
                            opacity: '1',
                            visibility: 'visible'
                          }}
                        />
                        {/* Fallback visual */}
                        <div className="absolute inset-0 bg-green-100 opacity-0 hover:opacity-20 transition-opacity flex items-center justify-center">
                          <span className="text-green-600 text-xs font-medium">✅ Imagem OK</span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <div className="text-gray-500 text-sm">Carregando...</div>
                      </div>
                    )}
                    
                    {/* Overlay com informações */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="bg-white bg-opacity-90 rounded-full p-2">
                          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Informações da Imagem */}
                  <div className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate" title={file.name}>
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatFileSize(file.size)}
                          {compressionResults[index] && (
                            <span className="text-green-600 ml-1">
                              ({compressionResults[index].compressionRatio}% menor)
                            </span>
                          )}
                        </p>
                      </div>
                      
                      {/* Botão de Remover */}
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 p-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remover imagem"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Botão de Estrela para Imagem Principal */}
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setPrimaryImageIndex(index)
                          onPrimaryImageChange?.(index)
                        }}
                        className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium transition-all ${
                          primaryImageIndex === index
                            ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                        }`}
                        title={primaryImageIndex === index ? "Imagem principal" : "Definir como imagem principal"}
                      >
                        <svg 
                          className={`w-3 h-3 ${primaryImageIndex === index ? 'fill-current' : ''}`} 
                          fill={primaryImageIndex === index ? 'currentColor' : 'none'} 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        <span>
                          {primaryImageIndex === index ? 'Principal' : 'Definir como principal'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Indicador de Imagem Principal */}
                  {primaryImageIndex === index && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm">
                      ⭐ Principal
                    </div>
                  )}
                </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
