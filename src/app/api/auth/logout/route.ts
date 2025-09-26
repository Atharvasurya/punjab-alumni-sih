import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ ok: true, message: 'Logged out successfully' });
  clearAuthCookie(response);
  return response;
}
