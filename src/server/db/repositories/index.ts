import { eq, desc, and } from 'drizzle-orm';
import { db } from '../index';
import { users, posts, comments, type User, type NewUser, type Post, type NewPost, type Comment, type NewComment } from '../schema';

// 用户仓储
export class UserRepository {
  async create(userData: NewUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async findById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async findByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async update(id: number, userData: Partial<NewUser>): Promise<User | undefined> {
    const [user] = await db.update(users)
      .set({ ...userData, updatedAt: new Date().toISOString() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async delete(id: number): Promise<boolean> {
    try {
      await db.delete(users).where(eq(users.id, id));
      return true;
    } catch (error) {
      return false;
    }
  }

  async list(limit = 10, offset = 0): Promise<User[]> {
    return db.select().from(users).limit(limit).offset(offset);
  }
}

// 文章仓储
export class PostRepository {
  async create(postData: NewPost): Promise<Post> {
    const [post] = await db.insert(posts).values(postData).returning();
    return post;
  }

  async findById(id: number): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post;
  }

  async findByAuthor(authorId: number, limit = 10, offset = 0): Promise<Post[]> {
    return db.select()
      .from(posts)
      .where(eq(posts.authorId, authorId))
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async findPublished(limit = 10, offset = 0): Promise<Post[]> {
    return db.select()
      .from(posts)
      .where(eq(posts.published, true))
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async update(id: number, postData: Partial<NewPost>): Promise<Post | undefined> {
    const [post] = await db.update(posts)
      .set({ ...postData, updatedAt: new Date().toISOString() })
      .where(eq(posts.id, id))
      .returning();
    return post;
  }

  async delete(id: number): Promise<boolean> {
    try {
      await db.delete(posts).where(eq(posts.id, id));
      return true;
    } catch (error) {
      return false;
    }
  }

  async publish(id: number): Promise<Post | undefined> {
    return this.update(id, { published: true });
  }

  async unpublish(id: number): Promise<Post | undefined> {
    return this.update(id, { published: false });
  }
}

// 评论仓储
export class CommentRepository {
  async create(commentData: NewComment): Promise<Comment> {
    const [comment] = await db.insert(comments).values(commentData).returning();
    return comment;
  }

  async findById(id: number): Promise<Comment | undefined> {
    const [comment] = await db.select().from(comments).where(eq(comments.id, id));
    return comment;
  }

  async findByPost(postId: number, limit = 50, offset = 0): Promise<Comment[]> {
    return db.select()
      .from(comments)
      .where(eq(comments.postId, postId))
      .orderBy(desc(comments.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async findByAuthor(authorId: number, limit = 10, offset = 0): Promise<Comment[]> {
    return db.select()
      .from(comments)
      .where(eq(comments.authorId, authorId))
      .orderBy(desc(comments.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async update(id: number, commentData: Partial<NewComment>): Promise<Comment | undefined> {
    const [comment] = await db.update(comments)
      .set({ ...commentData, updatedAt: new Date().toISOString() })
      .where(eq(comments.id, id))
      .returning();
    return comment;
  }

  async delete(id: number): Promise<boolean> {
    try {
      await db.delete(comments).where(eq(comments.id, id));
      return true;
    } catch (error) {
      return false;
    }
  }
}

// 导出仓储实例
export const userRepository = new UserRepository();
export const postRepository = new PostRepository();
export const commentRepository = new CommentRepository();
