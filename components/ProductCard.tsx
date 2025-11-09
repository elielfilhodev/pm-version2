'use client'

import { useState } from 'react'
import Image from 'next/image'
import { formatPrice, getWhatsAppLink } from '@/lib/utils'
import { ShoppingBag, Eye } from 'lucide-react'
import ProductModal from './ProductModal'

interface ProductCardProps {
  product: {
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
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5511999999999'
  const message = `Olá! Gostaria de encomendar: ${product.name} - ${formatPrice(product.price)}`
  const whatsappLink = getWhatsAppLink(whatsappNumber, message)

  return (
    <>
      <div className="card group cursor-pointer">
        <div 
          className="relative aspect-square overflow-hidden bg-gray-100"
          onClick={() => setIsModalOpen(true)}
        >
          {product.images && product.images.length > 0 ? (
            <>
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Sem imagem
            </div>
          )}
          {product.isNew && (
            <span className="absolute top-2 right-2 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
              NOVO
            </span>
          )}
          {!product.inStock && (
            <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
              ESGOTADO
            </span>
          )}
        </div>
        <div className="p-4">
          <div className="mb-2">
            <span className="text-xs text-primary-600 font-semibold uppercase">
              {product.category.name}
            </span>
          </div>
          <h3 
            className="font-elegant text-lg font-bold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-primary-600 transition-colors"
            onClick={() => setIsModalOpen(true)}
          >
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between mb-4">
            <span className="font-elegant text-2xl font-bold text-primary-600">
              {formatPrice(product.price)}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 btn-secondary flex items-center justify-center gap-2 text-sm"
            >
              <Eye className="w-4 h-4" />
              Ver Detalhes
            </button>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 btn-primary flex items-center justify-center gap-2 text-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              Encomendar
            </a>
          </div>
        </div>
      </div>

      <ProductModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}

