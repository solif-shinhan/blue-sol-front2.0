import { forwardRef } from 'react'
import styles from './FormRow.module.css'

interface FormRowProps {
  /** 라벨 텍스트 */
  label: string
  /** input name 속성 */
  name: string
  /** input type */
  type?: 'text' | 'password' | 'email' | 'tel' | 'number'
  /** placeholder 텍스트 */
  placeholder?: string
  /** 현재 값 */
  value: string
  /** 값 변경 핸들러 */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  /** 에러 메시지 */
  error?: string
  /** 필수 필드 여부 */
  required?: boolean
  /** 비활성화 여부 */
  disabled?: boolean
  /** autocomplete 속성 */
  autoComplete?: string
  /** 레이아웃 변형: vertical(기본) 또는 horizontal(라벨-인풋 가로 배치) */
  variant?: 'vertical' | 'horizontal'
  /** 추가 클래스명 */
  className?: string
}

export const FormRow = forwardRef<HTMLInputElement, FormRowProps>(
  (
    {
      label,
      name,
      type = 'text',
      placeholder = '입력해주세요',
      value,
      onChange,
      error,
      required = false,
      disabled = false,
      autoComplete,
      variant = 'vertical',
      className = '',
    },
    ref
  ) => {
    const rowClass = variant === 'horizontal'
      ? `${styles.formRow} ${styles.horizontal} ${className}`
      : `${styles.formRow} ${className}`

    const labelClass = variant === 'horizontal'
      ? `${styles.label} ${styles.labelHorizontal}`
      : styles.label

    const inputClass = variant === 'horizontal'
      ? `${styles.input} ${styles.inputHorizontal} ${error ? styles.inputError : ''}`
      : `${styles.input} ${error ? styles.inputError : ''}`

    return (
      <div className={rowClass}>
        <label className={labelClass} htmlFor={name}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
        <input
          ref={ref}
          id={name}
          name={name}
          type={type}
          className={inputClass}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          autoComplete={autoComplete}
        />
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    )
  }
)

FormRow.displayName = 'FormRow'

export default FormRow
