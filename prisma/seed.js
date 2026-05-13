const { PrismaClient } = require('../src/generated/prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('开始初始化数据库...')

  // 创建管理员用户
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
      email: '3208613859@qq.com',
      nickname: 'Mr.Liu',
      role: 'admin',
    },
  })
  console.log('管理员用户创建完成:', admin.username)

  // 创建分类
  const categories = [
    { name: 'HCIA', slug: 'hcia', icon: '🎓', sort: 1 },
    { name: 'HCIP', slug: 'hcip', icon: '📚', sort: 2 },
    { name: '网络安全', slug: 'cybersecurity', icon: '🔒', sort: 3 },
    { name: '随笔', slug: 'essay', icon: '✍️', sort: 4 },
    { name: 'Linux', slug: 'linux', icon: '🐧', sort: 5 },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  console.log('分类创建完成')

  // 创建标签
  const tags = [
    { name: 'SQL注入', slug: 'sql-injection' },
    { name: '网络安全', slug: 'cybersecurity' },
    { name: '编码', slug: 'encoding' },
    { name: '靶场', slug: '靶场' },
    { name: 'CTF', slug: 'ctf' },
    { name: 'CSRF', slug: 'csrf' },
    { name: 'XSS', slug: 'xss' },
    { name: 'Web安全', slug: 'web-security' },
  ]

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    })
  }
  console.log('标签创建完成')

  // 创建示例文章
  const articles = [
    {
      title: '以开发视角打穿自制靶场：Web漏洞原理全景复现',
      content: '# 以开发视角打穿自制靶场\n\n本文依托自制简易博客系统靶场，旨在以开发视角研究Web应用常见漏洞底层原理。\n\n## SQL注入漏洞\n\nSQL注入是最常见的Web安全漏洞之一。\n\n## XSS跨站脚本攻击\n\nXSS攻击允许攻击者在受害者浏览器中注入恶意脚本代码。',
      summary: '本文依托自制简易博客系统靶场，旨在以开发视角研究Web应用常见漏洞底层原理。',
      type: 'blog',
      viewCount: 168,
      likeCount: 37,
      isFeatured: true,
      categoryId: 3,
    },
    {
      title: '编码的设计哲学：从传输到安全',
      content: '# 编码的设计哲学\n\n本文旨在厘清URL编码、HTML实体、Base64、Unicode、十六进制的本质与边界。',
      summary: '本文旨在厘清URL编码、HTML实体、Base64、Unicode、十六进制的本质与边界。',
      type: 'blog',
      viewCount: 299,
      likeCount: 68,
      isFeatured: true,
      categoryId: 3,
    },
    {
      title: '"安全"只有掌握在人的手里才叫安全',
      content: '# "安全"只有掌握在人的手里才叫安全\n\n这两天和大厂的安全大佬聊了许多关于AI安全相关的看法。',
      summary: '这两天和大厂的安全大佬聊了许多关于AI安全相关的看法。',
      type: 'essay',
      viewCount: 168,
      likeCount: 3,
    },
    {
      title: '【实习一周有感】"安全就是吃开发的剩饭"',
      content: '# 实习一周有感\n\n终于开始了人生第一份安全相关的实习工作。',
      summary: '安全就是吃开发的剩饭',
      type: 'essay',
      viewCount: 57,
      likeCount: 3,
    },
  ]

  for (const articleData of articles) {
    const existing = await prisma.article.findFirst({
      where: { title: articleData.title },
    })

    if (!existing) {
      await prisma.article.create({
        data: {
          ...articleData,
          authorId: admin.id,
        },
      })
      console.log(`文章创建完成: ${articleData.title}`)
    }
  }

  // 创建示例留言
  const messages = [
    {
      nickname: 'azerl7',
      content: '添加一个友链呗',
      location: '河北省-石家庄市',
      device: 'Windows · Edge',
      status: 'approved',
    },
    {
      nickname: 'visitor01',
      content: '博主的文章写得很好，学到了很多！',
      location: '北京市',
      device: 'Mac · Chrome',
      status: 'approved',
    },
  ]

  for (const msg of messages) {
    const existing = await prisma.message.findFirst({
      where: { nickname: msg.nickname, content: msg.content },
    })

    if (!existing) {
      await prisma.message.create({ data: msg })
      console.log(`留言创建完成: ${msg.nickname}`)
    }
  }

  // 创建友情链接
  const friendLinks = [
    {
      name: "Mr.Liu's Blog",
      url: 'http://localhost:3001',
      description: '爱偷懒的小刘',
      status: 'approved',
      sort: 1,
    },
  ]

  for (const link of friendLinks) {
    const existing = await prisma.friendLink.findFirst({
      where: { name: link.name },
    })

    if (!existing) {
      await prisma.friendLink.create({ data: link })
      console.log(`友链创建完成: ${link.name}`)
    }
  }

  // 创建站点配置
  const configs = [
    { key: 'site_name', value: "Mr.Liu's Blog" },
    { key: 'site_description', value: '以开发视角，编码的设计哲学：从传输到安全' },
    { key: 'announcement', value: '欢迎来到Mr.Liu的博客！' },
  ]

  for (const config of configs) {
    await prisma.siteConfig.upsert({
      where: { key: config.key },
      update: { value: config.value },
      create: config,
    })
  }
  console.log('站点配置创建完成')

  console.log('数据库初始化完成！')
}

main()
  .catch((e) => {
    console.error('数据库初始化失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
