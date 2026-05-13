import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
import bcrypt from 'bcryptjs'

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
    { name: 'DHCP', slug: 'dhcp' },
    { name: 'Web安全', slug: 'web-security' },
    { name: '渗透测试', slug: 'penetration-test' },
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
      content: `# 以开发视角打穿自制靶场：Web漏洞原理全景复现

## 前言

本文依托自制简易博客系统靶场，旨在以开发视角研究Web应用常见漏洞底层原理。

## SQL注入漏洞

SQL注入是最常见的Web安全漏洞之一。当应用程序未对用户输入进行 proper 验证和转义时，攻击者可以通过构造恶意SQL语句来获取、修改或删除数据库中的数据。

### 原理分析

\`\`\`sql
-- 正常查询
SELECT * FROM users WHERE username = 'admin' AND password = '123456'

-- 注入攻击
SELECT * FROM users WHERE username = 'admin' OR '1='1' --' AND password = '任意值'
\`\`\`

### 防御措施

1. 使用参数化查询
2. 输入验证和过滤
3. 最小权限原则

## XSS跨站脚本攻击

XSS攻击允许攻击者在受害者浏览器中注入恶意脚本代码。

### 存储型XSS

恶意脚本被永久存储在目标服务器上，当用户访问包含恶意脚本的页面时触发。

### 反射型XSS

恶意脚本来自当前HTTP请求，服务器将用户输入直接反射回响应中。

## CSRF跨站请求伪造

CSRF攻击利用用户已认证的身份，在用户不知情的情况下执行非预期操作。

### 防御方案

1. 添加CSRF Token
2. 验证Referer头
3. SameSite Cookie属性

## 总结

通过本次靶场练习，深入理解了Web安全漏洞的原理和防御方法。安全开发需要从设计阶段就考虑安全性，而不是事后补救。`,
      summary: '本文依托自制简易博客系统靶场，旨在以开发视角研究Web应用常见漏洞底层原理，漏洞包括但不限于：SQL注入、XSS、CSRF等。',
      type: 'blog' as const,
      viewCount: 168,
      likeCount: 37,
      isFeatured: true,
      categoryId: 3, // 网络安全
      tagNames: ['靶场', 'SQL注入', '网络安全', 'Web安全'],
    },
    {
      title: '编码的设计哲学：从传输到安全',
      content: `# 编码的设计哲学：从传输到安全

## 引言

本文旨在厘清URL编码、HTML实体、Base64、Unicode、十六进制的本质与边界，并从安全角度切入，探讨编码在Web安全中的应用。

## URL编码

URL编码（Percent-encoding）用于在URL中表示非ASCII字符和特殊字符。

### 编码规则

- 空格编码为 \`%20\` 或 \`+\`
- 特殊字符转换为 \`%HH\` 格式
- UTF-8字符按字节编码

## HTML实体编码

HTML实体用于在HTML中表示特殊字符，防止浏览器将其解析为HTML标签。

### 常用实体

| 字符 | 实体编码 |
|------|----------|
| < | &lt; |
| > | &gt; |
| & | &amp; |
| " | &quot; |

## Base64编码

Base64是一种基于64个可打印字符来表示二进制数据的编码方式。

### 应用场景

1. 电子邮件附件
2. 数据URL
3. 简单的数据混淆

## 编码与安全

### 编码绕过

攻击者经常利用编码差异来绕过安全过滤：

1. 双重URL编码
2. Unicode规范化
3. HTML实体嵌套

### 最佳实践

1. 统一编码规范
2. 输出编码
3. 输入验证与解码顺序

## 总结

编码是Web开发的基石，理解各种编码的原理和应用场景对于构建安全的Web应用至关重要。`,
      summary: '本文旨在厘清URL编码、HTML实体、Base64、Unicode、十六进制的本质与边界，并从安全角度切...',
      type: 'blog' as const,
      viewCount: 299,
      likeCount: 68,
      isFeatured: true,
      categoryId: 3, // 网络安全
      tagNames: ['编码', '网络安全'],
    },
    {
      title: '"安全"只有掌握在人的手里才叫安全',
      content: `# "安全"只有掌握在人的手里才叫安全

## 随想

这两天和大厂的安全大佬聊了许多关于AI安全相关的看法，以及AI for Security的一些落地应用，挺有感触，觉得有必要写一篇随笔记录一下。

## AI与安全

AI技术的快速发展给安全领域带来了新的机遇和挑战：

### AI赋能安全

1. **威胁检测**：AI可以分析海量日志，发现异常行为
2. **漏洞挖掘**：自动化代码审计和漏洞发现
3. **应急响应**：智能化的安全事件处理

### AI带来的新风险

1. **对抗样本**：AI系统可能被欺骗
2. **隐私问题**：训练数据可能泄露敏感信息
3. **深度伪造**：AI生成的虚假内容

## 人的角色

无论技术如何发展，安全的核心始终是人：

- 安全策略需要人来制定
- 安全事件需要人来判断
- 安全文化需要人来培养

## 结语

技术是工具，人才是主体。"安全"只有掌握在人的手里才叫安全。`,
      summary: '这两天和大厂的安全大佬聊了许多关于AI安全相关的看法，以及AI for Security的一些落地应用，挺有感触，觉得有必要写一篇随笔记录一下',
      type: 'essay' as const,
      viewCount: 168,
      likeCount: 3,
    },
    {
      title: '【实习一周有感】"安全就是吃开发的剩饭"',
      content: `# 【实习一周有感】"安全就是吃开发的剩饭"

## 开始实习

终于开始了人生第一份安全相关的实习工作。一周下来，感触颇深。

## 现实与理想的差距

在学校学的安全知识，到了实际工作中发现：

1. **开发优先**：安全往往排在功能开发之后
2. **资源有限**：安全团队规模通常较小
3. **背锅文化**：出了问题安全要担责

## "安全就是吃开发的剩饭"

这句话虽然有些调侃，但也反映了部分现实：

- 安全review通常在开发完成后
- 安全加固可能影响开发进度
- 安全需求经常被降优先级

## 我的思考

虽然现实如此，但我认为安全不应该只是"善后"：

1. **安全左移**：将安全融入开发流程
2. **自动化**：用工具减少人工成本
3. **文化建设**：提升全员安全意识

## 展望

希望能在实习中学到更多，也希望能为安全左移做出一些贡献。`,
      summary: '安全就是吃开发的剩饭',
      type: 'essay' as const,
      viewCount: 57,
      likeCount: 3,
    },
    {
      title: '【实习】开启人生新篇章',
      content: `# 【实习】开启人生新篇章

## 新起点

今天是实习的第一天，怀着忐忑和期待的心情来到了公司。

## 第一天的感受

1. **环境**：公司环境很好，同事们也很友好
2. **工作**：主要是熟悉环境和了解项目
3. **技术**：接触到了一些学校里没学过的工具

## 期待

希望在接下来的实习中：

- 学到实用的安全技能
- 了解企业安全的实际运作
- 积累项目经验

## 加油

新的篇章开始了，加油！`,
      summary: '开启人生新篇章',
      type: 'essay' as const,
      viewCount: 31,
      likeCount: 3,
    },
  ]

  // 获取标签ID映射
  const tagMap = new Map<string, number>()
  const allTags = await prisma.tag.findMany()
  allTags.forEach((tag: { name: string; id: number }) => tagMap.set(tag.name, tag.id))

  for (const articleData of articles) {
    const { tagNames, ...data } = articleData
    
    const existing = await prisma.article.findFirst({
      where: { title: data.title },
    })

    if (!existing) {
      const article = await prisma.article.create({
        data: {
          ...data,
          authorId: admin.id,
        },
      })

      // 关联标签
      if (tagNames) {
        for (const tagName of tagNames) {
          const tagId = tagMap.get(tagName)
          if (tagId) {
            await prisma.articleTag.create({
              data: {
                articleId: article.id,
                tagId,
              },
            })
          }
        }
      }

      console.log(`文章创建完成: ${article.title}`)
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
    {
      nickname: 'security_fan',
      content: '请问靶场环境怎么搭建？',
      location: '上海市',
      device: 'Windows · Chrome',
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

  // 创建博主回复
  const existingReply = await prisma.message.findFirst({
    where: { nickname: 'Mr.Liu', content: '已添加，欢迎互访！' },
  })

  if (!existingReply) {
    const firstMessage = await prisma.message.findFirst({
      where: { nickname: 'azerl7' },
    })

    if (firstMessage) {
      await prisma.message.create({
        data: {
          nickname: 'Mr.Liu',
          content: '已添加，欢迎互访！',
          location: '湖北十堰',
          device: 'Windows · Chrome',
          status: 'approved',
          parentId: firstMessage.id,
        },
      })
      console.log('博主回复创建完成')
    }
  }

  // 创建友情链接
  const friendLinks = [
    {
      name: "Mr.Liu's Blog",
      url: 'http://localhost:3000',
      description: '爱偷懒的小刘',
      status: 'approved',
      sort: 1,
    },
    {
      name: '技术博客示例',
      url: 'https://example.com',
      description: '一个技术博客',
      status: 'approved',
      sort: 2,
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

  // 创建画廊内容
  const galleries = [
    {
      title: '校园风景',
      description: '美丽的校园一角',
      type: 'photo' as const,
      url: '/images/gallery/campus.jpg',
      thumbnail: '/images/gallery/campus-thumb.jpg',
      sortOrder: 1,
    },
    {
      title: '日落时分',
      description: '夕阳西下的美景',
      type: 'photo' as const,
      url: '/images/gallery/sunset.jpg',
      thumbnail: '/images/gallery/sunset-thumb.jpg',
      sortOrder: 2,
    },
    {
      title: '夜曲',
      description: '周杰伦经典歌曲',
      type: 'music' as const,
      url: 'https://music.example.com/night-rhythm.mp3',
      artist: '周杰伦',
      duration: '3:46',
      sortOrder: 1,
    },
  ]

  for (const item of galleries) {
    const existing = await prisma.gallery.findFirst({
      where: { title: item.title },
    })

    if (!existing) {
      await prisma.gallery.create({ data: item })
      console.log(`画廊内容创建完成: ${item.title}`)
    }
  }

  // 创建站点配置
  const configs = [
    { key: 'site_name', value: "Mr.Liu's Blog" },
    { key: 'site_description', value: '以开发视角，编码的设计哲学：从传输到安全' },
    { key: 'site_keywords', value: '网络安全,博客,Mr.Liu,HCIA,HCIP' },
    { key: 'announcement', value: '欢迎来到Mr.Liu的博客！' },
    { key: 'icp_number', value: '' },
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
