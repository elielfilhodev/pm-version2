import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const revalidate = 60 // Revalidar a cada 60 segundos

export async function GET() {
  try {
    let settings = await prisma.siteSettings.findFirst()

    // Se não existir, retornar valores padrão
    if (!settings) {
      return NextResponse.json({
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
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Erro ao buscar configurações:', error)
    // Retornar valores padrão em caso de erro
    return NextResponse.json({
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
    })
  }
}

