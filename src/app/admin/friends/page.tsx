'use client'

import { useState, useEffect } from 'react'

interface FriendLink {
  id: number
  name: string
  url: string
  avatar: string | null
  description: string | null
  email: string | null
  status: string
  sort: number
}

export default function AdminFriendsPage() {
  const [friends, setFriends] = useState<FriendLink[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const [form, setForm] = useState({
    name: '',
    url: '',
    avatar: '',
    description: '',
    email: '',
    sort: 0,
  })

  useEffect(() => {
    fetchFriends()
  }, [])

  const fetchFriends = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/friends?status=all')
      const data = await res.json()
      if (data.code === 0) setFriends(data.data)
    } catch (error) {
      console.error('Failed to fetch friends:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.url) {
      alert('名称和URL不能为空')
      return
    }

    try {
      const url = editingId ? `/api/friends/${editingId}` : '/api/friends'
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, status: 'approved' }),
      })
      const data = await res.json()
      if (data.code === 0) {
        setShowForm(false)
        setEditingId(null)
        setForm({ name: '', url: '', avatar: '', description: '', email: '', sort: 0 })
        fetchFriends()
      }
    } catch (error) {
      console.error('Failed to save friend:', error)
    }
  }

  const handleEdit = (friend: FriendLink) => {
    setForm({
      name: friend.name,
      url: friend.url,
      avatar: friend.avatar || '',
      description: friend.description || '',
      email: friend.email || '',
      sort: friend.sort,
    })
    setEditingId(friend.id)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除吗？')) return
    try {
      const res = await fetch(`/api/friends/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.code === 0) fetchFriends()
    } catch (error) {
      console.error('Failed to delete friend:', error)
    }
  }

  const handleApprove = async (id: number) => {
    try {
      const res = await fetch(`/api/friends/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      })
      const data = await res.json()
      if (data.code === 0) fetchFriends()
    } catch (error) {
      console.error('Failed to approve friend:', error)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">友链管理</h1>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingId(null)
            setForm({ name: '', url: '', avatar: '', description: '', email: '', sort: 0 })
          }}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + 添加友链
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <h2 className="text-xl font-bold mb-4">{editingId ? '编辑' : '添加'}友链</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">网站名称 *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">网站URL *</label>
                <input
                  type="url"
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">头像URL</label>
                <input
                  type="text"
                  value={form.avatar}
                  onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">简介</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
                <input
                  type="number"
                  value={form.sort}
                  onChange={(e) => setForm({ ...form, sort: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg">
                  取消
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  {editingId ? '保存' : '添加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Friend List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">加载中...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">名称</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">排序</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {friends.map((friend) => (
                <tr key={friend.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{friend.name}</td>
                  <td className="px-6 py-4 text-sm text-blue-600 truncate max-w-xs">{friend.url}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      friend.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {friend.status === 'approved' ? '已通过' : '待审核'}
                    </span>
                  </td>
                  <td className="px-6 py-4">{friend.sort}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {friend.status === 'pending' && (
                        <button
                          onClick={() => handleApprove(friend.id)}
                          className="px-3 py-1 text-sm bg-green-50 text-green-600 rounded"
                        >
                          通过
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(friend)}
                        className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => handleDelete(friend.id)}
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
