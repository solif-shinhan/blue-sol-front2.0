import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './BoardDetail.module.css'
import backArrowIcon from '@/assets/images/Glyph_ undefined.svg'
import {
  getComments,
  createComment,
  deleteComment,
  getPostDetail,
  likePost,
  unlikePost,
  type Comment as ApiComment,
  CATEGORY_REVERSE_MAP,
} from '@/services'

const API_BASE = import.meta.env.VITE_API_URL || 'https://stg-api.bluesol.site'
const toFullUrl = (path: string | null | undefined): string | undefined => {
  if (!path) return undefined
  if (path.startsWith('http') || path.startsWith('blob')) return path
  return `${API_BASE}/${path}`
}

// 시간 포맷 함수
function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).replace(/\. /g, '.').replace(/, /g, ' ')
}

interface DisplayPost {
  id: number
  category: string
  title: string
  content: string
  authorName: string
  createdAt: string
  viewCount: number
  likeCount: number
  commentCount: number
  imageUrls?: string[]
  isLiked: boolean
}

function BoardDetailPage() {
  const navigate = useNavigate()
  const { postId } = useParams<{ postId: string }>()
  const [commentText, setCommentText] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [comments, setComments] = useState<ApiComment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [post, setPost] = useState<DisplayPost | null>(null)
  const [isPostLoading, setIsPostLoading] = useState(true)

  const currentUserId = Number(localStorage.getItem('userId') || '0')

  // 게시글 상세 조회
  const fetchPost = async () => {
    if (!postId) return

    setIsPostLoading(true)
    try {
      const response = await getPostDetail(Number(postId))
      if (response.success) {
        const data = response.data
        setPost({
          id: data.postId,
          category: CATEGORY_REVERSE_MAP[data.category] || data.category,
          title: data.title,
          content: data.content,
          authorName: data.authorName,
          createdAt: formatDateTime(data.createdAt),
          viewCount: data.viewCount || 0,
          likeCount: data.likeCount,
          commentCount: data.commentCount,
          imageUrls: data.imageUrls,
          isLiked: data.isLiked,
        })
      }
    } catch (err) {
      console.error('게시글 조회 실패:', err)
    } finally {
      setIsPostLoading(false)
    }
  }

  // 댓글 목록 조회
  const fetchComments = async () => {
    if (!postId) return

    setIsLoading(true)
    try {
      const response = await getComments(Number(postId))
      if (response.success) {
        setComments(response.data)
      }
    } catch (err) {
      console.error('댓글 조회 실패:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let ignore = false
    if (!ignore) {
      fetchPost()
      fetchComments()
    }
    return () => { ignore = true }
  }, [postId])

  const handleBack = () => {
    navigate('/exchange/board')
  }

  const handleMore = () => {
    console.log('더보기 메뉴')
  }

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentText(e.target.value)
  }

  const handleCommentSubmit = async () => {
    if (!commentText.trim() || !postId || isSubmitting) return

    setIsSubmitting(true)
    try {
      const response = await createComment(Number(postId), {
        commentContent: commentText,
        commentIsAnonymous: isAnonymous,
      })

      if (response.success) {
        setComments((prev) => [...prev, response.data])
        setCommentText('')
        setIsAnonymous(false)
      }
    } catch (err) {
      console.error('댓글 작성 실패:', err)
      alert('댓글 작성에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('댓글을 삭제하시겠습니까?')) return

    try {
      const response = await deleteComment(commentId)
      if (response.success) {
        setComments((prev) => prev.filter((c) => c.commentId !== commentId))
      }
    } catch (err) {
      console.error('댓글 삭제 실패:', err)
      alert('댓글 삭제에 실패했습니다.')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleCommentSubmit()
    }
  }

  const handleLike = async () => {
    if (!postId || !post) return

    try {
      if (post.isLiked) {
        const response = await unlikePost(Number(postId))
        if (response.success) {
          setPost({
            ...post,
            isLiked: false,
            likeCount: post.likeCount - 1,
          })
        }
      } else {
        const response = await likePost(Number(postId))
        if (response.success) {
          setPost({
            ...post,
            isLiked: true,
            likeCount: post.likeCount + 1,
          })
        }
      }
    } catch (err) {
      console.error('좋아요 처리 실패:', err)
    }
  }

  if (isPostLoading) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <button className={styles.backButton} onClick={handleBack}>
            <img src={backArrowIcon} alt="뒤로가기" className={styles.backIcon} />
          </button>
          <span className={styles.headerTitle}>게시글</span>
          <div style={{ width: 24 }} />
        </header>
        <div className={styles.content} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <span>로딩 중...</span>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <button className={styles.backButton} onClick={handleBack}>
            <img src={backArrowIcon} alt="뒤로가기" className={styles.backIcon} />
          </button>
          <span className={styles.headerTitle}>게시글</span>
          <div style={{ width: 24 }} />
        </header>
        <div className={styles.content} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <span>게시글을 찾을 수 없습니다.</span>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <img src={backArrowIcon} alt="뒤로가기" className={styles.backIcon} />
        </button>
        <span className={styles.headerTitle}>게시글</span>
        <button className={styles.moreButton} onClick={handleMore}>
          <img src="/dismisscircle.svg" alt="더보기" className={styles.moreIcon} />
        </button>
      </header>

      <div className={styles.content}>
        <div className={styles.postHeader}>
          <div className={styles.categoryBadge}>
            <span className={styles.categoryText}>{post.category}</span>
          </div>
          <h1 className={styles.postTitle}>{post.title}</h1>

          <div className={styles.authorInfo}>
            <div className={styles.authorAvatar} />
            <div className={styles.authorDetails}>
              <span className={styles.authorName}>{post.authorName}</span>
              <span className={styles.postDate}>{post.createdAt}</span>
            </div>
          </div>

          <div className={styles.postStats}>
            <span className={styles.postStat}>
              <img src="/eyes.svg" alt="" className={styles.statIcon} />
              조회 {post.viewCount}
            </span>
            <span className={styles.postStat}>
              <img src="/talk.svg" alt="" className={styles.statIcon} />
              댓글 {comments.length}
            </span>
          </div>
        </div>

        {post.imageUrls && post.imageUrls.length > 0 && (
          <div className={styles.imageGallery}>
            {post.imageUrls.map((image, index) => (
              <img
                key={index}
                src={toFullUrl(image) || image}
                alt=""
                className={styles.galleryImage}
              />
            ))}
          </div>
        )}

        <div className={styles.postBody}>
          <p className={styles.postContent}>{post.content}</p>
        </div>

        <div style={{ padding: '16px 20px', borderBottom: '1px solid #EEEEEE' }}>
          <button
            onClick={handleLike}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              border: post.isLiked ? '1px solid #074ED8' : '1px solid #DDDDDD',
              borderRadius: '20px',
              background: post.isLiked ? '#EBF2FF' : '#FFFFFF',
              color: post.isLiked ? '#074ED8' : '#666666',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            <span>{post.isLiked ? '❤️' : '🤍'}</span>
            <span>좋아요 {post.likeCount}</span>
          </button>
        </div>

        <div className={styles.commentSection}>
          <div className={styles.commentHeader}>
            <span className={styles.commentTitle}>댓글</span>
            <span className={styles.commentCount}>{comments.length}</span>
          </div>

          {isLoading ? (
            <div className={styles.emptyComments}>
              <span className={styles.emptyText}>로딩 중...</span>
            </div>
          ) : comments.length === 0 ? (
            <div className={styles.emptyComments}>
              <span className={styles.emptyText}>첫 댓글을 남겨보세요!</span>
            </div>
          ) : (
            <div className={styles.commentList}>
              {comments.map((comment) => (
                <div key={comment.commentId} className={styles.commentItem}>
                  <div className={styles.commentAvatar} />
                  <div className={styles.commentContent}>
                    <div className={styles.commentAuthorRow}>
                      <span className={styles.commentAuthor}>
                        {comment.commentIsAnonymous ? '익명' : comment.authorName}
                      </span>
                      {comment.authorId === currentUserId && (
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDeleteComment(comment.commentId)}
                        >
                          삭제
                        </button>
                      )}
                    </div>
                    <p className={styles.commentText}>{comment.commentContent}</p>
                    <div className={styles.commentMeta}>
                      <span className={styles.commentDate}>
                        {formatDateTime(comment.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ height: '80px' }} />
      </div>

      <div className={styles.commentInputWrapper}>
        <label className={styles.anonymousCheckbox}>
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
          />
          <span>익명</span>
        </label>
        <input
          type="text"
          className={styles.commentInput}
          placeholder="댓글을 입력해주세요"
          value={commentText}
          onChange={handleCommentChange}
          onKeyPress={handleKeyPress}
          disabled={isSubmitting}
        />
        <button
          className={styles.sendButton}
          disabled={!commentText.trim() || isSubmitting}
          onClick={handleCommentSubmit}
        >
          <span className={styles.sendIcon}>→</span>
        </button>
      </div>
    </div>
  )
}

export default BoardDetailPage
