# Mr.Liu's Blog

个人博客网站，基于 Next.js + TypeScript + TailwindCSS + MySQL + Prisma 构建。

## 功能特性

- 博客文章管理（发布、编辑、删除）
- 随笔功能
- 分类和标签系统
- 画廊（影像 + 音乐）
- 留言板（支持回复）
- 友情链接
- 站点数据统计（ECharts 图表）
- 搜索功能
- 用户登录/注册

## 技术栈

| 模块 | 技术 |
|------|------|
| 前端 | Next.js 14 + TypeScript + TailwindCSS |
| 后端 | Next.js API Routes |
| 数据库 | MySQL + Prisma ORM |
| 图表 | ECharts |
| Markdown | react-markdown |

## 快速开始

### 1. 安装依赖

```bash
cd C:\grbk\mrliu-blog
npm install
```

### 2. 配置数据库

编辑 `.env` 文件，修改 MySQL 连接信息：

```env
DATABASE_URL="mysql://用户名:密码@localhost:3306/mrliu_blog"
```

### 3. 创建数据库

在 MySQL 中创建数据库：

```sql
CREATE DATABASE mrliu_blog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. 初始化数据库

```bash
npx prisma db push
npm run db:seed
```

### 5. 生成 Prisma Client

```bash
npx prisma generate
```

### 6. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 默认账号

- 用户名：admin
- 密码：admin123

## 项目结构

```
mrliu-blog/
├── prisma/
│   ├── schema.prisma      # 数据库模型定义
│   └── seed.ts            # 初始数据
├── src/
│   ├── app/
│   │   ├── api/           # API 路由
│   │   ├── blog/          # 博客页面
│   │   ├── essay/         # 随笔页面
│   │   ├── gallery/       # 画廊页面
│   │   ├── guestbook/     # 留言板
│   │   ├── friends/       # 友情链接
│   │   ├── about/         # 关于页面
│   │   ├── stats/         # 站点数据
│   │   ├── search/        # 搜索页面
│   │   └── login/         # 登录页面
│   ├── components/
│   │   └── layout/        # 布局组件
│   ├── lib/
│   │   ├── prisma.ts      # Prisma 客户端
│   │   └── utils.ts       # 工具函数
│   └── types/
│       └── index.ts       # 类型定义
└── package.json
```

## 页面路由

| 路由 | 页面 |
|------|------|
| `/` | 首页 |
| `/blog` | 博客列表 |
| `/blog/:id` | 文章详情 |
| `/essay` | 随笔列表 |
| `/gallery` | 画廊 |
| `/gallery/photo` | 影像专区 |
| `/gallery/music` | 音乐专区 |
| `/guestbook` | 留言板 |
| `/friends` | 友情链接 |
| `/about` | 关于本站 |
| `/stats` | 站点数据 |
| `/search` | 搜索结果 |
| `/login` | 登录 |

## API 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/articles` | GET/POST | 文章列表/创建 |
| `/api/articles/[id]` | GET/PUT/DELETE | 文章详情/更新/删除 |
| `/api/articles/like` | POST | 点赞文章 |
| `/api/categories` | GET | 分类列表 |
| `/api/tags` | GET | 标签列表 |
| `/api/comments` | POST | 发表评论 |
| `/api/messages` | GET/POST | 留言列表/发表 |
| `/api/friends` | GET/POST | 友链列表/申请 |
| `/api/gallery` | GET | 画廊内容 |
| `/api/stats` | GET | 站点统计 |
| `/api/search` | GET | 搜索文章 |
| `/api/config` | GET/PUT | 站点配置 |
| `/api/auth/login` | POST | 用户登录 |
| `/api/auth/register` | POST | 用户注册 |
