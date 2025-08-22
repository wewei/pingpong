// PingPong 系统类型定义

import type { 
  User as DBUser, 
  PingPong as DBPingPong, 
  Message as DBMessage, 
  Metadata as DBMetadata,
  PingPongStatus,
  MessageType 
} from '../server/db/schema';

// 扩展的 PingPong 类型（包含关联数据）
export interface PingPong extends DBPingPong {
  requester?: DBUser;
  responder?: DBUser;
  messages?: Message[];
  metadata?: Metadata[];
  messageCount?: number;
  lastMessageAt?: string;
}

// 扩展的 Message 类型（包含关联数据）
export interface Message extends DBMessage {
  sender?: DBUser;
  pingpong?: PingPong;
}

// 扩展的 Metadata 类型（包含关联数据）
export interface Metadata extends DBMetadata {
  user?: DBUser;
  pingpong?: PingPong;
}

// 扩展的 User 类型
export interface ExtendedUser extends DBUser {
  // 统计信息
  createdPingpongsCount?: number;
  assignedPingpongsCount?: number;
  completedPingpongsCount?: number;
}

// API 请求类型
export interface CreatePingPongRequest {
  title: string;
  description?: string;
  responderId: number;
  eta?: string;
}

export interface UpdatePingPongRequest {
  title?: string;
  description?: string;
  status?: PingPongStatus;
  eta?: string;
}

export interface CreateMessageRequest {
  content: string;
  messageType?: MessageType;
}

export interface CreateMetadataRequest {
  name: string;
  value?: string;
}

// API 响应类型
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 查询类型
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PingPongQuery extends PaginationQuery {
  status?: PingPongStatus | PingPongStatus[];
  requesterId?: number;
  responderId?: number;
  participantId?: number; // 参与者（请求者或响应者）
  search?: string; // 标题或描述搜索
  dueBefore?: string; // ETA 在此时间之前
  dueAfter?: string; // ETA 在此时间之后
  createdAfter?: string;
  createdBefore?: string;
}

export interface MessageQuery extends PaginationQuery {
  pingpongId?: number;
  senderId?: number;
  messageType?: MessageType;
}

export interface MetadataQuery extends PaginationQuery {
  userId?: number;
  pingpongId?: number;
  name?: string;
}

// 统计类型
export interface DashboardStats {
  totalPingpongs: number;
  activePingpongs: number;
  completedPingpongs: number;
  myActivePingpongs: number;
  myCompletedPingpongs: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'pingpong_created' | 'pingpong_updated' | 'message_sent' | 'pingpong_closed';
  title: string;
  description: string;
  timestamp: string;
  user: DBUser;
  relatedPingpong?: PingPong;
}

// UI 状态类型
export interface PingPongFilters {
  status: PingPongStatus[];
  participants: number[];
  dateRange: {
    start?: string;
    end?: string;
  };
  search: string;
}

export interface UIState {
  isLoading: boolean;
  error?: string | null;
  selectedPingPong?: PingPong | null;
  filters: PingPongFilters;
  view: 'list' | 'kanban' | 'calendar';
}

// Form 类型
export interface PingPongFormData {
  title: string;
  description: string;
  responderId: number | null;
  eta: string;
}

export interface MessageFormData {
  content: string;
  messageType: MessageType;
}

// 权限类型
export interface UserPermissions {
  canCreatePingPong: boolean;
  canEditPingPong: boolean;
  canDeletePingPong: boolean;
  canViewAllPingpongs: boolean;
  canManageUsers: boolean;
}

// WebSocket 类型
export interface WebSocketMessage {
  type: 'pingpong_update' | 'message_received' | 'user_online' | 'user_offline';
  payload: any;
  timestamp: string;
}

// 通知类型
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

// 文件上传类型
export interface FileUpload {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: string;
  uploadedBy: number;
}

// 导出常量
export const PINGPONG_STATUSES: PingPongStatus[] = ['ping', 'pong', 'closed'];
export const MESSAGE_TYPES: MessageType[] = ['text', 'system'];

export const STATUS_COLORS = {
  ping: 'warning',
  pong: 'primary', 
  closed: 'success'
} as const;

// 验证规则
export const VALIDATION_RULES = {
  TITLE_MIN_LENGTH: 3,
  TITLE_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 1000,
  MESSAGE_MAX_LENGTH: 2000,
  METADATA_NAME_MAX_LENGTH: 50,
  METADATA_VALUE_MAX_LENGTH: 200
} as const;
