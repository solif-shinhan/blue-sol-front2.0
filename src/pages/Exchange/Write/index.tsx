import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Write.module.css'
import { BoardCategory, CATEGORIES } from '../types'

function WritePage() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState<BoardCategory | null>(null)

  const handleClose = () => {
    navigate('/exchange')
  }

  const handleCategorySelect = (category: BoardCategory) => {
    setSelectedCategory(category)
  }

  const handleNext = () => {
    if (selectedCategory) {
      navigate('/exchange/write/form', { state: { category: selectedCategory } })
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.closeButton} onClick={handleClose}>
          <img src="/x.svg" alt="닫기" className={styles.closeIcon} />
        </button>
        <span className={styles.headerTitle}>글쓰기</span>
        <div className={styles.headerRight} />
      </header>

      <div className={styles.content}>
        <h1 className={styles.title}>카테고리 선택</h1>
        <p className={styles.subtitle}>글을 작성할 게시판을 선택해주세요</p>

        <div className={styles.categoryList}>
          {CATEGORIES.map((category) => (
            <button
              key={category}
              className={`${styles.categoryButton} ${selectedCategory === category ? styles.selected : ''}`}
              onClick={() => handleCategorySelect(category)}
            >
              <span className={styles.categoryText}>{category}</span>
              <div className={styles.checkIcon}>
                <span className={styles.checkMark}>✓</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.footer}>
        <button
          className={styles.nextButton}
          disabled={!selectedCategory}
          onClick={handleNext}
        >
          다음
        </button>
      </div>
    </div>
  )
}

export default WritePage
