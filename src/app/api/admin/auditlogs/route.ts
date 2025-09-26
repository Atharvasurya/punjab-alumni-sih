import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

const db = Database.getInstance();

export async function GET(request: NextRequest) {
  const role = requireAuth(request, ['admin', 'collage']);
  if (!role) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const auditLogs = db.getAllAuditLogs();
    return NextResponse.json(auditLogs);
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
