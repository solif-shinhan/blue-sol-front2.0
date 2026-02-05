import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Board.module.css'
import {
  getPosts,
  PostItem as ApiPostItem,
  PostCategory,
  CATEGORY_REVERSE_MAP,
} from '@/services'

import warmReviewImg from '@/assets/images/exchage-board/f768656256cbf251b006a6560d7a884aecf6a277.png'
import counselingImg from '@/assets/images/exchage-board/80112dee4520b196fff05166d3abf58e7377c037.png'
import foundationNewsImg from '@/assets/images/exchage-board/6fecb3f4903a46cbe10992ced7057fb3c483ef00.png'

import defaultPostImg from '@/assets/images/exchage-board/27342ac6292fb7d2b87647841f5fab093bda09f6.png'

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

// 필터탭 -> 카테고리 매핑
const FILTER_TO_CATEGORY: Record<FilterTab, PostCategory> = {
  '자치회 활동 후기': 'NOTICE',
  '멘토링 후기': 'PROGRAM',
}

// 날짜 포맷 함수
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/\. /g, '.').replace(/\.$/, '')
}

// API 응답 -> UI 형식 변환
function mapApiPostToUI(post: ApiPostItem): PostItem {
  return {
    id: post.postId,
    category: CATEGORY_REVERSE_MAP[post.category] || post.category,
    title: post.title,
    description: post.content.length > 60 ? post.content.slice(0, 60) + '...' : post.content,
    viewCount: post.viewCount || 0,
    commentCount: post.commentCount,
    date: formatDate(post.createdAt),
    image: post.images?.[0] || defaultPostImg,
  }
}

function BoardPage() {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState<FilterTab>('자치회 활동 후기')
  const [posts, setPosts] = useState<PostItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // 게시글 목록 조회
  const fetchPosts = async (filter: FilterTab) => {
    setIsLoading(true)
    try {
      const category = FILTER_TO_CATEGORY[filter]
      const response = await getPosts({
        boardId: 1, // 기본 게시판 ID
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

      <header className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 19L8 12L15 5" stroke="#222222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className={styles.headerTitle}>게시판</span>
        <button className={styles.searchButton} onClick={handleSearch}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="#222222" strokeWidth="2"/>
            <path d="M16 16L20 20" stroke="#222222" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </header>

      <div className={styles.categorySection}>
        {CATEGORY_CARDS.map((card) => (
          <div
            key={card.id}
            className={styles.categoryCard}
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
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={styles.postStatsIcon}>
                        <path d="M7 2.5C4 2.5 1.5 5.5 1.5 7C1.5 8.5 4 11.5 7 11.5C10 11.5 12.5 8.5 12.5 7C12.5 5.5 10 2.5 7 2.5Z" stroke="#C8C8C8" strokeWidth="1.2"/>
                        <circle cx="7" cy="7" r="2" stroke="#C8C8C8" strokeWidth="1.2"/>
                      </svg>
                      <span className={styles.postStatsText}>{post.viewCount}</span>
                    </div>
                    <div className={styles.postStatsItem}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={styles.postStatsIcon}>
                        <path d="M2 10.5V4C2 3.17157 2.67157 2.5 3.5 2.5H10.5C11.3284 2.5 12 3.17157 12 4V8C12 8.82843 11.3284 9.5 10.5 9.5H4.5L2 10.5Z" stroke="#C8C8C8" strokeWidth="1.2" strokeLinejoin="round"/>
                      </svg>
                      <span className={styles.postStatsText}>{post.commentCount}</span>
                    </div>
                  </div>
                  <div className={styles.postMetaDivider} />
                  <span className={styles.postDate}>{post.date}</span>
                </div>

                <h3 className={styles.postTitle}>{post.title}</h3>

                <p className={styles.postDescription}>{post.description}</p>
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

      <button className={styles.fabButton} onClick={handleWritePost}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 20H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16.5 3.5C16.8978 3.10217 17.4374 2.87868 18 2.87868C18.2786 2.87868 18.5544 2.93355 18.8118 3.04015C19.0692 3.14676 19.303 3.30301 19.5 3.5C19.697 3.69698 19.8532 3.93083 19.9598 4.18821C20.0665 4.44559 20.1213 4.72142 20.1213 5C20.1213 5.27857 20.0665 5.55441 19.9598 5.81179C19.8532 6.06916 19.697 6.30301 19.5 6.5L7 19L3 20L4 16L16.5 3.5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}

export default BoardPage
