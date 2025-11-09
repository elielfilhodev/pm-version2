'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { Edit, Trash2, Eye } from 'lucide-react'

interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  isNew: boolean
  inStock: boolean
  category: {
    name: string
  }
}

interface ProductListProps {
  onEdit: (product: Product) => void
}

export default function ProductList({ onEdit }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/products', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
      return
    }

    setDeleting(id)
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setProducts(products.filter((p) => p.id !== id))
      } else {
        alert('Erro ao excluir produto')
      }
    } catch (error) {
      alert('Erro ao excluir produto')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600">Carregando produtos...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Lista de Produtos</h2>
        <div className="text-sm text-gray-600">
          Total: {products.length} produto(s)
        </div>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500">Nenhum produto cadastrado ainda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="card">
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Sem imagem
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                  {product.isNew && (
                    <span className="bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded">
                      NOVO
                    </span>
                  )}
                  {!product.inStock && (
                    <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                      ESGOTADO
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <div className="mb-2">
                  <span className="text-xs text-primary-600 font-semibold">
                    {product.category.name}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-1 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {product.description}
                </p>
                <p className="text-lg font-bold text-primary-600 mb-3">
                  {formatPrice(product.price)}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="flex-1 btn-secondary flex items-center justify-center gap-2 text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    disabled={deleting === product.id}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    {deleting === product.id ? 'Excluindo...' : 'Excluir'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

