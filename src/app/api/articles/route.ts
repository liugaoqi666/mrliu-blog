import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { apiSuccess, apiError, getPagination } from '@/lib/utils'

// 获取文章列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const { page, pageSize, skip } = getPagination(searchParams)
    const type = searchParams.get('type') || 'blog'
    const categorySlug = searchParams.get('category')
    const tagSlug = searchParams.get('tag')
    const featured = searchParams.get('featured')
    const status = searchParams.get('status') || 'published'

    // 构建查询条件
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      type,
      status,
    }

    if (categorySlug) {
      const category = await prisma.category.findUnique({
        where: { slug: categorySlug },
      })
      if (category) {
        where.categoryId = category.id
      }
    }

    if (featured === 'true') {
      where.isFeatured = true
    }

    // 标签筛选
    if (tagSlug) {
      const tag = await prisma.tag.findUnique({
        where: { slug: tagSlug },
      })
      if (tag) {
        where.tags = {
          some: {
            tagId: tag.id,
          },
        }
      }
    }

    // 查询文章
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              nickname: true,
              avatar: true,
            },
          },
          category: true,
          tags: {
            include: {
              tag: true,
            },
          },
          _count: {
            select: {
              comments: {
                where: { status: 'approved' },
              },
            },
          },
        },
        orderBy: [
          { isTop: 'desc' },
          { createdAt: 'desc' },
        ],
        skip,
        take: pageSize,
      }),
      prisma.article.count({ where }),
    ])

    return apiSuccess({
      items: articles,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    })
  } catch (error) {
    console.error('获取文章列表失败:', error)
    return apiError('获取文章列表失败', 500)
  }
}

// 创建文章
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, summary, type, categoryId, tagNames, coverImage, isTop, isFeatured } = body

    // 验证必填字段
    if (!title || !content) {
      return apiError('标题和内容不能为空')
    }

    // 创建文章
    const article = await prisma.article.create({
      data: {
        title,
        content,
        summary: summary || content.substring(0, 200),
        type: type || 'blog',
        coverImage,
        isTop: isTop || false,
        isFeatured: isFeatured || false,
        authorId: 1, // 默认管理员
        categoryId: categoryId || null,
      },
    })

    // 关联标签
    if (tagNames && tagNames.length > 0) {
      for (const tagName of tagNames) {
        const tag = await prisma.tag.findUnique({
          where: { name: tagName },
        })
        if (tag) {
          await prisma.articleTag.create({
            data: {
              articleId: article.id,
              tagId: tag.id,
            },
          })
        }
      }
    }

    return apiSuccess(article, '文章创建成功')
  } catch (error) {
    console.error('创建文章失败:', error)
    return apiError('创建文章失败', 500)
  }
}
