const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('更新音乐链接...')
  
  await prisma.gallery.updateMany({
    where: { type: 'music' },
    data: {
      url: 'https://cdn.jsdelivr.net/gh/liugaoqi666/mrliu-blog/public/uploads/M500002qU5aY3Qu24y.mp3'
    }
  })
  
  console.log('音乐链接已更新')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
