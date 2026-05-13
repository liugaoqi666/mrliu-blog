import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/utils'

// 更新画廊内容
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const galleryId = parseInt(id)
    const body = await request.json()

    if (isNaN(galleryId)) {
      return apiError('无效的ID')
    }

    const gallery = await prisma.gallery.update({
      where: { id: galleryId },
      data: body,
    })

    return apiSuccess(gallery, '更新成功')
  } catch (error) {
    console.error('更新画廊内容失败:', error)
    return apiError('更新失败', 500)
  }
}

// 删除画廊内容
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const galleryId = parseInt(id)

    if (isNaN(galleryId)) {
      return apiError('无效的ID')
    }

    await prisma.gallery.delete({
      where: { id: galleryId },
    })

    return apiSuccess(null, '删除成功')
  } catch (error) {
    console.error('删除画廊内容失败:', error)
    return apiError('删除失败', 500)
  }
}
