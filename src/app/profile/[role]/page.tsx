'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { User, Mail, Phone, MapPin, Briefcase, GraduationCap, Calendar, Save, Edit, Camera } from 'lucide-react'

interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  location?: string
  role: string
  avatar?: string
  bio?: string
  // Alumni specific
  graduationYear?: string
  degree?: string
  major?: string
  currentCompany?: string
  currentPosition?: string
  industry?: string
  experience?: string
  skills?: string[]
  // Student specific
  enrollmentYear?: string
  currentYear?: string
  gpa?: string
  expectedGraduation?: string
  // Admin/College specific
  department?: string
  position?: string
  joinDate?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const params = useParams()
  const userRole = params.role as string
  
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<UserProfile | null>(null)

  useEffect(() => {
    // Check authentication
    if (typeof window !== 'undefined') {
      const authCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth-role='))
      
      if (!authCookie) {
        router.push('/login')
        return
      }

      const cookieRole = authCookie.split('=')[1]
      if (cookieRole !== userRole) {
        router.push(`/profile/${cookieRole}`)
        return
      }
    }

    loadProfile()
  }, [userRole, router])

  const loadProfile = async () => {
    setLoading(true)
    try {
      // For demo purposes, create a mock profile based on role
      const mockProfile: UserProfile = {
        id: `${userRole}_001`,
        name: getDefaultName(userRole),
        email: `${userRole}@punjab.gov.in`,
        phone: '+91 98765 43210',
        location: 'Punjab, India',
        role: userRole,
        bio: `I am a ${getRoleName(userRole)} in the Punjab Government Alumni Centralized System.`,
        ...getRoleSpecificData(userRole)
      }
      
      setProfile(mockProfile)
      setFormData(mockProfile)
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDefaultName = (role: string) => {
    switch (role) {
      case 'alumni': return 'Alumni User'
      case 'students': return 'Student User'
      case 'admin': return 'System Administrator'
      case 'collage': return 'College Administrator'
      default: return 'User'
    }
  }

  const getRoleName = (role: string) => {
    switch (role) {
      case 'alumni': return 'Alumni'
      case 'students': return 'Student'
      case 'admin': return 'Administrator'
      case 'collage': return 'College Staff'
      default: return 'User'
    }
  }

  const getRoleSpecificData = (role: string) => {
    switch (role) {
      case 'alumni':
        return {
          graduationYear: '2020',
          degree: 'Bachelor of Technology',
          major: 'Computer Science',
          currentCompany: 'Tech Solutions Punjab',
          currentPosition: 'Software Engineer',
          industry: 'Information Technology',
          experience: '3 years',
          skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL']
        }
      case 'students':
        return {
          enrollmentYear: '2022',
          currentYear: '3rd Year',
          degree: 'Bachelor of Technology',
          major: 'Computer Science',
          gpa: '8.5',
          expectedGraduation: '2026'
        }
      case 'admin':
      case 'collage':
        return {
          department: 'Information Technology',
          position: role === 'admin' ? 'System Administrator' : 'College Coordinator',
          joinDate: '2021-01-15'
        }
      default:
        return {}
    }
  }

  const handleInputChange = (field: string, value: any) => {
    if (!formData) return
    
    setFormData(prev => ({
      ...prev!,
      [field]: value
    }))
  }

  const handleSkillsChange = (skills: string) => {
    if (!formData) return
    
    const skillsArray = skills.split(',').map(skill => skill.trim()).filter(skill => skill)
    setFormData(prev => ({
      ...prev!,
      skills: skillsArray
    }))
  }

  const handleSave = async () => {
    if (!formData) return
    
    setSaving(true)
    try {
      // In a real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      setProfile(formData)
      setEditing(false)
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Failed to save profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData(profile)
    setEditing(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar userRole={userRole as any} />
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar userRole={userRole as any} />
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-red-600">Failed to load profile. Please try again.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole={userRole as any} userName={profile.name} />
      
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-white" />
                </div>
                <button className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md border">
                  <Camera className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                <p className="text-gray-600 capitalize">{getRoleName(userRole)}</p>
                <p className="text-sm text-gray-500">{profile.email}</p>
              </div>
            </div>
            <div>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-200"
                >
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-200"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData?.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  {editing ? (
                    <input
                      type="email"
                      value={formData?.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  ) : (
                    <p className="text-gray-900 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      {profile.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  {editing ? (
                    <input
                      type="tel"
                      value={formData?.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  ) : (
                    <p className="text-gray-900 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      {profile.phone || 'Not provided'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData?.location || ''}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  ) : (
                    <p className="text-gray-900 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      {profile.location || 'Not provided'}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                {editing ? (
                  <textarea
                    value={formData?.bio || ''}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-900">{profile.bio || 'No bio provided'}</p>
                )}
              </div>
            </div>

            {/* Role-specific Information */}
            {userRole === 'alumni' && (
              <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Company</label>
                    {editing ? (
                      <input
                        type="text"
                        value={formData?.currentCompany || ''}
                        onChange={(e) => handleInputChange('currentCompany', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    ) : (
                      <p className="text-gray-900 flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-gray-500" />
                        {profile.currentCompany || 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Position</label>
                    {editing ? (
                      <input
                        type="text"
                        value={formData?.currentPosition || ''}
                        onChange={(e) => handleInputChange('currentPosition', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.currentPosition || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                    {editing ? (
                      <input
                        type="text"
                        value={formData?.industry || ''}
                        onChange={(e) => handleInputChange('industry', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.industry || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                    {editing ? (
                      <input
                        type="text"
                        value={formData?.experience || ''}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.experience || 'Not provided'}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData?.skills?.join(', ') || ''}
                      onChange={(e) => handleSkillsChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter skills separated by commas"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profile.skills?.map((skill, index) => (
                        <span key={index} className="bg-primary-100 text-primary-800 px-2 py-1 rounded-md text-sm">
                          {skill}
                        </span>
                      )) || <span className="text-gray-500">No skills added</span>}
                    </div>
                  )}
                </div>
              </div>
            )}

            {userRole === 'students' && (
              <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Year</label>
                    {editing ? (
                      <select
                        value={formData?.currentYear || ''}
                        onChange={(e) => handleInputChange('currentYear', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Select Year</option>
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-gray-500" />
                        {profile.currentYear || 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">GPA</label>
                    {editing ? (
                      <input
                        type="text"
                        value={formData?.gpa || ''}
                        onChange={(e) => handleInputChange('gpa', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.gpa || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expected Graduation</label>
                    {editing ? (
                      <input
                        type="text"
                        value={formData?.expectedGraduation || ''}
                        onChange={(e) => handleInputChange('expectedGraduation', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    ) : (
                      <p className="text-gray-900 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        {profile.expectedGraduation || 'Not provided'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Role</span>
                  <span className="font-medium capitalize">{getRoleName(userRole)}</span>
                </div>
                
                {profile.graduationYear && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Graduation</span>
                    <span className="font-medium">{profile.graduationYear}</span>
                  </div>
                )}
                
                {profile.enrollmentYear && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Enrolled</span>
                    <span className="font-medium">{profile.enrollmentYear}</span>
                  </div>
                )}
                
                {profile.joinDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Joined</span>
                    <span className="font-medium">{new Date(profile.joinDate).getFullYear()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Education Info */}
            {(profile.degree || profile.major) && (
              <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Education</h2>
                
                <div className="space-y-3">
                  {profile.degree && (
                    <div>
                      <span className="text-sm text-gray-600">Degree</span>
                      <p className="font-medium">{profile.degree}</p>
                    </div>
                  )}
                  
                  {profile.major && (
                    <div>
                      <span className="text-sm text-gray-600">Major</span>
                      <p className="font-medium">{profile.major}</p>
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
