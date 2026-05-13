'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

interface Article {
  id: number
  title: string
  content: string
  summary: string | null
  viewCount: number
  likeCount: number
  createdAt: string
  author: {
    nickname: string | null
    avatar: string | null
  }
  category: {
    name: string
    slug: string
  } | null
  tags: Array<{
    tag: {
      id: number
      name: string
      slug: string
    }
  }>
  comments: Array<{
    id: number
    content: string
    nickname: string | null
    createdAt: string
    user: {
      nickname: string | null
      avatar: string | null
    } | null
    replies: Array<{
      id: number
      content: string
      nickname: string | null
      createdAt: string
      user: {
        nickname: string | null
        avatar: string | null
      } | null
    }>
  }>
  prevArticle: {
    id: number
    title: string
  } | null
  nextArticle: {
    id: number
    title: string
  } | null
}

export default function ArticleDetailPage() {
  const params = useParams()
  const articleId = params.id

  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [commentContent, setCommentContent] = useState('')
  const [commentNickname, setCommentNickname] = useState('')
  const [commentEmail, setCommentEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchArticle()
  }, [articleId])

  const fetchArticle = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/articles/${articleId}`)
      const data = await res.json()
      if (data.code === 0) {
        setArticle(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch article:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    if (liked) return
    try {
      const res = await fetch('/api/articles/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId: Number(articleId) }),
      })
      const data = await res.json()
      if (data.code === 0) {
        setLiked(true)
        if (article) {
          setArticle({ ...article, likeCount: article.likeCount + 1 })
        }
      }
    } catch (error) {
      console.error('Failed to like:', error)
    }
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentContent.trim()) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: commentContent,
          articleId: Number(articleId),
          nickname: commentNickname || '匿名用户',
          email: commentEmail,
        }),
      })
      const data = await res.json()
      if (data.code === 0) {
        setCommentContent('')
        alert('评论已提交，等待审核')
      }
    } catch (error) {
      console.error('Failed to submit comment:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">文章不存在</h1>
        <Link href="/blog" className="text-blue-600 hover:underline">
          返回博客列表
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Article Header */}
      <article className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span>{formatDate(article.createdAt)}</span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {article.viewCount} 阅读
            </span>
            <button
              onClick={handleLike}
              className={`flex items-center ${liked ? 'text-red-500' : 'hover:text-red-500'} transition-colors`}
            >
              <svg className="w-4 h-4 mr-1" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {article.likeCount} 点赞
            </button>
            {article.category && (
              <Link
                href={`/blog?category=${article.category.slug}`}
                className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs"
              >
                {article.category.name}
              </Link>
            )}
          </div>
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {article.tags.map(({ tag }) => (
                <Link
                  key={tag.id}
                  href={`/blog?tag=${tag.slug}`}
                  className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs hover:bg-gray-200 transition-colors"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          )}
        </header>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </div>

        {/* Navigation */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between">
          {article.prevArticle ? (
            <Link
              href={`/blog/${article.prevArticle.id}`}
              className="text-blue-600 hover:underline"
            >
              ← {article.prevArticle.title}
            </Link>
          ) : (
            <div></div>
          )}
          {article.nextArticle ? (
            <Link
              href={`/blog/${article.nextArticle.id}`}
              className="text-blue-600 hover:underline"
            >
              {article.nextArticle.title} →
            </Link>
          ) : (
            <div></div>
          )}
        </div>
      </article>

      {/* Comments Section */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          评论 ({article.comments.length})
        </h2>

        {/* Comment Form */}
        <form onSubmit={handleComment} className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={commentNickname}
              onChange={(e) => setCommentNickname(e.target.value)}
              placeholder="昵称（可选）"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              value={commentEmail}
              onChange={(e) => setCommentEmail(e.target.value)}
              placeholder="邮箱（可选）"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="写下你的评论..."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {submitting ? '提交中...' : '发表评论'}
          </button>
        </form>

        {/* Comment List */}
        <div className="space-y-6">
          {article.comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-0">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                  {(comment.user?.nickname || comment.nickname || '匿名')[0]}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {comment.user?.nickname || comment.nickname || '匿名用户'}
                  </p>
                  <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
                </div>
              </div>
              <p className="text-gray-700 ml-11">{comment.content}</p>

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-11 mt-4 space-y-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                          {(reply.user?.nickname || reply.nickname || '匿名')[0]}
                        </div>
                        <div className="ml-2">
                          <p className="text-sm font-medium text-gray-900">
                            {reply.user?.nickname || reply.nickname || '匿名用户'}
                          </p>
                          <p className="text-xs text-gray-500">{formatDate(reply.createdAt)}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 ml-8">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
