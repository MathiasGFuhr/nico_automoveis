import { createClient } from '@/lib/supabase-client'

export interface ClientData {
  name: string
  email: string | null
  phone: string | null
  cpf: string | null
  city: string | null
  state: string | null
  address?: string | null
  zip_code?: string | null
  client_type: string
  status: string
  notes?: string | null
  birth_date?: string | null
  rg?: string | null
  profession?: string | null
  income?: string | null
  marital_status?: string | null
  has_children?: boolean
  children_count?: number | null
  preferred_contact?: string | null
  interests?: string[]
  rating?: number
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

