import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './StrengthMore.module.css'
import { BackHeader } from '@/components/BackHeader'
import { logout } from '@/services'

import imgCard1 from '@/assets/figma/4c6534fee9eb246a7cea6aed1a9a2d8639cfdad2.png'
import imgCard2 from '@/assets/figma/fabe58cbb60ee8f3d3b8e143872401a7fa60afa8.png'
import imgCard3 from '@/assets/figma/934e97687908b818ee69693b86fa45fd64e203b8.png'
import imgCard4 from '@/assets/figma/358d4b60e088c3256ccd8ae2882245092e4ee9a9.png'
import imgCard5 from '@/assets/figma/c222a3c46fab4dcf6408689b064ee443dd7009e4.png'
import imgCard6 from '@/assets/figma/17507cb1f13cfcb60b8bc0371e19fb8485bf5081.png'
import imgCard7 from '@/assets/figma/1bbbf311747e57c63b19e1fc0c29ce7a98e851c3.png'
import imgCard8 from '@/assets/figma/7d567232c802ebaed288a2b74ed248f3a70ee64c.png'
import imgFooterLogo from '@/assets/images/057453724e8f804d5306e38ceabfcf7513cbed10.png'

interface ProgramCard {
  category: string
  title: string
  author: string
  image: string
}

const ALL_CARDS: ProgramCard[] = [
  { category: '취업', title: '어떤 삶을 살고 싶나요?\n나를 아십니까?', author: '포어시스 원종화 대표님', image: imgCard1 },
  { category: '인성', title: '실패와 시행착오는\n다른 것이다', author: '조은빛 강사님', image: imgCard2 },
  { category: '과학', title: "AI가 못하는 '우리'만이\n할 수 있는 것", author: '최재붕 교수님', image: imgCard3 },
  { category: '사회', title: '돈은 잠을 자지 않는다\n글로벌 금융 이슈 점검', author: '오건영 단장님', image: imgCard4 },
  { category: '사회', title: "'정의'란 문제가 있다면,\n다시 다투는 것", author: '박준영 변호사님', image: imgCard5 },
  { category: '인성', title: "오늘부터 '그럴 줄 알았어'이 말 하지 마세요", author: '김경일 교수님', image: imgCard6 },
  { category: '사회', title: '위기가 곧 기회가 되는 삶 | 장애, 약점이 준 ...', author: '신홍윤 강사', image: imgCard7 },
  { category: '사회', title: "축구 전설들이 '성공'한 비밀 | 어떻게 그들은...", author: '박문성 해설 위원님', image: imgCard8 },
]

const CATEGORIES = ['전체', '인성', '사회', '과학', '창업', '취업']

function StrengthMorePage() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('전체')

  const filteredCards = activeCategory === '전체'
    ? ALL_CARDS
    : ALL_CARDS.filter(card => card.category === activeCategory)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className={styles.container}>
      <BackHeader title="푸른 SOL 역량강화" showSearch />

      <div className={styles.content}>
        <div className={styles.categoryTabs}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`${styles.categoryTab} ${activeCategory === cat ? styles.categoryTabActive : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className={styles.cardGrid}>
          {filteredCards.map((card, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.cardImageWrap}>
                <img src={card.image} alt={card.category} className={styles.cardImage} />
              </div>
              <div className={styles.cardDarkOverlay} />
              <div className={styles.cardBottom}>
                <div className={styles.cardInfo}>
                  <div className={styles.cardTexts}>
                    <span className={styles.cardCategory}>{card.category}</span>
                    <div className={styles.cardTitle}>{card.title}</div>
                  </div>
                  <div className={styles.cardAuthor}>
                    <span>{card.author}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <button type="button" className={styles.footerButton} onClick={handleLogout}>
            로그아웃
          </button>
          <button type="button" className={styles.footerButton}>
            <img src={imgFooterLogo} alt="신한장학재단" className={styles.footerLogo} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default StrengthMorePage
