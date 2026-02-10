import { useState, useCallback, useEffect } from 'react'
import { getMyCouncil } from '@/services'

const COUNCIL_STATUS_KEY = 'hasCouncil'

export const useCouncilStatus = () => {
  const [hasCouncil, setHasCouncilState] = useState(() => {
    return localStorage.getItem(COUNCIL_STATUS_KEY) === 'true'
  })

  const setHasCouncil = useCallback((value: boolean) => {
    localStorage.setItem(COUNCIL_STATUS_KEY, String(value))
    setHasCouncilState(value)
  }, [])

  useEffect(() => {
    const checkCouncilStatus = async () => {
      try {
        const res = await getMyCouncil()
        const hasIt = res.success && !!res.data?.councilId
        setHasCouncil(hasIt)
      } catch {
        // API 실패 시 localStorage 값 유지
      }
    }
    checkCouncilStatus()
  }, [])

  return { hasCouncil, setHasCouncil }
}
