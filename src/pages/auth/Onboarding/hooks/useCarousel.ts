import { useRef, useState, useCallback } from 'react'

interface CarouselItem {
  id: string
  name?: string
}

interface UseCarouselOptions<T extends CarouselItem> {
  items: T[]
  initialId?: string
  onSelect?: (id: string) => void
}

interface UseCarouselReturn<T extends CarouselItem> {
  currentIndex: number
  slideDirection: 'left' | 'right' | null
  isAnimating: boolean
  goToIndex: (index: number) => void
  getVisibleItems: () => Array<T & { position: 'left' | 'center' | 'right' }>
  handlers: {
    onTouchStart: (e: React.TouchEvent) => void
    onTouchMove: (e: React.TouchEvent) => void
    onTouchEnd: () => void
    onMouseDown: (e: React.MouseEvent) => void
    onMouseMove: (e: React.MouseEvent) => void
    onMouseUp: () => void
    onMouseLeave: () => void
  }
}

const SWIPE_THRESHOLD = 50
const ANIMATION_DURATION = 300

export function useCarousel<T extends CarouselItem>({
  items,
  initialId,
  onSelect,
}: UseCarouselOptions<T>): UseCarouselReturn<T> {
  const initialIndex = initialId ? items.findIndex(item => item.id === initialId) : 0
  const [currentIndex, setCurrentIndex] = useState(initialIndex >= 0 ? initialIndex : 0)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const isDragging = useRef(false)

  const goToIndex = useCallback((index: number) => {
    if (isAnimating) return

    const total = items.length
    let newIndex = index
    let direction: 'left' | 'right' = 'right'

    if (index < 0) {
      newIndex = total - 1
      direction = 'left'
    } else if (index >= total) {
      newIndex = 0
      direction = 'right'
    } else if (index < currentIndex) {
      direction = 'left'
    } else {
      direction = 'right'
    }

    setSlideDirection(direction)
    setIsAnimating(true)

    setTimeout(() => {
      setCurrentIndex(newIndex)
      onSelect?.(items[newIndex].id)
      setIsAnimating(false)
      setSlideDirection(null)
    }, ANIMATION_DURATION)
  }, [items, onSelect, isAnimating, currentIndex])

  const handleSwipeEnd = useCallback(() => {
    const diff = touchStartX.current - touchEndX.current

    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      if (diff > 0) {
        goToIndex(currentIndex + 1)
      } else {
        goToIndex(currentIndex - 1)
      }
    }
  }, [currentIndex, goToIndex])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    isDragging.current = true
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return
    touchEndX.current = e.touches[0].clientX
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (!isDragging.current) return
    isDragging.current = false
    handleSwipeEnd()
  }, [handleSwipeEnd])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    touchStartX.current = e.clientX
    isDragging.current = true
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return
    touchEndX.current = e.clientX
  }, [])

  const handleMouseUp = useCallback(() => {
    if (!isDragging.current) return
    isDragging.current = false
    handleSwipeEnd()
  }, [handleSwipeEnd])

  const handleMouseLeave = useCallback(() => {
    if (isDragging.current) {
      handleMouseUp()
    }
  }, [handleMouseUp])

  const getVisibleItems = useCallback(() => {
    const total = items.length
    const prevIndex = (currentIndex - 1 + total) % total
    const nextIndex = (currentIndex + 1) % total

    return [
      { ...items[prevIndex], position: 'left' as const },
      { ...items[currentIndex], position: 'center' as const },
      { ...items[nextIndex], position: 'right' as const },
    ]
  }, [items, currentIndex])

  return {
    currentIndex,
    slideDirection,
    isAnimating,
    goToIndex,
    getVisibleItems,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave,
    },
  }
}
