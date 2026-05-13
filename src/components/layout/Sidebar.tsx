'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

interface Category {
  id: number
  name: string
  slug: string
  icon: string | null
  _count: { articles: number }
}

interface Tag {
  id: number
  name: string
  slug: string
  _count: { articles: number }
}

export default function Sidebar() {
  const pathname = usePathname()
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    fetchSidebarData()
  }, [])

  const fetchSidebarData = async () => {
    try {
      const [catRes, tagRes, configRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/tags'),
        fetch('/api/config?key=announcement'),
      ])

      if (catRes.ok) {
        const catData = await catRes.json()
        setCategories(catData.data || [])
      }

      if (tagRes.ok) {
        const tagData = await tagRes.json()
        setTags(tagData.data || [])
      }

      if (configRes.ok) {
        const configData = await configRes.json()
        setAnnouncement(configData.data?.value || '')
      }
    } catch (error) {
      console.error('Failed to fetch sidebar data:', error)
    }
  }

  const totalArticles = categories.reduce((sum, cat) => sum + cat._count.articles, 0)

  return (
    <aside className="space-y-6">
      {/* 站点公告 */}
      {announcement && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="flex items-center text-sm font-semibold text-gray-900 mb-3">
            <svg className="w-4 h-4 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" />
            </svg>
            站点公告
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">{announcement}</p>
        </div>
      )}

      {/* 文章分类 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="flex items-center text-sm font-semibold text-gray-900 mb-4">
          <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          文章分类
        </h3>
        <nav className="space-y-1">
          <Link
            href="/blog"
            className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
              pathname === '/blog' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span>全部文章</span>
            <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded-full">{totalArticles}</span>
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/blog?category=${category.slug}`}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                pathname === `/blog?category=${category.slug}` ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center">
                {category.icon && <span className="mr-2">{category.icon}</span>}
                {category.name}
              </span>
              <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded-full">
                {category._count.articles}
              </span>
            </Link>
          ))}
        </nav>
      </div>

      {/* 标签云 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="flex items-center text-sm font-semibold text-gray-900 mb-4">
          <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          标签云
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/blog?tag=${tag.slug}`}
              className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              {tag.name}
              <span className="ml-1 text-gray-400">({tag._count.articles})</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 最新文章 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="flex items-center text-sm font-semibold text-gray-900 mb-4">
          <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          最新文章
        </h3>
        <div className="space-y-3">
          <Link href="/blog/1" className="block group">
            <p className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors line-clamp-2">
              以开发视角打穿自制靶场：Web漏洞原理全景复现
            </p>
            <p className="text-xs text-gray-400 mt-1">2026-05-04</p>
          </Link>
          <Link href="/blog/2" className="block group">
            <p className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors line-clamp-2">
              编码的设计哲学：从传输到安全
            </p>
            <p className="text-xs text-gray-400 mt-1">2026-04-30</p>
          </Link>
        </div>
      </div>

      {/* 站点数据 */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-sm p-5 text-white">
        <h3 className="text-sm font-semibold mb-4">站点数据</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-2xl font-bold">34</p>
            <p className="text-xs text-blue-100">文章</p>
          </div>
          <div>
            <p className="text-2xl font-bold">7</p>
            <p className="text-xs text-blue-100">随笔</p>
          </div>
          <div>
            <p className="text-2xl font-bold">6,545</p>
            <p className="text-xs text-blue-100">访客</p>
          </div>
          <div>
            <p className="text-2xl font-bold">24,141</p>
            <p className="text-xs text-blue-100">浏览</p>
          </div>
        </div>
        <Link
          href="/stats"
          className="inline-flex items-center mt-4 text-xs text-blue-100 hover:text-white transition-colors"
        >
          查看详情
          <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </aside>
  )
}
