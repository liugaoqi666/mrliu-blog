const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('更新数据库中的图片链接...')
  
  // 更新站点头像
  await prisma.siteConfig.updateMany({
    where: { key: 'site_avatar' },
    data: { value: 'https://cdn.jsdelivr.net/gh/liugaoqi666/mrliu-blog/public/b_4ffcf0ba9aa55efb99b4180ee1b6190e.jpg' }
  })
  
  // 更新文章中的图片链接
  const articles = await prisma.article.findMany()
  for (const article of articles) {
    if (article.content.includes('raw.githubusercontent.com')) {
      const newContent = article.content.replace(
        /raw\.githubusercontent\.com\/liugaoqi666\/mrliu-blog\/main\/public\//g,
        'cdn.jsdelivr.net/gh/liugaoqi666/mrliu-blog/public/'
      )
      await prisma.article.update({
        where: { id: article.id },
        data: { content: newContent }
      })
      console.log('更新文章:', article.title)
    }
  }
  
  console.log('链接更新完成')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
