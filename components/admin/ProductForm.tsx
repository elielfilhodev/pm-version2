'use client'

import { useEffect, useState } from 'react'
import { X, Upload } from 'lucide-react'

interface ProductFormProps {
  product?: any
  onSuccess: () => void
  onCancel: () => void
}

export default function ProductForm({
  product,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    isNew: false,
    inStock: true,
    images: [] as string[],
  })
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>([])

  useEffect(() => {
    fetchCategories()
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        categoryId: product.categoryId || '',
        isNew: product.isNew || false,
        inStock: product.inStock !== undefined ? product.inStock : true,
        images: product.images || [],
      })
      setImageUrls(product.images || [])
    }
  }, [product])

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/categories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Erro ao buscar categorias:', error)
    }
  }

  const handleImageUrlAdd = () => {
    const url = prompt('Digite a URL da imagem:')
    if (url && url.trim()) {
      setImageUrls([...imageUrls, url.trim()])
      setFormData({ ...formData, images: [...imageUrls, url.trim()] })
    }
  }

  const handleImageRemove = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index)
    setImageUrls(newUrls)
    setFormData({ ...formData, images: newUrls })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('admin_token')
      const url = product
        ? `/api/admin/products/${product.id}`
        : '/api/admin/products'
      const method = product ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          images: imageUrls,
        }),
      })

      if (response.ok) {
        onSuccess()
      } else {
        const data = await response.json()
        alert(data.error || 'Erro ao salvar produto')
      }
    } catch (error) {
      alert('Erro ao salvar produto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {product ? 'Editar Produto' : 'Novo Produto'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome do Produto *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="input-field"
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preço (R$) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria *
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              className="input-field"
              required
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isNew}
              onChange={(e) =>
                setFormData({ ...formData, isNew: e.target.checked })
              }
              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Produto Novo
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.inStock}
              onChange={(e) =>
                setFormData({ ...formData, inStock: e.target.checked })
              }
              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Em Estoque
            </span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imagens (URLs)
          </label>
          <button
            type="button"
            onClick={handleImageUrlAdd}
            className="btn-secondary flex items-center gap-2 mb-4"
          >
            <Upload className="w-4 h-4" />
            Adicionar URL de Imagem
          </button>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Imagem ${index + 1}`}
                  className="w-full aspect-square object-cover rounded-lg"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src =
                      'https://via.placeholder.com/300'
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleImageRemove(index)}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 btn-primary disabled:opacity-50"
          >
            {loading ? 'Salvando...' : product ? 'Atualizar' : 'Criar Produto'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 btn-secondary"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

