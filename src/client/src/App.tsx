import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Label } from './components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog'
import { Plus } from 'lucide-react'

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
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false)
  const [newUser, setNewUser] = useState({ username: '', email: '' })

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

  const createUser = async () => {
    if (!newUser.username || !newUser.email) return
    
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser)
      })
      
      if (response.ok) {
        setNewUser({ username: '', email: '' })
        setIsCreateUserOpen(false)
        fetchUsers()
        fetchStats()
      }
    } catch (error) {
      console.error('Failed to create user:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">🏓 PingPong</h1>
          <p className="text-xl text-muted-foreground">Fullstack app with Database Persistence</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Server Status</CardTitle>
            <CardDescription>Current server health and database connection</CardDescription>
          </CardHeader>
          <CardContent>
            {healthStatus ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Status:</span>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    healthStatus.status === 'ok' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {healthStatus.status}
                  </span>
                </div>
                <p className="text-sm"><strong>Message:</strong> {healthStatus.message}</p>
                <p className="text-sm"><strong>Database:</strong> {healthStatus.database || 'unknown'}</p>
                {healthStatus.timestamp && (
                  <p className="text-sm"><strong>Time:</strong> {new Date(healthStatus.timestamp).toLocaleString()}</p>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">Checking server...</p>
            )}
          </CardContent>
        </Card>

        {stats && (
          <Card>
            <CardHeader>
              <CardTitle>📊 Database Statistics</CardTitle>
              <CardDescription>Current data in the database</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-primary">{stats.users}</div>
                  <div className="text-sm text-muted-foreground">Users</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-primary">{stats.posts}</div>
                  <div className="text-sm text-muted-foreground">Posts</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-primary">{stats.comments}</div>
                  <div className="text-sm text-muted-foreground">Comments</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <div className="flex space-x-1">
              <Button
                variant={activeTab === 'demo' ? 'default' : 'outline'}
                onClick={() => setActiveTab('demo')}
              >
                API Demo
              </Button>
              <Button
                variant={activeTab === 'users' ? 'default' : 'outline'}
                onClick={() => { setActiveTab('users'); if (users.length === 0) fetchUsers(); }}
              >
                Users
              </Button>
              <Button
                variant={activeTab === 'posts' ? 'default' : 'outline'}
                onClick={() => { setActiveTab('posts'); if (posts.length === 0) fetchPosts(); }}
              >
                Posts
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {activeTab === 'demo' && (
              <div className="space-y-4">
                <CardTitle>Interactive Demo</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                  </Button>
                </div>

                <div className="flex space-x-2">
                  <Button onClick={pingServer} disabled={loading}>
                    🏓 Ping Server
                  </Button>
                  <Button onClick={sendEcho} disabled={loading}>
                    📡 Send Echo
                  </Button>
                </div>

                {loading && <p className="text-muted-foreground">Loading...</p>}

                {echoResult && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Server Response:</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-sm bg-muted p-3 rounded-md overflow-auto">
                        {JSON.stringify(echoResult, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <CardTitle>👥 Users</CardTitle>
                  <Button onClick={fetchUsers} disabled={loading}>
                    🔄 Refresh Users
                  </Button>
                </div>
                {loading && <p className="text-muted-foreground">Loading users...</p>}
                {users.length > 0 && (
                  <div className="space-y-3">
                    {users.map(user => (
                      <Card key={user.id}>
                        <CardContent className="pt-6">
                          <h4 className="font-semibold">{user.username}</h4>
                          <p className="text-sm text-muted-foreground">Email: {user.email}</p>
                          <p className="text-sm text-muted-foreground">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New User</DialogTitle>
                      <DialogDescription>
                        Enter the details of the new user to create an account.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={newUser.username}
                          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                          placeholder="Enter username"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                          placeholder="Enter email"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsCreateUserOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={createUser} disabled={loading}>
                        {loading ? 'Creating...' : 'Create User'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}

            {activeTab === 'posts' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <CardTitle>📝 Published Posts</CardTitle>
                  <Button onClick={fetchPosts} disabled={loading}>
                    🔄 Refresh Posts
                  </Button>
                </div>
                {loading && <p className="text-muted-foreground">Loading posts...</p>}
                {posts.length > 0 && (
                  <div className="space-y-3">
                    {posts.map(post => (
                      <Card key={post.id}>
                        <CardContent className="pt-6">
                          <h4 className="font-semibold">{post.title}</h4>
                          <p className="text-sm text-muted-foreground">{post.content.substring(0, 200)}...</p>
                          <p className="text-sm text-muted-foreground">Published: {new Date(post.createdAt).toLocaleDateString()}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🛠️ Tech Stack</CardTitle>
            <CardDescription>Technologies used in this application</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex justify-between">
                <span className="font-medium">Runtime:</span>
                <span className="text-muted-foreground">Bun</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Backend:</span>
                <span className="text-muted-foreground">Hono + Drizzle ORM</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Database:</span>
                <span className="text-muted-foreground">SQLite (dev) / PostgreSQL (prod)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Frontend:</span>
                <span className="text-muted-foreground">React + TypeScript</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Build Tool:</span>
                <span className="text-muted-foreground">Vite</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">UI Components:</span>
                <span className="text-muted-foreground">Radix UI + Tailwind CSS</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App