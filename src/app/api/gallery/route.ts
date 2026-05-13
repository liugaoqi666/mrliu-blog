import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/utils'

// 获取画廊内容
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') || 'photo'

    const galleries = await prisma.gallery.findMany({
      where: { type },
      orderBy: { sortOrder: 'asc' },
    })

    return apiSuccess(galleries)
  } catch (error) {
    console.error('获取画廊内容失败:', error)
    return apiError('获取画廊内容失败', 500)
  }
}

// 创建画廊内容
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, type, url, thumbnail, artist, duration } = body

    if (!title || !url) {
      return apiError('标题和URL不能为空')
    }

    const gallery = await prisma.gallery.create({
      data: {
        title,
        description: description || null,
        type: type || 'photo',
        url,
        thumbnail: thumbnail || null,
        artist: artist || null,
        duration: duration || null,
      },
    })

    return apiSuccess(gallery, '创建成功')
  } catch (error) {
    console.error('创建画廊内容失败:', error)
    return apiError('创建失败', 500)
  }
}
