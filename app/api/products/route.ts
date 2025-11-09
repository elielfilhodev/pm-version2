import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const revalidate = 60 // Revalidar a cada 60 segundos

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      where: {
        inStock: true, // Apenas produtos em estoque na API pública
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
      { status: 500 }
    )
  }
}

