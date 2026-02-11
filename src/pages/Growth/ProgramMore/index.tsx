import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {getRequiredPrograms, getOptionalPrograms} from '@/services/scholarshipService'
import {ScholarshipProgram} from '@/api/types-scholarship'
import styles from './ProgramMore.module.css'

const ProgramMore = () => {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<'required' | 'optional'>('optional')
    const [programs, setPrograms] = useState<ScholarshipProgram[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadPrograms(activeTab)
    }, [activeTab])

    const loadPrograms = async (tab: 'required' | 'optional') => {
        setLoading(true)
        const data = tab === 'required'
            ? await getRequiredPrograms()
            : await getOptionalPrograms()
        setPrograms(data)
        setLoading(false)
    }

    const handleTabChange = (tab: 'required' | 'optional') => {
        setActiveTab(tab)
    }

    // 날짜 포맷팅 함수 (ISO 8601 -> YYYY.MM.DD)
    const formatDate = (isoDate: string): string => {
        const date = new Date(isoDate)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}.${month}.${day}`
    }

    // 내용 요약
    const truncateContent = (content: string, maxLength: number = 80): string => {
        if (content.length <= maxLength) return content
        return content.substring(0, maxLength) + '...'
    }

    return (
        <div className={styles.container}>
            {/* 커스텀 헤더 */}
            <div className={styles.header}>
                <button className={styles.backButton} onClick={() => navigate(-1)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         strokeWidth="2">
                        <path d="M15 18l-6-6 6-6"/>
                    </svg>
                </button>
                <h1 className={styles.headerTitle}>장학 프로그램</h1>
                <button className={styles.searchButton}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         strokeWidth="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="M21 21l-4.35-4.35"/>
                    </svg>
                </button>
            </div>

            {/* 탭 버튼 */}
            <div className={styles.tabContainer}>
                <button
                    className={`${styles.tabButton} ${activeTab === 'required' ? styles.tabButtonActive : ''}`}
                    onClick={() => handleTabChange('required')}
                >
                    필수 프로그램
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === 'optional' ? styles.tabButtonActive : ''}`}
                    onClick={() => handleTabChange('optional')}
                >
                    선택 프로그램
                </button>
            </div>

            <div className={styles.content}>
                {loading ? (
                    <div className={styles.loading}>
                        장학 프로그램을 불러오는 중입니다...
                    </div>
                ) : programs.length > 0 ? (
                    <div className={styles.programList}>
                        {programs.map((program) => (
                            <div key={program.postId} className={styles.programItem}>
                                <div className={styles.programContent}>
                                    <div className={styles.programMeta}>
                                        <span className={styles.programOrg}>신한장학재단</span>
                                        <div className={styles.programDivider}/>
                                        <div className={styles.programStats}>
                      <span className={styles.programStat}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path
                              d="M8 3C5.5 3 3.5 5 3 8c.5 3 2.5 5 5 5s4.5-2 5-5c-.5-3-2.5-5-5-5zm0 8c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z"/>
                          <circle cx="8" cy="8" r="1.5"/>
                        </svg>
                          {program.viewCount}
                      </span>
                                            <span className={styles.programStat}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M2 2h12v8H8l-2 2-2-2H2V2z"/>
                        </svg>
                                                {program.commentCount}
                      </span>
                                        </div>
                                        <div className={styles.programDivider}/>
                                        <span className={styles.programDate}>{formatDate(program.createdAt)}</span>
                                    </div>
                                    <div className={styles.programTexts}>
                                        <h3 className={styles.programTitle}>{program.title}</h3>
                                        <p className={styles.programDesc}>{truncateContent(program.content)}</p>
                                    </div>
                                </div>
                                {program.thumbnailUrl && (
                                    <div className={styles.programThumbnail}>
                                        <img src={program.thumbnailUrl} alt={program.title}/>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.empty}>
                        등록된 장학 프로그램이 없습니다.
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProgramMore
