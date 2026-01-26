import styles from '../styles'
import { PATTERN_OPTIONS } from '../constants'
import { useCarousel } from '../hooks'

interface PatternStepProps {
  selectedPattern: string
  onSelect: (id: string) => void
}

export function PatternStep({ selectedPattern, onSelect }: PatternStepProps) {
  const { currentIndex, slideDirection, isAnimating, goToIndex, getVisibleItems, handlers } = useCarousel({
    items: PATTERN_OPTIONS,
    initialId: selectedPattern,
    onSelect,
  })

  const visiblePatterns = getVisibleItems()

  const carouselClasses = [
    styles.patternCarousel,
    isAnimating && slideDirection === 'left' && styles.slideLeft,
    isAnimating && slideDirection === 'right' && styles.slideRight,
  ].filter(Boolean).join(' ')

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h1 className={styles.stepTitle}>이제 SOLID를 꾸며볼까요?</h1>
        <p className={styles.stepSubtitle}>원하는 패턴을 골라주세요</p>
      </div>

      <div className={carouselClasses} {...handlers}>
        {visiblePatterns.map((pattern) => (
          <div
            key={`${pattern.id}-${pattern.position}`}
            className={`${styles.patternCard} ${
              pattern.position === 'center' ? styles.center : styles.side
            }`}
            onClick={() => {
              if (pattern.position === 'left') {
                goToIndex(currentIndex - 1)
              } else if (pattern.position === 'right') {
                goToIndex(currentIndex + 1)
              }
            }}
          >
            <div className={styles.patternPreview} />
          </div>
        ))}
      </div>

      <div className={styles.carouselDots}>
        {PATTERN_OPTIONS.map((pattern, index) => (
          <span
            key={pattern.id}
            className={`${styles.carouselDot} ${
              index === currentIndex ? styles.active : ''
            }`}
            onClick={() => goToIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}
