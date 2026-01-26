import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Board.module.css'

// 게시판 필터 카테고리
const FILTER_TABS = ['활동 후기', '학업 고민', '취업 고민', '공지'] as const
type FilterTab = (typeof FILTER_TABS)[number]

// 게시글 카드 데이터
interface BoardCard {
  id: number
  category: string
  title: string
  viewCount: number
  commentCount: number
  date: string
  backgroundImage: string
}

// 샘플 데이터 (Figma 디자인 기준)
const BOARD_CARDS: BoardCard[] = [
  {
    id: 1,
    category: '경북 자치회',
    title: '우리들의 첫 만남',
    viewCount: 25,
    commentCount: 8,
    date: '2025.02.19',
    backgroundImage: 'https://www.figma.com/api/mcp/asset/36a5612d-ccc8-4b7f-87b0-e7249daf7e34',
  },
  {
    id: 2,
    category: '인천 자치회',
    title: '친구들과 함께하는 스터디',
    viewCount: 25,
    commentCount: 8,
    date: '2025.02.19',
    backgroundImage: 'https://www.figma.com/api/mcp/asset/1e72d5c1-6c96-44ba-b7d6-3ce976a2c69b',
  },
  {
    id: 3,
    category: '서울 자치회',
    title: '봉사활동 다녀온 후',
    viewCount: 25,
    commentCount: 8,
    date: '2025.02.19',
    backgroundImage: 'https://www.figma.com/api/mcp/asset/5c1155be-5cdc-4399-bca9-16cda4b7eb99',
  },
  {
    id: 4,
    category: '서울 자치회',
    title: '이번 활동에서 느낀 점',
    viewCount: 25,
    commentCount: 8,
    date: '2025.02.19',
    backgroundImage: 'https://www.figma.com/api/mcp/asset/260ebcc3-dbcd-4568-b4df-63a16be6acc0',
  },
  {
    id: 5,
    category: '서울 자치회',
    title: '팀원들과 함께한 스터디',
    viewCount: 25,
    commentCount: 8,
    date: '2025.02.19',
    backgroundImage: 'https://www.figma.com/api/mcp/asset/8498791e-5a63-4a74-97fe-5e75223c3790',
  },
]

function BoardPage() {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState<FilterTab>('활동 후기')

  const handleMore = () => {
    navigate('/exchange')
  }

  const handleCardClick = (cardId: number) => {
    navigate(`/exchange/board/${cardId}`)
  }

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        {/* 헤더 섹션 */}
        <div className={styles.headerSection}>
          <div className={styles.headerRow}>
            <span className={styles.headerTitle}>게시판</span>
            <button className={styles.moreButton} onClick={handleMore}>
              더보기
            </button>
          </div>

          {/* 필터 탭 */}
          <div className={styles.filterTabs}>
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                className={`${styles.filterTab} ${activeFilter === tab ? styles.active : ''}`}
                onClick={() => setActiveFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* 카드 리스트 */}
        <div className={styles.cardList}>
          {BOARD_CARDS.map((card) => (
            <div
              key={card.id}
              className={styles.card}
              onClick={() => handleCardClick(card.id)}
            >
              <img
                src={card.backgroundImage}
                alt=""
                className={styles.cardImage}
              />
              <div className={styles.cardGradient} />
              <div className={styles.cardContent}>
                <div className={styles.cardTextGroup}>
                  <span className={styles.cardCategory}>{card.category}</span>
                  <span className={styles.cardTitle}>{card.title}</span>
                </div>
                <div className={styles.cardStats}>
                  <div className={styles.statGroup}>
                    <div className={styles.statItem}>
                      <img src="/eyes.svg" alt="" className={styles.statIcon} />
                      <span className={styles.statText}>{card.viewCount}</span>
                    </div>
                    <div className={styles.statItem}>
                      <img src="/talk.svg" alt="" className={styles.statIcon} />
                      <span className={styles.statText}>{card.commentCount}</span>
                    </div>
                  </div>
                  <div className={styles.statDivider} />
                  <span className={styles.statDate}>{card.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BoardPage
