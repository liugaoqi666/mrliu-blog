import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/utils'

// 创建分类
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug, icon, sort } = body

    if (!name || !slug) {
      return apiError('名称和标识不能为空')
    }

    const category = await prisma.category.create({
      data: { name, slug, icon: icon || null, sort: sort || 0 },
    })

    return apiSuccess(category, '创建成功')
  } catch (error) {
    console.error('创建分类失败:', error)
    return apiError('创建失败', 500)
  }
}
