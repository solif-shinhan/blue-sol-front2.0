import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackHeader from '@components/BackHeader'
import PageHeader from '@components/PageHeader'
import FormRow from '@components/FormRow'
import CTAButton from '@components/CTAButton'
import { signup, login, type UserRole } from '@/services/authService'
import styles from './ScholarshipCredentials.module.css'
import flogo from '@assets/images/flogo.svg'

interface FormData {
  username: string
  password: string
  passwordConfirm: string
}

function ScholarshipCredentialsPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    passwordConfirm: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const isFormValid =
    formData.username.trim() !== '' &&
    formData.password.trim() !== '' &&
    formData.passwordConfirm.trim() !== '' &&
    formData.password === formData.passwordConfirm

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!isFormValid || isLoading) return

    setIsLoading(true)
    setError('')

    try {
      console.log('[ScholarshipCredentials] handleSubmit 시작')

      const registerDataStr = localStorage.getItem('registerData')
      const userRole = localStorage.getItem('registerUserRole') as UserRole || 'SENIOR'

      console.log('[ScholarshipCredentials] registerDataStr:', registerDataStr)
      console.log('[ScholarshipCredentials] userRole:', userRole)

      if (!registerDataStr) {
        setError('회원 정보가 없습니다. 처음부터 다시 시도해주세요.')
        setIsLoading(false)
        return
      }

      const registerData = JSON.parse(registerDataStr)
      console.log('[ScholarshipCredentials] registerData:', registerData)

      // userName을 미리 저장 (API 성공/실패와 관계없이 온보딩에서 사용)
      localStorage.setItem('userName', registerData.name)

      const signupPayload = {
        loginId: formData.username,
        password: formData.password,
        name: registerData.name,
        phone: registerData.phone,
        email: registerData.email,
        scholarNumber: registerData.scholarNumber,
        userRole: userRole,
        region: registerData.region,
        schoolName: registerData.schoolName
      }

      console.log('[ScholarshipCredentials] signup payload:', { ...signupPayload, password: '***' })

      const signupResponse = await signup(signupPayload)

      if (signupResponse.success) {
        const loginResponse = await login({
          loginId: formData.username,
          password: formData.password
        })

        // registerData는 온보딩에서 사용하므로 온보딩 완료 시 삭제
        localStorage.removeItem('registerUserRole')

        if (loginResponse.success) {
          navigate('/register/complete')
        } else {
          navigate('/register/complete')
        }
      } else {
        setError(signupResponse.message || '회원가입에 실패했습니다.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원가입에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    navigate('/register/scholarship')
  }

  return (
    <div className={styles.container}>
      <BackHeader
        onBack={handleBack}
        showProgress
        totalSteps={3}
        currentStep={3}
      />

      <PageHeader
        variant="form"
        titleBold="아이디와 비밀번호"
        title="를"
        subtitle="설정해주세요"
        className={styles.pageHeader}
      />

      <div className={styles.formSection}>
        <div className={styles.form}>
          <FormRow
            label="아이디"
            name="username"
            type="text"
            placeholder="입력해주세요"
            value={formData.username}
            onChange={handleInputChange}
            variant="horizontal"
            autoComplete="username"
          />

          <FormRow
            label="비밀번호"
            name="password"
            type="password"
            placeholder="입력해주세요"
            value={formData.password}
            onChange={handleInputChange}
            variant="horizontal"
            autoComplete="new-password"
          />

          <FormRow
            label="비밀번호 확인"
            name="passwordConfirm"
            type="password"
            placeholder="입력해주세요"
            value={formData.passwordConfirm}
            onChange={handleInputChange}
            variant="horizontal"
            autoComplete="new-password"
          />
        </div>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      <div className={styles.buttonWrapper}>
        <CTAButton
          text={isLoading ? '처리 중...' : '가입 및 로그인'}
          onClick={handleSubmit}
          disabled={!isFormValid || isLoading}
        />
      </div>

      <div className={styles.footer}>
        <img src={flogo} alt="신한장학재단" className={styles.footerLogo} />
      </div>
    </div>
  )
}

export default ScholarshipCredentialsPage
