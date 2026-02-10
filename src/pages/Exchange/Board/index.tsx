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
  logout,
} from '@/services'

import warmReviewImg from '@/assets/images/exchage-board/f768656256cbf251b006a6560d7a884aecf6a277.png'
import counselingImg from '@/assets/images/exchage-board/80112dee4520b196fff05166d3abf58e7377c037.png'
import foundationNewsImg from '@/assets/images/exchage-board/6fecb3f4903a46cbe10992ced7057fb3c483ef00.png'
import shinhanLogo from '@/assets/images/exchage-board/shinhan-logo.png'
import { FABButton } from '@/components/FABButton'

const API_BASE = import.meta.env.VITE_API_URL || 'https://stg-api.bluesol.site'
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
    { label: '학업', boardId: 3, category: 'STUDY' },
    { label: '진학', boardId: 3, category: 'ADMISSION' },
    { label: '취업', boardId: 3, category: 'JOB' },
    { label: '기타', boardId: 3, category: 'ETC' },
  ],
  'foundation-news': [],
}

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
    category: post.councilName || CATEGORY_REVERSE_MAP[post.postCategory] || post.postCategory,
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

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const [activeCard, setActiveCard] = useState<CardId>('warm-review')
  const [activeFilterIdx, setActiveFilterIdx] = useState(0)
  const [posts, setPosts] = useState<PostItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const filters = CARD_FILTERS[activeCard]

  const fetchPosts = async (cardId: CardId, filterIdx: number) => {
    setIsLoading(true)
    try {
      const filterConfig = CARD_FILTERS[cardId]
      let boardId: number
      let category: PostCategory | undefined

      if (filterConfig.length > 0 && filterConfig[filterIdx]) {
        boardId = filterConfig[filterIdx].boardId
        category = filterConfig[filterIdx].category
      } else {
        boardId = DEFAULT_BOARD_ID[cardId]
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
    fetchPosts(activeCard, activeFilterIdx)
  }, [activeCard, activeFilterIdx])

  const handleCategoryClick = (cardId: CardId) => {
    if (cardId !== activeCard) {
      setActiveCard(cardId)
      setActiveFilterIdx(0)
    }
  }

  const handlePostClick = (postId: number) => {
    navigate(`/exchange/board/${postId}`)
  }

  const handleWritePost = () => {
    navigate('/exchange/board/write')
  }

  return (
    <div className={styles.container}>
      <BackHeader
        title="게시판"
        backTo="/exchange"
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
            <img src={card.image} alt="" className={styles.categoryImage}
              onError={(e) => { e.currentTarget.style.display = 'none' }} />
            <div className={styles.categoryImageOverlay} />
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
              onClick={() => setActiveFilterIdx(idx)}
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
                <div className={post.image ? styles.postContent : styles.postContentFull}>
                  <div className={styles.postMeta}>
                    <span className={styles.postCategory}>{post.category}</span>
                    <div className={styles.postMetaDivider} />
                    <div className={styles.postStats}>
                      <div className={styles.postStatsItem}>
                        <svg className={styles.postStatsIcon} width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path d="M9 3.75C5.5 3.75 2.25 7.125 2.25 9C2.25 10.875 5.5 14.25 9 14.25C12.5 14.25 15.75 10.875 15.75 9C15.75 7.125 12.5 3.75 9 3.75Z" stroke="#C8C8C8" strokeWidth="1.2"/>
                          <circle cx="9" cy="9" r="2.5" stroke="#C8C8C8" strokeWidth="1.2"/>
                        </svg>
                        <span className={styles.postStatsText}>{post.viewCount}</span>
                      </div>
                      <div className={styles.postStatsItem}>
                        <svg className={styles.postStatsIcon} width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path d="M3 13.5V5.25C3 4.14543 3.89543 3.25 5 3.25H13C14.1046 3.25 15 4.14543 15 5.25V10.5C15 11.6046 14.1046 12.5 13 12.5H6L3 13.5Z" stroke="#C8C8C8" strokeWidth="1.2" strokeLinejoin="round"/>
                        </svg>
                        <span className={styles.postStatsText}>{post.commentCount}</span>
                      </div>
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
                  <img
                    src={post.image}
                    alt=""
                    className={styles.postImage}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <button type="button" className={styles.footerButton} onClick={handleLogout}>
          <span className={styles.footerButtonText}>로그아웃</span>
        </button>
        <button className={styles.footerButton}>
          <img src={shinhanLogo} alt="신한장학재단" className={styles.footerLogo} />
        </button>
      </div>

      {/* FAB Write Button */}
      <FABButton onClick={handleWritePost} />
    </div>
  )
}

export default BoardPage
