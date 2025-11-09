import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/auth'
import { sign } from 'jsonwebtoken'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Usuário e senha são obrigatórios' },
        { status: 400 }
      )
    }

    const admin = await verifyAdmin(username, password)

    if (!admin) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    const token = sign(
      { id: admin.id, username: admin.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return NextResponse.json({ token, admin })
  } catch (error: any) {
    console.error('Erro no login:', error)
    console.error('Stack:', error?.stack)

    // Verificar tipo de erro
    let errorMessage = 'Erro ao fazer login'

    if (error?.message?.includes('DATABASE_URL')) {
      errorMessage = 'Banco de dados não configurado. Verifique a variável DATABASE_URL.'
    } else if (error?.message?.includes('conexão') || error?.code === 'P1001') {
      errorMessage = 'Erro de conexão com o banco de dados.'
    } else if (error?.message) {
      errorMessage = error.message
    }

    // Em produção, não expor detalhes do erro
    const response: any = { error: errorMessage }

    // Apenas em desenvolvimento, adicionar detalhes
    if (process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV === 'development') {
      response.details = error?.stack
      response.errorCode = error?.code
    }

    return NextResponse.json(response, { status: 500 })
  }
}

