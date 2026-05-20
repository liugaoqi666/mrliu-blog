const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('添加Python分类...')
  
  await prisma.category.create({
    data: {
      name: 'Python',
      slug: 'python',
      icon: '🐍',
      sort: 6,
    }
  })
  
  console.log('Python分类已添加')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
