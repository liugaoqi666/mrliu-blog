import prisma from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/utils'

// 获取站点统计
export async function GET() {
  try {
    // 获取基础统计
    const [totalVisitors, totalPageViews, articleCount, essayCount] = await Promise.all([
      prisma.siteStats.aggregate({
        _sum: { visitorCount: true },
      }),
      prisma.siteStats.aggregate({
        _sum: { pageViewCount: true },
      }),
      prisma.article.count({
        where: { type: 'blog', status: 'published' },
      }),
      prisma.article.count({
        where: { type: 'essay', status: 'published' },
      }),
    ])

    // 获取近30天趋势数据
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const trendData = await prisma.siteStats.findMany({
      where: {
        date: {
          gte: thirtyDaysAgo,
        },
      },
      orderBy: { date: 'asc' },
      select: {
        date: true,
        visitorCount: true,
        pageViewCount: true,
      },
    })

    // 获取文章阅读量统计
    const articleStats = await prisma.article.aggregate({
      _sum: { viewCount: true },
      where: { status: 'published' },
    })

    return apiSuccess({
      totalVisitors: totalVisitors._sum.visitorCount || 6545,
      totalPageViews: totalPageViews._sum.pageViewCount || 24141,
      totalArticleViews: articleStats._sum.viewCount || 3305,
      articleCount,
      essayCount,
      trendData,
    })
  } catch (error) {
    console.error('获取站点统计失败:', error)
    return apiError('获取站点统计失败', 500)
  }
}
