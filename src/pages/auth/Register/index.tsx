import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BackHeader from '@components/BackHeader'
import PageHeader from '@components/PageHeader'
import styles from './Register.module.css'
import flogo from '@assets/images/flogo.svg'
import image176 from '@assets/images/register/image 176.png'
import image177 from '@assets/images/register/image 177.png'
import image178 from '@assets/images/register/image 178.png'

const KEYS_TO_CLEAR = [
  'hasCouncil',
  'hasCompletedOnboarding',
  'userInterests',
  'userGoals',
  'userSnsId',
  'userSocialLink',
  'userPattern',
  'userCharacter',
  'alumniData',
  'registerData',
  'registerUserRole'
]

function RegisterPage() {
  const navigate = useNavigate()

  useEffect(() => {
    KEYS_TO_CLEAR.forEach(key => {
      localStorage.removeItem(key)
    })
  }, [])

  const handleHighSchool = () => {
    localStorage.setItem('registerUserRole', 'JUNIOR')
    navigate('/register/scholarship')
  }

  const handleUniversity = () => {
    localStorage.setItem('registerUserRole', 'SENIOR')
    navigate('/register/scholarship')
  }

  const handleAlumni = () => {
    localStorage.setItem('registerUserRole', 'GRADUATE')
    navigate('/register/alumni')
  }

  const handleBack = () => {
    navigate('/login')
  }

  return (
    <div className={styles.container}>
      <BackHeader
        onBack={handleBack}
        showProgress
        totalSteps={3}
        currentStep={1}
      />

      <PageHeader
        variant="form"
        titleBold="회원 가입 유형"
        title="을"
        subtitle="선택해주세요"
        className={styles.pageHeader}
      />

      <div className={styles.cardContainer}>
        <button className={styles.card} onClick={handleHighSchool}>
          <div className={styles.cardContent}>
            <p className={styles.cardTitle}>중학생 및 고등학생</p>
            <p className={styles.cardSubtitle}>신한장학재단 장학생</p>
          </div>
          <div className={styles.cardIcon}>
            <img src={image176} alt="" className={styles.cardIconImg1} />
          </div>
        </button>

        <button className={styles.card} onClick={handleUniversity}>
          <div className={styles.cardContent}>
            <p className={styles.cardTitle}>대학생 및 대학원생</p>
            <p className={styles.cardSubtitle}>신한장학재단 장학생</p>
          </div>
          <div className={styles.cardIcon}>
            <img src={image177} alt="" className={styles.cardIconImg2} />
          </div>
        </button>

        <button className={styles.card} onClick={handleAlumni}>
          <div className={styles.cardContent}>
            <p className={styles.cardTitle}>장학재단 졸업생</p>
            <p className={styles.cardSubtitle}>대학원생 및 사회인</p>
          </div>
          <div className={styles.cardIcon}>
            <img src={image178} alt="" className={styles.cardIconImg3} />
          </div>
        </button>
      </div>

      <div className={styles.footer}>
        <img src={flogo} alt="신한장학재단" className={styles.footerLogo} />
      </div>
    </div>
  )
}

export default RegisterPage
