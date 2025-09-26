'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  GraduationCap, 
  Bell, 
  MessageSquare, 
  User, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react'
import PunjabLogo from './PunjabLogo'

interface NavbarProps {
  userRole: 'alumni' | 'students' | 'admin' | 'collage'
  userName?: string
}

export default function Navbar({ userRole, userName }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'alumni': return 'text-primary-600'
      case 'students': return 'text-green-600'
      case 'admin': return 'text-orange-600'
      case 'collage': return 'text-purple-600'
      default: return 'text-gray-600'
    }
  }

  const getRoleName = (role: string) => {
    switch (role) {
      case 'alumni': return 'Alumni'
      case 'students': return 'Student'
      case 'admin': return 'Administrator'
      case 'collage': return 'College'
      default: return 'User'
    }
  }

  const getNavLinks = () => {
    const baseLinks = [
      { href: `/dashboard/${userRole}`, label: 'Dashboard' },
    ]

    switch (userRole) {
      case 'alumni':
        return [
          ...baseLinks,
          { href: '/alumni', label: 'Alumni Directory' },
          { href: '/opportunities', label: 'Opportunities' },
          { href: '/events', label: 'Events' },
          { href: '/messages', label: 'Messages' },
        ]
      case 'students':
        return [
          ...baseLinks,
          { href: '/alumni', label: 'Alumni Directory' },
          { href: '/opportunities', label: 'Opportunities' },
          { href: '/events', label: 'Events' },
          { href: '/messages', label: 'Messages' },
        ]
      case 'admin':
        return [
          ...baseLinks,
          { href: '/admin/users', label: 'Manage Users' },
          { href: '/admin/opportunities', label: 'Opportunities' },
          { href: '/admin/events', label: 'Events' },
          { href: '/admin/audit', label: 'Audit Logs' },
        ]
      case 'collage':
        return [
          ...baseLinks,
          { href: '/admin/users', label: 'Manage Users' },
          { href: '/admin/opportunities', label: 'Opportunities' },
          { href: '/admin/events', label: 'Events' },
          { href: '/admin/audit', label: 'Audit Logs' },
        ]
      default:
        return baseLinks
    }
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href={`/dashboard/${userRole}`} className="flex items-center gap-3">
              <PunjabLogo size="md" />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-orange-600">Punjab Govt</span>
                <span className="text-sm font-medium text-gray-700">Alumni System</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {getNavLinks().map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 relative">
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
            </button>

            {/* Messages */}
            <Link 
              href="/messages"
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 relative"
            >
              <MessageSquare className="h-6 w-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-green-400"></span>
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <User className="h-6 w-6" />
                <span className="hidden sm:block text-sm">
                  <span className={`font-medium ${getRoleColor(userRole)}`}>
                    {getRoleName(userRole)}
                  </span>
                </span>
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {userName || getRoleName(userRole)}
                    </p>
                    <p className={`text-xs ${getRoleColor(userRole)}`}>
                      {getRoleName(userRole)}
                    </p>
                  </div>
                  <Link
                    href={`/profile/${userRole}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <User className="h-4 w-4 inline mr-2" />
                    Profile Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    <LogOut className="h-4 w-4 inline mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {getNavLinks().map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
