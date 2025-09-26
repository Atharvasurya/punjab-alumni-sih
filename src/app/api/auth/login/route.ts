import { NextRequest, NextResponse } from 'next/server';
import { validateCredentials, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { ok: false, message: 'Username and password are required' },
        { status: 400 }
      );
    }

    const role = validateCredentials(username, password);
    
    if (role) {
      const response = NextResponse.json({ ok: true, role });
      setAuthCookie(response, role);
      return response;
    } else {
      return NextResponse.json(
        { ok: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { ok: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
