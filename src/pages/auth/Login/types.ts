export interface LoginFormData {
  userId: string
  password: string
}

export interface LoginFormErrors {
  userId: string
  password: string
}

export interface InputFieldProps {
  type: 'text' | 'password'
  name: keyof LoginFormData
  placeholder: string
  value: string
  error?: string
  autoComplete: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}
