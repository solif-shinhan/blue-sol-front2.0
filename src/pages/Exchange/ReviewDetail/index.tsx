import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import styles from './ReviewDetail-1.module.css'
import { councilReviewPostApi, type CouncilReviewPostDetail } from '@/api/api-3'
import { likePost, unlikePost } from '@/services/postService'
import { getComments, type Comment } from '@/services/commentService'
import shareIcon from '@/assets/images/writing/ef776381b9d92c89076574a4250f5ef294d99f23.svg'

const API_BASE = import.meta.env.VITE_API_URL || 'https://stg-api.bluesol.site'
const toFullUrl = (path: string | undefined): string | undefined => {
  if (!path) return undefined
  if (path.startsWith('http') || path.startsWith('blob')) return path
  return `${API_BASE}/${path}`
}

interface LocationState {
  title?: string
  dateValue?: string
  questionText?: string
  reviewText?: string
  imageUrls?: string[]
}

function ReviewDetailPage() {
  const navigate = useNavigate()
  const { reviewId } = useParams<{ reviewId: string }>()
  const location = useLocation()
  const state = location.state as LocationState | null

  const [detail, setDetail] = useState<CouncilReviewPostDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [commentCount, setCommentCount] = useState(0)

  const isLeader = detail?.isLeader ?? false
  const currentUserId = Number(localStorage.getItem('userId') || '0')
  const hasWrittenRelay = detail?.relays?.some((r) => r.writerUserId === currentUserId) ?? false

  useEffect(() => {
    if (!reviewId) return
    const fetchDetail = async () => {
      setIsLoading(true)
      try {
        const res = await councilReviewPostApi.get(Number(reviewId))
        if (res.success && res.data) {
          setDetail(res.data)
          setIsLiked(res.data.isLikedByMe)
          setLikeCount(res.data.likeCount)
          setCommentCount(res.data.commentCount)
        }
      } catch {
        // state 폴백
      } finally {
        setIsLoading(false)
      }
    }
    fetchDetail()
  }, [reviewId])

  useEffect(() => {
    if (!detail?.postId) return
    getComments(detail.postId)
      .then((res) => {
        if (res.success) {
          const list = res.data as unknown as Comment[]
          setCommentCount(Array.isArray(list) ? list.length : 0)
        }
      })
      .catch(() => {})
  }, [detail?.postId])

  const handleLike = async () => {
    const postId = detail?.postId
    if (!postId) return
    try {
      if (isLiked) {
        const res = await unlikePost(postId)
        if (res.success) {
          setIsLiked(false)
          setLikeCount((prev) => Math.max(0, prev - 1))
        }
      } else {
        const res = await likePost(postId)
        if (res.success) {
          setIsLiked(true)
          setLikeCount((prev) => prev + 1)
        }
      }
    } catch {
      // 에러 무시
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: postTitle, url: window.location.href }).catch(() => {})
    }
  }

  const handleDelete = async () => {
    if (!detail || !confirm('활동 후기를 삭제하시겠습니까?')) return
    try {
      const res = await councilReviewPostApi.delete(detail.councilReviewPostId)
      if (res.success) {
        alert('삭제되었습니다.')
        navigate('/exchange')
      }
    } catch {
      alert('삭제에 실패했습니다.')
    }
  }

  const handleWriteRelay = () => {
    if (!detail) return
    navigate('/exchange/write/review', {
      state: { relayMode: true, councilReviewPostId: detail.councilReviewPostId },
    })
  }

  // Fallback to state data
  const postTitle = detail?.postTitle || state?.title || ''
  const activityDate = detail?.activityDate || state?.dateValue || ''
  const viewCount = detail?.viewCount || 0
  const councilName = detail?.councilName || ''
  const imageUrls = detail?.imageUrls || state?.imageUrls || []
  const relays = detail?.relays || []

  const displayDate = activityDate.replace(/-/g, '.').replace(/^20/, '')

  const handleImageSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left' && currentImageIndex < imageUrls.length - 1) {
      setCurrentImageIndex((prev) => prev + 1)
    } else if (direction === 'right' && currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1)
    }
  }

  if (isLoading && !state) {
    return (
      <div className={styles.container}>
        <div style={{ padding: '120px 20px', textAlign: 'center' }}>로딩 중...</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Image Carousel */}
      <div
        className={styles.imageCarousel}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          const x = e.clientX - rect.left
          handleImageSwipe(x > rect.width / 2 ? 'left' : 'right')
        }}
      >
        {imageUrls.length > 0 ? (
          <img
            src={toFullUrl(imageUrls[currentImageIndex]) || imageUrls[currentImageIndex]}
            alt=""
            className={styles.carouselImage}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#E6E6E6' }} />
        )}
        {imageUrls.length > 1 && (
          <div className={styles.carouselDots}>
            {imageUrls.map((_, i) => (
              <div
                key={i}
                className={`${styles.carouselDot} ${i === currentImageIndex ? styles.carouselDotActive : ''}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Header Overlay */}
      <div className={styles.headerOverlay}>
        <button className={styles.closeButton} onClick={() => navigate('/exchange')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        {isLeader ? (
          <button className={styles.editButton} onClick={handleDelete}>편집</button>
        ) : (
          !hasWrittenRelay && (
            <button className={styles.editButton} onClick={handleWriteRelay}>이어쓰기</button>
          )
        )}
      </div>

      {/* Content */}
      <div className={styles.contentSection}>
        <div className={styles.titleBlock}>
          <h1 className={styles.postTitle}>{postTitle}</h1>
          <div className={styles.postMeta}>
            <span className={styles.metaText}>{displayDate}</span>
            <span className={styles.metaText}>조회수 {viewCount}</span>
            <span className={styles.metaCouncil}>{councilName}</span>
          </div>
        </div>

        {/* All Relays */}
        {relays.length > 0 ? (
          relays.map((relay, idx) => (
            <div key={relay.councilReviewRelayId} className={styles.reviewContent}>
              <h2 className={styles.questionTitle}>{relay.questionText}</h2>
              <div className={styles.reviewBody}>
                <p className={styles.reviewText}>{relay.relayContent}</p>
                <p className={styles.authorName}>{relay.writerUserName}</p>
              </div>
              {idx < relays.length - 1 && <div className={styles.relaySeparator} />}
            </div>
          ))
        ) : state?.questionText ? (
          <div className={styles.reviewContent}>
            <h2 className={styles.questionTitle}>{state.questionText}</h2>
            <div className={styles.reviewBody}>
              <p className={styles.reviewText}>{state.reviewText}</p>
            </div>
          </div>
        ) : null}
      </div>

      {/* Member CTA Banner */}
      {!isLeader && !hasWrittenRelay && detail && (
        <div className={styles.ctaBanner}>
          <div className={styles.ctaText}>
            <p className={styles.ctaLine}>활동 후기를</p>
            <p className={styles.ctaLine}>이어서 작성해주세요</p>
          </div>
          <button className={styles.ctaButton} onClick={handleWriteRelay}>
            작성하기
          </button>
        </div>
      )}

      <div className={styles.spacer} />

      {/* Bottom Bar */}
      <div className={styles.bottomBar}>
        <div className={styles.actionRow}>
          <button className={styles.actionItem} onClick={handleLike}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className={styles.actionIcon}>
              <path
                d="M16 27.2C15.6 27.2 15.2 27.04 14.88 26.8C13.6 25.76 12.36 24.8 11.28 23.96L11.24 23.92C8.36 21.6 5.84 19.56 4.08 17.56C2.12 15.32 1.2 13.2 1.2 10.88C1.2 8.64 2 6.56 3.44 5.04C4.88 3.52 6.88 2.68 9.04 2.68C10.64 2.68 12.12 3.2 13.44 4.2C14.12 4.72 14.72 5.36 15.24 6.08C15.52 5.72 15.84 5.4 16.2 5.12C16.56 4.8 16.96 4.52 17.36 4.28C17.84 4 18.36 3.76 18.88 3.56C19.44 3.4 20 3.28 20.56 3.24C20.72 3.2 20.88 3.2 21.04 3.2C23.2 3.2 25.2 4.04 26.64 5.56C28.08 7.08 28.88 9.16 28.88 11.4C28.88 13.72 27.96 15.84 26 18.08C24.24 20.08 21.72 22.12 18.84 24.44C17.76 25.32 16.52 26.28 15.2 27.32C14.88 27.56 14.48 27.68 14.08 27.68"
                fill={isLiked ? '#FF4D4D' : 'none'}
                stroke={isLiked ? '#FF4D4D' : '#121212'}
                strokeWidth={isLiked ? '0' : '1.5'}
              />
            </svg>
            <span className={styles.actionCount}>{likeCount}</span>
          </button>

          <button className={styles.actionItem} onClick={() => navigate(`/exchange/board/${detail?.postId}`)}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className={styles.actionIcon}>
              <path d="M27 10C27 7.23858 24.7614 5 22 5H10C7.23858 5 5 7.23858 5 10V18C5 20.7614 7.23858 23 10 23H12L16 27L20 23H22C24.7614 23 27 20.7614 27 18V10Z" stroke="#121212" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
            <span className={styles.actionCount}>{commentCount}</span>
          </button>

          <button className={styles.actionItem} onClick={handleShare}>
            <img src={shareIcon} alt="공유" className={styles.actionIcon} />
            <span className={styles.actionCount}>0</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReviewDetailPage
