# PingPong - 轻便任务管理系统设计文档

## 📋 项目概述

PingPong 是一个轻便的任务管理系统，专注于双人协作的任务处理模式。每个任务以"PingPong"的形式存在，强调请求者和响应者之间的交互。

## 🎯 核心概念

### PingPong 任务
- **定义**: 每个任务称为一个 PingPong，必须有一个请求者(Requester)和一个响应者(Responder)
- **生命周期**: 从创建到完成的完整流程
- **时间管理**: 包含创建时间和预期完成时间(ETA)

### 状态管理
- **Ping**: 等待响应者答复的初始状态
- **Pong**: 响应者已经响应，任务进行中
- **Closed**: 任务完成并关闭

### 沟通机制
- **消息系统**: 请求者和响应者可以相互发送消息
- **澄清功能**: 用于澄清请求内容和细节
- **消息记录**: 完整保存对话历史

### 个人化标记
- **Metadata**: 每个用户可以为参与的 PingPong 添加个人标记
- **私有性**: Metadata 只对添加者可见
- **灵活性**: 支持自定义名称和可选参数

## 🗄️ 数据模型设计

### 核心实体关系
```
User (用户)
├── Created PingPongs (作为请求者)
├── Assigned PingPongs (作为响应者) 
├── Messages (发送的消息)
└── Metadata (个人标记)

PingPong (任务)
├── Requester (请求者)
├── Responder (响应者)
├── Messages (相关消息)
└── Metadata (用户标记)

Message (消息)
├── PingPong (所属任务)
├── Sender (发送者)
└── Content (消息内容)

Metadata (个人标记)
├── User (所属用户)
├── PingPong (关联任务)
├── Name (标记名称)
└── Value (可选参数)
```

## 📊 数据库 Schema

### Users 表 (扩展现有)
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  avatar_url TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
```

### PingPongs 表 (新增)
```sql
CREATE TABLE pingpongs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  requester_id INTEGER NOT NULL,
  responder_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'ping', -- 'ping', 'pong', 'closed'
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  eta TEXT, -- ISO 8601 timestamp
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  closed_at TEXT,
  FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (responder_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Messages 表 (新增)
```sql
CREATE TABLE messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pingpong_id INTEGER NOT NULL,
  sender_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text', -- 'text', 'system'
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (pingpong_id) REFERENCES pingpongs(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Metadata 表 (新增)
```sql
CREATE TABLE metadata (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  pingpong_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  value TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(user_id, pingpong_id, name),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (pingpong_id) REFERENCES pingpongs(id) ON DELETE CASCADE
);
```

## 🔧 TypeScript 类型定义

### 基础类型
```typescript
// PingPong 状态枚举
export type PingPongStatus = 'ping' | 'pong' | 'closed';

// 优先级枚举
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

// 消息类型枚举
export type MessageType = 'text' | 'system';
```

### 实体类型
```typescript
// 用户类型 (扩展现有)
export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// PingPong 类型
export interface PingPong {
  id: number;
  title: string;
  description?: string;
  requesterId: number;
  responderId: number;
  status: PingPongStatus;
  priority: Priority;
  eta?: string;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  
  // 关联数据
  requester?: User;
  responder?: User;
  messages?: Message[];
  metadata?: Metadata[];
}

// 消息类型
export interface Message {
  id: number;
  pingpongId: number;
  senderId: number;
  content: string;
  messageType: MessageType;
  createdAt: string;
  
  // 关联数据
  sender?: User;
  pingpong?: PingPong;
}

// 元数据类型
export interface Metadata {
  id: number;
  userId: number;
  pingpongId: number;
  name: string;
  value?: string;
  createdAt: string;
  updatedAt: string;
  
  // 关联数据
  user?: User;
  pingpong?: PingPong;
}
```

### 请求/响应类型
```typescript
// 创建 PingPong 请求
export interface CreatePingPongRequest {
  title: string;
  description?: string;
  responderId: number;
  priority?: Priority;
  eta?: string;
}

// 更新 PingPong 请求
export interface UpdatePingPongRequest {
  title?: string;
  description?: string;
  status?: PingPongStatus;
  priority?: Priority;
  eta?: string;
}

// 创建消息请求
export interface CreateMessageRequest {
  content: string;
  messageType?: MessageType;
}

// 创建元数据请求
export interface CreateMetadataRequest {
  name: string;
  value?: string;
}

// 分页查询类型
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// PingPong 查询参数
export interface PingPongQuery extends PaginationQuery {
  status?: PingPongStatus;
  priority?: Priority;
  requesterId?: number;
  responderId?: number;
  search?: string;
}
```

## 🎨 用户界面规划

### 主要页面
1. **仪表板 (Dashboard)**
   - 我的待办 PingPongs
   - 最近活动
   - 统计数据

2. **PingPong 列表页面**
   - 筛选和搜索
   - 状态管理
   - 批量操作

3. **PingPong 详情页面**
   - 任务信息展示
   - 消息对话
   - 元数据管理

4. **创建/编辑 PingPong**
   - 表单界面
   - 用户选择
   - 时间设置

### UI 组件规划
- **PingPongCard**: 任务卡片组件
- **MessageBubble**: 消息气泡组件  
- **MetadataTag**: 元数据标签组件
- **StatusBadge**: 状态徽章组件
- **PriorityIndicator**: 优先级指示器
- **UserAvatar**: 用户头像组件

## 🔄 工作流程

### 标准流程
1. **创建阶段**: 请求者创建 PingPong，指定响应者和 ETA
2. **响应阶段**: 响应者查看并回复，状态变为 Pong
3. **沟通阶段**: 双方通过消息系统澄清细节
4. **完成阶段**: 任务完成后关闭 PingPong

### 状态转换
```
[创建] → Ping → [响应者确认] → Pong → [任务完成] → Closed
           ↓                       ↓
      [需要澄清] ←----------→ [继续沟通]
```

## 🔐 权限管理

### 基本权限
- **请求者**: 可以编辑任务信息、发送消息、添加个人元数据
- **响应者**: 可以更新状态、发送消息、添加个人元数据
- **其他用户**: 只能查看（如果有权限）

### 数据访问控制
- **PingPong**: 只有参与者可以访问
- **Messages**: 只有参与者可以查看
- **Metadata**: 只有创建者可以查看和编辑

## 🚀 技术实现要点

### 后端 API 设计
- **RESTful API**: 标准的资源操作接口
- **WebSocket**: 实时消息推送
- **权限中间件**: 统一的权限验证
- **数据验证**: 输入数据的完整性检查

### 前端实现
- **状态管理**: 使用 React Context 或 Zustand
- **实时通信**: WebSocket 连接管理
- **路由管理**: React Router 配置
- **表单处理**: 统一的表单验证和提交

## 📈 未来扩展

### 可能的功能增强
- **团队功能**: 支持团队内的 PingPong 管理
- **模板系统**: 常用任务模板
- **通知系统**: 邮件/推送通知
- **报表分析**: 任务完成统计和分析
- **API 集成**: 与第三方工具的集成
- **移动端**: 响应式设计或原生应用

### 性能优化
- **数据分页**: 大量数据的分页加载
- **缓存策略**: Redis 缓存热点数据
- **索引优化**: 数据库查询优化
- **CDN 静态资源**: 提升加载速度

---

*本设计文档将随着项目开发的进展持续更新和完善。*
