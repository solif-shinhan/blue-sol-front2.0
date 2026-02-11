import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import styles3 from './Growth-3.module.css'
import {logout} from '@/services'
import {getYoutubeVideosByCategory} from '@/services/youtubeService'
import {YoutubeVideo} from '@/api/types-youtube'
import {decodeHtmlEntities} from '@/utils/htmlDecode'

import imgProgram1 from '@/assets/images/3ce87ab504c87594c1b2c5eba6b473640a497399.png'
import imgProgram2 from '@/assets/images/f9cdf2005f3ffddb0c78e2a16505ee85e7c83a4e.png'
import imgProgram3 from '@/assets/images/ad0824640eed8a29aab77ffe6cf64fcf6d1d3801.png'
import imgFooterLogo from '@/assets/images/057453724e8f804d5306e38ceabfcf7513cbed10.png'

// 역량강화 섹션
export const StrengthSection = () => {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('전체')
    const [videos, setVideos] = useState<YoutubeVideo[]>([])
    const categories = ['전체', '사회', '인성', '과학', '창업', '취업']

    // 초기 데이터 로드
    useEffect(() => {
        loadVideos('전체')
    }, [])

    // 카테고리별 비디오 로드
    const loadVideos = async (category: string) => {
        const data = await getYoutubeVideosByCategory(category)
        setVideos(data)
    }

    const handleCategoryClick = (category: string) => {
        setActiveTab(category)
        loadVideos(category)
    }

    const handleVideoClick = (videoUrl: string) => {
        window.open(videoUrl, '_blank')
    }

    return (
        <div className={styles3.strengthSection}>
            <div className={styles3.strengthHeader}>
                <div className={styles3.strengthTitleRow}>
                    <span className={styles3.strengthTitle}>푸른 SOL 역량강화</span>
                    <button className={styles3.moreButton} onClick={() => navigate('/growth/strength')}>더보기</button>
                </div>
                <div className={styles3.categoryTabs}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`${styles3.categoryTab} ${activeTab === cat ? styles3.categoryTabActive : ''}`}
                            onClick={() => handleCategoryClick(cat)}
                        >
                            <span>{cat}</span>
                        </button>
                    ))}
                </div>
            </div>
            <div className={styles3.strengthGrid}>
                {videos.length > 0 ? (
                    videos.slice(0, 2).map(video => (
                        <div
                            key={video.videoId}
                            className={styles3.strengthCard}
                            onClick={() => handleVideoClick(video.videoUrl)}
                            style={{cursor: 'pointer'}}
                        >
                            <div className={styles3.strengthCardBg}>
                                <img src={video.thumbnailUrl} alt={video.category}/>
                            </div>
                            <div className={styles3.strengthCardOverlay}/>
                            <div className={styles3.strengthCardContent}>
                                <div className={styles3.strengthCardInfo}>
                                    <div className={styles3.strengthCardTexts}>
                                        <span className={styles3.strengthCardCategory}>{video.category}</span>
                                        <div className={styles3.strengthCardTitle}>
                                            {decodeHtmlEntities(video.title)}
                                        </div>
                                    </div>
                                    <div className={styles3.strengthCardAuthor}>
                                        <span>{decodeHtmlEntities(video.speaker)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{padding: '40px', textAlign: 'center', color: '#666', gridColumn: '1 / -1'}}>
                        동영상을 불러오는 중입니다...
                    </div>
                )}
            </div>
        </div>
    )
}

// 장학 프로그램 섹션
export const ProgramSection = () => {
    const programs = [
        {
            org: '신한장학재단',
            likes: 24,
            comments: 8,
            date: '2026.02.19',
            title: '2025.9.11 임직원 직무 멘토링',
            desc: '신한금융그룹 임직원분들과 함께 HR, 브랜드, 사회공헌, 투자 직무 멘토링을 진행하...',
            image: imgProgram1
        },
        {
            org: '신한장학재단',
            likes: 24,
            comments: 8,
            date: '2026.02.19',
            title: '2025년 신한장학캠프 진행',
            desc: '신한장학재단에서는 2025년 7월 11일 장학캠프를 개최하였습니다.',
            image: imgProgram2
        },
        {
            org: '신한장학재단',
            likes: 24,
            comments: 8,
            date: '2026.02.19',
            title: "신한장학재단 '2025년 자립준...",
            desc: "지난 3월 21일, 서울 명동에 위치한 신한 익스페이스에서 '자립준비청년 장학지원사...",
            image: imgProgram3
        }
    ]

    return (
        <div className={styles3.programSection}>
            <div className={styles3.programHeader}>
                <span className={styles3.programTitle}>장학 프로그램</span>
                <button className={styles3.moreButton}>더보기</button>
            </div>
            <div className={styles3.programList}>
                {programs.map((program, index) => (
                    <div key={index} className={styles3.programItem}>
                        <div className={styles3.programContent}>
                            <div className={styles3.programMeta}>
                                <span className={styles3.programOrg}>{program.org}</span>
                                <div className={styles3.programDivider}/>
                                <div className={styles3.programStats}>
                  <span className={styles3.programStat}>
                    <img src="/eyes.svg" alt="" className={styles3.programStatIcon}/> {program.likes}
                  </span>
                                    <span className={styles3.programStat}>
                    <img src="/talk.svg" alt="" className={styles3.programStatIcon}/> {program.comments}
                  </span>
                                </div>
                                <div className={styles3.programDivider}/>
                                <span className={styles3.programDate}>{program.date}</span>
                            </div>
                            <div className={styles3.programTexts}>
                                <span className={styles3.programItemTitle}>{program.title}</span>
                                <p className={styles3.programDesc}>{program.desc}</p>
                            </div>
                        </div>
                        <div className={styles3.programThumbnail}>
                            <img src={program.image} alt={program.title}/>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// 푸터
export const Footer = () => {
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    return (
        <div className={styles3.footer}>
            <button type="button" className={styles3.footerButton} onClick={handleLogout}>
                <span>로그아웃</span>
            </button>
            <button type="button" className={styles3.footerButton}>
                <img src={imgFooterLogo} alt="신한장학재단" className={styles3.footerLogo}/>
            </button>
        </div>
    )
}
