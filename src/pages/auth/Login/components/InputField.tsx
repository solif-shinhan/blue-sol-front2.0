/**
 * InputField Component
 * 
 * 커스텀 입력 필드 컴포넌트 - Figma 디자인 스펙 준수
 * - 20px 파란색 커스텀 커서
 * - 값 입력 시 파란색 테두리
 * - 비밀번호: 커스텀 도트 마스킹
 */
import { useState } from 'react'
import styles from '../Login.module.css'
import type { InputFieldProps } from '../types'

/** 파란색 깜빡이는 커서 컴포넌트 */
const BlueCursor = () => <span className={styles.blueCursor} />

/** 플레이스홀더 텍스트 컴포넌트 */
const Placeholder = ({ text }: { text: string }) => (
  <span className={styles.placeholderText}>{text}</span>
)

/** 비밀번호 도트 컴포넌트 */
const PasswordDot = () => (
  <img
    src="/BlackDot88.svg"
    alt=""
    className={styles.passwordDot}
    aria-hidden="true"
  />
)

export function InputField({
  type,
  name,
  placeholder,
  value,
  error,
  autoComplete,
  onChange
}: InputFieldProps) {
  const [isFocused, setIsFocused] = useState(false)

  const isPassword = type === 'password'
  const hasValue = Boolean(value?.length)

  // 클래스명 조합
  const wrapperClassName = [
    styles.inputWrapper,
    hasValue && styles.inputWrapperActive,
    error && styles.inputWrapperError
  ].filter(Boolean).join(' ')

  const hiddenInputClassName = [
    styles.input,
    isPassword ? styles.hiddenPasswordInput : styles.hiddenTextInput
  ].join(' ')

  // 포커스 핸들러
  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)

  // 공통 hidden input props
  const inputProps = {
    type: isPassword ? 'password' : type,
    name,
    className: hiddenInputClassName,
    placeholder: '',
    value,
    onChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
    autoComplete
  }

  // 커서 또는 플레이스홀더 렌더링
  const renderCursorOrPlaceholder = () => (
    isFocused
      ? <BlueCursor />
      : <Placeholder text={placeholder} />
  )

  return (
    <div className={styles.inputGroup}>
      <div className={wrapperClassName}>
        {/* Hidden functional input */}
        <input {...inputProps} />

        {/* Visual display layer */}
        {isPassword ? (
          <div className={styles.passwordDotsContainer}>
            {hasValue ? (
              <div className={styles.passwordDots}>
                {Array.from({ length: value.length }).map((_, i) => (
                  <PasswordDot key={i} />
                ))}
                {isFocused && <BlueCursor />}
              </div>
            ) : (
              renderCursorOrPlaceholder()
            )}
          </div>
        ) : (
          <div className={styles.textDisplayContainer}>
            {hasValue ? (
              <span className={styles.textDisplay}>
                {value}
                {isFocused && <BlueCursor />}
              </span>
            ) : (
              renderCursorOrPlaceholder()
            )}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  )
}
