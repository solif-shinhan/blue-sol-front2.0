import { forwardRef } from 'react'
import styles from './FormRow.module.css'

interface FormRowProps {
  label: string
  name: string
  type?: 'text' | 'password' | 'email' | 'tel' | 'number'
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  required?: boolean
  disabled?: boolean
  autoComplete?: string
  variant?: 'vertical' | 'horizontal'
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
