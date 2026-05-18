const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('更新管理员账号密码...')
  
  const newPassword = await bcrypt.hash('lgq666888', 10)
  
  await prisma.user.update({
    where: { username: 'admin' },
    data: {
      username: '3208613859',
      password: newPassword,
    },
  })
  
  console.log('管理员账号已更新为: 3208613859')
  console.log('密码已更新为: lgq666888')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
