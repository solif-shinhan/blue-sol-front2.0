import styles from '../styles'
import { CHARACTER_OPTIONS } from '../constants'
import { useCarousel } from '../hooks'

interface CharacterStepProps {
  selectedCharacter: string
  onSelect: (id: string) => void
}

export function CharacterStep({ selectedCharacter, onSelect }: CharacterStepProps) {
  const { currentIndex, slideDirection, isAnimating, goToIndex, getVisibleItems, handlers } = useCarousel({
    items: CHARACTER_OPTIONS,
    initialId: selectedCharacter,
    onSelect,
  })

  const visibleCharacters = getVisibleItems()

  const carouselClasses = [
    styles.characterCarousel,
    isAnimating && slideDirection === 'left' && styles.slideLeft,
    isAnimating && slideDirection === 'right' && styles.slideRight,
  ].filter(Boolean).join(' ')

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h1 className={styles.stepTitle}>
          SOLID에 담길 프로필을
          <br />
          골라보세요
        </h1>
        <p className={styles.stepSubtitle}>원하는 캐릭터를 골라보세요.</p>
      </div>

      <div className={carouselClasses} {...handlers}>
        {visibleCharacters.map((character) => (
          <div
            key={`${character.id}-${character.position}`}
            className={`${styles.characterOption} ${character.position === 'center' ? styles.center : styles.side
              }`}
            onClick={() => {
              if (character.position === 'left') {
                goToIndex(currentIndex - 1)
              } else if (character.position === 'right') {
                goToIndex(currentIndex + 1)
              }
            }}
          >
            <div className={styles.characterPreview} />
          </div>
        ))}
      </div>

      <div className={styles.carouselDots}>
        {CHARACTER_OPTIONS.map((character, index) => (
          <span
            key={character.id}
            className={`${styles.carouselDot} ${index === currentIndex ? styles.active : ''
              }`}
            onClick={() => goToIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}
