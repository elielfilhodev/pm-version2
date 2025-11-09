import { compare } from 'bcryptjs'
import { prisma } from './prisma'

export async function verifyAdmin(username: string, password: string) {
  try {
    // Verificar se DATABASE_URL está configurado
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL não está configurado')
      throw new Error('DATABASE_URL não está configurado')
    }

    const admin = await prisma.admin.findUnique({
      where: { username },
    })

    if (!admin) {
      console.log('Admin não encontrado:', username)
      return null
    }

    const isValid = await compare(password, admin.password)
    if (!isValid) {
      console.log('Senha inválida para usuário:', username)
      return null
    }

    return { id: admin.id, username: admin.username }
  } catch (error: any) {
    console.error('Erro em verifyAdmin:', error)
    
    // Se for erro de conexão, relançar com mensagem mais clara
    if (error?.code === 'P1001' || error?.message?.includes('connect')) {
      throw new Error('Erro de conexão com o banco de dados. Verifique a DATABASE_URL.')
    }
    
    throw error
  }
}

