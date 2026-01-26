import { Outlet } from 'react-router-dom'
import BottomNavigation from './BottomNavigation'
import styles from './MainLayout.module.css'

function MainLayout() {
  return (
    <>
      <main className={styles.main}>
        <Outlet />
      </main>
      <BottomNavigation />
    </>
  )
}

export default MainLayout
