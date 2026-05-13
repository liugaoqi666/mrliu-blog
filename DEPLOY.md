# Mr.Liu's Blog 部署指南

## 技术栈

- **前端**: Next.js 14 + TypeScript + TailwindCSS
- **后端**: Next.js API Routes
- **数据库**: MySQL (PlanetScale / TiDB Cloud / Railway)
- **部署**: Vercel

---

## 部署前准备

### 1. 准备数据库

推荐使用 [PlanetScale](https://planetscale.com/)（免费）：

1. 注册 PlanetScale 账号
2. 创建数据库 `mrliu_blog`
3. 获取连接字符串

### 2. 准备代码

```bash
# 克隆代码
git clone <your-repo-url>
cd mrliu-blog

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 填入数据库连接信息
```

---

## Vercel 部署步骤

### 1. 推送到 GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. 在 Vercel 中导入项目

1. 访问 [vercel.com](https://vercel.com)
2. 点击 "New Project"
3. 导入你的 GitHub 仓库
4. 配置环境变量：
   - `DATABASE_URL`: 数据库连接字符串
   - `JWT_SECRET`: 随机生成的密钥
   - `NEXT_PUBLIC_SITE_URL`: 你的域名

### 3. 配置构建设置

- **Framework Preset**: Next.js
- **Build Command**: `npx prisma generate && next build`
- **Install Command**: `npm install`

### 4. 部署

点击 "Deploy" 按钮，等待部署完成。

---

## 部署后初始化

### 1. 初始化数据库

在 Vercel 项目的 Settings > Functions 中运行：

```bash
npx prisma db push
```

或者在本地连接云端数据库运行：

```bash
DATABASE_URL="your-production-db-url" npx prisma db push
DATABASE_URL="your-production-db-url" node prisma/seed-mysql.js
```

### 2. 配置域名

在 Vercel 项目设置中添加自定义域名。

---

## 环境变量说明

| 变量名 | 说明 | 示例 |
|--------|------|------|
| DATABASE_URL | MySQL连接字符串 | mysql://user:pass@host:3306/db |
| JWT_SECRET | JWT密钥 | your-random-secret-key |
| NEXT_PUBLIC_SITE_URL | 网站URL | https://your-domain.com |
| NODE_ENV | 环境 | production |

---

## 常见问题

### Q: 部署后图片上传不工作？

A: Vercel 的文件系统是只读的，需要配置外部存储（如 S3、OSS）。

### Q: 数据库连接失败？

A: 检查 DATABASE_URL 是否正确，确保数据库允许外部连接。

### Q: 登录后无法访问后台？

A: 检查 JWT_SECRET 是否正确配置。
