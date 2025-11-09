'use client'

import { useEffect, useState } from 'react'
import { Save, Palette } from 'lucide-react'

interface SiteSettings {
  id?: string
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

export default function SiteSettingsManager() {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: "Proenca's Moda",
    heroTitle: "Bem-vinda à Proenca's Moda",
    heroSubtitle: "Descubra nossa coleção exclusiva de roupas femininas. Plus size e vestidos elegantes para todos os momentos.",
    novidadesTitle: "🆕 Novidades",
    colecaoTitle: "Nossa Coleção",
    footerText: "Moda feminina com estilo e elegância",
    primaryColor: "#db2777",
    secondaryColor: "#ec4899",
    backgroundColor: "#fdf2f8",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/settings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        if (data) {
          setSettings(data)
        }
      }
    } catch (error) {
      console.error('Erro ao buscar configurações:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        alert('Configurações salvas com sucesso!')
        // Recarregar a página após salvar para aplicar as mudanças
        window.location.reload()
      } else {
        const data = await response.json()
        alert(data.error || 'Erro ao salvar configurações')
      }
    } catch (error) {
      alert('Erro ao salvar configurações')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600">Carregando configurações...</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Palette className="w-6 h-6" />
        Configurações do Site
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Textos */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
            Textos e Títulos
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Site
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) =>
                setSettings({ ...settings, siteName: e.target.value })
              }
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título Principal (Hero)
            </label>
            <input
              type="text"
              value={settings.heroTitle}
              onChange={(e) =>
                setSettings({ ...settings, heroTitle: e.target.value })
              }
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtítulo (Hero)
            </label>
            <textarea
              value={settings.heroSubtitle}
              onChange={(e) =>
                setSettings({ ...settings, heroSubtitle: e.target.value })
              }
              className="input-field"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título da Seção Novidades
            </label>
            <input
              type="text"
              value={settings.novidadesTitle}
              onChange={(e) =>
                setSettings({ ...settings, novidadesTitle: e.target.value })
              }
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título da Seção Coleção
            </label>
            <input
              type="text"
              value={settings.colecaoTitle}
              onChange={(e) =>
                setSettings({ ...settings, colecaoTitle: e.target.value })
              }
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Texto do Footer
            </label>
            <input
              type="text"
              value={settings.footerText}
              onChange={(e) =>
                setSettings({ ...settings, footerText: e.target.value })
              }
              className="input-field"
              required
            />
          </div>
        </div>

        {/* Cores */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
            Cores do Site
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cor Primária
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) =>
                    setSettings({ ...settings, primaryColor: e.target.value })
                  }
                  className="w-16 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.primaryColor}
                  onChange={(e) =>
                    setSettings({ ...settings, primaryColor: e.target.value })
                  }
                  className="input-field flex-1"
                  placeholder="#db2777"
                  pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cor Secundária
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.secondaryColor}
                  onChange={(e) =>
                    setSettings({ ...settings, secondaryColor: e.target.value })
                  }
                  className="w-16 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.secondaryColor}
                  onChange={(e) =>
                    setSettings({ ...settings, secondaryColor: e.target.value })
                  }
                  className="input-field flex-1"
                  placeholder="#ec4899"
                  pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cor de Fundo
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      backgroundColor: e.target.value,
                    })
                  }
                  className="w-16 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.backgroundColor}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      backgroundColor: e.target.value,
                    })
                  }
                  className="input-field flex-1"
                  placeholder="#fdf2f8"
                  pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                />
              </div>
            </div>
          </div>

          {/* Preview das cores */}
          <div className="mt-4 p-4 rounded-lg border border-gray-200 bg-gray-50">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Preview das Cores:
            </p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded border border-gray-300"
                  style={{ backgroundColor: settings.primaryColor }}
                />
                <span className="text-sm text-gray-600">Primária</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded border border-gray-300"
                  style={{ backgroundColor: settings.secondaryColor }}
                />
                <span className="text-sm text-gray-600">Secundária</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded border border-gray-300"
                  style={{ backgroundColor: settings.backgroundColor }}
                />
                <span className="text-sm text-gray-600">Fundo</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </button>
        </div>
      </form>
    </div>
  )
}

