'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function TrackView() {
  const pathname = usePathname()

  useEffect(() => {
    // 记录页面访问
    const trackView = async () => {
      try {
        await fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page: pathname,
            referrer: document.referrer,
          }),
        })
      } catch (error) {
        // 静默失败
      }
    }

    trackView()
  }, [pathname])

  return null
}
