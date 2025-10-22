import { ReactNode } from 'react'

interface PremiumCardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'elevated' | 'floating'
  gradient?: boolean
}

export default function PremiumCard({ 
  children, 
  className = '', 
  variant = 'default',
  gradient = false 
}: PremiumCardProps) {
  const baseClasses = 'rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl'
  
  const variantClasses = {
    default: 'bg-white border border-gray-100',
    elevated: 'bg-white border border-gray-100 shadow-2xl hover:shadow-3xl',
    floating: 'bg-white border border-gray-100 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1'
  }
  
  const gradientClasses = gradient 
    ? 'bg-gradient-to-br from-white via-gray-50 to-white' 
    : ''
  
  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${gradientClasses} ${className}`}>
      {children}
    </div>
  )
}
