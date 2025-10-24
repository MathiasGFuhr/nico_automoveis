'use client'

import { useEffect, useState } from 'react'

interface PerformanceMetrics {
  fcp: number | null // First Contentful Paint
  lcp: number | null // Largest Contentful Paint
  fid: number | null // First Input Delay
  cls: number | null // Cumulative Layout Shift
  ttfb: number | null // Time to First Byte
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null
  })

  useEffect(() => {
    // Apenas em produção
    if (typeof window === 'undefined' || process.env.NODE_ENV === 'development') {
      return
    }

    // Web Vitals monitoring
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        switch (entry.entryType) {
          case 'navigation':
            setMetrics(prev => ({
              ...prev,
              ttfb: (entry as PerformanceNavigationTiming).responseStart - (entry as PerformanceNavigationTiming).requestStart
            }))
            break
          case 'paint':
            if ((entry as PerformancePaintTiming).name === 'first-contentful-paint') {
              setMetrics(prev => ({
                ...prev,
                fcp: (entry as PerformancePaintTiming).startTime
              }))
            }
            break
          case 'largest-contentful-paint':
            setMetrics(prev => ({
              ...prev,
              lcp: (entry as PerformanceEntry).startTime
            }))
            break
          case 'layout-shift':
            if (!(entry as any).hadRecentInput) {
              setMetrics(prev => ({
                ...prev,
                cls: (prev.cls || 0) + (entry as any).value
              }))
            }
            break
          case 'first-input':
            setMetrics(prev => ({
              ...prev,
              fid: (entry as any).processingStart - (entry as any).startTime
            }))
            break
        }
      }
    })

    try {
      observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'layout-shift', 'first-input'] })
    } catch (error) {
      console.warn('Performance Observer not supported:', error)
    }

    // Cleanup
    return () => {
      observer.disconnect()
    }
  }, [])

  // Log das métricas para análise
  useEffect(() => {
    if (metrics.fcp && metrics.lcp && metrics.cls !== null) {
      console.log('📊 Performance Metrics:', {
        'First Contentful Paint': `${metrics.fcp.toFixed(2)}ms`,
        'Largest Contentful Paint': `${metrics.lcp.toFixed(2)}ms`,
        'Cumulative Layout Shift': metrics.cls.toFixed(3),
        'Time to First Byte': metrics.ttfb ? `${metrics.ttfb.toFixed(2)}ms` : 'N/A',
        'First Input Delay': metrics.fid ? `${metrics.fid.toFixed(2)}ms` : 'N/A'
      })

      // Enviar métricas para analytics (opcional)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'web_vitals', {
          event_category: 'Web Vitals',
          event_label: 'Performance',
          value: Math.round(metrics.lcp || 0),
          custom_map: {
            fcp: metrics.fcp,
            lcp: metrics.lcp,
            cls: metrics.cls,
            ttfb: metrics.ttfb,
            fid: metrics.fid
          }
        })
      }
    }
  }, [metrics])

  // Componente não renderiza nada visual
  return null
}
