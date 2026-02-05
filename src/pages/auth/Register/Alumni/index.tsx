import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BackHeader from '@components/BackHeader'
import PageHeader from '@components/PageHeader'
import FormRow from '@components/FormRow'
import CTAButton from '@components/CTAButton'
import styles from './Alumni.module.css'
import flogo from '@assets/images/flogo.svg'

const REGIONS = [
  '서울',
  '경기',
  '인천',
  '부산',
  '대구',
  '광주',
  '대전',
  '울산',
  '세종',
  '강원',
  '충북',
  '충남',
  '전북',
  '전남',
  '경북',
  '경남',
  '제주'
]

function AlumniRegisterPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    scholarshipNumber: '',
    phoneNumber: '',
    email: '',
    region: '',
    schoolName: ''
  })

  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false)
  const regionDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (regionDropdownRef.current && !regionDropdownRef.current.contains(event.target as Node)) {
        setIsRegionDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleBack = () => {
    navigate('/register')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === 'phoneNumber') {
      const numbers = value.replace(/[^0-9]/g, '')
      let formattedValue = ''

      if (numbers.length <= 3) {
        formattedValue = numbers
      } else if (numbers.length <= 7) {
        formattedValue = `${numbers.slice(0, 3)}-${numbers.slice(3)}`
      } else {
        formattedValue = `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
      }

      setFormData(prev => ({ ...prev, [name]: formattedValue }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleRegionSelect = (region: string) => {
    setFormData(prev => ({ ...prev, region }))
    setIsRegionDropdownOpen(false)
  }

  const isFormValid =
    formData.name.trim() !== '' &&
    formData.scholarshipNumber.trim() !== '' &&
    formData.phoneNumber.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.region.trim() !== '' &&
    formData.schoolName.trim() !== ''

  const handleSubmit = () => {
    if (isFormValid) {
      localStorage.setItem('registerData', JSON.stringify({
        name: formData.name,
        scholarNumber: formData.scholarshipNumber,
        phone: formData.phoneNumber,
        email: formData.email,
        region: formData.region,
        schoolName: formData.schoolName
      }))
      navigate('/register/scholarship/credentials')
    }
  }

  return (
    <div className={styles.container}>
      <BackHeader
        onBack={handleBack}
        showProgress
        totalSteps={2}
        currentStep={2}
      />

      <PageHeader
        variant="form"
        titleBold="졸업생 기본 정보"
        title="를"
        subtitle="입력해주세요"
        className={styles.pageHeader}
      />

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

      <div className={styles.formSectionSecond}>
        <div className={styles.formSecond}>
          <div className={styles.inputRow}>
            <label className={styles.label}>지역</label>
            <div className={styles.dropdownContainer} ref={regionDropdownRef}>
              <div
                className={`${styles.input} ${styles.dropdownTrigger} ${isRegionDropdownOpen ? styles.dropdownOpen : ''}`}
                onClick={() => setIsRegionDropdownOpen(!isRegionDropdownOpen)}
              >
                <span className={formData.region ? styles.dropdownValue : styles.dropdownPlaceholder}>
                  {formData.region || '입력해주세요'}
                </span>
              </div>
              {isRegionDropdownOpen && (
                <div className={styles.dropdownList}>
                  {REGIONS.map((region) => (
                    <div
                      key={region}
                      className={`${styles.dropdownItem} ${formData.region === region ? styles.dropdownItemSelected : ''}`}
                      onClick={() => handleRegionSelect(region)}
                    >
                      {region}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <FormRow
            label="학교"
            name="schoolName"
            type="text"
            placeholder="입력해주세요"
            value={formData.schoolName}
            onChange={handleInputChange}
            variant="horizontal"
          />
        </div>
      </div>

      <div className={styles.buttonWrapper}>
        <CTAButton
          text="다음"
          onClick={handleSubmit}
          disabled={!isFormValid}
        />
      </div>

      <div className={styles.footer}>
        <img src={flogo} alt="신한장학재단" className={styles.footerLogo} />
      </div>
    </div>
  )
}

export default AlumniRegisterPage
