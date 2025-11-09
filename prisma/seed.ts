import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Criar admin padrão
  const adminUsername = process.env.ADMIN_USERNAME || 'adnaluana'
  const adminPassword = process.env.ADMIN_PASSWORD || '310824'

  const hashedPassword = await hash(adminPassword, 10)

  const existingAdmin = await prisma.admin.findUnique({
    where: { username: adminUsername },
  })

  if (!existingAdmin) {
    await prisma.admin.create({
      data: {
        username: adminUsername,
        password: hashedPassword,
      },
    })
    console.log('✅ Admin criado:', adminUsername)
  } else {
    // Atualizar senha se necessário
    await prisma.admin.update({
      where: { username: adminUsername },
      data: {
        password: hashedPassword,
      },
    })
    console.log('ℹ️  Admin já existe, senha atualizada:', adminUsername)
  }

  // Criar categorias padrão
  const categories = [
    { name: 'Plus Size', description: 'Roupas tamanhos especiais' },
    { name: 'Vestidos', description: 'Vestidos elegantes' },
    { name: 'Blusas', description: 'Blusas e camisas' },
    { name: 'Calças', description: 'Calças e saias' },
  ]

  for (const cat of categories) {
    const slug = cat.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    await prisma.category.upsert({
      where: { slug },
      update: {},
      create: {
        name: cat.name,
        slug,
        description: cat.description,
      },
    })
  }

  console.log('✅ Categorias criadas')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

