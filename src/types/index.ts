// 文章类型
export interface Article {
  id: number
  title: string
  content: string
  summary: string | null
  coverImage: string | null
  type: 'blog' | 'essay'
  status: string
  viewCount: number
  likeCount: number
  isTop: boolean
  isFeatured: boolean
  authorId: number
  categoryId: number | null
  createdAt: Date
  updatedAt: Date
  author?: User
  category?: Category | null
  tags?: ArticleTag[]
  comments?: Comment[]
  _count?: {
    comments: number
  }
}

// 用户类型
export interface User {
  id: number
  username: string
  email: string | null
  nickname: string | null
  avatar: string | null
  role: string
}

// 分类类型
export interface Category {
  id: number
  name: string
  slug: string
  icon: string | null
  sort: number
  _count?: {
    articles: number
  }
}

// 标签类型
export interface Tag {
  id: number
  name: string
  slug: string
  _count?: {
    articles: number
  }
}

// 文章标签关联
export interface ArticleTag {
  articleId: number
  tagId: number
  tag: Tag
}

// 评论类型
export interface Comment {
  id: number
  content: string
  nickname: string | null
  email: string | null
  website: string | null
  status: string
  parentId: number | null
  articleId: number | null
  userId: number | null
  createdAt: Date
  user?: User | null
  replies?: Comment[]
}

// 留言类型
export interface Message {
  id: number
  content: string
  nickname: string
  email: string | null
  website: string | null
  device: string | null
  location: string | null
  status: string
  parentId: number | null
  userId: number | null
  createdAt: Date
  user?: User | null
  replies?: Message[]
}

// 友链类型
export interface FriendLink {
  id: number
  name: string
  url: string
  avatar: string | null
  description: string | null
  email: string | null
  status: string
  sort: number
}

// 画廊类型
export interface Gallery {
  id: number
  title: string
  description: string | null
  type: 'photo' | 'music'
  url: string
  thumbnail: string | null
  artist: string | null
  duration: string | null
  sortOrder: number
}

// 站点统计类型
export interface SiteStats {
  id: number
  date: Date
  visitorCount: number
  pageViewCount: number
}

// API响应类型
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

// 分页响应类型
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
