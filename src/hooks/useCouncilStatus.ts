import { useState, useCallback } from 'react'

const COUNCIL_STATUS_KEY = 'hasCouncil'

export const useCouncilStatus = () => {
  const [hasCouncil, setHasCouncilState] = useState(() => {
    return localStorage.getItem(COUNCIL_STATUS_KEY) === 'true'
  })

  const setHasCouncil = useCallback((value: boolean) => {
    localStorage.setItem(COUNCIL_STATUS_KEY, String(value))
    setHasCouncilState(value)
  }, [])

  return { hasCouncil, setHasCouncil }
}
