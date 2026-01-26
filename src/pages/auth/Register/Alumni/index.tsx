import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackHeader from '@components/BackHeader'
import PageHeader from '@components/PageHeader'
import FormRow from '@components/FormRow'
import CTAButton from '@components/CTAButton'
import styles from './Alumni.module.css'
import flogo from '@assets/images/flogo.svg'

function AlumniRegisterPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    scholarshipNumber: '',
    phoneNumber: '',
    email: ''
  })

  const handleBack = () => {
    navigate('/register')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const isFormValid =
    formData.name.trim() !== '' &&
    formData.scholarshipNumber.trim() !== '' &&
    formData.phoneNumber.trim() !== '' &&
    formData.email.trim() !== ''

  const handleSubmit = () => {
    if (isFormValid) {
      // Save data and navigate to registration complete page
      localStorage.setItem('alumniData', JSON.stringify(formData))
      navigate('/register/complete')
    }
  }

  return (
    <div className={styles.container}>
      {/* Header with Back Button and Progress */}
      <BackHeader
        onBack={handleBack}
        showProgress
        totalSteps={2}
        currentStep={2}
      />

      {/* Title Section */}
      <PageHeader
        variant="form"
        titleBold="졸업생 기본 정보"
        title="를"
        subtitle="입력해주세요"
        className={styles.pageHeader}
      />

      {/* Form */}
      <div className={styles.formSection}>
        <div className={styles.form}>
          <FormRow
            label="이름"
            name="name"
            type="text"
            placeholder="입력해주세요"
            value={formData.name}
            onChange={handleInputChange}
            variant="horizontal"
          />

          <FormRow
            label="장학생 번호"
            name="scholarshipNumber"
            type="text"
            placeholder="입력해주세요"
            value={formData.scholarshipNumber}
            onChange={handleInputChange}
            variant="horizontal"
          />

          <FormRow
            label="휴대폰 번호"
            name="phoneNumber"
            type="tel"
            placeholder="입력해주세요"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            variant="horizontal"
          />

          <FormRow
            label="이메일"
            name="email"
            type="email"
            placeholder="입력해주세요"
            value={formData.email}
            onChange={handleInputChange}
            variant="horizontal"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className={styles.buttonWrapper}>
        <CTAButton
          text="다음"
          onClick={handleSubmit}
          disabled={!isFormValid}
        />
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <img src={flogo} alt="신한장학재단" className={styles.footerLogo} />
      </div>
    </div>
  )
}

export default AlumniRegisterPage
