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
    const { name, description } = data

    if (!name) {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      )
    }

    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const category = await prisma.category.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        description: description || null,
      },
    })

    return NextResponse.json(category)
  } catch (error: any) {
    console.error('Erro ao atualizar categoria:', error)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Categoria com este nome já existe' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Erro ao atualizar categoria' },
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

    await prisma.category.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Erro ao excluir categoria:', error)
    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'Não é possível excluir categoria com produtos associados' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Erro ao excluir categoria' },
      { status: 500 }
    )
  }
}

