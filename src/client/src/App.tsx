import { useState, useEffect } from 'react'
import './App.css'

interface ApiResponse {
  status?: string;
  message?: string;
  timestamp?: string;
  database?: string;
  echo?: any;
}

interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
  published: boolean;
  createdAt: string;
}

interface Stats {
  users: number;
  posts: number;
  comments: number;
  timestamp: string;
}

function App() {
  const [count, setCount] = useState(0)
  const [healthStatus, setHealthStatus] = useState<ApiResponse | null>(null)
  const [echoResult, setEchoResult] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [activeTab, setActiveTab] = useState('demo')

  useEffect(() => {
    // Check server health on component mount
    checkHealth()
    fetchStats()
  }, [])

  const checkHealth = async () => {
    try {
      const response = await fetch('/api/health')
      const data = await response.json()
      setHealthStatus(data)
    } catch (error) {
      console.error('Health check failed:', error)
      setHealthStatus({ status: 'error', message: 'Server unreachable' })
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats')
      const result = await response.json()
      if (result.data) {
        setStats(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/users')
      const result = await response.json()
      if (result.data) {
        setUsers(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/posts?published=true')
      const result = await response.json()
      if (result.data) {
        setPosts(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const pingServer = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/ping')
      const data = await response.json()
      setEchoResult(data)
    } catch (error) {
      console.error('Ping failed:', error)
      setEchoResult({ message: 'Ping failed' })
    } finally {
      setLoading(false)
    }
  }

  const sendEcho = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/echo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Hello from client!',
          count: count,
          timestamp: new Date().toISOString()
        })
      })
      const data = await response.json()
      setEchoResult(data)
    } catch (error) {
      console.error('Echo failed:', error)
      setEchoResult({ message: 'Echo failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <div className="container">
        <h1>🏓 PingPong</h1>
        <p className="subtitle">Fullstack app with Database Persistence</p>

        <div className="card">
          <h2>Server Status</h2>
          {healthStatus ? (
            <div className={`status ${healthStatus.status === 'ok' ? 'ok' : 'error'}`}>
              <p><strong>Status:</strong> {healthStatus.status}</p>
              <p><strong>Message:</strong> {healthStatus.message}</p>
              <p><strong>Database:</strong> {healthStatus.database || 'unknown'}</p>
              {healthStatus.timestamp && (
                <p><strong>Time:</strong> {new Date(healthStatus.timestamp).toLocaleString()}</p>
              )}
            </div>
          ) : (
            <p>Checking server...</p>
          )}
        </div>

        {stats && (
          <div className="card">
            <h2>📊 Database Statistics</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">{stats.users}</span>
                <span className="stat-label">Users</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.posts}</span>
                <span className="stat-label">Posts</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.comments}</span>
                <span className="stat-label">Comments</span>
              </div>
            </div>
          </div>
        )}

        <div className="card">
          <div className="tabs">
            <button
              className={`tab-button ${activeTab === 'demo' ? 'active' : ''}`}
              onClick={() => setActiveTab('demo')}
            >
              API Demo
            </button>
            <button
              className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => { setActiveTab('users'); if (users.length === 0) fetchUsers(); }}
            >
              Users
            </button>
            <button
              className={`tab-button ${activeTab === 'posts' ? 'active' : ''}`}
              onClick={() => { setActiveTab('posts'); if (posts.length === 0) fetchPosts(); }}
            >
              Posts
            </button>
          </div>

          {activeTab === 'demo' && (
            <div className="tab-content">
              <h2>Interactive Demo</h2>
              <div className="counter">
                <button onClick={() => setCount((count) => count + 1)}>
                  count is {count}
                </button>
              </div>

              <div className="api-buttons">
                <button onClick={pingServer} disabled={loading}>
                  🏓 Ping Server
                </button>
                <button onClick={sendEcho} disabled={loading}>
                  📡 Send Echo
                </button>
              </div>

              {loading && <p>Loading...</p>}

              {echoResult && (
                <div className="api-result">
                  <h3>Server Response:</h3>
                  <pre>{JSON.stringify(echoResult, null, 2)}</pre>
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="tab-content">
              <h2>👥 Users</h2>
              <button onClick={fetchUsers} disabled={loading}>
                🔄 Refresh Users
              </button>
              {loading && <p>Loading users...</p>}
              {users.length > 0 && (
                <div className="data-list">
                  {users.map(user => (
                    <div key={user.id} className="data-item">
                      <h4>{user.username}</h4>
                      <p>Email: {user.email}</p>
                      <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'posts' && (
            <div className="tab-content">
              <h2>📝 Published Posts</h2>
              <button onClick={fetchPosts} disabled={loading}>
                🔄 Refresh Posts
              </button>
              {loading && <p>Loading posts...</p>}
              {posts.length > 0 && (
                <div className="data-list">
                  {posts.map(post => (
                    <div key={post.id} className="data-item">
                      <h4>{post.title}</h4>
                      <p>{post.content.substring(0, 200)}...</p>
                      <p>Published: {new Date(post.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="card">
          <h2>🛠️ Tech Stack</h2>
          <ul>
            <li><strong>Runtime:</strong> Bun</li>
            <li><strong>Backend:</strong> Hono + Drizzle ORM</li>
            <li><strong>Database:</strong> SQLite (dev) / PostgreSQL (prod)</li>
            <li><strong>Frontend:</strong> React + TypeScript</li>
            <li><strong>Build Tool:</strong> Vite</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App