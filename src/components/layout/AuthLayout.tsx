import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import styles from './AuthLayout.module.css'

function AuthLayout() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <main className={styles.main}>
      <Outlet />
    </main>
  )
}

export default AuthLayout
