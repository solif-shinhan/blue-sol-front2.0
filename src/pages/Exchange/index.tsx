import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import styles1 from './Exchange-1.module.css'
import styles2 from './Exchange-2.module.css'
import styles3 from './Exchange-3.module.css'
import bellIcon from '@/assets/images/bell.svg'
import arrowRightBlue from '@/assets/images/arrow-right-blue.svg'
import mentoringIconImg from '@/assets/images/mentoring-icon.svg'
import { COUNCIL_ITEMS } from '../Home/Home.constants'
import { FRIENDS_SIMPLE } from './constants'
import { useCouncilStatus } from '@/hooks'

const flagImage = '/flag1.png'

const styles = { ...styles1, ...styles2, ...styles3 }

const BOARD_CATEGORIES = ['활동 후기', '학업 고민', '취업 고민', '공지']

const BOARD_POSTS = [
  {
    id: 1,
    category: '경북 자치회',
    title: '공모전 준비 후기',
    description: '공모전을 준비하면서 아이디어를 구체화하는 과정이 가장 어려웠습니다. 처음에는..',
    likes: 25,
    comments: 8,
    date: '2026.02.19',
    thumbnail: '/board-thumb-1.jpg',
  },
  {
    id: 2,
    category: '인천 자치회',
    title: '봉사활동 다녀온 후',
    description: '자치회 구성원들과 함께 봉사활동에 참여했습니다. 단순히 활동을 수행하는 것..',
    likes: 25,
    comments: 8,
    date: '2026.01.28',
    thumbnail: '/board-thumb-2.jpg',
  },
  {
    id: 3,
    category: '제주 자치회',
    title: '우리들의 첫 만남',
    description: '제주 지역 자치회 구성원들이 처음으로 모이는 자리였습니다. 서로 다른 배경을..',
    likes: 25,
    comments: 8,
    date: '2025.12.26',
    thumbnail: '/board-thumb-3.jpg',
  },
]

function ExchangePage() {
  const navigate = useNavigate()
  const { hasCouncil } = useCouncilStatus()
  const [councilSlide, setCouncilSlide] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('활동 후기')
  const [isFabMenuOpen, setIsFabMenuOpen] = useState(false)
  const councilRef = useRef<HTMLDivElement>(null)
  const councilDragging = useRef(false)
  const councilStartX = useRef(0)

  const handleTabClick = (tab: string) => {
    if (tab === '홈') {
      navigate('/home')
    } else if (tab === '성장') {
      navigate('/growth')
    }
  }

  const goToCouncilSlide = useCallback((index: number) => {
    let targetIndex = index
    if (index < 0) targetIndex = COUNCIL_ITEMS.length - 1
    else if (index >= COUNCIL_ITEMS.length) targetIndex = 0
    setCouncilSlide(targetIndex)
  }, [])

  const handleCouncilDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    councilDragging.current = true
    councilStartX.current = 'touches' in e ? e.touches[0].pageX : e.pageX
  }

  const handleCouncilDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!councilDragging.current) return
    councilDragging.current = false
    const endX = 'changedTouches' in e ? e.changedTouches[0].pageX : e.pageX
    const diff = councilStartX.current - endX
    if (Math.abs(diff) > 50) goToCouncilSlide(councilSlide + (diff > 0 ? 1 : -1))
  }

  return (
    <div className={styles.container}>
      <nav className={styles.tabNav}>
        <div className={styles.tabs}>
          <button className={styles.tab} onClick={() => handleTabClick('홈')}>홈</button>
          <button className={`${styles.tab} ${styles.tabActive}`}>교류</button>
          <button className={styles.tab} onClick={() => handleTabClick('성장')}>성장</button>
        </div>
        <div className={styles.tabNavRight}>
          <button className={styles.iconButton}>
            <img src={bellIcon} alt="알림" width={28} height={28} />
          </button>
          <div className={styles.profileCircle}></div>
        </div>
      </nav>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>나의 교류망</h2>
          <div className={styles.networkCard}>
            <div className={styles.networkHeader}>
              <p className={styles.networkSubtitle}>푸른 SOL에서 17명과 교류했어요</p>
            </div>
            <div className={styles.friendsList}>
              <div className={styles.addFriendButton} onClick={() => navigate('/exchange/network/add')}>
                <div className={styles.plusIconCircle}>
                  <span className={styles.plusIcon}>+</span>
                </div>
                <span className={styles.addFriendText}>추가하기</span>
              </div>
              {FRIENDS_SIMPLE.map((friend) => (
                <div key={friend.id} className={styles.friendItem}>
                  <div className={styles.friendAvatar}></div>
                  <span className={styles.friendName}>{friend.name}</span>
                </div>
              ))}
            </div>
            <button className={styles.viewNetworkButton} onClick={() => navigate('/exchange/network')}>
              <span>나의 교류망 보기</span>
              <img src={arrowRightBlue} alt="" className={styles.arrowIcon} />
            </button>
          </div>
        </section>

        <section className={styles.councilSection}>
          <div className={styles.councilHeader}>
            <h2 className={styles.sectionTitle}>자치회 활동</h2>
            <button className={styles.moreButton} onClick={() => navigate('/exchange/council/list')}>둘러보기</button>
          </div>
          {hasCouncil ? (
            <>
              <div className={styles.councilCarousel} ref={councilRef}
                onMouseDown={handleCouncilDragStart} onMouseUp={handleCouncilDragEnd}
                onMouseLeave={handleCouncilDragEnd} onTouchStart={handleCouncilDragStart}
                onTouchEnd={handleCouncilDragEnd}>
                <div className={styles.councilTrack}
                  style={{ transform: `translateX(calc(50% - 180px - ${councilSlide * 380}px))` }}>
                  {COUNCIL_ITEMS.map((item, index) => (
                    <div key={item.id}
                      className={`${styles.councilCard} ${item.type === 'budget' ? styles.councilCardBudget : styles.councilCardActivity}`}
                      style={{ opacity: index === councilSlide ? 1 : 0.5, transform: index === councilSlide ? 'scale(1)' : 'scale(0.95)', transition: 'all 0.3s ease', cursor: 'pointer' }}
                      onClick={() => {
                        if (index === councilSlide && item.type === 'budget') {
                          navigate('/exchange/council/activity')
                        } else {
                          goToCouncilSlide(index)
                        }
                      }}>
                      {item.type === 'budget' && (<>
                        <p className={styles.cardLabel}>{item.label}</p>
                        <div className={styles.cardAmount}>
                          <span className={styles.cardAmountValue}>{item.amount} </span>
                          <span className={styles.cardAmountSuffix}>{item.suffix}</span>
                        </div>
                        <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: `${item.progress}%` }}></div></div>
                        <div className={styles.cardIcon}></div>
                      </>)}
                      {item.type === 'activity' && (<>
                        <p className={styles.cardLabel}>{item.label}</p>
                        <p className={styles.cardTitle}>{item.title}</p>
                        <div className={styles.profileGroup}>
                          {item.profiles?.map((color, i) => (
                            <div key={i} className={`${styles.profileCircleSmall} ${color === 'blue' ? styles.profileBlue : color === 'lightBlue' ? styles.profileLightBlue : styles.profileGray}`}></div>
                          ))}
                        </div>
                      </>)}
                      {item.type === 'review' && (<>
                        <p className={styles.cardLabel}>{item.label}</p>
                        <p className={styles.cardTitle}>{item.title}</p>
                        <p className={styles.cardDescription}>{item.description}</p>
                        <div className={styles.cardIcon}></div>
                      </>)}
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.councilDots}>
                {COUNCIL_ITEMS.map((_, i) => (
                  <button key={i} className={`${styles.councilDot} ${councilSlide === i ? styles.councilDotActive : ''}`}
                    onClick={() => goToCouncilSlide(i)}></button>
                ))}
              </div>
            </>
          ) : (
            <div className={styles.councilRegisterCard} onClick={() => navigate('/exchange/council/register')}>
              <div className={styles.councilRegisterTextGroup}>
                <div className={styles.councilRegisterTitles}>
                  <p className={styles.councilRegisterSubtitle}>아직 자치회에 등록하지 않았어요</p>
                  <p className={styles.councilRegisterTitle}>나의 자치회 등록하기</p>
                </div>
                <p className={styles.councilRegisterDesc}>너와 내가 만드는 우리의 울타리</p>
              </div>
              <img src={flagImage} alt="" className={styles.councilRegisterImage} />
            </div>
          )}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>멘토링</h2>
          <div className={styles.mentoringCard} onClick={() => navigate('/exchange/mentoring')} style={{ cursor: 'pointer' }}>
            <div className={styles.mentoringContent}>
              <div className={styles.mentoringTextGroup}>
                <p className={styles.mentoringSubtitle}>경험과 지식의 보물창고</p>
                <p className={styles.mentoringTitle}>나의 멘토님을 찾아볼까요?</p>
              </div>
              <p className={styles.mentoringDescription}>나와 연결될 누군가를 찾아보세요</p>
            </div>
            <img src={mentoringIconImg} alt="" className={styles.mentoringIcon} />
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>게시판</h2>
            <button className={styles.moreButton} onClick={() => navigate('/exchange/board')}>더보기</button>
          </div>
          <div className={styles.categoryTabs}>
            {BOARD_CATEGORIES.map((category) => (
              <button
                key={category}
                className={`${styles.categoryTab} ${selectedCategory === category ? styles.categoryTabActive : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <div className={styles.boardList}>
            {BOARD_POSTS.map((post) => (
              <div key={post.id} className={styles.boardItem}>
                <div className={styles.boardItemContent}>
                  <div className={styles.boardMeta}>
                    <span className={styles.boardCategory}>{post.category}</span>
                    <span className={styles.boardSeparator} />
                    <div className={styles.boardStats}>
                      <span className={styles.boardStat}>
                        <img src="/eyes.svg" alt="" className={styles.statIcon} /> {post.likes}
                      </span>
                      <span className={styles.boardStat}>
                        <img src="/talk.svg" alt="" className={styles.statIcon} /> {post.comments}
                      </span>
                    </div>
                    <span className={styles.boardSeparator} />
                    <span className={styles.boardDate}>{post.date}</span>
                  </div>
                  <div className={styles.boardTextGroup}>
                    <h3 className={styles.boardTitle}>{post.title}</h3>
                    <p className={styles.boardDescription}>{post.description}</p>
                  </div>
                </div>
                <div className={styles.boardThumbnail}>
                  <img src={post.thumbnail} alt="" className={styles.boardThumbnailImg} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className={styles.footer}>
          <button className={styles.logoutButton}>로그아웃</button>
          <div className={styles.footerLogo}>
            <img src="/assets/057453724e8f804d5306e38ceabfcf7513cbed10.png" alt="신한장학재단" className={styles.footerLogoImg} />
          </div>
        </footer>
      </div>

      {isFabMenuOpen && (
        <div className={styles.fabOverlay} onClick={() => setIsFabMenuOpen(false)}>
          <div className={styles.fabMenu} onClick={(e) => e.stopPropagation()}>
            <button className={styles.fabMenuItem} onClick={() => navigate('/exchange/write/review')}>
              자치회 활동 후기 작성
            </button>
            <img src="/Vector 15.svg" alt="" className={styles.fabMenuDivider} />
            <button className={`${styles.fabMenuItem} ${styles.fabMenuItemCenter}`} onClick={() => navigate('/exchange/write')}>
              토닥토닥 고민 털어두기
            </button>
          </div>
        </div>
      )}

      <button
        className={`${styles.fab} ${isFabMenuOpen ? styles.fabActive : ''}`}
        onClick={() => setIsFabMenuOpen(!isFabMenuOpen)}
      >
        {isFabMenuOpen ? (
          <img src="/Vector 1.svg" alt="닫기" className={styles.fabCloseIcon} />
        ) : (
          <img src="/jam_write.svg" alt="글쓰기" className={styles.fabIcon} />
        )}
      </button>
    </div>
  )
}

export default ExchangePage
