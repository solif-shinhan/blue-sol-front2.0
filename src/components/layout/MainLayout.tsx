import { useEffect, useRef, useState, useCallback } from 'react'
import { Outlet, useLocation, useNavigationType } from 'react-router-dom'
import styles from './MainLayout.module.css'

const TAB_ORDER: Record<string, number> = {
  '/home': 0,
  '/exchange': 1,
  '/growth': 2,
}

function MainLayout() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const mainRef = useRef<HTMLElement>(null)
  const prevPathRef = useRef(location.pathname)
  const [transitionClass, setTransitionClass] = useState('')

  const getTabIndex = useCallback((path: string) => {
    return TAB_ORDER[path] ?? -1
  }, [])

  useEffect(() => {
    const prevPath = prevPathRef.current
    const currPath = location.pathname
    prevPathRef.current = currPath

    const prevIdx = getTabIndex(prevPath)
    const currIdx = getTabIndex(currPath)

    // 탭 간 전환일 때만 모션 적용
    if (prevIdx >= 0 && currIdx >= 0 && prevIdx !== currIdx) {
      const direction = currIdx > prevIdx ? 'right' : 'left'
      setTransitionClass(direction === 'right' ? styles.slideFromRight : styles.slideFromLeft)

      const timer = setTimeout(() => setTransitionClass(''), 350)
      return () => clearTimeout(timer)
    }

    // 뒤로가기(POP)일 때는 스크롤 위치 유지
    if (navigationType !== 'POP') {
      mainRef.current?.scrollTo(0, 0)
      document.querySelector('.app-container')?.scrollTo(0, 0)
    }
  }, [location.pathname, getTabIndex, navigationType])

  return (
    <main className={`${styles.main} ${transitionClass}`} ref={mainRef}>
      <Outlet />
    </main>
  )
}

export default MainLayout
