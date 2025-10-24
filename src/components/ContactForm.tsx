'use client'

import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Send, User, Mail, Phone, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'

import { ContactFormData } from '@/types'

interface ContactFormProps {
  vehicleId: string
  vehicleName: string
}

export default function ContactForm({ vehicleId, vehicleName }: ContactFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactFormData>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: `Olá, tenho interesse no veículo ${vehicleName} (ID: ${vehicleId}). Por favor, entre em contato.`,
    }
  })

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Simula uma chamada de API mais rápida
      await new Promise((resolve) => setTimeout(resolve, 500))
      console.log('Formulário enviado:', data)
      toast.success('Mensagem enviada com sucesso!')
      reset({
        name: '',
        email: '',
        phone: '',
        message: `Olá, tenho interesse no veículo ${vehicleName} (ID: ${vehicleId}). Por favor, entre em contato.`,
      })
    } catch (error) {
      console.error('Erro ao enviar formulário:', error)
      toast.error('Erro ao enviar mensagem. Tente novamente.')
    }
  }

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-secondary-900 mb-2">
          Interessado neste veículo?
        </h2>
        <p className="text-secondary-600">
          Envie uma mensagem e entraremos em contato com você
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Nome Completo *
            </label>
            <input
              type="text"
              {...register('name', { required: 'Nome é obrigatório' })}
              className="w-full border border-secondary-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Seu nome completo"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              Telefone *
            </label>
            <input
              type="tel"
              {...register('phone', { required: 'Telefone é obrigatório' })}
              className="w-full border border-secondary-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="(11) 99999-9999"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            Email *
          </label>
          <input
            type="email"
            {...register('email', { 
              required: 'Email é obrigatório',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email inválido'
              }
            })}
            className="w-full border border-secondary-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="seu@email.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            <MessageSquare className="w-4 h-4 inline mr-2" />
            Mensagem *
          </label>
          <textarea
            {...register('message', { required: 'Mensagem é obrigatória' })}
            rows={4}
            className="w-full border border-secondary-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
            placeholder="Conte-nos mais sobre seu interesse neste veículo..."
          />
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
          )}
        </motion.div>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Enviando...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Enviar Mensagem</span>
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  )
}