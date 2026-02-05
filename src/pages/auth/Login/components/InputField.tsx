import { useState } from 'react'
import styles from '../Login.module.css'
import type { InputFieldProps } from '../types'

const BlueCursor = () => <span className={styles.blueCursor} />

const Placeholder = ({ text }: { text: string }) => (
  <span className={styles.placeholderText}>{text}</span>
)

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

  const wrapperClassName = [
    styles.inputWrapper,
    hasValue && styles.inputWrapperActive,
    error && styles.inputWrapperError
  ].filter(Boolean).join(' ')

  const hiddenInputClassName = [
    styles.input,
    isPassword ? styles.hiddenPasswordInput : styles.hiddenTextInput
  ].join(' ')

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)

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

  const renderCursorOrPlaceholder = () => (
    isFocused
      ? <BlueCursor />
      : <Placeholder text={placeholder} />
  )

  return (
    <div className={styles.inputGroup}>
      <div className={wrapperClassName}>
        <input {...inputProps} />

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

      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  )
}
