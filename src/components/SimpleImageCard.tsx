'use client'

import { useState, useRef } from 'react'
import imageCompression from 'browser-image-compression'

interface SimpleImageCardProps {
  onImagesChange: (files: File[]) => void
  maxFiles?: number
}

export const SimpleImageCard = ({ onImagesChange, maxFiles = 10 }: SimpleImageCardProps) => {
  const [files, setFiles] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [primaryIndex, setPrimaryIndex] = useState<number>(0)
  const [isCompressing, setIsCompressing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList) return

    const newFiles = Array.from(fileList)
    const validFiles = newFiles.filter(file => file.type.startsWith('image/'))

    if (validFiles.length === 0) {
      alert('Selecione apenas imagens!')
      return
    }

    if (files.length + validFiles.length > maxFiles) {
      alert(`Máximo ${maxFiles} imagens!`)
      return
    }

    try {
      setIsCompressing(true)
      console.log('🔄 Iniciando compressão de', validFiles.length, 'imagens')
      
      // Comprimir imagens
      const compressedFiles = await Promise.all(
        validFiles.map(async (file) => {
          const compressed = await imageCompression(file, {
            maxSizeMB: 0.5, // 500KB máximo
            maxWidthOrHeight: 1200, // 1200px máximo
            quality: 0.8 // 80% qualidade
          })
          return compressed
        })
      )

      console.log('✅ Compressão concluída, criando URLs...')

      // Criar URLs para preview (usar arquivos comprimidos)
      const newUrls = compressedFiles.map(file => URL.createObjectURL(file))
      
      const updatedFiles = [...files, ...compressedFiles]
      setFiles(updatedFiles)
      setImageUrls(prev => [...prev, ...newUrls])
      
      console.log('📤 Enviando', updatedFiles.length, 'arquivos para o componente pai')
      onImagesChange(updatedFiles)
      
      // Se é a primeira imagem, definir como principal
      if (files.length === 0) {
        setPrimaryIndex(0)
      }
    } catch (error) {
      console.error('❌ Erro ao comprimir imagens:', error)
      alert('Erro ao processar as imagens. Tente novamente.')
    } finally {
      setIsCompressing(false)
    }
  }

  const removeFile = (index: number) => {
    // Liberar URL
    if (imageUrls[index]) {
      URL.revokeObjectURL(imageUrls[index])
    }

    const newFiles = files.filter((_, i) => i !== index)
    const newUrls = imageUrls.filter((_, i) => i !== index)
    
    setFiles(newFiles)
    setImageUrls(newUrls)
    onImagesChange(newFiles)
    
    // Ajustar índice da imagem principal se necessário
    if (primaryIndex >= index && primaryIndex > 0) {
      setPrimaryIndex(prev => prev - 1)
    } else if (primaryIndex === index && newFiles.length > 0) {
      setPrimaryIndex(0)
    } else if (newFiles.length === 0) {
      setPrimaryIndex(0)
    }
  }

  return (
    <div className="space-y-4">
      {/* Botão de Upload */}
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-linear-to-br from-gray-50 to-white hover:border-blue-400 hover:bg-linear-to-br hover:from-blue-50 hover:to-white transition-all duration-300 group">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => {
            e.preventDefault()
            handleFiles(e.target.files)
          }}
          className="hidden"
        />
        
        <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">📸</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Adicionar Imagens</h3>
        <p className="text-gray-600 mb-4">Arraste e solte ou clique para selecionar</p>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            fileInputRef.current?.click()
          }}
          disabled={isCompressing}
          className={`px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ${
            isCompressing 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
          }`}
        >
          {isCompressing ? 'Comprimindo...' : 'Selecionar Imagens'}
        </button>
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${isCompressing ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
            <span>{files.length}</span>
          </div>
          <span>/</span>
          <span>{maxFiles} imagens</span>
          {isCompressing && (
            <div className="ml-2 text-yellow-600 font-medium">
              Comprimindo...
            </div>
          )}
        </div>
      </div>

      {/* Cards das Imagens */}
      {files.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {files.map((file, index) => (
            <div key={index} className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 relative transform hover:-translate-y-1">
              {/* Preview da Imagem */}
              <div className="aspect-square bg-linear-to-br from-gray-50 to-gray-100 relative overflow-hidden flex items-center justify-center">
                <img
                  src={imageUrls[index]}
                  alt={file.name}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Overlay gradiente sutil */}
                <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Estrela de Imagem Principal */}
                {primaryIndex === index && (
                  <div className="absolute top-2 left-2 bg-linear-to-r from-yellow-400 to-yellow-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-lg flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Principal
                  </div>
                )}
                
                {/* Botão de ação no hover */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => removeFile(index)}
                    className="bg-red-500/90 backdrop-blur-sm text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                    title="Remover imagem"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Informações */}
              <div className="p-3 bg-linear-to-br from-white to-gray-50">
                <div className="mb-2">
                  <p className="text-xs font-semibold text-gray-900 truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {(file.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
                
                {/* Botão Principal */}
                <button
                  onClick={() => setPrimaryIndex(index)}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1 ${
                    primaryIndex === index
                      ? 'bg-linear-to-r from-yellow-400 to-yellow-500 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
                  }`}
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {primaryIndex === index ? 'Principal' : 'Definir Principal'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
