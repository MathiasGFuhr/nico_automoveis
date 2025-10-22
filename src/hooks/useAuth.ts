import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import { AuthService } from '@/services/authService'

interface User {
  id: string
  email: string
}

interface UseAuthReturn {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  isAuthenticated: boolean
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    // Verificar sessão inicial
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || ''
          })
        } else if (AuthService.isAdminAuthenticated()) {
          // Fallback para autenticação local
          setUser({
            id: 'admin',
            email: 'admin@nicoautomoveis.com'
          })
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || ''
          })
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const data = await AuthService.signIn(email, password)
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || ''
        })
      }
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      await AuthService.signOut()
      AuthService.adminLogout()
      setUser(null)
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    loading,
    signIn,
    signOut,
    isAuthenticated: !!user || AuthService.isAdminAuthenticated()
  }
}
