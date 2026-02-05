import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '@/services/authService'
import type { LoginFormData, LoginFormErrors } from './types'

const INITIAL_FORM_DATA: LoginFormData = {
  userId: '',
  password: ''
}

const INITIAL_ERRORS: LoginFormErrors = {
  userId: '',
  password: ''
}

export function useLoginForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<LoginFormData>(INITIAL_FORM_DATA)
  const [errors, setErrors] = useState<LoginFormErrors>(INITIAL_ERRORS)
  const [isLoading, setIsLoading] = useState(false)

  const isFormValid = formData.userId.trim() !== '' && formData.password.trim() !== ''

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (errors[name as keyof LoginFormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = { userId: '', password: '' }
    let isValid = true

    if (!formData.userId.trim()) {
      newErrors.userId = '유효하지 않은 장학생 번호입니다.'
      isValid = false
    }

    if (!formData.password.trim()) {
      newErrors.password = '비밀번호를 다시 확인해주세요.'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)

    try {
      const response = await login({
        loginId: formData.userId,
        password: formData.password
      })

      if (response.success) {
        const pendingNetworkAdd = localStorage.getItem('pendingNetworkAdd')
        if (pendingNetworkAdd) {
          const existingNetwork = JSON.parse(localStorage.getItem('userNetwork') || '[]')
          if (!existingNetwork.includes(pendingNetworkAdd)) {
            existingNetwork.push(pendingNetworkAdd)
            localStorage.setItem('userNetwork', JSON.stringify(existingNetwork))
          }
          localStorage.removeItem('pendingNetworkAdd')
        }

        const returnUrl = localStorage.getItem('returnUrl')
        if (returnUrl) {
          localStorage.removeItem('returnUrl')
          navigate(returnUrl)
        } else {
          const isFirstTimeUser = !localStorage.getItem('hasCompletedOnboarding')
          navigate(isFirstTimeUser ? '/onboarding' : '/home')
        }
      } else {
        setErrors({
          userId: '',
          password: response.message || '로그인에 실패했습니다.'
        })
      }
    } catch (error) {
      setErrors({
        userId: '',
        password: error instanceof Error ? error.message : '로그인에 실패했습니다.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = () => {
    navigate('/register')
  }

  return {
    formData,
    errors,
    isLoading,
    isFormValid,
    handleInputChange,
    handleSubmit,
    handleSignUp
  }
}
