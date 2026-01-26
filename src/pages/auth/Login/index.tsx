import styles from './Login.module.css'
import { useLoginForm } from './useLoginForm'
import { HeroSection, InputField, Footer } from './components'

function LoginPage() {
  const {
    formData,
    errors,
    isLoading,
    isFormValid,
    handleInputChange,
    handleSubmit,
    handleSignUp
  } = useLoginForm()

  const loginButtonClassName = [
    styles.loginButton,
    isFormValid && styles.loginButtonActive
  ].filter(Boolean).join(' ')

  return (
    <div className={styles.container}>
      <HeroSection />

      <div className={styles.formSection}>
        <h2 className={styles.formTitle}>로그인</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <InputField
            type="text"
            name="userId"
            placeholder="아이디"
            value={formData.userId}
            error={errors.userId}
            autoComplete="username"
            onChange={handleInputChange}
          />

          <InputField
            type="password"
            name="password"
            placeholder="비밀번호"
            value={formData.password}
            error={errors.password}
            autoComplete="current-password"
            onChange={handleInputChange}
          />

          <button
            type="submit"
            className={loginButtonClassName}
            disabled={isLoading || !isFormValid}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <button
          type="button"
          className={styles.signUpButton}
          onClick={handleSignUp}
        >
          회원가입
        </button>

        <Footer />
      </div>
    </div>
  )
}

export default LoginPage
