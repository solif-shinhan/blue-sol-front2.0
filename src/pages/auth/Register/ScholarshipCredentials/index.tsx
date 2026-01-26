import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackHeader from '@components/BackHeader'
import PageHeader from '@components/PageHeader'
import FormRow from '@components/FormRow'
import CTAButton from '@components/CTAButton'
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

  // Check if form is valid (all fields filled and passwords match)
  const isFormValid =
    formData.username.trim() !== '' &&
    formData.password.trim() !== '' &&
    formData.passwordConfirm.trim() !== '' &&
    formData.password === formData.passwordConfirm

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!isFormValid) return

    // Complete registration and navigate to complete page
    navigate('/register/complete')
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

      {/* Submit Button */}
      <div className={styles.buttonWrapper}>
        <CTAButton
          text="가입 및 로그인"
          onClick={handleSubmit}
          disabled={!isFormValid}
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
