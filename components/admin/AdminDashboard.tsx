'use client'

import { useEffect, useState } from 'react'
import ProductList from './ProductList'
import ProductForm from './ProductForm'
import CategoryManager from './CategoryManager'
import { LogOut, Package, Plus, Tag } from 'lucide-react'

interface AdminDashboardProps {
  onLogout: () => void
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'add' | 'categories'>('products')
  const [editingProduct, setEditingProduct] = useState<any>(null)

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    onLogout()
  }

  const handleEdit = (product: any) => {
    setEditingProduct(product)
    setActiveTab('add')
  }

  const handleFormSuccess = () => {
    setEditingProduct(null)
    setActiveTab('products')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-primary-600">
              Proenca&apos;s Moda - Admin
            </h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => {
              setActiveTab('products')
              setEditingProduct(null)
            }}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
              activeTab === 'products'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Package className="w-5 h-5" />
            Produtos
          </button>
          <button
            onClick={() => {
              setActiveTab('add')
              setEditingProduct(null)
            }}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
              activeTab === 'add'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Plus className="w-5 h-5" />
            {editingProduct ? 'Editar Produto' : 'Novo Produto'}
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
              activeTab === 'categories'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Tag className="w-5 h-5" />
            Categorias
          </button>
        </div>

        {/* Content */}
        {activeTab === 'products' && <ProductList onEdit={handleEdit} />}
        {activeTab === 'add' && (
          <ProductForm
            product={editingProduct}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setEditingProduct(null)
              setActiveTab('products')
            }}
          />
        )}
        {activeTab === 'categories' && <CategoryManager />}
      </div>
    </div>
  )
}

