import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getMockUserById, MockUser } from '@/data/mockUsers'
import { isAuthenticated } from '@/services/authService'
import PublicSolidCard from './components/PublicSolidCard'
import LoginPromptModal from './components/LoginPromptModal'
import styles from './PublicProfile.module.css'

function PublicProfilePage() {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const [userData, setUserData] = useState<MockUser | null>(null)
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

    const user = getMockUserById(userId)
    if (user) {
      setUserData(user)
    } else {
      setError('사용자를 찾을 수 없습니다.')
    }
    setIsLoading(false)
  }, [userId])

  const handleAddToNetwork = () => {
    if (!isAuthenticated()) {
      setShowLoginModal(true)
    } else {
      addToNetwork()
    }
  }

  const addToNetwork = () => {
    const existingNetwork = JSON.parse(localStorage.getItem('userNetwork') || '[]')

    if (!existingNetwork.includes(userId)) {
      existingNetwork.push(userId)
      localStorage.setItem('userNetwork', JSON.stringify(existingNetwork))
    }

    setIsAdded(true)

    setTimeout(() => {
      setIsAdded(false)
    }, 3000)
  }

  const handleLoginRedirect = () => {
    localStorage.setItem('returnUrl', `/profile/${userId}`)
    localStorage.setItem('pendingNetworkAdd', userId || '')
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
          <button
            className={styles.backButton}
            onClick={() => navigate('/')}
          >
            홈으로 돌아가기
          </button>
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
        userName={userData.name}
      />
    </div>
  )
}

export default PublicProfilePage
