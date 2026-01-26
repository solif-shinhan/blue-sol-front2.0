import { useNavigate } from 'react-router-dom'
import styles from './MyPage.module.css'

function MyPagePage() {
  const navigate = useNavigate()

  const handleLogout = () => {
    // Clear any stored authentication data
    localStorage.removeItem('hasCompletedOnboarding')
    localStorage.removeItem('user')
    localStorage.removeItem('token')

    // Navigate to login page
    navigate('/')
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>마이페이지</h1>
      </header>

      <section className={styles.profileSection}>
        <div className={styles.profileCard}>
          <div className={styles.avatar}>
            <span>김</span>
          </div>
          <div className={styles.profileInfo}>
            <h2>김장학</h2>
            <p>kim.janghak@email.com</p>
            <span className={styles.badge}>15기 장학생</span>
          </div>
          <button className={styles.editButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>내 정보</h2>
        <div className={styles.menuList}>
          <button className={styles.menuItem}>
            <span className={styles.menuIcon}>👤</span>
            <span className={styles.menuText}>내 정보 수정</span>
            <span className={styles.menuArrow}>›</span>
          </button>
          <button className={styles.menuItem}>
            <span className={styles.menuIcon}>✏️</span>
            <span className={styles.menuText}>SOLID 편집</span>
            <span className={styles.menuArrow}>›</span>
          </button>
          <button className={styles.menuItem}>
            <span className={styles.menuIcon}>🔔</span>
            <span className={styles.menuText}>알림 설정</span>
            <span className={styles.menuArrow}>›</span>
          </button>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>서비스</h2>
        <div className={styles.menuList}>
          <button className={styles.menuItem}>
            <span className={styles.menuIcon}>❓</span>
            <span className={styles.menuText}>자주 묻는 질문</span>
            <span className={styles.menuArrow}>›</span>
          </button>
          <button className={styles.menuItem}>
            <span className={styles.menuIcon}>📞</span>
            <span className={styles.menuText}>문의하기</span>
            <span className={styles.menuArrow}>›</span>
          </button>
          <button className={styles.menuItem}>
            <span className={styles.menuIcon}>📋</span>
            <span className={styles.menuText}>이용약관</span>
            <span className={styles.menuArrow}>›</span>
          </button>
          <button className={styles.menuItem}>
            <span className={styles.menuIcon}>🔒</span>
            <span className={styles.menuText}>개인정보 처리방침</span>
            <span className={styles.menuArrow}>›</span>
          </button>
        </div>
      </section>

      <section className={styles.section}>
        <button className={styles.logoutButton} onClick={handleLogout}>
          로그아웃
        </button>
      </section>

      <footer className={styles.footer}>
        <p>푸른 SOL v1.0.0</p>
        <p>© 2026 신한장학재단</p>
      </footer>
    </div>
  )
}

export default MyPagePage

