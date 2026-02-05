import { apiClient } from '@/api'

export interface Council {
  councilId: number
  name: string
  description: string
  leaderId: number
  leaderName: string
  memberCount: number
  region: string
  topic: string
  goal: string
  createdAt: string
}

export interface CouncilMember {
  userId: number
  name: string
  nickname: string
  profileImageUrl: string
  role: 'LEADER' | 'MEMBER'
  joinedAt: string
  userType?: string
  region?: string
}

export interface CouncilRule {
  ruleId: number
  content: string
  createdAt: string
}

export interface CreateCouncilRequest {
  name: string
  description: string
  region?: string
  topic?: string
  goal?: string
}

export interface UpdateCouncilRequest {
  name?: string
  description?: string
  region?: string
  topic?: string
  goal?: string
}

export interface AddMemberRequest {
  userId: number
}

export interface AddRuleRequest {
  content: string
}

export interface CouncilListResponse {
  code: string
  message: string
  success: boolean
  data: Council[]
}

export interface CouncilDetailResponse {
  code: string
  message: string
  success: boolean
  data: Council
}

export interface CouncilMemberListResponse {
  code: string
  message: string
  success: boolean
  data: CouncilMember[]
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

export async function getMyCouncil(): Promise<CouncilDetailResponse> {
  return apiClient.get<CouncilDetailResponse>('/api/v1/councils/my')
}

export async function createCouncil(data: CreateCouncilRequest): Promise<CouncilDetailResponse> {
  return apiClient.post<CouncilDetailResponse>('/api/v1/councils', data)
}

export async function updateCouncil(councilId: number, data: UpdateCouncilRequest): Promise<CouncilDetailResponse> {
  return apiClient.patch<CouncilDetailResponse>(`/api/v1/councils/${councilId}`, data)
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
