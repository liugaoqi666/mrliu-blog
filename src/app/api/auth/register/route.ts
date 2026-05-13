import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/utils'
import bcrypt from 'bcryptjs'

// 用户注册
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password, email, nickname } = body

    if (!username || !password) {
      return apiError('用户名和密码不能为空')
    }

    // 检查用户名是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { username },
    })

    if (existingUser) {
      return apiError('用户名已存在')
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10)

    // 创建用户
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email: email || null,
        nickname: nickname || username,
        role: 'user',
      },
    })

    return apiSuccess(
      {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        email: user.email,
      },
      '注册成功'
    )
  } catch (error) {
    console.error('注册失败:', error)
    return apiError('注册失败', 500)
  }
}
