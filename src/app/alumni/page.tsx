'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import DirectoryTable from '@/components/DirectoryTable'
import { Users, TrendingUp } from 'lucide-react'

interface Alumni {
  id: string
  name: string
  email: string
  current_job: {
    title: string
    company: string
  }
  skills: string[]
  year: number
  branch: string
  address?: string
}

export default function AlumniDirectoryPage() {
  const [alumni, setAlumni] = useState<Alumni[]>([])
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<'alumni' | 'students' | 'admin' | 'collage'>('students')

  useEffect(() => {
    fetchAlumni()
    // In a real app, get user role from auth context
    // For demo, we'll assume students role
  }, [])

  const fetchAlumni = async () => {
    try {
      const response = await fetch('/api/alumni')
      if (response.ok) {
        const data = await response.json()
        setAlumni(data)
      }
    } catch (error) {
      console.error('Error fetching alumni:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = (alumniId: string) => {
    alert(`Connection request sent to alumni ${alumniId}`)
  }

  const handleMessage = (alumniId: string) => {
    alert(`Opening message dialog for alumni ${alumniId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar userRole={userRole} />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole={userRole} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-8 w-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Alumni Directory</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Connect with our accomplished alumni network and discover mentorship opportunities.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Alumni</p>
                <p className="text-2xl font-bold text-gray-900">{alumni.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Mentors</p>
                <p className="text-2xl font-bold text-gray-900">
                  {alumni.filter(a => a.id.includes('al_')).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Companies</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(alumni.map(a => a.current_job.company)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Directory Table */}
        <DirectoryTable 
          alumni={alumni}
          onConnect={handleConnect}
          onMessage={handleMessage}
        />
      </div>
    </div>
  )
}
