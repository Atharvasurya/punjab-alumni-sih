'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Modal from '@/components/Modal'
import CreateEventForm from '@/components/CreateEventForm'
import EditEventForm from '@/components/EditEventForm'
import { Calendar, Search, Filter, Plus, MapPin, Clock, Users, Edit, Trash2 } from 'lucide-react'

interface Event {
  id: string
  title: string
  type: string
  date: string
  location: string
  organizer: string
  attendees: string[]
  description?: string
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [userRole, setUserRole] = useState<'admin' | 'collage'>('admin')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
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

    fetchEvents()
  }, [router])

  const fetchEvents = async () => {
    try {
      // Mock data for demo
      const mockEvents: Event[] = [
        {
          id: 'ev_001',
          title: 'Alumni Meetup 2025',
          type: 'meetup',
          date: '2025-10-15T18:00:00Z',
          location: 'Mumbai, India',
          organizer: 'al_0001',
          attendees: ['al_0002', 'st_0001'],
          description: 'Annual alumni meetup for networking and reconnection'
        },
        {
          id: 'ev_002',
          title: 'Tech Talk: AI in Industry',
          type: 'workshop',
          date: '2025-11-20T14:00:00Z',
          location: 'Virtual',
          organizer: 'al_0002',
          attendees: ['st_0001', 'st_0002'],
          description: 'Technical workshop on AI applications in industry'
        },
        {
          id: 'ev_003',
          title: 'Career Guidance Session',
          type: 'seminar',
          date: '2025-12-05T16:00:00Z',
          location: 'College Campus',
          organizer: 'collage',
          attendees: ['st_0001'],
          description: 'Career guidance and mentorship session for students'
        }
      ]
      setEvents(mockEvents)
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateEvent = async (eventData: any) => {
    setCreateLoading(true)
    try {
      // Generate unique ID
      const newId = `ev_${Date.now().toString().slice(-4)}`
      
      const newEvent = {
        ...eventData,
        id: newId,
        date: eventData.datetime,
        created_at: new Date().toISOString(),
        attendees: []
      }

      // For demo, add to local state (in real app, would call API)
      setEvents(prev => [...prev, newEvent])
      setShowCreateModal(false)
      alert('Event created successfully!')
      
    } catch (error) {
      console.error('Error creating event:', error)
      alert('Failed to create event. Please try again.')
    } finally {
      setCreateLoading(false)
    }
  }

  const handleEditEvent = async (eventData: any) => {
    setEditLoading(true)
    try {
      // For demo, update in local state (in real app, would call API)
      setEvents(prev => prev.map(event => 
        event.id === eventData.id ? eventData : event
      ))
      setShowEditModal(false)
      setSelectedEvent(null)
      alert('Event updated successfully!')
      
    } catch (error) {
      console.error('Error updating event:', error)
      alert('Failed to update event. Please try again.')
    } finally {
      setEditLoading(false)
    }
  }

  const handleEditClick = (event: any) => {
    setSelectedEvent(event)
    setShowEditModal(true)
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    try {
      // For demo, remove from local state (in real app, would call API)
      setEvents(prev => prev.filter(event => event.id !== eventId))
      alert('Event deleted successfully!')
      
    } catch (error) {
      console.error('Error deleting event:', error)
      alert('Failed to delete event. Please try again.')
    }
  }

  const filteredEvents = events.filter((event: any) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === 'all' || event.type === selectedType
    return matchesSearch && matchesType
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'meetup': return 'bg-blue-100 text-blue-800'
      case 'workshop': return 'bg-green-100 text-green-800'
      case 'seminar': return 'bg-purple-100 text-purple-800'
      case 'conference': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const isUpcoming = (date: string) => {
    return new Date(date) > new Date()
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
              <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
              <p className="text-gray-600 mt-2">Manage alumni events, workshops, and meetups</p>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-200"
            >
              <Plus className="h-4 w-4" />
              Create Event
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{events.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                <p className="text-2xl font-bold text-gray-900">
                  {events.filter(event => isUpcoming(event.date)).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Attendees</p>
                <p className="text-2xl font-bold text-gray-900">
                  {events.reduce((sum, event) => sum + event.attendees.length, 0)}
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
                  {new Set(events.map(event => event.location)).size}
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
                  placeholder="Search events..."
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
                <option value="meetup">Meetups</option>
                <option value="workshop">Workshops</option>
                <option value="seminar">Seminars</option>
                <option value="conference">Conferences</option>
              </select>
              
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200">
                <Filter className="h-4 w-4" />
                More Filters
              </button>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredEvents.length} of {events.length} events
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {filteredEvents.map((event: any) => (
            <div key={event.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(event.type)}`}>
                      {event.type}
                    </span>
                    {isUpcoming(event.date) && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Upcoming
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {event.attendees.length} attendees
                    </span>
                  </div>
                  
                  {event.description && (
                    <p className="text-gray-700 mb-4">{event.description}</p>
                  )}
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <button 
                    onClick={() => handleEditClick(event)}
                    className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-1 rounded text-sm transition-colors duration-200 flex items-center gap-1"
                    title="Edit Event"
                  >
                    <Edit className="h-3 w-3" />
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteEvent(event.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors duration-200 flex items-center gap-1"
                    title="Delete Event"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm transition-colors duration-200">
                    View Attendees ({event.attendees.length})
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or create a new event.</p>
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Event"
        size="xl"
      >
        <CreateEventForm
          onSubmit={handleCreateEvent}
          onCancel={() => setShowCreateModal(false)}
          loading={createLoading}
        />
      </Modal>

      {/* Edit Event Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedEvent(null)
        }}
        title="Edit Event"
        size="xl"
      >
        {selectedEvent && (
          <EditEventForm
            event={selectedEvent}
            onSubmit={handleEditEvent}
            onCancel={() => {
              setShowEditModal(false)
              setSelectedEvent(null)
            }}
            loading={editLoading}
          />
        )}
      </Modal>
    </div>
  )
}
