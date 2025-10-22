import Link from 'next/link'
import { Phone, Mail, MapPin, Car } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-secondary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Logo e Descrição */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold">
                <span className="text-primary-500">Nico</span> Automóveis
              </h3>
            </div>
            <p className="text-secondary-300 text-sm">
              Sua concessionária de confiança para veículos usados e seminovos.
            </p>
          </div>
          
          {/* Links Rápidos */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-secondary-300 hover:text-primary-400 transition-colors">Início</Link></li>
              <li><Link href="/veiculos" className="text-secondary-300 hover:text-primary-400 transition-colors">Veículos</Link></li>
              <li><Link href="/sobre" className="text-secondary-300 hover:text-primary-400 transition-colors">Sobre</Link></li>
              <li><Link href="/contato" className="text-secondary-300 hover:text-primary-400 transition-colors">Contato</Link></li>
            </ul>
          </div>
          
          {/* Contato */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-primary-500" />
                <span className="text-secondary-300">(11) 99999-9999</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-primary-500" />
                <span className="text-secondary-300">contato@nicoautomoveis.com</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-primary-500 mt-1" />
                <span className="text-secondary-300">Rua das Flores, 123<br />São Paulo, SP</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-secondary-800 mt-8 pt-6 text-center">
          <p className="text-secondary-400 text-sm">
            &copy; 2024 <span className="text-primary-500">Nico</span> Automóveis. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}