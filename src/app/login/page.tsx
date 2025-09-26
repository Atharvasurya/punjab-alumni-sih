'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { GraduationCap, LogIn, AlertCircle } from 'lucide-react'
import PunjabLogo from '@/components/PunjabLogo'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (data.ok && data.role) {
        // Redirect based on role
        switch (data.role) {
          case 'alumni':
            router.push('/dashboard/alumni')
            break
          case 'students':
            router.push('/dashboard/students')
            break
          case 'admin':
            router.push('/dashboard/admin')
            break
          case 'collage':
            router.push('/dashboard/collage')
            break
          default:
            router.push('/dashboard')
        }
      } else {
        setError(data.message || 'Login failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const demoAccounts = [
    { role: 'Alumni', username: 'alumni', password: 'alumni@123', color: 'text-primary-600' },
    { role: 'Students', username: 'students', password: 'students@123', color: 'text-green-600' },
    { role: 'Admin', username: 'admin', password: 'admin@123', color: 'text-orange-600' },
    { role: 'College', username: 'collage', password: 'collage@123', color: 'text-purple-600' },
  ]

  const fillDemo = (username: string, password: string) => {
    setUsername(username)
    setPassword(password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 text-primary-500 hover:text-primary-600 mb-4">
            <PunjabLogo size="lg" />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-orange-600">Government Of Punjab</span>
              <span className="text-sm font-medium text-gray-700">Alumni System</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to access the centralized alumni system</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center gap-2 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>

        {/* Demo Accounts */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Demo Accounts
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {demoAccounts.map((account) => (
              <button
                key={account.username}
                onClick={() => fillDemo(account.username, account.password)}
                className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors duration-200 text-left"
              >
                <div className={`font-semibold ${account.color} text-sm`}>
                  {account.role}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {account.username}
                </div>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 text-center mt-4">
            Click any account above to auto-fill credentials
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link 
            href="/" 
            className="text-primary-500 hover:text-primary-600 text-sm transition-colors duration-200"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
