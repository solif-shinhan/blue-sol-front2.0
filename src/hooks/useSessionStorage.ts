import { useState, useCallback, useMemo } from 'react'

export function getScopedKey(key: string): string {
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null
  return userId ? `user:${userId}:${key}` : key
}

export function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const scopedKey = useMemo(() => getScopedKey(key), [key])

  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.sessionStorage.getItem(scopedKey)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${scopedKey}":`, error)
      return initialValue
    }
  }, [initialValue, scopedKey])

  const [storedValue, setStoredValue] = useState<T>(readValue)

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const newValue = value instanceof Function ? value(storedValue) : value
        window.sessionStorage.setItem(scopedKey, JSON.stringify(newValue))
        setStoredValue(newValue)
      } catch (error) {
        console.warn(`Error setting sessionStorage key "${scopedKey}":`, error)
      }
    },
    [scopedKey, storedValue]
  )

  const removeValue = useCallback(() => {
    try {
      window.sessionStorage.removeItem(scopedKey)
      setStoredValue(initialValue)
    } catch (error) {
      console.warn(`Error removing sessionStorage key "${scopedKey}":`, error)
    }
  }, [initialValue, scopedKey])

  return [storedValue, setValue, removeValue]
}

export function clearSessionGroup(prefix: string) {
  const scopedPrefix = getScopedKey(prefix)
  const keysToRemove: string[] = []
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i)
    if (key && key.startsWith(scopedPrefix)) {
      keysToRemove.push(key)
    }
  }
  keysToRemove.forEach((key) => sessionStorage.removeItem(key))
}

export default useSessionStorage
