'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import { MessageSquare, Search, Send, User, Clock } from 'lucide-react'

interface Message {
  id: string
  from: string
  to: string
  content: string
  timestamp: string
  read: boolean
}

interface Conversation {
  userId: string
  userName: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<'alumni' | 'students' | 'admin' | 'collage'>('students')

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

    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    try {
      // Mock data for demo
      const mockConversations: Conversation[] = [
        {
          userId: 'al_0001',
          userName: 'Anita Joshi',
          lastMessage: 'Thanks for connecting! Looking forward to mentoring you.',
          lastMessageTime: '2025-09-22T10:30:00Z',
          unreadCount: 1
        },
        {
          userId: 'al_0002',
          userName: 'Rohit Sharma',
          lastMessage: 'The internship opportunity at TechCorp is still open.',
          lastMessageTime: '2025-09-21T15:45:00Z',
          unreadCount: 0
        },
        {
          userId: 'admin',
          userName: 'Admin',
          lastMessage: 'Your profile has been updated successfully.',
          lastMessageTime: '2025-09-20T09:15:00Z',
          unreadCount: 0
        }
      ]
      setConversations(mockConversations)
      
      // Select first conversation by default
      if (mockConversations.length > 0) {
        setSelectedConversation(mockConversations[0].userId)
        fetchMessages(mockConversations[0].userId)
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (userId: string) => {
    try {
      // Mock messages for demo
      const mockMessages: Message[] = [
        {
          id: 'msg_001',
          from: 'al_0001',
          to: 'students',
          content: 'Hi! I saw your profile and would love to mentor you in your career journey.',
          timestamp: '2025-09-22T10:00:00Z',
          read: true
        },
        {
          id: 'msg_002',
          from: 'students',
          to: 'al_0001',
          content: 'Thank you so much! I would really appreciate your guidance.',
          timestamp: '2025-09-22T10:15:00Z',
          read: true
        },
        {
          id: 'msg_003',
          from: 'al_0001',
          to: 'students',
          content: 'Thanks for connecting! Looking forward to mentoring you.',
          timestamp: '2025-09-22T10:30:00Z',
          read: false
        }
      ]
      setMessages(mockMessages)
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    try {
      const message: Message = {
        id: `msg_${Date.now()}`,
        from: userRole,
        to: selectedConversation,
        content: newMessage,
        timestamp: new Date().toISOString(),
        read: false
      }

      setMessages([...messages, message])
      setNewMessage('')
      
      // Update conversation
      setConversations(conversations.map(conv => 
        conv.userId === selectedConversation 
          ? { ...conv, lastMessage: newMessage, lastMessageTime: message.timestamp }
          : conv
      ))
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const selectConversation = (userId: string) => {
    setSelectedConversation(userId)
    fetchMessages(userId)
    
    // Mark as read
    setConversations(conversations.map(conv => 
      conv.userId === userId ? { ...conv, unreadCount: 0 } : conv
    ))
  }

  const selectedConversationData = conversations.find(conv => conv.userId === selectedConversation)

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
            <MessageSquare className="h-8 w-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Connect and communicate with alumni, students, and administrators.
          </p>
        </div>

        {/* Messages Interface */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{ height: '600px' }}>
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="overflow-y-auto" style={{ height: 'calc(100% - 80px)' }}>
                {conversations.map((conversation) => (
                  <div
                    key={conversation.userId}
                    onClick={() => selectConversation(conversation.userId)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                      selectedConversation === conversation.userId ? 'bg-primary-50 border-primary-200' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-primary-500 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{conversation.userName}</h4>
                          <p className="text-xs text-gray-500">
                            {new Date(conversation.lastMessageTime).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <span className="bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedConversationData ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-primary-500 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{selectedConversationData.userName}</h3>
                        <p className="text-sm text-gray-500">
                          {selectedConversationData.userId.startsWith('al_') ? 'Alumni' : 
                           selectedConversationData.userId === 'admin' ? 'Administrator' : 'User'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.from === userRole ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.from === userRole
                              ? 'bg-primary-500 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3 opacity-70" />
                            <span className="text-xs opacity-70">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className="bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-md transition-colors duration-200"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
                    <p className="text-gray-600">Choose a conversation from the list to start messaging.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
