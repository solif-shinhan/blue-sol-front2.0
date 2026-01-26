import styles from '../Login.module.css'
import flogo from '@assets/images/flogo.svg'

export function Footer() {
  return (
    <div className={styles.footer}>
      <img src={flogo} alt="신한장학재단" className={styles.footerLogo} />
    </div>
  )
}
