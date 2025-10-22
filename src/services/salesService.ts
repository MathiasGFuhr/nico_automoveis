import { createClient } from '@/lib/supabase-client'

export interface SaleData {
  vehicle_id: string
  client_id: string
  seller_id: string
  price: number
  commission_rate: number
  payment_method: string
  status?: 'pending' | 'completed' | 'cancelled' | 'refunded'
  sale_date: string
  notes?: string
}

export class SalesService {
  // Criar nova venda
  static async createSale(saleData: SaleData) {
    const supabase = createClient()
    
    // Gerar código de venda único (máximo 20 caracteres)
    const timestamp = Date.now().toString().slice(-8) // Últimos 8 dígitos
    const random = Math.random().toString(36).substr(2, 4).toUpperCase() // 4 caracteres
    const saleCode = `VND-${timestamp}-${random}`
    
    const status = saleData.status || 'pending'
    
    // Inserir venda
    const { data, error } = await supabase
      .from('sales')
      .insert([{
        ...saleData,
        sale_code: saleCode,
        status: status
      }])
      .select(`
        *,
        clients!inner(id, name, email, phone),
        vehicles!inner(id, model, year, brands!inner(name)),
        users!inner(id, name, email)
      `)
      .single()

    if (error) throw error
    
    // Se a venda foi concluída, marcar veículo como vendido
    if (status === 'completed') {
      console.log('🚗 Atualizando veículo para status "sold":', saleData.vehicle_id)
      
      const { error: vehicleError } = await supabase
        .from('vehicles')
        .update({ status: 'sold' })
        .eq('id', saleData.vehicle_id)
      
      if (vehicleError) {
        console.error('❌ Erro ao atualizar status do veículo:', vehicleError)
        throw new Error(`Erro ao marcar veículo como vendido: ${vehicleError.message}`)
      } else {
        console.log('✅ Veículo marcado como vendido com sucesso!')
      }
    }
    
    return data
  }

  // Alias para createSale
  static async addSale(saleData: SaleData) {
    return this.createSale(saleData)
  }

  // Atualizar venda
  static async updateSale(id: string, saleData: Partial<SaleData>) {
    const supabase = createClient()
    
    // Buscar venda atual para verificar mudança de status
    const { data: currentSale } = await supabase
      .from('sales')
      .select('status, vehicle_id')
      .eq('id', id)
      .single()
    
    // Atualizar venda
    const { data, error } = await supabase
      .from('sales')
      .update(saleData)
      .eq('id', id)
      .select(`
        *,
        clients!inner(id, name, email, phone),
        vehicles!inner(id, model, year, brands!inner(name)),
        users!inner(id, name, email)
      `)
      .single()

    if (error) throw error
    
    // Gerenciar status do veículo baseado na mudança de status da venda
    if (currentSale && saleData.status) {
      const oldStatus = currentSale.status
      const newStatus = saleData.status
      const vehicleId = saleData.vehicle_id || currentSale.vehicle_id
      
      // Se mudou de não-concluída para concluída, marcar veículo como vendido
      if (oldStatus !== 'completed' && newStatus === 'completed') {
        await supabase
          .from('vehicles')
          .update({ status: 'sold' })
          .eq('id', vehicleId)
      }
      
      // Se mudou de concluída para cancelada/reembolsada, voltar veículo para disponível
      if (oldStatus === 'completed' && (newStatus === 'cancelled' || newStatus === 'refunded')) {
        await supabase
          .from('vehicles')
          .update({ status: 'available' })
          .eq('id', vehicleId)
      }
    }
    
    return data
  }

  // Deletar venda
  static async deleteSale(id: string) {
    const supabase = createClient()
    
    // Buscar dados da venda antes de excluir
    const { data: sale } = await supabase
      .from('sales')
      .select('status, vehicle_id')
      .eq('id', id)
      .single()
    
    // Deletar venda
    const { error } = await supabase
      .from('sales')
      .delete()
      .eq('id', id)

    if (error) throw error
    
    // Se a venda estava concluída, voltar veículo para disponível
    if (sale && sale.status === 'completed') {
      await supabase
        .from('vehicles')
        .update({ status: 'available' })
        .eq('id', sale.vehicle_id)
    }
    
    return true
  }

  // Buscar venda por ID
  static async getSaleById(id: string) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('sales')
      .select(`
        *,
        client:clients!inner(id, name, email, phone, cpf),
        vehicle:vehicles!inner(
          id, 
          model, 
          year, 
          fuel_type,
          transmission,
          brands!inner(name)
        ),
        seller:users!inner(id, name, email)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  // Obter métricas de vendas
  static async getSalesMetrics() {
    const supabase = createClient()
    
    const { data: sales, error } = await supabase
      .from('sales')
      .select('price, commission_amount, status')

    if (error) throw error

    const totalSales = sales
      ?.filter(sale => sale.status === 'completed')
      .reduce((sum, sale) => sum + sale.price, 0) || 0

    const totalCommission = sales
      ?.filter(sale => sale.status === 'completed')
      .reduce((sum, sale) => sum + sale.commission_amount, 0) || 0

    const pendingSales = sales?.filter(sale => sale.status === 'pending').length || 0
    const completedSales = sales?.filter(sale => sale.status === 'completed').length || 0
    const cancelledSales = sales?.filter(sale => sale.status === 'cancelled').length || 0

    return {
      totalSales,
      totalCommission,
      pendingSales,
      completedSales,
      cancelledSales,
      totalCount: sales?.length || 0
    }
  }
}

