import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './BoardDetail.module.css'
import { Post, Comment } from '../../types'
import backArrowIcon from '@/assets/images/Glyph_ undefined.svg'

// 샘플 게시글 데이터
const SAMPLE_POST: Post = {
  id: 1,
  category: '활동후기',
  title: '첫 봉사활동 후기입니다!',
  content: `오늘 첫 봉사활동을 다녀왔습니다.

아침 일찍 일어나서 준비하느라 힘들었지만, 도착해서 보니 많은 분들이 이미 와계셨어요.

처음에는 어색했는데 함께 활동하다 보니 금방 친해졌습니다. 특히 어르신들께서 너무 반겨주셔서 뿌듯했어요.

다음에도 꼭 참여하고 싶습니다!`,
  authorName: '김철수',
  createdAt: '2024.01.15 14:30',
  viewCount: 42,
  likeCount: 12,
  commentCount: 3,
}

// 샘플 댓글 데이터
const SAMPLE_COMMENTS: Comment[] = [
  {
    id: 1,
    postId: 1,
    authorName: '이영희',
    content: '저도 다음에 같이 가고 싶어요!',
    createdAt: '2024.01.15 15:20',
    likeCount: 2,
  },
  {
    id: 2,
    postId: 1,
    authorName: '박민수',
    content: '봉사활동 정보 공유해주세요~',
    createdAt: '2024.01.15 16:45',
    likeCount: 1,
  },
  {
    id: 3,
    postId: 1,
    authorName: '최지은',
    content: '뿌듯한 하루였겠네요 :)',
    createdAt: '2024.01.15 18:00',
    likeCount: 3,
  },
]

function BoardDetailPage() {
  const navigate = useNavigate()
  const { postId } = useParams<{ postId: string }>()
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState<Comment[]>(SAMPLE_COMMENTS)

  // TODO: postId로 실제 게시글 조회
  const post = SAMPLE_POST

  const handleBack = () => {
    navigate('/exchange/board')
  }

  const handleMore = () => {
    // TODO: 더보기 메뉴 (수정, 삭제, 신고)
    console.log('더보기 메뉴')
  }

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentText(e.target.value)
  }

  const handleCommentSubmit = () => {
    if (!commentText.trim()) return

    const newComment: Comment = {
      id: Date.now(),
      postId: Number(postId),
      authorName: '나',
      content: commentText,
      createdAt: new Date().toLocaleString('ko-KR'),
      likeCount: 0,
    }

    setComments((prev) => [...prev, newComment])
    setCommentText('')
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleCommentSubmit()
    }
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

        {post.images && post.images.length > 0 && (
          <div className={styles.imageGallery}>
            {post.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt=""
                className={styles.galleryImage}
              />
            ))}
          </div>
        )}

        <div className={styles.postBody}>
          <p className={styles.postContent}>{post.content}</p>
        </div>

        <div className={styles.commentSection}>
          <div className={styles.commentHeader}>
            <span className={styles.commentTitle}>댓글</span>
            <span className={styles.commentCount}>{comments.length}</span>
          </div>

          {comments.length === 0 ? (
            <div className={styles.emptyComments}>
              <span className={styles.emptyText}>첫 댓글을 남겨보세요!</span>
            </div>
          ) : (
            <div className={styles.commentList}>
              {comments.map((comment) => (
                <div key={comment.id} className={styles.commentItem}>
                  <div className={styles.commentAvatar} />
                  <div className={styles.commentContent}>
                    <span className={styles.commentAuthor}>{comment.authorName}</span>
                    <p className={styles.commentText}>{comment.content}</p>
                    <div className={styles.commentMeta}>
                      <span className={styles.commentDate}>{comment.createdAt}</span>
                      <button className={styles.commentLike}>
                        ♡ {comment.likeCount}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 댓글 입력창 공간 확보 */}
        <div style={{ height: '80px' }} />
      </div>

      <div className={styles.commentInputWrapper}>
        <input
          type="text"
          className={styles.commentInput}
          placeholder="댓글을 입력해주세요"
          value={commentText}
          onChange={handleCommentChange}
          onKeyPress={handleKeyPress}
        />
        <button
          className={styles.sendButton}
          disabled={!commentText.trim()}
          onClick={handleCommentSubmit}
        >
          <span className={styles.sendIcon}>→</span>
        </button>
      </div>
    </div>
  )
}

export default BoardDetailPage
