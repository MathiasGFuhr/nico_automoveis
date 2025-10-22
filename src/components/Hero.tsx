import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <div className="relative bg-linear-to-r from-primary-700 to-primary-800 overflow-hidden">
      {/* Imagem de fundo dos carros */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1920&h=1080&fit=crop&crop=center")'
        }}
        role="img"
        aria-label="Showroom de carros usados e seminovos da Nico Automóveis"
      />
      
      {/* Overlay escuro para melhor contraste do texto */}
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 lg:py-24">
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 drop-shadow-lg leading-tight"
          >
            Encontre o Carro dos Seus Sonhos
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-white/90 mb-6 md:mb-8 max-w-2xl lg:max-w-3xl mx-auto drop-shadow-md leading-relaxed"
          >
            A melhor seleção de veículos usados e seminovos com garantia e qualidade comprovada.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
          >
            <Link 
              href="/veiculos"
              className="w-full sm:w-auto bg-white text-primary-600 px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-secondary-50 hover:scale-105 transition-all duration-300 shadow-lg text-center"
            >
              Ver Veículos
            </Link>
            <Link 
              href="/contato"
              className="w-full sm:w-auto border-2 border-white text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 hover:scale-105 transition-all duration-300 backdrop-blur-sm text-center"
            >
              Fale Conosco
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
