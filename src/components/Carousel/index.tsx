import { useRef, useState, useCallback, useEffect } from 'react'
import styles from './Carousel.module.css'

interface CarouselProps<T> {
  /** 아이템 배열 */
  items: T[]
  /** 아이템 렌더링 함수 */
  renderItem: (item: T, isCenter: boolean) => React.ReactNode
  /** 아이템 key 추출 함수 */
  keyExtractor: (item: T) => string
  /** 현재 선택된 인덱스 (외부 제어) */
  selectedIndex?: number
  /** 인덱스 변경 시 콜백 */
  onIndexChange?: (index: number) => void
  /** 루프 활성화 */
  loop?: boolean
  /** 스와이프 감도 (기본 50px) */
  swipeThreshold?: number
  /** 하단 점 표시 여부 */
  showDots?: boolean
  /** 추가 클래스명 */
  className?: string
  /** 아이템 컨테이너 클래스명 */
  itemClassName?: string
}

export function Carousel<T>({
  items,
  renderItem,
  keyExtractor,
  selectedIndex: controlledIndex,
  onIndexChange,
  loop = true,
  swipeThreshold = 50,
  showDots = true,
  className = '',
  itemClassName = '',
}: CarouselProps<T>) {
  const [internalIndex, setInternalIndex] = useState(0)
  const currentIndex = controlledIndex ?? internalIndex

  // Touch/Mouse handling refs
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const isDragging = useRef(false)

  const goToIndex = useCallback((index: number) => {
    let newIndex = index
    const total = items.length

    if (loop) {
      if (index < 0) {
        newIndex = total - 1
      } else if (index >= total) {
        newIndex = 0
      }
    } else {
      newIndex = Math.max(0, Math.min(index, total - 1))
    }

    if (controlledIndex === undefined) {
      setInternalIndex(newIndex)
    }
    onIndexChange?.(newIndex)
  }, [items.length, loop, controlledIndex, onIndexChange])

  // Sync internal state with controlled index
  useEffect(() => {
    if (controlledIndex !== undefined) {
      setInternalIndex(controlledIndex)
    }
  }, [controlledIndex])

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    isDragging.current = true
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!isDragging.current) return
    isDragging.current = false

    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        goToIndex(currentIndex + 1)
      } else {
        goToIndex(currentIndex - 1)
      }
    }
  }

  // Mouse handlers (for desktop)
  const handleMouseDown = (e: React.MouseEvent) => {
    touchStartX.current = e.clientX
    isDragging.current = true
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return
    touchEndX.current = e.clientX
  }

  const handleMouseUp = () => {
    if (!isDragging.current) return
    isDragging.current = false

    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        goToIndex(currentIndex + 1)
      } else {
        goToIndex(currentIndex - 1)
      }
    }
  }

  const handleMouseLeave = () => {
    if (isDragging.current) {
      handleMouseUp()
    }
  }

  // Get visible items (prev, current, next)
  const getVisibleItems = () => {
    const total = items.length
    if (total === 0) return []

    const prevIndex = (currentIndex - 1 + total) % total
    const nextIndex = (currentIndex + 1) % total

    return [
      { item: items[prevIndex], position: 'left' as const, index: prevIndex },
      { item: items[currentIndex], position: 'center' as const, index: currentIndex },
      { item: items[nextIndex], position: 'right' as const, index: nextIndex },
    ]
  }

  const visibleItems = getVisibleItems()

  return (
    <div className={`${styles.carousel} ${className}`}>
      <div
        className={styles.track}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {visibleItems.map(({ item, position }) => (
          <div
            key={`${keyExtractor(item)}-${position}`}
            className={`${styles.item} ${styles[position]} ${itemClassName}`}
            onClick={() => {
              if (position === 'left') {
                goToIndex(currentIndex - 1)
              } else if (position === 'right') {
                goToIndex(currentIndex + 1)
              }
            }}
          >
            {renderItem(item, position === 'center')}
          </div>
        ))}
      </div>

      {showDots && (
        <div className={styles.dots}>
          {items.map((item, index) => (
            <button
              key={keyExtractor(item)}
              className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
              onClick={() => goToIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Carousel
