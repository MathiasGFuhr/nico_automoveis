'use client'

import { useState } from 'react'
import imageCompression from 'browser-image-compression'

interface CompressionOptions {
  maxSizeMB?: number
  maxWidthOrHeight?: number
  useWebWorker?: boolean
  quality?: number
}

interface CompressionResult {
  file: File
  originalSize: number
  compressedSize: number
  compressionRatio: number
}

export const useImageCompression = () => {
  const [isCompressing, setIsCompressing] = useState(false)
  const [compressionProgress, setCompressionProgress] = useState(0)

  const compressImage = async (
    file: File,
    options: CompressionOptions = {}
  ): Promise<CompressionResult> => {
    setIsCompressing(true)
    setCompressionProgress(0)

    try {
      const defaultOptions = {
        maxSizeMB: 0.5, // Máximo 500KB
        maxWidthOrHeight: 1200, // Máximo 1200px
        useWebWorker: true,
        quality: 0.8, // Qualidade 80%
        ...options
      }

      const compressedFile = await imageCompression(file, {
        ...defaultOptions,
        onProgress: (progress) => {
          setCompressionProgress(Math.round(progress))
        }
      })

      const originalSize = file.size
      const compressedSize = compressedFile.size
      const compressionRatio = Math.round(((originalSize - compressedSize) / originalSize) * 100)

      console.log(`📸 Imagem comprimida: ${originalSize} → ${compressedSize} bytes (${compressionRatio}% redução)`)

      return {
        file: compressedFile,
        originalSize,
        compressedSize,
        compressionRatio
      }
    } catch (error) {
      console.error('❌ Erro ao comprimir imagem:', error)
      throw error
    } finally {
      setIsCompressing(false)
      setCompressionProgress(0)
    }
  }

  const compressMultipleImages = async (
    files: File[],
    options: CompressionOptions = {}
  ): Promise<CompressionResult[]> => {
    setIsCompressing(true)
    setCompressionProgress(0)

    try {
      const results: CompressionResult[] = []
      const totalFiles = files.length

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const progress = Math.round(((i + 1) / totalFiles) * 100)
        setCompressionProgress(progress)

        const result = await compressImage(file, options)
        results.push(result)
      }

      return results
    } finally {
      setIsCompressing(false)
      setCompressionProgress(0)
    }
  }

  return {
    compressImage,
    compressMultipleImages,
    isCompressing,
    compressionProgress
  }
}
