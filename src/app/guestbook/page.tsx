'use client'

import { useState, useEffect } from 'react'

interface Message {
  id: number
  content: string
  nickname: string
  device: string | null
  location: string | null
  createdAt: string
  user: {
    nickname: string | null
    avatar: string | null
  } | null
  replies: Array<{
    id: number
    content: string
    nickname: string
    device: string | null
    location: string | null
    createdAt: string
  }>
}

export default function GuestbookPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/messages?pageSize=50')
      const data = await res.json()
      if (data.code === 0) {
        setMessages(data.data.items)
        setTotal(data.data.total)
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || !nickname.trim()) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          nickname,
          email,
        }),
      })
      const data = await res.json()
      if (data.code === 0) {
        setContent('')
        alert('留言已提交，等待审核')
        fetchMessages()
      }
    } catch (error) {
      console.error('Failed to submit message:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return '今天'
    if (days === 1) return '昨天'
    if (days < 7) return `${days}天前`
    if (days < 30) return `${Math.floor(days / 7)}周前`
    return date.toLocaleDateString('zh-CN')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">有话想说 · 留言板</h1>
        <p className="text-gray-600">欢迎留下你的足迹，共{total}条留言</p>
      </div>

      {/* Message Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">发表留言</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="昵称 *"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="邮箱（可选）"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="写下你想说的话..."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {submitting ? '提交中...' : '发表留言'}
          </button>
        </form>
      </div>

      {/* Message List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="ml-3">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                  {message.nickname[0]}
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">{message.nickname}</p>
                  <div className="flex items-center text-xs text-gray-500 space-x-2">
                    {message.location && <span>{message.location}</span>}
                    {message.device && <span>{message.device}</span>}
                    <span>{formatDate(message.createdAt)}</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 ml-13">{message.content}</p>

              {/* Replies */}
              {message.replies && message.replies.length > 0 && (
                <div className="mt-4 ml-13 space-y-3">
                  {message.replies.map((reply) => (
                    <div key={reply.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {reply.nickname[0]}
                        </div>
                        <div className="ml-2">
                          <p className="text-sm font-medium text-gray-900">
                            {reply.nickname}
                            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-600 rounded text-xs">
                              博主
                            </span>
                          </p>
                          <div className="flex items-center text-xs text-gray-500 space-x-2">
                            {reply.location && <span>{reply.location}</span>}
                            {reply.device && <span>{reply.device}</span>}
                            <span>{formatDate(reply.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 ml-10">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
