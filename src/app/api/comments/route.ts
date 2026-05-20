import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { apiSuccess, apiError, getPagination } from '@/lib/utils'

// 获取评论列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const { page, pageSize, skip } = getPagination(searchParams)
    const status = searchParams.get('status') || 'approved'

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { parentId: null }
    if (status !== 'all') {
      where.status = status
    }

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        include: {
          article: {
            select: {
              id: true,
              title: true,
            },
          },
          user: {
            select: {
              id: true,
              username: true,
              nickname: true,
              avatar: true,
            },
          },
          replies: {
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
        skip,
        take: pageSize,
      }),
      prisma.comment.count({ where }),
    ])

    return apiSuccess({
      items: comments,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    })
  } catch (error) {
    console.error('获取评论列表失败:', error)
    return apiError('获取评论列表失败', 500)
  }
}
