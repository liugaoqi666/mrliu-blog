import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/utils'

// 获取文章详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const articleId = parseInt(id)

    if (isNaN(articleId)) {
      return apiError('无效的文章ID')
    }

    const article = await prisma.article.findUnique({
      where: { id: articleId },
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
        comments: {
          where: { status: 'approved', parentId: null },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                nickname: true,
                avatar: true,
              },
            },
            replies: {
              where: { status: 'approved' },
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                    nickname: true,
                    avatar: true,
                  },
                },
              },
              orderBy: { createdAt: 'asc' },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!article) {
      return apiError('文章不存在')
    }

    // 增加阅读量
    await prisma.article.update({
      where: { id: articleId },
      data: { viewCount: { increment: 1 } },
    })

    // 获取上一篇和下一篇
    const [prevArticle, nextArticle] = await Promise.all([
      prisma.article.findFirst({
        where: {
          type: article.type,
          status: 'published',
          createdAt: { lt: article.createdAt },
        },
        orderBy: { createdAt: 'desc' },
        select: { id: true, title: true },
      }),
      prisma.article.findFirst({
        where: {
          type: article.type,
          status: 'published',
          createdAt: { gt: article.createdAt },
        },
        orderBy: { createdAt: 'asc' },
        select: { id: true, title: true },
      }),
    ])

    return apiSuccess({
      ...article,
      viewCount: article.viewCount + 1,
      prevArticle,
      nextArticle,
    })
  } catch (error) {
    console.error('获取文章详情失败:', error)
    return apiError('获取文章详情失败', 500)
  }
}

// 更新文章
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const articleId = parseInt(id)
    const body = await request.json()

    if (isNaN(articleId)) {
      return apiError('无效的文章ID')
    }

    const { title, content, summary, type, categoryId, tagNames, coverImage, isTop, isFeatured, status } = body

    // 更新文章
    const article = await prisma.article.update({
      where: { id: articleId },
      data: {
        title,
        content,
        summary,
        type,
        coverImage,
        isTop,
        isFeatured,
        status,
        categoryId: categoryId || null,
      },
    })

    // 更新标签
    if (tagNames) {
      // 删除旧标签关联
      await prisma.articleTag.deleteMany({
        where: { articleId },
      })

      // 添加新标签关联
      for (const tagName of tagNames) {
        const tag = await prisma.tag.findUnique({
          where: { name: tagName },
        })
        if (tag) {
          await prisma.articleTag.create({
            data: {
              articleId,
              tagId: tag.id,
            },
          })
        }
      }
    }

    return apiSuccess(article, '文章更新成功')
  } catch (error) {
    console.error('更新文章失败:', error)
    return apiError('更新文章失败', 500)
  }
}

// 删除文章
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const articleId = parseInt(id)

    if (isNaN(articleId)) {
      return apiError('无效的文章ID')
    }

    await prisma.article.delete({
      where: { id: articleId },
    })

    return apiSuccess(null, '文章删除成功')
  } catch (error) {
    console.error('删除文章失败:', error)
    return apiError('删除文章失败', 500)
  }
}
