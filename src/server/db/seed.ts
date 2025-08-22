import { db } from './index';
import { userService } from './services';
import { users, pingpongs, messages, metadata } from './schema';

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

    // 创建示例 PingPongs
    const pingpong1 = await db.insert(pingpongs).values({
      title: '设计新的用户界面',
      description: '需要为PingPong系统设计一个现代化的用户界面，包括任务列表、详情页面和创建表单。',
      requesterId: user1.id,
      responderId: user2.id,
      status: 'ping',
      eta: Math.floor((Date.now() + 7 * 24 * 60 * 60 * 1000) / 1000), // 7天后
    }).returning();

    const pingpong2 = await db.insert(pingpongs).values({
      title: '实现WebSocket实时通信',
      description: '为消息系统添加WebSocket支持，实现实时消息推送功能。',
      requesterId: user2.id,
      responderId: user3.id,
      status: 'pong',
      eta: Math.floor((Date.now() + 3 * 24 * 60 * 60 * 1000) / 1000), // 3天后
    }).returning();

    const pingpong3 = await db.insert(pingpongs).values({
      title: '编写API文档',
      description: '为所有的API端点编写详细的文档，包括请求参数和响应格式。',
      requesterId: user1.id,
      responderId: user3.id,
      status: 'closed',
      eta: Math.floor((Date.now() - 2 * 24 * 60 * 60 * 1000) / 1000), // 2天前
      closedAt: Math.floor(Date.now() / 1000),
    }).returning();

    console.log(`🏓 Created ${3} pingpongs`);

    // 创建示例消息
    await db.insert(messages).values([
      {
        pingpongId: pingpong1[0].id,
        senderId: user2.id,
        content: '我已经收到了这个任务，正在分析需求。你希望界面风格是什么样的？',
        messageType: 'text',
      },
      {
        pingpongId: pingpong1[0].id,
        senderId: user1.id,
        content: '我希望是简洁现代的风格，类似于现在流行的设计系统，比如Material Design或者Ant Design。',
        messageType: 'text',
      },
      {
        pingpongId: pingpong2[0].id,
        senderId: user3.id,
        content: '好的，我会使用Socket.io来实现。预计明天就能完成基础功能。',
        messageType: 'text',
      },
      {
        pingpongId: pingpong3[0].id,
        senderId: user3.id,
        content: 'API文档已经完成，已经部署到了/docs路径。',
        messageType: 'text',
      },
      {
        pingpongId: pingpong3[0].id,
        senderId: user3.id,
        content: '任务已完成并关闭。',
        messageType: 'system',
      },
    ]);

    console.log(`💬 Created ${5} messages`);

    // 创建示例元数据
    await db.insert(metadata).values([
      {
        userId: user1.id,
        pingpongId: pingpong1[0].id,
        name: '类别',
        value: '前端开发',
      },
      {
        userId: user2.id,
        pingpongId: pingpong2[0].id,
        name: '技术栈',
        value: 'Node.js + Socket.io',
      },
      {
        userId: user3.id,
        pingpongId: pingpong3[0].id,
        name: '文档类型',
        value: 'OpenAPI 3.0',
      },
    ]);

    console.log(`🏷️ Created ${3} metadata items`);

    // 显示统计信息
    const userCount = await userService.getUserCount();
    
    // 统计PingPong相关数据
    const pingpongCount = await db.$count(pingpongs);
    const messageCount = await db.$count(messages);
    const metadataCount = await db.$count(metadata);

    console.log('\n📊 Database seeded successfully!');
    console.log(`   Users: ${userCount}`);
    console.log(`   PingPongs: ${pingpongCount}`);
    console.log(`   Messages: ${messageCount}`);
    console.log(`   Metadata: ${metadataCount}`);

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
