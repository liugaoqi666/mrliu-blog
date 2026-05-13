import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/utils'

// 更新分类
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const categoryId = parseInt(id)
    const body = await request.json()

    if (isNaN(categoryId)) {
      return apiError('无效的ID')
    }

    const category = await prisma.category.update({
      where: { id: categoryId },
      data: body,
    })

    return apiSuccess(category, '更新成功')
  } catch (error) {
    console.error('更新分类失败:', error)
    return apiError('更新失败', 500)
  }
}

// 删除分类
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const categoryId = parseInt(id)

    if (isNaN(categoryId)) {
      return apiError('无效的ID')
    }

    await prisma.category.delete({
      where: { id: categoryId },
    })

    return apiSuccess(null, '删除成功')
  } catch (error) {
    console.error('删除分类失败:', error)
    return apiError('删除失败', 500)
  }
}
