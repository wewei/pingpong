# 🏓 PingPong

A modern fullstack website built with Bun, featuring a React frontend and Hono backend.

## 🚀 Tech Stack

- **Runtime**: [Bun](https://bun.sh/) - Fast JavaScript runtime
- **Backend**: [Hono](https://hono.dev/) - Lightweight web framework
- **Frontend**: [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/) - Fast frontend build tool

## 📁 Project Structure

```
pingpong/
├── src/
│   ├── server/           # Backend code (Hono)
│   │   ├── db/           # Database layer
│   │   │   ├── schema/   # Database schema definitions
│   │   │   ├── services/ # Data access services
│   │   │   ├── migrations/ # Database migrations
│   │   │   ├── seed.ts   # Database seeding script
│   │   │   └── index.ts  # Database connection
│   │   └── index.ts      # Server entry point
│   └── client/           # Frontend code (React)
│       ├── src/
│       │   ├── App.tsx   # Main React component
│       │   ├── main.tsx  # React entry point
│       │   ├── App.css   # Component styles
│       │   └── index.css # Global styles
│       ├── index.html    # HTML template
│       └── vite.config.ts # Vite configuration
├── data/                 # Database files (ignored by Git)
│   ├── dev.db           # Development database
│   ├── README.md        # Database documentation
│   └── .env.example     # Database environment examples
├── dist/                 # Production build output
├── package.json          # Root dependencies
└── README.md            # This file
```

## 🛠️ Development

### Prerequisites

Make sure you have [Bun](https://bun.sh/) installed:

```bash
# Install Bun (if not already installed)
curl -fsSL https://bun.sh/install | bash
```

### Getting Started

1. **Install dependencies**:
   ```bash
   bun install
   ```

2. **Start development servers**:
   ```bash
   bun run dev
   ```
   
   This starts both the backend server (port 3000) and frontend dev server (port 5173).

3. **Open your browser**:
   Navigate to `http://localhost:5173` to see the application.

### Individual Commands

- **Backend only**: `bun run dev:server`
- **Frontend only**: `bun run dev:client`
- **Build for production**: `bun run build`
- **Start production server**: `bun run start`

### Database Commands

- **Generate migrations**: `bun run db:generate`
- **Apply migrations**: `bun run db:push`
- **Seed with sample data**: `bun run db:seed`
- **Open database studio**: `bun run db:studio`
- **Reset database**: `bun run db:reset` (Unix) or `bun run db:reset:win` (Windows)

## 🌐 API Endpoints

### Core Endpoints
- `GET /api/health` - Health check endpoint
- `GET /api/ping` - Simple ping endpoint  
- `POST /api/echo` - Echo back the request body
- `GET /api/stats` - Database statistics

### User Management
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user

### Posts & Content
- `GET /api/posts` - List posts (add `?published=true` for published only)
- `GET /api/posts/:id` - Get post by ID
- `POST /api/posts` - Create new post

### Comments
- `GET /api/posts/:id/comments` - Get comments for a post
- `POST /api/posts/:id/comments` - Add comment to a post

## 🎯 Features

- ✅ Hot reload for both frontend and backend
- ✅ TypeScript support
- ✅ API proxy during development
- ✅ Production-ready build process
- ✅ Modern CSS with dark/light mode support
- ✅ Interactive demo with server communication

## 📦 Building for Production

```bash
# Build both client and server
bun run build

# Start production server
bun run start
```

The production server will serve the built React app from the `/dist/client` directory and handle API routes.

## 🚀 Deployment

The app is ready to be deployed to any platform that supports Bun:

- [Railway](https://railway.app/)
- [Render](https://render.com/)
- [Fly.io](https://fly.io/)
- Or any VPS with Bun installed

Make sure to set the `NODE_ENV=production` environment variable in production.

## 🤝 Contributing

Feel free to submit issues and pull requests!

## 📄 License

MIT License - see LICENSE file for details.
