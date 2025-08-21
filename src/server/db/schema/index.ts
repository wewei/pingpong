import { sqliteTable, text, integer, primaryKey, unique } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// 用户表 (扩展添加头像字段)
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  avatarUrl: text('avatar_url'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`(datetime('now'))`),
});

// PingPong 任务表
export const pingpongs = sqliteTable('pingpongs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  requesterId: integer('requester_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  responderId: integer('responder_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  status: text('status', { enum: ['ping', 'pong', 'closed'] }).notNull().default('ping'),
  priority: text('priority', { enum: ['low', 'medium', 'high', 'urgent'] }).default('medium'),
  eta: text('eta'), // ISO 8601 timestamp
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`(datetime('now'))`),
  closedAt: text('closed_at'),
});

// 消息表
export const messages = sqliteTable('messages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  pingpongId: integer('pingpong_id')
    .notNull()
    .references(() => pingpongs.id, { onDelete: 'cascade' }),
  senderId: integer('sender_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  messageType: text('message_type', { enum: ['text', 'system'] }).default('text'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
});

// 元数据表
export const metadata = sqliteTable('metadata', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  pingpongId: integer('pingpong_id')
    .notNull()
    .references(() => pingpongs.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  value: text('value'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`(datetime('now'))`),
}, (table) => ({
  uniqueUserPingpongName: unique().on(table.userId, table.pingpongId, table.name),
}));



// 会话表（用于用户认证）
export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: integer('expires_at').notNull(),
});

// TypeScript 类型导出
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// PingPong 相关类型
export type PingPong = typeof pingpongs.$inferSelect;
export type NewPingPong = typeof pingpongs.$inferInsert;

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

export type Metadata = typeof metadata.$inferSelect;
export type NewMetadata = typeof metadata.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

// 枚举类型
export type PingPongStatus = 'ping' | 'pong' | 'closed';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type MessageType = 'text' | 'system';
