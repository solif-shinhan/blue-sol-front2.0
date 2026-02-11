import { useState, useEffect } from 'react'
import { getRequiredPrograms, getOptionalPrograms } from '@/services/scholarshipService'
import { ScholarshipProgram } from '@/api/types-scholarship'
import { BackHeader } from '@/components/BackHeader'
import styles from './ProgramMore.module.css'

const API_BASE = import.meta.env.VITE_API_URL || ''
const toFullUrl = (path: string | null | undefined): string | undefined => {
  if (!path) return undefined
  if (path.startsWith('http') || path.startsWith('blob')) return path
  return `${API_BASE}/${path}`
}

const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}

const truncateContent = (content: string, maxLength = 80): string => {
  if (content.length <= maxLength) return content
  return content.substring(0, maxLength) + '..'
}

const ProgramMore = () => {
  const [activeTab, setActiveTab] = useState<'required' | 'optional'>('optional')
  const [programs, setPrograms] = useState<ScholarshipProgram[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPrograms(activeTab)
  }, [activeTab])

  const loadPrograms = async (tab: 'required' | 'optional') => {
    setLoading(true)
    const data = tab === 'required'
      ? await getRequiredPrograms()
      : await getOptionalPrograms()
    setPrograms(data)
    setLoading(false)
  }

  return (
    <div className={styles.container}>
      <BackHeader title="장학 프로그램" showSearch />

      <div className={styles.tabContainer}>
        <button
          className={`${styles.tabButton} ${activeTab === 'required' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('required')}
        >
          필수 프로그램
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'optional' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('optional')}
        >
          선택 프로그램
        </button>
      </div>

      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>로딩 중...</div>
        ) : programs.length > 0 ? (
          <div className={styles.programList}>
            {programs.map((program) => (
              <div key={program.postId} className={styles.programItem}>
                <div className={styles.programContent}>
                  <div className={styles.programMeta}>
                    <span className={styles.programOrg}>신한장학재단</span>
                    <div className={styles.programDivider} />
                    <div className={styles.programStats}>
                      <span className={styles.programStat}>
                        <img src="/eyes.svg" alt="" className={styles.statIcon} /> {program.viewCount}
                      </span>
                      <span className={styles.programStat}>
                        <img src="/talk.svg" alt="" className={styles.statIcon} /> {program.commentCount}
                      </span>
                    </div>
                    <div className={styles.programDivider} />
                    <span className={styles.programDate}>{formatDate(program.createdAt)}</span>
                  </div>
                  <div className={styles.programTexts}>
                    <h3 className={styles.programTitle}>{program.title}</h3>
                    <p className={styles.programDesc}>{truncateContent(program.content)}</p>
                  </div>
                </div>
                {program.thumbnailUrl && (
                  <div className={styles.programThumbnail}>
                    <img
                      src={toFullUrl(program.thumbnailUrl)}
                      alt=""
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>등록된 장학 프로그램이 없습니다.</div>
        )}
      </div>
    </div>
  )
}

export default ProgramMore
