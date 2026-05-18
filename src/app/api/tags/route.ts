import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/utils'

// 获取标签列表
export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    })

    return apiSuccess(tags)
  } catch (error) {
    console.error('获取标签列表失败:', error)
    return apiError('获取标签列表失败', 500)
  }
}

// 创建标签
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug } = body

    if (!name || !slug) {
      return apiError('名称和标识不能为空')
    }

    const tag = await prisma.tag.create({
      data: { name, slug },
    })

    return apiSuccess(tag, '创建成功')
  } catch (error) {
    console.error('创建标签失败:', error)
    return apiError('创建失败', 500)
  }
}
