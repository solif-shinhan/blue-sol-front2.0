import { apiClient } from './client';
import {
  ApiResponse,
  PageResponse,
  SignupRequest,
  SignupResponse,
  LoginRequest,
  LoginResponse,
  Profile,
  ProfileCreateRequest,
  ProfileCreateResponse,
  ProfileUpdateRequest,
  ProfileUpdateResponse,
  InterestRequest,
  InterestResponse,
  PostSummary,
  PostDetail,
  PostCategory,
  PostCreateRequest,
  PostCreateResponse,
  PostUpdateRequest,
  Comment,
  CommentCreateRequest,
  CommentUpdateRequest,
  NetworkListResponse,
  NetworkAddRequest,
  NetworkAddResponse,
  NetworkSearchResponse,
  NetworkRecommendationsResponse,
  InteractionRequest,
  InteractionResponse,
  MessageSummary,
  MessageDetail,
  MessageSendRequest,
  MessageSendResponse,
  NotificationSummary,
  NotificationDetail,
  NotificationCategory,
  NotificationSubCategory,
  NotificationFilter,
  NotificationReadResponse,
  NotificationUnreadCountResponse,
  CouncilListResponse,
  CouncilDetail,
  CouncilCreateRequest,
  CouncilCreateResponse,
  CouncilUpdateRequest,
  CouncilRulesResponse,
  CouncilRuleCreateRequest,
  CouncilRuleCreateResponse,
  CouncilMembersResponse,
  CouncilMemberAddRequest,
  CouncilMemberAddResponse,
  MyCouncilSummary,
  User,
  UserSearchResult,
  GoalFirstResponse,
  GoalCountResponse,
} from './api-1';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const authApi = {
  signup: (data: SignupRequest): Promise<ApiResponse<SignupResponse>> =>
    apiClient.post('/api/auth/signup', data),

  login: (data: LoginRequest): Promise<ApiResponse<LoginResponse>> =>
    apiClient.post('/api/auth/login', data),

  logout: (): Promise<ApiResponse<null>> =>
    apiClient.post('/api/auth/logout'),
};

export const profileApi = {
  get: (): Promise<ApiResponse<Profile>> =>
    apiClient.get('/api/profiles'),

  create: (data: ProfileCreateRequest): Promise<ApiResponse<ProfileCreateResponse>> =>
    apiClient.post('/api/profiles', data),

  update: (data: ProfileUpdateRequest): Promise<ApiResponse<ProfileUpdateResponse>> =>
    apiClient.patch('/api/profiles', data),
};

export const interestApi = {
  create: (data: InterestRequest): Promise<ApiResponse<InterestResponse>> =>
    apiClient.post('/api/interests', data),
};

export const postApi = {
  getList: (params: {
    boardId: number;
    category?: PostCategory;
    page?: number;
    size?: number;
  }): Promise<ApiResponse<PageResponse<PostSummary>>> => {
    const queryParams: Record<string, string> = { boardId: String(params.boardId) };
    if (params.category) queryParams.category = params.category;
    if (params.page !== undefined) queryParams.page = String(params.page);
    if (params.size !== undefined) queryParams.size = String(params.size);
    return apiClient.get('/api/v1/posts', queryParams);
  },

  create: (data: PostCreateRequest): Promise<ApiResponse<PostCreateResponse>> =>
    apiClient.post('/api/v1/posts', data),

  get: (postId: number): Promise<ApiResponse<PostDetail>> =>
    apiClient.get(`/api/v1/posts/${postId}`),

  update: (postId: number, data: PostUpdateRequest): Promise<ApiResponse<null>> =>
    apiClient.patch(`/api/v1/posts/${postId}`, data),

  delete: (postId: number): Promise<ApiResponse<null>> =>
    apiClient.delete(`/api/v1/posts/${postId}`),

  like: (postId: number): Promise<ApiResponse<null>> =>
    apiClient.post(`/api/v1/posts/${postId}/like`),

  unlike: (postId: number): Promise<ApiResponse<null>> =>
    apiClient.delete(`/api/v1/posts/${postId}/like`),
};

export const commentApi = {
  getList: (postId: number): Promise<ApiResponse<Comment[]>> =>
    apiClient.get(`/api/v1/posts/${postId}/comments`),

  create: (postId: number, data: CommentCreateRequest): Promise<ApiResponse<Comment>> =>
    apiClient.post(`/api/v1/posts/${postId}/comments`, data),

  update: (commentId: number, data: CommentUpdateRequest): Promise<ApiResponse<Comment>> =>
    apiClient.patch(`/api/v1/comments/${commentId}`, data),

  delete: (commentId: number): Promise<ApiResponse<null>> =>
    apiClient.delete(`/api/v1/comments/${commentId}`),
};

export const networkApi = {
  getList: (): Promise<ApiResponse<NetworkListResponse>> =>
    apiClient.get('/api/v1/networks'),

  add: (data: NetworkAddRequest): Promise<ApiResponse<NetworkAddResponse>> =>
    apiClient.post('/api/v1/networks', data),

  qrScan: (qrData: string): Promise<ApiResponse<NetworkAddResponse>> =>
    apiClient.post(`/api/v1/networks/qr-scan?qrData=${encodeURIComponent(qrData)}`),

  sendInteraction: (data: InteractionRequest): Promise<ApiResponse<InteractionResponse>> =>
    apiClient.post('/api/v1/networks/interactions', data),

  search: (keyword: string): Promise<ApiResponse<NetworkSearchResponse>> =>
    apiClient.get('/api/v1/networks/search', { keyword }),

  getRecommendations: (): Promise<ApiResponse<NetworkRecommendationsResponse>> =>
    apiClient.get('/api/v1/networks/recommendations'),
};

export const messageApi = {
  send: (data: MessageSendRequest): Promise<ApiResponse<MessageSendResponse>> =>
    apiClient.post('/api/v1/messages', data),

  get: (messageId: number): Promise<ApiResponse<MessageDetail>> =>
    apiClient.get(`/api/v1/messages/${messageId}`),

  delete: (messageId: number): Promise<ApiResponse<null>> =>
    apiClient.delete(`/api/v1/messages/${messageId}`),

  getSentList: (params?: { page?: number; size?: number }): Promise<ApiResponse<PageResponse<MessageSummary>>> => {
    const queryParams: Record<string, string> = {};
    if (params?.page !== undefined) queryParams.page = String(params.page);
    if (params?.size !== undefined) queryParams.size = String(params.size);
    return apiClient.get('/api/v1/messages/sent', queryParams);
  },

  getReceivedList: (params?: { page?: number; size?: number }): Promise<ApiResponse<PageResponse<MessageSummary>>> => {
    const queryParams: Record<string, string> = {};
    if (params?.page !== undefined) queryParams.page = String(params.page);
    if (params?.size !== undefined) queryParams.size = String(params.size);
    return apiClient.get('/api/v1/messages/received', queryParams);
  },
};

export const notificationApi = {
  getList: (params: {
    category: NotificationCategory;
    subCategory?: NotificationSubCategory;
    filter?: NotificationFilter;
    page?: number;
    size?: number;
  }): Promise<ApiResponse<PageResponse<NotificationSummary>>> => {
    const queryParams: Record<string, string> = { category: params.category };
    if (params.subCategory) queryParams.subCategory = params.subCategory;
    if (params.filter) queryParams.filter = params.filter;
    if (params.page !== undefined) queryParams.page = String(params.page);
    if (params.size !== undefined) queryParams.size = String(params.size);
    return apiClient.get('/api/v1/notifications', queryParams);
  },

  get: (notificationId: number): Promise<ApiResponse<NotificationDetail>> =>
    apiClient.get(`/api/v1/notifications/${notificationId}`),

  markAsRead: (notificationId: number): Promise<ApiResponse<NotificationReadResponse>> =>
    apiClient.patch(`/api/v1/notifications/${notificationId}/read`),

  getUnreadCount: (): Promise<ApiResponse<NotificationUnreadCountResponse>> =>
    apiClient.get('/api/v1/notifications/unread-count'),

  getSubscribeUrl: (): string => {
    const token = localStorage.getItem('accessToken')
    return `${API_BASE_URL}/api/v1/notifications/subscribe${token ? `?token=${token}` : ''}`
  },
};

export const councilApi = {
  getList: (): Promise<ApiResponse<CouncilListResponse>> =>
    apiClient.get('/api/v1/councils'),

  create: (data: CouncilCreateRequest): Promise<ApiResponse<CouncilCreateResponse>> =>
    apiClient.post('/api/v1/councils', data),

  get: (councilId: number): Promise<ApiResponse<CouncilDetail>> =>
    apiClient.get(`/api/v1/councils/${councilId}`),

  update: (councilId: number, data: CouncilUpdateRequest): Promise<ApiResponse<null>> =>
    apiClient.patch(`/api/v1/councils/${councilId}`, data),

  getMy: (): Promise<ApiResponse<MyCouncilSummary>> =>
    apiClient.get('/api/v1/councils/my'),

  getRules: (councilId: number): Promise<ApiResponse<CouncilRulesResponse>> =>
    apiClient.get(`/api/v1/councils/${councilId}/rules`),

  addRule: (councilId: number, data: CouncilRuleCreateRequest): Promise<ApiResponse<CouncilRuleCreateResponse>> =>
    apiClient.post(`/api/v1/councils/${councilId}/rules`, data),

  deleteRule: (councilId: number, ruleId: number): Promise<ApiResponse<null>> =>
    apiClient.delete(`/api/v1/councils/${councilId}/rules/${ruleId}`),

  getMembers: (councilId: number): Promise<ApiResponse<CouncilMembersResponse>> =>
    apiClient.get(`/api/v1/councils/${councilId}/members`),

  addMember: (councilId: number, data: CouncilMemberAddRequest): Promise<ApiResponse<CouncilMemberAddResponse>> =>
    apiClient.post(`/api/v1/councils/${councilId}/members`, data),

  deleteMember: (councilId: number, userId: number): Promise<ApiResponse<null>> =>
    apiClient.delete(`/api/v1/councils/${councilId}/members/${userId}`),
};

export const userApi = {
  getMe: (): Promise<ApiResponse<User>> =>
    apiClient.get('/api/v1/users/me'),

  search: (keyword: string): Promise<ApiResponse<UserSearchResult[]>> =>
    apiClient.get('/api/v1/users/search', { keyword }),
};

export const goalApi = {
  getFirst: (): Promise<ApiResponse<GoalFirstResponse>> =>
    apiClient.get('/api/goals/first'),

  getCount: (): Promise<ApiResponse<GoalCountResponse>> =>
    apiClient.get('/api/goals/count'),
};
