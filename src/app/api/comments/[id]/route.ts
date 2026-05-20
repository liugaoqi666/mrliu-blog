import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/utils'

// 更新评论
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const commentId = parseInt(id)
    const body = await request.json()

    if (isNaN(commentId)) {
      return apiError('无效的ID')
    }

    const comment = await prisma.comment.update({
      where: { id: commentId },
      data: body,
    })

    return apiSuccess(comment, '更新成功')
  } catch (error) {
    console.error('更新评论失败:', error)
    return apiError('更新失败', 500)
  }
}

// 删除评论
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const commentId = parseInt(id)

    if (isNaN(commentId)) {
      return apiError('无效的ID')
    }

    // 删除评论及其回复
    await prisma.comment.deleteMany({
      where: {
        OR: [
          { id: commentId },
          { parentId: commentId },
        ],
      },
    })

    return apiSuccess(null, '删除成功')
  } catch (error) {
    console.error('删除评论失败:', error)
    return apiError('删除失败', 500)
  }
}
