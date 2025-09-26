'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { FileText, Search, Filter, AlertCircle, Download, Calendar } from 'lucide-react'

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

export default function AdminAuditPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAction, setSelectedAction] = useState('all')
  const [selectedRole, setSelectedRole] = useState('all')
  const [userRole, setUserRole] = useState<'admin' | 'collage'>('admin')
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

    fetchAuditLogs()
  }, [router])

  const fetchAuditLogs = async () => {
    try {
      // Mock data for demo
      const mockAuditLogs: AuditLog[] = [
        {
          id: 'audit_001',
          actorId: 'admin',
          actorRole: 'admin',
          action: 'CREATE_USER',
          targetType: 'alumni',
          targetId: 'al_0003',
          timestamp: '2025-09-22T10:30:00Z',
          details: 'Created new alumni profile for Priya Patel'
        },
        {
          id: 'audit_002',
          actorId: 'admin',
          actorRole: 'admin',
          action: 'DELETE_USER',
          targetType: 'students',
          targetId: 'st_0005',
          timestamp: '2025-09-21T14:15:00Z',
          details: 'Deleted student profile for inactive user'
        },
        {
          id: 'audit_003',
          actorId: 'al_0001',
          actorRole: 'alumni',
          action: 'CREATE_OPPORTUNITY',
          targetType: 'opportunity',
          targetId: 'op_004',
          timestamp: '2025-09-20T09:00:00Z',
          details: 'Posted new internship opportunity at TechCorp'
        },
        {
          id: 'audit_004',
          actorId: 'admin',
          actorRole: 'admin',
          action: 'EXPORT_DATA',
          targetType: 'alumni',
          targetId: 'all',
          timestamp: '2025-09-19T16:45:00Z',
          details: 'Exported alumni data to CSV format'
        },
        {
          id: 'audit_005',
          actorId: 'collage',
          actorRole: 'collage',
          action: 'CREATE_EVENT',
          targetType: 'event',
          targetId: 'ev_004',
          timestamp: '2025-09-18T11:20:00Z',
          details: 'Created new career guidance event'
        }
      ]
      setAuditLogs(mockAuditLogs)
    } catch (error) {
      console.error('Error fetching audit logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredLogs = auditLogs.filter((log: any) => {
    const matchesSearch = log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.actorId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesAction = selectedAction === 'all' || log.action === selectedAction
    const matchesRole = selectedRole === 'all' || log.actorRole === selectedRole
    return matchesSearch && matchesAction && matchesRole
  })

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE_USER':
      case 'CREATE_OPPORTUNITY':
      case 'CREATE_EVENT':
        return 'bg-green-100 text-green-800'
      case 'DELETE_USER':
      case 'DELETE_OPPORTUNITY':
        return 'bg-red-100 text-red-800'
      case 'UPDATE_USER':
      case 'UPDATE_OPPORTUNITY':
        return 'bg-blue-100 text-blue-800'
      case 'EXPORT_DATA':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-orange-100 text-orange-800'
      case 'alumni': return 'bg-primary-100 text-primary-800'
      case 'students': return 'bg-green-100 text-green-800'
      case 'collage': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Actor', 'Role', 'Action', 'Target Type', 'Target ID', 'Details'],
      ...filteredLogs.map(log => [
        new Date(log.timestamp).toLocaleString(),
        log.actorId,
        log.actorRole,
        log.action,
        log.targetType,
        log.targetId,
        log.details
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
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
              <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
              <p className="text-gray-600 mt-2">Track all system activities and user actions</p>
            </div>
            <button 
              onClick={exportLogs}
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-200"
            >
              <Download className="h-4 w-4" />
              Export Logs
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Logs</p>
                <p className="text-2xl font-bold text-gray-900">{auditLogs.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Activities</p>
                <p className="text-2xl font-bold text-gray-900">
                  {auditLogs.filter(log => 
                    new Date(log.timestamp).toDateString() === new Date().toDateString()
                  ).length}
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
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">
                  {auditLogs.filter(log => {
                    const logDate = new Date(log.timestamp)
                    const weekAgo = new Date()
                    weekAgo.setDate(weekAgo.getDate() - 7)
                    return logDate > weekAgo
                  }).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Critical Actions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {auditLogs.filter(log => 
                    log.action.includes('DELETE') || log.action.includes('EXPORT')
                  ).length}
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
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <select
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Actions</option>
                <option value="CREATE_USER">Create User</option>
                <option value="DELETE_USER">Delete User</option>
                <option value="CREATE_OPPORTUNITY">Create Opportunity</option>
                <option value="EXPORT_DATA">Export Data</option>
              </select>
              
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="alumni">Alumni</option>
                <option value="students">Students</option>
                <option value="collage">College</option>
              </select>
              
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200">
                <Filter className="h-4 w-4" />
                More Filters
              </button>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredLogs.length} of {auditLogs.length} logs
          </div>
        </div>

        {/* Audit Logs */}
        <div className="space-y-4">
          {filteredLogs.map((log: any) => (
            <div key={log.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                      {log.action.replace('_', ' ')}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(log.actorRole)}`}>
                      {log.actorRole}
                    </span>
                  </div>
                  
                  <p className="text-gray-900 font-medium mb-1">{log.details}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Actor: {log.actorId}</span>
                    <span>Target: {log.targetType} ({log.targetId})</span>
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredLogs.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No logs found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}
