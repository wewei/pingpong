import { eq, desc, count } from 'drizzle-orm';
import { db } from '../index';
import { users, type User, type NewUser } from '../schema';

// 用户服务
export class UserService {
  async createUser(userData: NewUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async getUserById(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async updateUser(id: number, userData: Partial<NewUser>): Promise<User | undefined> {
    const result = await db.update(users)
      .set({ ...userData, updatedAt: new Date().toISOString() })
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      await db.delete(users).where(eq(users.id, id));
      return true;
    } catch (error) {
      return false;
    }
  }

  async listUsers(limit = 10, offset = 0): Promise<User[]> {
    return db.select().from(users).limit(limit).offset(offset);
  }

  async getUserCount(): Promise<number> {
    const result = await db.select({ count: count() }).from(users);
    return result[0]?.count || 0;
  }
}

// 导出服务实例
export const userService = new UserService();
