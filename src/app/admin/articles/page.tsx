'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Article {
  id: number
  title: string
  type: string
  status: string
  viewCount: number
  likeCount: number
  createdAt: string
  category: {
    name: string
  } | null
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [type, setType] = useState('')

  useEffect(() => {
    fetchArticles()
  }, [type])

  const fetchArticles = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ pageSize: '50' })
      if (type) params.append('type', type)

      const res = await fetch(`/api/articles?${params}`)
      const data = await res.json()
      if (data.code === 0) {
        setArticles(data.data.items)
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这篇文章吗？')) return

    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.code === 0) {
        fetchArticles()
      }
    } catch (error) {
      console.error('Failed to delete article:', error)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN')
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">文章管理</h1>
        <Link
          href="/admin/articles/new"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + 新建文章
        </Link>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setType('')}
            className={`px-4 py-2 rounded-lg text-sm ${!type ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            全部
          </button>
          <button
            onClick={() => setType('blog')}
            className={`px-4 py-2 rounded-lg text-sm ${type === 'blog' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            博客
          </button>
          <button
            onClick={() => setType('essay')}
            className={`px-4 py-2 rounded-lg text-sm ${type === 'essay' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            随笔
          </button>
        </div>
      </div>

      {/* Article List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">加载中...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">标题</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">分类</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">阅读</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">日期</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/articles/${article.id}`}
                      className="text-gray-900 hover:text-blue-600"
                    >
                      {article.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      article.type === 'blog' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {article.type === 'blog' ? '博客' : '随笔'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {article.category?.name || '-'}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{article.viewCount}</td>
                  <td className="px-6 py-4 text-gray-600">{formatDate(article.createdAt)}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/articles/${article.id}`}
                        className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                      >
                        编辑
                      </Link>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
