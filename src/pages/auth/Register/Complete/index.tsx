import { useNavigate } from 'react-router-dom'
import styles from './Complete.module.css'
import flogo from '@assets/images/flogo.svg'

function RegisterCompletePage() {
  const navigate = useNavigate()

  const handleStart = () => {
    navigate('/onboarding')
  }

  return (
    <div className={styles.container} onClick={handleStart}>
      {/* Content Section */}
      <div className={styles.content}>
        <div className={styles.avatar} />

        <div className={styles.textSection}>
          <div className={styles.subtitleGroup}>
            <p className={styles.subtitle}>가입 완료</p>
            <p className={styles.subtitle}>SOLID를 만들러 가볼까요?</p>
          </div>
          <p className={styles.welcomeText}>김신한님, 환영해요!</p>
        </div>
      </div>

      {/* Footer - Same position as Register page */}
      <div className={styles.footer}>
        <img src={flogo} alt="신한장학재단" className={styles.footerLogo} />
      </div>
    </div>
  )
}

export default RegisterCompletePage
