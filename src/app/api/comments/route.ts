import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { apiSuccess, apiError, getClientIP, getUserAgent } from '@/lib/utils'

// 发表评论
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, articleId, nickname, email, website, parentId } = body

    if (!content) {
      return apiError('评论内容不能为空')
    }

    const ip = getClientIP(request)
    const userAgent = getUserAgent(request)

    const comment = await prisma.comment.create({
      data: {
        content,
        articleId: articleId || null,
        nickname: nickname || '匿名用户',
        email: email || null,
        website: website || null,
        ip,
        userAgent,
        parentId: parentId || null,
        status: 'pending', // 需要审核
      },
    })

    return apiSuccess(comment, '评论已提交，等待审核')
  } catch (error) {
    console.error('发表评论失败:', error)
    return apiError('发表评论失败', 500)
  }
}
