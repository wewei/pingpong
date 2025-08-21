import { useState, useEffect } from 'react'
import { 
  Card, 
  CardHeader, 
  CardBody, 
  Button, 
  Input, 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  useDisclosure,
  Chip
} from '@nextui-org/react'
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
  const {isOpen, onOpen, onOpenChange} = useDisclosure()
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
      setEchoResult({ status: 'error', message: 'Ping failed' })
    } finally {
      setLoading(false)
    }
  }

  const sendEcho = async () => {
    setLoading(true)
    try {
      const payload = {
        message: "Hello from React!",
        timestamp: new Date().toISOString(),
        data: { foo: "bar", nested: { key: "value" } }
      }
      
      const response = await fetch('/api/echo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      
      const data = await response.json()
      setEchoResult(data)
    } catch (error) {
      console.error('Echo failed:', error)
      setEchoResult({ status: 'error', message: 'Echo failed' })
    } finally {
      setLoading(false)
    }
  }

  const createUser = async () => {
    if (!newUser.username || !newUser.email) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      })
      
      if (response.ok) {
        setNewUser({ username: '', email: '' })
        onOpenChange()
        fetchUsers()
      }
    } catch (error) {
      console.error('Failed to create user:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">🏓 PingPong</h1>
          <p className="text-xl text-default-500">Fullstack app with Database Persistence</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col">
              <p className="text-md font-semibold">Server Status</p>
              <p className="text-small text-default-500">Current server health and database connection</p>
            </div>
          </CardHeader>
          <CardBody>
            {healthStatus ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Status:</span>
                  <Chip 
                    color={healthStatus.status === 'ok' ? 'success' : 'danger'}
                    variant="flat"
                    size="sm"
                  >
                    {healthStatus.status}
                  </Chip>
                </div>
                <p className="text-sm"><strong>Message:</strong> {healthStatus.message}</p>
                <p className="text-sm"><strong>Database:</strong> {healthStatus.database || 'unknown'}</p>
                {healthStatus.timestamp && (
                  <p className="text-sm"><strong>Time:</strong> {new Date(healthStatus.timestamp).toLocaleString()}</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-default-400">Click "Check Health" to test server connection</p>
            )}
            <div className="flex flex-wrap gap-2 mt-4">
              <Button onClick={checkHealth} disabled={loading} color="primary">
                🔄 Check Health
              </Button>
            </div>
          </CardBody>
        </Card>

        {stats && (
          <Card>
            <CardHeader>
              <div className="flex flex-col">
                <p className="text-md font-semibold">📊 Database Statistics</p>
                <p className="text-small text-default-500">Current data in the database</p>
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{stats.users}</div>
                  <div className="text-sm text-default-500">Users</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{stats.posts}</div>
                  <div className="text-sm text-default-500">Posts</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{stats.comments}</div>
                  <div className="text-sm text-default-500">Comments</div>
                </div>
              </div>
              <p className="text-xs text-default-400 text-center mt-2">
                Updated: {new Date(stats.timestamp).toLocaleString()}
              </p>
            </CardBody>
          </Card>
        )}

        <Card>
          <CardHeader>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={activeTab === 'demo' ? 'solid' : 'bordered'}
                onClick={() => setActiveTab('demo')}
                color="primary"
              >
                Demo
              </Button>
              <Button 
                variant={activeTab === 'users' ? 'solid' : 'bordered'}
                onClick={() => { setActiveTab('users'); if (users.length === 0) fetchUsers(); }}
                color="primary"
              >
                Users
              </Button>
              <Button 
                variant={activeTab === 'posts' ? 'solid' : 'bordered'}
                onClick={() => { setActiveTab('posts'); if (posts.length === 0) fetchPosts(); }}
                color="primary"
              >
                Posts
              </Button>
            </div>
          </CardHeader>

          <CardBody>
            {activeTab === 'demo' && (
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <p className="text-md font-semibold">Interactive Demo</p>
                  <div className="flex items-center space-x-2">
                    <Button onClick={() => setCount((count) => count + 1)} color="secondary">
                      count is {count}
                    </Button>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button onClick={pingServer} disabled={loading} color="primary">
                    🏓 Ping Server
                  </Button>
                  <Button onClick={sendEcho} disabled={loading} color="primary">
                    📡 Send Echo
                  </Button>
                </div>

                {loading && <p className="text-default-500">Loading...</p>}

                {echoResult && (
                  <Card>
                    <CardHeader>
                      <p className="text-lg font-semibold">Server Response:</p>
                    </CardHeader>
                    <CardBody>
                      <pre className="text-sm bg-default-100 p-3 rounded-md overflow-auto">
                        {JSON.stringify(echoResult, null, 2)}
                      </pre>
                    </CardBody>
                  </Card>
                )}
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-md font-semibold">👥 Users</p>
                  <div className="flex gap-2">
                    <Button onClick={fetchUsers} disabled={loading} color="primary" variant="bordered">
                      🔄 Refresh Users
                    </Button>
                    <Button onPress={onOpen} color="primary">
                      <Plus size={16} />
                      Add User
                    </Button>
                  </div>
                </div>
                {loading && <p className="text-default-500">Loading users...</p>}
                {users.length > 0 && (
                  <div className="space-y-3">
                    {users.map(user => (
                      <Card key={user.id}>
                        <CardBody>
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{user.username}</h4>
                              <p className="text-sm text-default-500">{user.email}</p>
                              <p className="text-xs text-default-400">ID: {user.id}</p>
                            </div>
                            <p className="text-xs text-default-400">
                              Created: {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                )}

                <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                  <ModalContent>
                    {(onClose) => (
                      <>
                        <ModalHeader className="flex flex-col gap-1">Create New User</ModalHeader>
                        <ModalBody>
                          <Input
                            autoFocus
                            label="Username"
                            placeholder="Enter username"
                            variant="bordered"
                            value={newUser.username}
                            onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
                          />
                          <Input
                            label="Email"
                            placeholder="Enter email"
                            variant="bordered"
                            value={newUser.email}
                            onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                          />
                        </ModalBody>
                        <ModalFooter>
                          <Button color="danger" variant="light" onPress={onClose}>
                            Cancel
                          </Button>
                          <Button color="primary" onPress={createUser} disabled={loading}>
                            {loading ? 'Creating...' : 'Create User'}
                          </Button>
                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                </Modal>
              </div>
            )}

            {activeTab === 'posts' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-md font-semibold">📝 Published Posts</p>
                  <Button onClick={fetchPosts} disabled={loading} color="primary" variant="bordered">
                    🔄 Refresh Posts
                  </Button>
                </div>
                {loading && <p className="text-default-500">Loading posts...</p>}
                {posts.length > 0 && (
                  <div className="space-y-3">
                    {posts.map(post => (
                      <Card key={post.id}>
                        <CardBody>
                          <h4 className="font-semibold">{post.title}</h4>
                          <p className="text-sm text-default-600">{post.content.substring(0, 200)}...</p>
                          <p className="text-sm text-default-400">Published: {new Date(post.createdAt).toLocaleDateString()}</p>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-col">
              <p className="text-md font-semibold">🛠️ Tech Stack</p>
              <p className="text-small text-default-500">Technologies used in this application</p>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="space-y-1">
                <h4 className="font-medium">Frontend</h4>
                <ul className="text-sm text-default-600 space-y-1">
                  <li>• React 18 with TypeScript</li>
                  <li>• NextUI (Components)</li>
                  <li>• Tailwind CSS (Styling)</li>
                  <li>• Vite (Build Tool)</li>
                  <li>• Lucide React (Icons)</li>
                </ul>
              </div>
              <div className="space-y-1">
                <h4 className="font-medium">Backend</h4>
                <ul className="text-sm text-default-600 space-y-1">
                  <li>• Bun Runtime</li>
                  <li>• TypeScript</li>
                  <li>• SQLite Database</li>
                  <li>• Drizzle ORM</li>
                  <li>• RESTful API</li>
                </ul>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default App
