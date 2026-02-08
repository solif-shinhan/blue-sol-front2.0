import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles1 from './Board-1.module.css'
import styles2 from './Board-2.module.css'

const styles = { ...styles1, ...styles2 }
import {
  getPosts,
  PostItem as ApiPostItem,
  PostCategory,
  CATEGORY_REVERSE_MAP,
  logout,
} from '@/services'

import warmReviewImg from '@/assets/images/exchage-board/f768656256cbf251b006a6560d7a884aecf6a277.png'
import counselingImg from '@/assets/images/exchage-board/80112dee4520b196fff05166d3abf58e7377c037.png'
import foundationNewsImg from '@/assets/images/exchage-board/6fecb3f4903a46cbe10992ced7057fb3c483ef00.png'
import defaultPostImg from '@/assets/images/exchage-board/27342ac6292fb7d2b87647841f5fab093bda09f6.png'
import shinhanLogo from '@/assets/images/exchage-board/shinhan-logo.png'
const fabWriteIcon = '/jam_write.svg'

type FilterTab = '자치회 활동 후기' | '멘토링 후기'

interface CategoryCard {
  id: string
  title: string
  subtitle?: string
  image: string
}

interface PostItem {
  id: number
  category: string
  title: string
  description: string
  viewCount: number
  commentCount: number
  date: string
  image: string
}

const CATEGORY_CARDS: CategoryCard[] = [
  {
    id: 'warm-review',
    title: '따뜻한',
    subtitle: '활동 후기',
    image: warmReviewImg,
  },
  {
    id: 'counseling',
    title: '토닥토닥',
    subtitle: '고민상담',
    image: counselingImg,
  },
  {
    id: 'foundation-news',
    title: '장학재단',
    subtitle: '소식',
    image: foundationNewsImg,
  },
]

const FILTER_TO_CATEGORY: Record<FilterTab, PostCategory> = {
  '자치회 활동 후기': 'NOTICE',
  '멘토링 후기': 'PROGRAM',
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/\. /g, '.').replace(/\.$/, '')
}

function mapApiPostToUI(post: ApiPostItem): PostItem {
  return {
    id: post.postId,
    category: CATEGORY_REVERSE_MAP[post.category] || post.category,
    title: post.title,
    description: post.content.length > 60 ? post.content.slice(0, 60) + '..' : post.content,
    viewCount: post.viewCount || 0,
    commentCount: post.commentCount,
    date: formatDate(post.createdAt),
    image: post.images?.[0] || defaultPostImg,
  }
}

function BoardPage() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const [activeFilter, setActiveFilter] = useState<FilterTab>('자치회 활동 후기')
  const [posts, setPosts] = useState<PostItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchPosts = async (filter: FilterTab) => {
    setIsLoading(true)
    try {
      const category = FILTER_TO_CATEGORY[filter]
      const response = await getPosts({
        boardId: 1,
        category,
        page: 0,
        size: 20,
      })

      if (response.success) {
        const mappedPosts = response.data.content.map(mapApiPostToUI)
        setPosts(mappedPosts)
      }
    } catch (err) {
      console.error('게시글 조회 실패:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts(activeFilter)
  }, [activeFilter])

  const handleBack = () => {
    navigate(-1)
  }

  const handleSearch = () => {
    console.log('Search clicked')
  }

  const handleCategoryClick = (categoryId: string) => {
    console.log('Category clicked:', categoryId)
  }

  const handlePostClick = (postId: number) => {
    navigate(`/exchange/board/${postId}`)
  }

  const handleWritePost = () => {
    navigate('/exchange/board/write')
  }

  return (
    <div className={styles.container}>
      <div className={styles.safeArea} />

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backButton} onClick={handleBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 19L8 12L15 5" stroke="#222222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span className={styles.headerTitle}>게시판</span>
        </div>
        <button className={styles.searchButton} onClick={handleSearch}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="#222222" strokeWidth="2"/>
            <path d="M16 16L20 20" stroke="#222222" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </header>

      {/* Category Cards */}
      <div className={styles.categorySection}>
        {CATEGORY_CARDS.map((card, index) => (
          <div
            key={card.id}
            className={`${styles.categoryCard} ${index > 0 ? styles.categoryCardInactive : ''}`}
            onClick={() => handleCategoryClick(card.id)}
          >
            <img
              src={card.image}
              alt=""
              className={styles.categoryImage}
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
            <div className={styles.categoryTextGroup}>
              <span className={styles.categoryTitle}>{card.title}</span>
              {card.subtitle && (
                <span className={styles.categorySubtitle}>{card.subtitle}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className={styles.filterTabsSection}>
        <button
          className={`${styles.filterTabButton} ${activeFilter === '자치회 활동 후기' ? styles.active : ''}`}
          onClick={() => setActiveFilter('자치회 활동 후기')}
        >
          자치회 활동 후기
        </button>
        <button
          className={`${styles.filterTabButton} ${activeFilter === '멘토링 후기' ? styles.active : ''}`}
          onClick={() => setActiveFilter('멘토링 후기')}
        >
          멘토링 후기
        </button>
      </div>

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

                <img
                  src={post.image}
                  alt=""
                  className={styles.postImage}
                  onError={(e) => {
                    e.currentTarget.style.background = '#EEEEEE'
                  }}
                />
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
      <button className={styles.fabButton} onClick={handleWritePost}>
        <img src={fabWriteIcon} alt="글쓰기" className={styles.fabIcon} />
      </button>
    </div>
  )
}

export default BoardPage
