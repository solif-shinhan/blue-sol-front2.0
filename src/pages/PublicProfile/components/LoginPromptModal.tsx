import styles from './LoginPromptModal.module.css'

interface LoginPromptModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: () => void
  userName: string
}

function LoginPromptModal({ isOpen, onClose, onLogin, userName }: LoginPromptModalProps) {
  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.content}>
          <div className={styles.iconWrapper}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="24" fill="#F3F6FB"/>
              <path d="M24 14C20.69 14 18 16.69 18 20C18 23.31 20.69 26 24 26C27.31 26 30 23.31 30 20C30 16.69 27.31 14 24 14Z" fill="#074ED8"/>
              <path d="M24 28C19.58 28 12 30.22 12 34.5V36H36V34.5C36 30.22 28.42 28 24 28Z" fill="#074ED8"/>
            </svg>
          </div>

          <h3 className={styles.title}>로그인이 필요해요</h3>
          <p className={styles.description}>
            <strong>{userName}</strong>님을 교류망에 추가하려면<br />
            로그인이 필요합니다.
          </p>
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelButton} onClick={onClose}>
            취소
          </button>
          <button className={styles.loginButton} onClick={onLogin}>
            로그인하고 추가하기
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginPromptModal
