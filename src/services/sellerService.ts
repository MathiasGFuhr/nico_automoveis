import { createClient } from '@/lib/supabase-client'

export interface Seller {
  id: string
  name: string
  email: string
  role: string
}

export class SellerService {
  // Buscar todos os vendedores
  static async getSellers(): Promise<Seller[]> {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, role')
      .eq('role', 'seller')
      .order('name')

    console.log('🔍 SellerService - Data:', data)
    console.log('🔍 SellerService - Error:', error)

    if (error) {
      console.error('❌ Erro ao buscar vendedores:', error)
      // Fallback para vendedores da revenda (Lucas e Nico)
      return [
        { id: '00000000-0000-0000-0000-000000000001', name: 'Nico', email: 'nico@nicoautomoveis.com', role: 'seller' },
        { id: '00000000-0000-0000-0000-000000000002', name: 'Lucas', email: 'lucas@nicoautomoveis.com', role: 'seller' }
      ]
    }
    return data || []
  }

  // Criar novo vendedor
  static async createSeller(sellerData: {
    name: string
    email: string
  }): Promise<Seller> {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('users')
      .insert([{
        name: sellerData.name,
        email: sellerData.email,
        role: 'seller'
      }])
      .select('id, name, email, role')
      .single()

    if (error) throw error
    return data
  }
}
