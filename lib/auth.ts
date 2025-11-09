import { compare } from 'bcryptjs'
import { prisma } from './prisma'

export async function verifyAdmin(username: string, password: string) {
  const admin = await prisma.admin.findUnique({
    where: { username },
  })

  if (!admin) {
    return null
  }

  const isValid = await compare(password, admin.password)
  if (!isValid) {
    return null
  }

  return { id: admin.id, username: admin.username }
}

