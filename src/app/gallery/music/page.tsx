'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface GalleryItem {
  id: number
  title: string
  description: string | null
  url: string
  artist: string | null
  duration: string | null
}

export default function MusicGalleryPage() {
  const [music, setMusic] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [playing, setPlaying] = useState<number | null>(null)

  useEffect(() => {
    fetchMusic()
  }, [])

  const fetchMusic = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/gallery?type=music')
      const data = await res.json()
      if (data.code === 0) {
        setMusic(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch music:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/gallery" className="text-blue-600 hover:underline text-sm mb-4 inline-block">
          ← 返回画廊
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">音乐专区</h1>
        <p className="text-gray-600 mt-2">鼓时鼓刻 · 共{music.length}首</p>
      </div>

      {/* Music List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 animate-pulse">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                <div className="ml-4 flex-1">
                  <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : music.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-gray-500">暂无音乐内容</p>
        </div>
      ) : (
        <div className="space-y-4">
          {music.map((item, index) => (
            <div
              key={item.id}
              className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow cursor-pointer ${
                playing === item.id ? 'ring-2 ring-purple-500' : ''
              }`}
              onClick={() => setPlaying(playing === item.id ? null : item.id)}
            >
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                  {playing === item.id ? (
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                  ) : (
                    <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </div>
                <div className="ml-4 flex-1 min-w-0">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-3">{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      {item.artist && (
                        <p className="text-sm text-gray-600">{item.artist}</p>
                      )}
                    </div>
                  </div>
                </div>
                {item.duration && (
                  <span className="text-sm text-gray-500">{item.duration}</span>
                )}
              </div>
              {item.description && playing === item.id && (
                <p className="text-sm text-gray-600 mt-3 ml-20">{item.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
