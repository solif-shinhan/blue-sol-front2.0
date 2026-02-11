import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles1 from './CouncilRegister-1.module.css'
import styles2 from './CouncilRegister-2.module.css'
import { useCouncilStatus, useSessionStorage, clearSessionGroup } from '@/hooks'
import { BackHeader } from '@/components/BackHeader'
import { createCouncil, getProfile, type ProfileData } from '@/services'
import { uploadFile } from '@/services/fileService'
import characterCat from '@/assets/images/character-cat.png'
import logoShinhan from '@/assets/images/logo-shinhan-foundation.png'
import removeIcon from '@/assets/images/council/4d69de4e468b2fc4fdb0dd71f55c582bcd74c605.svg'
import plusIcon from '@/assets/figma/4de7b4619a8a7217458e36fa3215adb3643f60eb.svg'

const styles = { ...styles1, ...styles2 }

interface RegisterMember {
  userId: number
  name: string
  profileImageUrl?: string
}

const AVATAR_COLORS = ['blue', 'lightBlue', 'gray'] as const

export function CouncilRegister() {
  const navigate = useNavigate()
  const { setHasCouncil } = useCouncilStatus()
  const [showSuccess, setShowSuccess] = useState(false)
  const [registeredName, setRegisteredName] = useState('')
  const [step, setStep] = useSessionStorage('council-reg:step', 1)

  const [formData, setFormData] = useSessionStorage('council-reg:form', {
    councilName: '',
    activityRegion: '',
    activityTopic: '',
    introduction: '',
    budget: '',
  })

  const [rules, setRules] = useSessionStorage<string[]>('council-reg:rules', [])
  const [newRuleInput, setNewRuleInput] = useState('')

  const [teamMembers, setTeamMembers] = useSessionStorage<RegisterMember[]>('council-reg:members', [])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [photoPreview, setPhotoPreview] = useSessionStorage<string | null>('council-reg:photo', null)
  const [photoFileId, setPhotoFileId] = useSessionStorage<number | null>('council-reg:photoFileId', null)
  const photoInputRef = useRef<HTMLInputElement>(null)
  const [myProfile, setMyProfile] = useState<ProfileData | null>(null)

  useEffect(() => {
    getProfile().then(res => {
      if (res.success) setMyProfile(res.data)
    }).catch(() => {})
  }, [])

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    const reader = new FileReader()
    reader.onload = () => setPhotoPreview(reader.result as string)
    reader.readAsDataURL(file)
    try {
      const uploaded = await uploadFile(file, 'COUNCIL_REVIEW')
      setPhotoFileId(uploaded.fileId)
    } catch (err) {
      console.error('사진 업로드 실패:', err)
    }
  }

  const isStep1Valid =
    formData.councilName.trim() !== '' &&
    formData.activityRegion.trim() !== '' &&
    formData.activityTopic.trim() !== ''

  const isStep2Valid =
    teamMembers.length >= 1 &&
    (rules.length > 0 || newRuleInput.trim() !== '')

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddMember = () => {
    navigate('/exchange/council/member/add')
  }

  const handleRemoveMember = (userId: number) => {
    setTeamMembers(prev => prev.filter(m => m.userId !== userId))
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

    // 입력 중인 규칙이 있으면 자동 추가
    const finalRules = [...rules]
    if (newRuleInput.trim()) {
      finalRules.push(newRuleInput.trim())
      setRules(finalRules)
      setNewRuleInput('')
    }

    setIsSubmitting(true)
    try {
      const budgetNum = parseInt(formData.budget.replace(/[^0-9]/g, ''), 10) || 0
      const response = await createCouncil({
        councilName: formData.councilName,
        region: formData.activityRegion,
        activityCategory: formData.activityTopic,
        description: formData.introduction || undefined,
        totalBudget: budgetNum,
        profileImageFileId: photoFileId || undefined,
        memberUserIds: teamMembers.map(m => m.userId),
        rules: finalRules.length > 0 ? finalRules : undefined,
      })

      if (response.success) {
        setRegisteredName(formData.councilName)
        clearSessionGroup('council-reg:')
        setHasCouncil(true)
        setShowSuccess(true)
        setTimeout(() => {
          navigate('/exchange')
        }, 4000)
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
      navigate('/exchange')
    }
  }

  if (showSuccess) {
    return (
      <div className={styles.successOverlay}>
        <img
          src={characterCat}
          alt="마스코트"
          className={styles.successMascot}
        />
        <p className={styles.successCouncilName}>{registeredName}</p>
        <h2 className={styles.successTitle}>자치회 등록 완료</h2>
        <div className={styles.successLogo}>
          <img
            src={logoShinhan}
            alt="신한장학재단"
            className={styles.successLogoIcon}
          />
          <span className={styles.successLogoText}>신한장학재단</span>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <BackHeader title="자치회 등록하기" onBack={handleBack} />

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
                {photoPreview && (
                  <img
                    src={photoPreview}
                    alt="대표 사진"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '12px'
                    }}
                  />
                )}
                <button
                  className={styles.photoUploadButton}
                  onClick={() => photoInputRef.current?.click()}
                  style={{ position: 'relative', zIndex: 1 }}
                >
                  사진 업로드
                </button>
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
                <div className={styles.memberItem}>
                  <div className={`${styles.memberAvatar} ${styles.memberAvatarBlue}`}>
                    {myProfile?.characterImageUrl && (
                      <img src={myProfile.characterImageUrl} alt="나"
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    )}
                  </div>
                  <span className={styles.meName}>나</span>
                </div>
                {teamMembers.map((member, index) => {
                  const colorClass = AVATAR_COLORS[index % AVATAR_COLORS.length]
                  return (
                    <div key={member.userId} className={styles.memberItem}>
                      <button className={styles.memberRemoveBtn} onClick={() => handleRemoveMember(member.userId)}>
                        <img src={removeIcon} alt="삭제" />
                      </button>
                      <div
                        className={`${styles.memberAvatar} ${
                          colorClass === 'blue' ? styles.memberAvatarBlue :
                          colorClass === 'lightBlue' ? styles.memberAvatarLightBlue :
                          styles.memberAvatarGray
                        }`}
                      >
                        {member.profileImageUrl && (
                          <img src={member.profileImageUrl} alt={member.name}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        )}
                      </div>
                      <span className={styles.memberName}>{member.name}</span>
                    </div>
                  )
                })}
                <div className={styles.addMemberButton} onClick={handleAddMember}>
                  <div className={styles.addMemberCircle}>
                    <img src={plusIcon} alt="추가" className={styles.addMemberIcon} />
                  </div>
                  <span className={styles.addMemberLabel}>추가하기</span>
                </div>
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
