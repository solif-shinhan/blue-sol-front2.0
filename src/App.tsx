import { Routes, Route } from 'react-router-dom'
import MainLayout from '@components/layout/MainLayout'
import AuthLayout from '@components/layout/AuthLayout'
import PublicLayout from '@components/layout/PublicLayout'

// Pages
import HomePage from '@pages/Home'
import ExchangePage from '@pages/Exchange'
import NetworkPage from '@pages/Exchange/Network'
import NetworkAddPage from '@pages/Exchange/NetworkAdd'
import CouncilRegisterPage from '@pages/Exchange/CouncilRegister'
import CouncilListPage from '@pages/Exchange/CouncilList'
import MyCouncilActivityPage from '@pages/Exchange/MyCouncilActivity'
import MemberAddPage from '@pages/Exchange/MemberAdd'
import WriteReviewPage from '@pages/Exchange/WriteReview'
import ParticipantEditPage from '@pages/Exchange/WriteReview/ParticipantEdit'
import ReceiptAttachPage from '@pages/Exchange/ReceiptAttach'
import WritePage from '@pages/Exchange/Write'
import WriteFormPage from '@pages/Exchange/Write/WriteForm'
import BoardPage from '@pages/Exchange/Board'
import BoardDetailPage from '@pages/Exchange/Board/BoardDetail'
import GrowthPage from '@pages/Growth'
import NotificationsPage from '@pages/Notifications'
import NotificationDetailPage from '@pages/Notifications/NotificationDetail'
import ActivityDetailPage from '@pages/Notifications/ActivityDetail'
import MyPagePage from '@pages/MyPage'
import LoginPage from '@pages/auth/Login'
import OnboardingPage from '@pages/auth/Onboarding'
import RegisterPage from '@pages/auth/Register'
import ScholarshipMemberPage from '@pages/auth/Register/ScholarshipMember'
import ScholarshipCredentialsPage from '@pages/auth/Register/ScholarshipCredentials'
import AlumniRegisterPage from '@pages/auth/Register/Alumni'
import RegisterCompletePage from '@pages/auth/Register/Complete'
import MentoringPage from '@pages/Mentoring'
import MentoringApplyPage from '@pages/Mentoring/Apply'
import MentoringPostcardPage from '@pages/Mentoring/Postcard'
import MentoringReviewPage from '@pages/Mentoring/Review'
import ApplicationHistoryPage from '@pages/Mentoring/ApplicationHistory'
import GoalsPage from '@pages/Goals'
import PublicProfilePage from '@pages/PublicProfile'

function App() {
  return (
    <div className="app-container">
      <Routes>
        {/* Public Routes - NFC card landing page */}
        <Route element={<PublicLayout />}>
          <Route path="/profile/:userId" element={<PublicProfilePage />} />
        </Route>

        {/* Auth Routes - Login is the main entry point */}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register/scholarship" element={<ScholarshipMemberPage />} />
          <Route path="/register/scholarship/credentials" element={<ScholarshipCredentialsPage />} />
          <Route path="/register/alumni" element={<AlumniRegisterPage />} />
          <Route path="/register/complete" element={<RegisterCompletePage />} />
        </Route>

        {/* Main App Routes with Bottom Navigation */}
        <Route element={<MainLayout />}>
          {/* Home Tab */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/solid" element={<HomePage />} />
          <Route path="/solid/edit" element={<HomePage />} />
          <Route path="/goals" element={<GoalsPage />} />

          {/* Exchange Tab */}
          <Route path="/exchange" element={<ExchangePage />} />
          <Route path="/exchange/network" element={<NetworkPage />} />
          <Route path="/exchange/network/add" element={<NetworkAddPage />} />
          <Route path="/exchange/council/register" element={<CouncilRegisterPage />} />
          <Route path="/exchange/council/list" element={<CouncilListPage />} />
          <Route path="/exchange/council/activity" element={<MyCouncilActivityPage />} />
          <Route path="/exchange/council/member/add" element={<MemberAddPage />} />
          <Route path="/exchange/friends" element={<ExchangePage />} />
          <Route path="/exchange/council" element={<ExchangePage />} />
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

          {/* Growth Tab */}
          <Route path="/growth" element={<GrowthPage />} />
          <Route path="/growth/tree" element={<GrowthPage />} />
          <Route path="/growth/goals" element={<GrowthPage />} />
          <Route path="/growth/pinecones" element={<GrowthPage />} />
          <Route path="/growth/bucket" element={<GrowthPage />} />
          <Route path="/growth/programs" element={<GrowthPage />} />

          {/* Notifications Tab */}
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/notifications/:id" element={<NotificationDetailPage />} />
          <Route path="/notifications/activity/:id" element={<ActivityDetailPage />} />
          <Route path="/notifications/messages" element={<NotificationsPage />} />

          {/* MyPage Tab */}
          <Route path="/mypage" element={<MyPagePage />} />
          <Route path="/mypage/edit" element={<MyPagePage />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
