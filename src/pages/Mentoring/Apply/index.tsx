import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './MentoringApply.module.css'

// 모달 이미지 assets
const modalLogoImg = 'https://www.figma.com/api/mcp/asset/33880964-d4bc-43f2-8f7a-29b1f027333c'
const modalTextImg = 'https://www.figma.com/api/mcp/asset/b0d21257-d5be-463a-84f0-15d5c848c09e'

// 카테고리 옵션
const CATEGORY_OPTIONS = ['학업', '취업', '금전', '기타']

// 멘토링 방식 옵션
const MENTORING_METHODS = [
  { id: 'note', label: '쪽지 상담' },
  { id: 'video', label: '화상 미팅' },
  { id: 'phone', label: '전화 상담' },
  { id: 'face', label: '대면 상담' },
]

// 멘토 데이터 (실제로는 props나 상태로 받아야 함)
const MENTOR_DATA = {
  name: '신한철',
  role: '멘토',
  organization: 'SO&L 글로벌자산운용 대표',
  introduction: `안녕하세요! SO&L 글로벌자산운용 대표 신한철입니다.
제 일은 쿠팡이나 넷플릭스처럼 우리 일상 속 좋은 회사를 찾아내어 그 기업의 주인이 되는 방법을 연구하는 것입니다. 여러분이 숫자에 매몰된 레거시한 공부에서 벗어나, 세상을 읽는 눈을 키워 당당한 투자자로 성장하도록 돕겠습니다.
저와 함께 진짜 경제를 시작해 봅시다!`,
}

function MentoringApplyPage() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('학업')
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [content, setContent] = useState('')
  const [showCompleteModal, setShowCompleteModal] = useState(false)

  const handleClose = () => {
    navigate(-1)
  }

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
  }

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId)
  }

  const handleSubmit = () => {
    // 신청 처리 로직
    console.log({
      mentor: MENTOR_DATA.name,
      category: selectedCategory,
      method: selectedMethod,
      content,
    })
    // 완료 모달 표시
    setShowCompleteModal(true)
  }

  // 모달이 열리면 3초 후 멘토링 페이지로 이동
  useEffect(() => {
    if (showCompleteModal) {
      const timer = setTimeout(() => {
        navigate('/exchange/mentoring')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showCompleteModal, navigate])

  const handleModalClick = () => {
    navigate('/exchange/mentoring')
  }

  // 멘토링 방식 선택 + 내용 작성 둘 다 필요
  const isSubmitEnabled = content.trim().length > 0 && selectedMethod !== null

  return (
    <div className={styles.container}>
      {/* 멘토 프로필 카드 */}
      <div className={styles.profileCard}>
        {/* 헤더 */}
        <header className={styles.header}>
          <button className={styles.closeButton} onClick={handleClose}>
            <img src="/x.svg" alt="닫기" />
          </button>
          <h1 className={styles.headerTitle}>멘토링 신청하기</h1>
        </header>

        {/* 멘토 정보 */}
        <div className={styles.mentorInfo}>
          <div className={styles.mentorNameRow}>
            <span className={styles.mentorName}>{MENTOR_DATA.name}</span>
            <span className={styles.mentorRole}>{MENTOR_DATA.role}</span>
            <span className={styles.mentorOrg}>{MENTOR_DATA.organization}</span>
          </div>
          <p className={styles.mentorIntro}>{MENTOR_DATA.introduction}</p>
        </div>
      </div>

      {/* 폼 영역 */}
      <div className={styles.formArea}>
        {/* 고민 카테고리 선택 */}
        <div className={styles.formSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>고민되는 내용을 작성해주세요</h2>
          </div>
          <div className={styles.categoryTabs}>
            {CATEGORY_OPTIONS.map((category) => (
              <button
                key={category}
                className={`${styles.categoryTab} ${selectedCategory === category ? styles.categoryTabActive : ''
                  }`}
                onClick={() => handleCategorySelect(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <div className={styles.textareaWrapper}>
            <textarea
              className={styles.textarea}
              placeholder={`자유롭게 내용을 작성해주세요.\n익명이므로 누구의 고민인지 알 수 없어요.`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>

        {/* 멘토링 방식 선택 */}
        <div className={styles.formSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>가능한 멘토링 방식을 선택해주세요</h2>
          </div>
          <div className={styles.methodsGrid}>
            {MENTORING_METHODS.map((method) => (
              <div key={method.id} className={styles.methodItem}>
                <button
                  className={`${styles.methodButton} ${selectedMethod === method.id ? styles.methodButtonActive : ''
                    }`}
                  onClick={() => handleMethodSelect(method.id)}
                >
                  {/* 아이콘 자리 */}
                </button>
                <span className={styles.methodLabel}>{method.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 신청하기 버튼 */}
      <button
        className={`${styles.submitButton} ${isSubmitEnabled ? styles.submitButtonActive : ''}`}
        onClick={handleSubmit}
        disabled={!isSubmitEnabled}
      >
        신청하기
      </button>

      {/* 멘토링 신청 완료 모달 */}
      {showCompleteModal && (
        <div className={styles.modalOverlay} onClick={handleModalClick}>
          <div className={styles.modalContent}>
            <div className={styles.modalIcon} />
            <div className={styles.modalTextWrapper}>
              <div className={styles.modalSubText}>
                <p>멘토링이 배정되면</p>
                <p>알림으로 바로 알려드릴게요!</p>
              </div>
              <p className={styles.modalMainText}>멘토링 신청 완료!</p>
            </div>
          </div>
          <div className={styles.modalFooter}>
            <img src={modalLogoImg} alt="" className={styles.modalFooterLogo} />
            <img src={modalTextImg} alt="신한장학재단" className={styles.modalFooterText} />
          </div>
        </div>
      )}
    </div>
  )
}

export default MentoringApplyPage
