import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BackHeader from '@components/BackHeader'
import PageHeader from '@components/PageHeader'
import FormRow from '@components/FormRow'
import CTAButton from '@components/CTAButton'
import styles from './ScholarshipMember.module.css'
import flogo from '@assets/images/flogo.svg'

// 한국 지역 목록
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

interface FormData {
  name: string
  scholarshipId: string
  phone: string
  email: string
  region: string
  school: string
}

function ScholarshipMemberPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    scholarshipId: '',
    phone: '',
    email: '',
    region: '',
    school: ''
  })
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false)
  const regionDropdownRef = useRef<HTMLDivElement>(null)

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (regionDropdownRef.current && !regionDropdownRef.current.contains(event.target as Node)) {
        setIsRegionDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Check if form is valid (all fields filled)
  const isFormValid =
    formData.name.trim() !== '' &&
    formData.scholarshipId.trim() !== '' &&
    formData.phone.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.region.trim() !== '' &&
    formData.school.trim() !== ''

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!isFormValid) return

    // Navigate to next step - credentials setup
    navigate('/register/scholarship/credentials')
  }

  const handleBack = () => {
    navigate('/register')
  }

  const handleRegionSelect = (region: string) => {
    setFormData(prev => ({ ...prev, region }))
    setIsRegionDropdownOpen(false)
  }

  return (
    <div className={styles.container}>
      {/* Header with Back Button and Progress */}
      <BackHeader
        onBack={handleBack}
        showProgress
        totalSteps={3}
        currentStep={2}
      />

      {/* Title Section */}
      <PageHeader
        variant="form"
        titleBold="장학생 기본 정보"
        title="를"
        subtitle="입력해주세요"
        className={styles.pageHeader}
      />

      {/* Form Section - First Group */}
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
            name="scholarshipId"
            type="text"
            placeholder="입력해주세요"
            value={formData.scholarshipId}
            onChange={handleInputChange}
            variant="horizontal"
          />

          <FormRow
            label="휴대폰 번호"
            name="phone"
            type="tel"
            placeholder="입력해주세요"
            value={formData.phone}
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

      {/* Form Section - Second Group */}
      <div className={styles.formSectionSecond}>
        <div className={styles.formSecond}>
          {/* 지역 - 드롭다운 유지 */}
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

          {/* 학교 */}
          <FormRow
            label="학교"
            name="school"
            type="text"
            placeholder="입력해주세요"
            value={formData.school}
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

      {/* Footer Logo */}
      <div className={styles.footer}>
        <img src={flogo} alt="신한장학재단" className={styles.footerLogo} />
      </div>
    </div>
  )
}

export default ScholarshipMemberPage
