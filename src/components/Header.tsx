'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      {/* Barra superior com número da revenda */}
      <div className="bg-primary-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              {/* Mobile: Apenas números */}
              <div className="flex space-x-4 sm:hidden">
                <a 
                  href="https://wa.me/5555997121218?text=Olá! Gostaria de saber mais sobre os veículos disponíveis na Nico Automóveis."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 hover:bg-primary-700 px-3 py-1 rounded transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">
                    (55) 9 9712-1218
                  </span>
                </a>

                <a
                  href="https://wa.me/5555996436044?text=Olá! Gostaria de saber mais sobre os veículos disponíveis na Nico Automóveis."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 hover:bg-primary-700 px-3 py-1 rounded transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">
                    (55) 9 9643-6044
                  </span>
                </a>
              </div>

              {/* Desktop: Informações completas */}
              <div className="hidden sm:flex items-center space-x-4">
                <a 
                  href="https://wa.me/5555997121218?text=Olá! Gostaria de saber mais sobre os veículos disponíveis na Nico Automóveis."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 hover:bg-primary-700 px-3 py-1 rounded transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">
                    WhatsApp: (55) 9 9712-1218 (Nico - Sócio)
                  </span>
                </a>

                <span className="text-gray-300">|</span>

                <a
                  href="https://wa.me/5555996436044?text=Olá! Gostaria de saber mais sobre os veículos disponíveis na Nico Automóveis."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 hover:bg-primary-700 px-3 py-1 rounded transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">
                    WhatsApp: (55) 9 9643-6044 (Lucas - Sócio)
                  </span>
                </a>
                
                <span className="text-gray-300">|</span>
                
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm font-medium">
                    Santo Cristo - RS
                  </span>
                </div>
                
                <span className="text-gray-300">|</span>
                
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium">
                    Abre às 07:30
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <header className="bg-white shadow-sm border-b border-primary-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-secondary-900 hover:text-primary-600 transition-colors">
              <span className="text-primary-600">Nico</span> Automóveis
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-secondary-600 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors">
              Início
            </Link>
            <Link href="/veiculos" className="text-secondary-600 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors">
              Veículos
            </Link>
            <Link href="/sobre" className="text-secondary-600 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors">
              Sobre
            </Link>
            <Link href="/contato" className="text-secondary-600 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors">
              Contato
            </Link>
          </nav>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-secondary-600 hover:text-primary-600 focus:outline-none focus:text-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md p-2"
              aria-label="Abrir menu de navegação"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link 
                href="/" 
                className="text-secondary-600 hover:text-primary-600 block px-3 py-2 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Início
              </Link>
              <Link 
                href="/veiculos" 
                className="text-secondary-600 hover:text-primary-600 block px-3 py-2 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Veículos
              </Link>
              <Link 
                href="/sobre" 
                className="text-secondary-600 hover:text-primary-600 block px-3 py-2 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre
              </Link>
              <Link 
                href="/contato" 
                className="text-secondary-600 hover:text-primary-600 block px-3 py-2 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Contato
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
    </>
  )
}
