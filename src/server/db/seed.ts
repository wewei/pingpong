import { db } from './index';
import { userService, postService, commentService } from './services';

async function seed() {
  try {
    console.log('🌱 Seeding database...');

    // 创建示例用户
    const user1 = await userService.createUser({
      username: 'admin',
      email: 'admin@pingpong.com',
      password: 'hashed_password_123' // 在实际应用中应该哈希密码
    });

    const user2 = await userService.createUser({
      username: 'alice',
      email: 'alice@example.com',
      password: 'hashed_password_456'
    });

    const user3 = await userService.createUser({
      username: 'bob',
      email: 'bob@example.com',
      password: 'hashed_password_789'
    });

    console.log(`👥 Created ${3} users`);

    // 创建示例文章
    const post1 = await postService.createPost({
      title: 'Welcome to PingPong!',
      content: `# Welcome to PingPong!

This is our first blog post. PingPong is a modern fullstack application built with:

- **Backend**: Bun + Hono
- **Frontend**: React + TypeScript
- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: Drizzle ORM

We hope you enjoy using our platform!`,
      authorId: user1.id,
      published: true
    });

    const post2 = await postService.createPost({
      title: 'Building Modern Web Apps',
      content: `# Building Modern Web Apps

In this post, we'll explore the technologies that power modern web applications:

## Frontend Technologies
- React for UI components
- TypeScript for type safety
- Vite for fast development

## Backend Technologies
- Bun as the JavaScript runtime
- Hono for the web framework
- Drizzle ORM for database operations

Stay tuned for more content!`,
      authorId: user2.id,
      published: true
    });

    const post3 = await postService.createPost({
      title: 'Draft: Future Features',
      content: `# Future Features

This is a draft post outlining future features:

- User authentication
- File uploads
- Real-time notifications
- Search functionality`,
      authorId: user1.id,
      published: false
    });

    console.log(`📝 Created ${3} posts`);

    // 创建示例评论
    await commentService.createComment({
      content: 'Great introduction! Looking forward to learning more.',
      postId: post1.id,
      authorId: user2.id
    });

    await commentService.createComment({
      content: 'Thanks for sharing this. The tech stack looks impressive!',
      postId: post1.id,
      authorId: user3.id
    });

    await commentService.createComment({
      content: 'Very informative post about modern web development.',
      postId: post2.id,
      authorId: user1.id
    });

    await commentService.createComment({
      content: 'I love the Bun + Hono combination!',
      postId: post2.id,
      authorId: user3.id
    });

    console.log(`💬 Created ${4} comments`);

    // 显示统计信息
    const userCount = await userService.getUserCount();
    const postCount = await postService.getPostCount();
    const commentCount = await commentService.getCommentCount();

    console.log('\n📊 Database seeded successfully!');
    console.log(`   Users: ${userCount}`);
    console.log(`   Posts: ${postCount}`);
    console.log(`   Comments: ${commentCount}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// 只有直接运行此脚本时才执行 seed
if (import.meta.main) {
  await seed();
  process.exit(0);
}
