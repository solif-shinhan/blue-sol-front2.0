// 추가 API 타입 정의 및 API 함수

import { apiClient } from './client';
import { ApiResponse, PageResponse } from './api-1';

// ============ 프로필 배경/캐릭터 타입 ============

export interface BackgroundOption {
  backgroundPattern: string;
  backgroundImageUrl: string;
}

export interface CharacterOption {
  characterPattern: string;
  characterImageUrl: string;
}

// ============ 자치회 활동 후기 타입 ============

export interface CouncilReviewPostSummary {
  councilReviewPostId: number;
  postId: number;
  postTitle: string;
  activityDate: string;
  activityLocation: string;
  totalCost: number;
  participantCount: number;
  relayCount: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  thumbnailImageUrl: string;
  createdAt: string;
}

export interface CouncilReviewParticipant {
  userId: number;
  userName: string;
}

export interface CouncilReviewRelay {
  councilReviewRelayId: number;
  writerUserId: number;
  writerUserName: string;
  relayOrder: number;
  questionText: string;
  relayContent: string;
  isMyRelay: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CouncilReviewPostDetail {
  councilReviewPostId: number;
  postId: number;
  councilId: number;
  councilName: string;
  postTitle: string;
  activityDate: string;
  activityLocation: string;
  totalCost: number;
  imageUrls: string[];
  participants: CouncilReviewParticipant[];
  relays: CouncilReviewRelay[];
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isLikedByMe: boolean;
  isLeader: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CouncilReviewPostCreateRequest {
  postTitle: string;
  activityDate: string;
  activityLocation: string;
  totalCost: number;
  participantUserIds: number[];
  imageFileIds?: number[];
  questionId: number;
  relayContent: string;
}

export interface CouncilReviewPostCreateResponse {
  councilReviewPostId: number;
  postId: number;
}

export interface CouncilReviewPostUpdateRequest {
  postTitle: string;
  activityDate: string;
  activityLocation: string;
  totalCost: number;
  participantUserIds: number[];
  imageFileIds?: number[];
}

// ============ 릴레이 타입 ============

export interface RelayCreateRequest {
  questionId: number;
  relayContent: string;
}

export interface RelayUpdateRequest {
  relayContent: string;
}

export interface RelayQuestion {
  questionId: number;
  questionText: string;
}

// ============ 파일 타입 ============

export type FileTargetType = 'COUNCIL_POST' | 'USER_PROFILE' | 'BADGE_MEMORY';
export type FilePurpose = 'PROFILE_IMAGE' | 'BADGE_MEMORY_IMAGE' | 'POST_ATTACHMENT';

export interface FileUploadResponse {
  fileId: number;
  originalName: string;
  contentType: string;
  sizeBytes: number;
  url: string;
}

export interface FileAttachment {
  fileAttachmentId: number;
  fileId: number;
  originalName: string;
  url: string;
  targetType: FileTargetType;
  targetId: number;
  purpose: FilePurpose;
  sortOrder: number;
}

export interface FileAttachmentCreateRequest {
  fileId: number;
  targetType: FileTargetType;
  targetId: number;
  purpose: FilePurpose;
  sortOrder?: number;
}

// ============ OCR 타입 ============

export interface OcrRequest {
  fileId: number;
}

export interface OcrResponse {
  amount: number;
}

export interface OcrTestResponse {
  amount: number;
  candidates: number[];
  rawText: string;
}

// ============ 프로필 배경/캐릭터 API ============

export const profileAssetsApi = {
  getBackgrounds: (): Promise<ApiResponse<BackgroundOption[]>> =>
    apiClient.get('/api/profiles/backgrounds'),

  getCharacters: (): Promise<ApiResponse<CharacterOption[]>> =>
    apiClient.get('/api/profiles/characters'),

  getProfileBgs: (): Promise<ApiResponse<BackgroundOption[]>> =>
    apiClient.get('/api/profiles/profilebgs'),

  getSolidBgs: (): Promise<ApiResponse<BackgroundOption[]>> =>
    apiClient.get('/api/profiles/solidbgs'),

  getSolidQrBgs: (): Promise<ApiResponse<BackgroundOption[]>> =>
    apiClient.get('/api/profiles/solidqrbgs'),

  getMypageBgs: (): Promise<ApiResponse<BackgroundOption[]>> =>
    apiClient.get('/api/profiles/mypagebgs'),
};

// ============ 자치회 활동 후기 API ============

export const councilReviewPostApi = {
  getList: (
    councilId: number,
    params?: { page?: number; size?: number }
  ): Promise<ApiResponse<PageResponse<CouncilReviewPostSummary>>> => {
    const queryParams: Record<string, string> = {};
    if (params?.page !== undefined) queryParams.page = String(params.page);
    if (params?.size !== undefined) queryParams.size = String(params.size);
    return apiClient.get(`/api/v1/councils/${councilId}/review-posts`, queryParams);
  },

  create: (
    councilId: number,
    data: CouncilReviewPostCreateRequest
  ): Promise<ApiResponse<CouncilReviewPostCreateResponse>> =>
    apiClient.post(`/api/v1/councils/${councilId}/review-posts`, data),

  get: (councilReviewPostId: number): Promise<ApiResponse<CouncilReviewPostDetail>> =>
    apiClient.get(`/api/v1/council-review-posts/${councilReviewPostId}`),

  update: (
    councilReviewPostId: number,
    data: CouncilReviewPostUpdateRequest
  ): Promise<ApiResponse<null>> =>
    apiClient.patch(`/api/v1/council-review-posts/${councilReviewPostId}`, data),

  delete: (councilReviewPostId: number): Promise<ApiResponse<null>> =>
    apiClient.delete(`/api/v1/council-review-posts/${councilReviewPostId}`),
};

// ============ 릴레이 API ============

export const councilReviewRelayApi = {
  create: (
    councilReviewPostId: number,
    data: RelayCreateRequest
  ): Promise<ApiResponse<Record<string, unknown>>> =>
    apiClient.post(`/api/v1/council-review-posts/${councilReviewPostId}/relays`, data),

  update: (relayId: number, data: RelayUpdateRequest): Promise<ApiResponse<null>> =>
    apiClient.patch(`/api/v1/council-review-relays/${relayId}`, data),

  delete: (relayId: number): Promise<ApiResponse<null>> =>
    apiClient.delete(`/api/v1/council-review-relays/${relayId}`),

  getRandomQuestion: (excludeQuestionIds?: number[]): Promise<ApiResponse<RelayQuestion>> => {
    const queryParams: Record<string, string> = {};
    if (excludeQuestionIds && excludeQuestionIds.length > 0) {
      queryParams.excludeQuestionIds = excludeQuestionIds.join(',');
    }
    return apiClient.get('/api/v1/council-review-questions/random', queryParams);
  },
};

// ============ 파일 API ============

export const fileApi = {
  upload: async (files: File[], folder?: string): Promise<ApiResponse<FileUploadResponse[]>> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const token = localStorage.getItem('accessToken');
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const url = `${baseUrl}/api/files${folder ? `?folder=${encodeURIComponent(folder)}` : ''}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP Error: ${response.status}`);
    }

    return response.json();
  },

  getAttachments: (
    targetType: FileTargetType,
    targetId: number
  ): Promise<ApiResponse<FileAttachment[]>> =>
    apiClient.get('/api/files/attachments', {
      targetType,
      targetId: String(targetId),
    }),

  createAttachment: (data: FileAttachmentCreateRequest): Promise<ApiResponse<FileAttachment>> =>
    apiClient.post('/api/files/attachments', data),

  deleteAttachment: (fileAttachmentId: number): Promise<ApiResponse<null>> =>
    apiClient.delete(`/api/files/attachments/${fileAttachmentId}`),
};

// ============ OCR API ============

export const ocrApi = {
  processReceipt: (data: OcrRequest): Promise<ApiResponse<OcrResponse>> =>
    apiClient.post('/api/v1/receipts/ocr', data),

  testOcr: async (file: File): Promise<ApiResponse<OcrTestResponse>> => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('accessToken');
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

    const response = await fetch(`${baseUrl}/api/test/ocr`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP Error: ${response.status}`);
    }

    return response.json();
  },
};
