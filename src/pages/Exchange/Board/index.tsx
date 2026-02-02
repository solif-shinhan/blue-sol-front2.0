import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Board.module.css'

// 카테고리 카드 이미지
import warmReviewImg from '@/assets/images/exchage-board/f768656256cbf251b006a6560d7a884aecf6a277.png'
import counselingImg from '@/assets/images/exchage-board/80112dee4520b196fff05166d3abf58e7377c037.png'
import foundationNewsImg from '@/assets/images/exchage-board/6fecb3f4903a46cbe10992ced7057fb3c483ef00.png'

// 게시글 썸네일 이미지
import post1Img from '@/assets/images/exchage-board/27342ac6292fb7d2b87647841f5fab093bda09f6.png'
import post2Img from '@/assets/images/exchage-board/cab8b7808d1d97f850dd3426c8d0c797a6635086.png'
import post3Img from '@/assets/images/exchage-board/d4f7a21c18679b3a11ccac2197bafbc5ba2681dc.png'
import post4Img from '@/assets/images/exchage-board/5c7309d017f9e322b8fc44af098ea915ecfa439b.png'

// 필터 탭 타입
type FilterTab = '자치회 활동 후기' | '멘토링 후기'

// 카테고리 카드 데이터
interface CategoryCard {
  id: string
  title: string
  subtitle?: string
  image: string
}

// 게시글 데이터
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

// 카테고리 카드 데이터
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

// 샘플 게시글 데이터
const POST_ITEMS: PostItem[] = [
  {
    id: 1,
    category: '경북 자치회',
    title: '공모전 준비 후기',
    description: '공모전을 준비하면서 아이디어를 구체화하는 과정이 가장 어려웠습니다. 처음에는...',
    viewCount: 25,
    commentCount: 8,
    date: '2026.02.19',
    image: post1Img,
  },
  {
    id: 2,
    category: '인천 자치회',
    title: '봉사활동 다녀온 후',
    description: '자치회 구성원들과 함께 봉사활동에 참여했습니다. 단순히 활동을 수행하는 것...',
    viewCount: 25,
    commentCount: 8,
    date: '2026.01.28',
    image: post2Img,
  },
  {
    id: 3,
    category: '서울 자치회',
    title: '친구들과 함께하는 스터디',
    description: '자치회 내 스터디를 자율적으로 운영해보았습니다. 각자 목표가 달라 일정을...',
    viewCount: 25,
    commentCount: 8,
    date: '2025.12.28',
    image: post3Img,
  },
  {
    id: 4,
    category: '제주 자치회',
    title: '우리들의 첫 만남',
    description: '제주 지역 자치회 구성원들이 처음으로 만나는 날이었습니다. 처음에는...',
    viewCount: 25,
    commentCount: 8,
    date: '2025.12.26',
    image: post4Img,
  },
]

function BoardPage() {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState<FilterTab>('자치회 활동 후기')

  const handleBack = () => {
    navigate(-1)
  }

  const handleSearch = () => {
    // TODO: 검색 기능 구현
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
      {/* 상단 Safe Area */}
      <div className={styles.safeArea} />

      {/* 헤더 */}
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

      {/* 카테고리 카드 섹션 */}
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

      {/* 필터 탭 */}
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

      {/* 콘텐츠 영역 */}
      <div className={styles.contentWrapper}>
        {/* 게시글 리스트 */}
        <div className={styles.postList}>
          {POST_ITEMS.map((post) => (
            <div
              key={post.id}
              className={styles.postCard}
              onClick={() => handlePostClick(post.id)}
            >
              <div className={styles.postContent}>
                {/* 메타 정보 */}
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

                {/* 제목 */}
                <h3 className={styles.postTitle}>{post.title}</h3>

                {/* 설명 */}
                <p className={styles.postDescription}>{post.description}</p>
              </div>

              {/* 썸네일 이미지 */}
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
      </div>

      {/* 글쓰기 FAB 버튼 */}
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
