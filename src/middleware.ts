import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/utils'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 保护后台路由
  if (pathname.startsWith('/admin')) {
    // 允许登录页面
    if (pathname === '/login') {
      return NextResponse.next()
    }

    // 检查token（从cookie或header中获取）
    const token = request.cookies.get('token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const payload = verifyToken(token)
    if (!payload || payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // 保护API路由
  if (pathname.startsWith('/api/') && 
      !pathname.startsWith('/api/auth/') &&
      !pathname.startsWith('/api/articles') &&
      !pathname.startsWith('/api/categories') &&
      !pathname.startsWith('/api/tags') &&
      !pathname.startsWith('/api/gallery') &&
      !pathname.startsWith('/api/messages') &&
      !pathname.startsWith('/api/friends') &&
      !pathname.startsWith('/api/stats') &&
      !pathname.startsWith('/api/search') &&
      !pathname.startsWith('/api/config') &&
      !pathname.startsWith('/api/upload') &&
      !pathname.startsWith('/api/track')) {
    
    const token = request.cookies.get('token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ code: 401, message: '未授权' })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ code: 401, message: 'token无效' })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/protected/:path*']
}
