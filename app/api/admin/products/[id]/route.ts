import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await verifyToken(request)
    if (!admin) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const data = await request.json()
    const { name, description, price, images, categoryId, isNew, inStock } =
      data

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        description,
        price: parseFloat(price),
        images: images || [],
        categoryId,
        isNew: isNew || false,
        inStock: inStock !== undefined ? inStock : true,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Erro ao atualizar produto:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar produto' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await verifyToken(request)
    if (!admin) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    await prisma.product.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao excluir produto:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir produto' },
      { status: 500 }
    )
  }
}

