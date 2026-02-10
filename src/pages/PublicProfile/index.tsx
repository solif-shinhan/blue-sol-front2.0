import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { isAuthenticated } from '@/services/authService'
import { getUserSolidCard, addToNetwork, type UserSolidCardResponse } from '@/services/networkService'
import PublicSolidCard from './components/PublicSolidCard'
import LoginPromptModal from './components/LoginPromptModal'
import styles from './PublicProfile.module.css'

export interface PublicUserData {
  userId: number
  userName: string
  solidGoalName: string
  mainGoals: string[]
  interests: string[]
  characterImageUrl?: string
  backgroundImageUrl?: string
  schoolName?: string
  isConnected: boolean
}

function PublicProfilePage() {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const [userData, setUserData] = useState<PublicUserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  useEffect(() => {
    if (!userId) {
      setError('사용자를 찾을 수 없습니다.')
      setIsLoading(false)
      return
    }

    const fetchUserData = async () => {
      try {
        const res: UserSolidCardResponse = await getUserSolidCard(Number(userId))
        if (res.success && res.data) {
          setUserData({
            userId: res.data.userId,
            userName: res.data.userName,
            solidGoalName: res.data.solidGoalName,
            mainGoals: res.data.mainGoals || [],
            interests: res.data.interests || [],
            characterImageUrl: res.data.characterImageUrl,
            backgroundImageUrl: res.data.backgroundImageUrl,
            schoolName: res.data.schoolName,
            isConnected: res.data.isConnected,
          })
          setIsAdded(res.data.isConnected)
        } else {
          setError('사용자를 찾을 수 없습니다.')
        }
      } catch {
        if (!isAuthenticated()) {
          setError('로그인 후 프로필을 확인할 수 있습니다.')
        } else {
          setError('사용자를 찾을 수 없습니다.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [userId])

  const handleAddToNetwork = async () => {
    if (!isAuthenticated()) {
      setShowLoginModal(true)
      return
    }

    if (!userId || isAdded) return

    try {
      const res = await addToNetwork({ targetUserId: Number(userId) })
      if (res.success) {
        setIsAdded(true)
        setTimeout(() => setIsAdded(false), 3000)
      }
    } catch (err) {
      console.error('교류망 추가 실패:', err)
    }
  }

  const handleLoginRedirect = () => {
    localStorage.setItem('returnUrl', `/profile/${userId}`)
    navigate('/login')
  }

  const handleCloseLoginModal = () => {
    setShowLoginModal(false)
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <p>로딩 중...</p>
        </div>
      </div>
    )
  }

  if (error || !userData) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <p>{error || '사용자를 찾을 수 없습니다.'}</p>
          {!isAuthenticated() ? (
            <button
              className={styles.backButton}
              onClick={handleLoginRedirect}
            >
              로그인하기
            </button>
          ) : (
            <button
              className={styles.backButton}
              onClick={() => navigate('/')}
            >
              홈으로 돌아가기
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <PublicSolidCard
        userData={userData}
        onAddNetwork={handleAddToNetwork}
        isAdded={isAdded}
      />

      <LoginPromptModal
        isOpen={showLoginModal}
        onClose={handleCloseLoginModal}
        onLogin={handleLoginRedirect}
        userName={userData.userName}
      />
    </div>
  )
}

export default PublicProfilePage
