import { createClient } from '@/lib/supabase-client'

export class AuthService {
  /**
   * Fazer login no Supabase
   */
  static async signIn(email: string, password: string) {
    const supabase = createClient()
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return data
  }

  /**
   * Fazer logout no Supabase
   */
  static async signOut() {
    const supabase = createClient()
    
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  /**
   * Verificar se usuário está autenticado
   */
  static async getCurrentUser() {
    const supabase = createClient()
    
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  }

  /**
   * Verificar sessão ativa
   */
  static async getSession() {
    const supabase = createClient()
    
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  }

  /**
   * Login administrativo simplificado
   * Para desenvolvimento - em produção usar Supabase Auth completo
   */
  static async adminLogin(username: string, password: string) {
    // Credenciais hardcoded para desenvolvimento
    if (username === 'admin' && password === 'nico2024') {
      // Simular login no Supabase com usuário admin
      const supabase = createClient()
      
      // Tentar fazer login com usuário admin do Supabase
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: 'admin@nicoautomoveis.com',
          password: 'admin123'
        })
        
        if (error) {
          // Se não conseguir fazer login, criar sessão local
          console.warn('Supabase auth falhou, usando autenticação local')
          localStorage.setItem('adminAuth', 'true')
          localStorage.setItem('adminUser', username)
          return { user: { id: 'admin', email: 'admin@nicoautomoveis.com' } }
        }
        
        return data
      } catch (err) {
        // Fallback para autenticação local
        console.warn('Erro na autenticação Supabase, usando fallback local')
        localStorage.setItem('adminAuth', 'true')
        localStorage.setItem('adminUser', username)
        return { user: { id: 'admin', email: 'admin@nicoautomoveis.com' } }
      }
    } else {
      throw new Error('Credenciais inválidas')
    }
  }

  /**
   * Verificar se admin está logado
   */
  static isAdminAuthenticated(): boolean {
    return localStorage.getItem('adminAuth') === 'true'
  }

  /**
   * Logout administrativo
   */
  static adminLogout() {
    localStorage.removeItem('adminAuth')
    localStorage.removeItem('adminUser')
    document.cookie = 'adminAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  }
}
