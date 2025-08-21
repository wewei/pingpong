import { useState, useEffect } from 'react'
import './App.css'

interface ApiResponse {
  status?: string;
  message?: string;
  timestamp?: string;
  echo?: any;
}

function App() {
  const [count, setCount] = useState(0)
  const [healthStatus, setHealthStatus] = useState<ApiResponse | null>(null)
  const [echoResult, setEchoResult] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check server health on component mount
    checkHealth()
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
        <p className="subtitle">Fullstack app built with Bun + React</p>

        <div className="card">
          <h2>Server Status</h2>
          {healthStatus ? (
            <div className={`status ${healthStatus.status === 'ok' ? 'ok' : 'error'}`}>
              <p><strong>Status:</strong> {healthStatus.status}</p>
              <p><strong>Message:</strong> {healthStatus.message}</p>
              {healthStatus.timestamp && (
                <p><strong>Time:</strong> {new Date(healthStatus.timestamp).toLocaleString()}</p>
              )}
            </div>
          ) : (
            <p>Checking server...</p>
          )}
        </div>

        <div className="card">
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

        <div className="card">
          <h2>Tech Stack</h2>
          <ul>
            <li><strong>Runtime:</strong> Bun</li>
            <li><strong>Backend:</strong> Hono</li>
            <li><strong>Frontend:</strong> React + TypeScript</li>
            <li><strong>Build Tool:</strong> Vite</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App
