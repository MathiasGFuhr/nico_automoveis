import { memo } from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'white' | 'gray'
  fullScreen?: boolean
  message?: string
}

const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-4',
  lg: 'w-12 h-12 border-4',
  xl: 'w-16 h-16 border-4'
}

const colorClasses = {
  primary: 'border-primary-600 border-t-transparent',
  white: 'border-white border-t-transparent',
  gray: 'border-secondary-600 border-t-transparent'
}

function LoadingSpinner({ 
  size = 'md', 
  color = 'primary',
  fullScreen = false,
  message 
}: LoadingSpinnerProps) {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div 
        className={`
          ${sizeClasses[size]} 
          ${colorClasses[color]} 
          rounded-full animate-spin
        `}
        role="status"
        aria-label="Carregando"
      />
      {message && (
        <p className="text-sm text-secondary-600 animate-pulse">
          {message}
        </p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-secondary-50 z-50">
        {spinner}
      </div>
    )
  }

  return spinner
}

export default memo(LoadingSpinner)

