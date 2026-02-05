import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './ApplicationHistory.module.css'

import backArrowIcon from '@/assets/images/exchange-mentoring/back-arrow.svg'
import profilePlaceholder from '@/assets/images/exchange-mentoring/dot-small.svg'

interface Application {
  id: number
  name: string
  date: string
  title: string
  preview: string
  profileImage?: string
}

const SENT_APPLICATIONS: Application[] = [
  {
    id: 1,
    name: '김솔잎',
    date: '1일 전',
    title: '안녕하세요! 저는 한국고등학교에 다니고 있는 김...',
    preview: '안녕하세요! 이번 학기에 멘토링 신청을 하고 싶습니다. 저는 현...',
  },
  {
    id: 2,
    name: '김솔잎',
    date: '5일 전',
    title: '안녕하세요! 저는 한국고등학교에 다니고 있는 김...',
    preview: '안녕하세요! 이번 학기에 멘토링 신청을 하고 싶습니다. 저는 현...',
  },
]

const RECEIVED_APPLICATIONS: Application[] = [
  {
    id: 1,
    name: '김솔잎',
    date: '1일 전',
    title: '안녕하세요! 저는 한국고등학교에 다니고 있는 김...',
    preview: '안녕하세요! 이번 학기에 멘토링 신청을 하고 싶습니다. 저는 현...',
  },
  {
    id: 2,
    name: '김솔잎',
    date: '5일 전',
    title: '안녕하세요! 저는 한국고등학교에 다니고 있는 김...',
    preview: '안녕하세요! 이번 학기에 멘토링 신청을 하고 싶습니다. 저는 현...',
  },
]

function ApplicationHistoryPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('sent')

  const handleBack = () => {
    navigate(-1)
  }

  const applications = activeTab === 'sent' ? SENT_APPLICATIONS : RECEIVED_APPLICATIONS

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <button className={styles.backButton} onClick={handleBack}>
            <img src={backArrowIcon} alt="뒤로가기" />
          </button>
          <span className={styles.headerTitle}>신청 내역</span>
        </div>
      </div>

      <div className={styles.tabBar}>
        <button
          className={`${styles.tab} ${activeTab === 'sent' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('sent')}
        >
          내가 보낸 신청서
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'received' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('received')}
        >
          받은 신청서
        </button>
      </div>

      <div className={styles.listContainer}>
        {applications.map((item) => (
          <div key={item.id} className={styles.listItem}>
            <div className={styles.listItemInner}>
              <div className={styles.itemHeader}>
                <div className={styles.itemProfile}>
                  <img
                    src={item.profileImage || profilePlaceholder}
                    alt={item.name}
                    className={styles.profileImage}
                  />
                  <span className={styles.profileName}>{item.name}</span>
                </div>
                <span className={styles.itemDate}>{item.date}</span>
              </div>
              <div className={styles.itemContent}>
                <p className={styles.itemTitle}>{item.title}</p>
                <p className={styles.itemPreview}>{item.preview}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ApplicationHistoryPage
