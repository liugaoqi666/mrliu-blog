import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/utils'

// 更新友链
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const friendId = parseInt(id)
    const body = await request.json()

    if (isNaN(friendId)) {
      return apiError('无效的ID')
    }

    const friend = await prisma.friendLink.update({
      where: { id: friendId },
      data: body,
    })

    return apiSuccess(friend, '更新成功')
  } catch (error) {
    console.error('更新友链失败:', error)
    return apiError('更新失败', 500)
  }
}

// 删除友链
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const friendId = parseInt(id)

    if (isNaN(friendId)) {
      return apiError('无效的ID')
    }

    await prisma.friendLink.delete({
      where: { id: friendId },
    })

    return apiSuccess(null, '删除成功')
  } catch (error) {
    console.error('删除友链失败:', error)
    return apiError('删除失败', 500)
  }
}
