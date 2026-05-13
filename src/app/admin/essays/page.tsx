'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminEssaysPage() {
  const router = useRouter()
  const [essays, setEssays] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    title: '',
    content: '',
    summary: '',
  })

  useEffect(() => {
    fetchEssays()
  }, [])

  const fetchEssays = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/articles?type=essay&pageSize=100')
      const data = await res.json()
      if (data.code === 0) setEssays(data.data.items)
    } catch (error) {
      console.error('Failed to fetch essays:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.content) {
      alert('标题和内容不能为空')
      return
    }

    setSaving(true)
    try {
      const url = editingId ? `/api/articles/${editingId}` : '/api/articles'
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          type: 'essay',
        }),
      })
      const data = await res.json()
      if (data.code === 0) {
        setShowForm(false)
        setEditingId(null)
        setForm({ title: '', content: '', summary: '' })
        fetchEssays()
        alert(editingId ? '更新成功' : '添加成功')
      }
    } catch (error) {
      console.error('Failed to save essay:', error)
      alert('保存失败')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (essay: { id: number; title: string; content: string; summary: string | null }) => {
    setForm({
      title: essay.title,
      content: essay.content,
      summary: essay.summary || '',
    })
    setEditingId(essay.id)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这篇随笔吗？')) return
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.code === 0) {
        fetchEssays()
        alert('删除成功')
      }
    } catch (error) {
      console.error('Failed to delete essay:', error)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN')
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">随笔管理</h1>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingId(null)
            setForm({ title: '', content: '', summary: '' })
          }}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + 写随笔
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-4">{editingId ? '编辑随笔' : '写随笔'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">标题 *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入随笔标题"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">摘要</label>
                <input
                  type="text"
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="简短描述（可选）"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">内容 * （支持Markdown）</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  rows={15}
                  placeholder="# 随笔标题

在这里写下你的想法...

支持Markdown格式：
- **加粗**
- *斜体*
- ![图片](/uploads/xxx.jpg)"
                  required
                />
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingId(null)
                  }}
                  className="px-6 py-2 border rounded-lg hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? '保存中...' : (editingId ? '保存修改' : '发布随笔')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Essay List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">加载中...</div>
        ) : essays.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="mb-4">还没有随笔</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              写第一篇随笔
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {essays.map((essay: { id: number; title: string; summary: string | null; viewCount: number; likeCount: number; createdAt: string }) => (
              <div key={essay.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{essay.title}</h3>
                    {essay.summary && (
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{essay.summary}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{formatDate(essay.createdAt)}</span>
                      <span>{essay.viewCount} 阅读</span>
                      <span>{essay.likeCount} 点赞</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(essay)}
                      className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(essay.id)}
                      className="px-4 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
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
