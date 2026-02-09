import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './ApplicationHistory.module.css'
import { mentoringApi } from '@/api'
import type {
  MentoringRequestSummary,
  MentoringRequestDetail,
  MentoringCardSummary,
  MentoringCardDetail,
} from '@/api'

import backArrowIcon from '@/assets/images/exchange-mentoring/back-arrow.svg'

type MainTab = 'sent' | 'received'
type SubTab = 'mentoring' | 'postcard'

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return '오늘'
  if (diffDays === 1) return '1일 전'
  if (diffDays < 30) return `${diffDays}일 전`
  const diffMonths = Math.floor(diffDays / 30)
  return `${diffMonths}개월 전`
}

function ApplicationHistoryPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<MainTab>('sent')
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('mentoring')
  const [isLoading, setIsLoading] = useState(true)

  // 멘토링 신청 데이터
  const [sentRequests, setSentRequests] = useState<MentoringRequestSummary[]>([])
  const [receivedRequests, setReceivedRequests] = useState<MentoringRequestSummary[]>([])

  // 엽서 데이터
  const [sentCards, setSentCards] = useState<MentoringCardSummary[]>([])

  // 상세 보기
  const [selectedRequestDetail, setSelectedRequestDetail] = useState<MentoringRequestDetail | null>(null)
  const [selectedCardDetail, setSelectedCardDetail] = useState<MentoringCardDetail | null>(null)
  const [isDetailView, setIsDetailView] = useState(false)

  useEffect(() => {
    fetchData()
  }, [activeTab, activeSubTab])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      if (activeSubTab === 'mentoring') {
        if (activeTab === 'sent') {
          const res = await mentoringApi.getSentRequests()
          if (res.success && res.data) setSentRequests(res.data.content ?? [])
        } else {
          const res = await mentoringApi.getReceivedRequests()
          if (res.success && res.data) setReceivedRequests(res.data.content ?? [])
        }
      } else {
        // 엽서 탭
        if (activeTab === 'sent') {
          const res = await mentoringApi.getSentCards()
          if (res.success && res.data) setSentCards(res.data.content ?? [])
        }
      }
    } catch (err) {
      console.error('내역 조회 실패:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    if (isDetailView) {
      setIsDetailView(false)
      setSelectedRequestDetail(null)
      setSelectedCardDetail(null)
    } else {
      navigate(-1)
    }
  }

  const handleRequestClick = async (requestId: number) => {
    try {
      const res = await mentoringApi.getRequest(requestId)
      if (res.success && res.data) {
        setSelectedRequestDetail(res.data)
        setSelectedCardDetail(null)
        setIsDetailView(true)
      }
    } catch (err) {
      console.error('신청서 상세 조회 실패:', err)
    }
  }

  const handleCardClick = async (cardId: number) => {
    try {
      const res = await mentoringApi.getCard(cardId)
      if (res.success && res.data) {
        setSelectedCardDetail(res.data)
        setSelectedRequestDetail(null)
        setIsDetailView(true)
      }
    } catch (err) {
      console.error('엽서 상세 조회 실패:', err)
    }
  }

  // ========== 상세: 멘토링 신청 ==========
  if (isDetailView && selectedRequestDetail) {
    const detail = selectedRequestDetail
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerInner}>
            <button className={styles.backButton} onClick={handleBack}>
              <img src={backArrowIcon} alt="뒤로가기" />
            </button>
            <span className={styles.headerTitle}>신청 내역</span>
          </div>
        </div>
        <div className={styles.detailContainer}>
          <div className={styles.detailHeader}>
            <div className={styles.detailProfileIcon}>
              {detail.mentorProfileImageUrl ? (
                <img src={detail.mentorProfileImageUrl} alt="" className={styles.detailProfileImg} />
              ) : (
                <div className={styles.detailProfilePlaceholder} />
              )}
            </div>
            <span className={styles.detailMentorName}>{detail.mentorName}</span>
            <span className={styles.detailDate}>{formatRelativeDate(detail.repliedAt || detail.createdAt)}</span>
          </div>

          {detail.adminReply ? (
            <>
              <h2 className={styles.detailTitle}>
                {detail.menteeName} 멘티님, 반가워요! 이번 달 만남 일정 조율건으로 연락드렸습니다.
              </h2>
              <div className={styles.detailBody}>
                <p>{detail.adminReply}</p>
              </div>
              <div className={styles.detailReplyButtonWrapper}>
                <button className={styles.detailReplyButton}>답장하기</button>
              </div>
            </>
          ) : (
            <>
              <h2 className={styles.detailTitle}>멘토링 신청 내용</h2>
              <div className={styles.detailBody}>
                <p>{detail.content}</p>
              </div>
              <div className={styles.detailStatusBadge}>
                <span>
                  {detail.status === 'PENDING' ? '답변 대기중' : detail.status === 'REPLIED' ? '답변 완료' : '거절됨'}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  // ========== 상세: 엽서 ==========
  if (isDetailView && selectedCardDetail) {
    const card = selectedCardDetail
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerInner}>
            <button className={styles.backButton} onClick={handleBack}>
              <img src={backArrowIcon} alt="뒤로가기" />
            </button>
            <span className={styles.headerTitle}>엽서 상세</span>
          </div>
        </div>
        <div className={styles.detailContainer}>
          <h2 className={styles.detailTitle}>{card.cardTitle}</h2>
          <div className={styles.detailMeta}>
            <span>{card.senderName}</span>
            <span className={styles.detailMetaDivider}>|</span>
            <span>{formatRelativeDate(card.createdAt)}</span>
          </div>
          <div className={styles.detailBody}>
            <p>{card.cardContent}</p>
          </div>
          {card.imageUrls && card.imageUrls.length > 0 && (
            <div className={styles.detailImages}>
              {card.imageUrls.map((url, idx) => (
                <img key={idx} src={url} alt="" className={styles.detailImage} />
              ))}
            </div>
          )}
          <div className={styles.detailStatusBadge}>
            <span>{card.isRead ? '읽음' : '읽지 않음'}</span>
          </div>
        </div>
      </div>
    )
  }

  // ========== 목록 화면 ==========
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <button className={styles.backButton} onClick={handleBack}>
            <img src={backArrowIcon} alt="뒤로가기" />
          </button>
          <span className={styles.headerTitle}>신청 내역</span>
        </div>
      </div>

      <div className={styles.tabBar}>
        <button
          className={`${styles.tab} ${activeTab === 'sent' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('sent')}
        >
          보낸 요청
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'received' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('received')}
        >
          받은 답변
        </button>
      </div>

      <div className={styles.subTabBar}>
        <button
          className={`${styles.subTab} ${activeSubTab === 'mentoring' ? styles.subTabActive : ''}`}
          onClick={() => setActiveSubTab('mentoring')}
        >
          멘토링
        </button>
        <button
          className={`${styles.subTab} ${activeSubTab === 'postcard' ? styles.subTabActive : ''}`}
          onClick={() => setActiveSubTab('postcard')}
        >
          엽서
        </button>
      </div>

      <div className={styles.listContainer}>
        {isLoading ? (
          <p className={styles.emptyText}>로딩 중...</p>
        ) : activeSubTab === 'mentoring' ? (
          // 멘토링 목록
          (() => {
            const list = activeTab === 'sent' ? sentRequests : receivedRequests
            if (list.length === 0) {
              return <p className={styles.emptyText}>{activeTab === 'sent' ? '보낸 신청서가 없습니다.' : '받은 답변이 없습니다.'}</p>
            }
            return list.map((item) => (
              <div
                key={item.mentoringRequestId}
                className={styles.listItem}
                onClick={() => handleRequestClick(item.mentoringRequestId)}
              >
                <div className={styles.listItemInner}>
                  <div className={styles.itemHeader}>
                    <div className={styles.itemProfile}>
                      <div className={`${styles.profileCircle} ${activeTab === 'received' ? styles.profileCircleBlue : ''}`} />
                      <span className={styles.profileName}>{item.mentorName}</span>
                    </div>
                    <span className={styles.itemDate}>{formatRelativeDate(item.createdAt)}</span>
                  </div>
                  <div className={styles.itemContent}>
                    <p className={styles.itemTitle}>
                      {item.content.length > 40 ? item.content.slice(0, 40) + '...' : item.content}
                    </p>
                    <p className={styles.itemPreview}>
                      {item.adminReply
                        ? item.adminReply.length > 50 ? item.adminReply.slice(0, 50) + '...' : item.adminReply
                        : item.content.length > 50 ? item.content.slice(0, 50) + '...' : item.content}
                    </p>
                  </div>
                </div>
              </div>
            ))
          })()
        ) : (
          // 엽서 목록
          (() => {
            if (activeTab === 'received') {
              return <p className={styles.emptyText}>받은 엽서 기능은 준비 중입니다.</p>
            }
            if (sentCards.length === 0) {
              return <p className={styles.emptyText}>보낸 엽서가 없습니다.</p>
            }
            return sentCards.map((card) => (
              <div
                key={card.mentoringCardId}
                className={styles.listItem}
                onClick={() => handleCardClick(card.mentoringCardId)}
              >
                <div className={styles.listItemInner}>
                  <div className={styles.itemHeader}>
                    <div className={styles.itemProfile}>
                      <div className={styles.profileCircle} />
                      <span className={styles.profileName}>{card.senderName}</span>
                    </div>
                    <span className={styles.itemDate}>{formatRelativeDate(card.createdAt)}</span>
                  </div>
                  <div className={styles.itemContent}>
                    <p className={styles.itemTitle}>
                      {card.cardTitle.length > 40 ? card.cardTitle.slice(0, 40) + '...' : card.cardTitle}
                    </p>
                    <div className={styles.itemBadgeRow}>
                      <span className={`${styles.itemBadge} ${card.isRead ? styles.itemBadgeRead : ''}`}>
                        {card.isRead ? '읽음' : '미확인'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          })()
        )}
      </div>
    </div>
  )
}

export default ApplicationHistoryPage
