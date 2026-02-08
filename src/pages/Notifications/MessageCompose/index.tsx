import { useState, Fragment } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import styles from './MessageCompose.module.css'

function MessageComposePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const recipientName = searchParams.get('to') || ''
  const recipientTag = searchParams.get('tag') || ''
  const recipientImage = searchParams.get('img') || ''

  const isValid = title.trim().length > 0 && content.trim().length > 0

  const handleClose = () => {
    navigate(-1)
  }

  const handleSubmit = () => {
    if (!isValid) return
    console.log('Send message:', { title, content, recipientName })
    navigate('/notifications?tab=activity&sub=message&sent=true')
  }

  const tags = recipientTag ? recipientTag.split('|').map(t => t.trim()) : []

  return (
    <div className={styles.container}>
      <div className={styles.topCard}>
        <header className={styles.header}>
          <button className={styles.closeButton} onClick={handleClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#848484" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
          <span className={styles.headerTitle}>쪽지 보내기</span>
        </header>

        <div className={styles.addButtonArea}>
          <button className={styles.addButton}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#074ED8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
          </button>
        </div>

        <div className={styles.formSections}>
          <div className={styles.section}>
            <p className={styles.sectionLabel}>제목</p>
            <input
              className={styles.fieldInput}
              type="text"
              placeholder="입력해주세요"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div className={styles.section}>
            <p className={styles.sectionLabel}>받는 사람</p>
            {recipientName ? (
              <div className={styles.recipientCard}>
                <div className={styles.recipientLeft}>
                  <div className={styles.recipientAvatar}>
                    {recipientImage ? (
                      <img src={recipientImage} alt={recipientName} />
                    ) : (
                      <span className={styles.avatarFallback}>
                        {recipientName.charAt(0)}
                      </span>
                    )}
                  </div>
                  <span className={styles.recipientName}>{recipientName}</span>
                </div>
                {tags.length > 0 && (
                  <div className={styles.recipientRight}>
                    {tags.map((tag, idx) => (
                      <Fragment key={idx}>
                        <span className={styles.recipientTag}>{tag}</span>
                        {idx < tags.length - 1 && (
                          <span className={styles.tagDivider} />
                        )}
                      </Fragment>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <input
                className={styles.fieldInput}
                type="text"
                placeholder="입력해주세요"
                readOnly
              />
            )}
          </div>
        </div>
      </div>

      <div className={styles.bottomContent}>
        <div className={styles.section}>
          <p className={styles.sectionLabel}>내용을 작성해주세요</p>
          <div className={styles.textareaWrapper}>
            <textarea
              className={styles.textarea}
              placeholder={'자유롭게 내용을 작성해 주세요.\n타인에게 불쾌감을 주는 내용은 삭제될 수 있습니다.'}
              value={content}
              onChange={e => setContent(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className={styles.submitSection}>
        <button
          className={`${styles.submitButton} ${isValid ? styles.submitButtonActive : ''}`}
          onClick={handleSubmit}
          disabled={!isValid}
        >
          보내기
        </button>
      </div>
    </div>
  )
}

export default MessageComposePage
