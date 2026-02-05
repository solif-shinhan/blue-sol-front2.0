import { useNavigate } from 'react-router-dom'
import styles from './Complete.module.css'
import registerCompleteImage from '@assets/images/register-complete.png'
import flogo from '@assets/images/flogo.svg'

function RegisterCompletePage() {
  const navigate = useNavigate()

  const userName = localStorage.getItem('userName') || '회원'

  const handleStart = () => {
    navigate('/onboarding')
  }

  return (
    <div className={styles.container} onClick={handleStart}>
      <div className={styles.content}>
        <img
          src={registerCompleteImage}
          alt="가입 완료 이미지"
          className={styles.avatar}
        />

        <div className={styles.textSection}>
          <div className={styles.subtitleGroup}>
            <p className={styles.subtitle}>회원가입이 완료되었습니다</p>
          </div>
          <p className={styles.welcomeText}>{userName}님, 환영해요!</p>
        </div>
      </div>

      <div className={styles.footer}>
        <img src={flogo} alt="신한장학재단" className={styles.footerLogo} />
      </div>
    </div>
  )
}

export default RegisterCompletePage
