import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import styles from './MainLayout.module.css'

function MainLayout() {
  const location = useLocation()
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <main className={styles.main} ref={mainRef}>
      <Outlet />
    </main>
  )
}

export default MainLayout
