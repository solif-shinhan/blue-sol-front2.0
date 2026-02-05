# 백엔드 API 연동 계획표

> 마지막 업데이트: 2026-02-05

## 1. 인증 (Auth)

| 상태 | 페이지 | 연동할 API | 비고 |
|:---:|--------|-----------|------|
| ✅ | Login | `authApi.login` | useLoginForm.ts |
| ✅ | Register | `authApi.signup` | ScholarshipCredentials/index.tsx |
| ✅ | Onboarding | `profileApi.create`, `interestApi.create` | useOnboarding.ts |
| ⏸️ | Onboarding | `profileAssetsApi.*` (배경/캐릭터 목록) | 하드코딩으로 작동 중 |

## 2. 홈 (Home)

| 상태 | 페이지 | 연동할 API | 비고 |
|:---:|--------|-----------|------|
| ✅ | Home | `profileApi.get`, `goalApi.getCount`, `notificationApi` | Home/index.tsx |

## 3. 교류 (Exchange)

| 상태 | 페이지 | 연동할 API | 비고 |
|:---:|--------|-----------|------|
| ⬜ | Exchange 메인 | `councilApi.getList`, `councilApi.getMy` | 하드코딩 데이터 사용 중 |
| ✅ | Network | `networkApi.getList`, `sendInteraction` | Network/index.tsx |
| ✅ | NetworkAdd | `networkApi.add`, `search`, `getRecommendations` | NetworkAdd/index.tsx |
| ✅ | Board | `postApi.getList` | Board/index.tsx |
| ✅ | BoardDetail | `postApi.get`, `commentApi.*`, `postApi.like/unlike` | BoardDetail/index.tsx |
| ⬜ | Write | `postApi.create` | 확인 필요 |
| ✅ | CouncilList | `councilApi.getList`, `getMyCouncil` | CouncilList/index.tsx |
| ⬜ | CouncilRegister | `councilApi.create`, `fileApi.upload` | 확인 필요 |
| ✅ | MyCouncilActivity | `councilApi.getMyCouncil` | MyCouncilActivity/index.tsx |
| ⬜ | MemberAdd | `userApi.search`, `councilApi.addMember` | 확인 필요 |
| ⬜ | WriteReview | `councilReviewPostApi.*`, `fileApi`, `ocrApi` | 확인 필요 |
| ⬜ | ReceiptAttach | `fileApi.upload`, `ocrApi.processReceipt` | 확인 필요 |

## 4. 알림 (Notifications)

| 상태 | 페이지 | 연동할 API | 비고 |
|:---:|--------|-----------|------|
| ✅ | Notifications | `notificationApi.getList`, `getUnreadCount` | Notifications/index.tsx |
| ⬜ | NotificationDetail | `notificationApi.get`, `markAsRead` | 확인 필요 |

## 5. 마이페이지 (MyPage)

| 상태 | 페이지 | 연동할 API | 비고 |
|:---:|--------|-----------|------|
| ⬜ | MyPage | `userApi.getMe`, `profileApi.get` | 확인 필요 |
| ⬜ | PublicProfile | 프로필 조회 API | 확인 필요 |

## 6. 목표 (Goals)

| 상태 | 페이지 | 연동할 API | 비고 |
|:---:|--------|-----------|------|
| ⬜ | Goals | `goalApi.getFirst`, `goalApi.getCount` | 확인 필요 |

---

## 범례
- ✅ 완료
- ⬜ 미완료 / 확인 필요
- ⏸️ 보류 (하드코딩으로 작동)

## 진행 현황 요약

### 완료된 API 연동 (13개)
1. Login - `authApi.login`
2. Register - `authApi.signup`
3. Onboarding - `profileApi.create`, `interestApi.create`
4. Home - `profileApi.get`, `goalApi.getCount`
5. Network - `networkApi.getList`, `sendInteraction`
6. NetworkAdd - `networkApi.add`, `search`, `getRecommendations`
7. Board - `postApi.getList`
8. BoardDetail - `postApi.get`, `commentApi.*`, `postApi.like/unlike`
9. CouncilList - `councilApi.getList`, `getMyCouncil`
10. MyCouncilActivity - `councilApi.getMyCouncil`
11. Notifications - `notificationApi.getList`, `getUnreadCount`

### 미완료 / 확인 필요 (10개)
1. Exchange 메인 - 하드코딩 데이터 사용
2. Write - `postApi.create`
3. CouncilRegister - `councilApi.create`
4. MemberAdd - `userApi.search`, `councilApi.addMember`
5. WriteReview - `councilReviewPostApi.*`
6. ReceiptAttach - `ocrApi`
7. NotificationDetail - `notificationApi.get`
8. MyPage - `userApi.getMe`, `profileApi.get`
9. PublicProfile - 프로필 조회
10. Goals - `goalApi.*`
