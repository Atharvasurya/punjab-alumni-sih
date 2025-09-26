'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Modal from '@/components/Modal'
import CreateOpportunityForm from '@/components/CreateOpportunityForm'
import EditOpportunityForm from '@/components/EditOpportunityForm'
import { Briefcase, Search, Filter, Plus, MapPin, Calendar, Building, Users, Edit, Trash2 } from 'lucide-react'

interface Opportunity {
  id: string
  title: string
  type: string
  location: string
  posted_by: string
  deadline: string
  applications: string[]
  description?: string
}

export default function AdminOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [userRole, setUserRole] = useState<'admin' | 'collage'>('admin')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null)
  const [createLoading, setCreateLoading] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is admin or college
    if (typeof window !== 'undefined') {
      const authCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth-role='))
      
      if (!authCookie || (!authCookie.includes('admin') && !authCookie.includes('collage'))) {
        router.push('/login')
        return
      }
      
      // Set user role for navbar
      const role = authCookie.split('=')[1] as 'admin' | 'collage'
      setUserRole(role)
    }

    fetchOpportunities()
  }, [router])

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
          applications: ['st_0001'],
          description: 'Looking for a frontend developer intern with React experience'
        },
        {
          id: 'op_002',
          title: 'Software Engineer - Full Time',
          type: 'job',
          location: 'Mumbai, India',
          posted_by: 'al_0002',
          deadline: '2025-11-15',
          applications: [],
          description: 'Full-time software engineer position for backend development'
        },
        {
          id: 'op_003',
          title: 'Research Collaboration',
          type: 'collaboration',
          location: 'Pune, India',
          posted_by: 'al_0001',
          deadline: '2025-12-01',
          applications: ['st_0002'],
          description: 'Research collaboration opportunity in AI/ML'
        }
      ]
      setOpportunities(mockOpportunities)
    } catch (error) {
      console.error('Error fetching opportunities:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateOpportunity = async (opportunityData: any) => {
    setCreateLoading(true)
    try {
      // Generate unique ID
      const newId = `op_${Date.now().toString().slice(-4)}`
      
      const newOpportunity = {
        ...opportunityData,
        id: newId,
        created_at: new Date().toISOString(),
        applications: []
      }

      // For demo, add to local state (in real app, would call API)
      setOpportunities(prev => [...prev, newOpportunity])
      setShowCreateModal(false)
      alert('Opportunity created successfully!')
      
    } catch (error) {
      console.error('Error creating opportunity:', error)
      alert('Failed to create opportunity. Please try again.')
    } finally {
      setCreateLoading(false)
    }
  }

  const handleEditOpportunity = async (opportunityData: any) => {
    setEditLoading(true)
    try {
      // For demo, update in local state (in real app, would call API)
      setOpportunities(prev => prev.map(opp => 
        opp.id === opportunityData.id ? opportunityData : opp
      ))
      setShowEditModal(false)
      setSelectedOpportunity(null)
      alert('Opportunity updated successfully!')
      
    } catch (error) {
      console.error('Error updating opportunity:', error)
      alert('Failed to update opportunity. Please try again.')
    } finally {
      setEditLoading(false)
    }
  }

  const handleEditClick = (opportunity: any) => {
    setSelectedOpportunity(opportunity)
    setShowEditModal(true)
  }

  const handleDeleteOpportunity = async (opportunityId: string) => {
    if (!confirm('Are you sure you want to delete this opportunity?')) return

    try {
      // For demo, remove from local state (in real app, would call API)
      setOpportunities(prev => prev.filter(opp => opp.id !== opportunityId))
      alert('Opportunity deleted successfully!')
      
    } catch (error) {
      console.error('Error deleting opportunity:', error)
      alert('Failed to delete opportunity. Please try again.')
    }
  }

  const filteredOpportunities = opportunities.filter((opportunity: any) => {
    const matchesSearch = opportunity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         opportunity.location.toLowerCase().includes(searchQuery.toLowerCase())
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Opportunity Management</h1>
              <p className="text-gray-600 mt-2">Manage job postings, internships, and collaborations</p>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-200"
            >
              <Plus className="h-4 w-4" />
              Create Opportunity
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">
                  {opportunities.reduce((sum, opp) => sum + opp.applications.length, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
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
              <div className="p-2 bg-orange-100 rounded-lg">
                <MapPin className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Locations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(opportunities.map(opp => opp.location)).size}
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
        <div className="space-y-4">
          {filteredOpportunities.map((opportunity: any) => (
            <div key={opportunity.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{opportunity.title}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(opportunity.type)}`}>
                      {opportunity.type}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {opportunity.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {opportunity.applications.length} applications
                    </span>
                  </div>
                  
                  {opportunity.description && (
                    <p className="text-gray-700 mb-4">{opportunity.description}</p>
                  )}
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <button 
                    onClick={() => handleEditClick(opportunity)}
                    className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-1 rounded text-sm transition-colors duration-200 flex items-center gap-1"
                    title="Edit Opportunity"
                  >
                    <Edit className="h-3 w-3" />
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteOpportunity(opportunity.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors duration-200 flex items-center gap-1"
                    title="Delete Opportunity"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm transition-colors duration-200">
                    View Applications ({opportunity.applications.length})
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOpportunities.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No opportunities found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or create a new opportunity.</p>
          </div>
        )}
      </div>

      {/* Create Opportunity Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Opportunity"
        size="xl"
      >
        <CreateOpportunityForm
          onSubmit={handleCreateOpportunity}
          onCancel={() => setShowCreateModal(false)}
          loading={createLoading}
        />
      </Modal>

      {/* Edit Opportunity Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedOpportunity(null)
        }}
        title="Edit Opportunity"
        size="xl"
      >
        {selectedOpportunity && (
          <EditOpportunityForm
            opportunity={selectedOpportunity}
            onSubmit={handleEditOpportunity}
            onCancel={() => {
              setShowEditModal(false)
              setSelectedOpportunity(null)
            }}
            loading={editLoading}
          />
        )}
      </Modal>
    </div>
  )
}
