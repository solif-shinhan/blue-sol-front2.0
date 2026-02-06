import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styles1 from './CouncilRegister-1.module.css'
import styles2 from './CouncilRegister-2.module.css'
import { useCouncilStatus } from '@/hooks'
import backArrowIcon from '@/assets/images/IOS Arrow/undefined/Glyph_ undefined.svg'
import { createCouncil } from '@/services'

const styles = { ...styles1, ...styles2 }

interface TeamMember {
  id: string
  name: string
  avatarColor: 'blue' | 'lightBlue' | 'gray'
}

export function CouncilRegister() {
  const navigate = useNavigate()
  const { setHasCouncil } = useCouncilStatus()
  const [showSuccess, setShowSuccess] = useState(false)
  const [step, setStep] = useState(1)

  const [formData, setFormData] = useState({
    councilName: '',
    activityRegion: '',
    activityTopic: '',
    introduction: '',
    budget: '',
  })

  const [rules, setRules] = useState<string[]>([])
  const [newRuleInput, setNewRuleInput] = useState('')

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setPhotoPreview(URL.createObjectURL(file))
  }

  const isStep1Valid =
    formData.councilName.trim() !== '' &&
    formData.activityRegion.trim() !== '' &&
    formData.activityTopic.trim() !== ''

  const isStep2Valid =
    teamMembers.length >= 1 &&
    rules.length > 0

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddMember = () => {
    navigate('/exchange/council/member/add')
  }

  const handleRemoveMember = (id: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id))
  }

  const handleAddRule = () => {
    const trimmed = newRuleInput.trim()
    if (trimmed) {
      setRules(prev => [...prev, trimmed])
      setNewRuleInput('')
    }
  }

  const handleRemoveRule = (index: number) => {
    setRules(prev => prev.filter((_, i) => i !== index))
  }

  const handleNext = () => {
    if (step === 1 && isStep1Valid) {
      setStep(2)
    }
  }

  const handleSubmit = async () => {
    if (!isStep2Valid || isSubmitting) return

    setIsSubmitting(true)
    try {
      const response = await createCouncil({
        name: formData.councilName,
        description: formData.introduction,
        region: formData.activityRegion,
        topic: formData.activityTopic,
        goal: formData.introduction,
      })

      if (response.success) {
        setHasCouncil(true)
        setShowSuccess(true)
        setTimeout(() => {
          navigate('/exchange')
        }, 3000)
      }
    } catch (err) {
      console.error('자치회 등록 실패:', err)
      alert('자치회 등록에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    if (step === 2) {
      setStep(1)
    } else {
      navigate(-1)
    }
  }

  if (showSuccess) {
    return (
      <div className={styles.successModal}>
        <div className={styles.successContent}>
          <div className={styles.successIcon} />
          <p className={styles.successMessage}>
            자치회 활동 예산이 배정되면<br />
            알림으로 바로 알려드릴게요!
          </p>
          <h2 className={styles.successTitle}>등록 신청 완료!</h2>
          <div className={styles.successLogo}>
            <img
              src="/shinhan-logo.svg"
              alt="신한장학재단"
              className={styles.successLogoIcon}
            />
            <span className={styles.successLogoText}>신한장학재단</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backButton} onClick={handleBack}>
            <img src={backArrowIcon} alt="뒤로가기" />
          </button>
          <h1 className={styles.headerTitle}>자치회 등록하기</h1>
        </div>
      </header>

      <main className={styles.content}>
        {step === 1 && (
          <>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>기본 정보 입력</h2>
              <div className={styles.inputGroup}>
                <div className={styles.inputRow}>
                  <label className={styles.inputLabel}>자치회 이름</label>
                  <input
                    type="text"
                    className={styles.inputField}
                    placeholder="입력해주세요"
                    value={formData.councilName}
                    onChange={(e) => handleInputChange('councilName', e.target.value)}
                  />
                </div>
                <div className={styles.inputRow}>
                  <label className={styles.inputLabel}>활동 지역</label>
                  <input
                    type="text"
                    className={styles.inputField}
                    placeholder="입력해주세요"
                    value={formData.activityRegion}
                    onChange={(e) => handleInputChange('activityRegion', e.target.value)}
                  />
                </div>
                <div className={styles.inputRow}>
                  <label className={styles.inputLabel}>활동 주제</label>
                  <input
                    type="text"
                    className={styles.inputField}
                    placeholder="입력해주세요"
                    value={formData.activityTopic}
                    onChange={(e) => handleInputChange('activityTopic', e.target.value)}
                  />
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>소개글</h2>
              <textarea
                className={styles.textarea}
                placeholder="자치회를 소개해주세요."
                value={formData.introduction}
                onChange={(e) => handleInputChange('introduction', e.target.value)}
              />
            </section>

            <section className={styles.section}>
              <div className={styles.sectionTitleGroup}>
                <h2 className={styles.sectionTitle}>활동 예산</h2>
                <p className={styles.sectionDescription}>연간 자치회 예산을 입력해주세요.</p>
              </div>
              <div className={styles.budgetInput}>
                <input
                  type="text"
                  className={styles.budgetField}
                  placeholder="0원"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                />
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionTitleGroup}>
                <h2 className={styles.sectionTitle}>자치회 대표 사진 업로드</h2>
                <p className={styles.sectionDescription}>자치회 배경 이미지를 선택해주세요.</p>
              </div>
              <div className={styles.photoUpload}>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  style={{ display: 'none' }}
                />
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="대표 사진"
                    style={{ width: '100%', borderRadius: '12px', objectFit: 'cover', maxHeight: '200px', cursor: 'pointer' }}
                    onClick={() => photoInputRef.current?.click()}
                  />
                ) : (
                  <button
                    className={styles.photoUploadButton}
                    onClick={() => photoInputRef.current?.click()}
                  >
                    사진 업로드
                  </button>
                )}
              </div>
            </section>
          </>
        )}

        {step === 2 && (
          <>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>팀원 초대</h2>
              <p className={styles.sectionDescription}>
                함께할 팀원을 최소 1명 이상 등록해주세요.
              </p>
              <div className={styles.teamMembers}>
                <button className={styles.addMemberButton} onClick={handleAddMember}>
                  <div className={styles.addMemberIcon}>+</div>
                  <span className={styles.addMemberLabel}>추가하기</span>
                </button>
                {teamMembers.map((member) => (
                  <div key={member.id} className={styles.memberItem} onClick={() => handleRemoveMember(member.id)}>
                    <div
                      className={`${styles.memberAvatar} ${
                        member.avatarColor === 'blue' ? styles.memberAvatarBlue :
                        member.avatarColor === 'lightBlue' ? styles.memberAvatarLightBlue :
                        styles.memberAvatarGray
                      }`}
                    />
                    <span className={styles.memberName}>{member.name}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.ruleSectionHeader}>
                <h2 className={styles.sectionTitle}>자치회 활동 규칙</h2>
                <button className={styles.ruleAddBtn} onClick={handleAddRule}>
                  규칙 추가
                </button>
              </div>
              <div className={styles.ruleInputWrapper}>
                <input
                  type="text"
                  className={styles.ruleInput}
                  placeholder="새로운 규칙을 입력해주세요"
                  value={newRuleInput}
                  onChange={(e) => setNewRuleInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddRule() }}
                />
                {newRuleInput && (
                  <button className={styles.ruleClearBtn} onClick={() => setNewRuleInput('')}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="10" fill="#074ED8"/>
                      <path d="M7 7L13 13M7 13L13 7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                )}
              </div>
              {rules.map((rule, index) => (
                <div key={index} className={styles.ruleItem}>
                  <span className={styles.ruleItemText}>{rule}</span>
                  <button className={styles.ruleClearBtn} onClick={() => handleRemoveRule(index)}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="10" fill="#074ED8"/>
                      <path d="M7 7L13 13M7 13L13 7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              ))}
            </section>
          </>
        )}
      </main>

      <div className={styles.submitButtonContainer}>
        {step === 1 ? (
          <button
            className={`${styles.submitButton} ${isStep1Valid ? styles.submitButtonActive : styles.submitButtonDisabled}`}
            onClick={handleNext}
            disabled={!isStep1Valid}
          >
            다음
          </button>
        ) : (
          <button
            className={`${styles.submitButton} ${isStep2Valid ? styles.submitButtonActive : styles.submitButtonDisabled}`}
            onClick={handleSubmit}
            disabled={!isStep2Valid || isSubmitting}
          >
            등록 신청하기
          </button>
        )}
      </div>
    </div>
  )
}

export default CouncilRegister
