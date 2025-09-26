'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import { 
  Users, 
  UserPlus, 
  Download, 
  Upload, 
  Activity, 
  AlertCircle,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  BarChart3,
  FileText,
  Calendar,
  DollarSign
} from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: string
  year?: number
  branch?: string
  created_at: string
}

interface Analytics {
  totalAlumni: number
  totalStudents: number
  totalDonations: number
  activeMentors: number
  totalOpportunities: number
  totalEvents: number
}

interface AuditLog {
  id: string
  actorId: string
  actorRole: string
  action: string
  targetType: string
  targetId: string
  timestamp: string
  details: string
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')

  useEffect(() => {
    // Use mock data for demo to avoid API issues
    const mockAnalytics: Analytics = {
      totalAlumni: 3,
      totalStudents: 3,
      totalDonations: 15000,
      activeMentors: 2,
      totalOpportunities: 3,
      totalEvents: 2
    }
    
    const mockUsers: User[] = [
      {
        id: 'al_0001',
        name: 'Anita Joshi',
        email: 'anita.j@example.com',
        role: 'alumni',
        year: 2021,
        branch: 'Computer Engineering',
        created_at: '2025-09-01T08:00:00Z'
      },
      {
        id: 'st_0001',
        name: 'Sahil Patil',
        email: 'sahil@example.com',
        role: 'students',
        year: 2025,
        branch: 'Computer Engineering',
        created_at: '2025-07-01T08:00:00Z'
      }
    ]
    
    const mockAuditLogs: AuditLog[] = [
      {
        id: 'audit_001',
        actorId: 'admin',
        actorRole: 'admin',
        action: 'CREATE_USER',
        targetType: 'alumni',
        targetId: 'al_0003',
        timestamp: '2025-08-05T08:00:00Z',
        details: 'Created new alumni profile for Priya Patel'
      }
    ]
    
    setAnalytics(mockAnalytics)
    setUsers(mockUsers)
    setAuditLogs(mockAuditLogs)
    setLoading(false)
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics')
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/alumni')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAuditLogs = async () => {
    try {
      const response = await fetch('/api/admin/auditlogs')
      if (response.ok) {
        const data = await response.json()
        setAuditLogs(data)
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error)
    }
  }

  const handleExportCSV = async () => {
    try {
      const response = await fetch('/api/admin/export?type=alumni')
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `alumni_export_${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error exporting CSV:', error)
      alert('Failed to export CSV')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      const response = await fetch(`/api/alumni/${userId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        setUsers(users.filter(user => user.id !== userId))
        fetchAuditLogs() // Refresh audit logs
        alert('User deleted successfully')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete user')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Network error. Please try again.')
    }
  }

  const filteredUsers = users.filter((user: any) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = selectedRole === 'all' || user.role === selectedRole
    return matchesSearch && matchesRole
  })

  const filteredLogs = auditLogs.filter((log: any) => {
    const matchesSearch = searchQuery === '' || log.details.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Manage Users', icon: Users },
    { id: 'audit', label: 'Audit Logs', icon: FileText },
    { id: 'import', label: 'Import/Export', icon: Upload },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar userRole="admin" />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole="admin" userName="Administrator" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage users, monitor activities, and view analytics</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExportCSV}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-200"
              >
                <Download className="h-4 w-4" />
                Export Data
              </button>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-200">
                <UserPlus className="h-4 w-4" />
                Add User
              </button>
            </div>
          </div>
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Alumni</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.totalAlumni}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.totalStudents}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Donations</p>
                  <p className="text-2xl font-bold text-gray-900">₹{analytics.totalDonations.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Activity className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Mentors</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.activeMentors}</p>
                </div>
              </div>
            </div>
          </div>
        )}

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
                        ? 'border-orange-500 text-orange-600'
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
            {activeTab === 'overview' && analytics && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Statistics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Users</span>
                        <span className="font-medium">{analytics.totalAlumni + analytics.totalStudents}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Active Opportunities</span>
                        <span className="font-medium">{analytics.totalOpportunities}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Upcoming Events</span>
                        <span className="font-medium">{analytics.totalEvents}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mentorship Pairs</span>
                        <span className="font-medium">{analytics.activeMentors}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {filteredLogs.slice(0, 5).map((log: any) => (
                        <div key={log.id} className="flex items-center gap-3">
                          <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{log.details}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(log.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">User Management</h3>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="all">All Roles</option>
                      <option value="alumni">Alumni</option>
                      <option value="students">Students</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Branch/Year
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user: any) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.role === 'alumni' 
                                ? 'bg-primary-100 text-primary-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.branch && user.year ? `${user.branch} • ${user.year}` : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <button className="text-blue-600 hover:text-blue-900 transition-colors duration-200">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="text-green-600 hover:text-green-900 transition-colors duration-200">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-900 transition-colors duration-200"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'audit' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Audit Logs</h3>
                <div className="space-y-4">
                  {auditLogs.map((log: any) => (
                    <div key={log.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="h-4 w-4 text-orange-500" />
                            <span className="font-medium text-gray-900">{log.action}</span>
                            <span className="text-sm text-gray-500">by {log.actorRole}</span>
                          </div>
                          <p className="text-sm text-gray-700">{log.details}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Target: {log.targetType} ({log.targetId})
                          </p>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'import' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Import/Export Data</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-4">Export Data</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Download user data in CSV format for backup or analysis.
                    </p>
                    <button
                      onClick={handleExportCSV}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-200"
                    >
                      <Download className="h-4 w-4" />
                      Export Alumni CSV
                    </button>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-4">Import Data</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Upload CSV file to bulk import user data.
                    </p>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        Drag and drop CSV file here, or click to browse
                      </p>
                      <input type="file" accept=".csv" className="hidden" />
                      <button className="mt-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm transition-colors duration-200">
                        Choose File
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
