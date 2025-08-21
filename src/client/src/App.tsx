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
  Chip,
  Progress,
  Spacer,
  Avatar,
  Badge,
  Divider,
  Tabs,
  Tab
} from '@nextui-org/react'
import { Plus, Users, FileText, MessageCircle, Server, Database, Zap, Activity } from 'lucide-react'

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container mx-auto max-w-6xl p-6">
        {/* Hero Section */}
        <div className="text-center py-8 mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <span className="text-3xl">🏓</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              PingPong
            </h1>
          </div>
          <p className="text-xl text-default-600 max-w-2xl mx-auto leading-relaxed">
            A modern fullstack application showcasing real-time database persistence, 
            built with cutting-edge technologies
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <Chip variant="flat" color="primary" startContent={<Server size={16} />}>
              Bun Runtime
            </Chip>
            <Chip variant="flat" color="secondary" startContent={<Database size={16} />}>
              SQLite + Drizzle
            </Chip>
            <Chip variant="flat" color="success" startContent={<Zap size={16} />}>
              NextUI
            </Chip>
          </div>
        </div>

        {/* Status Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Server Status Card */}
          <Card className="shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-0">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <Avatar 
                  icon={<Activity size={20} />}
                  className="bg-gradient-to-r from-green-500 to-emerald-500"
                  size="sm"
                />
                <div className="flex flex-col">
                  <p className="text-lg font-bold text-green-700 dark:text-green-400">Server Status</p>
                  <p className="text-small text-default-500">Real-time health monitoring</p>
                </div>
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              {healthStatus ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">System Status</span>
                    <Chip 
                      color={healthStatus.status === 'ok' ? 'success' : 'danger'}
                      variant="shadow"
                      size="sm"
                      className="font-semibold"
                    >
                      {healthStatus.status === 'ok' ? '✅ Online' : '❌ Offline'}
                    </Chip>
                  </div>
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 space-y-2">
                    <p className="text-sm"><strong>Message:</strong> {healthStatus.message}</p>
                    <p className="text-sm"><strong>Database:</strong> {healthStatus.database || 'unknown'}</p>
                    {healthStatus.timestamp && (
                      <p className="text-xs text-default-400">
                        Last check: {new Date(healthStatus.timestamp).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Progress size="sm" isIndeterminate className="mb-2" />
                  <p className="text-sm text-default-400">Checking server status...</p>
                </div>
              )}
              <Spacer y={2} />
              <Button 
                onClick={checkHealth} 
                disabled={loading} 
                color="success"
                variant="shadow"
                className="w-full font-semibold"
                startContent={<Activity size={16} />}
              >
                {loading ? 'Checking...' : 'Refresh Status'}
              </Button>
            </CardBody>
          </Card>

          {/* Database Statistics Card */}
          {stats && (
            <Card className="shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-0">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <Avatar 
                    icon={<Database size={20} />}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500"
                    size="sm"
                  />
                  <div className="flex flex-col">
                    <p className="text-lg font-bold text-blue-700 dark:text-blue-400">Database Stats</p>
                    <p className="text-small text-default-500">Live data metrics</p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <Users size={16} className="text-blue-500 mr-1" />
                      <span className="text-2xl font-bold text-blue-600">{stats.users}</span>
                    </div>
                    <div className="text-xs text-default-500">Users</div>
                  </div>
                  <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <FileText size={16} className="text-purple-500 mr-1" />
                      <span className="text-2xl font-bold text-purple-600">{stats.posts}</span>
                    </div>
                    <div className="text-xs text-default-500">Posts</div>
                  </div>
                  <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <MessageCircle size={16} className="text-green-500 mr-1" />
                      <span className="text-2xl font-bold text-green-600">{stats.comments}</span>
                    </div>
                    <div className="text-xs text-default-500">Comments</div>
                  </div>
                </div>
                <p className="text-xs text-default-400 text-center mt-3">
                  📊 Updated: {new Date(stats.timestamp).toLocaleString()}
                </p>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Main Content */}
        <Card className="shadow-2xl border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
          <CardBody className="p-0">
            <Tabs 
              aria-label="Application features" 
              color="primary"
              variant="underlined"
              classNames={{
                tabList: "gap-6 w-full relative rounded-none p-6 border-b border-divider bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20",
                cursor: "w-full bg-gradient-to-r from-blue-500 to-purple-500",
                tab: "max-w-fit px-4 py-3 h-12",
                tabContent: "group-data-[selected=true]:text-primary font-semibold"
              }}
              selectedKey={activeTab}
              onSelectionChange={(key) => {
                const tabKey = key as string;
                setActiveTab(tabKey);
                if (tabKey === 'users' && users.length === 0) fetchUsers();
                if (tabKey === 'posts' && posts.length === 0) fetchPosts();
              }}
            >
              <Tab 
                key="demo" 
                title={
                  <div className="flex items-center space-x-2">
                    <Zap size={18} />
                    <span>Interactive Demo</span>
                  </div>
                }
              >
                <div className="p-6 space-y-6">
                  {/* Counter Demo */}
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-orange-700 dark:text-orange-400 mb-4">🎯 Counter Demo</h3>
                    <div className="flex items-center justify-center gap-4">
                      <Button 
                        onClick={() => setCount((count) => count + 1)} 
                        color="warning"
                        variant="shadow"
                        size="lg"
                        className="font-bold px-8"
                      >
                        Count: {count} 🚀
                      </Button>
                    </div>
                  </div>

                  {/* API Demo */}
                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-cyan-700 dark:text-cyan-400 mb-4">🌐 API Testing</h3>
                    <div className="flex flex-wrap gap-3 justify-center">
                      <Button 
                        onClick={pingServer} 
                        disabled={loading} 
                        color="primary"
                        variant="shadow"
                        startContent={<Activity size={16} />}
                        className="font-semibold"
                      >
                        🏓 Ping Server
                      </Button>
                      <Button 
                        onClick={sendEcho} 
                        disabled={loading} 
                        color="secondary"
                        variant="shadow"
                        startContent={<MessageCircle size={16} />}
                        className="font-semibold"
                      >
                        📡 Send Echo
                      </Button>
                    </div>

                    {loading && (
                      <div className="mt-4 text-center">
                        <Progress size="sm" isIndeterminate className="mb-2" />
                        <p className="text-default-500">Processing request...</p>
                      </div>
                    )}

                    {echoResult && (
                      <div className="mt-6">
                        <Card className="bg-white/80 dark:bg-gray-800/80">
                          <CardHeader>
                            <p className="text-lg font-semibold text-success">✅ Server Response</p>
                          </CardHeader>
                          <CardBody>
                            <pre className="text-sm bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-auto border">
                              {JSON.stringify(echoResult, null, 2)}
                            </pre>
                          </CardBody>
                        </Card>
                      </div>
                    )}
                  </div>
                </div>
              </Tab>

              <Tab 
                key="users" 
                title={
                  <div className="flex items-center space-x-2">
                    <Users size={18} />
                    <span>Users</span>
                    <Badge content={users.length.toString()} color="primary" size="sm">
                      <span></span>
                    </Badge>
                  </div>
                }
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-blue-700 dark:text-blue-400">👥 User Management</h3>
                    <div className="flex gap-2">
                      <Button 
                        onClick={fetchUsers} 
                        disabled={loading} 
                        color="primary" 
                        variant="bordered"
                        startContent={<Activity size={16} />}
                      >
                        Refresh
                      </Button>
                      <Button 
                        onPress={onOpen} 
                        color="primary"
                        variant="shadow"
                        startContent={<Plus size={16} />}
                        className="font-semibold"
                      >
                        Add User
                      </Button>
                    </div>
                  </div>

                  {loading && (
                    <div className="text-center py-8">
                      <Progress size="md" isIndeterminate className="mb-4" />
                      <p className="text-default-500">Loading users...</p>
                    </div>
                  )}

                  {users.length > 0 && (
                    <div className="grid gap-4">
                      {users.map(user => (
                        <Card 
                          key={user.id} 
                          className="shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-0"
                        >
                          <CardBody className="p-4">
                            <div className="flex items-center gap-4">
                              <Avatar 
                                name={user.username}
                                className="bg-gradient-to-r from-blue-500 to-purple-500"
                                size="lg"
                              />
                              <div className="flex-grow">
                                <h4 className="font-bold text-lg text-blue-700 dark:text-blue-400">{user.username}</h4>
                                <p className="text-default-600">{user.email}</p>
                                <div className="flex items-center gap-4 mt-2">
                                  <Chip size="sm" variant="flat" color="default">
                                    ID: {user.id}
                                  </Chip>
                                  <p className="text-xs text-default-400">
                                    📅 {new Date(user.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </Tab>

              <Tab 
                key="posts" 
                title={
                  <div className="flex items-center space-x-2">
                    <FileText size={18} />
                    <span>Posts</span>
                    <Badge content={posts.length.toString()} color="secondary" size="sm">
                      <span></span>
                    </Badge>
                  </div>
                }
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-purple-700 dark:text-purple-400">📝 Published Posts</h3>
                    <Button 
                      onClick={fetchPosts} 
                      disabled={loading} 
                      color="secondary" 
                      variant="bordered"
                      startContent={<Activity size={16} />}
                    >
                      Refresh Posts
                    </Button>
                  </div>

                  {loading && (
                    <div className="text-center py-8">
                      <Progress size="md" isIndeterminate className="mb-4" />
                      <p className="text-default-500">Loading posts...</p>
                    </div>
                  )}

                  {posts.length > 0 && (
                    <div className="grid gap-6">
                      {posts.map(post => (
                        <Card 
                          key={post.id} 
                          className="shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-0"
                        >
                          <CardBody className="p-6">
                            <div className="flex items-start gap-4">
                              <Avatar 
                                icon={<FileText size={20} />}
                                className="bg-gradient-to-r from-purple-500 to-pink-500"
                              />
                              <div className="flex-grow">
                                <h4 className="font-bold text-xl text-purple-700 dark:text-purple-400 mb-2">
                                  {post.title}
                                </h4>
                                <p className="text-default-600 leading-relaxed mb-4">
                                  {post.content.length > 200 
                                    ? `${post.content.substring(0, 200)}...` 
                                    : post.content}
                                </p>
                                <div className="flex items-center gap-3">
                                  <Chip size="sm" variant="flat" color="success">
                                    ✅ Published
                                  </Chip>
                                  <p className="text-xs text-default-400">
                                    📅 {new Date(post.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </Tab>
            </Tabs>
          </CardBody>
        </Card>

        {/* User Creation Modal */}
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Avatar icon={<Users size={20} />} className="bg-gradient-to-r from-blue-500 to-purple-500" size="sm" />
                    <span>Create New User</span>
                  </div>
                </ModalHeader>
                <ModalBody>
                  <Input
                    autoFocus
                    label="Username"
                    placeholder="Enter username"
                    variant="bordered"
                    startContent={<Users size={16} />}
                    value={newUser.username}
                    onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
                  />
                  <Input
                    label="Email"
                    placeholder="Enter email address"
                    variant="bordered"
                    startContent={<span>@</span>}
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button 
                    color="primary" 
                    onPress={createUser} 
                    disabled={loading}
                    startContent={loading ? undefined : <Plus size={16} />}
                  >
                    {loading ? 'Creating...' : 'Create User'}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        {/* Tech Stack Section */}
        <Card className="shadow-xl bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800 border-0">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Avatar 
                icon={<Activity size={20} />}
                className="bg-gradient-to-r from-gray-600 to-slate-600"
                size="sm"
              />
              <div className="flex flex-col">
                <p className="text-lg font-bold text-gray-700 dark:text-gray-300">🛠️ Tech Stack</p>
                <p className="text-small text-default-500">Modern technologies powering this application</p>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-white/80 dark:bg-gray-700/50 rounded-lg p-4">
                  <h4 className="font-bold text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-2">
                    <span>🎨</span> Frontend
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Chip size="sm" variant="flat" color="primary">React 18</Chip>
                      <span className="text-sm">+ TypeScript</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Chip size="sm" variant="flat" color="secondary">NextUI</Chip>
                      <span className="text-sm">Modern Components</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Chip size="sm" variant="flat" color="success">Tailwind CSS</Chip>
                      <span className="text-sm">Utility-first</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Chip size="sm" variant="flat" color="warning">Vite</Chip>
                      <span className="text-sm">Lightning Fast</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white/80 dark:bg-gray-700/50 rounded-lg p-4">
                  <h4 className="font-bold text-purple-600 dark:text-purple-400 mb-3 flex items-center gap-2">
                    <span>⚡</span> Backend
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Chip size="sm" variant="flat" color="primary">Bun Runtime</Chip>
                      <span className="text-sm">Ultra Fast</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Chip size="sm" variant="flat" color="secondary">Hono</Chip>
                      <span className="text-sm">Web Framework</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Chip size="sm" variant="flat" color="success">SQLite</Chip>
                      <span className="text-sm">+ Drizzle ORM</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Chip size="sm" variant="flat" color="warning">TypeScript</Chip>
                      <span className="text-sm">Type Safety</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default App
