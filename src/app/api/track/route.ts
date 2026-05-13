import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// 记录访问
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { page, referrer } = body

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // 更新或创建今日统计
    await prisma.siteStats.upsert({
      where: { date: today },
      update: {
        pageViewCount: { increment: 1 },
      },
      create: {
        date: today,
        visitorCount: 1,
        pageViewCount: 1,
      },
    })

    return NextResponse.json({ code: 0, message: 'ok' })
  } catch (error) {
    console.error('Track error:', error)
    return NextResponse.json({ code: 500, message: 'error' })
  }
}
