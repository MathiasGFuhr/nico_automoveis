import { createClient } from '@/lib/supabase-client'

export interface ClientData {
  name: string
  email: string
  phone: string
  cpf: string
  city: string
  state: string
  client_type: 'buyer' | 'seller' | 'prospect'
  status?: 'active' | 'inactive' | 'interested'
  rating?: number
  notes?: string
}

export class ClientService {
  // Buscar todos os clientes
  static async getClients() {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('name')

    if (error) {
      throw new Error(`Erro ao buscar clientes: ${error.message}`)
    }

    return data || []
  }

  // Criar novo cliente
  static async createClient(clientData: ClientData) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('clients')
      .insert([{
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone,
        cpf: clientData.cpf,
        city: clientData.city,
        state: clientData.state,
        client_type: clientData.client_type,
        status: clientData.status || 'active'
      }])
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Alias para createClient
  static async addClient(clientData: ClientData) {
    return this.createClient(clientData)
  }

  // Atualizar cliente
  static async updateClient(id: string, clientData: Partial<ClientData>) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('clients')
      .update(clientData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Deletar cliente
  static async deleteClient(id: string) {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  }

  // Buscar cliente por ID
  static async getClientById(id: string) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }
}

