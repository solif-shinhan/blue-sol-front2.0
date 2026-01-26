import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './MentoringReview.module.css'

// 이미지 assets
import backArrowIcon from '@/assets/images/exchange-mentoring/back-arrow.svg'
import searchIcon from '@/assets/images/exchange-mentoring/search.svg'

// 카테고리 옵션
const CATEGORY_CARDS = [
    { id: 'activity', title: '따뜻한\n활동 후기', icon: '📝' },
    { id: 'counseling', title: '토닥토닥\n고민상담', icon: '💬' },
    { id: 'news', title: '장학재단\n소식', icon: '📢' },
]

// 필터 탭
const FILTER_TABS = ['자치회 활동 후기', '멘토링 후기']

// 리뷰 데이터
const REVIEWS = [
    {
        id: 1,
        author: '강**',
        mentorName: '신한철 멘토님',
        content: '신한철 멘토님께 대학 입시 컨설팅을 받았습니다. 제가 생각하지 못했던 지점을 바로 이야기 해주셔서...',
        image: 'https://www.figma.com/api/mcp/asset/24117198-6767-41f5-b3db-33f568bc2f66',
    },
    {
        id: 2,
        author: '박**',
        mentorName: '김희숙 멘토님',
        content: '김희숙 멘토님께 대학 입시 컨설팅을 받았습니다. 제가 생각하지 못했던 지점을 바로 이야기 해주셔서...',
        image: 'https://www.figma.com/api/mcp/asset/e2e3c557-5201-4881-a68a-cf34c9f3be16',
    },
    {
        id: 3,
        author: '김**',
        mentorName: '최민선 멘토님',
        content: '최민선 멘토님께 대학 입시 컨설팅을 받았습니다. 제가 생각하지 못했던 지점을 바로 이야기 해주셔서...',
        image: 'https://www.figma.com/api/mcp/asset/a6305e4d-5fab-4a15-8b03-c79e00bcc2a7',
    },
    {
        id: 4,
        author: '김**',
        mentorName: '박민지 멘토님',
        content: '바로 이야기 해주셔서...',
        image: 'https://www.figma.com/api/mcp/asset/24117198-6767-41f5-b3db-33f568bc2f66',
    },
]

function MentoringReviewPage() {
    const navigate = useNavigate()
    const [activeFilter, setActiveFilter] = useState('멘토링 후기')

    const handleBack = () => {
        navigate(-1)
    }

    const handleWriteReview = () => {
        // 후기 작성 페이지로 이동 (추후 구현)
        console.log('후기 작성하기')
    }

    return (
        <div className={styles.container}>
            {/* 헤더 */}
            <header className={styles.header}>
                <button className={styles.backButton} onClick={handleBack}>
                    <img src={backArrowIcon} alt="뒤로가기" />
                </button>
                <h1 className={styles.headerTitle}>게시판</h1>
                <button className={styles.searchButton}>
                    <img src={searchIcon} alt="검색" />
                </button>
            </header>

            {/* 메인 콘텐츠 */}
            <div className={styles.content}>
                {/* 카테고리 카드 */}
                <div className={styles.categoryCards}>
                    {CATEGORY_CARDS.map((card) => (
                        <div key={card.id} className={styles.categoryCard}>
                            <div className={styles.categoryCardIcon}>{card.icon}</div>
                            <p className={styles.categoryCardText}>
                                {card.title.split('\n').map((line, i) => (
                                    <span key={i}>
                                        {line}
                                        {i === 0 && <br />}
                                    </span>
                                ))}
                            </p>
                        </div>
                    ))}
                </div>

                {/* 필터 탭 */}
                <div className={styles.filterTabs}>
                    {FILTER_TABS.map((tab) => (
                        <button
                            key={tab}
                            className={`${styles.filterTab} ${activeFilter === tab ? styles.filterTabActive : ''}`}
                            onClick={() => setActiveFilter(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* 리뷰 리스트 */}
                <div className={styles.reviewList}>
                    {REVIEWS.map((review) => (
                        <div key={review.id} className={styles.reviewCard}>
                            <div className={styles.reviewCardContent}>
                                <div className={styles.reviewAuthorRow}>
                                    <span className={styles.reviewAuthor}>{review.author}</span>
                                    <div className={styles.reviewDivider} />
                                    <span className={styles.reviewMentor}>{review.mentorName}</span>
                                </div>
                                <p className={styles.reviewText}>{review.content}</p>
                            </div>
                            <div className={styles.reviewCardImage}>
                                <img src={review.image} alt="" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 하단 후기 작성 버튼 */}
            <div className={styles.writeButtonWrapper}>
                <button className={styles.writeButton} onClick={handleWriteReview}>
                    멘토링 후기 작성하기
                </button>
            </div>
        </div>
    )
}

export default MentoringReviewPage
