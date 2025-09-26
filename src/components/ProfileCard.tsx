'use client'

import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Calendar, 
  Award, 
  Users,
  Heart,
  Edit,
  ExternalLink
} from 'lucide-react'

interface ProfileCardProps {
  user: {
    id: string
    name: string
    email: string
    phone: string
    address?: string
    college: string
    degree: string
    branch: string
    year: number
    gpa: string
    skills: string[]
    current_job?: {
      title: string
      company: string
      description: string
    }
    mentorship?: {
      isMentor: boolean
      mentees: string[]
    }
    donations?: Array<{
      amount: number
      date: string
      note: string
    }>
  }
  role: 'alumni' | 'students' | 'admin' | 'collage'
  isOwner?: boolean
  onEdit?: () => void
  onConnect?: () => void
  onMessage?: () => void
}

export default function ProfileCard({ 
  user, 
  role, 
  isOwner = false, 
  onEdit, 
  onConnect, 
  onMessage 
}: ProfileCardProps) {
  const totalDonations = user.donations?.reduce((sum, donation) => sum + donation.amount, 0) || 0

  const getRoleColor = (userRole: string) => {
    switch (userRole) {
      case 'alumni': return 'bg-primary-100 text-primary-800'
      case 'students': return 'bg-green-100 text-green-800'
      case 'admin': return 'bg-orange-100 text-orange-800'
      case 'collage': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleName = (userRole: string) => {
    switch (userRole) {
      case 'alumni': return 'Alumni'
      case 'students': return 'Student'
      case 'admin': return 'Administrator'
      case 'collage': return 'College'
      default: return 'User'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              {user.current_job && (
                <p className="text-primary-100">{user.current_job.title} at {user.current_job.company}</p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white bg-opacity-20 text-white`}>
                  {getRoleName(role)}
                </span>
                {user.mentorship?.isMentor && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white bg-opacity-20 text-white">
                    <Users className="h-3 w-3 mr-1" />
                    Mentor
                  </span>
                )}
              </div>
            </div>
          </div>
          {isOwner && onEdit && (
            <button
              onClick={onEdit}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-200"
            >
              <Edit className="h-4 w-4" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-gray-900">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="text-gray-900">{user.phone}</p>
                </div>
              </div>
              {user.address && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="text-gray-900">{user.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Academic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Academic Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">College</p>
                  <p className="text-gray-900">{user.college}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Degree</p>
                  <p className="text-gray-900">{user.degree}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Branch & Year</p>
                  <p className="text-gray-900">{user.branch} • {user.year}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">GPA</p>
                  <p className="text-gray-900">{user.gpa}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Skills & Expertise</h3>
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Current Job (for alumni) */}
        {user.current_job && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Current Position</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900">{user.current_job.title}</h4>
              <p className="text-primary-600">{user.current_job.company}</p>
              <p className="text-gray-600 mt-2">{user.current_job.description}</p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {user.mentorship && (
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <Users className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Mentees</p>
              <p className="text-xl font-bold text-gray-900">{user.mentorship.mentees.length}</p>
            </div>
          )}
          
          {user.donations && user.donations.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <Heart className="h-6 w-6 text-red-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Donations</p>
              <p className="text-xl font-bold text-gray-900">₹{totalDonations.toLocaleString()}</p>
            </div>
          )}
          
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <Award className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Skills</p>
            <p className="text-xl font-bold text-gray-900">{user.skills.length}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <Calendar className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Experience</p>
            <p className="text-xl font-bold text-gray-900">{new Date().getFullYear() - user.year}y</p>
          </div>
        </div>

        {/* Actions */}
        {!isOwner && (
          <div className="mt-6 flex gap-3">
            {onConnect && (
              <button
                onClick={onConnect}
                className="flex-1 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
              >
                Connect
              </button>
            )}
            {onMessage && (
              <button
                onClick={onMessage}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-2 rounded-md font-medium transition-colors duration-200"
              >
                Send Message
              </button>
            )}
            <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200">
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
