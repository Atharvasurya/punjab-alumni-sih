'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import { 
  Building2, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Award, 
  Calendar, 
  Megaphone, 
  BarChart3,
  PieChart,
  Target,
  Heart,
  Briefcase,
  GraduationCap,
  Plus,
  Download,
  Eye
} from 'lucide-react'

interface Analytics {
  totalAlumni: number
  totalStudents: number
  totalDonations: number
  activeMentors: number
  totalOpportunities: number
  totalEvents: number
}

interface Campaign {
  id: string
  title: string
  target: number
  raised: number
  donors: number
  endDate: string
  status: 'active' | 'completed' | 'draft'
}

export default function CollegeDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  // Mock campaign data for demo
  const [campaigns] = useState<Campaign[]>([
    {
      id: 'camp_001',
      title: 'Scholarship Fund 2025',
      target: 500000,
      raised: 375000,
      donors: 125,
      endDate: '2025-12-31',
      status: 'active'
    },
    {
      id: 'camp_002',
      title: 'New Computer Lab',
      target: 200000,
      raised: 150000,
      donors: 89,
      endDate: '2025-11-30',
      status: 'active'
    },
    {
      id: 'camp_003',
      title: 'Library Renovation',
      target: 300000,
      raised: 300000,
      donors: 67,
      endDate: '2025-09-30',
      status: 'completed'
    },
    {
      id: 'camp_004',
      title: 'Sports Complex Upgrade',
      target: 750000,
      raised: 425000,
      donors: 156,
      endDate: '2026-03-31',
      status: 'active'
    }
  ])

  useEffect(() => {
    // Initialize college dashboard with mock data
    const initializeDashboard = () => {
      try {
        const mockAnalytics: Analytics = {
          totalAlumni: 156,
          totalStudents: 89,
          totalDonations: 250000,
          activeMentors: 45,
          totalOpportunities: 12,
          totalEvents: 8
        }
        
        setAnalytics(mockAnalytics)
        setLoading(false)
      } catch (error) {
        console.error('Error initializing college dashboard:', error)
        setLoading(false)
      }
    }

    // Small delay to simulate loading
    const timer = setTimeout(initializeDashboard, 300)
    return () => clearTimeout(timer)
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
    } finally {
      setLoading(false)
    }
  }

  const getProgressPercentage = (raised: number, target: number) => {
    return Math.min((raised / target) * 100, 100)
  }

  // Filter campaigns
  const activeCampaigns = campaigns.filter((c: any) => c.status === 'active')
  const completedCampaigns = campaigns.filter((c: any) => c.status === 'completed')

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'campaigns', label: 'Campaigns', icon: Target },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar userRole="collage" />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading College Dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar userRole="collage" />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Dashboard Unavailable</h3>
            <p className="text-gray-600">Unable to load college dashboard data.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole="collage" userName="ABC College" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-purple-500 rounded-full flex items-center justify-center">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ABC College of Engineering</h1>
                <p className="text-gray-600">Institution Management Dashboard</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    <Building2 className="h-3 w-3 mr-1" />
                    College Administration
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Award className="h-3 w-3 mr-1" />
                    Established 1995
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-200">
                <Download className="h-4 w-4" />
                Export Report
              </button>
              <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-200">
                <Plus className="h-4 w-4" />
                New Campaign
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Alumni</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.totalAlumni}</p>
                  <p className="text-xs text-green-600">+12% from last year</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Current Students</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.totalStudents}</p>
                  <p className="text-xs text-green-600">+8% from last year</p>
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
                  <p className="text-xs text-green-600">+25% from last year</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Heart className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Mentors</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.activeMentors}</p>
                  <p className="text-xs text-green-600">+15% from last year</p>
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
                        ? 'border-purple-500 text-purple-600'
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Quick Stats */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Institution Overview</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Briefcase className="h-5 w-5 text-blue-600" />
                          <span className="text-gray-700">Job Opportunities</span>
                        </div>
                        <span className="font-semibold text-gray-900">{analytics.totalOpportunities}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-green-600" />
                          <span className="text-gray-700">Upcoming Events</span>
                        </div>
                        <span className="font-semibold text-gray-900">{analytics.totalEvents}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Users className="h-5 w-5 text-purple-600" />
                          <span className="text-gray-700">Mentorship Pairs</span>
                        </div>
                        <span className="font-semibold text-gray-900">{analytics.activeMentors}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Target className="h-5 w-5 text-orange-600" />
                          <span className="text-gray-700">Active Campaigns</span>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {campaigns.filter(c => c.status === 'active').length}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm text-gray-900">New alumni registration completed</p>
                          <p className="text-xs text-gray-500">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm text-gray-900">Scholarship campaign reached 75% target</p>
                          <p className="text-xs text-gray-500">5 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-2 w-2 bg-purple-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm text-gray-900">Alumni meetup event created</p>
                          <p className="text-xs text-gray-500">1 day ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-2 w-2 bg-orange-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm text-gray-900">Monthly donation report generated</p>
                          <p className="text-xs text-gray-500">2 days ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active Campaigns Preview */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Active Fundraising Campaigns</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {campaigns.filter(c => c.status === 'active').slice(0, 2).map((campaign) => (
                      <div key={campaign.id} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">{campaign.title}</h4>
                        <div className="mb-3">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>₹{campaign.raised.toLocaleString()} raised</span>
                            <span>₹{campaign.target.toLocaleString()} goal</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${getProgressPercentage(campaign.raised, campaign.target)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">{campaign.donors} donors</span>
                          <span className="text-gray-600">
                            Ends {new Date(campaign.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && analytics && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Detailed Analytics</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-4">Alumni Distribution by Year</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">2019-2021</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-purple-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                          </div>
                          <span className="text-sm font-medium">60%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">2016-2018</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-purple-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                          </div>
                          <span className="text-sm font-medium">30%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">2013-2015</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-purple-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                          </div>
                          <span className="text-sm font-medium">10%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-4">Donation Trends</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">This Month</span>
                        <span className="font-medium">₹45,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Month</span>
                        <span className="font-medium">₹38,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Average Monthly</span>
                        <span className="font-medium">₹42,000</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-gray-900 font-medium">Total This Year</span>
                        <span className="font-bold text-purple-600">₹{analytics.totalDonations.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white border border-gray-200 p-6 rounded-lg text-center">
                    <PieChart className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <h4 className="font-medium text-gray-900">Placement Rate</h4>
                    <p className="text-2xl font-bold text-blue-600 mt-2">87%</p>
                    <p className="text-sm text-gray-600">Class of 2024</p>
                  </div>
                  
                  <div className="bg-white border border-gray-200 p-6 rounded-lg text-center">
                    <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <h4 className="font-medium text-gray-900">Alumni Engagement</h4>
                    <p className="text-2xl font-bold text-green-600 mt-2">73%</p>
                    <p className="text-sm text-gray-600">Active participation</p>
                  </div>
                  
                  <div className="bg-white border border-gray-200 p-6 rounded-lg text-center">
                    <Award className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                    <h4 className="font-medium text-gray-900">Success Rate</h4>
                    <p className="text-2xl font-bold text-orange-600 mt-2">92%</p>
                    <p className="text-sm text-gray-600">Graduate satisfaction</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'campaigns' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Fundraising Campaigns</h3>
                  <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-200">
                    <Plus className="h-4 w-4" />
                    Create Campaign
                  </button>
                </div>

                <div className="space-y-4">
                  {activeCampaigns.map((campaign: any) => (
                    <div key={campaign.id} className="bg-gray-50 p-6 rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{campaign.title}</h4>
                          <div className="flex items-center gap-4 mt-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              campaign.status === 'active' 
                                ? 'bg-green-100 text-green-800'
                                : campaign.status === 'completed'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {campaign.status}
                            </span>
                            <span className="text-sm text-gray-600">
                              {campaign.donors} donors
                            </span>
                            <span className="text-sm text-gray-600">
                              Ends {new Date(campaign.endDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>₹{campaign.raised.toLocaleString()} raised</span>
                          <span>₹{campaign.target.toLocaleString()} goal</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-purple-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${getProgressPercentage(campaign.raised, campaign.target)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mt-1">
                          <span>{getProgressPercentage(campaign.raised, campaign.target).toFixed(1)}% complete</span>
                          <span>₹{(campaign.target - campaign.raised).toLocaleString()} remaining</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'announcements' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Official Announcements</h3>
                  <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-200">
                    <Plus className="h-4 w-4" />
                    New Announcement
                  </button>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Megaphone className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-900">Create Your First Announcement</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Share important updates, events, and news with your alumni and student community.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">Announcement Templates</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                      <h5 className="font-medium text-gray-900">Event Announcement</h5>
                      <p className="text-sm text-gray-600 mt-1">Announce upcoming alumni events and gatherings</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                      <h5 className="font-medium text-gray-900">Fundraising Campaign</h5>
                      <p className="text-sm text-gray-600 mt-1">Launch new fundraising initiatives</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                      <h5 className="font-medium text-gray-900">Achievement Recognition</h5>
                      <p className="text-sm text-gray-600 mt-1">Celebrate alumni and student achievements</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                      <h5 className="font-medium text-gray-900">General Update</h5>
                      <p className="text-sm text-gray-600 mt-1">Share general college news and updates</p>
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
