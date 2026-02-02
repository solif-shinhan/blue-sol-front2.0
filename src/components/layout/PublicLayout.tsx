import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import styles from './PublicLayout.module.css'

function PublicLayout() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Outlet />
      </div>
    </main>
  )
}

export default PublicLayout
