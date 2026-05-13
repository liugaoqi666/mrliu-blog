const mysql = require('mysql2/promise')
const bcrypt = require('bcryptjs')

async function main() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'mrliu_blog'
  })

  console.log('数据库连接成功!')

  // 创建管理员用户
  const adminPassword = await bcrypt.hash('admin123', 10)
  await connection.execute(
    'INSERT IGNORE INTO users (username, password, email, nickname, role) VALUES (?, ?, ?, ?, ?)',
    ['admin', adminPassword, '3208613859@qq.com', 'Mr.Liu', 'admin']
  )
  console.log('管理员用户创建完成')

  // 获取管理员ID
  const [users] = await connection.execute('SELECT id FROM users WHERE username = ?', ['admin'])
  const adminId = users[0].id

  // 创建分类
  const categories = [
    ['HCIA', 'hcia', '🎓', 1],
    ['HCIP', 'hcip', '📚', 2],
    ['网络安全', 'cybersecurity', '🔒', 3],
    ['随笔', 'essay', '✍️', 4],
    ['Linux', 'linux', '🐧', 5],
  ]

  for (const [name, slug, icon, sort] of categories) {
    await connection.execute(
      'INSERT IGNORE INTO categories (name, slug, icon, sort) VALUES (?, ?, ?, ?)',
      [name, slug, icon, sort]
    )
  }
  console.log('分类创建完成')

  // 创建标签
  const tags = [
    ['SQL注入', 'sql-injection'],
    ['网络安全', 'cybersecurity'],
    ['编码', 'encoding'],
    ['靶场', '靶场'],
    ['CTF', 'ctf'],
    ['CSRF', 'csrf'],
    ['XSS', 'xss'],
    ['Web安全', 'web-security'],
  ]

  for (const [name, slug] of tags) {
    await connection.execute(
      'INSERT IGNORE INTO tags (name, slug) VALUES (?, ?)',
      [name, slug]
    )
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
      categoryId: 3,
    },
    {
      title: '编码的设计哲学：从传输到安全',
      content: '# 编码的设计哲学\n\n本文旨在厘清URL编码、HTML实体、Base64、Unicode、十六进制的本质与边界。',
      summary: '本文旨在厘清URL编码、HTML实体、Base64、Unicode、十六进制的本质与边界。',
      type: 'blog',
      viewCount: 299,
      likeCount: 68,
      categoryId: 3,
    },
    {
      title: '"安全"只有掌握在人的手里才叫安全',
      content: '# "安全"只有掌握在人的手里才叫安全\n\n这两天和大厂的安全大佬聊了许多关于AI安全相关的看法。',
      summary: '这两天和大厂的安全大佬聊了许多关于AI安全相关的看法。',
      type: 'essay',
      viewCount: 168,
      likeCount: 3,
      categoryId: null,
    },
    {
      title: '【实习一周有感】"安全就是吃开发的剩饭"',
      content: '# 实习一周有感\n\n终于开始了人生第一份安全相关的实习工作。',
      summary: '安全就是吃开发的剩饭',
      type: 'essay',
      viewCount: 57,
      likeCount: 3,
      categoryId: null,
    },
  ]

  for (const article of articles) {
    await connection.execute(
      'INSERT IGNORE INTO articles (title, content, summary, type, viewCount, likeCount, authorId, categoryId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [article.title, article.content, article.summary, article.type, article.viewCount, article.likeCount, adminId, article.categoryId || null]
    )
  }
  console.log('文章创建完成')

  // 创建示例留言
  const messages = [
    ['azerl7', '添加一个友链呗', '河北省-石家庄市', 'Windows · Edge', 'approved'],
    ['visitor01', '博主的文章写得很好，学到了很多！', '北京市', 'Mac · Chrome', 'approved'],
  ]

  for (const [nickname, content, location, device, status] of messages) {
    await connection.execute(
      'INSERT IGNORE INTO messages (nickname, content, location, device, status) VALUES (?, ?, ?, ?, ?)',
      [nickname, content, location, device, status]
    )
  }
  console.log('留言创建完成')

  // 创建友情链接
  await connection.execute(
    'INSERT IGNORE INTO friend_links (name, url, description, status, sort) VALUES (?, ?, ?, ?, ?)',
    ["Mr.Liu's Blog", 'http://localhost:3001', '爱偷懒的小刘', 'approved', 1]
  )
  console.log('友链创建完成')

  // 创建站点配置
  const configs = [
    ['site_name', "Mr.Liu's Blog"],
    ['site_description', '以开发视角，编码的设计哲学：从传输到安全'],
    ['announcement', '欢迎来到Mr.Liu的博客！'],
  ]

  for (const [key, value] of configs) {
    await connection.execute(
      'INSERT INTO site_configs (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = ?',
      [key, value, value]
    )
  }
  console.log('站点配置创建完成')

  await connection.end()
  console.log('数据库初始化完成！')
}

main().catch(console.error)
