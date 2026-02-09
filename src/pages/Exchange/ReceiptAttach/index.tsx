import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { uploadFile, recognizeReceiptOcr } from '@/services/fileService'
import styles1 from './ReceiptAttach-1.module.css'
import styles2 from './ReceiptAttach-2.module.css'

const styles = { ...styles1, ...styles2 }

import closeIconSvg from '@/assets/images/receipt/0b7bc06416da92a5ef1b39ad0d8fbfacd05ce59d.svg'
import cameraIconSvg from '@/assets/images/receipt/bd13a94209839c4aa3692f23244735564b23ad63.svg'
import thumbDeleteSvg from '@/assets/images/receipt/3e988d8574a9b447a8297f648d16605371163ce6.svg'

const SCAN_KEYWORDS = ['합계', '결제금액', '총액', '카드결제', 'Total']
const SCAN_DURATION = 3000

interface ReceiptImage {
  id: string
  file: File
  preview: string
  amount: number
  fileId?: number
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
  const [isScanning, setIsScanning] = useState(false)
  const [scanKeywordIdx, setScanKeywordIdx] = useState(0)
  const [lastRecognizedAmount, setLastRecognizedAmount] = useState<number>(0)
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [showResult, setShowResult] = useState(false)
  const [isCompleteMode, setIsCompleteMode] = useState(false)

  const pendingResultRef = useRef<{ amount: number; imageId: string; fileId: number } | null>(null)
  const scanTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Rotate scan keywords during scanning
  useEffect(() => {
    if (!isScanning) return
    const interval = setInterval(() => {
      setScanKeywordIdx((prev) => (prev + 1) % SCAN_KEYWORDS.length)
    }, 600)
    return () => clearInterval(interval)
  }, [isScanning])

  // Show result after scan completes (minimum 3s + API done)
  const finishScan = useCallback(() => {
    const result = pendingResultRef.current
    if (!result) return

    setReceiptImages((prev) =>
      prev.map((img) =>
        img.id === result.imageId
          ? { ...img, amount: result.amount, fileId: result.fileId }
          : img
      )
    )
    setLastRecognizedAmount(result.amount)
    setTotalAmount((prev) => prev + result.amount)
    pendingResultRef.current = null
    setIsScanning(false)
    setShowResult(true)
  }, [])

  const handleClose = () => {
    navigate(-1)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setShowResult(false)
  }

  const handleRecognize = async () => {
    const lastImage = receiptImages[receiptImages.length - 1]
    if (!lastImage || lastImage.fileId || isScanning) return

    setIsScanning(true)
    setScanKeywordIdx(0)
    pendingResultRef.current = null

    // Start minimum 3s timer
    let scanDone = false
    let apiDone = false

    const tryFinish = () => {
      if (scanDone && apiDone) finishScan()
    }

    scanTimerRef.current = setTimeout(() => {
      scanDone = true
      tryFinish()
    }, SCAN_DURATION)

    try {
      const uploaded = await uploadFile(lastImage.file, 'COUNCIL_REVIEW')
      const amount = await recognizeReceiptOcr(uploaded.fileId)
      pendingResultRef.current = { amount, imageId: lastImage.id, fileId: uploaded.fileId }
      apiDone = true
      tryFinish()
    } catch (err) {
      console.error('영수증 인식 실패:', err)
      if (scanTimerRef.current) clearTimeout(scanTimerRef.current)
      setIsScanning(false)
      alert('영수증 인식에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
      fileInputRef.current.click()
    }
  }

  const handleAddMore = () => {
    setShowResult(false)
    triggerFileInput()
  }

  const handleEnterCompleteMode = () => {
    setShowResult(false)
    setIsCompleteMode(true)
  }

  const handleComplete = () => {
    const receiptFileIds = receiptImages
      .filter((img) => img.fileId)
      .map((img) => img.fileId as number)
    navigate('/exchange/write/review', {
      state: {
        receiptAmount: totalAmount,
        receiptFileId: receiptFileIds[0] ?? null,
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

      {/* Scanning animation overlay */}
      {isScanning && (
        <div className={styles.scanOverlay}>
          <div className={styles.scanLine} />
          <div className={styles.scanKeyword} style={{ top: '45%' }}>
            {SCAN_KEYWORDS[scanKeywordIdx]} 인식 중...
          </div>
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
          {isRecognized && !isCompleteMode && !isScanning && (
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
      {isScanning && (
        <div className={styles.processingBadge}>
          <span className={styles.processingText}>영수증 정보를 인식 중입니다.</span>
        </div>
      )}

      {/* Recognition Result Popup */}
      {showResult && !isCompleteMode && (
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

      {/* Thumbnail Count Badge */}
      {hasImages && !isCompleteMode && !isScanning && (
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
      {hasImages && !isScanning && (
        <div className={styles.amountRow}>
          <span className={styles.amountLabel}>인식 금액 합계</span>
          <span className={styles.amountValue}>{totalAmount.toLocaleString()}원</span>
        </div>
      )}

      {/* CTA Area */}
      {hasImages && !isScanning && (
        <div className={styles.ctaArea}>
          {isCompleteMode ? (
            <button className={styles.ctaButtonFull} onClick={handleComplete}>
              완료
            </button>
          ) : showResult ? (
            <>
              <button className={styles.cameraButton} onClick={handleAddMore}>
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
              <button
                className={styles.ctaButtonPrimary}
                onClick={handleRecognize}
              >
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
