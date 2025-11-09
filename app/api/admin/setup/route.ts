import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

// Esta rota só deve ser usada uma vez para criar o admin inicial
// Em produção, proteja com uma chave secreta ou desabilite após uso
export async function POST(request: Request) {
  try {
    const { username, password, secret } = await request.json()

    // Proteção básica - em produção, use uma chave secreta via variável de ambiente
    const setupSecret = process.env.SETUP_SECRET || 'setup-secret-change-in-production'
    
    if (!secret || secret !== setupSecret) {
      return NextResponse.json(
        { 
          error: 'Não autorizado',
          hint: 'Configure SETUP_SECRET no Vercel e use na requisição'
        },
        { status: 401 }
      )
    }

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Usuário e senha são obrigatórios' },
        { status: 400 }
      )
    }

    const hashedPassword = await hash(password, 10)

    // Verificar se já existe
    const existingAdmin = await prisma.admin.findUnique({
      where: { username },
    })

    if (existingAdmin) {
      // Atualizar senha
      await prisma.admin.update({
        where: { username },
        data: { password: hashedPassword },
      })

      return NextResponse.json({
        success: true,
        message: 'Admin atualizado com sucesso',
        username,
      })
    } else {
      // Criar novo admin
      await prisma.admin.create({
        data: {
          username,
          password: hashedPassword,
        },
      })

      return NextResponse.json({
        success: true,
        message: 'Admin criado com sucesso',
        username,
      })
    }
  } catch (error: any) {
    console.error('Erro no setup:', error)
    return NextResponse.json(
      {
        error: 'Erro ao criar admin',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined,
      },
      { status: 500 }
    )
  }
}

