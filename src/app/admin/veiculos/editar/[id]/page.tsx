'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import AdminSidebar from '@/components/AdminSidebar'
import { VehicleService } from '@/services/vehicleService'
import { ImageService } from '@/services/imageService'
import { FuelType, TransmissionType } from '@/types/vehicle'
import { VehicleImageUpload } from '@/components/VehicleImageUpload'
import { createClient } from '@/lib/supabase-client'
import { toast } from 'sonner'
import {
  Car,
  Save,
  Menu,
  LogOut,
  Settings,
  Upload,
  X,
  Plus,
  Image as ImageIcon,
  ArrowLeft,
  Star,
} from 'lucide-react'
import imageCompression from 'browser-image-compression'

export default function EditarVeiculo() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingVehicle, setIsLoadingVehicle] = useState(true)
  const router = useRouter()
  const params = useParams()
  const vehicleId = params.id as string

  const [formData, setFormData] = useState({
    brand: '', model: '', year: '', price: '', mileage: '', fuel: '', transmission: '', color: '',
    doors: '', category: '', condition: '', description: '', city: 'Santo Cristo', state: 'RS',
    plateEnd: '', acceptsTrade: false, licensed: true, features: [] as string[],
    images: [] as File[], imagePreviews: [] as string[], existingImages: [] as string[],
  })
  const [primaryImageUrl, setPrimaryImageUrl] = useState<string>('')

  // ... (useEffect checkAuth, handleLogout, handleInputChange, handleFeatureToggle) ...
  useEffect(() => {
    const checkAuth = () => { /* ... */ }
    checkAuth()
  }, [router])
  const handleLogout = () => { /* ... */ }
  const handleInputChange = (field: string, value: string | boolean) => { /* ... */ }
  const handleFeatureToggle = (feature: string) => { /* ... */ }


  // Função de Upload de Imagem (com compressão)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newFiles = Array.from(files)
      const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true, fileType: 'image/jpeg', quality: 0.85 }
      toast.info(`Comprimindo ${newFiles.length} imagem(ns)...`)
      try {
        const compressionPromises = newFiles.map(file => imageCompression(file, options))
        const compressedFiles = await Promise.all(compressionPromises)
        const newPreviews = compressedFiles.map(file => URL.createObjectURL(file))
        setFormData(prev => ({ ...prev, images: [...prev.images, ...compressedFiles], imagePreviews: [...prev.imagePreviews, ...newPreviews] }))
        toast.success(`${compressedFiles.length} imagem(ns) comprimidas!`)
      } catch (error) { toast.error('Erro ao comprimir imagens.') }
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => {
      URL.revokeObjectURL(prev.imagePreviews[index])
      return { ...prev, images: prev.images.filter((_, i) => i !== index), imagePreviews: prev.imagePreviews.filter((_, i) => i !== index) }
    })
  }

  const removeExistingImage = async (index: number) => {
    const imageToRemove = formData.existingImages[index]
    if (!window.confirm(`Apagar esta imagem? Ação irreversível.`)) return
    try {
      await ImageService.deleteImageByUrl(imageToRemove)
      
      // Remover da lista local
      setFormData(prev => ({
        ...prev,
        existingImages: prev.existingImages.filter((_, i) => i !== index)
      }))
      
      // Recarregar dados do veículo para garantir sincronização
      const updatedVehicle = await VehicleService.getVehicleById(vehicleId)
      if (updatedVehicle) {
        setFormData(prev => ({
          ...prev,
          existingImages: updatedVehicle.images || []
        }))
        setPrimaryImageUrl(updatedVehicle.image || '')
      }
      
      console.log('Imagem removida com sucesso do banco e da interface')
      toast.success('Imagem removida com sucesso!')
    } catch (error) {
      console.error('Erro ao remover imagem:', error)
      toast.error('Erro ao remover imagem. Tente novamente.')
    }
  }

  const setPrimaryImage = async (imageUrl: string) => {
    try {
      // Buscar o ID da imagem pela URL
      const supabase = createClient()
      const { data: imageData, error: fetchError } = await supabase
        .from('vehicle_images')
        .select('id')
        .eq('image_url', imageUrl)
        .eq('vehicle_id', vehicleId)
      
      if (fetchError || !imageData || imageData.length === 0) {
        throw new Error('Imagem não encontrada')
      }
      
      await ImageService.setPrimaryImage(vehicleId, imageData[0].id)
      
      // Recarregar dados do veículo para garantir sincronização
      const updatedVehicle = await VehicleService.getVehicleById(vehicleId)
      if (updatedVehicle) {
        setFormData(prev => ({
          ...prev,
          existingImages: updatedVehicle.images || []
        }))
        setPrimaryImageUrl(updatedVehicle.image || '')
      }
      
      toast.success('Imagem principal definida com sucesso!')
    } catch (error) {
      console.error('Erro ao definir imagem principal:', error)
      toast.error('Erro ao definir imagem principal. Tente novamente.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const brands = await VehicleService.getBrands()
      const categories = await VehicleService.getCategories()
      const brandId = brands.find(b => b.name.toLowerCase() === formData.brand.toLowerCase())?.id || brands[0]?.id
      const categoryId = categories.find(c => c.name.toLowerCase() === (formData.category || 'sedan').toLowerCase())?.id || categories[0]?.id
      if (!brandId || !categoryId) throw new Error("Marca ou Categoria não encontrada.")

      // --- CORREÇÃO DO PREÇO (BUG 2) ---
      const numericPriceInCents = formData.price ? parseInt(formData.price.replace(/[^\d]/g, '')) : 0
      const priceForDatabase = numericPriceInCents / 100
      // --- FIM DA CORREÇÃO ---

      const vehicleData = {
        model: formData.model, brand_id: brandId, category_id: categoryId,
        year: formData.year ? parseInt(formData.year) : new Date().getFullYear(),
        price: priceForDatabase, // <-- CORREÇÃO DO PREÇO APLICADA
        mileage: formData.mileage ? parseInt(formData.mileage) : 0,
        fuel_type: formData.fuel as FuelType, transmission: formData.transmission as TransmissionType,
        color: formData.color, doors: formData.doors ? parseInt(formData.doors) : 4,
        city: formData.city, state: formData.state, plate_end: formData.plateEnd,
        accepts_trade: formData.acceptsTrade, licensed: formData.licensed,
        description: formData.description, status: 'available' as const, featured: false,
        // NÃO INCLUIR 'primary_image_url' AQUI, ele é atualizado separadamente
      }
      await VehicleService.updateVehicle(vehicleId, vehicleData)

      if (formData.features.length > 0) {
        try { await VehicleService.upsertVehicleFeatures(vehicleId, formData.features) }
        catch (featureError) { console.error('Erro características:', featureError) }
      }

      if (formData.images.length > 0) {
        try {
          console.log(`Enviando ${formData.images.length} novas imagens para ${vehicleId}`)
          await ImageService.uploadMultipleImages(formData.images, vehicleId)
          console.log(`Novas imagens enviadas`)
        } catch (imageError) { console.error('Erro upload novas imagens:', imageError) }
      }

      try { await ImageService.removeDuplicateImages(vehicleId) }
      catch (cleanupError) { console.error('Erro limpar duplicadas:', cleanupError) }

      // Se NENHUMA imagem principal está definida após todas as operações
      // E ainda existem imagens (sejam novas ou antigas)
      // Tenta definir a PRIMEIRA imagem da lista atual como principal
      if (!primaryImageUrl) {
         const currentImages = await ImageService.getImagesByVehicle(vehicleId)
         if (currentImages.length > 0) {
             await setPrimaryImage(currentImages[0].image_url) // Usa a função setPrimaryImage para garantir a atualização no BD
             console.log("Imagem principal definida automaticamente como a primeira da lista.")
         }
      }

      toast.success('Veículo atualizado!')
      router.push('/admin/veiculos')
    } catch (error) {
      console.error('Erro ao atualizar:', error)
      toast.error('Erro ao atualizar veículo.')
    } finally { setIsSaving(false) }
  }

  // ... (Resto do seu código JSX, não precisa mudar nada)
  
   if (isLoading) { /* ... */ }
   if (!isAuthenticated) { return null }
   if (isLoadingVehicle) { /* ... */ }

   const brands: string[] = [ /* ... */ ]; const features: string[] = [ /* ... */ ];
   const sidebarCssVar = { /* ... */ } as React.CSSProperties;

  return (
    <div className="min-h-screen bg-secondary-50 flex">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      </div>
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl">
            <AdminSidebar isCollapsed={false} onToggle={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-[--sidebar-width]" style={sidebarCssVar}>
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
         {/* ... */}
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Informações Básicas */}
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">Informações Básicas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {/* ... Campos Marca, Modelo, Ano, Preço, KM, Combustível, Transmissão, Cor, Placa, Troca, Licenciado ... */}
                     <div> <label className="block text-sm font-medium text-secondary-700 mb-2">Marca *</label> <select required value={formData.brand} onChange={(e) => handleInputChange('brand', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"> <option value="">Selecione</option> {brands.map(brand => (<option key={brand} value={brand}>{brand}</option>))} </select> </div>
                     <div> <label className="block text-sm font-medium text-secondary-700 mb-2">Modelo *</label> <input type="text" required value={formData.model} onChange={(e) => handleInputChange('model', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="Ex: Corolla"/> </div>
                     <div> <label className="block text-sm font-medium text-secondary-700 mb-2">Ano *</label> <input type="number" required value={formData.year} onChange={(e) => handleInputChange('year', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="2022" min="1990" max="2024"/> </div>
                     <div> <label className="block text-sm font-medium text-secondary-700 mb-2">Preço *</label> <input type="text" required value={formData.price} onChange={(e) => { const numericValue = e.target.value.replace(/[^\d]/g, ''); if (numericValue) { const number = parseInt(numericValue); const formatted = (number / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); handleInputChange('price', formatted); } else { handleInputChange('price', ''); } }} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="R$ 0,00"/> </div>
                     <div> <label className="block text-sm font-medium text-secondary-700 mb-2">Quilometragem *</label> <input type="number" required value={formData.mileage} onChange={(e) => handleInputChange('mileage', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="15000"/> </div>
                     <div> <label className="block text-sm font-medium text-secondary-700 mb-2">Combustível *</label> <select required value={formData.fuel} onChange={(e) => handleInputChange('fuel', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"> <option value="">Selecione</option><option value="Flex">Flex</option><option value="Gasolina">Gasolina</option><option value="Etanol">Etanol</option><option value="Diesel">Diesel</option><option value="Híbrido">Híbrido</option><option value="Elétrico">Elétrico</option> </select> </div>
                     <div> <label className="block text-sm font-medium text-secondary-700 mb-2">Transmissão *</label> <select required value={formData.transmission} onChange={(e) => handleInputChange('transmission', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"> <option value="">Selecione</option><option value="Manual">Manual</option><option value="Automático">Automático</option><option value="CVT">CVT</option><option value="Semi-automático">Semi-automático</option> </select> </div>
                     <div> <label className="block text-sm font-medium text-secondary-700 mb-2">Cor *</label> <input type="text" required value={formData.color} onChange={(e) => handleInputChange('color', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="Branco"/> </div>
                     <div> <label className="block text-sm font-medium text-secondary-700 mb-2">Final da Placa</label> <input type="text" value={formData.plateEnd} onChange={(e) => handleInputChange('plateEnd', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="8" maxLength={1}/> </div>
                     <div className="flex items-center space-x-4"> <label className="flex items-center space-x-2"> <input type="checkbox" checked={formData.acceptsTrade} onChange={(e) => handleInputChange('acceptsTrade', e.target.checked)} className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"/> <span className="text-sm text-secondary-700">Aceita troca</span> </label> <label className="flex items-center space-x-2"> <input type="checkbox" checked={formData.licensed} onChange={(e) => handleInputChange('licensed', e.target.checked)} className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"/> <span className="text-sm text-secondary-700">Licenciado</span> </label> </div>
                  </div>
                </div>
                {/* Características */}
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">Características</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* ... Campos Portas, Categoria, Condição ... */}
                    <div> <label className="block text-sm font-medium text-secondary-700 mb-2">Número de Portas</label> <select value={formData.doors} onChange={(e) => handleInputChange('doors', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"> <option value="">Selecione</option><option value="2">2 Portas</option><option value="4">4 Portas</option><option value="5">5 Portas</option> </select> </div>
                    <div> <label className="block text-sm font-medium text-secondary-700 mb-2">Categoria</label> <select value={formData.category} onChange={(e) => handleInputChange('category', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"> <option value="">Selecione</option><option value="Sedan">Sedan</option><option value="Hatchback">Hatchback</option><option value="SUV">SUV</option><option value="Pickup">Pickup</option><option value="Coupé">Coupé</option><option value="Conversível">Conversível</option> </select> </div>
                    <div> <label className="block text-sm font-medium text-secondary-700 mb-2">Condição</label> <select value={formData.condition} onChange={(e) => handleInputChange('condition', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"> <option value="">Selecione</option><option value="Seminovo">Seminovo</option><option value="Usado">Usado</option><option value="Novo">Novo</option> </select> </div>
                  </div>
                </div>
                {/* Opcionais */}
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">Opcionais</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {features.map(feature => ( <label key={feature} className="flex items-center space-x-2 cursor-pointer"> <input type="checkbox" checked={formData.features.includes(feature)} onChange={() => handleFeatureToggle(feature)} className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"/> <span className="text-sm text-secondary-700">{feature}</span> </label> ))}
                  </div>
                </div>
                {/* Descrição */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Descrição</label>
                  <textarea value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="Descreva o veículo..."/>
                </div>
                {/* Imagens Existentes */}
                {formData.existingImages.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-900 mb-4">Imagens Atuais</h3>
                    <p className="text-sm text-secondary-600 mb-4">Imagens removidas aqui serão apagadas permanentemente.</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.existingImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <Image src={`${image}?width=300&quality=75`} alt={`Imagem ${index + 1}`} width={300} height={96} className="w-full h-24 object-cover rounded-lg"/>
                          <button type="button" onClick={() => removeExistingImage(index)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"> <X className="w-4 h-4"/> </button>
                          <button type="button" onClick={() => setPrimaryImage(image)} className={`absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center transition-all ${primaryImageUrl === image ? 'bg-yellow-500 text-white opacity-100' : 'bg-blue-500 text-white hover:bg-blue-600 opacity-0 group-hover:opacity-100'}`} title={primaryImageUrl === image ? "Principal" : "Definir como principal"}> <Star className={`w-4 h-4 ${primaryImageUrl === image ? 'fill-current' : ''}`}/> </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload de Novas Imagens com Compressão Automática */}
                <VehicleImageUpload
                  onImagesChange={(files) => {
                    setFormData(prev => ({
                      ...prev,
                      images: files
                    }))
                  }}
                  className="w-full"
                />
                {/* Botões */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button type="button" onClick={() => router.push('/admin/veiculos')} className="px-6 py-3 border border-gray-300 text-secondary-700 rounded-lg hover:bg-gray-50">Cancelar</button>
                  <button type="submit" disabled={isSaving} className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"> <Save className="w-4 h-4"/> <span>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</span> </button>
                </div>
              </form>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}