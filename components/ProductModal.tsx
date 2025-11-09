'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react'
import { formatPrice, getWhatsAppLink } from '@/lib/utils'

interface ProductModalProps {
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
  isOpen: boolean
  onClose: () => void
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const hasMultipleImages = product.images && product.images.length > 1

  const nextImage = () => {
    if (product.images && product.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
    }
  }

  const prevImage = () => {
    if (product.images && product.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft' && hasMultipleImages) {
        e.preventDefault()
        setCurrentImageIndex((prev) => {
          if (!product.images || product.images.length === 0) return prev
          return (prev - 1 + product.images.length) % product.images.length
        })
      } else if (e.key === 'ArrowRight' && hasMultipleImages) {
        e.preventDefault()
        setCurrentImageIndex((prev) => {
          if (!product.images || product.images.length === 0) return prev
          return (prev + 1) % product.images.length
        })
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose, hasMultipleImages, product.images])

  if (!isOpen) return null

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5511999999999'
  const message = `Olá! Gostaria de encomendar: ${product.name} - ${formatPrice(product.price)}`
  const whatsappLink = getWhatsAppLink(whatsappNumber, message)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Imagem Principal */}
        <div className="relative w-full md:w-1/2 h-64 md:h-auto bg-gray-100">
          {product.images && product.images.length > 0 ? (
            <>
              <Image
                src={product.images[currentImageIndex]}
                alt={`${product.name} - Imagem ${currentImageIndex + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              
              {/* Navegação de Imagens */}
              {hasMultipleImages && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 rounded-full p-2 shadow-lg transition-all z-10"
                    aria-label="Imagem anterior"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 rounded-full p-2 shadow-lg transition-all z-10"
                    aria-label="Próxima imagem"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  
                  {/* Indicador de Imagem */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {product.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex
                            ? 'bg-white w-8'
                            : 'bg-white/50 hover:bg-white/75'
                        }`}
                        aria-label={`Ir para imagem ${index + 1}`}
                      />
                    ))}
                  </div>
                  
                  {/* Contador de Imagens */}
                  <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-10">
                    {currentImageIndex + 1} / {product.images.length}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Sem imagem
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {product.isNew && (
              <span className="bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                NOVO
              </span>
            )}
            {!product.inStock && (
              <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                ESGOTADO
              </span>
            )}
          </div>
        </div>

        {/* Conteúdo */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 md:relative md:top-0 md:right-0 md:ml-auto bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full p-2 transition-colors mb-4"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mb-4">
            <span className="text-xs text-primary-600 font-semibold uppercase tracking-wide">
              {product.category.name}
            </span>
          </div>

          <h2 className="font-elegant text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {product.name}
          </h2>

          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            {product.description}
          </p>

          <div className="mt-auto pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <span className="font-elegant text-4xl font-bold text-primary-600">
                {formatPrice(product.price)}
              </span>
            </div>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full btn-primary flex items-center justify-center gap-2 text-lg py-3"
            >
              <ShoppingBag className="w-5 h-5" />
              Encomendar pelo WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

