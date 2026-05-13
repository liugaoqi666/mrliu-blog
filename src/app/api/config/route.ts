import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/utils'

// 获取站点配置
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const key = searchParams.get('key')

    if (key) {
      const config = await prisma.siteConfig.findUnique({
        where: { key },
      })
      return apiSuccess(config)
    }

    const configs = await prisma.siteConfig.findMany()
    return apiSuccess(configs)
  } catch (error) {
    console.error('获取站点配置失败:', error)
    return apiError('获取站点配置失败', 500)
  }
}

// 更新站点配置
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, value } = body

    if (!key) {
      return apiError('配置键不能为空')
    }

    const config = await prisma.siteConfig.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })

    return apiSuccess(config, '配置更新成功')
  } catch (error) {
    console.error('更新站点配置失败:', error)
    return apiError('更新站点配置失败', 500)
  }
}
