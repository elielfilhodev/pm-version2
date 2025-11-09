import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Testar conexão com o banco
    await prisma.$connect()
    
    // Verificar se existem admins
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        username: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      databaseConnected: true,
      adminCount: admins.length,
      admins: admins,
    })
  } catch (error: any) {
    console.error('Erro no teste:', error)
    return NextResponse.json(
      {
        success: false,
        databaseConnected: false,
        error: error?.message || 'Erro desconhecido',
        details: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

