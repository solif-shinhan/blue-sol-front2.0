import { useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from './WriteForm.module.css'
import { BoardCategory } from '../../types'
import backArrowIcon from '@/assets/images/Glyph_ undefined.svg'
import { createPost, CATEGORY_MAP } from '@/services'

const MAX_TITLE_LENGTH = 50
const MAX_CONTENT_LENGTH = 2000
const MAX_IMAGES = 5

function WriteFormPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const category = location.state?.category as BoardCategory | undefined
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [images, setImages] = useState<{ file: File; preview: string }[]>([])

  if (!category) {
    navigate('/exchange/write')
    return null
  }

  const handleBack = () => {
    navigate('/exchange/write')
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.length <= MAX_TITLE_LENGTH) {
      setTitle(value)
    }
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (value.length <= MAX_CONTENT_LENGTH) {
      setContent(value)
    }
  }

  const handleImageClick = () => {
    if (images.length < MAX_IMAGES) {
      fileInputRef.current?.click()
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const remainingSlots = MAX_IMAGES - images.length
    const filesToAdd = Array.from(files).slice(0, remainingSlots)

    const newImages = filesToAdd.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))

    setImages((prev) => [...prev, ...newImages])
    e.target.value = ''
  }

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev]
      URL.revokeObjectURL(newImages[index].preview)
      newImages.splice(index, 1)
      return newImages
    })
  }

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleComplete = async () => {
    if (!title.trim() || !content.trim() || !category || isSubmitting) return

    setIsSubmitting(true)
    try {
      const apiCategory = CATEGORY_MAP[category] || 'ETC'
      const response = await createPost({
        boardId: 1, // 기본 게시판 ID
        title: title.trim(),
        content: content.trim(),
        category: apiCategory,
      })

      if (response.success) {
        alert('게시글이 등록되었습니다.')
        navigate('/exchange/board', { state: { category } })
      }
    } catch (err) {
      console.error('게시글 등록 실패:', err)
      alert('게시글 등록에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = title.trim().length > 0 && content.trim().length > 0 && !isSubmitting

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <img src={backArrowIcon} alt="뒤로가기" className={styles.backIcon} />
        </button>
        <span className={styles.headerTitle}>글쓰기</span>
        <button
          className={styles.completeButton}
          disabled={!isFormValid}
          onClick={handleComplete}
        >
          {isSubmitting ? '등록 중...' : '완료'}
        </button>
      </header>

      <div className={styles.content}>
        <div className={styles.categoryBadge}>
          <span className={styles.categoryText}>{category}</span>
        </div>

        <div className={styles.formSection}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>제목</label>
            <input
              type="text"
              className={styles.titleInput}
              placeholder="제목을 입력해주세요"
              value={title}
              onChange={handleTitleChange}
            />
            <span className={styles.charCount}>
              {title.length}/{MAX_TITLE_LENGTH}
            </span>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>내용</label>
            <textarea
              className={styles.contentTextarea}
              placeholder="내용을 입력해주세요"
              value={content}
              onChange={handleContentChange}
            />
            <span className={styles.charCount}>
              {content.length}/{MAX_CONTENT_LENGTH}
            </span>
          </div>
        </div>

        <div className={styles.imageSection}>
          <div className={styles.imageSectionHeader}>
            <span className={styles.imageSectionTitle}>이미지 첨부</span>
            <span className={styles.imageCount}>
              {images.length}/{MAX_IMAGES}
            </span>
          </div>

          <div className={styles.imageGrid}>
            {images.map((img, index) => (
              <div key={index} className={styles.imagePreview}>
                <img src={img.preview} alt="" className={styles.previewImage} />
                <button
                  className={styles.removeImageButton}
                  onClick={() => handleRemoveImage(index)}
                >
                  <img
                    src="/dismisscircle.svg"
                    alt="삭제"
                    className={styles.removeIcon}
                  />
                </button>
              </div>
            ))}
            {images.length < MAX_IMAGES && (
              <button className={styles.addImageButton} onClick={handleImageClick}>
                <span className={styles.addImageIcon}>+</span>
                <span className={styles.addImageText}>사진 추가</span>
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className={styles.hiddenInput}
            onChange={handleImageChange}
          />
        </div>
      </div>
    </div>
  )
}

export default WriteFormPage
