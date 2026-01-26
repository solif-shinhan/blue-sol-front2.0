import styles from './Growth.module.css'

function GrowthPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>성장</h1>
        <p className={styles.subtitle}>나만의 성장 여정을 기록해요</p>
      </header>

      <section className={styles.section}>
        <div className={styles.treeCard}>
          <div className={styles.treeVisual}>
            <div className={styles.tree}>🌲</div>
            <div className={styles.treeLevel}>Lv. 5</div>
          </div>
          <div className={styles.treeInfo}>
            <h2>나의 성장 나무</h2>
            <p>솔방울 125개 모음</p>
            <div className={styles.treeProgress}>
              <div className={styles.treeProgressBar} style={{ width: '45%' }} />
            </div>
            <span className={styles.treeProgressText}>다음 레벨까지 55개</span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>나의 버킷리스트</h2>
        <div className={styles.bucketList}>
          <div className={styles.bucketItem}>
            <div className={styles.bucketCheck}>✓</div>
            <span className={styles.bucketText}>해외 봉사활동 참여하기</span>
          </div>
          <div className={styles.bucketItem}>
            <div className={styles.bucketCheck} data-pending="true" />
            <span className={styles.bucketText}>개발 프로젝트 완성하기</span>
          </div>
          <div className={styles.bucketItem}>
            <div className={styles.bucketCheck} data-pending="true" />
            <span className={styles.bucketText}>멘토링 5회 이상 참여</span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>푸른 SOL 프로그램</h2>
        <div className={styles.programList}>
          <button className={styles.programItem}>
            <span className={styles.programBadge}>필수</span>
            <span className={styles.programTitle}>리더십 역량 강화</span>
            <span className={styles.programStatus}>진행중</span>
          </button>
          <button className={styles.programItem}>
            <span className={styles.programBadge} data-type="optional">선택</span>
            <span className={styles.programTitle}>디자인 씽킹 워크숍</span>
            <span className={styles.programStatus}>신청가능</span>
          </button>
        </div>
      </section>
    </div>
  )
}

export default GrowthPage
