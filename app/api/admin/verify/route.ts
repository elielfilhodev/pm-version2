import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verify(token, JWT_SECRET)

    return NextResponse.json({ valid: true, admin: decoded })
  } catch (error) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
  }
}

