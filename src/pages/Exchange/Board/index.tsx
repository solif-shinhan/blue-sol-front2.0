import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles1 from './Board-1.module.css'
import styles2 from './Board-2.module.css'
import { BackHeader } from '@/components/BackHeader'

const styles = { ...styles1, ...styles2 }
import {
  getPosts,
  PostListItem,
  PostCategory,
  CATEGORY_REVERSE_MAP,
  BOARD_NAME_MAP,
} from '@/services'

import warmReviewImg from '@/assets/images/exchage-board/f768656256cbf251b006a6560d7a884aecf6a277.png'
import counselingImg from '@/assets/images/exchage-board/80112dee4520b196fff05166d3abf58e7377c037.png'
import foundationNewsImg from '@/assets/images/exchage-board/6fecb3f4903a46cbe10992ced7057fb3c483ef00.png'
import fabCloseIconSvg from '@/assets/images/exchage-board/Vector2.svg'
import { FABButton } from '@/components/FABButton'

const API_BASE = import.meta.env.VITE_API_URL || ''
const toFullUrl = (path: string | null | undefined): string | undefined => {
  if (!path) return undefined
  if (path.startsWith('http') || path.startsWith('blob')) return path
  return `${API_BASE}/${path}`
}

type CardId = 'warm-review' | 'counseling' | 'foundation-news'

interface CategoryCard {
  id: CardId
  title: string
  subtitle?: string
  image: string
}

interface FilterConfig {
  label: string
  boardId: number
  category?: PostCategory
}

interface PostItem {
  id: number
  category: string
  title: string
  description: string
  viewCount: number
  commentCount: number
  date: string
  image: string | null
}

const CATEGORY_CARDS: CategoryCard[] = [
  { id: 'warm-review', title: '따뜻한', subtitle: '활동 후기', image: warmReviewImg },
  { id: 'counseling', title: '토닥토닥', subtitle: '고민상담', image: counselingImg },
  { id: 'foundation-news', title: '장학재단', subtitle: '소식', image: foundationNewsImg },
]

const CARD_FILTERS: Record<CardId, FilterConfig[]> = {
  'warm-review': [
    { label: '자치회 활동 후기', boardId: 1 },
    { label: '멘토링 후기', boardId: 2 },
  ],
  'counseling': [
    { label: '전체', boardId: 3 },
    { label: '학업 고민', boardId: 3, category: 'STUDY' },
    { label: '진학 고민', boardId: 3, category: 'ADMISSION' },
    { label: '취업 고민', boardId: 3, category: 'JOB' },
    { label: '기타 고민', boardId: 3, category: 'ETC' },
  ],
  'foundation-news': [
    { label: '재단소식', boardId: 4 },
    { label: '장학프로그램', boardId: 5 },
  ],
}

const MENTORING_SUB_FILTERS: FilterConfig[] = [
  { label: '전체', boardId: 2 },
  { label: '학업', boardId: 2, category: 'STUDY' },
  { label: '진학', boardId: 2, category: 'ADMISSION' },
  { label: '취업', boardId: 2, category: 'JOB' },
  { label: '기타', boardId: 2, category: 'ETC' },
]

const DEFAULT_BOARD_ID: Record<CardId, number> = {
  'warm-review': 1,
  'counseling': 3,
  'foundation-news': 4,
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/\. /g, '.').replace(/\.$/, '')
}

function mapApiPostToUI(post: PostListItem): PostItem {
  const content = post.postContentPreview || ''
  return {
    id: post.postId,
    category: post.councilName || BOARD_NAME_MAP[post.boardId] || CATEGORY_REVERSE_MAP[post.postCategory] || post.postCategory,
    title: post.postTitle,
    description: content.length > 60 ? content.slice(0, 60) + '..' : content,
    viewCount: post.viewCount || 0,
    commentCount: post.commentCount,
    date: formatDate(post.createdAt),
    image: toFullUrl(post.thumbnailImageUrl) || null,
  }
}

function BoardPage() {
  const navigate = useNavigate()

  const [activeCard, setActiveCard] = useState<CardId>('warm-review')
  const [activeFilterIdx, setActiveFilterIdx] = useState(0)
  const [subFilterIdx, setSubFilterIdx] = useState(0)
  const [posts, setPosts] = useState<PostItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFabMenuOpen, setIsFabMenuOpen] = useState(false)

  const filters = CARD_FILTERS[activeCard]

  const isMentoringActive = activeCard === 'warm-review' && activeFilterIdx === 1

  const fetchPosts = async (cardId: CardId, filterIdx: number, subIdx: number) => {
    setIsLoading(true)
    try {
      let boardId: number
      let category: PostCategory | undefined

      if (cardId === 'warm-review' && filterIdx === 1) {
        const sub = MENTORING_SUB_FILTERS[subIdx] || MENTORING_SUB_FILTERS[0]
        boardId = sub.boardId
        category = sub.category
      } else {
        const filterConfig = CARD_FILTERS[cardId]
        if (filterConfig.length > 0 && filterConfig[filterIdx]) {
          boardId = filterConfig[filterIdx].boardId
          category = filterConfig[filterIdx].category
        } else {
          boardId = DEFAULT_BOARD_ID[cardId]
        }
      }

      const response = await getPosts({
        boardId,
        category,
        page: 0,
        size: 20,
      })

      if (response.success) {
        setPosts(response.data.content.map(mapApiPostToUI))
      }
    } catch (err) {
      console.error('게시글 조회 실패:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts(activeCard, activeFilterIdx, subFilterIdx)
  }, [activeCard, activeFilterIdx, subFilterIdx])

  const handleCategoryClick = (cardId: CardId) => {
    if (cardId !== activeCard) {
      setActiveCard(cardId)
      setActiveFilterIdx(0)
      setSubFilterIdx(0)
    }
  }

  const handlePostClick = (postId: number) => {
    navigate(`/exchange/board/${postId}`)
  }


  return (
    <div className={styles.container}>
      <BackHeader
        title="게시판"
        showSearch
      />

      {/* Category Cards */}
      <div className={styles.categorySection}>
        {CATEGORY_CARDS.map((card) => (
          <div
            key={card.id}
            className={`${styles.categoryCard} ${card.id !== activeCard ? styles.categoryCardInactive : ''}`}
            onClick={() => handleCategoryClick(card.id)}
          >
            <div className={`${styles.categoryImageWrap} ${card.id === 'counseling' ? styles.categoryImageWrapCounseling : ''}`}>
              <div className={styles.categoryImageInner}>
                <img src={card.image} alt=""
                  className={card.id === 'counseling' ? styles.categoryImageCounseling : styles.categoryImage}
                  onError={(e) => { e.currentTarget.style.display = 'none' }} />
              </div>
              <div className={styles.categoryImageOverlay} />
            </div>
            <div className={styles.categoryTextGroup}>
              <span className={styles.categoryTitle}>{card.title}</span>
              {card.subtitle && <span className={styles.categorySubtitle}>{card.subtitle}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      {filters.length > 0 && (
        <div className={styles.filterTabsSection}>
          {filters.map((f, idx) => (
            <button
              key={f.label}
              className={`${styles.filterTabButton} ${activeFilterIdx === idx ? styles.active : ''}`}
              onClick={() => { setActiveFilterIdx(idx); setSubFilterIdx(0) }}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Sub-Filters (멘토링 후기) */}
      {isMentoringActive && (
        <div className={styles.subFilterSection} style={{ marginTop: '16px', paddingLeft: '16px' }}>
          {MENTORING_SUB_FILTERS.map((f, idx) => (
            <button
              key={f.label}
              className={`${styles.subFilterButton} ${subFilterIdx === idx ? styles.active : ''}`}
              onClick={() => setSubFilterIdx(idx)}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Post List */}
      <div className={styles.contentWrapper}>
        {isLoading ? (
          <div className={styles.loadingWrapper}>
            <span>로딩 중...</span>
          </div>
        ) : posts.length === 0 ? (
          <div className={styles.emptyWrapper}>
            <span>게시글이 없습니다.</span>
          </div>
        ) : (
          <div className={styles.postList}>
            {posts.map((post) => (
              <div
                key={post.id}
                className={styles.postCard}
                onClick={() => handlePostClick(post.id)}
              >
                <div className={styles.postContent}>
                  <div className={styles.postMeta}>
                    <span className={styles.postCategory}>{post.category}</span>
                    <div className={styles.postMetaDivider} />
                    <div className={styles.postStats}>
                      <span className={styles.postStatsItem}>
                        <img src="/eyes.svg" alt="" className={styles.postStatsIcon} /> {post.viewCount}
                      </span>
                      <span className={styles.postStatsItem}>
                        <img src="/talk.svg" alt="" className={styles.postStatsIcon} /> {post.commentCount}
                      </span>
                    </div>
                    <div className={styles.postMetaDivider} />
                    <span className={styles.postDate}>{post.date}</span>
                  </div>

                  <div className={styles.postTextContent}>
                    <h3 className={styles.postTitle}>{post.title}</h3>
                    <p className={styles.postDescription}>{post.description}</p>
                  </div>
                </div>

                {post.image && (
                  <div className={styles.postThumbnail}>
                    <img
                      src={post.image}
                      alt=""
                      className={styles.postThumbnailImg}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {isFabMenuOpen && (
        <div className={styles.fabOverlay} onClick={() => setIsFabMenuOpen(false)}>
          <div className={styles.fabMenuWrap} onClick={(e) => e.stopPropagation()}>
            <div className={styles.fabMenu}>
              <button className={`${styles.fabMenuItem} ${styles.fabMenuItemBorder}`} onClick={() => navigate('/exchange/write/review')}>
                자치회 활동 후기 작성
              </button>
              <button className={`${styles.fabMenuItem} ${styles.fabMenuItemBorder}`} onClick={() => navigate('/exchange/write')}>
                토닥토닥 고민 상담
              </button>
              <button className={styles.fabMenuItem} onClick={() => navigate('/exchange/write/form')}>
                멘토링 후기 작성
              </button>
            </div>
            <button className={styles.fabClose} onClick={() => setIsFabMenuOpen(false)}>
              <img src={fabCloseIconSvg} alt="닫기" className={styles.fabCloseIcon} />
            </button>
          </div>
        </div>
      )}

      {!isFabMenuOpen && (
        <FABButton onClick={() => setIsFabMenuOpen(true)} />
      )}
    </div>
  )
}

export default BoardPage
