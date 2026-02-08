import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from '@components/layout/MainLayout'
import AuthLayout from '@components/layout/AuthLayout'
import PublicLayout from '@components/layout/PublicLayout'
import { restoreAuth } from '@/services'
import { OnboardingProvider } from '@features/02-onboarding/context/OnboardingContext'

const HomePage = lazy(() => import('@pages/Home'))
const ExchangePage = lazy(() => import('@pages/Exchange'))
const NetworkPage = lazy(() => import('@pages/Exchange/Network'))
const NetworkAddPage = lazy(() => import('@pages/Exchange/NetworkAdd'))
const CouncilRegisterPage = lazy(() => import('@pages/Exchange/CouncilRegister'))
const CouncilListPage = lazy(() => import('@pages/Exchange/CouncilList'))
const MyCouncilActivityPage = lazy(() => import('@pages/Exchange/MyCouncilActivity'))
const MemberAddPage = lazy(() => import('@pages/Exchange/MemberAdd'))
const WriteReviewPage = lazy(() => import('@pages/Exchange/WriteReview'))
const ParticipantEditPage = lazy(() => import('@pages/Exchange/WriteReview/ParticipantEdit'))
const ReceiptAttachPage = lazy(() => import('@pages/Exchange/ReceiptAttach'))
const WritePage = lazy(() => import('@pages/Exchange/Write'))
const WriteFormPage = lazy(() => import('@pages/Exchange/Write/WriteForm'))
const BoardPage = lazy(() => import('@pages/Exchange/Board'))
const BoardDetailPage = lazy(() => import('@pages/Exchange/Board/BoardDetail'))
const GrowthPage = lazy(() => import('@pages/Growth'))
const NotificationsPage = lazy(() => import('@pages/Notifications'))
const NotificationDetailPage = lazy(() => import('@pages/Notifications/NotificationDetail'))
const ActivityDetailPage = lazy(() => import('@pages/Notifications/ActivityDetail'))
const MyPagePage = lazy(() => import('@pages/MyPage'))
const MentoringPage = lazy(() => import('@pages/Mentoring'))
const MentoringApplyPage = lazy(() => import('@pages/Mentoring/Apply'))
const MentoringPostcardPage = lazy(() => import('@pages/Mentoring/Postcard'))
const MentoringReviewPage = lazy(() => import('@pages/Mentoring/Review'))
const ApplicationHistoryPage = lazy(() => import('@pages/Mentoring/ApplicationHistory'))
const GoalsPage = lazy(() => import('@pages/Goals'))
const PublicProfilePage = lazy(() => import('@pages/PublicProfile'))

const LoginPage = lazy(() => import('@pages/auth/Login'))
const RegisterTypePage = lazy(() => import('@pages/auth/Register'))
const RegisterInfoPage = lazy(() => import('@pages/auth/Register/ScholarInfo'))
const RegisterCredentialsPage = lazy(() => import('@pages/auth/Register/Credentials'))
const RegisterCompletePage = lazy(() => import('@pages/auth/Register/Complete'))
const AlumniRegisterPage = lazy(() => import('@pages/auth/Register/Alumni'))

const OnboardingStartPage = lazy(() => import('@pages/auth/Onboarding/Start'))
const OnboardingInterestsPage = lazy(() => import('@pages/auth/Onboarding/Interests'))
const OnboardingNicknamePage = lazy(() => import('@pages/auth/Onboarding/Nickname'))
const OnboardingGoalsPage = lazy(() => import('@pages/auth/Onboarding/Goals'))
const OnboardingCharacterPage = lazy(() => import('@pages/auth/Onboarding/Character'))
const OnboardingColorPage = lazy(() => import('@pages/auth/Onboarding/Color'))
const OnboardingPreviewPage = lazy(() => import('@pages/auth/Onboarding/Preview'))
const OnboardingCompletePage = lazy(() => import('@pages/auth/Onboarding/Complete'))

const PageLoader = () => <div style={{ padding: '20px', textAlign: 'center' }}>로딩 중...</div>

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
          <Route path="/profile/:userId" element={<PublicProfilePage />} />
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
          <Route path="/exchange/council/register" element={<CouncilRegisterPage />} />
          <Route path="/exchange/council/list" element={<CouncilListPage />} />
          <Route path="/exchange/council/activity" element={<MyCouncilActivityPage />} />
          <Route path="/exchange/council/member/add" element={<MemberAddPage />} />
          <Route path="/exchange/mentoring" element={<MentoringPage />} />
          <Route path="/exchange/mentoring/apply" element={<MentoringApplyPage />} />
          <Route path="/exchange/mentoring/postcard" element={<MentoringPostcardPage />} />
          <Route path="/exchange/mentoring/review" element={<MentoringReviewPage />} />
          <Route path="/exchange/mentoring/history" element={<ApplicationHistoryPage />} />
          <Route path="/exchange/write" element={<WritePage />} />
          <Route path="/exchange/write/review" element={<WriteReviewPage />} />
          <Route path="/exchange/write/review/participants" element={<ParticipantEditPage />} />
          <Route path="/exchange/write/review/receipt" element={<ReceiptAttachPage />} />
          <Route path="/exchange/write/form" element={<WriteFormPage />} />
          <Route path="/exchange/board" element={<BoardPage />} />
          <Route path="/exchange/board/:postId" element={<BoardDetailPage />} />

          <Route path="/growth" element={<GrowthPage />} />

          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/notifications/:id" element={<NotificationDetailPage />} />
          <Route path="/notifications/activity/:id" element={<ActivityDetailPage />} />

          <Route path="/mypage" element={<MyPagePage />} />
        </Route>
      </Routes>
      </Suspense>
    </div>
    </OnboardingProvider>
  )
}

export default App
