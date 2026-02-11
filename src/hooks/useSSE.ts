import { useEffect, useRef } from 'react'
import { getNotificationSubscribeUrl } from '@/services/notificationService'

/**
 * SSE(Server-Sent Events)로 실시간 알림을 수신하는 훅.
 * 새 알림이 오면 onNotification 콜백 실행.
 */
export function useSSE(onNotification?: (data: unknown) => void) {
  const esRef = useRef<EventSource | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) return

    const url = getNotificationSubscribeUrl()
    const es = new EventSource(url)
    esRef.current = es

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        onNotification?.(data)
      } catch {
        // 텍스트 메시지 (heartbeat 등) 무시
      }
    }

    es.onerror = () => {
      es.close()
      // 3초 후 재연결
      setTimeout(() => {
        if (esRef.current === es) {
          const newUrl = getNotificationSubscribeUrl()
          const newEs = new EventSource(newUrl)
          newEs.onmessage = es.onmessage
          newEs.onerror = es.onerror
          esRef.current = newEs
        }
      }, 3000)
    }

    return () => {
      es.close()
      esRef.current = null
    }
  }, [])

  return esRef
}
