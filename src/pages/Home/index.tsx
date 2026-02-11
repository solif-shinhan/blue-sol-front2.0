import {useState, useRef, useEffect, useCallback, useMemo} from 'react'
import {useNavigate} from 'react-router-dom'
import styles1 from './Home-1.module.css'
import styles1c from './Home-1c.module.css'
import styles2 from './Home-2.module.css'
import styles3 from './Home-3.module.css'
import styles4 from './Home-4.module.css'
import bellIcon from '@/assets/images/bell.svg'
import imgSolif from '@/assets/images/2a624313de43c9c9da407df6b2818750ca4766d0.svg'
import imgFooterLogo from '@/assets/images/057453724e8f804d5306e38ceabfcf7513cbed10.png'
import {SolidCardModal} from './components/SolidCardModal'
import {QRCodeModal} from './components/QRCodeModal'
import {QUICK_MENU_ITEMS, NEWS_ITEMS} from './Home.constants'
import {getProfile, ProfileData} from '@/services/profileService'
import {logout} from '@/services/authService'
import {userApi, goalApi} from '@/api'
import {missionApi, type CategoryProgress} from '@/api/api-3'
import {SolidCardPreview} from '@/features/02-onboarding/components/SolidCardPreview-1'
import {Character, BackgroundColor, Interest, DARK_PATTERNS} from '@/features/02-onboarding/types/card-1'
import {mockInterests} from '@/features/02-onboarding/api/mock-card-1'
import {getIconByLabel} from '@assets/icons'
import {getYoutubeVideos, getYoutubeVideosByCategory} from '@/services/youtubeService'
import {YoutubeVideo} from '@/api/types-youtube'
import {decodeHtmlEntities} from '@/utils/htmlDecode'

const styles = {...styles1, ...styles1c, ...styles2, ...styles3, ...styles4}

// 프로필 interests(이름 배열)를 Interest 객체 배열로 변환
const CATEGORY_NAME_MAP: Record<string, string> = {
    CONNECT: '연결',
    GROW: '성장',
    IMPACT: '기여',
}

const getInterestsWithIcons = (interestNames: string[]): Interest[] => {
    return interestNames.map((name, idx) => {
        const found = mockInterests.find(i => i.name === name)
        if (found) return found
        // mockInterests에 없으면 labelToCategoryKey로 아이콘 조회
        const icon = getIconByLabel(name)
        return {id: `interest-${idx}`, name, icon}
    })
}

// 프로필 데이터를 카드 props로 변환
const buildCardProps = (profile: ProfileData) => {
    const character: Character | null = profile.characterImageUrl
        ? {id: profile.userCharacter, name: '캐릭터', imageUrl: profile.characterImageUrl}
        : null

    const backgroundColor: BackgroundColor | null = profile.backgroundImageUrl
        ? {
            id: profile.backgroundPattern,
            name: '배경',
            imageUrl: profile.backgroundImageUrl,
            theme: DARK_PATTERNS.has(profile.backgroundPattern) ? 'dark' as const : 'light' as const,
        }
        : null

    const interests = getInterestsWithIcons(profile.interests || [])

    return {character, backgroundColor, interests}
}

function HomePage() {
    const navigate = useNavigate()
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isCardModalOpen, setIsCardModalOpen] = useState(false)
    const [isQRModalOpen, setIsQRModalOpen] = useState(false)
    const [profile, setProfile] = useState<ProfileData | null>(null)
    const [region, setRegion] = useState('')
    const [school, setSchool] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [goalData, setGoalData] = useState({mainGoal: '', completedCount: 0, totalCount: 0})
    const [lectureItems, setLectureItems] = useState<YoutubeVideo[]>([])
    const [selectedCategory, setSelectedCategory] = useState('전체')
    const [claimableCategory, setClaimableCategory] = useState<CategoryProgress | null>(null)
    const [showMissionPopup, setShowMissionPopup] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const newsRef = useRef<HTMLDivElement>(null)
    const newsDragging = useRef(false)
    const newsStartX = useRef(0)

    // 페이지 진입 시 스크롤 top으로 리셋
    useEffect(() => {
        containerRef.current?.scrollTo(0, 0)
    }, [])

    // 데이터 로드
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true)
            try {
                // 프로필 + 유저 정보 + 목표 + YouTube 동영상 조회 (각각 실패해도 다른 요청에 영향 없도록)
                const [profileRes, userRes, goalFirstRes, youtubeVideos, missionRes] = await Promise.all([
                    getProfile().catch(() => null),
                    userApi.getMe().catch(() => null),
                    goalApi.getFirst().catch(() => null),
                    getYoutubeVideos().catch(() => []),
                    missionApi.getProgress().catch(() => null),
                ])
                if (profileRes && profileRes.success) {
                    setProfile(profileRes.data)
                }
                // region/school: API 우선, localStorage fallback
                if (userRes && userRes.success && userRes.data) {
                    setRegion(userRes.data.region || '')
                    setSchool(userRes.data.schoolName || '')
                } else {
                    const rd = localStorage.getItem('registerData')
                    if (rd) {
                        const parsed = JSON.parse(rd)
                        setRegion(parsed.region || '')
                        setSchool(parsed.schoolName || '')
                    }
                }

                // 목표 API 연동
                if (goalFirstRes && goalFirstRes.success && goalFirstRes.data) {
                    const g = goalFirstRes.data
                    setGoalData({
                        mainGoal: g.firstGoal || '',
                        completedCount: g.currentIndex ?? 0,
                        totalCount: g.totalCount ?? 0,
                    })
                }

                // 미션 진행도 확인 - 클레임 가능한 솔방울이 있으면 팝업
                if (missionRes && missionRes.success && missionRes.data) {
                    const claimable = missionRes.data.categoryProgress.find(
                        (c: CategoryProgress) => c.canClaimPinecone && !c.isPineconeEarned
                    )
                    if (claimable) {
                        setClaimableCategory(claimable)
                        setShowMissionPopup(true)
                    }
                }

                // YouTube 동영상 설정 - API로만
                setLectureItems(youtubeVideos)

            } catch (error) {
                console.error('데이터 로드 실패:', error)
            } finally {
                setIsLoading(false)
            }
        }

        loadData()
    }, [])

    const handleTabClick = (tab: string) => {
        if (tab === '교류') navigate('/exchange')
        else if (tab === '성장') navigate('/growth')
    }

    const handleCardClick = () => setIsCardModalOpen(true)
    const handleCardModalClose = () => {
        setIsCardModalOpen(false)
        // SOLID 카드 모달 닫은 후 미션 달성 여부 재확인
        missionApi.getProgress().then(res => {
            if (res?.success && res.data) {
                const claimable = res.data.categoryProgress.find(
                    (c: CategoryProgress) => c.canClaimPinecone && !c.isPineconeEarned
                )
                if (claimable) {
                    setClaimableCategory(claimable)
                    setShowMissionPopup(true)
                }
            }
        }).catch(() => {})
    }
    const handleShare = () => setIsQRModalOpen(true)
    const handleQRModalClose = () => setIsQRModalOpen(false)
    const handleEdit = () => navigate('/onboarding')
    const handleNetwork = () => navigate('/exchange/network')
    const handleBellClick = () => navigate('/notifications')
    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    const cardProps = useMemo(() => {
        if (!profile) return null
        return buildCardProps(profile)
    }, [profile])

    const handleQuickMenuClick = (label: string) => {
        switch (label) {
            case '쪽지함':
                navigate('/notifications?tab=activity&sub=message');
                break
            case '게시판':
                navigate('/exchange/board');
                break
            case '교류망':
                navigate('/exchange/network');
                break
            case '자치회':
                navigate('/exchange/council/list');
                break
            case '멘토링':
                navigate('/exchange/mentoring');
                break
        }
    }

    const handleCategoryClick = async (category: string) => {
        setSelectedCategory(category)

        if (category === '전체') {
            // 전체 동영상 조회
            const videos = await getYoutubeVideos()
            setLectureItems(videos)
        } else {
            // 카테고리별 동영상 조회
            const videos = await getYoutubeVideosByCategory(category)
            setLectureItems(videos)
        }
    }

    const handleVideoClick = (videoUrl: string) => {
        window.open(videoUrl, '_blank')
    }

    const goToSlide = useCallback((index: number) => {
        let targetIndex = index
        if (index < 0) targetIndex = NEWS_ITEMS.length - 1
        else if (index >= NEWS_ITEMS.length) targetIndex = 0
        setCurrentSlide(targetIndex)
    }, [])

    const handleNewsDragStart = (e: React.MouseEvent | React.TouchEvent) => {
        newsDragging.current = true
        newsStartX.current = 'touches' in e ? e.touches[0].pageX : e.pageX
    }

    const handleNewsDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
        if (!newsDragging.current) return
        newsDragging.current = false
        const endX = 'changedTouches' in e ? e.changedTouches[0].pageX : e.pageX
        const diff = newsStartX.current - endX
        if (Math.abs(diff) > 50) goToSlide(currentSlide + (diff > 0 ? 1 : -1))
    }

    return (
        <div className={styles.container} ref={containerRef}>
            <nav className={styles.tabNav}>
                <div className={styles.tabs}>
                    <button className={`${styles.tab} ${styles.tabActive}`}>홈</button>
                    <button className={styles.tab} onClick={() => handleTabClick('교류')}>교류</button>
                    <button className={styles.tab} onClick={() => handleTabClick('성장')}>성장</button>
                </div>
                <div className={styles.tabNavRight}>
                    <button className={styles.iconButton} onClick={handleBellClick}>
                        <img src={bellIcon} alt="알림" width={28} height={28}/>
                    </button>
                    <div
                        className={styles.profileCircle}
                        onClick={() => navigate('/mypage')}
                        style={profile?.backgroundImageUrl ? {
                            backgroundImage: `url(${profile.backgroundImageUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        } : undefined}
                    >
                        {profile?.characterImageUrl && (
                            <img src={profile.characterImageUrl} alt="프로필"
                                 style={{width: '24px', height: '24px', objectFit: 'contain'}}/>
                        )}
                    </div>
                </div>
            </nav>

            <div className={styles.content}>
                {/* 목표 히어로 섹션 - tabNav 아래 15px */}
                <section className={styles.goalHero} onClick={() => navigate('/goals')}>
                    <div className={styles.goalHeroLeft}>
                        <img src={imgSolif} alt="SOLIF, 너의 꿈을 응원해" className={styles.goalHeroLogo}/>
                        <h2 className={styles.goalHeroTitle}>{goalData.mainGoal || '나의 목표를 설정해보세요'}</h2>
                    </div>
                    <div className={styles.goalHeroRight}>
                        <div className={styles.goalBadge}>나의 목표</div>
                        <div className={styles.goalRing}>
                            <svg viewBox="0 0 70 70" width="70" height="70">
                                <circle cx="35" cy="35" r="32.5" fill="none" stroke="#E6EFFF" strokeWidth="5"/>
                                <circle cx="35" cy="35" r="32.5" fill="none" stroke="#074ED8" strokeWidth="5"
                                        strokeLinecap="round"
                                        strokeDasharray={2 * Math.PI * 32.5}
                                        strokeDashoffset={2 * Math.PI * 32.5 * (1 - (goalData.totalCount > 0 ? goalData.completedCount / goalData.totalCount : 0))}
                                        style={{transform: 'rotate(-90deg)', transformOrigin: '50% 50%'}}/>
                            </svg>
                            <span className={styles.goalRingText}>
                <span className={styles.goalRingCurrent}>{goalData.completedCount}</span>
                <span className={styles.goalRingTotal}>/{goalData.totalCount}</span>
              </span>
                        </div>
                    </div>
                </section>

                <div style={{display: 'flex', justifyContent: 'center', paddingTop: '20px'}}>
                    {!isLoading && profile && (
                        <SolidCardPreview
                            character={cardProps?.character || null}
                            backgroundColor={cardProps?.backgroundColor || null}
                            userName={profile.userName || '사용자'}
                            userRole={profile.solidGoalName || ''}
                            interests={cardProps?.interests || []}
                            goals={profile.mainGoals || []}
                            region={region}
                            school={school}
                            sinceYear="2026"
                            size="medium"
                            onClick={handleCardClick}
                        />
                    )}
                </div>

                <div className={styles.bottomSection}>
                    <div className={styles.gradientOverlay}/>
                    <div className={styles.bottomContent}>
                        <div className={styles.quickMenu}>
                            {QUICK_MENU_ITEMS.map(item => (
                                <div key={item.id} className={styles.quickMenuItem}
                                     onClick={() => handleQuickMenuClick(item.label)}>
                                    <div className={styles.quickMenuIcon}>
                                        {item.icon && <img src={item.icon} alt={item.label}/>}
                                    </div>
                                    <span>{item.label}</span>
                                </div>
                            ))}
                        </div>


                        <section className={styles.newsSection}>
                            <h2 className={styles.sectionTitle}>새로운 소식</h2>
                            <div className={styles.newsSlider} ref={newsRef}
                                 onMouseDown={handleNewsDragStart} onMouseUp={handleNewsDragEnd}
                                 onMouseLeave={handleNewsDragEnd} onTouchStart={handleNewsDragStart}
                                 onTouchEnd={handleNewsDragEnd}>
                                <div className={styles.newsTrack}
                                     style={{transform: `translateX(calc(50% - 180px - ${currentSlide * 380}px))`}}>
                                    {NEWS_ITEMS.map((item, index) => (
                                        <div key={item.id} className={styles.newsCard}
                                             style={{
                                                 opacity: index === currentSlide ? 1 : 0.5,
                                                 transform: index === currentSlide ? 'scale(1)' : 'scale(0.95)',
                                                 transition: 'all 0.3s ease',
                                             }}
                                             onClick={() => {
                                                 if (index !== currentSlide) goToSlide(index)
                                             }}>
                                            <div className={styles.newsCardContent}>
                                                <h3>{item.title}</h3>
                                                <p>{item.subtitle}</p>
                                            </div>
                                            <div className={styles.newsCardIcon}>
                                                {item.icon && <img src={item.icon} alt="" style={{
                                                    width: item.iconWidth,
                                                    height: item.iconHeight
                                                }}/>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.sliderDots}>
                                {NEWS_ITEMS.map((_, i) => (
                                    <span key={i}
                                          className={`${styles.dot} ${currentSlide === i ? styles.dotActive : ''}`}
                                          onClick={() => goToSlide(i)}></span>
                                ))}
                            </div>
                        </section>

                        <section className={styles.growthSection}>
                            <div className={styles.sectionHeader}>
                                <h2 className={styles.sectionTitle}>푸른 SOL 역량강화</h2>
                                <button className={styles.moreButton} onClick={() => navigate('/growth/strength')}>더보기</button>
                            </div>
                            <div className={styles.categoryTabs}>
                                <button
                                    className={`${styles.categoryTab} ${selectedCategory === '전체' ? styles.categoryTabActive : ''}`}
                                    onClick={() => handleCategoryClick('전체')}
                                >
                                    전체
                                </button>
                                <button
                                    className={`${styles.categoryTab} ${selectedCategory === '인성' ? styles.categoryTabActive : ''}`}
                                    onClick={() => handleCategoryClick('인성')}
                                >
                                    인성
                                </button>
                                <button
                                    className={`${styles.categoryTab} ${selectedCategory === '사회' ? styles.categoryTabActive : ''}`}
                                    onClick={() => handleCategoryClick('사회')}
                                >
                                    사회
                                </button>
                                <button
                                    className={`${styles.categoryTab} ${selectedCategory === '과학' ? styles.categoryTabActive : ''}`}
                                    onClick={() => handleCategoryClick('과학')}
                                >
                                    과학
                                </button>
                                <button
                                    className={`${styles.categoryTab} ${selectedCategory === '창업' ? styles.categoryTabActive : ''}`}
                                    onClick={() => handleCategoryClick('창업')}
                                >
                                    창업
                                </button>
                                <button
                                    className={`${styles.categoryTab} ${selectedCategory === '취업' ? styles.categoryTabActive : ''}`}
                                    onClick={() => handleCategoryClick('취업')}
                                >
                                    취업
                                </button>
                            </div>
                            <div className={styles.lectureGrid}>
                                {lectureItems.length > 0 ? (
                                    lectureItems.map(video => (
                                        <div
                                            key={video.videoId}
                                            className={styles.lectureCard}
                                            onClick={() => handleVideoClick(video.videoUrl)}
                                            style={{cursor: 'pointer'}}
                                        >
                                            <div className={styles.lectureBg}>
                                                <img src={video.thumbnailUrl} alt={video.category}/>
                                                <div className={styles.lectureBgOverlay}/>
                                            </div>
                                            <div className={styles.lectureBottom}>
                                                <div className={styles.lectureTextGroup}>
                                                    <span className={styles.lectureCategory}>{video.category}</span>
                                                    <div className={styles.lectureTitle}>
                                                        {decodeHtmlEntities(video.title)}
                                                    </div>
                                                </div>
                                                <span className={styles.lectureSpeaker}>
                                                    {decodeHtmlEntities(video.speaker)}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{padding: '40px', textAlign: 'center', color: '#666', gridColumn: '1 / -1'}}>
                                        동영상을 불러오는 중입니다...
                                    </div>
                                )}
                            </div>
                        </section>

                        <footer className={styles.footer}>
                            <button className={styles.logoutButton} onClick={handleLogout}>로그아웃</button>
                            <div className={styles.footerLogo}>
                                <img src={imgFooterLogo} alt="신한장학재단"/>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>

            <SolidCardModal
                isOpen={isCardModalOpen}
                onClose={handleCardModalClose}
                onShare={handleShare}
                onEdit={handleEdit}
                onNetwork={handleNetwork}
                character={cardProps?.character || null}
                backgroundColor={cardProps?.backgroundColor || null}
                userName={profile?.userName || '사용자'}
                userRole={profile?.solidGoalName || ''}
                interests={cardProps?.interests || []}
                goals={profile?.mainGoals || []}
                region={region}
                school={school}
                sinceYear="2026"
            />
            <QRCodeModal
                isOpen={isQRModalOpen}
                onClose={handleQRModalClose}
                userId={localStorage.getItem('userId') || ''}
                userName={profile?.userName || '사용자'}
                userRole={profile?.solidGoalName || ''}
                character={cardProps?.character || null}
                backgroundColor={cardProps?.backgroundColor || null}
                school={school}
                sinceYear="2026"
            />

            {showMissionPopup && claimableCategory && (
                <div className={styles.missionPopupOverlay} onClick={() => setShowMissionPopup(false)}>
                    <div className={styles.missionBanner} style={{ marginTop: 0 }} onClick={e => e.stopPropagation()}>
                        <div className={styles.missionBannerText}>
                            <p style={{ margin: 0 }}>미션 완료!</p>
                            <p style={{ margin: 0 }}>
                                {CATEGORY_NAME_MAP[claimableCategory.category] || claimableCategory.categoryName} 솔방울 받으러 가기
                            </p>
                        </div>
                        <button className={styles.missionBannerBtn} onClick={() => {
                            setShowMissionPopup(false)
                            navigate('/growth')
                        }}>
                            <span className={styles.missionBannerBtnText}>확인하기</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default HomePage
