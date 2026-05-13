import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'mrliu-blog-secret-key-2026'

// 验证JWT token
export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as {
      id: number
      username: string
      role: string
    }
  } catch {
    return null
  }
}

// 生成JWT token
export function generateToken(payload: {
  id: number
  username: string
  role: string
}) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

// API响应工具
export function apiSuccess(data: unknown, message = 'success') {
  return NextResponse.json({ code: 0, message, data })
}

export function apiError(message: string, code = 400) {
  return NextResponse.json({ code, message, data: null }, { status: code })
}

// 获取分页参数
export function getPagination(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get('pageSize') || '10')))
  return { page, pageSize, skip: (page - 1) * pageSize }
}

// 获取客户端IP
export function getClientIP(request: NextRequest) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}

// 获取User-Agent
export function getUserAgent(request: NextRequest) {
  return request.headers.get('user-agent') || 'unknown'
}
