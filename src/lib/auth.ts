import { NextRequest, NextResponse } from 'next/server';

// Hardcoded accounts for prototype
const PROTOTYPE_ACCOUNTS = {
  'alumni': 'alumni@123',
  'students': 'students@123',
  'admin': 'admin@123',
  'collage': 'collage@123'
} as const;

export type UserRole = keyof typeof PROTOTYPE_ACCOUNTS;

export function validateCredentials(username: string, password: string): UserRole | null {
  if (PROTOTYPE_ACCOUNTS[username as UserRole] === password) {
    return username as UserRole;
  }
  return null;
}

export function setAuthCookie(response: NextResponse, role: UserRole): void {
  response.cookies.set('auth-role', role, {
    httpOnly: false, // Allow client-side access for dashboard redirects
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });
}

export function getAuthFromRequest(request: NextRequest): UserRole | null {
  const authCookie = request.cookies.get('auth-role');
  if (authCookie && Object.keys(PROTOTYPE_ACCOUNTS).includes(authCookie.value)) {
    return authCookie.value as UserRole;
  }
  return null;
}

export function clearAuthCookie(response: NextResponse): void {
  response.cookies.delete('auth-role');
}

export function requireAuth(request: NextRequest, allowedRoles?: UserRole[]): UserRole | null {
  const role = getAuthFromRequest(request);
  if (!role) return null;
  
  if (allowedRoles && !allowedRoles.includes(role)) {
    return null;
  }
  
  return role;
}
