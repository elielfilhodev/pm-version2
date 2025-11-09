'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import LoginForm from '@/components/admin/LoginForm'
import AdminDashboard from '@/components/admin/AdminDashboard'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token')
      if (token) {
        try {
          const response = await fetch('/api/admin/verify', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          if (response.ok) {
            setIsAuthenticated(true)
          } else {
            localStorage.removeItem('admin_token')
          }
        } catch (error) {
          localStorage.removeItem('admin_token')
        }
      }
      setLoading(false)
    }
    checkAuth()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Carregando...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={() => setIsAuthenticated(true)} />
  }

  return <AdminDashboard onLogout={() => setIsAuthenticated(false)} />
}

