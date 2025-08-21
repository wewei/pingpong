// PingPong 系统类型定义

import type { 
  User as DBUser, 
  PingPong as DBPingPong, 
  Message as DBMessage, 
  Metadata as DBMetadata,
  PingPongStatus,
  Priority,
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
  priority?: Priority;
  eta?: string;
}

export interface UpdatePingPongRequest {
  title?: string;
  description?: string;
  status?: PingPongStatus;
  priority?: Priority;
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

export interface UpdateMetadataRequest {
  value?: string;
}

// 查询参数类型
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PingPongQuery extends PaginationQuery {
  status?: PingPongStatus | PingPongStatus[];
  priority?: Priority | Priority[];
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
  pingpongId: number;
  messageType?: MessageType;
}

export interface MetadataQuery extends PaginationQuery {
  userId?: number;
  pingpongId?: number;
  name?: string;
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 统计数据类型
export interface DashboardStats {
  totalPingpongs: number;
  activePingpongs: number;
  completedPingpongs: number;
  overduePingpongs: number;
  myCreatedPingpongs: number;
  myAssignedPingpongs: number;
  myCompletedPingpongs: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: number;
  type: 'created' | 'responded' | 'message' | 'closed' | 'updated';
  pingpongId: number;
  pingpongTitle: string;
  userId: number;
  username: string;
  content?: string;
  createdAt: string;
}

// 通知类型
export interface Notification {
  id: number;
  userId: number;
  type: 'ping_created' | 'ping_responded' | 'message_received' | 'ping_closed' | 'eta_reminder';
  title: string;
  content: string;
  relatedPingpongId?: number;
  read: boolean;
  createdAt: string;
}

// WebSocket 消息类型
export interface WebSocketMessage {
  type: 'message' | 'status_update' | 'notification' | 'user_online' | 'user_offline';
  data: any;
  timestamp: string;
}

// 表单验证规则
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

export interface FormValidationRules {
  [key: string]: ValidationRule;
}

// 用户界面状态类型
export interface UIState {
  loading: boolean;
  error?: string;
  selectedPingpong?: PingPong;
  filters: PingPongQuery;
  viewMode: 'list' | 'kanban' | 'calendar';
  sidebarOpen: boolean;
}

// 导出常量
export const PINGPONG_STATUSES: PingPongStatus[] = ['ping', 'pong', 'closed'];
export const PRIORITIES: Priority[] = ['low', 'medium', 'high', 'urgent'];
export const MESSAGE_TYPES: MessageType[] = ['text', 'system'];

export const PRIORITY_COLORS = {
  low: 'success',
  medium: 'warning', 
  high: 'danger',
  urgent: 'danger'
} as const;

export const STATUS_COLORS = {
  ping: 'warning',
  pong: 'primary', 
  closed: 'success'
} as const;
