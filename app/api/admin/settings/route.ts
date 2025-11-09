import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key'

async function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  const token = authHeader.substring(7)
  try {
    return verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyToken(request)
    if (!admin) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    let settings = await prisma.siteSettings.findFirst()

    // Se não existir, criar com valores padrão
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
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
        },
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Erro ao buscar configurações:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar configurações' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await verifyToken(request)
    if (!admin) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const data = await request.json()
    const {
      siteName,
      heroTitle,
      heroSubtitle,
      novidadesTitle,
      colecaoTitle,
      footerText,
      primaryColor,
      secondaryColor,
      backgroundColor,
    } = data

    let settings = await prisma.siteSettings.findFirst()

    if (settings) {
      // Atualizar existente
      settings = await prisma.siteSettings.update({
        where: { id: settings.id },
        data: {
          siteName,
          heroTitle,
          heroSubtitle,
          novidadesTitle,
          colecaoTitle,
          footerText,
          primaryColor,
          secondaryColor,
          backgroundColor,
        },
      })
    } else {
      // Criar novo
      settings = await prisma.siteSettings.create({
        data: {
          siteName,
          heroTitle,
          heroSubtitle,
          novidadesTitle,
          colecaoTitle,
          footerText,
          primaryColor,
          secondaryColor,
          backgroundColor,
        },
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Erro ao salvar configurações:', error)
    return NextResponse.json(
      { error: 'Erro ao salvar configurações' },
      { status: 500 }
    )
  }
}

