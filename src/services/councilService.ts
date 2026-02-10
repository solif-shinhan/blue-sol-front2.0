import { apiClient } from '@/api'

export interface CouncilMyResponse {
  councilId: number
  councilName: string
  currentBudget: number
  totalBudget: number
  memberCount: number
  role: 'LEADER' | 'MEMBER'
}

export interface CouncilDetail {
  councilId: number
  councilName: string
  region: string
  activityCategory: string
  leaderUserId: number
  leaderName: string
  description: string
  totalBudget: number
  currentBudget: number
  memberCount: number
  activityCount: number
  monthsSinceCreation: number
  createdAt: string
  profileImageUrl: string
  myRole: 'LEADER' | 'MEMBER' | null
  isMember: boolean
}

export interface CouncilMember {
  userId: number
  name: string
  role: 'LEADER' | 'MEMBER'
  joinedAt: string
  region: string
  schoolName: string
  nickname?: string
  profileImageUrl?: string
  userType?: string
}

export interface CouncilRule {
  ruleId: number
  ruleContent: string
  createdAt: string
}

export interface CreateCouncilRequest {
  councilName: string
  region: string
  activityCategory: string
  description?: string
  totalBudget: number
  profileImageFileId?: number
  memberUserIds?: number[]
  rules?: string[]
}

export interface UpdateCouncilRequest {
  councilName: string
  region: string
  activityCategory: string
  description?: string
  totalBudget: number
  profileImageFileId?: number
}

export interface AddMemberRequest {
  userIds: number[]
}

export interface AddRuleRequest {
  ruleContent: string
}

export interface CouncilListItem {
  councilId: number
  councilName: string
  region: string
  memberCount: number
  profileImageUrl: string
}

export interface CouncilListResponse {
  code: string
  message: string
  success: boolean
  data: {
    myCouncil: CouncilMyResponse | null
    councils: CouncilListItem[]
  }
}

export interface CouncilDetailResponse {
  code: string
  message: string
  success: boolean
  data: CouncilDetail
}

export interface CouncilMyApiResponse {
  code: string
  message: string
  success: boolean
  data: CouncilMyResponse
}

export interface CouncilMemberListData {
  councilId: number
  members: CouncilMember[]
  totalCount: number
}

export interface CouncilMemberListResponse {
  code: string
  message: string
  success: boolean
  data: CouncilMemberListData
}

export interface CouncilRuleListResponse {
  code: string
  message: string
  success: boolean
  data: CouncilRule[]
}

export interface BaseResponse {
  code: string
  message: string
  success: boolean
}

export async function getCouncilList(): Promise<CouncilListResponse> {
  return apiClient.get<CouncilListResponse>('/api/v1/councils')
}

export async function getCouncilDetail(councilId: number): Promise<CouncilDetailResponse> {
  return apiClient.get<CouncilDetailResponse>(`/api/v1/councils/${councilId}`)
}

export async function getMyCouncil(): Promise<CouncilMyApiResponse> {
  try {
    return await apiClient.get<CouncilMyApiResponse>('/api/v1/councils/my')
  } catch (err: any) {
    if (err?.status === 403 || err?.status === 404) {
      return { code: 'NO_COUNCIL', message: '', success: false, data: null as any }
    }
    throw err
  }
}

export interface CreateCouncilResponse {
  code: string
  message: string
  success: boolean
  data: {
    councilId: number
    councilName: string
    createdAt: string
    memberCount: number
  }
}

export async function createCouncil(data: CreateCouncilRequest): Promise<CreateCouncilResponse> {
  return apiClient.post<CreateCouncilResponse>('/api/v1/councils', data)
}

export async function updateCouncil(councilId: number, data: UpdateCouncilRequest): Promise<BaseResponse> {
  return apiClient.patch<BaseResponse>(`/api/v1/councils/${councilId}`, data)
}

export async function getCouncilMembers(councilId: number): Promise<CouncilMemberListResponse> {
  return apiClient.get<CouncilMemberListResponse>(`/api/v1/councils/${councilId}/members`)
}

export async function addCouncilMember(councilId: number, data: AddMemberRequest): Promise<BaseResponse> {
  return apiClient.post<BaseResponse>(`/api/v1/councils/${councilId}/members`, data)
}

export async function removeCouncilMember(councilId: number, userId: number): Promise<BaseResponse> {
  return apiClient.delete<BaseResponse>(`/api/v1/councils/${councilId}/members/${userId}`)
}

export async function getCouncilRules(councilId: number): Promise<CouncilRuleListResponse> {
  return apiClient.get<CouncilRuleListResponse>(`/api/v1/councils/${councilId}/rules`)
}

export async function addCouncilRule(councilId: number, data: AddRuleRequest): Promise<BaseResponse> {
  return apiClient.post<BaseResponse>(`/api/v1/councils/${councilId}/rules`, data)
}

export async function deleteCouncilRule(councilId: number, ruleId: number): Promise<BaseResponse> {
  return apiClient.delete<BaseResponse>(`/api/v1/councils/${councilId}/rules/${ruleId}`)
}

export interface ReviewQuestion {
  questionId: number
  questionText: string
}

export interface ReviewQuestionResponse {
  code: string
  message: string
  success: boolean
  data: ReviewQuestion
}

export async function getRandomReviewQuestion(excludeIds?: number[]): Promise<ReviewQuestionResponse> {
  const params: Record<string, string> = {}
  if (excludeIds && excludeIds.length > 0) {
    params.excludeQuestionIds = excludeIds.join(',')
  }
  return apiClient.get<ReviewQuestionResponse>('/api/v1/council-review-questions/random', params)
}
