import { useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { recognizeReceipt } from '@/services/ocrService'
import styles from './ReceiptAttach.module.css'

interface ReceiptImage {
  id: string
  file: File
  preview: string
}

type TabType = '내가 보낸 신청서' | '받은 신청서'

interface LocationState {
  expenseIndex?: number
  prevTitle?: string
  prevDateTime?: string
  prevLocation?: string
  prevExpenses?: string[]
  prevStep?: number
}

function ReceiptAttachPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const locationState = (location.state as LocationState) ?? {}
  const expenseIndex = locationState.expenseIndex ?? 0

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [receiptImages, setReceiptImages] = useState<ReceiptImage[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [recognizedAmount, setRecognizedAmount] = useState<number>(0)
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [activeTab, setActiveTab] = useState<TabType>('내가 보낸 신청서')

  const handleClose = () => {
    navigate(-1)
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

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
        prevTitle: locationState.prevTitle,
        prevDateTime: locationState.prevDateTime,
        prevLocation: locationState.prevLocation,
        prevExpenses: locationState.prevExpenses,
        prevStep: locationState.prevStep,
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
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {receiptImages.length > 0 && (
        <div className={styles.backgroundImage}>
          <img
            src={receiptImages[receiptImages.length - 1].preview}
            alt="영수증"
            className={styles.backgroundImg}
          />
          <div className={styles.backgroundOverlay} />
        </div>
      )}

      <div className={styles.statusBar} />

      <header className={styles.header}>
        <div className={styles.headerContent}>
          <button className={styles.closeButton} onClick={handleClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <span className={styles.headerTitle}>나의 자치회</span>
        </div>
      </header>

      <div className={styles.tabSwitch}>
        <button
          className={`${styles.tabButton} ${activeTab === '내가 보낸 신청서' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('내가 보낸 신청서')}
        >
          내가 보낸 신청서
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === '받은 신청서' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('받은 신청서')}
        >
          받은 신청서
        </button>
      </div>

      {receiptImages.length > 0 && (
        <div className={styles.scanArea} />
      )}

      <div className={styles.content}>
        {receiptImages.length === 0 ? (
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
          isProcessing && (
            <div className={styles.processingBadge}>
              <span className={styles.processingText}>영수증 정보를 인식 중입니다.</span>
            </div>
          )
        )}
      </div>

      {receiptImages.length > 0 && (
        <div className={styles.resultSection}>
          <div className={styles.resultInfo}>
            <div className={styles.resultRow}>
              <span className={styles.resultLabel}>현재 영수증 인식액</span>
              <span className={styles.resultAmountWhite}>
                {recognizedAmount.toLocaleString()}원
              </span>
            </div>
            <div className={styles.resultRow}>
              <span className={styles.resultLabel}>오늘의 총 지출액</span>
              <span className={styles.resultAmountGreen}>
                {totalAmount.toLocaleString()}원
              </span>
            </div>
          </div>

          <div className={styles.thumbnailWrapper}>
            <div className={styles.thumbnail}>
              {receiptImages.length > 0 && (
                <img
                  src={receiptImages[receiptImages.length - 1].preview}
                  alt=""
                  className={styles.thumbnailImg}
                />
              )}
            </div>
            <span className={styles.thumbnailCount}>{receiptImages.length}</span>
          </div>
        </div>
      )}

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
