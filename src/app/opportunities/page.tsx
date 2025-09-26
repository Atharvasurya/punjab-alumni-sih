'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import ApplicationModal from '@/components/ApplicationModal'
import { Briefcase, Search, Filter, MapPin, Calendar, Building, Users } from 'lucide-react'

interface Opportunity {
  id: string
  title: string
  type: string
  location: string
  posted_by: string
  deadline: string
  applications: any[]
  description?: string
  company?: string
}

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [userRole, setUserRole] = useState<'alumni' | 'students' | 'admin' | 'collage'>('students')
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null)
  const [applicationLoading, setApplicationLoading] = useState(false)

  useEffect(() => {
    // Get user role from cookie
    if (typeof window !== 'undefined') {
      const authCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth-role='))
      
      if (authCookie) {
        const role = authCookie.split('=')[1] as 'alumni' | 'students' | 'admin' | 'collage'
        setUserRole(role)
      }
    }

    fetchOpportunities()
  }, [])

  const fetchOpportunities = async () => {
    try {
      // Mock data for demo
      const mockOpportunities: Opportunity[] = [
        {
          id: 'op_001',
          title: 'Frontend Developer Intern',
          type: 'internship',
          location: 'Remote',
          posted_by: 'al_0001',
          deadline: '2025-10-20',
          applications: [],
          description: 'Looking for a frontend developer intern with React experience. Great opportunity to work with modern technologies.',
          company: 'TechCorp'
        },
        {
          id: 'op_002',
          title: 'Software Engineer - Full Time',
          type: 'job',
          location: 'Mumbai, India',
          posted_by: 'al_0002',
          deadline: '2025-11-15',
          applications: [],
          description: 'Full-time software engineer position for backend development using Node.js and Python.',
          company: 'Acme Inc'
        },
        {
          id: 'op_003',
          title: 'Research Collaboration',
          type: 'collaboration',
          location: 'Pune, India',
          posted_by: 'al_0001',
          deadline: '2025-12-01',
          applications: [],
          description: 'Research collaboration opportunity in AI/ML with leading industry experts.',
          company: 'Research Labs'
        }
      ]
      setOpportunities(mockOpportunities)
    } catch (error) {
      console.error('Error fetching opportunities:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApplyClick = (opportunity: any) => {
    setSelectedOpportunity(opportunity)
    setShowApplicationModal(true)
  }

  const handleApplicationSubmit = async (applicationData: any) => {
    setApplicationLoading(true)
    try {
      // For demo, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Update opportunity with new application
      setOpportunities(prev => prev.map(opp => 
        opp.id === selectedOpportunity.id 
          ? { ...opp, applications: [...opp.applications, applicationData] }
          : opp
      ))
      
      setShowApplicationModal(false)
      setSelectedOpportunity(null)
      alert('Application submitted successfully! The recruiter will review your application.')
      
      // In real app, would call API:
      // const response = await fetch(`/api/opportunities/${selectedOpportunity.id}/apply`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(applicationData)
      // })
      
    } catch (error) {
      console.error('Error submitting application:', error)
      alert('Failed to submit application. Please try again.')
    } finally {
      setApplicationLoading(false)
    }
  }

  const hasApplied = (opportunity: any) => {
    return opportunity.applications.some((app: any) => app.userId === userRole)
  }

  const filteredOpportunities = opportunities.filter((opportunity: any) => {
    const matchesSearch = opportunity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         opportunity.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (opportunity.company && opportunity.company.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesType = selectedType === 'all' || opportunity.type === selectedType
    return matchesSearch && matchesType
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'internship': return 'bg-blue-100 text-blue-800'
      case 'job': return 'bg-green-100 text-green-800'
      case 'collaboration': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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
            <Briefcase className="h-8 w-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Opportunities</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Discover internships, jobs, and collaboration opportunities from our alumni network.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Opportunities</p>
                <p className="text-2xl font-bold text-gray-900">{opportunities.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Postings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {opportunities.filter(opp => new Date(opp.deadline) > new Date()).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Building className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Companies</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(opportunities.map(opp => opp.company || 'Unknown')).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search opportunities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="internship">Internships</option>
                <option value="job">Jobs</option>
                <option value="collaboration">Collaborations</option>
              </select>
              
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200">
                <Filter className="h-4 w-4" />
                More Filters
              </button>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredOpportunities.length} of {opportunities.length} opportunities
          </div>
        </div>

        {/* Opportunities List */}
        <div className="space-y-6">
          {filteredOpportunities.map((opportunity: any) => (
            <div key={opportunity.id} className="bg-white rounded-lg shadow-sm p-6 card-hover">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">{opportunity.title}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(opportunity.type)}`}>
                      {opportunity.type}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    {opportunity.company && (
                      <span className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        {opportunity.company}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {opportunity.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {opportunity.description && (
                    <p className="text-gray-700 mb-4">{opportunity.description}</p>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Posted by Alumni</span>
                    <span>•</span>
                    <span>{opportunity.applications.length} applications</span>
                  </div>
                </div>
                
                <div className="ml-6">
                  {userRole === 'students' && !hasApplied(opportunity) && (
                    <button
                      onClick={() => handleApplyClick(opportunity)}
                      className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-md font-medium transition-colors duration-200"
                    >
                      Apply Now
                    </button>
                  )}
                  {userRole === 'students' && hasApplied(opportunity) && (
                    <button
                      disabled
                      className="bg-green-100 text-green-800 px-6 py-2 rounded-md font-medium cursor-not-allowed"
                    >
                      Applied ✓
                    </button>
                  )}
                  {userRole === 'alumni' && (
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-md font-medium transition-colors duration-200">
                      View Details
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOpportunities.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No opportunities found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or check back later for new postings.</p>
          </div>
        )}
      </div>

      {/* Application Modal */}
      {selectedOpportunity && (
        <ApplicationModal
          isOpen={showApplicationModal}
          onClose={() => {
            setShowApplicationModal(false)
            setSelectedOpportunity(null)
          }}
          opportunity={selectedOpportunity}
          onSubmit={handleApplicationSubmit}
          loading={applicationLoading}
        />
      )}
    </div>
  )
}
