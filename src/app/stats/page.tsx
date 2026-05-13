'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false })

interface StatsData {
  totalVisitors: number
  totalPageViews: number
  totalArticleViews: number
  articleCount: number
  essayCount: number
  trendData: Array<{
    date: string
    visitorCount: number
    pageViewCount: number
  }>
}

export default function StatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setLoading(true)
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

  const getChartOption = () => {
    if (!stats?.trendData) return {}

    return {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['访客数', '浏览量'],
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: stats.trendData.map((item) => {
          const date = new Date(item.date)
          return `${date.getMonth() + 1}-${date.getDate()}`
        }),
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '访客数',
          type: 'line',
          smooth: true,
          data: stats.trendData.map((item) => item.visitorCount),
          itemStyle: { color: '#3B82F6' },
        },
        {
          name: '浏览量',
          type: 'line',
          smooth: true,
          data: stats.trendData.map((item) => item.pageViewCount),
          itemStyle: { color: '#8B5CF6' },
        },
      ],
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6">
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl p-6 h-80">
            <div className="h-full bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">加载失败</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">站点数据</h1>
        <p className="text-gray-600 mt-2">本站的实时访客与流量统计数据</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-3xl font-bold text-blue-600">
            {stats.totalVisitors.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mt-1">访客总量</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-3xl font-bold text-purple-600">
            {stats.totalArticleViews.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mt-1">文章总阅读量</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-3xl font-bold text-green-600">
            {stats.totalPageViews.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mt-1">页面浏览量</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-3xl font-bold text-orange-600">
            {stats.articleCount}
          </p>
          <p className="text-sm text-gray-600 mt-1">文章数</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-3xl font-bold text-pink-600">{stats.essayCount}</p>
          <p className="text-sm text-gray-600 mt-1">随笔数</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-3xl font-bold text-cyan-600">
            {stats.totalPageViews > 0
              ? (stats.totalPageViews / stats.totalVisitors).toFixed(1)
              : '0'}
          </p>
          <p className="text-sm text-gray-600 mt-1">平均浏览页数</p>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">近30天访客趋势</h2>
        <div className="h-80">
          <ReactECharts option={getChartOption()} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>
    </div>
  )
}
