'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface GalleryItem {
  id: number
  title: string
  description: string | null
  type: string
  url: string
  thumbnail: string | null
  artist: string | null
  duration: string | null
}

export default function GalleryPage() {
  const [photos, setPhotos] = useState<GalleryItem[]>([])
  const [music, setMusic] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    setLoading(true)
    try {
      const [photoRes, musicRes] = await Promise.all([
        fetch('/api/gallery?type=photo'),
        fetch('/api/gallery?type=music'),
      ])

      const photoData = await photoRes.json()
      const musicData = await musicRes.json()

      if (photoData.code === 0) setPhotos(photoData.data)
      if (musicData.code === 0) setMusic(musicData.data)
    } catch (error) {
      console.error('Failed to fetch gallery:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">影像与音乐</h1>
        <p className="text-xl text-gray-600">画廊 · 光影故事，节奏记忆</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Photo Section */}
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">影像</h2>
                <p className="text-gray-600 mt-1">换个角度看世界</p>
              </div>
              <Link
                href="/gallery/photo"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                进入专区 →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {photos.slice(0, 6).map((photo) => (
                <div
                  key={photo.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
                >
                  <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500">
                    {photo.thumbnail ? (
                      <img
                        src={photo.thumbnail}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : photo.url ? (
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white">
                        <svg className="w-16 h-16 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900">{photo.title}</h3>
                    {photo.description && (
                      <p className="text-sm text-gray-600 mt-1">{photo.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {photos.length > 6 && (
              <p className="text-center text-gray-500 mt-6">
                共 {photos.length} 个内容
              </p>
            )}
          </section>

          {/* Music Section */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">音乐</h2>
                <p className="text-gray-600 mt-1">鼓时鼓刻</p>
              </div>
              <Link
                href="/gallery/music"
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                进入专区 →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {music.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
                      {item.artist && (
                        <p className="text-sm text-gray-600">{item.artist}</p>
                      )}
                      {item.duration && (
                        <p className="text-xs text-gray-400">{item.duration}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {music.length > 6 && (
              <p className="text-center text-gray-500 mt-6">
                共 {music.length} 个内容
              </p>
            )}
          </section>
        </>
      )}
    </div>
  )
}
