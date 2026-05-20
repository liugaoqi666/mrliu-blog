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
    if (songs.length <= 1) return
    setCurrentIndex((prev) => (prev === 0 ? songs.length - 1 : prev - 1))
    setIsPlaying(true)
  }

  const nextSong = () => {
    if (songs.length <= 1) return
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
        preload="auto"
      />
      
      <div style={{ 
        position: 'fixed', 
        bottom: '100px', 
        right: '20px', 
        zIndex: 9999 
      }}>
        {/* 主按钮 */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{ 
            width: '56px', 
            height: '56px', 
            background: isPlaying 
              ? 'linear-gradient(135deg, #f59e0b, #ef4444)' 
              : 'linear-gradient(135deg, #8b5cf6, #ec4899)',
            borderRadius: '50%',
            border: '3px solid white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
            color: 'white',
            transition: 'all 0.3s ease',
            animation: isPlaying ? 'pulse 2s infinite' : 'none'
          }}
          aria-label="音乐播放器"
        >
          {isPlaying ? (
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
            </svg>
          )}
        </button>

        {/* 播放面板 */}
        {isOpen && (
          <div style={{ 
            position: 'absolute', 
            bottom: '70px', 
            right: 0, 
            background: 'white', 
            borderRadius: '16px', 
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)', 
            border: '1px solid #e5e7eb', 
            padding: '20px', 
            width: '300px',
            animation: 'fadeIn 0.3s ease'
          }}>
            {/* 歌曲信息 */}
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                borderRadius: '50%',
                margin: '0 auto 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: isPlaying ? 'spin 3s linear infinite' : 'none'
              }}>
                <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
                </svg>
              </div>
              <p style={{ fontWeight: 600, color: '#111827', fontSize: '16px', marginBottom: '4px' }}>{currentSong.title}</p>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>{currentSong.artist}</p>
            </div>
            
            {/* 控制按钮 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
              <button
                onClick={prevSong}
                style={{ 
                  padding: '10px', 
                  color: '#6b7280', 
                  background: '#f3f4f6', 
                  border: 'none', 
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                aria-label="上一首"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={togglePlay}
                style={{ 
                  padding: '14px', 
                  background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', 
                  borderRadius: '50%', 
                  color: 'white', 
                  border: 'none', 
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)'
                }}
                aria-label={isPlaying ? '暂停' : '播放'}
              >
                {isPlaying ? (
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
              
              <button
                onClick={nextSong}
                style={{ 
                  padding: '10px', 
                  color: '#6b7280', 
                  background: '#f3f4f6', 
                  border: 'none', 
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                aria-label="下一首"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* 歌曲列表 */}
            <div style={{ marginTop: '16px', borderTop: '1px solid #e5e7eb', paddingTop: '12px' }}>
              <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px' }}>播放列表 ({songs.length}首)</p>
              {songs.map((song, index) => (
                <div 
                  key={song.id}
                  onClick={() => { setCurrentIndex(index); setIsPlaying(true) }}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: currentIndex === index ? '#f3e8ff' : 'transparent',
                    marginBottom: '4px'
                  }}
                >
                  <p style={{ 
                    fontSize: '14px', 
                    color: currentIndex === index ? '#7c3aed' : '#374151',
                    fontWeight: currentIndex === index ? 600 : 400
                  }}>
                    {index + 1}. {song.title}
                  </p>
                  <p style={{ fontSize: '12px', color: '#9ca3af' }}>{song.artist}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}
