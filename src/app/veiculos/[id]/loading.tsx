// Este é um componente de Esqueleto de Loading (Skeleton)
// O Next.js vai mostrar ISSO automaticamente em vez da tela preta
// enquanto a sua 'VehicleDetailsPage' (que é async) carrega os dados.

import Header from '@/components/Header' // Importe seus componentes de layout
import Footer from '@/components/Footer'

export default function LoadingVehicleDetails() {
  return (
    <div className="min-h-screen bg-gradient-to from-slate-50 via-white to-slate-100">
      {/* Mostre o Header normal para a transição ser suave */}
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        {/* Skeleton do Breadcrumb */}
        <div className="h-5 bg-gray-200 rounded-md w-1/3 mt-8"></div>

        <div className="mt-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Skeleton da Galeria */}
            <div className="lg:col-span-2">
              <div className="bg-gray-200 rounded-2xl shadow-xl w-full h-[600px] lg:h-[700px]"></div>
            </div>

            {/* Skeleton da Sidebar */}
            <div className="space-y-6">
              <div className="bg-gray-200 rounded-2xl shadow-xl p-8 h-[200px]"></div>
              <div className="bg-gray-200 rounded-2xl shadow-xl p-6 h-[150px]"></div>
            </div>
          </div>
        </div>

        {/* Skeleton das Informações Adicionais */}
        <div className="mt-12 bg-gray-200 rounded-lg shadow-md p-6 h-[150px]"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          <div className="bg-gray-200 rounded-lg shadow-md p-6 h-[200px]"></div>
          <div className="bg-gray-200 rounded-lg shadow-md p-6 h-[200px]"></div>
        </div>
      </main>

      {/* Mostre o Footer normal */}
      <Footer />
    </div>
  )
}