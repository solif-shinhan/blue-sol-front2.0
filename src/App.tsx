import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import MainLayout from '@components/layout/MainLayout'
import AuthLayout from '@components/layout/AuthLayout'
import PublicLayout from '@components/layout/PublicLayout'
import { restoreAuth } from '@/services'
import { OnboardingProvider } from '@features/02-onboarding/context/OnboardingContext'

function lazyWithRetry(importFn: () => Promise<{ default: React.ComponentType }>) {
  return lazy(() =>
    importFn().catch(() => {
      const hasReloaded = sessionStorage.getItem('chunk_reload')
      if (!hasReloaded) {
        sessionStorage.setItem('chunk_reload', '1')
        window.location.reload()
        return { default: () => null }
      }
      sessionStorage.removeItem('chunk_reload')
      return importFn()
    })
  )
}

const HomePage = lazyWithRetry(() => import('@pages/Home'))
const ExchangePage = lazyWithRetry(() => import('@pages/Exchange'))
const NetworkPage = lazyWithRetry(() => import('@pages/Exchange/Network'))
const NetworkAddPage = lazyWithRetry(() => import('@pages/Exchange/NetworkAdd'))
const FriendSolidPage = lazyWithRetry(() => import('@pages/Exchange/FriendSolid'))
const CouncilRegisterPage = lazyWithRetry(() => import('@pages/Exchange/CouncilRegister'))
const CouncilListPage = lazyWithRetry(() => import('@pages/Exchange/CouncilList'))
const MyCouncilActivityPage = lazyWithRetry(() => import('@pages/Exchange/MyCouncilActivity'))
const MemberAddPage = lazyWithRetry(() => import('@pages/Exchange/MemberAdd'))
const WriteReviewPage = lazyWithRetry(() => import('@pages/Exchange/WriteReview'))
const ParticipantEditPage = lazyWithRetry(() => import('@pages/Exchange/WriteReview/ParticipantEdit'))
const ReceiptAttachPage = lazyWithRetry(() => import('@pages/Exchange/ReceiptAttach'))
const WritePage = lazyWithRetry(() => import('@pages/Exchange/Write'))
const WriteFormPage = lazyWithRetry(() => import('@pages/Exchange/Write/WriteForm'))
const BoardPage = lazyWithRetry(() => import('@pages/Exchange/Board'))
const BoardDetailPage = lazyWithRetry(() => import('@pages/Exchange/Board/BoardDetail'))
const ReviewDetailPage = lazyWithRetry(() => import('@pages/Exchange/ReviewDetail'))
const RelayWritePage = lazyWithRetry(() => import('@pages/Exchange/RelayWrite'))
const GrowthPage = lazyWithRetry(() => import('@pages/Growth'))
const StrengthMorePage = lazyWithRetry(() => import('@pages/Growth/StrengthMore'))
const PineconeMemoryPage = lazyWithRetry(() => import('@pages/Growth/PineconeMemory'))
const ProgramMorePage = lazyWithRetry(() => import('@pages/Growth/ProgramMore'))
const NotificationsPage = lazyWithRetry(() => import('@pages/Notifications'))
const NotificationDetailPage = lazyWithRetry(() => import('@pages/Notifications/NotificationDetail'))
const ActivityDetailPage = lazyWithRetry(() => import('@pages/Notifications/ActivityDetail'))
const MessageComposePage = lazyWithRetry(() => import('@pages/Notifications/MessageCompose'))
const MessageBoxPage = lazyWithRetry(() => import('@pages/Notifications/MessageBox'))
const MyPagePage = lazyWithRetry(() => import('@pages/MyPage'))
const MentoringPage = lazyWithRetry(() => import('@pages/Mentoring'))
const MentoringApplyPage = lazyWithRetry(() => import('@pages/Mentoring/Apply'))
const MentoringPostcardPage = lazyWithRetry(() => import('@pages/Mentoring/Postcard'))
const ApplicationHistoryPage = lazyWithRetry(() => import('@pages/Mentoring/ApplicationHistory'))
const GoalsPage = lazyWithRetry(() => import('@pages/Goals'))


const LoginPage = lazyWithRetry(() => import('@pages/auth/Login'))
const RegisterTypePage = lazyWithRetry(() => import('@pages/auth/Register'))
const RegisterInfoPage = lazyWithRetry(() => import('@pages/auth/Register/ScholarInfo'))
const RegisterCredentialsPage = lazyWithRetry(() => import('@pages/auth/Register/Credentials'))
const RegisterCompletePage = lazyWithRetry(() => import('@pages/auth/Register/Complete'))
const AlumniRegisterPage = lazyWithRetry(() => import('@pages/auth/Register/Alumni'))

const OnboardingStartPage = lazyWithRetry(() => import('@pages/auth/Onboarding/Start'))
const OnboardingInterestsPage = lazyWithRetry(() => import('@pages/auth/Onboarding/Interests'))
const OnboardingNicknamePage = lazyWithRetry(() => import('@pages/auth/Onboarding/Nickname'))
const OnboardingGoalsPage = lazyWithRetry(() => import('@pages/auth/Onboarding/Goals'))
const OnboardingCharacterPage = lazyWithRetry(() => import('@pages/auth/Onboarding/Character'))
const OnboardingColorPage = lazyWithRetry(() => import('@pages/auth/Onboarding/Color'))
const OnboardingPreviewPage = lazyWithRetry(() => import('@pages/auth/Onboarding/Preview'))
const OnboardingCompletePage = lazyWithRetry(() => import('@pages/auth/Onboarding/Complete'))

const PageLoader = () => <div style={{ padding: '20px', textAlign: 'center' }}>로딩 중...</div>

/** NFC/QR 접속 시 /profile/:userId → 로그인 체크 후 리다이렉트 */
function ProfileRedirect() {
  const { userId } = useParams<{ userId: string }>()
  const token = localStorage.getItem('accessToken')
  const destination = `/exchange/network/add/${userId}`

  if (!token) {
    localStorage.setItem('returnUrl', destination)
    return <Navigate to="/login" replace />
  }

  return <Navigate to={destination} replace />
}

function App() {
  useEffect(() => {
    restoreAuth()
  }, [])

  return (
    <OnboardingProvider>
    <div className="app-container">
      <Suspense fallback={<PageLoader />}>
        <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/profile/:userId" element={<ProfileRedirect />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterTypePage />} />
          <Route path="/register/scholarship" element={<RegisterInfoPage />} />
          <Route path="/register/scholarship/credentials" element={<RegisterCredentialsPage />} />
          <Route path="/register/alumni" element={<AlumniRegisterPage />} />
          <Route path="/register/complete" element={<RegisterCompletePage />} />
          <Route path="/onboarding" element={<OnboardingStartPage />} />
          <Route path="/onboarding/interests" element={<OnboardingInterestsPage />} />
          <Route path="/onboarding/nickname" element={<OnboardingNicknamePage />} />
          <Route path="/onboarding/goals" element={<OnboardingGoalsPage />} />
          <Route path="/onboarding/character" element={<OnboardingCharacterPage />} />
          <Route path="/onboarding/color" element={<OnboardingColorPage />} />
          <Route path="/onboarding/preview" element={<OnboardingPreviewPage />} />
          <Route path="/onboarding/complete" element={<OnboardingCompletePage />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/goals" element={<GoalsPage />} />

          <Route path="/exchange" element={<ExchangePage />} />
          <Route path="/exchange/network" element={<NetworkPage />} />
          <Route path="/exchange/network/add" element={<NetworkAddPage />} />
          <Route path="/exchange/network/add/:userId" element={<FriendSolidPage />} />
          <Route path="/exchange/council/register" element={<CouncilRegisterPage />} />
          <Route path="/exchange/council/list" element={<CouncilListPage />} />
          <Route path="/exchange/council/activity" element={<MyCouncilActivityPage />} />
          <Route path="/exchange/council/:councilId" element={<MyCouncilActivityPage />} />
          <Route path="/exchange/council/member/add" element={<MemberAddPage />} />
          <Route path="/exchange/mentoring" element={<MentoringPage />} />
          <Route path="/exchange/mentoring/apply" element={<MentoringApplyPage />} />
          <Route path="/exchange/mentoring/postcard" element={<MentoringPostcardPage />} />
          <Route path="/exchange/mentoring/history" element={<ApplicationHistoryPage />} />
          <Route path="/exchange/write" element={<WritePage />} />
          <Route path="/exchange/write/review" element={<WriteReviewPage />} />
          <Route path="/exchange/write/review/participants" element={<ParticipantEditPage />} />
          <Route path="/exchange/write/review/receipt" element={<ReceiptAttachPage />} />
          <Route path="/exchange/write/form" element={<WriteFormPage />} />
          <Route path="/exchange/board" element={<BoardPage />} />
          <Route path="/exchange/board/:postId" element={<BoardDetailPage />} />
          <Route path="/exchange/council/review/:reviewId" element={<ReviewDetailPage />} />
          <Route path="/exchange/council/review/:reviewId/relay" element={<RelayWritePage />} />

          <Route path="/growth" element={<GrowthPage />} />
          <Route path="/growth/strength" element={<StrengthMorePage />} />
          <Route path="/growth/memory" element={<PineconeMemoryPage />} />
          <Route path="/growth/program" element={<ProgramMorePage />} />

          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/notifications/:id" element={<NotificationDetailPage />} />
          <Route path="/notifications/activity/:id" element={<ActivityDetailPage />} />
          <Route path="/notifications/message/compose" element={<MessageComposePage />} />
          <Route path="/notifications/messagebox" element={<MessageBoxPage />} />

          <Route path="/mypage" element={<MyPagePage />} />
        </Route>
      </Routes>
      </Suspense>
    </div>
    </OnboardingProvider>
  )
}

export default App
