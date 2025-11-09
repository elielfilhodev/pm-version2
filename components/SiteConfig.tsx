'use client'

import { useEffect, useState } from 'react'

interface SiteSettings {
  siteName: string
  heroTitle: string
  heroSubtitle: string
  novidadesTitle: string
  colecaoTitle: string
  footerText: string
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
}

export default function SiteConfig({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null)

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        setSettings(data)
        // Aplicar cores dinamicamente via CSS variables
        if (data) {
          const root = document.documentElement
          root.style.setProperty('--color-primary', data.primaryColor)
          root.style.setProperty('--color-secondary', data.secondaryColor)
          root.style.setProperty('--color-bg', data.backgroundColor)
          
          // Atualizar classes Tailwind dinamicamente
          const style = document.createElement('style')
          style.textContent = `
            .text-primary-600 { color: ${data.primaryColor} !important; }
            .bg-primary-600 { background-color: ${data.primaryColor} !important; }
            .hover\\:bg-primary-700:hover { background-color: ${data.secondaryColor} !important; }
            .border-primary-600 { border-color: ${data.primaryColor} !important; }
          `
          document.head.appendChild(style)
        }
      })
      .catch((error) => {
        console.error('Erro ao carregar configurações:', error)
      })
  }, [])

  return <>{children}</>
}

