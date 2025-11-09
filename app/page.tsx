import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/ProductCard'
import SiteConfig from '@/components/SiteConfig'
import NavLink from '@/components/NavLink'
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

async function getSettings() {
  try {
    const settings = await prisma.siteSettings.findFirst()
    if (settings) {
      return settings
    }
    // Retornar valores padrão se não existir
    return {
      siteName: "Proenca's Moda",
      heroTitle: "Bem-vinda à Proenca's Moda",
      heroSubtitle:
        'Descubra nossa coleção exclusiva de roupas femininas. Plus size e vestidos elegantes para todos os momentos.',
      novidadesTitle: '🆕 Novidades',
      colecaoTitle: 'Nossa Coleção',
      footerText: 'Moda feminina com estilo e elegância',
      primaryColor: '#db2777',
      secondaryColor: '#ec4899',
      backgroundColor: '#fdf2f8',
    }
  } catch (error) {
    console.error('Erro ao buscar configurações:', error)
    return {
      siteName: "Proenca's Moda",
      heroTitle: "Bem-vinda à Proenca's Moda",
      heroSubtitle:
        'Descubra nossa coleção exclusiva de roupas femininas. Plus size e vestidos elegantes para todos os momentos.',
      novidadesTitle: '🆕 Novidades',
      colecaoTitle: 'Nossa Coleção',
      footerText: 'Moda feminina com estilo e elegância',
      primaryColor: '#db2777',
      secondaryColor: '#ec4899',
      backgroundColor: '#fdf2f8',
    }
  }
}

export default async function Home() {
  const products = await getProducts()
  const settings = await getSettings()
  const newProducts = products.filter((p) => p.isNew)
  const inStockProducts = products.filter((p) => p.inStock)

  return (
    <SiteConfig>
      <div
        className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50"
        style={{
          background: `linear-gradient(to bottom right, ${settings.backgroundColor}, white, ${settings.secondaryColor}20)`,
        }}
      >
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Link
                href="/"
                className="font-elegant text-3xl font-bold"
                style={{ color: settings.primaryColor }}
              >
                {settings.siteName}
              </Link>
            <nav className="flex gap-6">
              <NavLink href="/" primaryColor={settings.primaryColor}>
                Início
              </NavLink>
              <NavLink href="/#produtos" primaryColor={settings.primaryColor}>
                Produtos
              </NavLink>
              <NavLink href="/admin" primaryColor={settings.primaryColor}>
                Admin
              </NavLink>
            </nav>
          </div>
        </div>
      </header>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1
              className="font-elegant text-5xl md:text-6xl font-bold text-gray-900 mb-6"
              dangerouslySetInnerHTML={{
                __html: settings.heroTitle.replace(
                  settings.siteName,
                  `<span style="color: ${settings.primaryColor}">${settings.siteName}</span>`
                ),
              }}
            />
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {settings.heroSubtitle}
            </p>
          </div>
        </section>

        {/* Novidades */}
        {newProducts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="font-elegant text-3xl font-bold text-gray-900 mb-8">
              {settings.novidadesTitle}
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
          <h2 className="font-elegant text-3xl font-bold text-gray-900 mb-8">
            {settings.colecaoTitle}
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
              <h3 className="font-elegant text-2xl font-bold mb-4">
                {settings.siteName}
              </h3>
              <p className="text-gray-400">{settings.footerText}</p>
            </div>
          </div>
        </footer>
      </div>
    </SiteConfig>
  )
}

