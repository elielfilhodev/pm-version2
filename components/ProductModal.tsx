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
  const [primaryColor, setPrimaryColor] = useState('#db2777')

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

  useEffect(() => {
    // Buscar cor primária das configurações
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data?.primaryColor) {
          setPrimaryColor(data.primaryColor)
        }
      })
      .catch(() => {
        // Usar cor padrão em caso de erro
      })
  }, [])

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden flex flex-col lg:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Seção Esquerda - Galeria de Imagens */}
        <div className="relative w-full lg:w-3/5 flex flex-col bg-gray-50">
          {/* Botão Fechar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 bg-white/90 hover:bg-white text-gray-700 rounded-full p-2 shadow-lg transition-all"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
            {product.isNew && (
              <span className="bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                NOVO
              </span>
            )}
            {!product.inStock && (
              <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                ESGOTADO
              </span>
            )}
          </div>

          {/* Imagem Principal */}
          <div className="relative flex-1 min-h-[400px] bg-white">
            {product.images && product.images.length > 0 ? (
              <>
                <Image
                  src={product.images[currentImageIndex]}
                  alt={`${product.name} - Imagem ${currentImageIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                />
                
                {/* Navegação por Setas (apenas se houver múltiplas imagens) */}
                {hasMultipleImages && product.images.length > 5 && (
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
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Sem imagem
              </div>
            )}
          </div>

          {/* Galeria de Thumbnails */}
          {hasMultipleImages && (
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? 'shadow-md scale-105'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{
                      borderColor:
                        index === currentImageIndex
                          ? primaryColor
                          : undefined,
                    }}
                    aria-label={`Ver imagem ${index + 1}`}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Seção Direita - Detalhes do Produto */}
        <div className="w-full lg:w-2/5 p-8 lg:p-10 flex flex-col bg-white overflow-y-auto">
          {/* Categoria */}
          <div className="mb-3">
            <span className="text-xs text-primary-600 font-semibold uppercase tracking-wider">
              {product.category.name}
            </span>
          </div>

          {/* Título */}
          <h2 className="font-elegant text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {product.name}
          </h2>

          {/* Descrição */}
          <p className="text-base text-gray-600 mb-8 leading-relaxed">
            {product.description}
          </p>

          {/* Preço e Botão */}
          <div className="mt-auto pt-6 border-t border-gray-200">
            <div className="mb-8">
              <span className="font-elegant text-5xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
            </div>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-3 text-white font-semibold text-lg py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              style={{
                background: `linear-gradient(to right, #22c55e, #16a34a)`,
              }}
            >
              <ShoppingBag className="w-6 h-6" />
              Encomendar via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

