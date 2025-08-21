import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import * as schema from './schema';

// 创建 SQLite 连接（使用 Bun 内置的 SQLite）
function createSqliteConnection() {
  const dbPath = process.env.DATABASE_URL || './data/dev.db';

  // 确保数据库目录存在
  const dbDir = dirname(dbPath);
  if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true });
    console.log(`📁 Created database directory: ${dbDir}`);
  }

  const sqlite = new Database(dbPath, { create: true });
  sqlite.exec('PRAGMA foreign_keys = ON;');
  sqlite.exec('PRAGMA journal_mode = WAL;');

  console.log(`🗄️ Database connected: ${dbPath}`);

  return drizzle(sqlite, { schema });
}

// 导出单例数据库实例
export const db = createSqliteConnection();

// 导出数据库类型
export type DatabaseType = typeof db;

// 导出模式
export { schema };
