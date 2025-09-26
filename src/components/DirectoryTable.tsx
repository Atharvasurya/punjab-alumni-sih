'use client'

import { useState } from 'react'
import { 
  User, 
  Building, 
  MapPin, 
  Calendar, 
  Search, 
  Filter, 
  MessageSquare,
  ExternalLink
} from 'lucide-react'

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

interface DirectoryTableProps {
  alumni: Alumni[]
  onConnect?: (alumniId: string) => void
  onMessage?: (alumniId: string) => void
}

export default function DirectoryTable({ alumni, onConnect, onMessage }: DirectoryTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedYear, setSelectedYear] = useState('all')
  const [selectedBranch, setSelectedBranch] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Get unique years and branches for filters
  const years = Array.from(new Set(alumni.map(a => a.year))).sort((a, b) => b - a)
  const branches = Array.from(new Set(alumni.map(a => a.branch)))

  // Filter alumni based on search and filters
  const filteredAlumni = alumni.filter(alumnus => {
    const matchesSearch = 
      alumnus.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alumnus.current_job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alumnus.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesYear = selectedYear === 'all' || alumnus.year.toString() === selectedYear
    const matchesBranch = selectedBranch === 'all' || alumnus.branch === selectedBranch

    return matchesSearch && matchesYear && matchesBranch
  })

  const handleConnect = (alumniId: string) => {
    if (onConnect) {
      onConnect(alumniId)
    } else {
      alert('Connection request sent!')
    }
  }

  const handleMessage = (alumniId: string) => {
    if (onMessage) {
      onMessage(alumniId)
    } else {
      alert('Message feature coming soon!')
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search alumni by name, company, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Years</option>
              {years.map(year => (
                <option key={year} value={year.toString()}>{year}</option>
              ))}
            </select>
            
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Branches</option>
              {branches.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>

            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>Showing {filteredAlumni.length} of {alumni.length} alumni</span>
          <button className="flex items-center gap-2 hover:text-primary-600 transition-colors duration-200">
            <Filter className="h-4 w-4" />
            Advanced Filters
          </button>
        </div>
      </div>

      {/* Results */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlumni.map((alumnus) => (
            <div key={alumnus.id} className="bg-white rounded-lg shadow-sm p-6 card-hover">
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-12 w-12 bg-primary-500 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{alumnus.name}</h3>
                  <p className="text-sm text-gray-600">{alumnus.current_job.title}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building className="h-4 w-4" />
                  {alumnus.current_job.company}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  {alumnus.branch} • {alumnus.year}
                </div>
                {alumnus.address && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {alumnus.address}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {alumnus.skills.slice(0, 3).map((skill, index) => (
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

              <div className="flex gap-2">
                <button
                  onClick={() => handleConnect(alumnus.id)}
                  className="flex-1 bg-primary-500 hover:bg-primary-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors duration-200"
                >
                  Connect
                </button>
                <button
                  onClick={() => handleMessage(alumnus.id)}
                  className="px-3 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  <MessageSquare className="h-4 w-4" />
                </button>
                <button className="px-3 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition-colors duration-200">
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alumni
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Education
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Skills
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAlumni.map((alumnus) => (
                  <tr key={alumnus.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-primary-500 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{alumnus.name}</div>
                          <div className="text-sm text-gray-500">{alumnus.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{alumnus.current_job.title}</div>
                      <div className="text-sm text-gray-500">{alumnus.current_job.company}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{alumnus.branch}</div>
                      <div className="text-sm text-gray-500">Class of {alumnus.year}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {alumnus.skills.slice(0, 2).map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-primary-100 text-primary-800"
                          >
                            {skill}
                          </span>
                        ))}
                        {alumnus.skills.length > 2 && (
                          <span className="text-xs text-gray-500">+{alumnus.skills.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleConnect(alumnus.id)}
                          className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-1 rounded text-xs transition-colors duration-200"
                        >
                          Connect
                        </button>
                        <button
                          onClick={() => handleMessage(alumnus.id)}
                          className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        >
                          <MessageSquare className="h-4 w-4" />
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

      {filteredAlumni.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No alumni found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
        </div>
      )}
    </div>
  )
}
