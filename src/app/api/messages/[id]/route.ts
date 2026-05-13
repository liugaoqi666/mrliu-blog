import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/utils'

// 更新留言
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const messageId = parseInt(id)
    const body = await request.json()

    if (isNaN(messageId)) {
      return apiError('无效的ID')
    }

    const message = await prisma.message.update({
      where: { id: messageId },
      data: body,
    })

    return apiSuccess(message, '更新成功')
  } catch (error) {
    console.error('更新留言失败:', error)
    return apiError('更新失败', 500)
  }
}

// 删除留言
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const messageId = parseInt(id)

    if (isNaN(messageId)) {
      return apiError('无效的ID')
    }

    await prisma.message.delete({
      where: { id: messageId },
    })

    return apiSuccess(null, '删除成功')
  } catch (error) {
    console.error('删除留言失败:', error)
    return apiError('删除失败', 500)
  }
}
