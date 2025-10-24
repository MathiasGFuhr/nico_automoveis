import { createClient } from '@/lib/supabase-client'
import { cache } from '@/hooks/useCache'

export class ImageService {
  // Upload de imagem para Supabase Storage
  static async uploadImage(file: File, vehicleId: string, isPrimary: boolean = false): Promise<string> {
    const supabase = createClient()
    
    // Verificar se o usuário está autenticado (Supabase ou local)
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    // Se não estiver autenticado no Supabase, verificar autenticação local
    if (authError || !user) {
      const isLocalAuth = localStorage.getItem('adminAuth') === 'true'
      if (!isLocalAuth) {
        console.error('Usuário não autenticado:', authError)
        throw new Error('Usuário não autenticado. Faça login novamente.')
      }
      console.log('Usando autenticação local para upload de imagens')
    } else {
      console.log('Usuário autenticado no Supabase:', user.email)
    }
    
    // Gerar nome único para o arquivo
    const fileExt = file.name.split('.').pop()
    const fileName = `${vehicleId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    
    console.log(`Uploading ${file.name} as ${fileName}`)
    
    // Upload para Supabase Storage
    const { data, error } = await supabase.storage
      .from('vehicle-images')
      .upload(fileName, file)
    
    if (error) {
      console.error(`Erro no storage para ${fileName}:`, error)
      throw new Error(`Erro ao fazer upload da imagem: ${error.message}`)
    }
    
    console.log(`Storage upload successful for ${fileName}`)
    
    // Obter URL pública da imagem
    const { data: { publicUrl } } = supabase.storage
      .from('vehicle-images')
      .getPublicUrl(fileName)
    
    console.log(`Public URL generated: ${publicUrl}`)
    
    // Salvar referência da imagem no banco
    const { error: dbError } = await supabase
      .from('vehicle_images')
      .insert({
        vehicle_id: vehicleId,
        image_url: publicUrl,
        alt_text: file.name,
        is_primary: isPrimary,
        sort_order: 0
      })
    
    if (dbError) {
      console.error(`Erro no banco para ${fileName}:`, dbError)
      throw new Error(`Erro ao salvar referência da imagem: ${dbError.message}`)
    }
    
    console.log(`Database insert successful for ${fileName}`)
    return publicUrl
  }
  
  // Upload múltiplo de imagens
  static async uploadMultipleImages(files: File[], vehicleId: string): Promise<string[]> {
    console.log(`🚀 Iniciando upload PARALELO de ${files.length} imagens para veículo ${vehicleId}`)
    
    try {
      // Upload PARALELO - todas as imagens ao mesmo tempo
      const uploadPromises = files.map(async (file, index) => {
        console.log(`📤 Iniciando upload da imagem ${index + 1}/${files.length}`)
        const url = await this.uploadImage(file, vehicleId, index === 0) // Primeira imagem é primária
        console.log(`✅ Imagem ${index + 1} enviada com sucesso`)
        return url
      })
      
      // Aguardar todos os uploads terminarem
      const uploadedUrls = await Promise.all(uploadPromises)
      
      console.log(`🎉 Upload PARALELO concluído: ${uploadedUrls.length}/${files.length} imagens enviadas`)
      return uploadedUrls
    } catch (error) {
      console.error('❌ Erro no upload paralelo:', error)
      // Fallback para upload sequencial se o paralelo falhar
      console.log('🔄 Tentando upload sequencial como fallback...')
      return await this.uploadMultipleImagesSequential(files, vehicleId)
    }
  }
  
  // Fallback: upload sequencial (método antigo)
  static async uploadMultipleImagesSequential(files: File[], vehicleId: string): Promise<string[]> {
    console.log(`Iniciando upload SEQUENCIAL de ${files.length} imagens para veículo ${vehicleId}`)
    const uploadedUrls: string[] = []
    
    for (let i = 0; i < files.length; i++) {
      try {
        console.log(`Uploading imagem ${i + 1}/${files.length}`)
        const url = await this.uploadImage(files[i], vehicleId, i === 0)
        uploadedUrls.push(url)
        console.log(`Imagem ${i + 1} enviada com sucesso: ${url}`)
        
        // Delay reduzido entre uploads
        if (i < files.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100)) // Reduzido de 500ms para 100ms
        }
      } catch (error) {
        console.error(`Erro ao enviar imagem ${i + 1}:`, error)
      }
    }
    
    console.log(`Upload sequencial concluído: ${uploadedUrls.length}/${files.length} imagens enviadas`)
    return uploadedUrls
  }
  
  // Deletar imagem
  static async deleteImage(imageId: string): Promise<void> {
    const supabase = createClient()
    
    // Buscar dados da imagem incluindo vehicle_id
    const { data: imageData, error: fetchError } = await supabase
      .from('vehicle_images')
      .select('image_url, vehicle_id')
      .eq('id', imageId)
      .single()
    
    if (fetchError) {
      throw new Error(`Erro ao buscar dados da imagem: ${fetchError.message}`)
    }
    
    const vehicleId = imageData.vehicle_id
    
    // Extrair nome do arquivo da URL
    const url = new URL(imageData.image_url)
    const fileName = url.pathname.split('/').pop()
    const fullPath = `vehicle-images/${fileName}`
    
    // Deletar do Storage
    const { error: storageError } = await supabase.storage
      .from('vehicle-images')
      .remove([fullPath])
    
    if (storageError) {
      console.warn(`Erro ao deletar arquivo do storage: ${storageError.message}`)
    }
    
    // Deletar referência do banco
    const { error: dbError } = await supabase
      .from('vehicle_images')
      .delete()
      .eq('id', imageId)
    
    if (dbError) {
      throw new Error(`Erro ao deletar referência da imagem: ${dbError.message}`)
    }
    
    // Limpar cache relacionado ao veículo
    if (vehicleId) {
      cache.clear(`vehicle-${vehicleId}`)
      console.log('Cache do veículo limpo após deletar imagem')
    }
  }
  
  // Deletar imagem por URL (para remoção na edição)
  static async deleteImageByUrl(imageUrl: string): Promise<void> {
    const supabase = createClient()
    
    console.log('Buscando imagem no banco:', imageUrl)
    
    // Buscar dados da imagem por URL incluindo vehicle_id
    const { data: imageData, error: fetchError } = await supabase
      .from('vehicle_images')
      .select('id, image_url, vehicle_id')
      .eq('image_url', imageUrl)
    
    if (fetchError) {
      console.error('Erro ao buscar dados da imagem:', fetchError)
      throw new Error(`Erro ao buscar dados da imagem: ${fetchError.message}`)
    }
    
    console.log('Dados encontrados:', imageData)
    
    // Se não encontrou a imagem, não há nada para deletar
    if (!imageData || imageData.length === 0) {
      console.warn('Imagem não encontrada no banco de dados:', imageUrl)
      return
    }
    
    // Usar a primeira imagem encontrada (deve ser única por URL)
    const image = imageData[0]
    const vehicleId = image.vehicle_id
    console.log('Imagem encontrada com ID:', image.id, 'Vehicle ID:', vehicleId)
    
    // Extrair nome do arquivo da URL
    const url = new URL(image.image_url)
    const fileName = url.pathname.split('/').pop()
    const fullPath = `vehicle-images/${fileName}`
    
    console.log('Deletando arquivo do storage:', fullPath)
    
    // Deletar do Storage
    const { error: storageError } = await supabase.storage
      .from('vehicle-images')
      .remove([fullPath])
    
    if (storageError) {
      console.warn(`Erro ao deletar arquivo do storage: ${storageError.message}`)
    } else {
      console.log('Arquivo removido do storage com sucesso')
    }
    
    console.log('Deletando referência do banco para ID:', image.id)
    
    // Deletar referência do banco
    const { error: dbError } = await supabase
      .from('vehicle_images')
      .delete()
      .eq('id', image.id)
    
    if (dbError) {
      console.error('Erro ao deletar do banco:', dbError)
      throw new Error(`Erro ao deletar referência da imagem: ${dbError.message}`)
    }
    
    console.log('Referência removida do banco com sucesso')
    
    // Limpar cache relacionado ao veículo
    if (vehicleId) {
      cache.clear(`vehicle-${vehicleId}`)
      console.log('Cache do veículo limpo após deletar imagem')
    }
  }
  
  // Obter imagens de um veículo
  static async getVehicleImages(vehicleId: string) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('vehicle_images')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .order('sort_order', { ascending: true })
    
    if (error) {
      throw new Error(`Erro ao buscar imagens: ${error.message}`)
    }
    
    return data || []
  }

  // Alias para getVehicleImages (método usado no código)
  static async getImagesByVehicle(vehicleId: string) {
    return this.getVehicleImages(vehicleId)
  }
  
  // Definir imagem primária
  static async setPrimaryImage(vehicleId: string, imageId: string): Promise<void> {
    const supabase = createClient()
    
    // Remover primária de todas as imagens do veículo
    await supabase
      .from('vehicle_images')
      .update({ is_primary: false })
      .eq('vehicle_id', vehicleId)
    
    // Definir nova primária
    const { error } = await supabase
      .from('vehicle_images')
      .update({ is_primary: true })
      .eq('id', imageId)
    
    if (error) {
      throw new Error(`Erro ao definir imagem primária: ${error.message}`)
    }
    
    // Limpar cache relacionado ao veículo
    cache.clear(`vehicle-${vehicleId}`)
    console.log('Cache do veículo limpo após alterar imagem primária')
  }

  // Limpar imagens duplicadas
  static async removeDuplicateImages(vehicleId: string): Promise<void> {
    const supabase = createClient()
    
    // Buscar todas as imagens do veículo
    const { data: images, error: fetchError } = await supabase
      .from('vehicle_images')
      .select('id, image_url')
      .eq('vehicle_id', vehicleId)
      .order('created_at', { ascending: true })
    
    if (fetchError) {
      throw new Error(`Erro ao buscar imagens: ${fetchError.message}`)
    }
    
    if (!images || images.length === 0) return
    
    // Agrupar por URL e manter apenas a primeira ocorrência
    const seenUrls = new Set<string>()
    const imagesToDelete: string[] = []
    
    for (const image of images) {
      if (seenUrls.has(image.image_url)) {
        imagesToDelete.push(image.id)
      } else {
        seenUrls.add(image.image_url)
      }
    }
    
    // Deletar imagens duplicadas
    if (imagesToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from('vehicle_images')
        .delete()
        .in('id', imagesToDelete)
      
      if (deleteError) {
        throw new Error(`Erro ao remover imagens duplicadas: ${deleteError.message}`)
      }
    }
  }
}
