import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { apiSuccess, apiError, getPagination, getClientIP, getUserAgent } from '@/lib/utils'

// 获取留言列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const { page, pageSize, skip } = getPagination(searchParams)
    const status = searchParams.get('status') || 'approved'

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { parentId: null }
    if (status !== 'all') {
      where.status = status
    }

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              nickname: true,
              avatar: true,
            },
          },
          replies: {
            where: { status: 'approved' },
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  nickname: true,
                  avatar: true,
                },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.message.count({ where }),
    ])

    return apiSuccess({
      items: messages,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    })
  } catch (error) {
    console.error('获取留言列表失败:', error)
    return apiError('获取留言列表失败', 500)
  }
}

// 发表留言
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, nickname, email, website, parentId } = body

    if (!content || !nickname) {
      return apiError('昵称和留言内容不能为空')
    }

    const ip = getClientIP(request)
    const userAgent = getUserAgent(request)

    // 解析设备信息
    let device = '未知设备'
    if (userAgent.includes('Windows')) device = 'Windows'
    else if (userAgent.includes('Mac')) device = 'Mac'
    else if (userAgent.includes('Linux')) device = 'Linux'
    else if (userAgent.includes('Android')) device = 'Android'
    else if (userAgent.includes('iPhone')) device = 'iPhone'

    if (userAgent.includes('Chrome')) device += ' · Chrome'
    else if (userAgent.includes('Firefox')) device += ' · Firefox'
    else if (userAgent.includes('Safari')) device += ' · Safari'
    else if (userAgent.includes('Edge')) device += ' · Edge'

    const message = await prisma.message.create({
      data: {
        content,
        nickname,
        email: email || null,
        website: website || null,
        ip,
        userAgent,
        device,
        location: '未知地区', // 可接入IP地理位置API
        parentId: parentId || null,
      },
    })

    return apiSuccess(message, '留言发表成功')
  } catch (error) {
    console.error('发表留言失败:', error)
    return apiError('发表留言失败', 500)
  }
}
