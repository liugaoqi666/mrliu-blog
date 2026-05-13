import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/utils'

// 点赞文章
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { articleId } = body

    if (!articleId) {
      return apiError('文章ID不能为空')
    }

    const article = await prisma.article.update({
      where: { id: articleId },
      data: {
        likeCount: {
          increment: 1,
        },
      },
    })

    return apiSuccess({ likeCount: article.likeCount }, '点赞成功')
  } catch (error) {
    console.error('点赞失败:', error)
    return apiError('点赞失败', 500)
  }
}
