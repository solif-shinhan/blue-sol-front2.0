import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import styles3 from './Growth-3.module.css'
import {logout} from '@/services'
import {getYoutubeVideosByCategory} from '@/services/youtubeService'
import {getScholarshipPrograms} from '@/services/scholarshipService'
import {YoutubeVideo} from '@/api/types-youtube'
import {ScholarshipProgram} from '@/api/types-scholarship'
import {decodeHtmlEntities} from '@/utils/htmlDecode'

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
    const navigate = useNavigate()
    const [programs, setPrograms] = useState<ScholarshipProgram[]>([])
    const [loading, setLoading] = useState(true)

    // 초기 데이터 로드
    useEffect(() => {
        loadPrograms()
    }, [])

    // 장학 프로그램 목록 로드
    const loadPrograms = async () => {
        setLoading(true)
        const data = await getScholarshipPrograms()
        setPrograms(data)
        setLoading(false)
    }

    // 날짜 포맷팅 함수 (ISO 8601 -> YYYY.MM.DD)
    const formatDate = (isoDate: string): string => {
        const date = new Date(isoDate)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}.${month}.${day}`
    }

    // 내용 요약 (첫 50자까지만 표시)
    const truncateContent = (content: string, maxLength: number = 50): string => {
        if (content.length <= maxLength) return content
        return content.substring(0, maxLength) + '...'
    }

    return (
        <div className={styles3.programSection}>
            <div className={styles3.programHeader}>
                <span className={styles3.programTitle}>장학 프로그램</span>
                <button className={styles3.moreButton} onClick={() => navigate('/growth/program')}>더보기</button>
            </div>
            <div className={styles3.programList}>
                {loading ? (
                    <div style={{padding: '40px', textAlign: 'center', color: '#666'}}>
                        장학 프로그램을 불러오는 중입니다...
                    </div>
                ) : programs.length > 0 ? (
                    programs.slice(0, 3).map((program) => (
                        <div key={program.postId} className={styles3.programItem}>
                            <div className={styles3.programContent}>
                                <div className={styles3.programMeta}>
                                    <span className={styles3.programOrg}>신한장학재단</span>
                                    <div className={styles3.programDivider}/>
                                    <div className={styles3.programStats}>
                                        <span className={styles3.programStat}>
                                            <img src="/eyes.svg" alt=""
                                                 className={styles3.programStatIcon}/> {program.viewCount}
                                        </span>
                                        <span className={styles3.programStat}>
                                            <img src="/talk.svg" alt=""
                                                 className={styles3.programStatIcon}/> {program.commentCount}
                                        </span>
                                    </div>
                                    <div className={styles3.programDivider}/>
                                    <span className={styles3.programDate}>{formatDate(program.createdAt)}</span>
                                </div>
                                <div className={styles3.programTexts}>
                                    <span className={styles3.programItemTitle}>{program.title}</span>
                                    <p className={styles3.programDesc}>{truncateContent(program.content)}</p>
                                </div>
                            </div>
                            {program.thumbnailUrl && (
                                <div className={styles3.programThumbnail}>
                                    <img src={program.thumbnailUrl} alt={program.title}/>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div style={{padding: '40px', textAlign: 'center', color: '#666'}}>
                        등록된 장학 프로그램이 없습니다.
                    </div>
                )}
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
