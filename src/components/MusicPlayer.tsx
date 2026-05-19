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
      
      <div style={{ position: 'fixed', top: '80px', right: '20px', zIndex: 9999 }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{ 
            width: '48px', 
            height: '48px', 
            background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            color: 'white'
          }}
          aria-label="音乐播放器"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </button>

        {isOpen && (
          <div style={{ 
            position: 'absolute', 
            top: '60px', 
            right: 0, 
            background: 'white', 
            borderRadius: '12px', 
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
            border: '1px solid #e5e7eb', 
            padding: '16px', 
            width: '288px' 
          }}>
            <div style={{ textAlign: 'center', marginBottom: '12px' }}>
              <p style={{ fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentSong.title}</p>
              <p style={{ fontSize: '14px', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentSong.artist}</p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
              <button
                onClick={prevSong}
                style={{ padding: '8px', color: '#4b5563', background: 'none', border: 'none', cursor: 'pointer' }}
                aria-label="上一首"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={togglePlay}
                style={{ 
                  padding: '12px', 
                  background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', 
                  borderRadius: '50%', 
                  color: 'white', 
                  border: 'none', 
                  cursor: 'pointer' 
                }}
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
                style={{ padding: '8px', color: '#4b5563', background: 'none', border: 'none', cursor: 'pointer' }}
                aria-label="下一首"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '12px', color: '#9ca3af' }}>
              {currentIndex + 1} / {songs.length}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
