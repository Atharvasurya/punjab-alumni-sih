import Link from 'next/link'
import { GraduationCap, Users, BookOpen, Building2 } from 'lucide-react'
import PunjabLogo from '@/components/PunjabLogo'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-6">
            <PunjabLogo size="xl" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Government Of Punjab
          </h1>
          <h2 className="text-3xl font-semibold text-orange-600 mb-4">
            Alumni Centralized System
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Users className="h-8 w-8 text-primary-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Alumni Network</h3>
            <p className="text-sm text-gray-600">Connect with fellow graduates and share experiences</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <BookOpen className="h-8 w-8 text-primary-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Opportunities</h3>
            <p className="text-sm text-gray-600">Discover jobs, internships, and collaborations</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <GraduationCap className="h-8 w-8 text-primary-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Mentorship</h3>
            <p className="text-sm text-gray-600">Guide current students and share knowledge</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Building2 className="h-8 w-8 text-primary-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Events</h3>
            <p className="text-sm text-gray-600">Join alumni meetups and networking events</p>
          </div>
        </div>

        {/* Demo Accounts */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Demo Access
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-primary-600 mb-2">Alumni</h3>
              <p className="text-sm text-gray-600 mb-2">Username: <code className="bg-gray-100 px-1 rounded">alumni</code></p>
              <p className="text-sm text-gray-600">Password: <code className="bg-gray-100 px-1 rounded">alumni@123</code></p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-600 mb-2">Students</h3>
              <p className="text-sm text-gray-600 mb-2">Username: <code className="bg-gray-100 px-1 rounded">students</code></p>
              <p className="text-sm text-gray-600">Password: <code className="bg-gray-100 px-1 rounded">students@123</code></p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-orange-600 mb-2">Admin</h3>
              <p className="text-sm text-gray-600 mb-2">Username: <code className="bg-gray-100 px-1 rounded">admin</code></p>
              <p className="text-sm text-gray-600">Password: <code className="bg-gray-100 px-1 rounded">admin@123</code></p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-600 mb-2">College</h3>
              <p className="text-sm text-gray-600 mb-2">Username: <code className="bg-gray-100 px-1 rounded">collage</code></p>
              <p className="text-sm text-gray-600">Password: <code className="bg-gray-100 px-1 rounded">collage@123</code></p>
            </div>
          </div>
        </div>

        {/* Login Button */}
        <div className="text-center">
          <Link 
            href="/login"
            className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 inline-flex items-center gap-2"
          >
            <Users className="h-5 w-5" />
            Access Platform
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>© 2025 Government Of Punjab - Alumni Centralized System</p>
          <p className="mt-1">Department of Higher Education, Punjab</p>
        </div>
      </div>
    </div>
  )
}
