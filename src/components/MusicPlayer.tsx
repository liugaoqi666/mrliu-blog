'use client'

import { useState, useEffect, useRef } from 'react'

interface Song {
  id: number
  title: string
  artist: string
  url: string
}

export default function MusicPlayer() {
  const [songs, setSongs] = useState<Song[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    fetchSongs()
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {})
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, currentIndex])

  const fetchSongs = async () => {
    try {
      const res = await fetch('/api/gallery?type=music')
      const data = await res.json()
      if (data.code === 0 && data.data.length > 0) {
        setSongs(data.data.map((item: { id: number; title: string; artist: string | null; url: string }) => ({
          id: item.id,
          title: item.title,
          artist: item.artist || '未知艺术家',
          url: item.url,
        })))
      }
    } catch (error) {
      console.error('Failed to fetch songs:', error)
    }
  }

  const togglePlay = () => {
    if (songs.length === 0) return
    setIsPlaying(!isPlaying)
  }

  const prevSong = () => {
    if (songs.length === 0) return
    setCurrentIndex((prev) => (prev === 0 ? songs.length - 1 : prev - 1))
    setIsPlaying(true)
  }

  const nextSong = () => {
    if (songs.length === 0) return
    setCurrentIndex((prev) => (prev === songs.length - 1 ? 0 : prev + 1))
    setIsPlaying(true)
  }

  const handleEnded = () => {
    nextSong()
  }

  if (songs.length === 0) return null

  const currentSong = songs[currentIndex]

  return (
    <>
      <audio
        ref={audioRef}
        src={currentSong.url}
        onEnded={handleEnded}
      />
      
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          aria-label="音乐播放器"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute top-12 right-0 bg-white rounded-xl shadow-xl border border-gray-100 p-4 w-72 animate-fade-in">
            <div className="text-center mb-3">
              <p className="font-semibold text-gray-900 truncate">{currentSong.title}</p>
              <p className="text-sm text-gray-500 truncate">{currentSong.artist}</p>
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={prevSong}
                className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                aria-label="上一首"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={togglePlay}
                className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white hover:from-purple-600 hover:to-pink-600 transition-all"
                aria-label={isPlaying ? '暂停' : '播放'}
              >
                {isPlaying ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
              
              <button
                onClick={nextSong}
                className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                aria-label="下一首"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="mt-3 text-center text-xs text-gray-400">
              {currentIndex + 1} / {songs.length}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
