'use client'

import { useState, useEffect } from 'react'

interface Comment {
  id: number
  content: string
  nickname: string | null
  email: string | null
  status: string
  createdAt: string
  article: {
    id: number
    title: string
  } | null
  replies: Comment[]
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [replyTo, setReplyTo] = useState<number | null>(null)
  const [replyContent, setReplyContent] = useState('')

  useEffect(() => {
    fetchComments()
  }, [])

  const fetchComments = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/comments?status=all&pageSize=100')
      const data = await res.json()
      if (data.code === 0) setComments(data.data.items)
    } catch (error) {
      console.error('Failed to fetch comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: number) => {
    try {
      const res = await fetch(`/api/comments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      })
      const data = await res.json()
      if (data.code === 0) fetchComments()
    } catch (error) {
      console.error('Failed to approve comment:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这条评论吗？')) return
    try {
      const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.code === 0) fetchComments()
    } catch (error) {
      console.error('Failed to delete comment:', error)
    }
  }

  const handleReply = async (parentId: number) => {
    if (!replyContent.trim()) return
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: replyContent,
          nickname: 'Mr.Liu',
          parentId,
          status: 'approved',
        }),
      })
      const data = await res.json()
      if (data.code === 0) {
        setReplyTo(null)
        setReplyContent('')
        fetchComments()
      }
    } catch (error) {
      console.error('Failed to reply:', error)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('zh-CN')
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">评论管理</h1>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">加载中...</div>
        ) : comments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">暂无评论</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {comments.map((comment) => (
              <div key={comment.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-gray-900">{comment.nickname || '匿名用户'}</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        comment.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        {comment.status === 'approved' ? '已通过' : '待审核'}
                      </span>
                      {comment.article && (
                        <span className="text-xs text-gray-500">
                          评论了：{comment.article.title}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 mb-2">{comment.content}</p>
                    <p className="text-xs text-gray-400">{formatDate(comment.createdAt)}</p>

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-4 ml-6 space-y-3">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm text-gray-900">{reply.nickname}</span>
                              <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-600 rounded">博主</span>
                            </div>
                            <p className="text-sm text-gray-700">{reply.content}</p>
                            <p className="text-xs text-gray-400 mt-1">{formatDate(reply.createdAt)}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Form */}
                    {replyTo === comment.id && (
                      <div className="mt-4 ml-6">
                        <textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg text-sm"
                          rows={3}
                          placeholder="输入回复内容..."
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleReply(comment.id)}
                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                          >
                            发送回复
                          </button>
                          <button
                            onClick={() => { setReplyTo(null); setReplyContent('') }}
                            className="px-4 py-2 border text-sm rounded-lg hover:bg-gray-50"
                          >
                            取消
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    {comment.status === 'pending' && (
                      <button
                        onClick={() => handleApprove(comment.id)}
                        className="px-3 py-1 text-sm bg-green-50 text-green-600 rounded hover:bg-green-100"
                      >
                        通过
                      </button>
                    )}
                    <button
                      onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                      className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                    >
                      回复
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
