import styles from '../styles'

interface SnsStepProps {
  snsId: string
  socialLink: string
  onSnsIdChange: (value: string) => void
  onSocialLinkChange: (value: string) => void
  onSkip: () => void
}

export function SnsStep({
  snsId,
  socialLink,
  onSnsIdChange,
  onSocialLinkChange,
  onSkip
}: SnsStepProps) {
  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h1 className={styles.stepTitle}>
          나를 표현할 SNS를
          <br />
          추가할 수 있어요
        </h1>
        <p className={styles.stepSubtitle}>나의 프로필에 추가 되어요.</p>
      </div>

      <div className={styles.snsInputContainer}>
        <div className={styles.snsInputRow}>
          <label className={styles.snsLabel}>SNS 아이디</label>
          <input
            type="text"
            className={styles.snsInput}
            placeholder="입력해주세요"
            value={snsId}
            onChange={(e) => onSnsIdChange(e.target.value)}
          />
        </div>
        <div className={styles.snsInputRow}>
          <label className={styles.snsLabel}>소셜링크</label>
          <input
            type="text"
            className={styles.snsInput}
            placeholder="입력해주세요"
            value={socialLink}
            onChange={(e) => onSocialLinkChange(e.target.value)}
          />
        </div>
      </div>

      <button className={styles.skipLink} onClick={onSkip}>
        넘어갈까요?
      </button>
    </div>
  )
}
