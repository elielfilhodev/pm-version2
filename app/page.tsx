import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/ProductCard'
import { formatPrice } from '@/lib/utils'

export const revalidate = 60 // Revalidar a cada 60 segundos

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return products
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    return []
  }
}

export default async function Home() {
  const products = await getProducts()
  const newProducts = products.filter((p) => p.isNew)
  const inStockProducts = products.filter((p) => p.inStock)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-3xl font-bold text-primary-600">
              Proenca&apos;s Moda
            </Link>
            <nav className="flex gap-6">
              <Link
                href="/"
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
              >
                Início
              </Link>
              <Link
                href="/#produtos"
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
              >
                Produtos
              </Link>
              <Link
                href="/admin"
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
              >
                Admin
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Bem-vinda à{' '}
            <span className="text-primary-600">Proenca&apos;s Moda</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Descubra nossa coleção exclusiva de roupas femininas. Plus size e
            vestidos elegantes para todos os momentos.
          </p>
        </div>
      </section>

      {/* Novidades */}
      {newProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            🆕 Novidades
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {newProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Todos os Produtos */}
      <section id="produtos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Nossa Coleção
        </h2>
        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              Nenhum produto cadastrado ainda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Proenca&apos;s Moda</h3>
            <p className="text-gray-400">
              Moda feminina com estilo e elegância
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

