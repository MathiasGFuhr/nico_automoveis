import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verificar se está tentando acessar rotas administrativas
  if (pathname.startsWith('/admin')) {
    // Permitir acesso à página de login
    if (pathname === '/admin/login') {
      return NextResponse.next()
    }

    // Verificar se há autenticação no localStorage (simulado)
    // Em produção, usar cookies ou JWT
    const adminAuth = request.cookies.get('adminAuth')
    
    if (!adminAuth || adminAuth.value !== 'true') {
      // Redirecionar para login se não autenticado
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}
