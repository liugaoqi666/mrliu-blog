import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { apiSuccess, apiError, getPagination } from '@/lib/utils'

// 搜索文章
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const { page, pageSize, skip } = getPagination(searchParams)

    if (!query) {
      return apiError('搜索关键词不能为空')
    }

    const where = {
      status: 'published',
      OR: [
        { title: { contains: query } },
        { summary: { contains: query } },
        { content: { contains: query } },
      ],
    }

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
        },
        orderBy: { createdAt: 'desc' },
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
      query,
    })
  } catch (error) {
    console.error('搜索失败:', error)
    return apiError('搜索失败', 500)
  }
}
