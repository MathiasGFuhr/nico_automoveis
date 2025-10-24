'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

interface ErrorPageProps {
  title: string
  message: string
  actionText?: string
  actionHref?: string
  onAction?: () => void
  showHomeButton?: boolean
}

export default function ErrorPage({
  title,
  message,
  actionText = 'Voltar',
  actionHref = '/',
  onAction,
  showHomeButton = true
}: ErrorPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to from-slate-50 via-white to-slate-100">
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          className="text-center max-w-md mx-auto px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Ícone de erro */}
          <motion.div
            className="text-8xl mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            ⚠️
          </motion.div>

          {/* Título */}
          <motion.h1
            className="text-2xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {title}
          </motion.h1>

          {/* Mensagem */}
          <motion.p
            className="text-gray-600 mb-8 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {message}
          </motion.p>

          {/* Botões de ação */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {onAction ? (
              <button
                onClick={onAction}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
              >
                {actionText}
              </button>
            ) : (
              <Link
                href={actionHref}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
              >
                {actionText}
              </Link>
            )}

            {showHomeButton && (
              <Link
                href="/"
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
              >
                Ir para Início
              </Link>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
