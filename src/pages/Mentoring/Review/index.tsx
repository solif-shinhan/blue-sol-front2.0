import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './MentoringReview.module.css'

import backArrowIcon from '@/assets/images/exchange-mentoring/back-arrow.svg'
import searchIcon from '@/assets/images/exchange-mentoring/search.svg'

const CATEGORY_CARDS = [
    { id: 'activity', title: '따뜻한\n활동 후기', icon: '📝' },
    { id: 'counseling', title: '토닥토닥\n고민상담', icon: '💬' },
    { id: 'news', title: '장학재단\n소식', icon: '📢' },
]

const FILTER_TABS = ['자치회 활동 후기', '멘토링 후기']

const REVIEWS = [
    {
        id: 1,
        author: '강**',
        mentorName: '신한철 멘토님',
        content: '신한철 멘토님께 대학 입시 컨설팅을 받았습니다. 제가 생각하지 못했던 지점을 바로 이야기 해주셔서...',
        image: '',
    },
    {
        id: 2,
        author: '박**',
        mentorName: '김희숙 멘토님',
        content: '김희숙 멘토님께 대학 입시 컨설팅을 받았습니다. 제가 생각하지 못했던 지점을 바로 이야기 해주셔서...',
        image: '',
    },
    {
        id: 3,
        author: '김**',
        mentorName: '최민선 멘토님',
        content: '최민선 멘토님께 대학 입시 컨설팅을 받았습니다. 제가 생각하지 못했던 지점을 바로 이야기 해주셔서...',
        image: '',
    },
    {
        id: 4,
        author: '김**',
        mentorName: '박민지 멘토님',
        content: '바로 이야기 해주셔서...',
        image: '',
    },
]

function MentoringReviewPage() {
    const navigate = useNavigate()
    const [activeFilter, setActiveFilter] = useState('멘토링 후기')

    const handleBack = () => {
        navigate(-1)
    }

    const handleWriteReview = () => {
        console.log('후기 작성하기')
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button className={styles.backButton} onClick={handleBack}>
                    <img src={backArrowIcon} alt="뒤로가기" />
                </button>
                <h1 className={styles.headerTitle}>게시판</h1>
                <button className={styles.searchButton}>
                    <img src={searchIcon} alt="검색" />
                </button>
            </header>

            <div className={styles.content}>
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

            <div className={styles.writeButtonWrapper}>
                <button className={styles.writeButton} onClick={handleWriteReview}>
                    멘토링 후기 작성하기
                </button>
            </div>
        </div>
    )
}

export default MentoringReviewPage
