// 네트워크 + 메시지 + 알림 + 자치회 + 사용자 + 목표 타입

import { UserRole, InteractionType } from './types-1';

// ============ 네트워크 타입 ============

export interface NetworkFriend {
  userId: number;
  userName: string;
  character: string;
  backgroundPattern: string;
}

export interface NetworkCard {
  userId: number;
  userName: string;
  character: string;
  backgroundPattern: string;
  solidGoalName: string;
  mainGoals: string[];
  interests: string[];
  buttonType: string;
  isInCouncil: boolean;
  councilName: string;
}

export interface NetworkListResponse {
  myRole: UserRole;
  totalCount: number;
  addedFriends: NetworkFriend[];
  networkCards: NetworkCard[];
}

export interface NetworkSearchUser {
  userId: number;
  userName: string;
  character: string;
  backgroundPattern: string;
  solidGoalName: string;
  interests: string[];
  councilName: string;
  connected: boolean;
  isConnected: boolean;
  isInCouncil: boolean;
}

export interface NetworkSearchResponse {
  keyword: string;
  resultCount: number;
  users: NetworkSearchUser[];
}

export interface NetworkRecommendationGroup {
  title: string;
  users: NetworkCard[];
}

export interface NetworkRecommendationsResponse {
  interestBased: NetworkRecommendationGroup;
  allUsers: NetworkRecommendationGroup;
}

export interface NetworkAddRequest {
  targetUserId?: number;
  targetQrCode?: string;
}

export interface NetworkAddResponse {
  connectionId: number;
  targetUserId: number;
  targetUserName: string;
  createdAt: string;
}

export interface InteractionRequest {
  targetUserId: number;
  interactionType: InteractionType;
}

export interface InteractionResponse {
  notificationId: number;
  targetUserId: number;
  interactionType: InteractionType;
  notificationContent: string;
  createdAt: string;
}

// ============ 메시지 타입 ============

export interface MessageSummary {
  messageId: number;
  counterpartName: string;
  messageTitle: string;
  isRead: boolean;
  createdAt: string;
}

export interface MessageDetail {
  messageId: number;
  senderId: number;
  senderName: string;
  messageTitle: string;
  messageContent: string;
  readAt: string | null;
  createdAt: string;
  fileUrls: string[];
}

export interface Message extends MessageDetail {}

export interface MessageSendRequest {
  receiverId: number;
  messageTitle: string;
  messageContent: string;
  fileIds?: number[];
}

export interface MessageSendResponse {
  messageId: number;
  createdAt: string;
}

// ============ 알림 타입 ============

export interface NotificationSummary {
  notificationId: number;
  notificationType: string;
  notificationTitle: string;
  notificationContent: string;
  targetType: string;
  targetId: number;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationImage {
  imageId: number;
  imageUrl: string;
}

export interface NotificationDetail {
  notificationId: number;
  notificationTitle: string;
  notificationContent: string;
  notificationType: string;
  createdAt: string;
  images: NotificationImage[];
  targetType: string;
  targetId: number;
}

export interface Notification extends NotificationSummary {}

export interface NotificationReadResponse {
  notificationId: number;
  readAt: string;
}

export interface NotificationUnreadCountResponse {
  unreadCount: number;
}

// ============ 자치회 타입 ============

export type CouncilRole = 'LEADER' | 'MEMBER';

export interface MyCouncilSummary {
  councilId: number;
  councilName: string;
  currentBudget: number;
  totalBudget: number;
  memberCount: number;
  role: CouncilRole;
}

export interface CouncilSummary {
  councilId: number;
  councilName: string;
  region: string;
  memberCount: number;
  profileImageUrl: string;
}

export interface CouncilListResponse {
  myCouncil: MyCouncilSummary | null;
  councils: CouncilSummary[];
}

export interface CouncilDetail {
  councilId: number;
  councilName: string;
  region: string;
  activityCategory: string;
  leaderUserId: number;
  leaderName: string;
  description: string;
  totalBudget: number;
  currentBudget: number;
  memberCount: number;
  activityCount: number;
  monthsSinceCreation: number;
  createdAt: string;
  profileImageUrl: string;
  myRole: CouncilRole | null;
  isMember: boolean;
}

export interface Council extends CouncilDetail {}

export interface CouncilCreateRequest {
  councilName: string;
  region: string;
  activityCategory: string;
  description?: string;
  totalBudget: number;
  profileImageFileId?: number;
  memberUserIds?: number[];
  rules?: string[];
}

export interface CouncilCreateResponse {
  councilId: number;
  councilName: string;
  createdAt: string;
  memberCount: number;
}

export interface CouncilUpdateRequest {
  councilName: string;
  region: string;
  activityCategory: string;
  description?: string;
  totalBudget: number;
  profileImageFileId?: number;
}

export interface CouncilRule {
  ruleId: number;
  ruleContent: string;
  createdAt: string;
}

export interface CouncilRulesResponse {
  councilId: number;
  ruleCount: number;
  rules: CouncilRule[];
}

export interface CouncilRuleCreateRequest {
  ruleContent: string;
}

export interface CouncilRuleCreateResponse {
  councilId: number;
  ruleId: number;
  ruleContent: string;
  totalRuleCount: number;
}

export interface CouncilMember {
  userId: number;
  name: string;
  role: CouncilRole;
  joinedAt: string;
  region: string;
  schoolName: string;
}

export interface CouncilMembersResponse {
  councilId: number;
  memberCount: number;
  members: CouncilMember[];
}

export interface CouncilMemberAddRequest {
  userIds: number[];
}

export interface CouncilMemberAddResponse {
  councilId: number;
  addedCount: number;
  totalMemberCount: number;
}

// ============ 사용자 타입 ============

export interface User {
  userId: number;
  loginId: string;
  name: string;
  phone: string;
  email: string;
  scholarNumber: string;
  region: string;
  schoolName: string;
  userRole: UserRole;
  createdAt: string;
}

export interface UserSearchResult {
  userId: number;
  name: string;
  region: string;
  schoolName: string;
  isInCouncil: boolean;
  councilName: string;
}

// ============ 목표 타입 ============

export interface GoalFirstResponse {
  firstGoal: string;
  currentIndex: number;
  totalCount: number;
}

export interface GoalCountResponse {
  goalCount: number;
}
