'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardRedirect() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for auth cookie and redirect to appropriate dashboard
    const checkAuthAndRedirect = () => {
      try {
        // Check if we're in the browser
        if (typeof window === 'undefined') {
          setLoading(false)
          return
        }

        const authCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('auth-role='))
        
        if (authCookie) {
          const role = authCookie.split('=')[1]
          
          // Redirect to role-specific dashboard
          switch (role) {
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
              router.push('/login')
          }
        } else {
          // No auth cookie, redirect to login
          router.push('/login')
        }
      } catch (error) {
        console.error('Error checking auth:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    // Add a small delay to ensure client-side rendering
    const timer = setTimeout(checkAuthAndRedirect, 100)
    return () => clearTimeout(timer)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to your dashboard...</p>
        </div>
      </div>
    )
  }

  return null
}
