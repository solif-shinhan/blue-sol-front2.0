import styles from '../Login.module.css'
import purunLogo from '@assets/images/purun.svg'
import solLogo from '@assets/images/SOL.svg'
import loginBack from '@assets/images/loginback.png'

export function HeroSection() {
  return (
    <div
      className={styles.heroSection}
      style={{
        backgroundImage: `url(${loginBack})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#FFFFFF',
        position: 'relative'
      }}
    >
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '117px',
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 100%)',
          pointerEvents: 'none'
        }}
      />
      <p className={styles.tagline}>너와 나, 우리 솔잎들의 꿈을 응원해</p>
      <h1 className={styles.logoText}>
        <img src={purunLogo} alt="푸른" className={styles.logoPurun} />
        <img src={solLogo} alt="SOL" className={styles.logoSol} />
      </h1>
    </div>
  )
}
