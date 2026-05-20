const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const music = await prisma.gallery.findMany({
    where: { type: 'music' }
  })
  
  console.log('音乐数量:', music.length)
  music.forEach(m => console.log('-', m.title, m.url))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
