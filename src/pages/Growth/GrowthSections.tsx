import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles3 from './Growth-3.module.css'
import { logout } from '@/services'

import imgStrength1 from '@/assets/images/4c6534fee9eb246a7cea6aed1a9a2d8639cfdad2.png'
import imgStrength2 from '@/assets/images/fabe58cbb60ee8f3d3b8e143872401a7fa60afa8.png'
import imgProgram1 from '@/assets/images/3ce87ab504c87594c1b2c5eba6b473640a497399.png'
import imgProgram2 from '@/assets/images/f9cdf2005f3ffddb0c78e2a16505ee85e7c83a4e.png'
import imgProgram3 from '@/assets/images/ad0824640eed8a29aab77ffe6cf64fcf6d1d3801.png'
import imgFooterLogo from '@/assets/images/057453724e8f804d5306e38ceabfcf7513cbed10.png'

// 역량강화 섹션
export const StrengthSection = () => {
  const [activeTab, setActiveTab] = useState('사회')
  const categories = ['사회', '인성', '과학', '취업']
  const cards = [
    {
      category: '취업',
      title: '어떤 삶을 살고 싶나요?\n나를 아십니까?',
      author: '포어시스 원종화 대표님',
      image: imgStrength1
    },
    {
      category: '인성',
      title: '실패와 시행착오는\n다른 것이다',
      author: '조은빛 강사님',
      image: imgStrength2
    }
  ]

  return (
    <div className={styles3.strengthSection}>
      <div className={styles3.strengthHeader}>
        <div className={styles3.strengthTitleRow}>
          <span className={styles3.strengthTitle}>푸른 SOL 역량강화</span>
          <button className={styles3.moreButton}>더보기</button>
        </div>
        <div className={styles3.categoryTabs}>
          {categories.map(cat => (
            <button
              key={cat}
              className={`${styles3.categoryTab} ${activeTab === cat ? styles3.categoryTabActive : ''}`}
              onClick={() => setActiveTab(cat)}
            >
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </div>
      <div className={styles3.strengthGrid}>
        {cards.map((card, index) => (
          <div key={index} className={styles3.strengthCard}>
            <div className={styles3.strengthCardBg}>
              <img src={card.image} alt={card.category} />
            </div>
            <div className={styles3.strengthCardOverlay} />
            <div className={styles3.strengthCardContent}>
              <div className={styles3.strengthCardInfo}>
                <div className={styles3.strengthCardTexts}>
                  <span className={styles3.strengthCardCategory}>{card.category}</span>
                  <div className={styles3.strengthCardTitle}>{card.title}</div>
                </div>
                <div className={styles3.strengthCardAuthor}>
                  <span>{card.author}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 장학 프로그램 섹션
export const ProgramSection = () => {
  const programs = [
    {
      org: '신한장학재단',
      likes: 24,
      comments: 8,
      date: '2026.02.19',
      title: '2025.9.11 임직원 직무 멘토링',
      desc: '신한금융그룹 임직원분들과 함께 HR, 브랜드, 사회공헌, 투자 직무 멘토링을 진행하...',
      image: imgProgram1
    },
    {
      org: '신한장학재단',
      likes: 24,
      comments: 8,
      date: '2026.02.19',
      title: '2025년 신한장학캠프 진행',
      desc: '신한장학재단에서는 2025년 7월 11일 장학캠프를 개최하였습니다.',
      image: imgProgram2
    },
    {
      org: '신한장학재단',
      likes: 24,
      comments: 8,
      date: '2026.02.19',
      title: "신한장학재단 '2025년 자립준...",
      desc: "지난 3월 21일, 서울 명동에 위치한 신한 익스페이스에서 '자립준비청년 장학지원사...",
      image: imgProgram3
    }
  ]

  return (
    <div className={styles3.programSection}>
      <div className={styles3.programHeader}>
        <span className={styles3.programTitle}>장학 프로그램</span>
        <button className={styles3.moreButton}>더보기</button>
      </div>
      <div className={styles3.programList}>
        {programs.map((program, index) => (
          <div key={index} className={styles3.programItem}>
            <div className={styles3.programThumbnail}>
              <img src={program.image} alt={program.title} />
            </div>
            <div className={styles3.programContent}>
              <div className={styles3.programMeta}>
                <span className={styles3.programOrg}>{program.org}</span>
                <div className={styles3.programDivider} />
                <div className={styles3.programStats}>
                  <div className={styles3.programStat}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M9 4L10.5 7H14L11 9.5L12 13L9 11L6 13L7 9.5L4 7H7.5L9 4Z" fill="#C8C8C8"/>
                    </svg>
                    <span className={styles3.programStatText}>{program.likes}</span>
                  </div>
                  <div className={styles3.programStat}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M3 5C3 4.44772 3.44772 4 4 4H14C14.5523 4 15 4.44772 15 5V11C15 11.5523 14.5523 12 14 12H6L3 15V5Z" fill="#C8C8C8"/>
                    </svg>
                    <span className={styles3.programStatText}>{program.comments}</span>
                  </div>
                </div>
                <div className={styles3.programDivider} />
                <span className={styles3.programDate}>{program.date}</span>
              </div>
              <div className={styles3.programTexts}>
                <span className={styles3.programItemTitle}>{program.title}</span>
                <p className={styles3.programDesc}>{program.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 푸터
export const Footer = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className={styles3.footer}>
      <button type="button" className={styles3.footerButton} onClick={handleLogout}>
        <span>로그아웃</span>
      </button>
      <button type="button" className={styles3.footerButton}>
        <img src={imgFooterLogo} alt="신한장학재단" className={styles3.footerLogo} />
      </button>
    </div>
  )
}
