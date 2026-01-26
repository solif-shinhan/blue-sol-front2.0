import { useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { recognizeReceipt } from '@/services/ocrService'
import styles from './ReceiptAttach.module.css'

interface ReceiptImage {
  id: string
  file: File
  preview: string
}

function ReceiptAttachPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const expenseIndex = (location.state as { expenseIndex?: number })?.expenseIndex ?? 0

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [receiptImages, setReceiptImages] = useState<ReceiptImage[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [recognizedAmount, setRecognizedAmount] = useState<number>(0)
  const [totalAmount, setTotalAmount] = useState<number>(0)

  const handleClose = () => {
    navigate(-1)
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // input value 리셋 (같은 파일 재선택 가능하도록)
    e.target.value = ''

    const preview = URL.createObjectURL(file)
    const newImage: ReceiptImage = {
      id: Date.now().toString(),
      file,
      preview,
    }

    setReceiptImages((prev) => [...prev, newImage])
    setIsProcessing(true)

    try {
      const result = await recognizeReceipt(file)
      setRecognizedAmount(result.amount)
      setTotalAmount((prev) => prev + result.amount)
    } catch {
      // API 에러 시 임시 금액 사용 (데모용)
      const demoAmount = 7080
      setRecognizedAmount(demoAmount)
      setTotalAmount((prev) => prev + demoAmount)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleAddMore = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
      fileInputRef.current.click()
    }
  }

  const handleComplete = () => {
    navigate('/exchange/write/review', {
      state: {
        receiptAmount: totalAmount,
        expenseIndex,
      },
    })
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
      fileInputRef.current.click()
    }
  }

  return (
    <div className={styles.container}>
      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {/* 헤더 */}
      <header className={styles.header}>
        <button className={styles.closeButton} onClick={handleClose}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M1 1L15 15M15 1L1 15" stroke="#222222" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <h1 className={styles.headerTitle}>영수증 첨부</h1>
        <div className={styles.headerSpacer}></div>
      </header>

      {/* 메인 콘텐츠 */}
      <div className={styles.content}>
        {receiptImages.length === 0 ? (
          /* 이미지 없을 때 - 첨부 안내 */
          <div className={styles.emptyState} onClick={triggerFileInput}>
            <div className={styles.emptyIcon}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect x="4" y="8" width="40" height="32" rx="4" stroke="#AAAAAA" strokeWidth="2"/>
                <path d="M4 32L16 24L24 30L36 20L44 28" stroke="#AAAAAA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="14" cy="18" r="3" stroke="#AAAAAA" strokeWidth="2"/>
              </svg>
            </div>
            <p className={styles.emptyText}>터치하여 영수증을 촬영하거나<br/>갤러리에서 선택하세요</p>
          </div>
        ) : (
          /* 이미지 있을 때 - 영수증 미리보기 */
          <div className={styles.receiptPreview}>
            <img
              src={receiptImages[receiptImages.length - 1].preview}
              alt="영수증"
              className={styles.receiptImage}
            />
            {isProcessing && (
              <div className={styles.processingOverlay}>
                <div className={styles.processingSpinner}></div>
                <p className={styles.processingText}>영수증 정보를 인식 중입니다.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 하단 결과 영역 */}
      {receiptImages.length > 0 && (
        <div className={styles.resultSection}>
          <div className={styles.resultRow}>
            <span className={styles.resultLabel}>현재 영수증 인식액</span>
            <span className={styles.resultAmount}>
              {recognizedAmount.toLocaleString()}원
            </span>
          </div>
          <div className={styles.resultRow}>
            <span className={styles.resultLabel}>오늘의 총 지출액</span>
            <span className={styles.resultAmountBlue}>
              {totalAmount.toLocaleString()}원
            </span>
          </div>

          {/* 썸네일 카운트 */}
          <div className={styles.thumbnailSection}>
            <div className={styles.thumbnailWrapper}>
              <img
                src={receiptImages[receiptImages.length - 1].preview}
                alt=""
                className={styles.thumbnail}
              />
              <span className={styles.thumbnailCount}>{receiptImages.length}</span>
            </div>
          </div>
        </div>
      )}

      {/* 하단 버튼 */}
      <div className={styles.footer}>
        {receiptImages.length > 0 ? (
          <>
            <button className={styles.addMoreButton} onClick={handleAddMore}>
              추가 첨부
            </button>
            <button className={styles.completeButton} onClick={handleComplete}>
              첨부 완료
            </button>
          </>
        ) : (
          <button className={styles.completeButtonFull} onClick={triggerFileInput}>
            영수증 촬영하기
          </button>
        )}
      </div>
    </div>
  )
}

export default ReceiptAttachPage
