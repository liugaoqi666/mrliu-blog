import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/utils'

// 更新标签
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const tagId = parseInt(id)
    const body = await request.json()

    if (isNaN(tagId)) {
      return apiError('无效的ID')
    }

    const tag = await prisma.tag.update({
      where: { id: tagId },
      data: body,
    })

    return apiSuccess(tag, '更新成功')
  } catch (error) {
    console.error('更新标签失败:', error)
    return apiError('更新失败', 500)
  }
}

// 删除标签
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const tagId = parseInt(id)

    if (isNaN(tagId)) {
      return apiError('无效的ID')
    }

    await prisma.tag.delete({
      where: { id: tagId },
    })

    return apiSuccess(null, '删除成功')
  } catch (error) {
    console.error('删除标签失败:', error)
    return apiError('删除失败', 500)
  }
}
