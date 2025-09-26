'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import { 
  User, 
  Search, 
  Briefcase, 
  Calendar, 
  MessageSquare, 
  Users, 
  BookOpen,
  Award,
  Filter,
  MapPin,
  Building
} from 'lucide-react'

interface StudentData {
  id: string
  name: string
  email: string
  phone: string
  branch: string
  year: number
  gpa: string
  skills: string[]
  mentor?: string
}

interface Alumni {
  id: string
  name: string
  current_job: {
    title: string
    company: string
  }
  skills: string[]
  year: number
  branch: string
}

interface Opportunity {
  id: string
  title: string
  type: string
  location: string
  posted_by: string
  deadline: string
  applications: Array<{
    userId: string
    status: string
  }>
}

export default function StudentsDashboard() {
  const [studentData, setStudentData] = useState<StudentData | null>(null)
  const [alumni, setAlumni] = useState<Alumni[]>([])
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    // For demo, use hardcoded data to avoid API issues
    const mockStudentData: StudentData = {
      id: 'st_0001',
      name: 'Sahil Patil',
      email: 'sahil@example.com',
      phone: '+91-9999888877',
      branch: 'Computer Engineering',
      year: 2025,
      gpa: '8.2',
      skills: ['JavaScript', 'React', 'Python'],
      mentor: 'al_0002'
    }
    
    const mockAlumni: Alumni[] = [
      {
        id: 'al_0001',
        name: 'Anita Joshi',
        current_job: { title: 'Software Engineer', company: 'Acme Inc' },
        skills: ['React', 'Node.js', 'AWS'],
        year: 2021,
        branch: 'Computer Engineering'
      },
      {
        id: 'al_0002',
        name: 'Rohit Sharma',
        current_job: { title: 'SDE II', company: 'TechCorp' },
        skills: ['Java', 'AWS', 'Spring Boot'],
        year: 2019,
        branch: 'Electronics Engineering'
      }
    ]
    
    const mockOpportunities: Opportunity[] = [
      {
        id: 'op_001',
        title: 'Frontend Developer Intern',
        type: 'internship',
        location: 'Remote',
        posted_by: 'al_0001',
        deadline: '2025-10-20',
        applications: []
      }
    ]
    
    setStudentData(mockStudentData)
    setAlumni(mockAlumni)
    setOpportunities(mockOpportunities)
    setLoading(false)
  }, [])

  const fetchStudentData = async (id: string) => {
    try {
      // For demo, we'll simulate student data
      setStudentData({
        id: 'st_0001',
        name: 'Sahil Patil',
        email: 'sahil@example.com',
        phone: '+91-9999888877',
        branch: 'Computer Engineering',
        year: 2025,
        gpa: '8.2',
        skills: ['JavaScript', 'React', 'Python'],
        mentor: 'al_0002'
      })
    } catch (error) {
      console.error('Error fetching student data:', error)
    }
  }

  const fetchAlumni = async () => {
    try {
      const response = await fetch('/api/alumni')
      if (response.ok) {
        const data = await response.json()
        setAlumni(data.slice(0, 6)) // Show first 6 for overview
      }
    } catch (error) {
      console.error('Error fetching alumni:', error)
    }
  }

  const fetchOpportunities = async () => {
    try {
      const response = await fetch('/api/opportunities')
      if (response.ok) {
        const data = await response.json()
        setOpportunities(data)
      }
    } catch (error) {
      console.error('Error fetching opportunities:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyToOpportunity = async (opportunityId: string) => {
    try {
      const response = await fetch(`/api/opportunities/${opportunityId}/apply`, {
        method: 'POST'
      })
      if (response.ok) {
        // Refresh opportunities
        fetchOpportunities()
        alert('Application submitted successfully!')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to apply')
      }
    } catch (error) {
      console.error('Error applying to opportunity:', error)
      alert('Network error. Please try again.')
    }
  }

  const hasApplied = (opportunity: Opportunity) => {
    return opportunity.applications.some(app => app.userId === 'students')
  }

  // Filter functions
  const filteredAlumni = alumni.filter((alumnus: any) => {
    const matchesSearch = alumnus.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         alumnus.current_job.company.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const filteredOpportunities = opportunities.filter((opportunity: any) => {
    const matchesSearch = opportunity.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'alumni', label: 'Alumni Directory', icon: Users },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
    { id: 'mentorship', label: 'Mentorship', icon: BookOpen },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar userRole="students" />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole="students" userName={studentData?.name} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-green-500 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{studentData?.name}</h1>
                <p className="text-gray-600">{studentData?.branch} • Class of {studentData?.year}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <BookOpen className="h-3 w-3 mr-1" />
                    Student
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Award className="h-3 w-3 mr-1" />
                    GPA: {studentData?.gpa}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Alumni Network</p>
                <p className="text-2xl font-bold text-gray-900">{alumni.length}+</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Opportunities</p>
                <p className="text-2xl font-bold text-gray-900">{opportunities.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Skills</p>
                <p className="text-2xl font-bold text-gray-900">{studentData?.skills.length}</p>
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
                <p className="text-2xl font-bold text-gray-900">5</p>
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
                        ? 'border-green-500 text-green-600'
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
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Academic Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Branch</label>
                        <p className="text-gray-900">{studentData?.branch}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Graduation Year</label>
                        <p className="text-gray-900">{studentData?.year}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">GPA</label>
                        <p className="text-gray-900">{studentData?.gpa}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {studentData?.skills.map((skill: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Opportunities */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Opportunities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {opportunities.slice(0, 4).map((opportunity) => (
                      <div key={opportunity.id} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900">{opportunity.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{opportunity.type}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {opportunity.location}
                          </span>
                          <button
                            onClick={() => applyToOpportunity(opportunity.id)}
                            disabled={hasApplied(opportunity)}
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors duration-200 ${
                              hasApplied(opportunity)
                                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                : 'bg-green-500 hover:bg-green-600 text-white'
                            }`}
                          >
                            {hasApplied(opportunity) ? 'Applied' : 'Apply'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'alumni' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Alumni Directory</h3>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search alumni..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200">
                      <Filter className="h-4 w-4" />
                      Filter
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAlumni.map((alumnus: any) => (
                    <div key={alumnus.id} className="bg-gray-50 rounded-lg p-6 card-hover">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="h-12 w-12 bg-primary-500 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{alumnus.name}</h4>
                          <p className="text-sm text-gray-600">{alumnus.current_job.title}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Building className="h-4 w-4" />
                          {alumnus.current_job.company}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <BookOpen className="h-4 w-4" />
                          {alumnus.branch} • {alumnus.year}
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex flex-wrap gap-1">
                          {alumnus.skills.slice(0, 3).map((skill: string, index: number) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-primary-100 text-primary-800"
                            >
                              {skill}
                            </span>
                          ))}
                          {alumnus.skills.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
                              +{alumnus.skills.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md transition-colors duration-200">
                          Connect
                        </button>
                        <button className="px-3 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition-colors duration-200">
                          <MessageSquare className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'opportunities' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Available Opportunities</h3>
                  <div className="flex items-center gap-4">
                    <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option>All Types</option>
                      <option>Internship</option>
                      <option>Job</option>
                      <option>Collaboration</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredOpportunities.map((opportunity: any) => (
                    <div key={opportunity.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900">{opportunity.title}</h4>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {opportunity.type}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {opportunity.location}
                            </span>
                            <span>Deadline: {new Date(opportunity.deadline).toLocaleDateString()}</span>
                          </div>
                          <p className="text-gray-600 mt-3">Posted by alumni network</p>
                        </div>
                        <button
                          onClick={() => applyToOpportunity(opportunity.id)}
                          disabled={hasApplied(opportunity)}
                          className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 ${
                            hasApplied(opportunity)
                              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                              : 'bg-green-500 hover:bg-green-600 text-white'
                          }`}
                        >
                          {hasApplied(opportunity) ? 'Applied' : 'Apply Now'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'mentorship' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Mentorship Program</h3>
                  {studentData?.mentor ? (
                    <div className="bg-green-50 p-6 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">Your Mentor</h4>
                      <p className="text-green-700">
                        You are currently being mentored by an experienced alumni.
                      </p>
                      <button className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors duration-200">
                        Contact Mentor
                      </button>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Find a Mentor</h4>
                      <p className="text-gray-600 mb-4">
                        Connect with experienced alumni who can guide you in your career journey.
                      </p>
                      <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors duration-200">
                        Browse Mentors
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
