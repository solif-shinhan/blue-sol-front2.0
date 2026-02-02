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

  // Check if form is valid (all fields filled and passwords match)
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
      // localStorage에서 저장된 데이터 가져오기
      const registerDataStr = localStorage.getItem('registerData')
      const userRole = localStorage.getItem('registerUserRole') as UserRole || 'SENIOR'

      if (!registerDataStr) {
        setError('회원 정보가 없습니다. 처음부터 다시 시도해주세요.')
        setIsLoading(false)
        return
      }

      const registerData = JSON.parse(registerDataStr)

      // 회원가입 API 호출
      const signupResponse = await signup({
        loginId: formData.username,
        password: formData.password,
        name: registerData.name,
        phone: registerData.phone,
        email: registerData.email,
        scholarNumber: registerData.scholarNumber,
        userRole: userRole,
        region: registerData.region,
        schoolName: registerData.schoolName
      })

      if (signupResponse.success) {
        // 회원가입 성공 후 사용자 이름 저장 (Home에서 사용)
        localStorage.setItem('userName', registerData.name)

        // 회원가입 성공 후 자동 로그인
        const loginResponse = await login({
          loginId: formData.username,
          password: formData.password
        })

        // 임시 저장 데이터 삭제
        localStorage.removeItem('registerData')
        localStorage.removeItem('registerUserRole')

        if (loginResponse.success) {
          navigate('/register/complete')
        } else {
          // 로그인 실패 시에도 회원가입은 완료됐으므로 완료 페이지로 이동
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
      {/* Header with Back Button and Progress */}
      <BackHeader
        onBack={handleBack}
        showProgress
        totalSteps={3}
        currentStep={3}
      />

      {/* Title Section */}
      <PageHeader
        variant="form"
        titleBold="아이디와 비밀번호"
        title="를"
        subtitle="설정해주세요"
        className={styles.pageHeader}
      />

      {/* Form Section */}
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

      {/* Error Message */}
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      {/* Submit Button */}
      <div className={styles.buttonWrapper}>
        <CTAButton
          text={isLoading ? '처리 중...' : '가입 및 로그인'}
          onClick={handleSubmit}
          disabled={!isFormValid || isLoading}
        />
      </div>

      {/* Footer Logo */}
      <div className={styles.footer}>
        <img src={flogo} alt="신한장학재단" className={styles.footerLogo} />
      </div>
    </div>
  )
}

export default ScholarshipCredentialsPage
