'use client'

import { useState, useEffect, useRef } from 'react'

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

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [type, setType] = useState('photo')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const thumbInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'photo',
    url: '',
    thumbnail: '',
    artist: '',
    duration: '',
  })

  useEffect(() => {
    fetchItems()
  }, [type])

  const fetchItems = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/gallery?type=${type}`)
      const data = await res.json()
      if (data.code === 0) setItems(data.data)
    } catch (error) {
      console.error('Failed to fetch gallery items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (file: File, field: 'url' | 'thumbnail') => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.code === 0) {
        setForm(prev => ({ ...prev, [field]: data.data.url }))
        alert('上传成功')
      } else {
        alert(data.message || '上传失败')
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('上传失败')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.url) {
      alert('标题和图片不能为空')
      return
    }

    try {
      const url = editingId ? `/api/gallery/${editingId}` : '/api/gallery'
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.code === 0) {
        setShowForm(false)
        setEditingId(null)
        setForm({ title: '', description: '', type: 'photo', url: '', thumbnail: '', artist: '', duration: '' })
        fetchItems()
      }
    } catch (error) {
      console.error('Failed to save gallery item:', error)
    }
  }

  const handleEdit = (item: GalleryItem) => {
    setForm({
      title: item.title,
      description: item.description || '',
      type: item.type,
      url: item.url,
      thumbnail: item.thumbnail || '',
      artist: item.artist || '',
      duration: item.duration || '',
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除吗？')) return

    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.code === 0) fetchItems()
    } catch (error) {
      console.error('Failed to delete gallery item:', error)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">画廊管理</h1>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingId(null)
            setForm({ title: '', description: '', type, url: '', thumbnail: '', artist: '', duration: '' })
          }}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + 添加内容
        </button>
      </div>

      {/* Type Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setType('photo')}
            className={`px-4 py-2 rounded-lg text-sm ${type === 'photo' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            影像
          </button>
          <button
            onClick={() => setType('music')}
            className={`px-4 py-2 rounded-lg text-sm ${type === 'music' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            音乐
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-4">{editingId ? '编辑' : '添加'}内容</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">标题 *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              {/* Main Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">图片/文件 *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.url}
                    onChange={(e) => setForm({ ...form, url: e.target.value })}
                    className="flex-1 px-4 py-2 border rounded-lg"
                    placeholder="URL 或 上传文件"
                    required
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*,audio/*,video/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleUpload(file, 'url')
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {uploading ? '上传中...' : '上传文件'}
                  </button>
                </div>
                {form.url && (
                  <div className="mt-2">
                    <img src={form.url} alt="预览" className="h-32 object-contain rounded border" />
                  </div>
                )}
              </div>

              {/* Thumbnail Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">缩略图</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.thumbnail}
                    onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                    className="flex-1 px-4 py-2 border rounded-lg"
                    placeholder="缩略图URL"
                  />
                  <input
                    type="file"
                    ref={thumbInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleUpload(file, 'thumbnail')
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => thumbInputRef.current?.click()}
                    disabled={uploading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {uploading ? '上传中...' : '上传'}
                  </button>
                </div>
                {form.thumbnail && (
                  <div className="mt-2">
                    <img src={form.thumbnail} alt="缩略图预览" className="h-24 object-contain rounded border" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={3}
                />
              </div>
              {type === 'music' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">艺术家</label>
                    <input
                      type="text"
                      value={form.artist}
                      onChange={(e) => setForm({ ...form, artist: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">时长</label>
                    <input
                      type="text"
                      value={form.duration}
                      onChange={(e) => setForm({ ...form, duration: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="3:45"
                    />
                  </div>
                </>
              )}
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingId(null)
                  }}
                  className="px-4 py-2 border rounded-lg"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingId ? '保存' : '添加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gallery List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">加载中...</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-gray-500">暂无内容</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {items.map((item) => (
              <div key={item.id} className="border rounded-lg overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  {item.thumbnail ? (
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                  ) : item.url ? (
                    <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-4xl">{item.title[0]}</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  {item.artist && <p className="text-sm text-gray-600">{item.artist}</p>}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded"
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
