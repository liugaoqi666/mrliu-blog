import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/utils'

// 获取友链列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') || 'approved'

    const friendLinks = await prisma.friendLink.findMany({
      where: { status },
      orderBy: { sort: 'asc' },
    })

    return apiSuccess(friendLinks)
  } catch (error) {
    console.error('获取友链列表失败:', error)
    return apiError('获取友链列表失败', 500)
  }
}

// 申请友链
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, url, avatar, description, email } = body

    if (!name || !url) {
      return apiError('网站名称和URL不能为空')
    }

    // 检查是否已存在
    const existing = await prisma.friendLink.findFirst({
      where: { url },
    })

    if (existing) {
      return apiError('该友链已存在')
    }

    const friendLink = await prisma.friendLink.create({
      data: {
        name,
        url,
        avatar: avatar || null,
        description: description || null,
        email: email || null,
        status: 'pending',
      },
    })

    return apiSuccess(friendLink, '友链申请已提交，等待审核')
  } catch (error) {
    console.error('申请友链失败:', error)
    return apiError('申请友链失败', 500)
  }
}
