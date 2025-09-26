'use client'

import { useState, useEffect } from 'react'
import { Calendar, MapPin, Clock, Users, FileText, Save, X } from 'lucide-react'

interface EditEventFormProps {
  event: any
  onSubmit: (eventData: any) => void
  onCancel: () => void
  loading?: boolean
}

export default function EditEventForm({ event, onSubmit, onCancel, loading = false }: EditEventFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'meetup',
    date: '',
    time: '',
    location: '',
    description: '',
    agenda: '',
    maxAttendees: '',
    registrationDeadline: '',
    contactEmail: '',
    eventUrl: '',
    isVirtual: false,
    requiresRegistration: true,
    isFree: true,
    ticketPrice: '',
    organizer: 'current_user'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Populate form with existing event data
  useEffect(() => {
    if (event) {
      // Parse date and time from event.date
      const eventDate = new Date(event.date)
      const dateStr = eventDate.toISOString().split('T')[0]
      const timeStr = eventDate.toTimeString().slice(0, 5)

      setFormData({
        title: event.title || '',
        type: event.type || 'meetup',
        date: dateStr,
        time: timeStr,
        location: event.location || '',
        description: event.description || '',
        agenda: Array.isArray(event.agenda) 
          ? event.agenda.join('\n') 
          : (event.agenda || ''),
        maxAttendees: event.maxAttendees ? event.maxAttendees.toString() : '',
        registrationDeadline: event.registrationDeadline 
          ? event.registrationDeadline.split('T')[0] 
          : '',
        contactEmail: event.contactEmail || '',
        eventUrl: event.eventUrl || '',
        isVirtual: event.isVirtual || false,
        requiresRegistration: event.requiresRegistration !== undefined ? event.requiresRegistration : true,
        isFree: event.isFree !== undefined ? event.isFree : true,
        ticketPrice: event.ticketPrice || '',
        organizer: event.organizer || 'current_user'
      })
    }
  }, [event])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.date) newErrors.date = 'Date is required'
    if (!formData.time) newErrors.time = 'Time is required'
    if (!formData.location.trim() && !formData.isVirtual) newErrors.location = 'Location is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Contact email is required'
    if (!formData.contactEmail.includes('@')) newErrors.contactEmail = 'Valid email is required'

    // Check if event date is in the future
    const eventDateTime = new Date(`${formData.date}T${formData.time}`)
    if (eventDateTime <= new Date()) {
      newErrors.date = 'Event must be scheduled for the future'
    }

    // Check registration deadline
    if (formData.registrationDeadline) {
      const regDeadline = new Date(formData.registrationDeadline)
      if (regDeadline >= eventDateTime) {
        newErrors.registrationDeadline = 'Registration deadline must be before event date'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const eventData = {
      ...event, // Keep existing data
      ...formData,
      agenda: formData.agenda.split('\n').filter(item => item.trim()),
      date: `${formData.date}T${formData.time}`,
      datetime: `${formData.date}T${formData.time}`,
      updated_at: new Date().toISOString()
    }

    onSubmit(eventData)
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

  // Generate time options
  const getTimeOptions = () => {
    const times = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        const displayTime = new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        })
        times.push({ value: timeString, label: displayTime })
      }
    }
    return times
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Event Details
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Alumni Networking Event 2025"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="meetup">Meetup</option>
              <option value="workshop">Workshop</option>
              <option value="seminar">Seminar</option>
              <option value="conference">Conference</option>
              <option value="networking">Networking</option>
              <option value="webinar">Webinar</option>
              <option value="social">Social Event</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Date *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Time *
            </label>
            <select
              value={formData.time}
              onChange={(e) => handleInputChange('time', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.time ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Time</option>
              {getTimeOptions().map((time) => (
                <option key={time.value} value={time.value}>
                  {time.label}
                </option>
              ))}
            </select>
            {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
          </div>
        </div>

        {/* Location */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location {!formData.isVirtual && '*'}
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            disabled={formData.isVirtual}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.location ? 'border-red-500' : 'border-gray-300'
            } ${formData.isVirtual ? 'bg-gray-100' : ''}`}
            placeholder="e.g., College Auditorium, Mumbai"
          />
          {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
        </div>

        {/* Checkboxes */}
        <div className="mt-4 flex items-center gap-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isVirtual}
              onChange={(e) => handleInputChange('isVirtual', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Virtual Event</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.requiresRegistration}
              onChange={(e) => handleInputChange('requiresRegistration', e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Requires Registration</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isFree}
              onChange={(e) => handleInputChange('isFree', e.target.checked)}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="ml-2 text-sm text-gray-700">Free Event</span>
          </label>
        </div>
      </div>

      {/* Event Information */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Event Information
        </h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe the event, its purpose, and what attendees can expect..."
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Agenda
            </label>
            <textarea
              value={formData.agenda}
              onChange={(e) => handleInputChange('agenda', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="List agenda items, one per line..."
            />
            <p className="text-sm text-gray-500 mt-1">Enter each agenda item on a new line</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Attendees
              </label>
              <input
                type="number"
                value={formData.maxAttendees}
                onChange={(e) => handleInputChange('maxAttendees', e.target.value)}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., 100"
              />
            </div>

            {!formData.isFree && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ticket Price
                </label>
                <input
                  type="text"
                  value={formData.ticketPrice}
                  onChange={(e) => handleInputChange('ticketPrice', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., ₹500 or $50"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Registration Details */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
          <Users className="h-5 w-5" />
          Registration Details
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.requiresRegistration && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Registration Deadline
              </label>
              <input
                type="date"
                value={formData.registrationDeadline}
                onChange={(e) => handleInputChange('registrationDeadline', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                max={formData.date}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.registrationDeadline ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.registrationDeadline && <p className="text-red-500 text-sm mt-1">{errors.registrationDeadline}</p>}
            </div>
          )}

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
              placeholder="events@college.edu"
            />
            {errors.contactEmail && <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event URL
            </label>
            <input
              type="url"
              value={formData.eventUrl}
              onChange={(e) => handleInputChange('eventUrl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="https://college.edu/events/alumni-meetup"
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
          {loading ? 'Updating...' : 'Update Event'}
        </button>
      </div>
    </form>
  )
}
