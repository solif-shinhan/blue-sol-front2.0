import styles from '../styles'
import { INTEREST_OPTIONS, CHARACTER_IMAGES } from '../constants'

import basketballIcon from '@assets/images/onboarding/start/basketball-icon.png'
import volunteerIcon from '@assets/images/onboarding/start/volunteer-icon.png'
import moreIcon from '@assets/images/onboarding/start/more-icon.png'
import decorationBar from '@assets/images/onboarding/start/decoration-bar.png'
import solidLogo from '@assets/images/onboarding/start/solid-logo.png'

interface PreviewStepProps {
  userName: string
  userTitle: string
  selectedInterests: string[]
  goals: string[]
  selectedCharacter: string
  selectedPattern: string
  onEditField?: (field: 'name' | 'title' | 'interests' | 'goals') => void
}

const INTEREST_ICONS: Record<string, string> = {
  basketball: basketballIcon,
  volunteer: volunteerIcon,
}

export function PreviewStep({
  userName = '김솔잎',
  userTitle = '체육교사꿈나무',
  selectedInterests,
  goals,
  selectedCharacter,
  onEditField,
}: PreviewStepProps) {
  const displayedInterests = selectedInterests.slice(0, 2)
  const hasMoreInterests = selectedInterests.length > 2

  const displayedGoals = goals.filter(g => g.trim()).slice(0, 3)

  const getInterestLabel = (id: string) => {
    const option = INTEREST_OPTIONS.find(opt => opt.id === id)
    return option?.label || id
  }

  const getInterestIcon = (id: string) => {
    if (id === 'basketball') return basketballIcon
    if (id === 'volunteer') return volunteerIcon
    return null
  }

  const characterImage = CHARACTER_IMAGES[selectedCharacter as keyof typeof CHARACTER_IMAGES]

  return (
    <div className={styles.previewStepContainer}>
      <div className={styles.previewStepHeader}>
        <h1 className={styles.previewStepTitle}>나만의 SOLID 카드 만들기</h1>
        <p className={styles.previewStepSubtitle}>
          수정할 부분이 있으면 탭하여 수정해주세요
        </p>
      </div>

      <div className={styles.solidCardWrapper}>
        <div className={styles.solidCardPreviewLarge}>
          {/* 그라데이션 배경 */}
          <div className={styles.solidCardBackground} />

          {/* SOLID 로고 */}
          <div className={styles.solidLogoContainer}>
            <img src={solidLogo} alt="SOLID" className={styles.solidLogoImage} />
          </div>

          {/* 캐릭터 이미지 */}
          <div className={styles.solidCardCharacter}>
            {characterImage && (
              <img src={characterImage} alt="캐릭터" className={styles.solidCardCharacterImage} />
            )}
          </div>

          {/* 사용자 정보 */}
          <div
            className={styles.solidCardUserInfo}
            onClick={() => onEditField?.('name')}
          >
            <h2 className={styles.solidCardUserName}>{userName}</h2>
            <p className={styles.solidCardUserTitle}>{userTitle}</p>
          </div>

          {/* 관심사 태그 */}
          <div
            className={styles.solidCardInterests}
            onClick={() => onEditField?.('interests')}
          >
            {displayedInterests.map((interest, index) => {
              const icon = getInterestIcon(interest)
              return (
                <div key={index} className={styles.solidCardInterestTag}>
                  {icon && (
                    <div className={styles.solidCardInterestIcon}>
                      <img src={icon} alt="" className={styles.solidCardInterestIconImage} />
                    </div>
                  )}
                  <span className={styles.solidCardInterestLabel}>
                    {getInterestLabel(interest)}
                  </span>
                </div>
              )
            })}
            {hasMoreInterests && (
              <div className={styles.solidCardMoreTag}>
                <img src={moreIcon} alt="더보기" className={styles.solidCardMoreIcon} />
              </div>
            )}
          </div>

          {/* 장식 바 */}
          <div className={styles.solidCardDecoration}>
            <img src={decorationBar} alt="" className={styles.solidCardDecorationImage} />
          </div>

          {/* 목표 리스트 */}
          <div
            className={styles.solidCardGoals}
            onClick={() => onEditField?.('goals')}
          >
            {displayedGoals.map((goal, index) => (
              <p
                key={index}
                className={styles.solidCardGoalItem}
                style={{
                  color: index === 0 ? '#074ED8' : index === 1 ? '#3971E0' : '#ABC8FF',
                  opacity: index === 0 ? 0.5 : index === 1 ? 0.5 : 0.5,
                }}
              >
                {goal}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
