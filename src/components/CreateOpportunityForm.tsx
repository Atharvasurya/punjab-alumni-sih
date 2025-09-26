'use client'

import { useState } from 'react'
import { Briefcase, Building, MapPin, Calendar, FileText, Save, X, DollarSign } from 'lucide-react'

interface CreateOpportunityFormProps {
  onSubmit: (opportunityData: any) => void
  onCancel: () => void
  loading?: boolean
}

export default function CreateOpportunityForm({ onSubmit, onCancel, loading = false }: CreateOpportunityFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'job',
    company: '',
    location: '',
    description: '',
    requirements: '',
    skills: '',
    salary: '',
    experience: '',
    deadline: '',
    applicationUrl: '',
    contactEmail: '',
    isRemote: false,
    isUrgent: false
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.company.trim()) newErrors.company = 'Company is required'
    if (!formData.location.trim() && !formData.isRemote) newErrors.location = 'Location is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.deadline) newErrors.deadline = 'Deadline is required'
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Contact email is required'
    if (!formData.contactEmail.includes('@')) newErrors.contactEmail = 'Valid email is required'

    // Check if deadline is in the future
    if (formData.deadline && new Date(formData.deadline) <= new Date()) {
      newErrors.deadline = 'Deadline must be in the future'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const opportunityData = {
      ...formData,
      skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
      requirements: formData.requirements.split('\n').filter(req => req.trim()),
      posted_by: 'current_user', // In real app, get from auth context
      created_at: new Date().toISOString(),
      applications: []
    }

    onSubmit(opportunityData)
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  // Generate deadline options (next 30, 60, 90 days)
  const getDeadlineOptions = () => {
    const options = []
    const today = new Date()
    
    for (let days of [30, 60, 90]) {
      const date = new Date(today)
      date.setDate(date.getDate() + days)
      options.push({
        value: date.toISOString().split('T')[0],
        label: `${days} days from now (${date.toLocaleDateString()})`
      })
    }
    
    return options
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Opportunity Details
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Senior Software Engineer"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="job">Full-time Job</option>
              <option value="internship">Internship</option>
              <option value="collaboration">Collaboration</option>
              <option value="freelance">Freelance</option>
              <option value="contract">Contract</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company *
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.company ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Google, Microsoft"
            />
            {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location {!formData.isRemote && '*'}
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              disabled={formData.isRemote}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              } ${formData.isRemote ? 'bg-gray-100' : ''}`}
              placeholder="e.g., Mumbai, Bangalore"
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
          </div>
        </div>

        {/* Checkboxes */}
        <div className="mt-4 flex items-center gap-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isRemote}
              onChange={(e) => handleInputChange('isRemote', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Remote Work</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isUrgent}
              onChange={(e) => handleInputChange('isUrgent', e.target.checked)}
              className="rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <span className="ml-2 text-sm text-gray-700">Urgent Hiring</span>
          </label>
        </div>
      </div>

      {/* Job Details */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Job Information
        </h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Requirements
            </label>
            <textarea
              value={formData.requirements}
              onChange={(e) => handleInputChange('requirements', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="List requirements, one per line..."
            />
            <p className="text-sm text-gray-500 mt-1">Enter each requirement on a new line</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Required Skills
              </label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => handleInputChange('skills', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="React, Node.js, Python, etc."
              />
              <p className="text-sm text-gray-500 mt-1">Separate skills with commas</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience Level
              </label>
              <select
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select Experience</option>
                <option value="fresher">Fresher (0-1 years)</option>
                <option value="junior">Junior (1-3 years)</option>
                <option value="mid">Mid-level (3-5 years)</option>
                <option value="senior">Senior (5+ years)</option>
                <option value="lead">Lead/Manager (7+ years)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Application Details */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Application Details
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Application Deadline *
            </label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => handleInputChange('deadline', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.deadline ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.deadline && <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>}
            
            {/* Quick deadline options */}
            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-1">Quick options:</p>
              <div className="flex gap-2">
                {getDeadlineOptions().map((option, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleInputChange('deadline', option.value)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors duration-200"
                  >
                    {option.label.split(' ')[0]} days
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Email *
            </label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => handleInputChange('contactEmail', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.contactEmail ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="hr@company.com"
            />
            {errors.contactEmail && <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Salary Range
            </label>
            <input
              type="text"
              value={formData.salary}
              onChange={(e) => handleInputChange('salary', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., ₹8-12 LPA or $80k-100k"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Application URL
            </label>
            <input
              type="url"
              value={formData.applicationUrl}
              onChange={(e) => handleInputChange('applicationUrl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="https://company.com/careers/apply"
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white rounded-md transition-colors duration-200 flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {loading ? 'Creating...' : 'Create Opportunity'}
        </button>
      </div>
    </form>
  )
}
