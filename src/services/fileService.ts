const API_BASE_URL = import.meta.env.VITE_API_URL || ''

export type FileFolder = 'COUNCIL_REVIEW' | 'POST' | 'MENTORING'

export interface UploadedFile {
  fileId: number
  originalName: string
  contentType: string
  sizeBytes: number
  url: string
}

interface ApiResponse<T> {
  code?: string
  message?: string
  success?: boolean
  data: T
}

function isSuccess(res: { success?: boolean; code?: string }): boolean {
  if (res.success === true) return true
  if (res.code === 'SUCCESS' || res.code === '200' || res.code === 'OK') return true
  // HTTP 200이면 data 유무로 판단
  return res.success !== false
}

const MAX_FILE_SIZE = 1 * 1024 * 1024 // 1MB

function getToken(): string | null {
  return localStorage.getItem('accessToken')
}

function compressImage(file: File, maxSize: number): Promise<File> {
  return new Promise((resolve, reject) => {
    if (file.size <= maxSize) {
      resolve(file)
      return
    }

    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      const canvas = document.createElement('canvas')

      let { width, height } = img
      const scale = Math.min(1, 1600 / Math.max(width, height))
      width = Math.round(width * scale)
      height = Math.round(height * scale)

      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (!blob) { reject(new Error('이미지 압축 실패')); return }
          resolve(new File([blob], file.name, { type: 'image/jpeg' }))
        },
        'image/jpeg',
        0.7
      )
    }

    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('이미지 로드 실패')) }
    img.src = url
  })
}

export async function uploadFile(file: File, folder: FileFolder): Promise<UploadedFile> {
  const compressed = await compressImage(file, MAX_FILE_SIZE)
  const formData = new FormData()
  formData.append('files', compressed)

  const headers: Record<string, string> = {}
  const token = getToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}/api/files?folder=${folder}`, {
    method: 'POST',
    headers,
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`파일 업로드 실패: ${response.status}`)
  }

  const result = await response.json()

  // 응답이 배열 자체일 수도 있고, { data: [...] } 래핑일 수도 있음
  let uploaded: UploadedFile | undefined
  if (Array.isArray(result) && result.length > 0) {
    uploaded = result[0]
  } else if (result?.data) {
    const data = result.data
    if (Array.isArray(data) && data.length > 0) {
      uploaded = data[0]
    } else if (data.fileId !== undefined) {
      uploaded = data as UploadedFile
    }
  }

  if (!uploaded) {
    throw new Error('업로드된 파일 정보가 없습니다')
  }

  return uploaded
}

export async function recognizeReceiptOcr(fileId: number): Promise<number> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  const token = getToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/receipts/ocr`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ fileId }),
  })

  if (!response.ok) {
    throw new Error(`OCR 인식 실패: ${response.status}`)
  }

  const result: ApiResponse<{ amount: number }> = await response.json()
  console.log('[fileService] OCR response:', result)

  if (!isSuccess(result)) {
    throw new Error(result.message || 'OCR 인식 실패')
  }

  return result.data?.amount ?? 0
}
