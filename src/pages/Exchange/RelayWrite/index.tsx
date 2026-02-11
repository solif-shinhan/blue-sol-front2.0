import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './RelayWrite.module.css'
import { BackHeader } from '@/components/BackHeader'
import { councilReviewPostApi, councilReviewRelayApi, type CouncilReviewPostDetail, type CouncilReviewRelay } from '@/api/api-3'
import { getProfile, type ProfileData } from '@/services/profileService'
import { userApi } from '@/api/api-2'
import { uploadFile } from '@/services/fileService'
import addImageIcon from '@/assets/images/writing/2d6dd2ec71c992edc2f26de66f36996d63d584d6.svg'

const API_BASE = import.meta.env.VITE_API_URL || ''
const toFullUrl = (path: string | undefined): string | undefined => {
  if (!path) return undefined
  if (path.startsWith('http') || path.startsWith('blob')) return path
  return `${API_BASE}/${path}`
}

interface ImageItem {
  id: string
  url: string
}

function RelayWritePage() {
  const navigate = useNavigate()
  const { reviewId } = useParams<{ reviewId: string }>()

  const [detail, setDetail] = useState<CouncilReviewPostDetail | null>(null)
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [userName, setUserName] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isWriting, setIsWriting] = useState(false)
  const [questionText, setQuestionText] = useState('')
  const [questionId, setQuestionId] = useState<number | null>(null)
  const [relayContent, setRelayContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<ImageItem[]>([])
  const imageInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!reviewId) return
    const loadData = async () => {
      setIsLoading(true)
      try {
        const [detailRes, profileRes, userRes] = await Promise.all([
          councilReviewPostApi.get(Number(reviewId)),
          getProfile().catch(() => null),
          userApi.getMe().catch(() => null),
        ])
        if (detailRes.success && detailRes.data) {
          setDetail(detailRes.data)
          // Initialize images from post's imageUrls
          const postImages = (detailRes.data.imageUrls || []).map((url: string, idx: number) => ({
            id: `post-${idx}`,
            url: toFullUrl(url) || url,
          }))
          setImages(postImages)
        }
        if (profileRes?.success && profileRes.data) {
          setProfile(profileRes.data)
        }
        if (userRes?.success && userRes.data) {
          setUserName(userRes.data.name)
        }
      } catch {
        // ignore
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [reviewId])

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

    uploadFile(file, 'COUNCIL_REVIEW')
      .then((uploaded) => {
        setImages((prev) =>
          prev.map((img) =>
            img.id === tempId ? { ...img, url: uploaded.url } : img
          )
        )
      })
      .catch((err) => console.error('이미지 업로드 실패:', err))
  }

  const handleRemoveImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  const handleAddRelay = async () => {
    if (isWriting) return
    try {
      const res = await councilReviewRelayApi.getRandomQuestion()
      if (res.success && res.data) {
        setQuestionText(res.data.questionText)
        setQuestionId(res.data.questionId)
        setIsWriting(true)
      }
    } catch {
      setQuestionText('가장 즐거웠던 순간은 무엇이었나요?')
      setIsWriting(true)
    }
  }

  const handleRefreshQuestion = async () => {
    try {
      const excludeIds = questionId ? [questionId] : undefined
      const res = await councilReviewRelayApi.getRandomQuestion(excludeIds)
      if (res.success && res.data) {
        setQuestionText(res.data.questionText)
        setQuestionId(res.data.questionId)
      }
    } catch {
      // keep current question
    }
  }

  const handleUpload = async () => {
    if (!detail || !questionId || !relayContent.trim() || isSubmitting) return
    setIsSubmitting(true)
    try {
      const res = await councilReviewRelayApi.create(detail.councilReviewPostId, {
        questionId,
        relayContent: relayContent.trim(),
      })
      if (res.success) {
        navigate(`/exchange/council/review/${reviewId}`, { replace: true })
      }
    } catch (err) {
      console.error('릴레이 업로드 실패:', err)
      alert('업로드에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const postTitle = detail?.postTitle || ''
  const councilName = detail?.councilName || ''
  const relays = detail?.relays || []
  const canUpload = isWriting && relayContent.trim() !== ''

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div style={{ padding: '120px 20px', textAlign: 'center' }}>로딩 중...</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageFileSelect} style={{ display: 'none' }} />
      <div className={styles.upperCard}>
        <BackHeader
          title="자치회 활동 후기"
          onBack={() => navigate(-1)}
          rightContent={<span className={styles.councilName}>{councilName}</span>}
        />
        <div className={styles.imageSection}>
          <div className={styles.imageRow}>
            <button className={styles.addImageButton} onClick={handleAddImage}>
              <img src={addImageIcon} alt="이미지 추가" className={styles.addImageIcon} />
            </button>
            {images.length > 0 && (
              <div className={styles.imageList}>
                {images.map((img) => (
                  <div key={img.id} className={styles.imageItem}>
                    <img src={img.url} alt="" className={styles.imageThumb} />
                    <button className={styles.imageRemoveButton} onClick={() => handleRemoveImage(img.id)}>
                      <span className={styles.imageRemoveX}>✕</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <p className={styles.titleLabel}>제목</p>
          <p className={styles.titleValue}>{postTitle}</p>
        </div>
      </div>

      <div className={styles.contentSection}>
        <p className={styles.guidanceText}>도착한 활동 후기를 이어서 작성해주세요</p>

        {/* Existing Relays */}
        {relays.map((relay: CouncilReviewRelay) => (
          <div key={relay.councilReviewRelayId} className={styles.relayCard}>
            <p className={styles.relayQuestion}>{relay.questionText}</p>
            <div className={styles.relayBody}>
              <div className={styles.relayAuthorRow}>
                <div className={styles.relayAvatar} />
                <p className={styles.relayAuthor}>{relay.writerUserName}</p>
              </div>
              <p className={styles.relayText}>{relay.relayContent}</p>
            </div>
          </div>
        ))}

        {/* New Relay Card */}
        {isWriting && (
          <div className={styles.relayCard}>
            <div className={styles.newRelayQuestionRow}>
              <p className={styles.newRelayQuestionText}>{questionText}</p>
              <button className={styles.refreshBtn} onClick={handleRefreshQuestion}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 4C7.58 4 4 7.58 4 12s3.58 8 8 8c3.93 0 7.19-2.84 7.87-6.57" stroke="#C8C8C8" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M20 4v5h-5" stroke="#C8C8C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <div className={styles.newRelayCard}>
              <div className={styles.newRelayAuthorRow}>
                {profile?.characterImageUrl ? (
                  <img
                    src={toFullUrl(profile.characterImageUrl)}
                    alt=""
                    className={styles.newRelayAvatar}
                  />
                ) : (
                  <div className={styles.newRelayAvatar} />
                )}
                <span className={styles.newRelayName}>{profile?.userName || userName}</span>
              </div>
              <textarea
                className={styles.newRelayTextarea}
                placeholder={"친구들과 공유할 후기를 알려주세요.\n친구들이 이어쓸 수 있어요."}
                value={relayContent}
                onChange={(e) => setRelayContent(e.target.value)}
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Add Relay Button */}
        {!isWriting && (
          <button className={styles.addRelayBtn} onClick={handleAddRelay} />
        )}
      </div>

      <div className={styles.footer}>
        <button
          className={`${styles.uploadButton} ${canUpload ? styles.uploadButtonActive : ''}`}
          onClick={handleUpload}
          disabled={!canUpload || isSubmitting}
        >
          {isSubmitting ? '업로드 중...' : '업로드 하기'}
        </button>
      </div>
    </div>
  )
}

export default RelayWritePage
