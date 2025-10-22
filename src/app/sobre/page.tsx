import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-secondary-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-4">
            Sobre a <span className="text-primary-600">Nico Automóveis</span>
          </h1>
          <p className="text-lg text-secondary-600 max-w-3xl mx-auto">
            Localizada em Santo Cristo - RS, somos referência em veículos usados e seminovos com qualidade e confiança.
          </p>
        </div>

        {/* História */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-secondary-900 mb-6">
                Nossa História
              </h2>
              <p className="text-secondary-600 mb-4">
                A Nico Automóveis está localizada em Santo Cristo - RS, na R. Santos Cristo, 1891-1923. 
                Nossa revenda nasceu com a missão de democratizar o acesso a veículos de qualidade na região.
              </p>
              <p className="text-secondary-600 mb-4">
                Construímos nossa reputação baseada na transparência, qualidade dos veículos e atendimento 
                personalizado. Cada carro que passa por nossas mãos é rigorosamente inspecionado e preparado 
                para oferecer a melhor experiência ao cliente.
              </p>
              <p className="text-secondary-600">
                Nossa equipe é formada por profissionais experientes e apaixonados por automóveis, sempre prontos 
                para ajudar você a encontrar o veículo ideal.
              </p>
            </div>
            <div className="bg-primary-100 rounded-lg p-8">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary-600 mb-2">RS</div>
                  <div className="text-secondary-600">Rio Grande do Sul</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-600 mb-2">2</div>
                  <div className="text-secondary-600">Contatos WhatsApp</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-600 mb-2">07:30</div>
                  <div className="text-secondary-600">Horário de Abertura</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-600 mb-2">100%</div>
                  <div className="text-secondary-600">Transparência</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Missão, Visão, Valores */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-secondary-900 text-center mb-12">
            Nossos Pilares
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-4">Missão</h3>
              <p className="text-secondary-600">
                Proporcionar acesso a veículos de qualidade, oferecendo transparência, confiança e excelência no atendimento.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-4">Visão</h3>
              <p className="text-secondary-600">
                Ser a concessionária de referência em veículos usados, reconhecida pela qualidade e inovação no atendimento.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-4">Valores</h3>
              <p className="text-secondary-600">
                Transparência, qualidade, confiança, inovação e compromisso com a satisfação do cliente.
              </p>
            </div>
          </div>
        </section>

        {/* Equipe */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-secondary-900 text-center mb-12">
            Nossa Equipe
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-24 h-24 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-600">N</span>
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-2">Nico</h3>
              <p className="text-primary-600 font-semibold mb-2">Sócio & Proprietário</p>
              <p className="text-secondary-600 text-sm">
                WhatsApp: (55) 9 9712-1218
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-24 h-24 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-600">L</span>
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-2">Lucas</h3>
              <p className="text-primary-600 font-semibold mb-2">Sócio & Proprietário</p>
              <p className="text-secondary-600 text-sm">
                WhatsApp: (55) 9 9643-6044
              </p>
            </div>
          </div>
        </section>

        {/* Diferenciais */}
        <section className="bg-primary-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-secondary-900 text-center mb-12">
            Nossos Diferenciais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-secondary-900 mb-2">Garantia</h3>
              <p className="text-sm text-secondary-600">Todos os veículos com garantia</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="font-semibold text-secondary-900 mb-2">Financiamento</h3>
              <p className="text-sm text-secondary-600">Parcerias com bancos</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="font-semibold text-secondary-900 mb-2">Suporte</h3>
              <p className="text-sm text-secondary-600">Atendimento 24/7</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-secondary-900 mb-2">Qualidade</h3>
              <p className="text-sm text-secondary-600">Inspeção rigorosa</p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
