'use client'

import { useState, useEffect } from 'react'

interface Stats {
  totalVisitors: number
  totalPageViews: number
  totalArticleViews: number
  articleCount: number
  essayCount: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats')
      const data = await res.json()
      if (data.code === 0) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="animate-pulse">加载中...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">仪表盘</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500">文章数量</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {stats?.articleCount || 0}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500">随笔数量</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {stats?.essayCount || 0}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500">访客总量</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {stats?.totalVisitors?.toLocaleString() || 0}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500">页面浏览量</h3>
          <p className="text-3xl font-bold text-orange-600 mt-2">
            {stats?.totalPageViews?.toLocaleString() || 0}
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h2>
          <div className="space-y-3">
            <a
              href="/admin/articles/new"
              className="block px-4 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              + 新建文章
            </a>
            <a
              href="/admin/gallery/new"
              className="block px-4 py-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
            >
              + 添加画廊内容
            </a>
            <a
              href="/admin/friends/new"
              className="block px-4 py-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
            >
              + 添加友链
            </a>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">系统信息</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>框架: Next.js 16</p>
            <p>数据库: MySQL + Prisma</p>
            <p>前端: TailwindCSS</p>
          </div>
        </div>
      </div>
    </div>
  )
}
