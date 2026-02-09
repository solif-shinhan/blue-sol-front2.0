import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Write.module.css'
import { BackHeader } from '@components/BackHeader'
import addImageIcon from '@/assets/images/write/2d6dd2ec71c992edc2f26de66f36996d63d584d6.svg'
import { createPost, type PostCategory } from '@/services'
import { uploadFile } from '@/services/fileService'

const WORRY_CATEGORIES = ['학업', '진학', '취업', '기타'] as const
type WorryCategory = (typeof WORRY_CATEGORIES)[number]

const WORRY_CATEGORY_MAP: Record<WorryCategory, PostCategory> = {
  '학업': 'STUDY',
  '진학': 'ADMISSION',
  '취업': 'JOB',
  '기타': 'ETC',
}

interface ImageItem {
  id: string
  preview: string
  fileId?: number
}

function WritePage() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<WorryCategory | null>(null)
  const [images, setImages] = useState<ImageItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
      fileInputRef.current.click()
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    const preview = URL.createObjectURL(file)
    const id = Date.now().toString()
    setImages((prev) => [...prev, { id, preview }])

    uploadFile(file, 'POST')
      .then((uploaded) => {
        setImages((prev) =>
          prev.map((img) =>
            img.id === id ? { ...img, fileId: uploaded.fileId } : img
          )
        )
      })
      .catch((err) => console.error('이미지 업로드 실패:', err))
  }

  const handleRemoveImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id)
      if (target) URL.revokeObjectURL(target.preview)
      return prev.filter((img) => img.id !== id)
    })
  }

  const isFormValid =
    title.trim() !== '' &&
    content.trim() !== '' &&
    selectedCategory !== null

  const handleUpload = async () => {
    if (!isFormValid || isSubmitting || !selectedCategory) return

    setIsSubmitting(true)
    try {
      const apiCategory = WORRY_CATEGORY_MAP[selectedCategory]
      const fileIds = images
        .map((img) => img.fileId)
        .filter((id): id is number => id !== undefined)
      const response = await createPost({
        boardId: 3, // 토닥토닥 고민상담
        postTitle: title.trim(),
        postContent: content.trim(),
        postCategory: apiCategory,
        ...(fileIds.length > 0 && { fileIds }),
      })

      if (response.success) {
        alert('게시글이 등록되었습니다.')
        navigate('/exchange/board')
      }
    } catch (err) {
      console.error('게시글 등록 실패:', err)
      alert('게시글 등록에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.container}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        style={{ display: 'none' }}
      />

      <div className={styles.upperCard}>
        <BackHeader
          title="토닥토닥 고민 털어두기"
          backTo="/exchange"
        />

        <div className={styles.cardContent}>
          <div className={styles.imageSection}>
            <button className={styles.addImageButton} onClick={handleAddImage}>
              <img src={addImageIcon} alt="이미지 추가" className={styles.addImageIcon} />
            </button>
            {images.map((img) => (
              <div key={img.id} className={styles.imageItem}>
                <img src={img.preview} alt="" className={styles.imageThumb} />
                <button
                  className={styles.imageRemoveButton}
                  onClick={() => handleRemoveImage(img.id)}
                >
                  <span className={styles.imageRemoveX}>✕</span>
                </button>
              </div>
            ))}
          </div>

          <div className={styles.titleSection}>
            <p className={styles.sectionLabel}>제목</p>
            <input
              type="text"
              className={styles.titleInput}
              placeholder="제목을 입력해주세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className={styles.lowerSection}>
        <p className={styles.sectionLabel}>고민되는 내용을 작성해주세요</p>

        <div className={styles.categorySection}>
          {WORRY_CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`${styles.categoryTag} ${selectedCategory === cat ? styles.categoryTagActive : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <textarea
          className={styles.contentTextarea}
          placeholder={'자유롭게 내용을 작성해주세요.\n익명이므로 누구의 고민인지 알 수 없어요.'}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className={styles.footer}>
        <button
          className={`${styles.uploadButton} ${isFormValid ? styles.uploadButtonActive : ''}`}
          onClick={handleUpload}
          disabled={isSubmitting}
        >
          {isSubmitting ? '업로드 중...' : '업로드 하기'}
        </button>
      </div>
    </div>
  )
}

export default WritePage
