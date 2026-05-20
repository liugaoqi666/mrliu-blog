const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const comments = await prisma.comment.findMany()
  const messages = await prisma.message.findMany()
  
  console.log('评论数量:', comments.length)
  comments.forEach(c => console.log('-', c.nickname, ':', c.content.substring(0, 30), '状态:', c.status))
  
  console.log('\n留言数量:', messages.length)
  messages.forEach(m => console.log('-', m.nickname, ':', m.content.substring(0, 30), '状态:', m.status))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
