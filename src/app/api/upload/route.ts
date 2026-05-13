import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ code: 400, message: '没有上传文件' })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const ext = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`
    const path = join(process.cwd(), 'public', 'uploads', fileName)

    await writeFile(path, buffer)

    return NextResponse.json({
      code: 0,
      message: '上传成功',
      data: { url: `/uploads/${fileName}` }
    })
  } catch (error) {
    console.error('上传失败:', error)
    return NextResponse.json({ code: 500, message: '上传失败' })
  }
}
