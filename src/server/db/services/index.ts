import { eq, desc, count } from 'drizzle-orm';
import { db } from '../index';
import { users, posts, comments, type User, type NewUser, type Post, type NewPost, type Comment, type NewComment } from '../schema';

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

// 文章服务
export class PostService {
  async createPost(postData: NewPost): Promise<Post> {
    const [post] = await db.insert(posts).values(postData).returning();
    return post;
  }

  async getPostById(id: number): Promise<Post | undefined> {
    const result = await db.select().from(posts).where(eq(posts.id, id));
    return result[0];
  }

  async getPostsByAuthor(authorId: number, limit = 10, offset = 0): Promise<Post[]> {
    return db.select()
      .from(posts)
      .where(eq(posts.authorId, authorId))
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getPublishedPosts(limit = 10, offset = 0): Promise<Post[]> {
    return db.select()
      .from(posts)
      .where(eq(posts.published, true))
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getAllPosts(limit = 10, offset = 0): Promise<Post[]> {
    return db.select()
      .from(posts)
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async updatePost(id: number, postData: Partial<NewPost>): Promise<Post | undefined> {
    const result = await db.update(posts)
      .set({ ...postData, updatedAt: new Date().toISOString() })
      .where(eq(posts.id, id))
      .returning();
    return result[0];
  }

  async deletePost(id: number): Promise<boolean> {
    try {
      await db.delete(posts).where(eq(posts.id, id));
      return true;
    } catch (error) {
      return false;
    }
  }

  async publishPost(id: number): Promise<Post | undefined> {
    return this.updatePost(id, { published: true });
  }

  async unpublishPost(id: number): Promise<Post | undefined> {
    return this.updatePost(id, { published: false });
  }

  async getPostCount(): Promise<number> {
    const result = await db.select({ count: count() }).from(posts);
    return result[0]?.count || 0;
  }
}

// 评论服务
export class CommentService {
  async createComment(commentData: NewComment): Promise<Comment> {
    const [comment] = await db.insert(comments).values(commentData).returning();
    return comment;
  }

  async getCommentById(id: number): Promise<Comment | undefined> {
    const result = await db.select().from(comments).where(eq(comments.id, id));
    return result[0];
  }

  async getCommentsByPost(postId: number, limit = 50, offset = 0): Promise<Comment[]> {
    return db.select()
      .from(comments)
      .where(eq(comments.postId, postId))
      .orderBy(desc(comments.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getCommentsByAuthor(authorId: number, limit = 10, offset = 0): Promise<Comment[]> {
    return db.select()
      .from(comments)
      .where(eq(comments.authorId, authorId))
      .orderBy(desc(comments.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async updateComment(id: number, commentData: Partial<NewComment>): Promise<Comment | undefined> {
    const result = await db.update(comments)
      .set({ ...commentData, updatedAt: new Date().toISOString() })
      .where(eq(comments.id, id))
      .returning();
    return result[0];
  }

  async deleteComment(id: number): Promise<boolean> {
    try {
      await db.delete(comments).where(eq(comments.id, id));
      return true;
    } catch (error) {
      return false;
    }
  }

  async getCommentCount(): Promise<number> {
    const result = await db.select({ count: count() }).from(comments);
    return result[0]?.count || 0;
  }
}

// 导出服务实例
export const userService = new UserService();
export const postService = new PostService();
export const commentService = new CommentService();
