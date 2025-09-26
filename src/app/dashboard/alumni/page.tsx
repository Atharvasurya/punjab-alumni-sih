'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import { 
  User, 
  Briefcase, 
  Calendar, 
  MessageSquare, 
  Heart, 
  Users, 
  Plus,
  Edit,
  DollarSign,
  Award
} from 'lucide-react'

interface AlumniData {
  id: string
  name: string
  email: string
  phone: string
  current_job: {
    title: string
    company: string
    description: string
  }
  skills: string[]
  mentorship: {
    isMentor: boolean
    mentees: string[]
  }
  donations: Array<{
    amount: number
    date: string
    note: string
  }>
}

export default function AlumniDashboard() {
  const [alumniData, setAlumniData] = useState<AlumniData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('profile')

  useEffect(() => {
    // For demo, use hardcoded data to avoid API issues
    const mockAlumniData: AlumniData = {
      id: 'al_0001',
      name: 'Anita Joshi',
      email: 'anita.j@example.com',
      phone: '+91-9898989898',
      current_job: {
        title: 'Software Engineer',
        company: 'Acme Inc',
        description: 'Backend development'
      },
      skills: ['React', 'Node.js', 'AWS'],
      mentorship: {
        isMentor: true,
        mentees: ['st_0003']
      },
      donations: [
        {
          amount: 5000,
          date: '2025-09-01',
          note: 'Scholarship fund'
        }
      ]
    }
    
    // Simulate loading delay
    setTimeout(() => {
      setAlumniData(mockAlumniData)
      setLoading(false)
    }, 500)
  }, [])

  const fetchAlumniData = async (id: string) => {
    try {
      const response = await fetch(`/api/alumni/${id}`)
      if (response.ok) {
        const data = await response.json()
        setAlumniData(data)
      }
    } catch (error) {
      console.error('Error fetching alumni data:', error)
      // Fallback to mock data if API fails
      setAlumniData({
        id: 'al_0001',
        name: 'Anita Joshi',
        email: 'anita.j@example.com',
        phone: '+91-9898989898',
        current_job: {
          title: 'Software Engineer',
          company: 'Acme Inc',
          description: 'Backend development'
        },
        skills: ['React', 'Node.js', 'AWS'],
        mentorship: {
          isMentor: true,
          mentees: ['st_0003']
        },
        donations: [
          {
            amount: 5000,
            date: '2025-09-01',
            note: 'Scholarship fund'
          }
        ]
      })
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'career', label: 'Career', icon: Briefcase },
    { id: 'mentorship', label: 'Mentorship', icon: Users },
    { id: 'donations', label: 'Donations', icon: Heart },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar userRole="alumni" />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    )
  }

  if (!alumniData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar userRole="alumni" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Profile not found</h2>
          </div>
        </div>
      </div>
    )
  }

  const totalDonations = alumniData.donations.reduce((sum: number, donation: any) => sum + donation.amount, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole="alumni" userName={alumniData.name} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-primary-500 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{alumniData.name}</h1>
                <p className="text-gray-600">{alumniData.current_job.title} at {alumniData.current_job.company}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    <Award className="h-3 w-3 mr-1" />
                    Alumni
                  </span>
                  {alumniData.mentorship.isMentor && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <Users className="h-3 w-3 mr-1" />
                      Mentor
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-200">
              <Edit className="h-4 w-4" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Mentees</p>
                <p className="text-2xl font-bold text-gray-900">{alumniData.mentorship.mentees.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Donations</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalDonations.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Skills</p>
                <p className="text-2xl font-bold text-gray-900">{alumniData.skills.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Messages</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Email</label>
                        <p className="text-gray-900">{alumniData.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Phone</label>
                        <p className="text-gray-900">{alumniData.phone}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {alumniData.skills.map((skill: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'career' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Current Position</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900">{alumniData.current_job.title}</h4>
                    <p className="text-primary-600">{alumniData.current_job.company}</p>
                    <p className="text-gray-600 mt-2">{alumniData.current_job.description}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Career Updates</h3>
                  <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-200">
                    <Plus className="h-4 w-4" />
                    Add Update
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'mentorship' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Mentorship Program</h3>
                  {!alumniData.mentorship.isMentor && (
                    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-200">
                      <Users className="h-4 w-4" />
                      Become a Mentor
                    </button>
                  )}
                </div>
                {alumniData.mentorship.isMentor ? (
                  <div>
                    <p className="text-gray-600 mb-4">
                      You are currently mentoring {alumniData.mentorship.mentees.length} student(s).
                    </p>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">Active Mentees</h4>
                      <p className="text-green-700">
                        {alumniData.mentorship.mentees.length > 0 
                          ? `${alumniData.mentorship.mentees.length} students under your guidance`
                          : 'No active mentees at the moment'
                        }
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600">
                      Join our mentorship program to guide current students and share your professional experience.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'donations' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Donation History</h3>
                  <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-200">
                    <Plus className="h-4 w-4" />
                    Make Donation
                  </button>
                </div>
                {alumniData.donations.length > 0 ? (
                  <div className="space-y-4">
                    {alumniData.donations.map((donation: any, index: number) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900">₹{donation.amount.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">{donation.note}</p>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(donation.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-gray-600">No donations made yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
