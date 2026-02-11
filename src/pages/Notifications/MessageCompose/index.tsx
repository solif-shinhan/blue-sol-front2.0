import { useState, useEffect, Fragment } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import styles from './MessageCompose.module.css'
import { BackHeader } from '@/components/BackHeader'
import { ImageUploadSection, type ImageItem } from '@/components/ImageUploadSection'
import { sendMessage, getNetworkList, type NetworkFriend } from '@/services'
import { apiClient } from '@/api'

interface Recipient {
  userId: number
  name: string
  image?: string
  tags: string[]
}

interface SearchUser {
  userId: number
  name: string
  userType?: string
  region: string
  schoolName?: string
  profileImageUrl?: string
}

interface DisplayUser {
  userId: number
  name: string
  region?: string
  school?: string
  profileImageUrl?: string
}

function MessageComposePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [images, setImages] = useState<ImageItem[]>([])
  const [isSending, setIsSending] = useState(false)

  // 받는 사람
  const recipientFromUrl = searchParams.get('userId')
  const [recipient, setRecipient] = useState<Recipient | null>(() => {
    const name = searchParams.get('to') || ''
    const userId = searchParams.get('userId') || ''
    if (!name || !userId) return null
    const tag = searchParams.get('tag') || ''
    const image = searchParams.get('img') || ''
    return {
      userId: Number(userId),
      name,
      image: image || undefined,
      tags: tag ? tag.split('|').map(t => t.trim()) : [],
    }
  })

  // 검색 모드
  const [isSearching, setIsSearching] = useState(false)
  const [searchTab, setSearchTab] = useState<'network' | 'all'>('network')
  const [searchQuery, setSearchQuery] = useState('')
  const [networkFriends, setNetworkFriends] = useState<DisplayUser[]>([])
  const [searchResults, setSearchResults] = useState<DisplayUser[]>([])
  const [isNetworkLoaded, setIsNetworkLoaded] = useState(false)

  const currentUserId = Number(localStorage.getItem('userId') || '0')

  // 교류망 로드
  useEffect(() => {
    if (isNetworkLoaded) return
    const load = async () => {
      try {
        const res = await getNetworkList()
        if (res.success) {
          setNetworkFriends(
            (res.data.addedFriends || [])
              .filter((f: NetworkFriend) => f.userId !== currentUserId)
              .map((f: NetworkFriend) => ({
                userId: f.userId,
                name: f.userName,
                profileImageUrl: f.characterImageUrl,
              }))
          )
        }
      } catch { /* ignore */ }
      setIsNetworkLoaded(true)
    }
    load()
  }, [isNetworkLoaded])

  // 전체 검색 (디바운스 300ms)
  useEffect(() => {
    if (searchTab !== 'all') return
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }
    const timer = setTimeout(async () => {
      try {
        const res = await apiClient.get<{
          code: string; message: string; success: boolean; data: SearchUser[]
        }>('/api/v1/users/search', { keyword: searchQuery.trim() })
        if (res.success) {
          setSearchResults(
            res.data
              .filter(u => u.userId !== currentUserId)
              .map(u => ({
                userId: u.userId,
                name: u.name,
                region: u.region,
                school: u.userType || u.schoolName,
                profileImageUrl: u.profileImageUrl,
              }))
          )
        }
      } catch { /* ignore */ }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, searchTab])

  const displayList = searchTab === 'network'
    ? networkFriends.filter(f => !searchQuery.trim() || f.name.includes(searchQuery))
    : searchResults

  const isValid = title.trim().length > 0 && content.trim().length > 0 && !!recipient

  const handleClose = () => navigate(-1)

  const handleSubmit = async () => {
    if (!isValid || isSending || !recipient) return
    setIsSending(true)
    try {
      const fileIds = images.map(img => img.fileId).filter((id): id is number => id !== undefined)
      const res = await sendMessage({
        receiverId: recipient.userId,
        messageTitle: title.trim(),
        messageContent: content.trim(),
        ...(fileIds.length > 0 ? { fileIds } : {}),
      })
      if (res.success) {
        navigate('/notifications?tab=activity&sub=message&sent=true')
      }
    } catch {
      alert('쪽지 전송에 실패했습니다.')
    } finally {
      setIsSending(false)
    }
  }

  const handleSelectRecipient = (user: DisplayUser) => {
    setRecipient({
      userId: user.userId,
      name: user.name,
      image: user.profileImageUrl,
      tags: [user.school, user.region].filter(Boolean) as string[],
    })
    setIsSearching(false)
    setSearchQuery('')
  }

  const handleOpenSearch = () => {
    setIsSearching(true)
  }

  const handleClearRecipient = () => {
    setRecipient(null)
  }

  return (
    <div className={styles.container}>
      <BackHeader
        title={isSearching ? '받는 사람' : '쪽지 보내기'}
        icon={isSearching ? 'back' : 'close'}
        onBack={isSearching ? () => setIsSearching(false) : handleClose}
      />

      <div className={styles.topCard}>
        {!isSearching ? (
          <>
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
                {recipient ? (
                  <div className={styles.recipientCard} onClick={handleClearRecipient} style={!recipientFromUrl ? { cursor: 'pointer' } : undefined}>
                    <div className={styles.recipientLeft}>
                      <div className={styles.recipientAvatar}>
                        {recipient.image ? (
                          <img src={recipient.image} alt={recipient.name} />
                        ) : (
                          <span className={styles.avatarFallback}>
                            {recipient.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <span className={styles.recipientName}>{recipient.name}</span>
                    </div>
                    {recipient.tags.length > 0 && (
                      <div className={styles.recipientRight}>
                        {recipient.tags.map((tag, idx) => (
                          <Fragment key={idx}>
                            <span className={styles.recipientTag}>{tag}</span>
                            {idx < recipient.tags.length - 1 && (
                              <span className={styles.tagDivider} />
                            )}
                          </Fragment>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={styles.fieldInput} onClick={handleOpenSearch} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#848484' }}>
                    입력해주세요
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={styles.searchTabs}>
              <button
                className={`${styles.searchTab} ${searchTab === 'network' ? styles.searchTabActive : ''}`}
                onClick={() => { setSearchTab('network'); setSearchQuery(''); setSearchResults([]) }}
              >
                나의 교류망
              </button>
              <button
                className={`${styles.searchTab} ${searchTab === 'all' ? styles.searchTabActive : ''}`}
                onClick={() => { setSearchTab('all'); setSearchQuery(''); setSearchResults([]) }}
              >
                전체 검색
              </button>
            </div>
            <div className={styles.searchBox}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="이름을 입력해주세요"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                autoFocus
              />
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={styles.searchIcon}>
                <circle cx="10.5" cy="10.5" r="7" stroke="#848484" strokeWidth="1.8"/>
                <path d="M16 16L21 21" stroke="#848484" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
          </>
        )}
      </div>

      {isSearching ? (
        <div className={styles.searchResults}>
          {displayList.length === 0 ? (
            <div className={styles.emptyState}>
              {searchTab === 'all' && !searchQuery.trim()
                ? '이름을 입력하여 검색하세요.'
                : '결과가 없습니다.'}
            </div>
          ) : (
            displayList.map(user => (
              <div
                key={user.userId}
                className={styles.userCard}
                onClick={() => handleSelectRecipient(user)}
              >
                <div className={styles.userAvatar}>
                  {user.profileImageUrl ? (
                    <img src={user.profileImageUrl} alt={user.name} />
                  ) : (
                    <span className={styles.avatarFallback}>{user.name.charAt(0)}</span>
                  )}
                </div>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{user.name}</span>
                  <div className={styles.userMeta}>
                    {user.school && <span className={styles.userMetaText}>{user.school}</span>}
                    {user.school && user.region && <span className={styles.userMetaDivider} />}
                    {user.region && <span className={styles.userMetaText}>{user.region}</span>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <>
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
              <ImageUploadSection
                images={images}
                setImages={setImages}
                uploadCategory="POST"
                className={styles.imageUploadWrapper}
              />
            </div>
          </div>

          <div className={styles.submitSection}>
            <button
              className={`${styles.submitButton} ${isValid ? styles.submitButtonActive : ''}`}
              onClick={handleSubmit}
              disabled={!isValid || isSending}
            >
              {isSending ? '전송 중...' : '보내기'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default MessageComposePage
