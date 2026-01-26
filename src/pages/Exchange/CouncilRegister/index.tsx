import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles1 from './CouncilRegister-1.module.css'
import styles2 from './CouncilRegister-2.module.css'
import { useCouncilStatus } from '@/hooks'

// Merge styles
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

    // Form state
    const [formData, setFormData] = useState({
        councilName: '',
        leader: '',
        activityRegion: '',
        activityTopic: '',
        activityRule: '',
        activityGoal: ''
    })

    // Team members (mock data for filled state)
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])

    // Check if form is valid
    const isFormValid =
        formData.councilName.trim() !== '' &&
        formData.leader.trim() !== '' &&
        formData.activityRegion.trim() !== '' &&
        formData.activityTopic.trim() !== '' &&
        formData.activityRule.trim() !== '' &&
        formData.activityGoal.trim() !== '' &&
        teamMembers.length > 0

    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleAddMember = () => {
        // Mock: Add a random member
        const colors: TeamMember['avatarColor'][] = ['blue', 'lightBlue', 'gray']
        const names = ['추가하기', '김강무', '최태환', '김윤혁', '신대현', '도윤팸']
        const newMember: TeamMember = {
            id: Date.now().toString(),
            name: names[teamMembers.length + 1] || '새멤버',
            avatarColor: colors[teamMembers.length % colors.length]
        }
        setTeamMembers(prev => [...prev, newMember])
    }

    const handleSubmit = () => {
        if (isFormValid) {
            setHasCouncil(true)
            setShowSuccess(true)
            // Auto close after 3 seconds
            setTimeout(() => {
                navigate('/exchange')
            }, 3000)
        }
    }

    const handleBack = () => {
        navigate(-1)
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
            {/* Header */}
            <header className={styles.header}>
                <button className={styles.backButton} onClick={handleBack}>
                    <img src="/←.svg" alt="뒤로가기" />
                </button>
                <h1 className={styles.headerTitle}>자치회 등록하기</h1>
                <button className={styles.searchButton}>
                    <img src="/search.svg" alt="검색" />
                </button>
            </header>

            {/* Content */}
            <main className={styles.content}>
                {/* 기본 정보 입력 */}
                <section className={styles.formSection}>
                    <h2 className={styles.formSectionTitle}>기본 정보 입력</h2>
                    <div className={styles.inputGroup}>
                        <div className={styles.inputRow}>
                            <label className={styles.inputLabel}>자치회 이름</label>
                            <input
                                type="text"
                                className={`${styles.inputField} ${formData.councilName ? styles.inputFieldActive : ''}`}
                                placeholder="입력해주세요"
                                value={formData.councilName}
                                onChange={(e) => handleInputChange('councilName', e.target.value)}
                            />
                        </div>
                        <div className={styles.inputRow}>
                            <label className={styles.inputLabel}>리더</label>
                            <input
                                type="text"
                                className={`${styles.inputField} ${formData.leader ? styles.inputFieldActive : ''}`}
                                placeholder="입력해주세요"
                                value={formData.leader}
                                onChange={(e) => handleInputChange('leader', e.target.value)}
                            />
                        </div>
                        <div className={styles.inputRow}>
                            <label className={styles.inputLabel}>활동 지역</label>
                            <input
                                type="text"
                                className={`${styles.inputField} ${formData.activityRegion ? styles.inputFieldActive : ''}`}
                                placeholder="입력해주세요"
                                value={formData.activityRegion}
                                onChange={(e) => handleInputChange('activityRegion', e.target.value)}
                            />
                        </div>
                        <div className={styles.inputRow}>
                            <label className={styles.inputLabel}>활동 주제</label>
                            <input
                                type="text"
                                className={`${styles.inputField} ${formData.activityTopic ? styles.inputFieldActive : ''}`}
                                placeholder="입력해주세요"
                                value={formData.activityTopic}
                                onChange={(e) => handleInputChange('activityTopic', e.target.value)}
                            />
                        </div>
                        <div className={styles.inputRow}>
                            <label className={styles.inputLabel}>활동 규칙</label>
                            <input
                                type="text"
                                className={`${styles.inputField} ${formData.activityRule ? styles.inputFieldActive : ''}`}
                                placeholder="입력해주세요"
                                value={formData.activityRule}
                                onChange={(e) => handleInputChange('activityRule', e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                {/* 팀원 초대 */}
                <section className={styles.teamSection}>
                    <h2 className={styles.teamSectionTitle}>팀원 초대</h2>
                    <p className={styles.teamSectionDescription}>
                        함께할 팀원을 최소 1명 이상 등록해주세요.
                    </p>
                    <div className={styles.teamMembers}>
                        <button className={styles.addMemberButton} onClick={handleAddMember}>
                            <div className={styles.addMemberIcon}>+</div>
                            <span className={styles.addMemberText}>추가하기</span>
                        </button>
                        {teamMembers.map((member) => (
                            <div key={member.id} className={styles.memberItem}>
                                <div
                                    className={`${styles.memberAvatar} ${member.avatarColor === 'blue' ? styles.memberAvatarBlue :
                                            member.avatarColor === 'lightBlue' ? styles.memberAvatarLightBlue :
                                                styles.memberAvatarGray
                                        }`}
                                />
                                <span className={styles.memberName}>{member.name}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 활동 목표 */}
                <section className={styles.goalSection}>
                    <h2 className={styles.goalSectionTitle}>활동 목표</h2>
                    <textarea
                        className={`${styles.goalTextarea} ${formData.activityGoal ? styles.goalTextareaActive : ''}`}
                        placeholder="입력해주세요"
                        value={formData.activityGoal}
                        onChange={(e) => handleInputChange('activityGoal', e.target.value)}
                    />
                </section>
            </main>

            {/* Submit Button */}
            <div className={styles.submitButtonContainer}>
                <button
                    className={`${styles.submitButton} ${isFormValid ? styles.submitButtonActive : styles.submitButtonDisabled}`}
                    onClick={handleSubmit}
                    disabled={!isFormValid}
                >
                    등록 신청하기
                </button>
            </div>
        </div>
    )
}

export default CouncilRegister
