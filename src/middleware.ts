import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public paths that don't require authentication
  const publicPaths = ['/', '/login', '/alumni']
  
  if (publicPaths.includes(pathname) || pathname.startsWith('/_next') || pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // Allow access to /dashboard (root) for redirect logic
  if (pathname === '/dashboard') {
    return NextResponse.next()
  }

  // Check for auth cookie
  const authCookie = request.cookies.get('auth-role')
  
  if (!authCookie) {
    // Redirect to login if not authenticated
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const role = authCookie.value

  // Role-based access control
  if (pathname.startsWith('/dashboard/')) {
    const requiredRole = pathname.split('/')[2]
    
    if (role !== requiredRole) {
      // Only redirect if it's not the user's own dashboard
      if (requiredRole && requiredRole !== role) {
        return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url))
      }
    }
  }

  // Admin and college roles can access admin paths
  if (pathname.startsWith('/admin/')) {
    if (role !== 'admin' && role !== 'collage') {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url))
    }
  }

  // Alumni directory is accessible to all authenticated users
  if (pathname.startsWith('/alumni')) {
    // Allow access for all authenticated users
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
