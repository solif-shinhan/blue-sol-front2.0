import { Outlet } from 'react-router-dom'
import styles from './MainLayout.module.css'

function MainLayout() {
  return (
    <main className={styles.main}>
      <Outlet />
    </main>
  )
}

export default MainLayout
