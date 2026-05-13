'use client'

import { useState, useEffect } from 'react'

interface Message {
  id: number
  content: string
  nickname: string
  email: string | null
  device: string | null
  location: string | null
  status: string
  createdAt: string
  replies: Message[]
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/messages?status=all&pageSize=100')
      const data = await res.json()
      if (data.code === 0) setMessages(data.data.items)
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: number) => {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      })
      const data = await res.json()
      if (data.code === 0) fetchMessages()
    } catch (error) {
      console.error('Failed to approve message:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这条留言吗？')) return
    try {
      const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.code === 0) fetchMessages()
    } catch (error) {
      console.error('Failed to delete message:', error)
    }
  }

  const handleReply = async (parentId: number, content: string) => {
    if (!content.trim()) return

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          nickname: 'Mr.Liu',
          parentId,
          status: 'approved',
        }),
      })
      const data = await res.json()
      if (data.code === 0) fetchMessages()
    } catch (error) {
      console.error('Failed to reply:', error)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('zh-CN')
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">留言管理</h1>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">加载中...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">昵称</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">内容</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">设备</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {messages.map((msg) => (
                <tr key={msg.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{msg.nickname}</td>
                  <td className="px-6 py-4 max-w-xs truncate">{msg.content}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{msg.device}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      msg.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {msg.status === 'approved' ? '已通过' : '待审核'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDate(msg.createdAt)}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {msg.status === 'pending' && (
                        <button
                          onClick={() => handleApprove(msg.id)}
                          className="px-3 py-1 text-sm bg-green-50 text-green-600 rounded"
                        >
                          通过
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(msg.id)}
                        className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded"
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
