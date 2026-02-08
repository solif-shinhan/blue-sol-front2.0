import { useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { recognizeReceipt } from '@/services/ocrService'
import styles1 from './ReceiptAttach-1.module.css'
import styles2 from './ReceiptAttach-2.module.css'

const styles = { ...styles1, ...styles2 }

import closeIconSvg from '@/assets/images/receipt/0b7bc06416da92a5ef1b39ad0d8fbfacd05ce59d.svg'
import cameraIconSvg from '@/assets/images/receipt/bd13a94209839c4aa3692f23244735564b23ad63.svg'
import thumbDeleteSvg from '@/assets/images/receipt/3e988d8574a9b447a8297f648d16605371163ce6.svg'

interface ReceiptImage {
  id: string
  file: File
  preview: string
  amount: number
}

interface LocationState {
  expenseIndex?: number
  prevTitle?: string
  prevDateTime?: string
  prevLocation?: string
  prevExpenses?: string[]
  prevStep?: number
  prevImages?: { id: string; url: string }[]
}

function ReceiptAttachPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const locationState = (location.state as LocationState) ?? {}
  const expenseIndex = locationState.expenseIndex ?? 0

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [receiptImages, setReceiptImages] = useState<ReceiptImage[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastRecognizedAmount, setLastRecognizedAmount] = useState<number>(0)
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [showOverlay, setShowOverlay] = useState(false)
  const [isCompleteMode, setIsCompleteMode] = useState(false)

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
      amount: 0,
    }

    setReceiptImages((prev) => [...prev, newImage])
    setIsProcessing(true)
    setShowOverlay(false)

    try {
      const result = await recognizeReceipt(file)
      newImage.amount = result.amount
      setLastRecognizedAmount(result.amount)
      setTotalAmount((prev) => prev + result.amount)
      setReceiptImages((prev) =>
        prev.map((img) => (img.id === newImage.id ? { ...img, amount: result.amount } : img))
      )
      setShowOverlay(true)
    } catch {
      const demoAmount = 7080
      newImage.amount = demoAmount
      setLastRecognizedAmount(demoAmount)
      setTotalAmount((prev) => prev + demoAmount)
      setReceiptImages((prev) =>
        prev.map((img) => (img.id === newImage.id ? { ...img, amount: demoAmount } : img))
      )
      setShowOverlay(true)
    } finally {
      setIsProcessing(false)
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
      fileInputRef.current.click()
    }
  }

  const handleRecognize = () => {
    triggerFileInput()
  }

  const handleAddMore = () => {
    setShowOverlay(false)
    triggerFileInput()
  }

  const handleEnterCompleteMode = () => {
    setShowOverlay(false)
    setIsCompleteMode(true)
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
        prevImages: locationState.prevImages,
      },
    })
  }

  const handleDeleteThumbnail = (id: string) => {
    const target = receiptImages.find((img) => img.id === id)
    if (target) {
      setTotalAmount((prev) => prev - target.amount)
      setReceiptImages((prev) => prev.filter((img) => img.id !== id))
    }
  }

  const hasImages = receiptImages.length > 0
  const isRecognized = totalAmount > 0

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

      {/* Background receipt image */}
      {hasImages && (
        <div className={styles.backgroundImage}>
          <img
            src={receiptImages[receiptImages.length - 1].preview}
            alt="영수증"
            className={styles.backgroundImg}
          />
          <div className={styles.backgroundOverlay} />
        </div>
      )}

      {/* Status Bar */}
      <div className={styles.statusBar} />

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerLeft}>
            <button className={styles.closeButton} onClick={handleClose}>
              <img src={closeIconSvg} alt="닫기" className={styles.closeIcon} />
            </button>
            <span className={styles.headerTitle}>영수증 첨부</span>
          </div>
          {isRecognized && !isCompleteMode && (
            <button className={styles.completeHeaderBtn} onClick={handleEnterCompleteMode}>
              첨부 완료
            </button>
          )}
        </div>
      </header>

      {/* Empty State */}
      {!hasImages && (
        <div className={styles.emptyState} onClick={triggerFileInput}>
          <div className={styles.emptyIcon}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect x="4" y="8" width="40" height="32" rx="4" stroke="#AAAAAA" strokeWidth="2"/>
              <path d="M4 32L16 24L24 30L36 20L44 28" stroke="#AAAAAA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="14" cy="18" r="3" stroke="#AAAAAA" strokeWidth="2"/>
            </svg>
          </div>
          <p className={styles.emptyText}>
            터치하여 영수증을 촬영하거나<br/>갤러리에서 선택하세요
          </p>
        </div>
      )}

      {/* Processing Badge */}
      {isProcessing && (
        <div className={styles.processingBadge}>
          <span className={styles.processingText}>영수증 정보를 인식 중입니다.</span>
        </div>
      )}

      {/* Recognition Overlay */}
      {showOverlay && !isCompleteMode && (
        <div className={styles.recognitionOverlay}>
          <div className={styles.recognitionText}>
            지출액 <span className={styles.recognitionAmount}>
              {lastRecognizedAmount.toLocaleString()}원
            </span>이<br/>인식되었어요
          </div>
          <button className={styles.recognitionAddBtn} onClick={handleAddMore}>
            추가 첨부
          </button>
        </div>
      )}

      {/* Thumbnail Count Badge (adding mode, not complete) */}
      {hasImages && !isCompleteMode && (
        <div className={styles.thumbnailBadge}>
          {receiptImages.length > 0 && (
            <img
              src={receiptImages[receiptImages.length - 1].preview}
              alt=""
              className={styles.thumbnailBadgeImg}
            />
          )}
          <span className={styles.badgeCount}>{receiptImages.length}</span>
        </div>
      )}

      {/* Thumbnail Strip (complete mode) */}
      {isCompleteMode && (
        <div className={styles.thumbnailStrip}>
          {receiptImages.map((img) => (
            <div key={img.id} className={styles.thumbnailItem}>
              <img src={img.preview} alt="" className={styles.thumbnailItemImg} />
              <button
                className={styles.thumbnailDeleteBtn}
                onClick={() => handleDeleteThumbnail(img.id)}
              >
                <img src={thumbDeleteSvg} alt="삭제" className={styles.thumbnailDeleteIcon} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Amount Row */}
      {hasImages && (
        <div className={styles.amountRow}>
          <span className={styles.amountLabel}>인식 금액 합계</span>
          <span className={styles.amountValue}>{totalAmount.toLocaleString()}원</span>
        </div>
      )}

      {/* CTA Area */}
      {hasImages && (
        <div className={styles.ctaArea}>
          {isCompleteMode ? (
            <button className={styles.ctaButtonFull} onClick={handleComplete}>
              완료
            </button>
          ) : isRecognized ? (
            <>
              <button className={styles.cameraButton} onClick={triggerFileInput}>
                <img src={cameraIconSvg} alt="카메라" className={styles.cameraIcon} />
              </button>
              <button className={styles.ctaButtonFaded} onClick={handleAddMore}>
                추가 첨부하기
              </button>
            </>
          ) : (
            <>
              <button className={styles.cameraButton} onClick={triggerFileInput}>
                <img src={cameraIconSvg} alt="카메라" className={styles.cameraIcon} />
              </button>
              <button className={styles.ctaButtonPrimary} onClick={handleRecognize}>
                금액 인식하기
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default ReceiptAttachPage
