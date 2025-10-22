/**
 * Logger Utility
 * 
 * Wrapper para console.log que só funciona em desenvolvimento
 * Em produção, os logs são suprimidos para melhor performance e segurança
 */

const isDevelopment = process.env.NODE_ENV === 'development'

export const logger = {
  /**
   * Log informativo
   */
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log(...args)
    }
  },

  /**
   * Log de erro
   */
  error: (...args: unknown[]) => {
    if (isDevelopment) {
      console.error(...args)
    }
  },

  /**
   * Log de aviso
   */
  warn: (...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(...args)
    }
  },

  /**
   * Log de informação (sempre mostra)
   */
  info: (...args: unknown[]) => {
    console.info(...args)
  },

  /**
   * Log de debug com emoji para melhor visualização
   */
  debug: (emoji: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.log(emoji, ...args)
    }
  },

  /**
   * Agrupa logs relacionados
   */
  group: (label: string) => {
    if (isDevelopment) {
      console.group(label)
    }
  },

  /**
   * Fecha grupo de logs
   */
  groupEnd: () => {
    if (isDevelopment) {
      console.groupEnd()
    }
  }
}

/**
 * Tipos de emoji para logs de debug
 */
export const LOG_EMOJI = {
  SUCCESS: '✅',
  ERROR: '❌',
  WARNING: '⚠️',
  INFO: 'ℹ️',
  LOADING: '⏳',
  SEARCH: '🔍',
  SAVE: '💾',
  DELETE: '🗑️',
  UPDATE: '🔄',
  CREATE: '✨',
  VEHICLE: '🚗',
  CLIENT: '👤',
  SALE: '💰',
  DEBUG: '🐛'
} as const

