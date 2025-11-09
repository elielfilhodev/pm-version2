'use client'

import Image from 'next/image'
import { formatPrice, getWhatsAppLink } from '@/lib/utils'
import { ShoppingBag } from 'lucide-react'

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
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5511999999999'
  const message = `Olá! Gostaria de encomendar: ${product.name} - ${formatPrice(product.price)}`
  const whatsappLink = getWhatsAppLink(whatsappNumber, message)

  return (
    <div className="card group">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Sem imagem
          </div>
        )}
        {product.isNew && (
          <span className="absolute top-2 right-2 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            NOVO
          </span>
        )}
        {!product.inStock && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
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
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary-600">
            {formatPrice(product.price)}
          </span>
        </div>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 w-full btn-primary flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          Encomendar
        </a>
      </div>
    </div>
  )
}

