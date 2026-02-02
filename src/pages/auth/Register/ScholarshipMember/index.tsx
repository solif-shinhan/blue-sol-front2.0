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
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const regionDropdownRef = useRef<HTMLDivElement>(null)
  const regionTriggerRef = useRef<HTMLDivElement>(null)
  const schoolInputRef = useRef<HTMLInputElement>(null)

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

    if (name === 'phone') {
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

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!isFormValid) return

    // 기본 정보를 localStorage에 저장
    localStorage.setItem('registerData', JSON.stringify({
      name: formData.name,
      scholarNumber: formData.scholarshipId,
      phone: formData.phone,
      email: formData.email,
      region: formData.region,
      schoolName: formData.school
    }))

    // Navigate to next step - credentials setup
    navigate('/register/scholarship/credentials')
  }

  const handleBack = () => {
    navigate('/register')
  }

  const handleRegionSelect = (region: string) => {
    setFormData(prev => ({ ...prev, region }))
    setIsRegionDropdownOpen(false)
    setHighlightedIndex(-1)
    // 지역 선택 후 학교 입력 필드로 포커스 이동
    setTimeout(() => {
      schoolInputRef.current?.focus()
    }, 0)
  }

  // 드롭다운 키보드 핸들러
  const handleDropdownKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isRegionDropdownOpen) {
      // 드롭다운이 닫혀있을 때 Enter, Space, ArrowDown으로 열기
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault()
        setIsRegionDropdownOpen(true)
        setHighlightedIndex(formData.region ? REGIONS.indexOf(formData.region) : 0)
      }
    } else {
      // 드롭다운이 열려있을 때
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setHighlightedIndex(prev =>
            prev < REGIONS.length - 1 ? prev + 1 : 0
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setHighlightedIndex(prev =>
            prev > 0 ? prev - 1 : REGIONS.length - 1
          )
          break
        case 'Enter':
        case ' ':
          e.preventDefault()
          if (highlightedIndex >= 0 && highlightedIndex < REGIONS.length) {
            handleRegionSelect(REGIONS[highlightedIndex])
          }
          break
        case 'Escape':
          e.preventDefault()
          setIsRegionDropdownOpen(false)
          setHighlightedIndex(-1)
          break
        case 'Tab':
          // Tab 키를 누르면 현재 하이라이트된 항목 선택 후 다음 필드로 이동
          if (highlightedIndex >= 0 && highlightedIndex < REGIONS.length) {
            handleRegionSelect(REGIONS[highlightedIndex])
          } else if (formData.region) {
            // 이미 선택된 값이 있으면 드롭다운 닫고 다음으로 이동
            setIsRegionDropdownOpen(false)
            setTimeout(() => {
              schoolInputRef.current?.focus()
            }, 0)
          } else {
            setIsRegionDropdownOpen(false)
          }
          break
      }
    }
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
                ref={regionTriggerRef}
                className={`${styles.input} ${styles.dropdownTrigger} ${isRegionDropdownOpen ? styles.dropdownOpen : ''}`}
                onClick={() => setIsRegionDropdownOpen(!isRegionDropdownOpen)}
                onKeyDown={handleDropdownKeyDown}
                tabIndex={0}
                role="combobox"
                aria-expanded={isRegionDropdownOpen}
                aria-haspopup="listbox"
                aria-label="지역 선택"
              >
                <span className={formData.region ? styles.dropdownValue : styles.dropdownPlaceholder}>
                  {formData.region || '입력해주세요'}
                </span>
              </div>
              {isRegionDropdownOpen && (
                <div className={styles.dropdownList} role="listbox">
                  {REGIONS.map((region, index) => (
                    <div
                      key={region}
                      className={`${styles.dropdownItem} ${formData.region === region ? styles.dropdownItemSelected : ''} ${highlightedIndex === index ? styles.dropdownItemHighlighted : ''}`}
                      onClick={() => handleRegionSelect(region)}
                      role="option"
                      aria-selected={formData.region === region}
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
            ref={schoolInputRef}
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
