import { useRef } from 'react'
import styles from './ImageUploadSection.module.css'
import addImageIcon from '@/assets/images/writing/2d6dd2ec71c992edc2f26de66f36996d63d584d6.svg'
import { uploadFile, type FileFolder } from '@/services/fileService'

export interface ImageItem {
  id: string
  url: string
  fileId?: number
}

interface Props {
  images: ImageItem[]
  setImages: React.Dispatch<React.SetStateAction<ImageItem[]>>
  uploadCategory: FileFolder
  className?: string
}

export function ImageUploadSection({ images, setImages, uploadCategory, className }: Props) {
  const imageInputRef = useRef<HTMLInputElement>(null)

  const handleAddImage = () => {
    if (imageInputRef.current) {
      imageInputRef.current.value = ''
      imageInputRef.current.click()
    }
  }

  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    const localUrl = URL.createObjectURL(file)
    const tempId = Date.now().toString()
    setImages((prev) => [...prev, { id: tempId, url: localUrl }])

    uploadFile(file, uploadCategory)
      .then((uploaded) => {
        setImages((prev) =>
          prev.map((img) =>
            img.id === tempId
              ? { ...img, url: uploaded.url, fileId: uploaded.fileId }
              : img
          )
        )
      })
      .catch((err) => console.error('이미지 업로드 실패:', err))
  }

  const handleRemoveImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  return (
    <>
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageFileSelect}
        style={{ display: 'none' }}
      />
      <div className={`${styles.imageSection} ${className || ''}`}>
        <button className={styles.addImageButton} onClick={handleAddImage}>
          <img src={addImageIcon} alt="이미지 추가" className={styles.addImageIcon} />
        </button>
        {images.length > 0 && (
          <div className={styles.imageList}>
            {images.map((img) => (
              <div key={img.id} className={styles.imageItem}>
                <img src={img.url} alt="" className={styles.imageThumb} />
                <button
                  className={styles.imageRemoveButton}
                  onClick={() => handleRemoveImage(img.id)}
                >
                  <span className={styles.imageRemoveX}>✕</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
